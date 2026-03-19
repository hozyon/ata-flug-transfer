import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteContent } from '../SiteContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Iletisim: React.FC = () => {
    useScrollReveal();
    const { siteContent } = useSiteContent();
    const { t } = useLanguage();
    const business = siteContent.business;

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);
    const seo = siteContent.seo;
    const canonical = seo?.canonicalUrl || '';
    const pageTitle = seo?.pagesSeo?.contact?.title || 'İletişim';
    const pageDesc = seo?.pagesSeo?.contact?.description || 'Ata Flug Transfer ile 7/24 iletişime geçin.';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const message = `${t('contact.waMsg')}%0A%0A${t('form.name')}: ${formData.name}%0A${t('faq.email')}: ${formData.email}%0A%0A${formData.message}`;
        window.open(`https://wa.me/${business.whatsapp}?text=${message}`, '_blank');
        setFormData({ name: '', email: '', message: '' });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    const inputClass = (field: string) =>
        `w-full bg-transparent border-b-2 px-0 py-3 text-slate-800 placeholder-transparent outline-none transition-all duration-300 text-[15px] font-medium
        ${focused === field || formData[field as keyof typeof formData]
            ? 'border-[var(--color-primary)]'
            : 'border-slate-200 hover:border-slate-300'}`;

    const labelClass = (field: string) =>
        `absolute left-0 transition-all duration-300 pointer-events-none font-semibold
        ${focused === field || formData[field as keyof typeof formData]
            ? '-top-5 text-[10px] tracking-[0.15em] uppercase text-[var(--color-primary)]'
            : 'top-3 text-slate-400 text-[14px]'}`;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Helmet>
                <title>{pageTitle} | {business.name}</title>
                <meta name="description" content={pageDesc} />
                <meta name="keywords" content={seo?.pagesSeo?.contact?.keywords || seo?.siteKeywords || ''} />
                <meta name="robots" content={seo?.robotsDirective || 'index, follow'} />
                <link rel="canonical" href={`${canonical}/iletisim`} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDesc} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${canonical}/iletisim`} />
                <meta property="og:image" content={seo?.ogImage || ''} />
                <meta property="og:locale" content="tr_TR" />
                <meta property="og:site_name" content={business.name} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={seo?.twitterHandle || ''} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDesc} />
            </Helmet>

            {/* ── BANNER ─────────────────────────────────────────── */}
            <section className="page-banner relative pt-28 pb-14 flex items-center justify-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/about-custom.jpg"
                        alt="İletişim Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/75" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-4 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                        <span>{t('contact.eyebrow')}</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-playfair font-medium text-white mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 drop-shadow-2xl">
                        {t('contact.title')}
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl font-light tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        {t('contact.subtitle')}
                    </p>
                </div>
            </section>

            {/* ── CONTACT CARDS ──────────────────────────────────── */}
            <section className="bg-[#0a0c14] py-0">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 stagger-children -translate-y-6">
                        {/* Phone */}
                        <a
                            href={`tel:${business.phone}`}
                            className="reveal group flex items-center gap-5 px-7 py-7 border-b sm:border-b-0 sm:border-r border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center shrink-0 group-hover:bg-[var(--color-primary)] group-hover:border-[var(--color-primary)] transition-all duration-300">
                                <i className="fa-solid fa-phone text-[var(--color-primary)] text-lg group-hover:text-[#0a0c14] transition-colors duration-300" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-[var(--color-primary)]/50 uppercase tracking-[0.25em] mb-1">{t('faq.phone')}</p>
                                <p className="text-white font-bold text-[15px] tracking-wide">{business.phone}</p>
                            </div>
                        </a>
                        {/* WhatsApp */}
                        <a
                            href={`https://wa.me/${business.whatsapp}`}
                            target="_blank" rel="noopener noreferrer"
                            className="reveal group flex items-center gap-5 px-7 py-7 border-b sm:border-b-0 sm:border-r border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center shrink-0 group-hover:bg-[#25D366] group-hover:border-[#25D366] transition-all duration-300">
                                <i className="fa-brands fa-whatsapp text-[#25D366] text-xl group-hover:text-white transition-colors duration-300" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-[#25D366]/50 uppercase tracking-[0.25em] mb-1">WhatsApp</p>
                                <p className="text-white font-bold text-[15px] tracking-wide">{t('hero.whatsapp')}</p>
                            </div>
                        </a>
                        {/* Email */}
                        <a
                            href={`mailto:${business.email}`}
                            className="reveal group flex items-center gap-5 px-7 py-7 hover:bg-white/[0.04] transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:border-sky-500 transition-all duration-300">
                                <i className="fa-solid fa-envelope text-sky-400 text-lg group-hover:text-white transition-colors duration-300" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-sky-400/50 uppercase tracking-[0.25em] mb-1">{t('faq.email')}</p>
                                <p className="text-white font-bold text-[15px] tracking-wide truncate max-w-[180px]">{business.email}</p>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* ── FORM + MAP ─────────────────────────────────────── */}
            <section className="flex-1 bg-white py-16 relative overflow-hidden">
                {/* Decorative gold line top-left */}
                <div className="absolute top-0 left-0 w-48 h-px bg-gradient-to-r from-[var(--color-primary)]/60 to-transparent" />
                <div className="absolute top-0 left-0 w-px h-48 bg-gradient-to-b from-[var(--color-primary)]/60 to-transparent" />

                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-2xl shadow-slate-200/80 rounded-3xl overflow-hidden border border-slate-100">

                        {/* LEFT — Form */}
                        <div className="reveal-left bg-white px-8 md:px-14 py-12 md:py-16 flex flex-col justify-center order-1">
                            {/* Section label */}
                            <div className="flex items-center gap-3 mb-10">
                                <span className="w-8 h-px bg-[var(--color-primary)]" />
                                <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-[0.3em]">{t('contact.eyebrow')}</span>
                            </div>

                            <h2 className="font-playfair text-3xl md:text-4xl text-slate-900 font-medium leading-tight mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {t('contact.formTitle')}
                            </h2>

                            {/* Address strip */}
                            {business.address && (
                                <div className="flex items-start gap-3 mb-10 pb-10 border-b border-slate-100">
                                    <i className="fa-solid fa-location-dot text-[var(--color-primary)] text-sm mt-0.5 shrink-0" />
                                    <p className="text-slate-500 text-[13px] leading-relaxed">{business.address}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                                {/* Name */}
                                <div className="relative">
                                    <label htmlFor="c-name" className={labelClass('name')}>
                                        {t('contact.namePh')}
                                    </label>
                                    <input
                                        id="c-name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        onFocus={() => setFocused('name')}
                                        onBlur={() => setFocused(null)}
                                        className={inputClass('name')}
                                        placeholder={t('contact.namePh')}
                                    />
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <label htmlFor="c-email" className={labelClass('email')}>
                                        {t('contact.emailPh')}
                                    </label>
                                    <input
                                        id="c-email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        onFocus={() => setFocused('email')}
                                        onBlur={() => setFocused(null)}
                                        className={inputClass('email')}
                                        placeholder={t('contact.emailPh')}
                                    />
                                </div>

                                {/* Message */}
                                <div className="relative">
                                    <label htmlFor="c-msg" className={labelClass('message')}>
                                        {t('contact.msgPh')}
                                    </label>
                                    <textarea
                                        id="c-msg"
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        onFocus={() => setFocused('message')}
                                        onBlur={() => setFocused(null)}
                                        className={inputClass('message') + ' resize-none'}
                                        placeholder={t('contact.msgPh')}
                                    />
                                </div>

                                {/* Submit */}
                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                    <button
                                        type="submit"
                                        className="group flex items-center gap-3 bg-[var(--color-primary)] hover:bg-[#d4af6a] text-[#0f172a] font-black text-[12px] uppercase tracking-[0.15em] px-8 py-4 rounded-full transition-all duration-300 active:scale-[0.97]"
                                    >
                                        <i className="fa-brands fa-whatsapp text-lg" />
                                        <span>{t('contact.send')}</span>
                                        <i className="fa-solid fa-arrow-right text-[10px] -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </button>

                                    {/* Trust badges */}
                                    <div className="flex items-center gap-4 sm:ml-2 mt-1">
                                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                                            <i className="fa-solid fa-lock text-emerald-500 text-[9px]" />
                                            <span>{t('form.trustSecure')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                                            <i className="fa-solid fa-bolt text-amber-400 text-[9px]" />
                                            <span>{t('form.trustFast')}</span>
                                        </div>
                                    </div>
                                </div>

                                {submitted && (
                                    <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-50 border border-emerald-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <i className="fa-brands fa-whatsapp text-emerald-500 text-xl" />
                                        <span className="text-emerald-700 text-sm font-semibold">WhatsApp'a yönlendiriliyorsunuz...</span>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* RIGHT — Map */}
                        <div className="reveal relative h-[320px] lg:h-auto min-h-[320px] order-2 bg-slate-100 overflow-hidden">
                            {business.mapEmbedUrl ? (
                                <iframe
                                    src={business.mapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: 'grayscale(20%) contrast(95%)' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Konum"
                                    className="absolute inset-0 w-full h-full"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                                    <div className="text-center text-slate-400">
                                        <i className="fa-solid fa-map-location-dot text-5xl mb-3" />
                                        <p className="text-sm font-medium">Harita yükleniyor...</p>
                                    </div>
                                </div>
                            )}
                            {/* Location card overlay */}
                            <div className="absolute bottom-5 left-5 right-5 lg:right-auto lg:max-w-[260px] bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-slate-100">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                                        <i className="fa-solid fa-location-dot text-[var(--color-primary)] text-sm" />
                                    </div>
                                    <div>
                                        <p className="text-slate-900 font-bold text-[13px] leading-tight">{business.name}</p>
                                        <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">{business.address}</p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3">
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        {t('hero.trust.247')} {t('contact.eyebrow')}
                                    </span>
                                    <a
                                        href={`tel:${business.phone}`}
                                        className="ml-auto text-[10px] font-bold text-[var(--color-primary)] hover:underline"
                                    >
                                        {business.phone}
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── WORKING HOURS STRIP ────────────────────────────── */}
            <section className="bg-slate-50 border-t border-slate-100 py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-16 stagger-children">
                        <div className="reveal flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                                <i className="fa-solid fa-clock text-[var(--color-primary)]" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('faq.workHours')}</p>
                                <p className="text-slate-700 font-bold text-[14px]">7/24</p>
                            </div>
                        </div>
                        <div className="hidden sm:block w-px h-10 bg-slate-200" />
                        <div className="reveal flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                                <i className="fa-solid fa-headset text-[var(--color-primary)]" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('hero.trust.247')}</p>
                                <p className="text-slate-700 font-bold text-[14px]">{t('services.card4.title')}</p>
                            </div>
                        </div>
                        <div className="hidden sm:block w-px h-10 bg-slate-200" />
                        <div className="reveal flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                                <i className="fa-solid fa-plane-arrival text-[var(--color-primary)]" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('hero.trust.tracking')}</p>
                                <p className="text-slate-700 font-bold text-[14px]">{t('services.card1.title')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Iletisim;
