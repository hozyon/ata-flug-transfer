import type { Metadata } from 'next';
import { fetchSiteContent, fetchBlogPosts } from '../../../../lib/supabase-server';
import Blog from '../../../../views/Blog';
import { routing } from '../../../../../i18n';

type Props = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
    return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const content = await fetchSiteContent();
    const seo = content.seo;
    const pageSeo = seo?.pagesSeo?.blog;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';
    const url = `${baseUrl}/${locale}/blog`;

    const title = pageSeo?.title || 'Blog';
    const description = pageSeo?.description || `Antalya transfer, tatil ve seyahat hakkında ipuçları ve rehberler.`;

    const alternates: Record<string, string> = {};
    routing.locales.forEach(l => { alternates[l] = `${baseUrl}/${l}/blog`; });

    return {
        title,
        description,
        keywords: pageSeo?.keywords || seo?.siteKeywords,
        robots: seo?.robotsDirective || 'index, follow',
        alternates: { canonical: url, languages: alternates },
        openGraph: {
            title,
            description,
            type: 'website',
            url,
            siteName: content.business.name,
            images: seo?.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630 }] : [],
            locale: locale === 'tr' ? 'tr_TR' : locale === 'de' ? 'de_DE' : 'en_US',
        },
        twitter: { card: 'summary_large_image', title, description },
    };
}

export default async function BlogPage({ params }: Props) {
    const { locale } = await params;
    const [content, posts] = await Promise.all([fetchSiteContent(), fetchBlogPosts()]);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';

    const publishedPosts = posts.filter(p => p.isPublished);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: `${content.business.name} Blog`,
        url: `${baseUrl}/${locale}/blog`,
        publisher: {
            '@type': 'Organization',
            name: content.business.name,
            url: baseUrl,
        },
        blogPost: publishedPosts.slice(0, 10).map(post => ({
            '@type': 'BlogPosting',
            headline: post.title,
            url: `${baseUrl}/${locale}/blog/${post.slug}`,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: { '@type': 'Person', name: post.author },
        })),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Blog />
        </>
    );
}
