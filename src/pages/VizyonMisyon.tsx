import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteContent } from '../SiteContext';
import { useLanguage } from '../i18n/LanguageContext';

const VizyonMisyon: React.FC = () => {
    const { siteContent } = useSiteContent();
    const { t } = useLanguage();
    const vm = siteContent.visionMission;

    const seo = siteContent.seo;
    const canonical = seo?.canonicalUrl || 'https://www.ataflugtransfer.com';
    const pageTitle = `Vizyon & Misyon | ${siteContent.business.name}`;
    const pageDesc = seo?.pagesSeo?.about?.description
        ? `${siteContent.business.name} vizyon ve misyonu. ${seo.pagesSeo.about.description}`
        : 'Ata Flug Transfer vizyon ve misyonu. Antalya\'da güvenilir VIP transfer hizmeti sunma amacımız ve değerlerimiz.';

    return (
        <div className="min-h-screen" style={{ background: '#020617' }}>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDesc} />
                <meta name="keywords" content={seo?.siteKeywords || 'antalya vip transfer, vizyon misyon, ata flug transfer'} />
                <meta name="robots" content={seo?.robotsDirective || 'index, follow'} />
                <link rel="canonical" href={`${canonical}/vizyon-misyon`} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDesc} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${canonical}/vizyon-misyon`} />
                <meta property="og:image" content={seo?.ogImage || ''} />
                <meta property="og:locale" content="tr_TR" />
                <meta property="og:site_name" content={siteContent.business.name} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={seo?.twitterHandle || ''} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDesc} />
            </Helmet>
            <section className="relative pt-28 pb-14 flex items-center justify-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <img src={vm?.hero?.bannerImage || "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=2000"} alt="Antalya Luxury" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/80"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-4 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                        <span>{t('vision.eyebrow')}</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-playfair font-medium text-white mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 drop-shadow-2xl">
                        {t(vm?.hero?.title || 'Vizyon & Misyon')}
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl font-light tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        {t(vm?.hero?.desc || 'Geleceğe bakışımız ve değerlerimiz.')}
                    </p>
                </div>
            </section>

            <section className="py-16 md:py-24 relative z-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #060a14 0%, #080c16 100%)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        {/* Vision Card */}
                        <div className="rounded-2xl p-8 md:p-10 hover:border-[var(--color-primary)]/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -mr-24 -mt-24 transition-all duration-500" style={{ background: 'rgba(197,160,89,0.05)' }}></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-105" style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.2)' }}>
                                    <i className="fa-solid fa-eye text-xl" style={{ color: '#c5a059' }}></i>
                                </div>
                                <h2 className="font-playfair font-bold text-white mb-3 leading-snug group-hover:text-[var(--color-primary)] transition-colors" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)' }}>{t(vm?.vision?.title || '')}</h2>
                                <p className="text-white/50 leading-relaxed text-sm mb-6">{t(vm?.vision?.desc || '')}</p>
                                <div className="space-y-3">
                                    {vm?.vision?.items?.map((item, idx) => (
                                        item ? (
                                            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl transition-colors duration-200" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(197,160,89,0.15)', color: '#c5a059' }}><i className="fa-solid fa-check text-[10px]"></i></div>
                                                <span className="text-white/60 text-sm font-medium">{t(item)}</span>
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Mission Card */}
                        <div className="rounded-2xl p-8 md:p-10 hover:border-[var(--color-primary)]/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -mr-24 -mt-24 transition-all duration-500" style={{ background: 'rgba(197,160,89,0.04)' }}></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-105" style={{ background: 'rgba(197,160,89,0.1)', border: '1px solid rgba(197,160,89,0.2)' }}>
                                    <i className="fa-solid fa-bullseye text-xl" style={{ color: '#c5a059' }}></i>
                                </div>
                                <h2 className="font-playfair font-bold text-white mb-3 leading-snug group-hover:text-[var(--color-primary)] transition-colors" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)' }}>{t(vm?.mission?.title || '')}</h2>
                                <p className="text-white/50 leading-relaxed text-sm mb-6">{t(vm?.mission?.desc || '')}</p>
                                <div className="space-y-3">
                                    {vm?.mission?.items?.map((item, idx) => (
                                        item ? (
                                            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl transition-colors duration-200" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(197,160,89,0.15)', color: '#c5a059' }}><i className="fa-solid fa-check text-[10px]"></i></div>
                                                <span className="text-white/60 text-sm font-medium">{t(item)}</span>
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-20" style={{ background: 'linear-gradient(180deg, #080c16 0%, #0a0f1c 100%)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(90deg, transparent, #c5a059)' }} />
                            <span className="text-[10px] font-black tracking-[0.35em] uppercase" style={{ color: '#c5a059' }}>{t('vision.valuesEyebrow')}</span>
                            <span className="flex-1 max-w-[72px] h-px" style={{ background: 'linear-gradient(270deg, transparent, #c5a059)' }} />
                        </div>
                        <h2 className="font-playfair font-bold text-white leading-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>{t(vm?.values?.title || '')}</h2>
                        <p className="text-white/50 mt-2 max-w-2xl mx-auto text-sm">{t(vm?.values?.desc || '')}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                        {vm?.values?.items?.map((valueItem, idx) => (
                            <div key={idx} className="rounded-2xl p-6 hover:border-[var(--color-primary)]/25 hover:shadow-md transition-all duration-200 text-center group hover:-translate-y-0.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-xl mb-4 transition-all duration-200 group-hover:scale-105" style={{ background: 'rgba(197,160,89,0.1)', color: '#c5a059', border: '1px solid rgba(197,160,89,0.2)' }}>
                                    <i className={`fa-solid ${valueItem.icon}`}></i>
                                </div>
                                <h3 className="font-playfair font-bold text-white text-base mb-2 group-hover:text-[var(--color-primary)] transition-colors">{t(valueItem.title)}</h3>
                                <p className="text-white/50 leading-relaxed text-xs">{t(valueItem.desc)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VizyonMisyon;
