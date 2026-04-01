import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppStore } from '../store/useAppStore';

const POPULAR_REGIONS = [
  { name: 'Belek',   slug: 'belek' },
  { name: 'Side',    slug: 'side' },
  { name: 'Kemer',   slug: 'kemer' },
  { name: 'Alanya',  slug: 'alanya' },
  { name: 'Lara',    slug: 'lara' },
  { name: 'Kaş',     slug: 'kas' },
];

const NotFound: React.FC = () => {
  const { t } = useLanguage();
  const siteContent = useAppStore(s => s.siteContent);
  const whatsapp = siteContent.business.whatsapp;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: '#020617' }}
    >
      <Helmet>
        <title>Sayfa Bulunamadı (404) | Ata Flug Transfer</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(197,160,89,0.08) 0%, transparent 70%)' }}
      />

      {/* 404 large */}
      <div
        className="font-black select-none mb-2"
        style={{ fontSize: 'clamp(6rem, 18vw, 12rem)', color: 'rgba(197,160,89,0.12)', lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}
      >
        404
      </div>

      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.2)' }}
      >
        <i className="fa-solid fa-map-location-dot text-2xl" style={{ color: '#c5a059' }} />
      </div>

      <h1
        className="font-playfair font-bold text-white mb-3"
        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
      >
        {t('notFound.title') || 'Sayfa Bulunamadı'}
      </h1>
      <p className="text-white/40 text-sm mb-8 max-w-sm leading-relaxed">
        {t('notFound.desc') || 'Aradığınız sayfa mevcut değil veya taşınmış olabilir. Aşağıdaki bağlantılardan devam edebilirsiniz.'}
      </p>

      {/* CTA buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:brightness-110"
          style={{ background: '#c5a059', color: '#0f172a' }}
        >
          <i className="fa-solid fa-house text-xs" />
          {t('notFound.goHome') || 'Ana Sayfaya Dön'}
        </Link>
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent('Merhaba, yardıma ihtiyacım var.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:brightness-110"
            style={{ background: '#25D366' }}
          >
            <i className="fa-brands fa-whatsapp text-base" />
            WhatsApp
          </a>
        )}
      </div>

      {/* Popular regions */}
      <div>
        <p className="text-white/30 text-[11px] font-bold uppercase tracking-widest mb-4">
          {t('notFound.popularRegions') || 'Popüler Transfer Bölgeleri'}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {POPULAR_REGIONS.map(r => (
            <Link
              key={r.slug}
              to={`/${r.slug}-transfer`}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:border-[#c5a059]/40 hover:text-[#c5a059]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)' }}
            >
              {r.name} Transfer
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
