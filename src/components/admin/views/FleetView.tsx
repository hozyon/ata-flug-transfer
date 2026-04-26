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
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-8">
            {/* Header / Stats — Elite Style */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-[#020617]/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-500/20 to-transparent border border-amber-500/20 flex items-center justify-center shadow-inner group transition-transform duration-500 hover:scale-105">
                        <i className="fa-solid fa-car-rear text-amber-500 text-2xl drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-2xl font-[900] text-white tracking-tight">Araç Filosu</h2>
                            <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Fleet</span>
                        </div>
                        <p className="text-[13px] text-slate-400 font-medium">Toplam {vehicles.length} farklı araç seçeneği sunuluyor</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                     <button onClick={() => { setVehicleForm({ id: '', name: '', category: 'VIP', capacity: 4, luggage: 4, basePrice: 30, image: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&q=80&w=800', features: [] }); setIsVehicleModalOpen(true); }}
                        className="px-5 py-3 bg-[var(--color-primary)] hover:bg-amber-600 text-[#06080F] rounded-2xl font-[900] text-[11px] uppercase tracking-widest shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2.5 active:scale-95">
                        <i className="fa-solid fa-plus text-[10px]"></i> Araç Ekle
                    </button>
                </div>
            </div>

            {/* Toolbar — High-end Search & Filters */}
            <div className="bg-[#020617]/30 border border-white/[0.04] rounded-[2.5rem] p-5 shadow-xl backdrop-blur-2xl">
                <div className="flex flex-col lg:flex-row gap-5 items-center">
                    {/* Categories */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide w-full lg:w-auto">
                        <button onClick={() => setFilterCat('all')} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterCat === 'all' ? 'bg-[var(--color-primary)] text-[#06080F]' : 'bg-white/5 text-slate-500 hover:text-white'}`}>Tümü ({vehicles.length})</button>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setFilterCat(cat)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterCat === cat ? 'bg-[var(--color-primary)] text-[#06080F]' : 'bg-white/5 text-slate-500 hover:text-white'}`}>{cat} ({vehicles.filter(v => v.category === cat).length})</button>
                        ))}
                    </div>

                    <div className="relative flex-1 w-full group">
                        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs transition-colors group-focus-within:text-[var(--color-primary)]"></i>
                        <input
                            type="text"
                            placeholder="Araç modeli veya özellik ara..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-5 py-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-[13px] text-white placeholder-slate-600 focus:border-[var(--color-primary)]/40 focus:bg-white/[0.04] outline-none transition-all font-semibold"
                        />
                    </div>
                    <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="bg-[#020617]/20 border border-white/[0.04] rounded-[2.5rem] p-20">
                    <EmptyState icon="fa-car-side" title="Araç bulunamadı" description="Kriterlere uygun araç kaydı mevcut değil." />
                </div>
            ) : viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((v) => {
                        const globalIndex = vehicles.findIndex(veh => veh.id === v.id);
                        return (
                            <SwipeableCard key={v.id} actions={[
                                { icon: 'fa-pen', label: 'Düzenle', color: 'bg-blue-500', onClick: () => { setVehicleForm(v); setIsVehicleModalOpen(true); } },
                                { icon: 'fa-trash', label: 'Sil', color: 'bg-rose-500', onClick: () => handleDelete(v.id, v.name) },
                            ]}>
                                <div onClick={() => { setVehicleForm(v); setIsVehicleModalOpen(true); }}
                                    className="group p-6 bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] hover:border-[var(--color-primary)]/40 hover:bg-white/[0.03] transition-all duration-500 cursor-pointer relative overflow-hidden shadow-xl">
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-24 h-16 rounded-2xl overflow-hidden border border-white/10 bg-black/40 shrink-0">
                                            <img src={v.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={v.name} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-[800] text-white text-[16px] truncate group-hover:text-[var(--color-primary)] transition-colors duration-300">{v.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black border tracking-widest ${v.category === 'VIP' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-white/10'}`}>
                                                    {v.category.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-3 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400"><i className="fa-solid fa-users text-xs"></i></div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-500 uppercase">Yolcu</p>
                                                <p className="text-sm font-black text-white">{v.capacity}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-3 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400"><i className="fa-solid fa-suitcase text-xs"></i></div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-500 uppercase">Bagaj</p>
                                                <p className="text-sm font-black text-white">{v.luggage}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-5 border-t border-white/[0.04]">
                                        <div className="flex items-center gap-1.5">
                                            <i className="fa-solid fa-star text-[var(--color-primary)] text-[10px]"></i>
                                            <span className="text-[11px] font-bold text-slate-400">Elite Fleet</span>
                                        </div>
                                        <div className="flex bg-white/5 rounded-lg p-1">
                                            <button onClick={(e) => { e.stopPropagation(); setEditContent({ ...editContent, vehicles: moveItem(vehicles, globalIndex, 'up') }); }} disabled={globalIndex === 0} className="w-6 h-6 rounded-md hover:bg-white/10 text-slate-500 disabled:opacity-0 transition-all"><i className="fa-solid fa-chevron-up text-[9px]"></i></button>
                                            <button onClick={(e) => { e.stopPropagation(); setEditContent({ ...editContent, vehicles: moveItem(vehicles, globalIndex, 'down') }); }} disabled={globalIndex === vehicles.length - 1} className="w-6 h-6 rounded-md hover:bg-white/10 text-slate-500 disabled:opacity-0 transition-all"><i className="fa-solid fa-chevron-down text-[9px]"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </SwipeableCard>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/[0.04]">
                                <th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Araç / Model</th>
                                <th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Kategori</th>
                                <th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-center">Kapasite</th>
                                <th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-center">Bagaj</th>
                                <th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filtered.map((v) => {
                                const globalIndex = vehicles.findIndex(veh => veh.id === v.id);
                                const dragProps = !isFiltering ? getDragProps(globalIndex) : {};
                                return (
                                    <tr key={v.id} {...dragProps} className={`group hover:bg-white/[0.03] transition-all duration-300 cursor-pointer ${getRowClassName(globalIndex)}`}>
                                        <td className="px-8 py-5" onClick={() => { setVehicleForm(v); setIsVehicleModalOpen(true); }}>
                                            <div className="flex items-center gap-4">
                                                {!isFiltering && <i className="fa-solid fa-grip-vertical text-slate-800 group-hover:text-slate-600 mr-1"></i>}
                                                <div className="w-16 h-11 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-black/40 shadow-inner">
                                                    <img src={v.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={v.name} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[14px] font-[800] text-white group-hover:text-[var(--color-primary)] transition-colors duration-300">{v.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Sıra: {globalIndex + 1}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5" onClick={() => { setVehicleForm(v); setIsVehicleModalOpen(true); }}>
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border tracking-widest ${v.category === 'VIP' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-white/10'}`}>
                                                {v.category.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center" onClick={() => { setVehicleForm(v); setIsVehicleModalOpen(true); }}>
                                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                                                <i className="fa-solid fa-user text-[9px] text-[var(--color-primary)]/70"></i>
                                                <span className="text-[11px] font-black text-white/70">{v.capacity}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center" onClick={() => { setVehicleForm(v); setIsVehicleModalOpen(true); }}>
                                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                                                <i className="fa-solid fa-suitcase text-[9px] text-blue-400/70"></i>
                                                <span className="text-[11px] font-black text-white/70">{v.luggage}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button onClick={() => { setVehicleForm(v); setIsVehicleModalOpen(true); }} className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg active:scale-95"><i className="fa-solid fa-pen text-xs"></i></button>
                                                <button onClick={() => handleDelete(v.id, v.name)} className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all duration-300 flex items-center justify-center shadow-lg active:scale-95"><i className="fa-solid fa-trash-can text-xs"></i></button>
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
    );
};
