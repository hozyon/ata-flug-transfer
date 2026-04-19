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
        { icon: "fa-shield-halved", title: "Güven ve Prestij", desc: "Sıradanlıktan uzak, tamamen denetimli kusursuz seyahat." },
        { icon: "fa-car", title: "Artizan Filo", desc: "En ince ayrıntısına kadar tasarlanmış lüks Mercedes-Benz kabinleri." },
        { icon: "fa-headset", title: "Concierge Etkisi", desc: "Tüm taleplerinizi anında yöneten asistan hizmeti." },
    ];

    return (
        <div className="min-h-screen bg-white text-[#111]">
            {/* ── BANNER ── */}
            <section className="pt-40 pb-20 border-b border-gray-100 reveal">
                <div className="max-w-[1400px] mx-auto px-6">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-6">Kurumsal Kimlik</p>
                    <h1 className="text-6xl sm:text-[100px] font-playfair font-medium tracking-tighter leading-[0.9]">
                        Zamanın <br />
                        <span className="italic font-light text-[#555]">Ötesinde.</span>
                    </h1>
                </div>
            </section>

            {/* ── MAIN ── */}
            <section className="py-24 sm:py-32">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                        <div className="lg:col-span-5 reveal-left">
                            <h2 className="font-playfair text-4xl sm:text-5xl leading-tight mb-8">
                                {about.title}
                            </h2>
                            <div className="flex flex-col gap-6 text-[#555] font-outfit text-sm leading-relaxed border-l border-[#111] pl-8 opacity-90 text-justify">
                                {about.content?.split('\n').filter(Boolean).map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                            <div className="mt-12">
                                <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] border-b border-[#111] pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                                    Ayrıcalıkları Keşfedin
                                </a>
                            </div>
                        </div>
                        <div className="lg:col-span-7 reveal">
                            <div className="relative aspect-[4/5] sm:aspect-[4/3] bg-gray-100">
                                <Image src={about.image || '/images/about-custom.jpg'} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="About Us Feature" />
                                <div className="absolute -bottom-8 -left-8 bg-white p-8 border border-gray-100 hidden sm:block">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888] mb-2">Başlangıçtan Bugüne</p>
                                    <p className="font-playfair font-medium text-4xl text-[#111]">15+ Yıl</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="py-32 bg-[#fafafa] border-t border-gray-100">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-24 reveal">
                        <h2 className="text-5xl font-playfair font-medium tracking-tight">Kusursuz Seçim</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex flex-col gap-6 reveal-stagger border-t border-gray-200 pt-8 hover:border-[#111] transition-colors">
                                <div className="text-3xl text-[#111]"><i className={`fa-solid ${feature.icon}`}></i></div>
                                <div>
                                    <h3 className="font-playfair font-bold text-2xl text-[#111] mb-4">{feature.title}</h3>
                                    <p className="text-[#888] text-sm leading-relaxed font-outfit">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Hakkimizda;
