'use client';

import React from 'react';
import Image from 'next/image';

import { useSiteContent } from '../SiteContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

const VizyonMisyon: React.FC = () => {
    const { siteContent } = useSiteContent();
    const vm = siteContent.visionMission;
    
    useScrollReveal();

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* ── Editorial Banner ── */}
            <section className="relative pt-48 pb-24 flex items-center justify-center overflow-hidden bg-white">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src={vm?.hero?.bannerImage || "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=2000"} 
                        alt="Antalya Luxury" 
                        fill 
                        sizes="100vw" 
                        priority 
                        className="object-cover opacity-15" 
                    />
                </div>
                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <div className="reveal">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#f8f7f4] text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.3em] border border-black/5 mb-8 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse"></span>
                            <span>GELECEĞE BAKIŞ</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-playfair font-medium text-[#0a0a0a] mb-8 tracking-tighter leading-none">
                            {vm?.hero?.title || 'Vizyon & Misyon'}
                        </h1>
                        <p className="text-[#666] text-lg md:text-2xl font-light tracking-tight max-w-2xl mx-auto">
                            {vm?.hero?.desc || 'Geleceğe bakışımız ve temel değerlerimiz.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Main Cards ── */}
            <section className="py-24 md:py-32 relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 reveal-stagger">
                        {/* Vision Card */}
                        <div className="group bg-white rounded-[3rem] p-12 md:p-16 border border-black/[0.03] transition-all duration-700 hover:editorial-shadow-lg hover:-translate-y-1">
                            <div className="w-16 h-16 rounded-2xl bg-[#fafafa] flex items-center justify-center mb-10 text-[#c5a059] transition-colors group-hover:bg-[#c5a059] group-hover:text-white border border-black/[0.02]">
                                <i className="fa-solid fa-eye text-2xl"></i>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-playfair font-medium text-[#0a0a0a] mb-6 leading-tight group-hover:text-[#c5a059] transition-colors">
                                {vm?.vision?.title}
                            </h2>
                            <p className="text-[#666] text-lg font-light leading-relaxed mb-10">{vm?.vision?.desc}</p>
                            <div className="space-y-4">
                                {vm?.vision?.items?.map((item, idx) => (
                                    item && (
                                        <div key={idx} className="flex items-center gap-4 py-4 border-t border-black/5">
                                            <div className="w-2 h-2 rounded-full bg-[#c5a059]"></div>
                                            <span className="text-sm font-medium text-[#1a1a1a] tracking-tight">{item}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>

                        {/* Mission Card */}
                        <div className="group bg-white rounded-[3rem] p-12 md:p-16 border border-black/[0.03] transition-all duration-700 hover:editorial-shadow-lg hover:-translate-y-1">
                            <div className="w-16 h-16 rounded-2xl bg-[#fafafa] flex items-center justify-center mb-10 text-[#c5a059] transition-colors group-hover:bg-[#c5a059] group-hover:text-white border border-black/[0.02]">
                                <i className="fa-solid fa-bullseye text-2xl"></i>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-playfair font-medium text-[#0a0a0a] mb-6 leading-tight group-hover:text-[#c5a059] transition-colors">
                                {vm?.mission?.title}
                            </h2>
                            <p className="text-[#666] text-lg font-light leading-relaxed mb-10">{vm?.mission?.desc}</p>
                            <div className="space-y-4">
                                {vm?.mission?.items?.map((item, idx) => (
                                    item && (
                                        <div key={idx} className="flex items-center gap-4 py-4 border-t border-black/5">
                                            <div className="w-2 h-2 rounded-full bg-[#c5a059]"></div>
                                            <span className="text-sm font-medium text-[#1a1a1a] tracking-tight">{item}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Values Grid ── */}
            <section className="py-24 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 reveal">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <span className="w-12 h-px bg-[#c5a059]/30"></span>
                            <span className="text-[11px] font-black tracking-[0.4em] uppercase text-[#c5a059]">HİZMET İLKELERİMİZ</span>
                            <span className="w-12 h-px bg-[#c5a059]/30"></span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-playfair font-medium text-[#0a0a0a] tracking-tight">
                            Bizi <span className="italic text-[#c5a059]">Biz Yapan</span> Değerler
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 reveal-stagger">
                        {vm?.values?.items?.map((valueItem, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 rounded-full bg-[#fafafa] flex items-center justify-center mb-8 text-[#c5a059] border border-black/[0.03] transition-all duration-500 group-hover:bg-[#c5a059] group-hover:text-white">
                                    <i className={`fa-solid ${valueItem.icon} text-xl`}></i>
                                </div>
                                <h3 className="text-xl font-bold text-[#0a0a0a] mb-4 tracking-tight group-hover:text-[#c5a059] transition-colors">{valueItem.title}</h3>
                                <p className="text-[#666] text-sm font-light leading-relaxed">{valueItem.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VizyonMisyon;
