-- ──────────────────────────────────────────────────────────────────────────
-- Cancellation audit: record who cancelled an appointment and when.
-- Shown only to master accounts in the "Ακυρωμένες κρατήσεις" list.
-- Applied to the ORC project on 2026-09-15.
-- ──────────────────────────────────────────────────────────────────────────

alter table public.appointments
  add column if not exists cancelled_by text,
  add column if not exists cancelled_at timestamptz;
