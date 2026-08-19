-- ─────────────────────────────────────────────────────────────
-- Admin features: payment methods, creator tracking, recurring
-- appointments, closed-day booking requests.
-- Run in the Supabase SQL Editor (after all previous migrations).
-- ─────────────────────────────────────────────────────────────

-- 1) Payment method — set when an appointment is paid.
alter table public.appointments
  add column if not exists payment_method text
  check (payment_method is null or payment_method in ('cash', 'card', 'other'));

comment on column public.appointments.payment_method is
  'How the appointment was paid: cash | card | other. Null when unpaid.';

-- 2) Who created / booked the appointment.
--    Admin inserts record the admin email; public bookings record ''online''.
alter table public.appointments
  add column if not exists created_by text;

comment on column public.appointments.created_by is
  'Email of the admin who created it, or ''online'' for public bookings.';

create or replace function public.set_appointment_created_by()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.created_by is null or length(trim(NEW.created_by)) = 0 then
    NEW.created_by := coalesce(
      nullif(lower(auth.jwt() ->> 'email'), ''),
      'online'
    );
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_set_appointment_created_by on public.appointments;
create trigger trg_set_appointment_created_by
  before insert on public.appointments
  for each row
  execute function public.set_appointment_created_by();

-- 3) Recurring appointments share a group id so the series is traceable.
alter table public.appointments
  add column if not exists recurrence_group uuid;

create index if not exists appointments_recurrence_group_idx
  on public.appointments (recurrence_group)
  where recurrence_group is not null;

-- 4) Protect payment_method like the other payment fields,
--    and clear it whenever an appointment is marked unpaid.
create or replace function public.protect_appointment_payments()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_id uuid := coalesce(NEW.therapist_id, OLD.therapist_id);
begin
  if NEW.price is distinct from OLD.price
    or NEW.discount is distinct from OLD.discount
    or NEW.is_paid is distinct from OLD.is_paid
    or NEW.payment_method is distinct from OLD.payment_method then
    if not public.can_edit_therapist_payments(target_id) then
      NEW.price := OLD.price;
      NEW.discount := OLD.discount;
      NEW.is_paid := OLD.is_paid;
      NEW.payment_method := OLD.payment_method;
    end if;
  end if;

  -- Unpaid appointments carry no payment method and cannot stay hidden
  if NEW.is_paid = false then
    NEW.payments_hidden := false;
    NEW.payment_method := null;
  elsif NEW.payments_hidden is distinct from OLD.payments_hidden then
    if not public.is_master_admin() then
      NEW.payments_hidden := OLD.payments_hidden;
    end if;
  end if;

  return NEW;
end;
$$;

-- 5) Closed-day booking requests (public site → master accounts only).
--    These never touch the appointments table until a master approves them.
create table if not exists public.booking_requests (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text,
  phone           text,
  concern         text,
  service         text,
  therapist_id    uuid references public.therapists(id),
  preferred_start timestamptz not null,
  preferred_end   timestamptz not null,
  status          text not null default 'pending', -- pending | approved | rejected
  created_at      timestamptz not null default now(),
  constraint valid_request_range check (preferred_end > preferred_start)
);

create index if not exists booking_requests_status_idx
  on public.booking_requests (status, preferred_start);

alter table public.booking_requests enable row level security;

drop policy if exists "Authenticated full access on booking_requests" on public.booking_requests;
create policy "Authenticated full access on booking_requests"
  on public.booking_requests for all
  to authenticated
  using (true) with check (true);

-- Anon visitors only insert through this validated RPC.
create or replace function public.request_closed_day_booking(
  p_name         text,
  p_email        text,
  p_phone        text,
  p_concern      text,
  p_start        timestamptz,
  p_end          timestamptz,
  p_therapist_id uuid default null,
  p_service      text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_name is null or length(trim(p_name)) < 2 then
    raise exception 'invalid_name';
  end if;
  if p_start is null or p_end is null or p_end <= p_start then
    raise exception 'invalid_range';
  end if;
  if p_start < now() then
    raise exception 'in_past';
  end if;
  if p_end - p_start > interval '2 hours' then
    raise exception 'too_long';
  end if;

  insert into public.booking_requests (
    name, email, phone, concern, service, therapist_id,
    preferred_start, preferred_end
  )
  values (
    trim(p_name),
    nullif(trim(coalesce(p_email, '')), ''),
    nullif(trim(coalesce(p_phone, '')), ''),
    nullif(trim(coalesce(p_concern, '')), ''),
    nullif(trim(coalesce(p_service, '')), ''),
    p_therapist_id,
    p_start,
    p_end
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.request_closed_day_booking(text, text, text, text, timestamptz, timestamptz, uuid, text) from public;
grant execute on function public.request_closed_day_booking(text, text, text, text, timestamptz, timestamptz, uuid, text) to anon, authenticated;
