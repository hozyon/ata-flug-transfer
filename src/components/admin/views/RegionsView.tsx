import React, { useState } from 'react';
import { SiteContent, Region } from '../../../types';
import { SCRAPED_REGIONS } from '../../../constants';
import { useAppStore } from '../../../store/useAppStore';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';
import { useViewMode } from '../../../hooks/useViewMode';
import { MobileViewToggle } from '../MobileViewToggle';
import { SwipeableCard } from '../SwipeableCard';
import { EmptyState } from '../EmptyState';
import { haptic } from '../../../utils/haptic';

interface RegionsViewProps {
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
    showToast: (msg: string, type: 'success' | 'delete') => void;
    moveItem: <T>(list: T[], index: number, direction: 'up' | 'down') => T[];
    isDarkTheme: boolean;
}

export const RegionsView: React.FC<RegionsViewProps> = ({
    editContent, setEditContent, showToast, moveItem
}) => {
    const { bookings } = useAppStore();
    const [regionSearch, setRegionSearch] = useState('');
    const [quickSearch, setQuickSearch] = useState('');
    const [isAddRegionModalOpen, setIsAddRegionModalOpen] = useState(false);
    const [editingRegion, setEditingRegion] = useState<Region | null>(null);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
    const [editingPriceValue, setEditingPriceValue] = useState<string>('');
    const [newRegion, setNewRegion] = useState<Region>({
        id: '', name: '', desc: '',
        image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800',
        icon: 'fa-location-dot', price: 50
    });

    const { viewMode, toggleViewMode } = useViewMode();
    const regions = editContent.regions || [];
    const prices = regions.map(r => r.price || 0).filter(p => p > 0);
    const avg = prices.length > 0 ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : 0;

    const filtered = regionSearch
        ? regions.filter(r => r.name.toLowerCase().includes(regionSearch.toLowerCase()) || (r.desc || '').toLowerCase().includes(regionSearch.toLowerCase()))
        : regions;

    const { getDragProps, getRowClassName, isDragging } = useDragAndDrop(
        regions,
        (newRegions) => setEditContent({ ...editContent, regions: newRegions })
    );

    // Quick Add: merged & sorted region list
    const allRegionNames = Array.from(new Set([...SCRAPED_REGIONS.map(r => r.name), ...regions.map(r => r.name)]));
    const sortedNames = allRegionNames.sort((a, b) => {
        if (a === 'Antalya Havalimanı') return -1;
        if (b === 'Antalya Havalimanı') return 1;
        return a.localeCompare(b, 'tr');
    });
    const quickFiltered = quickSearch
        ? sortedNames.filter(n => n.toLowerCase().includes(quickSearch.toLowerCase()))
        : sortedNames;

    const toggleRegion = (regionName: string) => {
        const isAdded = regions.some(r => r.name === regionName);
        if (!isAdded) {
            const scraped = SCRAPED_REGIONS.find(r => r.name === regionName);
            const newR: Region = {
                id: regionName.toLowerCase().replace(/\s+/g, '-').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c'),
                name: regionName,
                desc: scraped?.desc || '',
                image: scraped?.image || 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=600',
                icon: 'fa-location-dot', price: 50
            };
            setEditContent({ ...editContent, regions: [...regions, newR] });
            showToast(`${regionName} eklendi`, 'success');
        } else {
            setEditContent({ ...editContent, regions: regions.filter(r => r.name !== regionName) });
            showToast(`${regionName} kaldırıldı`, 'delete');
        }
    };

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Aktif Bölge', value: regions.length, icon: 'fa-map-location-dot', iconBg: 'bg-emerald-500', gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/15' },
                    { label: 'Hazır Bölge', value: SCRAPED_REGIONS.length, icon: 'fa-globe', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
                    { label: 'Ort. Fiyat', value: `${editContent.currency?.symbol || '€'}${avg}`, icon: 'fa-chart-line', iconBg: 'bg-amber-500', gradient: 'from-amber-500/15 to-orange-600/5', border: 'border-amber-500/15' },
                    { label: 'Fiyat Aralığı', value: prices.length > 0 ? `${editContent.currency?.symbol || '€'}${Math.min(...prices)}–${editContent.currency?.symbol || '€'}${Math.max(...prices)}` : '—', icon: 'fa-arrows-left-right', iconBg: 'bg-violet-500', gradient: 'from-violet-500/15 to-purple-600/5', border: 'border-violet-500/15' },
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

            {/* Quick Add Panel (Collapsible) */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                <button onClick={() => setShowQuickAdd(!showQuickAdd)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                            <i className="fa-solid fa-globe text-white text-sm"></i>
                        </div>
                        <div className="text-left">
                            <h3 className="text-sm font-bold text-white">Hazır Bölge Havuzu</h3>
                            <p className="text-[10px] text-slate-500">{SCRAPED_REGIONS.length} bölge mevcut · Tıklayarak ekle/kaldır</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-[10px] font-bold text-emerald-400">{regions.length} aktif</span>
                        </span>
                        <i className={`fa-solid fa-chevron-down text-slate-500 text-xs transition-transform duration-300 ${showQuickAdd ? 'rotate-180' : ''}`}></i>
                    </div>
                </button>

                {showQuickAdd && (
                    <div className="border-t border-white/[0.04] p-5 animate-in fade-in slide-in-from-top-2 duration-300">
                        {/* Quick Search */}
                        <div className="relative mb-4">
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                            <input type="text" placeholder="Bölge ara..." value={quickSearch} onChange={e => setQuickSearch(e.target.value)}
                                className="w-full sm:w-64 pl-9 pr-8 py-2.5 bg-white/5 border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:border-blue-500/50 outline-none transition-all" />
                            {quickSearch && <button onClick={() => setQuickSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><i className="fa-solid fa-xmark text-xs"></i></button>}
                        </div>
                        {/* Chips */}
                        <div className="flex flex-wrap gap-2">
                            {quickFiltered.map((name, idx) => {
                                const isAdded = regions.some(r => r.name === name);
                                return (
                                    <button key={idx} onClick={() => toggleRegion(name)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${isAdded
                                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400'
                                            : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400'
                                            }`}>
                                        {isAdded && <i className="fa-solid fa-check text-[8px]"></i>}
                                        {name}
                                    </button>
                                );
                            })}
                        </div>
                        {quickFiltered.length === 0 && (
                            <p className="text-center text-slate-600 text-sm py-4">"{quickSearch}" ile eşleşen bölge yok</p>
                        )}
                    </div>
                )}
            </div>

            {/* Active Regions Table */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-4">
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-check-double text-emerald-400 text-sm"></i>
                        <span className="text-sm font-bold text-white">Aktif Bölgeler</span>
                        <span className="text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-white/5 text-slate-400">{regions.length}</span>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
                        {/* Search */}
                        <div className="relative flex-[1_1_200px] w-full sm:w-56">
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                            <input type="text" placeholder="Bölge ara..." value={regionSearch} onChange={e => setRegionSearch(e.target.value)}
                                className="w-full pl-9 pr-8 py-2.5 bg-white/5 border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 outline-none transition-all" />
                            {regionSearch && <button onClick={() => setRegionSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><i className="fa-solid fa-xmark text-xs"></i></button>}
                        </div>
                        <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                        {/* Add Custom */}
                        <button onClick={() => { setNewRegion({ id: '', name: '', desc: '', image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800', icon: 'fa-location-dot', price: 50 }); setEditingRegion(null); setIsAddRegionModalOpen(true); }}
                            className="px-4 py-2.5 bg-[var(--color-primary)] hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0">
                            <i className="fa-solid fa-plus text-[10px]"></i> Yeni Bölge
                        </button>
                    </div>
                </div>

                {/* Table */}
                {filtered.length === 0 ? (
                    <EmptyState
                        icon="fa-map-location-dot"
                        title={regionSearch ? `"${regionSearch}" ile eşleşen bölge yok` : 'Henüz aktif bölge yok'}
                        description={regionSearch ? undefined : 'Yukarıdaki hazır bölge havuzundan bölge ekleyin'}
                        action={regionSearch ? { label: 'Aramayı Temizle', onClick: () => setRegionSearch('') } : undefined}
                    />
                ) : viewMode === 'card' ? (
                    /* ── MOBILE CARD VIEW ── */
                    <div className="p-3 space-y-3">
                        {filtered.map((region) => {
                            const realIndex = regions.findIndex(r => r.id === region.id);
                            return (
                                <SwipeableCard key={region.id} actions={[
                                    { icon: 'fa-pen', label: 'Düzenle', color: 'bg-blue-500', onClick: () => { setNewRegion(region); setEditingRegion(region); setIsAddRegionModalOpen(true); } },
                                    { icon: 'fa-trash', label: 'Sil', color: 'bg-red-500', onClick: () => { const bookingsUsingRegion = bookings.filter(b => b.destination === region.name || b.pickup === region.name); if (bookingsUsingRegion.length > 0) { if (!confirm(`Bu bölge ${bookingsUsingRegion.length} rezervasyonda kullanılıyor. Yine de silmek istiyor musunuz?`)) return; } else { if (!confirm('Bu bölgeyi silmek istediğinize emin misiniz?')) return; } setEditContent({ ...editContent, regions: regions.filter(r => r.id !== region.id) }); showToast('Bölge silindi', 'delete'); } },
                                ]}>
                                    <div className="p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-16 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-black/20">
                                                <img src={region.image} className="w-full h-full object-cover" alt={region.name} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-bold text-white text-sm truncate">{region.name}</p>
                                                    {region.price ? (
                                                        <span className="text-lg font-black text-[var(--color-primary)] shrink-0 ml-2">{editContent.currency?.symbol || '€'}{region.price}</span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-amber-400 shrink-0 ml-2 flex items-center gap-1"><i className="fa-solid fa-triangle-exclamation text-[8px]" />Fiyat yok</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{region.desc || 'Açıklama yok'}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[9px] font-bold text-slate-500">#{realIndex + 1}</span>
                                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                                        <span className="text-[9px] font-bold text-emerald-400">Aktif</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Quick Actions */}
                                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/[0.04]">
                                            <button onClick={() => { const n = moveItem(regions, realIndex, 'up'); setEditContent({ ...editContent, regions: n }); }} disabled={realIndex === 0}
                                                className="w-8 h-8 rounded-lg bg-white/5 text-slate-500 active:bg-white/10 disabled:opacity-20 flex items-center justify-center transition-all">
                                                <i className="fa-solid fa-chevron-up text-[10px]"></i>
                                            </button>
                                            <button onClick={() => { const n = moveItem(regions, realIndex, 'down'); setEditContent({ ...editContent, regions: n }); }} disabled={realIndex === regions.length - 1}
                                                className="w-8 h-8 rounded-lg bg-white/5 text-slate-500 active:bg-white/10 disabled:opacity-20 flex items-center justify-center transition-all">
                                                <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                            </button>
                                            <div className="flex-1"></div>
                                            <button onClick={() => { haptic.tap(); setNewRegion(region); setEditingRegion(region); setIsAddRegionModalOpen(true); }}
                                                className="px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold flex items-center gap-1.5 active:bg-blue-500/20 transition-all">
                                                <i className="fa-solid fa-pen text-[10px]"></i>Düzenle
                                            </button>
                                            <button onClick={() => { const bookingsUsingRegion = bookings.filter(b => b.destination === region.name || b.pickup === region.name); if (bookingsUsingRegion.length > 0) { if (!confirm(`Bu bölge ${bookingsUsingRegion.length} rezervasyonda kullanılıyor. Yine de silmek istiyor musunuz?`)) return; } else { if (!confirm('Bu bölgeyi silmek istediğinize emin misiniz?')) return; } haptic.error(); setEditContent({ ...editContent, regions: regions.filter(r => r.id !== region.id) }); showToast('Bölge silindi', 'delete'); }}
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
                                    <th className="text-left px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bölge</span></th>
                                    <th className="text-right px-3 py-3 w-28"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fiyat</span></th>
                                    <th className="text-center px-3 py-3 w-20 hidden md:table-cell"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Durum</span></th>
                                    <th className="w-32 px-3 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((region, index) => {
                                    const realIndex = regions.findIndex(r => r.id === region.id);
                                    const dragProps = !regionSearch ? getDragProps(realIndex) : {};
                                    return (
                                        <tr key={region.id} {...dragProps}
                                            className={`border-b border-white/[0.03] hover:bg-white/[0.03] transition-all group ${!regionSearch ? 'cursor-grab active:cursor-grabbing' : ''} ${getRowClassName(realIndex)}`}>
                                            <td className="px-2 py-3.5">
                                                {!regionSearch && (
                                                    <div className="flex items-center justify-center text-slate-600 hover:text-slate-300 transition-colors">
                                                        <i className="fa-solid fa-grip-vertical text-[10px]"></i>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                                                    <span className="text-[10px] font-mono font-bold text-slate-500">{realIndex + 1}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-9 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black/20">
                                                        <img src={region.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={region.name} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-white text-[13px] group-hover:text-[var(--color-primary)] transition-colors truncate max-w-[250px]">{region.name}</p>
                                                        <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[200px]">{region.desc || 'Açıklama yok'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5 text-right">
                                                <div className="inline-flex items-center gap-1">
                                                    {!region.price && editingPriceId !== region.id && (
                                                        <i className="fa-solid fa-triangle-exclamation text-amber-400 text-[9px] mr-1" title="Fiyat girilmemiş" />
                                                    )}
                                                    {(region.price || editingPriceId === region.id) && (
                                                        <span className="text-[var(--color-primary)] font-bold text-sm">{editContent.currency?.symbol || '€'}</span>
                                                    )}
                                                    <input
                                                        type="number"
                                                        placeholder="—"
                                                        value={editingPriceId === region.id ? editingPriceValue : (region.price || '')}
                                                        onFocus={() => { setEditingPriceId(region.id); setEditingPriceValue(region.price ? String(region.price) : ''); }}
                                                        onChange={e => setEditingPriceValue(e.target.value)}
                                                        onBlur={() => {
                                                            const parsed = editingPriceValue.trim() !== '' ? parseInt(editingPriceValue) : undefined;
                                                            const n = [...regions];
                                                            n[realIndex] = { ...n[realIndex], price: parsed };
                                                            setEditContent({ ...editContent, regions: n });
                                                            setEditingPriceId(null);
                                                        }}
                                                        className="w-14 bg-transparent text-right text-sm font-black text-white outline-none focus:text-[var(--color-primary)] transition-colors placeholder-slate-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5 text-center hidden md:table-cell">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                                    <span className="text-[10px] font-bold text-emerald-400">Aktif</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                                    <button onClick={() => { const n = moveItem(regions, realIndex, 'up'); setEditContent({ ...editContent, regions: n }); }} disabled={realIndex === 0}
                                                        className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white disabled:opacity-20 flex items-center justify-center transition-all">
                                                        <i className="fa-solid fa-chevron-up text-[10px]"></i>
                                                    </button>
                                                    <button onClick={() => { const n = moveItem(regions, realIndex, 'down'); setEditContent({ ...editContent, regions: n }); }} disabled={realIndex === regions.length - 1}
                                                        className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white disabled:opacity-20 flex items-center justify-center transition-all">
                                                        <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                                    </button>
                                                    <button onClick={() => { setNewRegion(region); setEditingRegion(region); setIsAddRegionModalOpen(true); }}
                                                        className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all">
                                                        <i className="fa-solid fa-pen text-[10px]"></i>
                                                    </button>
                                                    <button onClick={() => { const bookingsUsingRegion = bookings.filter(b => b.destination === region.name || b.pickup === region.name); if (bookingsUsingRegion.length > 0) { if (!confirm(`Bu bölge ${bookingsUsingRegion.length} rezervasyonda kullanılıyor. Yine de silmek istiyor musunuz?`)) return; } else { if (!confirm('Bu bölgeyi silmek istediğinize emin misiniz?')) return; } setEditContent({ ...editContent, regions: regions.filter(r => r.id !== region.id) }); showToast('Bölge silindi', 'delete'); }}
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

            {/* Region Drawer */}
            {isAddRegionModalOpen && (
                <div className="fixed inset-0 z-[210]">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddRegionModalOpen(false)} />
                    <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 shadow-2xl animate-in slide-in-from-right duration-300 border-l border-white/10 flex flex-col">
                        {/* Header */}
                        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl ${editingRegion ? 'bg-blue-500' : 'bg-emerald-500'} flex items-center justify-center text-white shadow-lg`}>
                                    <i className={`fa-solid ${editingRegion ? 'fa-pen' : 'fa-map-location-dot'} text-sm`}></i>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{editingRegion ? 'Bölgeyi Düzenle' : 'Yeni Bölge Ekle'}</h3>
                                    <p className="text-[10px] text-slate-500">{editingRegion ? 'Bilgileri güncelleyin' : 'Transfer bölgesi ekleyin'}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsAddRegionModalOpen(false)}
                                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto overscroll-y-contain p-6 space-y-5">
                            {/* Preview */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                    <i className="fa-solid fa-eye text-[8px] text-[var(--color-primary)]"></i> Önizleme
                                </label>
                                <div className="relative rounded-xl overflow-hidden border border-white/10">
                                    <div className="relative h-28">
                                        <img src={newRegion.image || 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                                        <div className="absolute bottom-2 left-3 right-3">
                                            <h4 className="text-white font-bold truncate">{newRegion.name || 'Bölge Adı'}</h4>
                                            <p className="text-slate-400 text-[10px] truncate">{newRegion.desc || 'Açıklama...'}</p>
                                        </div>
                                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                                            <span className="text-lg font-black text-[var(--color-primary)]">{editContent.currency?.symbol || '€'}{newRegion.price || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <i className="fa-solid fa-location-dot text-[8px] text-red-400"></i> Bölge Adı *
                                </label>
                                <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                                    value={newRegion.name} onChange={e => setNewRegion({ ...newRegion, name: e.target.value })} placeholder="Örn: Belek, Kundu, Lara..." />
                            </div>

                            {/* Price & Distance */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <i className="fa-solid fa-euro-sign text-[8px] text-[var(--color-primary)]"></i> Fiyat *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-[var(--color-primary)]">{editContent.currency?.symbol || '€'}</span>
                                        <input type="number" className="w-full bg-white/5 border border-white/[0.06] rounded-xl pl-9 pr-4 py-3 text-sm font-bold text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                                            value={newRegion.price} onChange={e => setNewRegion({ ...newRegion, price: parseInt(e.target.value) || 0 })} placeholder="50" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <i className="fa-solid fa-route text-[8px] text-blue-400"></i> Mesafe
                                    </label>
                                    <input type="number" className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                                        value={(newRegion as any).distance || ''} onChange={e => setNewRegion({ ...newRegion, distance: parseInt(e.target.value) || 0 } as any)} placeholder="km" />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <i className="fa-solid fa-align-left text-[8px] text-violet-400"></i> Açıklama
                                </label>
                                <textarea className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-300 focus:border-violet-500/50 outline-none resize-none transition-all" rows={3}
                                    value={newRegion.desc} onChange={e => setNewRegion({ ...newRegion, desc: e.target.value })} placeholder="Bölge hakkında kısa açıklama..." />
                            </div>

                            {/* Quick Images */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <i className="fa-solid fa-images text-[8px] text-pink-400"></i> Görsel Seç
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=400',
                                        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400',
                                        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400',
                                        'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=400',
                                        'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?auto=format&fit=crop&q=80&w=400',
                                        'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=400',
                                        'https://images.unsplash.com/photo-1476673160081-cf065607f449?auto=format&fit=crop&q=80&w=400',
                                        'https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&q=80&w=400',
                                    ].map((img, i) => (
                                        <button key={i} onClick={() => setNewRegion({ ...newRegion, image: img })}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${newRegion.image === img ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30 scale-105' : 'border-transparent hover:border-white/30'}`}>
                                            <img src={img} className="w-full h-full object-cover" alt="" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Upload & URL */}
                            <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 space-y-3">
                                <input type="file" id="region-drawer-upload" className="hidden" accept="image/*" onChange={e => {
                                    const f = e.target.files?.[0];
                                    if (f) { if (f.size > 2 * 1024 * 1024) { alert('Maks 2MB!'); return; } const r = new FileReader(); r.onloadend = () => setNewRegion({ ...newRegion, image: r.result as string }); r.readAsDataURL(f); }
                                }} />
                                <label htmlFor="region-drawer-upload" className="flex items-center justify-center gap-2 cursor-pointer py-2 rounded-lg hover:bg-white/5 transition-all">
                                    <i className="fa-solid fa-cloud-arrow-up text-slate-500"></i>
                                    <span className="text-sm font-medium text-slate-400">Kendi görselinizi yükleyin</span>
                                </label>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600 uppercase before:flex-1 before:h-px before:bg-white/[0.04] after:flex-1 after:h-px after:bg-white/[0.04]">veya URL</div>
                                <div className="relative">
                                    <i className="fa-solid fa-link absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                                    <input className="w-full bg-white/5 border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                                        value={newRegion.image} onChange={e => setNewRegion({ ...newRegion, image: e.target.value })} placeholder="https://..." />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/10 flex gap-3 shrink-0 bg-white/[0.02]">
                            <button onClick={() => {
                                if (!newRegion.name?.trim()) { alert('Lütfen bölge adını girin!'); return; }
                                if (editingRegion) {
                                    setEditContent({ ...editContent, regions: regions.map(r => r.id === editingRegion.id ? { ...r, ...newRegion } : r) });
                                    showToast('Bölge güncellendi', 'success');
                                } else {
                                    setEditContent({ ...editContent, regions: [...regions, { ...newRegion, id: Date.now().toString() }] });
                                    showToast('Yeni bölge eklendi', 'success');
                                }
                                setIsAddRegionModalOpen(false);
                            }}
                                className="flex-1 bg-[var(--color-primary)] hover:bg-amber-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all">
                                <i className="fa-solid fa-check"></i> {editingRegion ? 'Kaydet' : 'Ekle'}
                            </button>
                            <button onClick={() => setIsAddRegionModalOpen(false)}
                                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all">İptal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
