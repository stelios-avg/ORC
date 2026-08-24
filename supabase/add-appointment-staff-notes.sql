-- ─────────────────────────────────────────────────────────────
-- Migration: staff notes on appointments
-- Any admin can leave a note on an appointment; each note keeps
-- its author and also appears on the patient's profile page.
-- Run this in the Supabase SQL Editor.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.appointment_notes (
  id             uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  patient_id     uuid references public.patients(id) on delete cascade,
  author_email   text not null,
  body           text not null,
  created_at     timestamptz not null default now()
);

create index if not exists appointment_notes_appointment_idx
  on public.appointment_notes (appointment_id, created_at);

create index if not exists appointment_notes_patient_idx
  on public.appointment_notes (patient_id, created_at desc);

alter table public.appointment_notes enable row level security;

create policy "Authenticated full access on appointment_notes"
  on public.appointment_notes for all
  to authenticated
  using (true) with check (true);
