import React, { useState } from 'react';
import { useViewMode } from '../../../hooks/useViewMode';
import { MobileViewToggle } from '../MobileViewToggle';
import { SwipeableCard } from '../SwipeableCard';
import { EmptyState } from '../EmptyState';
import { Booking } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';

interface BookingsViewProps {
    bookings: Booking[];
    onUpdateStatus: (id: string, status: Booking['status']) => void;
    onDeleteBooking: (id: string) => void;
    setSelectedBookingForView: (booking: Booking | null) => void;
    showToast: (message: string, type: 'success' | 'error' | 'info' | 'delete' | 'warning') => void;
    confirmAction: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

const STATUS_CONFIG: Record<Booking['status'], { label: string; color: string; bg: string; border: string; dot: string; icon: string }> = {
    Pending: { label: 'Beklemede', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400', icon: 'fa-clock' },
    Confirmed: { label: 'Onaylı', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-400', icon: 'fa-check' },
    Completed: { label: 'Tamamlandı', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400', icon: 'fa-check-double' },
    Cancelled: { label: 'İptal', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', dot: 'bg-rose-400', icon: 'fa-xmark' },
    Rejected: { label: 'Reddedildi', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-400', icon: 'fa-ban' },
    Deleted: { label: 'Silindi', color: 'text-red-600', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-600', icon: 'fa-trash' },
};

export const BookingsView: React.FC<BookingsViewProps> = ({
    bookings, onUpdateStatus, onDeleteBooking, setSelectedBookingForView, showToast, confirmAction
}) => {
    const { siteContent } = useAppStore();
    const { viewMode, toggleViewMode } = useViewMode();
    const [bookingFilter, setBookingFilter] = useState<'All' | Booking['status']>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'created' | 'name' | 'price'>('created');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [submittingIds, setSubmittingIds] = useState<Set<string>>(new Set());

    const handleUpdateStatus = async (id: string, status: Booking['status']) => {
        setSubmittingIds(prev => new Set(prev).add(id));
        try {
            await onUpdateStatus(id, status);
        } catch (error: any) {
            console.error('Failed to update booking status:', error);
            showToast(error.message || 'Rezervasyon güncellenirken bir hata oluştu', 'error');
        } finally {
            setSubmittingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    const handleDeleteBooking = (id: string, customerName: string) => {
        confirmAction({
            title: 'Rezervasyonu Sil',
            description: `"${customerName}" isimli müşterinin rezervasyonunu KALICI olarak silmek istediğinize emin misiniz?`,
            type: 'danger',
            onConfirm: async () => {
                setSubmittingIds(prev => new Set(prev).add(id));
                try {
                    await onDeleteBooking(id);
                    showToast('Rezervasyon silindi', 'delete');
                } catch (error: any) {
                    showToast(error.message || 'Hata oluştu', 'error');
                } finally {
                    setSubmittingIds(prev => {
                        const next = new Set(prev);
                        next.delete(id);
                        return next;
                    });
                }
            }
        });
    };

    const filteredBookings = bookings
        .filter(b => bookingFilter === 'All' || b.status === bookingFilter)
        .filter(b => !searchTerm || 
            b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.phone.includes(searchTerm) ||
            b.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.destination.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let comp = 0;
            if (sortBy === 'date') comp = a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
            else if (sortBy === 'created') comp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            else if (sortBy === 'name') comp = a.customerName.localeCompare(b.customerName);
            else if (sortBy === 'price') comp = a.totalPrice - b.totalPrice;
            return sortDir === 'asc' ? comp : -comp;
        });

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-8">
            {/* Header / Stats — Premium Style */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-[#020617]/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-600/10 border border-blue-500/20 flex items-center justify-center shadow-inner group transition-transform duration-500 hover:scale-105">
                        <i className="fa-solid fa-calendar-days text-blue-400 text-2xl group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-2xl font-[900] text-white tracking-tight">Rezervasyon Yönetimi</h2>
                            <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Global</span>
                        </div>
                        <p className="text-[13px] text-slate-400 font-medium">Sistemde toplam {bookings.length} kayıt bulunuyor</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-hide">
                    {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setBookingFilter(status)}
                            className={`px-5 py-3 rounded-2xl text-[11px] font-[800] transition-all duration-300 whitespace-nowrap flex items-center gap-3 border shadow-sm ${bookingFilter === status ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[#06080F] shadow-[0_8px_20px_rgba(197,160,89,0.3)]' : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.08]'}`}
                        >
                            {status === 'All' ? 'Tümü' : STATUS_CONFIG[status as Booking['status']].label}
                            <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-lg text-[9px] font-black ${bookingFilter === status ? 'bg-black/10 text-[#06080F]' : 'bg-white/5 text-slate-500'}`}>
                                {status === 'All' ? bookings.length : bookings.filter(b => b.status === status).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Toolbar — High-end Search */}
            <div className="bg-[#020617]/30 border border-white/[0.04] rounded-[2rem] p-5 shadow-xl backdrop-blur-2xl">
                <div className="flex flex-col lg:flex-row gap-5 items-center">
                    <div className="relative flex-1 w-full group">
                        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs transition-colors group-focus-within:text-[var(--color-primary)]"></i>
                        <input
                            type="text"
                            placeholder="Müşteri adı, telefon veya rota ile akıllı arama..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-5 py-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-[13px] text-white placeholder-slate-600 focus:border-[var(--color-primary)]/40 focus:bg-white/[0.04] outline-none transition-all font-semibold"
                        />
                    </div>
                    
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="flex bg-white/[0.02] rounded-2xl p-1.5 border border-white/[0.06]">
                            {[
                                { id: 'created', label: 'YENİ' },
                                { id: 'date', label: 'TARİH' },
                                { id: 'price', label: 'FİYAT' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => { if (sortBy === opt.id) setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); else setSortBy(opt.id as any); }}
                                    className={`px-4 py-2 rounded-[14px] text-[9px] font-[900] tracking-widest transition-all duration-300 ${sortBy === opt.id ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {opt.label}
                                    {sortBy === opt.id && <i className={`fa-solid fa-chevron-${sortDir === 'asc' ? 'up' : 'down'} ml-2 text-[7px]`}></i>}
                                </button>
                            ))}
                        </div>
                        <div className="w-px h-8 bg-white/[0.08] mx-1 hidden sm:block"></div>
                        <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                    </div>
                </div>
            </div>

            {/* Main Content — Grid/Table Layout */}
            {filteredBookings.length === 0 ? (
                <div className="bg-[#020617]/20 border border-white/[0.04] rounded-[2.5rem] p-20">
                    <EmptyState
                        icon="fa-calendar-xmark"
                        title="Rezervasyon bulunamadı"
                        description={searchTerm ? `"${searchTerm}" aramasına uygun kayıt bulunamadı.` : "Seçili filtrelere uygun rezervasyon kaydı bulunmuyor."}
                        action={searchTerm || bookingFilter !== 'All' ? { label: 'Filtreleri Temizle', onClick: () => { setSearchTerm(''); setBookingFilter('All'); } } : undefined}
                    />
                </div>
            ) : viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredBookings.map((b) => (
                        <SwipeableCard key={b.id} actions={[
                            { icon: 'fa-check', label: 'Onayla', color: 'bg-emerald-500', onClick: () => handleUpdateStatus(b.id, 'Confirmed') },
                            { icon: 'fa-trash', label: 'Sil', color: 'bg-red-500', onClick: () => handleDeleteBooking(b.id, b.customerName) },
                        ]}>
                            <div 
                                onClick={() => setSelectedBookingForView(b)}
                                className="group p-6 bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] hover:border-[var(--color-primary)]/40 hover:bg-white/[0.03] transition-all duration-500 cursor-pointer relative overflow-hidden shadow-xl"
                            >
                                {/* Active Accent */}
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/15 to-transparent border border-[var(--color-primary)]/20 flex items-center justify-center font-[900] text-[var(--color-primary)] shadow-inner text-lg">
                                            {b.customerName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-[800] text-white text-[16px] truncate max-w-[160px] group-hover:text-[var(--color-primary)] transition-colors duration-300">{b.customerName}</p>
                                            <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-0.5">{new Date(b.createdAt).toLocaleDateString('tr-TR')}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-[900] border flex items-center gap-2 tracking-widest shadow-sm ${STATUS_CONFIG[b.status].bg} ${STATUS_CONFIG[b.status].color} ${STATUS_CONFIG[b.status].border}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[b.status].dot} shadow-[0_0_8px_currentColor]`}></div>
                                        {STATUS_CONFIG[b.status].label.toUpperCase()}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/40 shrink-0"></div>
                                            <span className="text-[12px] font-bold truncate opacity-80">{b.pickup}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-400 pl-0.5">
                                            <i className="fa-solid fa-arrow-down text-[8px] text-slate-800 ml-0.5"></i>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 shrink-0"></div>
                                            <span className="text-[12px] font-extrabold truncate">{b.destination}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.04]">
                                        <div className="flex items-center gap-4 text-white/70">
                                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                                <i className="fa-solid fa-clock text-[10px] text-blue-400/70"></i>
                                                <span className="text-[12px] font-[900] font-mono tabular-nums">{b.time}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-solid fa-user-group text-[10px] text-slate-600"></i>
                                                <span className="text-[11px] font-bold text-slate-500">{b.passengers}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[18px] font-[900] text-white tracking-tighter drop-shadow-lg">
                                                {siteContent.currency?.symbol || '€'}{b.totalPrice}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {submittingIds.has(b.id) && (
                                    <div className="absolute inset-0 bg-[#020617]/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                                        <div className="w-10 h-10 rounded-2xl bg-[#020617] border border-white/10 flex items-center justify-center shadow-2xl">
                                            <i className="fa-solid fa-circle-notch fa-spin text-[var(--color-primary)] text-xl"></i>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SwipeableCard>
                    ))}
                </div>
            ) : (
                <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/[0.04]">
                                <th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Müşteri / Rota</th>
                                <th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Zamanlama</th>
                                <th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-center">Detay</th>
                                <th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Tutar</th>
                                <th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Durum</th>
                                <th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredBookings.map((b) => (
                                <tr 
                                    key={b.id} 
                                    onClick={() => setSelectedBookingForView(b)}
                                    className="group hover:bg-white/[0.03] transition-all duration-300 cursor-pointer"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center font-[900] text-slate-400 group-hover:text-[var(--color-primary)] group-hover:border-[var(--color-primary)]/30 transition-all duration-500 shadow-inner">
                                                {b.customerName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[14px] font-[800] text-white group-hover:text-[var(--color-primary)] transition-colors duration-300">{b.customerName}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] text-slate-500 font-bold truncate max-w-[180px]">{b.pickup}</span>
                                                    <i className="fa-solid fa-arrow-right text-[8px] text-slate-700"></i>
                                                    <span className="text-[10px] text-slate-400 font-black truncate max-w-[180px]">{b.destination}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[11px] font-black text-white/90 tracking-tight">{b.date.split('-').reverse().join('.')}</p>
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-solid fa-clock text-[9px] text-blue-400/60"></i>
                                                <p className="text-[12px] font-black text-blue-400/90 font-mono tracking-tighter">{b.time}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                                            <i className="fa-solid fa-user text-[9px] text-slate-500"></i>
                                            <span className="text-[11px] font-black text-white/70">{b.passengers}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[16px] font-[900] text-white tracking-tighter">{siteContent.currency?.symbol || '€'}{b.totalPrice}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-[900] border tracking-widest ${STATUS_CONFIG[b.status].bg} ${STATUS_CONFIG[b.status].color} ${STATUS_CONFIG[b.status].border}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[b.status].dot} shadow-[0_0_5px_currentColor]`}></div>
                                            {STATUS_CONFIG[b.status].label.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            {b.status === 'Pending' && (
                                                <button 
                                                    onClick={() => handleUpdateStatus(b.id, 'Confirmed')}
                                                    disabled={submittingIds.has(b.id)}
                                                    className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg active:scale-95"
                                                    title="Onayla"
                                                >
                                                    {submittingIds.has(b.id) ? <i className="fa-solid fa-spinner fa-spin text-[10px]"></i> : <i className="fa-solid fa-check text-xs"></i>}
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDeleteBooking(b.id, b.customerName)}
                                                disabled={submittingIds.has(b.id)}
                                                className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg active:scale-95"
                                                title="Sil"
                                            >
                                                {submittingIds.has(b.id) ? <i className="fa-solid fa-spinner fa-spin text-[10px]"></i> : <i className="fa-solid fa-trash-can text-xs"></i>}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};