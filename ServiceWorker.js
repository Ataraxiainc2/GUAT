// Definir el nombre de la caché y los recursos para almacenar en caché
const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  // Agrega aquí otros recursos que quieras guardar en caché
  'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
  'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.js'
];

// Instalación del Service Worker y almacenamiento en caché de recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Manejo de solicitudes de red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if available
        if (response) return response;
        
        // Else, fetch from network and cache
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200) {
              return response;
            }

            // Cache the response
            let responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
