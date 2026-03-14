import React, { useRef, useEffect, useState } from 'react';
import { SiteContent } from '../../../types';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';
import { useViewMode } from '../../../hooks/useViewMode';
import { MobileViewToggle } from '../MobileViewToggle';
import { SwipeableCard } from '../SwipeableCard';
import { EmptyState } from '../EmptyState';
import { haptic } from '../../../utils/haptic';

interface FAQViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    faqFilter: 'all' | 'answered' | 'unanswered';
    setFaqFilter: (filter: 'all' | 'answered' | 'unanswered') => void;
    highlightedFaqId: string | null;
    setHighlightedFaqId: (id: string | null) => void;
    moveItem: <T>(list: T[], index: number, direction: 'up' | 'down') => T[];
}

export const FAQView: React.FC<FAQViewProps> = ({
    editContent, setEditContent, faqFilter, setFaqFilter, highlightedFaqId, setHighlightedFaqId, moveItem
}) => {
    const faqEndRef = useRef<HTMLDivElement>(null);
    const prevFaqLength = useRef(editContent.faq.length);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (editContent.faq.length > prevFaqLength.current) {
            const newItem = editContent.faq[editContent.faq.length - 1];
            setExpandedId(newItem.id);
            setTimeout(() => faqEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        }
        prevFaqLength.current = editContent.faq.length;
    }, [editContent.faq.length]);

    const allFaq = editContent.faq || [];
    const counts = {
        all: allFaq.length,
        answered: allFaq.filter(f => f.a && f.a.trim().length > 0).length,
        unanswered: allFaq.filter(f => !f.a || f.a.trim().length === 0).length,
        published: allFaq.filter(f => !f.hidden).length,
    };

    const filtered = allFaq.filter(f => {
        if (faqFilter === 'answered') return f.a && f.a.trim().length > 0;
        if (faqFilter === 'unanswered') return !f.a || f.a.trim().length === 0;
        return true;
    }).filter(f => !searchTerm || f.q.toLowerCase().includes(searchTerm.toLowerCase()) || f.a?.toLowerCase().includes(searchTerm.toLowerCase()));

    const { viewMode, toggleViewMode } = useViewMode();
    const isFiltering = faqFilter !== 'all' || !!searchTerm;
    const { getDragProps, getRowClassName } = useDragAndDrop(
        allFaq,
        (newFaq) => setEditContent({ ...editContent, faq: newFaq })
    );

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Toplam Soru', value: counts.all, icon: 'fa-circle-question', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
                    { label: 'Cevaplı', value: counts.answered, icon: 'fa-circle-check', iconBg: 'bg-emerald-500', gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/15' },
                    { label: 'Boş Cevap', value: counts.unanswered, icon: 'fa-triangle-exclamation', iconBg: 'bg-amber-500', gradient: 'from-amber-500/15 to-orange-600/5', border: 'border-amber-500/15', alert: counts.unanswered > 0 },
                    { label: 'Yayında', value: counts.published, icon: 'fa-eye', iconBg: 'bg-violet-500', gradient: 'from-violet-500/15 to-purple-600/5', border: 'border-violet-500/15' },
                ].map((s, i) => (
                    <div key={i} className={`p-4 rounded-2xl bg-gradient-to-br ${s.gradient} border ${s.border}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                                <p className="text-2xl font-black text-white mt-1">{s.value}</p>
                                {'alert' in s && s.alert && <p className="text-[10px] text-amber-400 font-medium mt-1"><i className="fa-solid fa-circle-exclamation mr-1"></i>Cevap bekliyor</p>}
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
                {/* Tabs + Search + Add */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-4">
                    <div className="flex items-center gap-1">
                        {[
                            { id: 'all' as const, label: 'Tümü', icon: 'fa-layer-group' },
                            { id: 'answered' as const, label: 'Cevaplı', icon: 'fa-circle-check' },
                            { id: 'unanswered' as const, label: 'Boş Cevap', icon: 'fa-triangle-exclamation' },
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setFaqFilter(tab.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${faqFilter === tab.id ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                                <i className={`fa-solid ${tab.icon} text-[10px]`}></i>
                                {tab.label}
                                <span className={`text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full ${faqFilter === tab.id ? 'bg-white/20' : 'bg-white/5'}`}>{counts[tab.id]}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 sm:ml-auto w-full sm:w-auto">
                        <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                        <div className="relative flex-1 sm:w-56">
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                            <input type="text" placeholder="Soru ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 outline-none transition-all" />
                        </div>
                        <button onClick={() => { const id = Date.now().toString(); setEditContent({ ...editContent, faq: [...editContent.faq, { id, q: 'Yeni Soru', a: '' }] }); setHighlightedFaqId(id); setTimeout(() => setHighlightedFaqId(null), 500); }}
                            className="px-4 py-2.5 bg-[var(--color-primary)] hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0">
                            <i className="fa-solid fa-plus text-[10px]"></i> Yeni Soru
                        </button>
                    </div>
                </div>

                {/* Table */}
                {filtered.length === 0 ? (
                    <EmptyState
                        icon={faqFilter === 'unanswered' ? 'fa-triangle-exclamation' : 'fa-clipboard-question'}
                        title={faqFilter === 'answered' ? 'Cevaplı soru yok' : faqFilter === 'unanswered' ? 'Cevapsız soru yok' : 'Soru bulunamadı'}
                        description={searchTerm ? `"${searchTerm}" ile eşleşen soru yok` : faqFilter === 'unanswered' ? 'Tüm sorular yanıtlanmış ✓' : 'Yeni soru eklemek için butona tıklayın'}
                        action={searchTerm ? { label: 'Aramayı Temizle', onClick: () => setSearchTerm('') } : undefined}
                    />
                ) : viewMode === 'card' ? (
                    /* ── MOBILE CARD VIEW ── */
                    <div className="p-3 space-y-3">
                        {filtered.map((item) => {
                            const globalIndex = allFaq.findIndex(f => f.id === item.id);
                            const isExpanded = expandedId === item.id;
                            const hasAnswer = item.a && item.a.trim().length > 0;

                            return (
                                <SwipeableCard key={item.id} actions={[
                                    { icon: 'fa-pen', label: 'Düzenle', color: 'bg-blue-500', onClick: () => setExpandedId(isExpanded ? null : item.id) },
                                    { icon: 'fa-trash', label: 'Sil', color: 'bg-red-500', onClick: () => { if (confirm('Bu soruyu silmek istediğinize emin misiniz?')) { const n = [...allFaq]; n.splice(globalIndex, 1); setEditContent({ ...editContent, faq: n }); } } },
                                ]} onClick={() => setExpandedId(isExpanded ? null : item.id)}>
                                    <div className={`p-4 ${item.hidden ? 'opacity-50' : ''}`}>
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${hasAnswer ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}>
                                                <i className={`fa-solid ${hasAnswer ? 'fa-question' : 'fa-exclamation'} text-white text-sm`}></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-white text-sm leading-tight">{item.q}</p>
                                                {hasAnswer && <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.a}</p>}
                                            </div>
                                        </div>
                                        {/* Status Row */}
                                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/[0.04]">
                                            <span className="text-[9px] font-bold text-slate-500">#{globalIndex + 1}</span>
                                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border ${hasAnswer ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${hasAnswer ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                                                <span className={`text-[9px] font-bold ${hasAnswer ? 'text-emerald-400' : 'text-amber-400'}`}>{hasAnswer ? 'Cevaplı' : 'Boş'}</span>
                                            </div>
                                            <button onClick={e => { e.stopPropagation(); const newFaq = [...allFaq]; newFaq[globalIndex] = { ...newFaq[globalIndex], hidden: !item.hidden }; setEditContent({ ...editContent, faq: newFaq }); }}
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border transition-all ${!item.hidden ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                                                <i className={`fa-solid ${!item.hidden ? 'fa-eye' : 'fa-eye-slash'} text-[8px]`}></i>
                                                <span className="text-[9px] font-bold">{!item.hidden ? 'Yayında' : 'Gizli'}</span>
                                            </button>
                                            <div className="flex-1"></div>
                                            <button onClick={e => { e.stopPropagation(); haptic.tap(); setExpandedId(isExpanded ? null : item.id); }}
                                                className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 active:bg-blue-500/20 flex items-center justify-center transition-all">
                                                <i className="fa-solid fa-pen text-[10px]"></i>
                                            </button>
                                            <button onClick={e => { e.stopPropagation(); if (confirm('Bu soruyu silmek istediğinize emin misiniz?')) { haptic.error(); const n = [...allFaq]; n.splice(globalIndex, 1); setEditContent({ ...editContent, faq: n }); } }}
                                                className="w-8 h-8 rounded-lg bg-white/5 text-slate-500 active:bg-red-500/10 active:text-red-400 flex items-center justify-center transition-all">
                                                <i className="fa-solid fa-trash text-[10px]"></i>
                                            </button>
                                        </div>
                                        {/* Expanded Edit */}
                                        {isExpanded && (
                                            <div className="mt-3 pt-3 border-t border-white/[0.04] space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div>
                                                    <label className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1 block">Soru</label>
                                                    <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none"
                                                        value={item.q} onChange={e => { const n = [...allFaq]; n[globalIndex] = { ...n[globalIndex], q: e.target.value }; setEditContent({ ...editContent, faq: n }); }} onClick={e => e.stopPropagation()} />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1 block">Cevap</label>
                                                    <textarea className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:border-[var(--color-primary)]/50 outline-none resize-none" rows={3}
                                                        value={item.a || ''} onChange={e => { const n = [...allFaq]; n[globalIndex] = { ...n[globalIndex], a: e.target.value }; setEditContent({ ...editContent, faq: n }); }} onClick={e => e.stopPropagation()} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </SwipeableCard>
                            );
                        })}
                        <div ref={faqEndRef} />
                    </div>
                ) : (
                    /* ── TABLE VIEW ── */
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-b border-white/[0.04] bg-white/[0.02]">
                                    <th className="w-10 px-2 py-3"></th>
                                    <th className="text-left px-4 py-3 w-12"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">#</span></th>
                                    <th className="text-left px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Soru</span></th>
                                    <th className="text-center px-3 py-3 w-20"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cevap</span></th>
                                    <th className="text-center px-3 py-3 w-20"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Görünürlük</span></th>
                                    <th className="w-32 px-3 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => {
                                    const globalIndex = allFaq.findIndex(f => f.id === item.id);
                                    const isExpanded = expandedId === item.id;
                                    const hasAnswer = item.a && item.a.trim().length > 0;

                                    return (
                                        <React.Fragment key={item.id}>
                                            <tr {...(!isFiltering ? getDragProps(globalIndex) : {})} onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                                className={`border-b border-white/[0.03] cursor-pointer transition-all group ${!isFiltering ? 'active:cursor-grabbing' : ''} ${highlightedFaqId === item.id ? 'bg-[var(--color-primary)]/[0.08] border-[var(--color-primary)]/30' : 'hover:bg-white/[0.03]'} ${item.hidden ? 'opacity-50 hover:opacity-100' : ''} ${getRowClassName(globalIndex)}`}>
                                                <td className="px-2 py-3.5" onClick={e => e.stopPropagation()}>
                                                    {!isFiltering && (
                                                        <div className="flex items-center justify-center text-slate-600 hover:text-slate-300 transition-colors cursor-grab">
                                                            <i className="fa-solid fa-grip-vertical text-[10px]"></i>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                                                        <span className="text-[10px] font-mono font-bold text-slate-500">{globalIndex + 1}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${hasAnswer ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}>
                                                            <i className={`fa-solid ${hasAnswer ? 'fa-question' : 'fa-exclamation'} text-white text-sm`}></i>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-white text-[13px] group-hover:text-[var(--color-primary)] transition-colors truncate max-w-[400px]">{item.q}</p>
                                                            {hasAnswer && <p className="text-[10px] text-slate-500 truncate max-w-[400px] mt-0.5">{item.a}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3.5 text-center">
                                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${hasAnswer ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${hasAnswer ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                                                        <span className={`text-[10px] font-bold ${hasAnswer ? 'text-emerald-400' : 'text-amber-400'}`}>{hasAnswer ? 'Var' : 'Boş'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-3.5 text-center" onClick={e => e.stopPropagation()}>
                                                    <button onClick={() => { const newFaq = [...allFaq]; newFaq[globalIndex] = { ...newFaq[globalIndex], hidden: !item.hidden }; setEditContent({ ...editContent, faq: newFaq }); }}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${!item.hidden ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400'}`}>
                                                        <i className={`fa-solid ${!item.hidden ? 'fa-eye' : 'fa-eye-slash'} text-[9px]`}></i>
                                                        <span className="text-[10px] font-bold">{!item.hidden ? 'Yayında' : 'Gizli'}</span>
                                                    </button>
                                                </td>
                                                <td className="px-3 py-3.5" onClick={e => e.stopPropagation()}>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                                        <button onClick={() => setEditContent({ ...editContent, faq: moveItem(allFaq, globalIndex, 'up') })} disabled={globalIndex === 0}
                                                            className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white disabled:opacity-20 flex items-center justify-center transition-all">
                                                            <i className="fa-solid fa-chevron-up text-[10px]"></i>
                                                        </button>
                                                        <button onClick={() => setEditContent({ ...editContent, faq: moveItem(allFaq, globalIndex, 'down') })} disabled={globalIndex === allFaq.length - 1}
                                                            className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white disabled:opacity-20 flex items-center justify-center transition-all">
                                                            <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                                        </button>
                                                        <button onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                                            className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all">
                                                            <i className={`fa-solid fa-pen text-[10px]`}></i>
                                                        </button>
                                                        <button onClick={() => { if (confirm('Bu soruyu silmek istediğinize emin misiniz?')) { const n = [...allFaq]; n.splice(globalIndex, 1); setEditContent({ ...editContent, faq: n }); } }}
                                                            className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all">
                                                            <i className="fa-solid fa-trash text-[10px]"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr className="bg-white/[0.02]">
                                                    <td colSpan={5} className="px-6 py-5">
                                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 max-w-3xl">
                                                            <div>
                                                                <label className="flex items-center gap-2 text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-2">
                                                                    <i className="fa-solid fa-q text-[8px]"></i> Soru
                                                                </label>
                                                                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium text-sm outline-none focus:border-[var(--color-primary)] transition-all resize-none" rows={2} value={item.q}
                                                                    onChange={e => { const n = [...allFaq]; n[globalIndex].q = e.target.value; setEditContent({ ...editContent, faq: n }); }} />
                                                            </div>
                                                            <div>
                                                                <label className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">
                                                                    <i className="fa-solid fa-a text-[8px]"></i> Cevap
                                                                </label>
                                                                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-sm outline-none focus:border-emerald-500 transition-all resize-none" rows={4} value={item.a}
                                                                    onChange={e => { const n = [...allFaq]; n[globalIndex].a = e.target.value; setEditContent({ ...editContent, faq: n }); }} />
                                                            </div>
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
            <div ref={faqEndRef} />
        </div>
    );
};
