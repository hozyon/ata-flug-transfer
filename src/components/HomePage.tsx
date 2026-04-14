'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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

    const regionsCarouselRef = useRef<HTMLDivElement>(null);

    useScrollReveal();

    const randomBlogPosts = useMemo(() => {
        const published = blogPosts.filter(p => p.isPublished);
        return published.slice(0, 4);
    }, [blogPosts]);

    const buildWaUrl = (regionName: string, price?: number) => {
        const msg = `Merhaba, *${regionName}* (${price || 0}${siteContent.currency?.symbol || '€'}) bölgesi için rezervasyon yaptırmak istiyorum.`;
        return `https://wa.me/${siteContent.business.whatsapp}?text=${encodeURIComponent(msg)}`;
    };

    // Rotating region name in trust bar
    const [currentRegionIndex, setCurrentRegionIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    const pricedRegions = useMemo(() => siteContent.regions.filter(r => r.price && r.price > 0), [siteContent.regions]);

    useEffect(() => {
        if (pricedRegions.length === 0) return;
        const id = setInterval(() => {
            setIsFading(true);
            setTimeout(() => { setCurrentRegionIndex(prev => (prev + 1) % pricedRegions.length); setIsFading(false); }, 500);
        }, 3000);
        return () => clearInterval(id);
    }, [pricedRegions]);

    // Price search
    const [priceSearch, setPriceSearch] = useState('');

    // Auto-scroll carousel logic
    useEffect(() => {
        const el = regionsCarouselRef.current;
        if (!el || pricedRegions.length < 4) return;

        let interval: NodeJS.Timeout;
        const start = () => {
            interval = setInterval(() => {
                if (el.scrollLeft + el.offsetWidth >= el.scrollWidth - 10) {
                    el.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    el.scrollBy({ left: 240, behavior: 'smooth' });
                }
            }, 4000);
        };
        const pause = () => clearInterval(interval);

        start();
        el.addEventListener('mouseenter', pause);
        el.addEventListener('mouseleave', start);
        el.addEventListener('touchstart', pause);
        return () => {
            pause();
            el.removeEventListener('mouseenter', pause);
            el.removeEventListener('mouseleave', start);
            el.removeEventListener('touchstart', pause);
        };
    }, [pricedRegions]);

    const sym = siteContent.currency?.symbol || '€';
    const sortedRegions = [...pricedRegions].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

    const groups = [
        { label: 'Yakın Mesafe', accent: '#34d399', accentBg: 'rgba(52,211,153,0.08)', borderClr: 'rgba(52,211,153,0.2)', regions: sortedRegions.filter(r => (r.price ?? 0) <= 60) },
        { label: 'Orta Mesafe', accent: '#c5a059', accentBg: 'rgba(197,160,89,0.08)', borderClr: 'rgba(197,160,89,0.2)', regions: sortedRegions.filter(r => (r.price ?? 0) > 60 && (r.price ?? 0) <= 120) },
        { label: 'Uzak Mesafe', accent: '#fb7185', accentBg: 'rgba(251,113,133,0.08)', borderClr: 'rgba(251,113,133,0.2)', regions: sortedRegions.filter(r => (r.price ?? 0) > 120) }
    ];

    const activeGroups = groups.filter(g => g.regions.length > 0).map(g => ({
        ...g,
        regions: priceSearch
            ? g.regions.filter(r => r.name.toLowerCase().includes(priceSearch.toLowerCase()) || String(r.price ?? '').includes(priceSearch))
            : g.regions
    })).filter(g => g.regions.length > 0);

    const stats = [
        { label: 'Mutlu Müşteri', val: '4.9', icon: 'fa-star' },
        { label: 'Yıllık Transfer', val: '10K+', icon: 'fa-users' },
        { label: 'Yıllık Deneyim', val: '15+', icon: 'fa-award' }
    ];

    const heroBgs = siteContent.hero.backgrounds || ['/bg1.webp', '/bg2.webp', '/bg3.webp'];
    const [currentBgIndex, setCurrentBgIndex] = useState(0);

    useEffect(() => {
        if (heroBgs.length <= 1) return;
        const id = setInterval(() => setCurrentBgIndex(prev => (prev + 1) % heroBgs.length), 10000);
        return () => clearInterval(id);
    }, [heroBgs.length]);

    return (
        <main className="min-h-screen bg-[#020617]">
            {/* ── Hero Section ── */}
            <section className="relative h-[92vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background images with crossfade */}
                {heroBgs.map((bg, idx) => (
                    <div key={idx} className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${idx === currentBgIndex ? 'opacity-100' : 'opacity-0'}`}>
                        <Image src={bg} alt="Antalya VIP Transfer" fill priority={idx === 0} className="object-cover scale-105 animate-[slow-zoom_20s_infinite_alternate]" />
                    </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-[#020617]/40 to-[#020617]" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
                    <div className="reveal">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 mb-6 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]"></span>
                            PREMIUM VIP TRANSFER
                        </div>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-playfair font-medium text-white mb-6 tracking-tight leading-tight">
                            Lüks Ve Konforun <span className="text-[#c5a059] italic">Yeni Tanımı</span>
                        </h1>
                        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light tracking-wide leading-relaxed">
                            Antalya Havalimanı'ndan dilediğiniz her noktaya modern araç filomuz ve profesyonel ekibimizle eşsiz bir VIP deneyimi yaşayın.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button onClick={() => setBookingFormOpen(true)} className="w-full sm:w-auto px-10 py-4 bg-[#c5a059] hover:bg-[#b08d48] text-[#020617] font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl shadow-[#c5a059]/20">
                                Rezervasyon Yap
                            </button>
                            <a href={`https://wa.me/${siteContent.business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl backdrop-blur-md border border-white/10 transition-all duration-300 flex items-center justify-center gap-2">
                                <i className="fa-brands fa-whatsapp text-xl text-[#25D366]"></i> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* Trust bar overlay at bottom of hero */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#020617] to-transparent z-20">
                    <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
                        <div className="flex items-center gap-8 md:gap-16 opacity-60">
                            <div className="flex items-center gap-2 text-white/50 text-xs md:text-sm">
                                <i className="fa-solid fa-shield-halved text-[#c5a059]"></i>
                                <span className="font-medium whitespace-nowrap">Sabit Fiyat Garantisi</span>
                            </div>
                            <div style={{ width: 1, height: 22, flexShrink: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(197,160,89,0.8) 50%, transparent 100%)' }} />
                            <div className="flex items-center gap-2 text-white/50 text-xs md:text-sm">
                                <i className="fa-solid fa-location-dot text-[var(--color-primary)] text-sm"></i>
                                <div className="w-[100px] sm:w-[140px] overflow-hidden">
                                    <span key={currentRegionIndex} className={`block whitespace-nowrap text-ellipsis overflow-hidden transition-all duration-300 ${isFading ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
                                        {pricedRegions[currentRegionIndex]?.name || 'Antalya'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pricing Section ── */}
            {pricedRegions.length > 0 && (
                <section className="relative overflow-hidden py-16 md:py-24" style={{ background: 'linear-gradient(160deg, #080c16 0%, #0c1220 50%, #080c16 100%)' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] opacity-[0.18]" style={{ background: 'radial-gradient(ellipse, #c5a059 0%, transparent 70%)' }} />
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
                            <div className="reveal">
                                <div className="flex items-center gap-2.5 mb-2.5">
                                    <span className="w-5 h-px bg-[#c5a059]"></span>
                                    <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#c5a059]">ANTALYA HAVALİMANI → TÜM BÖLGELER</span>
                                </div>
                                <h2 className="text-[26px] md:text-[34px] font-black tracking-tight leading-none text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    Transfer <span style={{ color: '#c5a059' }}>Fiyatları</span>
                                </h2>
                                <p className="text-white/35 text-[12px] mt-1.5 font-medium">Tek yön, araç başı — kişi sayısından bağımsız sabit fiyat</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-5 pb-1">
                                {[
                                    { color: '#34d399', label: 'Yakın mesafe' },
                                    { color: '#c5a059', label: 'Orta mesafe' },
                                    { color: '#fb7185', label: 'Uzak mesafe' }
                                ].map(item => (
                                    <div key={item.label} className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color }}></span>
                                        <span className="text-[10px] text-white/35 font-medium">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-7 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <i className="fa-solid fa-magnifying-glass text-white/25 text-[11px] shrink-0"></i>
                            <input type="text" value={priceSearch} onChange={e => setPriceSearch(e.target.value)} placeholder="Bölge adı veya fiyat ara..." className="flex-1 bg-transparent text-[12px] text-white/70 placeholder-white/20 focus:outline-none" />
                            {priceSearch
                                ? <button onClick={() => setPriceSearch('')} className="text-white/30 hover:text-white/70 transition-colors shrink-0"><i className="fa-solid fa-xmark text-[11px]"></i></button>
                                : <span className="text-[10px] text-white/15 font-mono shrink-0">{pricedRegions.length} bölge</span>
                            }
                        </div>

                        {activeGroups.length === 0 ? (
                            <div className="text-center py-12"><i className="fa-solid fa-magnifying-glass text-white/10 text-3xl mb-3 block"></i><p className="text-white/25 text-sm">Sonuç bulunamadı</p></div>
                        ) : (
                            <div className="space-y-7">
                                {activeGroups.map(group => (
                                    <div key={group.label}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: group.accent }}></span>
                                            <span className="text-[8.5px] font-black uppercase tracking-[0.4em]" style={{ color: group.accent }}>{group.label}</span>
                                            <span className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${group.borderClr}, transparent)` }}></span>
                                            <span className="text-[9px] font-bold text-white/20">{group.regions.length}</span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 stagger-children">
                                            {group.regions.map(region => (
                                                <a key={region.id} href={buildWaUrl(region.name, region.price)} target="_blank" rel="noopener noreferrer"
                                                    className="reveal group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all duration-200"
                                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <i className="fa-solid fa-location-dot text-[10px] shrink-0 text-white/25 group-hover:text-white/55 transition-colors"></i>
                                                        <span className="text-white/80 text-[12px] font-semibold truncate group-hover:text-white transition-colors">{region.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <span className="font-black text-[13px] leading-none" style={{ color: group.accent }}>{sym}{region.price}</span>
                                                        <span className="relative w-4 h-4 flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-[#25D366] opacity-30"></span>
                                                            <i className="fa-brands fa-whatsapp text-[#25D366] text-[13px] relative"></i>
                                                        </span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-7 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-start gap-2">
                                <i className="fa-solid fa-circle-info text-white/20 text-[9px] mt-[3px] shrink-0"></i>
                                <p className="text-white/25 text-[10.5px] leading-relaxed max-w-lg">Fiyatlar araç başıdır. Gece transferi (00:00–06:00) ve ekstra bagaj için fiyat değişmez. Listede olmayan bölge için WhatsApp'tan fiyat alın.</p>
                            </div>
                            <Link href={`/bolgeler`} className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-white/45 hover:text-[var(--color-primary)] text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-200" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                                TÜM BÖLGELER<i className="fa-solid fa-arrow-right text-[8px]"></i>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Services Section ── */}
            <section id="about" className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #080c16 0%, #060a12 100%)' }}>
                <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, #c5a059 30%, #e0c07a 50%, #c5a059 70%, transparent 100%)', opacity: 0.35 }} />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="text-center mb-12 md:mb-16 reveal">
                        <div className="flex items-center justify-center gap-4 mb-5">
                            <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #c5a059)' }} />
                            <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#c5a059]">PREMİUM DENEYİM</span>
                            <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(270deg, transparent, #c5a059)' }} />
                        </div>
                        <h2 className="font-playfair font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                            VIP Transfer <span className="bg-gradient-to-r from-[#c5a059] via-[#e0c07a] to-[#c5a059] bg-clip-text text-transparent">Hizmetleri</span>
                        </h2>
                        <p className="text-white/35 text-sm mt-3 max-w-xl mx-auto">Antalya havalimanı ve çevresi için premium transfer deneyimi</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
                        {[
                            { num: '01', icon: 'fa-plane-arrival', title: 'Havalimanı Transferi', desc: 'Lüks Mercedes Vito araçlarımızla kesintisiz karşılama. Uçuş durumunuzu takip ediyor, rötarlarda bekliyoruz.' },
                            { num: '02', icon: 'fa-map', title: 'Özel Şehir Turları', desc: 'Antalya ve çevresini kendi hızınızda keşfedin. Yerel şoförlerimiz eşliğinde gizli kalmış güzellikleri görün.' },
                            { num: '03', icon: 'fa-route', title: 'VIP Transfer', desc: 'Kişisel ihtiyaçlarınıza göre uyarlanmış rotalarla mükemmel konforu tasarlayın. Eğlence veya tatil odaklı VIP seyahat.' },
                            { num: '04', icon: 'fa-car-side', title: 'Şehirlerarası Transfer', desc: 'Antalya\'dan dilediğiniz şehre, lüks araçlarımızla stressiz ve konforlu uzun yolculuk deneyimi.' },
                        ].map((s, i) => (
                            <div key={i} className="group relative flex flex-col px-6 py-8 md:px-8 md:py-10 border-t border-white/[0.06] sm:border-t-0 first:border-t-0 sm:border-l sm:first:border-l-0 transition-all duration-300 hover:bg-white/[0.025]">
                                <span className="text-[42px] md:text-[56px] font-black leading-none mb-6 select-none" style={{ color: 'rgba(197,160,89,0.12)' }}>{s.num}</span>
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 border transition-all duration-300 group-hover:border-[#c5a059]/40 group-hover:bg-[#c5a059]/10" style={{ borderColor: 'rgba(197,160,89,0.2)', background: 'rgba(197,160,89,0.06)' }}>
                                    <i className={`fa-solid ${s.icon} text-sm`} style={{ color: '#c5a059' }}></i>
                                </div>
                                <h4 className="text-white font-semibold text-base mb-3 leading-snug transition-colors duration-300 group-hover:text-[#c5a059]">{s.title}</h4>
                                <p className="text-white/35 text-xs md:text-sm leading-relaxed">{s.desc}</p>
                                <div className="absolute bottom-0 left-6 right-6 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ background: 'linear-gradient(90deg, #c5a059, transparent)' }} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, #c5a059 30%, #e0c07a 50%, #c5a059 70%, transparent 100%)', opacity: 0.25 }} />
            </section>

            {/* ── Regions Carousel ── */}
            {pricedRegions.length > 0 && (
                <section id="regions" className="scroll-mt-20 py-12 md:py-16 overflow-hidden" style={{ background: '#080c16' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="h-px w-8 bg-[#c5a059]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#c5a059]">PREMİUM TRANSFER</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                            <h2 className="font-playfair font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                                Hizmet <span className="bg-gradient-to-r from-[#c5a059] via-[#e0c07a] to-[#c5a059] bg-clip-text text-transparent">Bölgelerimiz</span>
                            </h2>
                            <Link href={`/bolgeler`} className="shrink-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c5a059] transition-colors hover:text-[#e0c07a]">
                                Tüm Bölgeler <i className="fa-solid fa-arrow-right text-[9px]" />
                            </Link>
                        </div>
                    </div>
                    <div ref={regionsCarouselRef} className="flex carousel-container pb-4" style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', gap: '14px', paddingLeft: 'calc(50vw - 110px)', paddingRight: 'calc(50vw - 110px)' }}>
                        {pricedRegions.map((region) => {
                            const slug = region.name.toLowerCase().replace(/ /g, '-').replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c').replace(/[^a-z0-9-]/g, '');
                            return (
                                <Link key={region.id} href={`/transfer/${slug}-transfer`} data-rc="" className="group relative block overflow-hidden rounded-2xl shrink-0"
                                    style={{ width: 'min(220px, 62vw)', height: '300px', scrollSnapAlign: 'center', transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.35s ease', willChange: 'transform, opacity' }}>
                                    <Image src={region.image || '/bg1.webp'} alt={region.name} fill sizes="(max-width: 768px) 62vw, 220px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,8,15,0.95) 0%, rgba(5,8,15,0.35) 55%, transparent 100%)' }} />
                                    {region.price && (
                                        <div className="absolute top-2.5 right-2.5 rounded-md px-2 py-1 text-[11px] font-black" style={{ background: 'rgba(5,8,15,0.75)', color: '#c5a059', border: '1px solid rgba(197,160,89,0.35)', backdropFilter: 'blur(8px)' }}>
                                            {sym}{region.price}
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(197,160,89,0.65)' }}>Transfer</p>
                                        <h3 className="font-bold text-white text-sm leading-tight group-hover:text-[#e0c07a] transition-colors">{region.name}</h3>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* ── Blog Highlights ── */}
            {randomBlogPosts.length > 0 && (
                <section id="blog-highlights" className="relative overflow-hidden py-16 md:py-24" style={{ background: 'linear-gradient(180deg, #080c16 0%, #0a0f1c 100%)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-10 md:mb-14 reveal">
                            <div className="flex items-center justify-center gap-4 mb-5">
                                <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #c5a059)' }} />
                                <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#c5a059]">BLOG</span>
                                <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(270deg, transparent, #c5a059)' }} />
                            </div>
                            <h2 className="font-playfair font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                                Sizin İçin <span className="bg-gradient-to-r from-[#c5a059] via-[#e0c07a] to-[#c5a059] bg-clip-text text-transparent">Seçtiklerimiz</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 stagger-children">
                            {randomBlogPosts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="reveal group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div className="relative h-40 overflow-hidden">
                                        <Image src={post.featuredImage || '/bg1.webp'} alt={post.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,8,15,0.85) 0%, rgba(5,8,15,0.2) 100%)' }}></div>
                                        <span className="absolute bottom-2 left-3 text-[10px] font-bold text-white/70 rounded-full px-2.5 py-0.5" style={{ background: 'rgba(197,160,89,0.2)', border: '1px solid rgba(197,160,89,0.3)' }}>{post.category}</span>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-sm font-bold text-white/90 line-clamp-2 mb-2 group-hover:text-[#c5a059] transition-colors leading-snug">{post.title}</h3>
                                        <p className="text-xs text-white/35 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                                        <div className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                                            <span>Devamını Oku</span>
                                            <i className="fa-solid fa-arrow-right text-[8px] group-hover:translate-x-1 transition-transform"></i>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-12 text-center">
                            <Link href={`/blog`} className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-all font-bold text-xs uppercase tracking-widest">
                                Tüm Yazıları Gör <i className="fa-solid fa-arrow-right text-[10px]"></i>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Testimonials Section ── */}
            {userReviews.length > 0 && (
                <section id="testimonials" className="py-16 md:py-24 relative overflow-hidden" style={{ background: '#060a12' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-12 md:mb-16 reveal">
                            <div className="flex items-center justify-center gap-4 mb-5">
                                <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #c5a059)' }} />
                                <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#c5a059]">MÜŞTERİ YORUMLARI</span>
                                <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(270deg, transparent, #c5a059)' }} />
                            </div>
                            <h2 className="font-playfair font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                                Misafirlerimizin <span className="bg-gradient-to-r from-[#c5a059] via-[#e0c07a] to-[#c5a059] bg-clip-text text-transparent">Deneyimleri</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
                            {userReviews.slice(0, 6).map((review) => (
                                <div key={review.id} className="reveal p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#c5a059]/30 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className={`fa-solid fa-star text-[10px] ${i < review.rating ? 'text-[#c5a059]' : 'text-white/10'}`}></i>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{review.country}</span>
                                    </div>
                                    <p className="text-white/60 text-sm italic leading-relaxed mb-6">"{review.text}"</p>
                                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/[0.04]">
                                        <div className="w-8 h-8 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center text-[#c5a059] font-black text-xs">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-xs">{review.name}</p>
                                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">Müşteri</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stats box */}
                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 reveal">
                            {stats.map((s, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.06] text-center">
                                    <i className={`fa-solid ${s.icon} text-[#c5a059] mb-3 text-xl block`}></i>
                                    <p className="text-3xl font-playfair font-bold text-white mb-1">{s.val}</p>
                                    <p className="text-[10px] font-black text-white/25 uppercase tracking-widest">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA Section ── */}
            <section className="relative py-20 md:py-32 overflow-hidden" style={{ background: '#020617' }}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/20 to-transparent" />
                <div className="max-w-4xl mx-auto px-4 text-center reveal">
                    <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-8 leading-tight">
                        Hazırsanız, Yolculuğunuzu <span className="text-[#c5a059]">Şimdi Planlayın</span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-12 font-light">
                        Antalya Havalimanı transferiniz için lüks ve güvenli çözümler.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={() => setBookingFormOpen(true)} className="w-full sm:w-auto px-12 py-4 bg-[#c5a059] text-[#020617] font-bold rounded-2xl hover:bg-[#b08d48] transition-all shadow-xl shadow-[#c5a059]/10">
                            Rezervasyon Yap
                        </button>
                        <a href={`tel:${siteContent.business.phone}`} className="w-full sm:w-auto px-12 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2">
                            <i className="fa-solid fa-phone text-sm"></i> Bizi Arayın
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
