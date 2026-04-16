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
        <div className="min-h-screen bg-slate-50">
            {/* SEO handled by generateMetadata() in page.tsx */}
            <section className="relative pt-28 pb-14 flex items-center justify-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <Image src="/images/sss-banner-custom.png" alt="FAQ Banner" fill sizes="100vw" priority className="object-cover" />
                    <div className="absolute inset-0 bg-slate-900/60"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-4 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                        <span>DESTEK</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-playfair font-medium text-white mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 drop-shadow-2xl">
                        Sıkça Sorulan Sorular
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl font-light tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        Transfer hizmetimiz hakkında merak ettiğiniz her şey.
                    </p>
                </div>
            </section>

            <section className="py-16 md:py-24 relative z-20 overflow-hidden" style={{ background: '#f8f7f4' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="space-y-3 stagger-children">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="reveal bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md hover:border-[var(--color-primary)]/20">
                                <button onClick={() => setOpenId(openId === faq.id ? null : faq.id)} className="w-full px-5 sm:px-6 py-4 sm:py-5 min-h-[56px] flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors">
                                    <span className="font-bold text-slate-800 pr-4 text-sm sm:text-base">{faq.q}</span>
                                    <i className={`fa-solid fa-chevron-down text-[var(--color-primary)] transition-transform duration-300 shrink-0 ${openId === faq.id ? 'rotate-180' : ''}`}></i>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${openId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-5 sm:px-6 pb-5 border-t border-slate-100">
                                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-4">{faq.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-20" style={{ background: '#f8f7f4' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-6" style={{ background: 'rgba(197,160,89,0.12)', border: '1px solid rgba(197,160,89,0.2)' }}>
                        <i className="fa-solid fa-question text-[var(--color-primary)] text-2xl" aria-hidden="true"></i>
                    </div>
                    <h2 className="text-2xl font-playfair font-bold text-slate-900">Başka Sorunuz mu Var?</h2>
                    <p className="text-slate-500 mt-2 text-sm">WhatsApp üzerinden anında cevap alabilirsiniz.</p>
                    <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-[#0f172a] font-bold px-8 py-3.5 rounded-2xl mt-6 transition-all duration-200 hover:brightness-110 active:scale-[0.98]" style={{ background: '#c5a059' }}>
                        <i className="fab fa-whatsapp text-xl"></i>
                        WhatsApp ile Soru Sor
                    </a>
                </div>
            </section>

            <section className="py-16 md:py-20 bg-[var(--color-dark)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
                        <div className="reveal text-center p-6 rounded-2xl transition-all duration-200 hover:bg-white/[0.03]" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-[#0f172a] text-xl mb-4" style={{ background: '#c5a059' }}><i className="fa-solid fa-phone" aria-hidden="true"></i></div>
                            <h3 className="text-white font-bold text-sm">Telefon</h3>
                            <p className="text-slate-400 mt-1 text-sm">{business.phone}</p>
                        </div>
                        <div className="reveal text-center p-6 rounded-2xl transition-all duration-200 hover:bg-white/[0.03]" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-[#0f172a] text-xl mb-4" style={{ background: '#c5a059' }}><i className="fa-solid fa-envelope" aria-hidden="true"></i></div>
                            <h3 className="text-white font-bold text-sm">E-posta</h3>
                            <p className="text-slate-400 mt-1 text-sm">{business.email}</p>
                        </div>
                        <div className="reveal text-center p-6 rounded-2xl transition-all duration-200 hover:bg-white/[0.03]" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="w-12 h-12 rounded-xl mx-auto flex items-center justify-center text-[#0f172a] text-xl mb-4" style={{ background: '#c5a059' }}><i className="fa-solid fa-clock" aria-hidden="true"></i></div>
                            <h3 className="text-white font-bold text-sm">Çalışma Saatleri</h3>
                            <p className="text-slate-400 mt-1 text-sm">7/24 Hizmet</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SSS;
