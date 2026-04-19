'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '../store/useAppStore';
import { useSiteContent } from '../SiteContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { BlogPost, UserReview } from '../types';

interface HomePageProps {
    blogPosts: BlogPost[];
    userReviews: UserReview[];
}

export default function HomePage({ blogPosts, userReviews }: HomePageProps) {
    const { siteContent } = useSiteContent();
    const { setBookingFormOpen } = useAppStore();

    useScrollReveal();

    const randomBlogPosts = useMemo(() => {
        const published = blogPosts.filter(p => p.isPublished);
        return published.slice(0, 4);
    }, [blogPosts]);

    const pricedRegions = useMemo(() => siteContent.regions.filter(r => r.price && r.price > 0), [siteContent.regions]);

    const [priceSearch, setPriceSearch] = useState('');
    const sym = siteContent.currency?.symbol || '€';
    const sortedRegions = [...pricedRegions].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

    const activeRegions = priceSearch
        ? sortedRegions.filter(r => r.name.toLowerCase().includes(priceSearch.toLowerCase()) || String(r.price ?? '').includes(priceSearch))
        : sortedRegions;

    const stats = [
        { label: 'Memnun Misafir', val: '4.9', icon: 'fa-star' },
        { label: 'Yıllık Transfer', val: '10K+', icon: 'fa-location-arrow' },
        { label: 'Deneyim yılı', val: '15+', icon: 'fa-award' }
    ];

    const heroBgs = siteContent.hero.backgrounds || ['/bg1.webp', '/bg2.webp', '/bg3.webp'];
    const [currentBgIndex, setCurrentBgIndex] = useState(0);

    useEffect(() => {
        if (heroBgs.length <= 1) return;
        const id = setInterval(() => setCurrentBgIndex(prev => (prev + 1) % heroBgs.length), 10000);
        return () => clearInterval(id);
    }, [heroBgs.length]);

    return (
        <main className="min-h-screen bg-[var(--color-background)] overflow-hidden">
            
            {/* ── HERO CİNERAMA ── */}
            <section className="relative px-4 sm:px-6 pt-24 sm:pt-32 pb-6 max-w-[1400px] mx-auto min-h-[90vh] flex flex-col justify-end">
                <div className="absolute inset-x-4 sm:inset-x-6 top-6 bottom-6 rounded-3xl sm:rounded-[3rem] overflow-hidden bg-gray-100 shadow-2xl">
                    {heroBgs.map((bg, idx) => (
                        <div key={idx} className={`absolute inset-0 transition-opacity duration-[3000ms] ease-in-out ${idx === currentBgIndex ? 'opacity-100' : 'opacity-0'}`}>
                            <Image src={bg} alt="Luxury Transfer" fill priority={idx === 0} className="object-cover scale-100 animate-[slow-zoom_40s_infinite_alternate]" style={{ filter: 'contrast(1.05) brightness(0.95)' }} />
                        </div>
                    ))}
                    {/* Soft Vignette Overlay for Crisp Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>

                <div className="relative z-10 p-6 sm:p-16 w-full max-w-5xl">
                    <div className="reveal">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.3em] border border-white/20 mb-8 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></span>
                            Premium Service
                        </div>
                        <h1 className="text-5xl sm:text-7xl md:text-[7rem] font-playfair font-medium text-white tracking-tight leading-[0.95] mb-8">
                            Zarafetin <br className="hidden sm:block" />
                            <span className="text-white/80 italic text-4xl sm:text-6xl md:text-[5.5rem] font-light">Yeni Rotası.</span>
                        </h1>
                        <p className="text-white/90 text-lg sm:text-xl md:text-2xl font-light max-w-2xl leading-relaxed mb-10 text-shadow-sm">
                            Antalya'daki Premium Havalimanı Ulaşımınız. Konforlu, güvenilir ve size özel.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <button onClick={() => setBookingFormOpen(true)} className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 font-bold rounded-full hover:scale-105 transition-all duration-300 uppercase tracking-widest text-[11px] shadow-xl">
                                Ön Rezervasyon
                            </button>
                            <a href={`https://wa.me/${siteContent.business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-10 py-5 bg-black/30 backdrop-blur-md border border-white/30 text-white font-bold uppercase tracking-widest text-[11px] rounded-full hover:bg-black/50 transition-all duration-300 text-center">
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── BENTO FEATURES ── */}
            <section className="py-24 sm:py-32 bg-[var(--color-background)]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 reveal">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair text-gray-900 tracking-tight">Kusursuz Seçim</h2>
                        <p className="text-gray-500 font-medium tracking-wide uppercase text-xs mt-6">Neden Bizi Seçmelisiniz?</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 reveal-stagger">
                        <div className="md:col-span-2 bg-white rounded-3xl p-10 sm:p-14 border border-gray-200 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-transform duration-500">
                            <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-2xl mb-12 group-hover:scale-110 transition-transform"><i className="fa-solid fa-car-side" /></div>
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4">Lüks Araç Filosu</h3>
                                <p className="text-gray-500 leading-relaxed font-outfit text-lg">VIP tasarımlı, yeni model Mercedes-Benz araçlarımızla en üst düzey konforu deneyimleyin.</p>
                            </div>
                        </div>
                        <div className="bg-[#fcfaf7] rounded-3xl p-10 border border-gray-200/60 shadow-sm flex flex-col justify-between">
                            <div className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-xl mb-10"><i className="fa-solid fa-plane-arrival" /></div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-3">Tam Zamanında</h3>
                                <p className="text-gray-500 leading-relaxed font-outfit text-sm">Gecikme yok. Uçuşunuzu anlık takip ediyor, kapıda sizi bekliyoruz.</p>
                            </div>
                        </div>
                        <div className="bg-[#fcfaf7] rounded-3xl p-10 border border-gray-200/60 shadow-sm flex flex-col justify-between">
                            <div className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-xl mb-10"><i className="fa-solid fa-user-tie" /></div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-3">VIP Protokol</h3>
                                <p className="text-gray-500 leading-relaxed font-outfit text-sm">Özel eğitimli, şık, saygılı ve yabancı dil bilen şoförlerimiz hizmetinizde.</p>
                            </div>
                        </div>
                        <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 sm:p-14 border border-gray-800 shadow-xl flex flex-col justify-between overflow-hidden relative group">
                            <div className="absolute inset-0 bg-[var(--color-primary)] opacity-0 group-hover:opacity-5 transition-opacity duration-700" />
                            <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center text-2xl mb-12"><i className="fa-solid fa-gem" /></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">Size Özel Deneyim</h3>
                                <p className="text-gray-400 leading-relaxed font-outfit text-lg max-w-lg">Klasik bir transferden fazlası; misafirlerimizin tüm beklentilerini kusursuzca karşılamaya adanmış yolculuk anlayışı.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── REGIONS BENTO ── */}
            {pricedRegions.length > 0 && (
                <section className="py-24 sm:py-32 bg-white border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 reveal">
                            <div>
                                <h2 className="text-4xl sm:text-5xl font-playfair text-gray-900 tracking-tight">Popüler Rotalar</h2>
                                <p className="text-gray-500 font-medium tracking-wide uppercase text-xs mt-4">Antalya'dan her noktaya sabit fiyatlı lüks transfer</p>
                            </div>
                            <div className="w-full md:w-80 relative">
                                <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                                <input 
                                    type="text" 
                                    value={priceSearch} 
                                    onChange={e => setPriceSearch(e.target.value)} 
                                    placeholder="Gideceğiniz bölge..." 
                                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-all placeholder-gray-400 font-medium"
                                />
                            </div>
                        </div>

                        {activeRegions.length === 0 ? (
                            <p className="text-gray-400 text-center py-12 text-sm font-medium">Bölge bulunamadı. Lütfen WhatsApp üzerinden bilgi alınız.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 reveal-stagger">
                                {activeRegions.map((region, idx) => {
                                    const slug = region.name.toLowerCase().replace(/ /g, '-').replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c').replace(/[^a-z0-9-]/g, '');
                                    const isLarge = idx === 0 || idx === 5;
                                    return (
                                        <Link key={region.id} href={`/transfer/${slug}-transfer`} className={`group relative block rounded-3xl overflow-hidden border border-gray-100 bg-gray-50 aspect-[4/3] ${isLarge ? 'sm:col-span-2 aspect-[8/3] sm:aspect-[4/3] lg:aspect-[8/3]' : ''}`}>
                                            <Image src={region.image || '/bg1.webp'} alt={region.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                                            
                                            {region.price && (
                                                <div className="absolute top-5 left-5 px-4 py-1.5 rounded-full bg-white text-gray-900 text-[10px] font-black tracking-widest shadow-md">
                                                    {sym}{region.price}
                                                </div>
                                            )}
                                            
                                            <div className="absolute bottom-6 left-6 right-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-white tracking-tight">{region.name}</h3>
                                                        <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest mt-1">Hızlı İncele</p>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                        <i className="fa-solid fa-arrow-right text-xs" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                        
                        <div className="mt-12 text-center reveal">
                            <Link href="/bolgeler" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gray-50 text-gray-900 font-bold uppercase tracking-widest text-xs hover:bg-gray-100 transition-colors border border-gray-200">
                                Tüm Fiyat Listesi
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── TESTIMONIALS ── */}
            {userReviews.length > 0 && (
                <section className="py-24 sm:py-32 bg-[var(--color-surface-alt)]">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16 reveal">
                            <p className="text-[var(--color-primary)] font-bold tracking-widest uppercase text-[10px] mb-4">Deneyimler</p>
                            <h2 className="text-4xl sm:text-5xl font-playfair text-gray-900 tracking-tight">Misafirlerimiz<br />Ne Diyor?</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 reveal-stagger">
                            {userReviews.slice(0, 3).map((review) => (
                                <div key={review.id} className="bg-white p-10 rounded-3xl border border-gray-200/50 shadow-sm flex flex-col relative group hover:-translate-y-2 transition-transform duration-500">
                                    <div className="flex gap-1 text-[var(--color-primary)] text-[10px] mb-6">
                                        <i className="fa-solid fa-star" /><i className="fa-solid fa-star" /><i className="fa-solid fa-star" /><i className="fa-solid fa-star" /><i className="fa-solid fa-star" />
                                    </div>
                                    <p className="text-gray-600 font-outfit text-[15px] leading-relaxed mb-8 flex-1">"{review.text}"</p>
                                    <div className="flex items-center gap-4 border-t border-gray-50 pt-6">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-gray-900 font-bold text-sm">{review.name}</h4>
                                            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mt-0.5">{review.country}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* STATS BENTO */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 reveal">
                            {stats.map((s, i) => (
                                <div key={i} className="bg-white py-8 px-6 rounded-3xl border border-gray-200/50 text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                                    <h4 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{s.val}</h4>
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── EDITORIAL BLOG PREVIEW ── */}
            {randomBlogPosts.length > 0 && (
                <section className="py-24 sm:py-32 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16 reveal border-b border-gray-100 pb-10">
                            <h2 className="text-4xl sm:text-6xl font-playfair text-gray-900 tracking-tight max-w-xl leading-tight">Seyahat <br/>Rehberi & İlham</h2>
                            <Link href="/blog" className="text-sm font-bold uppercase tracking-widest text-gray-900 hover:text-[var(--color-primary)] transition-colors pb-1 border-b-2 border-gray-900 hover:border-[var(--color-primary)]">
                                Tümü
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 reveal-stagger">
                            {randomBlogPosts.map(post => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group block text-left">
                                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-50 mb-8 border border-gray-100">
                                        <Image src={post.featuredImage || '/bg1.webp'} alt={post.title} fill className="object-cover transform transition-transform duration-1000 group-hover:scale-105" />
                                    </div>
                                    <p className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-3">{post.category || 'Rehber'}</p>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[var(--color-primary)] transition-colors tracking-tight leading-snug">{post.title}</h3>
                                    <p className="text-gray-500 font-outfit text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── FOOTER CALL TO ACTION ── */}
            <section className="py-32 sm:py-48 bg-white border-t border-gray-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="text-center reveal relative z-10 px-6 max-w-2xl">
                    <h2 className="text-4xl sm:text-6xl font-playfair font-medium text-gray-900 tracking-tight mb-8">Ulaşımda <br/>Lüksün Zirvesi</h2>
                    <p className="text-gray-500 text-lg mb-12">Yolculuğunuza şimdi rezervasyon yaparak prestij katın. Sizi bekliyoruz.</p>
                    <button onClick={() => setBookingFormOpen(true)} className="btn-gold px-12 py-5 text-sm uppercase tracking-widest shadow-xl">
                        Rezervasyon Yap
                    </button>
                </div>
            </section>
            
        </main>
    );
}
