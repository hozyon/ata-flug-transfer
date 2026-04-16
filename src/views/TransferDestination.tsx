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
    { icon: 'fa-plane-arrival', title: 'Havalimanı Transferi', desc: 'Lüks Mercedes Vito araçlarımızla kesintisiz karşılama.' },
    { icon: 'fa-car-side',      title: 'Şehirlerarası Transfer',      desc: 'Mercedes Vito ve Sprinter araçlar.' },
    { icon: 'fa-clock',         title: 'Uçuş Takibi',           desc: 'Rötar durumunda ek ücret alınmaz.' },
    { icon: 'fa-baby',          title: 'Bebek Koltuğu',          desc: 'Ücretsiz bebek ve çocuk koltuğu.' },
    { icon: 'fa-wifi',          title: 'Ücretsiz Wi-Fi',         desc: 'Araç içi yüksek hızda internet.' },
    { icon: 'fa-shield-halved', title: 'Güvenli Transfer',       desc: 'Sigortalı araçlar, deneyimli şoförler.' },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* ── Editorial Hero ── */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end overflow-hidden bg-white">
        <Image
          src={region.image || '/bg1.webp'}
          alt={`${region.name} Transfer`}
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full">
            <div className="reveal">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-8" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-black transition-colors">ANA SAYFA</Link>
                    <span className="w-1 h-1 rounded-full bg-black/10"></span>
                    <Link href="/bolgeler" className="hover:text-black transition-colors">BÖLGELER</Link>
                    <span className="w-1 h-1 rounded-full bg-black/10"></span>
                    <span className="text-black/40">{region.name}</span>
                </nav>

                <h1 className="text-5xl md:text-8xl font-playfair font-medium text-[#0a0a0a] leading-[0.9] tracking-tighter mb-6">
                    {region.name} <br /><span className="italic text-[#c5a059]">VIP Transfer</span>
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 mt-10">
                    {region.price && (
                        <div className="px-6 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">
                            {sym}{region.price}'den Başlayan Fiyatlar
                        </div>
                    )}
                    <button 
                        onClick={() => setBookingFormOpen(true)}
                        className="px-6 py-3 bg-[#c5a059] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#b08d48] transition-all"
                    >
                        Rezervasyon Yap
                    </button>
                </div>
            </div>
        </div>
      </section>

      {/* ── Info Bar ── */}
      {meta && (
        <section className="bg-white border-y border-black/[0.03] py-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { value: `${meta.distanceKm} km`, label: 'Mesafe', icon: 'fa-route' },
              { value: `~${meta.durationMin} dk`, label: 'Tahmini Süre', icon: 'fa-clock' },
              { value: '7/24', label: 'VIP Hizmet', icon: 'fa-star' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 reveal">
                <div className="w-12 h-12 rounded-2xl bg-[#fafafa] flex items-center justify-center text-[#c5a059] border border-black/[0.02]">
                    <i className={`fa-solid ${item.icon} text-lg`}></i>
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 mb-1">{item.label}</p>
                    <p className="text-2xl font-bold text-[#0a0a0a] tracking-tight">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Main Content ── */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                
                {/* Left Side */}
                <div className="lg:col-span-8 space-y-24">
                    
                    {/* Unique Desc */}
                    <div className="reveal">
                        <h2 className="text-3xl md:text-5xl font-playfair font-medium text-[#0a0a0a] mb-10 tracking-tight leading-tight">
                            Kusursuz Bir <span className="italic text-[#c5a059]">{region.name}</span> Yolculuğu
                        </h2>
                        <div className="text-[#444] text-lg md:text-xl font-light leading-relaxed border-l border-[#c5a059]/30 pl-10">
                            {meta?.uniqueDesc || `${region.name} bölgesine yapacağınız yolculukta en üst düzey konforu ve güvenliği garanti ediyoruz. Özel şoförlerimiz sizi havalimanında isminizle karşılar ve lüks aracınıza kadar eşlik eder.`}
                        </div>
                    </div>

                    {/* Services Grid */}
                    <div className="reveal">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#c5a059] mb-12">HİZMET AYRICALIKLARI</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal-stagger">
                            {serviceItems.map((s, i) => (
                                <div key={i} className="group p-10 rounded-[2.5rem] bg-white border border-black/[0.03] transition-all duration-700 hover:editorial-shadow-lg">
                                    <div className="w-12 h-12 rounded-2xl bg-[#fafafa] flex items-center justify-center mb-8 text-[#c5a059] transition-colors group-hover:bg-[#c5a059] group-hover:text-white">
                                        <i className={`fa-solid ${s.icon} text-lg`}></i>
                                    </div>
                                    <h4 className="text-xl font-bold text-[#0a0a0a] mb-4 tracking-tight">{s.title}</h4>
                                    <p className="text-[#666] text-sm font-light leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    {meta?.faqs && meta.faqs.length > 0 && (
                        <div className="reveal">
                            <h3 className="text-3xl font-playfair font-medium text-[#0a0a0a] mb-12 tracking-tight">Sıkça Sorulan Sorular</h3>
                            <div className="space-y-4">
                                {meta.faqs.map((faq, i) => (
                                    <div key={i} className="bg-white rounded-3xl border border-black/[0.03] overflow-hidden transition-all duration-500">
                                        <button 
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full px-8 py-6 flex items-center justify-between text-left group"
                                        >
                                            <span className="font-bold text-[#1a1a1a] pr-8 text-base tracking-tight group-hover:text-[#c5a059] transition-colors">{faq.q}</span>
                                            <div className={`w-8 h-8 rounded-full bg-[#fafafa] flex items-center justify-center transition-all duration-500 ${openFaq === i ? 'bg-[#c5a059] text-white rotate-180' : 'text-black/20'}`}>
                                                <i className="fa-solid fa-chevron-down text-[8px]"></i>
                                            </div>
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-500 ${openFaq === i ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <div className="px-8 pb-8 pt-2 border-t border-black/5">
                                                <p className="text-[#666] text-sm font-light leading-relaxed">{faq.a}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side Sidebar */}
                <div className="lg:col-span-4">
                    <div className="sticky top-32 space-y-8">
                        {/* Booking Card */}
                        <div className="bg-white p-10 rounded-[3rem] border border-black/[0.05] editorial-shadow-lg text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#c5a059]"></div>
                            <h3 className="text-2xl font-playfair font-bold text-[#0a0a0a] mb-4">Hemen Başlayın</h3>
                            <p className="text-[#666] text-sm font-light mb-10 leading-relaxed">{region.name} transferiniz için en uygun fiyatla yerinizi ayırtın.</p>
                            
                            <button 
                                onClick={() => setBookingFormOpen(true)}
                                className="w-full bg-[#0a0a0a] text-white font-bold py-5 rounded-full hover:bg-[#c5a059] transition-all duration-500 uppercase tracking-[0.2em] text-[10px] mb-4 shadow-xl"
                            >
                                Online Rezervasyon
                            </button>
                            
                            <a 
                                href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Merhaba, ${region.name} transferi için bilgi almak istiyorum.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold py-5 rounded-full hover:brightness-110 transition-all uppercase tracking-[0.2em] text-[10px] mb-8"
                            >
                                <i className="fa-brands fa-whatsapp text-lg"></i>
                                WhatsApp'tan Yaz
                            </a>
                            
                            <div className="pt-8 border-t border-black/5 space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-black/30">
                                    <span>7/24 DesteK</span>
                                    <span className="text-[#c5a059]">{business.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-[#fafafa] p-10 rounded-[3rem] border border-black/[0.03]">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-6">DİĞER ROTALAR</h4>
                            <div className="space-y-2">
                                {siteContent.regions.slice(0, 6).map((r, i) => (
                                    <Link key={i} href={`/transfer/${slugify(r.name)}-transfer`} className="block py-2 text-sm text-black/60 hover:text-[#c5a059] transition-colors border-b border-black/[0.02]">
                                        {r.name} Transfer
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default TransferDestination;
