// Enhanced Service Worker with proper asset versioning
const CACHE_VERSION = Date.now().toString() // Dynamic versioning based on deployment time
const STATIC_CACHE = `tabata-static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `tabata-dynamic-${CACHE_VERSION}`

// Assets to cache on install
const STATIC_ASSETS = ['/', '/manifest.json', '/tabata-icon.png', '/vite.svg']

// Install event
self.addEventListener('install', (event) => {
  console.log('SW: Installing version', CACHE_VERSION)
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()), // Force activation
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('SW: Activating version', CACHE_VERSION)
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('SW: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()), // Take control immediately
  )
})

// Fetch event - handle different request types
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Handle HTML requests - always try network first
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful HTML responses
          if (response.ok) {
            const cache = caches.open(DYNAMIC_CACHE)
            cache.then((c) => c.put(request, response.clone()))
          }
          return response
        })
        .catch(() => {
          // Fallback to cached version if network fails
          return caches.match(request)
        }),
    )
    return
  }

  // Handle asset requests (JS, CSS, images)
  if (
    url.pathname.includes('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Always try network first for assets to get latest version
          if (response.ok) {
            const cache = caches.open(DYNAMIC_CACHE)
            cache.then((c) => c.put(request, response.clone()))
          }
          return response
        })
        .catch(() => {
          // Only fallback to cache if network fails
          return caches.match(request)
        }),
    )
    return
  }

  // For other requests, just go to network
  event.respondWith(fetch(request))
})
