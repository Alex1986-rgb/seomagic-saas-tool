
const CACHE_NAME = 'seo-audit-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/images/placeholder.jpg',
  '/og-image.jpg',
  '/index.css',
  '/main.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => 
          key !== STATIC_CACHE && 
          key !== DYNAMIC_CACHE
        ).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip API calls and other dynamic content
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('chrome-extension') ||
      event.request.url.includes('socket.io')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response
        const responseClone = response.clone();
        
        // Open dynamic cache and store the response
        caches.open(DYNAMIC_CACHE)
          .then(cache => {
            cache.put(event.request, responseClone);
          });
          
        return response;
      })
      .catch(() => {
        // If network fails, try to get from cache
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Return default offline page if nothing is cached
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            return new Response('', {
              status: 408,
              statusText: 'Request timeout'
            });
          });
      })
  );
});

// Background sync for offline support
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Implement background sync logic here
      Promise.resolve()
    );
  }
});
