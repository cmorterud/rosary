// Keeps the site on the device so it opens and works without a connection.
// The build writes this file to sw.js, replacing the two placeholders with
// this version's files and a hash of their contents: every deploy changes the
// worker, so browsers fetch the new files and switch on the next visit.
const VERSION = '__VERSION__';
const FILES = __FILES__;
const PREFIX = 'daily-rosary-';
const CACHE = PREFIX + VERSION;

self.addEventListener('install', event => {
  // `reload` skips the HTTP cache, which could otherwise hand back the
  // previous version's page alongside this version's files.
  event.waitUntil(caches.open(CACHE)
    .then(cache => cache.addAll(FILES.map(file => new Request(file, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== location.origin) return;
  // The site is a single page, so opening it (with any query) uses the saved
  // copy. Other addresses, such as the share image, go to the network as usual.
  const scope = new URL(self.registration.scope).pathname;
  const page = request.mode === 'navigate' && (url.pathname === scope || url.pathname === scope + 'index.html');
  // Saved files are matched by address alone. A server's Vary header (Vite's
  // preview sends Vary: Origin) would otherwise make the page's crossorigin
  // requests for the script and styles miss the copies saved without one.
  event.respondWith(caches.open(CACHE)
    .then(cache => cache.match(page ? './' : request, { ignoreVary: true }))
    .then(saved => saved ?? fetch(request)));
});
