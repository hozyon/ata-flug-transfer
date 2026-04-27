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
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-6">
            {/* Header / Stats — Refined Light Minimalism */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center group transition-transform duration-500 hover:scale-105 shadow-sm shadow-amber-100/50">
                        <i className="fa-solid fa-car-rear text-amber-500 text-2xl"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Araç Filosu</h2>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fleet</span>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium">Toplam <span className="text-slate-900 font-bold">{vehicles.length}</span> farklı araç seçeneği sunuluyor</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                     <button onClick={() => { setVehicleForm({ id: '', name: '', category: 'VIP', capacity: 4, luggage: 4, basePrice: 30, image: 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&q=80&w=800', features: [] }); setIsVehicleModalOpen(true); }}
                        className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2.5">
                        <i className="fa-solid fa-plus text-[10px]"></i> Yeni Araç Ekle
                    </button>
                </div>
            </div>

            {/* Toolbar — High-end Search & Filters */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-5 items-center">
                    {/* Categories */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide w-full lg:w-auto p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                        <button onClick={() => setFilterCat('all')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterCat === 'all' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>Tümü ({vehicles.length})</button>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setFilterCat(cat)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterCat === cat ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>{cat}</button>
                        ))}
                    </div>

                    <div className="relative flex-1 w-full group">
                        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs transition-colors group-focus-within:text-gold"></i>
                        <input
                            type="text"
                            placeholder="Araç modeli veya özellik ara..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] text-slate-900 font-bold focus:bg-white focus:border-gold/40 outline-none transition-all placeholder:text-slate-300"
                        />
                    </div>
                    <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-20 text-center shadow-sm">
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
                                    className="group p-6 bg-white border border-slate-100 rounded-[2.5rem] hover:border-gold/40 hover:shadow-xl transition-all duration-500 cursor-pointer relative overflow-hidden shadow-sm">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-24 h-16 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0 shadow-inner">
                                            <img src={v.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={v.name} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-black text-slate-900 text-[16px] truncate group-hover:text-gold transition-colors duration-300">{v.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border tracking-widest uppercase ${v.category === 'VIP' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                                    {v.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3 group-hover:bg-white transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm"><i className="fa-solid fa-users text-sm"></i></div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">YOLCU</p>
                                                <p className="text-sm font-black text-slate-900">{v.capacity}</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3 group-hover:bg-white transition-colors">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm"><i className="fa-solid fa-suitcase text-sm"></i></div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BAGAJ</p>
                                                <p className="text-sm font-black text-slate-900">{v.luggage}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-gold/10 flex items-center justify-center text-gold"><i className="fa-solid fa-star text-[10px]"></i></div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ELITE FLEET</span>
                                        </div>
                                        <div className="flex bg-slate-50 rounded-xl p-1.5 border border-slate-100 shadow-inner">
                                            <button onClick={(e) => { e.stopPropagation(); setEditContent({ ...editContent, vehicles: moveItem(vehicles, globalIndex, 'up') }); }} disabled={globalIndex === 0} className="w-7 h-7 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-gold disabled:opacity-0 transition-all"><i className="fa-solid fa-chevron-up text-[10px]"></i></button>
                                            <button onClick={(e) => { e.stopPropagation(); setEditContent({ ...editContent, vehicles: moveItem(vehicles, globalIndex, 'down') }); }} disabled={globalIndex === vehicles.length - 1} className="w-7 h-7 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-gold disabled:opacity-0 transition-all"><i className="fa-solid fa-chevron-down text-[10px]"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </SwipeableCard>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Araç / Model</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Kapasite</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Bagaj</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map((v) => {
                                const globalIndex = vehicles.findIndex(veh => veh.id === v.id);
                                const dragProps = !isFiltering ? getDragProps(globalIndex) : {};
                                return (
                                    <tr key={v.id} {...dragProps} className={`group hover:bg-slate-50 transition-all duration-300 cursor-pointer ${getRowClassName(globalIndex)}`}>
                                        <td className="px-8 py-5" onClick={() => { setVehicleForm(v); setIsVehicleModalOpen(true); }}>
                                            <div className="flex items-center gap-5">
                                                {!isFiltering && <i className="fa-solid fa-grip-vertical text-slate-200 group-hover:text-slate-400 transition-colors"></i>}
                                                <div className="w-16 h-11 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0 shadow-inner">
                                                    <img src={v.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={v.name} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[14px] font-bold text-slate-900 group-hover:text-gold transition-colors duration-300">{v.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Pozisyon: {globalIndex + 1}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5" onClick={() => { setVehicleForm(v); setIsVehicleModalOpen(true); }}>
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest uppercase ${v.category === 'VIP' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                                                {v.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center" onClick={() => { setVehicleForm(v); setIsVehicleModalOpen(true); }}>
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                                                <i className="fa-solid fa-user text-[10px] text-gold/60"></i>
                                                <span className="text-[12px] font-black text-slate-700">{v.capacity}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center" onClick={() => { setVehicleForm(v); setIsVehicleModalOpen(true); }}>
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                                                <i className="fa-solid fa-suitcase text-[10px] text-blue-500/60"></i>
                                                <span className="text-[12px] font-black text-slate-700">{v.luggage}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button onClick={() => { setVehicleForm(v); setIsVehicleModalOpen(true); }} className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm active:scale-95"><i className="fa-solid fa-pen text-xs"></i></button>
                                                <button onClick={() => handleDelete(v.id, v.name)} className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm active:scale-95"><i className="fa-solid fa-trash-can text-xs"></i></button>
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
