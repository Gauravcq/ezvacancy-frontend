const CACHE = 'ev-v2';
const ASSETS = [
  './','./index.html','./post.html','./calendar.html','./favorites.html','./search.html','./typing.html',
  './manifest.webmanifest',
  './js/app.js','./js/data.js','./js/ui.js','./js/post.js','./js/calendar.js','./js/favorites.js','./js/search.js','./js/typing.js'
];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      if (e.request.method === 'GET') {
        const copy = resp.clone(); caches.open(CACHE).then(c=>c.put(e.request, copy));
      }
      return resp;
    })));
  }
});