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

export const AccountView: React.FC<AccountViewProps> = ({
    accountForm,
    setAccountForm,
    accountTab,
    setAccountTab,
    ADMIN_AVATARS,
    showToast,
    onExitAdmin,
    systemUsers,
    setIsAddUserModalOpen,
    setEditingUserId,
    setNewUserForm,
    handleDeleteUser
}) => {
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [twoFaEnabled, setTwoFaEnabled] = useState(false);

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 max-w-5xl mx-auto space-y-5">
            {/* Header Box */}
            <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] relative overflow-visible z-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="relative group shrink-0 self-start md:self-center z-50">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#c5a059] to-amber-600 p-1 shadow-2xl relative cursor-pointer">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-4 border-[#020617] relative overflow-hidden">
                            <img src={accountForm.avatar} alt="Admin" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-1 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm pointer-events-none">
                            <i className="fa-solid fa-pen text-xl"></i>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-3 border-[#020617] flex items-center justify-center">
                            <i className="fa-solid fa-check text-white text-[8px]"></i>
                        </div>
                    </div>
                    {/* Dropdown Avatar Selection */}
                    <div className="absolute top-full left-0 mt-4 w-[340px] p-5 rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
                        <div className="absolute -top-2 left-12 w-4 h-4 bg-slate-900/95 border-t border-l border-white/10 rotate-45 backdrop-blur-2xl z-[-1]"></div>
                        <p className="text-[11px] items-center gap-2 font-bold text-slate-400 uppercase tracking-widest mb-4 flex justify-center"><i className="fa-solid fa-robot text-[#c5a059]"></i> Dijital Avatar</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {ADMIN_AVATARS.map((avatar, idx) => (
                                <button key={idx} onClick={() => setAccountForm({ ...accountForm, avatar })}
                                    className={`w-12 h-12 shrink-0 rounded-full overflow-hidden border-2 transition-all hover:scale-110 shadow-lg ${accountForm.avatar === avatar ? 'border-[#c5a059] shadow-lg shadow-[#c5a059]/40 scale-110 z-10 ring-4 ring-black/50' : 'border-white/5 opacity-70 hover:opacity-100'}`}>
                                    <img src={avatar} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center flex-1">
                    <h2 className="text-2xl lg:text-3xl font-black text-white">{accountForm.fullName}</h2>
                    <p className="text-[#c5a059] text-sm font-medium mb-2">Sistem Yöneticisi</p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1.5">
                            <i className="fa-solid fa-check-circle"></i> E-posta Onaylı
                        </span>
                        <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center gap-1.5">
                            <i className="fa-solid fa-shield-halved"></i> Tam Yetki
                        </span>
                        <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold flex items-center gap-1.5">
                            <i className="fa-solid fa-clock"></i> Son giriş: 2 dk önce
                        </span>
                    </div>
                </div>
                <div className="flex md:flex-col gap-2 shrink-0 self-start">
                    <button onClick={onExitAdmin} className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center gap-2 font-bold text-xs transition-all">
                        <i className="fa-solid fa-power-off"></i> Çıkış
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit backdrop-blur-xl">
                {[
                    { id: 'profile' as const, label: 'Profil & Güvenlik', icon: 'fa-user-shield', color: 'from-[#c5a059] to-amber-600' },
                    { id: 'users' as const, label: 'Kullanıcı Yönetimi', icon: 'fa-users-gear', color: 'from-indigo-500 to-purple-600' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setAccountTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${accountTab === tab.id
                            ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                            : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                        <i className={`fa-solid ${tab.icon} text-xs`}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {accountTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sol Kolon */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Kişisel Bilgiler */}
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#c5a059]/10 flex items-center justify-center">
                                        <i className="fa-solid fa-id-card text-[#c5a059] text-sm"></i>
                                    </div>
                                    <h3 className="text-white font-bold">Kişisel Bilgiler</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Ad Soyad</label>
                                        <input type="text" value={accountForm.fullName} onChange={e => setAccountForm({ ...accountForm, fullName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] transition-all outline-none" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">E-posta</label>
                                        <input type="email" value={accountForm.email} onChange={e => setAccountForm({ ...accountForm, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] transition-all outline-none" />
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Telefon</label>
                                        <div className="relative">
                                            <i className="fa-solid fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                                            <input type="text" value={accountForm.phone} onChange={e => setAccountForm({ ...accountForm, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] transition-all outline-none" placeholder="+90 555 555 5555" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <button onClick={() => showToast('Kişisel bilgiler güncellendi', 'success')} className="bg-[#c5a059] hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2">
                                        <i className="fa-solid fa-save text-xs"></i> Kaydet
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Güvenlik & Şifre */}
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
                                        <i className="fa-solid fa-lock text-red-400 text-sm"></i>
                                    </div>
                                    <h3 className="text-white font-bold">Güvenlik</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-5">
                                {/* 2FA Toggle */}
                                <label className="flex items-center justify-between cursor-pointer group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                            <i className="fa-solid fa-shield-halved text-emerald-400"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-white text-sm font-bold">İki Faktörlü Doğrulama (2FA)</h4>
                                            <p className="text-[11px] text-slate-400">Ekstra güvenlik katmanı ekleyin.</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only" checked={twoFaEnabled} onChange={() => { setTwoFaEnabled(!twoFaEnabled); showToast(twoFaEnabled ? '2FA devre dışı bırakıldı' : '2FA etkinleştirildi', 'success'); }} />
                                        <div className={`block w-11 h-6 rounded-full transition-colors duration-300 ${twoFaEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
                                        <div className={`absolute left-1 top-1 bg-white shadow-sm w-4 h-4 rounded-full transition-transform duration-300 ${twoFaEnabled ? 'translate-x-5' : ''}`}></div>
                                    </div>
                                </label>

                                {/* Change Password */}
                                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                    <button onClick={() => setShowPasswordSection(!showPasswordSection)} className="flex items-center justify-between w-full group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                                <i className="fa-solid fa-key text-amber-400"></i>
                                            </div>
                                            <div className="text-left">
                                                <h4 className="text-white text-sm font-bold">Şifre Değiştir</h4>
                                                <p className="text-[11px] text-slate-400">Son değişiklik: 30 gün önce</p>
                                            </div>
                                        </div>
                                        <i className={`fa-solid fa-chevron-down text-slate-500 text-xs transition-transform duration-300 ${showPasswordSection ? 'rotate-180' : ''}`}></i>
                                    </button>
                                    {showPasswordSection && (
                                        <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Mevcut Şifre</label>
                                                <input type="password" value={accountForm.currentPassword} onChange={e => setAccountForm({ ...accountForm, currentPassword: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#c5a059] outline-none" placeholder="••••••••" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Yeni Şifre</label>
                                                    <input type="password" value={accountForm.newPassword} onChange={e => setAccountForm({ ...accountForm, newPassword: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#c5a059] outline-none" placeholder="••••••••" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Şifre Tekrar</label>
                                                    <input type="password" value={accountForm.confirmPassword} onChange={e => setAccountForm({ ...accountForm, confirmPassword: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#c5a059] outline-none" placeholder="••••••••" />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button onClick={() => {
                                                    if (!accountForm.currentPassword) { showToast('Mevcut şifrenizi girin', 'error'); return; }
                                                    if (accountForm.newPassword !== accountForm.confirmPassword) { showToast('Şifreler eşleşmiyor', 'error'); return; }
                                                    if (accountForm.newPassword.length < 6) { showToast('Şifre en az 6 karakter olmalı', 'error'); return; }
                                                    showToast('Şifre başarıyla değiştirildi', 'success');
                                                    setAccountForm({ ...accountForm, currentPassword: '', newPassword: '', confirmPassword: '' });
                                                    setShowPasswordSection(false);
                                                }} className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2">
                                                    <i className="fa-solid fa-key text-xs"></i> Şifreyi Güncelle
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Active Sessions */}
                                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                            <i className="fa-solid fa-desktop text-violet-400"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-white text-sm font-bold">Aktif Oturumlar</h4>
                                            <p className="text-[11px] text-slate-400">Hesabınıza bağlı olan cihazlar.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                            <div className="flex items-center gap-3">
                                                <i className="fa-solid fa-display text-emerald-400 text-sm"></i>
                                                <div>
                                                    <p className="text-xs font-bold text-white">Bu cihaz</p>
                                                    <p className="text-[10px] text-slate-500">Chrome · macOS · Şu an aktif</p>
                                                </div>
                                            </div>
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sağ Kolon */}
                    <div className="space-y-6">
                        {/* Bildirim Tercihleri */}
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <i className="fa-solid fa-bell text-blue-400 text-sm"></i>
                                </div>
                                <h3 className="text-white font-bold">Bildirimler</h3>
                            </div>
                            <div className="p-5 space-y-4">
                                {[
                                    { key: 'notifyEmail', label: 'E-posta', desc: 'Yeni rezervasyonlar ve uyarılar', icon: 'fa-envelope', color: 'text-blue-400' },
                                    { key: 'notifySms', label: 'SMS', desc: 'Acil durumlarda telefona bildirim', icon: 'fa-comment-sms', color: 'text-emerald-400' },
                                    { key: 'notifySystem', label: 'Panel İçi', desc: 'Admin panelde anlık uyarılar', icon: 'fa-bell', color: 'text-amber-400' },
                                ].map((item, idx) => (
                                    <React.Fragment key={item.key}>
                                        {idx > 0 && <div className="h-px bg-white/5"></div>}
                                        <label className="flex items-center justify-between cursor-pointer group">
                                            <div className="flex items-center gap-3">
                                                <i className={`fa-solid ${item.icon} ${item.color} text-sm w-5 text-center`}></i>
                                                <div>
                                                    <h4 className="text-white text-sm font-bold">{item.label}</h4>
                                                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <input type="checkbox" className="sr-only" checked={accountForm[item.key]} onChange={() => setAccountForm({ ...accountForm, [item.key]: !accountForm[item.key] })} />
                                                <div className={`block w-10 h-6 rounded-full transition-colors duration-300 ${accountForm[item.key] ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
                                                <div className={`absolute left-1 top-1 bg-white shadow-sm w-4 h-4 rounded-full transition-transform duration-300 ${accountForm[item.key] ? 'translate-x-4' : ''}`}></div>
                                            </div>
                                        </label>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Hızlı İstatistikler */}
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-[#c5a059]/10 flex items-center justify-center">
                                    <i className="fa-solid fa-chart-simple text-[#c5a059] text-sm"></i>
                                </div>
                                <h3 className="text-white font-bold">Hesap Özeti</h3>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { label: 'Hesap Türü', value: 'Yönetici (Admin)', icon: 'fa-crown', color: 'text-[#c5a059]' },
                                    { label: 'Panel Sürümü', value: 'v2.4.0', icon: 'fa-code-branch', color: 'text-violet-400' },
                                    { label: 'Aktif Kullanıcılar', value: `${systemUsers.filter(u => u.status === 'Aktif').length} / ${systemUsers.length}`, icon: 'fa-users', color: 'text-blue-400' },
                                    { label: 'Dil', value: 'Türkçe', icon: 'fa-language', color: 'text-emerald-400' },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-2.5">
                                            <i className={`fa-solid ${item.icon} ${item.color} text-xs w-4 text-center`}></i>
                                            <span className="text-xs text-slate-400">{item.label}</span>
                                        </div>
                                        <span className="text-xs font-bold text-white">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/10 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                                    <i className="fa-solid fa-triangle-exclamation text-red-400 text-sm"></i>
                                </div>
                                <h3 className="text-red-400 font-bold text-sm">Tehlikeli Bölge</h3>
                            </div>
                            <p className="text-[11px] text-slate-500 mb-4">Bu işlemler geri alınamaz. Dikkatli olun.</p>
                            <div className="space-y-2">
                                <button onClick={() => { localStorage.clear(); showToast('Tüm önbellek temizlendi', 'success'); }} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-amber-400 hover:border-amber-500/20 text-xs font-bold transition-all flex items-center gap-2">
                                    <i className="fa-solid fa-broom text-xs"></i> Önbelleği Temizle
                                </button>
                                <button onClick={onExitAdmin} className="w-full px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold transition-all flex items-center gap-2">
                                    <i className="fa-solid fa-power-off text-xs"></i> Oturumu Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Tab */}
            {accountTab === 'users' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <i className="fa-solid fa-users text-indigo-400"></i>
                                Sistem Kullanıcıları
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">Admin paneline erişimi olan kişileri ve yetkilerini yönetin.</p>
                        </div>
                        <button onClick={() => setIsAddUserModalOpen(true)}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
                            <i className="fa-solid fa-user-plus"></i> Yeni Kullanıcı
                        </button>
                    </div>

                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/[0.04] bg-white/[0.02]">
                                        <th className="px-5 py-3 text-left"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kullanıcı</span></th>
                                        <th className="px-5 py-3 text-left"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rol / Yetki</span></th>
                                        <th className="px-5 py-3 text-left hidden md:table-cell"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Son Giriş</span></th>
                                        <th className="px-5 py-3 text-center"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Durum</span></th>
                                        <th className="px-5 py-3 w-24"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {systemUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-all group">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                                                        <i className="fa-solid fa-user text-slate-400"></i>
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-bold text-[13px]">{user.name}</p>
                                                        <p className="text-slate-500 text-[11px]">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${!user.isDeletable ? 'bg-[#c5a059]/10 border-[#c5a059]/20 text-[#c5a059]' : 'bg-slate-500/10 border-slate-500/20 text-slate-300'}`}>
                                                    {!user.isDeletable && <i className="fa-solid fa-crown mr-1.5"></i>}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-[11px] text-slate-500 hidden md:table-cell">{user.lastLogin}</td>
                                            <td className="px-5 py-3.5 text-center">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${user.status === 'Aktif' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`}></div>
                                                    <span className="text-sm text-slate-300 font-medium">{user.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => {
                                                        setEditingUserId(user.id);
                                                        setNewUserForm({ name: user.name, email: user.email, role: user.role, password: '', confirmPassword: '' });
                                                        setIsAddUserModalOpen(true);
                                                    }} className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all">
                                                        <i className="fa-solid fa-pen text-xs"></i>
                                                    </button>
                                                    {user.isDeletable ? (
                                                        <button onClick={() => handleDeleteUser(user.id, user.isDeletable)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 flex items-center justify-center transition-all">
                                                            <i className="fa-solid fa-trash text-xs"></i>
                                                        </button>
                                                    ) : (
                                                        <button disabled className="w-7 h-7 rounded-lg bg-white/5 opacity-30 cursor-not-allowed text-slate-500 flex items-center justify-center relative group/btn">
                                                            <i className="fa-solid fa-lock text-xs"></i>
                                                            <div className="absolute bottom-full right-0 mb-2 w-max px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible transition-all shadow-xl border border-white/10 z-50">Silinemez</div>
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
