// Define cache names for static assets (the app shell) and dynamic data (JSON, images)
const CACHE_STATIC_NAME = 'aakhar-static-v2'; // Increment v-number to force update
const CACHE_DYNAMIC_NAME = 'aakhar-dynamic-v2';

// List of files to cache on install (the "App Shell")
// This list MUST include all core files your app needs to run.
const STATIC_FILES = [
  '/',
  'index.html',
  'manifest.webmanifest',
  'src/js/main.js',
  'src/js/api.js',
  'src/js/router.js',
  'src/js/components/about.js',
  'src/js/components/learn.js',
  'src/js/components/recall.js',
  'src/js/components/quiz.js',
  'src/css/style.css',
  'src/css/responsive.css',
  'assets/icons/icon-192x192.png',
  'assets/icons/icon-512x512.png'
  // Note: Do not add data/ or images/ here. They will be cached dynamically.
];

// 1. Install Event: Cache the App Shell
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(cache => {
        console.log('[Service Worker] Precaching App Shell');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting()) // Activate new SW immediately
  );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => {
          // If the cache key is not one of the current cache names, delete it
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim(); // Take control of open pages
});

// 3. Fetch Event: Intercept network requests
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Strategy 1: Network-First for Data & Images (for preloading/runtime caching)
  // This fulfills Characteristic #3.
  if (url.pathname.startsWith('/assets/data/') || url.pathname.startsWith('/assets/images/')) {
    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
        .then(cache => {
          return fetch(event.request)
            .then(networkResponse => {
              // Got a new version from the network.
              // Cache it and return it.
              cache.put(event.request.url, networkResponse.clone());
              return networkResponse;
            })
            .catch(() => {
              // Network failed (offline). Try to serve from cache.
              return cache.match(event.request);
            });
        })
    );
  }
  // Strategy 2: Cache-First for App Shell (all other requests)
  else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return from cache if found
          if (response) {
            return response;
          }
          // Not in cache? Fetch from network (should only happen if install failed)
          return fetch(event.request);
        })
    );
  }
});
