const CACHE_NAME = 'ata-flug-v2';
const SUPABASE_HOST = 'rnymtrtbhvkyvgzweswi.supabase.co';

const STATIC_ASSETS = [
    '/',
    '/logo.png',
    '/manifest.json',
    '/bg1.webp',
    '/bg2.webp',
    '/bg3.webp',
];

// Install — pre-cache critical static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// Activate — delete all caches from previous versions
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch — tiered caching strategy
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Strategy B: Network-only for Supabase — never cache dynamic booking/auth data
    if (url.hostname === SUPABASE_HOST) {
        event.respondWith(fetch(request));
        return;
    }

    // Strategy A: Cache-first for immutable hashed Vite assets + all images
    const isHashedAsset = url.pathname.startsWith('/assets/');
    const isImage = /\.(webp|png|jpg|jpeg|svg|ico|gif)$/.test(url.pathname);
    if (isHashedAsset || isImage) {
        event.respondWith(
            caches.match(request).then(cached => {
                if (cached) return cached;
                return fetch(request).then(response => {
                    if (response.ok && url.origin === self.location.origin) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    }
                    return response;
                });
            })
        );
        return;
    }

    // Strategy C: Network-first with cache fallback for HTML navigation
    const isNavigation = request.mode === 'navigate' ||
        request.headers.get('Accept')?.includes('text/html');
    if (isNavigation) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(request).then(cached => cached || caches.match('/')))
        );
        return;
    }

    // Strategy D: Network-first with cache fallback for everything else
    event.respondWith(
        fetch(request)
            .then(response => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                }
                return response;
            })
            .catch(() => caches.match(request))
    );
});
