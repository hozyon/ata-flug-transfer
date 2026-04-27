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
    }).filter(f => !searchTerm || f.q.toLowerCase().includes(searchTerm.toLowerCase()));

    const { viewMode, toggleViewMode } = useViewMode();
    const isFiltering = faqFilter !== 'all' || !!searchTerm;
    const { getDragProps, getRowClassName } = useDragAndDrop(allFaq, (n) => setEditContent({ ...editContent, faq: n }));

    const handleDelete = (id: string, question: string) => {
        confirmAction({
            title: 'Soruyu Sil',
            description: `"${question.slice(0, 40)}..." kalıcı olarak silinecektir.`,
            type: 'danger',
            onConfirm: () => { setEditContent({ ...editContent, faq: allFaq.filter(f => f.id !== id) }); }
        });
    };

    const INPUT_CLS = 'w-full bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] px-8 py-4 text-sm font-bold text-slate-900 placeholder-slate-300 focus:bg-white focus:shadow-xl transition-all duration-500 outline-none shadow-sm';

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000 ease-out">
            <div className="admin-glass-panel rounded-[3rem] p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-sm transition-transform hover:scale-105 duration-500"><i className="fa-solid fa-circle-question text-xl"></i></div>
                    <div><h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Yardım & S.S.S</h2><p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.25em] mt-2">MÜŞTERİ DESTEK HATTI</p></div>
                </div>
                <button onClick={() => { const id = Date.now().toString(); setEditContent({ ...editContent, faq: [...allFaq, { id, q: 'Yeni Soru Başlığı', a: '' }] }); setExpandedId(id); }}
                    className="px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95 flex items-center gap-3"><i className="fa-solid fa-plus text-[10px]"></i> Yeni Soru Ekle</button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide p-1.5 bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] shadow-sm">
                    {(['all', 'answered', 'unanswered'] as const).map(tab => (
                        <button key={tab} onClick={() => setFaqFilter(tab)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${faqFilter === tab ? 'bg-slate-900 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-900'}`}>{tab === 'all' ? 'Hepsi' : tab === 'answered' ? 'Cevaplı' : 'Boş'} ({counts[tab]})</button>
                    ))}
                </div>
                <div className="relative flex-1 w-full group">
                    <i className="fa-solid fa-magnifying-glass absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 text-sm transition-colors group-focus-within:text-gold"></i>
                    <input type="text" placeholder="Sorularda ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-16 pr-8 py-5 bg-white/40 backdrop-blur-xl border border-white rounded-[2.5rem] text-[15px] font-bold text-slate-900 placeholder-slate-300 shadow-sm focus:bg-white focus:shadow-xl transition-all duration-500 outline-none" />
                </div>
                <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
            </div>

            {filtered.length === 0 ? (
                <div className="admin-glass-panel rounded-[4rem] p-32 text-center shadow-sm"><EmptyState icon="fa-clipboard-question" title="Soru Bulunamadı" description="Müşterilerinizin sıkça sorduğu soruları buraya ekleyin." /></div>
            ) : (
                <div className="space-y-6">
                    {filtered.map((f) => {
                        const realIdx = allFaq.findIndex(item => item.id === f.id);
                        const isExp = expandedId === f.id;
                        const hasA = f.a && f.a.trim().length > 0;
                        const dragProps = !isFiltering ? getDragProps(realIdx) : {};
                        return (
                            <div key={f.id} {...dragProps} className={`admin-glass-panel rounded-[2.5rem] overflow-hidden transition-all duration-500 ${isExp ? 'shadow-2xl ring-2 ring-gold/20' : 'hover:shadow-lg shadow-sm'} ${getRowClassName(realIdx)}`}>
                                <div onClick={() => setExpandedId(isExp ? null : f.id)} className="p-8 cursor-pointer flex items-center justify-between gap-6 relative group">
                                    <div className="flex items-center gap-6 flex-1 min-w-0">
                                        {!isFiltering && <i className="fa-solid fa-grip-vertical text-slate-200 group-hover:text-slate-400 transition-colors"></i>}
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm transition-all duration-700 ${hasA ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100 group-hover:rotate-12'}`}><i className={`fa-solid ${hasA ? 'fa-check' : 'fa-exclamation'} text-sm`}></i></div>
                                        <h4 className="text-[17px] font-black text-slate-900 group-hover:text-gold transition-colors truncate tracking-tight leading-none">{f.q}</h4>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black border tracking-widest ${hasA ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{hasA ? 'AKTİF' : 'CEVAP BEKLİYOR'}</span>
                                        <i className={`fa-solid fa-chevron-down text-slate-300 transition-transform duration-500 ${isExp ? 'rotate-180 text-gold' : ''}`}></i>
                                    </div>
                                </div>
                                {isExp && (
                                    <div className="px-8 pb-10 space-y-10 animate-in fade-in slide-in-from-top-4 duration-700 ease-out border-t border-white/40 pt-10 bg-slate-50/30">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">SORU BAŞLIĞI</label>
                                            <input value={f.q} onChange={e => { const n = [...allFaq]; n[realIdx].q = e.target.value; setEditContent({ ...editContent, faq: n }); }} className={INPUT_CLS} />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">DETAYLI YANIT</label>
                                            <div className="bg-white rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 overflow-hidden"><RichTextEditor value={f.a || ''} onChange={v => { const n = [...allFaq]; n[realIdx].a = v; setEditContent({ ...editContent, faq: n }); }} placeholder="Cevabı detaylandırın..." minRows={8} /></div>
                                        </div>
                                        <div className="flex justify-between items-center pt-4">
                                            <button onClick={() => handleDelete(f.id, f.q)} className="px-6 py-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"><i className="fa-solid fa-trash-can mr-2"></i>BU SORUYU SİL</button>
                                            <button onClick={() => setExpandedId(null)} className="px-12 py-4 rounded-[2rem] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all">DEĞİŞİKLİKLERİ KAYDET</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            <div ref={faqEndRef} />
        </div>
    );
};
