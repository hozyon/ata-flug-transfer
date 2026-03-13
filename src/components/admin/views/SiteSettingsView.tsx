import React, { useState } from 'react';
import { SiteContent } from '../../../types';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';

interface SiteSettingsViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    handleMoveMenu: (index: number, direction: 'up' | 'down') => void;
    moveItem: <T>(list: T[], index: number, direction: 'up' | 'down') => T[];
}

export const SiteSettingsView: React.FC<SiteSettingsViewProps> = ({
    editContent, setEditContent, handleMoveMenu, moveItem
}) => {
    const [expandedMenu, setExpandedMenu] = useState<number | null>(null);

    const { getDragProps, getRowClassName } = useDragAndDrop(
        editContent.navbar,
        (newNavbar) => setEditContent({ ...editContent, navbar: newNavbar })
    );

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Ana Menü', value: editContent.navbar.length, icon: 'fa-bars', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
                    { label: 'Alt Menü', value: editContent.navbar.reduce((s, i) => s + (i.subMenus?.length || 0), 0), icon: 'fa-sitemap', iconBg: 'bg-violet-500', gradient: 'from-violet-500/15 to-purple-600/5', border: 'border-violet-500/15' },
                    { label: 'Toplam Link', value: editContent.navbar.length + editContent.navbar.reduce((s, i) => s + (i.subMenus?.length || 0), 0), icon: 'fa-link', iconBg: 'bg-emerald-500', gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/15' },
                    { label: 'Sıralama', value: 'Manuel', icon: 'fa-grip-lines', iconBg: 'bg-slate-500', gradient: 'from-slate-500/15 to-slate-600/5', border: 'border-slate-500/15' },
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
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-compass text-[#c5a059] text-sm"></i>
                        <span className="text-sm font-bold text-white">Navigasyon Menüsü</span>
                        <span className="text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-white/5 text-slate-400">{editContent.navbar.length}</span>
                    </div>
                    <button onClick={() => { const n = [...editContent.navbar]; n.push({ label: 'Yeni Menü', url: '#', subMenus: [] }); setEditContent({ ...editContent, navbar: n }); }}
                        className="px-4 py-2.5 bg-[#c5a059] hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2">
                        <i className="fa-solid fa-plus text-[10px]"></i> Yeni Menü
                    </button>
                </div>

                {/* Table */}
                {editContent.navbar.length === 0 ? (
                    <div className="text-center py-16 border-t border-white/[0.04]">
                        <i className="fa-solid fa-bars text-4xl text-slate-700 mb-3 block"></i>
                        <p className="text-slate-500 text-sm font-medium">Henüz menü eklenmemiş</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-b border-white/[0.04] bg-white/[0.02]">
                                    <th className="w-8 sm:w-10 px-1 sm:px-2 py-3"></th>
                                    <th className="text-left px-2 sm:px-4 py-3 w-10 sm:w-12"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">#</span></th>
                                    <th className="text-left px-2 sm:px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Menü Adı</span></th>
                                    <th className="text-left px-3 py-3 hidden md:table-cell"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">URL</span></th>
                                    <th className="text-center px-2 sm:px-3 py-3 w-16 sm:w-24"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Alt Menü</span></th>
                                    <th className="w-8 sm:w-32 px-1 sm:px-3 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {editContent.navbar.map((item, index) => {
                                    const isExpanded = expandedMenu === index;
                                    return (
                                        <React.Fragment key={index}>
                                            <tr {...getDragProps(index)} onClick={() => setExpandedMenu(isExpanded ? null : index)}
                                                className={`border-b border-white/[0.03] cursor-grab active:cursor-grabbing hover:bg-white/[0.03] transition-all group ${getRowClassName(index)}`}>
                                                <td className="px-1 sm:px-2 py-3.5" onClick={e => e.stopPropagation()}>
                                                    <div className="flex items-center justify-center text-slate-600 hover:text-slate-300 transition-colors">
                                                        <i className="fa-solid fa-grip-vertical text-[10px]"></i>
                                                    </div>
                                                </td>
                                                <td className="px-2 sm:px-4 py-3.5">
                                                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                                                        <span className="text-[10px] font-mono font-bold text-slate-500">{index + 1}</span>
                                                    </div>
                                                </td>
                                                <td className="px-2 sm:px-3 py-3.5" onClick={e => e.stopPropagation()}>
                                                    <input className="bg-transparent font-bold text-[13px] text-white outline-none focus:text-[#c5a059] transition-colors w-full min-w-0"
                                                        value={item.label} onChange={e => { const n = [...editContent.navbar]; n[index].label = e.target.value; setEditContent({ ...editContent, navbar: n }); }} />
                                                </td>
                                                <td className="px-3 py-3.5 hidden md:table-cell" onClick={e => e.stopPropagation()}>
                                                    <input className="bg-transparent font-mono text-[11px] text-slate-500 outline-none focus:text-white transition-colors w-full"
                                                        value={item.url} onChange={e => { const n = [...editContent.navbar]; if (n[index]) { n[index].url = e.target.value; setEditContent({ ...editContent, navbar: n }); } }} />
                                                </td>
                                                <td className="px-2 sm:px-3 py-3.5 text-center">
                                                    {item.subMenus && item.subMenus.length > 0 ? (
                                                        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20">
                                                            <i className="fa-solid fa-sitemap text-[8px] text-violet-400"></i>
                                                            <span className="text-[10px] font-bold text-violet-400">{item.subMenus.length}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-600">—</span>
                                                    )}
                                                </td>
                                                <td className="px-1 sm:px-3 py-3.5" onClick={e => e.stopPropagation()}>
                                                    <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity justify-end">
                                                        <button onClick={() => handleMoveMenu(index, 'up')} disabled={index === 0}
                                                            className="hidden sm:flex w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white disabled:opacity-20 items-center justify-center transition-all">
                                                            <i className="fa-solid fa-chevron-up text-[10px]"></i>
                                                        </button>
                                                        <button onClick={() => handleMoveMenu(index, 'down')} disabled={index === editContent.navbar.length - 1}
                                                            className="hidden sm:flex w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white disabled:opacity-20 items-center justify-center transition-all">
                                                            <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                                        </button>
                                                        <button onClick={() => setExpandedMenu(isExpanded ? null : index)}
                                                            className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all">
                                                            <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-ellipsis'} text-[10px]`}></i>
                                                        </button>
                                                        <button onClick={() => { if (confirm('Bu menüyü silmek istediğinize emin misiniz?')) { const n = [...editContent.navbar]; n.splice(index, 1); setEditContent({ ...editContent, navbar: n }); } }}
                                                            className="hidden sm:flex w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-red-500/20 hover:text-red-400 items-center justify-center transition-all">
                                                            <i className="fa-solid fa-trash text-[10px]"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Sub-Menus Expandable */}
                                            {isExpanded && (
                                                <tr className="bg-white/[0.02]">
                                                    <td colSpan={6} className="px-6 py-4">
                                                        <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3 ml-8">
                                                            <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                                                                <i className="fa-solid fa-turn-up rotate-90 text-[8px]"></i> Alt Menüler
                                                            </p>
                                                            {item.subMenus && item.subMenus.map((sub, si) => (
                                                                <div key={sub.id} className="flex items-center gap-2 bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.04] hover:border-white/10 transition-colors group/sub">
                                                                    <div className="w-5 h-5 rounded bg-violet-500/10 flex items-center justify-center shrink-0">
                                                                        <span className="text-[8px] font-mono font-bold text-violet-400">{si + 1}</span>
                                                                    </div>
                                                                    <input className="bg-transparent font-semibold text-xs flex-1 outline-none text-slate-300 focus:text-white" value={sub.label}
                                                                        onChange={e => { const n = [...editContent.navbar]; if (n[index].subMenus) { n[index].subMenus![si].label = e.target.value; setEditContent({ ...editContent, navbar: n }); } }} />
                                                                    <input className="bg-transparent font-mono text-[11px] w-1/4 outline-none text-slate-500 focus:text-slate-300 border-l border-white/[0.06] pl-2" value={sub.url}
                                                                        onChange={e => { const n = [...editContent.navbar]; if (n[index].subMenus) { n[index].subMenus![si].url = e.target.value; setEditContent({ ...editContent, navbar: n }); } }} />
                                                                    <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                                                        <button onClick={() => { const n = [...editContent.navbar]; if (n[index].subMenus) { n[index].subMenus = moveItem(n[index].subMenus!, si, 'up'); setEditContent({ ...editContent, navbar: n }); } }} disabled={si === 0}
                                                                            className="w-6 h-6 rounded bg-white/[0.04] text-slate-500 hover:text-white disabled:opacity-0 flex items-center justify-center transition-all"><i className="fa-solid fa-chevron-up text-[9px]"></i></button>
                                                                        <button onClick={() => { const n = [...editContent.navbar]; if (n[index].subMenus) { const s = [...n[index].subMenus!]; s.splice(si, 1); n[index].subMenus = s; setEditContent({ ...editContent, navbar: n }); } }}
                                                                            className="w-6 h-6 rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"><i className="fa-solid fa-xmark text-[10px]"></i></button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <button onClick={() => { const n = [...editContent.navbar]; if (!n[index].subMenus) n[index].subMenus = []; n[index].subMenus!.push({ id: Date.now().toString(), label: 'Yeni Alt Menü', url: '#' }); setEditContent({ ...editContent, navbar: n }); }}
                                                                className="text-[11px] font-bold text-[#c5a059] hover:text-amber-300 flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-[#c5a059]/10 transition-colors">
                                                                <i className="fa-solid fa-plus text-[9px]"></i> Alt Menü Ekle
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
