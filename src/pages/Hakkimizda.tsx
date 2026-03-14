import React from 'react';
import { Helmet } from 'react-helmet-async';
import TextureBackground from '../components/TextureBackground';
import { useSiteContent } from '../SiteContext';
import { useLanguage } from '../i18n/LanguageContext';

const Hakkimizda: React.FC = () => {
    const { siteContent } = useSiteContent();
    const { t } = useLanguage();
    const about = siteContent.about;
    const business = siteContent.business;

    const features = [
        { icon: "fa-shield-halved", title: t('about.feat1.title'), desc: t('about.feat1.desc') },
        { icon: "fa-car", title: t('about.feat2.title'), desc: t('about.feat2.desc') },
        { icon: "fa-headset", title: t('about.feat3.title'), desc: t('about.feat3.desc') },
    ];

    const seo = siteContent.seo;
    const canonical = seo?.canonicalUrl || 'https://ataflugtransfer.com';
    const pageTitle = seo?.pagesSeo?.about?.title || 'Hakkımızda';
    const pageDesc = seo?.pagesSeo?.about?.description || 'Ata Flug Transfer olarak Antalya\'da güvenilir VIP transfer hizmeti sunuyoruz.';

    return (
        <div className="min-h-screen bg-slate-50">
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
            <section className="relative pt-28 pb-12 flex items-center justify-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <img src={about.bannerImage || "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=2000"} alt="Antalya Luxury" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/80"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-4 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] animate-pulse"></span>
                        <span>{t('about.eyebrow')}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-playfair font-medium text-white mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 drop-shadow-2xl">
                        {t('page.about.title')}
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl font-light tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        {t('about.subtitle')}
                    </p>
                </div>
            </section>

            <section className="py-10 md:py-20 relative z-20 overflow-hidden bg-white">
                <TextureBackground />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-2 items-start">
                        <div className="pt-4">
                            <h2 className="text-4xl font-playfair font-medium text-slate-900 mb-8 leading-tight">{t(about.title)}</h2>
                            <div className="text-slate-500 text-lg leading-relaxed font-light space-y-6 text-justify whitespace-pre-line border-l-2 border-[#c5a059]/30 pl-6 bg-white/50 backdrop-blur-sm rounded-r-xl p-4">
                                {t(about.content)}
                            </div>
                            <div className="mt-10 flex items-center gap-6">
                                <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-slate-900 font-medium hover:text-[#c5a059] transition-colors">
                                    <span className="text-lg">{t('about.contactCta')}</span>
                                    <i className="fa-solid fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                                </a>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                                <img src={about.image || '/images/about-custom.jpg'} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="About Us Feature" />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-2/3 bg-slate-50 p-8 rounded-tr-3xl hidden md:block border-t-4 border-[#c5a059]/10 shadow-lg">
                                <div className="text-[#c5a059] text-4xl font-playfair font-bold mb-2">VIP</div>
                                <div className="text-slate-900 font-medium uppercase tracking-widest text-sm">{t('about.transferService')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-[#0f172a] border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-transparent rounded-2xl p-6 border border-slate-800 hover:border-[#c5a059]/50 hover:bg-slate-800/50 transition-all duration-300 group hover:-translate-y-1">
                                <div className="flex flex-col items-center text-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-800 text-[#c5a059] flex items-center justify-center text-xl shrink-0 group-hover:bg-[#c5a059] group-hover:text-white transition-all duration-300 mb-2 border border-slate-700/50">
                                        <i className={`fa-solid ${feature.icon}`}></i>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-playfair font-medium text-white mb-3 group-hover:text-[#c5a059] transition-colors">{feature.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed font-light group-hover:text-slate-400 transition-colors">{feature.desc}</p>
                                    </div>
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
