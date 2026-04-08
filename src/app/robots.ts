import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/tr/admin', '/en/admin', '/de/admin', '/tr/login', '/en/login', '/de/login'],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
