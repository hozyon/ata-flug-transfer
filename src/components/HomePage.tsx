'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '../store/useAppStore';
import { useSiteContent } from '../SiteContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { UserReview } from '../types';

interface HomePageProps {
    userReviews: UserReview[];
}

export default function HomePage({ userReviews }: HomePageProps) {
    const { siteContent } = useSiteContent();
    const { setBookingFormOpen } = useAppStore();

    const regionsCarouselRef = useRef<HTMLDivElement>(null);

    useScrollReveal();

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
        }, 4000);
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
                    el.scrollBy({ left: 280, behavior: 'smooth' });
                }
            }, 5000);
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

    const heroBgs = siteContent.hero.backgrounds || ['/bg1.webp', '/bg2.webp', '/bg3.webp'];
    const [currentBgIndex, setCurrentBgIndex] = useState(0);

    useEffect(() => {
        if (heroBgs.length <= 1) return;
        const id = setInterval(() => setCurrentBgIndex(prev => (prev + 1) % heroBgs.length), 12000);
        return () => clearInterval(id);
    }, [heroBgs.length]);

    return (
        <main className="min-h-screen bg-[#fafafa]">
            {/* ── Hero Section ── */}
            <section className="relative h-[95vh] min-h-[700px] flex items-center justify-center overflow-hidden bg-white">
                {/* Background images with crossfade */}
                {heroBgs.map((bg, idx) => (
                    <div key={idx} className={`absolute inset-0 transition-opacity duration-[3000ms] ease-in-out ${idx === currentBgIndex ? 'opacity-100' : 'opacity-0'}`}>
                        <Image src={bg} alt="Antalya VIP Transfer" fill priority={idx === 0} className="object-cover scale-100 animate-[slow-zoom_30s_infinite_alternate]" />
                    </div>
                ))}
                {/* Lighter, more elegant gradient */}
                <div className="absolute inset-0 bg-white/25 backdrop-blur-[1px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <div className="reveal">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/80 text-[#1a1a1a] text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-md border border-white/50 mb-8 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]"></span>
                            PREMIUM VIP SERVICES
                        </div>
                        <h1 className="text-5xl sm:text-7xl md:text-9xl font-playfair font-medium text-[#0a0a0a] mb-8 tracking-tighter leading-[0.9] text-balance">
                            Zarafet <span className="text-[#c5a059] italic font-light">&</span><br />Konforun Zirvesi
                        </h1>
                        <p className="text-[#444] text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-light tracking-tight leading-relaxed text-balance">
                            Antalya'nın eşsiz güzelliklerini, özel tasarım araçlarımız ve profesyonel şoförlerimizle keşfedin.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button 
                                onClick={() => setBookingFormOpen(true)} 
                                className="w-full sm:w-auto px-12 py-5 bg-[#c5a059] text-white font-bold rounded-full transition-all duration-500 hover:bg-[#b08d48] hover:shadow-2xl hover:shadow-[#c5a059]/30 active:scale-95 uppercase tracking-widest text-xs"
                            >
                                Hemen Rezervasyon
                            </button>
                            <a 
                                href={`https://wa.me/${siteContent.business.whatsapp}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-full sm:w-auto px-12 py-5 bg-white/80 text-[#1a1a1a] font-bold rounded-full backdrop-blur-md border border-black/5 transition-all duration-500 hover:bg-white hover:border-black/10 active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs shadow-sm"
                            >
                                <i className="fa-brands fa-whatsapp text-lg text-[#25D366]"></i> WhatsApp Destek
                            </a>
                        </div>
                    </div>
                </div>

                {/* Refined trust bar */}
                <div className="absolute bottom-12 left-0 right-0 z-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-12 md:gap-24">
                        <div className="flex items-center gap-3 text-[#1a1a1a]/40 text-xs font-bold uppercase tracking-[0.2em]">
                            <i className="fa-solid fa-shield-halved text-[#c5a059] text-[10px]"></i>
                            <span>Sabit Fiyat</span>
                        </div>
                        <div className="h-4 w-px bg-black/10" />
                        <div className="flex items-center gap-3 text-[#1a1a1a]/40 text-xs font-bold uppercase tracking-[0.2em]">
                            <i className="fa-solid fa-star text-[#c5a059] text-[10px]"></i>
                            <span>Premium Hizmet</span>
                        </div>
                        <div className="h-4 w-px bg-black/10" />
                        <div className="flex items-center gap-3 text-[#1a1a1a]/40 text-xs font-bold uppercase tracking-[0.2em]">
                            <i className="fa-solid fa-location-dot text-[#c5a059] text-[10px]"></i>
                            <div className="w-[100px] overflow-hidden">
                                <span key={currentRegionIndex} className={`block transition-all duration-700 ${isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                                    {pricedRegions[currentRegionIndex]?.name || 'Antalya'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pricing Section ── */}
            {pricedRegions.length > 0 && (
                <section className="relative py-24 md:py-32 bg-[#fafafa]">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16 reveal">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <span className="w-12 h-px bg-[#c5a059]/30"></span>
                                <span className="text-[11px] font-black tracking-[0.4em] uppercase text-[#c5a059]">TRANSFER ÜCRETLERİ</span>
                                <span className="w-12 h-px bg-[#c5a059]/30"></span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-playfair font-medium text-[#0a0a0a] tracking-tight">
                                Şeffaf <span className="italic text-[#c5a059]">Fiyatlandırma</span>
                            </h2>
                            <p className="text-[#666] text-sm md:text-base mt-6 max-w-xl mx-auto font-light leading-relaxed">
                                Araç başı sabit fiyatlar. Sürpriz ödeme yok, tüm vergiler ve havalimanı karşılama hizmeti dahil.
                            </p>
                        </div>

                        {/* Search bar refined */}
                        <div className="max-w-xl mx-auto mb-16 reveal">
                            <div className="relative group">
                                <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#c5a059] transition-colors"></i>
                                <input 
                                    type="text" 
                                    value={priceSearch} 
                                    onChange={e => setPriceSearch(e.target.value)} 
                                    placeholder="Bölge veya destinasyon ara..." 
                                    className="w-full pl-14 pr-6 py-5 bg-white border border-black/5 rounded-full text-sm text-[#1a1a1a] placeholder-black/20 focus:outline-none focus:border-[#c5a059]/40 focus:ring-4 focus:ring-[#c5a059]/5 transition-all editorial-shadow"
                                />
                                {priceSearch && (
                                    <button onClick={() => setPriceSearch('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors">
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Regions Grid refined */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 reveal-stagger">
                            {sortedRegions
                                .filter(r => !priceSearch || r.name.toLowerCase().includes(priceSearch.toLowerCase()))
                                .slice(0, 12)
                                .map(region => (
                                <a 
                                    key={region.id} 
                                    href={buildWaUrl(region.name, region.price)} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group bg-white p-6 rounded-3xl border border-black/[0.03] transition-all duration-500 hover:editorial-shadow-lg hover:-translate-y-1 flex flex-col items-center text-center"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#f8f7f4] flex items-center justify-center mb-4 text-[#c5a059] transition-colors group-hover:bg-[#c5a059] group-hover:text-white">
                                        <i className="fa-solid fa-location-dot text-sm"></i>
                                    </div>
                                    <h3 className="text-base font-bold text-[#0a0a0a] mb-1 group-hover:text-[#c5a059] transition-colors">{region.name}</h3>
                                    <p className="text-[10px] text-black/30 uppercase tracking-[0.2em] font-bold mb-4">Tek Yön Transfer</p>
                                    <div className="mt-auto pt-4 border-t border-black/5 w-full flex items-center justify-center gap-2">
                                        <span className="text-xl font-bold text-[#1a1a1a]">{sym}{region.price}</span>
                                        <i className="fa-brands fa-whatsapp text-[#25D366] text-lg opacity-0 group-hover:opacity-100 transition-opacity"></i>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className="mt-16 text-center reveal">
                            <Link href="/bolgeler" className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#c5a059] border-b-2 border-[#c5a059]/20 pb-2 hover:border-[#c5a059] transition-all">
                                Tüm Fiyat Listesini Gör <i className="fa-solid fa-arrow-right text-[10px]"></i>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Services Section ── */}
            <section id="services" className="py-24 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        <div className="lg:col-span-5 reveal">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="w-12 h-px bg-[#c5a059]"></span>
                                <span className="text-[11px] font-black tracking-[0.4em] uppercase text-[#c5a059]">HİZMETLERİMİZ</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-playfair font-medium text-[#0a0a0a] mb-8 leading-[1.1] tracking-tighter">
                                Yolculuğunuzu <span className="italic text-[#c5a059]">Sanata Dönüştürün</span>
                            </h2>
                            <p className="text-[#666] text-lg font-light leading-relaxed mb-10">
                                Sadece bir transfer değil, Antalya'nın en prestijli seyahat deneyimini sunuyoruz. Modern filomuz ve VIP protokol eğitimli şoförlerimizle emrinizdeyiz.
                            </p>
                            <Link href="/hakkimizda" className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-black/10 text-black hover:bg-black hover:text-white transition-all duration-500">
                                <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>
                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 reveal-stagger">
                            {[
                                { title: 'Havalimanı Karşılama', desc: 'İsme özel karşılama ve bagaj yardımı ile uçuş sonrası stresini geride bırakın.', icon: 'fa-plane-arrival' },
                                { title: 'Lüks Araç Filosu', desc: 'Son model Mercedes Vito ve Sprinter araçlarımızla konforun tadını çıkarın.', icon: 'fa-car' },
                                { title: '7/24 Canlı Destek', desc: 'Günün her saati ulaşabileceğiniz operasyon merkezimizle her zaman yanınızdayız.', icon: 'fa-headset' },
                                { title: 'Güvenli Ödeme', desc: 'Araçta nakit, kredi kartı veya online ödeme seçenekleriyle esneklik sağlayın.', icon: 'fa-credit-card' },
                            ].map((s, i) => (
                                <div key={i} className="p-10 rounded-[2.5rem] bg-[#fafafa] border border-black/[0.02] transition-all duration-500 hover:editorial-shadow-lg">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-sm text-[#c5a059]">
                                        <i className={`fa-solid ${s.icon} text-lg`}></i>
                                    </div>
                                    <h4 className="text-xl font-bold text-[#1a1a1a] mb-4">{s.title}</h4>
                                    <p className="text-[#666] text-sm font-light leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Regions Carousel Section ── */}
            {pricedRegions.length > 0 && (
                <section className="py-24 bg-[#fafafa] overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 mb-16 reveal">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div>
                                <h2 className="text-4xl md:text-6xl font-playfair font-medium text-[#0a0a0a] tracking-tight">
                                    Popüler <span className="italic text-[#c5a059]">Destinasyonlar</span>
                                </h2>
                            </div>
                            <Link href="/bolgeler" className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 hover:text-[#c5a059] transition-colors">Tümünü Keşfet</Link>
                        </div>
                    </div>
                    
                    <div ref={regionsCarouselRef} className="flex gap-8 overflow-x-auto scrollbar-hide px-6 md:px-[calc((100vw-1280px)/2)] lg:px-[calc((100vw-1280px)/2)] pb-12">
                        {pricedRegions.map((region) => {
                            const slug = region.name.toLowerCase().replace(/ /g, '-').replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c').replace(/[^a-z0-9-]/g, '');
                            return (
                                <Link key={region.id} href={`/transfer/${slug}-transfer`} className="group relative block w-[320px] h-[440px] rounded-[3rem] overflow-hidden shrink-0 editorial-shadow-lg">
                                    <Image src={region.image || '/bg1.webp'} alt={region.name} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-10 left-8 right-8">
                                        <p className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.3em] mb-3">Antalya</p>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-[#c5a059] transition-colors">{region.name}</h3>
                                        <div className="mt-6 flex items-center justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                            <span className="text-white/80 text-xs font-bold uppercase tracking-widest">Fiyatları Gör</span>
                                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                                                <i className="fa-solid fa-arrow-right text-xs"></i>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* ── Testimonials ── */}
            {userReviews.length > 0 && (
                <section className="py-24 md:py-32 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20 reveal">
                            <h2 className="text-4xl md:text-6xl font-playfair font-medium text-[#0a0a0a] tracking-tight mb-8">
                                Misafir <span className="italic text-[#c5a059]">Görüşleri</span>
                            </h2>
                            <div className="flex items-center justify-center gap-1 text-[#c5a059]">
                                {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star text-sm"></i>)}
                                <span className="ml-3 text-sm font-bold text-black uppercase tracking-widest">4.9/5 Mükemmel</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-stagger">
                            {userReviews.slice(0, 3).map((review) => (
                                <div key={review.id} className="p-12 rounded-[3rem] bg-[#fafafa] border border-black/[0.01] relative flex flex-col items-center text-center">
                                    <i className="fa-solid fa-quote-left absolute top-8 left-10 text-black/[0.03] text-6xl italic"></i>
                                    <p className="text-[#1a1a1a] text-lg font-light leading-relaxed mb-10 italic">
                                        "{review.text}"
                                    </p>
                                    <div className="mt-auto">
                                        <h4 className="text-[#0a0a0a] font-bold text-sm tracking-widest uppercase mb-1">{review.name}</h4>
                                        <p className="text-black/30 text-[10px] font-bold uppercase tracking-widest">{review.country}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Final CTA Section ── */}
            <section className="py-32 md:py-48 bg-[#fafafa] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/5 to-transparent"></div>
                <div className="max-w-5xl mx-auto px-6 text-center reveal">
                    <h2 className="text-5xl md:text-8xl font-playfair font-medium text-[#0a0a0a] mb-12 tracking-tighter leading-none">
                        Unutulmaz Bir Yolculuk <br /><span className="text-[#c5a059] italic">Sizi Bekliyor</span>
                    </h2>
                    <p className="text-[#666] text-xl md:text-2xl font-light mb-16 max-w-2xl mx-auto">
                        Ata Flug Transfer ile Antalya'daki evinizde gibi hissedin. Profesyonellik ve konforun buluşma noktası.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <button 
                            onClick={() => setBookingFormOpen(true)} 
                            className="w-full sm:w-auto px-16 py-6 bg-black text-white font-bold rounded-full hover:bg-[#c5a059] transition-all duration-500 uppercase tracking-[0.2em] text-xs shadow-xl"
                        >
                            Rezervasyon Yap
                        </button>
                        <a 
                            href={`tel:${siteContent.business.phone}`} 
                            className="text-black font-bold uppercase tracking-[0.2em] text-xs border-b-2 border-black/10 pb-2 hover:border-[#c5a059] hover:text-[#c5a059] transition-all"
                        >
                            Hemen Bizi Arayın
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
