import React, { useState } from 'react';

interface AccountViewProps {
    accountForm: any;
    setAccountForm: (form: any) => void;
    accountTab: 'profile' | 'users';
    setAccountTab: (tab: 'profile' | 'users') => void;
    ADMIN_AVATARS: string[];
    showToast: (message: string, type: 'success' | 'error' | 'info' | 'delete') => void;
    onExitAdmin: () => void;
    systemUsers: any[];
    setIsAddUserModalOpen: (isOpen: boolean) => void;
    setEditingUserId: (id: string | null) => void;
    setNewUserForm: (form: any) => void;
    handleDeleteUser: (id: string, isDeletable: boolean) => void;
}

const INPUT = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#c5a059]/60 focus:ring-1 focus:ring-[#c5a059]/20 transition-all";
const LABEL = "text-[10px] font-black text-slate-500 uppercase tracking-widest";

export const AccountView: React.FC<AccountViewProps> = ({
    accountForm, setAccountForm, accountTab, setAccountTab,
    ADMIN_AVATARS, showToast, onExitAdmin, systemUsers,
    setIsAddUserModalOpen, setEditingUserId, setNewUserForm, handleDeleteUser
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPwFields, setShowPwFields] = useState(false);
    const [twoFaEnabled, setTwoFaEnabled] = useState(false);

    const initials = accountForm.fullName
        ? accountForm.fullName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
        : 'AD';

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 max-w-5xl mx-auto space-y-5">

            {/* ── Profile Hero ── */}
            <div className="relative rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#c5a059]/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Avatar */}
                    <div className="relative group shrink-0 z-10">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c5a059] to-amber-700 p-[2px] shadow-xl shadow-amber-900/30">
                            <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-900 relative">
                                <img src={accountForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <i className="fa-solid fa-pen text-white text-base"></i>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg border-2 border-[#020617]">
                            <i className="fa-solid fa-check text-white text-[8px]"></i>
                        </div>

                        {/* Avatar picker dropdown */}
                        <div className="absolute top-full left-0 mt-3 w-[320px] p-4 rounded-2xl bg-slate-900/98 backdrop-blur-2xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
                            <div className="absolute -top-2 left-8 w-4 h-4 bg-slate-900/98 border-t border-l border-white/10 rotate-45" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 text-center">Avatar Seç</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {ADMIN_AVATARS.map((av, i) => (
                                    <button key={i} onClick={() => setAccountForm({ ...accountForm, avatar: av })}
                                        className={`w-11 h-11 rounded-xl overflow-hidden border-2 transition-all hover:scale-110 ${accountForm.avatar === av ? 'border-[#c5a059] scale-110 ring-2 ring-[#c5a059]/30' : 'border-white/10 opacity-60 hover:opacity-100'}`}>
                                        <img src={av} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">{accountForm.fullName || 'Admin'}</h2>
                                <p className="text-[#c5a059] text-sm font-bold mt-0.5">{accountForm.email}</p>
                            </div>
                            <button onClick={onExitAdmin}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-black transition-all shrink-0">
                                <i className="fa-solid fa-power-off"></i> ÇIKIŞ YAP
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-3 py-1 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/20 text-[#c5a059] text-[10px] font-black flex items-center gap-1.5">
                                <i className="fa-solid fa-crown"></i> SİSTEM YÖNETİCİSİ
                            </span>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black flex items-center gap-1.5">
                                <i className="fa-solid fa-shield-halved"></i> TAM YETKİ
                            </span>
                            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black flex items-center gap-1.5">
                                <i className="fa-solid fa-circle text-[6px]"></i> AKTİF OTURUM
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="border-t border-white/[0.06] grid grid-cols-3 divide-x divide-white/[0.06]">
                    {[
                        { label: 'Toplam Kullanıcı', value: systemUsers.length, icon: 'fa-users', color: 'text-indigo-400' },
                        { label: 'Aktif Oturum', value: systemUsers.filter(u => u.status === 'Aktif').length, icon: 'fa-circle-dot', color: 'text-emerald-400' },
                        { label: 'Panel Sürümü', value: 'v2.4', icon: 'fa-code-branch', color: 'text-violet-400' },
                    ].map(s => (
                        <div key={s.label} className="px-5 py-3 flex items-center gap-3">
                            <i className={`fa-solid ${s.icon} ${s.color} text-sm`}></i>
                            <div>
                                <p className="text-base font-black text-white">{s.value}</p>
                                <p className="text-[10px] text-slate-500">{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.06] rounded-2xl w-fit">
                {[
                    { id: 'profile' as const, label: 'PROFİL & GÜVENLİK', icon: 'fa-user-shield' },
                    { id: 'users' as const, label: 'KULLANICI YÖNETİMİ', icon: 'fa-users-gear' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setAccountTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black tracking-wide transition-all ${accountTab === tab.id
                            ? 'bg-gradient-to-r from-[#c5a059] to-amber-600 text-white shadow-lg shadow-amber-900/30'
                            : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                        <i className={`fa-solid ${tab.icon} text-xs`}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Profile Tab ── */}
            {accountTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-3 duration-400">

                    {/* Left: Personal + Security */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Personal Info */}
                        <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
                            <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-[#c5a059]/10 flex items-center justify-center">
                                    <i className="fa-solid fa-id-card text-[#c5a059] text-xs"></i>
                                </div>
                                <h3 className="text-sm font-black text-white tracking-wide">KİŞİSEL BİLGİLER</h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className={LABEL}>Ad Soyad</label>
                                        <input type="text" value={accountForm.fullName} onChange={e => setAccountForm({ ...accountForm, fullName: e.target.value })} className={INPUT} placeholder="Adınız Soyadınız" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className={LABEL}>E-posta Adresi</label>
                                        <input type="email" value={accountForm.email} onChange={e => setAccountForm({ ...accountForm, email: e.target.value })} className={INPUT} placeholder="ornek@sirket.com" />
                                    </div>
                                    <div className="space-y-1.5 sm:col-span-2">
                                        <label className={LABEL}>Telefon</label>
                                        <div className="relative">
                                            <i className="fa-solid fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                                            <input type="text" value={accountForm.phone} onChange={e => setAccountForm({ ...accountForm, phone: e.target.value })} className={`${INPUT} pl-10`} placeholder="+90 555 000 0000" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-1">
                                    <button onClick={() => showToast('Kişisel bilgiler kaydedildi', 'success')}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c5a059] to-amber-600 text-white text-[11px] font-black tracking-wide hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-900/20">
                                        <i className="fa-solid fa-floppy-disk text-xs"></i> KAYDET
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
                            <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
                                    <i className="fa-solid fa-shield-halved text-red-400 text-xs"></i>
                                </div>
                                <h3 className="text-sm font-black text-white tracking-wide">GÜVENLİK</h3>
                            </div>
                            <div className="p-5 space-y-3">

                                {/* 2FA */}
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                            <i className="fa-solid fa-mobile-screen-button text-emerald-400 text-sm"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white">İki Faktörlü Doğrulama</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">SMS veya authenticator ile ekstra güvenlik</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setTwoFaEnabled(!twoFaEnabled); showToast(twoFaEnabled ? '2FA devre dışı' : '2FA etkinleştirildi', 'success'); }}
                                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 shrink-0 ${twoFaEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${twoFaEnabled ? 'translate-x-7' : 'translate-x-1'}`}></div>
                                    </button>
                                </div>

                                {/* Change Password */}
                                <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] overflow-hidden">
                                    <button onClick={() => setShowPwFields(!showPwFields)}
                                        className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.03] transition-all">
                                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                                            <i className="fa-solid fa-key text-amber-400 text-sm"></i>
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-black text-white">Şifre Değiştir</p>
                                            <p className="text-[10px] text-slate-500">Son değişiklik: 30 gün önce</p>
                                        </div>
                                        <i className={`fa-solid fa-chevron-down text-slate-500 text-xs transition-transform duration-300 ${showPwFields ? 'rotate-180' : ''}`}></i>
                                    </button>
                                    {showPwFields && (
                                        <div className="px-4 pb-4 pt-1 border-t border-white/[0.05] space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="space-y-1.5">
                                                <label className={LABEL}>Mevcut Şifre</label>
                                                <div className="relative">
                                                    <input type={showPassword ? 'text' : 'password'} value={accountForm.currentPassword} onChange={e => setAccountForm({ ...accountForm, currentPassword: e.target.value })} className={INPUT} placeholder="••••••••" />
                                                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <label className={LABEL}>Yeni Şifre</label>
                                                    <input type="password" value={accountForm.newPassword} onChange={e => setAccountForm({ ...accountForm, newPassword: e.target.value })} className={INPUT} placeholder="••••••••" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className={LABEL}>Tekrar</label>
                                                    <input type="password" value={accountForm.confirmPassword} onChange={e => setAccountForm({ ...accountForm, confirmPassword: e.target.value })} className={INPUT} placeholder="••••••••" />
                                                </div>
                                            </div>
                                            {accountForm.newPassword && (
                                                <div className="space-y-1">
                                                    <div className="flex gap-1">
                                                        {[1,2,3,4].map(i => (
                                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${accountForm.newPassword.length >= i * 3 ? i <= 1 ? 'bg-red-500' : i <= 2 ? 'bg-amber-500' : i <= 3 ? 'bg-yellow-400' : 'bg-emerald-500' : 'bg-white/10'}`} />
                                                        ))}
                                                    </div>
                                                    <p className="text-[10px] text-slate-500">{accountForm.newPassword.length < 4 ? 'Çok zayıf' : accountForm.newPassword.length < 7 ? 'Zayıf' : accountForm.newPassword.length < 10 ? 'Orta' : 'Güçlü'}</p>
                                                </div>
                                            )}
                                            <div className="flex justify-end">
                                                <button onClick={() => {
                                                    if (!accountForm.currentPassword) { showToast('Mevcut şifreyi girin', 'error'); return; }
                                                    if (accountForm.newPassword !== accountForm.confirmPassword) { showToast('Şifreler eşleşmiyor', 'error'); return; }
                                                    if (accountForm.newPassword.length < 6) { showToast('En az 6 karakter gerekli', 'error'); return; }
                                                    showToast('Şifre güncellendi', 'success');
                                                    setAccountForm({ ...accountForm, currentPassword: '', newPassword: '', confirmPassword: '' });
                                                    setShowPwFields(false);
                                                }} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-transparent text-[11px] font-black transition-all">
                                                    <i className="fa-solid fa-key text-xs"></i> ŞİFREYİ GÜNCELLE
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Active Session */}
                                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                                            <i className="fa-solid fa-desktop text-violet-400 text-sm"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white">Aktif Oturumlar</p>
                                            <p className="text-[10px] text-slate-500">Bağlı cihazlar</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/[0.05] border border-emerald-500/10">
                                        <div className="flex items-center gap-2.5">
                                            <i className="fa-solid fa-display text-emerald-400 text-sm"></i>
                                            <div>
                                                <p className="text-xs font-black text-white">Bu Cihaz</p>
                                                <p className="text-[10px] text-slate-500">Chrome · macOS · Şu an aktif</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.6)]"></div>
                                            <span className="text-[10px] text-emerald-400 font-bold">CANLI</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Notifications + Summary + Danger */}
                    <div className="space-y-5">

                        {/* Notifications */}
                        <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
                            <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <i className="fa-solid fa-bell text-blue-400 text-xs"></i>
                                </div>
                                <h3 className="text-sm font-black text-white tracking-wide">BİLDİRİMLER</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {[
                                    { key: 'notifyEmail', label: 'E-POSTA', desc: 'Yeni rezervasyon bildirimleri', icon: 'fa-envelope', color: 'text-blue-400' },
                                    { key: 'notifySms', label: 'SMS', desc: 'Acil durum uyarıları', icon: 'fa-comment-sms', color: 'text-emerald-400' },
                                    { key: 'notifySystem', label: 'PANEL İÇİ', desc: 'Anlık panel bildirimleri', icon: 'fa-bell', color: 'text-amber-400' },
                                ].map((item, idx, arr) => (
                                    <React.Fragment key={item.key}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <i className={`fa-solid ${item.icon} ${item.color} text-xs w-4 text-center`}></i>
                                                <div>
                                                    <p className="text-[11px] font-black text-white">{item.label}</p>
                                                    <p className="text-[10px] text-slate-600">{item.desc}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setAccountForm({ ...accountForm, [item.key]: !accountForm[item.key] })}
                                                className={`relative w-10 h-5 rounded-full transition-colors duration-300 shrink-0 ${accountForm[item.key] ? 'bg-emerald-500' : 'bg-white/10'}`}>
                                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${accountForm[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                                            </button>
                                        </div>
                                        {idx < arr.length - 1 && <div className="h-px bg-white/[0.04]" />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Account Summary */}
                        <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
                            <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-[#c5a059]/10 flex items-center justify-center">
                                    <i className="fa-solid fa-chart-bar text-[#c5a059] text-xs"></i>
                                </div>
                                <h3 className="text-sm font-black text-white tracking-wide">HESAP ÖZETİ</h3>
                            </div>
                            <div className="p-4">
                                {[
                                    { label: 'Hesap Türü', value: 'Admin', icon: 'fa-crown', color: 'text-[#c5a059]' },
                                    { label: 'Panel Sürümü', value: 'v2.4.0', icon: 'fa-code-branch', color: 'text-violet-400' },
                                    { label: 'Aktif Kullanıcı', value: `${systemUsers.filter(u => u.status === 'Aktif').length}/${systemUsers.length}`, icon: 'fa-users', color: 'text-blue-400' },
                                    { label: 'Arayüz Dili', value: 'Türkçe', icon: 'fa-language', color: 'text-emerald-400' },
                                ].map((item, idx, arr) => (
                                    <React.Fragment key={item.label}>
                                        <div className="flex items-center justify-between py-2.5">
                                            <div className="flex items-center gap-2">
                                                <i className={`fa-solid ${item.icon} ${item.color} text-[10px] w-4 text-center`}></i>
                                                <span className="text-[11px] text-slate-500">{item.label}</span>
                                            </div>
                                            <span className="text-[11px] font-black text-white">{item.value}</span>
                                        </div>
                                        {idx < arr.length - 1 && <div className="h-px bg-white/[0.04]" />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="rounded-2xl border border-red-500/15 bg-gradient-to-br from-red-500/[0.05] to-transparent p-4">
                            <div className="flex items-center gap-2.5 mb-3">
                                <i className="fa-solid fa-triangle-exclamation text-red-400 text-sm"></i>
                                <h3 className="text-sm font-black text-red-400 tracking-wide">TEHLİKELİ BÖLGE</h3>
                            </div>
                            <p className="text-[10px] text-slate-600 mb-3 leading-relaxed">Bu işlemler geri alınamaz. Dikkatli olun.</p>
                            <div className="space-y-2">
                                <button onClick={() => { localStorage.clear(); showToast('Önbellek temizlendi', 'success'); }}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-amber-400 hover:border-amber-500/20 text-[11px] font-black transition-all">
                                    <i className="fa-solid fa-broom text-xs"></i> ÖNBELLEĞİ TEMİZLE
                                </button>
                                <button onClick={onExitAdmin}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-transparent text-[11px] font-black transition-all">
                                    <i className="fa-solid fa-power-off text-xs"></i> OTURUMU KAPAT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Users Tab ── */}
            {accountTab === 'users' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-400">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-lg font-black text-white flex items-center gap-2 tracking-wide">
                                <i className="fa-solid fa-users-gear text-indigo-400"></i> SİSTEM KULLANICILARI
                            </h3>
                            <p className="text-slate-500 text-xs mt-1">Admin paneline erişimi olan kişiler ve yetkileri</p>
                        </div>
                        <button onClick={() => setIsAddUserModalOpen(true)}
                            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-black text-[11px] tracking-wide shadow-lg shadow-indigo-900/30 transition-all">
                            <i className="fa-solid fa-user-plus"></i> YENİ KULLANICI
                        </button>
                    </div>

                    <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                                        <th className="px-5 py-3.5"><span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">KULLANICI</span></th>
                                        <th className="px-5 py-3.5"><span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">ROL</span></th>
                                        <th className="px-5 py-3.5 hidden md:table-cell"><span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">SON GİRİŞ</span></th>
                                        <th className="px-5 py-3.5 text-center"><span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">DURUM</span></th>
                                        <th className="px-5 py-3.5 w-20"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.04]">
                                    {systemUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-all group">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center shrink-0 text-slate-300 text-sm font-black">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-black text-[13px]">{user.name}</p>
                                                        <p className="text-slate-600 text-[10px]">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border ${!user.isDeletable ? 'bg-[#c5a059]/10 border-[#c5a059]/20 text-[#c5a059]' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                                                    {!user.isDeletable && <i className="fa-solid fa-crown mr-1"></i>}
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-[11px] text-slate-600 hidden md:table-cell">{user.lastLogin}</td>
                                            <td className="px-5 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Aktif' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]' : 'bg-slate-600'}`}></div>
                                                    <span className={`text-[10px] font-black ${user.status === 'Aktif' ? 'text-emerald-400' : 'text-slate-500'}`}>{user.status.toUpperCase()}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => {
                                                        setEditingUserId(user.id);
                                                        setNewUserForm({ name: user.name, email: user.email, role: user.role, password: '', confirmPassword: '' });
                                                        setIsAddUserModalOpen(true);
                                                    }} className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all">
                                                        <i className="fa-solid fa-pen text-[10px]"></i>
                                                    </button>
                                                    {user.isDeletable ? (
                                                        <button onClick={() => handleDeleteUser(user.id, user.isDeletable)} className="w-7 h-7 rounded-lg bg-white/[0.03] hover:bg-red-500/20 text-slate-600 hover:text-red-400 flex items-center justify-center transition-all">
                                                            <i className="fa-solid fa-trash text-[10px]"></i>
                                                        </button>
                                                    ) : (
                                                        <button disabled title="Silinemez" className="w-7 h-7 rounded-lg bg-white/[0.03] opacity-30 cursor-not-allowed text-slate-600 flex items-center justify-center">
                                                            <i className="fa-solid fa-lock text-[10px]"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountView;
