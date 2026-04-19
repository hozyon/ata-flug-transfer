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
        return published.slice(0, 3);
    }, [blogPosts]);

    const pricedRegions = useMemo(() => siteContent.regions.filter(r => r.price && r.price > 0), [siteContent.regions]);

    const [priceSearch, setPriceSearch] = useState('');
    const sym = siteContent.currency?.symbol || '€';
    const sortedRegions = [...pricedRegions].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

    const activeRegions = priceSearch
        ? sortedRegions.filter(r => r.name.toLowerCase().includes(priceSearch.toLowerCase()) || String(r.price ?? '').includes(priceSearch))
        : sortedRegions;

    const heroBgs = siteContent.hero.backgrounds || ['/bg1.webp', '/bg2.webp', '/bg3.webp'];
    const [currentBgIndex, setCurrentBgIndex] = useState(0);

    useEffect(() => {
        if (heroBgs.length <= 1) return;
        const id = setInterval(() => setCurrentBgIndex(prev => (prev + 1) % heroBgs.length), 6000);
        return () => clearInterval(id);
    }, [heroBgs.length]);

    return (
        <main className="min-h-screen bg-white overflow-hidden text-[#111]">
            
            {/* ── HERO EDITORIAL ── */}
            <section className="relative px-6 pt-32 sm:pt-40 pb-16 max-w-[1400px] mx-auto min-h-[95vh] flex flex-col justify-between">
                <div className="z-10 mb-12 flex flex-col items-center text-center max-w-5xl mx-auto reveal">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#888] mb-8">Premium Service</p>
                    <h1 className="text-6xl sm:text-[100px] md:text-[130px] font-playfair font-medium text-[#111] tracking-tighter leading-[0.85] mb-10">
                        Zarafetin <br />
                        <span className="italic font-light text-[#555] block mt-2">Yeni Rotası.</span>
                    </h1>
                    <p className="text-[#888] text-sm sm:text-base font-outfit max-w-sm leading-relaxed mb-12">
                        Antalya'daki Premium Havalimanı Ulaşımınız. Konforlu, güvenilir ve sadece size özel bir ritüel.
                    </p>
                    <div className="flex items-center gap-6 justify-center">
                        <button onClick={() => setBookingFormOpen(true)} className="px-10 py-4 bg-[#111] text-white font-bold uppercase tracking-[0.2em] text-[10px] border border-[#111] hover:bg-white hover:text-[#111] transition-all">
                            Ön Rezervasyon
                        </button>
                        <a href={`https://wa.me/${siteContent.business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="px-10 py-4 bg-transparent text-[#111] font-bold uppercase tracking-[0.2em] text-[10px] border border-gray-200 hover:border-[#111] transition-all">
                            WhatsApp
                        </a>
                    </div>
                </div>

                <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] rounded-none overflow-hidden bg-gray-50 mt-auto reveal-scale">
                    {heroBgs.map((bg, idx) => (
                        <div key={idx} className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${idx === currentBgIndex ? 'opacity-100' : 'opacity-0'}`}>
                            <Image src={bg} alt="Luxury Transfer" fill priority={idx === 0} className="object-cover scale-100 animate-[slow-zoom_30s_infinite_alternate] grayscale-[20%]" />
                        </div>
                    ))}
                </div>
            </section>

            {/* ── BENTO FEATURES (MINIMALIST) ── */}
            <section className="py-32 sm:py-48 bg-white border-t border-gray-100">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-start reveal">
                        <div className="md:col-span-5">
                            <h2 className="text-5xl sm:text-7xl font-playfair text-[#111] tracking-tight leading-[0.9] mb-8">Kusursuz Seçim.</h2>
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-10">Neden Bizi Seçmelisiniz?</p>
                            <p className="text-gray-500 font-outfit text-base leading-relaxed max-w-sm">
                                Klasik bir transferden fazlası; misafirlerimizin tüm beklentilerini kusursuzca karşılamaya adanmış, sessiz ve dingin bir yolculuk anlayışı.
                            </p>
                        </div>

                        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
                            <div className="flex flex-col gap-6 reveal delay-100">
                                <div className="text-2xl text-[#111]"><i className="fa-solid fa-car-side" /></div>
                                <div>
                                    <h3 className="text-xl font-playfair font-bold text-[#111] mb-2">Lüks Araç Filosu</h3>
                                    <p className="text-[#888] text-xs leading-relaxed font-outfit">VIP tasarımlı, yeni model Mercedes-Benz araçlarımızla en üst düzey konforu deneyimleyin.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 reveal delay-200">
                                <div className="text-2xl text-[#111]"><i className="fa-solid fa-plane-arrival" /></div>
                                <div>
                                    <h3 className="text-xl font-playfair font-bold text-[#111] mb-2">Tam Zamanında</h3>
                                    <p className="text-[#888] text-xs leading-relaxed font-outfit">Gecikme yok. Uçuşunuzu anlık takip ediyor, kapıda sizi bekliyoruz.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 reveal delay-300">
                                <div className="text-2xl text-[#111]"><i className="fa-solid fa-user-tie" /></div>
                                <div>
                                    <h3 className="text-xl font-playfair font-bold text-[#111] mb-2">VIP Protokol</h3>
                                    <p className="text-[#888] text-xs leading-relaxed font-outfit">Özel eğitimli, şık, saygılı ve yabancı dil bilen şoförlerimiz hizmetinizde.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 reveal delay-400">
                                <div className="text-2xl text-[var(--color-primary)]"><i className="fa-solid fa-gem" /></div>
                                <div>
                                    <h3 className="text-xl font-playfair font-bold text-[#111] mb-2">Artizan Deneyim</h3>
                                    <p className="text-[#888] text-xs leading-relaxed font-outfit">Küçük detayların birleşimiyle oluşan, sükunet dolu premium ulaşım sanatı.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── REGIONS LIST (MUSEUM STYLE) ── */}
            {pricedRegions.length > 0 && (
                <section className="py-32 sm:py-48 bg-[#fafafa]">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-10 mb-20 reveal">
                            <div>
                                <h2 className="text-5xl sm:text-7xl font-playfair text-[#111] tracking-tight leading-[0.9]">Destinasyon</h2>
                                <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-[10px] mt-6">Antalya'dan Lüks Transfer Ağımız</p>
                            </div>
                            <div className="w-full sm:w-[300px] border-b border-gray-300 pb-2 flex items-center gap-3">
                                <i className="fa-solid fa-magnifying-glass text-[#888] text-sm"></i>
                                <input 
                                    type="text" 
                                    value={priceSearch} 
                                    onChange={e => setPriceSearch(e.target.value)} 
                                    placeholder="Gideceğiniz bölgeyi arayın..." 
                                    className="w-full bg-transparent border-none outline-none text-[#111] text-sm placeholder-gray-400 font-outfit"
                                />
                            </div>
                        </div>

                        {activeRegions.length === 0 ? (
                            <p className="text-gray-400 text-center py-20 text-xs tracking-widest uppercase">Bölge bulunamadı. Lütfen iletişime geçiniz.</p>
                        ) : (
                            <div className="flex flex-col gap-8 reveal-stagger">
                                {activeRegions.map((region) => {
                                    const slug = region.name.toLowerCase().replace(/ /g, '-').replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c').replace(/[^a-z0-9-]/g, '');
                                    return (
                                        <Link key={region.id} href={`/transfer/${slug}-transfer`} className="group flex flex-col md:flex-row items-center border-t border-gray-200 pt-8 pb-4 hover:border-[#111] transition-colors relative">
                                            <div className="w-full md:w-1/3 text-4xl sm:text-5xl font-playfair text-[#111] mb-6 md:mb-0 group-hover:italic transition-all">
                                                {region.name}
                                            </div>
                                            <div className="w-full md:w-1/3 text-[#888] text-xs font-outfit leading-relaxed px-0 md:px-8 max-w-xs transition-colors group-hover:text-[#111]">
                                                {region.name} bölgesine konforlu ve güvenilir VIP ulaşım.
                                            </div>
                                            <div className="w-full md:w-1/3 flex items-center justify-between md:justify-end mt-6 md:mt-0 font-outfit">
                                                {region.price && (
                                                    <div className="text-lg text-[#111] font-bold mr-8 tracking-widest">{sym}{region.price}</div>
                                                )}
                                                <div className="text-[10px] uppercase tracking-[0.2em] font-bold border border-[#111] px-6 py-2 group-hover:bg-[#111] group-hover:text-white transition-colors">
                                                    İncele
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                        
                        <div className="mt-24 flex justify-center reveal">
                            <Link href="/bolgeler" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] border-b border-[#111] pb-1 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors">
                                Tüm Listeyi Görüntüle
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── TESTIMONIALS (EDITORIAL) ── */}
            {userReviews.length > 0 && (
                <section className="py-32 sm:py-48 bg-white border-t border-[#f0f0f0]">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-10 mb-24 reveal">
                            <div>
                                <h2 className="text-5xl sm:text-7xl font-playfair text-[#111] tracking-tight leading-[0.9]">İzlenimler</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-playfair text-gray-900 mb-1">4.9/5</p>
                                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Misafir Memnuniyeti</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 reveal-stagger">
                            {userReviews.slice(0, 3).map((review) => (
                                <div key={review.id} className="flex flex-col border-l border-gray-200 pl-8 relative">
                                    <div className="text-4xl font-playfair text-gray-300 absolute -left-4 top-0 leading-none">"</div>
                                    <p className="text-[#111] font-playfair text-lg leading-relaxed mb-10 italic flex-1">{review.text}</p>
                                    <div className="mt-auto pt-6">
                                        <h4 className="text-[#111] font-bold text-xs uppercase tracking-widest">{review.name}</h4>
                                        <p className="text-gray-400 text-[9px] uppercase font-bold tracking-[0.2em] mt-1">{review.country}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── EDITORIAL BLOG PREVIEW ── */}
            {randomBlogPosts.length > 0 && (
                <section className="py-32 sm:py-48 bg-[#fafafa]">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 reveal">
                            <h2 className="text-4xl sm:text-6xl font-playfair text-[#111] tracking-tight max-w-xl leading-tight">İlham & <br/>Günceler</h2>
                            <Link href="/blog" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] border-b border-[#111] pb-1 hover:text-gray-500 transition-colors">
                                Tüm Yazılar
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 reveal-stagger">
                            {randomBlogPosts.map(post => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="group block text-left flex flex-col">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-8">
                                        <Image src={post.featuredImage || '/bg1.webp'} alt={post.title} fill className="object-cover transform transition-transform duration-1000 group-hover:scale-105 grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100" />
                                    </div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">{post.category || 'Rehber'}</p>
                                    <h3 className="text-2xl font-playfair font-medium text-[#111] mb-4 group-hover:italic transition-all leading-snug">{post.title}</h3>
                                    <p className="text-gray-500 font-outfit text-xs leading-relaxed line-clamp-2">Okumak için tıklayın.</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── FOOTER CALL TO ACTION ── */}
            <section className="py-40 bg-[#111] text-white flex items-center justify-center text-center px-6">
                <div className="reveal max-w-2xl">
                    <h2 className="text-5xl sm:text-7xl font-playfair font-medium tracking-tight mb-8">Yolculuk Başlıyor.</h2>
                    <p className="text-gray-400 text-sm mb-12 max-w-sm mx-auto font-outfit">Sükunet dolu prestijli bir transfer için şimdi yerinizi ayırtın.</p>
                    <button onClick={() => setBookingFormOpen(true)} className="px-12 py-5 bg-white text-[#111] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors">
                        Rezervasyon Yap
                    </button>
                </div>
            </section>
            
        </main>
    );
}
