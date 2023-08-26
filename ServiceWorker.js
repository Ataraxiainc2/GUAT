// Definir el nombre de la caché y los recursos para almacenar en caché
const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
  // Agrega aquí otros recursos que quieras guardar en caché
  'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
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
        if (response) {
          return response; // Si el recurso está en caché, devuelve la versión en caché
        }

        // Realiza la solicitud de red para obtener el recurso
        return fetch(event.request).then(
          response => {
            // Verifica si recibimos una respuesta válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona la respuesta para poder almacenarla en la caché
            const responseToCache = response.clone();

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
