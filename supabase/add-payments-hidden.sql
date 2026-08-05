-- Hidden paid appointments (excluded from payment totals). Masters only can toggle.
alter table public.appointments
  add column if not exists payments_hidden boolean not null default false;

comment on column public.appointments.payments_hidden is
  'When true, paid appointment is excluded from payment totals. Master accounts only.';

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
    or NEW.is_paid is distinct from OLD.is_paid then
    if not public.can_edit_therapist_payments(target_id) then
      NEW.price := OLD.price;
      NEW.discount := OLD.discount;
      NEW.is_paid := OLD.is_paid;
    end if;
  end if;

  -- Unpaid appointments cannot stay hidden from totals
  if NEW.is_paid = false then
    NEW.payments_hidden := false;
  elsif NEW.payments_hidden is distinct from OLD.payments_hidden then
    if not public.is_master_admin() then
      NEW.payments_hidden := OLD.payments_hidden;
    end if;
  end if;

  return NEW;
end;
$$;
