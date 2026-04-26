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

    const LABEL_CLS = 'block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1';
    const INPUT_CLS = 'w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm text-slate-900 font-bold focus:bg-white focus:border-gold/40 outline-none transition-all placeholder:text-slate-300';

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-6">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-100 flex items-center justify-center group transition-transform duration-500 hover:scale-105 shadow-sm shadow-teal-100/50">
                        <i className="fa-solid fa-map-location-dot text-teal-600 text-2xl"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Bölge & Fiyat</h2>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Destinations</span>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium">Toplam <span className="text-slate-900 font-bold">{regions.length}</span> aktif bölge yönetiliyor</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowQuickAdd(!showQuickAdd)} className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border shadow-sm ${showQuickAdd ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-100 text-slate-400 hover:text-slate-900'}`}>Hızlı Seçim</button>
                    <button onClick={() => { setEditingRegion(null); setIsAddRegionModalOpen(true); }} className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">Bölge Ekle</button>
                </div>
            </div>

            {/* Quick Add Pool */}
            {showQuickAdd && (
                <div className="bg-white border border-indigo-100 rounded-[2.5rem] p-8 shadow-xl shadow-indigo-100/20 space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Bölge Havuzu</h3>
                        <p className="text-[11px] text-slate-400 font-medium">Sık kullanılan bölgeleri hızlıca ekleyin</p>
                    </div>
                    <input type="text" placeholder="Hızlı ara..." value={quickSearch} onChange={e => setQuickSearch(e.target.value)} className={INPUT_CLS} />
                    <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-2 admin-scrollbar">
                        {quickFiltered.map((n, i) => (
                            <button key={i} onClick={() => toggleRegion(n)} className={`px-4 py-2 rounded-xl text-[11px] font-bold border transition-all ${selectedFromPool.includes(n) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}>{n}</button>
                        ))}
                    </div>
                    {selectedFromPool.length > 0 && (
                        <div className="flex items-center justify-between p-5 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in zoom-in-95">
                            <span className="text-indigo-900 text-sm font-black uppercase tracking-widest">{selectedFromPool.length} BÖLGE SEÇİLDİ</span>
                            <button onClick={() => setIsAddRegionModalOpen(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">Fiyatlandır ve Ekle</button>
                        </div>
                    )}
                </div>
            )}

            {/* Toolbar */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-5 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-5 items-center">
                    <div className="relative flex-1 w-full group">
                        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs transition-colors group-focus-within:text-gold"></i>
                        <input type="text" placeholder="Bölge ismi ile ara..." value={regionSearch} onChange={e => setRegionSearch(e.target.value)} className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] text-slate-900 font-bold focus:bg-white focus:border-gold/40 outline-none transition-all placeholder:text-slate-300" />
                    </div>
                    <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                </div>
            </div>

            {/* Grid/Table */}
            {filtered.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-20 text-center shadow-sm"><EmptyState icon="fa-map-location-dot" title="Bölge bulunamadı" description="Kriterlere uygun kayıt mevcut değil." /></div>
            ) : viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map(r => (
                        <SwipeableCard key={r.id} actions={[{ icon: 'fa-pen', label: 'Düz.', color: 'bg-blue-500', onClick: () => { setNewRegion(r); setEditingRegion(r); setIsAddRegionModalOpen(true); } }, { icon: 'fa-trash', label: 'Sil', color: 'bg-rose-500', onClick: () => confirmAction({ title: 'Bölgeyi Sil', description: `${r.name} bölgesini silmek istediğinize emin misiniz?`, type: 'danger', onConfirm: () => setEditContent({ ...editContent, regions: regions.filter(x => x.id !== r.id) }) }) }]}>
                            <div onClick={() => { setNewRegion(r); setEditingRegion(r); setIsAddRegionModalOpen(true); }} className="group p-6 bg-white border border-slate-100 rounded-[2.5rem] hover:border-gold/40 hover:shadow-xl transition-all duration-500 cursor-pointer relative overflow-hidden shadow-sm">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-20 h-16 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0 shadow-inner"><img src={r.image || 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={r.name} /></div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-black text-slate-900 text-[16px] truncate group-hover:text-gold transition-colors duration-300">{r.name}</p>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Aktif Bölge</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-gold/10 flex items-center justify-center text-gold"><i className={`fa-solid ${r.icon} text-[10px]`}></i></div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Başlangıç</span>
                                    </div>
                                    <span className="text-[20px] font-black text-slate-900 tracking-tighter tabular-nums">{editContent.currency?.symbol || '€'}{r.price}</span>
                                </div>
                            </div>
                        </SwipeableCard>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead><tr className="bg-slate-50/50 border-b border-slate-100"><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bölge / Görsel</th><th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Fiyat</th><th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th></tr></thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(r => (
                                <tr key={r.id} onClick={() => { setNewRegion(r); setEditingRegion(r); setIsAddRegionModalOpen(true); }} className="group hover:bg-slate-50 transition-all duration-300 cursor-pointer">
                                    <td className="px-8 py-5"><div className="flex items-center gap-5"><div className="w-16 h-11 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0"><img src={r.image || 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover" alt={r.name} /></div><p className="text-[14px] font-bold text-slate-900 group-hover:text-gold transition-colors">{r.name}</p></div></td>
                                    <td className="px-6 py-5 text-right"><span className="text-[18px] font-black text-slate-900 tracking-tighter tabular-nums">{editContent.currency?.symbol || '€'}{r.price}</span></td>
                                    <td className="px-8 py-5 text-right" onClick={e => e.stopPropagation()}><div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0"><button onClick={() => { setNewRegion(r); setEditingRegion(r); setIsAddRegionModalOpen(true); }} className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"><i className="fa-solid fa-pen text-xs"></i></button><button onClick={() => confirmAction({ title: 'Bölgeyi Sil', description: 'Bu bölgeyi silmek istediğinize emin misiniz?', type: 'danger', onConfirm: () => setEditContent({ ...editContent, regions: regions.filter(x => x.id !== r.id) }) })} className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm"><i className="fa-solid fa-trash-can text-xs"></i></button></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isAddRegionModalOpen && (
                <div className="fixed inset-0 z-[210]">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsAddRegionModalOpen(false)} />
                    <div className="absolute right-0 top-0 h-full w-full max-w-[500px] bg-white border-l border-slate-100 shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between shrink-0">
                            <div><h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">{editingRegion ? 'Bölgeyi Düzenle' : 'Yeni Bölge Ekle'}</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Konum & Fiyatlandırma</p></div>
                            <button onClick={() => setIsAddRegionModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-50 text-slate-400 flex items-center justify-center transition-all"><i className="fa-solid fa-xmark text-lg"></i></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
                            <div className="space-y-4">
                                <div><label className={LABEL_CLS}>Bölge Adı</label><input className={INPUT_CLS} value={newRegion.name} onChange={e => setNewRegion({ ...newRegion, name: e.target.value })} placeholder="Örn: Antalya Merkez" /></div>
                                <div><label className={LABEL_CLS}>Transfer Ücreti ({editContent.currency?.symbol || '€'})</label><input type="number" className={INPUT_CLS} value={newRegion.price || ''} onChange={e => setNewRegion({ ...newRegion, price: parseInt(e.target.value) || 0 })} placeholder="0.00" /></div>
                            </div>
                            <div className="space-y-4">
                                <label className={LABEL_CLS}>Kapak Görseli</label>
                                <div className="space-y-4">
                                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-100 bg-white shadow-xl shadow-slate-200/50 group/img">
                                        {newRegion.image ? (
                                            <>
                                                <img src={newRegion.image} className="w-full h-full object-cover" alt="Bölge" />
                                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button onClick={() => setNewRegion({ ...newRegion, image: '' })} className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xl hover:bg-rose-700 transition-all active:scale-90"><i className="fa-solid fa-trash-can text-lg"></i></button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-300">
                                                <div className="w-16 h-16 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center"><i className="fa-solid fa-image text-2xl"></i></div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Görsel Seçilmedi</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <label className="flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] cursor-pointer transition-all hover:bg-slate-800 active:scale-95 shadow-xl shadow-slate-200">
                                            <i className="fa-solid fa-cloud-arrow-up text-gold"></i> GÖRSEL YÜKLE
                                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                                                const f = e.target.files?.[0];
                                                if (f) { const r = new FileReader(); r.onload = ev => setNewRegion({ ...newRegion, image: ev.target?.result as string }); r.readAsDataURL(f); }
                                            }} />
                                        </label>
                                        <div className="relative">
                                            <i className="fa-solid fa-link absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-[10px]"></i>
                                            <input className="w-full bg-white border border-slate-100 rounded-2xl pl-10 pr-4 py-3 text-[11px] text-slate-500 font-bold outline-none focus:border-gold/40 transition-all shadow-sm" value={newRegion.image?.startsWith('data:') ? 'Dosyadan yüklendi' : newRegion.image} onChange={e => setNewRegion({ ...newRegion, image: e.target.value })} placeholder="Veya görsel URL adresi girin..." />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 border-t border-slate-50 bg-white shrink-0 flex gap-4">
                            <button onClick={() => setIsAddRegionModalOpen(false)} className="flex-1 py-4 text-slate-400 hover:text-slate-900 font-black text-xs tracking-widest transition-all">İPTAL</button>
                            <button onClick={handleSave} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-95 uppercase">BÖLGEYİ KAYDET</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
