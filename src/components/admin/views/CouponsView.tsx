import React, { useState } from 'react';
import { Coupon, SiteContent } from '../../../types';

interface CouponsViewProps {
    showToast: (msg: string, type: 'success' | 'error' | 'delete' | 'info') => void;
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
}

function generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

const emptyForm = (): Omit<Coupon, 'id' | 'usedCount' | 'createdAt'> => ({
    code: '',
    type: 'percent',
    value: 10,
    minAmount: undefined,
    usageLimit: undefined,
    expiresAt: '',
    isActive: true,
    description: '',
});

export const CouponsView: React.FC<CouponsViewProps> = ({ showToast, editContent, setEditContent }) => {
    // Supabase-backed via editContent — auto-save handles persistence
    const coupons = editContent.coupons || [];
    const setCoupons = (next: Coupon[] | ((prev: Coupon[]) => Coupon[])) => {
        const resolved = typeof next === 'function' ? next(coupons) : next;
        setEditContent({ ...editContent, coupons: resolved });
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm());

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const activeCoupons = coupons.filter(c => c.isActive);
    const usedThisMonth = coupons.reduce((sum, c) => {
        if (c.createdAt.startsWith(thisMonth)) return sum + c.usedCount;
        return sum;
    }, 0);
    const totalDiscount = coupons.reduce((sum, c) => {
        if (c.type === 'fixed') return sum + c.value * c.usedCount;
        return sum;
    }, 0);

    const filtered = coupons.filter(c =>
        !searchTerm ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    function openNew() {
        setEditingId(null);
        setForm(emptyForm());
        setDrawerOpen(true);
    }

    function openEdit(coupon: Coupon) {
        setEditingId(coupon.id);
        setForm({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            minAmount: coupon.minAmount,
            usageLimit: coupon.usageLimit,
            expiresAt: coupon.expiresAt || '',
            isActive: coupon.isActive,
            description: coupon.description || '',
        });
        setDrawerOpen(true);
    }

    function handleSave() {
        if (!form.code.trim()) {
            showToast('Kupon kodu boş olamaz', 'error');
            return;
        }
        if (form.value <= 0) {
            showToast('İndirim değeri 0\'dan büyük olmalı', 'error');
            return;
        }
        if (form.type === 'percent' && form.value > 100) {
            showToast('Yüzde indirim 100\'den fazla olamaz', 'error');
            return;
        }

        const codeExists = coupons.some(c => c.code.toUpperCase() === form.code.toUpperCase() && c.id !== editingId);
        if (codeExists) {
            showToast('Bu kupon kodu zaten mevcut', 'error');
            return;
        }

        if (editingId) {
            setCoupons(prev => prev.map(c => c.id === editingId ? {
                ...c,
                ...form,
                code: form.code.toUpperCase(),
                minAmount: form.minAmount || undefined,
                usageLimit: form.usageLimit || undefined,
                expiresAt: form.expiresAt || undefined,
            } : c));
            showToast('Kupon güncellendi', 'success');
        } else {
            const newCoupon: Coupon = {
                id: Date.now().toString(),
                ...form,
                code: form.code.toUpperCase(),
                usedCount: 0,
                minAmount: form.minAmount || undefined,
                usageLimit: form.usageLimit || undefined,
                expiresAt: form.expiresAt || undefined,
                createdAt: new Date().toISOString(),
            };
            setCoupons(prev => [newCoupon, ...prev]);
            showToast('Kupon oluşturuldu', 'success');
        }
        setDrawerOpen(false);
    }

    function handleDelete(id: string) {
        if (!confirm('Bu kuponu silmek istediğinize emin misiniz?')) return;
        setCoupons(prev => prev.filter(c => c.id !== id));
        showToast('Kupon silindi', 'delete');
    }

    function handleToggleActive(id: string) {
        setCoupons(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    }

    function handleCopyCode(code: string) {
        navigator.clipboard.writeText(code).then(() => showToast(`"${code}" kopyalandı`, 'info'));
    }

    function isExpired(coupon: Coupon): boolean {
        if (!coupon.expiresAt) return false;
        return new Date(coupon.expiresAt) < now;
    }

    function getStatusInfo(coupon: Coupon) {
        if (!coupon.isActive) return { label: 'Pasif', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-400' };
        if (isExpired(coupon)) return { label: 'Süresi Doldu', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400' };
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return { label: 'Tükendi', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' };
        return { label: 'Aktif', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400' };
    }

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Toplam Kupon', value: coupons.length, icon: 'fa-ticket', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
                    { label: 'Aktif', value: activeCoupons.length, icon: 'fa-circle-check', iconBg: 'bg-emerald-500', gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/15' },
                    { label: 'Bu Ay Kullanım', value: usedThisMonth, icon: 'fa-chart-simple', iconBg: 'bg-violet-500', gradient: 'from-violet-500/15 to-purple-600/5', border: 'border-violet-500/15' },
                    { label: 'Toplam İndirim', value: `₺${totalDiscount.toLocaleString('tr-TR')}`, icon: 'fa-turkish-lira-sign', iconBg: 'bg-[var(--color-primary)]', gradient: 'from-[var(--color-primary)]/15 to-amber-600/5', border: 'border-[var(--color-primary)]/15' },
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
                        <i className="fa-solid fa-ticket text-[var(--color-primary)] text-sm"></i>
                        <span className="text-sm font-bold text-white">Kuponlar</span>
                        <span className="text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-white/5 text-slate-400">{filtered.length}</span>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-56">
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                            <input
                                type="text"
                                placeholder="Kupon kodu veya açıklama..."
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
                        <button
                            onClick={openNew}
                            className="px-4 py-2.5 bg-[var(--color-primary)] hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0"
                        >
                            <i className="fa-solid fa-plus text-[10px]"></i> Yeni Kupon
                        </button>
                    </div>
                </div>

                {/* Table */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 border-t border-white/[0.04]">
                        <i className="fa-solid fa-ticket text-4xl text-slate-700 mb-3 block"></i>
                        <p className="text-slate-500 text-sm font-medium">
                            {searchTerm ? `"${searchTerm}" ile eşleşen kupon yok` : 'Henüz kupon oluşturulmamış'}
                        </p>
                        {!searchTerm && (
                            <button onClick={openNew} className="mt-3 text-xs text-[var(--color-primary)] hover:underline font-medium">
                                İlk kuponu oluştur
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-b border-white/[0.04] bg-white/[0.02]">
                                    <th className="text-left px-4 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kod</span></th>
                                    <th className="text-left px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tür</span></th>
                                    <th className="text-right px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Değer</span></th>
                                    <th className="text-center px-3 py-3 hidden md:table-cell"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kullanım</span></th>
                                    <th className="text-center px-3 py-3 hidden lg:table-cell"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Son Tarih</span></th>
                                    <th className="text-center px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Durum</span></th>
                                    <th className="px-3 py-3 w-28"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((coupon, index) => {
                                    const status = getStatusInfo(coupon);
                                    return (
                                        <tr key={coupon.id} className={`border-b border-white/[0.03] transition-all group ${index % 2 === 1 ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'hover:bg-white/[0.03]'}`}>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                                                        <i className="fa-solid fa-tag text-[var(--color-primary)] text-[10px]"></i>
                                                    </div>
                                                    <div>
                                                        <p className="font-mono font-black text-white text-sm tracking-wider">{coupon.code}</p>
                                                        {coupon.description && <p className="text-[10px] text-slate-500 truncate max-w-[160px]">{coupon.description}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${coupon.type === 'percent' ? 'bg-violet-500/10 border-violet-500/20' : 'bg-sky-500/10 border-sky-500/20'}`}>
                                                    <i className={`fa-solid ${coupon.type === 'percent' ? 'fa-percent' : 'fa-turkish-lira-sign'} text-[9px] ${coupon.type === 'percent' ? 'text-violet-400' : 'text-sky-400'}`}></i>
                                                    <span className={`text-[10px] font-bold ${coupon.type === 'percent' ? 'text-violet-400' : 'text-sky-400'}`}>
                                                        {coupon.type === 'percent' ? 'Yüzde' : 'Sabit'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5 text-right">
                                                <span className="text-lg font-black text-[var(--color-primary)]">
                                                    {coupon.type === 'percent' ? `%${coupon.value}` : `₺${coupon.value}`}
                                                </span>
                                                {coupon.minAmount && (
                                                    <p className="text-[9px] text-slate-600">min ₺{coupon.minAmount}</p>
                                                )}
                                            </td>
                                            <td className="px-3 py-3.5 text-center hidden md:table-cell">
                                                <span className="text-sm font-bold text-white">{coupon.usedCount}</span>
                                                <span className="text-slate-500 text-xs"> / </span>
                                                <span className="text-xs text-slate-400">{coupon.usageLimit ?? '∞'}</span>
                                            </td>
                                            <td className="px-3 py-3.5 text-center hidden lg:table-cell">
                                                {coupon.expiresAt ? (
                                                    <span className={`text-xs font-medium ${isExpired(coupon) ? 'text-red-400' : 'text-slate-400'}`}>
                                                        {new Date(coupon.expiresAt).toLocaleDateString('tr-TR')}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-600">—</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-3.5 text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${status.bg} ${status.border}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></div>
                                                    <span className={`text-[10px] font-bold ${status.color}`}>{status.label}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                                    <button
                                                        onClick={() => handleCopyCode(coupon.code)}
                                                        title="Kopyala"
                                                        className="w-7 h-7 rounded-lg bg-white/5 text-slate-400 hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)] flex items-center justify-center transition-all"
                                                    >
                                                        <i className="fa-solid fa-copy text-[10px]"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleActive(coupon.id)}
                                                        title={coupon.isActive ? 'Pasife Al' : 'Aktife Al'}
                                                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${coupon.isActive ? 'bg-emerald-500/10 text-emerald-400 hover:bg-red-500/10 hover:text-red-400' : 'bg-slate-500/10 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400'}`}
                                                    >
                                                        <i className={`fa-solid ${coupon.isActive ? 'fa-toggle-on' : 'fa-toggle-off'} text-[10px]`}></i>
                                                    </button>
                                                    <button
                                                        onClick={() => openEdit(coupon)}
                                                        title="Düzenle"
                                                        className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all"
                                                    >
                                                        <i className="fa-solid fa-pen text-[10px]"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(coupon.id)}
                                                        title="Sil"
                                                        className="w-7 h-7 rounded-lg bg-white/5 text-slate-500 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all"
                                                    >
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

            {/* Right-Side Drawer */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)}></div>
                    <div className="w-full max-w-md bg-[#0f172a] border-l border-white/[0.08] flex flex-col h-full overflow-y-auto animate-in slide-in-from-right-8 duration-300">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                            <div>
                                <h3 className="text-lg font-black text-white">
                                    {editingId ? 'Kupon Düzenle' : 'Yeni Kupon'}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">İndirim kodu oluştur veya düzenle</p>
                            </div>
                            <button onClick={() => setDrawerOpen(false)} className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Drawer Form */}
                        <div className="flex-1 px-6 py-5 space-y-5">
                            {/* Code */}
                            <div>
                                <label className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1.5 block">Kupon Kodu</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={form.code}
                                        onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                                        placeholder="YAZA2026"
                                        className="flex-1 bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white font-mono font-bold uppercase text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder-slate-600"
                                    />
                                    <button
                                        onClick={() => setForm(f => ({ ...f, code: generateCode() }))}
                                        title="Rastgele oluştur"
                                        className="px-3 py-3 bg-white/5 border border-white/[0.08] rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all shrink-0"
                                    >
                                        <i className="fa-solid fa-dice text-sm"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Type Segmented Control */}
                            <div>
                                <label className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1.5 block">İndirim Türü</label>
                                <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.06] rounded-xl">
                                    {[
                                        { value: 'percent' as const, label: 'Yüzde (%)', icon: 'fa-percent' },
                                        { value: 'fixed' as const, label: 'Sabit (₺)', icon: 'fa-turkish-lira-sign' },
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setForm(f => ({ ...f, type: opt.value }))}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${form.type === opt.value ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                        >
                                            <i className={`fa-solid ${opt.icon} text-[10px]`}></i>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Value */}
                            <div>
                                <label className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1.5 block">
                                    İndirim Değeri {form.type === 'percent' ? '(%)' : '(₺)'}
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    max={form.type === 'percent' ? 100 : undefined}
                                    value={form.value}
                                    onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
                                    className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all"
                                />
                            </div>

                            {/* Min Amount */}
                            <div>
                                <label className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1.5 block">
                                    Minimum Sepet Tutarı (₺) <span className="text-slate-600 normal-case font-medium">— opsiyonel</span>
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    value={form.minAmount ?? ''}
                                    onChange={e => setForm(f => ({ ...f, minAmount: e.target.value ? Number(e.target.value) : undefined }))}
                                    placeholder="Örn. 500"
                                    className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder-slate-600"
                                />
                            </div>

                            {/* Usage Limit */}
                            <div>
                                <label className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1.5 block">
                                    Kullanım Limiti <span className="text-slate-600 normal-case font-medium">— boş = sınırsız</span>
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={form.usageLimit ?? ''}
                                    onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value ? Number(e.target.value) : undefined }))}
                                    placeholder="Örn. 100"
                                    className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder-slate-600"
                                />
                            </div>

                            {/* Expiry Date */}
                            <div>
                                <label className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1.5 block">
                                    Son Kullanım Tarihi <span className="text-slate-600 normal-case font-medium">— opsiyonel</span>
                                </label>
                                <input
                                    type="date"
                                    value={form.expiresAt || ''}
                                    onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all [color-scheme:dark]"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1.5 block">
                                    Açıklama <span className="text-slate-600 normal-case font-medium">— opsiyonel</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.description || ''}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Yaz sezonu indirimi..."
                                    className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder-slate-600"
                                />
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                                <div>
                                    <p className="text-sm font-bold text-white">Aktif</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Kupon hemen kullanılabilir olsun</p>
                                </div>
                                <button
                                    onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                                    className={`w-12 h-6 rounded-full transition-all relative ${form.isActive ? 'bg-[var(--color-primary)]' : 'bg-white/10'}`}
                                >
                                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.isActive ? 'left-[26px]' : 'left-0.5'}`}></span>
                                </button>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="px-6 py-5 border-t border-white/[0.06] flex gap-3">
                            <button
                                onClick={() => setDrawerOpen(false)}
                                className="flex-1 py-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 font-bold text-sm transition-all"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-3 rounded-xl bg-[var(--color-primary)] hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-floppy-disk text-xs"></i>
                                {editingId ? 'Güncelle' : 'Oluştur'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
