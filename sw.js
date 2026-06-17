const CACHE = 'aurex-v23';
const STATIC = [
  '/',
  '/index.html',
  '/styles.css',
  '/js/config.js',
  '/js/utils.js',
  '/js/i18n.js',
  '/js/theme.js',
  '/js/auth.js',
  '/js/views.js',
  '/js/favorites.js',
  '/js/listings.js',
  '/js/detail.js',
  '/js/brand-models.js',
  '/js/brand-info.js',
  '/js/brands.js',
  '/js/post.js',
  '/js/myads.js',
  '/js/profile.js',
  '/js/main.js',
  '/manifest.json',
  '/icon.svg',
  '/icon-maskable.svg',
];

// Install: pre-cache the app shell so it works offline
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC).catch(() => {}))
  );
});

// Activate: delete old caches and take control immediately
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch strategy:
//   • HTML pages + JS + CSS  -> NETWORK-FIRST (always get the latest when online,
//     fall back to cache only when offline). This prevents stale-version lock-in.
//   • images / icons / fonts / manifest -> CACHE-FIRST (fast, rarely change).
//   • Supabase API -> never intercept (always live).
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.hostname.includes('supabase.co')) return; // live data, never cache

  const sameOrigin = url.origin === self.location.origin;
  const isPage = req.mode === 'navigate';
  const isCode = sameOrigin && /\.(?:js|css)$/.test(url.pathname);

  if (isPage || isCode) {
    // Network-first: fresh when online, cached fallback when offline
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok && sameOrigin) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(req, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then(cached =>
            cached || (isPage ? caches.match('/index.html') : undefined) ||
            new Response('Offline', { status: 503 })
          )
        )
    );
    return;
  }

  // Cache-first for everything else (images, icons, fonts, manifest)
  e.respondWith(
    caches.match(req).then(cached =>
      cached || fetch(req).then(res => {
        if (res.ok && sameOrigin) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(req, clone));
        }
        return res;
      }).catch(() => cached || new Response('Offline', { status: 503 }))
    )
  );
});
