import React from 'react';
import { useLongPress } from '../../hooks/useLongPress';
import { Booking } from '../../types';

interface MobileBookingItemProps {
    booking: Booking;
    onClick: (b: Booking) => void;
    onContextMenu: (e: any, b: Booking) => void;
    isToday: boolean;
}

export const MobileBookingItem: React.FC<MobileBookingItemProps> = ({ booking: b, onClick, onContextMenu, isToday }) => {
    const longPressProps = useLongPress(
        (e) => {
            let x = 0, y = 0;
            if (e.touches && e.touches.length > 0) {
                x = e.touches[0].clientX;
                y = e.touches[0].clientY;
            } else if (e.clientX && e.clientY) {
                x = e.clientX;
                y = e.clientY;
            } else {
                const rect = e.target.getBoundingClientRect();
                x = rect.left + rect.width / 2;
                y = rect.top + rect.height / 2;
            }
            onContextMenu({ clientX: x, clientY: y }, b);
        },
        () => onClick(b), // Normal click
        { delay: 400 } // Super fast long press response for "snappy" feeling
    );

    return (
        <div
            {...longPressProps}
            className={`p-4 flex items-center justify-between transition-colors relative select-none ${isToday && b.status !== 'Completed' ? 'bg-rose-500/[0.02]' : 'active:bg-white/5'}`}
        >
            <div className="flex-1 min-w-0 pr-4 pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-white truncate w-max">{b.customerName.trim()}</p>
                    {isToday && b.status !== 'Completed' && (
                        <span className="bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] text-emerald-100 text-[8px] font-black uppercase px-1.5 py-0.5 rounded animate-pulse shrink-0">Bugün</span>
                    )}
                </div>
                <p className="text-xs text-slate-400 truncate opacity-80">{b.pickup} <i className="fa-solid fa-arrow-right text-[8px] mx-1 text-[#c5a059]/50"></i> {b.destination}</p>
            </div>
            <div className="flex flex-col items-end gap-1 pointer-events-none">
                <span className="text-sm font-black text-white tabular-nums drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">€{b.totalPrice}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-md border ${b.status === 'Confirmed' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                    b.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        b.status === 'Cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                            b.status === 'Rejected' ? 'bg-slate-500/10 border-slate-500/20 text-slate-400' :
                                'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                    {{
                        'Pending': 'Beklemede',
                        'Confirmed': 'Onaylı',
                        'Completed': 'Tamamlandı',
                        'Cancelled': 'İptal',
                        'Rejected': 'Reddedildi'
                    }[b.status] || b.status}
                </span>
            </div>
        </div>
    );
};
