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
            <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
                {/* Background Slider */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    {heroBgs.map((bg, idx) => (
                        <div key={idx} className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${idx === currentBgIndex ? 'opacity-100' : 'opacity-0'}`}>
                            <Image src={bg} alt="Luxury Transfer" fill priority={idx === 0} className="object-cover scale-100 animate-[slow-zoom_30s_infinite_alternate]" />
                        </div>
                    ))}
                </div>

                <div className="relative z-10 px-6 pt-32 pb-16 max-w-[1400px] mx-auto flex flex-col items-center text-center reveal mt-12">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 mb-8">Premium Service</p>
                    <h1 className="text-6xl sm:text-[100px] md:text-[130px] font-playfair font-medium text-white tracking-tighter leading-[0.85] mb-10 drop-shadow-2xl">
                        Zarafetin <br />
                        <span className="italic font-light text-white/90 block mt-2">Yeni Rotası.</span>
                    </h1>
                    <p className="text-white/80 text-sm sm:text-base font-outfit max-w-sm leading-relaxed mb-12 drop-shadow-md">
                        Antalya'daki Premium Havalimanı Ulaşımınız. Konforlu, güvenilir ve sadece size özel bir ritüel.
                    </p>
                    <div className="flex items-center flex-wrap gap-4 justify-center">
                        <button onClick={() => setBookingFormOpen(true)} className="px-10 py-4 bg-white text-[#111] font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gray-100 transition-all">
                            Ön Rezervasyon
                        </button>
                        <a href={`https://wa.me/${siteContent.business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="px-10 py-4 bg-transparent text-white font-bold uppercase tracking-[0.2em] text-[10px] border border-white/50 hover:bg-white hover:text-[#111] transition-all backdrop-blur-sm">
                            WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {/* ── REGIONS CAROUSEL ── */}
            {pricedRegions.length > 0 && (
                <section className="py-8 sm:py-12 bg-[#fafafa]">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16 reveal">
                            <div>
                                <h2 className="text-4xl sm:text-6xl font-playfair font-medium text-[#111] tracking-tight leading-[0.9]">Destinasyon.</h2>
                                <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-[10px] mt-4">Antalya'dan Lüks Transfer Ağımız</p>
                            </div>
                            <div className="w-full sm:w-[250px] border-b border-[#111] pb-2 flex items-center gap-3">
                                <i className="fa-solid fa-magnifying-glass text-[#888] text-sm"></i>
                                <input 
                                    type="text" 
                                    value={priceSearch} 
                                    onChange={e => setPriceSearch(e.target.value)} 
                                    placeholder="Bölge arayın..." 
                                    className="w-full bg-transparent border-none outline-none text-[#111] text-sm placeholder-gray-400 font-outfit"
                                />
                            </div>
                        </div>

                        {activeRegions.length === 0 ? (
                            <p className="text-gray-400 text-center py-10 text-xs tracking-widest uppercase">Bölge bulunamadı.</p>
                        ) : (
                            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide reveal-stagger" style={{ 'scrollbarWidth': 'none', 'msOverflowStyle': 'none' } as React.CSSProperties}>
                                {activeRegions.map((region) => {
                                    const slug = region.name.toLowerCase().replace(/ /g, '-').replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c').replace(/[^a-z0-9-]/g, '');
                                    return (
                                        <Link key={region.id} href={`/transfer/${slug}-transfer`} className="min-w-[280px] sm:min-w-[320px] snap-start group relative border border-gray-200 hover:border-[#111] transition-colors p-5 block bg-white shrink-0">
                                            <div className="relative aspect-[4/3] w-full overflow-hidden mb-6 bg-gray-50">
                                                <Image src={region.image || '/images/default-region.jpg'} alt={region.name} fill sizes="(max-width: 768px) 280px, 320px" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[1500ms] group-hover:scale-105" />
                                            </div>
                                            <h3 className="font-playfair text-2xl text-[#111] group-hover:italic transition-all mb-3">{region.name}</h3>
                                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                                                {region.price ? (
                                                    <span className="text-xs text-[#111] font-bold tracking-widest">{sym}{region.price}</span>
                                                ) : (
                                                    <span className="text-xs text-[#111] font-bold tracking-widest">Fiyat Alın</span>
                                                )}
                                                <span className="text-[10px] uppercase tracking-[0.2em] text-[#888] group-hover:text-[#111] transition-colors">İncele &rarr;</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                        
                        <div className="mt-8 flex justify-center reveal">
                            <Link href="/bolgeler" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] border-b border-[#111] pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                                Tüm Listeyi Görüntüle
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── BENTO FEATURES (MINIMALIST) ── */}
            <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
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



            {/* ── TESTIMONIALS (EDITORIAL) ── */}
            {userReviews.length > 0 && (
                <section className="py-12 sm:py-16 bg-white border-t border-[#f0f0f0]">
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
                <section className="py-12 sm:py-16 bg-[#fafafa]">
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

            {/* ── FOOTER SVG JOURNEY & CALL TO ACTION ── */}
            <section className="relative pt-16 pb-16 bg-white text-[#111] flex flex-col items-center justify-center text-center px-6 border-t border-gray-100">
                <style>{`
                    @keyframes flowGreen {
                        0% { stroke-dashoffset: 20; opacity: 0; }
                        10% { opacity: 1; }
                        80% { opacity: 1; }
                        100% { stroke-dashoffset: -100; opacity: 0; }
                    }
                    .branch-glow {
                        stroke: #22c55e;
                        stroke-width: 3;
                        fill: none;
                        stroke-linecap: round;
                        stroke-dasharray: 20 100;
                        animation: flowGreen 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .btn-elegant-glow {
                        animation: elegantGlow 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    @keyframes elegantGlow {
                        0% { box-shadow: 0 10px 30px -10px rgba(34, 197, 94, 0.2); }
                        50% { box-shadow: 0 10px 40px 0px rgba(34, 197, 94, 0.6); }
                        100% { box-shadow: 0 10px 30px -10px rgba(34, 197, 94, 0.2); }
                    }
                `}</style>
                
                <div className="reveal max-w-3xl mb-16 z-10 relative">
                    <h2 className="text-4xl sm:text-5xl font-outfit font-light tracking-wide mb-6">
                        Her Noktaya <span className="text-[var(--color-primary)] font-medium">Konforlu</span> Transfer
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base font-outfit leading-relaxed max-w-lg mx-auto">
                        Havalimanından otellere, plajlardan alışveriş merkezlerine kadar Antalya'nın her noktasına VIP ulaşım
                    </p>
                </div>

                <div className="w-full max-w-4xl mx-auto relative reveal" style={{ minHeight: '300px' }}>
                    <svg viewBox="0 0 1000 400" className="w-full h-auto overflow-visible">
                        {[ 
                            { x: 150, i: 'fa-plane' }, 
                            { x: 290, i: 'fa-store' }, 
                            { x: 430, i: 'fa-utensils' }, 
                            { x: 570, i: 'fa-building-columns' }, 
                            { x: 710, i: 'fa-house' }, 
                            { x: 850, i: 'fa-cart-shopping' } 
                        ].map((item, idx) => (
                            <g key={idx}>
                                <path 
                                    d={`M 500 380 C 500 240, ${item.x} 240, ${item.x} 100`} 
                                    stroke="rgba(0,0,0,0.08)" 
                                    strokeWidth="2" 
                                    fill="none" 
                                />
                                <path 
                                    d={`M 500 380 C 500 240, ${item.x} 240, ${item.x} 100`} 
                                    className="branch-glow"
                                    pathLength="100"
                                />
                                <foreignObject x={item.x - 20} y={40} width={40} height={40}>
                                    <div className="flex items-center justify-center w-full h-full text-3xl text-[#333]">
                                        <i className={`fa-solid ${item.i}`}></i>
                                    </div>
                                </foreignObject>
                            </g>
                        ))}
                    </svg>

                    {/* Animated Button positioned slightly below the root node */}
                    <div className="absolute left-1/2 top-[95%] transform -translate-x-1/2 translate-y-2 z-20">
                        <button 
                            onClick={() => setBookingFormOpen(true)} 
                            className="relative px-12 py-5 bg-[#111] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:-translate-y-1 transition-transform btn-elegant-glow group overflow-hidden"
                        >
                            <span className="relative z-10 block transition-transform group-hover:scale-105">Rezervasyon Yap</span>
                            {/* Matching green flow light passing through the button */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#22c55e] to-transparent opacity-20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </button>
                    </div>
                </div>
            </section>
            
        </main>
    );
}
