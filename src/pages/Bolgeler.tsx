import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Fuse from 'fuse.js';
import { INITIAL_SITE_CONTENT } from '../constants';
import TextureBackground from '../components/TextureBackground';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppStore } from '../store/useAppStore';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Bolgeler: React.FC = () => {
    useScrollReveal();
    const { t, language } = useLanguage();
    const { siteContent } = useAppStore();
    // Language → flag mapping
    const FLAGS: Record<string, string> = {
        en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', ru: '🇷🇺', ar: '🇸🇦', tr: '🇹🇷'
    };

    // Build bilingual WhatsApp message (user's language + Turkish)
    const buildWaMessage = (regionName: string) => {
        const trMsg = `Merhaba, *${regionName}* bölgesi için transfer fiyat bilgisi almak istiyorum.`;

        if (language === 'tr') {
            return encodeURIComponent(
                `✈️ *${siteContent.business.name}*\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n🇹🇷 *Transfer Fiyat Talebi*\n\n🚐  *Bölge:* ${regionName}\n📩  ${trMsg}\n\n⏳ _Yanıt süresi: ~2 dakika_`
            );
        }

        const flag = FLAGS[language] || '🌐';
        const translatedMsg = t(`Merhaba, *${regionName}* bölgesi için transfer fiyat bilgisi almak istiyorum.`);
        const translatedPriceReq = t('Transfer Fiyat Talebi');
        const translatedRegion = t('Bölge');

        return encodeURIComponent(
            `✈️ *${siteContent.business.name}*\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n${flag} *${translatedPriceReq}*\n\n🚐  *${translatedRegion}:* ${regionName}\n📩  ${translatedMsg}\n\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n🇹🇷 *Transfer Fiyat Talebi*\n\n🚐  *Bölge:* ${regionName}\n📩  ${trMsg}`
        );
    };
    const [regions, setRegions] = React.useState(siteContent.regions || INITIAL_SITE_CONTENT.regions);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isAnimating, setIsAnimating] = React.useState(false);
    const location = useLocation();

    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q');
        if (q) {
            setSearchTerm(q);
        }
    }, [location.search]);

    React.useEffect(() => {
        if (siteContent.regions && siteContent.regions.length > 0) {
            setRegions(siteContent.regions);
        }
    }, [siteContent.regions]);

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 8;

    // Initialize Fuse with useMemo for performance
    const fuse = React.useMemo(() => {
        return new Fuse(regions, {
            keys: ['name'],
            threshold: 0.2, // Stricter matching (was 0.4)
            distance: 100,
            includeScore: true
        });
    }, [regions]);

    // Advanced Filtering Logic
    const filteredRegions = React.useMemo(() => {
        if (!searchTerm.trim()) return regions;

        // Use Fuse.js for fuzzy matching
        const results = fuse.search(searchTerm);
        return results.map(result => result.item);
    }, [searchTerm, regions, fuse]);

    // Trigger visual feedback (blink) on search update
    React.useEffect(() => {
        if (searchTerm) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 500); // 0.5s blink
            return () => clearTimeout(timer);
        }
    }, [searchTerm, filteredRegions]); // Trigger when results change

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRegions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRegions.length / itemsPerPage);

    const DISTANCE_MAP: Record<string, { dist: string; time: string }> = {
        "Antalya Havalimanı (AYT)": { "dist": "0 km", "time": "0 dk" },
        "Antalya (Merkez)": { "dist": "15 km", "time": "20 dk" },
        "Kundu": { "dist": "16 km", "time": "20 dk" },
        "Konyaaltı": { "dist": "32 km", "time": "40 dk" },
        "Belek": { "dist": "33 km", "time": "35 dk" },
        "Çolaklı": { "dist": "57 km", "time": "55 dk" },
        "Evrenseki": { "dist": "60 km", "time": "55 dk" },
        "Kumköy": { "dist": "61 km", "time": "55 dk" },
        "Side": { "dist": "68 km", "time": "65 dk" },
        "Beldibi": { "dist": "47 km", "time": "55 dk" },
        "Göynük": { "dist": "54 km", "time": "60 dk" },
        "Kemer": { "dist": "60 km", "time": "65 dk" },
        "Tekirova": { "dist": "75 km", "time": "70 dk" },
        "Kızılağaç": { "dist": "85 km", "time": "75 dk" },
        "Okurcalar": { "dist": "97 km", "time": "85 dk" },
        "İncekum": { "dist": "100 km", "time": "85 dk" },
        "Türkler": { "dist": "107 km", "time": "95 dk" },
        "Konaklı": { "dist": "113 km", "time": "100 dk" },
        "Alanya": { "dist": "118 km", "time": "105 dk" },
        "Mahmutlar": { "dist": "140 km", "time": "125 dk" },
        "Kargıcak": { "dist": "143 km", "time": "130 dk" },
        "Adrasan": { "dist": "110 km", "time": "105 dk" },
        "Lara": { "dist": "15 km", "time": "25 dk" },
        "Bodrum": { "dist": "420 km", "time": "5 sa" },
        "Dalaman": { "dist": "240 km", "time": "3.5 sa" },
        "Fethiye": { "dist": "200 km", "time": "3 sa" },
        "Göcek": { "dist": "220 km", "time": "3.2 sa" },
        "Marmaris": { "dist": "320 km", "time": "4.5 sa" },
        "Ölüdeniz": { "dist": "210 km", "time": "3.2 sa" },
        "Avsallar": { "dist": "102 km", "time": "90 dk" },
        "Boğazkent": { "dist": "43 km", "time": "45 dk" },
        "Çamyuva": { "dist": "67 km", "time": "65 dk" },
        "Çıralı": { "dist": "97 km", "time": "95 dk" },
        "Demre": { "dist": "156 km", "time": "140 dk" },
        "Denizyaka": { "dist": "44 km", "time": "45 dk" },
        "Finike": { "dist": "129 km", "time": "110 dk" },
        "Gündoğdu": { "dist": "56 km", "time": "55 dk" },
        "Kalkan": { "dist": "215 km", "time": "3.5 sa" },
        "Kaş": { "dist": "205 km", "time": "3.2 sa" },
        "Kestel": { "dist": "134 km", "time": "120 dk" },
        "Kızılot": { "dist": "82 km", "time": "75 dk" },
        "Kiriş": { "dist": "67 km", "time": "70 dk" },
        "Kumluca": { "dist": "95 km", "time": "85 dk" },
        "Manavgat": { "dist": "75 km", "time": "70 dk" },
        "Olimpos": { "dist": "99 km", "time": "95 dk" },
        "Sorgun": { "dist": "73 km", "time": "70 dk" },
        "Titreyengöl": { "dist": "73 km", "time": "70 dk" },
        "Kadriye": { "dist": "27 km", "time": "30 dk" }
    };

    const seo = siteContent.seo || INITIAL_SITE_CONTENT.seo;
    const canonical = seo.canonicalUrl || '';
    const pageTitle = seo.pagesSeo?.regions?.title || INITIAL_SITE_CONTENT.seo.pagesSeo.regions.title;
    const pageDesc = seo.pagesSeo?.regions?.description || INITIAL_SITE_CONTENT.seo.pagesSeo.regions.description;

    return (
        <div className="min-h-screen bg-slate-50">
            <Helmet>
                <title>{pageTitle} | {siteContent.business.name}</title>
                <meta name="description" content={pageDesc} />
                <meta name="keywords" content={seo.pagesSeo?.regions?.keywords || seo.siteKeywords} />
                <meta name="robots" content={seo.robotsDirective} />
                <link rel="canonical" href={`${canonical}/bolgeler`} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDesc} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${canonical}/bolgeler`} />
                <meta property="og:image" content={seo.ogImage} />
                <meta property="og:locale" content="tr_TR" />
                <meta property="og:site_name" content={siteContent.business.name} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={seo.twitterHandle} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDesc} />
                <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": canonical || "https://ataflugtransfer.com" },
                        { "@type": "ListItem", "position": 2, "name": "Transfer Bölgeleri", "item": `${canonical}/bolgeler` }
                    ]
                })}</script>
                <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "name": "Antalya Transfer Bölgeleri",
                    "description": "Antalya Havalimanı'ndan transfer hizmeti sunulan tüm bölgeler",
                    "itemListElement": regions.slice(0, 20).map((region, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "name": `${region.name} Transfer`,
                        "url": `${canonical}/bolgeler#${region.name.toLowerCase().replace(/\s+/g, '-').replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's').replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c')}`
                    }))
                })}</script>
            </Helmet>
            {/* Custom Animation Styles */}
            <style>{`
                @property --angle {
                  syntax: '<angle>';
                  initial-value: 0deg;
                  inherits: false;
                }
                
                @keyframes rotate {
                    to {
                        --angle: 360deg;
                    }
                }
                
                .animate-border-rotate {
                    position: relative;
                    z-index: 0;
                    overflow: hidden;
                    border-radius: 1rem; /* rounded-2xl */
                    padding: 2px; /* Slight thickness for visibility */
                    display: flex;
                    /* Outer Neon Glow */
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3), 0 0 40px rgba(197, 160, 89, 0.1); 
                }
                
                .animate-border-rotate::before {
                    content: "";
                    position: absolute;
                    z-index: -1;
                    inset: 0;
                    margin: -50%;
                    width: 200%;
                    height: 200%;
                    background: conic-gradient(
                        from var(--angle), 
                        #ff4545, 
                        #00ff99, 
                        #006aff, 
                        #ff0095, 
                        #ff4545
                    );
                    animation: rotate 6s linear infinite;
                }
                
                .animate-border-rotate::after {
                    content: "";
                    position: absolute;
                    z-index: -1;
                    inset: 2px; /* Match padding */
                    background: white;
                    border-radius: calc(1rem - 2px);
                    /* Inner Neon Glow (Simulated with Inset Shadow) */
                    box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.05); 
                }
            `}</style>

            {/* STANDARDIZED HERO SECTION - IMAGE BACKGROUND */}
            <section className="relative pt-28 pb-12 overflow-hidden border-b border-white/5">
                {/* ... existing hero code ... */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/antalya-map-safe.png"
                        alt="Antalya Map Safe Zone"
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/60"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-4 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                        <span>{t('regionsPage.eyebrow')}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-playfair font-medium text-white mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 drop-shadow-2xl">
                        {t('regionsPage.title')}
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl font-light tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        {t('regionsPage.subtitle')}
                    </p>

                    <div className="mt-8 max-w-lg mx-auto relative animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fa-solid fa-search text-white/60 text-lg"></i>
                        </div>
                        <input
                            type="text"
                            placeholder={t('regionsPage.search')}
                            aria-label="Bölge ara"
                            className="block w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all shadow-2xl"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Regions Grid */}
            <section className="pt-6 pb-16 relative z-20 overflow-hidden">
                <TextureBackground />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                        {currentItems.length > 0 ? (
                            currentItems.map((region) => {
                                const distInfo = DISTANCE_MAP[region.name] || { dist: '-- km', time: '-- dk' };
                                const shouldAnimate = searchTerm && currentItems.length < 5;

                                return (
                                    <div
                                        key={region.id}
                                        className={shouldAnimate ? "animate-border-rotate" : "h-full"}
                                    >
                                        <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 transform hover:-translate-y-1">
                                            {/* Image Container */}
                                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                                <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                                                <img
                                                    src={region.image}
                                                    alt={region.name}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] will-change-transform"
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                                {region.price && (
                                                    <div className="absolute top-4 left-4 z-20">
                                                        <span className="inline-block px-3 py-1 bg-white text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                                                            {region.price}{siteContent.currency?.symbol || '€'} {t('regionsPage.startingFrom')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 p-5 flex flex-col">
                                                <h3 className="text-lg font-playfair font-bold text-slate-800 mb-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug line-clamp-1">
                                                    {region.name}
                                                </h3>
                                                <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
                                                    {t(region.desc)}
                                                </p>

                                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                                                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium">
                                                        <i className="fa-solid fa-route text-[var(--color-primary)]"></i>
                                                        <span>{distInfo.dist} / {distInfo.time}</span>
                                                    </div>
                                                    <a
                                                        href={`https://wa.me/${siteContent.business.whatsapp}?text=${buildWaMessage(region.name)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                                                    >
                                                        <span>{t('regionsPage.getPrice')}</span>
                                                        <i className="fa-solid fa-arrow-right"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-16 text-center">
                                <div className="inline-block p-6 rounded-full bg-slate-50 mb-4">
                                    <i className="fas fa-search text-4xl text-slate-300"></i>
                                </div>
                                <h3 className="text-lg font-medium text-slate-900">{t('regionsPage.noResult')}</h3>
                                <p className="text-slate-500 mt-2">{t('regionsPage.noResultDesc')}</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage(cms => Math.max(cms - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-11 h-11 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>

                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-11 h-11 flex items-center justify-center rounded-lg border transition-colors ${currentPage === page
                                            ? 'bg-[var(--color-dark)] border-[var(--color-dark)] text-white'
                                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage(cms => Math.min(cms + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="w-11 h-11 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-[var(--color-dark)]">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white">{t('regionsPage.ctaTitle')}</h2>
                    <p className="text-slate-300 mt-4">{t('regionsPage.ctaDesc')}</p>
                    <a
                        href={`https://wa.me/${siteContent.business.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[#d4af6a] text-black font-bold px-8 py-4 rounded-full mt-8 transition-all duration-200 active:scale-[0.98]"
                    >
                        <i className="fab fa-whatsapp text-xl"></i>
                        {t('regionsPage.ctaBtn')}
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Bolgeler;
