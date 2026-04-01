import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const STORAGE_KEY = 'ata_cookie_consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Initializes GA4 measurement after consent is granted */
function initGA(measurementId: string) {
  if (typeof window === 'undefined' || !measurementId) return;
  if (window.gtag) return; // already loaded

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { anonymize_ip: true });
}

/** Track custom events (call after consent) */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params ?? {});
  }
}

const CookieConsent: React.FC = () => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  const GA_ID = import.meta.env.VITE_PUBLIC_GA_ID as string | undefined;

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Show banner after short delay so page settles first
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    if (stored === 'accepted' && GA_ID) {
      initGA(GA_ID);
    }
  }, [GA_ID]);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
    if (GA_ID) initGA(GA_ID);
  };

  const handleReject = () => {
    localStorage.setItem(STORAGE_KEY, 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[999] px-4 py-4 md:px-6"
      style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
    >
      <div
        className="max-w-3xl mx-auto rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{
          background: 'rgba(15,23,42,0.97)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Cookie icon */}
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.2)' }}
        >
          <i className="fa-solid fa-cookie-bite text-base" style={{ color: '#c5a059' }} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-xs leading-relaxed">
            {t('cookie.text') ||
              'Bu site, deneyiminizi iyileştirmek ve Google Analytics ile trafik analizi yapmak için çerez kullanır. Almanya\'dan ziyaretçiler için GDPR kapsamında onayınız gerekmektedir.'}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 hover:text-white/70"
            style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {t('cookie.reject') || 'Reddet'}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 hover:brightness-110"
            style={{ background: '#c5a059', color: '#0f172a' }}
          >
            {t('cookie.accept') || 'Kabul Et'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
