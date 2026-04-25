import React, { useState } from 'react';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';
import { useViewMode } from '../../../hooks/useViewMode';
import { MobileViewToggle } from '../MobileViewToggle';
import { SwipeableCard } from '../SwipeableCard';
import { EmptyState } from '../EmptyState';
import { haptic } from '../../../utils/haptic';
import { SiteContent, Vehicle } from '../../../types';

interface FleetViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    setVehicleForm: (form: Vehicle) => void;
    setIsVehicleModalOpen: (isOpen: boolean) => void;
    moveItem: <T>(list: T[], index: number, direction: 'up' | 'down') => T[];
    confirmAction: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

export const FleetView: React.FC<FleetViewProps> = ({
    editContent, setEditContent, setVehicleForm, setIsVehicleModalOpen, moveItem, confirmAction
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

    const handleDelete = (id: string, name: string) => {
        confirmAction({
            title: 'Aracı Sil',
            description: `"${name}" isimli aracı filodan kaldırmak istediğinize emin misiniz?`,
            type: 'danger',
            onConfirm: () => {
                haptic.error();
                setEditContent({ ...editContent, vehicles: vehicles.filter(v => v.id !== id) });
            }
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Toplam Araç', value: vehicles.length, icon: 'fa-car-side', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
                    { label: 'VIP', value: vehicles.filter(v => v.category === 'VIP').length, icon: 'fa-star', iconBg: 'bg-amber-500', gradient: 'from-amber-500/15 to-orange-600/5', border: 'border-amber-500/15' },
                    { label: 'Business', value: vehicles.filter(v => v.category === 'Business').length, icon: 'fa-briefcase', iconBg: 'bg-violet-500', gradient: 'from-violet-500/15 to-purple-600/5', border: 'border-violet-500/15' },
                    { label: 'Toplam Kapasite', value: vehicles.reduce((s, v) => s + (v.capacity || 0), 0), icon: 'fa-users', iconBg: 'bg-emerald-500', gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/15' },
                ].map((s, i) => (
                    <div key={i} className={`p-5 rounded-3xl bg-gradient-to-br ${s.gradient} border ${s.border} animate-in zoom-in-95 duration-500 delay-${i * 50}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-widest">{s.label}</p>
                                <p className="text-2xl font-black font-outfit text-white mt-1">{s.value}</p>
                            </div>
                            <div className={`w-11 h-11 rounded-2xl ${s.iconBg} flex items-center justify-center shadow-lg`}>
                                <i className={`fa-solid ${s.icon} text-white text-sm`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Container */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 py-5 border-b border-white/[0.04]">
                    {/* Category Filter */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide w-full sm:w-auto">
                        <button onClick={() => setFilterCat('all')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${filterCat === 'all' ? 'bg-[var(--color-primary)] text-[#06080F] shadow-lg shadow-[var(--color-primary)]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            <i className="fa-solid fa-layer-group text-[10px]"></i>Tümü
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${filterCat === 'all' ? 'bg-black/10' : 'bg-white/5'}`}>{vehicles.length}</span>
                        </button>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setFilterCat(cat)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${filterCat === cat ? 'bg-[var(--color-primary)] text-[#06080F] shadow-lg shadow-[var(--color-primary)]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                                {cat}
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${filterCat === cat ? 'bg-black/10' : 'bg-white/5'}`}>{vehicles.filter(v => v.category === cat).length}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 sm:ml-auto w-full sm:w-auto">
                        <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                        {/* Search */}
                        <div className="relative flex-1 sm:w-64">
                            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                            <input type="text" placeholder="Araç ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-2xl text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 focus:bg-white/[0.08] outline-none transition-all" />
                        </div>
                        {/* Add */}
                        <button onClick={() => { setVehicleForm({ id: '', name: '', category: 'VIP', capacity: 4, luggage: 4, basePrice: 30, image: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&q=80&w=800', features: [] }); setIsVehicleModalOpen(true); }}
                            className="px-5 py-2.5 bg-[var(--color-primary)] hover:brightness-110 active:scale-95 text-[#06080F] rounded-2xl font-black text-xs shadow-lg shadow-[var(--color-primary)]/20 transition-all flex items-center gap-2 shrink-0">
                            <i className="fa-solid fa-plus text-[10px]"></i> Yeni Araç
                        </button>
                    </div>
                </div>

                {/* Table Content */}
                {filtered.length === 0 ? (
                    <EmptyState
                        icon="fa-car-side"
                        title={filterCat !== 'all' ? `"${filterCat}" kategorisinde araç yok` : searchTerm ? `"${searchTerm}" ile eşleşen araç yok` : 'Henüz araç eklenmemiş'}
                        description={filterCat !== 'all' || searchTerm ? undefined : 'Yeni araç eklemek için butona tıklayın'}
                        action={filterCat !== 'all' || searchTerm ? { label: 'Filtreyi Temizle', onClick: () => { setFilterCat('all'); setSearchTerm(''); } } : undefined}
                    />
                ) : viewMode === 'card' ? (
                    /* ── MOBILE CARD VIEW ── */
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map((vehicle, index) => {
                            return (
                                <SwipeableCard key={vehicle.id || index} actions={[
                                    { icon: 'fa-pen', label: 'Düzenle', color: 'bg-blue-500', onClick: () => { setVehicleForm(vehicle); setIsVehicleModalOpen(true); } },
                                    { icon: 'fa-trash', label: 'Sil', color: 'bg-red-500', onClick: () => handleDelete(vehicle.id, vehicle.name) },
                                ]}>
                                    <div className="p-4 bg-white/[0.02] rounded-3xl border border-white/[0.05] hover:border-[var(--color-primary)]/20 transition-all group">
                                        <div className="flex items-start gap-4">
                                            <div className="w-24 h-16 rounded-2xl overflow-hidden border border-white/10 bg-black/20 shrink-0">
                                                <img src={vehicle.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={e => (e.currentTarget.src = 'https://via.placeholder.com/160x100?text=No+Image')} alt={vehicle.name} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-white text-[15px] truncate">{vehicle.name}</p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black border ${vehicle.category === 'VIP' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        vehicle.category === 'Premium' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                                        {vehicle.category}
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <i className="fa-solid fa-user text-[var(--color-primary)] text-[9px]"></i>
                                                        <span className="text-xs font-bold text-white/90">{vehicle.capacity}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <i className="fa-solid fa-suitcase text-blue-400 text-[9px]"></i>
                                                        <span className="text-xs font-bold text-white/90">{vehicle.luggage}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Features */}
                                        {vehicle.features && vehicle.features.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-white/[0.04]">
                                                {vehicle.features.slice(0, 5).map((f, i) => (
                                                    <span key={i} className="text-[10px] font-medium bg-white/5 text-slate-400 px-2 py-0.5 rounded-lg border border-white/5">{f}</span>
                                                ))}
                                                {vehicle.features.length > 5 && <span className="text-[10px] font-bold bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded-lg">+{vehicle.features.length - 5}</span>}
                                            </div>
                                        )}
                                        {/* Mobile Quick Actions */}
                                        <div className="flex items-center gap-2 mt-4">
                                            <button onClick={() => { haptic.tap(); setVehicleForm(vehicle); setIsVehicleModalOpen(true); }}
                                                className="flex-1 py-2.5 rounded-2xl bg-blue-500/10 text-blue-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-500/20 active:scale-95 transition-all">
                                                <i className="fa-solid fa-pen text-[10px]"></i>Düzenle
                                            </button>
                                            <button onClick={() => handleDelete(vehicle.id, vehicle.name)}
                                                className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-400 active:bg-red-500 active:text-white flex items-center justify-center active:scale-95 transition-all">
                                                <i className="fa-solid fa-trash text-[11px]"></i>
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
                                <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                                    <th className="w-12 px-2 py-4"></th>
                                    <th className="text-left px-4 py-4 w-14"><span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-widest">#</span></th>
                                    <th className="text-left px-4 py-4"><span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-widest">ARAÇ DETAYI</span></th>
                                    <th className="text-left px-4 py-4 hidden md:table-cell"><span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-widest">KATEGORİ</span></th>
                                    <th className="text-center px-4 py-4 hidden sm:table-cell"><span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-widest">KAPASİTE</span></th>
                                    <th className="text-center px-4 py-4 hidden sm:table-cell"><span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-widest">BAGAJ</span></th>
                                    <th className="text-left px-4 py-4 hidden lg:table-cell"><span className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-widest">DONANIMLAR</span></th>
                                    <th className="w-36 px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((vehicle, index) => {
                                    const globalIndex = vehicles.findIndex(v => v.id === vehicle.id);
                                    const dragProps = !isFiltering ? getDragProps(globalIndex) : {};
                                    return (
                                        <tr key={vehicle.id || index} {...dragProps}
                                            className={`border-b border-white/[0.03] hover:bg-white/[0.03] transition-all group ${!isFiltering ? 'cursor-grab active:cursor-grabbing' : ''} ${getRowClassName(globalIndex)}`}>
                                            <td className="px-2 py-4">
                                                {!isFiltering && (
                                                    <div className="flex items-center justify-center text-slate-600 group-hover:text-[var(--color-primary)] transition-colors">
                                                        <i className="fa-solid fa-grip-vertical text-[10px]"></i>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                                                    <span className="text-[11px] font-mono font-black text-slate-500 group-hover:text-[var(--color-primary)] transition-colors">{globalIndex + 1}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-20 h-12 rounded-xl overflow-hidden border border-white/10 bg-black/40 shrink-0 shadow-lg group-hover:border-[var(--color-primary)]/30 transition-colors">
                                                        <img src={vehicle.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={e => (e.currentTarget.src = 'https://via.placeholder.com/160x100?text=No+Image')} alt={vehicle.name} />
                                                    </div>
                                                    <p className="font-bold text-white text-[14px] group-hover:text-[var(--color-primary)] transition-colors truncate">{vehicle.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 hidden md:table-cell">
                                                <span className={`px-3 py-1 rounded-xl text-[10px] font-black border ${vehicle.category === 'VIP' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    vehicle.category === 'Premium' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                                                        vehicle.category === 'Large Group' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                            'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                                                    {vehicle.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center hidden sm:table-cell">
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05] group-hover:border-[var(--color-primary)]/20 transition-colors">
                                                    <i className="fa-solid fa-user text-[var(--color-primary)] text-[10px]"></i>
                                                    <span className="text-xs font-black text-white/90">{vehicle.capacity}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center hidden sm:table-cell">
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05] group-hover:border-blue-500/20 transition-colors">
                                                    <i className="fa-solid fa-suitcase text-blue-400 text-[10px]"></i>
                                                    <span className="text-xs font-black text-white/90">{vehicle.luggage}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 hidden lg:table-cell">
                                                <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                                                    {vehicle.features?.slice(0, 3).map((f, i) => (
                                                        <span key={i} className="text-[10px] font-medium bg-white/5 text-slate-500 px-2 py-0.5 rounded-lg border border-white/5">{f}</span>
                                                    ))}
                                                    {(vehicle.features?.length || 0) > 3 && <span className="text-[10px] font-black bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-0.5 rounded-lg">+{(vehicle.features?.length || 0) - 3}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all justify-end translate-x-2 group-hover:translate-x-0">
                                                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                                                        <button onClick={() => setEditContent({ ...editContent, vehicles: moveItem(vehicles, globalIndex, 'up') })} disabled={globalIndex === 0}
                                                            className="w-7 h-7 rounded-lg text-slate-500 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all flex items-center justify-center">
                                                            <i className="fa-solid fa-chevron-up text-[10px]"></i>
                                                        </button>
                                                        <button onClick={() => setEditContent({ ...editContent, vehicles: moveItem(vehicles, globalIndex, 'down') })} disabled={globalIndex === vehicles.length - 1}
                                                            className="w-7 h-7 rounded-lg text-slate-500 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all flex items-center justify-center">
                                                            <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                                        </button>
                                                    </div>
                                                    <button onClick={() => { setVehicleForm(vehicle); setIsVehicleModalOpen(true); }}
                                                        className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center shadow-lg transition-all active:scale-90">
                                                        <i className="fa-solid fa-pen text-[11px]"></i>
                                                    </button>
                                                    <button onClick={() => handleDelete(vehicle.id, vehicle.name)}
                                                        className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center shadow-lg transition-all active:scale-90">
                                                        <i className="fa-solid fa-trash text-[11px]"></i>
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
