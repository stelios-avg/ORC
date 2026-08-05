-- Restrict updates to Charalambos appointment payment fields to master emails.
-- UI also hides these fields; this blocks API updates from other admin sessions.

create or replace function public.is_master_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) in (
    'egly_mua@hotmail.com',
    'x.neocleous@hotmail.com'
  );
$$;

create or replace function public.protect_charalambos_payments()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  charalambos_id uuid := '11111111-1111-4111-8111-111111111111';
begin
  if (
    coalesce(NEW.therapist_id, OLD.therapist_id) = charalambos_id
    or OLD.therapist_id = charalambos_id
  ) and not public.is_master_admin() then
    -- Non-masters cannot change payment fields on Charalambos appointments
    -- (including when transferring away / onto Charalambos).
    if NEW.price is distinct from OLD.price
      or NEW.discount is distinct from OLD.discount
      or NEW.is_paid is distinct from OLD.is_paid then
      NEW.price := OLD.price;
      NEW.discount := OLD.discount;
      NEW.is_paid := OLD.is_paid;
    end if;
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_protect_charalambos_payments on public.appointments;
create trigger trg_protect_charalambos_payments
  before update on public.appointments
  for each row
  execute function public.protect_charalambos_payments();
