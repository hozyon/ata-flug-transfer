import React, { useState, useEffect, useRef, useCallback } from 'react';

const AI_LS_KEY = 'ata_ai_api_key';

// ── Avatar System ─────────────────────────────────────────────────────────────
type AvatarCategory = 'Karakter' | 'Marka';
interface AvatarItem { url: string; label: string; category: AvatarCategory; }

const _s = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

const BRAND_SVGS = {
  Mercedes: _s("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='10' fill='#0f172a'/><circle cx='50' cy='50' r='36' fill='none' stroke='#c5a059' stroke-width='1.5'/><line x1='50' y1='14' x2='50' y2='50' stroke='#c5a059' stroke-width='3' stroke-linecap='round'/><line x1='50' y1='50' x2='19' y2='68' stroke='#c5a059' stroke-width='3' stroke-linecap='round'/><line x1='50' y1='50' x2='81' y2='68' stroke='#c5a059' stroke-width='3' stroke-linecap='round'/><circle cx='50' cy='14' r='3.5' fill='#c5a059'/><circle cx='19' cy='68' r='3.5' fill='#c5a059'/><circle cx='81' cy='68' r='3.5' fill='#c5a059'/><circle cx='50' cy='50' r='4' fill='#c5a059'/></svg>"),
  BMW: _s("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='10' fill='#0f172a'/><clipPath id='bmw'><circle cx='50' cy='50' r='28'/></clipPath><path d='M50 22 A28 28 0 0 1 78 50 L50 50Z' fill='#1d4ed8'/><path d='M78 50 A28 28 0 0 1 50 78 L50 50Z' fill='#f1f5f9'/><path d='M50 78 A28 28 0 0 1 22 50 L50 50Z' fill='#1d4ed8'/><path d='M22 50 A28 28 0 0 1 50 22 L50 50Z' fill='#f1f5f9'/><circle cx='50' cy='50' r='28' fill='none' stroke='#0f172a' stroke-width='1'/><circle cx='50' cy='50' r='36' fill='none' stroke='#c5a059' stroke-width='2'/><circle cx='50' cy='50' r='28' fill='none' stroke='#c5a059' stroke-width='1'/></svg>"),
  Audi: _s("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='10' fill='#0f172a'/><circle cx='22' cy='50' r='14' fill='none' stroke='#c5a059' stroke-width='3'/><circle cx='36' cy='50' r='14' fill='none' stroke='#c5a059' stroke-width='3'/><circle cx='50' cy='50' r='14' fill='none' stroke='#c5a059' stroke-width='3'/><circle cx='64' cy='50' r='14' fill='none' stroke='#c5a059' stroke-width='3'/></svg>"),
  Ferrari: _s("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='10' fill='#0f172a'/><path d='M50 8 L80 22 L80 70 Q80 88 50 96 Q20 88 20 70 L20 22Z' fill='#dc2626' stroke='#c5a059' stroke-width='1.5'/><line x1='20' y1='40' x2='80' y2='40' stroke='#c5a059' stroke-width='1' opacity='0.4'/><text x='50' y='36' text-anchor='middle' fill='#fbbf24' font-size='9' font-weight='900' font-family='Arial' letter-spacing='1'>SCUDERIA</text><text x='50' y='60' text-anchor='middle' fill='#fbbf24' font-size='18' font-weight='900' font-family='Arial'>SF</text></svg>"),
  Porsche: _s("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='10' fill='#0f172a'/><path d='M50 10 L76 24 L76 68 Q76 85 50 93 Q24 85 24 68 L24 24Z' fill='none' stroke='#c5a059' stroke-width='2'/><line x1='50' y1='10' x2='50' y2='93' stroke='#c5a059' stroke-width='1' opacity='0.3'/><line x1='24' y1='46' x2='76' y2='46' stroke='#c5a059' stroke-width='1' opacity='0.3'/><text x='50' y='38' text-anchor='middle' fill='#c5a059' font-size='9' font-weight='bold' font-family='Arial' letter-spacing='0.5'>PORSCHE</text><text x='38' y='72' text-anchor='middle' fill='#c5a059' font-size='18' font-weight='900' font-family='serif'>P</text></svg>"),
  Lamborghini: _s("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='10' fill='#0f172a'/><polygon points='50,8 88,28 88,72 50,92 12,72 12,28' fill='none' stroke='#c5a059' stroke-width='2'/><text x='50' y='47' text-anchor='middle' fill='#fbbf24' font-size='22' font-weight='900' font-family='Arial'>L</text><text x='50' y='65' text-anchor='middle' fill='#c5a059' font-size='8' font-weight='bold' font-family='Arial' letter-spacing='1'>LAMBORGHINI</text></svg>"),
  RollsRoyce: _s("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='10' fill='#0f172a'/><circle cx='50' cy='50' r='36' fill='none' stroke='#c5a059' stroke-width='1.5'/><text x='50' y='58' text-anchor='middle' fill='#c5a059' font-size='26' font-weight='bold' font-family='Georgia,serif' letter-spacing='-3'>RR</text></svg>"),
  Bentley: _s("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='10' fill='#0f172a'/><circle cx='50' cy='50' r='18' fill='none' stroke='#c5a059' stroke-width='2'/><text x='50' y='58' text-anchor='middle' fill='#c5a059' font-size='24' font-weight='bold' font-family='Georgia,serif'>B</text><path d='M15 50 Q30 42 30 50 Q30 58 15 50' fill='none' stroke='#c5a059' stroke-width='2.5'/><path d='M85 50 Q70 42 70 50 Q70 58 85 50' fill='none' stroke='#c5a059' stroke-width='2.5'/><path d='M15 50 Q20 44 26 47' fill='none' stroke='#c5a059' stroke-width='1' opacity='0.5'/><path d='M85 50 Q80 44 74 47' fill='none' stroke='#c5a059' stroke-width='1' opacity='0.5'/></svg>"),
  Maserati: _s("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='10' fill='#0f172a'/><line x1='50' y1='12' x2='50' y2='85' stroke='#c5a059' stroke-width='4' stroke-linecap='round'/><line x1='34' y1='12' x2='34' y2='55' stroke='#c5a059' stroke-width='3' stroke-linecap='round'/><line x1='66' y1='12' x2='66' y2='55' stroke='#c5a059' stroke-width='3' stroke-linecap='round'/><path d='M34 55 Q42 72 50 67' stroke='#c5a059' stroke-width='3' fill='none' stroke-linecap='round'/><path d='M66 55 Q58 72 50 67' stroke='#c5a059' stroke-width='3' fill='none' stroke-linecap='round'/></svg>"),
  Tesla: _s("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='10' fill='#0f172a'/><path d='M28 34 Q39 27 50 30 Q61 27 72 34 L65 34 Q56 29 50 32 Q44 29 35 34Z' fill='#c5a059'/><line x1='28' y1='34' x2='72' y2='34' stroke='#c5a059' stroke-width='4' stroke-linecap='round'/><line x1='50' y1='34' x2='50' y2='82' stroke='#c5a059' stroke-width='4.5' stroke-linecap='round'/></svg>"),
};

