-- ════════════════════════════════════════════════════════════════
-- AUREX — Admin moderation policies
-- Lets the admin (you) HIDE / ACTIVATE and DELETE any listing.
-- Run ONCE in Supabase → SQL Editor. Safe to re-run (idempotent).
-- The admin is identified by email in the auth token; the in-app buttons
-- are just UI — these policies are the real security.
-- ════════════════════════════════════════════════════════════════

-- Admin can UPDATE any listing (hide/activate, approve, feature).
drop policy if exists "admin update listings" on public.listings;
create policy "admin update listings" on public.listings
  for update
  using ( (auth.jwt() ->> 'email') = 'rashed.alshamsi731@gmail.com' )
  with check ( true );

-- Admin can DELETE any listing.
drop policy if exists "admin delete listings" on public.listings;
create policy "admin delete listings" on public.listings
  for delete
  using ( (auth.jwt() ->> 'email') = 'rashed.alshamsi731@gmail.com' );
