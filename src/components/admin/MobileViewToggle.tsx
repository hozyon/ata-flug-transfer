import React from 'react';
import { haptic } from '../../utils/haptic';

interface MobileViewToggleProps {
  viewMode: 'table' | 'card';
  onToggle: () => void;
  itemCount?: number;
}

export const MobileViewToggle: React.FC<MobileViewToggleProps> = ({ viewMode, onToggle, itemCount }) => {
  return (
    <div className="flex items-center gap-2 md:hidden">
      {itemCount !== undefined && (
        <span className="text-[11px] text-slate-600">{itemCount} kayıt</span>
      )}
      <button
        onClick={() => { haptic.tap(); onToggle(); }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-400 hover:text-white transition-all active:scale-95"
        title={viewMode === 'table' ? 'Kart görünümüne geç' : 'Tablo görünümüne geç'}
      >
        <i className={`fa-solid ${viewMode === 'card' ? 'fa-table-list' : 'fa-grip'} text-xs`}></i>
        <span className="text-[10px] font-bold">{viewMode === 'card' ? 'Tablo' : 'Kart'}</span>
      </button>
    </div>
  );
};
