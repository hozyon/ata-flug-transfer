'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from '../store/useAppStore';
import { useSiteContent } from '../SiteContext';

const Fiyatlar: React.FC = () => {
    const { siteContent } = useAppStore();
    const { siteContent: sc } = useSiteContent();
    const business = siteContent.business || sc.business;
    const regions = siteContent.regions || sc.regions || [];
    const [search, setSearch] = useState('');

    const activeRegions = regions.filter(r => r.isActive !== false);
    const filtered = search.trim()
        ? activeRegions.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
        : activeRegions;

    const sym = siteContent.currency?.symbol || '€';

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* ── Editorial Banner ── */}
            <section className="relative pt-48 pb-24 flex items-center justify-center overflow-hidden bg-white">
                <div className="absolute inset-0">
                    <Image
                        src="/images/contact-banner.png"
                        alt="Transfer Fiyatları"
                        fill
                        priority
                        className="object-cover opacity-10"
                    />
                </div>
                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                    <div className="reveal">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#f8f7f4] text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.3em] border border-black/5 mb-8 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
                            <span>ŞEFFAF FİYAT LİSTESİ</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-playfair font-medium text-[#0a0a0a] mb-8 tracking-tighter leading-none">
                            Transfer <span className="italic text-[#c5a059]">Ücretleri</span>
                        </h1>
                        <p className="text-[#666] text-lg md:text-xl font-light tracking-tight max-w-2xl mx-auto">
                            Antalya Havalimanı'ndan tüm bölgelere sabit ve her şey dahil fiyatlar.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Search & Filter ── */}
            <section className="py-12 bg-white border-y border-black/[0.03]">
                <div className="max-w-xl mx-auto px-6">
                    <div className="relative group">
                        <i className="fa-solid fa-magnifying-glass absolute left-6 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-[#c5a059] transition-colors"></i>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Bölge ara..."
                            className="w-full pl-14 pr-6 py-5 bg-[#fafafa] border border-black/5 rounded-full text-sm text-[#1a1a1a] placeholder-black/20 focus:outline-none focus:border-[#c5a059]/40 focus:ring-4 focus:ring-[#c5a059]/5 transition-all"
                        />
                    </div>
                </div>
            </section>

            {/* ── Price Table/Grid ── */}
            <section className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    {filtered.length === 0 ? (
                        <div className="text-center py-32 reveal">
                            <div className="w-20 h-20 rounded-full bg-[#f8f7f4] flex items-center justify-center mx-auto mb-8">
                                <i className="fa-solid fa-map-location-dot text-2xl text-black/10"></i>
                            </div>
                            <p className="text-black/40 font-light italic">Aradığınız bölge bulunamadı.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 reveal-stagger">
                            {filtered.map(region => (
                                <Link
                                    key={region.id}
                                    href={`/transfer/${region.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-transfer`}
                                    className="group bg-white p-8 rounded-[2.5rem] border border-black/[0.03] transition-all duration-700 hover:editorial-shadow-lg hover:-translate-y-1 flex flex-col items-center text-center h-full"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-[#fafafa] flex items-center justify-center mb-6 text-[#c5a059] transition-colors group-hover:bg-[#c5a059] group-hover:text-white">
                                        <i className="fa-solid fa-location-arrow text-sm"></i>
                                    </div>
                                    <h2 className="text-xl font-bold text-[#0a0a0a] mb-2 group-hover:text-[#c5a059] transition-colors tracking-tight">
                                        {region.name}
                                    </h2>
                                    <p className="text-[10px] text-black/30 uppercase tracking-[0.2em] font-bold mb-8">Tek Yön Transfer</p>
                                    
                                    <div className="mt-auto w-full pt-8 border-t border-black/5">
                                        <span className="text-[10px] text-black/30 uppercase tracking-widest font-black block mb-2">Başlangıç</span>
                                        <div className="text-3xl font-playfair font-bold text-[#1a1a1a]">
                                            {sym}{region.price}
                                        </div>
                                        <div className="mt-6 flex items-center justify-center gap-4 text-[#c5a059] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                            <span className="text-[10px] font-black uppercase tracking-widest">Detaylar</span>
                                            <i className="fa-solid fa-arrow-right text-[10px]"></i>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Editorial Info Section ── */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center reveal">
                        <div className="text-center md:text-left">
                            <h3 className="text-3xl font-playfair font-medium text-[#0a0a0a] mb-6">Her Şey Dahil Fiyatlar</h3>
                            <p className="text-[#666] font-light leading-relaxed">
                                Fiyatlarımıza KDV, havalimanı otopark ücretleri ve karşılama hizmeti dahildir. Gece tarifesi veya bagaj farkı uygulanmaz.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-end gap-3">
                            {['Araç Başı', 'Sabit Ücret', '24/7 Destek', 'Ücretsiz İptal'].map(tag => (
                                <span key={tag} className="px-5 py-2 rounded-full bg-[#fafafa] border border-black/5 text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a] shadow-sm">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="py-32 bg-[#0a0a0a]">
                <div className="max-w-4xl mx-auto px-6 text-center reveal">
                    <h2 className="text-4xl md:text-6xl font-playfair font-medium text-white mb-8 tracking-tight">
                        Özel Teklif <span className="italic text-[#c5a059]">İster misiniz?</span>
                    </h2>
                    <p className="text-white/40 text-lg font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                        Grup transferleri, özel turlar veya uzun mesafe yolculuklarınız için size özel en iyi fiyatı sunalım.
                    </p>
                    <a
                        href={`https://wa.me/${business.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 bg-[#c5a059] text-white font-bold px-12 py-5 rounded-full hover:bg-[#b08d48] transition-all duration-500 uppercase tracking-widest text-xs shadow-xl shadow-[#c5a059]/10"
                    >
                        <i className="fa-brands fa-whatsapp text-xl"></i>
                        WhatsApp'tan Teklif Al
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Fiyatlar;
