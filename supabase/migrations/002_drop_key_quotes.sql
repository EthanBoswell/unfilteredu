-- Verbatim student quotes are no longer displayed anywhere on the site (legal
-- requirement: no direct user quotes). Existing key_quotes data was cleared via
-- the REST API on 2026-08-11; this drops the now-unused column entirely.
-- Apply via the Supabase SQL Editor or `supabase db push` — not run automatically.

alter table public.summaries drop column key_quotes;
