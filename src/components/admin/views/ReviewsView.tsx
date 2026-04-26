import React, { Dispatch, SetStateAction, useState, useMemo } from 'react';
import { useViewMode } from '../../../hooks/useViewMode';
import { MobileViewToggle } from '../MobileViewToggle';
import { SwipeableCard } from '../SwipeableCard';
import { EmptyState } from '../EmptyState';
import type { UserReview as Review } from '../../../types';

interface SiteReview {
    name: string;
    country: string;
    rating: number;
    text: string;
}

interface ReviewsViewProps {
    userReviews: Review[];
    setUserReviews: (reviews: Review[] | ((prev: Review[]) => Review[])) => void;
    siteReviews: SiteReview[];
    editableReviewsTab: 'pending' | 'approved' | 'rejected' | 'deleted';
    setEditableReviewsTab: Dispatch<SetStateAction<'pending' | 'approved' | 'rejected' | 'deleted'>>;
}

const TAB_META: Record<string, { label: string; icon: string; emptyIcon: string; emptyTitle: string; emptySub: string; color: string; bg: string; border: string }> = {
    pending: { label: 'Bekleyen', icon: 'fa-clock', emptyIcon: 'fa-check-circle', emptyTitle: 'Bekleyen yorum yok', emptySub: 'Tüm yorumlar incelendi ✓', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    approved: { label: 'Onaylanan', icon: 'fa-circle-check', emptyIcon: 'fa-comments', emptyTitle: 'Onaylanan yorum yok', emptySub: 'Bekleyen yorumları onaylayarak başlayın', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    rejected: { label: 'Reddedilen', icon: 'fa-circle-xmark', emptyIcon: 'fa-ban', emptyTitle: 'Reddedilen yorum yok', emptySub: 'Bu kategoride yorum yok', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    deleted: { label: 'Çöp', icon: 'fa-trash-can', emptyIcon: 'fa-trash-can', emptyTitle: 'Çöp kutusu boş', emptySub: 'Silinen yorumlar burada görünür', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-white/10' },
};

export const ReviewsView: React.FC<ReviewsViewProps> = ({
    userReviews, setUserReviews, siteReviews,
    editableReviewsTab, setEditableReviewsTab
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const { viewMode, toggleViewMode } = useViewMode();

    const counts = useMemo(() => ({
        pending: userReviews.filter(r => r.status === 'pending').length,
        approved: userReviews.filter(r => r.status === 'approved').length + siteReviews.length,
        rejected: userReviews.filter(r => r.status === 'rejected').length,
        deleted: userReviews.filter(r => r.status === 'deleted').length,
    }), [userReviews, siteReviews]);

    const avgRating = useMemo(() => {
        const all = [...userReviews.filter(r => r.status === 'approved'), ...siteReviews];
        return all.length > 0 ? (all.reduce((s, r) => s + r.rating, 0) / all.length).toFixed(1) : '—';
    }, [userReviews, siteReviews]);

    const currentReviews = useMemo(() => {
        let list: (Review & { source?: 'user' | 'site' })[] = editableReviewsTab === 'approved'
            ? [
                ...userReviews.filter(r => r.status === 'approved').map(r => ({ ...r, source: 'user' as const })),
                ...siteReviews.map(r => ({ ...r, source: 'site' as const, status: 'approved' as const, id: `site-${r.name}`, createdAt: undefined as string | undefined }))
            ]
            : userReviews.filter(r => r.status === editableReviewsTab).map(r => ({ ...r, source: 'user' as const }));

        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            list = list.filter(r => r.name.toLowerCase().includes(q) || r.text.toLowerCase().includes(q));
        }
        return list;
    }, [userReviews, siteReviews, editableReviewsTab, searchTerm]);

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-8">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-[#020617]/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20 flex items-center justify-center shadow-inner group transition-transform duration-500 hover:scale-105">
                        <i className="fa-solid fa-star text-amber-400 text-2xl group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5"><h2 className="text-2xl font-[900] text-white tracking-tight">Müşteri Yorumları</h2><span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Testimonials</span></div>
                        <p className="text-[13px] text-slate-400 font-medium">Genel puan ortalaması: <span className="text-[var(--color-primary)] font-black">{avgRating} / 5.0</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-hide">
                    {(['pending', 'approved', 'rejected', 'deleted'] as const).map(status => (
                        <button key={status} onClick={() => { setEditableReviewsTab(status); }}
                            className={`px-5 py-3 rounded-2xl text-[11px] font-[800] transition-all duration-300 whitespace-nowrap flex items-center gap-3 border shadow-sm ${editableReviewsTab === status ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[#06080F] shadow-[0_8px_20px_rgba(197,160,89,0.3)]' : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.08]'}`}>
                            <i className={`fa-solid ${TAB_META[status].icon} text-[10px]`}></i>
                            {TAB_META[status].label}
                            <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-lg text-[9px] font-black ${editableReviewsTab === status ? 'bg-black/10 text-[#06080F]' : 'bg-white/5 text-slate-500'}`}>{counts[status]}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-[#020617]/30 border border-white/[0.04] rounded-[2.5rem] p-5 shadow-xl backdrop-blur-2xl">
                <div className="flex flex-col lg:flex-row gap-5 items-center">
                    <div className="relative flex-1 w-full group">
                        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs transition-colors group-focus-within:text-[var(--color-primary)]"></i>
                        <input type="text" placeholder="Müşteri adı veya yorum içeriği ile akıllı arama..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-5 py-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-[13px] text-white focus:border-[var(--color-primary)]/40 outline-none transition-all font-semibold" />
                    </div>
                    <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                </div>
            </div>

            {currentReviews.length === 0 ? (
                <div className="bg-[#020617]/20 border border-white/[0.04] rounded-[2.5rem] p-20 text-center"><EmptyState icon={TAB_META[editableReviewsTab].emptyIcon} title={TAB_META[editableReviewsTab].emptyTitle} description={searchTerm ? `"${searchTerm}" aramasına uygun yorum bulunamadı.` : TAB_META[editableReviewsTab].emptySub} /></div>
            ) : viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {currentReviews.map(r => (
                        <SwipeableCard key={r.id} actions={[{ icon: 'fa-check', label: 'Onayla', color: 'bg-emerald-500', onClick: () => setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'approved' } : item)) }]}>
                            <div onClick={() => setExpandedId(expandedId === r.id ? null : r.id)} className="group p-6 bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] hover:border-[var(--color-primary)]/40 transition-all cursor-pointer relative overflow-hidden shadow-xl">
                                <div className="flex items-start justify-between mb-5"><div className="flex items-center gap-4"><div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-[900] shadow-inner text-base ${r.rating >= 4 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{r.name.charAt(0).toUpperCase()}</div><div><p className="font-[800] text-white text-[15px] truncate max-w-[140px] group-hover:text-[var(--color-primary)] transition-colors">{r.name}</p><div className="flex items-center gap-2 mt-0.5"><span className="text-[10px] text-slate-500 uppercase tracking-widest">{r.country}</span></div></div></div><div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05]"><i className="fa-solid fa-star text-[10px] text-[var(--color-primary)]"></i><span className="text-[13px] font-[900] text-white tabular-nums">{r.rating}.0</span></div></div>
                                <p className={`text-[13px] leading-relaxed text-slate-400 font-medium ${expandedId === r.id ? '' : 'line-clamp-3'}`}>{r.text}</p>
                                <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.04]"><p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.15em]">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('tr-TR') : 'SİSTEM KAYDI'}</p><span className={`px-2.5 py-1 rounded-lg text-[8px] font-black border tracking-widest uppercase ${TAB_META[r.status].bg} ${TAB_META[r.status].color} ${TAB_META[r.status].border}`}>{TAB_META[r.status].label}</span></div>
                            </div>
                        </SwipeableCard>
                    ))}
                </div>
            ) : (
                <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
                    <table className="w-full text-left">
                        <thead><tr className="bg-white/[0.02] border-b border-white/[0.04]"><th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Müşteri</th><th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Yorum</th><th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-center">Puan</th><th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-right">İşlemler</th></tr></thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {currentReviews.map(r => (
                                <tr key={r.id} onClick={() => setExpandedId(expandedId === r.id ? null : r.id)} className="group hover:bg-white/[0.03] transition-all cursor-pointer">
                                    <td className="px-8 py-5"><div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-xl flex items-center justify-center font-[900] shadow-inner text-sm ${r.rating >= 4 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{r.name.charAt(0).toUpperCase()}</div><p className="text-[14px] font-[800] text-white group-hover:text-[var(--color-primary)] transition-colors">{r.name}</p></div></td>
                                    <td className="px-6 py-5"><p className="text-[12px] text-slate-400 font-medium line-clamp-1 max-w-[300px]">"{r.text}"</p></td>
                                    <td className="px-6 py-5 text-center"><div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10"><i className="fa-solid fa-star text-[9px] text-[var(--color-primary)]"></i><span className="text-[11px] font-black text-white/70">{r.rating}</span></div></td>
                                    <td className="px-8 py-5 text-right" onClick={e => e.stopPropagation()}><div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0"><button onClick={() => setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'approved' } : item))} className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-lg"><i className="fa-solid fa-check text-xs"></i></button><button onClick={() => setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'deleted' } : item))} className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shadow-lg"><i className="fa-solid fa-trash-can text-xs"></i></button></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
