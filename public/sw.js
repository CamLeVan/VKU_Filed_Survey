// VKU Field Survey Service Worker - Production Cache-First PWA Implementation
const CACHE_NAME = 'vku-survey-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

// Install Event: Cache Core Static Shell
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static app shell');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up old caches & take immediate control
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event Strategy: Cache-First for static assets; Network-First for API requests
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip non-GET requests
  if (req.method !== 'GET') {
    return;
  }

  // API handling: Network-first, fallback to offline response
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          return new Response(
            JSON.stringify({ offline: true, error: 'Network unavailable. Request queued offline.' }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // Cache-First strategy for all assets & routes with dynamic caching
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Background refresh (Stale-While-Revalidate)
        fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkResponse));
          }
        }).catch(() => {/* Offline fallback */});
        
        return cachedResponse;
      }

      // Not in cache: fetch from network and cache
      return fetch(req)
        .then((networkResponse) => {
          if (!networkResponse || (!networkResponse.ok && networkResponse.type !== 'opaque')) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // If navigation/HTML fails offline, return cached index.html
          if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html') || caches.match('/');
          }
          return new Response('Offline - Content unavailable', { status: 503, statusText: 'Offline' });
        });
    })
  );
});

// Sync Event Listener for Background Sync API
self.addEventListener('sync', (event) => {
  if (event.tag === 'vku-survey-sync') {
    console.log('[SW] Background Sync triggered:', event.tag);
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'TRIGGER_SYNC' });
        });
      })
    );
  }
});
