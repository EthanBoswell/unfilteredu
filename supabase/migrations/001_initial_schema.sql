create table public.schools (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  location text not null,
  created_at timestamptz default now()
);

create table public.summaries (
  id uuid default gen_random_uuid() primary key,
  school_id uuid references public.schools(id) on delete cascade not null,
  category text not null,
  key_points text[] not null default '{}',
  key_quotes text[] not null default '{}',
  score numeric,
  created_at timestamptz default now(),
  unique (school_id, category)
);
