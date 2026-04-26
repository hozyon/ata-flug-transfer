import React, { useState } from 'react';
import { SiteContent, Region } from '../../../types';
import { SCRAPED_REGIONS } from '../../../constants';
 // import { useDragAndDrop } from '../../../hooks/useDragAndDrop';
import { useViewMode } from '../../../hooks/useViewMode';
import { MobileViewToggle } from '../MobileViewToggle';
import { SwipeableCard } from '../SwipeableCard';
import { EmptyState } from '../EmptyState';

interface RegionsViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    showToast: (msg: string, type: 'success' | 'delete' | 'error' | 'warning' | 'info') => void;
    confirmAction: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

export const RegionsView: React.FC<RegionsViewProps> = ({
    editContent, setEditContent, showToast, confirmAction
}) => {
    const [regionSearch, setRegionSearch] = useState('');
    const [quickSearch, setQuickSearch] = useState('');
    const [isAddRegionModalOpen, setIsAddRegionModalOpen] = useState(false);
    const [editingRegion, setEditingRegion] = useState<Region | null>(null);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [selectedFromPool, setSelectedFromPool] = useState<string[]>([]);
    const [newRegion, setNewRegion] = useState<Region>({
        id: '', name: '', desc: '',
        image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800',
        icon: 'fa-location-dot', price: 0
    });

    const { viewMode, toggleViewMode } = useViewMode();
    const regions = editContent.regions || [];
    const filtered = regionSearch ? regions.filter(r => r.name.toLowerCase().includes(regionSearch.toLowerCase())) : regions;

    const allRegionNames = Array.from(new Set([...SCRAPED_REGIONS.map(r => r.name), ...regions.map(r => r.name)]));
    const quickFiltered = quickSearch ? allRegionNames.filter(n => n.toLowerCase().includes(quickSearch.toLowerCase())) : allRegionNames;

    const toggleRegion = (n: string) => setSelectedFromPool(p => p.includes(n) ? p.filter(x => x !== n) : [...p, n]);

    const handleSave = () => {
        if (editingRegion) {
            setEditContent({ ...editContent, regions: regions.map(r => r.id === editingRegion.id ? { ...newRegion } : r) });
            showToast('Bölge güncellendi', 'success');
        } else if (selectedFromPool.length > 0) {
            const added: Region[] = selectedFromPool.map(n => ({ id: crypto.randomUUID(), name: n, desc: '', image: '', icon: 'fa-location-dot', price: 0 }));
            setEditContent({ ...editContent, regions: [...regions, ...added] });
            setSelectedFromPool([]);
            showToast('Bölgeler eklendi', 'success');
        } else {
            setEditContent({ ...editContent, regions: [...regions, { ...newRegion, id: crypto.randomUUID() }] });
            showToast('Bölge eklendi', 'success');
        }
        setIsAddRegionModalOpen(false);
    };

    const LABEL_CLS = 'block text-[11px] font-[800] uppercase tracking-widest text-slate-500 mb-2 ml-1';
    const INPUT_CLS = 'w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3.5 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all';

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-8">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-[#020617]/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-teal-500/20 to-transparent border border-teal-500/20 flex items-center justify-center shadow-inner group transition-transform duration-500 hover:scale-105">
                        <i className="fa-solid fa-map-location-dot text-teal-400 text-2xl group-hover:drop-shadow-[0_0_8px_rgba(45,212,191,0.6)]"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5"><h2 className="text-2xl font-[900] text-white tracking-tight">Bölge Yönetimi</h2><span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Destinations</span></div>
                        <p className="text-[13px] text-slate-400 font-medium">Toplam {regions.length} aktif bölge bulunuyor</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowQuickAdd(!showQuickAdd)} className={`px-5 py-3 rounded-2xl text-[11px] font-[800] uppercase tracking-widest transition-all border ${showQuickAdd ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-400'}`}>Hızlı Ekle</button>
                    <button onClick={() => { setEditingRegion(null); setIsAddRegionModalOpen(true); }} className="px-5 py-3 bg-[var(--color-primary)] text-[#06080F] rounded-2xl font-[900] text-[11px] uppercase tracking-widest shadow-lg transition-all active:scale-95">Yeni Bölge</button>
                </div>
            </div>

            {showQuickAdd && (
                <div className="bg-[#020617]/40 border border-blue-500/20 rounded-[2.5rem] p-8 backdrop-blur-3xl space-y-6">
                    <input type="text" placeholder="Bölge ara..." value={quickSearch} onChange={e => setQuickSearch(e.target.value)} className={INPUT_CLS} />
                    <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-2 admin-scrollbar">
                        {quickFiltered.map((n, i) => (
                            <button key={i} onClick={() => toggleRegion(n)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${selectedFromPool.includes(n) ? 'bg-blue-500 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}>{n}</button>
                        ))}
                    </div>
                    {selectedFromPool.length > 0 && (
                        <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <span className="text-white text-xs font-bold">{selectedFromPool.length} Bölge Seçildi</span>
                            <button onClick={() => setIsAddRegionModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase">Fiyatlandır ve Ekle</button>
                        </div>
                    )}
                </div>
            )}

            <div className="bg-[#020617]/30 border border-white/[0.04] rounded-[2.5rem] p-5 shadow-xl backdrop-blur-2xl">
                <div className="flex flex-col lg:flex-row gap-5 items-center">
                    <div className="relative flex-1 w-full group">
                        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                        <input type="text" placeholder="Bölge veya açıklama ile akıllı arama..." value={regionSearch} onChange={e => setRegionSearch(e.target.value)} className="w-full pl-12 pr-5 py-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-[13px] text-white focus:border-[var(--color-primary)]/40 outline-none transition-all font-semibold" />
                    </div>
                    <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="bg-[#020617]/20 border border-white/[0.04] rounded-[2.5rem] p-20 text-center"><EmptyState icon="fa-map-location-dot" title="Bölge bulunamadı" description="Kriterlere uygun kayıt mevcut değil." /></div>
            ) : viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map(r => (
                        <SwipeableCard key={r.id} actions={[{ icon: 'fa-pen', label: 'Düz.', color: 'bg-blue-500', onClick: () => { setNewRegion(r); setEditingRegion(r); setIsAddRegionModalOpen(true); } }, { icon: 'fa-trash', label: 'Sil', color: 'bg-rose-500', onClick: () => confirmAction({ title: 'Sil', description: 'Emin misiniz?', type: 'danger', onConfirm: () => setEditContent({ ...editContent, regions: regions.filter(x => x.id !== r.id) }) }) }]}>
                            <div onClick={() => { setNewRegion(r); setEditingRegion(r); setIsAddRegionModalOpen(true); }} className="group p-6 bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] hover:border-[var(--color-primary)]/40 transition-all cursor-pointer relative overflow-hidden shadow-xl">
                                <div className="flex items-start gap-4 mb-6"><div className="w-20 h-16 rounded-2xl overflow-hidden border border-white/10 bg-black/40 shrink-0"><img src={r.image} className="w-full h-full object-cover" alt={r.name} /></div><div className="min-w-0 flex-1"><p className="font-[800] text-white text-[16px] truncate group-hover:text-[var(--color-primary)] transition-colors">{r.name}</p><p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Aktif</p></div></div>
                                <div className="flex items-center justify-between pt-5 border-t border-white/[0.04]"><i className={`fa-solid ${r.icon} text-xs text-[var(--color-primary)]/70`}></i><span className="text-[20px] font-[900] text-white tracking-tighter">{editContent.currency?.symbol || '€'}{r.price}</span></div>
                            </div>
                        </SwipeableCard>
                    ))}
                </div>
            ) : (
                <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
                    <table className="w-full text-left">
                        <thead><tr className="bg-white/[0.02] border-b border-white/[0.04]"><th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Bölge</th><th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-right">Fiyat</th><th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-right">İşlemler</th></tr></thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filtered.map(r => (
                                <tr key={r.id} onClick={() => { setNewRegion(r); setEditingRegion(r); setIsAddRegionModalOpen(true); }} className="group hover:bg-white/[0.03] transition-all cursor-pointer">
                                    <td className="px-8 py-5"><div className="flex items-center gap-4"><div className="w-14 h-11 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-black/40 shadow-inner"><img src={r.image} className="w-full h-full object-cover" alt={r.name} /></div><p className="text-[14px] font-[800] text-white group-hover:text-[var(--color-primary)] transition-colors">{r.name}</p></div></td>
                                    <td className="px-6 py-5 text-right"><span className="text-[18px] font-[900] text-white tracking-tighter">{editContent.currency?.symbol || '€'}{r.price}</span></td>
                                    <td className="px-8 py-5 text-right" onClick={e => e.stopPropagation()}><div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0"><button onClick={() => { setNewRegion(r); setEditingRegion(r); setIsAddRegionModalOpen(true); }} className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-lg"><i className="fa-solid fa-pen text-xs"></i></button><button onClick={() => confirmAction({ title: 'Sil', description: 'Emin misiniz?', type: 'danger', onConfirm: () => setEditContent({ ...editContent, regions: regions.filter(x => x.id !== r.id) }) })} className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shadow-lg"><i className="fa-solid fa-trash-can text-xs"></i></button></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isAddRegionModalOpen && (
                <div className="fixed inset-0 z-[210]">
                    <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md animate-in fade-in" onClick={() => setIsAddRegionModalOpen(false)} />
                    <div className="absolute right-0 top-0 h-full w-full max-w-[500px] bg-[#06080F] border-l border-white/[0.08] shadow-2xl animate-in slide-in-from-right flex flex-col">
                        <div className="px-8 py-6 border-b border-white/[0.05] flex items-center justify-between"><div><h3 className="text-lg font-[900] text-white tracking-tight">{editingRegion ? 'Düzenle' : 'Yeni Ekle'}</h3></div><button onClick={() => setIsAddRegionModalOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 hover:text-white flex items-center justify-center"><i className="fa-solid fa-xmark"></i></button></div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div><label className={LABEL_CLS}>BÖLGE ADI</label><input className={INPUT_CLS} value={newRegion.name} onChange={e => setNewRegion({ ...newRegion, name: e.target.value })} /></div>
                            <div><label className={LABEL_CLS}>FİYAT ({editContent.currency?.symbol || '€'})</label><input type="number" className={INPUT_CLS} value={newRegion.price || ''} onChange={e => setNewRegion({ ...newRegion, price: parseInt(e.target.value) || 0 })} /></div>
                            <div><label className={LABEL_CLS}>GÖRSEL URL</label><input className={INPUT_CLS} value={newRegion.image} onChange={e => setNewRegion({ ...newRegion, image: e.target.value })} /></div>
                        </div>
                        <div className="p-8 border-t border-white/[0.05] flex gap-4"><button onClick={handleSave} className="flex-1 py-4 bg-[var(--color-primary)] text-[#06080F] rounded-2xl font-black text-xs tracking-widest uppercase">KAYDET</button></div>
                    </div>
                </div>
            )}
        </div>
    );
};
