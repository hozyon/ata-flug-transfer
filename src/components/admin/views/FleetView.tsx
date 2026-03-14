import React, { useState } from 'react';
import { SiteContent } from '../../../types';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';
import { useViewMode } from '../../../hooks/useViewMode';
import { MobileViewToggle } from '../MobileViewToggle';
import { SwipeableCard } from '../SwipeableCard';
import { EmptyState } from '../EmptyState';
import { haptic } from '../../../utils/haptic';

interface FleetViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    setVehicleForm: (form: any) => void;
    setIsVehicleModalOpen: (isOpen: boolean) => void;
    moveItem: <T>(list: T[], index: number, direction: 'up' | 'down') => T[];
}

export const FleetView: React.FC<FleetViewProps> = ({
    editContent, setEditContent, setVehicleForm, setIsVehicleModalOpen, moveItem
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCat, setFilterCat] = useState<string>('all');

    const vehicles = editContent.vehicles || [];
    const filtered = vehicles.filter(v => {
        const matchCat = filterCat === 'all' || v.category === filterCat;
        const matchSearch = !searchTerm || v.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCat && matchSearch;
    });

    const categories = [...new Set(vehicles.map(v => v.category))];

    const { viewMode, toggleViewMode } = useViewMode();
    const isFiltering = searchTerm || filterCat !== 'all';
    const { getDragProps, getRowClassName } = useDragAndDrop(
        vehicles,
        (newVehicles) => setEditContent({ ...editContent, vehicles: newVehicles })
    );

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Toplam Araç', value: vehicles.length, icon: 'fa-car-side', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
                    { label: 'VIP', value: vehicles.filter(v => v.category === 'VIP').length, icon: 'fa-star', iconBg: 'bg-amber-500', gradient: 'from-amber-500/15 to-orange-600/5', border: 'border-amber-500/15' },
                    { label: 'Business', value: vehicles.filter(v => v.category === 'Business').length, icon: 'fa-briefcase', iconBg: 'bg-violet-500', gradient: 'from-violet-500/15 to-purple-600/5', border: 'border-violet-500/15' },
                    { label: 'Toplam Kapasite', value: vehicles.reduce((s, v) => s + (v.capacity || 0), 0), icon: 'fa-users', iconBg: 'bg-emerald-500', gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/15' },
                ].map((s, i) => (
                    <div key={i} className={`p-4 rounded-2xl bg-gradient-to-br ${s.gradient} border ${s.border}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                                <p className="text-2xl font-black text-white mt-1">{s.value}</p>
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
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-4">
                    {/* Category Filter */}
                    <div className="flex items-center gap-1">
                        <button onClick={() => setFilterCat('all')} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${filterCat === 'all' ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                            <i className="fa-solid fa-layer-group text-[10px] mr-1.5"></i>Tümü
                            <span className={`ml-1.5 text-[9px] font-black min-w-[18px] h-[18px] inline-flex items-center justify-center rounded-full ${filterCat === 'all' ? 'bg-white/20' : 'bg-white/5'}`}>{vehicles.length}</span>
                        </button>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setFilterCat(cat)} className={`px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filterCat === cat ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                                {cat}
                                <span className={`ml-1.5 text-[9px] font-black min-w-[18px] h-[18px] inline-flex items-center justify-center rounded-full ${filterCat === cat ? 'bg-white/20' : 'bg-white/5'}`}>{vehicles.filter(v => v.category === cat).length}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 sm:ml-auto w-full sm:w-auto">
                        <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                        {/* Search */}
                        <div className="relative flex-1 sm:w-56">
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                            <input type="text" placeholder="Araç ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 outline-none transition-all" />
                        </div>
                        {/* Add */}
                        <button onClick={() => { setVehicleForm({ id: '', name: '', category: 'VIP', capacity: 4, luggage: 4, image: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&q=80&w=800', features: [] }); setIsVehicleModalOpen(true); }}
                            className="px-4 py-2.5 bg-[var(--color-primary)] hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0">
                            <i className="fa-solid fa-plus text-[10px]"></i> Yeni Araç
                        </button>
                    </div>
                </div>

                {/* Table */}
                {filtered.length === 0 ? (
                    <EmptyState
                        icon="fa-car-side"
                        title={filterCat !== 'all' ? `"${filterCat}" kategorisinde araç yok` : searchTerm ? `"${searchTerm}" ile eşleşen araç yok` : 'Henüz araç eklenmemiş'}
                        description={filterCat !== 'all' || searchTerm ? undefined : 'Yeni araç eklemek için butona tıklayın'}
                        action={filterCat !== 'all' || searchTerm ? { label: 'Filtreyi Temizle', onClick: () => { setFilterCat('all'); setSearchTerm(''); } } : undefined}
                    />
                ) : viewMode === 'card' ? (
                    /* ── MOBILE CARD VIEW ── */
                    <div className="p-3 space-y-3">
                        {filtered.map((vehicle, index) => {
                            const globalIndex = vehicles.findIndex(v => v.id === vehicle.id);
                            return (
                                <SwipeableCard key={vehicle.id || index} actions={[
                                    { icon: 'fa-pen', label: 'Düzenle', color: 'bg-blue-500', onClick: () => { setVehicleForm(vehicle); setIsVehicleModalOpen(true); } },
                                    { icon: 'fa-trash', label: 'Sil', color: 'bg-red-500', onClick: () => { if (confirm('Bu aracı silmek istediğinize emin misiniz?')) setEditContent({ ...editContent, vehicles: vehicles.filter((_, i) => i !== globalIndex) }); } },
                                ]}>
                                    <div className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-20 h-14 rounded-xl overflow-hidden border border-white/10 bg-black/20 shrink-0">
                                                <img src={vehicle.image} className="w-full h-full object-cover" onError={e => (e.currentTarget.src = 'https://via.placeholder.com/160x100?text=No+Image')} alt={vehicle.name} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-white text-sm truncate">{vehicle.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${vehicle.category === 'VIP' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        vehicle.category === 'Premium' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                                        {vehicle.category}
                                                    </span>
                                                    <div className="flex items-center gap-1">
                                                        <i className="fa-solid fa-user text-[var(--color-primary)] text-[8px]"></i>
                                                        <span className="text-[11px] font-bold text-white">{vehicle.capacity}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <i className="fa-solid fa-suitcase text-blue-400 text-[8px]"></i>
                                                        <span className="text-[11px] font-bold text-white">{vehicle.luggage}</span>
                                                    </div>
                                                </div>
                                                {vehicle.features && vehicle.features.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {vehicle.features.slice(0, 4).map((f, i) => (
                                                            <span key={i} className="text-[8px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded border border-white/5">{f}</span>
                                                        ))}
                                                        {vehicle.features.length > 4 && <span className="text-[8px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-1.5 py-0.5 rounded">+{vehicle.features.length - 4}</span>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {/* Actions */}
                                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/[0.04]">
                                            <button onClick={() => { haptic.tap(); setVehicleForm(vehicle); setIsVehicleModalOpen(true); }}
                                                className="flex-1 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-xs font-bold flex items-center justify-center gap-1.5 active:bg-blue-500/20 transition-all">
                                                <i className="fa-solid fa-pen text-[10px]"></i>Düzenle
                                            </button>
                                            <button onClick={() => { if (confirm('Bu aracı silmek istediğinize emin misiniz?')) { haptic.error(); setEditContent({ ...editContent, vehicles: vehicles.filter((_, i) => i !== globalIndex) }); } }}
                                                className="w-8 h-8 rounded-lg bg-white/5 text-slate-500 active:bg-red-500/10 active:text-red-400 flex items-center justify-center transition-all">
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
                                    <th className="w-10 px-2 py-3"></th>
                                    <th className="text-left px-4 py-3 w-12"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">#</span></th>
                                    <th className="text-left px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Araç</span></th>
                                    <th className="text-left px-3 py-3 hidden md:table-cell"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kategori</span></th>
                                    <th className="text-center px-3 py-3 hidden sm:table-cell"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kapasite</span></th>
                                    <th className="text-center px-3 py-3 hidden sm:table-cell"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bagaj</span></th>
                                    <th className="text-left px-3 py-3 hidden lg:table-cell"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Donanımlar</span></th>
                                    <th className="w-32 px-3 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((vehicle, index) => {
                                    const globalIndex = vehicles.findIndex(v => v.id === vehicle.id);
                                    const dragProps = !isFiltering ? getDragProps(globalIndex) : {};
                                    return (
                                        <tr key={vehicle.id || index} {...dragProps}
                                            className={`border-b border-white/[0.03] hover:bg-white/[0.03] transition-all group ${!isFiltering ? 'cursor-grab active:cursor-grabbing' : ''} ${getRowClassName(globalIndex)}`}>
                                            <td className="px-2 py-3.5">
                                                {!isFiltering && (
                                                    <div className="flex items-center justify-center text-slate-600 hover:text-slate-300 transition-colors">
                                                        <i className="fa-solid fa-grip-vertical text-[10px]"></i>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                                                    <span className="text-[10px] font-mono font-bold text-slate-500">{globalIndex + 1}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10 bg-black/20 shrink-0">
                                                        <img src={vehicle.image} className="w-full h-full object-cover" onError={e => (e.currentTarget.src = 'https://via.placeholder.com/160x100?text=No+Image')} alt={vehicle.name} />
                                                    </div>
                                                    <p className="font-bold text-white text-[13px] group-hover:text-[var(--color-primary)] transition-colors truncate">{vehicle.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5 hidden md:table-cell">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${vehicle.category === 'VIP' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    vehicle.category === 'Premium' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                                                        vehicle.category === 'Large Group' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                            'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                                    {vehicle.category}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3.5 text-center hidden sm:table-cell">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                                                    <i className="fa-solid fa-user text-[var(--color-primary)] text-[9px]"></i>
                                                    <span className="text-xs font-bold text-white">{vehicle.capacity}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5 text-center hidden sm:table-cell">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                                                    <i className="fa-solid fa-suitcase text-blue-400 text-[9px]"></i>
                                                    <span className="text-xs font-bold text-white">{vehicle.luggage}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5 hidden lg:table-cell">
                                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                    {vehicle.features?.slice(0, 3).map((f, i) => (
                                                        <span key={i} className="text-[9px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded border border-white/5">{f}</span>
                                                    ))}
                                                    {(vehicle.features?.length || 0) > 3 && <span className="text-[9px] bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-1.5 py-0.5 rounded">+{(vehicle.features?.length || 0) - 3}</span>}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                                    <button onClick={() => setEditContent({ ...editContent, vehicles: moveItem(vehicles, globalIndex, 'up') })} disabled={globalIndex === 0}
                                                        className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all flex items-center justify-center">
                                                        <i className="fa-solid fa-chevron-up text-[10px]"></i>
                                                    </button>
                                                    <button onClick={() => setEditContent({ ...editContent, vehicles: moveItem(vehicles, globalIndex, 'down') })} disabled={globalIndex === vehicles.length - 1}
                                                        className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all flex items-center justify-center">
                                                        <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                                    </button>
                                                    <button onClick={() => { setVehicleForm(vehicle); setIsVehicleModalOpen(true); }}
                                                        className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all">
                                                        <i className="fa-solid fa-pen text-[10px]"></i>
                                                    </button>
                                                    <button onClick={() => { if (confirm('Bu aracı silmek istediğinize emin misiniz?')) setEditContent({ ...editContent, vehicles: vehicles.filter((_, i) => i !== globalIndex) }); }}
                                                        className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all">
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
