'use client';

import React, { useState } from 'react';
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

    return (
        <div className="min-h-screen bg-white">
            {/* BANNER SECTION */}
            <section className="pt-40 pb-20 border-b border-gray-100 reveal">
                <div className="max-w-[1400px] mx-auto px-6">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-6">Şeffaf Tarife</p>
                    <h1 className="text-6xl sm:text-[100px] font-playfair font-medium text-[#111] tracking-tighter leading-[0.9]">
                        Transfer <br />
                        <span className="italic font-light text-[#555]">Fiyatları.</span>
                    </h1>
                </div>
            </section>

            {/* Search + Grid */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-[1400px] mx-auto px-6">
                    
                    <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-10 mb-20 reveal">
                        <div className="w-full sm:w-[400px]">
                            <div className="w-full border-b border-gray-300 pb-2 flex items-center gap-3">
                                <i className="fa-solid fa-magnifying-glass text-[#888] text-sm"></i>
                                <input
                                    type="text"
                                    placeholder="Fiyatını öğrenmek istediğiniz rota..."
                                    aria-label="Bölge ara"
                                    className="w-full bg-transparent border-none outline-none text-[#111] text-lg font-playfair placeholder-gray-400"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center py-20 border-t border-gray-100">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888]">Sonuç Bulunamadı.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
                            {filtered.map(region => {
                                const slug = region.name.toLowerCase().replace(/ /g, '-').replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c').replace(/[^a-z0-9-]/g, '');
                                return (
                                    <Link
                                        key={region.id}
                                        href={`/transfer/${slug}-transfer`}
                                        className="group border-t border-gray-100 pt-8 hover:border-[#111] transition-colors flex justify-between items-center"
                                    >
                                        <div className="flex-1">
                                            <h2 className="font-playfair text-3xl sm:text-4xl text-[#111] mb-2 group-hover:italic transition-all">
                                                {region.name}
                                            </h2>
                                            <div className="flex gap-4 items-center">
                                                <span className="text-[10px] text-[#888] uppercase tracking-widest font-bold">Tek Yön</span>
                                                <span className="w-4 h-[1px] bg-gray-300" />
                                                <span className="text-[10px] text-[#888] uppercase tracking-widest font-bold">Sabit Fiyat</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-playfair text-[#111]">
                                                {siteContent.currency?.symbol || '€'}{region.price}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 font-outfit bg-[#111]">
                <div className="max-w-[1400px] mx-auto px-6 text-center reveal text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888] mb-6">Concierge Talebi</p>
                    <h2 className="text-5xl sm:text-7xl font-playfair font-medium tracking-tight mb-8">Farklı Bir İhtiyacınız mı Var?</h2>
                    <p className="text-gray-400 max-w-md mx-auto mb-16">Gruplara tahsis edilen araçlar, uzun süreli rezervasyon veya listede yer almayan lokasyonlar.</p>
                    <a
                        href={`https://wa.me/${business.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-12 py-5 bg-white text-[#111] font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors"
                    >
                        Temsilciye Bağlan
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Fiyatlar;
