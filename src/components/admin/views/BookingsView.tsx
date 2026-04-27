import React, { useState } from 'react';
import { useViewMode } from '../../../hooks/useViewMode';
import { MobileViewToggle } from '../MobileViewToggle';
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

const STATUS_CONFIG: Record<Booking['status'], { label: string; color: string; bg: string; border: string; dot: string }> = {
    Pending: { label: 'Beklemede', color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100', dot: 'bg-amber-500' },
    Confirmed: { label: 'Onaylandı', color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100', dot: 'bg-blue-500' },
    Completed: { label: 'Tamamlandı', color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100', dot: 'bg-emerald-500' },
    Cancelled: { label: 'İptal Edildi', color: 'text-rose-600', bg: 'bg-rose-50/50', border: 'border-rose-100', dot: 'bg-rose-500' },
    Rejected: { label: 'Reddedildi', color: 'text-slate-500', bg: 'bg-slate-50/50', border: 'border-slate-200', dot: 'bg-slate-400' },
    Deleted: { label: 'Silindi', color: 'text-red-700', bg: 'bg-red-50/50', border: 'border-red-100', dot: 'bg-red-600' },
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
        try { await onUpdateStatus(id, status); } 
        catch (e: any) { showToast(e.message || 'Hata oluştu', 'error'); } 
        finally { setSubmittingIds(prev => { const n = new Set(prev); n.delete(id); return n; }); }
    };

    const handleDeleteBooking = (id: string, customerName: string) => {
        confirmAction({
            title: 'Rezervasyonu Sil',
            description: `"${customerName}" rezervasyonunu kalıcı olarak silmek istiyor musunuz?`,
            type: 'danger',
            onConfirm: async () => {
                setSubmittingIds(prev => new Set(prev).add(id));
                try { await onDeleteBooking(id); showToast('Rezervasyon silindi', 'delete'); } 
                catch (e: any) { showToast(e.message || 'Hata', 'error'); } 
                finally { setSubmittingIds(prev => { const n = new Set(prev); n.delete(id); return n; }); }
            }
        });
    };

    const filteredBookings = bookings
        .filter(b => bookingFilter === 'All' || b.status === bookingFilter)
        .filter(b => !searchTerm || b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || b.phone.includes(searchTerm) || b.pickup.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            let comp = 0;
            if (sortBy === 'date') comp = a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
            else if (sortBy === 'created') comp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            else if (sortBy === 'name') comp = a.customerName.localeCompare(b.customerName);
            else if (sortBy === 'price') comp = a.totalPrice - b.totalPrice;
            return sortDir === 'asc' ? comp : -comp;
        });

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000 ease-out">
            
            {/* ── FILTER & STATS BAR ── */}
            <div className="admin-glass-panel rounded-[3rem] p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm"><i className="fa-solid fa-calendar-days text-xl"></i></div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Tüm Rezervasyonlar</h2>
                        <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.25em] mt-2">OPERASYONEL VERİ HATTI</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide p-1.5 bg-slate-50/50 rounded-[2rem] border border-white/60">
                    {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setBookingFilter(status)}
                            className={`px-6 py-3 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all duration-500 whitespace-nowrap flex items-center gap-3 ${bookingFilter === status ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-slate-900'}`}
                        >
                            {status === 'All' ? 'Tümü' : STATUS_CONFIG[status].label}
                            <span className={`flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-lg text-[9px] font-black ${bookingFilter === status ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                {status === 'All' ? bookings.length : bookings.filter(b => b.status === status).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── TOOLBAR: SEARCH & SORT ── */}
            <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full group">
                    <i className="fa-solid fa-magnifying-glass absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 text-sm transition-colors group-focus-within:text-gold"></i>
                    <input
                        type="text"
                        placeholder="Müşteri adı, telefon veya güzergah ile akıllı arama..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-white/40 backdrop-blur-xl border border-white rounded-[2.5rem] text-[15px] font-bold text-slate-900 placeholder-slate-300 shadow-sm focus:bg-white focus:shadow-xl transition-all duration-500 outline-none"
                    />
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <div className="flex bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] p-1.5 shadow-sm">
                        {[{id:'created', label:'YENİ'}, {id:'date', label:'TARİH'}, {id:'price', label:'FİYAT'}].map(opt => (
                            <button key={opt.id} onClick={() => { if(sortBy === opt.id) setSortDir(sortDir==='asc'?'desc':'asc'); else setSortBy(opt.id as any); }} className={`px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all duration-500 ${sortBy === opt.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                                {opt.label} {sortBy === opt.id && <i className={`fa-solid fa-chevron-${sortDir==='asc'?'up':'down'} ml-1`}></i>}
                            </button>
                        ))}
                    </div>
                    <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                </div>
            </div>

            {/* ── CONTENT AREA ── */}
            {filteredBookings.length === 0 ? (
                <div className="admin-glass-panel rounded-[4rem] p-32 text-center shadow-sm"><EmptyState icon="fa-calendar-xmark" title="Eşleşme Bulunamadı" description="Seçili filtrelere uygun kayıt mevcut değil." /></div>
            ) : (
                <div className="space-y-6">
                    {filteredBookings.map((b, idx) => (
                        <div 
                            key={b.id} 
                            onClick={() => setSelectedBookingForView(b)}
                            className="admin-glass-panel rounded-[2.5rem] p-6 sm:p-8 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-700 cursor-pointer group relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 ease-out shadow-sm"
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                                
                                {/* Client Info */}
                                <div className="flex items-center gap-6 lg:w-1/4 shrink-0">
                                    <div className="w-16 h-16 rounded-[2rem] bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-2xl group-hover:scale-105 transition-transform duration-700">
                                        {b.customerName.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-[17px] font-black text-slate-900 group-hover:text-gold transition-colors truncate tracking-tight">{b.customerName}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">{b.phone}</p>
                                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">MÜŞTERİ</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Route Info */}
                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0" />
                                            <span className="text-[13px] font-bold truncate max-w-[200px]">{b.pickup}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-900">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                            <span className="text-[13px] font-black truncate max-w-[200px]">{b.destination}</span>
                                        </div>
                                    </div>
                                    <div className="h-10 w-px bg-slate-100 hidden xl:block" />
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">PLANLANAN</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[14px] font-black text-slate-900 font-mono">{new Date(b.date).toLocaleDateString('tr-TR', {day:'numeric', month:'long'})}</span>
                                            <div className="px-2.5 py-1 rounded-xl bg-slate-900 text-white text-[12px] font-black font-mono tracking-tighter">{b.time}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Price & Status */}
                                <div className="flex items-center justify-between lg:justify-end gap-10 lg:w-1/4 shrink-0">
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-slate-900 tracking-tighter tabular-nums">
                                            <span className="text-sm mr-1 text-gold opacity-80">{siteContent.currency?.symbol || '€'}</span>
                                            {b.totalPrice}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <span className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 border shadow-sm ${STATUS_CONFIG[b.status].bg} ${STATUS_CONFIG[b.status].color} ${STATUS_CONFIG[b.status].border}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[b.status].dot}`} />
                                            {STATUS_CONFIG[b.status].label}
                                        </span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0" onClick={e => e.stopPropagation()}>
                                            {b.status === 'Pending' && (
                                                <button onClick={() => handleUpdateStatus(b.id, 'Confirmed')} className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all shadow-sm flex items-center justify-center active:scale-90"><i className="fa-solid fa-check"></i></button>
                                            )}
                                            <button onClick={() => handleDeleteBooking(b.id, b.customerName)} className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center active:scale-90"><i className="fa-solid fa-trash-can text-sm"></i></button>
                                        </div>
                                    </div>
                                </div>

                                {submittingIds.has(b.id) && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-20">
                                        <i className="fa-solid fa-circle-notch fa-spin text-gold text-2xl"></i>
                                    </div>
                                )}
                            </div>
                            
                            {/* Visual background ornament */}
                            <div className="absolute bottom-[-50px] right-[-20px] text-[120px] text-slate-900/5 font-black pointer-events-none group-hover:text-gold/5 transition-colors rotate-12 italic uppercase select-none">
                                {b.status}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
