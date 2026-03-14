import React, { Dispatch, SetStateAction } from 'react';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';

interface HeroImagesViewProps {
    heroBackgrounds: string[];
    updateHeroBackgrounds: (newBackgrounds: string[]) => void;
    selectedHeroImages: number[];
    setSelectedHeroImages: Dispatch<SetStateAction<number[]>>;
}

export const HeroImagesView: React.FC<HeroImagesViewProps> = ({
    heroBackgrounds, updateHeroBackgrounds, selectedHeroImages, setSelectedHeroImages
}) => {
    const moveItem = (arr: any[], fromIndex: number, direction: 'up' | 'down') => {
        const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
        if (toIndex < 0 || toIndex >= arr.length) return arr;
        const newArr = [...arr];
        const item = newArr.splice(fromIndex, 1)[0];
        newArr.splice(toIndex, 0, item);
        return newArr;
    };

    const allSelected = heroBackgrounds.length > 0 && selectedHeroImages.length === heroBackgrounds.length;

    const { getDragProps, getRowClassName } = useDragAndDrop(
        heroBackgrounds,
        (newBgs) => updateHeroBackgrounds(newBgs)
    );

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Toplam Görsel', value: heroBackgrounds.length, icon: 'fa-images', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
                    { label: 'Boş Slot', value: Math.max(0, 5 - heroBackgrounds.length), icon: 'fa-plus-circle', iconBg: 'bg-emerald-500', gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/15' },
                    { label: 'Görünüm', value: 'Slider', icon: 'fa-tv', iconBg: 'bg-violet-500', gradient: 'from-violet-500/15 to-purple-600/5', border: 'border-violet-500/15' },
                    { label: 'Kapasite', value: `${heroBackgrounds.length}/5`, icon: 'fa-gauge-high', iconBg: 'bg-[var(--color-primary)]', gradient: 'from-[var(--color-primary)]/15 to-amber-600/5', border: 'border-[var(--color-primary)]/15' },
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
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-panorama text-[var(--color-primary)] text-sm"></i>
                            <span className="text-sm font-bold text-white">Slider Görselleri</span>
                            <span className="text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-white/5 text-slate-400">{heroBackgrounds.length}</span>
                        </div>

                        {selectedHeroImages.length > 0 && (
                            <div className="flex items-center gap-2 animate-in fade-in duration-200">
                                <span className="text-xs text-slate-400 font-medium">{selectedHeroImages.length} seçili</span>
                                <button onClick={() => { if (confirm(`${selectedHeroImages.length} görseli silmek istediğinize emin misiniz?`)) { updateHeroBackgrounds(heroBackgrounds.filter((_, idx) => !selectedHeroImages.includes(idx))); setSelectedHeroImages([]); } }}
                                    className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all">
                                    <i className="fa-solid fa-trash mr-1.5"></i>Sil
                                </button>
                            </div>
                        )}
                    </div>

                    {heroBackgrounds.length < 5 && (
                        <label className="sm:ml-auto px-4 py-2.5 bg-[var(--color-primary)] hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0">
                            <i className="fa-solid fa-cloud-arrow-up text-[10px]"></i> Görsel Yükle
                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) { const r = new FileReader(); r.onloadend = () => updateHeroBackgrounds([...heroBackgrounds, r.result as string]); r.readAsDataURL(file); }
                            }} />
                        </label>
                    )}
                </div>

                {/* Table */}
                {heroBackgrounds.length === 0 ? (
                    <div className="text-center py-16 border-t border-white/[0.04]">
                        <i className="fa-regular fa-image text-4xl text-slate-700 mb-3 block"></i>
                        <p className="text-slate-500 text-sm font-medium">Görsel bulunmuyor</p>
                        <p className="text-slate-600 text-xs mt-1">Yukarıdaki butona tıklayarak slider görseli ekleyin</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-b border-white/[0.04] bg-white/[0.02]">
                                    <th className="w-10 px-4 py-3">
                                        <input type="checkbox" checked={allSelected} onChange={() => { if (allSelected) setSelectedHeroImages([]); else setSelectedHeroImages(heroBackgrounds.map((_, i) => i)); }}
                                            className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#c5a059] cursor-pointer" />
                                    </th>
                                    <th className="w-10 px-2 py-3"></th>
                                    <th className="text-left px-3 py-3 w-12"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sıra</span></th>
                                    <th className="text-left px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Önizleme</span></th>
                                    <th className="text-left px-3 py-3 hidden md:table-cell"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bilgi</span></th>
                                    <th className="w-36 px-3 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {heroBackgrounds.map((img, idx) => {
                                    const isSelected = selectedHeroImages.includes(idx);
                                    return (
                                        <tr key={idx} {...getDragProps(idx)}
                                            className={`border-b border-white/[0.03] transition-all group cursor-grab active:cursor-grabbing ${isSelected ? 'bg-[var(--color-primary)]/[0.06]' : 'hover:bg-white/[0.03]'} ${getRowClassName(idx)}`}>
                                            <td className="px-4 py-3.5">
                                                <input type="checkbox" checked={isSelected}
                                                    onChange={e => { if (e.target.checked) setSelectedHeroImages([...selectedHeroImages, idx]); else setSelectedHeroImages(selectedHeroImages.filter(id => id !== idx)); }}
                                                    className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#c5a059] cursor-pointer" />
                                            </td>
                                            <td className="px-2 py-3.5">
                                                <div className="flex items-center justify-center text-slate-600 hover:text-slate-300 transition-colors">
                                                    <i className="fa-solid fa-grip-vertical text-[10px]"></i>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                                                    <span className="text-[10px] font-mono font-bold text-slate-500">{idx + 1}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <div className="w-32 h-20 sm:w-48 sm:h-28 rounded-xl overflow-hidden border border-white/10 bg-black/20">
                                                    <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={`Slider ${idx + 1}`} />
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5 hidden md:table-cell">
                                                <div>
                                                    <p className="font-bold text-white text-[13px] group-hover:text-[var(--color-primary)] transition-colors">Slider Görseli {idx + 1}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[200px]">{img.startsWith('data:') ? 'Yüklenen Dosya' : img.substring(0, 40) + '...'}</p>
                                                    {idx === 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/15 mt-1 inline-block">Varsayılan</span>}
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                                    <button onClick={() => updateHeroBackgrounds(moveItem(heroBackgrounds, idx, 'up'))} disabled={idx === 0}
                                                        className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white disabled:opacity-20 flex items-center justify-center transition-all">
                                                        <i className="fa-solid fa-chevron-up text-[10px]"></i>
                                                    </button>
                                                    <button onClick={() => updateHeroBackgrounds(moveItem(heroBackgrounds, idx, 'down'))} disabled={idx === heroBackgrounds.length - 1}
                                                        className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white disabled:opacity-20 flex items-center justify-center transition-all">
                                                        <i className="fa-solid fa-chevron-down text-[10px]"></i>
                                                    </button>
                                                    <label className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all cursor-pointer">
                                                        <i className="fa-solid fa-pen text-[10px]"></i>
                                                        <input type="file" accept="image/*" className="hidden" onChange={e => {
                                                            const file = e.target.files?.[0];
                                                            if (file) { const r = new FileReader(); r.onloadend = () => { const n = [...heroBackgrounds]; n[idx] = r.result as string; updateHeroBackgrounds(n); }; r.readAsDataURL(file); }
                                                        }} />
                                                    </label>
                                                    <button onClick={() => { const n = [...heroBackgrounds]; n.splice(idx, 1); updateHeroBackgrounds(n); setSelectedHeroImages(selectedHeroImages.filter(id => id !== idx)); }}
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

                {/* Info */}
                <div className="px-4 py-3 border-t border-white/[0.04] bg-blue-500/[0.03] flex items-center gap-3">
                    <i className="fa-solid fa-circle-info text-blue-400 text-[10px]"></i>
                    <span className="text-[11px] text-slate-500">En iyi görünüm: 1920×1080px · Maksimum 5 görsel</span>
                </div>
            </div>
        </div>
    );
};
