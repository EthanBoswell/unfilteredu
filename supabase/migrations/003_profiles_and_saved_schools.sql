-- Onboarding profile data. Personal data (unlike schools/summaries), so RLS
-- restricts every row to its owner — same pattern as the existing
-- saved_schools policies (auth.uid()::text = user_id).
--
-- saved_schools itself isn't created here: it already exists in this
-- project (table, FK to schools(id), unique(user_id, school_id), and all
-- four RLS policies), just never captured in a tracked migration until now.

create table if not exists public.profiles (
  user_id text primary key,
  role text not null check (role in ('parent', 'student')),
  stage text not null check (stage in ('high_school', 'college')),
  grad_year integer not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid()::text = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid()::text = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid()::text = user_id);
