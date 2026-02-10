const CACHE_NAME = 'sandro-calc-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest'
];

// Installazione Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Attivazione Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Intercetta richieste
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Se la risorsa è in cache, restituiscila
      if (response) {
        return response;
      }
      
      // Altrimenti, fai la richiesta di rete
      return fetch(event.request);
    })
  );
});