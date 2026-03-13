import { useState, useEffect } from 'react';

type ViewMode = 'table' | 'card';

const STORAGE_KEY = 'ata_admin_view_mode';

function getIsMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'table';
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'table' || saved === 'card') return saved;
    return getIsMobile() ? 'card' : 'table';
  });

  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = getIsMobile();
      setIsMobile(mobile);
      // Auto-switch to card on mobile if user hasn't explicitly chosen
      if (mobile && !localStorage.getItem(STORAGE_KEY)) {
        setViewMode('card');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleViewMode = () => {
    setViewMode(prev => {
      const next = prev === 'table' ? 'card' : 'table';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return { viewMode, isMobile, toggleViewMode };
}
