import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchSiteContent, fetchBlogPosts, fetchPublishedBlogPost } from '../../../../../lib/supabase-server';
import BlogPost from '../../../../../views/BlogPost';
import { routing } from '../../../../../../i18n';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
    const posts = await fetchBlogPosts();
    return routing.locales.flatMap(locale =>
        posts
            .filter(p => p.isPublished)
            .map(p => ({ locale, slug: p.slug }))
    );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const [content, post] = await Promise.all([fetchSiteContent(), fetchPublishedBlogPost(slug)]);

    if (!post) return { title: 'Blog Yazısı Bulunamadı' };

    const seo = content.seo;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';
    const url = `${baseUrl}/${locale}/blog/${slug}`;

    const title = post.seoTitle || post.title;
    const description = post.seoDescription || post.excerpt;

    const alternates: Record<string, string> = {};
    routing.locales.forEach(l => { alternates[l] = `${baseUrl}/${l}/blog/${slug}`; });

    return {
        title,
        description,
        robots: seo?.robotsDirective || 'index, follow',
        alternates: { canonical: url, languages: alternates },
        openGraph: {
            title,
            description,
            type: 'article',
            url,
            siteName: content.business.name,
            images: post.featuredImage ? [{ url: post.featuredImage, width: 1200, height: 630 }] : [],
            locale: locale === 'tr' ? 'tr_TR' : locale === 'de' ? 'de_DE' : 'en_US',
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: post.featuredImage ? [post.featuredImage] : [],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const [content, post] = await Promise.all([fetchSiteContent(), fetchPublishedBlogPost(slug)]);
    if (!post) notFound();

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.featuredImage,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: { '@type': 'Organization', name: content.business.name },
        publisher: {
            '@type': 'Organization',
            name: content.business.name,
            logo: { '@type': 'ImageObject', url: content.business.logo || '' },
        },
        url: `${baseUrl}/${(await params).locale}/blog/${slug}`,
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
            <BlogPost initialPost={post} />
        </>
    );
}
