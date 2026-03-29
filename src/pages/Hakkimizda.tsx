import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteContent } from '../SiteContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Hakkimizda: React.FC = () => {
    const { siteContent } = useSiteContent();
    const { t } = useLanguage();
    const about = siteContent.about;
    const business = siteContent.business;

    useScrollReveal();

    const features = [
        { icon: "fa-shield-halved", title: t('about.feat1.title'), desc: t('about.feat1.desc') },
        { icon: "fa-car", title: t('about.feat2.title'), desc: t('about.feat2.desc') },
        { icon: "fa-headset", title: t('about.feat3.title'), desc: t('about.feat3.desc') },
    ];

    const seo = siteContent.seo;
    const canonical = seo?.canonicalUrl || '';
    const pageTitle = seo?.pagesSeo?.about?.title || 'Hakkımızda';
    const pageDesc = seo?.pagesSeo?.about?.description || 'Ata Flug Transfer olarak Antalya\'da güvenilir VIP transfer hizmeti sunuyoruz.';

    return (
        <div className="min-h-screen" style={{ background: '#020617' }}>
            <Helmet>
                <title>{pageTitle} | {business.name}</title>
                <meta name="description" content={pageDesc} />
                <meta name="keywords" content={seo?.pagesSeo?.about?.keywords || seo?.siteKeywords || ''} />
                <meta name="robots" content={seo?.robotsDirective || 'index, follow'} />
                <link rel="canonical" href={`${canonical}/hakkimizda`} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDesc} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${canonical}/hakkimizda`} />
                <meta property="og:image" content={seo?.ogImage || ''} />
                <meta property="og:locale" content="tr_TR" />
                <meta property="og:site_name" content={business.name} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={seo?.twitterHandle || ''} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDesc} />
            </Helmet>
            <section className="relative pt-28 pb-14 flex items-center justify-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <img src={about.bannerImage || "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=2000"} alt="Antalya Luxury" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/80"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-4 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                        <span>{t('about.eyebrow')}</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-playfair font-medium text-white mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 drop-shadow-2xl">
                        {t('page.about.title')}
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl font-light tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        {t('about.subtitle')}
                    </p>
                </div>
            </section>

            <section className="py-16 md:py-24 relative z-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #060a14 0%, #080c16 100%)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        <div className="pt-2 reveal-left">
                            <h2 className="font-playfair font-bold text-white leading-tight mb-6" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)' }}>{t(about.title)}</h2>
                            <div className="text-white/60 text-base leading-relaxed space-y-5 whitespace-pre-line border-l-2 pl-6" style={{ borderColor: 'rgba(197,160,89,0.4)' }}>
                                {t(about.content)}
                            </div>
                            <div className="mt-8">
                                <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 font-semibold transition-colors hover:opacity-80" style={{ color: '#c5a059' }}>
                                    <span>{t('about.contactCta')}</span>
                                    <i className="fa-solid fa-arrow-right text-sm transform group-hover:translate-x-1 transition-transform"></i>
                                </a>
                            </div>
                        </div>
                        <div className="relative reveal">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-white/[0.1]">
                                <img src={about.image || '/images/about-custom.jpg'} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="About Us Feature" />
                            </div>
                            <div className="absolute -bottom-8 -left-8 w-2/3 p-6 rounded-2xl hidden md:block" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div className="font-playfair font-bold mb-1" style={{ color: '#c5a059', fontSize: '2rem' }}>VIP</div>
                                <div className="text-white/70 font-semibold uppercase tracking-widest text-xs">{t('about.transferService')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-20 bg-[var(--color-dark)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
                        {features.map((feature, idx) => (
                            <div key={idx} className="reveal rounded-2xl p-6 border transition-all duration-300 group hover:-translate-y-1 cursor-default" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(197,160,89,0.35)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(197,160,89,0.04)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'; }}>
                                <div className="flex flex-col items-center text-center gap-3">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-1 transition-all duration-300 group-hover:scale-110" style={{ background: 'rgba(197,160,89,0.12)', color: '#c5a059', border: '1px solid rgba(197,160,89,0.25)' }}>
                                        <i className={`fa-solid ${feature.icon}`}></i>
                                    </div>
                                    <h3 className="font-playfair font-bold text-white text-base group-hover:text-[#c5a059] transition-colors">{feature.title}</h3>
                                    <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Hakkimizda;
