import React, { useRef, useState } from 'react';
import { SiteContent } from '../../../types';

const PALETTES = [
    { name: 'Gold Prestige', primary: '#c5a059', dark: '#0f172a', deeper: '#020617' },
    { name: 'Ocean Pro',     primary: '#0ea5e9', dark: '#0c1829', deeper: '#040d1a' },
    { name: 'Emerald',       primary: '#10b981', dark: '#0a1f18', deeper: '#030f0c' },
    { name: 'Royal Indigo',  primary: '#6366f1', dark: '#12103a', deeper: '#080520' },
    { name: 'Violet',        primary: '#8b5cf6', dark: '#180f2a', deeper: '#0c0619' },
    { name: 'Rose Bold',     primary: '#f43f5e', dark: '#1e0f15', deeper: '#0d0609' },
    { name: 'Amber Warm',    primary: '#f59e0b', dark: '#1c1307', deeper: '#0d0804' },
    { name: 'Teal Premium',  primary: '#14b8a6', dark: '#0c1e1d', deeper: '#030f0e' },
    { name: 'Slate Minimal', primary: '#94a3b8', dark: '#0f172a', deeper: '#020617' },
    { name: 'Crimson Power', primary: '#ef4444', dark: '#1c0a0a', deeper: '#0d0404' },
] as const;

interface BusinessSettingsViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    _confirmAction: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

const INPUT_CLS =
    'bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 outline-none transition-colors w-full';

const LABEL_CLS = 'block text-[10px] font-bold font-outfit uppercase tracking-wider text-slate-500 mb-1.5';

const isValidEmail = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPhone = (v: string) => !v || /^\+?[\d\s\-()]{7,20}$/.test(v);
const _isValidUrl = (v: string) => { if (!v) return true; try { new URL(v); return true; } catch { return false; } };

