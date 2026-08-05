-- Payment field updates: masters can edit any therapist;
-- other admins can only edit their own therapist calendar.
-- Pilates (anonymous) payments are master-only.

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

create or replace function public.admin_own_therapist_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select case lower(coalesce(auth.jwt() ->> 'email', ''))
    when 'x.neocleous@hotmail.com' then '11111111-1111-4111-8111-111111111111'::uuid
    when 'onisiforourafaellos@gmail.com' then '22222222-2222-4222-8222-222222222222'::uuid
    when 'antreaslouis@gmail.com' then '33333333-3333-4333-8333-333333333333'::uuid
    when 'constantinakitromilide@gmail.com' then '44444444-4444-4444-8444-444444444444'::uuid
    else null
  end;
$$;

create or replace function public.can_edit_therapist_payments(p_therapist_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_master_admin()
    or (
      p_therapist_id is not null
      and p_therapist_id = public.admin_own_therapist_id()
    );
$$;

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
  return NEW;
end;
$$;

drop trigger if exists trg_protect_charalambos_payments on public.appointments;
drop trigger if exists trg_protect_appointment_payments on public.appointments;
create trigger trg_protect_appointment_payments
  before update on public.appointments
  for each row
  execute function public.protect_appointment_payments();
