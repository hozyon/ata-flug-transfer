'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLanguage } from '../i18n/LanguageContext';
import { BlogPost } from '../types';

interface BlogProps {
    blogPosts: BlogPost[];
}

const Blog: React.FC<BlogProps> = ({ blogPosts }) => {
    const t = useTranslations('blogPage');
    const { t: tCMS } = useLanguage();

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

    const currentPosts = publishedPosts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-[#020617] pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6 tracking-tight">
                        {t('title')} <span className="text-[#c5a059]">{t('titleAccent')}</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Grid */}
                {publishedPosts.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <i className="fa-solid fa-newspaper text-5xl text-white/10 mb-4 block"></i>
                        <p className="text-slate-500">{t('noPosts')}</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentPosts.map((post) => {
                                const translated = translatePost(post);
                                return (
                                    <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-white/[0.03] border border-white/[0.06] hover:border-[#c5a059]/30">
                                        <div className="relative h-48 overflow-hidden">
                                            <Image src={post.featuredImage || '/bg1.webp'} alt={translated.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
                                            <span className="absolute bottom-3 left-4 text-[10px] font-bold text-white/90 rounded-full px-3 py-1 bg-[#c5a059]/20 border border-[#c5a059]/30 backdrop-blur-md">
                                                {translated.category}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-base font-bold text-white mb-3 group-hover:text-[#c5a059] transition-colors leading-snug line-clamp-2">{translated.title}</h3>
                                            <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-4">{translated.excerpt}</p>
                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">
                                                        {post.author.charAt(0)}
                                                    </div>
                                                    <span className="text-[10px] font-medium text-slate-500">{post.author}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#c5a059] uppercase tracking-widest">
                                                    {t('read')} <i className="fa-solid fa-arrow-right text-[8px]"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex justify-center gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} onClick={() => { setCurrentPage(i + 1); window.scrollTo(0, 0); }}
                                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1 ? 'bg-[#c5a059] text-[#020617] shadow-lg shadow-[#c5a059]/20' : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white border border-white/5'}`}>
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Blog;
