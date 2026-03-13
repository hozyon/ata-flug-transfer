import React, { useState } from 'react';
import TextureBackground from '../components/TextureBackground';
import { useSiteContent } from '../SiteContext';
import { useLanguage } from '../i18n/LanguageContext';

const Iletisim: React.FC = () => {
    const { siteContent } = useSiteContent();
    const { t } = useLanguage();
    const business = siteContent.business;

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const message = `${t('contact.waMsg')}%0A%0A${t('form.name')}: ${formData.name}%0A${t('faq.email')}: ${formData.email}%0A%0A${formData.message}`;
        window.open(`https://wa.me/${business.whatsapp}?text=${message}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pb-24 lg:pb-0">
            <section className="relative pt-24 md:pt-28 pb-12 md:pb-16 flex items-center justify-center overflow-hidden shrink-0">
                <div className="absolute inset-0 z-0">
                    <img src="/images/about-custom.jpg" alt="Contact Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/70"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-4 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse"></span>
                        <span>{t('contact.eyebrow')}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-playfair font-medium text-white mb-4 md:mb-6 tracking-tight leading-tight drop-shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        {t('contact.title')}
                    </h1>
                    <p className="text-slate-300 text-base md:text-lg lg:text-xl font-light tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        {t('contact.subtitle')}
                    </p>
                </div>
            </section>

            <section className="flex-1 bg-white relative overflow-hidden py-10 lg:py-16">
                <TextureBackground />
                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
                        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center order-1 lg:order-2">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-wide mb-8">{t('contact.formTitle')}</h2>
                            <div className="flex flex-wrap gap-x-4 gap-y-3 mb-8 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[#c5a059]/10 flex items-center justify-center"><i className="fa-solid fa-location-dot text-[#c5a059]"></i></div>
                                    <span className="text-slate-600">{business.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[#c5a059]/10 flex items-center justify-center"><i className="fa-solid fa-phone text-[#c5a059] text-sm"></i></div>
                                    <a href={`tel:${business.phone}`} className="text-slate-600 hover:text-[#c5a059] transition-colors">{business.phone}</a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-[#c5a059]/10 flex items-center justify-center"><i className="fa-solid fa-envelope text-[#c5a059] text-sm"></i></div>
                                    <a href={`mailto:${business.email}`} className="text-slate-600 hover:text-[#c5a059] transition-colors">{business.email}</a>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3.5 min-h-[48px] border-2 border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:border-[#c5a059] focus:outline-none transition-colors text-base md:text-sm"
                                    placeholder={t('contact.namePh')} />
                                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3.5 min-h-[48px] border-2 border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:border-[#c5a059] focus:outline-none transition-colors text-base md:text-sm"
                                    placeholder={t('contact.emailPh')} />
                                <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3.5 min-h-[120px] border-2 border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:border-[#c5a059] focus:outline-none transition-colors resize-none text-base md:text-sm"
                                    placeholder={t('contact.msgPh')}></textarea>
                                <button type="submit" className="w-full md:w-auto bg-[#c5a059] hover:bg-amber-600 text-white font-bold px-10 py-4 min-h-[52px] rounded-2xl transition-colors uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98]">
                                    <i className="fab fa-whatsapp text-lg"></i>
                                    {t('contact.send')}
                                </button>
                            </form>
                        </div>
                        <div className="w-full lg:w-1/2 h-[280px] md:h-[350px] lg:h-auto min-h-[280px] lg:min-h-[300px] relative order-2 lg:order-1">
                            <iframe src={business.mapEmbedUrl} width="100%" height="100%" style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
                                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Location" className="absolute inset-0"></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Iletisim;
