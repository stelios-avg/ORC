-- ─────────────────────────────────────────────────────────────
-- ORC public booking — RPC functions
-- Run this in the Supabase SQL Editor (after schema.sql).
--
-- Visitors (anon) never touch the tables directly; they only call
-- these two functions. RLS on the tables stays authenticated-only.
-- ─────────────────────────────────────────────────────────────

-- 1) Busy ranges for one day: exposes ONLY start/end times, never patient data.
create or replace function public.get_busy_slots(p_day date)
returns table (busy_start timestamptz, busy_end timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select a.start_time, a.end_time
  from public.appointments a
  where a.status <> 'cancelled'
    and a.start_time >= p_day::timestamptz
    and a.start_time <  (p_day + 1)::timestamptz;
$$;

-- 2) Book an appointment: validates the slot, finds-or-creates the patient,
--    inserts the appointment. Raises 'slot_taken' if the slot was grabbed.
create or replace function public.book_appointment(
  p_name    text,
  p_email   text,
  p_phone   text,
  p_concern text,
  p_start   timestamptz,
  p_end     timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_patient_id uuid;
  v_appt_id    uuid;
begin
  -- Basic validation
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

  -- Reject overlapping bookings (appointments and blocked time)
  if exists (
    select 1 from public.appointments a
    where a.status <> 'cancelled'
      and a.start_time < p_end
      and a.end_time   > p_start
  ) then
    raise exception 'slot_taken';
  end if;

  -- Reuse an existing patient by email, then phone; otherwise create.
  select id into v_patient_id
  from public.patients
  where (p_email is not null and lower(email) = lower(p_email))
     or (p_phone is not null and phone = p_phone)
  limit 1;

  if v_patient_id is null then
    insert into public.patients (name, email, phone)
    values (trim(p_name), nullif(trim(p_email), ''), nullif(trim(p_phone), ''))
    returning id into v_patient_id;
  end if;

  -- Keep the stated reason in the patient's notes for the therapist.
  if p_concern is not null and length(trim(p_concern)) > 0 then
    update public.patients
    set notes = coalesce(notes || E'\n\n', '')
      || '[' || to_char(p_start at time zone 'Asia/Nicosia', 'DD/MM/YYYY') || ' — online κράτηση] '
      || trim(p_concern)
    where id = v_patient_id;
  end if;

  insert into public.appointments (patient_id, service, start_time, end_time, status)
  values (v_patient_id, 'Online κράτηση', p_start, p_end, 'confirmed')
  returning id into v_appt_id;

  return v_appt_id;
end;
$$;

-- Lock the functions down: only callable, nothing else leaks.
revoke all on function public.get_busy_slots(date) from public;
revoke all on function public.book_appointment(text, text, text, text, timestamptz, timestamptz) from public;
grant execute on function public.get_busy_slots(date) to anon, authenticated;
grant execute on function public.book_appointment(text, text, text, text, timestamptz, timestamptz) to anon, authenticated;
