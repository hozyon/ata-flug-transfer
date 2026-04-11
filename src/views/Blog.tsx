'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLanguage } from '../i18n/LanguageContext';
import { useSiteContent } from '../SiteContext';
import useSWR from 'swr';
import { fetcher } from '../utils/supabase/fetcher';
import { BlogPost } from '../types';

const Blog: React.FC = () => {
    const t = useTranslations('blogPage');
    const { t: tCMS } = useLanguage();
    const { siteContent } = useSiteContent();
    const { data: blogRaw } = useSWR('blog_posts', fetcher);
    const blogPosts: BlogPost[] = blogRaw?.map((row: any) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt || '',
        content: row.content || '',
        featuredImage: row.featured_image || '',
        category: row.category || '',
        tags: row.tags || [],
        author: row.author || 'Ata Flug Transfer',
        publishedAt: row.published_at,
        updatedAt: row.updated_at,
        seoTitle: row.seo_title || '',
        seoDescription: row.seo_description || '',
        isPublished: row.is_published,
        viewCount: row.view_count || 0,
    })) || [];

    const pathname = usePathname();
    const localeMatch = pathname?.match(/^\/([a-z]{2})(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : 'tr';

    // Auto-translate blog post fields
    const translatePost = (post: BlogPost) => ({
        title: tCMS(post.title),
        category: tCMS(post.category),
        excerpt: tCMS(post.excerpt),
    });

    const publishedPosts = blogPosts.filter((post: BlogPost) => post.isPublished);


    // Pagination
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(publishedPosts.length / itemsPerPage);

    // Scroll to top on page change
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const currentPosts = publishedPosts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
            {/* SEO handled by generateMetadata() in page.tsx */}

            {/* Premium Header */}
            {/* Premium Header - Blog Banner */}
            <div className="relative pt-28 pb-14 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/contact-banner.png"
                        alt="Antalya Blog Banner"
                        fill
                        priority
                        className="object-cover object-center scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 transition-colors duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-slate-900/40 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-4 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                        <span>{t('eyebrow')}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-4 leading-none tracking-tight drop-shadow-2xl">
                        {t('title')}
                    </h1>
                    <p className="text-slate-100/90 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed drop-shadow-md">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            {/* Blog Grid */}
            <section className="py-12 md:py-16 relative z-10" style={{ background: '#f8f7f4' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                        {currentPosts.map((post) => {
                            const tp = translatePost(post);
                            return (
                                <Link
                                    href={`/${locale}/blog/${post.slug}`}
                                    key={post.id}
                                    className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                        <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={post.featuredImage}
                                            alt={tp.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] will-change-transform"
                                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder-blog.jpg'; }}
                                        />
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="inline-block px-3 py-1 bg-white text-[var(--color-dark)] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                                                {tp.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-5 flex flex-col">
                                        <h2 className="text-lg font-playfair font-bold text-slate-800 mb-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug line-clamp-2">
                                            {tp.title}
                                        </h2>
                                        <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-3">
                                            {tp.excerpt}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium">
                                                <i className="fa-regular fa-calendar" aria-hidden="true"></i>
                                                <span>{new Date(post.publishedAt || post.updatedAt || 0).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                                <span>{t('read')}</span>
                                                <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-16 flex justify-center items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-11 h-11 rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentPage === page
                                        ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 scale-110'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="w-11 h-11 rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-[var(--color-dark)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="font-playfair font-bold text-white leading-tight mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>{t('ctaTitle')}</h2>
                    <p className="text-white/40 mb-8 max-w-xl mx-auto text-sm">
                        {t('ctaDesc')}
                    </p>
                    <a
                        href={`https://wa.me/${siteContent.business.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 text-white font-bold px-8 py-3.5 rounded-2xl transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                        style={{ background: '#25D366' }}
                    >
                        <i className="fa-brands fa-whatsapp text-xl" aria-hidden="true"></i>
                        <span>{t('ctaBtn')}</span>
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Blog;
