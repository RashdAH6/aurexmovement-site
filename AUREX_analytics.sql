-- ════════════════════════════════════════════════════════════════
-- AUREX — Free analytics event log (listing views + WhatsApp-contact clicks)
-- Run ONCE in Supabase → SQL Editor. Lets you see real demand in your dashboard.
-- Anyone (even logged-out buyers) can LOG an event; only owners can READ them.
-- ════════════════════════════════════════════════════════════════

create table if not exists public.events (
  id         bigint generated always as identity primary key,
  type       text not null check (type in ('view','contact')),
  listing_id text,
  brand      text,
  created_at timestamptz default now()
);
alter table public.events enable row level security;

-- log-only for the public (can't read others' data)
drop policy if exists "events insert" on public.events;
create policy "events insert" on public.events
  for insert to anon, authenticated
  with check ( type in ('view','contact') );

-- only the owners can read the numbers
drop policy if exists "events owner read" on public.events;
create policy "events owner read" on public.events
  for select
  using ( lower(auth.jwt() ->> 'email') in ('rashed.alshamsi731@gmail.com','rashed@aurexmovement.com') );

-- speed up the 7-day count queries
create index if not exists events_type_time_idx on public.events (type, created_at desc);
