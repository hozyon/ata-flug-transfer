'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '../store/useAppStore';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { slugify } from '../utils/slugify';
import { DESTINATION_META } from '../data/destinationMeta';
import { INITIAL_SITE_CONTENT } from '../constants';

const TransferDestination: React.FC = () => {
  const params = useParams();
  const transferSlug = params?.region as string;
  const router = useRouter();
  const { siteContent, setBookingFormOpen } = useAppStore();
  useScrollReveal();

  // FAQ accordion state — must be before early return (Rules of Hooks)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // slug from URL is like "kemer-transfer" → strip "-transfer" to get region slug
  const regionSlug = transferSlug?.replace(/-transfer$/, '') || '';

  // find region by its slugified name
  const region = siteContent.regions.find(r => slugify(r.name) === regionSlug)
    || INITIAL_SITE_CONTENT.regions.find(r => slugify(r.name) === regionSlug);

  if (!region) { router.replace('/'); return null; }

  const meta = DESTINATION_META[regionSlug];
  const business = siteContent.business;
  const sym = siteContent.currency?.symbol || '€';

  const serviceItems = [
    { icon: 'fa-plane-arrival', title: 'Havalimanı Transferi', desc: 'Lüks Mercedes Vito araçlarımızla kesintisiz karşılama. Uçuş durumunuzu takip ediyor, rötarlarda bekliyoruz.' },
    { icon: 'fa-car-side',      title: 'Şehirlerarası Transfer',      desc: 'Mercedes Vito ve Sprinter araçlar' },
    { icon: 'fa-clock',         title: 'Uçuş Takibi',           desc: 'Rötar durumunda ek ücret alınmaz' },
    { icon: 'fa-baby',          title: 'Bebek Koltuğu',          desc: 'Ücretsiz bebek ve çocuk koltuğu' },
    { icon: 'fa-wifi',          title: 'Ücretsiz Wi-Fi',         desc: 'Araç içi internet bağlantısı' },
    { icon: 'fa-shield-halved', title: 'Güvenli Transfer',       desc: 'Sigortalı araçlar, deneyimli şoförler' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#020617' }}>
      {/* SEO handled by generateMetadata() in page.tsx */}

      {/* ── Hero Banner ── */}
      <section className="relative h-72 md:h-[420px] flex items-end overflow-hidden">
        <Image
          src={region.image || '/bg1.png'}
          alt={`${region.name} Transfer`}
          fill
          priority
          className="object-cover"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #020617 0%, rgba(2,6,23,0.65) 50%, rgba(2,6,23,0.2) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(2,6,23,0.4) 0%, transparent 60%)' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-5 pb-10 w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/40 text-[11px] mb-5 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white/70 transition-colors">ANA SAYFA</Link>
            <i className="fa-solid fa-chevron-right text-[8px]" aria-hidden="true" />
            <Link href="/bolgeler" className="hover:text-white/70 transition-colors">BÖLGELER</Link>
            <i className="fa-solid fa-chevron-right text-[8px]" aria-hidden="true" />
            <span className="text-white/60">{region.name}</span>
          </nav>

          {/* Price badge */}
          {region.price && (
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-[11px] font-black tracking-wider" style={{ background: 'rgba(197,160,89,0.15)', border: '1px solid rgba(197,160,89,0.35)', color: '#c5a059' }}>
              <i className="fa-solid fa-tag text-[9px]" aria-hidden="true" />
              İtibaren {sym}{region.price}
            </div>
          )}

          <h1 className="font-playfair font-bold text-white leading-tight mb-2" style={{ fontSize: 'clamp(1.75rem, 4vw, 3.5rem)' }}>
            {region.name} Transfer
          </h1>
          <p className="text-white/55 text-sm md:text-base">
            Antalya Havalimanı → {region.name} · VIP Özel Transfer
          </p>
        </div>
      </section>

      {/* ── Info Strip ── */}
      {meta && (
        <section style={{ background: 'rgba(197,160,89,0.06)', borderBottom: '1px solid rgba(197,160,89,0.12)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-5 py-5 grid grid-cols-3 gap-3 text-center">
            {[
              { value: `${meta.distanceKm} km`, label: 'Havalimanına Mesafe' },
              { value: `~${meta.durationMin} dk`, label: 'Transfer Süresi' },
              { value: '7/24', label: 'Hizmet' },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-lg sm:text-2xl font-black" style={{ color: '#c5a059' }}>{item.value}</div>
                <div className="text-white/40 text-[11px] mt-0.5 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Main Content ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-5 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

        {/* Left: Content */}
        <div className="lg:col-span-2 space-y-10">

          {/* About */}
          <div className="reveal">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-6" style={{ background: '#c5a059' }} />
              <span className="text-[10px] font-black tracking-[0.35em] uppercase" style={{ color: '#c5a059' }}>Transfer</span>
            </div>
            <h2 className="font-playfair font-bold text-white leading-snug mb-4" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)' }}>
              {region.name} Transfer Hizmeti
            </h2>
            {meta?.uniqueDesc && (
              <p className="text-white/50 leading-relaxed text-sm">{meta.uniqueDesc}</p>
            )}
          </div>

          {/* Highlights */}
          {meta?.highlights && meta.highlights.length > 0 && (
            <div className="reveal">
              <h2 className="font-playfair font-bold text-white mb-5" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}>
                {region.name}'de Gezilecek Yerler
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 stagger-children">
                {meta.highlights.map((h, i) => (
                  <li key={i} className="reveal flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 hover:-translate-y-0.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLLIElement).style.borderColor = 'rgba(197,160,89,0.3)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLLIElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(197,160,89,0.1)', color: '#c5a059' }}>
                      <i className="fa-solid fa-location-dot text-[11px]" aria-hidden="true"></i>
                    </span>
                    <span className="text-white/75 text-sm font-medium">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services */}
          <div className="reveal">
            <h2 className="font-playfair font-bold text-white mb-5" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}>
              {region.name} Transfer Hizmetlerimiz
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger-children">
              {serviceItems.map((s, i) => (
                <div key={i} className="reveal group flex items-start gap-4 rounded-2xl px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 cursor-default"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(197,160,89,0.3)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(197,160,89,0.04)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'; }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105" style={{ background: 'rgba(197,160,89,0.1)', color: '#c5a059', border: '1px solid rgba(197,160,89,0.2)' }}>
                    <i className={`fa-solid ${s.icon} text-sm`}></i>
                  </div>
                  <div>
                    <div className="font-semibold text-white/90 text-sm mb-0.5 group-hover:text-[#c5a059] transition-colors duration-200">{s.title}</div>
                    <div className="text-white/40 text-xs leading-relaxed">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          {meta?.faqs && meta.faqs.length > 0 && (
            <div className="reveal">
              <h2 className="font-playfair font-bold text-white mb-5" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}>
                Sıkça Sorulan Sorular
              </h2>
              <div className="space-y-2.5">
                {meta.faqs.map((faq, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden transition-all duration-200"
                    style={{ border: `1px solid ${openFaq === i ? 'rgba(197,160,89,0.3)' : 'rgba(255,255,255,0.07)'}`, background: openFaq === i ? 'rgba(197,160,89,0.04)' : 'rgba(255,255,255,0.02)' }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left min-h-[56px] hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="font-semibold text-white/85 text-sm pr-4 leading-snug">{faq.q}</span>
                      <i className={`fa-solid fa-chevron-down text-sm shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} style={{ color: '#c5a059' }} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="px-5 pb-5 pt-1 text-white/45 text-sm leading-relaxed" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: CTA Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl p-6 text-white lg:sticky lg:top-24" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
            {/* Gold top accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #c5a059, #e0c07a, rgba(197,160,89,0.2))' }} />

            <h3 className="font-playfair font-bold text-white text-base mb-1">
              {region.name} Transfer Rezervasyonu
            </h3>
            <p className="text-white/40 text-xs mb-5">En iyi fiyat garantisi · 7/24 hizmet</p>

            {/* Book Now — opens booking modal */}
            <button
              onClick={() => setBookingFormOpen(true)}
              className="w-full flex items-center justify-center gap-2.5 font-bold py-3.5 rounded-2xl mb-3 transition-all duration-200 hover:brightness-110 active:scale-[0.98] text-[#0f172a]"
              style={{ background: '#c5a059' }}
            >
              <i className="fa-solid fa-calendar-check text-sm" aria-hidden="true" />
              Hemen Rezervasyon Yap
            </button>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Merhaba, Antalya Havalimanı - ${region.name} transfer için fiyat almak istiyorum.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-2xl transition-all duration-200 hover:brightness-110 active:scale-[0.98] text-white text-sm mb-3"
              style={{ background: '#25D366' }}
            >
              <i className="fa-brands fa-whatsapp text-lg" aria-hidden="true"></i>
              WhatsApp ile Rezervasyon
            </a>

            {/* Phone */}
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="w-full flex items-center justify-center gap-2 font-medium py-2.5 rounded-xl transition-colors text-white/60 hover:text-white text-sm"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <i className="fa-solid fa-phone text-xs" style={{ color: '#c5a059' }} aria-hidden="true" />
                {business.phone}
              </a>
            )}

            {/* Meta info */}
            {meta && (
              <div className="mt-5 pt-5 space-y-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                {[
                  { label: 'Mesafe', value: `${meta.distanceKm} km` },
                  { label: 'Süre', value: `~${meta.durationMin} dk` },
                  { label: 'Ödeme', value: 'Nakit / Kart' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-white/35">{row.label}</span>
                    <span className="text-white/80 font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Other regions */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="font-semibold text-white/70 text-sm mb-4 flex items-center gap-2">
              <i className="fa-solid fa-map-location-dot text-xs" style={{ color: '#c5a059' }} aria-hidden="true" />
              Diğer Bölgeler
            </h3>
            <div className="space-y-1">
              {siteContent.regions
                .filter(r => slugify(r.name) !== regionSlug)
                .slice(0, 8)
                .map(r => (
                  <Link
                    key={r.id}
                    href={`/transfer/${slugify(r.name)}-transfer`}
                    className="flex items-center gap-2 text-white/45 hover:text-[#c5a059] text-sm py-1.5 transition-colors group"
                  >
                    <i className="fa-solid fa-location-dot text-[#c5a059]/40 group-hover:text-[#c5a059] text-[10px] transition-colors" aria-hidden="true"></i>
                    {r.name} Transfer
                  </Link>
                ))
              }
              <Link href="/bolgeler" className="flex items-center gap-1.5 text-sm py-1.5 font-bold uppercase tracking-wider transition-colors mt-2" style={{ color: '#c5a059', fontSize: '11px' }}>
                Tüm Bölgeleri Gör
                <i className="fa-solid fa-arrow-right text-[9px]" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TransferDestination;
