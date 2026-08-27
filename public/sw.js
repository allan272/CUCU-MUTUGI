// Cucu Mutugi Poultry PWA Service Worker
// Version bump here forces all installed apps to receive an update notification
const CACHE_VERSION = 'cucu-mutugi-v6';
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
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        )
      )
      .then(() => self.clients.claim())
      .then(() => {
        // Broadcast update notification to all open windows/tabs
        return self.clients.matchAll({ type: 'window' }).then((clients) => {
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

  // 1. Navigation requests: Network-first, fallback ONLY to exact cached page or offline notice
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(async () => {
          // Check if exact requested URL is cached
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // If homepage was specifically requested offline, serve cached '/'
          if (url.pathname === '/') {
            const cachedHome = await caches.match('/');
            if (cachedHome) return cachedHome;
          }
          // Never substitute '/' for non-root routes when offline/error
          return new Response(
            '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Offline - Cucu Mutugi Poultry</title></head><body style="font-family:system-ui,-apple-system,sans-serif;text-align:center;padding:40px 20px;background:#FFFDF0;color:#1e293b;"><h1 style="color:#166534;font-size:2rem;margin-bottom:8px;">🐣 You are Offline</h1><p style="font-size:1rem;color:#475569;margin-bottom:24px;">This page is not available offline. Please check your internet connection.</p><button onclick="window.location.reload()" style="background:#f59e0b;color:#0f172a;border:none;padding:12px 24px;font-weight:800;font-size:14px;border-radius:12px;cursor:pointer;">Retry Connection</button></body></html>',
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            }
          );
        })
    );
    return;
  }

  // 2. API requests: Network-first, JSON response on failure (never return HTML)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          return new Response(JSON.stringify({ error: 'Network unavailable' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        });
      })
    );
    return;
  }

  // 3. Cache-first for static assets (images, fonts, CSS, JS)
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
