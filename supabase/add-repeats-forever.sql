-- Standing weekly appointments: one row, shown every week at the same time.
-- Does not create a future row for each week.
alter table public.appointments
  add column if not exists repeats_forever boolean not null default false;

comment on column public.appointments.repeats_forever is
  'Standing weekly appointment. Shown every week at the same time from this row; no extra future rows.';

create index if not exists appointments_repeats_forever_idx
  on public.appointments (start_time)
  where repeats_forever and status <> 'cancelled';
