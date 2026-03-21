import React, { useState, useMemo } from 'react';

interface ActivityEntry {
    id: string;
    action: string;
    details: string;
    type: 'blog' | 'booking' | 'fleet' | 'settings' | 'review' | 'other';
    timestamp: string;
}

type FilterType = 'Tümü' | 'blog' | 'booking' | 'fleet' | 'settings';

interface ActivityLogViewProps {
    showToast: (msg: string, type: string) => void;
}

const LS_KEY = 'ata_activity_log_v1';

function loadEntries(): ActivityEntry[] {
    try {
        return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    } catch {
        return [];
    }
}

function getRelativeTime(isoDate: string): string {
    try {
        const now = Date.now();
        const then = new Date(isoDate).getTime();
        const diffMs = now - then;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 60) return 'Az önce';
        if (diffMins < 60) return `${diffMins} dakika önce`;
        if (diffHours < 24) return `${diffHours} saat önce`;
        if (diffDays === 1) return 'Dün';
        if (diffDays < 7) return `${diffDays} gün önce`;
        return new Date(isoDate).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return '';
    }
}

const typeConfig: Record<ActivityEntry['type'], { icon: string; dot: string; label: string; iconBg: string }> = {
    blog: { icon: 'fa-newspaper', dot: 'bg-violet-500', label: 'Blog', iconBg: 'bg-violet-500/15 text-violet-300' },
    booking: { icon: 'fa-calendar-check', dot: 'bg-blue-500', label: 'Rezervasyon', iconBg: 'bg-blue-500/15 text-blue-300' },
    fleet: { icon: 'fa-car', dot: 'bg-emerald-500', label: 'Filo', iconBg: 'bg-emerald-500/15 text-emerald-300' },
    settings: { icon: 'fa-gear', dot: 'bg-[#c5a059]', label: 'Ayarlar', iconBg: 'bg-[#c5a059]/15 text-[#c5a059]' },
    review: { icon: 'fa-star', dot: 'bg-yellow-500', label: 'Yorum', iconBg: 'bg-yellow-500/15 text-yellow-300' },
    other: { icon: 'fa-circle-dot', dot: 'bg-slate-500', label: 'Diğer', iconBg: 'bg-slate-500/15 text-slate-400' },
};

