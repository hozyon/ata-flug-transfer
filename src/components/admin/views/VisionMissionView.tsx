import React from 'react';
import { RichTextEditor } from '../RichTextEditor';
import { SiteContent } from '../../../types';

interface VisionMissionViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    _confirmAction: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

export const VisionMissionView: React.FC<VisionMissionViewProps> = ({ editContent, setEditContent }) => {
    const vm = editContent.visionMission || {};
    const LABEL_CLS = 'block text-[11px] font-[800] font-outfit uppercase tracking-[0.15em] text-slate-500 mb-2.5 ml-1';
    const INPUT_CLS = 'bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 focus:bg-white/[0.05] outline-none transition-all w-full font-semibold';

    const update = (path: string, value: unknown) => {
        const parts = path.split('.');
        const newVm = JSON.parse(JSON.stringify(vm));
        let obj = newVm;
        for (let i = 0; i < parts.length - 1; i++) { if (!obj[parts[i]]) obj[parts[i]] = {}; obj = obj[parts[i]]; }
        obj[parts[parts.length - 1]] = value;
        setEditContent({ ...editContent, visionMission: newVm });
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-8 pb-10">
            {/* Header / Stats — Elite Style */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-[#020617]/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/20 flex items-center justify-center shadow-inner group transition-transform duration-500 hover:scale-105">
                        <i className="fa-solid fa-eye text-blue-400 text-2xl group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-2xl font-[900] text-white tracking-tight">Vizyon & Misyon</h2>
                            <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Philosophy</span>
                        </div>
                        <p className="text-[13px] text-slate-400 font-medium">Şirket değerlerini ve gelecek vizyonunu yönetin</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vision Card */}
                <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center font-[900] text-blue-400 shadow-inner">
                            <i className="fa-solid fa-eye text-lg"></i>
                        </div>
                        <h3 className="text-lg font-[800] text-white tracking-tight">Vizyonumuz</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className={LABEL_CLS}>VİZYON BAŞLIĞI</label>
                            <input className={INPUT_CLS} value={vm.vision?.title || ''} onChange={e => update('vision.title', e.target.value)} placeholder="Gelecek Vizyonumuz" />
                        </div>
                        <div>
                            <label className={LABEL_CLS}>AÇIKLAMA</label>
                            <RichTextEditor value={vm.vision?.desc || ''} onChange={v => update('vision.desc', v)} placeholder="Vizyon metni..." minRows={6} compact />
                        </div>
                    </div>
                </div>

                {/* Mission Card */}
                <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-11 h-11 rounded-2xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center font-[900] text-violet-400 shadow-inner">
                            <i className="fa-solid fa-bullseye text-lg"></i>
                        </div>
                        <h3 className="text-lg font-[800] text-white tracking-tight">Misyonumuz</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className={LABEL_CLS}>MİSYON BAŞLIĞI</label>
                            <input className={INPUT_CLS} value={vm.mission?.title || ''} onChange={e => update('mission.title', e.target.value)} placeholder="Kurumsal Misyonumuz" />
                        </div>
                        <div>
                            <label className={LABEL_CLS}>AÇIKLAMA</label>
                            <RichTextEditor value={vm.mission?.desc || ''} onChange={v => update('mission.desc', v)} placeholder="Misyon metni..." minRows={6} compact />
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Table */}
            <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
                <div className="px-8 py-6 border-b border-white/[0.05] flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center font-[900] text-emerald-400 shadow-inner">
                        <i className="fa-solid fa-gem text-lg"></i>
                    </div>
                    <div>
                        <h3 className="text-lg font-[800] text-white tracking-tight">Kurumsal Değerler</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Hizmet İlkelerimiz</p>
                    </div>
                </div>
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/[0.04]">
                                <th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">İkon / Başlık</th>
                                <th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">İlke Açıklaması</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {vm.values?.items?.map((item: any, idx: number) => (
                                <tr key={idx} className="group hover:bg-white/[0.03] transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="flex flex-col items-center gap-2 shrink-0">
                                                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-emerald-400 shadow-inner group-hover:text-[var(--color-primary)] group-hover:border-[var(--color-primary)]/30 transition-all duration-500">
                                                    <i className={`fa-solid ${item.icon} text-lg`}></i>
                                                </div>
                                                <input className="w-20 bg-transparent text-center text-[9px] text-slate-700 font-mono focus:text-white outline-none" value={item.icon} onChange={e => { const n = [...vm.values.items]; n[idx].icon = e.target.value; update('values.items', n); }} />
                                            </div>
                                            <input className="bg-transparent text-[15px] font-[800] text-white outline-none focus:text-[var(--color-primary)] transition-colors w-full" value={item.title} onChange={e => { const n = [...vm.values.items]; n[idx].title = e.target.value; update('values.items', n); }} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <textarea className="w-full bg-transparent text-[13px] font-medium text-slate-400 outline-none focus:text-slate-200 transition-colors resize-none leading-relaxed" rows={2} value={item.desc} onChange={e => { const n = [...vm.values.items]; n[idx].desc = e.target.value; update('values.items', n); }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