const AVATARS: AvatarItem[] = [
  // 🚬 SİGARA İÇEN — moody café, cinematic shadow
  { url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=CafeSmoker&backgroundColor=1a0e06&clothingColor=374151', label: 'Sigara', category: 'Karakter' },
  { url: 'https://api.dicebear.com/7.x/notionists/svg?seed=PhilosopherSmoke&backgroundColor=1a1426', label: 'Düşünür', category: 'Karakter' },
  { url: 'https://api.dicebear.com/7.x/micah/svg?seed=NightSmoker&backgroundColor=0a0a14', label: 'Gece Sigara', category: 'Karakter' },

  // 🚗 ARABADA SİGARA — road, window down, cruising
  { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=DriverSmoke&backgroundColor=1c1917', label: 'Arabalı', category: 'Karakter' },
  { url: 'https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=RoadSmoke&backgroundColor=14100a', label: 'Yolda Sigara', category: 'Karakter' },

  // 🏖️ TATİL MODU — sun, pool, cocktail
  { url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=BeachVibe&backgroundColor=0369a1&clothingColor=fbbf24', label: 'Plajda', category: 'Karakter' },
  { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PoolKing&backgroundColor=0c4a6e', label: 'Tatil', category: 'Karakter' },
  { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=SunsetCocktail&backgroundColor=92400e', label: 'Kokteyl', category: 'Karakter' },

  // 😤 MEŞGUL — rushing, stressed, overwhelmed
  { url: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=BusyBoss&backgroundColor=0f172a', label: 'Meşgul', category: 'Karakter' },
  { url: 'https://api.dicebear.com/7.x/personas/svg?seed=StressedOut&backgroundColor=1e1b4b', label: 'Stresli', category: 'Karakter' },
  { url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=RushHourGuy&backgroundColor=1e293b&clothingColor=1d4ed8', label: 'Acele', category: 'Karakter' },
  { url: 'https://api.dicebear.com/7.x/micah/svg?seed=Workaholic&backgroundColor=172030', label: 'İşkolik', category: 'Karakter' },

  // 😑 SIKILMIŞ — bored, done, zoning out
  { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Boredom101&backgroundColor=374151', label: 'Sıkılmış', category: 'Karakter' },
  { url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=LazyAfternoon&backgroundColor=1f2937', label: 'Uyuşuk', category: 'Karakter' },
  { url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=DaydreamZone&backgroundColor=1a1a2e', label: 'Hayal Kuran', category: 'Karakter' },

  // 💎 PREMİUM — VIP, chauffeur, luxury
  { url: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=VIPPassenger&backgroundColor=1a1200', label: 'VIP', category: 'Karakter' },
  { url: 'https://api.dicebear.com/7.x/personas/svg?seed=EliteChauffeur&backgroundColor=0a0a0a', label: 'Şoför', category: 'Karakter' },
  { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LuxuryRider&backgroundColor=0f172a', label: 'Lüks', category: 'Karakter' },
  { url: 'https://api.dicebear.com/7.x/notionists/svg?seed=NightOwlVIP&backgroundColor=0f0728', label: 'Gece Kuşu', category: 'Karakter' },
  { url: 'https://api.dicebear.com/7.x/croodles-neutral/svg?seed=NoirMystery&backgroundColor=080808', label: 'Gizemli', category: 'Karakter' },

  // 🚗 MARKA LOGOLARI — premium car brands
  { url: BRAND_SVGS.Mercedes, label: 'Mercedes', category: 'Marka' },
  { url: BRAND_SVGS.BMW, label: 'BMW', category: 'Marka' },
  { url: BRAND_SVGS.Audi, label: 'Audi', category: 'Marka' },
  { url: BRAND_SVGS.Ferrari, label: 'Ferrari', category: 'Marka' },
  { url: BRAND_SVGS.Porsche, label: 'Porsche', category: 'Marka' },
  { url: BRAND_SVGS.Lamborghini, label: 'Lamborghini', category: 'Marka' },
  { url: BRAND_SVGS.RollsRoyce, label: 'Rolls-Royce', category: 'Marka' },
  { url: BRAND_SVGS.Bentley, label: 'Bentley', category: 'Marka' },
  { url: BRAND_SVGS.Maserati, label: 'Maserati', category: 'Marka' },
  { url: BRAND_SVGS.Tesla, label: 'Tesla', category: 'Marka' },
];

const AVATAR_CATEGORIES: AvatarCategory[] = ['Karakter', 'Marka'];
// ─────────────────────────────────────────────────────────────────────────────

interface AccountViewProps {
    accountForm: any;
    setAccountForm: (form: any) => void;
    accountTab: 'profile' | 'users';
    setAccountTab: (tab: 'profile' | 'users') => void;
    ADMIN_AVATARS?: string[]; // kept for backwards-compat, no longer used
    showToast: (message: string, type: 'success' | 'error' | 'info' | 'delete' | 'warning') => void;
    onExitAdmin: () => void;
    onSaveAccount: (form?: any) => void;
    onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<{ error: string | null }>;
    systemUsers: any[];
    setIsAddUserModalOpen: (isOpen: boolean) => void;
    setEditingUserId: (id: string | null) => void;
    setNewUserForm: (form: any) => void;
    handleDeleteUser: (id: string, isDeletable: boolean) => void;
}

const INPUT = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[var(--color-primary)]/50 focus:ring-1 focus:ring-[var(--color-primary)]/20 transition-all";
const LABEL = "text-[10px] font-black font-outfit text-slate-500 uppercase tracking-widest";

export const AccountView: React.FC<AccountViewProps> = ({
    accountForm, setAccountForm,
    showToast, onExitAdmin, onSaveAccount, onUpdatePassword,
}) => {
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [avatarCategory, setAvatarCategory] = useState<AvatarCategory>('Karakter');

    const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);
    const [aiApiKey, setAiApiKey] = useState(() => localStorage.getItem(AI_LS_KEY) || '');
    const [showAiKey, setShowAiKey] = useState(false);
    const [aiKeySaved, setAiKeySaved] = useState(false);
    const aiSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleAiKeyChange = useCallback((val: string) => {
        setAiApiKey(val);
        setAiKeySaved(false);
        if (aiSaveTimer.current) clearTimeout(aiSaveTimer.current);
        aiSaveTimer.current = setTimeout(() => {
            localStorage.setItem(AI_LS_KEY, val);
            setAiKeySaved(true);
            setTimeout(() => setAiKeySaved(false), 2000);
        }, 800);
    }, []);
    const [showPwFields, setShowPwFields] = useState(false);
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);
    const [profileSaveStatus, setProfileSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const profileSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const profileInitialized = useRef(false);

    // Debounced auto-save for email and phone
    useEffect(() => {
        if (!profileInitialized.current) {
            profileInitialized.current = true;
            return;
        }
        setProfileSaveStatus('saving');
        if (profileSaveTimer.current) clearTimeout(profileSaveTimer.current);
        profileSaveTimer.current = setTimeout(() => {
            onSaveAccount();
            setProfileSaveStatus('saved');
            setTimeout(() => setProfileSaveStatus('idle'), 2000);
        }, 2000);
        return () => { if (profileSaveTimer.current) clearTimeout(profileSaveTimer.current); };
    }, [accountForm.email, accountForm.phone]);

    const pwStrength = (pw: string) => {
        if (!pw) return { level: 0, label: '' };
        if (pw.length < 4) return { level: 1, label: 'Çok zayıf' };
        if (pw.length < 7) return { level: 2, label: 'Zayıf' };
        if (pw.length < 10) return { level: 3, label: 'Orta' };
        return { level: 4, label: 'Güçlü' };
    };
    const strength = pwStrength(accountForm.newPassword || '');
    const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500'];

    return (
        <>
        <div className="animate-in slide-in-from-right-8 duration-500 max-w-3xl mx-auto space-y-4">

            {/* ── Profile Card ── */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <div className="p-5 flex items-center gap-4">
                    {/* Avatar */}
                    <button
                        onClick={() => setShowAvatarPicker(v => !v)}
                        className="relative shrink-0 group"
                        title="Avatar değiştir"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-amber-700 p-[2px] shadow-lg shadow-amber-900/30">
                            <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-900">
                                <img src={accountForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <i className="fa-solid fa-pen text-white text-sm"></i>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-[var(--color-primary)] flex items-center justify-center shadow-md border-2 border-[var(--color-darker)]">
                            <i className="fa-solid fa-pen text-white text-[7px]"></i>
                        </div>
                    </button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-black font-outfit text-white tracking-tight truncate">{accountForm.fullName || 'Admin'}</h2>
                        <p className="text-[var(--color-primary)] text-xs font-semibold truncate">{accountForm.email}</p>
                        <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[9px] font-black">
                            <i className="fa-solid fa-crown text-[7px]"></i> SİSTEM YÖNETİCİSİ
                        </span>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={onExitAdmin}
                        className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-black transition-all min-h-[44px]"
                    >
                        <i className="fa-solid fa-power-off text-xs"></i>
                        <span className="hidden sm:inline">ÇIKIŞ</span>
                    </button>
                </div>

                {/* no inline picker — modal below */}
            </div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                {/* Left: Profile info + Password */}
                <div className="lg:col-span-3 space-y-4">

                    {/* Personal Info */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                                <i className="fa-solid fa-id-card text-[var(--color-primary)] text-[11px]"></i>
                            </div>
                            <h3 className="text-sm font-black font-outfit text-white tracking-wide">PROFİL BİLGİLERİ</h3>
                            <div className="ml-auto">
                                {profileSaveStatus === 'saving' && (
                                    <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                        <i className="fa-solid fa-spinner fa-spin text-[9px]"></i> Kaydediliyor...
                                    </span>
                                )}
                                {profileSaveStatus === 'saved' && (
                                    <span className="flex items-center gap-1.5 text-[10px] text-emerald-500">
                                        <i className="fa-solid fa-check text-[9px]"></i> Kaydedildi
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className={LABEL}>Kullanıcı Adı</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={accountForm.fullName}
                                            disabled
                                            className={`${INPUT} opacity-40 cursor-not-allowed pr-9`}
                                        />
                                        <i className="fa-solid fa-lock absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 text-[10px]"></i>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className={LABEL}>E-posta</label>
                                    <input
                                        type="email"
                                        value={accountForm.email}
                                        onChange={e => setAccountForm({ ...accountForm, email: e.target.value })}
                                        className={INPUT}
                                        placeholder="ornek@sirket.com"
                                    />
                                </div>
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className={LABEL}>Telefon</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                                        <input
                                            type="text"
                                            value={accountForm.phone}
                                            onChange={e => setAccountForm({ ...accountForm, phone: e.target.value })}
                                            className={`${INPUT} pl-10`}
                                            placeholder="+90 555 000 0000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Password Change */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                        <button
                            onClick={() => setShowPwFields(v => !v)}
                            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-all min-h-[60px]"
                        >
                            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                                <i className="fa-solid fa-key text-amber-400 text-[11px]"></i>
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-black font-outfit text-white">Şifre Değiştir</p>
                                <p className="text-[10px] text-slate-500">Hesap giriş şifrenizi güncelleyin</p>
                            </div>
                            <i className={`fa-solid fa-chevron-down text-slate-500 text-xs transition-transform duration-300 ${showPwFields ? 'rotate-180' : ''}`}></i>
                        </button>

                        {showPwFields && (
                            <div className="px-5 pb-5 pt-1 border-t border-white/[0.05] space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="space-y-1.5">
                                    <label className={LABEL}>Mevcut Şifre</label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPw ? 'text' : 'password'}
                                            value={accountForm.currentPassword}
                                            onChange={e => setAccountForm({ ...accountForm, currentPassword: e.target.value })}
                                            className={INPUT}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPw(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                                        >
                                            <i className={`fa-solid ${showCurrentPw ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className={LABEL}>Yeni Şifre</label>
                                        <div className="relative">
                                            <input
                                                type={showNewPw ? 'text' : 'password'}
                                                value={accountForm.newPassword}
                                                onChange={e => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                                                className={INPUT}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPw(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                                            >
                                                <i className={`fa-solid ${showNewPw ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={LABEL}>Tekrar</label>
                                        <input
                                            type="password"
                                            value={accountForm.confirmPassword}
                                            onChange={e => setAccountForm({ ...accountForm, confirmPassword: e.target.value })}
                                            className={INPUT}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {/* Strength bar */}
                                {accountForm.newPassword && (
                                    <div className="space-y-1">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map(i => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strengthColors[strength.level] : 'bg-white/10'}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-[10px] text-slate-500">{strength.label}</p>
                                    </div>
                                )}

                                {/* Match indicator */}
                                {accountForm.newPassword && accountForm.confirmPassword && (
                                    <p className={`text-[10px] font-bold flex items-center gap-1.5 ${accountForm.newPassword === accountForm.confirmPassword ? 'text-emerald-400' : 'text-red-400'}`}>
                                        <i className={`fa-solid ${accountForm.newPassword === accountForm.confirmPassword ? 'fa-check' : 'fa-xmark'} text-[9px]`}></i>
                                        {accountForm.newPassword === accountForm.confirmPassword ? 'Şifreler eşleşiyor' : 'Şifreler eşleşmiyor'}
                                    </p>
                                )}

                                <button
                                    disabled={pwLoading}
                                    onClick={async () => {
                                        if (!accountForm.currentPassword) { showToast('Mevcut şifreyi girin', 'error'); return; }
                                        if (!accountForm.newPassword) { showToast('Yeni şifre girin', 'error'); return; }
                                        if (accountForm.newPassword !== accountForm.confirmPassword) { showToast('Şifreler eşleşmiyor', 'error'); return; }
                                        if (accountForm.newPassword.length < 6) { showToast('En az 6 karakter gerekli', 'error'); return; }
                                        setPwLoading(true);
                                        const { error } = await onUpdatePassword(accountForm.currentPassword, accountForm.newPassword);
                                        if (error) { setPwLoading(false); showToast(`Hata: ${error}`, 'error'); return; }
                                        // Keep button disabled (pwLoading stays true) while waiting for logout
                                        showToast('Şifre güncellendi. Oturum kapatılıyor...', 'success');
                                        setTimeout(() => { setPwLoading(false); onExitAdmin(); }, 1500);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 min-h-[44px] rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-white hover:border-transparent text-[11px] font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {pwLoading
                                        ? <><i className="fa-solid fa-spinner fa-spin text-xs"></i> Güncelleniyor...</>
                                        : <><i className="fa-solid fa-key text-xs"></i> ŞİFREYİ GÜNCELLE</>
                                    }
                                </button>
                            </div>
                        )}
                    </div>
                    {/* AI Integration */}
                    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-violet-500/10 flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
                                <i className="fa-solid fa-robot text-violet-400 text-[11px]"></i>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-black font-outfit text-white tracking-wide">AI ENTEGRASYONU</h3>
                                <p className="text-[10px] text-violet-400/70">Claude API · SEO / AEO / GEO</p>
                            </div>
                            {aiApiKey && (
                                <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                    AKTİF
                                </span>
                            )}
                        </div>
                        <div className="p-5 space-y-4">
                            {/* Why needed */}
                            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <i className="fa-solid fa-circle-info text-violet-400 text-[9px]"></i>
                                    Neden Gerekli?
                                </p>
                                <ul className="space-y-1.5">
                                    {[
                                        { icon: 'fa-magnifying-glass', color: 'text-blue-400', text: 'Blog\'da AI Asistan ile SEO uyumlu makaleler otomatik oluşturmak için' },
                                        { icon: 'fa-microphone', color: 'text-emerald-400', text: 'AEO (sesli arama) uyumlu SSS bölümleri üretmek için' },
                                        { icon: 'fa-location-dot', color: 'text-amber-400', text: 'GEO (yapay zeka motorları) için coğrafi içerik optimize etmek için' },
                                        { icon: 'fa-wand-magic-sparkles', color: 'text-violet-400', text: 'Mevcut yazıları tek tıkla profesyonel düzeyde geliştirmek için' },
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <i className={`fa-solid ${item.icon} ${item.color} text-[9px] mt-[3px] shrink-0`}></i>
                                            <span className="text-[11px] text-slate-400 leading-relaxed">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-[10px] text-slate-600 leading-relaxed border-t border-white/[0.04] pt-2 mt-1">
                                    API anahtarı yalnızca tarayıcınızda saklanır, sunucuya gönderilmez.
                                    <span className="text-violet-400"> console.anthropic.com</span> adresinden edinebilirsiniz.
                                </p>
                            </div>

                            {/* API Key input */}
                            <div className="space-y-2">
                                <label className={LABEL + ' flex items-center justify-between'}>
                                    <span>Anthropic API Anahtarı</span>
                                    {aiKeySaved && <span className="text-emerald-400 normal-case font-semibold tracking-normal flex items-center gap-1"><i className="fa-solid fa-check text-[9px]"></i> Kaydedildi</span>}
                                </label>
                                <div className="relative">
                                    <i className="fa-solid fa-key absolute left-4 top-1/2 -translate-y-1/2 text-violet-400/50 text-xs"></i>
                                    <input
                                        type={showAiKey ? 'text' : 'password'}
                                        value={aiApiKey}
                                        onChange={e => handleAiKeyChange(e.target.value)}
                                        placeholder="sk-ant-api03-..."
                                        className={`${INPUT} pl-10 pr-20 font-mono text-[12px] border-violet-500/20 focus:border-violet-500/50`}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <button type="button" onClick={() => setShowAiKey(!showAiKey)}
                                            className="text-slate-500 hover:text-white text-xs transition-colors p-1">
                                            <i className={`fa-solid ${showAiKey ? 'fa-eye-slash' : 'fa-eye'} text-[10px]`}></i>
                                        </button>
                                        {aiApiKey && (
                                            <button type="button" onClick={() => { handleAiKeyChange(''); }}
                                                className="text-slate-600 hover:text-red-400 text-xs transition-colors p-1">
                                                <i className="fa-solid fa-xmark text-[10px]"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {aiApiKey && (
                                    <div className="flex items-center gap-2 text-[10px] text-emerald-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                        AI Asistan hazır — Blog &gt; AI Asistan sekmesinden kullanın
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Notifications + Actions */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Notifications */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <i className="fa-solid fa-bell text-blue-400 text-[11px]"></i>
                            </div>
                            <h3 className="text-sm font-black font-outfit text-white tracking-wide">BİLDİRİMLER</h3>
                        </div>
                        <div className="p-4 space-y-1">
                            {[
                                { key: 'notifyEmail', label: 'E-posta', desc: 'Yeni rezervasyonlar', icon: 'fa-envelope', color: 'text-blue-400' },
                                { key: 'notifySms', label: 'SMS', desc: 'Acil uyarılar', icon: 'fa-comment-sms', color: 'text-emerald-400' },
                                { key: 'notifySystem', label: 'Panel İçi', desc: 'Anlık bildirimler', icon: 'fa-bell', color: 'text-amber-400' },
                            ].map((item, idx, arr) => (
                                <React.Fragment key={item.key}>
                                    <div className="flex items-center justify-between py-2.5">
                                        <div className="flex items-center gap-2.5">
                                            <i className={`fa-solid ${item.icon} ${item.color} text-xs w-3.5 text-center shrink-0`}></i>
                                            <div>
                                                <p className="text-[12px] font-bold text-white">{item.label}</p>
                                                <p className="text-[10px] text-slate-600">{item.desc}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const updated = { ...accountForm, [item.key]: !accountForm[item.key] };
                                                setAccountForm(updated);
                                                onSaveAccount(updated);
                                            }}
                                            className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${accountForm[item.key] ? 'bg-emerald-500' : 'bg-white/10'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${accountForm[item.key] ? 'translate-x-[1.375rem]' : 'translate-x-1'}`}></div>
                                        </button>
                                    </div>
                                    {idx < arr.length - 1 && <div className="h-px bg-white/[0.04]" />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-slate-500/10 flex items-center justify-center">
                                <i className="fa-solid fa-sliders text-slate-400 text-[11px]"></i>
                            </div>
                            <h3 className="text-sm font-black font-outfit text-white tracking-wide">İŞLEMLER</h3>
                        </div>
                        <div className="p-4 space-y-2">
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    showToast('Tarayıcı önbelleği temizlendi', 'success');
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-amber-400 hover:border-amber-500/20 hover:bg-amber-500/[0.05] text-sm font-bold transition-all text-left"
                            >
                                <i className="fa-solid fa-broom text-xs shrink-0"></i>
                                <div>
                                    <p className="text-[12px] font-black">Önbelleği Temizle</p>
                                    <p className="text-[10px] text-slate-600">localStorage verilerini sıfırla</p>
                                </div>
                            </button>
                            <button
                                onClick={onExitAdmin}
                                className="w-full flex items-center gap-3 px-4 py-3 min-h-[48px] rounded-xl bg-red-500/[0.08] border border-red-500/15 text-red-400 hover:bg-red-500 hover:text-white hover:border-transparent text-sm font-bold transition-all text-left"
                            >
                                <i className="fa-solid fa-power-off text-xs shrink-0"></i>
                                <div>
                                    <p className="text-[12px] font-black">Oturumu Kapat</p>
                                    <p className="text-[10px] opacity-60">Admin panelinden çıkış yap</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* ── Avatar Picker Modal ────────────────────────────────────────── */}
        {showAvatarPicker && (
            <div
                className="fixed inset-0 z-[300] flex items-center justify-center p-4"
                onClick={() => { setShowAvatarPicker(false); setPendingAvatar(null); }}
            >
                <div className="absolute inset-0 bg-black/70" />
                <div
                    className="relative z-10 w-full max-w-md bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
                        <span className="text-sm font-bold text-white">Avatar Seç</span>
                        <button
                            onClick={() => { setShowAvatarPicker(false); setPendingAvatar(null); }}
                            className="text-slate-500 hover:text-white transition-colors p-1"
                        >
                            <i className="fa-solid fa-xmark text-sm"></i>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 px-5 pt-4 pb-1">
                        {AVATAR_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setAvatarCategory(cat)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    avatarCategory === cat
                                        ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30'
                                        : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {cat}
                                <span className="ml-1.5 text-[10px] opacity-50">{AVATARS.filter(a => a.category === cat).length}</span>
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="p-5 pt-3">
                        <div className="grid grid-cols-5 gap-2">
                            {AVATARS.filter(a => a.category === avatarCategory).map(av => {
                                const isSelected = pendingAvatar ? pendingAvatar === av.url : accountForm.avatar === av.url;
                                return (
                                    <button
                                        key={av.url}
                                        onClick={() => setPendingAvatar(av.url)}
                                        className="flex flex-col items-center gap-1 group"
                                    >
                                        <div className={`w-full aspect-square rounded-xl overflow-hidden border transition-all ${
                                            isSelected
                                                ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/30'
                                                : 'border-white/10 group-hover:border-white/25'
                                        }`}>
                                            <img src={av.url} alt={av.label} className="w-full h-full object-cover" loading="lazy" />
                                        </div>
                                        <span className={`text-[9px] leading-none transition-colors ${isSelected ? 'text-[var(--color-primary)]' : 'text-slate-600'}`}>
                                            {av.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-white/[0.06]">
                        <button
                            onClick={() => { setShowAvatarPicker(false); setPendingAvatar(null); }}
                            className="px-4 py-2 text-xs text-slate-500 hover:text-white transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            disabled={!pendingAvatar}
                            onClick={() => {
                                if (!pendingAvatar) return;
                                const updated = { ...accountForm, avatar: pendingAvatar };
                                setAccountForm(updated);
                                onSaveAccount(updated);
                                setShowAvatarPicker(false);
                                setPendingAvatar(null);
                                showToast('Avatar güncellendi', 'success');
                            }}
                            className="px-5 py-2 rounded-xl bg-[var(--color-primary)] disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold transition-all"
                        >
                            Uygula
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default AccountView;
