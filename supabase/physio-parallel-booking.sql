-- Physiotherapy online slots follow the calendar columns.
-- A visit or a "Κλειστό" takes only that physiotherapist.
-- The hour stays bookable while any other physiotherapist is free.
-- get_busy_slots now also returns therapist_id so the site can tell them apart.

drop function if exists public.get_busy_slots(date, uuid);

create function public.get_busy_slots(p_day date, p_therapist_id uuid)
returns table (busy_start timestamptz, busy_end timestamptz, is_block boolean, therapist_id uuid)
language sql
security definer
set search_path = public
stable
as $$
  select a.start_time, a.end_time, a.is_blocked_time, a.therapist_id
  from public.appointments a
  where a.status <> 'cancelled'
    and a.start_time >= p_day::timestamptz
    and a.start_time <  (p_day + 1)::timestamptz
    and (
      a.therapist_id = p_therapist_id
      or (
        exists (
          select 1 from public.therapists t
          where t.id = p_therapist_id and t.specialty = 'physiotherapy'
        )
        and a.therapist_id in (
          select t2.id from public.therapists t2 where t2.specialty = 'physiotherapy'
        )
      )
    );
$$;

revoke all on function public.get_busy_slots(date, uuid) from public;
grant execute on function public.get_busy_slots(date, uuid) to anon, authenticated;

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
declare
  v_patient_id uuid;
  v_appt_id    uuid;
  v_service    text;
  v_specialty  text;
  v_overlaps   int;
  v_preferred  uuid;
  v_assigned   uuid;
  v_day        date;
  v_day_start  timestamptz;
  v_day_end    timestamptz;
  v_open       timestamptz;
  v_close      timestamptz;
  v_prev_end   timestamptz;
  v_next_start timestamptz;
  v_busy       int;
begin
  if p_name is null or length(trim(p_name)) < 2 then
    raise exception 'invalid_name';
  end if;
  if p_therapist_id is null or not exists (
    select 1 from public.therapists t where t.id = p_therapist_id and t.active
  ) then
    raise exception 'invalid_therapist';
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

  v_preferred := p_therapist_id;

  select t.specialty into v_specialty
  from public.therapists t
  where t.id = v_preferred;

  if v_specialty = 'physiotherapy' then
    select t.id into v_assigned
    from public.therapists t
    where t.active
      and t.specialty = 'physiotherapy'
      and not exists (
        select 1
        from public.appointments a
        where a.status <> 'cancelled'
          and a.therapist_id = t.id
          and a.start_time < p_end
          and a.end_time   > p_start
      )
    order by
      case when t.id = v_preferred then 0 else 1 end,
      t.sort_order
    limit 1;

    if v_assigned is null then
      raise exception 'slot_taken';
    end if;
    p_therapist_id := v_assigned;
  else
    -- Osteopathy online is 08:00–18:00. Slots stay on a 45-minute
    -- step that meets the existing day, across the whole window.
    if p_end <> p_start + interval '45 minutes' then
      raise exception 'slot_taken';
    end if;

    select count(*)::int into v_overlaps
    from public.appointments a
    where a.status <> 'cancelled'
      and a.therapist_id = p_therapist_id
      and a.start_time < p_end
      and a.end_time   > p_start;

    if v_overlaps >= 1 then
      raise exception 'slot_taken';
    end if;

    v_day := (p_start at time zone 'Europe/Nicosia')::date;
    v_day_start := v_day::timestamp at time zone 'Europe/Nicosia';
    v_day_end := (v_day + 1)::timestamp at time zone 'Europe/Nicosia';
    v_open := v_day_start + interval '8 hours';
    v_close := v_day_start + interval '18 hours';

    if p_start < v_open or p_end > v_close then
      raise exception 'slot_taken';
    end if;

    select count(*)::int into v_busy
    from public.appointments a
    where a.status <> 'cancelled'
      and a.therapist_id = p_therapist_id
      and a.start_time < v_day_end
      and a.end_time > v_day_start;

    if v_busy = 0 then
      if mod(extract(epoch from (p_start - v_open))::bigint, 2700) <> 0 then
        raise exception 'slot_taken';
      end if;
    else
      if not exists (
        select 1
        from public.appointments a
        where a.status <> 'cancelled'
          and a.therapist_id = p_therapist_id
          and a.start_time < v_day_end
          and a.end_time > v_day_start
          and (
            mod(abs(extract(epoch from (p_start - a.start_time)))::bigint, 2700) = 0
            or mod(abs(extract(epoch from (p_start - a.end_time)))::bigint, 2700) = 0
          )
      ) then
        raise exception 'slot_taken';
      end if;

      select max(a.end_time) into v_prev_end
      from public.appointments a
      where a.status <> 'cancelled'
        and a.therapist_id = p_therapist_id
        and a.end_time <= p_start
        and a.end_time > v_day_start;

      select min(a.start_time) into v_next_start
      from public.appointments a
      where a.status <> 'cancelled'
        and a.therapist_id = p_therapist_id
        and a.start_time >= p_end
        and a.start_time < v_day_end;

      if v_prev_end is not null and v_next_start is not null
         and mod(extract(epoch from (v_next_start - v_prev_end))::bigint, 2700) <> 0 then
        raise exception 'slot_taken';
      end if;
    end if;
  end if;

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

  if p_concern is not null and length(trim(p_concern)) > 0 then
    update public.patients
    set notes = coalesce(notes || E'\n\n', '')
      || '[' || to_char(p_start at time zone 'Asia/Nicosia', 'DD/MM/YYYY') || ' — online κράτηση] '
      || trim(p_concern)
    where id = v_patient_id;
  end if;

  v_service := coalesce(nullif(trim(p_service), ''), 'Online κράτηση');

  insert into public.appointments (
    patient_id, therapist_id, service, start_time, end_time, status, notes
  )
  values (
    v_patient_id, p_therapist_id, v_service, p_start, p_end, 'confirmed',
    nullif(trim(p_concern), '')
  )
  returning id into v_appt_id;

  return v_appt_id;
end;
$$;
