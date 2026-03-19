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
        const msg = `${t('contact.waMsg')}%0A%0A${t('form.name')}: ${formData.name}%0A${t('faq.email')}: ${formData.email}%0A%0A${formData.message}`;
        window.open(`https://wa.me/${business.whatsapp}?text=${msg}`, '_blank');
        setFormData({ name: '', email: '', message: '' });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    const inputStyle = (field: string): React.CSSProperties => ({
        background: focused === field ? 'rgba(197,160,89,0.05)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${focused === field ? 'rgba(197,160,89,0.45)' : 'rgba(255,255,255,0.07)'}`,
        transition: 'all 0.25s ease',
        fontFamily: "'Montserrat', sans-serif",
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
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

            {/* ── CONTACT CHANNELS ───────────────────────────────── */}
            <section className="bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 stagger-children">

                        {/* Phone */}
                        <a href={`tel:${business.phone}`}
                            className="reveal group relative flex items-center gap-5 px-6 py-8 transition-all duration-300 overflow-hidden border-b sm:border-b-0 sm:border-r border-slate-100">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: 'linear-gradient(135deg, rgba(197,160,89,0.05) 0%, transparent 70%)' }} />
                            <div className="relative shrink-0">
                                <div className="rounded-2xl flex items-center justify-center"
                                    style={{ width: 52, height: 52, background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.2)' }}>
                                    <i className="fa-solid fa-phone text-base" style={{ color: '#c5a059' }} />
                                </div>
                                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black"
                                    style={{ background: '#c5a059', color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>01</span>
                            </div>
                            <div className="relative">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-1"
                                    style={{ color: 'rgba(197,160,89,0.6)', fontFamily: "'Outfit', sans-serif" }}>{t('faq.phone')}</p>
                                <p className="text-slate-800 font-bold text-[15px]" style={{ fontFamily: "'Outfit', sans-serif" }}>{business.phone}</p>
                                <p className="text-slate-400 text-[11px] mt-0.5">7/24 {t('hero.trust.247')}</p>
                            </div>
                        </a>

                        {/* WhatsApp */}
                        <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer"
                            className="reveal group relative flex items-center gap-5 px-6 py-8 transition-all duration-300 overflow-hidden border-b sm:border-b-0 sm:border-r border-slate-100">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.05) 0%, transparent 70%)' }} />
                            <div className="relative shrink-0">
                                <div className="rounded-2xl flex items-center justify-center"
                                    style={{ width: 52, height: 52, background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}>
                                    <i className="fa-brands fa-whatsapp text-xl" style={{ color: '#25D366' }} />
                                </div>
                                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black"
                                    style={{ background: '#25D366', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>02</span>
                            </div>
                            <div className="relative">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-1"
                                    style={{ color: 'rgba(37,211,102,0.6)', fontFamily: "'Outfit', sans-serif" }}>WhatsApp</p>
                                <p className="text-slate-800 font-bold text-[15px]" style={{ fontFamily: "'Outfit', sans-serif" }}>{t('hero.whatsapp')}</p>
                                <p className="text-slate-400 text-[11px] mt-0.5">{t('blogPost.avgResponse')}</p>
                            </div>
                        </a>

                        {/* Email */}
                        <a href={`mailto:${business.email}`}
                            className="reveal group relative flex items-center gap-5 px-6 py-8 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.05) 0%, transparent 70%)' }} />
                            <div className="relative shrink-0">
                                <div className="rounded-2xl flex items-center justify-center"
                                    style={{ width: 52, height: 52, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)' }}>
                                    <i className="fa-solid fa-envelope text-base" style={{ color: '#38bdf8' }} />
                                </div>
                                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black"
                                    style={{ background: '#38bdf8', color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>03</span>
                            </div>
                            <div className="relative">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-1"
                                    style={{ color: 'rgba(56,189,248,0.6)', fontFamily: "'Outfit', sans-serif" }}>{t('faq.email')}</p>
                                <p className="text-slate-800 font-bold text-[14px] truncate max-w-[200px]" style={{ fontFamily: "'Outfit', sans-serif" }}>{business.email}</p>
                                <p className="text-slate-400 text-[11px] mt-0.5">{t('form.trustFast')}</p>
                            </div>
                        </a>

                    </div>
                </div>
            </section>

            {/* ── MAIN: LEFT INFO + RIGHT FORM ───────────────────── */}
            <section className="flex-1 py-20 bg-white relative overflow-hidden">
                {/* Subtle top-left gold corner */}
                <div className="absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-[var(--color-primary)]/40 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-px h-40 bg-gradient-to-b from-[var(--color-primary)]/40 to-transparent pointer-events-none" />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24">

                        {/* ── LEFT: Editorial info column ── */}
                        <div className="reveal-left flex flex-col">
                            {/* Section label */}
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-5 h-px" style={{ background: '#c5a059' }} />
                                <span className="text-[9px] font-black tracking-[0.35em] uppercase"
                                    style={{ color: 'rgba(197,160,89,0.6)', fontFamily: "'Outfit', sans-serif" }}>
                                    {t('contact.eyebrow')}
                                </span>
                            </div>

                            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-slate-800 leading-tight mb-5"
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                {t('contact.formTitle')}
                            </h2>
                            <p className="text-[15px] leading-relaxed mb-10 text-slate-500"
                                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                {t('contact.subtitle')}
                            </p>

                            {/* Info items */}
                            <div className="space-y-5">
                                {business.address && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                            style={{ background: 'rgba(197,160,89,0.07)', border: '1px solid rgba(197,160,89,0.14)' }}>
                                            <i className="fa-solid fa-location-dot text-sm" style={{ color: '#c5a059' }} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-1"
                                                style={{ color: 'rgba(197,160,89,0.45)', fontFamily: "'Outfit', sans-serif" }}>
                                                {t('hero.trust.tracking')}
                                            </p>
                                            <p className="text-[13px] leading-relaxed text-slate-500">
                                                {business.address}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: 'rgba(197,160,89,0.07)', border: '1px solid rgba(197,160,89,0.14)' }}>
                                        <i className="fa-solid fa-clock text-sm" style={{ color: '#c5a059' }} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-1"
                                            style={{ color: 'rgba(197,160,89,0.45)', fontFamily: "'Outfit', sans-serif" }}>
                                            {t('faq.workHours')}
                                        </p>
                                        <p className="text-[13px] text-slate-500">
                                            7/24 — {t('hero.trust.247')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: 'rgba(197,160,89,0.07)', border: '1px solid rgba(197,160,89,0.14)' }}>
                                        <i className="fa-solid fa-plane-departure text-sm" style={{ color: '#c5a059' }} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-1"
                                            style={{ color: 'rgba(197,160,89,0.45)', fontFamily: "'Outfit', sans-serif" }}>
                                            {t('hero.trust.airports')}
                                        </p>
                                        <p className="text-[13px] text-slate-500">
                                            Antalya (AYT) · Gazipaşa (GZP)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider with gold dot */}
                            <div className="my-10 flex items-center gap-4">
                                <div className="h-px flex-1 bg-slate-200" />
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c5a059' }} />
                                <div className="h-px flex-1 bg-slate-200" />
                            </div>

                            {/* Social row */}
                            <div className="flex items-center gap-2.5">
                                <span className="text-[9px] font-black tracking-[0.2em] uppercase mr-1 text-slate-300"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    Sosyal
                                </span>
                                {business.instagram && (
                                    <a href={business.instagram} target="_blank" rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 text-slate-400 hover:text-pink-500 hover:bg-pink-50 border border-slate-200">
                                        <i className="fa-brands fa-instagram text-sm" />
                                    </a>
                                )}
                                {business.facebook && (
                                    <a href={business.facebook} target="_blank" rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 text-slate-400 hover:text-blue-500 hover:bg-blue-50 border border-slate-200">
                                        <i className="fa-brands fa-facebook-f text-sm" />
                                    </a>
                                )}
                                {business.telegram && (
                                    <a href={business.telegram} target="_blank" rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 text-slate-400 hover:text-sky-500 hover:bg-sky-50 border border-slate-200">
                                        <i className="fa-brands fa-telegram text-sm" />
                                    </a>
                                )}
                                <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 border border-slate-200">
                                    <i className="fa-brands fa-whatsapp text-sm" />
                                </a>
                            </div>
                        </div>

                        {/* ── RIGHT: Form card ── */}
                        <div className="reveal">
                            <div className="rounded-3xl overflow-hidden" style={{
                                background: 'rgba(255,255,255,0.025)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
                            }}>
                                {/* Gold top accent bar */}
                                <div className="h-px w-full" style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.7) 40%, rgba(197,160,89,0.9) 60%, transparent)',
                                }} />

                                <div className="p-8 md:p-10">
                                    {/* Form header */}
                                    <div className="mb-8">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#c5a059' }} />
                                            <span className="text-[9px] font-black tracking-[0.3em] uppercase"
                                                style={{ color: 'rgba(197,160,89,0.65)', fontFamily: "'Outfit', sans-serif" }}>
                                                {t('contact.formTitle')}
                                            </span>
                                        </div>
                                        <p className="text-[13px]"
                                            style={{ color: 'rgba(255,255,255,0.28)', fontFamily: "'Montserrat', sans-serif" }}>
                                            {t('blogPost.sidebarDesc')}
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-[10px] font-black tracking-[0.2em] uppercase mb-2"
                                                style={{ color: 'rgba(197,160,89,0.55)', fontFamily: "'Outfit', sans-serif" }}>
                                                {t('contact.namePh')}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                onFocus={() => setFocused('name')}
                                                onBlur={() => setFocused(null)}
                                                placeholder={t('contact.namePh')}
                                                className="w-full px-4 py-3.5 rounded-xl text-white outline-none text-[14px] font-medium"
                                                style={{
                                                    ...inputStyle('name'),
                                                    color: 'rgba(255,255,255,0.85)',
                                                    // placeholder handled via CSS below
                                                }}
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-[10px] font-black tracking-[0.2em] uppercase mb-2"
                                                style={{ color: 'rgba(197,160,89,0.55)', fontFamily: "'Outfit', sans-serif" }}>
                                                {t('contact.emailPh')}
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                onFocus={() => setFocused('email')}
                                                onBlur={() => setFocused(null)}
                                                placeholder={t('contact.emailPh')}
                                                className="w-full px-4 py-3.5 rounded-xl outline-none text-[14px] font-medium"
                                                style={{
                                                    ...inputStyle('email'),
                                                    color: 'rgba(255,255,255,0.85)',
                                                }}
                                            />
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="block text-[10px] font-black tracking-[0.2em] uppercase mb-2"
                                                style={{ color: 'rgba(197,160,89,0.55)', fontFamily: "'Outfit', sans-serif" }}>
                                                {t('contact.msgPh')}
                                            </label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={formData.message}
                                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                onFocus={() => setFocused('message')}
                                                onBlur={() => setFocused(null)}
                                                placeholder={t('contact.msgPh')}
                                                className="w-full px-4 py-3.5 rounded-xl outline-none text-[14px] font-medium resize-none"
                                                style={{
                                                    ...inputStyle('message'),
                                                    color: 'rgba(255,255,255,0.85)',
                                                }}
                                            />
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black text-[13px] uppercase tracking-[0.1em] transition-all duration-300 active:scale-[0.98]"
                                            style={{
                                                background: 'linear-gradient(135deg, #e0cb8b 0%, #c5a059 100%)',
                                                color: '#0f172a',
                                                fontFamily: "'Outfit', sans-serif",
                                                boxShadow: '0 8px 32px rgba(197,160,89,0.25)',
                                            }}
                                        >
                                            <i className="fa-brands fa-whatsapp text-lg" />
                                            <span>{t('contact.send')}</span>
                                            <i className="fa-solid fa-arrow-right text-[10px]" />
                                        </button>

                                        {/* Trust pills */}
                                        <div className="flex items-center justify-center gap-5 pt-1">
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-solid fa-lock text-emerald-400 text-[9px]" />
                                                <span className="text-[10px]"
                                                    style={{ color: 'rgba(255,255,255,0.22)', fontFamily: "'Montserrat', sans-serif" }}>
                                                    {t('form.trustSecure')}
                                                </span>
                                            </div>
                                            <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.08)' }} />
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-solid fa-bolt text-amber-400 text-[9px]" />
                                                <span className="text-[10px]"
                                                    style={{ color: 'rgba(255,255,255,0.22)', fontFamily: "'Montserrat', sans-serif" }}>
                                                    {t('form.trustFast')}
                                                </span>
                                            </div>
                                        </div>

                                        {submitted && (
                                            <div className="flex items-center gap-3 px-5 py-4 rounded-2xl"
                                                style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}>
                                                <i className="fa-brands fa-whatsapp text-xl" style={{ color: '#25D366' }} />
                                                <span className="text-sm font-semibold" style={{ color: '#4ade80' }}>
                                                    WhatsApp'a yönlendiriliyorsunuz...
                                                </span>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ── MAP ────────────────────────────────────────────── */}
            <section className="relative overflow-hidden border-t border-slate-100"
                style={{ height: 'clamp(320px, 40vw, 460px)' }}>
                {business.mapEmbedUrl ? (
                    <iframe
                        src={business.mapEmbedUrl}
                        title="Konum"
                        width="100%"
                        height="100%"
                        style={{ border: 0, position: 'absolute', inset: 0, filter: 'grayscale(20%) contrast(95%)' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                        <div className="text-center text-slate-400">
                            <i className="fa-solid fa-map-location-dot text-5xl mb-3" />
                            <p className="text-sm font-medium">Harita yükleniyor...</p>
                        </div>
                    </div>
                )}

                {/* Soft left fade */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.6) 0%, transparent 45%)' }} />

                {/* Location card */}
                <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2" style={{ maxWidth: 280 }}>
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-slate-100">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.2)' }}>
                                <i className="fa-solid fa-location-dot text-sm" style={{ color: '#c5a059' }} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-[13px] mb-1 leading-tight"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    {business.name}
                                </p>
                                <p className="text-slate-400 text-[11px] leading-relaxed">{business.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                7/24 Açık
                            </span>
                            <a href={`tel:${business.phone}`}
                                className="text-[10px] font-bold hover:underline"
                                style={{ color: '#c5a059', fontFamily: "'Outfit', sans-serif" }}>
                                {business.phone}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── BOTTOM STRIP ───────────────────────────────────── */}
            <section className="bg-slate-50 border-t border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-6 sm:gap-10 stagger-children">
                            <div className="reveal flex items-center gap-3">
                                <i className="fa-solid fa-clock text-sm" style={{ color: '#c5a059' }} />
                                <span className="text-slate-500 text-[12px]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                    <span className="text-slate-700 font-bold">7/24</span> {t('faq.workHours')}
                                </span>
                            </div>
                            <div className="reveal flex items-center gap-3">
                                <i className="fa-solid fa-headset text-sm" style={{ color: '#c5a059' }} />
                                <span className="text-slate-500 text-[12px]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                    <span className="text-slate-700 font-bold">{t('hero.trust.247')}</span> {t('services.card4.title')}
                                </span>
                            </div>
                            <div className="reveal flex items-center gap-3">
                                <i className="fa-solid fa-plane-arrival text-sm" style={{ color: '#c5a059' }} />
                                <span className="text-slate-700 font-bold text-[12px]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                    {t('hero.trust.tracking')}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                            style={{ background: 'rgba(197,160,89,0.08)', border: '1px solid rgba(197,160,89,0.2)' }}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c5a059' }} />
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase"
                                style={{ color: '#c5a059', fontFamily: "'Outfit', sans-serif" }}>
                                VIP Transfer · Antalya
                            </span>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Iletisim;
