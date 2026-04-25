import React from 'react';
import { RichTextEditor } from '../RichTextEditor';
import { SiteContent } from '../../../types';

interface AboutViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ editContent, setEditContent }) => {
    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Başlık', value: editContent.about.title ? '✓' : '—', icon: 'fa-heading', iconBg: 'bg-[var(--color-primary)]', gradient: 'from-[var(--color-primary)]/15 to-amber-600/5', border: 'border-[var(--color-primary)]/15' },
                    { label: 'İçerik', value: editContent.about.content ? `${editContent.about.content.length} kr` : '—', icon: 'fa-align-left', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
                    { label: 'Görsel', value: editContent.about.image ? '✓' : '—', icon: 'fa-image', iconBg: 'bg-emerald-500', gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/15' },
                    { label: 'Tecrübe', value: editContent.about.experienceYear || '—', icon: 'fa-award', iconBg: 'bg-violet-500', gradient: 'from-violet-500/15 to-purple-600/5', border: 'border-violet-500/15' },
                ].map((s, i) => (
                    <div key={i} className={`p-4 rounded-2xl bg-gradient-to-br ${s.gradient} border ${s.border}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                                <p className="text-2xl font-black text-white mt-1">{s.value}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shadow-lg`}>
                                <i className={`fa-solid ${s.icon} text-white text-sm`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Container */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/[0.04] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <i className="fa-solid fa-address-card text-[var(--color-primary)]"></i>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Hakkımızda İçeriği</h2>
                        <p className="text-[11px] text-slate-500">Ana sayfada ve hakkımızda sayfasında görünecek bilgiler</p>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="p-6 space-y-6">
                    {/* Two Column */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <i className="fa-solid fa-heading text-[8px] text-[var(--color-primary)]"></i> Başlık
                            </label>
                            <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                                value={editContent.about.title || ''} onChange={e => setEditContent({ ...editContent, about: { ...editContent.about, title: e.target.value } })} placeholder="Hakkımızda" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <i className="fa-solid fa-award text-[8px] text-violet-400"></i> Tecrübe Yılı
                            </label>
                            <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                                value={editContent.about.experienceYear || ''} onChange={e => setEditContent({ ...editContent, about: { ...editContent.about, experienceYear: e.target.value } })} placeholder="15+" />
                        </div>
                    </div>

                    {/* Content */}
                    <RichTextEditor
                        label={<><i className="fa-solid fa-align-left text-[8px] text-blue-400"></i> Ana İçerik Metni</>}
                        value={editContent.about.content || ''}
                        onChange={v => setEditContent({ ...editContent, about: { ...editContent.about, content: v } })}
                        placeholder="Şirket hakkında bilgi yazın..."
                        minRows={8}
                    />

                    {/* Image Section */}
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-4">
                            <i className="fa-solid fa-image text-[8px] text-emerald-400"></i> Hakkımızda Görseli
                        </label>
                        <div className="flex flex-col md:flex-row gap-5">
                            {editContent.about.image ? (
                                <div className="w-full md:w-64 h-44 rounded-xl overflow-hidden border border-white/10 shrink-0 relative group">
                                    <img src={editContent.about.image} className="w-full h-full object-cover" alt="Hakkımızda" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                        <label className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[var(--color-primary)] text-white flex items-center justify-center cursor-pointer transition-all">
                                            <i className="fa-solid fa-pen text-xs"></i>
                                            <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setEditContent({ ...editContent, about: { ...editContent.about, image: ev.target?.result as string } }); r.readAsDataURL(f); } }} />
                                        </label>
                                        <button onClick={() => setEditContent({ ...editContent, about: { ...editContent.about, image: '' } })} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-all">
                                            <i className="fa-solid fa-trash text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full md:w-64 h-44 rounded-xl border-2 border-dashed border-white/10 hover:border-[var(--color-primary)]/40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group/drop shrink-0"
                                    onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-[var(--color-primary)]', 'bg-[var(--color-primary)]/5'); }}
                                    onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove('border-[var(--color-primary)]', 'bg-[var(--color-primary)]/5'); }}
                                    onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('border-[var(--color-primary)]', 'bg-[var(--color-primary)]/5'); const f = e.dataTransfer.files?.[0]; if (f?.type.startsWith('image/')) { const r = new FileReader(); r.onload = ev => setEditContent({ ...editContent, about: { ...editContent.about, image: ev.target?.result as string } }); r.readAsDataURL(f); } }}
                                    onClick={() => document.getElementById('about-image-upload')?.click()}>
                                    <input id="about-image-upload" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setEditContent({ ...editContent, about: { ...editContent.about, image: ev.target?.result as string } }); r.readAsDataURL(f); } }} />
                                    <i className="fa-solid fa-cloud-arrow-up text-xl text-slate-600 group-hover/drop:text-[var(--color-primary)]"></i>
                                    <p className="text-xs font-bold text-slate-500">Sürükle veya tıkla</p>
                                </div>
                            )}
                            <div className="flex-1 flex flex-col justify-center space-y-3">
                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600 uppercase before:flex-1 before:h-px before:bg-white/[0.04] after:flex-1 after:h-px after:bg-white/[0.04]">veya URL</div>
                                <div className="relative">
                                    <i className="fa-solid fa-link absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                                    <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl pl-9 pr-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                                        value={editContent.about.image || ''} onChange={e => setEditContent({ ...editContent, about: { ...editContent.about, image: e.target.value } })} placeholder="https://örnek.com/gorsel.jpg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
