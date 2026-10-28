/* Service worker: rende l'app utilizzabile offline sul tablet.
   I DATI del registro non passano di qui: stanno in IndexedDB. */
const CACHE = 'gestione-haccp-v1.2.3';

const APP_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

// Librerie esterne: messe in cache subito, se la rete c'è
const CDN_FILES = [
  'https://cdn.tailwindcss.com/3.4.1',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/tesseract.js@4.1.4/dist/tesseract.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(APP_FILES);
    await Promise.all(CDN_FILES.map(url => cache.add(url).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function putInCache(request, response) {
  if (response && (response.ok || response.type === 'opaque')) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response);
  }
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Pagina: prima la rete (per ricevere gli aggiornamenti), offline la copia in cache
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          putInCache('./index.html', res.clone());
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Tutto il resto (file dell'app, CDN, font, dati OCR): prima la cache
  if (url.protocol === 'http:' || url.protocol === 'https:') {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        putInCache(req, res.clone());
        return res;
      }))
    );
  }
});
