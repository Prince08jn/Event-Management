// Minimal service worker to prevent 404 errors
// This service worker does nothing but prevents the 404 error

self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let the browser handle all requests normally
  // This prevents any caching or offline behavior
  return;
});
