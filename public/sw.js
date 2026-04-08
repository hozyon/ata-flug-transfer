const CACHE_NAME = 'ata-flug-v4';
const SUPABASE_HOST = 'rnymtrtbhvkyvgzweswi.supabase.co';

const STATIC_ASSETS = [
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
        event.respondWith(
            fetch(request).catch(() => new Response(JSON.stringify({ error: 'Network error' }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            }))
        );
        return;
    }

    // Strategy A: Cache-first for immutable hashed Next.js static assets + all images
    const isHashedAsset = url.pathname.startsWith('/_next/static/');
    const isImage = /\.(webp|png|jpg|jpeg|svg|ico|gif)$/.test(url.pathname);
    if (isHashedAsset || isImage) {
        event.respondWith(
            caches.match(request).then(cached => {
                if (cached) return cached;
                return fetch(request).then(response => {
                    // Never cache HTML responses for JS/asset URLs.
                    // Vercel's SPA rewrite returns index.html (200) for missing chunks,
                    // which would poison the cache and cause "text/html is not a valid
                    // JavaScript MIME type" errors on subsequent loads.
                    const ct = response.headers.get('content-type') || '';
                    if (response.ok && url.origin === self.location.origin && !ct.startsWith('text/html')) {
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
            // redirect:'manual' — pass redirect responses to the browser so it updates
            // the URL bar (e.g. / → /tr). Without this, the SW follows the redirect
            // internally, stores /tr HTML under /, and Next.js hydrates with wrong URL.
            fetch(request, { redirect: 'manual' })
                .then(response => {
                    // Opaque redirect (301/302) — let the browser handle it
                    if (response.type === 'opaqueredirect') return response;
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                    }
                    return response;
                })
                .catch(() => caches.match(request).then(cached => cached || caches.match('/tr')))
        );
        return;
    }

    // Strategy D: Network-first with cache fallback for everything else
    // Skip cross-origin requests that aren't Supabase (extensions, analytics, etc.)
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        fetch(request)
            .then(response => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                }
                return response;
            })
            .catch(() =>
                caches.match(request).then(cached =>
                    cached || new Response('', { status: 503 })
                )
            )
    );
});
