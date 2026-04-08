import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n';

export default createMiddleware(routing);

export const config = {
    // Match all pathnames except for:
    // - _next/static (Next.js static files)
    // - _next/image (Next.js image optimization)
    // - favicon, logo, manifest, sw.js, bg images, public assets
    matcher: [
        '/((?!_next|_vercel|.*\\..*).*)',
        '/([a-z]{2})/:path*',
    ],
};
