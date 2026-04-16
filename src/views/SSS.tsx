'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import { useSiteContent } from '../SiteContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

const SSS: React.FC = () => {
    useScrollReveal();
    const { siteContent } = useSiteContent();
    const faqs = siteContent.faq;
    const business = siteContent.business;
    const [openId, setOpenId] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* ── Banner Section ── */}
            <section className="relative pt-48 pb-24 flex items-center justify-center overflow-hidden bg-white">
                <div className="absolute inset-0 z-0">
                    <Image src="/images/sss-banner-custom.png" alt="FAQ Banner" fill sizes="100vw" priority className="object-cover opacity-10" />
                </div>
                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <div className="reveal">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#f8f7f4] text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.3em] border border-black/5 mb-8 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse"></span>
                            <span>BİLGİ MERKEZİ</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-playfair font-medium text-[#0a0a0a] mb-8 tracking-tighter leading-none">
                            Sıkça Sorulan <span className="italic text-[#c5a059]">Sorular</span>
                        </h1>
                        <p className="text-[#666] text-lg md:text-2xl font-light tracking-tight max-w-2xl mx-auto">
                            Transfer hizmetimiz hakkında merak ettiğiniz tüm detaylar.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── FAQ Accordion ── */}
            <section className="py-24 md:py-32 relative z-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="space-y-6 reveal-stagger">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="bg-white rounded-3xl border border-black/[0.03] overflow-hidden transition-all duration-500 hover:editorial-shadow">
                                <button 
                                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)} 
                                    className="w-full px-8 py-8 flex items-center justify-between text-left group"
                                >
                                    <span className="font-bold text-[#1a1a1a] pr-8 text-lg tracking-tight group-hover:text-[#c5a059] transition-colors">{faq.q}</span>
                                    <div className={`w-10 h-10 rounded-full bg-[#fafafa] flex items-center justify-center transition-all duration-500 ${openId === faq.id ? 'bg-[#c5a059] text-white rotate-180' : 'text-black/20'}`}>
                                        <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                    </div>
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-8 pb-8">
                                        <div className="pt-6 border-t border-black/5">
                                            <p className="text-[#666] text-lg font-light leading-relaxed">{faq.a}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Contact CTA ── */}
            <section className="py-24 md:py-32 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center reveal">
                    <div className="w-20 h-20 rounded-[2rem] bg-[#fafafa] border border-black/5 flex items-center justify-center mx-auto mb-10 text-[#c5a059] text-3xl">
                        <i className="fa-solid fa-headset"></i>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-playfair font-medium text-[#0a0a0a] mb-6 tracking-tight">Cevabınızı <span className="italic text-[#c5a059]">Bulamadınız mı?</span></h2>
                    <p className="text-[#666] text-lg font-light mb-12">WhatsApp üzerinden ekiplerimize bağlanın, sorunuzu anında yanıtlayalım.</p>
                    <a 
                        href={`https://wa.me/${business.whatsapp}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-4 bg-[#c5a059] text-white font-bold px-12 py-5 rounded-full hover:bg-[#b08d48] transition-all duration-500 uppercase tracking-widest text-xs shadow-xl shadow-[#c5a059]/10"
                    >
                        <i className="fa-brands fa-whatsapp text-xl"></i>
                        WhatsApp ile Soru Sor
                    </a>
                </div>
            </section>

            {/* ── Info Grid ── */}
            <section className="py-24 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-stagger">
                        <div className="p-10 rounded-[2.5rem] bg-white border border-black/[0.03] text-center">
                            <div className="w-12 h-12 rounded-2xl bg-[#fafafa] text-[#c5a059] flex items-center justify-center mx-auto mb-6"><i className="fa-solid fa-phone"></i></div>
                            <h3 className="text-sm font-bold text-black uppercase tracking-[0.2em] mb-2">Telefon</h3>
                            <p className="text-[#666] text-sm font-light">{business.phone}</p>
                        </div>
                        <div className="p-10 rounded-[2.5rem] bg-white border border-black/[0.03] text-center">
                            <div className="w-12 h-12 rounded-2xl bg-[#fafafa] text-[#c5a059] flex items-center justify-center mx-auto mb-6"><i className="fa-solid fa-envelope"></i></div>
                            <h3 className="text-sm font-bold text-black uppercase tracking-[0.2em] mb-2">E-posta</h3>
                            <p className="text-[#666] text-sm font-light">{business.email}</p>
                        </div>
                        <div className="p-10 rounded-[2.5rem] bg-white border border-black/[0.03] text-center">
                            <div className="w-12 h-12 rounded-2xl bg-[#fafafa] text-[#c5a059] flex items-center justify-center mx-auto mb-6"><i className="fa-solid fa-clock"></i></div>
                            <h3 className="text-sm font-bold text-black uppercase tracking-[0.2em] mb-2">Hizmet</h3>
                            <p className="text-[#666] text-sm font-light">7/24 Kesintisiz Destek</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SSS;
