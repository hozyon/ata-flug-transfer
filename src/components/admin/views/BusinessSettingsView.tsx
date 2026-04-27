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
    'bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm text-slate-900 font-bold placeholder-slate-300 focus:bg-white focus:border-gold/40 focus:ring-4 focus:ring-gold/5 outline-none transition-all w-full';

const LABEL_CLS = 'block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 ml-1';

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
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center group transition-transform duration-500 hover:scale-105 shadow-sm shadow-amber-100/50">
                        <i className="fa-solid fa-briefcase text-amber-500 text-2xl"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">İşletme Ayarları</h2>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Settings</span>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium">Şirket profili, sosyal medya, güvenlik ve marka ayarları</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    {/* Şirket Kimliği & Sosyal Medya */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-gold shadow-sm font-black">
                                <i className="fa-solid fa-signature text-lg"></i>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Şirket Bilgileri</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">PROFİL VE İLETİŞİM</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div><label className={LABEL_CLS}>İşletme Adı</label><input className={INPUT_CLS} value={biz.name || ''} onChange={e => setBiz({ name: e.target.value })} placeholder="Şirket Tam Adı" /></div>
                                <div><label className={LABEL_CLS}>Resmi Telefon</label><input className={`${INPUT_CLS} ${biz.phone && !isValidPhone(biz.phone) ? 'border-red-300 bg-red-50/30' : ''}`} value={biz.phone || ''} onChange={e => setBiz({ phone: e.target.value })} placeholder="+90 5XX XXX XX XX" type="tel" /></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div><label className={LABEL_CLS}>E-posta Adresi</label><input className={`${INPUT_CLS} ${biz.email && !isValidEmail(biz.email) ? 'border-red-300 bg-red-50/30' : ''}`} value={biz.email || ''} onChange={e => setBiz({ email: e.target.value })} placeholder="info@sirketadi.com" type="email" /></div>
                                <div><label className={LABEL_CLS}>WhatsApp Destek</label><input className={INPUT_CLS} value={biz.whatsapp || ''} onChange={e => setBiz({ whatsapp: e.target.value })} placeholder="905XXXXXXXXX" /></div>
                            </div>
                            
                            <div className="pt-4">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="h-px flex-1 bg-slate-50"></div>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Sosyal Medya</span>
                                    <div className="h-px flex-1 bg-slate-50"></div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div><label className={LABEL_CLS}>Instagram</label><input className={INPUT_CLS} value={biz.instagram || ''} onChange={e => setBiz({ instagram: e.target.value })} placeholder="kullaniciadi" /></div>
                                    <div><label className={LABEL_CLS}>Facebook</label><input className={INPUT_CLS} value={biz.facebook || ''} onChange={e => setBiz({ facebook: e.target.value })} placeholder="sayfaadi" /></div>
                                    <div><label className={LABEL_CLS}>Telegram</label><input className={INPUT_CLS} value={biz.telegram || ''} onChange={e => setBiz({ telegram: e.target.value })} placeholder="kanaladi" /></div>
                                </div>
                            </div>

                            <div>
                                <label className={LABEL_CLS}>Adres Bilgisi</label>
                                <textarea className={`${INPUT_CLS} min-h-[100px] resize-none leading-relaxed`} value={biz.address || ''} onChange={e => setBiz({ address: e.target.value })} placeholder="Şirket adresi..." />
                            </div>
                            <div>
                                <label className={LABEL_CLS}>Google Harita (Embed URL)</label>
                                <div className="relative">
                                    <i className="fa-solid fa-map-pin absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
                                    <input className={`${INPUT_CLS} pl-12`} value={biz.mapEmbedUrl || ''} onChange={e => setBiz({ mapEmbedUrl: e.target.value })} placeholder="https://www.google.com/maps/embed?..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hesap & Güvenlik */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm font-black"><i className="fa-solid fa-user-gear text-lg"></i></div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Hesap ve Güvenlik</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">YÖNETİCİ ERİŞİMİ</p>
                                </div>
                            </div>
                            <button onClick={onExitAdmin} className="px-6 py-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white text-[10px] font-black transition-all uppercase tracking-widest">Güvenli Çıkış</button>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div><label className={LABEL_CLS}>Yönetici Adı</label><input className={`${INPUT_CLS} bg-slate-100/50 cursor-not-allowed text-slate-400`} value={accountForm.fullName} disabled /></div>
                                <div><label className={LABEL_CLS}>Giriş E-postası</label><input className={INPUT_CLS} value={accountForm.email} onChange={e => setAccountForm({ ...accountForm, email: e.target.value })} placeholder="admin@ataflug.com" /></div>
                            </div>
                            
                            <div className={`rounded-[2rem] border transition-all duration-500 overflow-hidden ${showPwFields ? 'bg-slate-50 border-slate-200 p-6' : 'bg-white border-slate-100 p-2'}`}>
                                <button onClick={() => setShowPwFields(!showPwFields)} className="w-full flex items-center justify-between gap-4 px-5 py-4">
                                    <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm"><i className="fa-solid fa-key text-sm"></i></div><span className="text-sm font-bold text-slate-700 uppercase tracking-widest">Şifre Değiştir</span></div>
                                    <i className={`fa-solid fa-chevron-down text-slate-300 text-xs transition-transform duration-500 ${showPwFields ? 'rotate-180' : ''}`}></i>
                                </button>
                                {showPwFields && (
                                    <div className="pt-6 space-y-5 animate-in slide-in-from-top-4">
                                        <div className="relative group">
                                            <input type={showCurrentPw ? 'text' : 'password'} value={accountForm.currentPassword} onChange={e => setAccountForm({ ...accountForm, currentPassword: e.target.value })} className={INPUT_CLS} placeholder="Mevcut Şifre" />
                                            <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"><i className={`fa-solid ${showCurrentPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i></button>
                                        </div>
                                        <div className="relative group">
                                            <input type={showNewPw ? 'text' : 'password'} value={accountForm.newPassword} onChange={e => setAccountForm({ ...accountForm, newPassword: e.target.value })} className={INPUT_CLS} placeholder="Yeni Şifre" />
                                            <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"><i className={`fa-solid ${showNewPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i></button>
                                        </div>
                                        <button disabled={pwLoading} onClick={async () => { if (!accountForm.currentPassword || !accountForm.newPassword) { showToast('Alanları doldurun', 'warning'); return; } setPwLoading(true); const { error } = await onUpdatePassword(accountForm.currentPassword, accountForm.newPassword); setPwLoading(false); if (error) showToast(error, 'error'); else { showToast('Şifre güncellendi', 'success'); setShowPwFields(false); } }}
                                            className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-xs tracking-[0.2em] transition-all uppercase hover:bg-black active:scale-95 shadow-lg shadow-slate-200">{pwLoading ? 'İŞLENİYOR...' : 'ŞİFREYİ GÜNCELLE'}</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    {/* Marka Kimliği */}
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm font-black"><i className="fa-solid fa-palette text-lg"></i></div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Görsel Marka</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">LOGO & FAVICON</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div onDragOver={e => { e.preventDefault(); setLogoDragOver(true); }} onDragLeave={() => setLogoDragOver(false)} onDrop={e => { e.preventDefault(); setLogoDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) readFile(f, url => setBiz({ logo: url })); }}
                                className={`relative h-44 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-500 overflow-hidden ${logoDragOver ? 'border-gold bg-gold/5 shadow-inner' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-gold/30 hover:shadow-xl hover:shadow-slate-100'}`}>
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, url => setBiz({ logo: url })); }} />
                                {biz.logo ? (
                                    <div className="p-6 h-full w-full flex items-center justify-center">
                                        <img src={biz.logo} alt="Logo" className="max-w-full max-h-full object-contain drop-shadow-md" />
                                    </div>
                                ) : (
                                    <div className="text-center group">
                                        <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4 text-slate-300 group-hover:scale-110 group-hover:text-gold transition-all duration-500"><i className="fa-solid fa-cloud-arrow-up text-xl"></i></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logo Dosyasını Bırakın</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-[2rem] bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center p-2 relative shrink-0 group/fav">
                                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, url => setBrand({ favicon: url })); }} />
                                    {brand?.favicon ? <img src={brand.favicon} alt="Fav" className="w-full h-full object-contain" /> : <i className="fa-solid fa-star text-slate-200 text-lg"></i>}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Favicon</p>
                                    <p className="text-[11px] text-slate-900 font-bold truncate">{brand?.favicon?.startsWith('data:') ? 'Özel Görsel Yüklendi' : brand?.favicon || 'Varsayılan'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Asistan */}
                    <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-1000"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner font-black"><i className="fa-solid fa-wand-magic-sparkles text-lg"></i></div>
                                <div>
                                    <h3 className="text-lg font-black text-white tracking-tight leading-none">AI Asistan</h3>
                                    <p className="text-[10px] text-indigo-100/60 font-bold uppercase tracking-widest mt-1">API CONFIGURATION</p>
                                </div>
                            </div>
                            <div className="relative">
                                <input type={showAiKey ? 'text' : 'password'} value={aiApiKey} onChange={e => handleAiKeyChange(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-xs text-white placeholder-indigo-200/50 outline-none focus:bg-white/20 focus:border-white/40 transition-all font-mono" placeholder="sk-ant-..." />
                                <button onClick={() => setShowAiKey(!showAiKey)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"><i className={`fa-solid ${showAiKey ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i></button>
                            </div>
                            <p className="text-[10px] text-indigo-100/60 mt-4 font-medium leading-relaxed italic">Blog yazıları ve içerik üretimi için Anthropic API anahtarınızı buraya girin.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
