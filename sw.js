const CACHE_NAME = 'madereria-diaz-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/cotizador.html',
    'cotizador-style.css',
    '/style.css',
    'cotizador-script.js',
    '/script.js',
    '/icon-192.png',
    '/icon-512.png',
    '/logo.png', // Logo
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Evento de instalación: se abre el caché y se añaden los archivos del app shell.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento fetch: intercepta las peticiones y responde desde el caché si es posible.
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si la respuesta está en el caché, la devuelve.
                // Si no, la busca en la red.
                return response || fetch(event.request);
            })
    );
});
