import React from 'react';
import { RichTextEditor } from '../RichTextEditor';

interface VisionMissionViewProps {
    editContent: any;
    setEditContent: (content: any) => void;
}

export const VisionMissionView: React.FC<VisionMissionViewProps> = ({ editContent, setEditContent }) => {
    const vm = editContent.visionMission || {};
    const update = (path: string, value: any) => {
        const parts = path.split('.');
        const newVm = JSON.parse(JSON.stringify(vm));
        let obj = newVm;
        for (let i = 0; i < parts.length - 1; i++) { if (!obj[parts[i]]) obj[parts[i]] = {}; obj = obj[parts[i]]; }
        obj[parts[parts.length - 1]] = value;
        setEditContent({ ...editContent, visionMission: newVm });
    };

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Vizyon', value: vm.vision?.title ? '✓' : '—', icon: 'fa-eye', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
                    { label: 'Misyon', value: vm.mission?.title ? '✓' : '—', icon: 'fa-bullseye', iconBg: 'bg-violet-500', gradient: 'from-violet-500/15 to-purple-600/5', border: 'border-violet-500/15' },
                    { label: 'Değerler', value: vm.values?.items?.length || 0, icon: 'fa-gem', iconBg: 'bg-emerald-500', gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/15' },
                    { label: 'Banner', value: vm.hero?.bannerImage ? '✓' : '—', icon: 'fa-panorama', iconBg: 'bg-[var(--color-primary)]', gradient: 'from-[var(--color-primary)]/15 to-amber-600/5', border: 'border-[var(--color-primary)]/15' },
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

            {/* Hero Banner */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center shadow-lg">
                        <i className="fa-solid fa-panorama text-white text-sm"></i>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Hero Banner Görseli</h3>
                        <p className="text-[10px] text-slate-500">1920×1080px önerilir</p>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-5">
                        {vm.hero?.bannerImage ? (
                            <div className="w-full md:w-64 h-36 rounded-xl overflow-hidden border border-white/10 shrink-0 relative group">
                                <img src={vm.hero.bannerImage} className="w-full h-full object-cover" alt="Banner" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                    <label className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[var(--color-primary)] text-white flex items-center justify-center cursor-pointer transition-all">
                                        <i className="fa-solid fa-pen text-xs"></i>
                                        <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => update('hero.bannerImage', ev.target?.result); r.readAsDataURL(f); } }} />
                                    </label>
                                    <button onClick={() => update('hero.bannerImage', '')} className="w-9 h-9 rounded-lg bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-all">
                                        <i className="fa-solid fa-trash text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full md:w-64 h-36 rounded-xl border-2 border-dashed border-white/10 hover:border-[var(--color-primary)]/40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
                                onClick={() => document.getElementById('vision-banner-upload')?.click()}>
                                <input id="vision-banner-upload" type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => update('hero.bannerImage', ev.target?.result); r.readAsDataURL(f); } }} />
                                <i className="fa-solid fa-cloud-arrow-up text-xl text-slate-600"></i>
                                <p className="text-xs font-bold text-slate-500">Sürükle veya tıkla</p>
                            </div>
                        )}
                        <div className="flex-1 flex flex-col justify-center space-y-3">
                            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600 uppercase before:flex-1 before:h-px before:bg-white/[0.04] after:flex-1 after:h-px after:bg-white/[0.04]">veya URL</div>
                            <div className="relative">
                                <i className="fa-solid fa-link absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                                <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl pl-9 pr-4 py-3 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                                    value={vm.hero?.bannerImage || ''} onChange={e => update('hero.bannerImage', e.target.value)} placeholder="https://..." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vision & Mission Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Vision */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg"><i className="fa-solid fa-eye text-white text-sm"></i></div>
                        <h3 className="text-sm font-bold text-white">Vizyonumuz</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><i className="fa-solid fa-heading text-[8px] text-blue-400"></i> Başlık</label>
                            <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                value={vm.vision?.title || ''} onChange={e => update('vision.title', e.target.value)} />
                        </div>
                        <RichTextEditor
                            label={<><i className="fa-solid fa-align-left text-[8px] text-blue-400"></i> Açıklama</>}
                            value={vm.vision?.desc || ''}
                            onChange={v => update('vision.desc', v)}
                            placeholder="Vizyon açıklaması..."
                            minRows={4}
                            compact
                        />
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><i className="fa-solid fa-list text-[8px] text-blue-400"></i> Maddeler</label>
                            <div className="space-y-2">
                                {vm.vision?.items?.map((item: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center shrink-0"><span className="text-[9px] font-bold text-blue-400">{idx + 1}</span></div>
                                        <input className="flex-1 bg-white/5 border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                            value={item} onChange={e => { const n = [...vm.vision.items]; n[idx] = e.target.value; update('vision.items', n); }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg"><i className="fa-solid fa-bullseye text-white text-sm"></i></div>
                        <h3 className="text-sm font-bold text-white">Misyonumuz</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><i className="fa-solid fa-heading text-[8px] text-violet-400"></i> Başlık</label>
                            <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-violet-500/50 outline-none transition-all"
                                value={vm.mission?.title || ''} onChange={e => update('mission.title', e.target.value)} />
                        </div>
                        <RichTextEditor
                            label={<><i className="fa-solid fa-align-left text-[8px] text-violet-400"></i> Açıklama</>}
                            value={vm.mission?.desc || ''}
                            onChange={v => update('mission.desc', v)}
                            placeholder="Misyon açıklaması..."
                            minRows={4}
                            compact
                        />
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><i className="fa-solid fa-list text-[8px] text-violet-400"></i> Maddeler</label>
                            <div className="space-y-2">
                                {vm.mission?.items?.map((item: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-violet-500/10 flex items-center justify-center shrink-0"><span className="text-[9px] font-bold text-violet-400">{idx + 1}</span></div>
                                        <input className="flex-1 bg-white/5 border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white focus:border-violet-500/50 outline-none transition-all"
                                            value={item} onChange={e => { const n = [...vm.mission.items]; n[idx] = e.target.value; update('mission.items', n); }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg"><i className="fa-solid fa-gem text-white text-sm"></i></div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Hizmet İlkeleri (Değerler)</h3>
                        <p className="text-[10px] text-slate-500">{vm.values?.items?.length || 0} ilke tanımlı</p>
                    </div>
                </div>
                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><i className="fa-solid fa-heading text-[8px] text-emerald-400"></i> Ana Başlık</label>
                            <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-all"
                                value={vm.values?.title || ''} onChange={e => update('values.title', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><i className="fa-solid fa-align-left text-[8px] text-emerald-400"></i> Alt Açıklama</label>
                            <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-all"
                                value={vm.values?.desc || ''} onChange={e => update('values.desc', e.target.value)} />
                        </div>
                    </div>

                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-b border-white/[0.04] bg-white/[0.02]">
                                    <th className="text-left px-3 py-3 w-12"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">#</span></th>
                                    <th className="text-center px-3 py-3 w-16"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">İkon</span></th>
                                    <th className="text-left px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Başlık</span></th>
                                    <th className="text-left px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Açıklama</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {vm.values?.items?.map((item: any, idx: number) => (
                                    <tr key={idx} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-all">
                                        <td className="px-3 py-3.5">
                                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center"><span className="text-[10px] font-mono font-bold text-slate-500">{idx + 1}</span></div>
                                        </td>
                                        <td className="px-3 py-3.5 text-center">
                                            <div className="inline-flex flex-col items-center gap-1">
                                                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                    <i className={`fa-solid ${item.icon} text-emerald-400 text-sm`}></i>
                                                </div>
                                                <input className="w-20 bg-transparent text-center text-[9px] text-slate-500 outline-none focus:text-white font-mono" value={item.icon}
                                                    onChange={e => { const n = [...vm.values.items]; n[idx] = { ...n[idx], icon: e.target.value }; update('values.items', n); }} />
                                            </div>
                                        </td>
                                        <td className="px-3 py-3.5">
                                            <input className="w-full bg-transparent text-[13px] font-bold text-white outline-none focus:text-[var(--color-primary)] transition-colors" value={item.title}
                                                onChange={e => { const n = [...vm.values.items]; n[idx] = { ...n[idx], title: e.target.value }; update('values.items', n); }} />
                                        </td>
                                        <td className="px-3 py-3.5">
                                            <textarea className="w-full bg-transparent text-[12px] text-slate-400 outline-none focus:text-white resize-none transition-colors" rows={2} value={item.desc}
                                                onChange={e => { const n = [...vm.values.items]; n[idx] = { ...n[idx], desc: e.target.value }; update('values.items', n); }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
