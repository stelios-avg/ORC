-- ─────────────────────────────────────────────────────────────
-- Multi-therapist schedules (Fresha-style)
-- Run in Supabase SQL Editor after schema.sql.
-- Fixed UUIDs so the website can map services → therapists.
-- ─────────────────────────────────────────────────────────────

-- Χαράλαμπος → οστεοπαθητική
-- Ραφαέλλος / Αντρέας / Κωνσταντίνα → φυσιοθεραπεία
-- Πιλάτες → ξεχωριστό ημερολόγιο χωρίς όνομα θεραπευτή
-- (online physio → Rafaellos, pilates → Pilates calendar)
create table if not exists public.therapists (
  id         uuid primary key,
  slug       text not null unique,
  name_el    text not null,
  name_en    text not null,
  specialty  text not null, -- osteopathy | physiotherapy
  sort_order int not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.therapists (id, slug, name_el, name_en, specialty, sort_order)
values
  ('11111111-1111-4111-8111-111111111111', 'charalambos', 'Χαράλαμπος', 'Charalambos', 'osteopathy', 1),
  ('22222222-2222-4222-8222-222222222222', 'rafaellos', 'Ραφαέλλος', 'Rafaellos', 'physiotherapy', 2),
  ('33333333-3333-4333-8333-333333333333', 'antreas', 'Αντρέας', 'Antreas', 'physiotherapy', 3),
  ('44444444-4444-4444-8444-444444444444', 'constantina', 'Κωνσταντίνα', 'Constantina', 'physiotherapy', 4),
  ('55555555-5555-4555-8555-555555555555', 'pilates', 'Πιλάτες', 'Pilates', 'pilates', 5)
on conflict (id) do update set
  slug = excluded.slug,
  name_el = excluded.name_el,
  name_en = excluded.name_en,
  specialty = excluded.specialty,
  sort_order = excluded.sort_order,
  active = true;

alter table public.appointments
  add column if not exists therapist_id uuid references public.therapists(id);

create index if not exists appointments_therapist_start_idx
  on public.appointments (therapist_id, start_time);

alter table public.therapists enable row level security;

drop policy if exists "Authenticated full access on therapists" on public.therapists;
create policy "Authenticated full access on therapists"
  on public.therapists for all
  to authenticated
  using (true) with check (true);

-- Public can read active therapists (needed for online booking labels).
drop policy if exists "Anon read active therapists" on public.therapists;
create policy "Anon read active therapists"
  on public.therapists for select
  to anon
  using (active = true);

-- ── Replace booking RPCs: busy slots + book are scoped per therapist ──
drop function if exists public.get_busy_slots(date);
drop function if exists public.get_busy_slots(date, uuid);
drop function if exists public.book_appointment(text, text, text, text, timestamptz, timestamptz);
drop function if exists public.book_appointment(text, text, text, text, timestamptz, timestamptz, uuid, text);

create or replace function public.get_busy_slots(p_day date, p_therapist_id uuid)
returns table (busy_start timestamptz, busy_end timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  -- Physiotherapy: include all physio calendars so online capacity can be 2 clinic-wide.
  -- Other specialties: only that therapist's calendar.
  select a.start_time, a.end_time
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
  v_capacity   int;
  v_overlaps   int;
  v_preferred  uuid;
  v_assigned   uuid;
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

  -- Physiotherapy: up to 2 concurrent clinic-wide; assign to a free physio
  -- (prefer requested therapist) so both show in separate admin columns.
  -- Other specialties: 1 per therapist calendar.
  v_capacity := case when v_specialty = 'physiotherapy' then 2 else 1 end;

  if v_specialty = 'physiotherapy' then
    select count(*)::int into v_overlaps
    from public.appointments a
    join public.therapists t on t.id = a.therapist_id
    where a.status <> 'cancelled'
      and t.specialty = 'physiotherapy'
      and a.start_time < p_end
      and a.end_time   > p_start;

    if v_overlaps >= v_capacity then
      raise exception 'slot_taken';
    end if;

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
    select count(*)::int into v_overlaps
    from public.appointments a
    where a.status <> 'cancelled'
      and a.therapist_id = p_therapist_id
      and a.start_time < p_end
      and a.end_time   > p_start;

    if v_overlaps >= v_capacity then
      raise exception 'slot_taken';
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

revoke all on function public.get_busy_slots(date, uuid) from public;
revoke all on function public.book_appointment(text, text, text, text, timestamptz, timestamptz, uuid, text) from public;
grant execute on function public.get_busy_slots(date, uuid) to anon, authenticated;
grant execute on function public.book_appointment(text, text, text, text, timestamptz, timestamptz, uuid, text) to anon, authenticated;
