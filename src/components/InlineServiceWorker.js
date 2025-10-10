// Inline Service Worker as backup for PWA functionality
// This gets injected directly into the page if sw.js can't be loaded

const inlineServiceWorkerScript = `
const CACHE_NAME = 'atcs-training-inline-v1.0';
const OFFLINE_URL = '/offline.html';

// Core assets to cache
const ASSETS_TO_CACHE = [
  '/',
  '/offline.html',
  '/logo.png',
  '/favicon.ico'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Inline Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching core assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Inline Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
            .then(cache => cache.match(OFFLINE_URL));
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
});
`;

// Function to register inline service worker
export function registerInlineServiceWorker() {
  if ('serviceWorker' in navigator) {
    // Create blob URL for the service worker
    const blob = new Blob([inlineServiceWorkerScript], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('✅ Inline Service Worker registered successfully:', registration.scope);
        
        // Clean up the blob URL after registration
        URL.revokeObjectURL(swUrl);
        
        return registration;
      })
      .catch(error => {
        console.error('Inline Service Worker registration failed:', error);
        URL.revokeObjectURL(swUrl);
      });
  }
}

export default inlineServiceWorkerScript;