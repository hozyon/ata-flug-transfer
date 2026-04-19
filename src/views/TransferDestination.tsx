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

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const regionSlug = transferSlug?.replace(/-transfer$/, '') || '';

  const region = siteContent.regions.find(r => slugify(r.name) === regionSlug)
    || INITIAL_SITE_CONTENT.regions.find(r => slugify(r.name) === regionSlug);

  if (!region) { router.replace('/'); return null; }

  const meta = DESTINATION_META[regionSlug];
  const business = siteContent.business;
  const sym = siteContent.currency?.symbol || '€';

  const serviceItems = [
    { icon: 'fa-plane-arrival', title: 'Karşılama', desc: 'Rötar bağımsız, zamanında VIP karşılama.' },
    { icon: 'fa-car-side',      title: 'Premium Filo', desc: '100% lüks segment Mercedes-Benz araçlar.' },
    { icon: 'fa-baby',          title: 'Çocuk Koltuğu', desc: 'Sertifikalı güvenlik donanımı.' },
    { icon: 'fa-shield-halved', title: 'Protokol Tipi', desc: 'Yabancı dil bilen profesyonel şoförler.' },
  ];

  return (
    <div className="min-h-screen bg-white text-[#111]">
      {/* ── Banner ── */}
      <section className="pt-40 pb-20 border-b border-gray-100 reveal">
          <div className="max-w-[1400px] mx-auto px-6">
              <nav className="flex items-center gap-3 text-xs mb-8 font-bold uppercase tracking-[0.2em] text-[#888]" aria-label="Breadcrumb">
                  <Link href="/" className="hover:text-[#111] transition-colors">Ana Sayfa</Link>
                  <span className="w-4 h-[1px] bg-gray-300" />
                  <Link href="/bolgeler" className="hover:text-[#111] transition-colors">Bölgeler</Link>
                  <span className="w-4 h-[1px] bg-gray-300" />
                  <span className="text-[#111]">{region.name}</span>
              </nav>

              <div className="flex flex-col md:flex-row justify-between md:items-end gap-10">
                  <h1 className="font-playfair font-medium text-[#111] leading-[0.9] text-6xl sm:text-[100px] tracking-tighter">
                      {region.name} <br/>
                      <span className="italic font-light text-[#555]">Transfer.</span>
                  </h1>
                  {region.price && (
                      <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888] mb-1">Sabit Tarife</p>
                          <p className="text-4xl font-playfair">{sym}{region.price}</p>
                      </div>
                  )}
              </div>
          </div>
      </section>

      {/* ── Info Strip ── */}
      {meta && (
        <section className="border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { value: `${meta.distanceKm} KM`, label: 'Seyahat Mesafesi' },
              { value: `~${meta.durationMin} DK`, label: 'Planlanan Süre' },
              { value: '7/24', label: 'Operasyon Durumu' },
            ].map((item, i) => (
              <div key={i} className="border-l border-gray-200 pl-6">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-bold mb-2">{item.label}</div>
                <div className="text-3xl font-playfair text-[#111]">{item.value}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Main Content ── */}
      <section className="max-w-[1400px] mx-auto px-6 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        
        {/* Left: Content */}
        <div className="lg:col-span-8 space-y-24">
          
          <div className="relative aspect-[21/9] bg-gray-100 mb-16 overflow-hidden reveal">
            <Image src={region.image || '/bg1.png'} alt={`${region.name} Transfer`} fill priority className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
          </div>

          <div className="reveal">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888] border-b border-[#111] pb-1 inline-block mb-8">
              Hizmet Detayları
            </h2>
            <h3 className="text-4xl sm:text-5xl font-playfair text-[#111] mb-8 leading-tight">Zamanın durduğu <br className="hidden sm:block"/> o özel yolculuk.</h3>
            {meta?.uniqueDesc && (
              <p className="text-[#555] opacity-90 leading-relaxed font-outfit text-base max-w-2xl text-justify">{meta.uniqueDesc}</p>
            )}
          </div>

          {meta?.highlights && meta.highlights.length > 0 && (
            <div className="reveal">
              <h2 className="text-3xl font-playfair text-[#111] mb-8 border-t border-gray-200 pt-8">Rota Üzerinde</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                {meta.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-100">
                    <span className="text-[#888] text-[10px] mt-1"><i className="fa-solid fa-diamond" /></span>
                    <span className="text-[#111] font-outfit text-sm">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="reveal">
            <h2 className="text-3xl font-playfair text-[#111] mb-8 border-t border-gray-200 pt-8">Protokol Ayrıcalıkları</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
              {serviceItems.map((s, i) => (
                <div key={i} className="flex flex-col gap-4 group">
                  <div className="text-2xl text-[#111] group-hover:italic transition-all"><i className={`fa-solid ${s.icon}`}></i></div>
                  <div>
                    <h4 className="font-playfair text-xl text-[#111] mb-2">{s.title}</h4>
                    <p className="text-[#888] text-xs font-outfit leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {meta?.faqs && meta.faqs.length > 0 && (
            <div className="reveal border-t border-gray-200 pt-8">
              <h2 className="text-3xl font-playfair text-[#111] mb-8">Sık Sorulan Sorular</h2>
              <div className="space-y-0">
                {meta.faqs.map((faq, i) => (
                  <div key={i} className="border-b border-gray-200">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between py-6 text-left"
                    >
                      <span className="font-outfit font-bold text-[#111] text-base">{faq.q}</span>
                      <i className={`fa-solid fa-plus text-xs transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-64 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                      <p className="text-[#555] font-outfit text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-[#fafafa] border border-gray-200 p-8 sm:p-12 lg:sticky lg:top-32 reveal-right">
            <h3 className="font-playfair font-medium text-3xl text-[#111] mb-2">{region.name}</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888] mb-12">VIP Rezervasyon</p>
            
            <button
              onClick={() => setBookingFormOpen(true)}
              className="w-full h-16 bg-[#111] text-white font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-[#333] transition-colors mb-4 flex items-center justify-center gap-3"
            >
              Hemen Rezervasyon
            </button>

            <a
              href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Merhaba, Antalya Havalimanı - ${region.name} transfer talebim var.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-16 bg-transparent border border-gray-300 text-[#111] font-bold text-[10px] uppercase tracking-[0.3em] hover:border-[#111] transition-colors mb-12 flex items-center justify-center gap-3"
            >
              WhatsApp
            </a>

            <div className="pt-8 border-t border-gray-200">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] mb-6">Alternatif Notalar</h4>
                <div className="space-y-4">
                  {siteContent.regions.filter(r => slugify(r.name) !== regionSlug).slice(0, 5).map(r => (
                    <Link
                      key={r.id}
                      href={`/transfer/${slugify(r.name)}-transfer`}
                      className="group flex justify-between items-center text-xs font-outfit text-[#555] hover:text-[#111] transition-colors"
                    >
                      <span>{r.name} Rotaları</span>
                      <i className="fa-solid fa-arrow-right text-[8px] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default TransferDestination;
