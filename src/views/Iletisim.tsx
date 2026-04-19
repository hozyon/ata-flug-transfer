'use client';

import React, { useState } from 'react';
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
        const msg = `[İletişim Formu]\n\nİsim: ${formData.name}\nE-posta: ${formData.email}\n\nMesaj: ${formData.message}`;
        window.open(`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
        setFormData({ name: '', email: '', message: '' });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* ── BANNER ── */}
            <section className="pt-40 pb-20 border-b border-gray-100 reveal">
                <div className="max-w-[1400px] mx-auto px-6">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] mb-6">Merkez Ofis & İletişim</p>
                    <h1 className="text-6xl sm:text-[100px] font-playfair font-medium text-[#111] tracking-tighter leading-[0.9]">
                        Bize <br />
                        <span className="italic font-light text-[#555]">Ulaşın.</span>
                    </h1>
                </div>
            </section>

            {/* ── CHANNEL STRIP (BRUTALIST) ── */}
            <section className="border-b border-gray-100">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                        <a href={`tel:${business.phone}`} className="flex-1 px-6 py-12 group hover:bg-[#fafafa] transition-colors">
                            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#888] mb-4 group-hover:text-[#111] transition-colors">Telefon Hattı</p>
                            <p className="text-2xl font-playfair text-[#111]">{business.phone}</p>
                        </a>
                        <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-12 group hover:bg-[#fafafa] transition-colors">
                            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#888] mb-4 group-hover:text-[#25D366] transition-colors">WhatsApp 7/24</p>
                            <p className="text-2xl font-playfair text-[#111]">Hızlı Bilgi Al</p>
                        </a>
                        <a href={`mailto:${business.email}`} className="flex-1 px-6 py-12 group hover:bg-[#fafafa] transition-colors">
                            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#888] mb-4 group-hover:text-[#111] transition-colors">Elektronik Posta</p>
                            <p className="text-2xl font-playfair text-[#111] truncate">{business.email}</p>
                        </a>
                    </div>
                </div>
            </section>

            {/* ── MAIN CONTENT ── */}
            <section className="flex-1 py-16 sm:py-24 bg-white">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                        
                        {/* LEFT: Info & Map */}
                        <div className="flex flex-col gap-16 reveal-left">
                            <div>
                                <h2 className="text-4xl sm:text-5xl font-playfair font-medium text-[#111] mb-6 tracking-tight">Protokol İletişimi</h2>
                                <p className="text-gray-500 font-outfit text-sm leading-relaxed max-w-sm">Taleplerinizi ve özel isteklerinizi bize doğrudan iletebilirsiniz. Operasyon ekibimiz en kısa sürede dönüş sağlayacaktır.</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-12 border-t border-gray-100 pt-16">
                                <div>
                                    <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#888] mb-4">Adres</h4>
                                    <p className="text-[#111] font-playfair text-lg max-w-[200px] leading-snug">{business.address}</p>
                                </div>
                                <div>
                                    <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#888] mb-4">Çalışma Disiplini</h4>
                                    <p className="text-[#111] font-playfair text-lg leading-snug">7 Gün / 24 Saat<br/>Kesintisiz Hizmet</p>
                                </div>
                            </div>
                            
                            <div className="w-full h-[400px] bg-gray-50 border border-gray-200 mt-8 grayscale hover:grayscale-0 transition-all duration-1000">
                                {business.mapEmbedUrl && (
                                    <iframe 
                                        src={business.mapEmbedUrl}
                                        title="Konum"
                                        width="100%"
                                        height="100%"
                                        className="border-none w-full h-full"
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Form */}
                        <div className="reveal">
                            <div className="bg-transparent border border-gray-200 p-8 sm:p-16">
                                <h3 className="text-3xl font-playfair font-medium text-[#111] tracking-tight mb-2">Mesaj Gönderin</h3>
                                <p className="text-gray-400 font-outfit text-sm mb-12">Detaylı bilgiler için formu eksiksiz doldurunuz.</p>
                                
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="border-b border-gray-200 focus-within:border-[#111] transition-colors pb-2">
                                        <label className="block text-[9px] font-bold tracking-[0.2em] uppercase text-[#888] mb-2">Adınız Soyadınız</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-transparent border-none outline-none text-[#111] font-playfair text-xl placeholder-gray-300"
                                            placeholder="Örn: Veli Yalçın"
                                        />
                                    </div>
                                    <div className="border-b border-gray-200 focus-within:border-[#111] transition-colors pb-2">
                                        <label className="block text-[9px] font-bold tracking-[0.2em] uppercase text-[#888] mb-2">E-Posta Adresiniz</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-transparent border-none outline-none text-[#111] font-playfair text-xl placeholder-gray-300"
                                            placeholder="Örn: mail@sirket.com"
                                        />
                                    </div>
                                    <div className="border-b border-gray-200 focus-within:border-[#111] transition-colors pb-2">
                                        <label className="block text-[9px] font-bold tracking-[0.2em] uppercase text-[#888] mb-2">Mesajınız</label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-transparent border-none outline-none text-[#111] font-playfair text-xl placeholder-gray-300 resize-none"
                                            placeholder="İhtiyaçlarınızı belirtin."
                                        />
                                    </div>
                                    <button type="submit" className="w-full h-16 bg-[#111] text-white font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-gray-800 transition-colors mt-8">
                                        Mesajı İlet
                                    </button>

                                    {submitted && (
                                        <div className="flex items-center gap-4 mt-8 p-6 bg-[#fafafa] border border-gray-100">
                                            <i className="fa-brands fa-whatsapp text-xl text-[#111]" />
                                            <span className="text-[#111] text-xs font-bold uppercase tracking-[0.1em]">Talebiniz aktarılıyor...</span>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Iletisim;
