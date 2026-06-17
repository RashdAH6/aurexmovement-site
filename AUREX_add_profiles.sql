-- Aurex Movement — public seller PROFILES (name, photo, bio). Run ONCE in Supabase → SQL Editor.
-- Safe to re-run.
--
-- Why: a seller's name/photo/bio live in their private auth metadata, which OTHER users can't
-- read. This public table lets buyers see a seller's profile photo on listings and on the
-- dealer's storefront page. Public can READ; each user can only write THEIR OWN row.

create table if not exists profiles (
  user_id    uuid primary key,
  name       text,
  avatar_url text,
  bio        text,
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

drop policy if exists "profiles public read" on profiles;
create policy "profiles public read" on profiles for select using (true);

drop policy if exists "profiles owner insert" on profiles;
create policy "profiles owner insert" on profiles for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "profiles owner update" on profiles;
create policy "profiles owner update" on profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
