-- Aurex Movement — "Featured listings" (paid placement). Run ONCE in Supabase → SQL Editor.
-- Safe to re-run.
--
-- Why a SEPARATE table (not a column on `listings`): RLS on `listings` lets each seller
-- update their OWN row, so a `featured` column there could be flipped on for free by a
-- savvy seller. This table has RLS enabled with ONLY a public-READ policy and NO write
-- policy — so the website can READ featured status but NO client can WRITE it. You (the
-- project owner) add/remove rows from the Supabase Table Editor, which bypasses RLS.
-- That keeps "featured" genuinely pay-to-play.

create table if not exists featured_listings (
  listing_id uuid primary key references listings(id) on delete cascade,
  until      timestamptz,        -- optional auto-expiry; leave NULL for "until I remove it"
  note       text,               -- optional: who paid / which package, for your own records
  created_at timestamptz default now()
);

alter table featured_listings enable row level security;

-- Public can READ (so the site can show the gold "Featured" badge + pin it to the top)…
drop policy if exists "featured public read" on featured_listings;
create policy "featured public read" on featured_listings for select using (true);

-- …and there is intentionally NO insert/update/delete policy, so clients cannot write it.
--
-- TO FEATURE A WATCH (after a seller pays you):
--   Supabase → Table Editor → featured_listings → Insert row
--     listing_id = the watch's id (copy it from the `listings` table)
--     until      = optional end date (e.g. 2026-07-17); leave blank for no expiry
--   To un-feature: delete that row.
