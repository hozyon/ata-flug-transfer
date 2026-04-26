import React, { Dispatch, SetStateAction } from 'react';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';

interface HeroImagesViewProps {
    heroBackgrounds: string[];
    updateHeroBackgrounds: (newBackgrounds: string[]) => void;
    selectedHeroImages: number[];
    setSelectedHeroImages: Dispatch<SetStateAction<number[]>>;
    _confirmAction: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
}

export const HeroImagesView: React.FC<HeroImagesViewProps> = ({
    heroBackgrounds, updateHeroBackgrounds, selectedHeroImages, setSelectedHeroImages, _confirmAction
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
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-8">
            {/* Header / Stats — Elite Style */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-[#020617]/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/[0.05] shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-transparent border border-indigo-500/20 flex items-center justify-center shadow-inner group transition-transform duration-500 hover:scale-105">
                        <i className="fa-solid fa-images text-indigo-400 text-2xl group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-2xl font-[900] text-white tracking-tight">Banner Yönetimi</h2>
                            <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">Slider</span>
                        </div>
                        <p className="text-[13px] text-slate-400 font-medium">Anasayfa arka plan görselleri ({heroBackgrounds.length}/5)</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {heroBackgrounds.length < 5 && (
                        <label className="px-5 py-3 bg-[var(--color-primary)] hover:bg-amber-600 text-[#06080F] rounded-2xl font-[900] text-[11px] uppercase tracking-widest shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2.5 cursor-pointer shrink-0 active:scale-95">
                            <i className="fa-solid fa-plus text-[10px]"></i> Görsel Ekle
                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) { const r = new FileReader(); r.onloadend = () => updateHeroBackgrounds([...heroBackgrounds, r.result as string]); r.readAsDataURL(file); }
                            }} />
                        </label>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-[#020617]/40 border border-white/[0.06] rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-5 bg-white/[0.02] border-b border-white/[0.04]">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-layer-group text-slate-500 text-xs"></i>
                            <span className="text-[11px] font-[900] text-slate-400 uppercase tracking-[0.2em]">Mevcut Slaytlar</span>
                        </div>
                        {selectedHeroImages.length > 0 && (
                            <div className="h-4 w-px bg-white/10"></div>
                        )}
                        {selectedHeroImages.length > 0 && (
                            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                <span className="text-[11px] text-[var(--color-primary)] font-bold">{selectedHeroImages.length} Seçili</span>
                                <button 
                                    onClick={() => {
                                        _confirmAction({
                                            title: 'Görselleri Sil',
                                            description: `${selectedHeroImages.length} adet görseli kaldırmak istediğinize emin misiniz?`,
                                            type: 'danger',
                                            onConfirm: () => {
                                                updateHeroBackgrounds(heroBackgrounds.filter((_, idx) => !selectedHeroImages.includes(idx)));
                                                setSelectedHeroImages([]);
                                            }
                                        });
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white text-[10px] font-black transition-all"
                                >
                                    <i className="fa-solid fa-trash mr-1.5"></i>SİL
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-circle-info text-blue-500/50 text-[10px]"></i>
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Sıralamak için sürükleyin</span>
                    </div>
                </div>

                {heroBackgrounds.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                            <i className="fa-regular fa-image text-3xl text-slate-700"></i>
                        </div>
                        <h3 className="text-white font-[800] text-lg mb-1">Henüz görsel eklenmedi</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">Sitenizin anasayfasında görünecek slider görsellerini yukarıdan ekleyebilirsiniz.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/[0.04]">
                                    <th className="w-16 px-8 py-5">
                                        <input type="checkbox" checked={allSelected} onChange={() => { if (allSelected) setSelectedHeroImages([]); else setSelectedHeroImages(heroBackgrounds.map((_, i) => i)); }}
                                            className="w-4 h-4 rounded-lg border-white/20 bg-white/5 accent-[#c5a059] cursor-pointer" />
                                    </th>
                                    <th className="w-12 px-2 py-5"></th>
                                    <th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Sıra</th>
                                    <th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Önizleme</th>
                                    <th className="px-6 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em]">Dosya Bilgisi</th>
                                    <th className="px-8 py-5 text-[10px] font-[900] text-slate-500 uppercase tracking-[0.2em] text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {heroBackgrounds.map((img, idx) => {
                                    const isSelected = selectedHeroImages.includes(idx);
                                    return (
                                        <tr key={idx} {...getDragProps(idx)}
                                            className={`group transition-all duration-300 cursor-grab active:cursor-grabbing ${isSelected ? 'bg-[var(--color-primary)]/5' : 'hover:bg-white/[0.03]'} ${getRowClassName(idx)}`}>
                                            <td className="px-8 py-6">
                                                <input type="checkbox" checked={isSelected}
                                                    onChange={e => { if (e.target.checked) setSelectedHeroImages([...selectedHeroImages, idx]); else setSelectedHeroImages(selectedHeroImages.filter(id => id !== idx)); }}
                                                    className="w-4 h-4 rounded-lg border-white/20 bg-white/5 accent-[#c5a059] cursor-pointer" />
                                            </td>
                                            <td className="px-2 py-6">
                                                <i className="fa-solid fa-grip-vertical text-slate-800 group-hover:text-slate-600 transition-colors"></i>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center font-mono font-black text-slate-500 group-hover:text-[var(--color-primary)] transition-colors">
                                                    {String(idx + 1).padStart(2, '0')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="w-40 h-24 rounded-[1.5rem] overflow-hidden border border-white/10 bg-black/20 shadow-xl group-hover:scale-[1.02] transition-all duration-500">
                                                    <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={`Slide ${idx + 1}`} />
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div>
                                                    <p className="font-[800] text-white text-[14px] group-hover:text-[var(--color-primary)] transition-colors duration-300">Görsel {idx + 1}</p>
                                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-1">{img.startsWith('data:') ? 'YÜKLENEN DOSYA' : 'HARİCİ BAĞLANTI'}</p>
                                                    {idx === 0 && <span className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">Açılış Görseli</span>}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                    <button onClick={() => updateHeroBackgrounds(moveItem(heroBackgrounds, idx, 'up'))} disabled={idx === 0}
                                                        className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-500 hover:text-white hover:bg-white/[0.08] disabled:opacity-0 flex items-center justify-center transition-all">
                                                        <i className="fa-solid fa-arrow-up text-xs"></i>
                                                    </button>
                                                    <button onClick={() => updateHeroBackgrounds(moveItem(heroBackgrounds, idx, 'down'))} disabled={idx === heroBackgrounds.length - 1}
                                                        className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-500 hover:text-white hover:bg-white/[0.08] disabled:opacity-0 flex items-center justify-center transition-all">
                                                        <i className="fa-solid fa-arrow-down text-xs"></i>
                                                    </button>
                                                    <label className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-90">
                                                        <i className="fa-solid fa-pen text-xs"></i>
                                                        <input type="file" accept="image/*" className="hidden" onChange={e => {
                                                            const file = e.target.files?.[0];
                                                            if (file) { const r = new FileReader(); r.onloadend = () => { const n = [...heroBackgrounds]; n[idx] = r.result as string; updateHeroBackgrounds(n); }; r.readAsDataURL(file); }
                                                        }} />
                                                    </label>
                                                    <button onClick={() => { 
                                                        _confirmAction({
                                                            title: 'Görseli Sil',
                                                            description: 'Bu görseli kaldırmak istediğinize emin misiniz?',
                                                            type: 'danger',
                                                            onConfirm: () => {
                                                                const n = [...heroBackgrounds]; n.splice(idx, 1); updateHeroBackgrounds(n); setSelectedHeroImages(selectedHeroImages.filter(id => id !== idx));
                                                            }
                                                        });
                                                    }}
                                                        className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center active:scale-90">
                                                        <i className="fa-solid fa-trash-can text-xs"></i>
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
            
            {/* Legend / Info */}
            <div className="flex items-center gap-3 px-8 py-5 bg-[#020617]/20 border border-white/[0.04] rounded-[2rem]">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner">
                    <i className="fa-solid fa-circle-info text-xs"></i>
                </div>
                <p className="text-[11px] text-slate-500 font-bold tracking-wide">Tavsiye edilen çözünürlük: <span className="text-slate-400">1920 × 1080 piksel</span>. Dosya boyutu maksimum <span className="text-slate-400">2MB</span> olmalıdır.</p>
            </div>
        </div>
    );
};
