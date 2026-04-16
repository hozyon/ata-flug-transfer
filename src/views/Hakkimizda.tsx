'use client';

import React from 'react';
import Image from 'next/image';

import { useSiteContent } from '../SiteContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Hakkimizda: React.FC = () => {
    const { siteContent } = useSiteContent();
    const about = siteContent.about;
    const business = siteContent.business;

    useScrollReveal();

    const features = [
        { icon: "fa-shield-halved", title: "Güven ve Kalite", desc: "Uçuş takibi, zamanında karşılama ve güvenli seyahat garantisi." },
        { icon: "fa-car", title: "Premium Filo", desc: "Mercedes-Benz Vito ve Sprinter araçlarla konforun tadını çıkarın." },
        { icon: "fa-headset", title: "7/24 Destek", desc: "İhtiyaç duyduğunuz her an WhatsApp üzerinden anında iletişim." },
    ];

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* ── Editorial Banner ── */}
            <section className="relative pt-48 pb-24 flex items-center justify-center overflow-hidden bg-white">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src={about.bannerImage || "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=2000"} 
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
                            <span>HİKAYEMİZ</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-playfair font-medium text-[#0a0a0a] mb-8 tracking-tighter leading-none">
                            Hakkımızda
                        </h1>
                        <p className="text-[#666] text-lg md:text-2xl font-light tracking-tight max-w-2xl mx-auto">
                            Antalya'nın en prestijli VIP transfer deneyimini keşfedin.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Content Section ── */}
            <section className="py-24 md:py-32 relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                        <div className="lg:col-span-6 reveal">
                            <h2 className="text-4xl md:text-6xl font-playfair font-medium text-[#0a0a0a] leading-[1.1] tracking-tight mb-10">
                                {about.title}
                            </h2>
                            <div className="text-[#444] text-lg font-light leading-relaxed space-y-8 whitespace-pre-line border-l border-[#c5a059]/30 pl-10">
                                {about.content}
                            </div>
                            <div className="mt-12">
                                <a 
                                    href={`https://wa.me/${business.whatsapp}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="group inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.25em] text-[#c5a059] transition-all hover:opacity-80 border-b border-[#c5a059]/20 pb-2 hover:border-[#c5a059]"
                                >
                                    <span>Hemen İletişime Geç</span>
                                    <i className="fa-solid fa-arrow-right text-[10px] transform group-hover:translate-x-2 transition-transform"></i>
                                </a>
                            </div>
                        </div>
                        
                        <div className="lg:col-span-6 relative reveal">
                            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden editorial-shadow-lg border border-black/5">
                                <Image 
                                    src={about.image || '/images/about-custom.jpg'} 
                                    fill 
                                    sizes="(max-width: 768px) 100vw, 50vw" 
                                    className="object-cover transition-transform duration-1000 hover:scale-105" 
                                    alt="About Us Feature" 
                                />
                            </div>
                            {/* Floating Accents */}
                            <div className="absolute -bottom-10 -left-10 w-2/3 bg-white p-10 rounded-[2rem] hidden md:block editorial-shadow-lg border border-black/5">
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-4">PRESTİJ</div>
                                <h3 className="text-3xl font-playfair font-medium text-[#0a0a0a] mb-2 leading-none">VIP Hizmet</h3>
                                <p className="text-[#666] text-xs font-light uppercase tracking-widest">Kusursuz Transfer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features Section ── */}
            <section className="py-24 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 reveal-stagger">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-8 bg-[#fafafa] text-[#c5a059] border border-black/[0.03] transition-all duration-500 group-hover:bg-[#c5a059] group-hover:text-white group-hover:editorial-shadow">
                                    <i className={`fa-solid ${feature.icon}`}></i>
                                </div>
                                <h3 className="text-xl font-bold text-[#0a0a0a] mb-4 tracking-tight group-hover:text-[#c5a059] transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-[#666] text-sm font-light leading-relaxed max-w-[280px]">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Hakkimizda;
