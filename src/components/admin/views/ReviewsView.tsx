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
    pending: { label: 'Bekleyen', icon: 'fa-clock', emptyIcon: 'fa-check-circle', emptyTitle: 'Bekleyen yorum yok', emptySub: 'Tüm yorumlar incelendi ✓', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    approved: { label: 'Onaylanan', icon: 'fa-circle-check', emptyIcon: 'fa-comments', emptyTitle: 'Onaylanan yorum yok', emptySub: 'Bekleyen yorumları onaylayarak başlayın', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    rejected: { label: 'Reddedilen', icon: 'fa-circle-xmark', emptyIcon: 'fa-ban', emptyTitle: 'Reddedilen yorum yok', emptySub: 'Bu kategoride yorum yok', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    deleted: { label: 'Çöp', icon: 'fa-trash-can', emptyIcon: 'fa-trash-can', emptyTitle: 'Çöp kutusu boş', emptySub: 'Silinen yorumlar burada görünür', color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200' },
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
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-6">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center group transition-transform duration-500 hover:scale-105 shadow-sm shadow-amber-100/50">
                        <i className="fa-solid fa-star text-amber-500 text-2xl"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Müşteri Yorumları</h2>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reviews</span>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium">Genel puan ortalaması: <span className="text-gold font-black tabular-nums">{avgRating} / 5.0</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-hide p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                    {(['pending', 'approved', 'rejected', 'deleted'] as const).map(status => (
                        <button key={status} onClick={() => { setEditableReviewsTab(status); }}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-3 border shadow-sm ${editableReviewsTab === status ? 'bg-white text-slate-900 border-slate-100' : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600'}`}>
                            <i className={`fa-solid ${TAB_META[status].icon} text-[10px]`}></i>
                            {TAB_META[status].label}
                            <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-lg text-[9px] font-black ${editableReviewsTab === status ? 'bg-gold/10 text-gold' : 'bg-slate-100 text-slate-400'}`}>{counts[status]}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-5 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-5 items-center">
                    <div className="relative flex-1 w-full group">
                        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs transition-colors group-focus-within:text-gold"></i>
                        <input type="text" placeholder="Müşteri veya yorum içeriği ile ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] text-slate-900 font-bold focus:bg-white focus:border-gold/40 outline-none transition-all placeholder:text-slate-300" />
                    </div>
                    <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                </div>
            </div>

            {currentReviews.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-20 text-center shadow-sm"><EmptyState icon={TAB_META[editableReviewsTab].emptyIcon} title={TAB_META[editableReviewsTab].emptyTitle} description={searchTerm ? `"${searchTerm}" aramasına uygun yorum bulunamadı.` : TAB_META[editableReviewsTab].emptySub} /></div>
            ) : viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {currentReviews.map(r => (
                        <SwipeableCard key={r.id} actions={[{ icon: 'fa-check', label: 'Onayla', color: 'bg-emerald-500', onClick: () => setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'approved' } : item)) }]}>
                            <div onClick={() => setExpandedId(expandedId === r.id ? null : r.id)} className="group p-6 bg-white border border-slate-100 rounded-[2.5rem] hover:border-gold/40 hover:shadow-xl transition-all duration-500 cursor-pointer relative overflow-hidden shadow-sm">
                                <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black shadow-sm text-base ${r.rating >= 4 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>{r.name.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <p className="font-black text-slate-900 text-[15px] truncate max-w-[140px] group-hover:text-gold transition-colors duration-300">{r.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{r.country}</span></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                                        <i className="fa-solid fa-star text-[10px] text-gold"></i>
                                        <span className="text-[13px] font-black text-slate-900 tabular-nums">{r.rating}.0</span>
                                    </div>
                                </div>
                                <p className={`text-[13px] leading-relaxed text-slate-600 font-medium ${expandedId === r.id ? '' : 'line-clamp-3'}`}>"{r.text}"</p>
                                <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-50">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.15em]">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('tr-TR') : 'SİSTEM KAYDI'}</p>
                                    <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black border tracking-widest uppercase ${TAB_META[r.status].bg} ${TAB_META[r.status].color} ${TAB_META[r.status].border}`}>{TAB_META[r.status].label}</span>
                                </div>
                            </div>
                        </SwipeableCard>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead><tr className="bg-slate-50/50 border-b border-slate-100"><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Müşteri</th><th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Yorum</th><th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Puan</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th></tr></thead>
                        <tbody className="divide-y divide-slate-50">
                            {currentReviews.map(r => (
                                <tr key={r.id} onClick={() => setExpandedId(expandedId === r.id ? null : r.id)} className="group hover:bg-slate-50 transition-all duration-300 cursor-pointer">
                                    <td className="px-8 py-5"><div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-sm text-sm ${r.rating >= 4 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>{r.name.charAt(0).toUpperCase()}</div><p className="text-[14px] font-bold text-slate-900 group-hover:text-gold transition-colors">{r.name}</p></div></td>
                                    <td className="px-6 py-5"><p className="text-[12px] text-slate-500 font-medium line-clamp-1 max-w-[300px]">"{r.text}"</p></td>
                                    <td className="px-6 py-5 text-center"><div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100"><i className="fa-solid fa-star text-[9px] text-gold"></i><span className="text-[11px] font-black text-slate-900">{r.rating}</span></div></td>
                                    <td className="px-8 py-5 text-right" onClick={e => e.stopPropagation()}><div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0"><button onClick={() => setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'approved' } : item))} className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-600 hover:text-white flex items-center justify-center shadow-sm transition-all"><i className="fa-solid fa-check text-xs"></i></button><button onClick={() => setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'deleted' } : item))} className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white flex items-center justify-center shadow-sm transition-all"><i className="fa-solid fa-trash-can text-xs"></i></button></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
