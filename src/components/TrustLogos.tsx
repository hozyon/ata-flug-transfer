import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const TrustLogos: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section
      className="py-10 md:py-14 border-t"
      style={{
        background: 'rgba(2,6,23,0.95)',
        borderColor: 'rgba(197,160,89,0.1)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section label */}
        <p className="text-center text-[10px] font-black tracking-[0.35em] uppercase mb-8" style={{ color: 'rgba(197,160,89,0.5)' }}>
          {t('trustLogos.label') || 'Güven & Lisans'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {/* TÜRSAB */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex items-center gap-2 px-5 py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <i className="fa-solid fa-shield-halved text-xl" style={{ color: '#c5a059' }} />
              <div>
                <div className="text-white font-black text-sm leading-tight">TÜRSAB</div>
                <div className="text-white/30 text-[9px] font-medium leading-tight">Lisanslı Turizm Firması</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-10 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* Visa */}
          <div
            className="px-5 py-3 rounded-xl flex items-center gap-1"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <i className="fa-brands fa-cc-visa text-2xl text-white/60" />
          </div>

          {/* Mastercard */}
          <div
            className="px-5 py-3 rounded-xl flex items-center gap-1"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <i className="fa-brands fa-cc-mastercard text-2xl text-white/60" />
          </div>

          {/* Cash */}
          <div
            className="px-5 py-3 rounded-xl flex items-center gap-2"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <i className="fa-solid fa-money-bill-wave text-lg text-white/60" />
            <span className="text-white/50 text-xs font-semibold">
              {t('trustLogos.cash') || 'Nakit'}
            </span>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-10 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* Secure */}
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-lock text-sm text-emerald-400/70" />
            <span className="text-white/35 text-xs font-semibold">
              {t('trustLogos.secure') || 'Güvenli Ödeme'}
            </span>
          </div>

          {/* 24/7 */}
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-headset text-sm" style={{ color: 'rgba(197,160,89,0.7)' }} />
            <span className="text-white/35 text-xs font-semibold">7/24 Destek</span>
          </div>

          {/* Free cancel */}
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-rotate-left text-sm text-white/40" />
            <span className="text-white/35 text-xs font-semibold">
              {t('trustLogos.freeCancel') || 'Ücretsiz İptal'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustLogos;
