// Definir el nombre de la caché y los recursos para almacenar en caché
const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  // Agrega aquí otros recursos que quieras guardar en caché
  'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
  'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.js',
  'https://fonts.googleapis.com/css2?family=Aboreto&display=swap',
  'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap',
  'https://polyfill.io/v3/polyfill.min.js?features=es6'
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
        // Devuelve la respuesta en caché si está disponible
        if (response) return response;
        
        // De lo contrario, obtiene la respuesta de la red y la almacena en caché
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200) {
              return response;
            }

            // Almacena la respuesta en caché
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
