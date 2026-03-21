import React, { useState, useMemo } from 'react';
import { SiteContent, BlogPost } from '../../../types';

interface MediaLibraryViewProps {
    siteContent: SiteContent;
    blogPosts: BlogPost[];
    showToast: (msg: string, type: 'success' | 'error' | 'delete' | 'info') => void;
}

type MediaCategory = 'Hero' | 'Araç' | 'Blog' | 'Hakkımızda';
type FilterType = 'Tümü' | MediaCategory;

interface MediaItem {
    url: string;
    category: MediaCategory;
    name: string;
}

function getFileName(url: string): string {
    if (!url) return '';
    if (url.startsWith('data:')) return 'Yüklenen Dosya';
    try {
        const parts = url.split('/');
        const last = parts[parts.length - 1];
        return last.split('?')[0] || url.substring(0, 30);
    } catch {
        return url.substring(0, 30);
    }
}

export const MediaLibraryView: React.FC<MediaLibraryViewProps> = ({
    siteContent,
    blogPosts,
    showToast,
}) => {
    const [filter, setFilter] = useState<FilterType>('Tümü');
    const [search, setSearch] = useState('');
    const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);

    const allMedia = useMemo<MediaItem[]>(() => {
        const items: MediaItem[] = [];

        // Hero backgrounds
        (siteContent.hero?.backgrounds || []).forEach((url) => {
            if (url) items.push({ url, category: 'Hero', name: getFileName(url) });
        });
        if (siteContent.hero?.bgImage) {
            items.push({
                url: siteContent.hero.bgImage,
                category: 'Hero',
                name: getFileName(siteContent.hero.bgImage),
            });
        }

        // Vehicle images
        (siteContent.vehicles || []).forEach((v) => {
            if (v.image) items.push({ url: v.image, category: 'Araç', name: getFileName(v.image) });
        });

        // About images
        if (siteContent.about?.image) {
            items.push({
                url: siteContent.about.image,
                category: 'Hakkımızda',
                name: getFileName(siteContent.about.image),
            });
        }
        if (siteContent.about?.bannerImage) {
            items.push({
                url: siteContent.about.bannerImage,
                category: 'Hakkımızda',
                name: getFileName(siteContent.about.bannerImage),
            });
        }

        // Blog featured images
        blogPosts.forEach((post) => {
            if (post.featuredImage) {
                items.push({
                    url: post.featuredImage,
                    category: 'Blog',
                    name: getFileName(post.featuredImage),
                });
            }
        });

        // Deduplicate by URL
        const seen = new Set<string>();
        return items.filter((item) => {
            if (seen.has(item.url)) return false;
            seen.add(item.url);
            return true;
        });
    }, [siteContent, blogPosts]);

    const filtered = useMemo(() => {
        return allMedia.filter((item) => {
            const matchesFilter = filter === 'Tümü' || item.category === filter;
            const matchesSearch =
                !search ||
                item.url.toLowerCase().includes(search.toLowerCase()) ||
                item.name.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [allMedia, filter, search]);

    const categoryCounts = useMemo(() => {
        const counts: Record<FilterType, number> = {
            Tümü: allMedia.length,
            Hero: 0,
            Araç: 0,
            Blog: 0,
            Hakkımızda: 0,
        };
        allMedia.forEach((item) => {
            counts[item.category]++;
        });
        return counts;
    }, [allMedia]);

    const categoryBadgeStyle: Record<MediaCategory, string> = {
        Hero: 'bg-blue-500/20 text-blue-300 border border-blue-500/20',
        Araç: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20',
        Blog: 'bg-violet-500/20 text-violet-300 border border-violet-500/20',
        Hakkımızda: 'bg-amber-500/20 text-amber-300 border border-amber-500/20',
    };

    const handleCopyUrl = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            showToast('URL kopyalandı', 'success');
        } catch {
            showToast('Kopyalama başarısız', 'error');
        }
    };

    const filters: FilterType[] = ['Tümü', 'Hero', 'Araç', 'Blog', 'Hakkımızda'];

    return (
        <div className="animate-in slide-in-from-right-8 duration-500 space-y-5">
            {/* Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                    { label: 'Toplam Görsel', value: allMedia.length, icon: 'fa-images', iconBg: 'bg-[#c5a059]', gradient: 'from-[#c5a059]/15 to-amber-600/5', border: 'border-[#c5a059]/15' },
                    { label: 'Hero', value: categoryCounts['Hero'], icon: 'fa-panorama', iconBg: 'bg-blue-500', gradient: 'from-blue-500/15 to-indigo-600/5', border: 'border-blue-500/15' },
                    { label: 'Araç', value: categoryCounts['Araç'], icon: 'fa-car', iconBg: 'bg-emerald-500', gradient: 'from-emerald-500/15 to-green-600/5', border: 'border-emerald-500/15' },
                    { label: 'Blog', value: categoryCounts['Blog'], icon: 'fa-newspaper', iconBg: 'bg-violet-500', gradient: 'from-violet-500/15 to-purple-600/5', border: 'border-violet-500/15' },
                    { label: 'Hakkımızda', value: categoryCounts['Hakkımızda'], icon: 'fa-circle-info', iconBg: 'bg-amber-500', gradient: 'from-amber-500/15 to-yellow-600/5', border: 'border-amber-500/15' },
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
                <div className="flex flex-col gap-3 px-4 py-4 border-b border-white/[0.04]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                            <i className="fa-solid fa-photo-film text-[#c5a059] text-sm"></i>
                            <span className="text-sm font-bold text-white">Medya Kütüphanesi</span>
                            <span className="text-[9px] font-black min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/20 px-1">
                                {filtered.length} görsel
                            </span>
                        </div>

                        {/* Search */}
                        <div className="sm:ml-auto relative">
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="URL veya dosya adı ara..."
                                className="pl-8 pr-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-slate-600 text-xs focus:outline-none focus:border-[#c5a059]/40 w-56 transition-all"
                            />
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    filter === f
                                        ? 'bg-[#c5a059] text-white shadow-lg shadow-amber-500/20'
                                        : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white'
                                }`}
                            >
                                {f}
                                <span className={`ml-1.5 text-[9px] ${filter === f ? 'text-white/70' : 'text-slate-600'}`}>
                                    {categoryCounts[f]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <i className="fa-regular fa-image text-5xl text-slate-700 mb-4 block"></i>
                        <p className="text-slate-500 text-sm font-medium">Görsel bulunamadı</p>
                        <p className="text-slate-600 text-xs mt-1">
                            {search ? 'Arama kriterlerinizi değiştirmeyi deneyin' : 'Henüz hiç görsel eklenmemiş'}
                        </p>
                    </div>
                ) : (
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {filtered.map((item, idx) => (
                            <div
                                key={`${item.url}-${idx}`}
                                className="group relative bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden hover:border-[#c5a059]/30 transition-all duration-200"
                                onMouseEnter={() => setHoveredUrl(item.url)}
                                onMouseLeave={() => setHoveredUrl(null)}
                            >
                                {/* Thumbnail */}
                                <div className="aspect-square overflow-hidden bg-black/20">
                                    <img
                                        src={item.url}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23111827'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%234b5563' font-size='12'%3EYüklenemedi%3C/text%3E%3C/svg%3E";
                                        }}
                                    />
                                </div>

                                {/* Hover Overlay */}
                                <div className={`absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2 transition-opacity duration-200 ${hoveredUrl === item.url ? 'opacity-100' : 'opacity-0'}`}>
                                    <button
                                        onClick={() => handleCopyUrl(item.url)}
                                        className="px-3 py-1.5 bg-[#c5a059] hover:bg-amber-500 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 shadow-lg"
                                    >
                                        <i className="fa-solid fa-copy text-[9px]"></i>
                                        URL Kopyala
                                    </button>
                                    <p className="text-[9px] text-slate-400 font-mono text-center px-2 max-w-full truncate">
                                        {item.url.startsWith('data:') ? 'Base64 Görsel' : item.url.substring(0, 35) + (item.url.length > 35 ? '...' : '')}
                                    </p>
                                </div>

                                {/* Info Footer */}
                                <div className="p-2">
                                    <div className="flex items-center justify-between gap-1">
                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${categoryBadgeStyle[item.category]}`}>
                                            {item.category}
                                        </span>
                                        <button
                                            onClick={() => handleCopyUrl(item.url)}
                                            title="URL Kopyala"
                                            className="w-5 h-5 rounded-md bg-white/5 text-slate-500 hover:bg-[#c5a059]/20 hover:text-[#c5a059] flex items-center justify-center transition-all"
                                        >
                                            <i className="fa-solid fa-copy text-[8px]"></i>
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-slate-500 font-mono mt-1 truncate" title={item.name}>
                                        {item.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Info */}
                <div className="px-4 py-3 border-t border-white/[0.04] bg-[#c5a059]/[0.03] flex items-center gap-3">
                    <i className="fa-solid fa-circle-info text-[#c5a059] text-[10px]"></i>
                    <span className="text-[11px] text-slate-500">
                        Görsellere tıklayarak URL'yi kopyalayabilirsiniz · {allMedia.length} görsel listeleniyor
                    </span>
                </div>
            </div>
        </div>
    );
};
