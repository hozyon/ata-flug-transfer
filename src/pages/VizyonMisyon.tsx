import React from 'react';
import { useSiteContent } from '../SiteContext';
import TextureBackground from '../components/TextureBackground';
import { useLanguage } from '../i18n/LanguageContext';

const VizyonMisyon: React.FC = () => {
    const { siteContent } = useSiteContent();
    const { t } = useLanguage();
    const vm = siteContent.visionMission;

    return (
        <div className="min-h-screen bg-slate-50">
            <section className="relative pt-28 pb-12 flex items-center justify-center overflow-hidden border-b border-white/5">
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

            <section className="py-20 md:py-28 relative z-20 overflow-hidden bg-white">
                <TextureBackground />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-slate-100 hover:border-[var(--color-primary)]/30 transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(197,160,89,0.3)] hover:-translate-y-2 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all duration-700 group-hover:bg-[var(--color-primary)]/10"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[var(--color-primary)] transition-colors duration-500">
                                    <i className="fa-solid fa-eye text-[var(--color-primary)] text-3xl group-hover:text-white group-hover:scale-110 transition-transform duration-500"></i>
                                </div>
                                <h2 className="text-3xl font-playfair font-bold text-slate-800 mb-4 group-hover:text-[var(--color-primary)] transition-colors">{t(vm?.vision?.title || '')}</h2>
                                <p className="text-slate-600 leading-relaxed text-lg">{t(vm?.vision?.desc || '')}</p>
                                <div className="mt-8 space-y-4">
                                    {vm?.vision?.items?.map((item, idx) => (
                                        item ? (
                                            <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 group-hover:bg-white border border-transparent group-hover:border-[var(--color-primary)]/20 transition-all duration-300">
                                                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] shrink-0"><i className="fa-solid fa-check text-sm"></i></div>
                                                <span className="text-slate-700 font-medium">{t(item)}</span>
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-slate-100 hover:border-[var(--color-primary)]/30 transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(197,160,89,0.3)] hover:-translate-y-2 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-200/50 rounded-full blur-3xl -mr-32 -mt-32 transition-all duration-700 group-hover:bg-[var(--color-primary)]/10"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[var(--color-primary)] transition-colors duration-500">
                                    <i className="fa-solid fa-bullseye text-[var(--color-primary)] text-3xl group-hover:text-white group-hover:rotate-12 transition-transform duration-500"></i>
                                </div>
                                <h2 className="text-3xl font-playfair font-bold text-slate-800 mb-4 group-hover:text-[var(--color-primary)] transition-colors">{t(vm?.mission?.title || '')}</h2>
                                <p className="text-slate-600 leading-relaxed text-lg">{t(vm?.mission?.desc || '')}</p>
                                <div className="mt-8 space-y-4">
                                    {vm?.mission?.items?.map((item, idx) => (
                                        item ? (
                                            <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 group-hover:bg-white border border-transparent group-hover:border-[var(--color-primary)]/20 transition-all duration-300">
                                                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] shrink-0"><i className="fa-solid fa-check text-sm"></i></div>
                                                <span className="text-slate-700 font-medium">{t(item)}</span>
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-[0.2em] mb-3">{t('vision.valuesEyebrow')}</div>
                        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-slate-800">{t(vm?.values?.title || '')}</h2>
                        <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-lg">{t(vm?.values?.desc || '')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {vm?.values?.items?.map((valueItem, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-[var(--color-primary)]/30 hover:bg-slate-50 transition-colors duration-300 text-center group">
                                <div className="w-16 h-16 bg-slate-50 group-hover:bg-white rounded-xl mx-auto flex items-center justify-center text-[var(--color-primary)] text-2xl mb-6 shadow-sm border border-slate-100 transition-colors duration-300">
                                    <i className={`fa-solid ${valueItem.icon}`}></i>
                                </div>
                                <h3 className="font-playfair font-bold text-xl text-slate-800 mb-3">{t(valueItem.title)}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">{t(valueItem.desc)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default VizyonMisyon;
