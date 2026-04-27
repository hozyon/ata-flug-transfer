import React, { useState } from 'react';
import { SiteContent, Region } from '../../../types';
import { SCRAPED_REGIONS } from '../../../constants';
import { useViewMode } from '../../../hooks/useViewMode';
import { MobileViewToggle } from '../MobileViewToggle';
import { SwipeableCard } from '../SwipeableCard';
import { EmptyState } from '../EmptyState';

interface RegionsViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    showToast: (msg: string, type?: string) => void;
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
    const filtered = regions.filter(r => !regionSearch || r.name.toLowerCase().includes(regionSearch.toLowerCase()));

    const allRegionNames = Array.from(new Set([...SCRAPED_REGIONS.map(r => r.name), ...regions.map(r => r.name)]));
    const quickFiltered = quickSearch ? allRegionNames.filter(n => n.toLowerCase().includes(quickSearch.toLowerCase())) : allRegionNames;

    const handleSave = () => {
        if (editingRegion) { setEditContent({ ...editContent, regions: regions.map(r => r.id === editingRegion.id ? { ...newRegion } : r) }); showToast('Bölge güncellendi'); }
        else if (selectedFromPool.length > 0) { const added = selectedFromPool.map(n => ({ id: crypto.randomUUID(), name: n, desc: '', image: '', icon: 'fa-location-dot', price: 0 })); setEditContent({ ...editContent, regions: [...regions, ...added] }); setSelectedFromPool([]); showToast('Bölgeler eklendi'); }
        else { setEditContent({ ...editContent, regions: [...regions, { ...newRegion, id: crypto.randomUUID() }] }); showToast('Bölge eklendi'); }
        setIsAddRegionModalOpen(false);
    };

    const INPUT_CLS = 'w-full bg-white/40 backdrop-blur-xl border border-white rounded-[2rem] px-8 py-4 text-sm font-bold text-slate-900 placeholder-slate-300 focus:bg-white focus:shadow-xl transition-all duration-500 outline-none shadow-sm';
    const LABEL_CLS = 'block text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3 ml-2';

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000 ease-out">
            <div className="admin-glass-panel rounded-[3rem] p-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-sm transition-transform hover:scale-105 duration-500"><i className="fa-solid fa-map-location-dot text-xl"></i></div>
                    <div><h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Bölge & Fiyatlandırma</h2><p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.25em] mt-2">COĞRAFİ OPERASYON HATTI</p></div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowQuickAdd(!showQuickAdd)} className={`px-6 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border ${showQuickAdd ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-white border-white/60 text-slate-400 hover:text-slate-900 shadow-sm'}`}>Hızlı Seçim</button>
                    <button onClick={() => { setEditingRegion(null); setIsAddRegionModalOpen(true); }} className="px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95 flex items-center gap-3"><i className="fa-solid fa-plus text-[10px]"></i> Bölge Ekle</button>
                </div>
            </div>

            {showQuickAdd && (
                <div className="admin-glass-panel rounded-[4rem] p-10 shadow-2xl animate-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center justify-between mb-8"><h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Bölge Kütüphanesi</h3><p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">SIK KULLANILAN KONUMLAR</p></div>
                    <input type="text" placeholder="Hızlı filtrele..." value={quickSearch} onChange={e => setQuickSearch(e.target.value)} className={INPUT_CLS} />
                    <div className="flex flex-wrap gap-3 mt-8 max-h-80 overflow-y-auto pr-2 admin-scrollbar">
                        {quickFiltered.map((n, i) => (
                            <button key={i} onClick={() => setSelectedFromPool(p => p.includes(n) ? p.filter(x => x !== n) : [...p, n])} className={`px-5 py-2.5 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all duration-500 border shadow-sm ${selectedFromPool.includes(n) ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105' : 'bg-white/60 border-white text-slate-400 hover:text-slate-900 hover:bg-white'}`}>{n}</button>
                        ))}
                    </div>
                    {selectedFromPool.length > 0 && (
                        <div className="mt-10 flex items-center justify-between p-6 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 animate-in zoom-in-95 duration-500 shadow-inner">
                            <span className="text-indigo-900 text-[11px] font-black uppercase tracking-[0.3em]">{selectedFromPool.length} KONUM SEÇİLDİ</span>
                            <button onClick={() => setIsAddRegionModalOpen(true)} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all">SEÇİLENLERİ AKTAR</button>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full group">
                    <i className="fa-solid fa-magnifying-glass absolute left-7 top-1/2 -translate-y-1/2 text-slate-300 text-sm transition-colors group-focus-within:text-gold"></i>
                    <input type="text" placeholder="Bölge ismi ile ara..." value={regionSearch} onChange={e => setRegionSearch(e.target.value)} className="w-full pl-16 pr-8 py-5 bg-white/40 backdrop-blur-xl border border-white rounded-[2.5rem] text-[15px] font-bold text-slate-900 placeholder-slate-300 shadow-sm focus:bg-white focus:shadow-xl transition-all duration-500 outline-none" />
                </div>
                <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
            </div>

            {filtered.length === 0 ? (
                <div className="admin-glass-panel rounded-[4rem] p-32 text-center shadow-sm"><EmptyState icon="fa-map-location-dot" title="Bölge Bulunamadı" description="Yeni bir bölge ekleyerek operasyonu genişletin." /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filtered.map((r, idx) => (
                        <SwipeableCard key={r.id} actions={[{ icon: 'fa-pen', label: 'Düz.', color: 'bg-blue-500', onClick: () => { setNewRegion(r); setEditingRegion(r); setIsAddRegionModalOpen(true); } }, { icon: 'fa-trash', label: 'Sil', color: 'bg-rose-500', onClick: () => confirmAction({ title: 'Bölgeyi Sil', description: `${r.name} kalıcı olarak silinecektir.`, type: 'danger', onConfirm: () => setEditContent({ ...editContent, regions: regions.filter(x => x.id !== r.id) }) }) }]}>
                            <div onClick={() => { setNewRegion(r); setEditingRegion(r); setIsAddRegionModalOpen(true); }} className="admin-glass-panel rounded-[3.5rem] p-8 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-1000 cursor-pointer group relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 shadow-sm" style={{ animationDelay: `${idx * 80}ms` }}>
                                <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-white bg-slate-50 mb-8 relative shadow-inner"><img src={r.image || 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={r.name} /></div>
                                <h3 className="text-2xl font-black text-slate-900 group-hover:text-gold transition-colors tracking-tight mb-8 truncate">{r.name}</h3>
                                <div className="flex items-center justify-between pt-6 border-t border-white/40">
                                    <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-lg bg-gold/10 flex items-center justify-center text-gold shadow-sm"><i className={`fa-solid ${r.icon} text-[10px]`}></i></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BAŞLANGIÇ</span></div>
                                    <span className="text-[22px] font-black text-slate-900 tracking-tighter tabular-nums">{editContent.currency?.symbol || '€'}{r.price}</span>
                                </div>
                            </div>
                        </SwipeableCard>
                    ))}
                </div>
            )}

            {isAddRegionModalOpen && (
                <div className="fixed inset-0 z-[210]">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-500" onClick={() => setIsAddRegionModalOpen(false)} />
                    <div className="absolute right-6 top-6 bottom-6 w-full max-w-[540px] bg-white/80 backdrop-blur-3xl rounded-[4rem] border border-white shadow-2xl animate-in slide-in-from-right-8 duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] flex flex-col overflow-hidden">
                        <div className="px-12 py-8 border-b border-white/40 flex items-center justify-between shrink-0">
                            <div><h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{editingRegion ? 'Bölgeyi Düzenle' : 'Yeni Bölge Ekle'}</h3><p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2">KONUM & FİYAT EDİTÖRÜ</p></div>
                            <button onClick={() => setIsAddRegionModalOpen(false)} className="w-14 h-14 rounded-full bg-white border border-slate-100 shadow-sm hover:bg-slate-50 text-slate-400 flex items-center justify-center transition-all active:scale-90"><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>
                        <div className="flex-1 overflow-y-auto admin-scrollbar p-12 space-y-12 bg-slate-50/30">
                            <div className="space-y-6"><div><label className={LABEL_CLS}>BÖLGE ADI</label><input className={INPUT_CLS} value={newRegion.name} onChange={e => setNewRegion({ ...newRegion, name: e.target.value })} placeholder="Örn: Antalya Havalimanı" /></div><div><label className={LABEL_CLS}>NET ÜCRET ({editContent.currency?.symbol || '€'})</label><input type="number" className={INPUT_CLS} value={newRegion.price || ''} onChange={e => setNewRegion({ ...newRegion, price: parseInt(e.target.value) || 0 })} placeholder="0.00" /></div></div>
                            <div className="space-y-6"><label className={LABEL_CLS}>BÖLGE TANITIM GÖRSELİ</label>
                                <div className="space-y-6"><div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white bg-white shadow-2xl shadow-slate-200/50 group/img">{newRegion.image ? (<><img src={newRegion.image} className="w-full h-full object-cover" alt="Bölge" /><div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"><button onClick={() => setNewRegion({ ...newRegion, image: '' })} className="w-14 h-14 rounded-[1.5rem] bg-rose-600 text-white flex items-center justify-center shadow-xl hover:bg-rose-700 transition-all active:scale-90"><i className="fa-solid fa-trash-can text-lg"></i></button></div></>) : (<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-300"><div className="w-20 h-20 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center shadow-inner"><i className="fa-solid fa-image text-3xl"></i></div><p className="text-[10px] font-black uppercase tracking-[0.3em]">GÖRSEL SEÇİLMEDİ</p></div>)}</div><label className="flex items-center justify-center gap-4 py-5 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] cursor-pointer transition-all hover:bg-black active:scale-95 shadow-2xl shadow-slate-200"><i className="fa-solid fa-cloud-arrow-up text-gold text-lg"></i> YEREL DOSYA YÜKLE<input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = ev => setNewRegion({ ...newRegion, image: ev.target?.result as string }); r.readAsDataURL(f); } }} /></label></div>
                            </div>
                        </div>
                        <div className="px-12 py-10 border-t border-white/40 flex justify-end gap-6 shrink-0 bg-white/20 backdrop-blur-md">
                            <button onClick={() => setIsAddRegionModalOpen(false)} className="px-10 py-5 text-slate-400 hover:text-slate-900 font-black text-[11px] uppercase tracking-widest transition-all">İPTAL ET</button>
                            <button onClick={handleSave} className="px-20 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all active:scale-95">BÖLGEYİ KAYDET</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
