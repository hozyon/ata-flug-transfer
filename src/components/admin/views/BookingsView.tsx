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
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            {/* Header / Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <i className="fa-solid fa-calendar-days text-blue-400 text-xl"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight">Rezervasyon Yönetimi</h2>
                        <p className="text-xs text-slate-500 font-medium">{filteredBookings.length} kayıt listeleniyor</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                    {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setBookingFilter(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${bookingFilter === status ? 'bg-[var(--color-primary)] text-[#06080F] shadow-lg shadow-[var(--color-primary)]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            {status === 'All' ? 'Tümü' : STATUS_CONFIG[status as Booking['status']].label}
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${bookingFilter === status ? 'bg-black/10' : 'bg-white/5'}`}>
                                {status === 'All' ? bookings.length : bookings.filter(b => b.status === status).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-4 shadow-2xl backdrop-blur-sm">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                        <input
                            type="text"
                            placeholder="Müşteri adı, telefon veya rota ile ara..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/[0.08] rounded-2xl text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 focus:bg-white/[0.08] outline-none transition-all font-medium"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="flex bg-white/5 rounded-2xl p-1 border border-white/[0.08]">
                            {[
                                { id: 'created', label: 'Yeni' },
                                { id: 'date', label: 'Tarih' },
                                { id: 'price', label: 'Fiyat' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => { if (sortBy === opt.id) setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); else setSortBy(opt.id as any); }}
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${sortBy === opt.id ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {opt.label}
                                    {sortBy === opt.id && <i className={`fa-solid fa-chevron-${sortDir === 'asc' ? 'up' : 'down'} ml-1.5 text-[8px]`}></i>}
                                </button>
                            ))}
                        </div>
                        <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            {filteredBookings.length === 0 ? (
                <EmptyState
                    icon="fa-calendar-xmark"
                    title="Rezervasyon bulunamadı"
                    description={searchTerm ? `"${searchTerm}" aramasına uygun kayıt yok.` : "Seçili filtrelere uygun rezervasyon kaydı bulunmuyor."}
                    action={searchTerm || bookingFilter !== 'All' ? { label: 'Filtreleri Temizle', onClick: () => { setSearchTerm(''); setBookingFilter('All'); } } : undefined}
                />
            ) : viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredBookings.map((b) => (
                        <SwipeableCard key={b.id} actions={[
                            { icon: 'fa-check', label: 'Onayla', color: 'bg-emerald-500', onClick: () => handleUpdateStatus(b.id, 'Confirmed') },
                            { icon: 'fa-trash', label: 'Sil', color: 'bg-red-500', onClick: () => handleDeleteBooking(b.id, b.customerName) },
                        ]}>
                            <div 
                                onClick={() => setSelectedBookingForView(b)}
                                className="group p-5 bg-white/[0.02] border border-white/[0.06] rounded-3xl hover:border-[var(--color-primary)]/30 hover:bg-white/[0.04] transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center font-black text-[var(--color-primary)]">
                                            {b.customerName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-[15px] truncate max-w-[140px]">{b.customerName}</p>
                                            <p className="text-[10px] text-slate-500 font-mono tracking-tight">{new Date(b.createdAt).toLocaleDateString('tr-TR')}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black border flex items-center gap-1.5 ${STATUS_CONFIG[b.status].bg} ${STATUS_CONFIG[b.status].color} ${STATUS_CONFIG[b.status].border}`}>
                                        <div className={`w-1 h-1 rounded-full ${STATUS_CONFIG[b.status].dot} animate-pulse`}></div>
                                        {STATUS_CONFIG[b.status].label.toUpperCase()}
                                    </span>
                                </div>

                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <i className="fa-solid fa-location-dot text-[var(--color-primary)]/60 text-[10px] w-4"></i>
                                        <span className="text-[11px] font-medium truncate">{b.pickup}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <i className="fa-solid fa-arrow-right text-slate-700 text-[10px] w-4"></i>
                                        <span className="text-[11px] font-medium truncate">{b.destination}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04]">
                                        <div className="flex items-center gap-3 text-white/70">
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-solid fa-calendar text-[10px] text-blue-400"></i>
                                                <span className="text-[11px] font-black">{b.date.split('-').reverse().join('.')}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-solid fa-clock text-[10px] text-blue-400"></i>
                                                <span className="text-[11px] font-black">{b.time}</span>
                                            </div>
                                        </div>
                                        <span className="text-sm font-black text-[var(--color-primary)]">
                                            {siteContent.currency?.symbol || '€'}{b.totalPrice}
                                        </span>
                                    </div>
                                </div>
                                
                                {submittingIds.has(b.id) && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                                        <i className="fa-solid fa-circle-notch fa-spin text-[var(--color-primary)] text-xl"></i>
                                    </div>
                                )}
                            </div>
                        </SwipeableCard>
                    ))}
                </div>
            ) : (
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/[0.04]">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Müşteri / Rota</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tarih & Saat</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Yolcu</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tutar</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Durum</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredBookings.map((b) => (
                                <tr 
                                    key={b.id} 
                                    onClick={() => setSelectedBookingForView(b)}
                                    className="group hover:bg-white/[0.03] transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-slate-400 group-hover:text-[var(--color-primary)] transition-colors">
                                                {b.customerName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">{b.customerName}</p>
                                                <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{b.pickup} → {b.destination}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            <p className="text-xs font-black text-white/90">{b.date.split('-').reverse().join('.')}</p>
                                            <p className="text-[10px] font-bold text-blue-400/80">{b.time}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 text-xs font-black text-white/70">{b.passengers}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-black text-[var(--color-primary)]">{siteContent.currency?.symbol || '€'}{b.totalPrice}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black border ${STATUS_CONFIG[b.status].bg} ${STATUS_CONFIG[b.status].color} ${STATUS_CONFIG[b.status].border}`}>
                                            <div className={`w-1 h-1 rounded-full ${STATUS_CONFIG[b.status].dot}`}></div>
                                            {STATUS_CONFIG[b.status].label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                            {b.status === 'Pending' && (
                                                <button 
                                                    onClick={() => handleUpdateStatus(b.id, 'Confirmed')}
                                                    disabled={submittingIds.has(b.id)}
                                                    className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"
                                                >
                                                    {submittingIds.has(b.id) ? <i className="fa-solid fa-spinner fa-spin text-[10px]"></i> : <i className="fa-solid fa-check text-[11px]"></i>}
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDeleteBooking(b.id, b.customerName)}
                                                disabled={submittingIds.has(b.id)}
                                                className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                            >
                                                {submittingIds.has(b.id) ? <i className="fa-solid fa-spinner fa-spin text-[10px]"></i> : <i className="fa-solid fa-trash text-[11px]"></i>}
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
