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

    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#020617' }}>
            <style>{`
                @keyframes gridFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes lineReveal {
                    from { scaleX: 0; }
                    to { scaleX: 1; }
                }
                @keyframes channelIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .contact-channel {
                    animation: channelIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
                }
                .contact-channel:nth-child(1) { animation-delay: 0.1s; }
                .contact-channel:nth-child(2) { animation-delay: 0.2s; }
                .contact-channel:nth-child(3) { animation-delay: 0.3s; }
                .iletisim-input {
                    background: rgba(255,255,255,0.03) !important;
                    border: 1px solid rgba(255,255,255,0.07) !important;
                    color: white !important;
                    transition: border-color 0.2s ease, background 0.2s ease !important;
                }
                .iletisim-input:focus {
                    background: rgba(197,160,89,0.04) !important;
                    border-color: rgba(197,160,89,0.4) !important;
                    outline: none !important;
                }
                .iletisim-input::placeholder { color: rgba(255,255,255,0.18); }
            `}</style>

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

            {/* ── CHANNEL STRIP ──────────────────────────────────── */}
            <section style={{ background: 'rgba(197,160,89,0.04)', borderBottom: '1px solid rgba(197,160,89,0.12)' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-0">
                    <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x" style={{ '--tw-divide-opacity': '0.05' } as React.CSSProperties}>

                        {/* Phone */}
                        <a href={`tel:${business.phone}`}
                            className="contact-channel flex-1 flex items-center gap-4 sm:gap-5 px-4 sm:px-6 py-4 sm:py-6 group transition-colors duration-200"
                            style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(197,160,89,0.06)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105"
                                style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.2)' }}>
                                <i className="fa-solid fa-phone text-sm" style={{ color: '#c5a059' }} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.28em] mb-1" style={{ color: 'rgba(197,160,89,0.5)', fontFamily: "'Outfit', sans-serif" }}>{t('faq.phone')}</p>
                                <p className="text-white font-bold text-[15px]" style={{ fontFamily: "'Outfit', sans-serif" }}>{business.phone}</p>
                            </div>
                            <i className="fa-solid fa-arrow-right ml-auto text-[10px] opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: '#c5a059' }} />
                        </a>

                        {/* WhatsApp */}
                        <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer"
                            className="contact-channel flex-1 flex items-center gap-4 sm:gap-5 px-4 sm:px-6 py-4 sm:py-6 group transition-colors duration-200"
                            style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(37,211,102,0.05)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105"
                                style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.18)' }}>
                                <i className="fa-brands fa-whatsapp text-xl" style={{ color: '#25D366' }} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.28em] mb-1" style={{ color: 'rgba(37,211,102,0.5)', fontFamily: "'Outfit', sans-serif" }}>WhatsApp</p>
                                <p className="text-white font-bold text-[15px]" style={{ fontFamily: "'Outfit', sans-serif" }}>{t('hero.whatsapp')}</p>
                            </div>
                            <i className="fa-solid fa-arrow-right ml-auto text-[10px] opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: '#25D366' }} />
                        </a>

                        {/* Email */}
                        <a href={`mailto:${business.email}`}
                            className="contact-channel flex-1 flex items-center gap-4 sm:gap-5 px-4 sm:px-6 py-4 sm:py-6 group transition-colors duration-200"
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(56,189,248,0.05)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105"
                                style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.18)' }}>
                                <i className="fa-solid fa-envelope text-sm" style={{ color: '#38bdf8' }} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[9px] font-black uppercase tracking-[0.28em] mb-1" style={{ color: 'rgba(56,189,248,0.5)', fontFamily: "'Outfit', sans-serif" }}>{t('faq.email')}</p>
                                <p className="text-white font-bold text-[14px] truncate" style={{ fontFamily: "'Outfit', sans-serif" }}>{business.email}</p>
                            </div>
                            <i className="fa-solid fa-arrow-right ml-auto text-[10px] shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: '#38bdf8' }} />
                        </a>

                    </div>
                </div>
            </section>

            {/* ── MAIN: EDITORIAL DARK ───────────────────────────── */}
            <section className="flex-1 relative overflow-hidden">

                {/* Background grid texture */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'linear-gradient(rgba(197,160,89,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.03) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse 70% 60% at 70% 50%, rgba(197,160,89,0.05) 0%, transparent 65%)',
                }} />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 lg:gap-24">

                        {/* ── LEFT: Info column ── */}
                        <div className="reveal-left flex flex-col gap-12">

                            {/* Heading block */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-px w-8" style={{ background: '#c5a059' }} />
                                    <span className="text-[9px] font-black tracking-[0.4em] uppercase" style={{ color: 'rgba(197,160,89,0.55)', fontFamily: "'Outfit', sans-serif" }}>
                                        {t('contact.eyebrow')}
                                    </span>
                                </div>
                                <h2 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
                                    fontWeight: 700,
                                    lineHeight: 1.1,
                                    color: 'white',
                                    letterSpacing: '-0.01em',
                                    marginBottom: '1.25rem',
                                }}>
                                    {t('contact.formTitle')}
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 15, lineHeight: 1.75, fontFamily: "'Montserrat', sans-serif", maxWidth: 400 }}>
                                    {t('contact.subtitle')}
                                </p>
                            </div>

                            {/* Info items — editorial list */}
                            <div className="space-y-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                {[
                                    {
                                        icon: 'fa-location-dot',
                                        label: t('hero.trust.tracking'),
                                        value: business.address,
                                        color: '#c5a059',
                                    },
                                    {
                                        icon: 'fa-clock',
                                        label: t('faq.workHours'),
                                        value: `7/24 — ${t('hero.trust.247')}`,
                                        color: '#c5a059',
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                            style={{ background: 'rgba(197,160,89,0.08)', border: '1px solid rgba(197,160,89,0.15)' }}>
                                            <i className={`fa-solid ${item.icon} text-sm`} style={{ color: item.color }} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black tracking-[0.22em] uppercase mb-1" style={{ color: 'rgba(197,160,89,0.4)', fontFamily: "'Outfit', sans-serif" }}>
                                                {item.label}
                                            </p>
                                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontFamily: "'Montserrat', sans-serif" }}>
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Social row */}
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black tracking-[0.22em] uppercase mr-1" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: "'Outfit', sans-serif" }}>
                                    Sosyal
                                </span>
                                {business.instagram && (
                                    <a href={business.instagram} target="_blank" rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90"
                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}
                                        onMouseEnter={e => { e.currentTarget.style.color = '#e1306c'; e.currentTarget.style.background = 'rgba(225,48,108,0.08)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                    >
                                        <i className="fa-brands fa-instagram text-sm" />
                                    </a>
                                )}
                                {business.facebook && (
                                    <a href={business.facebook} target="_blank" rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90"
                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}
                                        onMouseEnter={e => { e.currentTarget.style.color = '#1877f2'; e.currentTarget.style.background = 'rgba(24,119,242,0.08)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                    >
                                        <i className="fa-brands fa-facebook-f text-sm" />
                                    </a>
                                )}
                                {business.telegram && (
                                    <a href={business.telegram} target="_blank" rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90"
                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}
                                        onMouseEnter={e => { e.currentTarget.style.color = '#0088cc'; e.currentTarget.style.background = 'rgba(0,136,204,0.08)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                    >
                                        <i className="fa-brands fa-telegram text-sm" />
                                    </a>
                                )}
                                <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#25D366'; e.currentTarget.style.background = 'rgba(37,211,102,0.08)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                                >
                                    <i className="fa-brands fa-whatsapp text-sm" />
                                </a>
                            </div>
                        </div>

                        {/* ── RIGHT: Form — dark glass ── */}
                        <div className="reveal">
                            <div className="relative rounded-2xl overflow-hidden"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(12px)',
                                    WebkitBackdropFilter: 'blur(12px)',
                                }}>

                                {/* Gold top accent */}
                                <div style={{
                                    height: 2,
                                    background: 'linear-gradient(90deg, #c5a059 0%, #e0cb8b 50%, rgba(197,160,89,0.2) 100%)',
                                }} />

                                <div className="p-8 md:p-10">
                                    {/* Form label */}
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c5a059', boxShadow: '0 0 8px #c5a059' }} />
                                            <span className="text-[10px] font-black tracking-[0.28em] uppercase" style={{ color: 'rgba(197,160,89,0.6)', fontFamily: "'Outfit', sans-serif" }}>
                                                {t('contact.formTitle')}
                                            </span>
                                        </div>
                                        <div className="flex-1 h-px" style={{ background: 'rgba(197,160,89,0.12)' }} />
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Name */}
                                        <div>
                                            <label className="block text-[10px] font-black tracking-[0.2em] uppercase mb-2.5" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Outfit', sans-serif" }}>
                                                {t('contact.namePh')}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                autoComplete="name"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                onFocus={() => setFocused('name')}
                                                onBlur={() => setFocused(null)}
                                                placeholder={t('contact.namePh')}
                                                className="iletisim-input w-full px-4 py-3.5 rounded-xl text-[14px] font-medium"
                                                style={{
                                                    background: focused === 'name' ? 'rgba(197,160,89,0.05)' : 'rgba(255,255,255,0.03)',
                                                    border: `1px solid ${focused === 'name' ? 'rgba(197,160,89,0.4)' : 'rgba(255,255,255,0.07)'}`,
                                                    color: 'white',
                                                    fontFamily: "'Montserrat', sans-serif",
                                                    transition: 'border-color 0.2s ease, background 0.2s ease',
                                                }}
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-[10px] font-black tracking-[0.2em] uppercase mb-2.5" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Outfit', sans-serif" }}>
                                                {t('contact.emailPh')}
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                autoComplete="email"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                onFocus={() => setFocused('email')}
                                                onBlur={() => setFocused(null)}
                                                placeholder={t('contact.emailPh')}
                                                className="w-full px-4 py-3.5 rounded-xl text-[14px] font-medium"
                                                style={{
                                                    background: focused === 'email' ? 'rgba(197,160,89,0.05)' : 'rgba(255,255,255,0.03)',
                                                    border: `1px solid ${focused === 'email' ? 'rgba(197,160,89,0.4)' : 'rgba(255,255,255,0.07)'}`,
                                                    color: 'white',
                                                    fontFamily: "'Montserrat', sans-serif",
                                                    transition: 'border-color 0.2s ease, background 0.2s ease',
                                                    outline: 'none',
                                                }}
                                            />
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="block text-[10px] font-black tracking-[0.2em] uppercase mb-2.5" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Outfit', sans-serif" }}>
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
                                                className="w-full px-4 py-3.5 rounded-xl text-[14px] font-medium resize-none"
                                                style={{
                                                    background: focused === 'message' ? 'rgba(197,160,89,0.05)' : 'rgba(255,255,255,0.03)',
                                                    border: `1px solid ${focused === 'message' ? 'rgba(197,160,89,0.4)' : 'rgba(255,255,255,0.07)'}`,
                                                    color: 'white',
                                                    fontFamily: "'Montserrat', sans-serif",
                                                    transition: 'border-color 0.2s ease, background 0.2s ease',
                                                    outline: 'none',
                                                }}
                                            />
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            className="relative w-full flex items-center justify-center gap-3 py-4 rounded-xl font-black text-[12.5px] uppercase tracking-[0.12em] overflow-hidden transition-all duration-200 active:scale-[0.98] hover:-translate-y-px"
                                            style={{
                                                background: 'linear-gradient(135deg, #e8d49a 0%, #c5a059 55%, #9e7b38 100%)',
                                                color: '#0a0c14',
                                                fontFamily: "'Outfit', sans-serif",
                                                boxShadow: '0 4px 24px rgba(197,160,89,0.25)',
                                            }}
                                        >
                                            <i className="fa-brands fa-whatsapp text-lg" />
                                            <span>{t('contact.send')}</span>
                                            <span style={{
                                                position: 'absolute', inset: 0,
                                                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
                                                animation: 'shine 3s ease-in-out infinite 2s',
                                                pointerEvents: 'none',
                                            }} />
                                        </button>

                                        {/* Trust */}
                                        <div className="flex items-center justify-center gap-5 pt-1">
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-solid fa-lock text-[9px]" style={{ color: '#34d399' }} />
                                                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'Montserrat', sans-serif" }}>
                                                    {t('form.trustSecure')}
                                                </span>
                                            </div>
                                            <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.08)' }} />
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-solid fa-bolt text-[9px]" style={{ color: '#fbbf24' }} />
                                                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'Montserrat', sans-serif" }}>
                                                    {t('form.trustFast')}
                                                </span>
                                            </div>
                                        </div>

                                        {submitted && (
                                            <div className="flex items-center gap-3 px-5 py-4 rounded-xl animate-in fade-in duration-300"
                                                style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}>
                                                <i className="fa-brands fa-whatsapp text-xl" style={{ color: '#25D366' }} />
                                                <span className="text-sm font-semibold" style={{ color: '#34d399' }}>
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
            <section className="relative overflow-hidden" style={{ height: 'clamp(300px, 38vw, 440px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {business.mapEmbedUrl ? (
                    <iframe
                        src={business.mapEmbedUrl}
                        title="Konum"
                        width="100%"
                        height="100%"
                        style={{ border: 0, position: 'absolute', inset: 0, filter: 'invert(92%) hue-rotate(180deg) brightness(0.9) contrast(0.95) saturate(0.5)' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <div className="text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
                            <i className="fa-solid fa-map-location-dot text-5xl mb-3" />
                            <p className="text-sm font-medium">Harita yükleniyor...</p>
                        </div>
                    </div>
                )}

                {/* Right fade */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'linear-gradient(to left, #020617 0%, rgba(2,6,23,0.6) 25%, transparent 50%)',
                }} />

                {/* Location card — dark glass */}
                <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2" style={{ maxWidth: 260 }}>
                    <div className="rounded-2xl p-5 shadow-2xl" style={{
                        background: 'rgba(8,10,20,0.88)',
                        border: '1px solid rgba(197,160,89,0.15)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                    }}>
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.2)' }}>
                                <i className="fa-solid fa-location-dot text-sm" style={{ color: '#c5a059' }} />
                            </div>
                            <div>
                                <p className="font-bold text-white text-[13px] mb-1 leading-tight"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    {business.name}
                                </p>
                                <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>{business.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: '#34d399' }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                7/24 Açık
                            </span>
                            <a href={`tel:${business.phone}`}
                                className="text-[10px] font-bold hover:opacity-80 transition-opacity"
                                style={{ color: '#c5a059', fontFamily: "'Outfit', sans-serif" }}>
                                {business.phone}
                            </a>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default Iletisim;
