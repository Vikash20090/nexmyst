self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('mystery-box-cache').then(function(cache) {
      return cache.addAll([
        '/',
        'index.html',
        'style.css',
        'main.js',
        'manifest.json',
        'sounds/click.wav',
        'sounds/open.mp3',
        'icon-192.png',
        'icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('install', e => console.log('SW installed'));
self.addEventListener('activate', e => console.log('SW activated'));


const CACHE_NAME = 'nexmyst-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/icon-192.png',
  '/icon-512.png',
  '/sounds/click.wav',
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('📦 Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate
self.addEventListener('activate', event => {
  console.log('🔁 Service Worker activating');
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});




self.addEventListener('install', () => console.log('SW installed'));
self.addEventListener('activate', () => console.log('SW activated'));
self.addEventListener('fetch', () => {});
