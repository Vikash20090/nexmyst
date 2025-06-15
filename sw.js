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



self.addEventListener('install', () => console.log('SW installed'));
self.addEventListener('activate', () => console.log('SW activated'));
self.addEventListener('fetch', () => {});
