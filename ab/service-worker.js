const CACHE_NAME = 'absensi-pwa-v1';

const urlsToCache = ['./', './index.html', './logo.jpeg', './manifest.json', 'https://cdn.tailwindcss.com', 'https://unpkg.com/html5-qrcode'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
