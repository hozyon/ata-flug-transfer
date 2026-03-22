import React, { useState } from 'react';
import { Vehicle, Driver, SiteContent } from '../../../types';

interface DriversViewProps {
    vehicles: Vehicle[];
    showToast: (msg: string, type: 'success' | 'error' | 'delete' | 'info') => void;
    editContent: SiteContent;
    setEditContent: (content: SiteContent) => void;
}

function getInitials(name: string): string {
    return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() || '').slice(0, 2).join('');
}

const AVATAR_COLORS = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-violet-500 to-purple-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-sky-500 to-cyan-600',
];

function getAvatarColor(id: string): string {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const emptyForm = (): Omit<Driver, 'id' | 'createdAt'> => ({
    name: '',
    phone: '',
    email: '',
    vehicleId: '',
    licenseNo: '',
    isActive: true,
    notes: '',
});

export const DriversView: React.FC<DriversViewProps> = ({ vehicles, showToast, editContent, setEditContent }) => {
    // Supabase-backed via editContent — auto-save handles persistence
    const drivers = editContent.drivers || [];
    const setDrivers = (next: Driver[] | ((prev: Driver[]) => Driver[])) => {
        const resolved = typeof next === 'function' ? next(drivers) : next;
        setEditContent({ ...editContent, drivers: resolved });
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm());

    const activeDrivers = drivers.filter(d => d.isActive);
    const assignedDrivers = drivers.filter(d => d.vehicleId);

    const filtered = drivers.filter(d =>
        !searchTerm ||
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone.includes(searchTerm) ||
        (d.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    function openNew() {
        setEditingId(null);
        setForm(emptyForm());
        setDrawerOpen(true);
    }

    function openEdit(driver: Driver) {
        setEditingId(driver.id);
        setForm({
            name: driver.name,
            phone: driver.phone,
            email: driver.email || '',
            vehicleId: driver.vehicleId || '',
            licenseNo: driver.licenseNo || '',
            isActive: driver.isActive,
            notes: driver.notes || '',
        });
        setDrawerOpen(true);
    }

    function handleSave() {
        if (!form.name.trim()) {
            showToast('Sürücü adı boş olamaz', 'error');
            return;
        }
        if (!form.phone.trim()) {
            showToast('Telefon numarası boş olamaz', 'error');
            return;
        }

        if (editingId) {
            setDrivers(prev => prev.map(d => d.id === editingId ? {
                ...d,
                ...form,
                vehicleId: form.vehicleId || undefined,
                email: form.email || undefined,
                licenseNo: form.licenseNo || undefined,
                notes: form.notes || undefined,
            } : d));
            showToast('Sürücü güncellendi', 'success');
        } else {
            const newDriver: Driver = {
                id: Date.now().toString(),
                ...form,
                vehicleId: form.vehicleId || undefined,
                email: form.email || undefined,
                licenseNo: form.licenseNo || undefined,
                notes: form.notes || undefined,
                createdAt: new Date().toISOString(),
            };
            setDrivers(prev => [newDriver, ...prev]);
            showToast('Sürücü eklendi', 'success');
        }
        setDrawerOpen(false);
    }

    function handleDelete(id: string) {
        if (!confirm('Bu sürücüyü silmek istediğinize emin misiniz?')) return;
        setDrivers(prev => prev.filter(d => d.id !== id));
        showToast('Sürücü silindi', 'delete');
    }

    function getVehicleName(vehicleId?: string): string | null {
        if (!vehicleId) return null;
        return vehicles.find(v => v.id === vehicleId)?.name || null;
    }

    function handleWhatsApp(phone: string, name: string) {
        const cleaned = phone.replace(/\D/g, '');
        const number = cleaned.startsWith('0') ? '9' + cleaned : cleaned.startsWith('90') ? cleaned : '90' + cleaned;
        window.open(`https://wa.me/${number}?text=Merhaba ${name}`, '_blank');
    }

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                    { label: 'Toplam Sürücü', value: drivers.length, icon: 'fa-id-card', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
                    { label: 'Aktif', value: activeDrivers.length, icon: 'fa-circle-check', iconBg: 'bg-emerald-500', gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/15' },
                    { label: 'Araç Atanmış', value: assignedDrivers.length, icon: 'fa-car', iconBg: 'bg-[var(--color-primary)]', gradient: 'from-[var(--color-primary)]/15 to-amber-600/5', border: 'border-[var(--color-primary)]/15' },
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
                        <i className="fa-solid fa-id-card text-[var(--color-primary)] text-sm"></i>
                        <span className="text-sm font-bold text-white">Sürücüler</span>
                        <span className="text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-white/5 text-slate-400">{filtered.length}</span>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-56">
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                            <input
                                type="text"
                                placeholder="İsim, telefon veya e-posta..."
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
                            <i className="fa-solid fa-plus text-[10px]"></i> Yeni Sürücü
                        </button>
                    </div>
                </div>

                {/* Table / Empty */}
                {filtered.length === 0 ? (
                    <div className="text-center py-16 border-t border-white/[0.04]">
                        <i className="fa-solid fa-id-card text-4xl text-slate-700 mb-3 block"></i>
                        <p className="text-slate-500 text-sm font-medium">
                            {searchTerm ? `"${searchTerm}" ile eşleşen sürücü yok` : 'Henüz sürücü eklenmemiş'}
                        </p>
                        {!searchTerm && (
                            <button onClick={openNew} className="mt-3 text-xs text-[var(--color-primary)] hover:underline font-medium">
                                İlk sürücüyü ekle
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-b border-white/[0.04] bg-white/[0.02]">
                                    <th className="text-left px-4 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sürücü</span></th>
                                    <th className="text-left px-3 py-3 hidden sm:table-cell"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Telefon</span></th>
                                    <th className="text-left px-3 py-3 hidden md:table-cell"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Araç</span></th>
                                    <th className="text-center px-3 py-3"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Durum</span></th>
                                    <th className="px-3 py-3 w-28"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((driver, index) => {
                                    const vehicleName = getVehicleName(driver.vehicleId);
                                    const avatarColor = getAvatarColor(driver.id);
                                    return (
                                        <tr key={driver.id} className={`border-b border-white/[0.03] transition-all group ${index % 2 === 1 ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'hover:bg-white/[0.03]'}`}>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    {/* Avatar */}
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center shrink-0 shadow-lg`}>
                                                        <span className="text-white font-black text-xs">{getInitials(driver.name)}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-[13px] group-hover:text-[var(--color-primary)] transition-colors">{driver.name}</p>
                                                        {driver.email && <p className="text-[10px] text-slate-500 truncate max-w-[180px]">{driver.email}</p>}
                                                        {driver.licenseNo && <p className="text-[10px] text-slate-600">Ehliyet: {driver.licenseNo}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5 hidden sm:table-cell">
                                                <span className="text-sm text-slate-300 font-medium">{driver.phone}</span>
                                            </td>
                                            <td className="px-3 py-3.5 hidden md:table-cell">
                                                {vehicleName ? (
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
                                                        <i className="fa-solid fa-car text-[var(--color-primary)] text-[9px]"></i>
                                                        <span className="text-[10px] font-bold text-[var(--color-primary)] truncate max-w-[120px]">{vehicleName}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-600">—</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-3.5 text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${driver.isActive ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-500/10 border-slate-500/20'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${driver.isActive ? 'bg-emerald-400' : 'bg-slate-400'}`}></div>
                                                    <span className={`text-[10px] font-bold ${driver.isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                                                        {driver.isActive ? 'Aktif' : 'Pasif'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3.5">
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                                    <button
                                                        onClick={() => handleWhatsApp(driver.phone, driver.name)}
                                                        title="WhatsApp"
                                                        className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all"
                                                    >
                                                        <i className="fa-brands fa-whatsapp text-sm"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => openEdit(driver)}
                                                        title="Düzenle"
                                                        className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all"
                                                    >
                                                        <i className="fa-solid fa-pen text-[10px]"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(driver.id)}
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
                                    {editingId ? 'Sürücü Düzenle' : 'Yeni Sürücü'}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">Sürücü bilgilerini girin</p>
                            </div>
                            <button onClick={() => setDrawerOpen(false)} className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Drawer Form */}
                        <div className="flex-1 px-6 py-5 space-y-5">
                            {/* Avatar Preview */}
                            {form.name && (
                                <div className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarColor(editingId || 'new')} flex items-center justify-center shadow-lg`}>
                                        <span className="text-white font-black text-sm">{getInitials(form.name)}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{form.name}</p>
                                        <p className="text-[11px] text-slate-500">{form.phone || 'Telefon girilmedi'}</p>
                                    </div>
                                </div>
                            )}

                            {/* Name */}
                            <div>
                                <label className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1.5 block">Ad Soyad</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Ahmet Yılmaz"
                                    className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder-slate-600"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1.5 block">Telefon</label>
                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                    placeholder="+90 532 000 00 00"
                                    className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder-slate-600"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1.5 block">
                                    E-posta <span className="text-slate-600 normal-case font-medium">— opsiyonel</span>
                                </label>
                                <input
                                    type="email"
                                    value={form.email || ''}
                                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                    placeholder="ahmet@example.com"
                                    className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder-slate-600"
                                />
                            </div>

                            {/* Vehicle Assignment */}
                            <div>
                                <label className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1.5 block">
                                    Araç Ataması <span className="text-slate-600 normal-case font-medium">— opsiyonel</span>
                                </label>
                                <select
                                    value={form.vehicleId || ''}
                                    onChange={e => setForm(f => ({ ...f, vehicleId: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all [color-scheme:dark]"
                                >
                                    <option value="">Araç seçilmedi</option>
                                    {vehicles.map(v => (
                                        <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                                    ))}
                                </select>
                            </div>

                            {/* License No */}
                            <div>
                                <label className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1.5 block">
                                    Ehliyet No <span className="text-slate-600 normal-case font-medium">— opsiyonel</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.licenseNo || ''}
                                    onChange={e => setForm(f => ({ ...f, licenseNo: e.target.value }))}
                                    placeholder="TR12345678"
                                    className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all placeholder-slate-600"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1.5 block">
                                    Notlar <span className="text-slate-600 normal-case font-medium">— opsiyonel</span>
                                </label>
                                <textarea
                                    value={form.notes || ''}
                                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                    placeholder="Sürücü hakkında notlar..."
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:border-[var(--color-primary)]/50 outline-none transition-all resize-none placeholder-slate-600"
                                />
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                                <div>
                                    <p className="text-sm font-bold text-white">Aktif</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Sürücü görev alabilir</p>
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
                                {editingId ? 'Güncelle' : 'Ekle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
