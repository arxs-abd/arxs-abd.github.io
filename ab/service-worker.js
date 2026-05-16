const CACHE_NAME = 'absensi-pwa-v2-1.0';

const urlsToCache = ['/ab/', '/ab/index.html', '/ab/manifest.json', '/ab/logo.jpeg', 'https://cdn.tailwindcss.com', 'https://unpkg.com/html5-qrcode'];

// INSTALL
self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// ACTIVATE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          return caches.match('./index.html');
        })
      );
    })
  );
});
