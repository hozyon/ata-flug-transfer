import { type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n';
import { updateSession } from './src/utils/supabase/middleware'

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
    // 1. Update Supabase session
    const supabaseResponse = await updateSession(request);

    // 2. Run intl middleware
    const response = intlMiddleware(request);

    // 3. Merge headers from supabaseResponse to response
    // (This is important for cookie setting)
    supabaseResponse.headers.forEach((value, key) => {
        response.headers.set(key, value);
    });

    return response;
}

export const config = {
    // Match all pathnames except for:
    // - _next/static (Next.js static files)
    // - _next/image (Next.js image optimization)
    // - favicon, logo, manifest, sw.js, bg images, public assets
    matcher: [
        '/((?!api|_next|_vercel|.*\\..*).*)',
        '/([a-z]{2})/:path*',
    ],
};
