import React, { useState, useEffect, useRef, useCallback } from 'react';

const AI_LS_KEY = 'ata_ai_api_key';

// ── Avatar System ─────────────────────────────────────────────────────────────
type AvatarCategory = 'Tatil' | 'Sürücü' | 'Gece' | 'Günlük' | 'Profesyonel' | 'Yaratıcı' | 'Aktif' | 'Dijital';
interface AvatarItem { url: string; label: string; category: AvatarCategory; }

const AVATARS: AvatarItem[] = [
  // 🏖️ TATİL — beach/vacation vibes, ocean & sand backgrounds
  { url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=BeachBoy&backgroundColor=0369a1&clothingColor=fbbf24', label: 'Plaj', category: 'Tatil' },
  { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sunny&backgroundColor=b45309', label: 'Güneş', category: 'Tatil' },
  { url: 'https://api.dicebear.com/7.x/personas/svg?seed=Resort&backgroundColor=0c4a6e', label: 'Resort', category: 'Tatil' },
  { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HolidayGirl&backgroundColor=0ea5e9', label: 'Tatilci', category: 'Tatil' },
  { url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Tropical&backgroundColor=065f46', label: 'Tropikal', category: 'Tatil' },

  // 🚗 SÜRÜCÜ — driver/road trip aesthetic, dark moody backgrounds
  { url: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Throttle&backgroundColor=1c1917', label: 'Gaz', category: 'Sürücü' },
  { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Racer&backgroundColor=1c0a02', label: 'Yarışçı', category: 'Sürücü' },
  { url: 'https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=Cruiser&backgroundColor=292524', label: 'Yolcu', category: 'Sürücü' },
  { url: 'https://api.dicebear.com/7.x/micah/svg?seed=Trucker&backgroundColor=1e1b4b', label: 'Sürücü', category: 'Sürücü' },
  { url: 'https://api.dicebear.com/7.x/croodles-neutral/svg?seed=RoadTrip&backgroundColor=0c1a0c', label: 'Yol', category: 'Sürücü' },

  // 🌙 GECE — nightlife, urban nights, deep dark palettes
  { url: 'https://api.dicebear.com/7.x/notionists/svg?seed=NightOwl&backgroundColor=0f0728', label: 'Gece Kuşu', category: 'Gece' },
  { url: 'https://api.dicebear.com/7.x/croodles/svg?seed=ClubKid&backgroundColor=13082a', label: 'Kulüp', category: 'Gece' },
  { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Midnight&backgroundColor=1a0a2e', label: 'Gece Yarısı', category: 'Gece' },
  { url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Party&backgroundColor=160a26', label: 'Parti', category: 'Gece' },
  { url: 'https://api.dicebear.com/7.x/personas/svg?seed=BarHopper&backgroundColor=0a0a1a', label: 'Bar', category: 'Gece' },

  // ☕ GÜNLÜK — casual everyday life, café, home, street
  { url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=CoffeeMorning&backgroundColor=292524&clothingColor=6b7280', label: 'Kahve', category: 'Günlük' },
  { url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CasualFriday&backgroundColor=1c1917', label: 'Günlük', category: 'Günlük' },
  { url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Homebody&backgroundColor=27130c', label: 'Ev', category: 'Günlük' },
  { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Chill&backgroundColor=1a200f', label: 'Rahat', category: 'Günlük' },
  { url: 'https://api.dicebear.com/7.x/dylan/svg?seed=Streetwear&backgroundColor=1e1e1e', label: 'Sokak', category: 'Günlük' },

  // 💼 PROFESYONEL — business, formal, executive
  { url: 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=CEO&backgroundColor=0f172a', label: 'CEO', category: 'Profesyonel' },
  { url: 'https://api.dicebear.com/7.x/personas/svg?seed=Executive&backgroundColor=172030', label: 'Yönetici', category: 'Profesyonel' },
  { url: 'https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=Director&backgroundColor=1e293b', label: 'Direktör', category: 'Profesyonel' },
  { url: 'https://api.dicebear.com/7.x/micah/svg?seed=SuitGuy&backgroundColor=0f1c2e', label: 'Takım Elbise', category: 'Profesyonel' },

  // 🎨 YARATICI — artists, freelancers, makers
  { url: 'https://api.dicebear.com/7.x/croodles/svg?seed=StreetArtist&backgroundColor=1a0a2e', label: 'Ressam', category: 'Yaratıcı' },
  { url: 'https://api.dicebear.com/7.x/notionists/svg?seed=WriterSoul&backgroundColor=0f1a0a', label: 'Yazar', category: 'Yaratıcı' },
  { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Poet&backgroundColor=1a0a1a', label: 'Şair', category: 'Yaratıcı' },
  { url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixelator&backgroundColor=0a0a1a', label: 'Piksel', category: 'Yaratıcı' },
  { url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Musician&backgroundColor=1a1000&clothingColor=374151', label: 'Müzisyen', category: 'Yaratıcı' },

  // 🏃 AKTİF — sports, gym, outdoor, energetic
  { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sprinter&backgroundColor=1a2e0a', label: 'Koşucu', category: 'Aktif' },
  { url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=GymRat&backgroundColor=0a2e1a&clothingColor=1d4ed8', label: 'Spor', category: 'Aktif' },
  { url: 'https://api.dicebear.com/7.x/personas/svg?seed=Climber&backgroundColor=2e1a0a', label: 'Dağcı', category: 'Aktif' },
  { url: 'https://api.dicebear.com/7.x/micah/svg?seed=Swimmer&backgroundColor=0a1a2e', label: 'Yüzücü', category: 'Aktif' },

  // 🎮 DİJİTAL — gamer, coder, tech geek
  { url: 'https://api.dicebear.com/7.x/bottts/svg?seed=GamerBot&backgroundColor=0a0a1e', label: 'Oyuncu', category: 'Dijital' },
  { url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=HackerPixel&backgroundColor=0a1a0a', label: 'Kodcu', category: 'Dijital' },
  { url: 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=AI-Dev&backgroundColor=0e0a1a', label: 'Dev', category: 'Dijital' },
  { url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=NerdAlert&backgroundColor=0a0e1a', label: 'Geek', category: 'Dijital' },
];

const AVATAR_CATEGORIES: AvatarCategory[] = ['Tatil', 'Sürücü', 'Gece', 'Günlük', 'Profesyonel', 'Yaratıcı', 'Aktif', 'Dijital'];
const CATEGORY_ICONS: Record<AvatarCategory, string> = {
  'Tatil': 'fa-umbrella-beach',
  'Sürücü': 'fa-car',
  'Gece': 'fa-moon',
  'Günlük': 'fa-mug-hot',
  'Profesyonel': 'fa-briefcase',
  'Yaratıcı': 'fa-palette',
  'Aktif': 'fa-person-running',
  'Dijital': 'fa-gamepad',
};
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
    const [hoverAvatar, setHoverAvatar] = useState<string | null>(null);
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
                onClick={() => { setShowAvatarPicker(false); setPendingAvatar(null); setHoverAvatar(null); }}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

                {/* Modal card */}
                <div
                    className="relative z-10 w-full max-w-3xl bg-[#0d1117] border border-white/[0.08] rounded-3xl shadow-2xl shadow-black/60 animate-in zoom-in-95 fade-in duration-200 overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/15 flex items-center justify-center">
                                <i className="fa-solid fa-user-pen text-[var(--color-primary)] text-[12px]"></i>
                            </div>
                            <div>
                                <h3 className="text-[14px] font-black font-outfit text-white tracking-wide">Avatar Seç</h3>
                                <p className="text-[10px] text-slate-500">34 avatar · 8 yaşam tarzı · 10 farklı stil</p>
                            </div>
                        </div>
                        <button
                            onClick={() => { setShowAvatarPicker(false); setPendingAvatar(null); setHoverAvatar(null); }}
                            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-colors"
                        >
                            <i className="fa-solid fa-xmark text-sm"></i>
                        </button>
                    </div>

                    {/* Category tabs */}
                    <div className="flex items-center gap-1.5 px-6 pt-4 pb-2 overflow-x-auto scrollbar-hide">
                        {AVATAR_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setAvatarCategory(cat)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all shrink-0 ${
                                    avatarCategory === cat
                                        ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20'
                                        : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]'
                                }`}
                            >
                                <i className={`fa-solid ${CATEGORY_ICONS[cat]} text-[9px]`}></i>
                                {cat}
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${avatarCategory === cat ? 'bg-white/20' : 'bg-white/[0.05]'}`}>
                                    {AVATARS.filter(a => a.category === cat).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Body: grid + preview */}
                    <div className="flex gap-0 p-6 pt-3">
                        {/* Avatar grid */}
                        <div className="flex-1">
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                {AVATARS.filter(a => a.category === avatarCategory).map(av => {
                                    const isCurrent = accountForm.avatar === av.url;
                                    const isPending = pendingAvatar === av.url;
                                    const isSelected = isPending || (!pendingAvatar && isCurrent);
                                    return (
                                        <button
                                            key={av.url}
                                            onClick={() => setPendingAvatar(av.url)}
                                            onMouseEnter={() => setHoverAvatar(av.url)}
                                            onMouseLeave={() => setHoverAvatar(null)}
                                            className="group flex flex-col items-center gap-1.5"
                                        >
                                            <div className={`relative w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                                                isSelected
                                                    ? 'border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/30 scale-105'
                                                    : 'border-white/10 group-hover:border-white/30 group-hover:scale-105'
                                            }`}>
                                                <img src={av.url} alt={av.label} className="w-full h-full object-cover" loading="lazy" />
                                                {/* Selected checkmark */}
                                                {isSelected && (
                                                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-[var(--color-primary)] rounded-full flex items-center justify-center shadow-md">
                                                        <i className="fa-solid fa-check text-white text-[8px]"></i>
                                                    </div>
                                                )}
                                                {/* Hover overlay */}
                                                {!isSelected && (
                                                    <div className="absolute inset-0 bg-[var(--color-primary)]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                )}
                                            </div>
                                            <span className={`text-[9px] font-semibold transition-colors ${isSelected ? 'text-[var(--color-primary)]' : 'text-slate-600 group-hover:text-slate-300'}`}>
                                                {av.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Preview panel (desktop) */}
                        <div className="hidden sm:flex w-32 shrink-0 flex-col items-center gap-3 pl-5 border-l border-white/[0.06] ml-5">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest self-start">Önizleme</p>
                            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[var(--color-primary)]/40 shadow-xl shadow-[var(--color-primary)]/10 bg-slate-900">
                                <img
                                    src={hoverAvatar || pendingAvatar || accountForm.avatar}
                                    alt="Önizleme"
                                    className="w-full h-full object-cover transition-all duration-200"
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-white">
                                    {AVATARS.find(a => a.url === (hoverAvatar || pendingAvatar || accountForm.avatar))?.label || 'Mevcut'}
                                </p>
                                <p className="text-[9px] text-slate-600 mt-0.5">
                                    {AVATARS.find(a => a.url === (hoverAvatar || pendingAvatar || accountForm.avatar))?.category || ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06] bg-white/[0.01]">
                        <p className="text-[10px] text-slate-600">
                            {pendingAvatar
                                ? <span className="text-[var(--color-primary)] font-semibold">Seçim yapıldı — kaydetmek için "Uygula" butonuna tıklayın</span>
                                : 'Bir avatar seçin'
                            }
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => { setShowAvatarPicker(false); setPendingAvatar(null); setHoverAvatar(null); }}
                                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-bold transition-colors"
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
                                    setHoverAvatar(null);
                                    showToast('Avatar güncellendi', 'success');
                                }}
                                className="px-5 py-2 rounded-xl bg-[var(--color-primary)] hover:bg-amber-600 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-black transition-all shadow-lg shadow-[var(--color-primary)]/20"
                            >
                                <i className="fa-solid fa-check mr-1.5 text-[10px]"></i>
                                Uygula
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default AccountView;
