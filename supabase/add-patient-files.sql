-- ─────────────────────────────────────────────────────────────
-- Migration: files & photos on a client profile
-- Logged-in admins can upload, view, and delete attachments.
-- The storage bucket is private (not public on the internet).
-- Run in the Supabase SQL Editor (after previous migrations).
-- ─────────────────────────────────────────────────────────────

create table if not exists public.patient_files (
  id           uuid primary key default gen_random_uuid(),
  patient_id   uuid not null references public.patients(id) on delete cascade,
  storage_path text not null unique,
  file_name    text not null,
  mime_type    text,
  size_bytes   bigint,
  uploaded_by  text,
  created_at   timestamptz not null default now(),
  constraint patient_files_path_matches_patient
    check (storage_path like (patient_id::text || '/%'))
);

create index if not exists patient_files_patient_idx
  on public.patient_files (patient_id, created_at desc);

comment on table public.patient_files is
  'Files and photos attached to a client profile; visible to all logged-in admins.';

alter table public.patient_files enable row level security;

drop policy if exists "Authenticated full access on patient_files" on public.patient_files;
create policy "Authenticated full access on patient_files"
  on public.patient_files for all
  to authenticated
  using (true) with check (true);

create or replace function public.set_patient_file_uploaded_by()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if NEW.uploaded_by is null or length(trim(NEW.uploaded_by)) = 0 then
    NEW.uploaded_by := nullif(lower(auth.jwt() ->> 'email'), '');
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_set_patient_file_uploaded_by on public.patient_files;
create trigger trg_set_patient_file_uploaded_by
  before insert on public.patient_files
  for each row
  execute function public.set_patient_file_uploaded_by();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'patient-files',
  'patient-files',
  false,
  15728640,
  array[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/heic',
    'image/heif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Authenticated read patient-files" on storage.objects;
create policy "Authenticated read patient-files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'patient-files');

drop policy if exists "Authenticated upload patient-files" on storage.objects;
create policy "Authenticated upload patient-files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'patient-files');

drop policy if exists "Authenticated update patient-files" on storage.objects;
create policy "Authenticated update patient-files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'patient-files')
  with check (bucket_id = 'patient-files');

drop policy if exists "Authenticated delete patient-files" on storage.objects;
create policy "Authenticated delete patient-files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'patient-files');
