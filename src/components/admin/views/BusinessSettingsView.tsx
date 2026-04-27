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
    showToast: (message: string, type: string) => void;
}

const INPUT_CLS = 'w-full bg-white/40 backdrop-blur-xl border border-white rounded-2xl px-8 py-4 text-sm font-bold text-slate-900 placeholder-slate-300 focus:bg-white focus:shadow-xl transition-all duration-500 outline-none shadow-sm';
const LABEL_CLS = 'block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3 ml-2';

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
        aiSaveTimer.current = setTimeout(() => { localStorage.setItem(AI_LS_KEY, val); }, 800);
    }, []);

    const biz = editContent.business;
    const brand = editContent.branding;
    const setBiz = (p: Partial<typeof biz>) => setEditContent({ ...editContent, business: { ...biz, ...p } });
    const setBrand = (p: Partial<NonNullable<typeof brand>>) => setEditContent({ ...editContent, branding: { primaryColor: '#c5a059', darkBg: '#0f172a', darkBgDeep: '#020617', ...brand, ...p } });

    const readFile = (file: File, onResult: (url: string) => void) => {
        if (file.size > 2 * 1024 * 1024) { showToast('Dosya 2MB sınırını aşıyor.', 'error'); return; }
        const r = new FileReader(); r.onloadend = () => onResult(r.result as string); r.readAsDataURL(file);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000 ease-out pb-20 max-w-7xl mx-auto">
            <div className="admin-glass-panel rounded-[3rem] p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm transition-transform hover:scale-105 duration-500"><i className="fa-solid fa-briefcase text-xl"></i></div>
                    <div><h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">İşletme & Hesap</h2><p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.25em] mt-2">KONTROL VE YÖNETİM MERKEZİ</p></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    <div className="admin-glass-panel rounded-[3.5rem] p-10 shadow-sm">
                        <div className="flex items-center gap-5 mb-12"><div className="w-12 h-12 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-gold shadow-2xl"><i className="fa-solid fa-signature text-lg"></i></div><div><h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Şirket Kimliği</h3><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">RESMİ BİLGİLER</p></div></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                            <div><label className={LABEL_CLS}>İşletme Adı</label><input className={INPUT_CLS} value={biz.name || ''} onChange={e => setBiz({ name: e.target.value })} /></div>
                            <div><label className={LABEL_CLS}>Resmi Telefon</label><input className={`${INPUT_CLS} ${biz.phone && !isValidPhone(biz.phone) ? 'border-rose-300' : ''}`} value={biz.phone || ''} onChange={e => setBiz({ phone: e.target.value })} type="tel" /></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                            <div><label className={LABEL_CLS}>E-posta Adresi</label><input className={`${INPUT_CLS} ${biz.email && !isValidEmail(biz.email) ? 'border-rose-300' : ''}`} value={biz.email || ''} onChange={e => setBiz({ email: e.target.value })} type="email" /></div>
                            <div><label className={LABEL_CLS}>WhatsApp Destek</label><input className={INPUT_CLS} value={biz.whatsapp || ''} onChange={e => setBiz({ whatsapp: e.target.value })} /></div>
                        </div>
                        <div className="space-y-4 pt-10"><div className="flex items-center gap-4"><div className="h-px flex-1 bg-slate-100"></div><span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Sosyal Medya Kanalları</span><div className="h-px flex-1 bg-slate-100"></div></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                            <div><label className={LABEL_CLS}>Instagram</label><input className={INPUT_CLS} value={biz.instagram || ''} onChange={e => setBiz({ instagram: e.target.value })} /></div>
                            <div><label className={LABEL_CLS}>Facebook</label><input className={INPUT_CLS} value={biz.facebook || ''} onChange={e => setBiz({ facebook: e.target.value })} /></div>
                            <div><label className={LABEL_CLS}>Telegram</label><input className={INPUT_CLS} value={biz.telegram || ''} onChange={e => setBiz({ telegram: e.target.value })} /></div>
                        </div></div>
                    </div>

                    <div className="admin-glass-panel rounded-[3.5rem] p-10 shadow-sm">
                        <div className="flex items-center justify-between mb-12"><div className="flex items-center gap-5"><div className="w-12 h-12 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm"><i className="fa-solid fa-user-gear text-lg"></i></div><div><h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Hesap Güvenliği</h3><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">ERİŞİM KONTROLÜ</p></div></div><button onClick={onExitAdmin} className="px-6 py-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">Güvenli Çıkış</button></div>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div><label className={LABEL_CLS}>Yönetici İsmi</label><input className={`${INPUT_CLS} bg-slate-100/50 cursor-not-allowed`} value={accountForm.fullName} onChange={e => setAccountForm({ ...accountForm, fullName: e.target.value })} /></div>
                                <div><label className={LABEL_CLS}>Yönetici E-posta</label><input className={INPUT_CLS} value={accountForm.email} onChange={e => setAccountForm({ ...accountForm, email: e.target.value })} /></div>
                            </div>
                            <div className={`rounded-[2.5rem] border-2 border-dashed transition-all duration-700 overflow-hidden ${showPwFields ? 'border-amber-200 bg-amber-50/20 p-8' : 'border-slate-100 bg-slate-50/50 p-2'}`}>
                                <button onClick={() => setShowPwFields(!showPwFields)} className="w-full flex items-center justify-between gap-4 px-6 py-4">
                                    <div className="flex items-center gap-4"><div className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center text-amber-600"><i className="fa-solid fa-key"></i></div><span className="text-sm font-black text-slate-700 uppercase tracking-widest">Sistem Parolasını Değiştir</span></div>
                                    <i className={`fa-solid fa-chevron-down text-slate-300 transition-transform duration-700 ${showPwFields ? 'rotate-180' : ''}`}></i>
                                </button>
                                {showPwFields && (<div className="pt-10 space-y-6 animate-in slide-in-from-top-4 duration-500">
                                    <div className="relative"><input type={showCurrentPw ? 'text' : 'password'} value={accountForm.currentPassword} onChange={e => setAccountForm({ ...accountForm, currentPassword: e.target.value })} className={INPUT_CLS} placeholder="Mevcut Parola" /><button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-all"><i className={`fa-solid ${showCurrentPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i></button></div>
                                    <div className="relative"><input type={showNewPw ? 'text' : 'password'} value={accountForm.newPassword} onChange={e => setAccountForm({ ...accountForm, newPassword: e.target.value })} className={INPUT_CLS} placeholder="Yeni Güçlü Parola" /><button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-all"><i className={`fa-solid ${showNewPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i></button></div>
                                    <button disabled={pwLoading} onClick={async () => { if (!accountForm.currentPassword || !accountForm.newPassword) { showToast('Alanları doldurun', 'warning'); return; } setPwLoading(true); const { error } = await onUpdatePassword(accountForm.currentPassword, accountForm.newPassword); setPwLoading(false); if (error) showToast(error, 'error'); else { showToast('Şifre güncellendi', 'success'); setShowPwFields(false); } }}
                                        className="w-full py-5 rounded-[2rem] bg-slate-900 text-white font-black text-xs tracking-widest uppercase hover:bg-black active:scale-95 shadow-2xl shadow-slate-200">{pwLoading ? 'GÜNCELLENİYOR...' : 'YENİ ŞİFREYİ ONAYLA'}</button>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    <div className="admin-glass-panel rounded-[3.5rem] p-10 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center gap-5 mb-10"><div className="w-12 h-12 rounded-[1.5rem] bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm"><i className="fa-solid fa-palette text-lg"></i></div><div><h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Görsel Marka</h3><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">LOGO & İKON</p></div></div>
                        <div className="space-y-8">
                            <div onDragOver={e => { e.preventDefault(); setLogoDragOver(true); }} onDragLeave={() => setLogoDragOver(false)} onDrop={e => { e.preventDefault(); setLogoDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) readFile(f, url => setBiz({ logo: url })); }}
                                className={`relative h-56 rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-700 overflow-hidden ${logoDragOver ? 'border-gold bg-gold/5 shadow-inner scale-95' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-gold/30 hover:shadow-2xl shadow-sm'}`}>
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, url => setBiz({ logo: url })); }} />
                                {biz.logo ? (<div className="p-10 h-full w-full flex items-center justify-center"><img src={biz.logo} alt="Logo" className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110" /></div>) : (<div className="text-center group-hover:scale-105 transition-transform duration-700"><div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center mx-auto mb-6 text-slate-200 group-hover:text-gold"><i className="fa-solid fa-cloud-arrow-up text-2xl"></i></div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logo Yükle</p></div>)}
                            </div>
                            <div className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-slate-50/50 border border-white/60 shadow-sm relative group/fav">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center p-3 relative shrink-0 transition-transform duration-500 group-hover/fav:rotate-12 group-hover/fav:scale-110">
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, url => setBrand({ favicon: url })); }} />
                                    {brand?.favicon ? <img src={brand.favicon} alt="Fav" className="w-full h-full object-contain" /> : <i className="fa-solid fa-star text-gold opacity-30 text-xl"></i>}
                                </div>
                                <div className="min-w-0 flex-1"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Favicon</p><p className="text-[12px] text-slate-900 font-bold truncate tracking-tight">{brand?.favicon?.startsWith('data:') ? 'Özel Dosya' : 'Varsayılan'}</p></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 transition-all duration-1000 group-hover:bg-gold/20"></div>
                        <div className="relative z-10"><div className="flex items-center gap-5 mb-10"><div className="w-12 h-12 rounded-[1.5rem] bg-white/10 backdrop-blur-md flex items-center justify-center text-gold shadow-inner"><i className="fa-solid fa-wand-magic-sparkles text-lg"></i></div><div><h3 className="text-xl font-black text-white tracking-tight leading-none">AI Zekası</h3><p className="text-[10px] text-gold/60 font-black uppercase tracking-widest mt-1.5">ANTHROPIC ENGINE</p></div></div><div className="relative group/ai"><input type={showAiKey ? 'text' : 'password'} value={aiApiKey} onChange={e => handleAiKeyChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-5 text-xs text-white placeholder-slate-600 outline-none focus:bg-white/10 focus:border-gold/40 transition-all font-mono" placeholder="sk-ant-..." /><button onClick={() => setShowAiKey(!showAiKey)} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors active:scale-90"><i className={`fa-solid ${showAiKey ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i></button></div><p className="text-[11px] text-slate-500 mt-6 font-medium leading-relaxed italic opacity-80">Akıllı blog yazarı ve içerik otomasyonu için API anahtarınızı buraya güvenle tanımlayın.</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
