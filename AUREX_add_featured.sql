-- Aurex Movement — "Featured listings" (paid placement). Run ONCE in Supabase → SQL Editor.
-- Safe to re-run.
--
-- Why a SEPARATE table (not a column on `listings`): RLS on `listings` lets each seller
-- update their OWN row, so a `featured` column there could be flipped on for free by a
-- savvy seller. This table has RLS enabled with ONLY a public-READ policy plus an
-- ADMIN-ONLY write policy — so the website can READ featured status, only YOU (the admin
-- email) can write it from the site, and ordinary sellers cannot. That keeps "featured"
-- genuinely pay-to-play.

create table if not exists featured_listings (
  listing_id uuid primary key references listings(id) on delete cascade,
  until      timestamptz,        -- optional auto-expiry; leave NULL for "until I remove it"
  note       text,               -- optional: who paid / which package, for your own records
  created_at timestamptz default now()
);

alter table featured_listings enable row level security;

-- Public can READ (so the site shows the gold "Featured" badge + pins it to the top).
drop policy if exists "featured public read" on featured_listings;
create policy "featured public read" on featured_listings for select using (true);

-- ONLY the admin (your email) can insert/update/delete — powers the one-click in-app
-- "Feature" buttons. Change the email below if your admin account ever changes.
drop policy if exists "admin manage featured" on featured_listings;
create policy "admin manage featured" on featured_listings
  for all to authenticated
  using      ( (auth.jwt() ->> 'email') = 'rashed.alshamsi731@gmail.com' )
  with check ( (auth.jwt() ->> 'email') = 'rashed.alshamsi731@gmail.com' );

-- After this runs, feature a watch with ONE CLICK: log into the site with your admin
-- email, open any watch, and use the gold "Feature" buttons (only you can see them).
-- (You can still feature manually via Table Editor → featured_listings if you prefer.)
