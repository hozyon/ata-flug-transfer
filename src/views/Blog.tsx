'use client';

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '../types';

interface BlogProps {
    blogPosts: BlogPost[];
}

const Blog: React.FC<BlogProps> = ({ blogPosts }) => {
    const publishedPosts = blogPosts.filter((post: BlogPost) => post.isPublished);

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(publishedPosts.length / itemsPerPage);

    const currentPosts = publishedPosts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-white">
            {/* ── BANNER ── */}
            <section className="pt-40 pb-20 border-b border-gray-100 reveal">
                <div className="max-w-[1400px] mx-auto px-6">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-6">Seyahat Günlüğü</p>
                    <h1 className="text-6xl sm:text-[100px] font-playfair font-medium text-[#111] tracking-tighter leading-[0.9]">
                        Antalya <br />
                        <span className="italic font-light text-[#555]">Keşif Rehberi.</span>
                    </h1>
                </div>
            </section>

            <div className="max-w-[1400px] mx-auto px-6 py-24 sm:py-32">
                {publishedPosts.length === 0 ? (
                    <div className="text-center py-32 border-t border-b border-gray-100 reveal">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888]">Henüz Günce Eklenmedi.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-16 sm:gap-24 reveal-stagger">
                            {currentPosts.map((post, idx) => {
                                const isFeatured = idx === 0 && currentPage === 1;
                                
                                return (
                                    <Link key={post.id} href={`/blog/${post.slug}`} className={`group flex flex-col ${isFeatured ? 'md:flex-row border-b border-gray-100 pb-24' : 'md:flex-row-reverse md:items-center gap-12'}`}>
                                        <div className={`relative ${isFeatured ? 'w-full md:w-3/5 aspect-[16/9]' : 'w-full md:w-1/2 aspect-[4/3]'} overflow-hidden bg-gray-50 mb-8 md:mb-0`}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={post.featuredImage || '/bg1.webp'} alt={post.title} className={`w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105 ${isFeatured ? '' : 'grayscale group-hover:grayscale-0'}`} />
                                        </div>
                                        
                                        <div className={`flex flex-col justify-center ${isFeatured ? 'w-full md:w-2/5 md:pl-16 mt-8 md:mt-0' : 'w-full md:w-1/2'}`}>
                                            <div className="flex gap-4 items-center mb-6">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888]">
                                                    {post.category || 'Rehber'}
                                                </span>
                                                <span className="w-8 h-[1px] bg-gray-300" />
                                                <span className="text-[10px] uppercase tracking-[0.1em] text-[#888]">
                                                    {post.author || 'M. Hizmetleri'}
                                                </span>
                                            </div>
                                            
                                            <h3 className={`${isFeatured ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-4xl'} font-playfair font-medium text-[#111] mb-6 group-hover:italic transition-all leading-tight`}>
                                                {post.title}
                                            </h3>
                                            
                                            <p className="text-[#555] font-outfit text-sm leading-relaxed mb-8 max-w-md">
                                                {post.excerpt}
                                            </p>

                                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] border-b border-[#111] self-start pb-1">
                                                Okumaya Başla
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-32 flex justify-center gap-4 reveal">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className={`w-12 h-12 flex items-center justify-center border font-outfit transition-all ${currentPage === i + 1 ? 'border-[#111] bg-[#111] text-white' : 'border-gray-200 text-[#111] hover:border-[#111]'}`}>
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
