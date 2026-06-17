-- Aurex Movement — "Verified dealers" (recurring-revenue trust badge).
-- Run ONCE in Supabase → SQL Editor. Safe to re-run.
--
-- Per-SELLER verification (keyed by the seller's user_id), so the gold "Verified" badge
-- shows on ALL of that dealer's watches, including future ones. Same tamper-proof design
-- as featured_listings: public can READ, only YOU (admin email) can WRITE — sellers can't
-- self-verify. Payment is collected OFF-platform (e.g. a monthly fee); you verify while
-- they pay, and remove verification if they stop.

create table if not exists verified_sellers (
  user_id uuid primary key,      -- the seller's auth user id (from listings.user_id)
  name    text,                  -- the dealer's display name, for your reference
  note    text,                  -- optional: plan / paid-until / notes
  since   timestamptz default now()
);

alter table verified_sellers enable row level security;

-- Public can READ (so the site shows the Verified badge + Top Dealers ranking)…
drop policy if exists "verified public read" on verified_sellers;
create policy "verified public read" on verified_sellers for select using (true);

-- …and ONLY the admin (your email) can insert/update/delete — powers the one-click
-- "Verify seller" button on each watch's page (only you can see/use it).
drop policy if exists "admin manage verified" on verified_sellers;
create policy "admin manage verified" on verified_sellers
  for all to authenticated
  using      ( (auth.jwt() ->> 'email') = 'rashed.alshamsi731@gmail.com' )
  with check ( (auth.jwt() ->> 'email') = 'rashed.alshamsi731@gmail.com' );

-- After this runs: log into the site with your admin email, open any watch from a dealer
-- you want to verify, and click "Verify seller". The badge appears on all their listings.
