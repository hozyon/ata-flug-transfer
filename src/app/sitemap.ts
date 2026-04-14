import type { MetadataRoute } from 'next';
import { fetchSiteContent, fetchBlogPosts } from '../lib/supabase-server';
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

    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(route => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    const regionEntries: MetadataRoute.Sitemap = content.regions
        .filter(r => r.price && r.price > 0)
        .map(region => ({
            url: `${BASE_URL}/transfer/${slugify(region.name)}-transfer`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));

    const blogEntries: MetadataRoute.Sitemap = posts
        .filter(p => p.isPublished)
        .map(post => ({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.publishedAt || Date.now()),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));

    return [...staticEntries, ...regionEntries, ...blogEntries];
}
