import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { useLanguage } from '../i18n/LanguageContext';
import VehicleCard from './VehicleCard';

interface VehicleFleetProps {
  onSelectVehicle?: () => void;
}

const VehicleFleet: React.FC<VehicleFleetProps> = ({ onSelectVehicle }) => {
  const { t } = useLanguage();
  const vehicles = useAppStore(s => s.siteContent.vehicles);

  if (!vehicles || vehicles.length === 0) return null;

  return (
    <section
      id="fleet"
      className="relative py-16 md:py-24 overflow-hidden scroll-mt-20"
      style={{ background: 'linear-gradient(180deg, #0a0f1c 0%, #080c16 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-1/3 w-[500px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(197,160,89,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 reveal">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #c5a059)' }} />
            <span className="text-[10px] font-black tracking-[0.35em] uppercase" style={{ color: '#c5a059' }}>
              {t('fleet.eyebrow') || 'Araç Filosu'}
            </span>
            <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(270deg, transparent, #c5a059)' }} />
          </div>
          <h2
            className="font-playfair font-bold text-white leading-tight"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
          >
            {t('fleet.title') || 'Premium'}{' '}
            <span className="bg-gradient-to-r from-[#c5a059] via-[#e0c07a] to-[#c5a059] bg-clip-text text-transparent">
              {t('fleet.titleAccent') || 'Araç Filosumuz'}
            </span>
          </h2>
          <p className="text-white/40 text-sm mt-3 max-w-lg mx-auto">
            {t('fleet.subtitle') || 'Mercedes araçlarla konforlu ve güvenli transfer deneyimi yaşayın.'}
          </p>
        </div>

        {/* Grid — 1 col mobile, 2 tablet, 4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 stagger-children">
          {vehicles.map(vehicle => (
            <div key={vehicle.id} className="reveal">
              <VehicleCard vehicle={vehicle} onSelect={onSelectVehicle} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehicleFleet;
