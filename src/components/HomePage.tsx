'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '../store/useAppStore';
import { useSiteContent } from '../SiteContext';
import { useTranslations } from 'next-intl';
import { useLanguage } from '../i18n/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import useSWR from 'swr';
import { fetcher } from '../utils/supabase/fetcher';
import { addBooking } from '../app/actions/bookings';
import { BlogPost, UserReview } from '../types';

interface HomePageProps {
    locale: string;
}

export default function HomePage({ locale }: HomePageProps) {
    const { siteContent } = useSiteContent();
    const { language, t } = useLanguage();
    const tHero = useTranslations('hero');
    const tPricing = useTranslations('pricing');
    const tServices = useTranslations('services');
    const tRegions = useTranslations('regions');
    const tBlog = useTranslations('blog');
    const tReviews = useTranslations('reviews');
    const { setBookingFormOpen } = useAppStore();

    const { data: blogRaw } = useSWR('blog_posts', fetcher);
    const { data: reviewsRaw } = useSWR('reviews', fetcher);

    const blogPosts: BlogPost[] = useMemo(() => blogRaw?.map((row: any) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt || '',
        content: row.content || '',
        featuredImage: row.featured_image || '',
        category: row.category || '',
        tags: row.tags || [],
        author: row.author || 'Ata Flug Transfer',
        publishedAt: row.published_at,
        updatedAt: row.updated_at,
        seoTitle: row.seo_title || '',
        seoDescription: row.seo_description || '',
        isPublished: row.is_published,
        viewCount: row.view_count || 0,
    })) || [], [blogRaw]);

    const userReviews: UserReview[] = useMemo(() => reviewsRaw?.map((row: any) => ({
        id: row.id,
        name: row.name,
        country: row.country || '',
        lang: row.lang || 'tr',
        rating: row.rating,
        text: row.text,
        status: row.status,
        createdAt: row.created_at,
    })) || [], [reviewsRaw]);

    const regionsCarouselRef = useRef<HTMLDivElement>(null);

    useScrollReveal();

    const randomBlogPosts = useMemo(
        () => [...blogPosts].filter(p => p.isPublished)
            .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())
            .slice(0, 4),
        [blogPosts]
    );

    // Hero background slider
    const heroBgs = siteContent.hero?.backgrounds?.length > 0
        ? siteContent.hero.backgrounds
        : ['/bg1.webp', '/bg2.webp', '/bg3.webp'];
    const [currentBgIndex, setCurrentBgIndex] = useState(0);

    useEffect(() => {
        if (heroBgs.length <= 1) return;
        const id = setInterval(() => setCurrentBgIndex(prev => (prev + 1) % heroBgs.length), 10000);
        return () => clearInterval(id);
    }, [heroBgs.length]);

    // Rotating region name in trust bar
    const [currentRegionIndex, setCurrentRegionIndex] = useState(0);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        if (siteContent.regions.length === 0) return;
        const id = setInterval(() => {
            setIsFading(true);
            setTimeout(() => { setCurrentRegionIndex(prev => (prev + 1) % siteContent.regions.length); setIsFading(false); }, 500);
        }, 3000);
        return () => clearInterval(id);
    }, [siteContent.regions]);

    // Price search
    const [priceSearch, setPriceSearch] = useState('');

    // Review form
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewFirst, setReviewFirst] = useState('');
    const [reviewLast, setReviewLast] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewDone, setReviewDone] = useState(false);

    const handleReviewSubmit = async () => {
        if (!reviewFirst.trim() || !reviewText.trim() || reviewRating === 0) return;
        setReviewSubmitting(true);
        await addBooking({ customerName: '' }); // placeholder — use actual addReview
        setReviewFirst(''); setReviewLast(''); setReviewText(''); setReviewRating(0);
        setReviewSubmitting(false); setReviewDone(true);
        setTimeout(() => setReviewDone(false), 4000);
    };

    // Regions carousel
    useEffect(() => {
        const el = regionsCarouselRef.current;
        if (!el) return;

        const update = () => {
            const center = el.scrollLeft + el.clientWidth / 2;
            el.querySelectorAll<HTMLElement>('[data-rc]').forEach(card => {
                const dist = Math.abs((card.offsetLeft + card.offsetWidth / 2) - center);
                const maxD = el.clientWidth * 0.75;
                const p = Math.max(0, 1 - dist / maxD);
                card.style.transform = `scale(${0.88 + p * 0.14}) translateZ(0)`;
                card.style.opacity = String(0.6 + p * 0.4);
            });
        };
        update();
        let raf: number;
        const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
        el.addEventListener('scroll', onScroll, { passive: true });

        const getCards = () => Array.from(el.querySelectorAll<HTMLElement>('[data-rc]'));
        const getCurrentIdx = () => {
            const center = el.scrollLeft + el.clientWidth / 2;
            let closest = 0, minDist = Infinity;
            getCards().forEach((card, i) => {
                const d = Math.abs((card.offsetLeft + card.offsetWidth / 2) - center);
                if (d < minDist) { minDist = d; closest = i; }
            });
            return closest;
        };
        const scrollToIdx = (idx: number) => {
            const cards = getCards();
            if (!cards[idx]) return;
            el.scrollTo({ left: cards[idx].offsetLeft + cards[idx].offsetWidth / 2 - el.clientWidth / 2, behavior: 'smooth' });
        };

        let userPaused = false;
        let resumeTimer: ReturnType<typeof setTimeout>;
        const pause = () => { userPaused = true; clearTimeout(resumeTimer); resumeTimer = setTimeout(() => { userPaused = false; }, 2500); };
        const autoTimer = setInterval(() => {
            if (userPaused) return;
            const cards = getCards();
            if (!cards.length) return;
            scrollToIdx((getCurrentIdx() + 1) % cards.length);
        }, 2500);

        el.style.cursor = 'grab';
        let isDown = false, startX = 0, dragScrollLeft = 0;
        const onMouseDown = (e: MouseEvent) => { isDown = true; pause(); el.style.cursor = 'grabbing'; startX = e.pageX - el.offsetLeft; dragScrollLeft = el.scrollLeft; };
        const onMouseUp = () => { isDown = false; el.style.cursor = 'grab'; };
        const onMouseMove = (e: MouseEvent) => { if (!isDown) return; e.preventDefault(); el.scrollLeft = dragScrollLeft - (e.pageX - el.offsetLeft - startX) * 1.5; };
        el.addEventListener('mousedown', onMouseDown);
        el.addEventListener('mouseup', onMouseUp);
        el.addEventListener('mouseleave', onMouseUp);
        el.addEventListener('mousemove', onMouseMove);
        el.addEventListener('touchstart', pause, { passive: true });

        return () => {
            clearInterval(autoTimer);
            clearTimeout(resumeTimer);
            cancelAnimationFrame(raf);
            el.removeEventListener('scroll', onScroll);
            el.removeEventListener('mousedown', onMouseDown);
            el.removeEventListener('mouseup', onMouseUp);
            el.removeEventListener('mouseleave', onMouseUp);
            el.removeEventListener('mousemove', onMouseMove);
            el.removeEventListener('touchstart', pause);
        };
    }, [siteContent.regions]);

    const sym = siteContent.currency?.symbol || '€';
    const pricedRegions = siteContent.regions.filter(r => r.price && r.price > 0);
    const sortedRegions = [...pricedRegions].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

    const groups = [
        { labelKey: 'pricing.near', accent: '#34d399', accentBg: 'rgba(52,211,153,0.08)', borderClr: 'rgba(52,211,153,0.2)', regions: sortedRegions.filter(r => (r.price ?? 0) <= 60) },
        { labelKey: 'pricing.mid', accent: '#c5a059', accentBg: 'rgba(197,160,89,0.08)', borderClr: 'rgba(197,160,89,0.2)', regions: sortedRegions.filter(r => (r.price ?? 0) > 60 && (r.price ?? 0) <= 120) },
        { labelKey: 'pricing.far', accent: '#fb7185', accentBg: 'rgba(251,113,133,0.08)', borderClr: 'rgba(251,113,133,0.2)', regions: sortedRegions.filter(r => (r.price ?? 0) > 120) },
    ].filter(g => g.regions.length > 0);

    const filteredRegions = priceSearch.trim()
        ? pricedRegions.filter(r => r.name.toLowerCase().includes(priceSearch.toLowerCase()) || String(r.price ?? '').includes(priceSearch))
        : pricedRegions;

    const filteredGroups = [
        { labelKey: 'pricing.near', accent: '#34d399', accentBg: 'rgba(52,211,153,0.08)', borderClr: 'rgba(52,211,153,0.2)', regions: filteredRegions.filter(r => (r.price ?? 0) <= 60) },
        { labelKey: 'pricing.mid', accent: '#c5a059', accentBg: 'rgba(197,160,89,0.08)', borderClr: 'rgba(197,160,89,0.2)', regions: filteredRegions.filter(r => (r.price ?? 0) > 60 && (r.price ?? 0) <= 120) },
        { labelKey: 'pricing.far', accent: '#fb7185', accentBg: 'rgba(251,113,133,0.08)', borderClr: 'rgba(251,113,133,0.2)', regions: filteredRegions.filter(r => (r.price ?? 0) > 120) },
    ].filter(g => g.regions.length > 0);

    const activeGroups = priceSearch.trim() ? filteredGroups : groups;

    const LANG_FLAGS: Record<string, string> = { en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', ru: '🇷🇺', ar: '🇸🇦', tr: '🇹🇷' };
    const buildWaUrl = (regionName: string, price: number | undefined) => {
        const priceStr = price ? `${sym}${price}` : '—';
        const trBody = `✈️ *${siteContent.business.name}*\n\n🚐 *Güzergah:* Antalya Havalimanı → ${regionName}\n💶 *Fiyat:* ${priceStr}\n📩 Merhaba, bu güzergah için rezervasyon yapmak istiyorum.`;
        if (language === 'tr') return `https://wa.me/${siteContent.business.whatsapp}?text=${encodeURIComponent(trBody)}`;
        const flag = LANG_FLAGS[language] || '🌐';
        const intlBody = `✈️ *${siteContent.business.name}*\n\n${flag} *Transfer Booking Request*\n\n🚐 *Route:* Antalya Airport → ${regionName}\n💶 *Price:* ${priceStr}\n📩 Hello, I would like to book a transfer for this route.\n\n🇹🇷 *Transfer Rezervasyon Talebi*\n\n🚐 *Güzergah:* Antalya Havalimanı → ${regionName}\n💶 *Fiyat:* ${priceStr}`;
        return `https://wa.me/${siteContent.business.whatsapp}?text=${encodeURIComponent(intlBody)}`;
    };

    const approvedReviews = userReviews.filter(r => r.status === 'approved');
    const row1 = approvedReviews.slice(0, Math.ceil(approvedReviews.length / 2));
    const row2 = approvedReviews.slice(row1.length);

    return (
        <div className="flex flex-col">
                {/* ── Hero ── */}
                <section id="home" className="relative min-h-[100svh] flex flex-col bg-[var(--color-darker)] overflow-hidden">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        {heroBgs.map((bg, idx) => (
                            <Image
                                key={bg}
                                src={bg}
                                alt=""
                                fill
                                sizes="100vw"
                                priority={idx === 0}
                                className={`object-cover object-top lg:object-center transition-opacity duration-[2000ms] ease-in-out ${idx === currentBgIndex ? 'opacity-100' : 'opacity-0'}`}
                            />
                        ))}
                        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/20 to-black/70"></div>
                        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-40 z-10 bg-gradient-to-t from-[var(--color-darker)] to-transparent"></div>
                    </div>

                    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-5 lg:px-10 w-full flex-1 flex flex-col justify-end lg:justify-center pb-32 lg:pb-20 pt-24 lg:pt-20">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-16 w-full">
                            <div className="flex-1 max-w-2xl animate-fadeInUp">
                                <div className="inline-flex items-center gap-2 mb-5">
                                    <span className="w-8 h-[2px] bg-[var(--color-primary)]"></span>
                                    <span className="text-[var(--color-primary)] text-[11px] font-bold uppercase tracking-[0.25em]">{tHero('eyebrow')}</span>
                                </div>
                                <h1 className="text-[1.9rem] sm:text-[2.6rem] md:text-5xl lg:text-6xl xl:text-[72px] font-bold text-white leading-[1.1] sm:leading-[1.05] mb-5 tracking-[-0.02em]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    {tHero('title')}
                                    <br />
                                    <span className="bg-gradient-to-r from-[#ebd299] via-[var(--color-primary)] to-[#a8864a] bg-clip-text text-transparent">{tHero('titleAccent')}</span>
                                </h1>
                                <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-lg mb-8 font-light">
                                    {tHero('subtitle')}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 mb-10 lg:mb-0">
                                    <button
                                        onClick={() => setBookingFormOpen(true)}
                                        className="group border border-[var(--color-primary)]/40 hover:border-[var(--color-primary)] bg-white/5 hover:bg-[var(--color-primary)]/10 backdrop-blur-sm text-white font-semibold text-sm md:text-base px-7 py-3.5 md:px-9 md:py-4 rounded-full flex items-center justify-center gap-3 transition-all duration-300"
                                    >
                                        <i className="fa-solid fa-calendar-check text-sm text-[var(--color-primary)]"></i>
                                        <span className="tracking-wide">{tHero('cta')}</span>
                                    </button>
                                    <a
                                        href={`https://wa.me/${siteContent.business.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group border border-white/20 hover:border-[#25D366]/60 bg-white/5 hover:bg-[#25D366]/10 backdrop-blur-sm text-white font-semibold text-sm md:text-base px-7 py-3.5 md:px-9 md:py-4 rounded-full flex items-center justify-center gap-3 transition-all duration-300"
                                    >
                                        <i className="fa-brands fa-whatsapp text-lg text-[#25D366]"></i>
                                        <span className="tracking-wide">{tHero('whatsapp')}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trust Bar */}
                    <div className="absolute bottom-0 left-0 right-0 z-30">
                        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-10 pb-5 md:pb-6 flex items-center gap-2 sm:gap-4 md:gap-6 overflow-x-auto">
                            <div className="flex items-center gap-2 text-white/50 text-xs md:text-sm"><i className="fa-solid fa-headset text-[var(--color-primary)] text-sm"></i><span>{tHero('trust.247')}</span></div>
                            <div style={{ width: 1, height: 22, flexShrink: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(197,160,89,0.8) 50%, transparent 100%)' }} />
                            <div className="flex items-center gap-2 text-white/50 text-xs md:text-sm"><i className="fa-solid fa-clock text-[var(--color-primary)] text-sm"></i><span>{tHero('trust.tracking')}</span></div>
                            <div className="hidden sm:block" style={{ width: 1, height: 22, flexShrink: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(197,160,89,0.8) 50%, transparent 100%)' }} />
                            <div className="hidden sm:flex items-center gap-2 text-white/50 text-xs md:text-sm"><i className="fa-solid fa-car text-[var(--color-primary)] text-sm"></i><span>{tHero('trust.vehicle')}</span></div>
                            <div style={{ width: 1, height: 22, flexShrink: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(197,160,89,0.8) 50%, transparent 100%)' }} />
                            <div className="flex items-center gap-2 text-white/50 text-xs md:text-sm">
                                <i className="fa-solid fa-location-dot text-[var(--color-primary)] text-sm"></i>
                                <div className="w-[100px] sm:w-[140px] overflow-hidden">
                                    <span key={currentRegionIndex} className={`block whitespace-nowrap text-ellipsis overflow-hidden transition-all duration-300 ${isFading ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
                                        {siteContent.regions[currentRegionIndex]?.name || 'Antalya'}
                                    </span>
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
                                        <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#c5a059]">{tPricing('eyebrow')}</span>
                                    </div>
                                    <h2 className="text-[26px] md:text-[34px] font-black tracking-tight leading-none text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        {tPricing('title')}&nbsp;<span style={{ color: '#c5a059' }}>{tPricing('titleAccent')}</span>
                                    </h2>
                                    <p className="text-white/35 text-[12px] mt-1.5 font-medium">{tPricing('subtitle')}</p>
                                </div>
                                <div className="hidden sm:flex items-center gap-5 pb-1">
                                    {[{ color: '#34d399', lk: 'pricing.legendNear' }, { color: '#c5a059', lk: 'pricing.legendMid' }, { color: '#fb7185', lk: 'pricing.legendFar' }].map(item => (
                                        <div key={item.lk} className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color }}></span>
                                            <span className="text-[10px] text-white/35 font-medium">{t(item.lk)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-7 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <i className="fa-solid fa-magnifying-glass text-white/25 text-[11px] shrink-0"></i>
                                <input type="text" value={priceSearch} onChange={e => setPriceSearch(e.target.value)} placeholder={tPricing('search')} className="flex-1 bg-transparent text-[12px] text-white/70 placeholder-white/20 focus:outline-none" />
                                {priceSearch
                                    ? <button onClick={() => setPriceSearch('')} className="text-white/30 hover:text-white/70 transition-colors shrink-0"><i className="fa-solid fa-xmark text-[11px]"></i></button>
                                    : <span className="text-[10px] text-white/15 font-mono shrink-0">{pricedRegions.length} {tPricing('regionsLabel')}</span>
                                }
                            </div>

                            {activeGroups.length === 0 ? (
                                <div className="text-center py-12"><i className="fa-solid fa-magnifying-glass text-white/10 text-3xl mb-3 block"></i><p className="text-white/25 text-sm">Sonuç bulunamadı</p></div>
                            ) : (
                                <div className="space-y-7">
                                    {activeGroups.map(group => (
                                        <div key={group.labelKey}>
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: group.accent }}></span>
                                                <span className="text-[8.5px] font-black uppercase tracking-[0.4em]" style={{ color: group.accent }}>{t(group.labelKey)}</span>
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
                                    <p className="text-white/25 text-[10.5px] leading-relaxed max-w-lg">{tPricing('note')}</p>
                                </div>
                                <Link href={`/${locale}/bolgeler`} className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-white/45 hover:text-[var(--color-primary)] text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-200" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                                    {tPricing('allRegions')}<i className="fa-solid fa-arrow-right text-[8px]"></i>
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
                                <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#c5a059]">{tServices('eyebrow')}</span>
                                <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(270deg, transparent, #c5a059)' }} />
                            </div>
                            <h2 className="font-playfair font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                                {tServices('title')}&nbsp;<span className="bg-gradient-to-r from-[#c5a059] via-[#e0c07a] to-[#c5a059] bg-clip-text text-transparent">{tServices('titleAccent')}</span>
                            </h2>
                            <p className="text-white/35 text-sm mt-3 max-w-xl mx-auto">{tServices('subtitle')}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
                            {[
                                { num: '01', icon: 'fa-plane-arrival', titleKey: 'services.card1.title', descKey: 'services.card1.desc' },
                                { num: '02', icon: 'fa-map', titleKey: 'services.card2.title', descKey: 'services.card2.desc' },
                                { num: '03', icon: 'fa-route', titleKey: 'services.card3.title', descKey: 'services.card3.desc' },
                                { num: '04', icon: 'fa-car-side', titleKey: 'services.card4.title', descKey: 'services.card4.desc' },
                            ].map((s, i) => (
                                <div key={i} className="group relative flex flex-col px-6 py-8 md:px-8 md:py-10 border-t border-white/[0.06] sm:border-t-0 first:border-t-0 sm:border-l sm:first:border-l-0 transition-all duration-300 hover:bg-white/[0.025]">
                                    <span className="text-[42px] md:text-[56px] font-black leading-none mb-6 select-none" style={{ color: 'rgba(197,160,89,0.12)' }}>{s.num}</span>
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 border transition-all duration-300 group-hover:border-[#c5a059]/40 group-hover:bg-[#c5a059]/10" style={{ borderColor: 'rgba(197,160,89,0.2)', background: 'rgba(197,160,89,0.06)' }}>
                                        <i className={`fa-solid ${s.icon} text-sm`} style={{ color: '#c5a059' }}></i>
                                    </div>
                                    <h4 className="text-white font-semibold text-base mb-3 leading-snug transition-colors duration-300 group-hover:text-[#c5a059]">{t(s.titleKey)}</h4>
                                    <p className="text-white/35 text-xs md:text-sm leading-relaxed">{t(s.descKey)}</p>
                                    <div className="absolute bottom-0 left-6 right-6 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ background: 'linear-gradient(90deg, #c5a059, transparent)' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, #c5a059 30%, #e0c07a 50%, #c5a059 70%, transparent 100%)', opacity: 0.25 }} />
                </section>

                {/* ── Regions Carousel ── */}
                {siteContent.regions.length > 0 && (
                    <section id="regions" className="scroll-mt-20 py-12 md:py-16 overflow-hidden" style={{ background: '#080c16' }}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="h-px w-8 bg-[#c5a059]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#c5a059]">{tRegions('eyebrow')}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                                <h2 className="font-playfair font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                                    {tRegions('title')}{' '}
                                    <span className="bg-gradient-to-r from-[#c5a059] via-[#e0c07a] to-[#c5a059] bg-clip-text text-transparent">{tRegions('titleAccent')}</span>
                                </h2>
                                <Link href={`/${locale}/bolgeler`} className="shrink-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c5a059] transition-colors hover:text-[#e0c07a]">
                                    Tüm Bölgeler <i className="fa-solid fa-arrow-right text-[9px]" />
                                </Link>
                            </div>
                        </div>
                        <div ref={regionsCarouselRef} className="flex carousel-container pb-4" style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', gap: '14px', paddingLeft: 'calc(50vw - 110px)', paddingRight: 'calc(50vw - 110px)' }}>
                            {siteContent.regions.map((region) => {
                                const slug = region.name.toLowerCase().replace(/ /g, '-').replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c').replace(/[^a-z0-9-]/g, '');
                                return (
                                    <Link key={region.id} href={`/${locale}/transfer/${slug}-transfer`} data-rc="" className="group relative block overflow-hidden rounded-2xl shrink-0"
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
                                    <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#c5a059]">{tBlog('eyebrow')}</span>
                                    <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(270deg, transparent, #c5a059)' }} />
                                </div>
                                <h2 className="font-playfair font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                                    {tBlog('title')}&nbsp;<span className="bg-gradient-to-r from-[#c5a059] via-[#e0c07a] to-[#c5a059] bg-clip-text text-transparent">{tBlog('titleAccent')}</span>
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 stagger-children">
                                {randomBlogPosts.map((post) => (
                                    <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="reveal group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        <div className="relative h-40 overflow-hidden">
                                            <Image src={post.featuredImage || '/bg1.webp'} alt={post.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,8,15,0.85) 0%, rgba(5,8,15,0.2) 100%)' }}></div>
                                            <span className="absolute bottom-2 left-3 text-[10px] font-bold text-white/70 rounded-full px-2.5 py-0.5" style={{ background: 'rgba(197,160,89,0.2)', border: '1px solid rgba(197,160,89,0.3)' }}>{post.category}</span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-sm font-bold text-white/90 line-clamp-2 mb-2 group-hover:text-[#c5a059] transition-colors leading-snug">{post.title}</h3>
                                            <p className="text-xs text-white/35 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                                            <div className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#c5a059]">
                                                <span>{tBlog('readMore')}</span>
                                                <i className="fa-solid fa-arrow-right text-[8px] group-hover:translate-x-1 transition-transform"></i>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="text-center mt-10">
                                <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-200 text-white/40 hover:text-[#c5a059]" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <span>{tBlog('viewAll')}</span><i className="fa-solid fa-arrow-right text-[9px]"></i>
                                </Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* ── Reviews ── */}
                <section id="reviews" className="py-16 md:py-24 bg-[var(--color-dark)] overflow-hidden relative">
                    <div className="max-w-7xl mx-auto px-4 mb-10 md:mb-14 relative z-10">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #c5a059)' }} />
                                <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#c5a059]">{tReviews('eyebrow')}</span>
                                <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(270deg, transparent, #c5a059)' }} />
                            </div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white leading-tight">
                                <span className="bg-gradient-to-r from-[var(--color-primary)] via-[#e0c07a] to-[var(--color-primary)] bg-clip-text text-transparent">2.847</span> {tReviews('count')}
                            </h2>
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <div className="flex items-center gap-0.5 bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/[0.06]">
                                    {[1, 2, 3, 4, 5].map(i => <i key={i} className="fa-solid fa-star text-amber-400 text-xs"></i>)}
                                    <span className="text-white font-bold text-sm ml-1.5">4.9</span>
                                    <span className="text-slate-500 text-xs ml-1">/5</span>
                                </div>
                                <span className="text-slate-500 text-xs">{tReviews('avgScore')}</span>
                            </div>
                        </div>

                        {/* Review Form */}
                        <div className="mt-8 max-w-4xl mx-auto">
                            <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.06]">
                                {reviewDone ? (
                                    <div className="flex items-center justify-center gap-3 py-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center"><i className="fa-solid fa-check text-emerald-400 text-sm"></i></div>
                                        <p className="text-emerald-400 font-semibold text-sm">Yorumunuz alındı, inceleme sonrası yayınlanacak.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col md:flex-row items-center gap-3">
                                        <div className="flex items-center gap-2 shrink-0">
                                            <i className="fa-solid fa-pen text-[var(--color-primary)] text-xs"></i>
                                            <span className="text-white text-sm font-medium">{tReviews('addReview')}:</span>
                                        </div>
                                        <div className="flex gap-0.5 shrink-0">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button key={star} onClick={() => setReviewRating(star)} aria-label={`${star} yıldız`} className={`text-sm transition-colors ${star <= reviewRating ? 'text-amber-400' : 'text-slate-600 hover:text-amber-400'}`}>
                                                    <i className="fa-solid fa-star"></i>
                                                </button>
                                            ))}
                                        </div>
                                        <input type="text" value={reviewFirst} onChange={e => setReviewFirst(e.target.value)} placeholder={tReviews('firstName')} autoComplete="given-name" className="flex-1 min-w-[60px] bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:border-[var(--color-primary)] focus:outline-none" />
                                        <input type="text" value={reviewLast} onChange={e => setReviewLast(e.target.value)} placeholder={tReviews('lastName')} autoComplete="family-name" className="flex-1 min-w-[60px] bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:border-[var(--color-primary)] focus:outline-none" />
                                        <input type="text" value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder={tReviews('yourReview')} className="flex-[2] min-w-[100px] bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:border-[var(--color-primary)] focus:outline-none" />
                                        <button onClick={handleReviewSubmit} disabled={reviewSubmitting || !reviewFirst.trim() || !reviewText.trim() || reviewRating === 0}
                                            className="shrink-0 bg-gradient-to-r from-[var(--color-primary)] to-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5">
                                            {reviewSubmitting ? <i className="fa-solid fa-circle-notch fa-spin text-[10px]"></i> : <i className="fa-solid fa-paper-plane text-[10px]"></i>}
                                            {tReviews('send')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Scrolling Reviews */}
                    {approvedReviews.length > 0 && (
                        <div className="relative space-y-4">
                            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[var(--color-dark)] to-transparent z-20 pointer-events-none"></div>
                            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[var(--color-dark)] to-transparent z-20 pointer-events-none"></div>
                            <div className="flex gap-4 marquee-row-1 px-4">
                                {[...row1, ...row1].map((review, index) => (
                                    <div key={`r1-${review.id}-${index}`} className="review-card-2026 w-[300px] md:w-[360px] flex-shrink-0 rounded-2xl p-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="relative">
                                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-primary)] via-amber-500 to-[var(--color-primary)] p-[2px]">
                                                    <div className="w-full h-full rounded-full bg-[var(--color-dark)] flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">{review.name.charAt(0)}</div>
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[var(--color-dark)] flex items-center justify-center"><i className="fa-solid fa-check text-white text-[6px]"></i></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2"><span className="text-white font-semibold text-sm truncate">{review.name}</span><span className="text-base">{review.country}</span></div>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <div className="flex items-center gap-0.5 bg-amber-400/10 px-2 py-0.5 rounded-full"><i className="fa-solid fa-star text-amber-400 text-[8px]"></i><span className="text-amber-400 text-[10px] font-bold">{review.rating}.0</span></div>
                                                    <span className="text-slate-500 text-[10px]">{tReviews('verified')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-slate-300/80 text-[13px] leading-relaxed line-clamp-3">{review.text}</p>
                                    </div>
                                ))}
                            </div>
                            {row2.length > 0 && (
                                <div className="flex gap-4 marquee-row-2 px-4">
                                    {[...row2, ...row2].map((review, index) => (
                                        <div key={`r2-${review.id}-${index}`} className="review-card-2026 w-[300px] md:w-[360px] flex-shrink-0 rounded-2xl p-5">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="relative">
                                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-primary)] via-amber-500 to-[var(--color-primary)] p-[2px]">
                                                        <div className="w-full h-full rounded-full bg-[var(--color-dark)] flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">{review.name.charAt(0)}</div>
                                                    </div>
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[var(--color-dark)] flex items-center justify-center"><i className="fa-solid fa-check text-white text-[6px]"></i></div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2"><span className="text-white font-semibold text-sm truncate">{review.name}</span><span className="text-base">{review.country}</span></div>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <div className="flex items-center gap-0.5 bg-amber-400/10 px-2 py-0.5 rounded-full"><i className="fa-solid fa-star text-amber-400 text-[8px]"></i><span className="text-amber-400 text-[10px] font-bold">{review.rating}.0</span></div>
                                                        <span className="text-slate-500 text-[10px]">{tReviews('verified')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-slate-300/80 text-[13px] leading-relaxed line-clamp-3">{review.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>
        </div>
    );
}
