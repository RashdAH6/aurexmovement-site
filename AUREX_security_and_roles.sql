-- ════════════════════════════════════════════════════════════════
-- AUREX — Security lock-down + Staff roles (Moderator / Admin)
-- Run ONCE in Supabase → SQL Editor.  ⬅️ This REPLACES the earlier
-- "AUREX_security_fix_listings.sql" — it includes that lock-down too.
--
-- What it does:
--   • Locks the listings table (was world-writable by anyone)
--   • Adds a "staff" list so YOU (the owner) can grant access by email:
--        Moderator = can hide / delete listings only
--        Admin     = full access (pricing, verify dealers, everything)
--   • You are always Admin, and only YOU can add/remove staff.
-- Safe to re-run.
-- ════════════════════════════════════════════════════════════════

-- ---------- 1. Staff list ----------
create table if not exists public.staff (
  email    text primary key,
  role     text not null check (role in ('admin','moderator')),
  added_at timestamptz default now()
);
alter table public.staff enable row level security;

-- Only the OWNER can see / add / remove staff.
drop policy if exists "staff owner manage" on public.staff;
create policy "staff owner manage" on public.staff
  for all
  using  ( lower(auth.jwt() ->> 'email') = 'rashed.alshamsi731@gmail.com' )
  with check ( lower(auth.jwt() ->> 'email') = 'rashed.alshamsi731@gmail.com' );

-- ---------- 2. Role of the current user (owner is always admin) ----------
create or replace function public.aurex_role() returns text
  language sql stable security definer set search_path = public as $$
  select case
    when lower(auth.jwt() ->> 'email') = 'rashed.alshamsi731@gmail.com' then 'admin'
    else (select s.role from public.staff s
          where lower(s.email) = lower(auth.jwt() ->> 'email') limit 1)
  end;
$$;
grant execute on function public.aurex_role() to anon, authenticated;

-- ---------- 3. Lock down listings (security fix) ----------
alter table public.listings enable row level security;
do $$ declare pol record; begin
  for pol in select policyname from pg_policies
             where schemaname='public' and tablename='listings'
  loop execute format('drop policy %I on public.listings', pol.policyname); end loop;
end $$;

create policy "listings public read" on public.listings
  for select using ( true );

create policy "listings insert own" on public.listings
  for insert to authenticated
  with check ( auth.uid()::text = user_id::text );

-- the row's owner OR any staff (admin/moderator) can edit/delete it
create policy "listings update own or staff" on public.listings
  for update to authenticated
  using ( auth.uid()::text = user_id::text or public.aurex_role() in ('admin','moderator') )
  with check ( auth.uid()::text = user_id::text or public.aurex_role() in ('admin','moderator') );

create policy "listings delete own or staff" on public.listings
  for delete to authenticated
  using ( auth.uid()::text = user_id::text or public.aurex_role() in ('admin','moderator') );

-- ---------- 4. Admin-only tables (pricing, verified dealers, featured) ----------
-- Additive role-based ADMIN access so added admins work too (owner already worked).
drop policy if exists "role admin plans" on public.plans;
create policy "role admin plans" on public.plans
  for all using ( public.aurex_role() = 'admin' ) with check ( public.aurex_role() = 'admin' );

drop policy if exists "role admin verified" on public.verified_sellers;
create policy "role admin verified" on public.verified_sellers
  for all using ( public.aurex_role() = 'admin' ) with check ( public.aurex_role() = 'admin' );

drop policy if exists "role admin featured" on public.featured_listings;
create policy "role admin featured" on public.featured_listings
  for all using ( public.aurex_role() = 'admin' ) with check ( public.aurex_role() = 'admin' );
