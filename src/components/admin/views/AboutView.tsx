import React from 'react';
import { RichTextEditor } from '../RichTextEditor';
import { SiteContent } from '../../../types';

interface AboutViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    _confirmAction: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ editContent, setEditContent }) => {
    const LABEL_CLS = 'block text-[11px] font-[800] font-outfit uppercase tracking-[0.15em] text-slate-500 mb-2.5 ml-1';
    const INPUT_CLS = 'bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 focus:bg-white/[0.05] outline-none transition-all w-full font-semibold';

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-8 pb-10">
            {/* Header / Stats — Elite Style */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-[#020617]/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-transparent border border-indigo-500/20 flex items-center justify-center shadow-inner group transition-transform duration-500 hover:scale-105">
                        <i className="fa-solid fa-building text-indigo-400 text-2xl group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-2xl font-[900] text-white tracking-tight">Hakkımızda Sayfası</h2>
                            <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Company</span>
                        </div>
                        <p className="text-[13px] text-slate-400 font-medium">Şirket geçmişi ve tecrübe bilgilerini yönetin</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center font-[900] text-[var(--color-primary)] shadow-inner">
                                <i className="fa-solid fa-align-left text-lg"></i>
                            </div>
                            <h3 className="text-lg font-[800] text-white tracking-tight">İçerik Detayları</h3>
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className={LABEL_CLS}>SAYFA BAŞLIĞI</label>
                                    <input className={INPUT_CLS} value={editContent.about.title || ''} onChange={e => setEditContent({ ...editContent, about: { ...editContent.about, title: e.target.value } })} placeholder="Örn: Biz Kimiz?" />
                                </div>
                                <div>
                                    <label className={LABEL_CLS}>TECRÜBE YILI</label>
                                    <input className={INPUT_CLS} value={editContent.about.experienceYear || ''} onChange={e => setEditContent({ ...editContent, about: { ...editContent.about, experienceYear: e.target.value } })} placeholder="Örn: 15+ Yıl" />
                                </div>
                            </div>

                            <div>
                                <label className={LABEL_CLS}>ANA METİN (HAKKIMIZDA)</label>
                                <RichTextEditor value={editContent.about.content || ''} onChange={v => setEditContent({ ...editContent, about: { ...editContent.about, content: v } })} placeholder="Şirket hikayenizi anlatın..." minRows={12} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column: Image */}
                <div className="lg:col-span-4">
                    <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center font-[900] text-indigo-400 shadow-inner">
                                <i className="fa-solid fa-image text-lg"></i>
                            </div>
                            <h3 className="text-lg font-[800] text-white tracking-tight">Tanıtım Görseli</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 relative group">
                                {editContent.about.image ? (
                                    <>
                                        <img src={editContent.about.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Hakkımızda" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                            <label className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[var(--color-primary)] text-white flex items-center justify-center cursor-pointer transition-all active:scale-90 shadow-lg">
                                                <i className="fa-solid fa-camera text-sm"></i>
                                                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setEditContent({ ...editContent, about: { ...editContent.about, image: ev.target?.result as string } }); r.readAsDataURL(f); } }} />
                                            </label>
                                            <button onClick={() => setEditContent({ ...editContent, about: { ...editContent.about, image: '' } })} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-rose-500 text-white flex items-center justify-center transition-all active:scale-90 shadow-lg">
                                                <i className="fa-solid fa-trash-can text-sm"></i>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <label className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors border-2 border-dashed border-white/5 rounded-[2rem]">
                                        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setEditContent({ ...editContent, about: { ...editContent.about, image: ev.target?.result as string } }); r.readAsDataURL(f); } }} />
                                        <i className="fa-solid fa-cloud-arrow-up text-4xl text-slate-800"></i>
                                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest text-center px-6">Görseli sürükleyin veya seçin</p>
                                    </label>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className={LABEL_CLS}>GÖRSEL BAĞLANTISI</label>
                                <input className={INPUT_CLS} value={editContent.about.image || ''} onChange={e => setEditContent({ ...editContent, about: { ...editContent.about, image: e.target.value } })} placeholder="https://..." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
