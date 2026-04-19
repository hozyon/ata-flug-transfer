'use client';

import React, { useState } from 'react';
import { useSiteContent } from '../SiteContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

const SSS: React.FC = () => {
    useScrollReveal();
    const { siteContent } = useSiteContent();
    const faqs = siteContent.faq;
    const business = siteContent.business;
    const [openId, setOpenId] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-white text-[#111]">
            {/* ── BANNER ── */}
            <section className="pt-40 pb-20 border-b border-gray-100 reveal">
                <div className="max-w-[1400px] mx-auto px-6">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-6">Operasyon Destek</p>
                    <h1 className="text-6xl sm:text-[100px] font-playfair font-medium tracking-tighter leading-[0.9]">
                        Sık Sorulan <br />
                        <span className="italic font-light text-[#555]">Sorular.</span>
                    </h1>
                </div>
            </section>

            {/* ── FAQ ACCORDION ── */}
            <section className="py-24 sm:py-32">
                <div className="max-w-[1000px] mx-auto px-6">
                    <div className="border-t border-[#111] reveal">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="border-b border-gray-200">
                                <button 
                                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)} 
                                    className="w-full py-8 flex items-center justify-between text-left group"
                                >
                                    <span className="font-playfair text-xl sm:text-2xl text-[#111] group-hover:italic transition-all pr-8">{faq.q}</span>
                                    <span className="text-xl font-light text-[#888] transition-transform duration-500 flex-shrink-0">
                                        {openId === faq.id ? '–' : '+'}
                                    </span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openId === faq.id ? 'max-h-[800px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-[#555] font-outfit text-sm leading-relaxed md:w-4/5 text-justify">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SUPPORT CONTACT ── */}
            <section className="py-32 bg-[#fafafa]">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-24 reveal">
                        <h2 className="text-4xl sm:text-5xl font-playfair font-medium text-[#111]">Başka Bir Sorunuz mu Var?</h2>
                        <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-block mt-8 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-[#111] pb-1 hover:text-gray-500 transition-colors">
                            WhatsApp Üzerinden Ulaşın
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-200 pt-16">
                        <div className="flex flex-col gap-4 reveal-stagger">
                            <span className="text-[#888] text-xs font-bold uppercase tracking-widest">Telefon Hattı</span>
                            <span className="font-playfair text-2xl text-[#111]">{business.phone}</span>
                        </div>
                        <div className="flex flex-col gap-4 reveal-stagger">
                            <span className="text-[#888] text-xs font-bold uppercase tracking-widest">Elektronik Posta</span>
                            <span className="font-playfair text-2xl text-[#111]">{business.email}</span>
                        </div>
                        <div className="flex flex-col gap-4 reveal-stagger">
                            <span className="text-[#888] text-xs font-bold uppercase tracking-widest">Çalışma Disiplini</span>
                            <span className="font-playfair text-2xl text-[#111]">7 Gün / 24 Saat</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SSS;
