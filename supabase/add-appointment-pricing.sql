-- ─────────────────────────────────────────────────────────────
-- Appointment pricing: price + fixed-amount discount (not %)
-- Run in Supabase SQL Editor (Dashboard → SQL Editor).
-- ─────────────────────────────────────────────────────────────

alter table public.appointments
  add column if not exists price numeric(10, 2),
  add column if not exists discount numeric(10, 2) not null default 0;

comment on column public.appointments.price is
  'List/session price in EUR set by the admin';
comment on column public.appointments.discount is
  'Fixed-amount discount in EUR (not a percentage). Payable = max(0, price - discount)';

alter table public.appointments
  drop constraint if exists appointments_price_non_negative,
  drop constraint if exists appointments_discount_non_negative;

alter table public.appointments
  add constraint appointments_price_non_negative
    check (price is null or price >= 0),
  add constraint appointments_discount_non_negative
    check (discount >= 0);
