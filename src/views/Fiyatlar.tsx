'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAppStore } from '../store/useAppStore';
import { useSiteContent } from '../SiteContext';

const Fiyatlar: React.FC = () => {
    const t = useTranslations('pricingPage');
    const { siteContent } = useAppStore();
    const { siteContent: sc } = useSiteContent();
    const business = siteContent.business || sc.business;
    const regions = siteContent.regions || sc.regions || [];
    const pathname = usePathname();
    const localeMatch = pathname?.match(/^\/([a-z]{2})(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : 'tr';
    const [search, setSearch] = useState('');

    const activeRegions = regions.filter(r => r.isActive !== false);
    const filtered = search.trim()
        ? activeRegions.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
        : activeRegions;

    return (
        <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
            {/* SEO handled by generateMetadata() in page.tsx */}

            {/* Banner */}
            <div className="relative pt-28 pb-14 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/contact-banner.png"
                        alt="Transfer Fiyatları"
                        fill
                        priority
                        className="object-cover object-center scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-900/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark)] via-slate-900/40 to-transparent" />
                </div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-4 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                        <span>{t('eyebrow')}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-4 leading-none tracking-tight drop-shadow-2xl">
                        {t('title')}
                    </h1>
                    <p className="text-slate-100/90 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed drop-shadow-md">
                        {t('subtitle')}
                    </p>
                </div>
            </div>

            {/* Search + Grid */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search */}
                    <div className="mb-8 max-w-md mx-auto">
                        <div className="relative">
                            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" aria-hidden="true" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder={t('searchPlaceholder')}
                                aria-label={t('searchPlaceholder')}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                            />
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">
                            <i className="fa-solid fa-map-location-dot text-4xl mb-4 block" aria-hidden="true" />
                            <p>{t('noResults')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filtered.map(region => (
                                <Link
                                    key={region.id}
                                    href={`/${locale}/transfer/${region.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-transfer`}
                                    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md hover:border-[var(--color-primary)]/30 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    {region.image && (
                                        <div className="h-36 overflow-hidden relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={region.image}
                                                alt={region.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <h2 className="font-playfair font-bold text-slate-800 text-lg mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                                            {region.name}
                                        </h2>
                                        <div className="flex items-center justify-between mt-3">
                                            <div>
                                                <span className="text-xs text-slate-400 uppercase tracking-wider">{t('startingFrom')}</span>
                                                <div className="text-2xl font-bold text-[var(--color-primary)]">
                                                    €{region.price}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                                <span>{t('details')}</span>
                                                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {[
                                                { icon: 'fa-car', label: t('perVehicle') },
                                                { icon: 'fa-arrow-right', label: t('oneWay') },
                                                { icon: 'fa-tag', label: t('fixedPrice') },
                                            ].map(b => (
                                                <span key={b.label} className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 rounded-full px-2 py-0.5">
                                                    <i className={`fa-solid ${b.icon} text-[8px] text-[var(--color-primary)]`} />
                                                    {b.label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-[var(--color-dark)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="font-playfair font-bold text-white leading-tight mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                        {t('ctaTitle')}
                    </h2>
                    <p className="text-white/40 mb-8 max-w-xl mx-auto text-sm">
                        {t('ctaDesc')}
                    </p>
                    <a
                        href={`https://wa.me/${business.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 text-white font-bold px-8 py-3.5 rounded-2xl transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                        style={{ background: '#25D366' }}
                    >
                        <i className="fa-brands fa-whatsapp text-xl" aria-hidden="true" />
                        <span>{t('ctaBtn')}</span>
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Fiyatlar;
