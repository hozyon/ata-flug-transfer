import React from 'react';
import { RichTextEditor } from '../RichTextEditor';
import { SiteContent } from '../../../types';

interface AboutViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    _confirmAction?: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ editContent, setEditContent }) => {
    const LABEL_CLS = 'block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 ml-1';
    const INPUT_CLS = 'bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm text-slate-900 font-bold placeholder-slate-300 focus:bg-white focus:border-gold/40 focus:ring-4 focus:ring-gold/5 outline-none transition-all w-full';

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-6 pb-10">
            {/* Header / Stats — Refined Light Minimalism */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group transition-transform duration-500 hover:scale-105 shadow-sm shadow-indigo-100/50">
                        <i className="fa-solid fa-building text-indigo-600 text-2xl"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Hakkımızda</h2>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company</span>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium">Şirket geçmişi ve tecrübe bilgilerini yönetin</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-gold shadow-sm font-black">
                                <i className="fa-solid fa-align-left text-lg"></i>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">İçerik Detayları</h3>
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
                                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
                                    <RichTextEditor value={editContent.about.content || ''} onChange={v => setEditContent({ ...editContent, about: { ...editContent.about, content: v } })} placeholder="Şirket hikayenizi anlatın..." minRows={15} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column: Image */}
                <div className="lg:col-span-4">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm h-fit sticky top-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm font-black">
                                <i className="fa-solid fa-image text-lg"></i>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Tanıtım Görseli</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-slate-100 bg-slate-50 relative group shadow-inner">
                                {editContent.about.image ? (
                                    <>
                                        <img src={editContent.about.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Hakkımızda" />
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                            <label className="w-12 h-12 rounded-2xl bg-white text-slate-900 hover:bg-gold hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-90 shadow-xl">
                                                <i className="fa-solid fa-camera text-lg"></i>
                                                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setEditContent({ ...editContent, about: { ...editContent.about, image: ev.target?.result as string } }); r.readAsDataURL(f); } }} />
                                            </label>
                                            <button onClick={() => setEditContent({ ...editContent, about: { ...editContent.about, image: '' } })} className="w-12 h-12 rounded-2xl bg-white text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-xl">
                                                <i className="fa-solid fa-trash-can text-lg"></i>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <label className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white transition-colors border-2 border-dashed border-slate-200 rounded-[2rem]">
                                        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setEditContent({ ...editContent, about: { ...editContent.about, image: ev.target?.result as string } }); r.readAsDataURL(f); } }} />
                                        <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-slate-300 group-hover:text-gold transition-colors"><i className="fa-solid fa-cloud-arrow-up text-2xl"></i></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-6">Görsel Seçin</p>
                                    </label>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className={LABEL_CLS}>GÖRSEL BAĞLANTISI (URL)</label>
                                <div className="relative">
                                    <i className="fa-solid fa-link absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-[10px]"></i>
                                    <input className={`${INPUT_CLS} pl-10 !py-3 !text-[11px]`} value={editContent.about.image || ''} onChange={e => setEditContent({ ...editContent, about: { ...editContent.about, image: e.target.value } })} placeholder="https://..." />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
