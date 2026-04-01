import React from 'react';
import { Vehicle } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppStore } from '../store/useAppStore';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect?: () => void;
}

const categoryLabel: Record<Vehicle['category'], string> = {
  Business: 'Ekonomi',
  VIP: 'VIP Van',
  'Large Group': 'VIP Minibüs',
  Premium: 'Lüks VIP',
};

const categoryFeatures: Record<Vehicle['category'], string[]> = {
  Business: ['Klima', 'Bagaj Alanı', 'Sigortalı'],
  VIP: ['Klima', 'Ücretsiz WiFi', 'Soğuk İçecek', 'USB Şarj'],
  'Large Group': ['Klima', 'WiFi', 'Geniş Bagaj', 'USB Şarj'],
  Premium: ['Deri Koltuk', 'Minibar', 'WiFi', 'Premium İkram'],
};

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect }) => {
  const { t } = useLanguage();
  const sym = useAppStore(s => s.siteContent.currency?.symbol || '€');

  const features = vehicle.features?.length ? vehicle.features : categoryFeatures[vehicle.category] || [];

  return (
    <div
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(197,160,89,0.3)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(197,160,89,0.08)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Category badge */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
          style={{ background: 'rgba(197,160,89,0.2)', border: '1px solid rgba(197,160,89,0.35)', color: '#c5a059' }}
        >
          {t(categoryLabel[vehicle.category]) || categoryLabel[vehicle.category]}
        </span>
      </div>

      {/* Vehicle image */}
      <div className="relative h-44 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
        {vehicle.image ? (
          <img
            src={vehicle.image}
            alt={vehicle.name}
            loading="lazy"
            width={400}
            height={220}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="fa-solid fa-van-shuttle text-5xl" style={{ color: 'rgba(197,160,89,0.2)' }} />
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(2,6,23,0.7) 0%, transparent 60%)' }}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-bold text-white text-base mb-0.5 group-hover:text-[#c5a059] transition-colors"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {vehicle.name}
        </h3>

        {/* Capacity */}
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center gap-1 text-white/40 text-[11px]">
            <i className="fa-solid fa-user text-[9px]" style={{ color: '#c5a059' }} />
            {t('vehicle.max') || 'Maks.'} {vehicle.capacity} {t('vehicle.persons') || 'Kişi'}
          </span>
          <span className="flex items-center gap-1 text-white/40 text-[11px]">
            <i className="fa-solid fa-suitcase text-[9px]" style={{ color: '#c5a059' }} />
            {vehicle.luggage} {t('vehicle.bags') || 'Bagaj'}
          </span>
        </div>

        {/* Features */}
        <ul className="flex flex-wrap gap-1.5 mb-4 flex-1">
          {features.slice(0, 4).map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-1 text-[10px] text-white/50 px-2 py-0.5 rounded-md"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <i className="fa-solid fa-check text-[8px]" style={{ color: '#c5a059' }} />
              {t(f) || f}
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          {vehicle.basePrice > 0 && (
            <div>
              <span className="text-white/30 text-[10px]">{t('vehicle.from') || 'İtibaren'}</span>
              <span className="font-black text-base ml-1" style={{ color: '#c5a059' }}>
                {sym}{vehicle.basePrice}
              </span>
            </div>
          )}
          <button
            onClick={onSelect}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 hover:brightness-110 active:scale-[0.97]"
            style={{ background: 'rgba(197,160,89,0.15)', border: '1px solid rgba(197,160,89,0.3)', color: '#c5a059' }}
          >
            <i className="fa-solid fa-calendar-check text-[9px]" />
            {t('vehicle.select') || 'Bu Aracı Seç'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
