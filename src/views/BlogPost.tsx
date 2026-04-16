'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DOMPurify from 'dompurify';
import type { BlogPost as BlogPostType } from '../types';

interface BlogPostProps {
    initialPost?: BlogPostType;
    blogPosts: BlogPostType[];
}

const BlogPost: React.FC<BlogPostProps> = ({ initialPost, blogPosts }) => {
    const params = useParams();
    const slug = params?.slug as string;

    // Use server-fetched initialPost as fallback
    const post = blogPosts.find((p: BlogPostType) => p.slug === slug) ?? initialPost;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!post) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center px-4">
                    <h1 className="text-6xl font-playfair font-bold text-[#0a0a0a] mb-4">404</h1>
                    <p className="text-[#666] text-lg mb-8">Aradığınız içerik bulunamadı.</p>
                </div>
            </div>
        );
    }

    const sanitize = (html: string) => {
        if (typeof window === 'undefined') return html;
        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'img', 'br'],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'target', 'rel']
        });
    };

    return (
        <main className="min-h-screen bg-[#fafafa] pt-48 pb-32">
            <div className="max-w-4xl mx-auto px-6">
                {/* ── Editorial Header ── */}
                <div className="mb-16 reveal">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="px-4 py-1 rounded-full bg-[#f8f7f4] text-[#c5a059] text-[10px] font-black uppercase tracking-widest border border-black/5 shadow-sm">
                            {post.category}
                        </span>
                        <span className="text-black/30 text-[10px] font-black uppercase tracking-[0.2em]">
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('tr-TR') : ''}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-medium text-[#0a0a0a] mb-12 leading-[1.1] tracking-tighter">
                        {post.title}
                    </h1>
                    
                    <div className="flex items-center gap-6 py-10 border-y border-black/5">
                        <div className="w-12 h-12 rounded-full bg-[#f8f7f4] border border-black/5 flex items-center justify-center text-black/20 font-black text-sm">
                            {post.author.charAt(0)}
                        </div>
                        <div>
                            <p className="text-[#1a1a1a] font-bold text-sm tracking-tight">{post.author}</p>
                            <p className="text-black/30 text-[10px] font-black uppercase tracking-widest">Ata Flug Editor</p>
                        </div>
                    </div>
                </div>

                {/* ── Featured Image ── */}
                {post.featuredImage && (
                    <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden mb-20 editorial-shadow-lg border border-black/5 reveal">
                        <Image src={post.featuredImage} alt={post.title} fill priority className="object-cover" />
                    </div>
                )}

                {/* ── Article Content ── */}
                <article className="reveal">
                    <div 
                        className="text-[#444] text-lg md:text-xl font-light leading-[1.8] space-y-8 editorial-content"
                        dangerouslySetInnerHTML={{ __html: sanitize(post.content) }} 
                    />
                </article>

                {/* ── Related Posts ── */}
                <div className="mt-32 pt-16 border-t border-black/5 reveal">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-[#0a0a0a] font-playfair font-medium text-3xl tracking-tight">İlginizi Çekebilir</h3>
                        <Link href="/blog" className="text-xs font-bold uppercase tracking-[0.2em] text-[#c5a059] hover:opacity-80 transition-opacity">Tümü</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {blogPosts
                            .filter(p => p.id !== post.id && p.isPublished)
                            .slice(0, 2)
                            .map(related => (
                                <a key={related.id} href={`/blog/${related.slug}`} className="group p-8 rounded-[2rem] bg-white border border-black/[0.03] hover:editorial-shadow transition-all duration-500">
                                    <p className="text-[#c5a059] text-[10px] font-black uppercase tracking-widest mb-3">{related.category}</p>
                                    <h4 className="text-[#1a1a1a] font-playfair font-bold text-xl group-hover:text-[#c5a059] transition-colors leading-tight">{related.title}</h4>
                                </a>
                            ))}
                    </div>
                </div>
            </div>

            {/* Content Styles */}
            <style jsx global>{`
                .editorial-content h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.5rem;
                    color: #0a0a0a;
                    margin-top: 4rem;
                    margin-bottom: 1.5rem;
                    line-height: 1.2;
                    letter-spacing: -0.02em;
                }
                .editorial-content h3 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.875rem;
                    color: #0a0a0a;
                    margin-top: 3rem;
                    margin-bottom: 1.25rem;
                    line-height: 1.3;
                }
                .editorial-content p {
                    margin-bottom: 2rem;
                }
                .editorial-content blockquote {
                    font-style: italic;
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    color: #c5a059;
                    border-left: 2px solid #c5a059;
                    padding-left: 2rem;
                    margin: 3rem 0;
                }
                .editorial-content ul {
                    list-style: none;
                    padding-left: 1.5rem;
                    margin-bottom: 2rem;
                }
                .editorial-content li {
                    position: relative;
                    margin-bottom: 1rem;
                }
                .editorial-content li::before {
                    content: "";
                    position: absolute;
                    left: -1.5rem;
                    top: 0.75rem;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: #c5a059;
                }
            `}</style>
        </main>
    );
};

export default BlogPost;
