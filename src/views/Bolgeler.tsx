'use client';

import React from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Fuse from 'fuse.js';
import { INITIAL_SITE_CONTENT } from '../constants';
import { useAppStore } from '../store/useAppStore';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Bolgeler: React.FC = () => {
    useScrollReveal();
    const { siteContent } = useAppStore();

    // Build WhatsApp message
    const buildWaMessage = (regionName: string) => {
        const trMsg = `Merhaba, *${regionName}* bölgesi için transfer fiyat bilgisi almak istiyorum.`;
        return encodeURIComponent(
            `✈️ *${siteContent.business.name}*\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n🇹🇷 *Transfer Fiyat Talebi*\n\n🚐  *Bölge:* ${regionName}\n📩  ${trMsg}\n\n⏳ _Yanıt süresi: ~2 dakika_`
        );
    };

    const pricedRegions = React.useMemo(() => (siteContent.regions || INITIAL_SITE_CONTENT.regions).filter(r => r.price && r.price > 0), [siteContent.regions]);
    const [regions, setRegions] = React.useState(pricedRegions);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [_isAnimating, setIsAnimating] = React.useState(false);
    const searchParams = useSearchParams();

    React.useEffect(() => {
        const q = searchParams.get('q');
        if (q) setSearchTerm(q);
    }, [searchParams]);

    React.useEffect(() => {
        setRegions(pricedRegions);
    }, [pricedRegions]);

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 8;

    // Initialize Fuse with useMemo for performance
    const fuse = React.useMemo(() => {
        return new Fuse(regions, {
            keys: ['name'],
            threshold: 0.2,
            distance: 100,
            includeScore: true
        });
    }, [regions]);

    // Advanced Filtering Logic
    const filteredRegions = React.useMemo(() => {
        if (!searchTerm.trim()) return regions;
        const results = fuse.search(searchTerm);
        return results.map(result => result.item);
    }, [searchTerm, regions, fuse]);

    // Trigger visual feedback (blink) on search update
    React.useEffect(() => {
        if (searchTerm) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 500);
            return () => clearTimeout(timer);
        }
    }, [searchTerm, filteredRegions]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRegions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRegions.length / itemsPerPage);

    const DISTANCE_MAP: Record<string, { dist: string; time: string }> = {
        "Antalya Havalimanı (AYT)": { "dist": "0 km", "time": "0 dk" },
        "Antalya (Merkez)": { "dist": "15 km", "time": "20 dk" },
        "Kundu": { "dist": "16 km", "time": "20 dk" },
        "Konyaaltı": { "dist": "32 km", "time": "40 dk" },
        "Belek": { "dist": "33 km", "time": "35 dk" },
        "Çolaklı": { "dist": "57 km", "time": "55 dk" },
        "Evrenseki": { "dist": "60 km", "time": "55 dk" },
        "Kumköy": { "dist": "61 km", "time": "55 dk" },
        "Side": { "dist": "68 km", "time": "65 dk" },
        "Beldibi": { "dist": "47 km", "time": "55 dk" },
        "Göynük": { "dist": "54 km", "time": "60 dk" },
        "Kemer": { "dist": "60 km", "time": "65 dk" },
        "Tekirova": { "dist": "75 km", "time": "70 dk" },
        "Kızılağaç": { "dist": "85 km", "time": "75 dk" },
        "Okurcalar": { "dist": "97 km", "time": "85 dk" },
        "İncekum": { "dist": "100 km", "time": "85 dk" },
        "Türkler": { "dist": "107 km", "time": "95 dk" },
        "Konaklı": { "dist": "113 km", "time": "100 dk" },
        "Alanya": { "dist": "118 km", "time": "105 dk" },
        "Mahmutlar": { "dist": "140 km", "time": "125 dk" },
        "Kargıcak": { "dist": "143 km", "time": "130 dk" },
        "Adrasan": { "dist": "110 km", "time": "105 dk" },
        "Lara": { "dist": "15 km", "time": "25 dk" },
        "Bodrum": { "dist": "420 km", "time": "5 sa" },
        "Dalaman": { "dist": "240 km", "time": "3.5 sa" },
        "Fethiye": { "dist": "200 km", "time": "3 sa" },
        "Göcek": { "dist": "220 km", "time": "3.2 sa" },
        "Marmaris": { "dist": "320 km", "time": "4.5 sa" },
        "Ölüdeniz": { "dist": "210 km", "time": "3.2 sa" },
        "Avsallar": { "dist": "102 km", "time": "90 dk" },
        "Boğazkent": { "dist": "43 km", "time": "45 dk" },
        "Çamyuva": { "dist": "67 km", "time": "65 dk" },
        "Çıralı": { "dist": "97 km", "time": "95 dk" },
        "Demre": { "dist": "156 km", "time": "140 dk" },
        "Denizyaka": { "dist": "44 km", "time": "45 dk" },
        "Finike": { "dist": "129 km", "time": "110 dk" },
        "Gündoğdu": { "dist": "56 km", "time": "55 dk" },
        "Kalkan": { "dist": "215 km", "time": "3.5 sa" },
        "Kaş": { "dist": "205 km", "time": "3.2 sa" },
        "Kestel": { "dist": "134 km", "time": "120 dk" },
        "Kızılot": { "dist": "82 km", "time": "75 dk" },
        "Kiriş": { "dist": "67 km", "time": "70 dk" },
        "Kumluca": { "dist": "95 km", "time": "85 dk" },
        "Manavgat": { "dist": "75 km", "time": "70 dk" },
        "Olimpos": { "dist": "99 km", "time": "95 dk" },
        "Sorgun": { "dist": "73 km", "time": "70 dk" },
        "Titreyengöl": { "dist": "73 km", "time": "70 dk" },
        "Kadriye": { "dist": "27 km", "time": "30 dk" }
    };

    return (
        <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
            {/* BANNER SECTION */}
            <section className="relative pt-28 pb-14 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/antalya-map-safe.png"
                        alt="Antalya Map"
                        fill
                        priority
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/60"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-4 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                        <span>HİZMET BÖLGELERİ</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-playfair font-medium text-white mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 drop-shadow-2xl">
                        Transfer Bölgelerimiz
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl font-light tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        Antalya Havalimanı'ndan tüm popüler tatil bölgelerine VIP transfer.
                    </p>

                    <div className="mt-8 max-w-lg mx-auto relative animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fa-solid fa-search text-white/60 text-lg" aria-hidden="true"></i>
                        </div>
                        <input
                            type="text"
                            placeholder="Gitmek istediğiniz bölgeyi arayın..."
                            aria-label="Bölge ara"
                            className="block w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all shadow-2xl"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Regions Grid */}
            <section className="py-12 md:py-16 relative z-20 overflow-hidden" style={{ background: '#f8f7f4' }}>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                        {currentItems.length > 0 ? (
                            currentItems.map((region) => {
                                const distInfo = DISTANCE_MAP[region.name] || { dist: '-- km', time: '-- dk' };
                                const shouldAnimate = searchTerm && currentItems.length < 5;

                                return (
                                    <div
                                        key={region.id}
                                        className={shouldAnimate ? "animate-border-rotate" : "h-full"}
                                    >
                                        <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300 transform hover:-translate-y-0.5">
                                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                                <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={region.image}
                                                    alt={region.name}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] will-change-transform"
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                                {region.price && (
                                                    <div className="absolute top-4 left-4 z-20">
                                                        <span className="inline-block px-3 py-1 bg-white text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                                                            {region.price}{siteContent.currency?.symbol || '€'} Başlayan
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 p-5 flex flex-col">
                                                <h3 className="text-lg font-playfair font-bold text-slate-800 mb-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug line-clamp-1">
                                                    {region.name}
                                                </h3>
                                                <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
                                                    {region.desc || `${region.name} bölgesine konforlu ve güvenli VIP transfer hizmeti.`}
                                                </p>

                                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                                                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium">
                                                        <i className="fa-solid fa-route text-[var(--color-primary)]" aria-hidden="true"></i>
                                                        <span>{distInfo.dist} / {distInfo.time}</span>
                                                    </div>
                                                    <a
                                                        href={`https://wa.me/${siteContent.business.whatsapp}?text=${buildWaMessage(region.name)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                                                    >
                                                        <span>Fiyat Al</span>
                                                        <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-16 text-center">
                                <div className="inline-block p-6 rounded-full bg-slate-50 mb-4">
                                    <i className="fas fa-search text-4xl text-slate-300"></i>
                                </div>
                                <h3 className="text-lg font-medium text-slate-900">Sonuç Bulunamadı</h3>
                                <p className="text-slate-500 mt-2">Aramanızla eşleşen transfer bölgesi bulunamadı.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(cms => Math.max(cms - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-11 h-11 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>

                            <div className="flex flex-wrap gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    const isActive = currentPage === page;
                                    const isNearCurrent = Math.abs(page - currentPage) <= 1;
                                    const isEdge = page === 1 || page === totalPages;
                                    if (!isActive && !isNearCurrent && !isEdge && totalPages > 5) return null;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-11 h-11 flex items-center justify-center rounded-lg border transition-colors ${isActive
                                                ? 'bg-[var(--color-dark)] border-[var(--color-dark)] text-white'
                                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setCurrentPage(cms => Math.min(cms + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="w-11 h-11 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-20 bg-[var(--color-dark)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="font-playfair font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>Özel Fiyat Teklifi Alın</h2>
                    <p className="text-white/40 mt-3 text-sm">Listede olmayan bir bölge için veya grup transferi için özel fiyat teklifi alın.</p>
                    <a
                        href={`https://wa.me/${siteContent.business.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 text-[#0f172a] font-bold px-8 py-3.5 rounded-2xl mt-8 transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                        style={{ background: '#c5a059' }}
                    >
                        <i className="fab fa-whatsapp text-xl"></i>
                        WhatsApp ile Fiyat Al
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Bolgeler;
