const CACHE_NAME = 'elmirador-v1';
const ASSETS = [
  'https://21joss.github.io/elmirador/',
  'https://21joss.github.io/elmirador/index.html',
  'https://21joss.github.io/elmirador/manifest.json',
  'https://21joss.github.io/elmirador/icon-192.png',
  'https://21joss.github.io/elmirador/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
