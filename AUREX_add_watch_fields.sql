-- Aurex Movement — add the new watch-spec columns used by the Chrono24-style filters.
-- Run this ONCE in Supabase → SQL Editor → New query → paste → Run.
-- Safe to re-run (uses "if not exists").

alter table listings
  add column if not exists movement      text,
  add column if not exists case_material text,
  add column if not exists case_size     int,
  add column if not exists gender        text,
  add column if not exists bracelet      text;
