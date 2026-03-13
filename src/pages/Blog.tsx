import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS, BUSINESS_INFO } from '../constants';
import TextureBackground from '../components/TextureBackground';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../i18n/LanguageContext';

const Blog: React.FC = () => {
    const { t } = useLanguage();

    // Auto-translate blog post fields
    const translatePost = (post: typeof BLOG_POSTS[0]) => ({
        title: t(post.title),
        category: t(post.category),
        excerpt: t(post.excerpt),
    });
    const publishedPosts = BLOG_POSTS.filter(post => post.isPublished);

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
        <div className="min-h-screen bg-slate-50">
            <Helmet>
                <title>Blog - Antalya Transfer Rehberi | Ata Flug</title>
                <meta name="description" content="Antalya havalimanı transfer rehberi, gezilecek yerler, tatil ipuçları ve daha fazlası. Antalya'nın en güncel gezi blogu." />
            </Helmet>

            {/* Premium Header */}
            {/* Premium Header - Blog Banner */}
            <div className="relative pt-28 pb-12 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/images/contact-banner.png"
                        alt="Antalya Blog Banner"
                        className="w-full h-full object-cover object-center scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 transition-colors duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-slate-900/40 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-4 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse"></span>
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

            {/* Minimal Blog Grid */}
            <section className="py-20 relative z-10">
                <TextureBackground />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {currentPosts.map((post) => {
                            const tp = translatePost(post);
                            return (
                                <Link
                                    to={`/blog/${post.slug}`}
                                    key={post.id}
                                    className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                        <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                                        <img
                                            src={post.featuredImage}
                                            alt={tp.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] will-change-transform"
                                        />
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="inline-block px-3 py-1 bg-white text-[#0f172a] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                                                {tp.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-5 flex flex-col">
                                        <h2 className="text-lg font-playfair font-bold text-slate-800 mb-2 group-hover:text-[#c5a059] transition-colors leading-snug line-clamp-2">
                                            {tp.title}
                                        </h2>
                                        <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-3">
                                            {tp.excerpt}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium">
                                                <i className="fa-regular fa-calendar"></i>
                                                <span>{new Date(post.publishedAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[#c5a059] text-[10px] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
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
                                className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:border-[#c5a059] hover:text-[#c5a059] disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentPage === page
                                        ? 'bg-[#c5a059] text-white shadow-lg shadow-[#c5a059]/30 scale-110'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:border-[#c5a059] hover:text-[#c5a059]'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-500 hover:border-[#c5a059] hover:text-[#c5a059] disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-500 transition-colors"
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Minimal CTA */}
            <section className="py-20 bg-[#0f172a] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-6">{t('blogPage.ctaTitle')}</h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto text-lg">
                        {t('blogPage.ctaDesc')}
                    </p>
                    <a
                        href={`https://wa.me/${BUSINESS_INFO.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#20bd5a] transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:-translate-y-1"
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
