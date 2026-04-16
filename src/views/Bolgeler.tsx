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
    const searchParams = useSearchParams();

    React.useEffect(() => {
        const q = searchParams.get('q');
        if (q) setSearchTerm(q);
    }, [searchParams]);

    React.useEffect(() => {
        setRegions(pricedRegions);
    }, [pricedRegions]);

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 12;

    const fuse = React.useMemo(() => {
        return new Fuse(regions, {
            keys: ['name'],
            threshold: 0.2,
            distance: 100,
            includeScore: true
        });
    }, [regions]);

    const filteredRegions = React.useMemo(() => {
        if (!searchTerm.trim()) return regions;
        const results = fuse.search(searchTerm);
        return results.map(result => result.item);
    }, [searchTerm, regions, fuse]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRegions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRegions.length / itemsPerPage);

    const sym = siteContent.currency?.symbol || '€';

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* ── Banner Section ── */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-white">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/antalya-map-safe.png"
                        alt="Antalya Map"
                        fill
                        priority
                        className="object-cover opacity-10"
                    />
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <div className="reveal">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#f8f7f4] text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.3em] border border-black/5 mb-8 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse"></span>
                            <span>KEŞFEDİLECEK ROTALAR</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-playfair font-medium text-[#0a0a0a] mb-8 tracking-tighter leading-none">
                            Transfer <span className="italic text-[#c5a059]">Bölgelerimiz</span>
                        </h1>
                        <p className="text-[#666] text-lg md:text-xl font-light tracking-tight max-w-2xl mx-auto mb-12">
                            Antalya Havalimanı'ndan dilediğiniz her noktaya lüks ve konforlu ulaşım seçenekleri.
                        </p>

                        <div className="max-w-xl mx-auto relative group">
                            <i className="fa-solid fa-search absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#c5a059] transition-colors"></i>
                            <input
                                type="text"
                                placeholder="Gitmek istediğiniz bölgeyi yazın..."
                                className="w-full pl-14 pr-6 py-5 bg-white border border-black/5 rounded-full text-sm text-[#1a1a1a] placeholder-black/20 focus:outline-none focus:border-[#c5a059]/40 focus:ring-4 focus:ring-[#c5a059]/5 transition-all editorial-shadow"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Regions Grid ── */}
            <section className="py-24 relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 reveal-stagger">
                        {currentItems.length > 0 ? (
                            currentItems.map((region) => (
                                <div key={region.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-black/[0.03] transition-all duration-700 hover:editorial-shadow-lg hover:-translate-y-1 flex flex-col h-full">
                                    <div className="relative aspect-[4/5] overflow-hidden">
                                        <Image
                                            src={region.image || '/bg1.webp'}
                                            alt={region.name}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                        {region.price && (
                                            <div className="absolute top-6 left-6">
                                                <span className="inline-block px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#0a0a0a] text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                                                    {sym}{region.price} Başlayan
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-playfair font-bold text-[#0a0a0a] mb-3 group-hover:text-[#c5a059] transition-colors leading-tight">
                                            {region.name}
                                        </h3>
                                        <p className="text-[#666] text-sm font-light leading-relaxed mb-8 line-clamp-2">
                                            {region.desc || `${region.name} bölgesine konforlu ve güvenli VIP transfer hizmeti.`}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-black/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-black/30 text-[10px] font-bold uppercase tracking-widest">
                                                <i className="fa-solid fa-car-side text-[#c5a059]"></i>
                                                <span>VIP Transfer</span>
                                            </div>
                                            <a
                                                href={`https://wa.me/${siteContent.business.whatsapp}?text=${buildWaMessage(region.name)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#c5a059]/20 hover:border-[#c5a059] pb-1 transition-all"
                                            >
                                                Fiyat Al
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center reveal">
                                <div className="w-20 h-20 rounded-full bg-[#f8f7f4] flex items-center justify-center mx-auto mb-8">
                                    <i className="fa-solid fa-magnifying-glass text-2xl text-black/10"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-[#0a0a0a] mb-2">Sonuç Bulunamadı</h3>
                                <p className="text-black/40 font-light">Aramanızla eşleşen bir bölge bulamadık.</p>
                            </div>
                        )}
                    </div>

                    {/* ── Pagination ── */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-20 reveal">
                            <button
                                onClick={() => setCurrentPage(cms => Math.max(cms - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-14 h-14 flex items-center justify-center rounded-full border border-black/5 bg-white text-black hover:bg-[#0a0a0a] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black transition-all shadow-sm"
                            >
                                <i className="fa-solid fa-chevron-left text-xs"></i>
                            </button>

                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    const isActive = currentPage === page;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-14 h-14 flex items-center justify-center rounded-full text-xs font-bold transition-all ${isActive
                                                ? 'bg-[#c5a059] text-white shadow-lg shadow-[#c5a059]/20'
                                                : 'bg-white border border-black/5 text-black hover:bg-black/5'
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
                                className="w-14 h-14 flex items-center justify-center rounded-full border border-black/5 bg-white text-black hover:bg-[#0a0a0a] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black transition-all shadow-sm"
                            >
                                <i className="fa-solid fa-chevron-right text-xs"></i>
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="py-32 bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto px-6 text-center reveal">
                    <h2 className="text-4xl md:text-6xl font-playfair font-medium text-white mb-8 tracking-tight">
                        Size Özel <span className="italic text-[#c5a059]">Fiyat Teklifi</span> Alın
                    </h2>
                    <p className="text-white/40 text-lg font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                        Listede olmayan bir destinasyon veya özel grup talepleriniz için bize ulaşın. Sizin için en uygun teklifi dakikalar içinde hazırlayalım.
                    </p>
                    <a
                        href={`https://wa.me/${siteContent.business.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 bg-[#c5a059] text-white font-bold px-12 py-5 rounded-full hover:bg-[#b08d48] transition-all duration-500 uppercase tracking-widest text-xs shadow-xl shadow-[#c5a059]/10"
                    >
                        <i className="fa-brands fa-whatsapp text-xl"></i>
                        WhatsApp Destek Hattı
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Bolgeler;
