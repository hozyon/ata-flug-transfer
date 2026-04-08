import type { MetadataRoute } from 'next';
import { fetchSiteContent, fetchBlogPosts } from '../lib/supabase-server';
import { routing } from '../../i18n';
import { slugify } from '../utils/slugify';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';

const STATIC_ROUTES = [
    '',
    '/hakkimizda',
    '/vizyon-misyon',
    '/bolgeler',
    '/fiyatlar',
    '/sss',
    '/iletisim',
    '/blog',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [content, posts] = await Promise.all([fetchSiteContent(), fetchBlogPosts()]);

    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap(route =>
        routing.locales.map(locale => ({
            url: `${BASE_URL}/${locale}${route}`,
            lastModified: new Date(),
            changeFrequency: route === '' ? 'daily' : 'weekly' as const,
            priority: route === '' ? 1 : 0.8,
            alternates: {
                languages: Object.fromEntries(
                    routing.locales.map(l => [l, `${BASE_URL}/${l}${route}`])
                ),
            },
        }))
    );

    const regionEntries: MetadataRoute.Sitemap = content.regions
        .filter(r => r.isActive !== false)
        .flatMap(region =>
            routing.locales.map(locale => ({
                url: `${BASE_URL}/${locale}/transfer/${slugify(region.name)}-transfer`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.9,
                alternates: {
                    languages: Object.fromEntries(
                        routing.locales.map(l => [l, `${BASE_URL}/${l}/transfer/${slugify(region.name)}-transfer`])
                    ),
                },
            }))
        );

    const blogEntries: MetadataRoute.Sitemap = posts
        .filter(p => p.isPublished)
        .flatMap(post =>
            routing.locales.map(locale => ({
                url: `${BASE_URL}/${locale}/blog/${post.slug}`,
                lastModified: new Date(post.updatedAt || post.publishedAt || Date.now()),
                changeFrequency: 'monthly' as const,
                priority: 0.7,
                alternates: {
                    languages: Object.fromEntries(
                        routing.locales.map(l => [l, `${BASE_URL}/${l}/blog/${post.slug}`])
                    ),
                },
            }))
        );

    return [...staticEntries, ...regionEntries, ...blogEntries];
}
