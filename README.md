# Aurex Movement — Website

A bilingual (Arabic RTL / English LTR) peer-to-peer marketplace for **authentic luxury watches** in the UAE & GCC. Buyers and sellers connect **directly via WhatsApp** — there is no in-app chat and no in-app payments. Gold-and-black luxury design with dark + light themes.

**Live site:** https://aurexmovement.com

---

## Tech overview

- **Plain vanilla JavaScript SPA — no build step, no bundler, no framework.**
- Loaded as classic `<script src="js/*.js">` tags (NOT ES modules — inline `onclick` handlers rely on global functions).
- **Backend:** [Supabase](https://supabase.com) (Postgres + Auth + Storage), accessed from the browser with the **publishable (anon) key**, protected by Row-Level Security.
- **Hosting:** Cloudflare Pages (Direct Upload — drag a zip of these files).
- **PWA:** `manifest.json` + `sw.js` service worker (network-first for HTML/JS/CSS so deploys appear immediately).

> The Supabase key in `js/config.js` is the **publishable** key and is safe to be public — it only allows what Row-Level Security permits.

## Project structure

```
index.html          Single-page app shell (all views + modals)
styles.css          All styling (dark/light themes, RTL/LTR)
sw.js               Service worker (PWA cache)
manifest.json       PWA manifest
robots.txt  sitemap.xml  privacy.html  terms.html  icon*.svg
AUREX_add_watch_fields.sql   One-time DB migration (see below)
js/
  config.js     Supabase client + global state   (loads FIRST)
  utils.js      toast / small helpers
  i18n.js       translations (AR/EN) + applyTranslations()
  theme.js      light/dark + language state
  auth.js       login / register / forgot-password
  views.js      SPA router (showView) + nav helpers
  favorites.js  saved listings
  listings.js   load / render / filter / Top Dealers / AI assistant
  detail.js     listing detail page
  post.js       create / edit a listing (+ photo upload)
  myads.js      "my listings" management
  profile.js    profile, settings, change password
  main.js       init — loads LAST
```

**Load order matters only at the ends:** `config.js` first, `main.js` last. Never add `type="module"`.

## Running locally

No install needed. Serve the folder with any static server, e.g.:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly via `file://` mostly works too, but a local server is cleaner.)

## Database setup (one-time)

The advanced spec filters (Movement, Case Material, Case Size, Gender, Bracelet) need 5 extra columns on the `listings` table. Run **`AUREX_add_watch_fields.sql`** once in **Supabase → SQL Editor**. It is safe to re-run (uses `add column if not exists`).

## Deploying

1. (If not done) run the SQL migration above.
2. Zip the contents of this folder (keep `js/` as a folder).
3. Cloudflare → Workers & Pages → **aurexmovement** → Create deployment → drag the zip → Deploy.
4. Bump the cache version in `sw.js` (`const CACHE = 'aurex-vN'`) whenever cached files change.

---

*Maintained by the Aurex Movement team.*
