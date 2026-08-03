-- ─────────────────────────────────────────────────────────────
-- ORC Admin — database schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor).
-- ─────────────────────────────────────────────────────────────

-- Patients / clients of the clinic
create table if not exists public.patients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text,
  email      text,
  notes      text,                      -- medical history / free-form notes
  created_at timestamptz not null default now()
);

-- Therapists (each has their own calendar; admin users see all)
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

-- Appointments + blocked-out time slots
create table if not exists public.appointments (
  id              uuid primary key default gen_random_uuid(),
  patient_id      uuid references public.patients(id) on delete cascade,
  therapist_id    uuid references public.therapists(id),
  service         text,                 -- e.g. "Φυσιοθεραπεία" (or reason for a block)
  start_time      timestamptz not null,
  end_time        timestamptz not null,
  status          text not null default 'confirmed',  -- confirmed | cancelled | completed
  notes           text,                 -- e.g. reason given in an online booking
  price           numeric(10, 2),       -- list/session price in EUR (admin-set)
  discount        numeric(10, 2) not null default 0, -- fixed EUR off (not %); payable = max(0, price - discount)
  is_paid         boolean not null default false,
  is_blocked_time boolean not null default false,
  created_at      timestamptz not null default now(),
  constraint valid_range check (end_time > start_time)
);

create index if not exists appointments_start_time_idx on public.appointments (start_time);
create index if not exists appointments_patient_idx    on public.appointments (patient_id);
create index if not exists appointments_therapist_start_idx
  on public.appointments (therapist_id, start_time);

-- ── Row Level Security ──
-- Only logged-in users (the therapists) can touch the data.
-- Create the therapist user in Dashboard → Authentication → Users → Add user.
alter table public.patients     enable row level security;
alter table public.appointments enable row level security;
alter table public.therapists   enable row level security;

create policy "Authenticated full access on patients"
  on public.patients for all
  to authenticated
  using (true) with check (true);

create policy "Authenticated full access on appointments"
  on public.appointments for all
  to authenticated
  using (true) with check (true);

create policy "Authenticated full access on therapists"
  on public.therapists for all
  to authenticated
  using (true) with check (true);

create policy "Anon read active therapists"
  on public.therapists for select
  to anon
  using (active = true);
