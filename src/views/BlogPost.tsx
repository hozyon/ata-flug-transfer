'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import TextureBackground from '../components/TextureBackground';
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
                    <h1 className="text-6xl font-playfair font-bold text-slate-800 mb-4">404</h1>
                    <p className="text-slate-500 text-lg mb-8">Aradığınız içerik bulunamadı veya kaldırılmış olabilir.</p>
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
        <main className="min-h-screen bg-[#020617] pt-32 pb-20">
            <TextureBackground />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="px-3 py-1 rounded-full bg-[#c5a059]/10 text-[#c5a059] text-[10px] font-black uppercase tracking-widest border border-[#c5a059]/20">
                            {post.category}
                        </span>
                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('tr-TR') : ''}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-8 leading-[1.1] tracking-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 py-6 border-y border-white/5">
                        <div className="w-10 h-10 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center text-[#c5a059] font-black text-sm">
                            {post.author.charAt(0)}
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">{post.author}</p>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Editör</p>
                        </div>
                    </div>
                </div>

                {post.featuredImage && (
                    <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-black/50 border border-white/10 animate-in fade-in zoom-in-95 duration-1000 delay-200">
                        <Image src={post.featuredImage} alt={post.title} fill priority className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-40"></div>
                    </div>
                )}

                <article className="prose prose-invert prose-gold max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <div className="text-slate-300 text-lg leading-relaxed space-y-6"
                        dangerouslySetInnerHTML={{ __html: sanitize(post.content) }} />
                </article>

                <div className="mt-20 pt-10 border-t border-white/5 reveal">
                    <h3 className="text-white font-playfair font-bold text-2xl mb-8">İlginizi Çekebilir</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {blogPosts
                            .filter(p => p.id !== post.id && p.isPublished)
                            .slice(0, 2)
                            .map(related => (
                                <a key={related.id} href={`/blog/${related.slug}`} className="group p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-[#c5a059]/30 transition-all duration-300">
                                    <p className="text-[#c5a059] text-[10px] font-black uppercase tracking-widest mb-2">{related.category}</p>
                                    <h4 className="text-white font-bold group-hover:text-[#c5a059] transition-colors line-clamp-2">{related.title}</h4>
                                </a>
                            ))}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default BlogPost;