const filterTabs: { key: FilterType; label: string }[] = [
    { key: 'Tümü', label: 'Tümü' },
    { key: 'blog', label: 'Blog' },
    { key: 'booking', label: 'Rezervasyon' },
    { key: 'fleet', label: 'Filo' },
    { key: 'settings', label: 'Ayarlar' },
];

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ showToast }) => {
    const [entries, setEntries] = useState<ActivityEntry[]>(() => loadEntries());
    const [filter, setFilter] = useState<FilterType>('Tümü');
    const [confirmClear, setConfirmClear] = useState(false);

    const filtered = useMemo(() => {
        if (filter === 'Tümü') return entries;
        return entries.filter((e) => e.type === filter);
    }, [entries, filter]);

    const handleClear = () => {
        if (!confirmClear) {
            setConfirmClear(true);
            return;
        }
        try {
            localStorage.removeItem(LS_KEY);
            setEntries([]);
            showToast('Aktivite günlüğü temizlendi', 'delete');
        } catch {
            showToast('Temizleme başarısız', 'error');
        }
        setConfirmClear(false);
    };

    const totalCount = entries.length;

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Toplam Kayıt', value: totalCount, icon: 'fa-list-check', iconBg: 'bg-[#c5a059]', gradient: 'from-[#c5a059]/15 to-amber-600/5', border: 'border-[#c5a059]/15' },
                    { label: 'Blog', value: entries.filter(e => e.type === 'blog').length, icon: 'fa-newspaper', iconBg: 'bg-violet-500', gradient: 'from-violet-500/15 to-purple-600/5', border: 'border-violet-500/15' },
                    { label: 'Rezervasyon', value: entries.filter(e => e.type === 'booking').length, icon: 'fa-calendar-check', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
                    { label: 'Ayarlar', value: entries.filter(e => e.type === 'settings').length, icon: 'fa-gear', iconBg: 'bg-slate-500', gradient: 'from-slate-500/15 to-gray-600/5', border: 'border-slate-500/15' },
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-4 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-clock-rotate-left text-[#c5a059] text-sm"></i>
                        <span className="text-sm font-bold text-white">Aktivite Günlüğü</span>
                        <span className="text-[9px] font-black min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-white/5 text-slate-400 px-1">
                            {totalCount}
                        </span>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setFilter(tab.key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    filter === tab.key
                                        ? 'bg-[#c5a059] text-white shadow-lg shadow-amber-500/20'
                                        : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Clear Button */}
                    {totalCount > 0 && (
                        <div className="sm:ml-auto flex items-center gap-2">
                            {confirmClear && (
                                <span className="text-xs text-red-400 font-medium animate-in fade-in duration-200">
                                    Emin misiniz?
                                </span>
                            )}
                            <button
                                onClick={handleClear}
                                onBlur={() => setTimeout(() => setConfirmClear(false), 200)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    confirmClear
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                        : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                }`}
                            >
                                <i className="fa-solid fa-trash text-[10px]"></i>
                                Günlüğü Temizle
                            </button>
                        </div>
                    )}
                </div>

                {/* Timeline */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <i className="fa-regular fa-clock text-5xl text-slate-700 mb-4 block"></i>
                        <p className="text-slate-500 text-sm font-medium">
                            {totalCount === 0 ? 'Henüz aktivite kaydı yok' : 'Bu kategoride kayıt bulunamadı'}
                        </p>
                        <p className="text-slate-600 text-xs mt-1 max-w-xs mx-auto">
                            Aktiviteler kayıt altına alınmaya başlandı. Yeni işlemler burada görünecek.
                        </p>
                    </div>
                ) : (
                    <div className="p-4 space-y-0">
                        {/* Timeline wrapper */}
                        <div className="relative">
                            {/* Left border line */}
                            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/[0.06]"></div>

                            <div className="space-y-1">
                                {filtered.map((entry, idx) => {
                                    const config = typeConfig[entry.type] || typeConfig.other;
                                    return (
                                        <div
                                            key={entry.id}
                                            className={`relative flex items-start gap-4 py-3 px-3 rounded-xl hover:bg-white/[0.02] transition-colors group ${
                                                idx !== filtered.length - 1 ? 'border-b border-white/[0.03]' : ''
                                            }`}
                                        >
                                            {/* Dot + Icon */}
                                            <div className="relative z-10 flex-shrink-0 mt-0.5">
                                                <div className={`w-[38px] h-[38px] rounded-xl ${config.iconBg} flex items-center justify-center border border-white/[0.06]`}>
                                                    <i className={`fa-solid ${config.icon} text-sm`}></i>
                                                </div>
                                                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${config.dot} border-2 border-[#0f172a]`}></span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-white leading-snug group-hover:text-[#c5a059] transition-colors truncate">
                                                            {entry.action}
                                                        </p>
                                                        {entry.details && (
                                                            <p className="text-xs text-slate-500 mt-0.5 truncate">
                                                                {entry.details}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${config.iconBg} border border-white/[0.06]`}>
                                                            {config.label}
                                                        </span>
                                                        <span className="text-[10px] text-slate-600 whitespace-nowrap">
                                                            {getRelativeTime(entry.timestamp)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="px-4 py-3 border-t border-white/[0.04] bg-[#c5a059]/[0.03] flex items-center gap-3">
                    <i className="fa-solid fa-circle-info text-[#c5a059] text-[10px]"></i>
                    <span className="text-[11px] text-slate-500">
                        Aktiviteler kayıt altına alınmaya başlandı · Maksimum 200 kayıt saklanır
                    </span>
                </div>
            </div>
        </div>
    );
};
