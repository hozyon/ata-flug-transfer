import React, { useRef, useState, useCallback } from 'react';
import { SiteContent, AdminAccountForm } from '../../../types';

const AI_LS_KEY = 'site_ai_api_key';

interface BusinessSettingsViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    accountForm: AdminAccountForm;
    setAccountForm: (form: AdminAccountForm) => void;
    onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<{ error: string | null }>;
    onExitAdmin: () => void;
    showToast: (message: string, type: 'success' | 'error' | 'info' | 'delete' | 'warning') => void;
}

const INPUT_CLS =
    'bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 focus:bg-white/[0.05] outline-none transition-all w-full font-semibold';

const LABEL_CLS = 'block text-[11px] font-[800] font-outfit uppercase tracking-[0.15em] text-slate-500 mb-2.5 ml-1';

const isValidEmail = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPhone = (v: string) => !v || /^\+?[\d\s\-()]{7,20}$/.test(v);

export const BusinessSettingsView: React.FC<BusinessSettingsViewProps> = ({ 
    editContent, setEditContent, accountForm, setAccountForm, onUpdatePassword, onExitAdmin, showToast 
}) => {
    const [logoDragOver, setLogoDragOver] = useState(false);
    const [showPwFields, setShowPwFields] = useState(false);
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [pwLoading, setPwLoading] = useState(false);
    
    const [aiApiKey, setAiApiKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem(AI_LS_KEY) || '' : ''));
    const [showAiKey, setShowAiKey] = useState(false);
    const aiSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleAiKeyChange = useCallback((val: string) => {
        setAiApiKey(val);
        if (aiSaveTimer.current) clearTimeout(aiSaveTimer.current);
        aiSaveTimer.current = setTimeout(() => {
            localStorage.setItem(AI_LS_KEY, val);
        }, 800);
    }, []);

    const biz = editContent.business;
    const brand = editContent.branding;

    const setBiz = (partial: Partial<typeof biz>) =>
        setEditContent({ ...editContent, business: { ...biz, ...partial } });

    const setBrand = (partial: Partial<NonNullable<typeof brand>>) =>
        setEditContent({
            ...editContent,
            branding: { primaryColor: '#c5a059', darkBg: '#0f172a', darkBgDeep: '#020617', ...brand, ...partial },
        });

    const readFile = (file: File, onResult: (dataUrl: string) => void) => {
        if (file.size > 2 * 1024 * 1024) {
            showToast('Dosya 2MB sınırını aşıyor.', 'error');
            return;
        }
        const r = new FileReader();
        r.onloadend = () => onResult(r.result as string);
        r.readAsDataURL(file);
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-10 pb-20">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-[#020617]/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent border border-[var(--color-primary)]/20 flex items-center justify-center shadow-inner group transition-transform duration-500 hover:scale-105">
                        <i className="fa-solid fa-briefcase text-[var(--color-primary)] text-2xl drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5"><h2 className="text-2xl font-[900] text-white tracking-tight">İşletme Ayarları</h2><span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">Global Control</span></div>
                        <p className="text-[13px] text-slate-400 font-medium">Şirket profili, sosyal medya, güvenlik ve marka ayarları</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                    {/* Şirket Kimliği & Sosyal Medya */}
                    <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[var(--color-primary)] shadow-inner font-black">
                                <i className="fa-solid fa-signature text-lg"></i>
                            </div>
                            <h3 className="text-lg font-[800] text-white tracking-tight">Şirket Kimliği & Sosyal Medya</h3>
                        </div>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div><label className={LABEL_CLS}>İşletme Adı</label><input className={INPUT_CLS} value={biz.name || ''} onChange={e => setBiz({ name: e.target.value })} placeholder="Şirket Tam Adı" /></div>
                                <div><label className={LABEL_CLS}>Resmi Telefon</label><input className={`${INPUT_CLS} ${biz.phone && !isValidPhone(biz.phone) ? 'border-red-500/40' : ''}`} value={biz.phone || ''} onChange={e => setBiz({ phone: e.target.value })} placeholder="+90 5XX XXX XX XX" type="tel" /></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div><label className={LABEL_CLS}>E-posta Adresi</label><input className={`${INPUT_CLS} ${biz.email && !isValidEmail(biz.email) ? 'border-red-500/40' : ''}`} value={biz.email || ''} onChange={e => setBiz({ email: e.target.value })} placeholder="info@sirketadi.com" type="email" /></div>
                                <div><label className={LABEL_CLS}>WhatsApp Destek</label><input className={INPUT_CLS} value={biz.whatsapp || ''} onChange={e => setBiz({ whatsapp: e.target.value })} placeholder="905XXXXXXXXX" /></div>
                            </div>
                            <div className="h-px bg-white/5 my-2" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div><label className={LABEL_CLS}>Instagram URL</label><input className={INPUT_CLS} value={biz.instagram || ''} onChange={e => setBiz({ instagram: e.target.value })} placeholder="instagram.com/kullanici" /></div>
                                <div><label className={LABEL_CLS}>Facebook URL</label><input className={INPUT_CLS} value={biz.facebook || ''} onChange={e => setBiz({ facebook: e.target.value })} placeholder="facebook.com/sayfa" /></div>
                                <div><label className={LABEL_CLS}>Telegram URL</label><input className={INPUT_CLS} value={biz.telegram || ''} onChange={e => setBiz({ telegram: e.target.value })} placeholder="t.me/kanal" /></div>
                            </div>
                            <div>
                                <label className={LABEL_CLS}>Adres</label>
                                <textarea className={`${INPUT_CLS} min-h-[80px] resize-none`} value={biz.address || ''} onChange={e => setBiz({ address: e.target.value })} placeholder="Şirket adresi..." />
                            </div>
                            <div>
                                <label className={LABEL_CLS}>Google Harita (Embed URL)</label>
                                <input className={INPUT_CLS} value={biz.mapEmbedUrl || ''} onChange={e => setBiz({ mapEmbedUrl: e.target.value })} placeholder="https://www.google.com/maps/embed?..." />
                            </div>
                        </div>
                    </div>

                    {/* Hesap & Güvenlik */}
                    <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner font-black"><i className="fa-solid fa-user-gear text-lg"></i></div>
                                <h3 className="text-lg font-[800] text-white tracking-tight">Hesap ve Güvenlik</h3>
                            </div>
                            <button onClick={onExitAdmin} className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-[10px] font-black transition-all">OTURUMU KAPAT</button>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div><label className={LABEL_CLS}>Yönetici Adı</label><input className={`${INPUT_CLS} opacity-40 cursor-not-allowed`} value={accountForm.fullName} disabled /></div>
                                <div><label className={LABEL_CLS}>Giriş E-postası</label><input className={INPUT_CLS} value={accountForm.email} onChange={e => setAccountForm({ ...accountForm, email: e.target.value })} placeholder="admin@ataflug.com" /></div>
                            </div>
                            <div className={`rounded-3xl border transition-all duration-500 ${showPwFields ? 'bg-white/[0.03] border-white/10 p-6' : 'bg-transparent border-white/[0.05] p-2'}`}>
                                <button onClick={() => setShowPwFields(!showPwFields)} className="w-full flex items-center justify-between gap-4 px-4 py-3">
                                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><i className="fa-solid fa-key text-sm"></i></div><span className="text-[13px] font-[800] text-white">Erişim Şifresini Güncelle</span></div>
                                    <i className={`fa-solid fa-chevron-down text-slate-600 text-xs transition-transform duration-500 ${showPwFields ? 'rotate-180' : ''}`}></i>
                                </button>
                                {showPwFields && (
                                    <div className="pt-6 space-y-5">
                                        <div className="relative">
                                            <input type={showCurrentPw ? 'text' : 'password'} value={accountForm.currentPassword} onChange={e => setAccountForm({ ...accountForm, currentPassword: e.target.value })} className={INPUT_CLS} placeholder="Mevcut Şifre" />
                                            <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"><i className={`fa-solid ${showCurrentPw ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i></button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                                            <input type={showNewPw ? 'text' : 'password'} value={accountForm.newPassword} onChange={e => setAccountForm({ ...accountForm, newPassword: e.target.value })} className={INPUT_CLS} placeholder="Yeni Şifre" />
                                            <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"><i className={`fa-solid ${showNewPw ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i></button>
                                        </div>
                                        <button disabled={pwLoading} onClick={async () => { if (!accountForm.currentPassword || !accountForm.newPassword) { showToast('Alanları doldurun', 'warning'); return; } setPwLoading(true); const { error } = await onUpdatePassword(accountForm.currentPassword, accountForm.newPassword); setPwLoading(false); if (error) showToast(error, 'error'); else { showToast('Şifre güncellendi', 'success'); setShowPwFields(false); } }}
                                            className="w-full py-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white font-black text-xs tracking-widest transition-all uppercase">{pwLoading ? 'GÜNCELLENİYOR...' : 'ŞİFREYİ KAYDET'}</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-8">
                    {/* Görsel Marka */}
                    <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden p-8 backdrop-blur-3xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black"><i className="fa-solid fa-palette text-lg"></i></div>
                            <h3 className="text-lg font-[800] text-white tracking-tight">Görsel Marka</h3>
                        </div>
                        <div className="space-y-6">
                            <div onDragOver={e => { e.preventDefault(); setLogoDragOver(true); }} onDragLeave={() => setLogoDragOver(false)} onDrop={e => { e.preventDefault(); setLogoDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) readFile(f, url => setBiz({ logo: url })); }}
                                className={`relative h-40 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all ${logoDragOver ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'}`}>
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, url => setBiz({ logo: url })); }} />
                                {biz.logo ? <img src={biz.logo} alt="Logo" className="max-w-[80%] max-h-[80%] object-contain" /> : <div className="text-center"><i className="fa-solid fa-cloud-arrow-up text-slate-700 text-3xl mb-2"></i><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logo Yükle</p></div>}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center p-3 relative group/fav">
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, url => setBrand({ favicon: url })); }} />
                                    {brand?.favicon ? <img src={brand.favicon} alt="Fav" className="w-full h-full object-contain" /> : <i className="fa-solid fa-star text-slate-800 text-xl"></i>}
                                </div>
                                <input className={`${INPUT_CLS} text-[11px] py-2.5`} value={brand?.favicon?.startsWith('data:') ? 'Yüklendi' : brand?.favicon || ''} onChange={e => setBrand({ favicon: e.target.value })} placeholder="Favicon URL" />
                            </div>
                        </div>
                    </div>

                    {/* AI Asistan */}
                    <div className="bg-violet-600/[0.08] border border-violet-500/20 rounded-[2.5rem] p-8 backdrop-blur-3xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-11 h-11 rounded-2xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-black"><i className="fa-solid fa-robot text-lg"></i></div>
                            <h3 className="text-lg font-[800] text-white tracking-tight">AI Asistan</h3>
                        </div>
                        <div className="relative group/ai">
                            <input type={showAiKey ? 'text' : 'password'} value={aiApiKey} onChange={e => handleAiKeyChange(e.target.value)} className={`${INPUT_CLS} !border-violet-500/20 focus:!border-violet-500/50 pr-12 text-xs font-mono`} placeholder="sk-ant-..." />
                            <button onClick={() => setShowAiKey(!showAiKey)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"><i className={`fa-solid ${showAiKey ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
