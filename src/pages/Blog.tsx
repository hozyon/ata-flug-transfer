import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../i18n/LanguageContext';
import { useSiteContent } from '../SiteContext';
import { useAppStore } from '../store/useAppStore';

const Blog: React.FC = () => {
    const { t } = useLanguage();
    const { siteContent } = useSiteContent();
    const blogPosts = useAppStore(s => s.blogPosts);
    const businessName = siteContent.business.name;
    const canonicalBase = siteContent.seo?.canonicalUrl || '';

    // Auto-translate blog post fields
    const translatePost = (post: typeof blogPosts[0]) => ({
        title: t(post.title),
        category: t(post.category),
        excerpt: t(post.excerpt),
    });
    const publishedPosts = blogPosts.filter(post => post.isPublished);

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
        <div className="min-h-screen" style={{ background: '#020617' }}>
            <Helmet>
                <title>{t('blogPage.title')} | {businessName}</title>
                <meta name="description" content={siteContent.seo?.pagesSeo?.blog?.description || 'Antalya havalimanı transfer rehberi, gezilecek yerler, tatil ipuçları ve daha fazlası.'} />
                <meta name="keywords" content={siteContent.seo?.pagesSeo?.blog?.keywords || siteContent.seo?.siteKeywords || ''} />
                <meta name="robots" content={siteContent.seo?.robotsDirective || 'index, follow'} />
                <link rel="canonical" href={`${canonicalBase}/blog`} />
                <meta property="og:title" content={`${t('blogPage.title')} | ${businessName}`} />
                <meta property="og:description" content={siteContent.seo?.pagesSeo?.blog?.description || 'Antalya havalimanı transfer rehberi, gezilecek yerler, tatil ipuçları ve daha fazlası.'} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${canonicalBase}/blog`} />
                <meta property="og:image" content={siteContent.seo?.ogImage || ''} />
                <meta property="og:locale" content="tr_TR" />
                <meta property="og:site_name" content={businessName} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={siteContent.seo?.twitterHandle || ''} />
                <meta name="twitter:title" content={`${t('blogPage.title')} | ${businessName}`} />
                <meta name="twitter:description" content={siteContent.seo?.pagesSeo?.blog?.description || 'Antalya transfer rehberi ve gezi blogu.'} />
            </Helmet>

            {/* Premium Header */}
            {/* Premium Header - Blog Banner */}
            <div className="relative pt-28 pb-14 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/contact-banner.png"
                        alt="Antalya Blog Banner"
                        className="w-full h-full object-cover object-center scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 transition-colors duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-slate-900/40 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-4 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                        <span>{t('blogPage.eyebrow')}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-4 leading-none tracking-tight drop-shadow-2xl">
                        {t('blogPage.title')}
                    </h1>
                    <p className="text-slate-100/90 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed drop-shadow-md">
                        {t('blogPage.subtitle')}
                    </p>
                </div>
            </div>

            {/* Blog Grid */}
            <section className="py-12 md:py-16 relative z-10" style={{ background: 'linear-gradient(180deg, #060a14 0%, #080c16 100%)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                        {currentPosts.map((post) => {
                            const tp = translatePost(post);
                            return (
                                <Link
                                    to={`/blog/${post.slug}`}
                                    key={post.id}
                                    className="group flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-0.5"
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/3] overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                        <div className="absolute inset-0 bg-white/[0.03] group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                                        <img
                                            src={post.featuredImage}
                                            alt={tp.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] will-change-transform"
                                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder-blog.jpg'; }}
                                        />
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full" style={{ background: 'rgba(197,160,89,0.15)', color: '#c5a059' }}>
                                                {tp.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-5 flex flex-col">
                                        <h2 className="text-lg font-playfair font-bold text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug line-clamp-2">
                                            {tp.title}
                                        </h2>
                                        <p className="text-white/50 text-xs leading-relaxed mb-4 line-clamp-3">
                                            {tp.excerpt}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.07]">
                                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-medium">
                                                <i className="fa-regular fa-calendar"></i>
                                                <span>{new Date(post.publishedAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                                <span>{t('blogPage.read')}</span>
                                                <i className="fa-solid fa-arrow-right"></i>
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
                                className="w-11 h-11 rounded-full flex items-center justify-center border border-white/10 text-white/50 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/50 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentPage === page
                                        ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 scale-110'
                                        : 'border border-white/10 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                                        }`}
                                    style={currentPage !== page ? { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' } : {}}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="w-11 h-11 rounded-full flex items-center justify-center border border-white/10 text-white/50 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white/50 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-[var(--color-dark)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="font-playfair font-bold text-white leading-tight mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>{t('blogPage.ctaTitle')}</h2>
                    <p className="text-white/40 mb-8 max-w-xl mx-auto text-sm">
                        {t('blogPage.ctaDesc')}
                    </p>
                    <a
                        href={`https://wa.me/${siteContent.business.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 text-white font-bold px-8 py-3.5 rounded-2xl transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                        style={{ background: '#25D366' }}
                    >
                        <i className="fa-brands fa-whatsapp text-xl"></i>
                        <span>{t('blogPage.ctaBtn')}</span>
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Blog;
