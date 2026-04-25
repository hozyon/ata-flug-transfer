import React, { useState } from 'react';
import { SiteContent } from '../../../types';

interface SEOViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    _confirmAction: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

type PageKey = 'home' | 'about' | 'regions' | 'blog' | 'faq' | 'contact';

const PAGE_LABELS: Record<PageKey, { label: string; icon: string; url: string }> = {
    home:    { label: 'Ana Sayfa',   icon: 'fa-house',             url: '/' },
    about:   { label: 'Hakkımızda', icon: 'fa-info-circle',       url: '/hakkimizda' },
    regions: { label: 'Bölgeler',   icon: 'fa-map-location-dot',  url: '/bolgeler' },
    blog:    { label: 'Blog',        icon: 'fa-newspaper',         url: '/blog' },
    faq:     { label: 'S.S.S',       icon: 'fa-circle-question',   url: '/sss' },
    contact: { label: 'İletişim',   icon: 'fa-headset',           url: '/iletisim' },
};

const ROBOTS_OPTIONS = [
    { value: 'index, follow',     label: 'index, follow — Normal (Önerilen)' },
    { value: 'noindex, follow',   label: 'noindex, follow — İndeksleme Yok' },
    { value: 'index, nofollow',   label: 'index, nofollow — Link Takibi Yok' },
    { value: 'noindex, nofollow', label: 'noindex, nofollow — Tamamen Gizle' },
];

const BUSINESS_TYPES = [
    'TravelAgency', 'LocalBusiness', 'TransportationService', 'TaxiService', 'LimousinService',
];

// ── Shared input styles ──
const fieldClass = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/20 transition-all";
const labelClass = "block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5";
const helpClass  = "text-[10px] text-slate-600 mt-1";

// ── Character counter ──
const CharCounter: React.FC<{ value: string; max: number }> = ({ value, max }) => {
    const len = value.length;
    const color = len > max ? 'text-red-400' : len > max * 0.85 ? 'text-amber-400' : 'text-slate-500';
    return <span className={`text-[10px] font-mono ${color}`}>{len}/{max}</span>;
};

