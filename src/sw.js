const CACHE = `advent-${__VERSION__}`;

const isOwnRead = (request) => request.method === 'GET' && new URL(request.url).origin === self.location.origin;
const fresh = (path) => new Request(path, { cache: 'reload' });

async function respond(request) {
  const cache = await caches.open(CACHE);
  const key = request.mode === 'navigate' ? './' : request;
  return (await cache.match(key, { ignoreSearch: true })) ?? fetch(request);
}

async function dropOldCaches() {
  const keys = await caches.keys();
  await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(__FILES__.map(fresh))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(dropOldCaches().then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (isOwnRead(event.request)) event.respondWith(respond(event.request));
});
