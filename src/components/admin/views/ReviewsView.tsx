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
    pending: { label: 'Bekleyen', icon: 'fa-clock', emptyIcon: 'fa-check-circle', emptyTitle: 'Tümü Temiz', emptySub: 'İncelenecek yeni yorum yok.', color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100' },
    approved: { label: 'Yayında', icon: 'fa-circle-check', emptyIcon: 'fa-comments', emptyTitle: 'Yorum Yok', emptySub: 'Henüz onaylanmış bir yorum bulunmuyor.', color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
    rejected: { label: 'Gizlenen', icon: 'fa-circle-xmark', emptyIcon: 'fa-ban', emptyTitle: 'Kategori Boş', emptySub: 'Reddedilmiş yorum bulunmuyor.', color: 'text-rose-600', bg: 'bg-rose-50/50', border: 'border-rose-100' },
    deleted: { label: 'Çöp Kutusu', icon: 'fa-trash-can', emptyIcon: 'fa-trash-can', emptyTitle: 'Çöp Kutusu Boş', emptySub: 'Silinen yorumlar burada tutulur.', color: 'text-slate-400', bg: 'bg-slate-50/50', border: 'border-slate-200' },
};

export const ReviewsView: React.FC<ReviewsViewProps> = ({
    userReviews, setUserReviews, siteReviews,
    editableReviewsTab, setEditableReviewsTab
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { viewMode, toggleViewMode } = useViewMode();

    const counts = useMemo(() => ({
        pending: userReviews.filter(r => r.status === 'pending').length,
        approved: userReviews.filter(r => r.status === 'approved').length + siteReviews.length,
        rejected: userReviews.filter(r => r.status === 'rejected').length,
        deleted: userReviews.filter(r => r.status === 'deleted').length,
    }), [userReviews, siteReviews]);

    const avgRating = useMemo(() => {
        const all = [...userReviews.filter(r => r.status === 'approved'), ...siteReviews];
        return all.length > 0 ? (all.reduce((s, r) => s + r.rating, 0) / all.length).toFixed(1) : '0.0';
    }, [userReviews, siteReviews]);

    const currentReviews = useMemo(() => {
        let list: (Review & { source?: 'user' | 'site' })[] = editableReviewsTab === 'approved'
            ? [
                ...userReviews.filter(r => r.status === 'approved').map(r => ({ ...r, source: 'user' as const })),
                ...siteReviews.map(r => ({ ...r, source: 'site' as const, status: 'approved' as const, id: `site-${r.name}`, createdAt: undefined }))
            ]
            : userReviews.filter(r => r.status === editableReviewsTab).map(r => ({ ...r, source: 'user' as const }));

        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            list = list.filter(r => r.name.toLowerCase().includes(q) || r.text.toLowerCase().includes(q));
        }
        return list;
    }, [userReviews, siteReviews, editableReviewsTab, searchTerm]);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000 ease-out">
            <div className="admin-glass-panel rounded-[3rem] p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm transition-transform hover:scale-105 duration-500"><i className="fa-solid fa-star text-xl"></i></div>
                    <div><h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Müşteri Deneyimleri</h2><p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.25em] mt-2">MEMNUNİYET ORTALAMASI: <span className="text-gold">{avgRating} / 5.0</span></p></div>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-hide p-1.5 bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] shadow-sm">
                    {(['pending', 'approved', 'rejected', 'deleted'] as const).map(status => (
                        <button key={status} onClick={() => setEditableReviewsTab(status)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap flex items-center gap-3 ${editableReviewsTab === status ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-slate-900'}`}>
                            {TAB_META[status].label}
                            <span className={`flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-lg text-[9px] font-black ${editableReviewsTab === status ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>{counts[status]}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full group">
                    <i className="fa-solid fa-magnifying-glass absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 text-sm transition-colors group-focus-within:text-gold"></i>
                    <input type="text" placeholder="Müşteri veya içerik ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-16 pr-8 py-5 bg-white/40 backdrop-blur-xl border border-white rounded-[2.5rem] text-[15px] font-bold text-slate-900 placeholder-slate-300 shadow-sm focus:bg-white focus:shadow-xl transition-all duration-500 outline-none" />
                </div>
                <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
            </div>

            {currentReviews.length === 0 ? (
                <div className="admin-glass-panel rounded-[4rem] p-32 text-center shadow-sm"><EmptyState icon={TAB_META[editableReviewsTab].emptyIcon} title={TAB_META[editableReviewsTab].emptyTitle} description={searchTerm ? `"${searchTerm}" aramasına uygun kayıt mevcut değil.` : TAB_META[editableReviewsTab].emptySub} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {currentReviews.map((r, idx) => (
                        <SwipeableCard key={r.id} actions={[{ icon: 'fa-check', label: 'Onayla', color: 'bg-emerald-500', onClick: () => setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'approved' } : item)) }]}>
                            <div className="admin-glass-panel rounded-[3.5rem] p-8 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-1000 cursor-pointer group relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 shadow-sm" style={{ animationDelay: `${idx * 80}ms` }}>
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center font-black text-lg shadow-2xl transition-transform duration-700 group-hover:rotate-6 ${r.rating >= 4 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>{r.name.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <h4 className="text-[17px] font-black text-slate-900 group-hover:text-gold transition-colors truncate tracking-tight leading-none">{r.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">{r.country}</p>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5 shadow-inner">
                                        <i className="fa-solid fa-star text-gold text-[10px]"></i>
                                        <span className="text-[14px] font-black text-slate-900 tabular-nums">{r.rating}.0</span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <i className="fa-solid fa-quote-left absolute -top-4 -left-2 text-slate-100 text-4xl -z-10 group-hover:text-gold/10 transition-colors"></i>
                                    <p className="text-[14px] leading-[1.7] text-slate-600 font-medium italic">"{r.text}"</p>
                                </div>
                                <div className="mt-10 pt-6 border-t border-white/40 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('tr-TR') : 'SİSTEM KAYDI'}</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                        <button onClick={() => setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'approved' } : item))} className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all shadow-sm flex items-center justify-center active:scale-90"><i className="fa-solid fa-check text-xs"></i></button>
                                        <button onClick={() => setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'rejected' } : item))} className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all shadow-sm flex items-center justify-center active:scale-90"><i className="fa-solid fa-trash-can text-xs"></i></button>
                                    </div>
                                </div>
                                {/* Subtle background star */}
                                <i className="fa-solid fa-star absolute bottom-[-40px] left-[-30px] text-[150px] text-slate-900/5 rotate-[-15deg] pointer-events-none group-hover:text-gold/5 transition-colors" />
                            </div>
                        </SwipeableCard>
                    ))}
                </div>
            )}
        </div>
    );
};