// ── Score badge ──
const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
    return (
        <div className="flex items-center gap-2">
            <div className="relative w-12 h-12">
                <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/>
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="3" strokeDasharray={`${score} 100`} strokeLinecap="round"/>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">{score}</span>
            </div>
            <div>
                <p className={`text-sm font-bold ${score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{score >= 80 ? 'İyi' : score >= 50 ? 'Orta' : 'Zayıf'}</p>
                <p className="text-[10px] text-slate-500">SEO Skoru</p>
            </div>
        </div>
    );
};

export const SEOView: React.FC<SEOViewProps> = ({ editContent, setEditContent, _confirmAction }) => {
    const [activePage, setActivePage] = useState<PageKey>('home');
    const [urlErrors, setUrlErrors] = useState<Record<string, string>>({});
    const seo = editContent.seo;

    const validateUrl = (field: string, value: string) => {
        if (!value) { setUrlErrors(prev => { const n = {...prev}; delete n[field]; return n; }); return; }
        try { new URL(value); setUrlErrors(prev => { const n = {...prev}; delete n[field]; return n; }); }
        catch { setUrlErrors(prev => ({...prev, [field]: 'Geçersiz URL formatı'})); }
    };

    const updateSeo = (patch: Partial<typeof seo>) => {
        setEditContent({ ...editContent, seo: { ...seo, ...patch } });
    };

    const updateStructuredData = (patch: Partial<typeof seo.structuredData>) => {
        setEditContent({ ...editContent, seo: { ...seo, structuredData: { ...seo.structuredData, ...patch } } });
    };

    const updatePageSeo = (page: PageKey, patch: Partial<{ title: string; description: string; keywords: string }>) => {
        setEditContent({ ...editContent, seo: { ...seo, pagesSeo: { ...seo.pagesSeo, [page]: { ...seo.pagesSeo[page], ...patch } } } });
    };

    // Calculate SEO score (max 100)
    const calcScore = (): number => {
        let score = 0;
        if (seo.siteTitle.length > 10) score += 10;
        if (seo.siteDescription.length > 50) score += 15;
        if (seo.siteKeywords.length > 5) score += 10;
        if (seo.canonicalUrl.startsWith('https')) score += 10;
        if (seo.ogImage.startsWith('http')) score += 10;
        if (seo.twitterHandle) score += 5;
        if (seo.structuredData.areaServed) score += 5;
        if (seo.structuredData.latitude && seo.structuredData.longitude) score += 5;
        const pageFilled = Object.values(seo.pagesSeo).filter(p => p.title && p.description).length;
        score += Math.floor((pageFilled / 6) * 30);
        return Math.min(score, 100);
    };

    const score = calcScore();

    // SEO checks list
    const checks = [
        { ok: seo.siteTitle.length >= 30 && seo.siteTitle.length <= 60, label: 'Site başlığı 30-60 karakter' },
        { ok: seo.siteDescription.length >= 120 && seo.siteDescription.length <= 160, label: 'Meta açıklama 120-160 karakter' },
        { ok: seo.siteKeywords.split(',').length >= 5, label: 'En az 5 anahtar kelime' },
        { ok: seo.canonicalUrl.startsWith('https'), label: 'HTTPS canonical URL' },
        { ok: seo.ogImage.startsWith('http'), label: 'Open Graph görseli' },
        { ok: !!seo.twitterHandle, label: 'Twitter/X hesabı tanımlı' },
        { ok: Object.values(seo.pagesSeo).every(p => p.title && p.description), label: 'Tüm sayfa SEO\'ları dolu' },
        { ok: !!seo.structuredData.latitude && !!seo.structuredData.longitude, label: 'Coğrafi koordinatlar' },
    ];

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">

            {/* ── Score Header ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 bg-gradient-to-br from-[var(--color-primary)]/10 to-amber-900/5 border border-[var(--color-primary)]/15 rounded-2xl p-5 flex items-center gap-4">
                    <ScoreBadge score={score} />
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Kontrol Listesi</p>
                        <div className="space-y-1">
                            {checks.slice(0, 4).map((c, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <i className={`fa-solid ${c.ok ? 'fa-circle-check text-emerald-400' : 'fa-circle-xmark text-red-400'} text-[10px]`} />
                                    <span className={`text-[10px] truncate ${c.ok ? 'text-slate-400' : 'text-slate-500'}`}>{c.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Başlık', value: seo.siteTitle ? '✓' : '✗', ok: !!seo.siteTitle, sub: `${seo.siteTitle.length} karakter` },
                        { label: 'Açıklama', value: seo.siteDescription ? '✓' : '✗', ok: !!seo.siteDescription, sub: `${seo.siteDescription.length} karakter` },
                        { label: 'Sayfalar', value: `${Object.values(seo.pagesSeo).filter(p => p.title).length}/6`, ok: Object.values(seo.pagesSeo).every(p => !!p.title), sub: 'doldurulmuş' },
                        { label: 'Schema', value: seo.structuredData.businessType ? '✓' : '✗', ok: !!seo.structuredData.businessType, sub: seo.structuredData.businessType },
                    ].map((s, i) => (
                        <div key={i} className={`rounded-2xl p-4 border ${s.ok ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-red-500/5 border-red-500/15'}`}>
                            <p className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">{s.label}</p>
                            <p className={`text-2xl font-black font-outfit mt-1 ${s.ok ? 'text-emerald-400' : 'text-red-400'}`}>{s.value}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 truncate">{s.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Global SEO ── */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                    <i className="fa-solid fa-globe text-[var(--color-primary)] text-sm" />
                    <span className="text-sm font-bold font-outfit text-white">Global SEO Ayarları</span>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Site Title */}
                    <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-1.5">
                            <label className={labelClass}>Site Başlığı (Ana Sayfa)</label>
                            <CharCounter value={seo.siteTitle} max={60} />
                        </div>
                        <input type="text" value={seo.siteTitle} onChange={e => updateSeo({ siteTitle: e.target.value })}
                            placeholder="Ata Flug Transfer | Antalya VIP Havalimanı Transfer" className={fieldClass} />
                        <p className={helpClass}>Google arama sonuçlarında görünen ana başlık. 50-60 karakter ideal.</p>
                    </div>

                    {/* Title Template */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className={labelClass}>Başlık Şablonu (Alt Sayfalar)</label>
                        </div>
                        <input type="text" value={seo.titleTemplate} onChange={e => updateSeo({ titleTemplate: e.target.value })}
                            placeholder="%s | Ata Flug Transfer" className={fieldClass} />
                        <p className={helpClass}>%s yerine sayfa adı gelir. Örn: "Blog | Ata Flug Transfer"</p>
                    </div>

                    {/* Canonical URL */}
                    <div>
                        <label className={labelClass}>Canonical URL (Alan Adı)</label>
                        <input type="url" value={seo.canonicalUrl} onChange={e => updateSeo({ canonicalUrl: e.target.value })}
                            onBlur={e => validateUrl('canonical', e.target.value)}
                            placeholder="https://ataflugtransfer.com" className={`${fieldClass} ${urlErrors.canonical ? 'border-red-500 focus:border-red-500' : ''}`} />
                        {urlErrors.canonical && <p className="text-[10px] text-red-400 mt-1">{urlErrors.canonical}</p>}
                        <p className={helpClass}>Sitenizin ana adresi. https ile başlamalı.</p>
                    </div>

                    {/* Meta Description */}
                    <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-1.5">
                            <label className={labelClass}>Varsayılan Meta Açıklama</label>
                            <CharCounter value={seo.siteDescription} max={160} />
                        </div>
                        <textarea rows={3} value={seo.siteDescription} onChange={e => updateSeo({ siteDescription: e.target.value })}
                            placeholder="Antalya Havalimanı'ndan tüm Türkiye'ye VIP transfer..." className={`${fieldClass} resize-none`} />
                        <p className={helpClass}>Arama sonuçlarında başlığın altında görünen açıklama. 120-160 karakter ideal.</p>
                    </div>

                    {/* Keywords */}
                    <div className="md:col-span-2">
                        <label className={labelClass}>Anahtar Kelimeler</label>
                        <input type="text" value={seo.siteKeywords} onChange={e => updateSeo({ siteKeywords: e.target.value })}
                            placeholder="antalya transfer, vip transfer, havalimanı transfer..." className={fieldClass} />
                        <p className={helpClass}>Virgülle ayırın. Google meta keywords'ü dikkate almaz ama diğer motorlar için faydalıdır.</p>
                    </div>

                    {/* Robots */}
                    <div>
                        <label className={labelClass}>Robots Direktifi</label>
                        <select value={seo.robotsDirective} onChange={e => updateSeo({ robotsDirective: e.target.value })}
                            className={`${fieldClass} cursor-pointer`}>
                            {ROBOTS_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>)}
                        </select>
                        <p className={helpClass}>Arama motorlarının sitenizi nasıl işleyeceği.</p>
                    </div>

                    {/* Twitter Handle */}
                    <div>
                        <label className={labelClass}>Twitter / X Hesabı</label>
                        <input type="text" value={seo.twitterHandle} onChange={e => updateSeo({ twitterHandle: e.target.value })}
                            placeholder="@ataflugtransfer" className={fieldClass} />
                        <p className={helpClass}>Twitter Card meta etiketleri için.</p>
                    </div>
                </div>
            </div>

            {/* ── OG Image ── */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                    <i className="fa-brands fa-facebook text-[var(--color-primary)] text-sm" />
                    <span className="text-sm font-bold font-outfit text-white">Open Graph & Sosyal Medya Paylaşımı</span>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                        <label className={labelClass}>Varsayılan OG Görseli (URL)</label>
                        <input type="url" value={seo.ogImage} onChange={e => updateSeo({ ogImage: e.target.value })}
                            onBlur={e => validateUrl('ogImage', e.target.value)}
                            placeholder="https://ataflugtransfer.com/og-image.jpg" className={`${fieldClass} ${urlErrors.ogImage ? 'border-red-500 focus:border-red-500' : ''}`} />
                        {urlErrors.ogImage && <p className="text-[10px] text-red-400 mt-1">{urlErrors.ogImage}</p>}
                        <p className={helpClass}>Facebook, Twitter, WhatsApp paylaşımlarında görünür. 1200×630px önerilen boyut.</p>
                    </div>
                    {seo.ogImage && seo.ogImage.startsWith('http') && (
                        <div className="md:col-span-2">
                            <p className={labelClass}>Önizleme</p>
                            <div className="rounded-xl overflow-hidden border border-white/[0.08] w-full max-w-sm">
                                <img src={seo.ogImage} alt="OG Preview" className="w-full h-40 object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                                <div className="p-3 bg-slate-800/60">
                                    <p className="text-[10px] text-slate-500 uppercase">{seo.canonicalUrl.replace('https://', '').replace('http://', '')}</p>
                                    <p className="text-sm font-bold text-white truncate">{seo.siteTitle}</p>
                                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{seo.siteDescription}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Verification ── */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                    <i className="fa-brands fa-google text-[var(--color-primary)] text-sm" />
                    <span className="text-sm font-bold font-outfit text-white">Arama Motoru Doğrulama</span>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClass}>Google Search Console Doğrulama</label>
                        <input type="text" value={seo.googleSiteVerification} onChange={e => updateSeo({ googleSiteVerification: e.target.value })}
                            placeholder="abc123xyz..." className={fieldClass} />
                        <p className={helpClass}>Google Search Console → Doğrulama → Meta tag içindeki content değeri.</p>
                    </div>
                    <div>
                        <label className={labelClass}>Bing Webmaster Doğrulama</label>
                        <input type="text" value={seo.bingVerification} onChange={e => updateSeo({ bingVerification: e.target.value })}
                            placeholder="abc123xyz..." className={fieldClass} />
                        <p className={helpClass}>Bing Webmaster Tools'dan alınan doğrulama kodu.</p>
                    </div>
                    <div className="md:col-span-2 p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                        <p className="text-[11px] text-blue-400 font-semibold mb-1"><i className="fa-solid fa-circle-info mr-1.5"/>Doğrulama Nasıl Yapılır?</p>
                        <p className="text-[10px] text-slate-500">1. Google Search Console'a gidin → Mülk ekle → HTML tag seçin → content="<b>bu kodu kopyalayın</b>"</p>
                        <p className="text-[10px] text-slate-500 mt-1">2. Buraya yapıştırın → Kaydet. Site yayınlandığında Google otomatik doğrulayacak.</p>
                    </div>
                </div>
            </div>

            {/* ── Structured Data ── */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                    <i className="fa-solid fa-code text-[var(--color-primary)] text-sm" />
                    <span className="text-sm font-bold font-outfit text-white">Yapısal Veri (JSON-LD / Schema.org)</span>
                    <span className="ml-auto text-[9px] font-bold bg-emerald-500/15 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">Rich Results</span>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                        <label className={labelClass}>İşletme Türü</label>
                        <select value={seo.structuredData.businessType} onChange={e => updateStructuredData({ businessType: e.target.value })}
                            className={`${fieldClass} cursor-pointer`}>
                            {BUSINESS_TYPES.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                        </select>
                        <p className={helpClass}>Schema.org işletme kategorisi.</p>
                    </div>
                    <div>
                        <label className={labelClass}>Fiyat Aralığı</label>
                        <select value={seo.structuredData.priceRange} onChange={e => updateStructuredData({ priceRange: e.target.value })}
                            className={`${fieldClass} cursor-pointer`}>
                            {['€', '€€', '€€€', '€€€€'].map(p => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
                        </select>
                        <p className={helpClass}>Google'da fiyat aralığı göstergesi.</p>
                    </div>
                    <div>
                        <label className={labelClass}>Çalışma Saatleri</label>
                        <input type="text" value={seo.structuredData.openingHours} onChange={e => updateStructuredData({ openingHours: e.target.value })}
                            placeholder="Mo-Su 00:00-24:00" className={fieldClass} />
                        <p className={helpClass}>Schema formatı: Mo-Su 09:00-18:00</p>
                    </div>
                    <div>
                        <label className={labelClass}>Hizmet Bölgesi</label>
                        <input type="text" value={seo.structuredData.areaServed} onChange={e => updateStructuredData({ areaServed: e.target.value })}
                            placeholder="Antalya, Turkey" className={fieldClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Enlem (Latitude)</label>
                        <input type="text" value={seo.structuredData.latitude} onChange={e => updateStructuredData({ latitude: e.target.value })}
                            placeholder="36.8841" className={fieldClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Boylam (Longitude)</label>
                        <input type="text" value={seo.structuredData.longitude} onChange={e => updateStructuredData({ longitude: e.target.value })}
                            placeholder="30.7056" className={fieldClass} />
                    </div>

                    {/* JSON-LD Preview */}
                    <div className="md:col-span-2 lg:col-span-3">
                        <label className={labelClass}>Oluşturulan JSON-LD Önizleme</label>
                        <pre className="bg-black/40 border border-white/[0.06] rounded-xl p-4 text-[10px] text-emerald-400 overflow-x-auto overflow-y-auto max-h-[300px] font-mono leading-relaxed">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": seo.structuredData.businessType,
  "name": editContent.business.name,
  "url": seo.canonicalUrl,
  "telephone": editContent.business.phone,
  "email": editContent.business.email,
  "address": { "@type": "PostalAddress", "addressLocality": "Antalya", "addressCountry": "TR", "streetAddress": editContent.business.address },
  "geo": { "@type": "GeoCoordinates", "latitude": seo.structuredData.latitude, "longitude": seo.structuredData.longitude },
  "priceRange": seo.structuredData.priceRange,
  "openingHours": seo.structuredData.openingHours,
  "areaServed": seo.structuredData.areaServed,
}, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>

            {/* ── Per-Page SEO ── */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                    <i className="fa-solid fa-file-lines text-[var(--color-primary)] text-sm" />
                    <span className="text-sm font-bold font-outfit text-white">Sayfa Bazlı SEO</span>
                </div>

                {/* Page Tabs */}
                <div className="flex gap-1 px-4 pt-4 pb-0 overflow-x-auto scrollbar-hide">
                    {(Object.keys(PAGE_LABELS) as PageKey[]).map(key => {
                        const pg = seo.pagesSeo[key];
                        const filled = pg.title && pg.description;
                        return (
                            <button
                                key={key}
                                onClick={() => setActivePage(key)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-[12px] font-bold whitespace-nowrap transition-all border-b-2 shrink-0
                                    ${activePage === key
                                        ? 'text-[var(--color-primary)] border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                                        : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                            >
                                <i className={`fa-solid ${PAGE_LABELS[key].icon} text-[10px]`} />
                                {PAGE_LABELS[key].label}
                                <span className={`w-1.5 h-1.5 rounded-full ${filled ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            </button>
                        );
                    })}
                </div>

                <div className="p-5 space-y-4 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <i className="fa-solid fa-link" />
                        <span>URL: <span className="text-slate-400 font-mono">{seo.canonicalUrl}{PAGE_LABELS[activePage].url}</span></span>
                    </div>

                    {/* Title */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className={labelClass}>Sayfa Başlığı (Title)</label>
                            <CharCounter value={seo.pagesSeo[activePage].title} max={60} />
                        </div>
                        <input
                            type="text"
                            value={seo.pagesSeo[activePage].title}
                            onChange={e => updatePageSeo(activePage, { title: e.target.value })}
                            placeholder={`${PAGE_LABELS[activePage].label} başlığı...`}
                            className={fieldClass}
                        />
                        <p className={helpClass}>Tarayıcı sekmesinde ve Google'da görünür. 50-60 karakter ideal.</p>
                        {seo.pagesSeo[activePage].title && (
                            <div className="mt-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                                <p className="text-[10px] text-slate-500 mb-1">Google Önizleme</p>
                                <p className="text-blue-400 text-sm font-medium truncate">{seo.titleTemplate.replace('%s', seo.pagesSeo[activePage].title)}</p>
                                <p className="text-green-600 text-[11px]">{seo.canonicalUrl}{PAGE_LABELS[activePage].url}</p>
                                <p className="text-slate-400 text-[11px] line-clamp-2 mt-0.5">{seo.pagesSeo[activePage].description || seo.siteDescription}</p>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className={labelClass}>Meta Açıklama</label>
                            <CharCounter value={seo.pagesSeo[activePage].description} max={160} />
                        </div>
                        <textarea
                            rows={3}
                            value={seo.pagesSeo[activePage].description}
                            onChange={e => updatePageSeo(activePage, { description: e.target.value })}
                            placeholder="Bu sayfa için açıklama..."
                            className={`${fieldClass} resize-none`}
                        />
                        <p className={helpClass}>Arama sonuçlarında snippet olarak görünür. 120-160 karakter ideal.</p>
                    </div>

                    {/* Keywords */}
                    <div>
                        <label className={labelClass}>Sayfa Anahtar Kelimeleri</label>
                        <input
                            type="text"
                            value={seo.pagesSeo[activePage].keywords}
                            onChange={e => updatePageSeo(activePage, { keywords: e.target.value })}
                            placeholder="anahtar kelime1, anahtar kelime2..."
                            className={fieldClass}
                        />
                        <p className={helpClass}>Bu sayfaya özel anahtar kelimeler, virgülle ayırın.</p>
                    </div>
                </div>
            </div>

            {/* ── Checklist ── */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
                    <i className="fa-solid fa-list-check text-[var(--color-primary)] text-sm" />
                    <span className="text-sm font-bold font-outfit text-white">SEO Kontrol Listesi</span>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {checks.map((c, i) => (
                        <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${c.ok ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-red-500/5 border-red-500/15'}`}>
                            <i className={`fa-solid ${c.ok ? 'fa-circle-check text-emerald-400' : 'fa-circle-xmark text-red-400'} text-sm`} />
                            <span className={`text-[12px] font-medium ${c.ok ? 'text-slate-300' : 'text-slate-400'}`}>{c.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Sitemap info ── */}
            <div className="bg-blue-500/5 border border-blue-500/15 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                    <i className="fa-solid fa-circle-info text-blue-400 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-blue-300 mb-1">Sitemap & Robots.txt</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            Sitemap dosyası <span className="text-slate-400 font-mono">/sitemap.xml</span> adresinde otomatik oluşturulmuştur.
                            Robots.txt dosyası <span className="text-slate-400 font-mono">/robots.txt</span> adresinde hazırdır.
                            Google Search Console'a sitenizi ekledikten sonra sitemap adresini girin.
                        </p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer"
                                className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                                <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" /> /sitemap.xml
                            </a>
                            <span className="text-slate-700">•</span>
                            <a href="/robots.txt" target="_blank" rel="noopener noreferrer"
                                className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                                <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" /> /robots.txt
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SEOView;