export const BusinessSettingsView: React.FC<BusinessSettingsViewProps> = ({ editContent, setEditContent, _confirmAction }) => {
    const [logoDragOver, setLogoDragOver] = useState(false);
    const [faviconDragOver, setFaviconDragOver] = useState(false);
    const [colorsOpen, setColorsOpen] = useState(false);

    const mapRef = useRef<HTMLDivElement>(null);
    const socialRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    const biz = editContent.business;
    const brand = editContent.branding;

    // Completion tracking
    const fields = [biz.name, biz.phone, biz.email, biz.address, biz.whatsapp, biz.telegram, biz.instagram, biz.facebook, biz.mapEmbedUrl];
    const filled = fields.filter(v => v && v.trim().length > 0).length;
    const total = fields.length;
    const percent = Math.round((filled / total) * 100);

    const socialFilled = [biz.whatsapp, biz.telegram, biz.instagram, biz.facebook].filter(v => v?.trim()).length;

    // Helpers
    const setBiz = (partial: Partial<typeof biz>) =>
        setEditContent({ ...editContent, business: { ...biz, ...partial } });

    const setBrand = (partial: Partial<NonNullable<typeof brand>>) =>
        setEditContent({
            ...editContent,
            branding: { primaryColor: '#c5a059', darkBg: '#0f172a', darkBgDeep: '#020617', ...brand, ...partial },
        });

    const readFile = (file: File, onResult: (dataUrl: string) => void) => {
        if (file.size > 2 * 1024 * 1024) {
            alert('Dosya 2MB sınırını aşıyor. Lütfen daha küçük bir dosya seçin.');
            return;
        }
        const r = new FileReader();
        r.onloadend = () => onResult(r.result as string);
        r.readAsDataURL(file);
    };

    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Completion segment labels
    const segments = [
        { label: 'İşletme', keys: ['name', 'phone', 'email', 'address'] as const },
        { label: 'İletişim', keys: ['whatsapp', 'telegram'] as const },
        { label: 'Sosyal', keys: ['instagram', 'facebook'] as const },
        { label: 'Harita', keys: ['mapEmbedUrl'] as const },
    ];

    const segPercent = (keys: readonly (keyof typeof biz)[]) => {
        const f = keys.filter(k => (biz as any)[k]?.trim()).length;
        return Math.round((f / keys.length) * 100);
    };

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-6 pb-8">

            {/* ── Completion Banner ─────────────────────────────── */}
            <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl px-6 py-5 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-md ${percent === 100 ? 'bg-emerald-500' : percent >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}>
                            <i className={`fa-solid ${percent === 100 ? 'fa-circle-check' : 'fa-circle-half-stroke'} text-white text-xs`}></i>
                        </div>
                        <div>
                            <p className="text-xs font-bold font-outfit text-white leading-tight">Profil Tamamlanma</p>
                            <p className="text-[10px] text-slate-500">{filled} / {total} alan dolduruldu</p>
                        </div>
                    </div>
                    <span className={`text-3xl font-black font-outfit tabular-nums ${percent === 100 ? 'text-emerald-400' : percent >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                        {percent}%
                    </span>
                </div>

                {/* Segmented bar */}
                <div className="space-y-2.5">
                    <div className="flex gap-1.5">
                        {segments.map((seg, i) => {
                            const sp = segPercent(seg.keys as any);
                            return (
                                <div key={i} className="flex-1">
                                    <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${sp === 100 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : sp > 0 ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-transparent'}`}
                                            style={{ width: `${sp}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex gap-1.5">
                        {segments.map((seg, i) => {
                            const sp = segPercent(seg.keys as any);
                            return (
                                <div key={i} className="flex-1 text-center">
                                    <span className={`text-[9px] font-bold font-outfit ${sp === 100 ? 'text-emerald-400' : sp > 0 ? 'text-amber-400' : 'text-slate-600'}`}>
                                        {seg.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Stats Row ──────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* eslint-disable react-hooks/refs -- refs used only in onClick handlers, not during render */}
                {[
                    {
                        label: 'Doldurulmuş',
                        value: `${filled}/${total}`,
                        sub: percent === 100 ? 'Tam' : `${total - filled} eksik`,
                        icon: 'fa-circle-check',
                        color: percent === 100 ? 'bg-emerald-500' : 'bg-amber-500',
                        glow: percent === 100 ? 'shadow-emerald-500/20' : 'shadow-amber-500/20',
                        gradient: percent === 100 ? 'from-emerald-500/10 to-transparent' : 'from-amber-500/10 to-transparent',
                        border: percent === 100 ? 'border-emerald-500/15' : 'border-amber-500/15',
                        onClick: undefined,
                    },
                    {
                        label: 'Sosyal Medya',
                        value: `${socialFilled}/4`,
                        sub: socialFilled === 4 ? 'Tümü aktif' : `${4 - socialFilled} bağlantı eksik`,
                        icon: 'fa-share-nodes',
                        color: 'bg-violet-500',
                        glow: 'shadow-violet-500/20',
                        gradient: 'from-violet-500/10 to-transparent',
                        border: 'border-violet-500/15',
                        onClick: () => scrollTo(socialRef),
                    },
                    {
                        label: 'Harita',
                        value: biz.mapEmbedUrl?.trim() ? 'Aktif' : 'Pasif',
                        sub: biz.mapEmbedUrl?.trim() ? 'Embed URL mevcut' : 'URL girilmedi',
                        icon: 'fa-map-location-dot',
                        color: biz.mapEmbedUrl?.trim() ? 'bg-emerald-500' : 'bg-red-500',
                        glow: biz.mapEmbedUrl?.trim() ? 'shadow-emerald-500/20' : 'shadow-red-500/20',
                        gradient: biz.mapEmbedUrl?.trim() ? 'from-emerald-500/10 to-transparent' : 'from-red-500/10 to-transparent',
                        border: biz.mapEmbedUrl?.trim() ? 'border-emerald-500/15' : 'border-red-500/15',
                        onClick: () => scrollTo(mapRef),
                    },
                    {
                        label: 'Logo',
                        value: biz.logo?.trim() ? 'Yüklendi' : 'Yok',
                        sub: biz.logo?.trim() ? (biz.logo.startsWith('data:') ? 'Base64 dosya' : 'URL bağlantısı') : 'Henüz eklenmedi',
                        icon: 'fa-image',
                        color: biz.logo?.trim() ? 'bg-sky-500' : 'bg-slate-600',
                        glow: 'shadow-sky-500/20',
                        gradient: biz.logo?.trim() ? 'from-sky-500/10 to-transparent' : 'from-slate-600/10 to-transparent',
                        border: biz.logo?.trim() ? 'border-sky-500/15' : 'border-slate-600/15',
                        onClick: () => scrollTo(logoRef),
                    },
                ].map((s, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={s.onClick}
                        className={`text-left p-4 rounded-2xl bg-gradient-to-br ${s.gradient} border ${s.border} animate-in slide-in-from-bottom-2 duration-300 ${s.onClick ? 'cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all' : 'cursor-default'}`}
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="text-[9px] font-black font-outfit text-slate-500 uppercase tracking-[0.2em] truncate">{s.label}</p>
                                <p className="text-xl font-black font-outfit text-white mt-1 leading-none">{s.value}</p>
                                <p className="text-[10px] text-slate-600 mt-1 truncate">{s.sub}</p>
                            </div>
                            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center shrink-0 shadow-lg ${s.glow}`}>
                                <i className={`fa-solid ${s.icon} text-white text-xs`}></i>
                            </div>
                        </div>
                        {s.onClick && (
                            <div className="mt-2.5 flex items-center gap-1 text-[9px] text-slate-600">
                                <i className="fa-solid fa-arrow-down text-[8px]"></i>
                                <span>Bölüme git</span>
                            </div>
                        )}
                    </button>
                ))}
                {/* eslint-enable react-hooks/refs */}
            </div>

            {/* ── Logo ───────────────────────────────────────────── */}
            <div ref={logoRef} className="bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center shadow-lg shadow-sky-600/25">
                        <i className="fa-solid fa-image text-white text-sm"></i>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold font-outfit text-white">Site Logosu</h3>
                        <p className="text-[10px] text-slate-500">Şeffaf PNG · SVG önerilir</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${biz.logo?.trim() ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]' : 'bg-red-500'}`} />
                        <span className={`text-[10px] font-bold ${biz.logo?.trim() ? 'text-emerald-400' : 'text-red-400'}`}>
                            {biz.logo?.trim() ? 'Aktif' : 'Yok'}
                        </span>
                    </div>
                </div>

                <div className="p-6 flex flex-col sm:flex-row gap-6">
                    {/* Preview */}
                    <div className="shrink-0 flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center overflow-hidden">
                            <img
                                src={biz.logo || '/logo.png'}
                                alt="Logo"
                                className="max-w-[75%] max-h-[75%] object-contain"
                                onError={e => { (e.currentTarget as HTMLImageElement).src = '/logo.png'; }}
                            />
                        </div>
                        <span className="text-[9px] text-slate-600 font-outfit">Önizleme</span>
                    </div>

                    {/* Upload zone + URL input */}
                    <div className="flex-1 space-y-3">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="logo-upload"
                            onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) readFile(f, url => setBiz({ logo: url }));
                            }}
                        />
                        {/* Drag zone */}
                        <label
                            htmlFor="logo-upload"
                            onDragOver={e => { e.preventDefault(); setLogoDragOver(true); }}
                            onDragLeave={() => setLogoDragOver(false)}
                            onDrop={e => {
                                e.preventDefault();
                                setLogoDragOver(false);
                                const f = e.dataTransfer.files?.[0];
                                if (f) readFile(f, url => setBiz({ logo: url }));
                            }}
                            className={`flex flex-col items-center justify-center gap-2 py-5 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                                logoDragOver
                                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${logoDragOver ? 'bg-[var(--color-primary)]' : 'bg-white/[0.06]'}`}>
                                <i className={`fa-solid fa-cloud-arrow-up text-sm ${logoDragOver ? 'text-white' : 'text-slate-500'}`}></i>
                            </div>
                            <div className="text-center">
                                <p className={`text-xs font-bold transition-colors ${logoDragOver ? 'text-[var(--color-primary)]' : 'text-slate-400'}`}>
                                    {logoDragOver ? 'Bırakın, yüklensin!' : 'Tıklayın veya sürükleyin'}
                                </p>
                                <p className="text-[10px] text-slate-600 mt-0.5">PNG, SVG, WebP · Maks 2 MB</p>
                            </div>
                        </label>

                        {/* URL input */}
                        <div>
                            <label className={LABEL_CLS}>
                                <i className="fa-solid fa-link text-[8px] mr-1"></i>URL ile yükle
                            </label>
                            <input
                                className={INPUT_CLS}
                                value={biz.logo?.startsWith('data:') ? 'Yüklendi (Base64 dosya)' : biz.logo || ''}
                                onChange={e => setBiz({ logo: e.target.value })}
                                placeholder="https://example.com/logo.png"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Business Info ──────────────────────────────────── */}
            <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <i className="fa-solid fa-building text-white text-sm"></i>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold font-outfit text-white">İşletme Bilgileri</h3>
                        <p className="text-[10px] text-slate-500">İletişim ve kimlik bilgileri</p>
                    </div>
                    <div className="ml-auto">
                        {(() => {
                            const bizFields = [biz.name, biz.phone, biz.email, biz.address];
                            const f = bizFields.filter(v => v?.trim()).length;
                            return (
                                <span className={`text-[10px] font-bold ${f === 4 ? 'text-emerald-400' : 'text-amber-400'}`}>{f}/4</span>
                            );
                        })()}
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Row 1: Name + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={LABEL_CLS}>
                                <i className="fa-solid fa-signature text-[var(--color-primary)] text-[8px] mr-1.5"></i>
                                İşletme Adı
                            </label>
                            <div className="relative">
                                <input
                                    className={INPUT_CLS}
                                    value={biz.name || ''}
                                    onChange={e => setBiz({ name: e.target.value })}
                                    placeholder="Ata Flug Transfer"
                                />
                                {biz.name?.trim() && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                                )}
                            </div>
                        </div>
                        <div>
                            <label className={LABEL_CLS}>
                                <i className="fa-solid fa-phone text-green-400 text-[8px] mr-1.5"></i>
                                Telefon
                            </label>
                            <div className="relative">
                                <input
                                    className={`${INPUT_CLS} ${biz.phone && !isValidPhone(biz.phone) ? '!border-red-500/60 focus:!border-red-500' : biz.phone && isValidPhone(biz.phone) ? '!border-emerald-500/40' : ''}`}
                                    value={biz.phone || ''}
                                    onChange={e => setBiz({ phone: e.target.value })}
                                    placeholder="+90 505 000 00 00"
                                    type="tel"
                                />
                                {biz.phone?.trim() && (
                                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${isValidPhone(biz.phone) ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-red-400'}`} />
                                )}
                            </div>
                            {biz.phone && !isValidPhone(biz.phone) && (
                                <p className="mt-1 text-[10px] text-red-400">Geçerli bir telefon numarası girin</p>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Email + WhatsApp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={LABEL_CLS}>
                                <i className="fa-solid fa-envelope text-sky-400 text-[8px] mr-1.5"></i>
                                E-posta
                            </label>
                            <div className="relative">
                                <input
                                    className={`${INPUT_CLS} ${biz.email && !isValidEmail(biz.email) ? '!border-red-500/60 focus:!border-red-500' : biz.email && isValidEmail(biz.email) ? '!border-emerald-500/40' : ''}`}
                                    value={biz.email || ''}
                                    onChange={e => setBiz({ email: e.target.value })}
                                    placeholder="info@example.com"
                                    type="email"
                                />
                                {biz.email?.trim() && (
                                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${isValidEmail(biz.email) ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-red-400'}`} />
                                )}
                            </div>
                            {biz.email && !isValidEmail(biz.email) && (
                                <p className="mt-1 text-[10px] text-red-400">Geçerli bir e-posta adresi girin</p>
                            )}
                        </div>
                        <div>
                            <label className={LABEL_CLS}>
                                <i className="fa-brands fa-whatsapp text-green-400 text-[8px] mr-1.5"></i>
                                WhatsApp Numarası
                            </label>
                            <div className="relative">
                                <input
                                    className={INPUT_CLS}
                                    value={biz.whatsapp || ''}
                                    onChange={e => setBiz({ whatsapp: e.target.value })}
                                    placeholder="905000000000"
                                />
                                {biz.whatsapp?.trim() && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address: full width */}
                    <div>
                        <label className={LABEL_CLS}>
                            <i className="fa-solid fa-location-dot text-red-400 text-[8px] mr-1.5"></i>
                            Adres
                        </label>
                        <textarea
                            className={`${INPUT_CLS} resize-none`}
                            rows={3}
                            value={biz.address || ''}
                            onChange={e => setBiz({ address: e.target.value })}
                            placeholder="Tam işletme adresi..."
                        />
                    </div>
                </div>
            </div>

            {/* ── Social Media ───────────────────────────────────── */}
            <div ref={socialRef} className="bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/25">
                        <i className="fa-solid fa-share-nodes text-white text-sm"></i>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold font-outfit text-white">Sosyal Medya</h3>
                        <p className="text-[10px] text-slate-500">Bağlantı ve iletişim kanalları</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                        {[biz.whatsapp, biz.telegram, biz.instagram, biz.facebook].map((v, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors ${v?.trim() ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.7)]' : 'bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        {
                            key: 'whatsapp' as const,
                            label: 'WhatsApp',
                            icon: 'fa-whatsapp',
                            iconColor: '#25D366',
                            bgColor: 'bg-green-500/10',
                            borderColor: 'border-green-500/20',
                            placeholder: '905000000000',
                            buildLink: (v: string) => `https://wa.me/${v.replace(/\D/g, '')}`,
                            hint: 'Ülke kodlu numara (ör: 905XXXXXXXXX)',
                        },
                        {
                            key: 'telegram' as const,
                            label: 'Telegram',
                            icon: 'fa-telegram',
                            iconColor: '#229ED9',
                            bgColor: 'bg-sky-500/10',
                            borderColor: 'border-sky-500/20',
                            placeholder: 'https://t.me/kullaniciadi',
                            buildLink: (v: string) => v,
                            hint: 'Tam Telegram bağlantısı',
                        },
                        {
                            key: 'instagram' as const,
                            label: 'Instagram',
                            icon: 'fa-instagram',
                            iconColor: '#E1306C',
                            bgColor: 'bg-pink-500/10',
                            borderColor: 'border-pink-500/20',
                            placeholder: 'https://instagram.com/kullaniciadi',
                            buildLink: (v: string) => v,
                            hint: 'Profil sayfası URL\'si',
                        },
                        {
                            key: 'facebook' as const,
                            label: 'Facebook',
                            icon: 'fa-facebook',
                            iconColor: '#1877F2',
                            bgColor: 'bg-blue-500/10',
                            borderColor: 'border-blue-500/20',
                            placeholder: 'https://facebook.com/sayfaadi',
                            buildLink: (v: string) => v,
                            hint: 'Sayfa veya profil URL\'si',
                        },
                    ].map(social => {
                        const val = (biz as any)[social.key] as string || '';
                        const isActive = val.trim().length > 0;
                        return (
                            <div
                                key={social.key}
                                className={`rounded-2xl border p-4 transition-all duration-200 ${isActive ? `${social.bgColor} ${social.borderColor}` : 'bg-white/[0.02] border-white/[0.06]'}`}
                            >
                                {/* Card header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
                                            style={{ background: isActive ? social.iconColor : '#1e293b' }}
                                        >
                                            <i className={`fa-brands ${social.icon} text-white text-sm`}></i>
                                        </div>
                                        <span className="text-sm font-bold font-outfit text-white">{social.label}</span>
                                    </div>
                                    {isActive ? (
                                        <a
                                            href={social.buildLink(val)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[10px] font-bold text-slate-400 hover:text-white transition-all"
                                        >
                                            <i className="fa-solid fa-arrow-up-right-from-square text-[8px]"></i>
                                            Ziyaret
                                        </a>
                                    ) : (
                                        <span className="text-[9px] text-slate-600 font-outfit">Bağlı değil</span>
                                    )}
                                </div>

                                {/* Input */}
                                <input
                                    className={INPUT_CLS}
                                    value={val}
                                    onChange={e => setBiz({ [social.key]: e.target.value })}
                                    placeholder={social.placeholder}
                                />
                                <p className="mt-1.5 text-[9px] text-slate-600">{social.hint}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Favicon ────────────────────────────────────────── */}
            <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-700 border border-white/10 flex items-center justify-center shadow-lg">
                        <i className="fa-solid fa-star text-amber-400 text-sm"></i>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold font-outfit text-white">Favicon</h3>
                        <p className="text-[10px] text-slate-500">Tarayıcı sekmesinde görünür · ICO, PNG, SVG</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${brand?.favicon?.trim() ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]' : 'bg-red-500'}`} />
                        <span className={`text-[10px] font-bold ${brand?.favicon?.trim() ? 'text-emerald-400' : 'text-red-400'}`}>
                            {brand?.favicon?.trim() ? 'Aktif' : 'Yok'}
                        </span>
                    </div>
                </div>

                <div className="p-6 flex flex-col sm:flex-row gap-6">
                    {/* Preview */}
                    <div className="shrink-0 flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center overflow-hidden">
                            {brand?.favicon ? (
                                <img
                                    src={brand.favicon}
                                    alt="Favicon"
                                    className="max-w-[70%] max-h-[70%] object-contain"
                                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                />
                            ) : (
                                <i className="fa-solid fa-star text-slate-700 text-lg"></i>
                            )}
                        </div>
                        <span className="text-[9px] text-slate-600 font-outfit">Önizleme</span>
                    </div>

                    <div className="flex-1 space-y-3">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="favicon-upload"
                            onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) readFile(f, url => setBrand({ favicon: url }));
                            }}
                        />
                        {/* Drag zone */}
                        <label
                            htmlFor="favicon-upload"
                            onDragOver={e => { e.preventDefault(); setFaviconDragOver(true); }}
                            onDragLeave={() => setFaviconDragOver(false)}
                            onDrop={e => {
                                e.preventDefault();
                                setFaviconDragOver(false);
                                const f = e.dataTransfer.files?.[0];
                                if (f) readFile(f, url => setBrand({ favicon: url }));
                            }}
                            className={`flex flex-col items-center justify-center gap-2 py-5 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                                faviconDragOver
                                    ? 'border-amber-400 bg-amber-400/10'
                                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${faviconDragOver ? 'bg-amber-400' : 'bg-white/[0.06]'}`}>
                                <i className={`fa-solid fa-cloud-arrow-up text-sm ${faviconDragOver ? 'text-white' : 'text-slate-500'}`}></i>
                            </div>
                            <div className="text-center">
                                <p className={`text-xs font-bold transition-colors ${faviconDragOver ? 'text-amber-400' : 'text-slate-400'}`}>
                                    {faviconDragOver ? 'Bırakın!' : 'Tıklayın veya sürükleyin'}
                                </p>
                                <p className="text-[10px] text-slate-600 mt-0.5">ICO, PNG, SVG · 32×32 veya 64×64 önerilir</p>
                            </div>
                        </label>

                        {/* URL input */}
                        <div>
                            <label className={LABEL_CLS}>
                                <i className="fa-solid fa-link text-[8px] mr-1"></i>URL ile yükle
                            </label>
                            <input
                                className={INPUT_CLS}
                                value={brand?.favicon?.startsWith('data:') ? 'Yüklendi (Base64 dosya)' : brand?.favicon || ''}
                                onChange={e => setBrand({ favicon: e.target.value })}
                                placeholder="/favicon.ico veya https://..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Brand Colors ───────────────────────────────────── */}
            <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ background: brand?.primaryColor || '#c5a059' }}
                    >
                        <i className="fa-solid fa-palette text-white text-sm"></i>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold font-outfit text-white">Marka Renkleri</h3>
                        <p className="text-[10px] text-slate-500">Tek tıkla hazır renk paketi uygulayın</p>
                    </div>
                    {/* Active palette badge */}
                    {(() => {
                        const active = PALETTES.find(p =>
                            p.primary === brand?.primaryColor &&
                            p.dark === brand?.darkBg &&
                            p.deeper === brand?.darkBgDeep
                        );
                        return active ? (
                            <span className="ml-auto text-[10px] font-bold text-slate-400 bg-white/[0.05] border border-white/[0.06] px-2.5 py-1 rounded-lg">
                                {active.name}
                            </span>
                        ) : (
                            <span className="ml-auto text-[10px] text-slate-600 font-outfit">Özel renk</span>
                        );
                    })()}
                </div>

                <div className="p-5 space-y-5">
                    {/* Section label */}
                    <p className="text-[9px] font-black font-outfit uppercase tracking-[0.25em] text-slate-600">Hazır Paketler</p>

                    {/* Palette grid */}
                    <div className="grid grid-cols-5 gap-2">
                        {PALETTES.map((palette, i) => {
                            const isActive =
                                brand?.primaryColor === palette.primary &&
                                brand?.darkBg === palette.dark &&
                                brand?.darkBgDeep === palette.deeper;
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() =>
                                        setEditContent({
                                            ...editContent,
                                            branding: {
                                                favicon: brand?.favicon || '/favicon.ico',
                                                primaryColor: palette.primary,
                                                darkBg: palette.dark,
                                                darkBgDeep: palette.deeper,
                                            },
                                        })
                                    }
                                    className={`relative flex flex-col gap-1.5 p-2 rounded-xl border transition-all duration-200 text-left group ${
                                        isActive
                                            ? 'border-white/30 bg-white/10 ring-1 ring-white/20 shadow-lg'
                                            : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                                    }`}
                                    title={palette.name}
                                >
                                    {/* Color swatch strip */}
                                    <div className="flex gap-0.5 w-full h-4 rounded-lg overflow-hidden shadow-sm">
                                        <div className="flex-1 transition-transform group-hover:scale-105" style={{ background: palette.primary }} />
                                        <div className="w-3" style={{ background: palette.dark }} />
                                        <div className="w-2" style={{ background: palette.deeper }} />
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-400 leading-tight truncate block w-full">{palette.name}</span>

                                    {/* Active check */}
                                    {isActive && (
                                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/40">
                                            <i className="fa-solid fa-check text-white" style={{ fontSize: '7px' }}></i>
                                        </div>
                                    )}

                                    {/* "LOGO" badge on first */}
                                    {i === 0 && (
                                        <div
                                            className="absolute -top-1 -left-1 px-1 rounded"
                                            style={{ background: '#c5a059', fontSize: '6px', fontWeight: 900, color: '#000', lineHeight: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                        >
                                            LOGO
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/[0.04]" />

                    {/* Manual fine-tune collapsible */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setColorsOpen(v => !v)}
                            className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-slate-300 cursor-pointer select-none transition-colors py-1 w-full text-left"
                        >
                            <i className="fa-solid fa-sliders text-[9px]"></i>
                            <span>Manuel Renk Düzenleme</span>
                            <i className={`fa-solid fa-chevron-down text-[8px] ml-auto transition-transform duration-200 ${colorsOpen ? 'rotate-180' : ''}`}></i>
                        </button>

                        {colorsOpen && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-200">
                                {[
                                    { key: 'primaryColor' as const, label: 'Ana Renk', desc: 'Butonlar, ikonlar, vurgular', default: '#c5a059' },
                                    { key: 'darkBg' as const, label: 'Koyu Arka Plan', desc: 'Panel, footer, kartlar', default: '#0f172a' },
                                    { key: 'darkBgDeep' as const, label: 'Derin Arka Plan', desc: 'Hero alanı, overlaylar', default: '#020617' },
                                ].map(({ key, label, desc, default: def }) => (
                                    <div key={key} className="space-y-2">
                                        <div>
                                            <p className="text-[10px] font-bold font-outfit text-slate-400 uppercase tracking-wider">{label}</p>
                                            <p className="text-[9px] text-slate-600">{desc}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={brand?.[key] || def}
                                                onChange={e => setBrand({ [key]: e.target.value })}
                                                className="w-9 h-9 rounded-lg border border-white/10 cursor-pointer bg-transparent shrink-0 p-0.5"
                                            />
                                            <input
                                                type="text"
                                                value={brand?.[key] || def}
                                                onChange={e => setBrand({ [key]: e.target.value })}
                                                className="flex-1 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-[var(--color-primary)]/50 transition-colors"
                                                placeholder={def}
                                                maxLength={7}
                                            />
                                        </div>
                                        {/* Color preview strip */}
                                        <div
                                            className="h-1.5 w-full rounded-full"
                                            style={{ background: brand?.[key] || def }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Currency ───────────────────────────────────────── */}
            <div className="bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/25">
                        <i className="fa-solid fa-coins text-white text-sm"></i>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold font-outfit text-white">Para Birimi</h3>
                        <p className="text-[10px] text-slate-500">Fiyat görüntüleme para birimi</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-2xl font-black font-outfit text-white leading-none">{editContent.currency?.symbol || '€'}</span>
                        <span className="text-[10px] font-bold text-slate-500 font-outfit">{editContent.currency?.code || 'EUR'}</span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {[
                            { code: 'EUR', symbol: '€', label: 'Euro', flag: '🇪🇺' },
                            { code: 'USD', symbol: '$', label: 'US Dollar', flag: '🇺🇸' },
                            { code: 'GBP', symbol: '£', label: 'British Pound', flag: '🇬🇧' },
                            { code: 'TRY', symbol: '₺', label: 'Turkish Lira', flag: '🇹🇷' },
                            { code: 'RUB', symbol: '₽', label: 'Russian Ruble', flag: '🇷🇺' },
                        ].map(c => {
                            const isActive = editContent.currency?.code === c.code;
                            return (
                                <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => setEditContent({ ...editContent, currency: { symbol: c.symbol, code: c.code } })}
                                    className={`relative flex flex-col items-center gap-1.5 py-4 px-3 rounded-2xl border transition-all duration-200 ${
                                        isActive
                                            ? 'bg-[var(--color-primary)]/15 border-[var(--color-primary)]/40 shadow-lg shadow-[var(--color-primary)]/10'
                                            : 'bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05] hover:border-white/20'
                                    }`}
                                >
                                    {isActive && (
                                        <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
                                            <i className="fa-solid fa-check text-white" style={{ fontSize: '6px' }}></i>
                                        </div>
                                    )}
                                    <span className="text-2xl font-black font-outfit text-white leading-none">{c.symbol}</span>
                                    <span className={`text-[10px] font-black font-outfit uppercase tracking-wider ${isActive ? 'text-[var(--color-primary)]' : 'text-slate-400'}`}>{c.code}</span>
                                    <span className="text-[8px] text-slate-600 text-center leading-tight">{c.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Map ────────────────────────────────────────────── */}
            <div ref={mapRef} className="bg-[#0d1117] border border-white/[0.06] rounded-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-600/25">
                        <i className="fa-solid fa-map-location-dot text-white text-sm"></i>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold font-outfit text-white">Harita</h3>
                        <p className="text-[10px] text-slate-500">Google Maps gömülü harita</p>
                    </div>
                    <div className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border ${biz.mapEmbedUrl?.trim() ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${biz.mapEmbedUrl?.trim() ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]' : 'bg-red-400'}`} />
                        <span className={`text-[10px] font-bold ${biz.mapEmbedUrl?.trim() ? 'text-emerald-400' : 'text-red-400'}`}>
                            {biz.mapEmbedUrl?.trim() ? 'Aktif' : 'Pasif'}
                        </span>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    {/* Input */}
                    <div>
                        <label className={LABEL_CLS}>
                            <i className="fa-solid fa-code text-cyan-400 text-[8px] mr-1.5"></i>
                            Embed URL
                        </label>
                        <textarea
                            className={`${INPUT_CLS} resize-none font-mono text-xs`}
                            rows={3}
                            value={biz.mapEmbedUrl || ''}
                            onChange={e => setBiz({ mapEmbedUrl: e.target.value })}
                            placeholder="https://www.google.com/maps/embed?pb=..."
                        />
                        <p className="mt-2 text-[10px] text-slate-600 flex items-start gap-1.5">
                            <i className="fa-solid fa-circle-info text-cyan-500/60 mt-0.5 shrink-0"></i>
                            Google Maps → Paylaş → Haritayı Yerleştir →{' '}
                            <code className="text-[var(--color-primary)] font-mono">src="..."</code>{' '}
                            değerini kopyalayıp yapıştırın.
                        </p>
                    </div>

                    {/* Preview */}
                    {biz.mapEmbedUrl?.trim() && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Canlı Önizleme</span>
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                                    <i className="fa-solid fa-circle text-[6px]"></i> Canlı
                                </span>
                            </div>
                            <div className="rounded-2xl overflow-hidden border border-white/[0.07] h-56 shadow-xl shadow-black/30">
                                <iframe
                                    src={biz.mapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    sandbox="allow-scripts allow-same-origin"
                                    title="Harita Önizleme"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
