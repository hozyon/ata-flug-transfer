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
            <section className="relative h-[95vh] min-h-[700px] flex items-center justify-center overflow-hidden">
                {/* Background images with crossfade */}
                {heroBgs.map((bg, idx) => (
                    <div key={idx} className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${idx === currentBgIndex ? 'opacity-100' : 'opacity-0'}`}>
                        <Image src={bg} alt="Antalya VIP Transfer" fill priority={idx === 0} className="object-cover scale-105 animate-[slow-zoom_25s_infinite_alternate]" />
                    </div>
                ))}
                
                {/* Creative Overlays */}
                <div className="absolute inset-0 bg-[#020617]/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/60" />
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(197,160,89,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <div className="reveal text-center mb-10">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#c5a059]/20 text-[#c5a059] text-[11px] font-black uppercase tracking-[0.3em] backdrop-blur-xl border border-[#c5a059]/30 mb-8 shadow-[0_0_40px_rgba(197,160,89,0.2)]">
                            <span className="w-2 h-2 rounded-full bg-[#c5a059] shadow-[0_0_10px_#c5a059] animate-pulse"></span>
                            PREMIUM ANTALYA VIP TRANSFER
                        </div>
                        <h1 className="text-5xl sm:text-7xl md:text-9xl font-playfair font-medium text-white mb-8 tracking-tighter leading-[0.85]">
                            <span className="block mb-2">Seyahatini</span>
                            <span className="text-[#c5a059] italic">Sanata</span> Dönüştür
                        </h1>
                        <p className="text-white/70 text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-light tracking-wide leading-relaxed drop-shadow-lg">
                            Antalya'nın en seçkin VIP transfer filosuyla, her kilometrede mutlak konfor ve zarafeti keşfedin.
                        </p>
                    </div>

                    {/* Quick Action Dashboard */}
                    <div className="reveal w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-2xl">
                        <div className="flex flex-col gap-2 p-6 rounded-3xl bg-white/[0.05] border border-white/5 hover:bg-white/[0.08] transition-all group cursor-pointer" onClick={() => setBookingFormOpen(true)}>
                            <div className="flex items-center justify-between">
                                <i className="fa-solid fa-calendar-check text-[#c5a059] text-xl"></i>
                                <i className="fa-solid fa-arrow-up-right text-white/20 group-hover:text-[#c5a059] transition-colors"></i>
                            </div>
                            <h3 className="text-white font-bold text-lg mt-4">Hemen Rezervasyon</h3>
                            <p className="text-white/40 text-xs">Saniyeler içinde yerinizi ayırtın</p>
                        </div>
                        
                        <div className="flex flex-col gap-2 p-6 rounded-3xl bg-white/[0.05] border border-white/5 hover:bg-white/[0.08] transition-all group cursor-pointer" onClick={() => {
                            const regionsEl = document.getElementById('regions');
                            regionsEl?.scrollIntoView({ behavior: 'smooth' });
                        }}>
                            <div className="flex items-center justify-between">
                                <i className="fa-solid fa-map-location-dot text-[#c5a059] text-xl"></i>
                                <i className="fa-solid fa-arrow-up-right text-white/20 group-hover:text-[#c5a059] transition-colors"></i>
                            </div>
                            <h3 className="text-white font-bold text-lg mt-4">Bölgeleri Keşfet</h3>
                            <p className="text-white/40 text-xs">Popüler destinasyonlar ve fiyatlar</p>
                        </div>

                        <a href={`https://wa.me/${siteContent.business.whatsapp}`} target="_blank" rel="noopener noreferrer" 
                           className="flex flex-col gap-2 p-6 rounded-3xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all group">
                            <div className="flex items-center justify-between">
                                <i className="fa-brands fa-whatsapp text-[#25D366] text-2xl"></i>
                                <i className="fa-solid fa-arrow-up-right text-[#25D366]/40 group-hover:text-[#25D366] transition-colors"></i>
                            </div>
                            <h3 className="text-white font-bold text-lg mt-4">Canlı Destek</h3>
                            <p className="text-[#25D366]/60 text-xs">7/24 WhatsApp hattımız aktif</p>
                        </a>
                    </div>
                </div>

                {/* Trust bar overlay at bottom of hero */}
                <div className="absolute bottom-8 left-0 right-0 z-20 pointer-events-none">
                    <div className="max-w-7xl mx-auto px-6 flex items-center justify-between opacity-40">
                        <div className="hidden md:flex items-center gap-12">
                            <div className="flex items-center gap-3">
                                <i className="fa-solid fa-shield-halved text-[#c5a059] text-xs"></i>
                                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">SABİT FİYAT</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <i className="fa-solid fa-plane-arrival text-[#c5a059] text-xs"></i>
                                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">KARŞILAMA</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                            <i className="fa-solid fa-location-dot text-[#c5a059] text-xs"></i>
                            <div className="w-[120px] overflow-hidden">
                                <span key={currentRegionIndex} className={`block text-white text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-700 ${isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                                    {pricedRegions[currentRegionIndex]?.name || 'Antalya'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pricing Section ── */}
            {pricedRegions.length > 0 && (
                <section className="relative overflow-hidden py-24 md:py-32" style={{ background: 'linear-gradient(160deg, #080c16 0%, #0c1220 50%, #080c16 100%)' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] opacity-[0.15]" style={{ background: 'radial-gradient(circle, #c5a059 0%, transparent 70%)' }} />
                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16 reveal">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <span className="w-12 h-px bg-[#c5a059]"></span>
                                <span className="text-[11px] font-black tracking-[0.4em] uppercase text-[#c5a059]">TRANSFER ÜCRETLERİ</span>
                                <span className="w-12 h-px bg-[#c5a059]"></span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-playfair font-medium text-white mb-6 tracking-tight">
                                Şeffaf <span className="italic text-[#c5a059]">Fiyatlandırma</span>
                            </h2>
                            <p className="text-white/40 text-lg max-w-xl mx-auto font-light leading-relaxed">
                                Antalya'nın her noktasına sabit fiyat garantisi. Kişi sayısından bağımsız, araç başı fiyatlar.
                            </p>
                        </div>

                        <div className="max-w-2xl mx-auto mb-16 reveal">
                            <div className="relative group">
                                <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#c5a059] transition-colors"></i>
                                <input 
                                    type="text" 
                                    value={priceSearch} 
                                    onChange={e => setPriceSearch(e.target.value)} 
                                    placeholder="Bölge adı veya destinasyon ara..." 
                                    className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/10 rounded-full text-white placeholder-white/20 focus:outline-none focus:border-[#c5a059]/40 focus:ring-4 focus:ring-[#c5a059]/5 transition-all backdrop-blur-xl shadow-2xl"
                                />
                                {priceSearch && (
                                    <button onClick={() => setPriceSearch('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                                        <i className="fa-solid fa-xmark text-lg"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        {activeGroups.length === 0 ? (
                            <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-white/5">
                                <i className="fa-solid fa-magnifying-glass text-white/5 text-5xl mb-6 block"></i>
                                <p className="text-white/20 text-lg italic font-light">Aradığınız bölge için sonuç bulunamadı.</p>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {activeGroups.map(group => (
                                    <div key={group.label} className="reveal">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-2 h-2 rounded-full" style={{ background: group.accent, boxShadow: `0 0 10px ${group.accent}` }}></div>
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.35em]" style={{ color: group.accent }}>{group.label}</h3>
                                            <div className="flex-1 h-px opacity-20" style={{ background: `linear-gradient(90deg, ${group.accent}, transparent)` }}></div>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                            {group.regions.map(region => (
                                                <a key={region.id} href={buildWaUrl(region.name, region.price)} target="_blank" rel="noopener noreferrer"
                                                    className="group relative flex flex-col p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-[#c5a059]/30 transition-all duration-300">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <i className="fa-solid fa-location-dot text-white/10 group-hover:text-[#c5a059] transition-colors"></i>
                                                        <i className="fa-brands fa-whatsapp text-[#25D366]/40 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                                    </div>
                                                    <span className="text-white/90 text-sm font-bold truncate mb-1">{region.name}</span>
                                                    <span className="font-black text-xl leading-none" style={{ color: group.accent }}>{sym}{region.price}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <i className="fa-solid fa-circle-info text-[#c5a059] opacity-50"></i>
                                <p className="text-white/30 text-xs leading-relaxed">Fiyatlar araç başıdır, KDV dahildir. Ekstra durak veya güzergah değişikliği fiyatı etkileyebilir.</p>
                            </div>
                            <Link href={`/bolgeler`} className="px-8 py-3 rounded-full bg-white/5 hover:bg-[#c5a059] hover:text-[#020617] text-[#c5a059] text-[10px] font-black tracking-widest uppercase transition-all duration-500 border border-[#c5a059]/30">
                                TÜM FİYATLARI GÖR
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Services Section ── */}
            <section id="about" className="relative overflow-hidden py-24 md:py-32 bg-white">
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-5 reveal">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="w-12 h-px bg-[#c5a059]"></span>
                                <span className="text-[11px] font-black tracking-[0.4em] uppercase text-[#c5a059]">AYRICALIKLARIMIZ</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-playfair font-medium text-[#020617] mb-8 leading-[1.1] tracking-tighter">
                                Sıradan Değil <br /><span className="italic text-[#c5a059]">Kusursuz</span> Deneyim
                            </h2>
                            <p className="text-[#444] text-lg font-light leading-relaxed mb-10">
                                Ata Flug Transfer, sadece bir ulaşım hizmeti değil; Antalya'nın en prestijli seyahat kültürüdür. Modern filomuz ve VIP protokol şoförlerimizle her anınızı değerli kılıyoruz.
                            </p>
                            <Link href="/hakkimizda" className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#020617] border-b-2 border-[#c5a059] pb-2 hover:opacity-70 transition-all">
                                Daha Fazla Bilgi <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>
                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 reveal-stagger">
                            {[
                                { icon: 'fa-plane-arrival', title: 'Havalimanı Karşılama', desc: 'İsimli tabela ile kapıda karşılama ve bagaj asistanlığı.' },
                                { icon: 'fa-user-tie', title: 'Profesyonel Şoförler', desc: 'Yabancı dil bilen, bölgeye hakim ve protokol eğitimli ekip.' },
                                { icon: 'fa-car-side', title: 'Modern VIP Filo', desc: 'Son model, tam donanımlı Mercedes-Benz lüks araçlar.' },
                                { icon: 'fa-clock', title: '7/24 Kesintisiz', desc: 'Günün her saati uçuş takibi ve anlık operasyon desteği.' },
                            ].map((s, i) => (
                                <div key={i} className="p-10 rounded-[3rem] bg-[#f8f7f4] border border-black/[0.03] hover:shadow-2xl transition-all duration-700">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm text-[#c5a059]">
                                        <i className={`fa-solid ${s.icon} text-xl`}></i>
                                    </div>
                                    <h4 className="text-xl font-bold text-[#020617] mb-4 tracking-tight">{s.title}</h4>
                                    <p className="text-[#666] text-sm font-light leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Regions Carousel — SMOOTH INFINITE MARQUEE ── */}
            {pricedRegions.length > 0 && (
                <section id="regions" className="py-24 overflow-hidden bg-[#080c16] relative">
                    {/* Floating Title */}
                    <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="reveal">
                            <h2 className="text-4xl md:text-6xl font-playfair font-medium text-white tracking-tight">
                                Hizmet <span className="italic text-[#c5a059]">Bölgelerimiz</span>
                            </h2>
                            <p className="text-white/30 text-sm mt-4 font-light">Antalya'nın tüm turizm merkezlerine VIP ulaşım.</p>
                        </div>
                        <Link href="/bolgeler" className="reveal text-xs font-bold uppercase tracking-[0.3em] text-[#c5a059] border border-[#c5a059]/30 px-8 py-3 rounded-full hover:bg-[#c5a059] hover:text-[#020617] transition-all duration-500">
                            Tümünü Keşfet
                        </Link>
                    </div>

                    {/* Infinite Marquee Container */}
                    <div className="relative w-full">
                        <div className="animate-marquee hover:pause flex gap-6">
                            {/* Duplicate the list for seamless looping */}
                            {[...pricedRegions, ...pricedRegions].map((region, idx) => {
                                const slug = region.name.toLowerCase().replace(/ /g, '-').replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c').replace(/[^a-z0-9-]/g, '');
                                return (
                                    <Link key={`${region.id}-${idx}`} href={`/transfer/${slug}-transfer`} 
                                          className="group relative block w-[280px] h-[380px] rounded-[2.5rem] overflow-hidden shrink-0 border border-white/5">
                                        <Image src={region.image || '/bg1.webp'} alt={region.name} fill sizes="280px" className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
                                        
                                        {region.price && (
                                            <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black tracking-widest shadow-xl">
                                                {sym}{region.price}
                                            </div>
                                        )}
                                        
                                        <div className="absolute bottom-10 left-8 right-8">
                                            <p className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.4em] mb-3">ANTALYA</p>
                                            <h3 className="text-2xl font-bold text-white tracking-tight leading-none transition-all duration-500 group-hover:text-[#c5a059]">{region.name}</h3>
                                            <div className="h-0.5 w-0 bg-[#c5a059] mt-6 group-hover:w-full transition-all duration-700" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        
                        {/* Side Fades for Marquee */}
                        <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#080c16] to-transparent z-10 pointer-events-none" />
                        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#080c16] to-transparent z-10 pointer-events-none" />
                    </div>
                </section>
            )}

            {/* ── Blog Highlights ── */}
            {randomBlogPosts.length > 0 && (
                <section id="blog-highlights" className="py-24 md:py-32 bg-white relative">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 reveal">
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="w-12 h-px bg-[#c5a059]"></span>
                                    <span className="text-[11px] font-black tracking-[0.4em] uppercase text-[#c5a059]">BLOG & REHBER</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-playfair font-medium text-[#020617] tracking-tight">
                                    Antalya <span className="italic text-[#c5a059]">Günlükleri</span>
                                </h2>
                            </div>
                            <Link href="/blog" className="text-xs font-bold uppercase tracking-widest text-[#020617] border-b-2 border-black/10 pb-2 hover:border-[#c5a059] transition-all">
                                Tüm Yazıları Gör
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-children">
                            {randomBlogPosts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.slug}`} className="reveal group flex flex-col transition-all duration-500">
                                    <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] mb-8 shadow-xl">
                                        <Image src={post.featuredImage || '/bg1.webp'} alt={post.title} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-700"></div>
                                        <span className="absolute bottom-4 left-6 text-[10px] font-bold text-white uppercase tracking-widest rounded-full px-4 py-1.5 bg-black/30 backdrop-blur-md border border-white/10">{post.category}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#020617] mb-3 group-hover:text-[#c5a059] transition-colors leading-tight line-clamp-2">{post.title}</h3>
                                    <p className="text-[#666] text-sm font-light leading-relaxed line-clamp-2 mb-6">{post.excerpt}</p>
                                    <div className="mt-auto flex items-center gap-3 text-[#c5a059] group-hover:translate-x-2 transition-transform duration-500">
                                        <span className="text-[10px] font-black uppercase tracking-widest">Devamını Oku</span>
                                        <i className="fa-solid fa-arrow-right text-[10px]"></i>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Testimonials Section ── */}
            {userReviews.length > 0 && (
                <section id="testimonials" className="py-24 md:py-32 bg-[#fafafa]">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-20 reveal">
                            <h2 className="text-4xl md:text-6xl font-playfair font-medium text-[#020617] tracking-tight mb-8">
                                Misafirlerimizin <span className="italic text-[#c5a059]">Gözünden</span>
                            </h2>
                            <div className="flex items-center justify-center gap-2 text-[#c5a059]">
                                {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star text-sm"></i>)}
                                <span className="ml-4 text-sm font-bold text-[#020617] uppercase tracking-widest">4.9/5 Mükemmel Deneyim</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
                            {userReviews.slice(0, 3).map((review) => (
                                <div key={review.id} className="reveal p-12 rounded-[3rem] bg-white border border-black/[0.01] shadow-sm relative flex flex-col items-center text-center">
                                    <i className="fa-solid fa-quote-left absolute top-8 left-10 text-black/[0.03] text-7xl"></i>
                                    <p className="text-[#444] text-lg font-light leading-relaxed italic mb-10">"{review.text}"</p>
                                    <div className="mt-auto flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-[#f8f7f4] flex items-center justify-center text-[#c5a059] font-black mb-4 border border-black/5 shadow-sm">
                                            {review.name.charAt(0)}
                                        </div>
                                        <h4 className="text-[#020617] font-bold text-sm tracking-widest uppercase mb-1">{review.name}</h4>
                                        <p className="text-black/30 text-[10px] font-bold uppercase tracking-tighter">{review.country}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Stats Dashboard */}
                        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 reveal">
                            {stats.map((s, i) => (
                                <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-black/[0.03] text-center shadow-sm">
                                    <div className="w-12 h-12 rounded-2xl bg-[#f8f7f4] text-[#c5a059] flex items-center justify-center mx-auto mb-6 shadow-sm"><i className={`fa-solid ${s.icon}`}></i></div>
                                    <p className="text-5xl font-playfair font-medium text-[#020617] mb-2">{s.val}</p>
                                    <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.4em]">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Final CTA Section ── */}
            <section className="relative py-32 md:py-48 overflow-hidden bg-[#020617]">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #c5a059 0%, transparent 70%)' }} />
                <div className="max-w-4xl mx-auto px-6 text-center reveal relative z-10">
                    <h2 className="text-5xl md:text-8xl font-playfair font-medium text-white mb-12 tracking-tighter leading-none">
                        Unutulmaz Bir Yolculuk <br /><span className="text-[#c5a059] italic">Sizi Bekliyor</span>
                    </h2>
                    <p className="text-white/50 text-xl md:text-2xl font-light mb-16 max-w-2xl mx-auto">
                        Antalya'daki evinizde gibi hissedin. Ata Flug Transfer ile lüksün sınırlarını yeniden keşfedin.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <button onClick={() => setBookingFormOpen(true)} className="w-full sm:w-auto px-16 py-6 bg-[#c5a059] text-[#020617] font-bold rounded-full hover:bg-white transition-all duration-500 uppercase tracking-[0.2em] text-xs shadow-[0_0_50px_rgba(197,160,89,0.3)]">
                            Rezervasyon Yap
                        </button>
                        <a href={`tel:${siteContent.business.phone}`} className="text-white font-bold uppercase tracking-[0.2em] text-xs border-b-2 border-white/10 pb-2 hover:border-[#c5a059] hover:text-[#c5a059] transition-all">
                            Hemen Bizi Arayın
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
