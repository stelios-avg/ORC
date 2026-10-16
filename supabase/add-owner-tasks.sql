-- ─────────────────────────────────────────────────────────────
-- Migration: private task notes (the "Notes" tab)
-- Each row belongs to the admin who wrote it. Nobody else can read,
-- tick, or delete it — not even the other super admins.
-- Run this in the Supabase SQL Editor (already applied via MCP).
-- ─────────────────────────────────────────────────────────────

create table if not exists public.admin_tasks (
  id          uuid primary key default gen_random_uuid(),
  owner_email text not null default lower(coalesce(auth.jwt() ->> 'email', '')),
  body        text not null check (length(trim(body)) > 0),
  done        boolean not null default false,
  done_at     timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists admin_tasks_owner_idx
  on public.admin_tasks (owner_email, done, created_at desc);

alter table public.admin_tasks enable row level security;
revoke all on public.admin_tasks from anon;

drop policy if exists "Own tasks only" on public.admin_tasks;
create policy "Own tasks only"
  on public.admin_tasks for all
  to authenticated
  using (owner_email = lower(coalesce(auth.jwt() ->> 'email', '')))
  with check (owner_email = lower(coalesce(auth.jwt() ->> 'email', '')));
