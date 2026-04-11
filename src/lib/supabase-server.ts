/**
 * Server-side Supabase helpers — use only in Server Components / route handlers.
 * These functions fetch data directly from Supabase without going through the Zustand store.
 *
 * All exported functions are wrapped with React `cache()` so multiple calls within
 * the same request (e.g. generateMetadata + page component) share a single Supabase fetch.
 */
import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SiteContent, BlogPost } from '../types';
import { INITIAL_SITE_CONTENT } from '../constants';
import { mergeContent } from '../store/mergeContent';

function getServerClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
}

function mapRowToBlogPost(row: Record<string, unknown>): BlogPost {
    return {
        id: row.id as string,
        slug: row.slug as string,
        title: row.title as string,
        excerpt: (row.excerpt as string) || '',
        content: (row.content as string) || '',
        featuredImage: (row.featured_image as string) || '',
        category: (row.category as string) || '',
        tags: (row.tags as string[]) || [],
        author: (row.author as string) || 'Ata Flug Transfer',
        publishedAt: (row.published_at as string) || new Date().toISOString(),
        updatedAt: (row.updated_at as string) || new Date().toISOString(),
        seoTitle: (row.seo_title as string) || '',
        seoDescription: (row.seo_description as string) || '',
        isPublished: (row.is_published as boolean) || false,
        viewCount: (row.view_count as number) || 0,
    };
}

export const fetchSiteContent = cache(async function (): Promise<SiteContent> {
    const client = getServerClient();
    if (!client) return INITIAL_SITE_CONTENT;

    const { data, error } = await client
        .from('site_content')
        .select('content')
        .eq('id', 1)
        .single();

    if (error || !data?.content) return INITIAL_SITE_CONTENT;
    return mergeContent(data.content as SiteContent);
});

export const fetchBlogPosts = cache(async function (): Promise<BlogPost[]> {
    const client = getServerClient();
    if (!client) return [];

    const { data, error } = await client
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((row: Record<string, unknown>) => mapRowToBlogPost(row));
});

export const fetchPublishedBlogPost = cache(async function (slug: string): Promise<BlogPost | null> {
    const client = getServerClient();
    if (!client) return null;

    const { data, error } = await client
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    if (error || !data) return null;
    return mapRowToBlogPost(data as Record<string, unknown>);
});
