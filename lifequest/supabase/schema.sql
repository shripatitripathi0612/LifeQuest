-- LifeQuest — Supabase schema
-- Run this in your Supabase project's SQL Editor (Project > SQL Editor > New query).
--
-- LifeQuest stores each user's full game state (habits, completions, quests,
-- achievements, player progression) as a single JSON document per user. This
-- keeps the schema simple and robust while the app's data model evolves,
-- and is a common, production-reasonable pattern for this kind of app.
--
-- If you later want fully relational tables (e.g. for server-side queries or
-- leaderboards), you can migrate `data->'habits'` etc. into dedicated tables —
-- the JSON column keeps that possible without a breaking change today.

create table if not exists public.user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on every write.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_user_data_updated_at on public.user_data;
create trigger trg_user_data_updated_at
  before update on public.user_data
  for each row execute function public.set_updated_at();

-- Row Level Security: every user can only ever read/write their own row.
alter table public.user_data enable row level security;

drop policy if exists "Users can read their own data" on public.user_data;
create policy "Users can read their own data"
  on public.user_data for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own data" on public.user_data;
create policy "Users can insert their own data"
  on public.user_data for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own data" on public.user_data;
create policy "Users can update their own data"
  on public.user_data for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own data" on public.user_data;
create policy "Users can delete their own data"
  on public.user_data for delete
  using (auth.uid() = user_id);

-- Optional: index for admin/analytics queries on updated_at.
create index if not exists idx_user_data_updated_at on public.user_data (updated_at);
