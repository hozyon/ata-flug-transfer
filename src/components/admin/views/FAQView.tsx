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
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-6">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-violet-50 border border-violet-100 flex items-center justify-center group transition-transform duration-500 hover:scale-105 shadow-sm shadow-violet-100/50">
                        <i className="fa-solid fa-circle-question text-violet-600 text-2xl"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Sıkça Sorulanlar</h2>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Help Center</span>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium">Toplam <span className="text-slate-900 font-bold">{allFaq.length}</span> adet soru ve cevap yönetiliyor</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => { const id = Date.now().toString(); setEditContent({ ...editContent, faq: [...allFaq, { id, q: 'Yeni Soru Başlığı', a: '' }] }); setExpandedId(id); }}
                        className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2.5">
                        <i className="fa-solid fa-plus text-[10px]"></i> Yeni Soru Ekle
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-5 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-5 items-center">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide w-full lg:w-auto p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                        {(['all', 'answered', 'unanswered'] as const).map(tab => (
                            <button key={tab} onClick={() => setFaqFilter(tab)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${faqFilter === tab ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>{tab === 'all' ? 'Tümü' : tab === 'answered' ? 'Cevaplı' : 'Boş Cevap'} ({counts[tab] || 0})</button>
                        ))}
                    </div>
                    <div className="relative flex-1 w-full group">
                        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs transition-colors group-focus-within:text-gold"></i>
                        <input type="text" placeholder="Soru veya cevap içeriğinde ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] text-slate-900 font-bold focus:bg-white focus:border-gold/40 outline-none transition-all placeholder:text-slate-300" />
                    </div>
                    <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                </div>
            </div>

            {/* Content Table */}
            {filtered.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-20 text-center shadow-sm"><EmptyState icon="fa-clipboard-question" title="Soru bulunamadı" description="Kriterlere uygun soru kaydı mevcut değil." /></div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead><tr className="bg-slate-50/50 border-b border-slate-100"><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Soru İçeriği</th><th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Durum</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th></tr></thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map((f) => {
                                const realIdx = allFaq.findIndex(item => item.id === f.id);
                                const isExp = expandedId === f.id;
                                const hasA = f.a && f.a.trim().length > 0;
                                const dragProps = !isFiltering ? getDragProps(realIdx) : {};
                                return (
                                    <React.Fragment key={f.id}>
                                        <tr {...dragProps} onClick={() => setExpandedId(isExp ? null : f.id)} className={`group hover:bg-slate-50 transition-all duration-300 cursor-pointer ${isExp ? 'bg-slate-50/50' : ''} ${getRowClassName(realIdx)}`}>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-5">
                                                    {!isFiltering && <i className="fa-solid fa-grip-vertical text-slate-200 group-hover:text-slate-400 transition-colors"></i>}
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm transition-all ${hasA ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                        <i className={`fa-solid ${hasA ? 'fa-check' : 'fa-exclamation'} text-xs`}></i>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[14px] font-bold text-slate-900 group-hover:text-gold transition-colors duration-300 line-clamp-1">{f.q}</p>
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Sıra: {realIdx + 1}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black border tracking-widest ${hasA ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                    {hasA ? 'CEVAPLANDI' : 'BEKLEMEDE'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                    <button onClick={() => setExpandedId(isExp ? null : f.id)} className={`w-9 h-9 rounded-xl border transition-all flex items-center justify-center shadow-sm active:scale-95 ${isExp ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:text-gold hover:border-gold/30'}`}>
                                                        <i className={`fa-solid ${isExp ? 'fa-chevron-up' : 'fa-pen'} text-xs`}></i>
                                                    </button>
                                                    <button onClick={() => handleDelete(f.id, f.q)} className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm">
                                                        <i className="fa-solid fa-trash-can text-xs"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {isExp && (
                                            <tr className="bg-slate-50/30">
                                                <td colSpan={3} className="px-8 py-10 border-b border-slate-100">
                                                    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-top-2 duration-500">
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Soru Başlığı</label>
                                                            <input value={f.q} onChange={e => { const n = [...allFaq]; n[realIdx].q = e.target.value; setEditContent({ ...editContent, faq: n }); }} className="w-full bg-white border border-slate-200 rounded-[1.5rem] px-6 py-5 text-lg font-bold text-slate-900 focus:border-gold/40 shadow-xl shadow-slate-100/50 outline-none transition-all" />
                                                        </div>
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Yanıt İçeriği</label>
                                                            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
                                                                <RichTextEditor value={f.a || ''} onChange={v => { const n = [...allFaq]; n[realIdx].a = v; setEditContent({ ...editContent, faq: n }); }} placeholder="Cevabı buraya yazın..." minRows={10} />
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-end pt-4">
                                                            <button onClick={() => setExpandedId(null)} className="px-10 py-3.5 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest transition-all hover:bg-black active:scale-95 shadow-2xl shadow-slate-200">Kaydet ve Kapat</button>
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
            <div ref={faqEndRef} />
        </div>
    );
};
