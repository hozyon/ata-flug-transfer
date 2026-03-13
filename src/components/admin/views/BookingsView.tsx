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

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
    Pending: { label: 'Beklemede', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' },
    Confirmed: { label: 'Onaylı', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-400' },
    Completed: { label: 'Tamamlandı', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
    Cancelled: { label: 'İptal', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400' },
    Rejected: { label: 'Reddedildi', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-400' },
    Deleted: { label: 'Silindi', color: 'text-red-300', bg: 'bg-red-500/5', border: 'border-red-500/10', dot: 'bg-red-300' },
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
                    `€${b.totalPrice}`,
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
        <i className={`fa-solid ${sortBy === col ? (sortDir === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down') : 'fa-sort'} text-[8px] ${sortBy === col ? 'text-[#c5a059]' : 'text-slate-600'}`}></i>
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

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Toplam', value: counts.All, icon: 'fa-calendar-check', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15', iconBg: 'bg-blue-500', change: null },
                    { label: 'Bugün', value: bookings.filter(b => b.date === today).length, icon: 'fa-calendar-day', gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/15', iconBg: 'bg-emerald-500', change: null },
                    { label: 'Bekleyen', value: counts.Pending, icon: 'fa-hourglass-half', gradient: 'from-amber-500/15 to-orange-600/5', border: 'border-amber-500/15', iconBg: 'bg-amber-500', change: counts.Pending > 0 ? 'Aksiyon gerekli' : null },
                    { label: 'Gelir', value: `€${bookings.filter(b => b.status === 'Completed').reduce((s, b) => s + b.totalPrice, 0).toLocaleString()}`, icon: 'fa-euro-sign', gradient: 'from-[#c5a059]/15 to-amber-600/5', border: 'border-[#c5a059]/15', iconBg: 'bg-[#c5a059]', change: null },
                ].map((s, i) => (
                    <div key={i} className={`p-4 rounded-2xl bg-gradient-to-br ${s.gradient} border ${s.border}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                                <p className="text-2xl font-black text-white mt-1">{s.value}</p>
                                {s.change && <p className="text-[10px] text-amber-400 font-medium mt-1"><i className="fa-solid fa-circle-exclamation mr-1"></i>{s.change}</p>}
                            </div>
                            <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shadow-lg`}>
                                <i className={`fa-solid ${s.icon} text-white text-sm`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                {/* Filter Tabs */}
                <div className="flex items-center gap-1 px-4 pt-4 pb-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                    {[
                        { id: 'All', label: 'Tümü', icon: 'fa-layer-group' },
                        { id: 'Pending', label: 'Bekleyen', icon: 'fa-clock' },
                        { id: 'Confirmed', label: 'Onaylı', icon: 'fa-circle-check' },
                        { id: 'Completed', label: 'Tamamlanan', icon: 'fa-flag-checkered' },
                        { id: 'Rejected', label: 'Reddedilen', icon: 'fa-circle-xmark' },
                        { id: 'Deleted', label: 'Çöp', icon: 'fa-trash-can' },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setBookingFilter(tab.id as any)}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all snap-center sm:snap-none ${bookingFilter === tab.id
                                ? 'bg-[#c5a059] text-white shadow-lg shadow-[#c5a059]/20'
                                : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                            <i className={`fa-solid ${tab.icon} text-[10px]`}></i>
                            {tab.label}
                            <span className={`text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full ${bookingFilter === tab.id ? 'bg-white/20' : 'bg-white/5'}`}>
                                {counts[tab.id as keyof typeof counts]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search & Bulk Actions */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 px-4 pb-3">
                    <div className="relative flex-[1_1_200px] sm:max-w-md w-full">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                        <input type="text" placeholder="Ad, telefon, ID veya uçuş no ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:border-[#c5a059]/50 outline-none transition-all" />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setShowAdvancedFilters(v => !v)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${showAdvancedFilters || hasActiveFilters ? 'bg-[#c5a059]/10 text-[#c5a059] border-[#c5a059]/30' : 'bg-white/5 text-slate-400 border-white/[0.06] hover:text-white'}`}>
                        <i className="fa-solid fa-sliders text-[10px]"></i>
                        Filtreler
                        {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]"></span>}
                    </button>

                    <button
                        onClick={exportCSV}
                        title="CSV olarak indir"
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/[0.06] text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 text-xs font-bold transition-all">
                        <i className="fa-solid fa-file-csv text-[10px]"></i>
                        <span className="hidden sm:inline">CSV</span>
                    </button>

                    <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} itemCount={filteredBookings.length} />

                    {selectedIds.size > 0 && (
                        <div className="flex items-center gap-2 animate-in fade-in duration-200">
                            <span className="text-xs text-slate-400 font-medium">{selectedIds.size} seçili</span>
                            <button onClick={() => { selectedIds.forEach(id => onUpdateStatus(id, 'Confirmed')); setSelectedIds(new Set()); }}
                                className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-bold transition-all">
                                <i className="fa-solid fa-check mr-1.5"></i>Onayla
                            </button>
                            <button onClick={() => { selectedIds.forEach(id => onUpdateStatus(id, 'Deleted')); setSelectedIds(new Set()); }}
                                className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all">
                                <i className="fa-solid fa-trash mr-1.5"></i>Sil
                            </button>
                        </div>
                    )}

                    <span className="text-[11px] text-slate-600 ml-auto shrink-0 hidden md:inline">{filteredBookings.length} kayıt</span>
                </div>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && (
                    <div className="px-4 pb-4 border-t border-white/[0.04] pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-wrap gap-3">
                            {/* Date Range */}
                            <div className="flex items-center gap-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Tarih</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={e => setDateFrom(e.target.value)}
                                    className="px-3 py-2 bg-white/5 border border-white/[0.06] rounded-xl text-xs text-white focus:border-[#c5a059]/50 outline-none transition-all [color-scheme:dark]"
                                />
                                <span className="text-slate-600 text-xs">—</span>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={e => setDateTo(e.target.value)}
                                    className="px-3 py-2 bg-white/5 border border-white/[0.06] rounded-xl text-xs text-white focus:border-[#c5a059]/50 outline-none transition-all [color-scheme:dark]"
                                />
                            </div>

                            {/* Vehicle Filter */}
                            <div className="flex items-center gap-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Araç</label>
                                <select
                                    value={vehicleFilter}
                                    onChange={e => setVehicleFilter(e.target.value)}
                                    className="px-3 py-2 bg-white/5 border border-white/[0.06] rounded-xl text-xs text-white focus:border-[#c5a059]/50 outline-none transition-all [color-scheme:dark]">
                                    <option value="all">Tümü</option>
                                    {siteContent.vehicles.map(v => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Region Filter */}
                            <div className="flex items-center gap-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Bölge</label>
                                <select
                                    value={regionFilter}
                                    onChange={e => setRegionFilter(e.target.value)}
                                    className="px-3 py-2 bg-white/5 border border-white/[0.06] rounded-xl text-xs text-white focus:border-[#c5a059]/50 outline-none transition-all [color-scheme:dark]">
                                    <option value="all">Tümü</option>
                                    {regionOptions.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Clear Button */}
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 transition-all">
                                    <i className="fa-solid fa-xmark text-[10px]"></i>
                                    Filtreleri Temizle
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
                                                <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></div>
                                                <span className={`text-[10px] font-bold ${st.color}`}>{st.label}</span>
                                            </div>
                                        </div>

                                        {/* Route */}
                                        <div className="flex items-center gap-2 mb-3 pl-1">
                                            <div className="flex flex-col items-center gap-0.5 shrink-0">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 border border-emerald-500/50"></div>
                                                <div className="w-px h-3 bg-white/10"></div>
                                                <div className="w-2 h-2 rounded-full bg-[#c5a059] border border-[#c5a059]/50"></div>
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
                                            <p className="text-lg font-black text-white">€{b.totalPrice}</p>
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
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-b border-white/[0.04] bg-white/[0.02]">
                                    <th className="w-10 px-4 py-3">
                                        <input type="checkbox" checked={selectedIds.size === filteredBookings.length && filteredBookings.length > 0}
                                            onChange={toggleAll} className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#c5a059] cursor-pointer" />
                                    </th>
                                    <th className="text-left px-3 py-3">
                                        <button onClick={() => toggleSort('name')} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider hover:text-white transition-colors">
                                            Müşteri <SortIcon col="name" />
                                        </button>
                                    </th>
                                    <th className="text-left px-3 py-3 hidden md:table-cell">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Güzergah</span>
                                    </th>
                                    <th className="text-left px-3 py-3">
                                        <button onClick={() => toggleSort('date')} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider hover:text-white transition-colors">
                                            Tarih <SortIcon col="date" />
                                        </button>
                                    </th>
                                    <th className="text-left px-3 py-3 hidden lg:table-cell">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Araç</span>
                                    </th>
                                    <th className="text-right px-3 py-3">
                                        <button onClick={() => toggleSort('price')} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider hover:text-white transition-colors ml-auto">
                                            Tutar <SortIcon col="price" />
                                        </button>
                                    </th>
                                    <th className="text-left px-3 py-3">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Durum</span>
                                    </th>
                                    <th className="w-24 px-3 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((b, rowIdx) => {
                                    const st = STATUS_MAP[b.status] || STATUS_MAP.Pending;
                                    const vehicle = siteContent.vehicles.find(v => v.id === b.vehicleId);
                                    const isToday = b.date === today;
                                    const isSelected = selectedIds.has(b.id);

                                    return (
                                        <tr key={b.id} onClick={() => setSelectedBookingForView(b)}
                                            className={`border-b border-white/[0.03] cursor-pointer transition-all group ${isSelected ? 'bg-[#c5a059]/[0.06]' : rowIdx % 2 === 1 ? 'bg-white/[0.015] hover:bg-white/[0.04]' : 'hover:bg-white/[0.03]'} ${b.status === 'Deleted' ? 'opacity-50' : ''}`}>
                                            {/* Checkbox */}
                                            <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                                <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(b.id)}
                                                    className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#c5a059] cursor-pointer" />
                                            </td>

                                            {/* Customer */}
                                            <td className="px-3 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg ${b.status === 'Completed' ? 'bg-gradient-to-br from-emerald-500 to-green-600' :
                                                        b.status === 'Confirmed' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                                                            b.status === 'Pending' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                                                                'bg-gradient-to-br from-slate-600 to-slate-700'}`}>
                                                        {b.customerName.trim().charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-white text-[13px] group-hover:text-[#c5a059] transition-colors truncate">{b.customerName.replace(/[\n\r]+/g, ' ').trim()}</p>
                                                            {isToday && b.status !== 'Completed' && (
                                                                <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md border border-emerald-500/30 animate-pulse shrink-0">Bugün</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <p className="text-[10px] text-slate-500">{b.phone}</p>
                                                            {b.flightNumber && (
                                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/15 shrink-0">
                                                                    <i className="fa-solid fa-plane text-[7px] mr-1"></i>{b.flightNumber}
                                                                </span>
                                                            )}
                                                            {b.notes && (
                                                                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-violet-500/10 text-violet-400 border border-violet-500/15 shrink-0" title={b.notes}>
                                                                    <i className="fa-solid fa-comment text-[7px]"></i>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Route */}
                                            <td className="px-3 py-3.5 hidden md:table-cell">
                                                <div className="flex items-center gap-2 max-w-[220px]">
                                                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-400 border border-emerald-500/50"></div>
                                                        <div className="w-px h-3 bg-white/10"></div>
                                                        <div className="w-2 h-2 rounded-full bg-[#c5a059] border border-[#c5a059]/50"></div>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[11px] text-slate-300 truncate">{b.pickup}</p>
                                                        <p className="text-[11px] text-slate-500 truncate">{b.destination}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-3 py-3.5">
                                                <p className="text-[13px] text-white font-medium tabular-nums">{b.date.split('-').reverse().join('.')}</p>
                                                <p className="text-[10px] text-slate-500 tabular-nums">{b.time}</p>
                                            </td>

                                            {/* Vehicle */}
                                            <td className="px-3 py-3.5 hidden lg:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center">
                                                        <i className="fa-solid fa-car-side text-[9px] text-slate-500"></i>
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] text-slate-300 truncate max-w-[100px]">{vehicle?.name || '—'}</p>
                                                        <p className="text-[9px] text-slate-600">{b.passengers} kişi</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Price */}
                                            <td className="px-3 py-3.5 text-right">
                                                <p className="text-sm font-black text-white">€{b.totalPrice}</p>
                                            </td>

                                            {/* Status */}
                                            <td className="px-3 py-3.5">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${st.bg} border ${st.border}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></div>
                                                    <span className={`text-[10px] font-bold ${st.color}`}>{st.label}</span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-3 py-3.5" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                                    {b.status === 'Pending' && (
                                                        <>
                                                            <button onClick={() => onUpdateStatus(b.id, 'Confirmed')} title="Onayla"
                                                                className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all">
                                                                <i className="fa-solid fa-check text-[10px]"></i>
                                                            </button>
                                                            <button onClick={() => onUpdateStatus(b.id, 'Rejected')} title="Reddet"
                                                                className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all">
                                                                <i className="fa-solid fa-xmark text-[10px]"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                    {b.status === 'Confirmed' && (
                                                        <button onClick={() => onUpdateStatus(b.id, 'Completed')} title="Tamamla"
                                                            className="w-7 h-7 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500 hover:text-white flex items-center justify-center transition-all">
                                                            <i className="fa-solid fa-flag-checkered text-[10px]"></i>
                                                        </button>
                                                    )}
                                                    <button onClick={() => {
                                                        if (b.status === 'Deleted') { if (confirm('KALICI olarak silinecek!')) onDeleteBooking(b.id); }
                                                        else { if (confirm('Silmek istediğinize emin misiniz?')) onUpdateStatus(b.id, 'Deleted'); }
                                                    }} title="Sil" className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all">
                                                        <i className="fa-solid fa-trash text-[10px]"></i>
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
