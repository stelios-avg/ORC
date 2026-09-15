-- Pause online booking from the public website.
-- Flip public.public_booking_is_open() to true when the clinic wants it back.
-- Restore wrappers stay in place; only the helper needs to return true.

create or replace function public.public_booking_is_open()
returns boolean
language sql
stable
as $$
  select false;
$$;

do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'book_appointment'
      and pg_get_function_identity_arguments(p.oid)
        = 'p_name text, p_email text, p_phone text, p_concern text, p_start timestamp with time zone, p_end timestamp with time zone, p_therapist_id uuid, p_service text'
  ) and not exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = 'book_appointment_impl'
  ) then
    alter function public.book_appointment(text, text, text, text, timestamptz, timestamptz, uuid, text)
      rename to book_appointment_impl;
  end if;
end $$;

create or replace function public.book_appointment(
  p_name         text,
  p_email        text,
  p_phone        text,
  p_concern      text,
  p_start        timestamptz,
  p_end          timestamptz,
  p_therapist_id uuid,
  p_service      text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.public_booking_is_open() then
    raise exception 'booking_paused';
  end if;
  return public.book_appointment_impl(
    p_name, p_email, p_phone, p_concern, p_start, p_end, p_therapist_id, p_service
  );
end;
$$;

do $$
begin
  if exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'request_closed_day_booking'
      and not exists (
        select 1 from pg_proc p2
        join pg_namespace n2 on n2.oid = p2.pronamespace
        where n2.nspname = 'public' and p2.proname = 'request_closed_day_booking_impl'
      )
  ) then
    alter function public.request_closed_day_booking(text, text, text, text, timestamptz, timestamptz, uuid, text)
      rename to request_closed_day_booking_impl;
  end if;
end $$;

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
begin
  if not public.public_booking_is_open() then
    raise exception 'booking_paused';
  end if;
  return public.request_closed_day_booking_impl(
    p_name, p_email, p_phone, p_concern, p_start, p_end, p_therapist_id, p_service
  );
end;
$$;

revoke all on function public.book_appointment_impl(text, text, text, text, timestamptz, timestamptz, uuid, text) from public, anon, authenticated;
revoke all on function public.request_closed_day_booking_impl(text, text, text, text, timestamptz, timestamptz, uuid, text) from public, anon, authenticated;
revoke all on function public.book_appointment(text, text, text, text, timestamptz, timestamptz, uuid, text) from public;
revoke all on function public.request_closed_day_booking(text, text, text, text, timestamptz, timestamptz, uuid, text) from public;
grant execute on function public.book_appointment(text, text, text, text, timestamptz, timestamptz, uuid, text) to anon, authenticated;
grant execute on function public.request_closed_day_booking(text, text, text, text, timestamptz, timestamptz, uuid, text) to anon, authenticated;
