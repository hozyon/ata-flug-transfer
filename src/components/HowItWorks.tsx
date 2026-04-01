import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const steps = [
  {
    icon: 'fa-calendar-check',
    titleKey: 'howItWorks.step1.title',
    titleFallback: 'Online Rezervasyon',
    descKey: 'howItWorks.step1.desc',
    descFallback: 'Web sitemizden veya WhatsApp üzerinden kolayca rezervasyon yapın. Anında onay alın.',
    number: '01',
  },
  {
    icon: 'fa-person-walking-luggage',
    titleKey: 'howItWorks.step2.title',
    titleFallback: 'Havalimanında Karşılama',
    descKey: 'howItWorks.step2.desc',
    descFallback: 'Profesyonel şoförümüz isminizin yazılı tabelayla çıkışta sizi bekler. Uçuş takibi ile gecikmede ek ücret yok.',
    number: '02',
  },
  {
    icon: 'fa-car-side',
    titleKey: 'howItWorks.step3.title',
    titleFallback: 'VIP Araçla Otelinize',
    descKey: 'howItWorks.step3.desc',
    descFallback: 'Mercedes araçlarımızla konforlu ve güvenli bir şekilde doğrudan otelinize ulaşın.',
    number: '03',
  },
];

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080c16 0%, #0a0f1c 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(197,160,89,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 reveal">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #c5a059)' }} />
            <span className="text-[10px] font-black tracking-[0.35em] uppercase" style={{ color: '#c5a059' }}>
              {t('howItWorks.eyebrow') || 'Nasıl Çalışır'}
            </span>
            <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(270deg, transparent, #c5a059)' }} />
          </div>
          <h2
            className="font-playfair font-bold text-white leading-tight"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
          >
            {t('howItWorks.title') || '3 Adımda'}{' '}
            <span className="bg-gradient-to-r from-[#c5a059] via-[#e0c07a] to-[#c5a059] bg-clip-text text-transparent">
              {t('howItWorks.titleAccent') || 'VIP Transfer'}
            </span>
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 stagger-children">
          {steps.map((step, i) => (
            <div
              key={i}
              className="reveal relative flex flex-col items-center text-center group"
            >
              {/* Connector line (only between cards on desktop) */}
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-[52px] left-[calc(50%+56px)] right-[-calc(50%-56px)] h-px"
                  style={{
                    width: 'calc(100% - 8px)',
                    marginLeft: '60px',
                    background: 'linear-gradient(90deg, rgba(197,160,89,0.4), rgba(197,160,89,0.1))',
                  }}
                />
              )}

              {/* Step number badge */}
              <div className="relative mb-5">
                <div
                  className="w-[104px] h-[104px] rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: 'rgba(197,160,89,0.08)',
                    border: '1px solid rgba(197,160,89,0.2)',
                    boxShadow: '0 0 0 8px rgba(197,160,89,0.04)',
                  }}
                >
                  <i className={`fa-solid ${step.icon} text-3xl`} style={{ color: '#c5a059' }} />
                </div>
                {/* Step number */}
                <span
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center"
                  style={{ background: '#c5a059', color: '#0f172a' }}
                >
                  {i + 1}
                </span>
              </div>

              {/* Large faded step number */}
              <div
                className="text-[72px] font-black leading-none mb-2 select-none pointer-events-none"
                style={{ color: 'rgba(197,160,89,0.06)', fontFamily: "'Outfit', sans-serif" }}
              >
                {step.number}
              </div>

              <h3
                className="font-bold text-white text-lg mb-2 group-hover:text-[#c5a059] transition-colors duration-200"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {t(step.titleKey) || step.titleFallback}
              </h3>
              <p className="text-white/45 text-sm leading-relaxed max-w-[260px]">
                {t(step.descKey) || step.descFallback}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
