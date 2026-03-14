import React, { useState, useRef, useEffect } from 'react';
import { haptic } from '../../utils/haptic';

interface CommandItem {
  id: string;
  type: 'page' | 'action';
  label: string;
  icon: string;
  description: string;
}

interface MobileSpotlightProps {
  items: CommandItem[];
  onExecute: (item: CommandItem) => void;
}

export const MobileSpotlight: React.FC<MobileSpotlightProps> = ({ items, onExecute }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  const filtered = search.trim()
    ? items.filter(i => i.label.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()))
    : items;

  const pages = filtered.filter(i => i.type === 'page');
  const actions = filtered.filter(i => i.type === 'action');

  return (
    <>
      <button
        onClick={() => { haptic.tap(); setIsOpen(true); }}
        className="xl:hidden fixed right-4 z-[55] w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-amber-600 shadow-lg shadow-[var(--color-primary)]/30 flex items-center justify-center text-white active:scale-90 transition-transform"
        style={{ bottom: 'calc(80px + env(safe-area-inset-bottom, 16px))' }}
      >
        <i className="fa-solid fa-magnifying-glass text-sm"></i>
      </button>

      {/* Bottom Sheet */}
      {isOpen && (
        <div className="xl:hidden fixed inset-0 z-[200]">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          {/* Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-[28px] border-t border-white/[0.08] animate-in slide-in-from-bottom duration-300 max-h-[80vh] flex flex-col"
            style={{ background: 'rgba(6, 8, 15, 0.97)', backdropFilter: 'blur(40px)' }}
          >
            {/* Handle */}
            <div className="pt-3 pb-2 flex justify-center shrink-0">
              <div className="w-9 h-1 rounded-full bg-white/15" />
            </div>

            {/* Search */}
            <div className="px-5 pb-4 shrink-0">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Sayfa veya komut ara..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/[0.06] border border-white/[0.08] rounded-2xl text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 outline-none transition-all"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <i className="fa-solid fa-xmark text-xs"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto overscroll-y-contain px-5 pb-8 scrollbar-hide">
              {pages.length > 0 && (
                <>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.15em] mb-2">Sayfalar</p>
                  <div className="space-y-1 mb-4">
                    {pages.map(item => (
                      <button
                        key={item.id}
                        onClick={() => { haptic.tap(); onExecute(item); setIsOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors text-left"
                      >
                        <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0">
                          <i className={`fa-solid ${item.icon} text-[var(--color-primary)] text-sm`}></i>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{item.label}</p>
                          <p className="text-[10px] text-slate-500 truncate">{item.description}</p>
                        </div>
                        <i className="fa-solid fa-chevron-right text-[10px] text-slate-700 ml-auto shrink-0"></i>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {actions.length > 0 && (
                <>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.15em] mb-2">Aksiyonlar</p>
                  <div className="space-y-1 mb-4">
                    {actions.map(item => (
                      <button
                        key={item.id}
                        onClick={() => { haptic.tap(); onExecute(item); setIsOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors text-left"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                          <i className={`fa-solid ${item.icon} text-[var(--color-primary)] text-sm`}></i>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{item.label}</p>
                          <p className="text-[10px] text-slate-500 truncate">{item.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {filtered.length === 0 && (
                <div className="text-center py-8">
                  <i className="fa-solid fa-search text-3xl text-slate-700 mb-3 block"></i>
                  <p className="text-slate-500 text-sm font-medium">Sonuç bulunamadı</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
