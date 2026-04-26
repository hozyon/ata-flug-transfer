import React, { useRef, useEffect, useState } from 'react';
import { RichTextEditor } from '../RichTextEditor';
import { SiteContent } from '../../../types';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';
import { useViewMode } from '../../../hooks/useViewMode';
import { MobileViewToggle } from '../MobileViewToggle';
import { EmptyState } from '../EmptyState';

interface FAQViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    faqFilter: 'all' | 'answered' | 'unanswered';
    setFaqFilter: (filter: 'all' | 'answered' | 'unanswered') => void;
    confirmAction: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

export const FAQView: React.FC<FAQViewProps> = ({
    editContent, setEditContent, faqFilter, setFaqFilter, confirmAction
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
    }, [editContent.faq]);

    const allFaq = editContent.faq || [];
    const counts = {
        all: allFaq.length,
        answered: allFaq.filter(f => f.a && f.a.trim().length > 0).length,
        unanswered: allFaq.filter(f => !f.a || f.a.trim().length === 0).length,
    };

    const filtered = allFaq.filter(f => {
        if (faqFilter === 'answered') return f.a && f.a.trim().length > 0;
        if (faqFilter === 'unanswered') return !f.a || f.a.trim().length === 0;
        return true;
    }).filter(f => !searchTerm || f.q.toLowerCase().includes(searchTerm.toLowerCase()) || (f.a || '').toLowerCase().includes(searchTerm.toLowerCase()));

    const { viewMode, toggleViewMode } = useViewMode();
    const isFiltering = faqFilter !== 'all' || !!searchTerm;
    const { getDragProps, getRowClassName } = useDragAndDrop(
        allFaq,
        (newFaq) => setEditContent({ ...editContent, faq: newFaq })
    );

    const handleDelete = (id: string, question: string) => {
        confirmAction({
            title: 'Soruyu Sil',
            description: `"${question.slice(0, 40)}..." sorusunu silmek istediğinize emin misiniz?`,
            type: 'danger',
            onConfirm: () => {
                setEditContent({ ...editContent, faq: allFaq.filter(f => f.id !== id) });
            }
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-8">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-[#020617]/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-500/20 to-transparent border border-violet-500/20 flex items-center justify-center shadow-inner group transition-transform duration-500 hover:scale-105">
                        <i className="fa-solid fa-circle-question text-violet-400 text-2xl group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5"><h2 className="text-2xl font-[900] text-white tracking-tight">Sıkça Sorulanlar</h2><span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Help Center</span></div>
                        <p className="text-[13px] text-slate-400 font-medium">Toplam {allFaq.length} adet soru ve cevap yönetiliyor</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => { const id = Date.now().toString(); setEditContent({ ...editContent, faq: [...allFaq, { id, q: 'Yeni Soru Başlığı', a: '' }] }); setExpandedId(id); }}
                        className="px-5 py-3 bg-[var(--color-primary)] hover:bg-amber-600 text-[#06080F] rounded-2xl font-[900] text-[11px] uppercase tracking-widest shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2.5 active:scale-95"><i className="fa-solid fa-plus text-[10px]"></i> Soru Ekle</button>
                </div>
            </div>

            <div className="bg-[#020617]/30 border border-white/[0.04] rounded-[2.5rem] p-5 shadow-xl backdrop-blur-2xl">
                <div className="flex flex-col lg:flex-row gap-5 items-center">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide w-full lg:w-auto">
                        {(['all', 'answered', 'unanswered'] as const).map(tab => (
                            <button key={tab} onClick={() => setFaqFilter(tab)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${faqFilter === tab ? 'bg-[var(--color-primary)] text-[#06080F]' : 'bg-white/5 text-slate-500 hover:text-white'}`}>{tab === 'all' ? 'Tümü' : tab === 'answered' ? 'Cevaplı' : 'Boş Cevap'} ({counts[tab] || 0})</button>
                        ))}
                    </div>
                    <div className="relative flex-1 w-full group">
                        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs transition-colors group-focus-within:text-[var(--color-primary)]"></i>
                        <input type="text" placeholder="Soru veya cevap içeriğinde ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-5 py-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-[13px] text-white focus:border-[var(--color-primary)]/40 outline-none transition-all font-semibold" />
                    </div>
                    <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="bg-[#020617]/20 border border-white/[0.04] rounded-[2.5rem] p-20 text-center"><EmptyState icon="fa-clipboard-question" title="Soru bulunamadı" description="Kriterlere uygun soru kaydı mevcut değil." /></div>
            ) : (
                <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
                    <table className="w-full text-left">
                        <thead><tr className="bg-white/[0.02] border-b border-white/[0.04]"><th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Soru İçeriği</th><th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-center">Durum</th><th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-right">İşlemler</th></tr></thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filtered.map((f) => {
                                const realIdx = allFaq.findIndex(item => item.id === f.id);
                                const isExp = expandedId === f.id;
                                const hasA = f.a && f.a.trim().length > 0;
                                const dragProps = !isFiltering ? getDragProps(realIdx) : {};
                                return (
                                    <React.Fragment key={f.id}>
                                        <tr {...dragProps} onClick={() => setExpandedId(isExp ? null : f.id)} className={`group hover:bg-white/[0.03] transition-all duration-300 cursor-pointer ${isExp ? 'bg-white/[0.02]' : ''} ${getRowClassName(realIdx)}`}>
                                            <td className="px-8 py-5"><div className="flex items-center gap-4">{!isFiltering && <i className="fa-solid fa-grip-vertical text-slate-800 group-hover:text-slate-600 mr-1"></i>}<div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${hasA ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}><i className={`fa-solid ${hasA ? 'fa-check' : 'fa-exclamation'} text-xs`}></i></div><div className="min-w-0"><p className="text-[14px] font-[800] text-white group-hover:text-[var(--color-primary)] transition-colors duration-300 line-clamp-1">{f.q}</p><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Sıra: {realIdx + 1}</p></div></div></td>
                                            <td className="px-6 py-5 text-center"><span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-[900] border tracking-widest ${hasA ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{hasA ? 'CEVAPLANDI' : 'BEKLEMEDE'}</span></td>
                                            <td className="px-8 py-5" onClick={e => e.stopPropagation()}><div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0"><button onClick={() => setExpandedId(isExp ? null : f.id)} className={`w-9 h-9 rounded-xl border transition-all flex items-center justify-center active:scale-95 ${isExp ? 'bg-[var(--color-primary)] text-[#06080F] border-[var(--color-primary)]' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'}`}><i className={`fa-solid ${isExp ? 'fa-chevron-up' : 'fa-pen'} text-xs`}></i></button><button onClick={() => handleDelete(f.id, f.q)} className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shadow-lg"><i className="fa-solid fa-trash-can text-xs"></i></button></div></td>
                                        </tr>
                                        {isExp && (
                                            <tr className="bg-white/[0.01]">
                                                <td colSpan={3} className="px-8 py-8 border-b border-white/[0.04]"><div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-top-2 duration-500"><div className="space-y-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Soru Metni</label><input value={f.q} onChange={e => { const n = [...allFaq]; n[realIdx].q = e.target.value; setEditContent({ ...editContent, faq: n }); }} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-4 text-[15px] font-[800] text-white focus:border-[var(--color-primary)]/50 outline-none transition-all" /></div><div className="space-y-3"><label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Cevap İçeriği</label><RichTextEditor value={f.a || ''} onChange={v => { const n = [...allFaq]; n[realIdx].a = v; setEditContent({ ...editContent, faq: n }); }} placeholder="Cevabı buraya yazın..." minRows={8} /></div><div className="flex justify-end gap-3"><button onClick={() => setExpandedId(null)} className="px-6 py-2.5 rounded-xl bg-emerald-500 text-[#06080F] font-black text-[11px] uppercase tracking-widest transition-all active:scale-95">Kaydet ve Kapat</button></div></div></td>
                                        </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            <div ref={faqEndRef} />
        </div>
    );
};
