
const CACHE_NAME = 'seo-audit-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/images/placeholder.jpg',
  '/og-image.jpg',
  '/index.css',
  '/main.js'
];

// Установка service worker и кеширование базовых ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Стратегия кеширования: сначала из кеша, потом из сети с обновлением кеша
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем из кеша, если найдено
        if (response) {
          // Асинхронно обновляем кеш
          const fetchPromise = fetch(event.request).then(
            networkResponse => {
              // Проверяем ответ
              if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic' && !event.request.url.includes('/api/')) {
                // Клонируем ответ (поток можно использовать только один раз)
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, responseToCache);
                  });
              }
              return networkResponse;
            }
          ).catch(() => {
            // Сетевой запрос не удался, но у нас уже есть кешированный ответ
            return response;
          });
          
          // Возвращаем кешированный ответ, не дожидаясь обновления
          return response;
        }

        // Если нет в кеше, пытаемся получить из сети
        return fetch(event.request)
          .then(response => {
            // Проверка ответа
            if (!response || response.status !== 200 || response.type !== 'basic' || event.request.url.includes('/api/')) {
              return response;
            }

            // Клонируем ответ
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.log('Fetch failed:', error);
            // Можно здесь вернуть резервный контент для офлайн-режима
          });
      })
  );
});

// Очистка старых кешей при активации
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
