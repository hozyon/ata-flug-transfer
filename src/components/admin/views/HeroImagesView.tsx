import React, { Dispatch, SetStateAction } from 'react';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';

interface HeroImagesViewProps {
    heroBackgrounds: string[];
    updateHeroBackgrounds: (newBackgrounds: string[]) => void;
    selectedHeroImages: number[];
    setSelectedHeroImages: Dispatch<SetStateAction<number[]>>;
    _confirmAction?: (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => void;
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
        <div className="animate-in fade-in slide-in-from-right-4 duration-700 space-y-6">
            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group transition-transform duration-500 hover:scale-105 shadow-sm shadow-indigo-100/50">
                        <i className="fa-solid fa-images text-indigo-600 text-2xl"></i>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Banner Yönetimi</h2>
                            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">Slider</span>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium">Anasayfa görselleri (<span className="text-slate-900 font-bold">{heroBackgrounds.length}/5</span>)</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {heroBackgrounds.length < 5 && (
                        <label className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2.5 cursor-pointer shrink-0 active:scale-95">
                            <i className="fa-solid fa-plus text-[10px]"></i> Görsel Ekle
                            <input type="file" accept="image/*" className="hidden" onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) { const r = new FileReader(); r.onloadend = () => updateHeroBackgrounds([...heroBackgrounds, r.result as string]); r.readAsDataURL(file); }
                            }} />
                        </label>
                    )}
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-6 bg-slate-50/50 border-b border-slate-100">
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-layer-group text-slate-400 text-xs"></i>
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Mevcut Slaytlar</span>
                        </div>
                        {selectedHeroImages.length > 0 && (
                            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-2">
                                <div className="w-px h-4 bg-slate-200"></div>
                                <span className="text-[11px] text-indigo-600 font-black uppercase tracking-widest">{selectedHeroImages.length} SEÇİLDİ</span>
                                <button 
                                    onClick={() => {
                                        if (_confirmAction) {
                                            _confirmAction({
                                                title: 'Görselleri Sil',
                                                description: `${selectedHeroImages.length} adet görseli kaldırmak istediğinize emin misiniz?`,
                                                type: 'danger',
                                                onConfirm: () => {
                                                    updateHeroBackgrounds(heroBackgrounds.filter((_, idx) => !selectedHeroImages.includes(idx)));
                                                    setSelectedHeroImages([]);
                                                }
                                            });
                                        }
                                    }}
                                    className="px-4 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white text-[10px] font-black transition-all uppercase tracking-widest"
                                >
                                    Seçilenleri Sil
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                        <i className="fa-solid fa-circle-info text-blue-500/50 text-[10px]"></i>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sürükleyerek Sıralayın</span>
                    </div>
                </div>

                {heroBackgrounds.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-6">
                            <i className="fa-regular fa-image text-3xl text-slate-300"></i>
                        </div>
                        <h3 className="text-slate-900 font-black text-lg mb-2">Henüz görsel eklenmedi</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium leading-relaxed">Slider alanında görünecek yüksek kaliteli görselleri yukarıdaki butondan ekleyebilirsiniz.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/30 border-b border-slate-100">
                                    <th className="w-16 px-8 py-5">
                                        <input type="checkbox" checked={allSelected} onChange={() => { if (allSelected) setSelectedHeroImages([]); else setSelectedHeroImages(heroBackgrounds.map((_, i) => i)); }}
                                            className="w-4 h-4 rounded-lg border-slate-200 bg-white accent-gold cursor-pointer" />
                                    </th>
                                    <th className="w-12 px-2 py-5"></th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sıralama</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Önizleme</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kaynak</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {heroBackgrounds.map((img, idx) => {
                                    const isSelected = selectedHeroImages.includes(idx);
                                    return (
                                        <tr key={idx} {...getDragProps(idx)}
                                            className={`group transition-all duration-300 cursor-grab active:cursor-grabbing ${isSelected ? 'bg-gold/5' : 'hover:bg-slate-50'} ${getRowClassName(idx)}`}>
                                            <td className="px-8 py-6">
                                                <input type="checkbox" checked={isSelected}
                                                    onChange={e => { if (e.target.checked) setSelectedHeroImages([...selectedHeroImages, idx]); else setSelectedHeroImages(selectedHeroImages.filter(id => id !== idx)); }}
                                                    className="w-4 h-4 rounded-lg border-slate-200 bg-white accent-gold cursor-pointer" />
                                            </td>
                                            <td className="px-2 py-6">
                                                <i className="fa-solid fa-grip-vertical text-slate-200 group-hover:text-slate-400 transition-colors"></i>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-mono font-black text-slate-400 group-hover:text-gold group-hover:border-gold/30 transition-all">
                                                    {String(idx + 1).padStart(2, '0')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="w-48 h-28 rounded-[1.5rem] overflow-hidden border border-slate-100 bg-slate-50 shadow-sm group-hover:shadow-xl transition-all duration-500">
                                                    <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={`Slide ${idx + 1}`} />
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-gold transition-colors duration-300">Görsel Katmanı {idx + 1}</p>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">{img.startsWith('data:') ? 'YÜKLENEN DOSYA' : 'HARİCİ URL'}</p>
                                                    {idx === 0 && <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-widest">VİTRİN GÖRSELİ</span>}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                    <button onClick={() => updateHeroBackgrounds(moveItem(heroBackgrounds, idx, 'up'))} disabled={idx === 0}
                                                        className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:shadow-sm disabled:opacity-0 flex items-center justify-center transition-all">
                                                        <i className="fa-solid fa-arrow-up text-xs"></i>
                                                    </button>
                                                    <button onClick={() => updateHeroBackgrounds(moveItem(heroBackgrounds, idx, 'down'))} disabled={idx === heroBackgrounds.length - 1}
                                                        className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:shadow-sm disabled:opacity-0 flex items-center justify-center transition-all">
                                                        <i className="fa-solid fa-arrow-down text-xs"></i>
                                                    </button>
                                                    <label className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-90 shadow-sm">
                                                        <i className="fa-solid fa-pen text-xs"></i>
                                                        <input type="file" accept="image/*" className="hidden" onChange={e => {
                                                            const file = e.target.files?.[0];
                                                            if (file) { const r = new FileReader(); r.onloadend = () => { const n = [...heroBackgrounds]; n[idx] = r.result as string; updateHeroBackgrounds(n); }; r.readAsDataURL(file); }
                                                        }} />
                                                    </label>
                                                    <button onClick={() => { 
                                                        if (_confirmAction) {
                                                            _confirmAction({
                                                                title: 'Görseli Sil',
                                                                description: 'Bu görseli kaldırmak istediğinize emin misiniz?',
                                                                type: 'danger',
                                                                onConfirm: () => {
                                                                    const n = [...heroBackgrounds]; n.splice(idx, 1); updateHeroBackgrounds(n); setSelectedHeroImages(selectedHeroImages.filter(id => id !== idx));
                                                                }
                                                            });
                                                        }
                                                    }}
                                                        className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center active:scale-90 shadow-sm">
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
            
            <div className="flex items-center gap-4 px-8 py-5 bg-blue-50 rounded-[2rem] border border-blue-100">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                    <i className="fa-solid fa-circle-info"></i>
                </div>
                <div>
                    <p className="text-[11px] text-blue-900 font-black uppercase tracking-widest">Sistem Notu</p>
                    <p className="text-[12px] text-blue-700 font-medium">En iyi görüntü için 1920x1080 piksel çözünürlüğünde ve 2MB altındaki görselleri tercih edin.</p>
                </div>
            </div>
        </div>
    );
};
