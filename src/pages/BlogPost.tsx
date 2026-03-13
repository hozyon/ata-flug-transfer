
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BLOG_POSTS, BUSINESS_INFO } from '../constants';
import TextureBackground from '../components/TextureBackground';
import { useLanguage } from '../i18n/LanguageContext';

const BlogPost: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { t, language } = useLanguage();
    const post = BLOG_POSTS.find(p => p.slug === slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!post) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center px-4">
                    <h1 className="text-6xl font-playfair font-bold text-slate-800 mb-4">404</h1>
                    <p className="text-slate-500 text-lg mb-8">{t('blogPost.notFound')}</p>
                    <Link to="/blog" className="inline-flex items-center gap-2 bg-[#c5a059] text-white px-8 py-3 rounded-full hover:bg-amber-600 transition-colors">
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>{t('blogPost.backToBlog')}</span>
                    </Link>
                </div>
            </div>
        );
    }

    // Auto-translate all blog post fields
    const translatedTitle = t(post.title);
    const translatedCategory = t(post.category);
    const translatedExcerpt = t(post.excerpt);
    const translatedContent = t(post.content);

    const formatContent = (content: string) => {
        // Improved simple markdown parser
        let html = content
            .replace(/^# (.*$)/gm, '<h1 class="text-4xl md:text-5xl font-playfair font-bold text-slate-900 mb-8 mt-12 leading-tight">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 class="text-2xl md:text-3xl font-playfair font-bold text-slate-800 mt-12 mb-6 border-l-4 border-[#c5a059] pl-4">$1</h2>')
            .replace(/^### (.*$)/gm, '<h3 class="text-xl md:text-2xl font-bold text-slate-800 mt-8 mb-4">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
            .replace(/^- (.*$)/gm, '<li class="flex items-start gap-3 mb-3 text-slate-600"><span class="mt-2 w-1.5 h-1.5 bg-[#c5a059] rounded-full flex-shrink-0"></span><span>$1</span></li>')
            .replace(/^(\d+)\. \*\*(.*?)\*\* - (.*$)/gm, '<li class="mb-4 ml-4 list-decimal marker:text-[#c5a059] pl-2 text-slate-600"><strong>$2</strong> - $3</li>')
            .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-[#c5a059]/30 bg-[#c5a059]/5 p-6 italic text-slate-700 my-8 rounded-r-lg relative"><i class="fa-solid fa-quote-left absolute top-4 left-2 text-[#c5a059]/20 text-2xl"></i>$1</blockquote>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#c5a059] font-bold hover:underline decoration-2 underline-offset-2">$1</a>')
            .replace(/\n\n/g, '<div class="h-4"></div>') // spacing
            .replace(/\n/g, ' '); // collapse single newlines

        return html;
    };

    const otherPosts = BLOG_POSTS.filter(p => p.id !== post?.id && p.isPublished).slice(0, 3);

    return (
        <div className="min-h-screen bg-slate-50">
            <Helmet>
                <title>{translatedTitle} | Ata Flug Transfer</title>
                <meta name="description" content={translatedExcerpt} />
                <meta property="og:title" content={translatedTitle} />
                <meta property="og:description" content={translatedExcerpt} />
                <meta property="og:image" content={post.featuredImage} />
                <meta property="og:type" content="article" />
            </Helmet>

            {/* Immersive Hero */}
            <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
                <div className="absolute inset-0">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full pb-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="max-w-3xl">
                            <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors group relative z-50">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-[#c5a059] transition-colors">
                                    <i className="fa-solid fa-arrow-left text-sm"></i>
                                </div>
                                <span className="font-medium tracking-wide text-sm">{t('blogPost.allPosts')}</span>
                            </Link>

                            <div className="flex flex-wrap gap-4 mb-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-lg">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse"></span>
                                    <span>{translatedCategory}</span>
                                </div>
                                <span className="bg-white/20 backdrop-blur-md text-white border border-white/20 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2">
                                    <i className="fa-regular fa-clock"></i>
                                    {new Date(post.publishedAt).toLocaleDateString('tr-TR')}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                                {translatedTitle}
                            </h1>

                            <div className="flex items-center gap-4 text-white/80 border-t border-white/10 pt-4 mt-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#c5a059] font-bold border border-white/10">
                                        AF
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-wider text-white/50">{t('blogPost.author')}</span>
                                        <span className="font-medium text-white">Ata Flug Editör</span>
                                    </div>
                                </div>
                                <div className="h-8 w-px bg-white/20 mx-2"></div>
                                <div className="flex flex-col">
                                    <span className="text-xs uppercase tracking-wider text-white/50">{t('blogPost.readTime')}</span>
                                    <span className="font-medium text-white">{t('blogPost.readMin')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 -mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-8">
                            <article className="bg-white rounded-t-3xl shadow-xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
                                <TextureBackground />
                                <div
                                    className="prose prose-lg max-w-none prose-headings:font-playfair prose-slate relative z-10"
                                    dangerouslySetInnerHTML={{ __html: formatContent(translatedContent) }}
                                />

                                {/* Tags */}
                                <div className="mt-12 pt-8 border-t border-slate-100 relative z-10">
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map(tag => (
                                            <span key={tag} className="bg-slate-50 text-slate-500 text-sm px-4 py-2 rounded-full hover:bg-[#c5a059] hover:text-white transition-colors cursor-default">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        </div>

                        {/* Sidebar (Sticky) */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Booking Card */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 sticky top-32">
                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 text-2xl">
                                        <i className="fa-brands fa-whatsapp"></i>
                                    </div>
                                    <h3 className="text-2xl font-playfair font-bold text-slate-800">{t('blogPost.sidebarTitle')}</h3>
                                    <p className="text-slate-500 mt-2 text-sm">
                                        {t('blogPost.sidebarDesc')}
                                    </p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <i className="fa-solid fa-check-circle text-green-500 text-xl"></i>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700 text-sm">{t('blogPost.liveSupport')}</span>
                                            <span className="text-slate-400 text-xs">{t('blogPost.liveSupportDesc')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <i className="fa-solid fa-shield-alt text-[#c5a059] text-xl"></i>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700 text-sm">{t('blogPost.license')}</span>
                                            <span className="text-slate-400 text-xs">{t('blogPost.licenseDesc')}</span>
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${t('blogPost.waMsg')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-center font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 transition-all transform hover:-translate-y-1"
                                >
                                    {t('blogPost.waContact')}
                                </a>
                                <p className="text-center text-xs text-slate-400 mt-4">{t('blogPost.avgResponse')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Read Next */}
            <section className="py-20 bg-slate-50 border-t border-slate-200 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-playfair font-bold text-slate-800">{t('blogPost.readAlso')}</h2>
                        <Link to="/blog" className="text-[#c5a059] font-bold hover:underline">{t('blogPost.viewAll')}</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {otherPosts.map(p => (
                            <Link to={`/blog/${p.slug}`} key={p.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={p.featuredImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-3 py-1 rounded-full">{p.category}</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#c5a059] transition-colors line-clamp-2 mb-2">
                                        {p.title}
                                    </h3>
                                    <div className="flex items-center text-slate-400 text-xs">
                                        <i className="fa-regular fa-calendar mr-2"></i>
                                        {new Date(p.publishedAt).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogPost;
