// Cucu Mutugi Poultry PWA Service Worker
// Version bump here forces all installed apps to receive an update notification
const CACHE_VERSION = 'cucu-mutugi-v5';
const CACHE_NAME = CACHE_VERSION;

const urlsToCache = [
  '/',
  '/manifest.json',
  '/cucumutugi-logo.png',
  '/cucumutugi-logo-192.png',
  '/cucumutugi-logo-512.png',
  '/cucumutugi-apple-touch-icon.png',
];

// ── Install: pre-cache core shell ──────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        console.log('[SW] Some assets failed to cache, continuing anyway');
      });
    })
  );
  // Take control immediately — don't wait for old SW to die
  self.skipWaiting();
});

// ── Activate: remove old caches & notify all clients of the update ──────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        )
      ),
      // Take control of all open clients immediately
      self.clients.claim(),
    ]).then(() => {
      // Broadcast update notification to all open windows/tabs
      self.clients.matchAll({ type: 'window' }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'APP_UPDATED',
            version: CACHE_VERSION,
            message: '🐣 Cucu Mutugi app updated! Tap to reload for the latest features.',
          });
        });
      });
    })
  );
});

// ── Fetch: Network-first for API/HTML, cache-first for static assets ────────
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip non-same-origin requests
  if (url.origin !== location.origin) return;

  // Network-first for pages and API calls (always fresh)
  if (
    event.request.mode === 'navigate' ||
    url.pathname.startsWith('/api/')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          // Cache a clone for offline fallback
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Cache-first for static assets (images, fonts, CSS, JS)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return res;
      });
    }).catch(() => {
      return new Response('Offline — Content not available', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' },
      });
    })
  );
});

// ── Push Notifications (future-ready) ──────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Cucu Mutugi Poultry', {
      body: data.body || 'You have a new notification.',
      icon: '/cucumutugi-logo.png',
      badge: '/cucumutugi-logo-192.png',
      data: { url: data.url || '/' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow(event.notification.data?.url || '/')
  );
});
