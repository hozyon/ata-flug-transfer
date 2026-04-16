'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSiteContent } from '../SiteContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Iletisim: React.FC = () => {
    useScrollReveal();
    const { siteContent } = useSiteContent();
    const business = siteContent.business;

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const msg = `Merhaba, web sitesinden yazıyorum.%0A%0AAd Soyad: ${formData.name}%0AE-posta: ${formData.email}%0A%0A${formData.message}`;
        window.open(`https://wa.me/${business.whatsapp}?text=${msg}`, '_blank');
        setFormData({ name: '', email: '', message: '' });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* ── Editorial Banner ── */}
            <section className="relative pt-48 pb-24 flex items-center justify-center overflow-hidden bg-white">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/about-custom.jpg"
                        alt="İletişim Banner"
                        fill
                        priority
                        className="object-cover opacity-10"
                    />
                </div>
                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <div className="reveal">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#f8f7f4] text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.3em] border border-black/5 mb-8 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse" />
                            <span>İLETİŞİM</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-playfair font-medium text-[#0a0a0a] mb-8 tracking-tighter leading-none">
                            Bize <span className="italic text-[#c5a059]">Ulaşın</span>
                        </h1>
                        <p className="text-[#666] text-lg md:text-2xl font-light tracking-tight max-w-2xl mx-auto">
                            Sorularınız için 7/24 buradayız. Hemen iletişime geçin.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Channel Strip ── */}
            <section className="bg-white border-y border-black/[0.03]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/[0.05]">
                        {/* Phone */}
                        <a href={`tel:${business.phone}`} className="py-12 flex flex-col items-center text-center group transition-all">
                            <div className="w-12 h-12 rounded-full bg-[#fafafa] flex items-center justify-center mb-6 text-[#c5a059] border border-black/[0.02] group-hover:bg-[#c5a059] group-hover:text-white transition-all duration-500">
                                <i className="fa-solid fa-phone text-sm" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-2">Telefon</p>
                            <p className="text-xl font-bold text-[#0a0a0a]">{business.phone}</p>
                        </a>

                        {/* WhatsApp */}
                        <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="py-12 flex flex-col items-center text-center group transition-all">
                            <div className="w-12 h-12 rounded-full bg-[#fafafa] flex items-center justify-center mb-6 text-[#25D366] border border-black/[0.02] group-hover:bg-[#25D366] group-hover:text-white transition-all duration-500">
                                <i className="fa-brands fa-whatsapp text-xl" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-2">WhatsApp</p>
                            <p className="text-xl font-bold text-[#0a0a0a]">Anında Destek</p>
                        </a>

                        {/* Email */}
                        <a href={`mailto:${business.email}`} className="py-12 flex flex-col items-center text-center group transition-all">
                            <div className="w-12 h-12 rounded-full bg-[#fafafa] flex items-center justify-center mb-6 text-[#c5a059] border border-black/[0.02] group-hover:bg-[#c5a059] group-hover:text-white transition-all duration-500">
                                <i className="fa-solid fa-envelope text-sm" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-2">E-posta</p>
                            <p className="text-xl font-bold text-[#0a0a0a] truncate max-w-full px-4">{business.email}</p>
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Form Section ── */}
            <section className="py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                        {/* Info Column */}
                        <div className="lg:col-span-5 reveal">
                            <h2 className="text-4xl md:text-6xl font-playfair font-medium text-[#0a0a0a] leading-[1.1] tracking-tight mb-8">
                                Sizi <span className="italic text-[#c5a059]">Dinliyoruz</span>
                            </h2>
                            <p className="text-[#666] text-lg font-light leading-relaxed mb-12">
                                Transfer planlarınız, özel grup talepleriniz veya hizmetlerimiz hakkındaki görüşleriniz için formu doldurabilirsiniz.
                            </p>
                            
                            <div className="space-y-8">
                                <div className="flex items-start gap-6">
                                    <div className="w-10 h-10 rounded-2xl bg-white border border-black/[0.03] flex items-center justify-center shrink-0 text-[#c5a059] shadow-sm">
                                        <i className="fa-solid fa-location-dot text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-2">Adres</p>
                                        <p className="text-[#1a1a1a] font-medium leading-relaxed">{business.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6">
                                    <div className="w-10 h-10 rounded-2xl bg-white border border-black/[0.03] flex items-center justify-center shrink-0 text-[#c5a059] shadow-sm">
                                        <i className="fa-solid fa-clock text-sm"></i>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30 mb-2">Çalışma Saatleri</p>
                                        <p className="text-[#1a1a1a] font-medium">7/24 Kesintisiz Hizmet</p>
                                    </div>
                                </div>
                            </div>

                            {/* Socials */}
                            <div className="mt-16 flex gap-4">
                                {[
                                    { icon: 'fa-instagram', url: business.instagram },
                                    { icon: 'fa-facebook-f', url: business.facebook },
                                    { icon: 'fa-telegram', url: business.telegram }
                                ].filter(s => s.url).map((s, i) => (
                                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-black/30 hover:text-[#c5a059] hover:border-[#c5a059] transition-all">
                                        <i className={`fa-brands ${s.icon} text-sm`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-7 reveal">
                            <form onSubmit={handleSubmit} className="bg-white p-10 md:p-14 rounded-[3rem] border border-black/[0.02] editorial-shadow-lg">
                                <div className="space-y-10">
                                    <div className="relative">
                                        <input 
                                            id="name" 
                                            type="text" 
                                            required 
                                            value={formData.name} 
                                            onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                            className="peer w-full bg-transparent border-b border-black/10 py-3 focus:outline-none focus:border-[#c5a059] transition-all text-[#1a1a1a] placeholder-transparent"
                                            placeholder="Ad Soyad"
                                        />
                                        <label htmlFor="name" className="absolute left-0 -top-4 text-[10px] font-black uppercase tracking-[0.2em] text-black/30 peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-black/20 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#c5a059] transition-all cursor-text">Ad Soyad</label>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            id="email" 
                                            type="email" 
                                            required 
                                            value={formData.email} 
                                            onChange={e => setFormData({ ...formData, email: e.target.value })} 
                                            className="peer w-full bg-transparent border-b border-black/10 py-3 focus:outline-none focus:border-[#c5a059] transition-all text-[#1a1a1a] placeholder-transparent"
                                            placeholder="E-posta"
                                        />
                                        <label htmlFor="email" className="absolute left-0 -top-4 text-[10px] font-black uppercase tracking-[0.2em] text-black/30 peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-black/20 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#c5a059] transition-all cursor-text">E-posta</label>
                                    </div>
                                    <div className="relative">
                                        <textarea 
                                            id="message" 
                                            required 
                                            rows={4} 
                                            value={formData.message} 
                                            onChange={e => setFormData({ ...formData, message: e.target.value })} 
                                            className="peer w-full bg-transparent border-b border-black/10 py-3 focus:outline-none focus:border-[#c5a059] transition-all text-[#1a1a1a] placeholder-transparent resize-none"
                                            placeholder="Mesajınız"
                                        />
                                        <label htmlFor="message" className="absolute left-0 -top-4 text-[10px] font-black uppercase tracking-[0.2em] text-black/30 peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-black/20 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[#c5a059] transition-all cursor-text">Mesajınız</label>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="w-full bg-[#0a0a0a] text-white font-bold py-6 rounded-full hover:bg-[#c5a059] transition-all duration-500 uppercase tracking-[0.2em] text-xs shadow-xl active:scale-95 flex items-center justify-center gap-4"
                                    >
                                        <i className="fa-brands fa-whatsapp text-lg"></i>
                                        Gönder & WhatsApp'tan Yaz
                                    </button>

                                    {submitted && (
                                        <p className="text-center text-emerald-500 text-xs font-bold animate-pulse">Mesajınız iletiliyor...</p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Map Section ── */}
            <section className="relative h-[400px] grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                {business.mapEmbedUrl && (
                    <iframe
                        src={business.mapEmbedUrl}
                        title="Konum"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                )}
            </section>
        </div>
    );
};

export default Iletisim;
