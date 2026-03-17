import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAppStore } from '../store/useAppStore';
import { slugify } from '../utils/slugify';
import { DESTINATION_META } from '../data/destinationMeta';
import { INITIAL_SITE_CONTENT } from '../constants';

const TransferDestination: React.FC = () => {
  const { transferSlug } = useParams<{ transferSlug: string }>();
  const { siteContent } = useAppStore();

  // slug from URL is like "kemer-transfer" → strip "-transfer" to get region slug
  const regionSlug = transferSlug?.replace(/-transfer$/, '') || '';

  // find region by its slugified name
  const region = siteContent.regions.find(r => slugify(r.name) === regionSlug)
    || INITIAL_SITE_CONTENT.regions.find(r => slugify(r.name) === regionSlug);

  if (!region) return <Navigate to="/" replace />;

  const meta = DESTINATION_META[regionSlug];
  const seo = siteContent.seo;
  const business = siteContent.business;
  const canonical = seo?.canonicalUrl || 'https://ataflugtransfer.com';

  const pageTitle = `${region.name} Transfer | Antalya Havalimanı'ndan ${region.name} VIP Transfer`;
  const pageDesc = meta?.uniqueDesc || `Antalya Havalimanı'ndan ${region.name}'e konforlu VIP transfer hizmeti. 7/24 profesyonel şoförler, Mercedes araçlar, uygun fiyat garantisi.`;
  const pageKeywords = `${regionSlug.replace(/-/g, ' ')} transfer, antalya havalimani ${regionSlug.replace(/-/g, ' ')} transfer, ${region.name} vip transfer, ${region.name} otel transfer, antalya ${region.name} transfer fiyati`;

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${canonical}/${transferSlug}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${canonical}/${transferSlug}`} />
        <meta property="og:image" content={region.image || seo?.ogImage || ''} />
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:site_name" content={business.name} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": canonical },
            { "@type": "ListItem", "position": 2, "name": "Transfer Bölgeleri", "item": `${canonical}/bolgeler` },
            { "@type": "ListItem", "position": 3, "name": `${region.name} Transfer`, "item": `${canonical}/${transferSlug}` }
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": `${region.name} Transfer Hizmeti`,
          "description": pageDesc,
          "provider": {
            "@type": "LocalBusiness",
            "name": business.name,
            "telephone": business.phone,
            "url": canonical
          },
          "areaServed": {
            "@type": "Place",
            "name": region.name
          },
          "serviceType": "VIP Airport Transfer"
        })}</script>
        {meta?.faqs && (
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": meta.faqs.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": { "@type": "Answer", "text": faq.a }
            }))
          })}</script>
        )}
      </Helmet>

      {/* Hero Banner */}
      <section className="relative h-72 md:h-96 flex items-end overflow-hidden">
        <img
          src={region.image || '/bg1.png'}
          alt={`${region.name} Transfer`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 pb-10 w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <Link to="/bolgeler" className="hover:text-white transition-colors">Bölgeler</Link>
            <span>/</span>
            <span className="text-white">{region.name} Transfer</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {region.name} Transfer
          </h1>
          <p className="text-white/70 mt-2 text-base md:text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Antalya Havalimanı'ndan {region.name}'e VIP Özel Transfer
          </p>
        </div>
      </section>

      {/* Info Strip */}
      {meta && (
        <section className="bg-[#0f172a] text-white py-5">
          <div className="max-w-6xl mx-auto px-4 sm:px-5 grid grid-cols-3 gap-3 sm:gap-4 text-center">
            <div>
              <div className="text-[#c5a059] text-lg sm:text-2xl font-bold">{meta.distanceKm} km</div>
              <div className="text-white/50 text-[11px] sm:text-xs mt-1">Havalimanına Mesafe</div>
            </div>
            <div>
              <div className="text-[#c5a059] text-lg sm:text-2xl font-bold">~{meta.durationMin} dk</div>
              <div className="text-white/50 text-[11px] sm:text-xs mt-1">Transfer Süresi</div>
            </div>
            <div>
              <div className="text-[#c5a059] text-lg sm:text-2xl font-bold">7/24</div>
              <div className="text-white/50 text-[11px] sm:text-xs mt-1">Hizmet</div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-5 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left: Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* About */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {region.name} Transfer Hizmeti
            </h2>
            <p className="text-slate-600 leading-relaxed">{pageDesc}</p>
            {meta?.uniqueDesc && meta.uniqueDesc !== pageDesc && (
              <p className="text-slate-600 leading-relaxed mt-3">{meta.uniqueDesc}</p>
            )}
          </div>

          {/* Highlights */}
          {meta?.highlights && meta.highlights.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {region.name}'de Gezilecek Yerler
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {meta.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                    <span className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-[#c5a059] flex-shrink-0">
                      <i className="fa-solid fa-location-dot text-sm"></i>
                    </span>
                    <span className="text-slate-700 text-sm font-medium">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Services */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {region.name} Transfer Hizmetlerimiz
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: 'fa-plane-arrival', title: 'Havalimanı Karşılama', desc: 'İsim tabelası ile kapıda karşılama' },
                { icon: 'fa-car', title: 'VIP Araç Filosu', desc: 'Mercedes Vito ve Sprinter araçlar' },
                { icon: 'fa-clock', title: 'Uçuş Takibi', desc: 'Rötar durumunda ek ücret alınmaz' },
                { icon: 'fa-baby', title: 'Bebek Koltuğu', desc: 'Ücretsiz bebek ve çocuk koltuğu' },
                { icon: 'fa-wifi', title: 'Ücretsiz Wi-Fi', desc: 'Araç içi internet bağlantısı' },
                { icon: 'fa-shield-halved', title: 'Güvenli Transfer', desc: 'Sigortalı araçlar, deneyimli şoförler' },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-[#c5a059] flex-shrink-0">
                    <i className={`fa-solid ${s.icon}`}></i>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{s.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          {meta?.faqs && meta.faqs.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Sıkça Sorulan Sorular
              </h2>
              <div className="space-y-3">
                {meta.faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-100 p-4">
                    <h3 className="font-semibold text-slate-900 text-sm mb-2">{faq.q}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: CTA Sidebar */}
        <div className="space-y-4">
          <div className="bg-[#0f172a] rounded-2xl p-6 text-white lg:sticky lg:top-24">
            <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {region.name} Transfer Rezervasyonu
            </h3>
            <p className="text-white/60 text-sm mb-5">En iyi fiyat garantisi ile hemen rezervasyon yapın.</p>
            <a
              href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(`Merhaba, Antalya Havalimanı - ${region.name} transfer için fiyat almak istiyorum.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b558] text-white font-semibold py-3.5 rounded-xl transition-colors mb-3"
            >
              <i className="fa-brands fa-whatsapp text-xl"></i>
              WhatsApp ile Rezervasyon
            </a>
            <a
              href={`tel:${business.phone}`}
              className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              <i className="fa-solid fa-phone text-[#c5a059]"></i>
              {business.phone}
            </a>
            {meta && (
              <div className="mt-5 pt-5 border-t border-white/10 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Mesafe</span>
                  <span className="text-white font-medium">{meta.distanceKm} km</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Süre</span>
                  <span className="text-white font-medium">~{meta.durationMin} dk</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Ödeme</span>
                  <span className="text-white font-medium">Nakit / Kart</span>
                </div>
              </div>
            )}
          </div>

          {/* Other regions */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Diğer Bölgeler</h3>
            <div className="space-y-1">
              {siteContent.regions
                .filter(r => slugify(r.name) !== regionSlug)
                .slice(0, 8)
                .map(r => (
                  <Link
                    key={r.id}
                    to={`/${slugify(r.name)}-transfer`}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#c5a059] text-sm py-1 transition-colors"
                  >
                    <i className="fa-solid fa-location-dot text-[#c5a059] text-xs"></i>
                    {r.name} Transfer
                  </Link>
                ))
              }
              <Link to="/bolgeler" className="flex items-center gap-2 text-[#c5a059] hover:text-amber-600 text-sm py-1 font-medium transition-colors mt-2">
                Tüm Bölgeleri Gör →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TransferDestination;
