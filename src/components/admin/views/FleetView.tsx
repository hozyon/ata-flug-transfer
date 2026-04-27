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
    const filtered = vehicles.filter(v => (filterCat === 'all' || v.category === filterCat) && (!searchTerm || v.name.toLowerCase().includes(searchTerm.toLowerCase())));
    const categories = [...new Set(vehicles.map(v => v.category))];
    const { viewMode, toggleViewMode } = useViewMode();
    const _isFiltering = searchTerm || filterCat !== 'all';
    const { getDragProps: _getDragProps, getRowClassName: _getRowClassName } = useDragAndDrop(vehicles, (n) => setEditContent({ ...editContent, vehicles: n }));

    const handleDelete = (id: string, name: string) => {
        confirmAction({
            title: 'Aracı Sil',
            description: `"${name}" aracını filodan kaldırmak istediğinize emin misiniz?`,
            type: 'danger',
            onConfirm: () => { haptic.error(); setEditContent({ ...editContent, vehicles: vehicles.filter(v => v.id !== id) }); }
        });
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000 ease-out">
            
            {/* Header */}
            <div className="admin-glass-panel rounded-[3rem] p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm transition-transform hover:scale-105 duration-500"><i className="fa-solid fa-car-rear text-xl"></i></div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Araç Filosu</h2>
                        <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.25em] mt-2">VIP TAŞIMA STANDARTLARI</p>
                    </div>
                </div>
                <button onClick={() => { setVehicleForm({ id: '', name: '', category: 'VIP', capacity: 4, luggage: 4, basePrice: 30, image: '', features: [] }); setIsVehicleModalOpen(true); }}
                    className="px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95 flex items-center gap-3">
                    <i className="fa-solid fa-plus text-[10px]"></i> Yeni Araç Ekle
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-hide p-1.5 bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] shadow-sm">
                    <button onClick={() => setFilterCat('all')} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${filterCat === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>Hepsi</button>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setFilterCat(cat)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${filterCat === cat ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>{cat}</button>
                    ))}
                </div>
                <div className="relative flex-1 w-full group">
                    <i className="fa-solid fa-magnifying-glass absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 text-sm transition-colors group-focus-within:text-gold"></i>
                    <input type="text" placeholder="Model veya özellik ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-16 pr-8 py-5 bg-white/40 backdrop-blur-xl border border-white rounded-[2.5rem] text-[15px] font-bold text-slate-900 placeholder-slate-300 focus:bg-white focus:shadow-xl transition-all duration-500 outline-none shadow-sm" />
                </div>
                <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
            </div>

            {filtered.length === 0 ? (
                <div className="admin-glass-panel rounded-[4rem] p-32 text-center shadow-sm"><EmptyState icon="fa-car-side" title="Araç Bulunamadı" description="Kriterlere uygun kayıt mevcut değil." /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filtered.map((v, idx) => {
                        const globalIndex = vehicles.findIndex(veh => veh.id === v.id);
                        return (
                            <SwipeableCard key={v.id} actions={[{ icon: 'fa-pen', label: 'Düz.', color: 'bg-blue-500', onClick: () => { setVehicleForm(v); setIsVehicleModalOpen(true); } }, { icon: 'fa-trash', label: 'Sil', color: 'bg-rose-500', onClick: () => handleDelete(v.id, v.name) }]}>
                                <div onClick={() => { setVehicleForm(v); setIsVehicleModalOpen(true); }} className="admin-glass-panel rounded-[3.5rem] p-8 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-1000 cursor-pointer group relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 shadow-sm" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-white bg-slate-50 mb-8 relative shadow-inner">
                                        <img src={v.image || 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={v.name} />
                                        <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-slate-900/90 backdrop-blur-md text-[10px] font-black text-gold border border-white/20 uppercase tracking-widest">{v.category}</div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-gold transition-colors tracking-tight leading-tight">{v.name}</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50/50 border border-white/60 rounded-[2rem] p-4 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-sm"><i className="fa-solid fa-users text-sm"></i></div>
                                                <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">YOLCU</p><p className="text-sm font-black text-slate-900 tabular-nums">{v.capacity}</p></div>
                                            </div>
                                            <div className="bg-slate-50/50 border border-white/60 rounded-[2rem] p-4 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm"><i className="fa-solid fa-suitcase text-sm"></i></div>
                                                <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">BAGAJ</p><p className="text-sm font-black text-slate-900 tabular-nums">{v.luggage}</p></div>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-6 border-t border-white/40 flex items-center justify-between">
                                            <div className="flex gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); setEditContent({ ...editContent, vehicles: moveItem(vehicles, globalIndex, 'up') }); }} disabled={globalIndex === 0} className="w-9 h-9 rounded-xl bg-white/60 border border-white hover:bg-white text-slate-400 hover:text-gold disabled:opacity-0 transition-all shadow-sm"><i className="fa-solid fa-arrow-up text-[10px]"></i></button>
                                                <button onClick={(e) => { e.stopPropagation(); setEditContent({ ...editContent, vehicles: moveItem(vehicles, globalIndex, 'down') }); }} disabled={globalIndex === vehicles.length - 1} className="w-9 h-9 rounded-xl bg-white/60 border border-white hover:bg-white text-slate-400 hover:text-gold disabled:opacity-0 transition-all shadow-sm"><i className="fa-solid fa-arrow-down text-[10px]"></i></button>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => { setVehicleForm(v); setIsVehicleModalOpen(true); }} className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-500 hover:text-white transition-all shadow-sm flex items-center justify-center active:scale-90"><i className="fa-solid fa-pen text-sm"></i></button>
                                                <button onClick={() => handleDelete(v.id, v.name)} className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center active:scale-90"><i className="fa-solid fa-trash-can text-sm"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute top-[-50px] left-[-30px] text-[150px] text-slate-900/5 font-black pointer-events-none rotate-[-15deg] select-none group-hover:text-gold/5 transition-colors uppercase italic">
                                        {String(globalIndex + 1).padStart(2, '0')}
                                    </div>
                                </div>
                            </SwipeableCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
