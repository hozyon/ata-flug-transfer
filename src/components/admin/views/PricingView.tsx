import React, { useState, useEffect } from 'react';
import { SiteContent } from '../../../types';
import { useViewMode } from '../../../hooks/useViewMode';
import { MobileViewToggle } from '../MobileViewToggle';

interface PricingViewProps {
    editContent: SiteContent;
}

interface PricingRule {
    id: string;
    name: string;
    type: 'percent' | 'fixed';
    value: number;
    direction: 'add' | 'subtract';
    dateFrom?: string;
    dateTo?: string;
    isActive: boolean;
}

const PRICING_RULES_KEY = 'ata_pricing_rules_v1';

const emptyRule = (): PricingRule => ({
    id: Date.now().toString(),
    name: '',
    type: 'percent',
    value: 0,
    direction: 'add',
    dateFrom: '',
    dateTo: '',
    isActive: true,
});

export const PricingView: React.FC<PricingViewProps> = ({ editContent }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { viewMode, toggleViewMode } = useViewMode();
    const regions = editContent.regions || [];
    const prices = regions.map(r => r.price || 0).filter(p => p > 0);
    const avg = prices.length > 0 ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : 0;

    const filtered = regions.filter(r =>
        !searchTerm || r.name.toLowerCase().includes(searchTerm.toLowerCase()) || (r.desc || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ── Pricing Rules State ──
    const [rules, setRules] = useState<PricingRule[]>(() => {
        try {
            const stored = localStorage.getItem(PRICING_RULES_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });
    const [showRuleForm, setShowRuleForm] = useState(false);
    const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
    const [formRule, setFormRule] = useState<PricingRule>(emptyRule());
    const [previewBase, setPreviewBase] = useState(1000);

    useEffect(() => {
        localStorage.setItem(PRICING_RULES_KEY, JSON.stringify(rules));
    }, [rules]);

    const saveRule = () => {
        if (!formRule.name.trim()) return;
        if (editingRule) {
            setRules(rules.map(r => r.id === formRule.id ? formRule : r));
        } else {
            setRules([...rules, { ...formRule, id: Date.now().toString() }]);
        }
        setShowRuleForm(false);
        setEditingRule(null);
        setFormRule(emptyRule());
    };

    const deleteRule = (id: string) => {
        if (confirm('Bu kuralı silmek istediğinize emin misiniz?')) {
            setRules(rules.filter(r => r.id !== id));
        }
    };

    const toggleRule = (id: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
    };

    const openEdit = (rule: PricingRule) => {
        setEditingRule(rule);
        setFormRule({ ...rule });
        setShowRuleForm(true);
    };

    const previewPrice = () => {
        let price = previewBase;
        rules.filter(r => r.isActive).forEach(r => {
            const delta = r.type === 'percent' ? (price * r.value) / 100 : r.value;
            price = r.direction === 'add' ? price + delta : price - delta;
        });
        return Math.round(price);
    };

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Toplam Bölge', value: regions.length, icon: 'fa-map-location-dot', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
                    { label: 'Ortalama', value: `${editContent.currency?.symbol || '€'}${avg}`, icon: 'fa-chart-line', iconBg: 'bg-emerald-500', gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/15' },
                    { label: 'Min Fiyat', value: `${editContent.currency?.symbol || '€'}${prices.length > 0 ? Math.min(...prices) : 0}`, icon: 'fa-arrow-trend-down', iconBg: 'bg-amber-500', gradient: 'from-amber-500/15 to-orange-600/5', border: 'border-amber-500/15' },
                    { label: 'Max Fiyat', value: `${editContent.currency?.symbol || '€'}${prices.length > 0 ? Math.max(...prices) : 0}`, icon: 'fa-arrow-trend-up', iconBg: 'bg-[var(--color-primary)]', gradient: 'from-[var(--color-primary)]/15 to-amber-600/5', border: 'border-[var(--color-primary)]/15' },
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

            {/* Main Table */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-4">
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-tags text-[var(--color-primary)] text-sm"></i>
                        <span className="text-sm font-bold text-white">Fiyat Tablosu</span>
                        <span className="text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-white/5 text-slate-400">{filtered.length}</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 sm:w-56">
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                            <input
                                type="text"
                                placeholder="Bölge veya açıklama ara..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-8 py-2.5 bg-white/5 border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 outline-none transition-all"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                                    <i className="fa-solid fa-xmark text-xs"></i>
                                </button>
                            )}
                        </div>

                        <MobileViewToggle viewMode={viewMode} onToggle={toggleViewMode} />
                        {/* Info Badge */}
                        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 shrink-0">
                            <i className="fa-solid fa-circle-info text-blue-400 text-[10px]"></i>
                            <span className="text-[10px] text-blue-400 font-medium whitespace-nowrap">Bölgeler'den düzenleyin</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 border-t border-white/[0.04]">
                        <i className="fa-solid fa-magnifying-glass text-4xl text-slate-700 mb-3 block"></i>
                        <p className="text-slate-500 text-sm font-medium">
                            {searchTerm ? `"${searchTerm}" ile eşleşen bölge yok` : 'Henüz bölge eklenmemiş'}
                        </p>
                    </div>
                ) : viewMode === 'card' ? (
                    /* ── MOBILE CARD VIEW ── */
                    <div className="p-3 space-y-3">
                        {filtered.map((region, index) => (
                            <div key={region.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0">
                                        <img src={region.image} className="w-full h-full object-cover" alt={region.name} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-white text-sm">{region.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                                                <span className="text-[10px] text-slate-400">Havalimanı</span>
                                            </div>
                                            <i className="fa-solid fa-arrow-right text-[7px] text-slate-600"></i>
                                            <span className="text-[10px] text-slate-400 truncate">{region.name}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        {region.price ? (
                                            <p className="text-xl font-black text-[var(--color-primary)]">{editContent.currency?.symbol || '€'}{region.price}</p>
                                        ) : (
                                            <p className="text-sm font-bold text-amber-400 flex items-center gap-1"><i className="fa-solid fa-triangle-exclamation text-[10px]" />Fiyat yok</p>
                                        )}
                                        <p className="text-[9px] text-slate-600">tek yön</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* ── TABLE VIEW ── */
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-b border-white/[0.04] bg-white/[0.02]">
                                    <th className="text-left px-4 py-3 w-12"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">#</span></th>
                                    <th className="text-left px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bölge</span></th>
                                    <th className="text-left px-3 py-3 hidden md:table-cell"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Güzergah</span></th>
                                    <th className="text-right px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fiyat</span></th>
                                    <th className="text-center px-3 py-3 w-24"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Durum</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((region, index) => {
                                    const price = region.price || 0;
                                    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
                                    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
                                    const isMin = price === minPrice && minPrice > 0;
                                    const isMax = price === maxPrice && maxPrice > 0 && maxPrice !== minPrice;
                                    const isAvg = !isMin && !isMax && Math.abs(price - avg) <= 5;
                                    const priceColor = isMin ? 'text-emerald-400' : isMax ? 'text-red-400' : isAvg ? 'text-[var(--color-primary)]' : 'text-[var(--color-primary)]';

                                    return (
                                    <tr key={region.id} className={`border-b border-white/[0.03] transition-all group ${index % 2 === 1 ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'hover:bg-white/[0.03]'}`}>
                                        <td className="px-4 py-3.5">
                                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                                                <span className="text-[10px] font-mono font-bold text-slate-500">{index + 1}</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                                                    <img src={region.image} className="w-full h-full object-cover" alt={region.name} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-[13px] group-hover:text-[var(--color-primary)] transition-colors">{region.name}</p>
                                                    <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[200px]">{region.desc}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3.5 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col items-center gap-0.5 shrink-0">
                                                    <div className="w-2 h-2 rounded-full bg-sky-400 border border-sky-500/50"></div>
                                                    <div className="w-px h-3 bg-white/10"></div>
                                                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] border border-[var(--color-primary)]/50"></div>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] text-slate-300">Antalya Havalimanı</p>
                                                    <p className="text-[11px] text-slate-500">{region.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {isMin && <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">MIN</span>}
                                                {isMax && <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">MAX</span>}
                                                {isAvg && <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">ORT</span>}
                                                <div>
                                                    {region.price ? (
                                                        <p className={`text-lg font-black ${priceColor}`}>{editContent.currency?.symbol || '€'}{region.price}</p>
                                                    ) : (
                                                        <p className="text-sm font-bold text-amber-400 flex items-center gap-1"><i className="fa-solid fa-triangle-exclamation text-[10px]" />Fiyat yok</p>
                                                    )}
                                                    <p className="text-[9px] text-slate-600">tek yön</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3.5 text-center">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                                <span className="text-[10px] font-bold text-emerald-400">Aktif</span>
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

            {/* ── Dinamik Fiyat Kuralları ── */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-sliders text-[var(--color-primary)] text-sm"></i>
                        <span className="text-sm font-bold text-white">Dinamik Fiyat Kuralları</span>
                        <span className="text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-white/5 text-slate-400">{rules.length}</span>
                        {rules.filter(r => r.isActive).length > 0 && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {rules.filter(r => r.isActive).length} aktif
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => { setFormRule(emptyRule()); setEditingRule(null); setShowRuleForm(true); }}
                        className="px-4 py-2.5 bg-[var(--color-primary)] hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                    >
                        <i className="fa-solid fa-plus text-[10px]"></i> Kural Ekle
                    </button>
                </div>

                {/* Add/Edit Form */}
                {showRuleForm && (
                    <div className="px-4 py-4 border-b border-white/[0.04] bg-white/[0.02] animate-in fade-in slide-in-from-top-2 duration-200">
                        <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider mb-3">
                            {editingRule ? 'Kuralı Düzenle' : 'Yeni Kural'}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {/* Name */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Kural Adı</label>
                                <input
                                    type="text"
                                    placeholder="örn. Yaz Sezonu"
                                    value={formRule.name}
                                    onChange={e => setFormRule({ ...formRule, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 outline-none transition-all"
                                />
                            </div>
                            {/* Type */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Tip</label>
                                <select
                                    value={formRule.type}
                                    onChange={e => setFormRule({ ...formRule, type: e.target.value as 'percent' | 'fixed' })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all appearance-none"
                                >
                                    <option value="percent">Yüzde (%)</option>
                                    <option value="fixed">Sabit (₺)</option>
                                </select>
                            </div>
                            {/* Value */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Değer</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={formRule.value}
                                    onChange={e => setFormRule({ ...formRule, value: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                                />
                            </div>
                            {/* Direction */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Yön</label>
                                <select
                                    value={formRule.direction}
                                    onChange={e => setFormRule({ ...formRule, direction: e.target.value as 'add' | 'subtract' })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all appearance-none"
                                >
                                    <option value="add">Artır (+)</option>
                                    <option value="subtract">Azalt (-)</option>
                                </select>
                            </div>
                            {/* Date From */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Başlangıç Tarihi</label>
                                <input
                                    type="date"
                                    value={formRule.dateFrom || ''}
                                    onChange={e => setFormRule({ ...formRule, dateFrom: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                                />
                            </div>
                            {/* Date To */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Bitiş Tarihi</label>
                                <input
                                    type="date"
                                    value={formRule.dateTo || ''}
                                    onChange={e => setFormRule({ ...formRule, dateTo: e.target.value })}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-all"
                                />
                            </div>
                        </div>
                        {/* Active toggle */}
                        <div className="flex items-center gap-3 mt-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <div
                                    onClick={() => setFormRule({ ...formRule, isActive: !formRule.isActive })}
                                    className={`relative w-9 h-5 rounded-full transition-all cursor-pointer ${formRule.isActive ? 'bg-emerald-500' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${formRule.isActive ? 'left-[18px]' : 'left-0.5'}`}></div>
                                </div>
                                <span className="text-xs text-slate-300 font-medium">Aktif</span>
                            </label>
                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    onClick={() => { setShowRuleForm(false); setEditingRule(null); setFormRule(emptyRule()); }}
                                    className="px-3 py-2 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-bold transition-all"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={saveRule}
                                    disabled={!formRule.name.trim()}
                                    className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:bg-amber-600 disabled:opacity-40 transition-all"
                                >
                                    {editingRule ? 'Güncelle' : 'Ekle'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rules List */}
                {rules.length === 0 ? (
                    <div className="text-center py-12">
                        <i className="fa-solid fa-sliders text-3xl text-slate-700 mb-3 block"></i>
                        <p className="text-slate-500 text-sm font-medium">Henüz fiyat kuralı eklenmemiş</p>
                        <p className="text-slate-600 text-xs mt-1">Sezonsal fiyatlar, indirimler veya primler ekleyin</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/[0.03]">
                        {rules.map(rule => (
                            <div key={rule.id} className={`flex items-center gap-3 px-4 py-3.5 group hover:bg-white/[0.02] transition-all ${!rule.isActive ? 'opacity-50' : ''}`}>
                                {/* Active dot */}
                                <div className={`w-2 h-2 rounded-full shrink-0 ${rule.isActive ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                                {/* Name */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white text-[13px]">{rule.name}</p>
                                    {(rule.dateFrom || rule.dateTo) && (
                                        <p className="text-[10px] text-slate-500 mt-0.5">
                                            {rule.dateFrom && new Date(rule.dateFrom).toLocaleDateString('tr-TR')}
                                            {rule.dateFrom && rule.dateTo && ' – '}
                                            {rule.dateTo && new Date(rule.dateTo).toLocaleDateString('tr-TR')}
                                        </p>
                                    )}
                                </div>
                                {/* Type badge */}
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${rule.type === 'percent' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-violet-500/10 text-violet-400 border-violet-500/20'}`}>
                                    {rule.type === 'percent' ? '%' : '₺'}
                                </span>
                                {/* Value + direction */}
                                <span className={`text-sm font-black ${rule.direction === 'add' ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {rule.direction === 'add' ? '+' : '-'}{rule.value}{rule.type === 'percent' ? '%' : '₺'}
                                </span>
                                {/* Toggle */}
                                <div
                                    onClick={() => toggleRule(rule.id)}
                                    className={`relative w-9 h-5 rounded-full transition-all cursor-pointer shrink-0 ${rule.isActive ? 'bg-emerald-500' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${rule.isActive ? 'left-[18px]' : 'left-0.5'}`}></div>
                                </div>
                                {/* Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEdit(rule)}
                                        className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all"
                                    >
                                        <i className="fa-solid fa-pen text-[10px]"></i>
                                    </button>
                                    <button
                                        onClick={() => deleteRule(rule.id)}
                                        className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all"
                                    >
                                        <i className="fa-solid fa-trash text-[10px]"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Preview */}
                {rules.filter(r => r.isActive).length > 0 && (
                    <div className="px-4 py-4 border-t border-white/[0.04] bg-[var(--color-primary)]/[0.04]">
                        <div className="flex items-center gap-3 flex-wrap">
                            <i className="fa-solid fa-calculator text-[var(--color-primary)] text-sm"></i>
                            <span className="text-xs font-bold text-slate-300">Önizleme: Baz fiyat</span>
                            <input
                                type="number"
                                value={previewBase}
                                onChange={e => setPreviewBase(parseInt(e.target.value) || 0)}
                                className="w-24 px-3 py-1.5 bg-white/5 border border-white/[0.08] rounded-lg text-sm text-white text-center outline-none focus:border-[var(--color-primary)]/50 transition-all"
                            />
                            <span className="text-xs text-slate-400">₺ →</span>
                            <span className="text-lg font-black text-[var(--color-primary)]">{previewPrice().toLocaleString('tr-TR')} ₺</span>
                            <span className="text-[10px] text-slate-500">
                                ({rules.filter(r => r.isActive).length} kural uygulandı)
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
