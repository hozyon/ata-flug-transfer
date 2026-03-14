import React from 'react';
import { haptic } from '../../utils/haptic';

interface KpiItem {
    label: string;
    val: number | string;
    icon: string;
    color: string;
    bg: string;
    trend: string | null;
    trendUp: boolean;
}

interface KpiCarouselProps {
    items: KpiItem[];
}

export const KpiCarousel: React.FC<KpiCarouselProps> = ({ items }) => {
    return (
        <div
            className="lg:hidden flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 scrollbar-hide -mx-4 px-4 auto-cols-[85%] sm:auto-cols-[45%] lg:auto-cols-[30%] grid-flow-col"
            style={{ scrollBehavior: 'smooth', overscrollBehaviorX: 'contain' }}
        >
            {items.map((kpi, idx) => (
                <div
                    key={idx}
                    onClick={() => haptic.tap()}
                    className="snap-center snap-always w-[280px] sm:w-[320px] shrink-0 p-5 rounded-3xl bg-white/[0.03] border border-white/[0.06] hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--color-primary)]/10 transition-all duration-300 relative overflow-hidden group cursor-pointer"
                >
                    {/* Depth Effect Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className={`w-12 h-12 rounded-2xl ${kpi.bg} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                            <i className={`fa-solid ${kpi.icon} ${kpi.color} text-xl`}></i>
                        </div>
                        {kpi.trend && (
                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${kpi.trendUp ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                                <i className={`fa-solid ${kpi.trendUp ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-[10px] mr-1.5`}></i>
                                {kpi.trend}
                            </span>
                        )}
                    </div>
                    <p className="text-3xl font-black text-white tracking-tight relative z-10">{kpi.val}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1 relative z-10">{kpi.label}</p>
                </div>
            ))}
        </div>
    );
};
