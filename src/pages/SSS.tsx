import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import TextureBackground from '../components/TextureBackground';
import { useSiteContent } from '../SiteContext';
import { useLanguage } from '../i18n/LanguageContext';

const SSS: React.FC = () => {
    const { siteContent } = useSiteContent();
    const { t } = useLanguage();
    const faqs = siteContent.faq;
    const business = siteContent.business;
    const [openId, setOpenId] = useState<string | null>(null);

    // Auto-translate FAQ items — just pass Turkish text to t()
    const translatedFaqs = faqs.map(faq => ({
        ...faq,
        q: t(faq.q),
        a: t(faq.a),
    }));

    const seo = siteContent.seo;
    const canonical = seo?.canonicalUrl || '';
    const pageTitle = seo?.pagesSeo?.faq?.title || 'Sıkça Sorulan Sorular';
    const pageDesc = seo?.pagesSeo?.faq?.description || 'Antalya transfer hizmeti hakkında merak ettiğiniz tüm sorular ve cevapları.';

    return (
        <div className="min-h-screen bg-slate-50">
            <Helmet>
                <title>{pageTitle} | {business.name}</title>
                <meta name="description" content={pageDesc} />
                <meta name="keywords" content={seo?.pagesSeo?.faq?.keywords || seo?.siteKeywords || ''} />
                <meta name="robots" content={seo?.robotsDirective || 'index, follow'} />
                <link rel="canonical" href={`${canonical}/sss`} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDesc} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${canonical}/sss`} />
                <meta property="og:image" content={seo?.ogImage || ''} />
                <meta property="og:locale" content="tr_TR" />
                <meta property="og:site_name" content={business.name} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content={seo?.twitterHandle || ''} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDesc} />
                <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": faqs.map(faq => ({
                        "@type": "Question",
                        "name": faq.q,
                        "acceptedAnswer": { "@type": "Answer", "text": faq.a }
                    }))
                })}</script>
                <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": canonical || "https://ataflugtransfer.com" },
                        { "@type": "ListItem", "position": 2, "name": "Sıkça Sorulan Sorular", "item": `${canonical}/sss` }
                    ]
                })}</script>
            </Helmet>
            <section className="relative pt-28 pb-12 flex items-center justify-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <img src="/images/sss-banner-custom.png" alt="FAQ Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/60"></div>
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 mb-4 shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                        <span>{t('faq.eyebrow')}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-playfair font-medium text-white mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 drop-shadow-2xl">
                        {t('page.faq.title')}
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl font-light tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        {t('faq.subtitle')}
                    </p>
                </div>
            </section>

            <section className="py-16 relative z-20 overflow-hidden">
                <TextureBackground />
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="space-y-4">
                        {translatedFaqs.map((faq) => (
                            <div key={faq.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <button onClick={() => setOpenId(openId === faq.id ? null : faq.id)} className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                                    <span className="font-bold text-slate-800 pr-4">{faq.q}</span>
                                    <i className={`fa-solid fa-chevron-down text-[var(--color-primary)] transition-transform ${openId === faq.id ? 'rotate-180' : ''}`}></i>
                                </button>
                                {openId === faq.id && (
                                    <div className="px-6 pb-5"><p className="text-slate-600 leading-relaxed">{faq.a}</p></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-full mx-auto flex items-center justify-center mb-6">
                        <i className="fa-solid fa-question text-[var(--color-primary)] text-3xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">{t('faq.moreQ')}</h2>
                    <p className="text-slate-600 mt-2">{t('faq.moreQDesc')}</p>
                    <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-full mt-6 transition-colors">
                        <i className="fab fa-whatsapp text-xl"></i>
                        {t('faq.askWhatsapp')}
                    </a>
                </div>
            </section>

            <section className="py-16 bg-[var(--color-dark)]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl mx-auto flex items-center justify-center text-white text-2xl"><i className="fa-solid fa-phone"></i></div>
                            <h3 className="text-white font-bold mt-4">{t('faq.phone')}</h3>
                            <p className="text-slate-300 mt-1">{business.phone}</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl mx-auto flex items-center justify-center text-white text-2xl"><i className="fa-solid fa-envelope"></i></div>
                            <h3 className="text-white font-bold mt-4">{t('faq.email')}</h3>
                            <p className="text-slate-300 mt-1">{business.email}</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl mx-auto flex items-center justify-center text-white text-2xl"><i className="fa-solid fa-clock"></i></div>
                            <h3 className="text-white font-bold mt-4">{t('faq.workHours')}</h3>
                            <p className="text-slate-300 mt-1">{t('faq.service247')}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SSS;
