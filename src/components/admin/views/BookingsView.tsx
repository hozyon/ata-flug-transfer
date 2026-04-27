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
    Pending: { label: 'Beklemede', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', dot: 'bg-amber-500', icon: 'fa-clock' },
    Confirmed: { label: 'Onaylı', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', dot: 'bg-blue-500', icon: 'fa-check' },
    Completed: { label: 'Tamamlandı', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500', icon: 'fa-check-double' },
    Cancelled: { label: 'İptal', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', dot: 'bg-rose-500', icon: 'fa-xmark' },
    Rejected: { label: 'Reddedildi', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', dot: 'bg-slate-500', icon: 'fa-ban' },
    Deleted: { label: 'Silindi', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-100', dot: 'bg-red-600', icon: 'fa-trash' },
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
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-6">
            {/* Header / Stats — Refined Light Minimalism */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group transition-transform duration-500 hover:scale-105">
                        <i className="fa-solid fa-calendar-days text-indigo-600 text-2xl"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Rezervasyonlar</h2>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Global</span>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium">Sistemde toplam <span className="text-slate-900 font-bold">{bookings.length}</span> aktif kayıt bulunuyor</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-hide">
                    {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setBookingFilter(status)}
                            className={`px-5 py-3 rounded-2xl text-[11px] font-black transition-all duration-300 whitespace-nowrap flex items-center gap-3 border shadow-sm ${bookingFilter === status ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-[0_8px_20px_rgba(197,160,89,0.2)]' : 'bg-white border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            {status === 'All' ? 'Tümü' : STATUS_CONFIG[status as Booking['status']].label}
                            <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-lg text-[9px] font-black ${bookingFilter === status ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                {status === 'All' ? bookings.length : bookings.filter(b => b.status === status).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Toolbar — High-end Search */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-5 items-center">
                    <div className="relative flex-1 w-full group">
                        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs transition-colors group-focus-within:text-[var(--color-primary)]"></i>
                        <input
                            type="text"
                            placeholder="Müşteri adı, telefon veya rota ile akıllı arama..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] text-slate-900 placeholder-slate-400 focus:border-[var(--color-primary)]/40 focus:bg-white outline-none transition-all font-bold"
                        />
                    </div>
                    
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="flex bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
                            {[
                                { id: 'created', label: 'YENİ' },
                                { id: 'date', label: 'TARİH' },
                                { id: 'price', label: 'FİYAT' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => { if (sortBy === opt.id) setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); else setSortBy(opt.id as any); }}
                                    className={`px-4 py-2 rounded-[14px] text-[9px] font-black tracking-widest transition-all duration-300 ${sortBy === opt.id ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {opt.label}
                                    {sortBy === opt.id && <i className={`fa-solid fa-chevron-${sortDir === 'asc' ? 'up' : 'down'} ml-2 text-[7px]`}></i>}
                                </button>
                            ))}
                        </div>
                        <div className="w-px h-8 bg-slate-100 mx-1 hidden sm:block"></div>
                        <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                    </div>
                </div>
            </div>

            {/* Main Content — Grid/Table Layout */}
            {filteredBookings.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-20 shadow-sm">
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
                                className="group p-6 bg-white border border-slate-100 rounded-[2.5rem] hover:border-[var(--color-primary)]/40 hover:shadow-xl transition-all duration-500 cursor-pointer relative overflow-hidden shadow-sm"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 text-lg group-hover:text-gold transition-colors">
                                            {b.customerName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-[16px] truncate max-w-[140px] group-hover:text-gold transition-colors duration-300">{b.customerName}</p>
                                            <p className="text-[10px] text-slate-400 font-black tracking-widest mt-1 uppercase">{new Date(b.createdAt).toLocaleDateString('tr-TR')}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black border flex items-center gap-2 tracking-widest shadow-sm ${STATUS_CONFIG[b.status].bg} ${STATUS_CONFIG[b.status].color} ${STATUS_CONFIG[b.status].border}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[b.status].dot}`}></div>
                                        {STATUS_CONFIG[b.status].label.toUpperCase()}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0"></div>
                                            <span className="text-[12px] font-bold truncate opacity-80">{b.pickup}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-300 pl-0.5">
                                            <i className="fa-solid fa-arrow-down text-[8px] ml-0.5"></i>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/30 shrink-0"></div>
                                            <span className="text-[12px] font-black truncate">{b.destination}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-50">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                                                <i className="fa-solid fa-clock text-[10px] text-slate-400"></i>
                                                <span className="text-[12px] font-black font-mono tabular-nums text-slate-700">{b.time}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <i className="fa-solid fa-user-group text-[10px]"></i>
                                                <span className="text-[11px] font-black">{b.passengers}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[18px] font-black text-slate-900 tracking-tighter tabular-nums">
                                                {siteContent.currency?.symbol || '€'}{b.totalPrice}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {submittingIds.has(b.id) && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-20">
                                        <i className="fa-solid fa-circle-notch fa-spin text-gold text-2xl"></i>
                                    </div>
                                )}
                            </div>
                        </SwipeableCard>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Müşteri / Rota</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Zamanlama</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Detay</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tutar</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Durum</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredBookings.map((b) => (
                                <tr 
                                    key={b.id} 
                                    onClick={() => setSelectedBookingForView(b)}
                                    className="group hover:bg-slate-50/80 transition-all duration-300 cursor-pointer"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/50 flex items-center justify-center font-black text-slate-400 group-hover:text-gold group-hover:border-gold/30 transition-all duration-500">
                                                {b.customerName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[14px] font-bold text-slate-900 group-hover:text-gold transition-colors duration-300">{b.customerName}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] text-slate-500 font-bold truncate max-w-[180px]">{b.pickup}</span>
                                                    <i className="fa-solid fa-arrow-right text-[8px] text-slate-300"></i>
                                                    <span className="text-[10px] text-slate-400 font-black truncate max-w-[180px]">{b.destination}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[11px] font-black text-slate-500 tracking-tight">{b.date.split('-').reverse().join('.')}</p>
                                            <div className="flex items-center gap-1.5">
                                                <i className="fa-solid fa-clock text-[9px] text-indigo-400/60"></i>
                                                <p className="text-[12px] font-black text-indigo-600 font-mono tracking-tighter tabular-nums">{b.time}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
                                            <i className="fa-solid fa-user text-[9px] text-slate-400"></i>
                                            <span className="text-[11px] font-black text-slate-600">{b.passengers}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[16px] font-black text-slate-900 tracking-tighter tabular-nums">{siteContent.currency?.symbol || '€'}{b.totalPrice}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black border tracking-widest ${STATUS_CONFIG[b.status].bg} ${STATUS_CONFIG[b.status].color} ${STATUS_CONFIG[b.status].border}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[b.status].dot}`}></div>
                                            {STATUS_CONFIG[b.status].label.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            {b.status === 'Pending' && (
                                                <button 
                                                    onClick={() => handleUpdateStatus(b.id, 'Confirmed')}
                                                    disabled={submittingIds.has(b.id)}
                                                    className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm active:scale-95"
                                                    title="Onayla"
                                                >
                                                    {submittingIds.has(b.id) ? <i className="fa-solid fa-spinner fa-spin text-[10px]"></i> : <i className="fa-solid fa-check text-xs"></i>}
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleDeleteBooking(b.id, b.customerName)}
                                                disabled={submittingIds.has(b.id)}
                                                className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm active:scale-95"
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