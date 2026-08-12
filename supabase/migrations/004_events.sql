-- Lightweight first-party analytics: post-login actions (login, signup,
-- save/unsave school). Meant to be browsed directly in the Supabase dashboard
-- (Table Editor / SQL Editor), not exposed through the app's API — there's no
-- select policy, so the anon/authenticated keys can't read it back, only insert
-- their own rows. The dashboard uses admin credentials and bypasses RLS.

create table public.events (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  event_name text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "events_insert_own" on public.events;
create policy "events_insert_own" on public.events
  for insert with check (auth.uid()::text = user_id);
