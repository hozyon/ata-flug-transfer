import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppStore } from '../store/useAppStore';
import { PRICING_DATA } from '../lib/pricing';
import { useScrollReveal } from '../hooks/useScrollReveal';

const vehicleTypes = [
  { key: 'ekonomi',  label: 'Ekonomi',    icon: 'fa-car',          capacity: '1-3 kişi' },
  { key: 'vipVan',   label: 'VIP Van',    icon: 'fa-van-shuttle',  capacity: '1-6 kişi' },
  { key: 'sprinter', label: 'Sprinter',   icon: 'fa-bus',          capacity: '7-13 kişi' },
  { key: 'luksVip',  label: 'Lüks VIP',  icon: 'fa-star',          capacity: '1-6 kişi' },
] as const;

const Fiyatlar: React.FC = () => {
  useScrollReveal();
  const { t } = useLanguage();
  const { siteContent } = useAppStore();
  const sym = siteContent.currency?.symbol || '€';
  const canonical = siteContent.seo?.canonicalUrl || 'https://www.ataflugtransfer.com';
  const businessName = siteContent.business.name;

  const [selectedType, setSelectedType] = useState<typeof vehicleTypes[number]['key']>('vipVan');

  // Use live prices from store if available, otherwise fall back to PRICING_DATA defaults
  const rows = PRICING_DATA.map(row => {
    const liveRegion = siteContent.regions.find(r =>
      r.name.toLowerCase().includes(row.slug) || r.name.toLowerCase() === row.region.toLowerCase()
    );
    const livePrice = liveRegion?.price;
    // Adjust prices proportionally if live base price differs from default vipVan price
    const multiplier = livePrice && row.vipVan > 0 ? livePrice / row.vipVan : 1;
    return {
      ...row,
      ekonomi: Math.round(row.ekonomi * multiplier),
      vipVan: livePrice || row.vipVan,
      sprinter: Math.round(row.sprinter * multiplier),
      luksVip: Math.round(row.luksVip * multiplier),
    };
  });

  return (
    <div className="min-h-screen" style={{ background: '#020617' }}>
      <Helmet>
        <title>Transfer Fiyatları Antalya | {businessName}</title>
        <meta name="description" content={`Antalya havalimanı transfer fiyatları. Belek, Side, Kemer, Alanya, Lara, Kaş ve tüm bölgeler için sabit fiyatlar. Ekonomi, VIP Van, Sprinter, Lüks VIP seçenekleri.`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${canonical}/fiyatlar`} />
        <meta property="og:title" content={`Transfer Fiyatları Antalya | ${businessName}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${canonical}/fiyatlar`} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: canonical },
            { '@type': 'ListItem', position: 2, name: 'Fiyatlar', item: `${canonical}/fiyatlar` },
          ],
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="pt-28 pb-12 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="h-px w-6" style={{ background: '#c5a059' }} />
          <span className="text-[10px] font-black tracking-[0.35em] uppercase" style={{ color: '#c5a059' }}>
            {t('pricing.eyebrow') || 'Transfer Fiyatları'}
          </span>
          <span className="h-px w-6" style={{ background: '#c5a059' }} />
        </div>
        <h1 className="font-playfair font-bold text-white leading-tight mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
          {t('pricing.pageTitle') || 'Antalya Havalimanı'}{' '}
          <span className="bg-gradient-to-r from-[#c5a059] via-[#e0c07a] to-[#c5a059] bg-clip-text text-transparent">
            {t('pricing.pageTitleAccent') || 'Transfer Fiyatları'}
          </span>
        </h1>
        <p className="text-white/45 text-sm max-w-lg mx-auto">
          {t('pricing.pageSubtitle') || 'Tüm fiyatlar araç başınadır (kişi başı değil). Yakıt, sigorta ve bekleme süresi dahildir.'}
        </p>

        {/* Round trip discount note */}
        <div
          className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full text-sm font-semibold"
          style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.25)', color: '#c5a059' }}
        >
          <i className="fa-solid fa-rotate text-xs" />
          {t('pricing.roundTripDiscount') || 'Gidiş-Dönüş rezervasyonlarda %10 indirim'}
        </div>
      </section>

      {/* Vehicle type tabs */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {vehicleTypes.map(vt => (
            <button
              key={vt.key}
              onClick={() => setSelectedType(vt.key)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: selectedType === vt.key ? '#c5a059' : 'rgba(255,255,255,0.04)',
                color: selectedType === vt.key ? '#0f172a' : 'rgba(255,255,255,0.5)',
                border: `1px solid ${selectedType === vt.key ? '#c5a059' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <i className={`fa-solid ${vt.icon} text-xs`} />
              <span>{t(vt.label) || vt.label}</span>
              <span className="text-[10px] opacity-60">({vt.capacity})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pricing table */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Desktop table */}
        <div className="hidden md:block rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(197,160,89,0.08)', borderBottom: '1px solid rgba(197,160,89,0.15)' }}>
                <th className="text-left px-5 py-4 text-[11px] font-black uppercase tracking-wider" style={{ color: '#c5a059' }}>
                  {t('pricing.region') || 'Bölge'}
                </th>
                <th className="text-center px-4 py-4 text-[11px] font-black uppercase tracking-wider text-white/40">
                  {t('pricing.distance') || 'Mesafe'}
                </th>
                <th className="text-center px-4 py-4 text-[11px] font-black uppercase tracking-wider text-white/40">
                  {t('pricing.duration') || 'Süre'}
                </th>
                <th className="text-center px-5 py-4 text-[11px] font-black uppercase tracking-wider" style={{ color: '#c5a059' }}>
                  {t('pricing.price') || 'Fiyat'}
                </th>
                <th className="text-center px-5 py-4 text-[11px] font-black uppercase tracking-wider text-white/20">
                  {t('pricing.action') || 'Rezervasyon'}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.slug}
                  className="transition-colors"
                  style={{
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(197,160,89,0.04)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'; }}
                >
                  <td className="px-5 py-4">
                    <Link
                      to={`/${row.slug}-transfer`}
                      className="font-semibold text-white/85 hover:text-[#c5a059] transition-colors text-sm"
                    >
                      {t(row.region) || row.region}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-center text-white/40 text-sm">{row.distanceKm} km</td>
                  <td className="px-4 py-4 text-center text-white/40 text-sm">~{row.durationMin} dk</td>
                  <td className="px-5 py-4 text-center">
                    <span className="font-black text-lg" style={{ color: '#c5a059' }}>
                      {sym}{row[selectedType]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Link
                      to={`/${row.slug}-transfer`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 hover:brightness-110"
                      style={{ background: 'rgba(197,160,89,0.15)', border: '1px solid rgba(197,160,89,0.3)', color: '#c5a059' }}
                    >
                      <i className="fa-solid fa-calendar-check text-[8px]" />
                      {t('pricing.book') || 'Rezervasyon'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {rows.map(row => (
            <div
              key={row.slug}
              className="rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link
                    to={`/${row.slug}-transfer`}
                    className="font-bold text-white/90 text-sm hover:text-[#c5a059] transition-colors"
                  >
                    {t(row.region) || row.region}
                  </Link>
                  <div className="text-white/35 text-[11px] mt-0.5">
                    {row.distanceKm} km · ~{row.durationMin} dk
                  </div>
                </div>
                <span className="font-black text-xl" style={{ color: '#c5a059' }}>
                  {sym}{row[selectedType]}
                </span>
              </div>
              <Link
                to={`/${row.slug}-transfer`}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider"
                style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.25)', color: '#c5a059' }}
              >
                <i className="fa-solid fa-calendar-check text-[9px]" />
                {t('pricing.book') || 'Rezervasyon Yap'}
              </Link>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div
          className="mt-6 p-4 rounded-xl"
          style={{ background: 'rgba(197,160,89,0.05)', border: '1px solid rgba(197,160,89,0.15)' }}
        >
          <ul className="space-y-1.5">
            {[
              t('pricing.note1') || 'Tüm fiyatlar araç başınadır, kişi başı değildir.',
              t('pricing.note2') || 'Yakıt, otopark ve sigorta fiyata dahildir.',
              t('pricing.note3') || 'Uçuş gecikmelerinde ek ücret alınmaz.',
              t('pricing.note4') || 'Bebek ve çocuk koltuğu ücretsiz temin edilir.',
              t('pricing.note5') || 'Gidiş-dönüş rezervasyonlarda %10 indirim uygulanır.',
            ].map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-white/40">
                <i className="fa-solid fa-check text-[9px] mt-0.5 flex-shrink-0" style={{ color: '#c5a059' }} />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Fiyatlar;
