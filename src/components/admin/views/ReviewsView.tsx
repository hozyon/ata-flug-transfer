import React, { Dispatch, SetStateAction, useState, useMemo } from 'react';
import { useViewMode } from '../../../hooks/useViewMode';
import { MobileViewToggle } from '../MobileViewToggle';
import { SwipeableCard } from '../SwipeableCard';
import { EmptyState } from '../EmptyState';
import { haptic } from '../../../utils/haptic';
import type { UserReview as Review } from '../../../types';

interface SiteReview {
    name: string;
    country: string;
    rating: number;
    text: string;
}

interface ReviewsViewProps {
    userReviews: Review[];
    setUserReviews: Dispatch<SetStateAction<Review[]>>;
    siteReviews: SiteReview[];
    editableReviewsTab: 'pending' | 'approved' | 'rejected' | 'deleted';
    setEditableReviewsTab: Dispatch<SetStateAction<'pending' | 'approved' | 'rejected' | 'deleted'>>;
    selectedReviews: string[];
    setSelectedReviews: Dispatch<SetStateAction<string[]>>;
    showToast: (message: string, type: 'success' | 'error' | 'delete' | 'info') => void;
    confirmAction: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

const TAB_META: Record<string, { label: string; icon: string; emptyIcon: string; emptyTitle: string; emptySub: string }> = {
    pending: { label: 'Bekleyen', icon: 'fa-clock', emptyIcon: 'fa-check-circle', emptyTitle: 'Bekleyen yorum yok', emptySub: 'Tüm yorumlar incelendi ✓' },
    approved: { label: 'Onaylanan', icon: 'fa-circle-check', emptyIcon: 'fa-comments', emptyTitle: 'Onaylanan yorum yok', emptySub: 'Bekleyen yorumları onaylayarak başlayın' },
    rejected: { label: 'Reddedilen', icon: 'fa-circle-xmark', emptyIcon: 'fa-ban', emptyTitle: 'Reddedilen yorum yok', emptySub: 'Bu kategoride yorum yok' },
    deleted: { label: 'Çöp', icon: 'fa-trash-can', emptyIcon: 'fa-trash-can', emptyTitle: 'Çöp kutusu boş', emptySub: 'Silinen yorumlar burada görünür' },
};

export const ReviewsView: React.FC<ReviewsViewProps> = ({
    userReviews, setUserReviews, siteReviews,
    editableReviewsTab, setEditableReviewsTab,
    selectedReviews, setSelectedReviews,
    showToast, confirmAction
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>('date');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const { viewMode, toggleViewMode } = useViewMode();

    const handleSort = (col: string) => {
        if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortBy(col); setSortDir('desc'); }
    };

    const sortIcon = (col: string) => {
        if (sortBy !== col) return <i className="fa-solid fa-sort text-slate-700 text-[9px] ml-1"></i>;
        return sortDir === 'asc'
            ? <i className="fa-solid fa-sort-up text-[var(--color-primary)] text-[9px] ml-1"></i>
            : <i className="fa-solid fa-sort-down text-[var(--color-primary)] text-[9px] ml-1"></i>;
    };

    const getCountryName = (code: string) => {
        try { return new Intl.DisplayNames(['tr'], { type: 'region' }).of(code) || code; }
        catch { return code; }
    };

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

        list = [...list].sort((a, b) => {
            let cmp = 0;
            if (sortBy === 'name') cmp = a.name.localeCompare(b.name, 'tr');
            else if (sortBy === 'date') cmp = (a.createdAt || '').localeCompare(b.createdAt || '');
            else if (sortBy === 'rating') cmp = a.rating - b.rating;
            else if (sortBy === 'status') cmp = a.status.localeCompare(b.status);
            return sortDir === 'asc' ? cmp : -cmp;
        });

        return list;
    }, [userReviews, siteReviews, editableReviewsTab, searchTerm, sortBy, sortDir]);

    const allSelected = currentReviews.length > 0 && currentReviews.every(r => selectedReviews.includes(r.id));

    const toggleAll = () => {
        if (allSelected) setSelectedReviews([]);
        else setSelectedReviews(currentReviews.map(r => r.id));
    };

    const handleBulkAction = (action: 'approved' | 'rejected' | 'deleted' | 'pending' | 'permanentDelete') => {
        if (action === 'permanentDelete') {
            if (confirm(`${selectedReviews.length} yorumu kalıcı olarak silmek istediğinize emin misiniz?`)) {
                setUserReviews(userReviews.filter(r => !selectedReviews.includes(r.id)));
            }
        } else {
            setUserReviews(userReviews.map(r => selectedReviews.includes(r.id) ? { ...r, status: action } : r));
        }
        setSelectedReviews([]);
    };

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                    { label: 'Toplam Yorum', value: counts.approved + counts.pending, icon: 'fa-comments', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
                    { label: 'Onaylı', value: counts.approved, icon: 'fa-circle-check', iconBg: 'bg-emerald-500', gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/15' },
                    { label: 'Bekleyen', value: counts.pending, icon: 'fa-hourglass-half', iconBg: 'bg-amber-500', gradient: 'from-amber-500/15 to-orange-600/5', border: 'border-amber-500/15', alert: counts.pending > 0 },
                    { label: 'Reddedilen', value: counts.rejected, icon: 'fa-circle-xmark', iconBg: 'bg-red-500', gradient: 'from-red-500/15 to-rose-600/5', border: 'border-red-500/15' },
                    { label: 'Ort. Puan', value: avgRating, icon: 'fa-star', iconBg: 'bg-[var(--color-primary)]', gradient: 'from-[var(--color-primary)]/15 to-amber-600/5', border: 'border-[var(--color-primary)]/15' },
                ].map((s, i) => (
                    <div key={i} className={`p-4 rounded-2xl bg-gradient-to-br ${s.gradient} border ${s.border}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">{s.label}</p>
                                <p className="text-2xl font-black font-outfit text-white mt-1">{s.value}</p>
                                {'alert' in s && s.alert && <p className="text-[10px] text-amber-400 font-medium mt-1"><i className="fa-solid fa-circle-exclamation mr-1"></i>İnceleme bekliyor</p>}
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
                {/* Tabs */}
                <div className="flex items-center gap-1 px-4 pt-4 pb-3 overflow-x-auto scrollbar-hide">
                    {(['pending', 'approved', 'rejected', 'deleted'] as const).map(tab => {
                        const meta = TAB_META[tab];
                        return (
                            <button key={tab} onClick={() => { setEditableReviewsTab(tab); setSelectedReviews([]); }}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${editableReviewsTab === tab
                                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                                <i className={`fa-solid ${meta.icon} text-[10px]`}></i>
                                {meta.label}
                                <span className={`text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full ${editableReviewsTab === tab ? 'bg-white/20' : 'bg-white/5'} ${tab === 'pending' && counts.pending > 0 && editableReviewsTab !== tab ? '!bg-amber-500/20 !text-amber-400' : ''}`}>
                                    {counts[tab]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search + Bulk */}
                <div className="flex items-center gap-3 px-4 pb-4">
                    <div className="relative flex-1 max-w-md">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                        <input type="text" placeholder="Yorum veya isim ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 outline-none transition-all" />
                        {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><i className="fa-solid fa-xmark text-xs"></i></button>}
                    </div>

                    {selectedReviews.length > 0 && (
                        <div className="flex items-center gap-2 animate-in fade-in duration-200">
                            <span className="text-xs text-slate-400 font-medium">{selectedReviews.length} seçili</span>
                            {editableReviewsTab === 'pending' && (
                                <button onClick={() => handleBulkAction('approved')} className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all">
                                    <i className="fa-solid fa-eye mr-1.5"></i>Yayınla
                                </button>
                            )}
                            {editableReviewsTab === 'approved' && (
                                <button onClick={() => handleBulkAction('rejected')} className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all">
                                    <i className="fa-solid fa-eye-slash mr-1.5"></i>Yayından Kaldır
                                </button>
                            )}
                            {editableReviewsTab !== 'deleted' && (
                                <button onClick={() => handleBulkAction('deleted')} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all">
                                    <i className="fa-solid fa-trash mr-1.5"></i>Sil
                                </button>
                            )}
                            {editableReviewsTab === 'deleted' && (
                                <>
                                    <button onClick={() => handleBulkAction('pending')} className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all">
                                        <i className="fa-solid fa-rotate-left mr-1.5"></i>Geri Al
                                    </button>
                                    <button onClick={() => handleBulkAction('permanentDelete')} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all">
                                        <i className="fa-solid fa-fire mr-1.5"></i>Kalıcı Sil
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} itemCount={currentReviews.length} />
                    <span className="text-[11px] text-slate-600 ml-auto shrink-0 hidden md:inline">{currentReviews.length} yorum</span>
                </div>

                {/* Reviews: Table or Cards */}
                {currentReviews.length === 0 ? (
                    <EmptyState
                        icon={TAB_META[editableReviewsTab].emptyIcon}
                        title={TAB_META[editableReviewsTab].emptyTitle}
                        description={searchTerm ? `"${searchTerm}" ile eşleşen yorum yok` : TAB_META[editableReviewsTab].emptySub}
                        action={searchTerm ? { label: 'Aramayı Temizle', onClick: () => setSearchTerm('') } : undefined}
                    />
                ) : viewMode === 'card' ? (
                    /* ── MOBILE CARD VIEW ── */
                    <div className="p-3 space-y-3">
                        {currentReviews.map((r) => {
                            const isExpanded = expandedId === r.id;
                            const isDimmed = editableReviewsTab === 'rejected' || editableReviewsTab === 'deleted';

                            const swipeActions = [];
                            if (editableReviewsTab === 'pending') {
                                swipeActions.push({ icon: 'fa-check', label: 'Onayla', color: 'bg-emerald-500', onClick: () => { haptic.success(); setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'approved' } : item)); } });
                                swipeActions.push({ icon: 'fa-xmark', label: 'Reddet', color: 'bg-red-500', onClick: () => { haptic.error(); setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'rejected' } : item)); } });
                            } else if (editableReviewsTab === 'approved' && r.source !== 'site') {
                                swipeActions.push({ icon: 'fa-eye-slash', label: 'Kaldır', color: 'bg-amber-500', onClick: () => { haptic.error(); setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'rejected' } : item)); } });
                            } else if (editableReviewsTab === 'rejected' || editableReviewsTab === 'deleted') {
                                swipeActions.push({ icon: 'fa-rotate-left', label: 'Geri Al', color: 'bg-emerald-500', onClick: () => { haptic.success(); setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: editableReviewsTab === 'deleted' ? 'pending' : 'approved' } : item)); } });
                            }

                            return (
                                <SwipeableCard key={r.id} actions={swipeActions} onClick={() => setExpandedId(isExpanded ? null : r.id)}>
                                    <div className={`p-4 ${isDimmed ? 'opacity-60' : ''}`}>
                                        {/* Top: Avatar + Name + Rating */}
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg ${r.rating >= 4 ? 'bg-gradient-to-br from-emerald-500 to-green-600' :
                                                    r.rating >= 3 ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                                                        'bg-gradient-to-br from-red-500 to-rose-600'}`}>
                                                    {r.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`font-bold text-sm ${isDimmed ? 'line-through text-slate-500' : 'text-white'}`}>{r.name}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="text-sm">{r.country}</span>
                                                        <span className="text-[10px] text-slate-500">{getCountryName(r.country)}</span>
                                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${r.source === 'site' ? 'bg-violet-500/10 text-violet-400 border-violet-500/15' : 'bg-sky-500/10 text-sky-400 border-sky-500/15'}`}>
                                                            {r.source === 'site' ? 'Sistem' : 'Kullanıcı'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05] shrink-0">
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i key={i} className={`fa-solid fa-star text-[8px] ${i < r.rating ? 'text-[var(--color-primary)]' : 'text-slate-700'}`}></i>
                                                    ))}
                                                </div>
                                                <span className="text-[11px] font-bold text-white ml-1">{r.rating}</span>
                                            </div>
                                        </div>

                                        {/* Review Text */}
                                        <p className={`text-[12px] leading-relaxed ${isDimmed ? 'line-through text-slate-600' : 'text-slate-400'} ${isExpanded ? '' : 'line-clamp-2'}`}>{r.text}</p>

                                        {/* Bottom: Date + Actions */}
                                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.04]">
                                            <p className="text-[11px] text-slate-500 tabular-nums">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('tr-TR') : '—'}</p>
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {editableReviewsTab === 'pending' && (
                                                    <>
                                                        <button onClick={e => { e.stopPropagation(); haptic.success(); setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'approved' } : item)); }}
                                                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 active:bg-emerald-500/20 text-[11px] font-bold transition-all">
                                                            <i className="fa-solid fa-eye text-[9px]"></i>Yayınla
                                                        </button>
                                                        <button onClick={e => { e.stopPropagation(); haptic.error(); setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'rejected' } : item)); }}
                                                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 active:bg-red-500/20 text-[11px] font-bold transition-all">
                                                            <i className="fa-solid fa-xmark text-[9px]"></i>Reddet
                                                        </button>
                                                    </>
                                                )}
                                                {editableReviewsTab === 'approved' && r.source !== 'site' && (
                                                    <button onClick={e => { e.stopPropagation(); haptic.error(); setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'rejected' } : item)); }}
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 active:bg-emerald-500/20 text-[11px] font-bold transition-all">
                                                        <i className="fa-solid fa-eye-slash text-[9px]"></i>Yayından Kaldır
                                                    </button>
                                                )}
                                                {editableReviewsTab === 'rejected' && (
                                                    <button onClick={e => { e.stopPropagation(); haptic.success(); setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'approved' } : item)); }}
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 active:bg-emerald-500/20 text-[11px] font-bold transition-all">
                                                        <i className="fa-solid fa-eye text-[9px]"></i>Yayınla
                                                    </button>
                                                )}
                                                {editableReviewsTab === 'deleted' && (
                                                    <button onClick={e => { e.stopPropagation(); haptic.success(); setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'pending' } : item)); }}
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 active:bg-emerald-500/20 text-[11px] font-bold transition-all">
                                                        <i className="fa-solid fa-rotate-left text-[9px]"></i>Geri Al
                                                    </button>
                                                )}
                                                {editableReviewsTab !== 'deleted' && r.source !== 'site' && (
                                                    <button onClick={e => { e.stopPropagation(); if (confirm('Silmek istediğinize emin misiniz?')) { haptic.error(); setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'deleted' } : item)); } }}
                                                        className="w-8 h-8 rounded-lg bg-white/5 text-slate-500 active:bg-red-500/10 active:text-red-400 flex items-center justify-center transition-all">
                                                        <i className="fa-solid fa-trash text-xs"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </SwipeableCard>
                            );
                        })}
                    </div>
                ) : (
                    /* ── TABLE VIEW ── */
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-b border-white/[0.04] bg-white/[0.02]">
                                    <th className="w-10 px-4 py-3">
                                        <input type="checkbox" checked={allSelected} onChange={toggleAll}
                                            className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#c5a059] cursor-pointer" />
                                    </th>
                                    <th className="text-left px-3 py-3 cursor-pointer select-none" onClick={() => handleSort('name')}><span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Müşteri{sortIcon('name')}</span></th>
                                    <th className="text-left px-3 py-3 hidden md:table-cell"><span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Yorum</span></th>
                                    <th className="text-center px-3 py-3 w-28 cursor-pointer select-none" onClick={() => handleSort('rating')}><span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Puan{sortIcon('rating')}</span></th>
                                    <th className="text-left px-3 py-3 hidden lg:table-cell w-28 cursor-pointer select-none" onClick={() => handleSort('date')}><span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Tarih{sortIcon('date')}</span></th>
                                    <th className="text-left px-3 py-3 w-20 cursor-pointer select-none" onClick={() => handleSort('status')}><span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Kaynak{sortIcon('status')}</span></th>
                                    <th className="w-28 sm:w-40 px-3 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentReviews.map((r) => {
                                    const isSelected = selectedReviews.includes(r.id);
                                    const isExpanded = expandedId === r.id;
                                    const isDimmed = editableReviewsTab === 'rejected' || editableReviewsTab === 'deleted';

                                    return (
                                        <React.Fragment key={r.id}>
                                            <tr onClick={() => setExpandedId(isExpanded ? null : r.id)}
                                                className={`border-b border-white/[0.03] cursor-pointer transition-all group ${isSelected ? 'bg-[var(--color-primary)]/[0.06]' : 'hover:bg-white/[0.03]'} ${isDimmed ? 'opacity-60 hover:opacity-100' : ''}`}>
                                                {/* Checkbox */}
                                                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                                    <input type="checkbox" checked={isSelected}
                                                        onChange={e => { if (e.target.checked) setSelectedReviews([...selectedReviews, r.id]); else setSelectedReviews(selectedReviews.filter(id => id !== r.id)); }}
                                                        className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#c5a059] cursor-pointer" />
                                                </td>

                                                {/* Customer */}
                                                <td className="px-3 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg ${r.rating >= 4 ? 'bg-gradient-to-br from-emerald-500 to-green-600' :
                                                            r.rating >= 3 ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                                                                'bg-gradient-to-br from-red-500 to-rose-600'}`}>
                                                            {r.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className={`font-bold text-[13px] group-hover:text-[var(--color-primary)] transition-colors ${isDimmed ? 'line-through text-slate-500' : 'text-white'}`}>{r.name}</p>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <span className="text-sm">{r.country}</span>
                                                                <span className="text-[10px] text-slate-500">{getCountryName(r.country)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Review Text */}
                                                <td className="px-3 py-3.5 hidden md:table-cell">
                                                    <p className={`text-[12px] leading-relaxed max-w-[180px] sm:max-w-[300px] truncate ${isDimmed ? 'line-through text-slate-600' : 'text-slate-400'}`}>{r.text}</p>
                                                </td>

                                                {/* Rating */}
                                                <td className="px-3 py-3.5 text-center">
                                                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                                                        <div className="flex gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <i key={i} className={`fa-solid fa-star text-[8px] ${i < r.rating ? 'text-[var(--color-primary)]' : 'text-slate-700'}`}></i>
                                                            ))}
                                                        </div>
                                                        <span className="text-[11px] font-bold text-white ml-1">{r.rating}</span>
                                                    </div>
                                                </td>

                                                {/* Date */}
                                                <td className="px-3 py-3.5 hidden lg:table-cell">
                                                    <p className="text-[11px] text-slate-500 tabular-nums">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('tr-TR') : '—'}</p>
                                                </td>

                                                {/* Source */}
                                                <td className="px-3 py-3.5">
                                                    <span className={`text-[9px] font-bold px-2 py-1 rounded-md border ${r.source === 'site'
                                                        ? 'bg-violet-500/10 text-violet-400 border-violet-500/15'
                                                        : 'bg-sky-500/10 text-sky-400 border-sky-500/15'}`}>
                                                        {r.source === 'site' ? 'Sistem' : 'Kullanıcı'}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-3 py-3.5" onClick={e => e.stopPropagation()}>
                                                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity justify-end">
                                                        {editableReviewsTab === 'pending' && (
                                                            <>
                                                                <button onClick={() => setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'approved' } : item))}
                                                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10px] font-bold transition-all">
                                                                    <i className="fa-solid fa-eye text-[9px]"></i>Yayınla
                                                                </button>
                                                                <button onClick={() => setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'rejected' } : item))}
                                                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-[10px] font-bold transition-all">
                                                                    <i className="fa-solid fa-xmark text-[9px]"></i>Reddet
                                                                </button>
                                                            </>
                                                        )}
                                                        {editableReviewsTab === 'approved' && r.source !== 'site' && (
                                                            <button onClick={() => setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'rejected' } : item))}
                                                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10px] font-bold transition-all">
                                                                <i className="fa-solid fa-eye-slash text-[9px]"></i>Yayından Kaldır
                                                            </button>
                                                        )}
                                                        {editableReviewsTab === 'rejected' && (
                                                            <button onClick={() => setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'approved' } : item))}
                                                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10px] font-bold transition-all">
                                                                <i className="fa-solid fa-eye text-[9px]"></i>Yayınla
                                                            </button>
                                                        )}
                                                        {editableReviewsTab === 'deleted' && (
                                                            <button onClick={() => setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'pending' } : item))}
                                                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white text-[10px] font-bold transition-all">
                                                                <i className="fa-solid fa-rotate-left text-[9px]"></i>Geri Al
                                                            </button>
                                                        )}
                                                        {editableReviewsTab !== 'deleted' && r.source !== 'site' && (
                                                            <button onClick={() => {
                                                                confirmAction({
                                                                    title: 'Yorumu Sil',
                                                                    description: 'Yorum çöp kutusuna taşınacak. Emin misiniz?',
                                                                    type: 'danger',
                                                                    onConfirm: () => {
                                                                        setUserReviews(userReviews.map(item => item.id === r.id ? { ...item, status: 'deleted' } : item));
                                                                        showToast('Yorum çöpe taşındı', 'delete');
                                                                    }
                                                                });
                                                            }} title="Sil"
                                                                className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all">
                                                                <i className="fa-solid fa-trash text-[10px]"></i>
                                                            </button>
                                                        )}
                                                        {editableReviewsTab === 'deleted' && (
                                                            <button onClick={() => {
                                                                confirmAction({
                                                                    title: 'Kalıcı Olarak Sil',
                                                                    description: 'Bu yorum KALICI olarak silinecek. Bu işlem geri alınamaz!',
                                                                    type: 'danger',
                                                                    onConfirm: () => {
                                                                        setUserReviews(userReviews.filter(u => u.id !== r.id));
                                                                        showToast('Yorum kalıcı olarak silindi', 'delete');
                                                                    }
                                                                });
                                                            }} title="Kalıcı Sil"
                                                                className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all">
                                                                <i className="fa-solid fa-fire text-[10px]"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expandable Detail Row */}
                                            {isExpanded && (
                                                <tr className="bg-white/[0.02]">
                                                    <td colSpan={7} className="px-6 py-4">
                                                        <div className="flex gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                            <div className="flex-1">
                                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Tam Yorum</p>
                                                                <p className={`text-sm leading-relaxed ${isDimmed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{r.text}</p>
                                                            </div>
                                                            <div className="shrink-0 flex flex-col gap-2">
                                                                <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                                                                    <p className="text-[9px] text-slate-600 uppercase font-bold">Puan</p>
                                                                    <div className="flex gap-0.5 mt-1">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <i key={i} className={`fa-solid fa-star text-xs ${i < r.rating ? 'text-[var(--color-primary)]' : 'text-slate-700'}`}></i>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                                                                    <p className="text-[9px] text-slate-600 uppercase font-bold">Ülke</p>
                                                                    <p className="text-sm text-white mt-0.5">{r.country} {getCountryName(r.country)}</p>
                                                                </div>
                                                                {r.createdAt && (
                                                                    <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                                                                        <p className="text-[9px] text-slate-600 uppercase font-bold">Tarih</p>
                                                                        <p className="text-xs text-slate-400 mt-0.5 tabular-nums">{new Date(r.createdAt).toLocaleString('tr-TR')}</p>
                                                                    </div>
                                                                )}
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
        </div>
    );
};
