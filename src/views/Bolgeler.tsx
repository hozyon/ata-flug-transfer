'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Fuse from 'fuse.js';
import { INITIAL_SITE_CONTENT } from '../constants';
import { useAppStore } from '../store/useAppStore';
import { useScrollReveal } from '../hooks/useScrollReveal';

const BolgelerContent: React.FC = () => {
    useScrollReveal();
    const { siteContent } = useAppStore();

    // Build WhatsApp message
    const buildWaMessage = (regionName: string) => {
        const trMsg = `Rezervasyon talebi:\nLütfen *${regionName}* transferi için bilgi veriniz.`;
        return encodeURIComponent(
            `[${siteContent.business.name} - TRANSFER]\n\nBölge: ${regionName}\n${trMsg}`
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
    const itemsPerPage = 8;

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

    return (
        <>
            {/* BANNER SECTION */}
            <section className="pt-40 pb-20 border-b border-gray-100 reveal">
                <div className="max-w-[1400px] mx-auto px-6">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-6">Operasyon Ağımız</p>
                    <h1 className="text-6xl sm:text-[100px] font-playfair font-medium text-[#111] tracking-tighter leading-[0.9]">
                        Transfer <br />
                        <span className="italic font-light text-[#555]">Bölgeleri.</span>
                    </h1>
                </div>
            </section>

            {/* Regions Grid */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-10 mb-20 reveal">
                        <div className="w-full sm:w-[400px]">
                            <div className="w-full border-b border-gray-300 pb-2 flex items-center gap-3">
                                <i className="fa-solid fa-magnifying-glass text-[#888] text-sm"></i>
                                <input
                                    type="text"
                                    placeholder="Hangi bölgeye gideceksiniz?"
                                    aria-label="Bölge ara"
                                    className="w-full bg-transparent border-none outline-none text-[#111] text-lg font-playfair placeholder-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {currentItems.length > 0 ? (
                            currentItems.map((region) => {
                                return (
                                    <div
                                        key={region.id}
                                        className="group h-full flex flex-col border border-gray-200 hover:border-[#111] transition-colors reveal-stagger bg-transparent"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 border-b border-gray-200">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={region.image}
                                                alt={region.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover grayscale transition-transform duration-[2000ms] group-hover:scale-105 group-hover:grayscale-0"
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                            />
                                            {region.price && (
                                                <div className="absolute top-0 right-0 z-20">
                                                    <span className="inline-block px-4 py-2 bg-black text-white text-[10px] font-bold tracking-[0.2em]">
                                                        {siteContent.currency?.symbol || '€'}{region.price}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 p-8 flex flex-col">
                                            <h3 className="text-2xl font-playfair font-bold text-[#111] mb-4 group-hover:italic transition-all">
                                                {region.name}
                                            </h3>
                                            <p className="text-[#888] text-sm font-outfit leading-relaxed line-clamp-3">
                                                {region.desc || `${region.name} noktasına ayrıcalıklı, sükunet dolu premium transfer deneyimi.`}
                                            </p>

                                            <div className="mt-8 pt-6 border-t border-gray-200">
                                                <a
                                                    href={`https://wa.me/${siteContent.business.whatsapp}?text=${buildWaMessage(region.name)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block text-[#111] text-[10px] font-bold uppercase tracking-[0.2em] border-b border-[#111] pb-1 hover:text-gray-500 transition-colors"
                                                >
                                                    Talep Oluştur
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-24 border-t border-gray-200 text-center">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888]">Sonuç Bulunamadı.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-24 reveal">
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className={`w-12 h-12 flex items-center justify-center border font-outfit transition-all ${currentPage === i + 1 ? 'border-[#111] bg-[#111] text-white' : 'border-gray-200 text-[#111] hover:border-[#111]'}`}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 font-outfit bg-[#111]">
                <div className="max-w-[1400px] mx-auto px-6 text-center reveal text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888] mb-6">Özel Rotalar</p>
                    <h2 className="text-5xl sm:text-7xl font-playfair font-medium tracking-tight mb-8">Listede Bulamadınız mı?</h2>
                    <p className="text-gray-400 max-w-md mx-auto mb-16">Size özel lokasyonlar veya saatlik tahsis talepleriniz için concierge ekibimizle iletişime geçin.</p>
                    <a
                        href={`https://wa.me/${siteContent.business.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-12 py-5 bg-white text-[#111] font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors"
                    >
                        VIP Destek
                    </a>
                </div>
            </section>
        </>
    );
};

export default function Bolgeler() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <BolgelerContent />
        </Suspense>
    );
}
