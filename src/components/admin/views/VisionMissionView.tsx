import React from 'react';
import { RichTextEditor } from '../RichTextEditor';
import { SiteContent } from '../../../types';

interface VisionMissionViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    _confirmAction?: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

export const VisionMissionView: React.FC<VisionMissionViewProps> = ({ editContent, setEditContent }) => {
    const vm = editContent.visionMission || {};
    const LABEL_CLS = 'block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 ml-1';
    const INPUT_CLS = 'bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm text-slate-900 font-bold placeholder-slate-300 focus:bg-white focus:border-gold/40 focus:ring-4 focus:ring-gold/5 outline-none transition-all w-full';

    const update = (path: string, value: unknown) => {
        const parts = path.split('.');
        const newVm = JSON.parse(JSON.stringify(vm));
        let obj = newVm;
        for (let i = 0; i < parts.length - 1; i++) { if (!obj[parts[i]]) obj[parts[i]] = {}; obj = obj[parts[i]]; }
        obj[parts[parts.length - 1]] = value;
        setEditContent({ ...editContent, visionMission: newVm });
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group transition-transform duration-500 hover:scale-105 shadow-sm shadow-indigo-100/50">
                        <i className="fa-solid fa-eye text-indigo-600 text-2xl"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Vizyon & Misyon</h2>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Philosophy</span>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium">Şirket değerlerini ve gelecek vizyonunu yönetin</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Vision Card */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm font-black">
                            <i className="fa-solid fa-eye text-lg"></i>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Vizyonumuz</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className={LABEL_CLS}>VİZYON BAŞLIĞI</label>
                            <input className={INPUT_CLS} value={vm.vision?.title || ''} onChange={e => update('vision.title', e.target.value)} placeholder="Gelecek Vizyonumuz" />
                        </div>
                        <div>
                            <label className={LABEL_CLS}>AÇIKLAMA</label>
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
                                <RichTextEditor value={vm.vision?.desc || ''} onChange={v => update('vision.desc', v)} placeholder="Vizyon metni..." minRows={8} compact />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission Card */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-11 h-11 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-sm font-black">
                            <i className="fa-solid fa-bullseye text-lg"></i>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Misyonumuz</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className={LABEL_CLS}>MİSYON BAŞLIĞI</label>
                            <input className={INPUT_CLS} value={vm.mission?.title || ''} onChange={e => update('mission.title', e.target.value)} placeholder="Kurumsal Misyonumuz" />
                        </div>
                        <div>
                            <label className={LABEL_CLS}>AÇIKLAMA</label>
                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
                                <RichTextEditor value={vm.mission?.desc || ''} onChange={v => update('mission.desc', v)} placeholder="Misyon metni..." minRows={8} compact />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Table */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm font-black">
                        <i className="fa-solid fa-gem text-lg"></i>
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Hizmet İlkelerimiz</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">KURUMSAL DEĞERLER</p>
                    </div>
                </div>
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-1/3">İkon / Başlık</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">İlke Açıklaması</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {vm.values?.items?.map((item: any, idx: number) => (
                                <tr key={idx} className="group hover:bg-slate-50 transition-all duration-300">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col items-center gap-3 shrink-0">
                                                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-gold group-hover:scale-110 transition-all duration-500">
                                                    <i className={`fa-solid ${item.icon} text-xl`}></i>
                                                </div>
                                                <input className="w-20 bg-slate-50 border border-slate-100 rounded-lg text-center text-[9px] text-slate-400 font-mono py-1 focus:bg-white focus:text-gold outline-none" value={item.icon} onChange={e => { const n = [...vm.values.items]; n[idx].icon = e.target.value; update('values.items', n); }} />
                                            </div>
                                            <input className="bg-transparent text-[16px] font-black text-slate-900 outline-none focus:text-gold transition-colors w-full" value={item.title} onChange={e => { const n = [...vm.values.items]; n[idx].title = e.target.value; update('values.items', n); }} />
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <textarea className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[13px] font-medium text-slate-500 outline-none focus:bg-white focus:text-slate-900 transition-colors resize-none leading-relaxed shadow-inner" rows={3} value={item.desc} onChange={e => { const n = [...vm.values.items]; n[idx].desc = e.target.value; update('values.items', n); }} />
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
