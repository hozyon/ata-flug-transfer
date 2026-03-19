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
        <div className="min-h-screen flex flex-col" style={{ background: '#020617' }}>
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
            <section className="page-banner relative pt-28 pb-14 overflow-hidden flex items-center"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>

                {/* Background photo — muted */}
                <div className="absolute inset-0">
                    <img
                        src="/images/about-custom.jpg"
                        alt="İletişim"
                        className="w-full h-full object-cover"
                        style={{ opacity: 0.12 }}
                    />
                    <div className="absolute inset-0" style={{
                        background: 'linear-gradient(to bottom, #020617 0%, rgba(2,6,23,0.4) 40%, rgba(2,6,23,0.6) 70%, #020617 100%)',
                    }} />
                </div>

                {/* Giant ghost typography */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
                    <span style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(80px, 18vw, 220px)',
                        fontWeight: 700,
                        fontStyle: 'italic',
                        color: 'rgba(197,160,89,0.04)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                    }}>
                        İLETİŞİM
                    </span>
                </div>

                {/* Corner bracket — top left */}
                <div className="absolute top-28 left-6 sm:left-10 pointer-events-none">
                    <div className="w-8 h-px" style={{ background: 'rgba(197,160,89,0.35)' }} />
                    <div className="w-px h-8 mt-0" style={{ background: 'rgba(197,160,89,0.35)' }} />
                </div>
                {/* Corner bracket — top right */}
                <div className="absolute top-28 right-6 sm:right-10 flex flex-col items-end pointer-events-none">
                    <div className="w-8 h-px" style={{ background: 'rgba(197,160,89,0.35)' }} />
                    <div className="w-px h-8" style={{ background: 'rgba(197,160,89,0.35)', marginLeft: 'auto' }} />
                </div>

                <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                        {/* Left: heading */}
                        <div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-6 h-px" style={{ background: '#c5a059' }} />
                                <span className="text-[10px] font-black tracking-[0.3em] uppercase"
                                    style={{ color: '#c5a059', fontFamily: "'Outfit', sans-serif" }}>
                                    {t('contact.eyebrow')}
                                </span>
                            </div>
                            <h1 className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold text-white leading-[1.05] tracking-tight"
                                style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                                {t('contact.title')}
                            </h1>
                        </div>

                        {/* Right: coordinates */}
                        <div className="text-left sm:text-right shrink-0 pb-1">
                            <p className="text-[9px] font-black tracking-[0.25em] uppercase mb-1.5"
                                style={{ color: 'rgba(197,160,89,0.45)', fontFamily: "'Outfit', sans-serif" }}>
                                Antalya · Türkiye
                            </p>
                            <p className="text-[13px] font-mono tracking-widest" style={{ color: 'rgba(255,255,255,0.15)' }}>
                                36.8969° N · 30.7133° E
                            </p>
                            <p className="text-[11px] font-mono tracking-wider mt-1" style={{ color: 'rgba(255,255,255,0.08)' }}>
                                AYT · IATA Airport Code
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CONTACT CHANNELS ───────────────────────────────── */}
            <section style={{ background: '#080b16', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 stagger-children">

                        {/* Phone */}
                        <a href={`tel:${business.phone}`}
                            className="reveal group relative flex items-center gap-5 px-6 py-8 transition-all duration-300 overflow-hidden"
                            style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                                style={{ background: 'linear-gradient(135deg, rgba(197,160,89,0.06) 0%, transparent 70%)' }} />
                            <div className="relative shrink-0">
                                <div className="w-13 h-13 rounded-2xl flex items-center justify-center"
                                    style={{
                                        width: 52, height: 52,
                                        background: 'rgba(197,160,89,0.08)',
                                        border: '1px solid rgba(197,160,89,0.18)',
                                    }}>
                                    <i className="fa-solid fa-phone text-base" style={{ color: '#c5a059' }} />
                                </div>
                                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black"
                                    style={{ background: '#c5a059', color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>
                                    01
                                </span>
                            </div>
                            <div className="relative">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-1"
                                    style={{ color: 'rgba(197,160,89,0.5)', fontFamily: "'Outfit', sans-serif" }}>
                                    {t('faq.phone')}
                                </p>
                                <p className="text-white font-bold text-[15px]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    {business.phone}
                                </p>
                                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                                    7/24 {t('hero.trust.247')}
                                </p>
                            </div>
                        </a>

                        {/* WhatsApp */}
                        <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer"
                            className="reveal group relative flex items-center gap-5 px-6 py-8 transition-all duration-300 overflow-hidden"
                            style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                                style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.06) 0%, transparent 70%)' }} />
                            <div className="relative shrink-0">
                                <div className="w-13 h-13 rounded-2xl flex items-center justify-center"
                                    style={{
                                        width: 52, height: 52,
                                        background: 'rgba(37,211,102,0.08)',
                                        border: '1px solid rgba(37,211,102,0.18)',
                                    }}>
                                    <i className="fa-brands fa-whatsapp text-xl" style={{ color: '#25D366' }} />
                                </div>
                                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black"
                                    style={{ background: '#25D366', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
                                    02
                                </span>
                            </div>
                            <div className="relative">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-1"
                                    style={{ color: 'rgba(37,211,102,0.5)', fontFamily: "'Outfit', sans-serif" }}>
                                    WhatsApp
                                </p>
                                <p className="text-white font-bold text-[15px]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    {t('hero.whatsapp')}
                                </p>
                                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                                    {t('blogPost.avgResponse')}
                                </p>
                            </div>
                        </a>

                        {/* Email */}
                        <a href={`mailto:${business.email}`}
                            className="reveal group relative flex items-center gap-5 px-6 py-8 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                                style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.06) 0%, transparent 70%)' }} />
                            <div className="relative shrink-0">
                                <div className="w-13 h-13 rounded-2xl flex items-center justify-center"
                                    style={{
                                        width: 52, height: 52,
                                        background: 'rgba(56,189,248,0.08)',
                                        border: '1px solid rgba(56,189,248,0.18)',
                                    }}>
                                    <i className="fa-solid fa-envelope text-base" style={{ color: '#38bdf8' }} />
                                </div>
                                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black"
                                    style={{ background: '#38bdf8', color: '#0f172a', fontFamily: "'Outfit', sans-serif" }}>
                                    03
                                </span>
                            </div>
                            <div className="relative">
                                <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-1"
                                    style={{ color: 'rgba(56,189,248,0.5)', fontFamily: "'Outfit', sans-serif" }}>
                                    {t('faq.email')}
                                </p>
                                <p className="text-white font-bold text-[14px] truncate max-w-[200px]"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    {business.email}
                                </p>
                                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                                    {t('form.trustFast')}
                                </p>
                            </div>
                        </a>

                    </div>
                </div>
            </section>

            {/* ── MAIN: LEFT INFO + RIGHT FORM ───────────────────── */}
            <section className="flex-1 py-20 relative overflow-hidden">
                {/* Dot grid */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(197,160,89,0.07) 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                }} />
                {/* Subtle gold radial glow top-right */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none" style={{
                    background: 'radial-gradient(circle at top right, rgba(197,160,89,0.05) 0%, transparent 65%)',
                }} />

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

                            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-white leading-tight mb-5"
                                style={{ fontFamily: "'Playfair Display', serif" }}>
                                {t('contact.formTitle')}
                            </h2>
                            <p className="text-[15px] leading-relaxed mb-10"
                                style={{ color: 'rgba(255,255,255,0.38)', fontFamily: "'Montserrat', sans-serif" }}>
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
                                            <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
                                        <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
                                        <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                            Antalya (AYT) · Gazipaşa (GZP)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider with gold dot */}
                            <div className="my-10 flex items-center gap-4">
                                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c5a059' }} />
                                <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
                            </div>

                            {/* Social row */}
                            <div className="flex items-center gap-2.5">
                                <span className="text-[9px] font-black tracking-[0.2em] uppercase mr-1"
                                    style={{ color: 'rgba(255,255,255,0.2)', fontFamily: "'Outfit', sans-serif" }}>
                                    Sosyal
                                </span>
                                {business.instagram && (
                                    <a href={business.instagram} target="_blank" rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 hover:text-pink-400"
                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.25)' }}>
                                        <i className="fa-brands fa-instagram text-sm" />
                                    </a>
                                )}
                                {business.facebook && (
                                    <a href={business.facebook} target="_blank" rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 hover:text-blue-400"
                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.25)' }}>
                                        <i className="fa-brands fa-facebook-f text-sm" />
                                    </a>
                                )}
                                {business.telegram && (
                                    <a href={business.telegram} target="_blank" rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 hover:text-sky-400"
                                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.25)' }}>
                                        <i className="fa-brands fa-telegram text-sm" />
                                    </a>
                                )}
                                <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 hover:text-emerald-400"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.25)' }}>
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
            <section className="relative overflow-hidden" style={{
                height: 'clamp(320px, 40vw, 460px)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
                {business.mapEmbedUrl ? (
                    <iframe
                        src={business.mapEmbedUrl}
                        title="Konum"
                        width="100%"
                        height="100%"
                        style={{
                            border: 0,
                            position: 'absolute',
                            inset: 0,
                            filter: 'grayscale(75%) brightness(0.55) contrast(1.15) sepia(15%)',
                        }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background: '#080b16' }}>
                        <div className="text-center" style={{ color: 'rgba(255,255,255,0.15)' }}>
                            <i className="fa-solid fa-map-location-dot text-5xl mb-3" />
                            <p className="text-sm font-medium">Harita yükleniyor...</p>
                        </div>
                    </div>
                )}

                {/* Gradient overlay — heavier on left */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'linear-gradient(to right, rgba(2,6,23,0.80) 0%, rgba(2,6,23,0.30) 50%, rgba(2,6,23,0.15) 100%)',
                }} />
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'linear-gradient(to bottom, rgba(2,6,23,0.4) 0%, transparent 30%, transparent 70%, rgba(2,6,23,0.6) 100%)',
                }} />

                {/* Location card */}
                <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2" style={{ maxWidth: 300 }}>
                    <div className="rounded-2xl p-5" style={{
                        background: 'rgba(2,6,23,0.88)',
                        backdropFilter: 'blur(32px)',
                        WebkitBackdropFilter: 'blur(32px)',
                        border: '1px solid rgba(197,160,89,0.18)',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
                    }}>
                        {/* Gold top rule */}
                        <div className="h-px w-full mb-4" style={{
                            background: 'linear-gradient(90deg, #c5a059, rgba(197,160,89,0.2))',
                        }} />
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.2)' }}>
                                <i className="fa-solid fa-location-dot text-sm" style={{ color: '#c5a059' }} />
                            </div>
                            <div>
                                <p className="font-bold text-[13px] text-white mb-1 leading-tight"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    {business.name}
                                </p>
                                <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
                                    {business.address}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-3"
                            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: '#4ade80' }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                7/24 Açık
                            </span>
                            <a href={`tel:${business.phone}`}
                                className="text-[10px] font-bold hover:underline transition-opacity hover:opacity-80"
                                style={{ color: '#c5a059', fontFamily: "'Outfit', sans-serif" }}>
                                {business.phone}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── BOTTOM STRIP ───────────────────────────────────── */}
            <section style={{ background: '#080b16', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                        <div className="flex flex-wrap items-center gap-6 sm:gap-10 stagger-children">
                            <div className="reveal flex items-center gap-3">
                                <i className="fa-solid fa-clock text-sm" style={{ color: '#c5a059' }} />
                                <span className="text-[12px]"
                                    style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Montserrat', sans-serif" }}>
                                    <span className="text-white font-bold">7/24</span> {t('faq.workHours')}
                                </span>
                            </div>
                            <div className="reveal flex items-center gap-3">
                                <i className="fa-solid fa-headset text-sm" style={{ color: '#c5a059' }} />
                                <span className="text-[12px]"
                                    style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Montserrat', sans-serif" }}>
                                    <span className="text-white font-bold">{t('hero.trust.247')}</span> {t('services.card4.title')}
                                </span>
                            </div>
                            <div className="reveal flex items-center gap-3">
                                <i className="fa-solid fa-plane-arrival text-sm" style={{ color: '#c5a059' }} />
                                <span className="text-[12px]"
                                    style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Montserrat', sans-serif" }}>
                                    <span className="text-white font-bold">{t('hero.trust.tracking')}</span>
                                </span>
                            </div>
                        </div>

                        {/* VIP tag */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{
                            background: 'rgba(197,160,89,0.06)',
                            border: '1px solid rgba(197,160,89,0.14)',
                        }}>
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
