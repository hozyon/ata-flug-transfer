'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '../types';

interface BlogProps {
    blogPosts: BlogPost[];
}

const Blog: React.FC<BlogProps> = ({ blogPosts }) => {
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
        <div className="min-h-screen bg-[#fafafa] pt-48 pb-32">
            <div className="max-w-7xl mx-auto px-6">
                {/* ── Header ── */}
                <div className="text-center mb-24 reveal">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#f8f7f4] text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.3em] border border-black/5 mb-8 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
                        <span>KEŞİF REHBERİ</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-playfair font-medium text-[#0a0a0a] mb-8 tracking-tighter leading-none">
                        Antalya <span className="italic text-[#c5a059]">Günlükleri</span>
                    </h1>
                    <p className="text-[#666] text-lg md:text-xl font-light tracking-tight max-w-2xl mx-auto">
                        Antalya'nın gizli kalmış rotalarından VIP seyahat ipuçlarına kadar her şey.
                    </p>
                </div>

                {/* ── Grid ── */}
                {publishedPosts.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-black/[0.03] editorial-shadow reveal">
                        <div className="w-20 h-20 rounded-full bg-[#fafafa] flex items-center justify-center mx-auto mb-8">
                            <i className="fa-solid fa-newspaper text-2xl text-black/10"></i>
                        </div>
                        <p className="text-black/40 font-light italic">Henüz bir yazı paylaşılmadı.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 reveal-stagger">
                            {currentPosts.map((post) => {
                                return (
                                    <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col transition-all duration-700">
                                        <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] editorial-shadow-lg mb-8">
                                            <Image src={post.featuredImage || '/bg1.webp'} alt={post.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                            <span className="absolute top-6 left-6 text-[10px] font-bold text-white uppercase tracking-widest rounded-full px-4 py-1.5 bg-black/20 backdrop-blur-md border border-white/10">
                                                {post.category}
                                            </span>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-2xl font-playfair font-bold text-[#0a0a0a] mb-4 group-hover:text-[#c5a059] transition-colors leading-tight">{post.title}</h3>
                                            <p className="text-[#666] text-sm font-light leading-relaxed line-clamp-3 mb-6">{post.excerpt}</p>
                                            
                                            <div className="flex items-center justify-between pt-6 border-t border-black/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#f8f7f4] flex items-center justify-center text-[10px] font-bold text-black/30 border border-black/5">
                                                        {post.author.charAt(0)}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-black/40">{post.author}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[#c5a059] group-hover:translate-x-2 transition-transform duration-500">
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Oku</span>
                                                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* ── Pagination ── */}
                        {totalPages > 1 && (
                            <div className="mt-24 flex justify-center gap-3 reveal">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className={`w-12 h-12 rounded-full font-bold text-xs transition-all ${currentPage === i + 1 ? 'bg-[#c5a059] text-white shadow-lg shadow-[#c5a059]/20' : 'bg-white border border-black/5 text-black hover:bg-black/5'}`}>
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
