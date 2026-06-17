-- Aurex Movement — listing PLANS + lifecycle (Phase 2). Run ONCE in Supabase → SQL Editor.
-- Safe to re-run.

-- 1) Admin-editable plans (you change prices/features from your dashboard; public can read).
create table if not exists plans (
  id            text primary key,        -- 'free' | 'basic' | 'featured' | 'premium'
  label_en      text,
  label_ar      text,
  price         numeric default 0,
  days          int default 7,           -- how long the listing stays live
  featured_days int default 0,           -- days pinned to the top
  refreshes     int default 0,           -- number of "bump to top" actions
  sort          int default 0,
  recommended   boolean default false,
  active        boolean default true
);
alter table plans enable row level security;
drop policy if exists "plans public read" on plans;
create policy "plans public read" on plans for select using (true);
drop policy if exists "plans admin write" on plans;
create policy "plans admin write" on plans for all to authenticated
  using      ((auth.jwt() ->> 'email') = 'rashed.alshamsi731@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'rashed.alshamsi731@gmail.com');

insert into plans (id,label_en,label_ar,price,days,featured_days,refreshes,sort,recommended) values
  ('free',    'Free',    'مجاني',    0,     7,  0,  0, 1, false),
  ('basic',   'Basic',   'أساسي',   19.99, 30, 0,  1, 2, false),
  ('featured','Featured','مميّز',    29.99, 30, 7,  2, 3, true),
  ('premium', 'Premium', 'بريميوم', 59.99, 60, 30, 4, 4, false)
on conflict (id) do nothing;

-- 2) Listing lifecycle fields
alter table listings
  add column if not exists plan          text,
  add column if not exists plan_status   text default 'active',   -- 'active' | 'pending'
  add column if not exists expires_at    timestamptz,
  add column if not exists bumped_at      timestamptz,
  add column if not exists refreshes_left int default 0,
  add column if not exists warranty      boolean default false;

-- 3) Let the admin (you) update ANY listing — needed to approve paid plans, refresh, etc.
drop policy if exists "admin manage listings" on listings;
create policy "admin manage listings" on listings for update to authenticated
  using      ((auth.jwt() ->> 'email') = 'rashed.alshamsi731@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'rashed.alshamsi731@gmail.com');
