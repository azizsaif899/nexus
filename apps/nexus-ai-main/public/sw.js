// Service Worker for caching and performance
const CACHE_NAME = 'nexus-ai-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/preload-assets.js',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network, fix MIME types
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and external resources
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(event.request.url);
  const pathname = url.pathname;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then((fetchResponse) => {
          // Don't cache non-successful responses
          if (!fetchResponse.ok) {
            return fetchResponse;
          }

          // Fix MIME type for JavaScript files
          let finalResponse = fetchResponse;
          if (pathname.endsWith('.js') || pathname.endsWith('.mjs')) {
            const newHeaders = new Headers(fetchResponse.headers);
            newHeaders.set('Content-Type', 'application/javascript');
            finalResponse = new Response(fetchResponse.body, {
              status: fetchResponse.status,
              statusText: fetchResponse.statusText,
              headers: newHeaders,
            });
          }
          // Fix MIME type for CSS files
          else if (pathname.endsWith('.css')) {
            const newHeaders = new Headers(fetchResponse.headers);
            newHeaders.set('Content-Type', 'text/css');
            finalResponse = new Response(fetchResponse.body, {
              status: fetchResponse.status,
              statusText: fetchResponse.statusText,
              headers: newHeaders,
            });
          }

          // Clone the response for caching
          const responseToCache = finalResponse.clone();

          // Cache successful responses
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return finalResponse;
        });
      })
      .catch(() => {
        // Fallback for offline
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Background sync for improved offline experience
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('Background sync triggered')
    );
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/vite.svg',
      badge: '/vite.svg',
      data: data.data || {}
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      // Focus existing client or open new one
      if (clients.length > 0) {
        return clients[0].focus();
      } else {
        return self.clients.openWindow('/');
      }
    })
  );
});