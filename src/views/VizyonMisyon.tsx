'use client';

import React from 'react';
import { useSiteContent } from '../SiteContext';

const VizyonMisyon: React.FC = () => {
    const { siteContent } = useSiteContent();
    const vm = siteContent.visionMission;

    return (
        <div className="min-h-screen bg-white text-[#111]">
            {/* ── BANNER ── */}
            <section className="pt-40 pb-20 border-b border-gray-100 reveal">
                <div className="max-w-[1400px] mx-auto px-6">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-6">Geleceğe Bakış</p>
                    <h1 className="text-6xl sm:text-[100px] font-playfair font-medium tracking-tighter leading-[0.9]">
                        Vizyon & <br />
                        <span className="italic font-light text-[#555]">Misyon.</span>
                    </h1>
                </div>
            </section>

            {/* ── CORE ── */}
            <section className="py-12 sm:py-16 border-b border-gray-100">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
                        {/* VİZYON */}
                        <div className="reveal-left">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] border-[#111] border-b inline-block pb-1 mb-8">Vizyonumuz</h2>
                            <h3 className="text-4xl font-playfair text-[#111] mb-8 leading-tight">{vm?.vision?.title || 'Zirveyi Tanımlamak'}</h3>
                            <p className="text-[#555] font-outfit text-sm leading-relaxed mb-8">{vm?.vision?.desc || '-'}</p>
                            
                            <div className="space-y-4 border-t border-gray-100 pt-8">
                                {vm?.vision?.items?.filter(Boolean).map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <span className="text-[#888] text-[8px] mt-1.5"><i className="fa-solid fa-diamond" /></span>
                                        <span className="text-[#111] text-sm font-outfit">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* MİSYON */}
                        <div className="reveal">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] border-[#111] border-b inline-block pb-1 mb-8">Misyonumuz</h2>
                            <h3 className="text-4xl font-playfair text-[#111] mb-8 leading-tight">{vm?.mission?.title || 'Kusursuzluk Standartı'}</h3>
                            <p className="text-[#555] font-outfit text-sm leading-relaxed mb-8">{vm?.mission?.desc || '-'}</p>
                            
                            <div className="space-y-4 border-t border-gray-100 pt-8">
                                {vm?.mission?.items?.filter(Boolean).map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <span className="text-[#888] text-[8px] mt-1.5"><i className="fa-solid fa-diamond" /></span>
                                        <span className="text-[#111] text-sm font-outfit">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── VALUES ── */}
            <section className="py-12 sm:py-16 bg-[#fafafa]">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="mb-20 reveal">
                        <h2 className="text-5xl font-playfair font-medium text-[#111] tracking-tight">{vm?.values?.title || 'Hizmet İlkelerimiz.'}</h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888] mt-4">{vm?.values?.desc || 'Her adımda mükemmellik.'}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
                        {vm?.values?.items?.map((valueItem, idx) => (
                            <div key={idx} className="reveal-stagger group border-t border-gray-200 pt-8 hover:border-[#111] transition-colors">
                                <div className="text-2xl text-[#111] mb-6 group-hover:italic transition-all">
                                    <i className={`fa-solid ${valueItem.icon}`}></i>
                                </div>
                                <h3 className="font-playfair font-bold text-xl text-[#111] mb-3">{valueItem.title}</h3>
                                <p className="text-[#888] font-outfit text-xs leading-relaxed">{valueItem.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default VizyonMisyon;
