import React, { useState, useMemo } from 'react';
import { Booking } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import { useViewMode } from '../../../hooks/useViewMode';
import { MobileViewToggle } from '../MobileViewToggle';
import { SwipeableCard } from '../SwipeableCard';
import { EmptyState } from '../EmptyState';
import { haptic } from '../../../utils/haptic';

interface BookingsViewProps {
    bookings: Booking[];
    onUpdateStatus: (id: string, status: Booking['status']) => void;
    onDeleteBooking: (id: string) => void;
    setSelectedBookingForView: (booking: Booking | null) => void;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string; dot: string; icon: string }> = {
    Pending: { label: 'Beklemede', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400', icon: 'fa-clock' },
    Confirmed: { label: 'Onaylı', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-400', icon: 'fa-check' },
    Completed: { label: 'Tamamlandı', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400', icon: 'fa-circle-check' },
    Cancelled: { label: 'İptal', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400', icon: 'fa-ban' },
    Rejected: { label: 'Reddedildi', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-400', icon: 'fa-xmark' },
    Deleted: { label: 'Silindi', color: 'text-red-300', bg: 'bg-red-500/5', border: 'border-red-500/10', dot: 'bg-red-300', icon: 'fa-trash' },
};

export const BookingsView: React.FC<BookingsViewProps> = ({
    bookings, onUpdateStatus, onDeleteBooking, setSelectedBookingForView
}) => {
    const { siteContent } = useAppStore();
    const { viewMode, toggleViewMode } = useViewMode();
    const [bookingFilter, setBookingFilter] = useState<'All' | Booking['status']>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'created' | 'name' | 'price'>('created');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Advanced filters
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [vehicleFilter, setVehicleFilter] = useState('all');
    const [regionFilter, setRegionFilter] = useState('all');

    const today = new Date().toISOString().split('T')[0];

    const hasActiveFilters = dateFrom || dateTo || vehicleFilter !== 'all' || regionFilter !== 'all';

    const clearFilters = () => {
        setDateFrom('');
        setDateTo('');
        setVehicleFilter('all');
        setRegionFilter('all');
        setSearchTerm('');
        setBookingFilter('All');
    };

    const filteredBookings = useMemo(() => {
        let list = bookings.filter(b => {
            if (b.status === 'Deleted' && bookingFilter !== 'Deleted') return false;
            const matchFilter = bookingFilter === 'All' ? true : b.status === bookingFilter;
            const q = searchTerm.toLowerCase();
            const matchSearch = !q || b.customerName.toLowerCase().includes(q) || b.phone.includes(q) || b.id.toLowerCase().includes(q) || (b.flightNumber || '').toLowerCase().includes(q);
            return matchFilter && matchSearch;
        })
            .filter(b => !dateFrom || b.date >= dateFrom)
            .filter(b => !dateTo || b.date <= dateTo)
            .filter(b => vehicleFilter === 'all' || b.vehicleId === vehicleFilter)
            .filter(b => regionFilter === 'all' ||
                b.pickup.toLowerCase().includes(regionFilter.toLowerCase()) ||
                b.destination.toLowerCase().includes(regionFilter.toLowerCase()));

        list.sort((a, b) => {
            let cmp = 0;
            if (sortBy === 'date') cmp = a.date.localeCompare(b.date);
            else if (sortBy === 'created') cmp = a.createdAt.localeCompare(b.createdAt);
            else if (sortBy === 'name') cmp = a.customerName.localeCompare(b.customerName);
            else if (sortBy === 'price') cmp = a.totalPrice - b.totalPrice;
            return sortDir === 'desc' ? -cmp : cmp;
        });

        return list;
    }, [bookings, bookingFilter, searchTerm, sortBy, sortDir, dateFrom, dateTo, vehicleFilter, regionFilter]);

    const toggleSort = (col: typeof sortBy) => {
        if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortBy(col); setSortDir('desc'); }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const s = new Set(prev);
            s.has(id) ? s.delete(id) : s.add(id);
            return s;
        });
    };

    const toggleAll = () => {
        if (selectedIds.size === filteredBookings.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filteredBookings.map(b => b.id)));
    };

    const counts = {
        All: bookings.filter(b => b.status !== 'Deleted').length,
        Pending: bookings.filter(b => b.status === 'Pending').length,
        Confirmed: bookings.filter(b => b.status === 'Confirmed').length,
        Completed: bookings.filter(b => b.status === 'Completed').length,
        Rejected: bookings.filter(b => b.status === 'Rejected').length,
        Deleted: bookings.filter(b => b.status === 'Deleted').length,
    };

    const exportCSV = () => {
        const rows = [
            ['İsim', 'Telefon', 'Email', 'Kalkış', 'Varış', 'Tarih', 'Saat', 'Yolcu', 'Araç', 'Fiyat', 'Durum', 'Uçuş No'],
            ...filteredBookings.map(b => {
                const vehicle = siteContent.vehicles.find(v => v.id === b.vehicleId);
                return [
                    b.customerName.replace(/,/g, ' '),
                    b.phone,
                    b.email || '',
                    b.pickup.replace(/,/g, ' '),
                    b.destination.replace(/,/g, ' '),
                    b.date,
                    b.time,
                    String(b.passengers),
                    (vehicle?.name || '').replace(/,/g, ' '),
                    `${siteContent.currency?.symbol || '€'}${b.totalPrice}`,
                    STATUS_MAP[b.status]?.label || b.status,
                    b.flightNumber || ''
                ];
            })
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rezervasyonlar-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const SortIcon = ({ col }: { col: typeof sortBy }) => (
        <i className={`fa-solid ${sortBy === col ? (sortDir === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down') : 'fa-sort'} text-[8px] ${sortBy === col ? 'text-[var(--color-primary)]' : 'text-slate-600'}`}></i>
    );

    // Unique regions from bookings for filter dropdown
    const regionOptions = useMemo(() => {
        const names = new Set<string>();
        bookings.forEach(b => {
            names.add(b.pickup.split(',')[0].trim());
            names.add(b.destination.split(',')[0].trim());
        });
        return Array.from(names).sort();
    }, [bookings]);

    // Revenue Dashboard calculations
    const revenueDashboard = useMemo(() => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const todayStr = now.toISOString().split('T')[0];

        const monthBookings = bookings.filter(b => {
            const d = new Date(b.date);
            return d.getFullYear() === currentYear && d.getMonth() === currentMonth && b.status !== 'Deleted' && b.status !== 'Cancelled' && b.status !== 'Rejected';
        });

        const revenueThisMonth = monthBookings.reduce((s, b) => s + b.totalPrice, 0);
        const revenueToday = bookings
            .filter(b => b.date === todayStr && b.status !== 'Deleted' && b.status !== 'Cancelled' && b.status !== 'Rejected')
            .reduce((s, b) => s + b.totalPrice, 0);
        const bookingsThisMonth = monthBookings.length;

        // Last 7 days bar chart data
        const last7: { label: string; revenue: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayLabel = d.toLocaleDateString('tr-TR', { weekday: 'short' });
            const revenue = bookings
                .filter(b => b.date === dateStr && b.status !== 'Deleted' && b.status !== 'Cancelled' && b.status !== 'Rejected')
                .reduce((s, b) => s + b.totalPrice, 0);
            last7.push({ label: dayLabel, revenue });
        }

        return { revenueThisMonth, revenueToday, bookingsThisMonth, last7 };
    }, [bookings]);

    const sendWhatsApp = (b: Booking) => {
        const message = `Merhaba ${b.customerName}, Ata Flug Transfer rezervasyonunuz onaylandı! 📋 Tarih: ${b.date} 🚗 Güzergah: ${b.pickup} → ${b.destination} 💰 Ücret: ${b.totalPrice}₺ Sorularınız için: 7/24 hizmetinizdeyiz.`;
        const phone = b.phone.replace(/\D/g, '');
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-4">

            {/* ── Header Banner ── */}
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-r from-[var(--color-dark)] via-slate-900 to-[var(--color-dark)] p-5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(197,160,89,0.12),transparent_60%)]" />
                <div className="absolute top-0 right-0 w-64 h-full opacity-[0.03]" style={{backgroundImage:'repeating-linear-gradient(45deg,var(--color-primary) 0,var(--color-primary) 1px,transparent 0,transparent 50%)',backgroundSize:'12px 12px'}} />
                <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-amber-700 flex items-center justify-center shadow-xl shadow-amber-900/40 shrink-0">
                            <i className="fa-solid fa-calendar-check text-white text-base"></i>
                        </div>
                        <div>
                            <h1 className="font-outfit text-[1.6rem] font-[800] text-white tracking-[-0.02em]">Rezervasyonlar</h1>
                            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                <span className="text-xs text-slate-500">{counts.All} toplam rezervasyon</span>
                                {counts.Pending > 0 && (
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full animate-pulse">
                                        <i className="fa-solid fa-circle text-[5px]"></i>{counts.Pending} bekliyor
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button onClick={exportCSV}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:bg-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)] text-xs font-bold transition-all shrink-0">
                        <i className="fa-solid fa-file-arrow-down text-[11px]"></i>
                        CSV İndir
                    </button>
                </div>
            </div>

            {/* ── Revenue Dashboard ── */}
            <div className="rounded-2xl border border-white/[0.06] bg-[#0b1120] p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-outfit text-[11px] font-[750] text-slate-500 uppercase tracking-[0.12em] flex items-center gap-2">
                        <i className="fa-solid fa-chart-bar text-[var(--color-primary)] text-[10px]"></i>
                        Gelir Dashboard'u
                    </h2>
                    <span className="text-[10px] text-slate-600">Bu ay &amp; bugün</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Revenue This Month */}
                    <div className="p-3 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/15 flex flex-col gap-1">
                        <p className="text-[9.5px] font-[750] text-slate-500 uppercase tracking-[0.1em]">Bu Ay Gelir</p>
                        <p className="font-outfit text-[1.25rem] font-[800] text-[var(--color-primary)] tabular-nums leading-tight">
                            ₺{revenueDashboard.revenueThisMonth.toLocaleString('tr-TR')}
                        </p>
                        <p className="text-[10px] text-slate-600">{revenueDashboard.bookingsThisMonth} rezervasyon</p>
                    </div>
                    {/* Revenue Today */}
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 flex flex-col gap-1">
                        <p className="text-[9.5px] font-[750] text-slate-500 uppercase tracking-[0.1em]">Bugün Gelir</p>
                        <p className="font-outfit text-[1.25rem] font-[800] text-emerald-400 tabular-nums leading-tight">
                            ₺{revenueDashboard.revenueToday.toLocaleString('tr-TR')}
                        </p>
                        <p className="text-[10px] text-slate-600">günlük toplam</p>
                    </div>
                    {/* Bookings This Month */}
                    <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/15 flex flex-col gap-1">
                        <p className="text-[9.5px] font-[750] text-slate-500 uppercase tracking-[0.1em]">Bu Ay Rezervasyon</p>
                        <p className="font-outfit text-[1.25rem] font-[800] text-blue-400 tabular-nums leading-tight">
                            {revenueDashboard.bookingsThisMonth}
                        </p>
                        <p className="text-[10px] text-slate-600">aktif rezervasyon</p>
                    </div>
                    {/* 7-day bar chart */}
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
                        <p className="text-[9.5px] font-[750] text-slate-500 uppercase tracking-[0.1em]">Son 7 Gün</p>
                        <div className="flex items-end gap-1 h-10 flex-1">
                            {(() => {
                                const maxRev = Math.max(...revenueDashboard.last7.map(d => d.revenue), 1);
                                return revenueDashboard.last7.map((d, i) => {
                                    const heightPct = Math.max((d.revenue / maxRev) * 100, d.revenue > 0 ? 8 : 2);
                                    const isToday = i === 6;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-0.5" title={`${d.label}: ₺${d.revenue.toLocaleString('tr-TR')}`}>
                                            <svg width="100%" height="40" viewBox="0 0 10 40" preserveAspectRatio="none">
                                                <rect
                                                    x="1" y={40 - (heightPct * 40 / 100)} width="8" height={heightPct * 40 / 100}
                                                    rx="2" fill={isToday ? 'var(--color-primary)' : d.revenue > 0 ? 'rgb(100 116 139 / 0.6)' : 'rgb(255 255 255 / 0.04)'}
                                                />
                                            </svg>
                                            <span className={`text-[7px] ${isToday ? 'text-[var(--color-primary)]' : 'text-slate-700'} truncate w-full text-center`}>{d.label}</span>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                    {
                        label: 'Toplam', value: counts.All,
                        sub: `${counts.Confirmed} onaylı`,
                        icon: 'fa-calendar-check', color: 'text-blue-400',
                        bg: 'bg-blue-500/10', border: 'border-blue-500/15', dot: 'bg-blue-500',
                    },
                    {
                        label: 'Bugün', value: bookings.filter(b => b.date === today).length,
                        sub: 'aktif transfer',
                        icon: 'fa-calendar-day', color: 'text-emerald-400',
                        bg: 'bg-emerald-500/10', border: 'border-emerald-500/15', dot: 'bg-emerald-500',
                    },
                    {
                        label: 'Bekleyen', value: counts.Pending,
                        sub: counts.Pending > 0 ? 'aksiyon gerekli' : 'temiz',
                        icon: 'fa-hourglass-half', color: counts.Pending > 0 ? 'text-amber-400' : 'text-slate-500',
                        bg: counts.Pending > 0 ? 'bg-amber-500/10' : 'bg-white/[0.03]',
                        border: counts.Pending > 0 ? 'border-amber-500/25' : 'border-white/[0.06]',
                        dot: counts.Pending > 0 ? 'bg-amber-500 animate-pulse' : 'bg-slate-600',
                    },
                    {
                        label: 'Toplam Gelir', value: `${siteContent.currency?.symbol || '€'}${bookings.filter(b => b.status === 'Completed').reduce((s, b) => s + b.totalPrice, 0).toLocaleString()}`,
                        sub: `${counts.Completed} tamamlandı`,
                        icon: 'fa-euro-sign', color: 'text-[var(--color-primary)]',
                        bg: 'bg-[var(--color-primary)]/10', border: 'border-[var(--color-primary)]/20', dot: 'bg-[var(--color-primary)]',
                    },
                ].map((s, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border ${s.border} ${s.bg}`}>
                        <div className="shrink-0">
                            <div className={`w-10 h-10 rounded-xl bg-black/20 border border-white/[0.06] flex items-center justify-center`}>
                                <i className={`fa-solid ${s.icon} ${s.color} text-sm`}></i>
                            </div>
                        </div>
                        <div className="min-w-0">
                            <p className="font-outfit text-[9.5px] font-[750] text-slate-500 uppercase tracking-[0.12em] truncate">{s.label}</p>
                            <p className="font-outfit text-[1.35rem] font-[800] text-white tabular-nums leading-tight mt-0.5">{s.value}</p>
                            <p className={`text-[10px] mt-0.5 ${s.color} opacity-70`}>{s.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Panel ── */}
            <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-[#0b1120]">

                {/* Status Filter Tabs */}
                <div className="flex items-center border-b border-white/[0.05] px-1 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'All',       label: 'Tümü',        icon: 'fa-layer-group',  count: counts.All },
                        { id: 'Pending',   label: 'Bekleyen',    icon: 'fa-clock',        count: counts.Pending },
                        { id: 'Confirmed', label: 'Onaylı',      icon: 'fa-circle-check', count: counts.Confirmed },
                        { id: 'Completed', label: 'Tamamlanan',  icon: 'fa-flag-checkered', count: counts.Completed },
                        { id: 'Rejected',  label: 'Reddedilen',  icon: 'fa-circle-xmark', count: counts.Rejected },
                        { id: 'Deleted',   label: 'Çöp Kutusu',  icon: 'fa-trash-can',    count: counts.Deleted },
                    ].map(tab => {
                        const active = bookingFilter === tab.id;
                        return (
                            <button key={tab.id} onClick={() => setBookingFilter(tab.id as any)}
                                className={`relative flex items-center gap-2 px-4 py-3.5 font-outfit text-[11px] font-[650] whitespace-nowrap transition-all shrink-0
                                    ${active ? 'text-[var(--color-primary)]' : 'text-slate-600 hover:text-slate-300'}`}>
                                <i className={`fa-solid ${tab.icon} text-[10px]`}></i>
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md min-w-[20px] text-center
                                        ${active ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'bg-white/[0.05] text-slate-500'}`}>
                                        {tab.count}
                                    </span>
                                )}
                                {active && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[var(--color-primary)] rounded-t-full" />}
                            </button>
                        );
                    })}
                </div>

                {/* Search + Tools Bar */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 px-4 py-3 border-b border-white/[0.04]">
                    {/* Search */}
                    <div className="relative flex-[1_1_180px] min-w-0">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-[11px]"></i>
                        <input type="text" placeholder="Ad, telefon, ID veya uçuş no..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-8 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[13px] text-white placeholder-slate-600 focus:border-[var(--color-primary)]/40 focus:bg-white/[0.06] outline-none transition-all" />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                                <i className="fa-solid fa-xmark text-[10px]"></i>
                            </button>
                        )}
                    </div>

                    {/* Filter toggle */}
                    <button onClick={() => setShowAdvancedFilters(v => !v)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[11px] font-bold transition-all shrink-0
                            ${showAdvancedFilters || hasActiveFilters
                                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/25'
                                : 'bg-white/[0.03] text-slate-500 border-white/[0.06] hover:text-white hover:bg-white/[0.06]'}`}>
                        <i className="fa-solid fa-sliders text-[10px]"></i>
                        Filtre
                        {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] ml-0.5"></span>}
                    </button>

                    <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} itemCount={filteredBookings.length} />

                    {/* Bulk actions */}
                    {selectedIds.size > 0 && (
                        <div className="flex items-center gap-1.5 animate-in fade-in duration-150 pl-1 border-l border-white/[0.06]">
                            <span className="text-[11px] text-slate-500 shrink-0">{selectedIds.size} seçili</span>
                            <button onClick={() => { selectedIds.forEach(id => onUpdateStatus(id, 'Confirmed')); setSelectedIds(new Set()); }}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/20 hover:border-transparent text-[10px] font-bold transition-all">
                                <i className="fa-solid fa-check text-[9px]"></i>Onayla
                            </button>
                            <button onClick={() => { selectedIds.forEach(id => onUpdateStatus(id, 'Deleted')); setSelectedIds(new Set()); }}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-transparent text-[10px] font-bold transition-all">
                                <i className="fa-solid fa-trash text-[9px]"></i>Sil
                            </button>
                        </div>
                    )}

                    <span className="text-[11px] text-slate-600 ml-auto shrink-0 hidden sm:inline tabular-nums">{filteredBookings.length} kayıt</span>
                </div>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && (
                    <div className="px-4 py-3 border-b border-white/[0.04] bg-white/[0.02] animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Tarih</span>
                                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                                    className="px-2.5 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[11px] text-white focus:border-[var(--color-primary)]/40 outline-none transition-all [color-scheme:dark]" />
                                <span className="text-slate-700 text-xs">—</span>
                                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                                    className="px-2.5 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[11px] text-white focus:border-[var(--color-primary)]/40 outline-none transition-all [color-scheme:dark]" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Araç</span>
                                <select value={vehicleFilter} onChange={e => setVehicleFilter(e.target.value)}
                                    className="px-2.5 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[11px] text-white focus:border-[var(--color-primary)]/40 outline-none transition-all [color-scheme:dark]">
                                    <option value="all">Tümü</option>
                                    {siteContent.vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">Bölge</span>
                                <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}
                                    className="px-2.5 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[11px] text-white focus:border-[var(--color-primary)]/40 outline-none transition-all [color-scheme:dark]">
                                    <option value="all">Tümü</option>
                                    {regionOptions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            {hasActiveFilters && (
                                <button onClick={clearFilters}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/15 text-[10px] font-bold hover:bg-red-500/20 transition-all ml-auto">
                                    <i className="fa-solid fa-xmark text-[9px]"></i>Temizle
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Content: Table or Cards */}
                {filteredBookings.length === 0 ? (
                    <EmptyState
                        icon="fa-calendar-xmark"
                        title="Rezervasyon bulunamadı"
                        description={hasActiveFilters || searchTerm ? "Filtre veya arama kriterlerinizi değiştirmeyi deneyin" : "Henüz rezervasyon bulunmuyor"}
                        action={hasActiveFilters || searchTerm ? { label: 'Filtreleri Temizle', onClick: clearFilters } : undefined}
                    />
                ) : viewMode === 'card' ? (
                    /* ── MOBILE CARD VIEW ── */
                    <div className="p-3 space-y-3">
                        {filteredBookings.map((b) => {
                            const st = STATUS_MAP[b.status] || STATUS_MAP.Pending;
                            const vehicle = siteContent.vehicles.find(v => v.id === b.vehicleId);
                            const isToday = b.date === today;

                            const swipeActions = [];
                            if (b.status === 'Pending') {
                                swipeActions.push({ icon: 'fa-check', label: 'Onayla', color: 'bg-emerald-500', onClick: () => { haptic.success(); onUpdateStatus(b.id, 'Confirmed'); } });
                                swipeActions.push({ icon: 'fa-xmark', label: 'Reddet', color: 'bg-red-500', onClick: () => { haptic.error(); onUpdateStatus(b.id, 'Rejected'); } });
                            } else if (b.status === 'Confirmed') {
                                swipeActions.push({ icon: 'fa-flag-checkered', label: 'Tamamla', color: 'bg-violet-500', onClick: () => { haptic.success(); onUpdateStatus(b.id, 'Completed'); } });
                                swipeActions.push({ icon: 'fa-trash', label: 'Sil', color: 'bg-red-500', onClick: () => { if (confirm('Silmek istediğinize emin misiniz?')) { haptic.error(); onUpdateStatus(b.id, 'Deleted'); } } });
                            } else {
                                swipeActions.push({
                                    icon: 'fa-trash', label: 'Sil', color: 'bg-red-500', onClick: () => {
                                        if (b.status === 'Deleted') { if (confirm('KALICI olarak silinecek!')) onDeleteBooking(b.id); }
                                        else { if (confirm('Silmek istediğinize emin misiniz?')) onUpdateStatus(b.id, 'Deleted'); }
                                    }
                                });
                            }

                            return (
                                <SwipeableCard key={b.id} actions={swipeActions} onClick={() => setSelectedBookingForView(b)}>
                                    <div className={`p-4 ${b.status === 'Deleted' ? 'opacity-50' : ''}`}>
                                        {/* Top: Avatar + Name + Status */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg ${b.status === 'Completed' ? 'bg-gradient-to-br from-emerald-500 to-green-600' :
                                                    b.status === 'Confirmed' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                                                        b.status === 'Pending' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                                                            'bg-gradient-to-br from-slate-600 to-slate-700'}`}>
                                                    {b.customerName.trim().charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-white text-sm truncate">{b.customerName.replace(/[\n\r]+/g, ' ').trim()}</p>
                                                        {isToday && b.status !== 'Completed' && (
                                                            <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md border border-emerald-500/30 animate-pulse shrink-0">Bugün</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <p className="text-[11px] text-slate-500">{b.phone}</p>
                                                        {b.flightNumber && (
                                                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/15">
                                                                <i className="fa-solid fa-plane text-[7px] mr-1"></i>{b.flightNumber}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0 ${st.bg} border ${st.border}`}>
                                                <i className={`fa-solid ${st.icon} ${st.color} text-[9px]`}></i>
                                                <span className={`text-[10px] font-bold ${st.color}`}>{st.label}</span>
                                            </div>
                                        </div>

                                        {/* Route */}
                                        <div className="flex items-center gap-2 mb-3 pl-1">
                                            <div className="flex flex-col items-center gap-0.5 shrink-0">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 border border-emerald-500/50"></div>
                                                <div className="w-px h-3 bg-white/10"></div>
                                                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] border border-[var(--color-primary)]/50"></div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[11px] text-slate-300 truncate">{b.pickup}</p>
                                                <p className="text-[11px] text-slate-500 truncate">{b.destination}</p>
                                            </div>
                                        </div>

                                        {/* Bottom: Date + Vehicle + Price */}
                                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                                            <div className="flex items-center gap-3">
                                                <div className="text-center">
                                                    <p className="text-[12px] text-white font-medium tabular-nums">{b.date.split('-').reverse().join('.')}</p>
                                                    <p className="text-[10px] text-slate-500 tabular-nums">{b.time}</p>
                                                </div>
                                                <div className="w-px h-6 bg-white/[0.06]"></div>
                                                <div className="flex items-center gap-1.5">
                                                    <i className="fa-solid fa-car-side text-[9px] text-slate-500"></i>
                                                    <span className="text-[11px] text-slate-400">{vehicle?.name?.split(' ').slice(-1)[0] || '—'}</span>
                                                    <span className="text-[9px] text-slate-600">· {b.passengers} kişi</span>
                                                </div>
                                            </div>
                                            <p className="text-lg font-black text-white">{siteContent.currency?.symbol || '€'}{b.totalPrice}</p>
                                        </div>

                                        {/* Mobile Action Buttons (always visible) */}
                                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/[0.04]">
                                            {b.status === 'Pending' && (
                                                <>
                                                    <button onClick={e => { e.stopPropagation(); haptic.success(); onUpdateStatus(b.id, 'Confirmed'); }}
                                                        className="flex-1 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 active:bg-emerald-500/20 transition-all">
                                                        <i className="fa-solid fa-check text-[10px]"></i>Onayla
                                                    </button>
                                                    <button onClick={e => { e.stopPropagation(); haptic.error(); onUpdateStatus(b.id, 'Rejected'); }}
                                                        className="flex-1 py-2 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold flex items-center justify-center gap-1.5 active:bg-red-500/20 transition-all">
                                                        <i className="fa-solid fa-xmark text-[10px]"></i>Reddet
                                                    </button>
                                                </>
                                            )}
                                            {b.status === 'Confirmed' && (
                                                <button onClick={e => { e.stopPropagation(); haptic.success(); onUpdateStatus(b.id, 'Completed'); }}
                                                    className="flex-1 py-2 rounded-xl bg-violet-500/10 text-violet-400 text-xs font-bold flex items-center justify-center gap-1.5 active:bg-violet-500/20 transition-all">
                                                    <i className="fa-solid fa-flag-checkered text-[10px]"></i>Tamamla
                                                </button>
                                            )}
                                            <button onClick={e => {
                                                e.stopPropagation();
                                                sendWhatsApp(b);
                                            }} className="py-2 px-3 rounded-xl bg-green-500/20 text-green-400 text-xs font-bold flex items-center justify-center gap-1.5 active:bg-green-500/30 hover:bg-green-500 hover:text-white transition-all">
                                                <i className="fa-brands fa-whatsapp text-[12px]"></i>
                                            </button>
                                            <button onClick={e => {
                                                e.stopPropagation();
                                                if (b.status === 'Deleted') { if (confirm('KALICI olarak silinecek!')) onDeleteBooking(b.id); }
                                                else { if (confirm('Silmek istediğinize emin misiniz?')) { haptic.error(); onUpdateStatus(b.id, 'Deleted'); } }
                                            }} className="py-2 px-3 rounded-xl bg-white/5 text-slate-500 text-xs font-bold flex items-center justify-center gap-1.5 active:bg-red-500/10 active:text-red-400 transition-all">
                                                <i className="fa-solid fa-trash text-[10px]"></i>
                                            </button>
                                        </div>
                                    </div>
                                </SwipeableCard>
                            );
                        })}
                    </div>
                ) : (
                    /* ── TABLE VIEW ── */
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-white/[0.06] bg-gradient-to-r from-white/[0.04] to-white/[0.02]">
                                    <th className="w-10 pl-4 pr-2 py-3.5">
                                        <input type="checkbox" checked={selectedIds.size === filteredBookings.length && filteredBookings.length > 0}
                                            onChange={toggleAll} className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#c5a059] cursor-pointer" />
                                    </th>
                                    <th className="text-left px-3 py-3.5">
                                        <button onClick={() => toggleSort('name')} className="flex items-center gap-1.5 font-outfit text-[9.5px] font-[750] text-slate-500 uppercase tracking-[0.12em] hover:text-white transition-colors">
                                            Müşteri <SortIcon col="name" />
                                        </button>
                                    </th>
                                    <th className="text-left px-3 py-3.5 hidden md:table-cell">
                                        <span className="font-outfit text-[9.5px] font-[750] text-slate-500 uppercase tracking-[0.12em]">Güzergah</span>
                                    </th>
                                    <th className="text-left px-3 py-3.5">
                                        <button onClick={() => toggleSort('date')} className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                                            Tarih <SortIcon col="date" />
                                        </button>
                                    </th>
                                    <th className="text-left px-3 py-3.5 hidden lg:table-cell">
                                        <span className="font-outfit text-[9.5px] font-[750] text-slate-500 uppercase tracking-[0.12em]">Araç</span>
                                    </th>
                                    <th className="text-right px-3 py-3.5">
                                        <button onClick={() => toggleSort('price')} className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors ml-auto">
                                            Tutar <SortIcon col="price" />
                                        </button>
                                    </th>
                                    <th className="text-left px-3 py-3.5">
                                        <span className="font-outfit text-[9.5px] font-[750] text-slate-500 uppercase tracking-[0.12em]">Durum</span>
                                    </th>
                                    <th className="w-28 px-3 py-3.5"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {filteredBookings.map((b) => {
                                    const st = STATUS_MAP[b.status] || STATUS_MAP.Pending;
                                    const vehicle = siteContent.vehicles.find(v => v.id === b.vehicleId);
                                    const isToday = b.date === today;
                                    const isSelected = selectedIds.has(b.id);

                                    const accentColor =
                                        b.status === 'Completed' ? 'bg-emerald-500' :
                                        b.status === 'Confirmed' ? 'bg-blue-500' :
                                        b.status === 'Pending'   ? 'bg-amber-500' :
                                        b.status === 'Cancelled' ? 'bg-red-500' :
                                        'bg-slate-600';

                                    const avatarGradient =
                                        b.status === 'Completed' ? 'from-emerald-500 to-green-600' :
                                        b.status === 'Confirmed' ? 'from-blue-500 to-indigo-600' :
                                        b.status === 'Pending'   ? 'from-amber-500 to-orange-600' :
                                        'from-slate-600 to-slate-700';

                                    return (
                                        <tr key={b.id} onClick={() => setSelectedBookingForView(b)}
                                            className={`relative cursor-pointer transition-all duration-150 group
                                                ${isSelected ? 'bg-[var(--color-primary)]/[0.07]' : 'hover:bg-white/[0.035]'}
                                                ${b.status === 'Deleted' ? 'opacity-40' : ''}`}>

                                            {/* Status accent bar */}
                                            <td className="pl-0 pr-0 py-0 w-0">
                                                <div className={`absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-r-full ${accentColor} opacity-0 group-hover:opacity-100 ${isSelected ? 'opacity-100' : ''} transition-opacity`} />
                                            </td>

                                            {/* Checkbox */}
                                            <td className="pl-4 pr-2 py-4" onClick={e => e.stopPropagation()}>
                                                <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(b.id)}
                                                    className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#c5a059] cursor-pointer" />
                                            </td>

                                            {/* Customer */}
                                            <td className="px-3 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-black text-sm shrink-0 shadow-lg ring-2 ring-white/5`}>
                                                        {b.customerName.trim().charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="font-bold text-white text-[13px] group-hover:text-[var(--color-primary)] transition-colors truncate leading-tight">
                                                                {b.customerName.replace(/[\n\r]+/g, ' ').trim()}
                                                            </p>
                                                            {isToday && b.status !== 'Completed' && (
                                                                <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md border border-emerald-500/25 animate-pulse shrink-0">
                                                                    <i className="fa-solid fa-circle text-[4px]"></i>Bugün
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                                            <span className="text-[10px] text-slate-500 tabular-nums">{b.phone}</span>
                                                            {b.email && <span className="text-slate-700 text-[9px]">·</span>}
                                                            {b.flightNumber && (
                                                                <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/15 shrink-0">
                                                                    <i className="fa-solid fa-plane text-[7px]"></i>{b.flightNumber}
                                                                </span>
                                                            )}
                                                            {b.notes && (
                                                                <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/15 shrink-0" title={b.notes}>
                                                                    <i className="fa-solid fa-note-sticky text-[7px]"></i>Not
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Route */}
                                            <td className="px-3 py-4 hidden md:table-cell max-w-[200px]">
                                                <div className="flex items-start gap-2.5">
                                                    <div className="flex flex-col items-center gap-[3px] shrink-0 mt-1">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]"></div>
                                                        <div className="w-px h-3.5 bg-gradient-to-b from-emerald-400/50 to-[var(--color-primary)]/50"></div>
                                                        <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_6px_rgba(197,160,89,0.5)]"></div>
                                                    </div>
                                                    <div className="min-w-0 space-y-1">
                                                        <p className="text-[11px] text-slate-200 truncate leading-tight font-medium">{b.pickup}</p>
                                                        <p className="text-[11px] text-slate-500 truncate leading-tight">{b.destination}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-3 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] text-white font-bold tabular-nums leading-tight">
                                                        {b.date.split('-').reverse().join('.')}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 tabular-nums mt-0.5 flex items-center gap-1">
                                                        <i className="fa-regular fa-clock text-[8px]"></i>{b.time}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Vehicle */}
                                            <td className="px-3 py-4 hidden lg:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.06] flex items-center justify-center shrink-0">
                                                        <i className="fa-solid fa-car-side text-[10px] text-slate-400"></i>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] text-slate-300 font-medium truncate max-w-[110px] leading-tight">{vehicle?.name || '—'}</p>
                                                        <p className="text-[9px] text-slate-600 mt-0.5 flex items-center gap-1">
                                                            <i className="fa-solid fa-user text-[7px]"></i>{b.passengers} kişi
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Price */}
                                            <td className="px-3 py-4 text-right">
                                                <span className="text-[15px] font-black text-[var(--color-primary)] tabular-nums tracking-tight">
                                                    {siteContent.currency?.symbol || '€'}{b.totalPrice}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-3 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${st.bg} border ${st.border}`}>
                                                    <i className={`fa-solid ${st.icon} ${st.color} text-[9px]`}></i>
                                                    <span className={`text-[10px] font-black tracking-wide ${st.color}`}>{st.label}</span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-3 py-4" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-150 justify-end">
                                                    {b.status === 'Pending' && (
                                                        <>
                                                            <button onClick={() => onUpdateStatus(b.id, 'Confirmed')} title="Onayla"
                                                                className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-transparent text-[10px] font-bold transition-all">
                                                                <i className="fa-solid fa-check text-[9px]"></i>
                                                                <span className="hidden xl:inline">Onayla</span>
                                                            </button>
                                                            <button onClick={() => onUpdateStatus(b.id, 'Rejected')} title="Reddet"
                                                                className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white hover:border-transparent flex items-center justify-center transition-all">
                                                                <i className="fa-solid fa-xmark text-[10px]"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                    {b.status === 'Confirmed' && (
                                                        <button onClick={() => onUpdateStatus(b.id, 'Completed')} title="Tamamla"
                                                            className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500 hover:text-white hover:border-transparent text-[10px] font-bold transition-all">
                                                            <i className="fa-solid fa-flag-checkered text-[9px]"></i>
                                                            <span className="hidden xl:inline">Tamamla</span>
                                                        </button>
                                                    )}
                                                    <button onClick={() => sendWhatsApp(b)} title="WhatsApp Gönder"
                                                        className="w-7 h-7 rounded-lg bg-green-500/20 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-white hover:border-transparent flex items-center justify-center transition-all">
                                                        <i className="fa-brands fa-whatsapp text-[11px]"></i>
                                                    </button>
                                                    <button onClick={() => {
                                                        if (b.status === 'Deleted') { if (confirm('KALICI olarak silinecek!')) onDeleteBooking(b.id); }
                                                        else { if (confirm('Silmek istediğinize emin misiniz?')) onUpdateStatus(b.id, 'Deleted'); }
                                                    }} title="Sil"
                                                        className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-600 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/20 flex items-center justify-center transition-all">
                                                        <i className="fa-solid fa-trash text-[9px]"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
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
