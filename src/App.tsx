
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route, useLocation, Link, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookingForm from './components/BookingForm';
import TextureBackground from './components/TextureBackground';
import { useLanguage } from './i18n/LanguageContext';
import AdminPanel from './components/AdminPanel';
import { REVIEWS, BLOG_POSTS, BUSINESS_INFO } from './constants';
import { SiteProvider } from './SiteContext';
import { useAppStore } from './store/useAppStore';
import { supabase, isSupabaseConfigured } from './lib/supabase';

// Page imports
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Hakkimizda from './pages/Hakkimizda';
import VizyonMisyon from './pages/VizyonMisyon';
import Bolgeler from './pages/Bolgeler';
import SSS from './pages/SSS';
import Iletisim from './pages/Iletisim';
import AdminLogin from './pages/AdminLogin';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const {
    isAdmin, setIsAdmin,
    siteContent, updateSiteContent: handleUpdateSiteContent,
    bookings, isBookingFormOpen, setBookingFormOpen: setIsBookingFormOpen,
    initializeStore, addBooking: handleNewBooking, updateBookingStatus, deleteBooking: handleDeleteBooking
  } = useAppStore();

  const [reviewRating, setReviewRating] = useState(0);
  const { t, language } = useLanguage();

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsAdmin(true);
    navigate('/admin');
  };

  // Exit admin: sign out and navigate to home
  const handleExitAdmin = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAdmin(false);
    navigate('/');
  };

  // Initialize store on mount
  useEffect(() => {
    initializeStore();
  }, []);

  // Listen for Supabase auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAdmin(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        navigate('/');
      }
    });
    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsAdmin(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Lock body scroll in Admin Mode for App-like feel
  useEffect(() => {
    if (isAdmin) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAdmin]);
  // Dynamic Text Rotator for Hero Section
  const [currentRegionIndex, setCurrentRegionIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Hero Background Slider
  const heroBgs = siteContent.hero?.backgrounds?.length > 0
    ? siteContent.hero.backgrounds
    : ['/bg1.png', '/bg2.png', '/bg3.png'];
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    if (heroBgs.length === 0) return;
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroBgs.length);
    }, 10000);
    return () => clearInterval(bgInterval);
  }, [heroBgs.length]);

  useEffect(() => {
    if (siteContent.regions.length === 0) return;
    const interval = setInterval(() => {
      setIsFading(true); // Start fade out
      setTimeout(() => {
        setCurrentRegionIndex((prev) => (prev + 1) % siteContent.regions.length);
        setIsFading(false); // Start fade in
      }, 500); // Wait for fade out to complete (match css transition duration)
    }, 3000);
    return () => clearInterval(interval);
  }, [siteContent.regions]);




  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isAdminPage = location.pathname.startsWith('/admin');

  // Memoize random blog posts outside of JSX
  const randomBlogPosts = useMemo(() => [...BLOG_POSTS].sort(() => 0.5 - Math.random()).slice(0, 4), []);
  return (
    <SiteProvider value={{ siteContent, updateSiteContent: handleUpdateSiteContent }}>
      <div className={`flex flex-col ${isLoginPage ? 'h-screen overflow-hidden' : 'min-h-screen'} ${isAdmin ? 'bg-slate-900' : isLoginPage ? 'bg-[#030712]' : 'bg-white'}`}>
        {/* Navbar - Admin modunda ve Login sayfasında gizle */}
        {!isAdmin && !isLoginPage && !isAdminPage && (
          <Navbar
            onAdminToggle={() => {
              if (isAdmin) {
                handleExitAdmin();
              } else {
                navigate('/login');
              }
            }}
            isAdmin={isAdmin}
            content={siteContent.navbar}
          />
        )}

        <main className={`${isLoginPage ? 'flex-1' : 'flex-grow'} ${isAdmin ? 'bg-slate-900' : ''}`}>
          {isAdmin ? (
            <ErrorBoundary>
              <AdminPanel
                bookings={bookings}
                onUpdateStatus={updateBookingStatus}
                onAddBooking={handleNewBooking}
                siteContent={siteContent}
                onUpdateSiteContent={handleUpdateSiteContent}
                onDeleteBooking={handleDeleteBooking}
                onExitAdmin={handleExitAdmin}
              />
            </ErrorBoundary>
          ) : (
            <Routes>
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/hakkimizda" element={<Hakkimizda />} />
              <Route path="/vizyon-misyon" element={<VizyonMisyon />} />
              <Route path="/bolgeler" element={<Bolgeler />} />
              <Route path="/sss" element={<SSS />} />
              <Route path="/iletisim" element={<Iletisim />} />
              <Route path="/login" element={<AdminLogin onLogin={handleLoginSuccess} />} />
              <Route path="/admin/*" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/" element={
                <>

                  <Helmet>
                    <title>{siteContent.seo?.pagesSeo?.home?.title ? `${siteContent.seo.pagesSeo.home.title} | ${siteContent.business.name}` : siteContent.seo?.siteTitle || `${siteContent.hero.title} | ${siteContent.business.name}`}</title>
                    <meta name="description" content={siteContent.seo?.pagesSeo?.home?.description || siteContent.seo?.siteDescription || siteContent.hero.desc} />
                    <meta name="keywords" content={siteContent.seo?.pagesSeo?.home?.keywords || siteContent.seo?.siteKeywords || ''} />
                    <meta name="robots" content={siteContent.seo?.robotsDirective || 'index, follow'} />
                    <link rel="canonical" href={siteContent.seo?.canonicalUrl || 'https://ataflugtransfer.com'} />
                    <meta property="og:title" content={siteContent.seo?.pagesSeo?.home?.title || siteContent.hero.title} />
                    <meta property="og:description" content={siteContent.seo?.pagesSeo?.home?.description || siteContent.seo?.siteDescription || siteContent.hero.desc} />
                    <meta property="og:type" content="website" />
                    <meta property="og:image" content={siteContent.seo?.ogImage || ''} />
                    <meta property="og:url" content={siteContent.seo?.canonicalUrl || ''} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content={siteContent.seo?.twitterHandle || ''} />
                    <meta name="twitter:image" content={siteContent.seo?.ogImage || ''} />
                    {siteContent.seo?.googleSiteVerification && <meta name="google-site-verification" content={siteContent.seo.googleSiteVerification} />}
                    {siteContent.seo?.bingVerification && <meta name="msvalidate.01" content={siteContent.seo.bingVerification} />}
                    <link rel="icon" type="image/png" href={siteContent.business.logo || '/logo.png'} />
                    <link rel="apple-touch-icon" href={siteContent.business.logo || '/logo.png'} />
                    <script type="application/ld+json">{JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": siteContent.seo?.structuredData?.businessType || "TravelAgency",
                      "name": siteContent.business.name,
                      "url": siteContent.seo?.canonicalUrl || '',
                      "telephone": siteContent.business.phone,
                      "email": siteContent.business.email,
                      "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Antalya",
                        "addressCountry": "TR",
                        "streetAddress": siteContent.business.address
                      },
                      "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": siteContent.seo?.structuredData?.latitude || "36.8841",
                        "longitude": siteContent.seo?.structuredData?.longitude || "30.7056"
                      },
                      "priceRange": siteContent.seo?.structuredData?.priceRange || "€€",
                      "openingHours": siteContent.seo?.structuredData?.openingHours || "Mo-Su 00:00-24:00",
                      "areaServed": siteContent.seo?.structuredData?.areaServed || "Antalya, Turkey"
                    })}</script>
                  </Helmet>
                  <section id="home" className="relative min-h-[100svh] flex flex-col bg-[#020617] overflow-hidden">
                    {/* Background Layer: Ken Burns Zoom */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      {heroBgs.map((bg, idx) => (
                        <img
                          key={bg}
                          src={bg}
                          alt={`Hero BG ${idx + 1}`}
                          className={`absolute inset-0 w-full h-full object-cover object-top lg:object-center transition-opacity duration-[2000ms] ease-in-out ${idx === currentBgIndex ? 'opacity-100' : 'opacity-0'}`}
                        />
                      ))}
                      {/* Cinematic Gradient Overlays */}
                      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-black/20 to-black/70"></div>
                      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
                      {/* Bottom fade to next section */}
                      <div className="absolute bottom-0 left-0 right-0 h-40 z-10 bg-gradient-to-t from-[#020617] to-transparent"></div>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-20 max-w-7xl mx-auto px-5 lg:px-10 w-full flex-1 flex flex-col justify-end lg:justify-center pb-32 lg:pb-20 pt-24 lg:pt-20">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-16 w-full">

                        {/* Left: Text Content */}
                        <div className="flex-1 max-w-2xl animate-fadeInUp">
                          {/* Eyebrow */}
                          <div className="inline-flex items-center gap-2 mb-5">
                            <span className="w-8 h-[2px] bg-[#c5a059]"></span>
                            <span className="text-[#c5a059] text-[11px] font-bold uppercase tracking-[0.25em]" style={{ fontFamily: "'Outfit', sans-serif" }}>{t('hero.eyebrow')}</span>
                          </div>

                          {/* Headline */}
                          <h1 className="text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white leading-[1.05] mb-5 tracking-[-0.02em]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {t('hero.title')}
                            <br />
                            <span className="bg-gradient-to-r from-[#ebd299] via-[#c5a059] to-[#a8864a] bg-clip-text text-transparent">{t('hero.titleAccent')}</span>
                          </h1>

                          {/* Subtitle */}
                          <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-lg mb-8 font-light" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {t('hero.subtitle')}
                          </p>

                          {/* Dual CTA */}
                          <div className="flex flex-wrap items-center gap-3 mb-10 lg:mb-0">
                            <style>
                              {`
                                @keyframes breathe {
                                  0%, 100% { box-shadow: 0 0 0 0 rgba(197, 160, 89, 0.4); }
                                  50% { box-shadow: 0 0 20px 4px rgba(197, 160, 89, 0.15); }
                                }
                              `}
                            </style>
                            <button
                              onClick={() => setIsBookingFormOpen(true)}
                              className="group border border-[#c5a059]/40 hover:border-[#c5a059] bg-white/5 hover:bg-[#c5a059]/10 backdrop-blur-sm text-white font-semibold text-sm md:text-base px-7 py-3.5 md:px-9 md:py-4 rounded-full flex items-center gap-3 transition-all duration-300"
                              style={{ fontFamily: "'Outfit', sans-serif", animation: 'breathe 3s ease-in-out infinite' }}
                            >
                              <i className="fa-solid fa-calendar-check text-sm text-[#c5a059]"></i>
                              <span className="tracking-wide">{t('hero.cta')}</span>
                              <i className="fa-solid fa-arrow-right text-xs text-[#c5a059] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></i>
                            </button>
                            <a
                              href={`https://wa.me/${siteContent.business.whatsapp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group border border-white/20 hover:border-[#25D366]/60 bg-white/5 hover:bg-[#25D366]/10 backdrop-blur-sm text-white font-semibold text-sm md:text-base px-7 py-3.5 md:px-9 md:py-4 rounded-full flex items-center gap-3 transition-all duration-300"
                              style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                              <i className="fa-brands fa-whatsapp text-lg text-[#25D366]"></i>
                              <span className="tracking-wide">{t('hero.whatsapp')}</span>
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Universal Overlay Form (Modal) */}
                    {isBookingFormOpen && (
                      <div className="fixed inset-0 z-[200] flex items-end justify-center lg:items-center p-0 lg:p-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                        <div
                          className="absolute inset-0 bg-black/80 backdrop-blur-lg"
                          onClick={() => setIsBookingFormOpen(false)}
                        />
                        <div className="relative w-full lg:max-w-[480px] max-h-[95vh] lg:max-h-[92vh] animate-in slide-in-from-bottom lg:zoom-in-95 duration-400 ease-out">
                          <div
                            className="rounded-t-[2rem] lg:rounded-3xl shadow-2xl shadow-black/60 overflow-hidden relative border-t lg:border border-white/10"
                            style={{
                              background: 'rgba(10, 10, 14, 0.85)',
                              backdropFilter: 'blur(40px)',
                              WebkitBackdropFilter: 'blur(40px)'
                            }}
                          >
                            {/* Drag handle (mobile) */}
                            <div className="flex justify-center pt-3 pb-1 lg:hidden">
                              <div className="w-10 h-1 rounded-full bg-white/15"></div>
                            </div>

                            {/* Modal Header */}
                            <div className="px-6 pt-5 pb-4 lg:pt-7 flex items-start justify-between">
                              <div>
                                <div className="inline-flex items-center gap-2 mb-2">
                                  <span className="w-5 h-[2px] bg-[#c5a059]"></span>
                                  <span className="text-[#c5a059] text-[10px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: "'Outfit', sans-serif" }}>{t('form.eyebrow')}</span>
                                </div>
                                <h3 className="text-white font-bold text-xl" style={{ fontFamily: "'Outfit', sans-serif" }}>{t('form.title')}</h3>
                              </div>
                              <button
                                onClick={() => setIsBookingFormOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors mt-1"
                              >
                                <i className="fa-solid fa-xmark text-sm"></i>
                              </button>
                            </div>

                            {/* Form Content */}
                            <div className="px-2 pb-4 lg:pb-6 max-h-[75vh] lg:max-h-[75vh] overflow-y-auto custom-scrollbar">
                              <BookingForm onBookingSubmit={(booking) => { handleNewBooking(booking); setIsBookingFormOpen(false); }} vehicles={siteContent.vehicles} />
                            </div>

                            {/* Trust Footer */}
                            <div className="px-6 py-3 border-t border-white/[0.06] flex items-center justify-center gap-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
                              <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
                                <i className="fa-solid fa-lock text-[8px] text-emerald-400"></i>
                                <span>{t('form.trustSecure')}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
                                <i className="fa-solid fa-bolt text-[8px] text-amber-400"></i>
                                <span>{t('form.trustFast')}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
                                <i className="fa-brands fa-whatsapp text-[8px] text-[#25D366]"></i>
                                <span>{t('form.trustWhatsapp')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Trust Bar (Bottom) */}
                    <div className="absolute bottom-0 left-0 right-0 z-30">
                      <div className="max-w-7xl mx-auto px-5 lg:px-10 pb-5 md:pb-6 flex items-center gap-4 md:gap-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        <div className="flex items-center gap-2 text-white/50 text-xs md:text-sm">
                          <i className="fa-solid fa-headset text-[#c5a059] text-sm"></i>
                          <span>{t('hero.trust.247')}</span>
                        </div>
                        <div className="w-px h-3 bg-white/10"></div>
                        <div className="flex items-center gap-2 text-white/50 text-xs md:text-sm">
                          <i className="fa-solid fa-clock text-[#c5a059] text-sm"></i>
                          <span>{t('hero.trust.tracking')}</span>
                        </div>
                        <div className="w-px h-3 bg-white/10 hidden sm:block"></div>
                        <div className="hidden sm:flex items-center gap-2 text-white/50 text-xs md:text-sm">
                          <i className="fa-solid fa-car text-[#c5a059] text-sm"></i>
                          <span>{t('hero.trust.vehicle')}</span>
                        </div>
                        <div className="w-px h-3 bg-white/10"></div>
                        <div className="flex items-center gap-2 text-white/50 text-xs md:text-sm">
                          <i className="fa-solid fa-location-dot text-[#c5a059] text-sm"></i>
                          <div className="w-[100px] sm:w-[140px] overflow-hidden">
                            <span className={`block transition-opacity duration-300 whitespace-nowrap text-ellipsis overflow-hidden ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                              {siteContent.regions[currentRegionIndex]?.name || 'Antalya'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>




                  <section id="about" className="py-4 md:py-6 bg-slate-50 relative group/section">
                    <TextureBackground />

                    <div className="max-w-7xl mx-auto px-4 lg:px-6 relative z-10 w-full">
                      <div className="relative">
                        {/* Admin Edit Trigger */}
                        {isAdmin && (
                          <button className="absolute -top-6 right-0 text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded hover:bg-[#c5a059] hover:text-white transition-colors flex items-center gap-1 z-50 shadow-sm border border-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            EDIT
                          </button>
                        )}

                        {/* Section Header */}
                        <div className="text-center mb-6 md:mb-8">
                          <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#c5a059]"></span>
                            <h2 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">{t('services.eyebrow')}</h2>
                            <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#c5a059]"></span>
                          </div>
                        </div>

                        {/* Premium Services Grid Minimal */}
                        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                          {/* Card 1 */}
                          <div className="bg-white rounded-[2rem] p-6 xl:p-8 border border-slate-100 transition-all duration-200 hover:border-[#c5a059]/30 hover:shadow-md hover:bg-slate-50/50 group flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-xl bg-amber-50/50 flex items-center justify-center text-[#c5a059] mb-4 group-hover:bg-[#c5a059] group-hover:text-white transition-colors duration-200">
                              <i className="fa-solid fa-plane-arrival text-xl"></i>
                            </div>
                            <h4 className="text-slate-900 font-playfair font-bold text-lg mb-3">{t('services.card1.title')}</h4>
                            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                              {t('services.card1.desc')}
                            </p>
                          </div>

                          {/* Card 2 */}
                          <div className="bg-white rounded-[2rem] p-6 xl:p-8 border border-slate-100 transition-all duration-200 hover:border-[#c5a059]/30 hover:shadow-md hover:bg-slate-50/50 group flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-xl bg-amber-50/50 flex items-center justify-center text-[#c5a059] mb-4 group-hover:bg-[#c5a059] group-hover:text-white transition-colors duration-200">
                              <i className="fa-solid fa-map text-xl"></i>
                            </div>
                            <h4 className="text-slate-900 font-playfair font-bold text-lg mb-3">{t('services.card2.title')}</h4>
                            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                              {t('services.card2.desc')}
                            </p>
                          </div>

                          {/* Card 3 */}
                          <div className="bg-white rounded-[2rem] p-6 xl:p-8 border border-slate-100 transition-all duration-200 hover:border-[#c5a059]/30 hover:shadow-md hover:bg-slate-50/50 group flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-xl bg-amber-50/50 flex items-center justify-center text-[#c5a059] mb-4 group-hover:bg-[#c5a059] group-hover:text-white transition-colors duration-200">
                              <i className="fa-solid fa-route text-xl"></i>
                            </div>
                            <h4 className="text-slate-900 font-playfair font-bold text-lg mb-3">{t('services.card3.title')}</h4>
                            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                              {t('services.card3.desc')}
                            </p>
                          </div>

                          {/* Card 4 */}
                          <div className="bg-white rounded-[2rem] p-6 xl:p-8 border border-slate-100 transition-all duration-200 hover:border-[#c5a059]/30 hover:shadow-md hover:bg-slate-50/50 group flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-xl bg-amber-50/50 flex items-center justify-center text-[#c5a059] mb-4 group-hover:bg-[#c5a059] group-hover:text-white transition-colors duration-200">
                              <i className="fa-solid fa-car-side text-xl"></i>
                            </div>
                            <h4 className="text-slate-900 font-playfair font-bold text-lg mb-3">{t('services.card4.title')}</h4>
                            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                              {t('services.card4.desc')}
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </section>

                  <section id="regions" className="pt-2 pb-8 md:pt-4 md:pb-10 bg-slate-900 text-white relative overflow-hidden scroll-mt-20">
                    {/* Ambient background */}
                    <div className="absolute inset-0 z-0">
                      <div className="absolute inset-0 bg-slate-900 z-10"></div>
                      <div className="absolute inset-0 z-10" style={{ backgroundImage: 'radial-gradient(#c5a059 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.03 }}></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4">
                      {/* Section Header */}
                      <div className="text-center mb-10 md:mb-12">
                        <div className="inline-flex items-center gap-2 mb-3">
                          <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#c5a059]"></span>
                          <span className="text-[#c5a059] font-bold text-[11px] uppercase tracking-[0.3em]">{t('regions.eyebrow')}</span>
                          <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#c5a059]"></span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold leading-tight">
                          {t('regions.title')} <span className="bg-gradient-to-r from-[#c5a059] via-[#e0c07a] to-[#c5a059] bg-clip-text text-transparent">{t('regions.titleAccent')}</span>
                        </h2>
                        <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">{t('regions.desc')}</p>
                      </div>
                    </div>

                    {/* Dual-Row Marquee — Opposite Directions */}
                    <div className="relative space-y-3 md:space-y-4">
                      {/* Fade edges */}
                      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-slate-900 to-transparent z-20 pointer-events-none"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-slate-900 to-transparent z-20 pointer-events-none"></div>

                      {/* Row 1 — Left to Right (first 5 regions × 2) */}
                      <div className="flex gap-3 md:gap-4 marquee-row-1 px-4">
                        {[...siteContent.regions.slice(0, 5), ...siteContent.regions.slice(0, 5)].map((region, index) => (
                          <Link
                            key={`r1-${region.id}-${index}`}
                            to={`/blog/${region.name.toLowerCase().replace(/ /g, '-').replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c').replace(/[^a-z0-9-]/g, '')}-transfer-rehberi`}
                            className="group relative w-[160px] sm:w-[200px] md:w-[260px] aspect-square rounded-lg overflow-hidden flex-shrink-0"
                          >
                            <img src={region.image} alt={region.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            <div className="absolute inset-0 rounded-lg border border-white/[0.08] group-hover:border-[#c5a059]/40 transition-colors duration-300"></div>
                            <div className="absolute top-3 right-3 z-10">
                              <span className="bg-black/40 text-white px-2.5 py-1 rounded text-[11px] font-bold">€{region.price}</span>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-3 md:p-4 z-10">
                              <span className="text-white/60 text-[10px] font-semibold uppercase tracking-wider block">{t('regions.airportLabel')}</span>
                              <svg width="14" height="22" viewBox="0 0 14 22" className="my-1 block" fill="none">
                                <path d="M7 0l3.5 4.5H8.5v2h-3v-2H3.5L7 0z" fill="#c5a059" />
                                <line x1="7" y1="8" x2="7" y2="14" stroke="#c5a059" strokeWidth="1.5" strokeDasharray="2 2" />
                                <path d="M7 22l-3.5-4.5H5.5v-2h3v2h2L7 22z" fill="#c5a059" />
                              </svg>
                              <h3 className="text-sm md:text-base font-bold text-white leading-tight group-hover:text-[#c5a059] transition-colors duration-300">{region.name}</h3>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Row 2 — Right to Left (last 5 regions × 2) */}
                      <div className="flex gap-3 md:gap-4 marquee-row-2 px-4">
                        {[...siteContent.regions.slice(5, 10), ...siteContent.regions.slice(5, 10)].map((region, index) => (
                          <Link
                            key={`r2-${region.id}-${index}`}
                            to={`/blog/${region.name.toLowerCase().replace(/ /g, '-').replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c').replace(/[^a-z0-9-]/g, '')}-transfer-rehberi`}
                            className="group relative w-[160px] sm:w-[200px] md:w-[260px] aspect-square rounded-lg overflow-hidden flex-shrink-0"
                          >
                            <img src={region.image} alt={region.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            <div className="absolute inset-0 rounded-lg border border-white/[0.08] group-hover:border-[#c5a059]/40 transition-colors duration-300"></div>
                            <div className="absolute top-3 right-3 z-10">
                              <span className="bg-black/40 text-white px-2.5 py-1 rounded text-[11px] font-bold">€{region.price}</span>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-3 md:p-4 z-10">
                              <span className="text-white/60 text-[10px] font-semibold uppercase tracking-wider block">Antalya Airport</span>
                              <svg width="14" height="22" viewBox="0 0 14 22" className="my-1 block" fill="none">
                                <path d="M7 0l3.5 4.5H8.5v2h-3v-2H3.5L7 0z" fill="#c5a059" />
                                <line x1="7" y1="8" x2="7" y2="14" stroke="#c5a059" strokeWidth="1.5" strokeDasharray="2 2" />
                                <path d="M7 22l-3.5-4.5H5.5v-2h3v2h2L7 22z" fill="#c5a059" />
                              </svg>
                              <h3 className="text-sm md:text-base font-bold text-white leading-tight group-hover:text-[#c5a059] transition-colors duration-300">{region.name}</h3>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section id="blog-highlights" className="py-12 bg-slate-50 scroll-mt-20 relative overflow-hidden">
                    <TextureBackground />
                    <div className="max-w-7xl mx-auto px-4 relative z-10">
                      <div className="text-center mb-10 md:mb-12">
                        <div className="inline-flex items-center gap-2 mb-3">
                          <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#c5a059]"></span>
                          <span className="text-[#c5a059] font-bold text-[11px] uppercase tracking-[0.3em]">{t('blog.eyebrow')}</span>
                          <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#c5a059]"></span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold leading-tight text-slate-900">
                          {t('blog.title')} <span className="bg-gradient-to-r from-[#c5a059] via-[#e0c07a] to-[#c5a059] bg-clip-text text-transparent">{t('blog.titleAccent')}</span>
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {randomBlogPosts.map((post) => (
                          <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="relative h-40 overflow-hidden">
                              <img src={post.featuredImage} alt={t(post.title)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                              <span className="absolute bottom-2 left-3 text-[10px] font-bold text-white/80 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-0.5">{t(post.category)}</span>
                            </div>
                            <div className="p-4">
                              <h3 className="text-sm font-bold text-[#0f172a] line-clamp-2 mb-2 group-hover:text-[#c5a059] transition-colors leading-snug">{t(post.title)}</h3>
                              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{t(post.excerpt)}</p>
                              <div className="mt-3 flex items-center gap-1 text-[#c5a059] text-xs font-semibold">
                                <span>{t('blog.readMore')}</span>
                                <i className="fa-solid fa-arrow-right text-[9px] group-hover:translate-x-1 transition-transform"></i>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="text-center mt-8">
                        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#c5a059] transition-colors">
                          <span>{t('blog.viewAll')}</span>
                          <i className="fa-solid fa-arrow-right text-xs"></i>
                        </Link>
                      </div>
                    </div>
                  </section>

                  {/* Müşteri Yorumları — 2026 UI */}
                  <section id="reviews" className="py-8 md:py-10 bg-[#0f172a] overflow-hidden relative">
                    {/* Ambient glow */}
                    <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-[#c5a059]/[0.03] rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-[#c5a059]/[0.02] rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto px-4 mb-10 md:mb-14 relative z-10">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 mb-3">
                          <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#c5a059]"></span>
                          <span className="text-[#c5a059] font-bold text-[11px] uppercase tracking-[0.3em]">{t('reviews.eyebrow')}</span>
                          <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#c5a059]"></span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white leading-tight">
                          <span className="bg-gradient-to-r from-[#c5a059] via-[#e0c07a] to-[#c5a059] bg-clip-text text-transparent">2.847</span> {t('reviews.count')}
                        </h2>
                        <div className="flex items-center justify-center gap-2 mt-4">
                          <div className="flex items-center gap-0.5 bg-white/[0.04] backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/[0.06]">
                            {[1, 2, 3, 4, 5].map(i => <i key={i} className="fa-solid fa-star text-amber-400 text-xs"></i>)}
                            <span className="text-white font-bold text-sm ml-1.5">4.9</span>
                            <span className="text-slate-500 text-xs ml-1">/5</span>
                          </div>
                          <span className="text-slate-500 text-xs">{t('reviews.avgScore')}</span>
                        </div>
                      </div>

                      {/* Sen de Yorum Ekle - Kompakt */}
                      <div className="mt-8 max-w-4xl mx-auto px-4 md:px-0">
                        <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-4 border border-white/[0.06] hover:border-white/[0.1] transition-colors">
                          {/* Header Row */}
                          <div className="flex items-center justify-between mb-4 md:mb-0 md:hidden">
                            <div className="flex items-center gap-2">
                              <i className="fa-solid fa-pen text-[#c5a059] text-xs"></i>
                              <span className="text-white text-sm font-medium">{t('reviews.addReview')}</span>
                            </div>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  onClick={() => setReviewRating(star)}
                                  className={`w-8 h-8 flex items-center justify-center transition-colors ${star <= reviewRating ? 'text-amber-400' : 'text-slate-600'}`}
                                >
                                  <i className="fa-solid fa-star text-lg"></i>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:flex items-center gap-3">
                            <div className="flex items-center gap-2 shrink-0">
                              <i className="fa-solid fa-pen text-[#c5a059] text-xs"></i>
                              <span className="text-white text-sm font-medium">{t('reviews.addReview')}:</span>
                            </div>
                            <div className="flex gap-0.5 shrink-0">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button
                                  key={star}
                                  onClick={() => setReviewRating(star)}
                                  className={`text-sm transition-colors ${star <= reviewRating ? 'text-amber-400' : 'text-slate-600 hover:text-amber-400'}`}
                                >
                                  <i className="fa-solid fa-star"></i>
                                </button>
                              ))}
                            </div>
                            <input type="text" placeholder={t('reviews.firstName')} className="flex-1 min-w-[60px] bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:border-[#c5a059] focus:outline-none transition-colors" />
                            <input type="text" placeholder={t('reviews.lastName')} className="flex-1 min-w-[60px] bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:border-[#c5a059] focus:outline-none transition-colors" />
                            <input type="text" placeholder={t('reviews.yourReview')} className="flex-[2] min-w-[100px] bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:border-[#c5a059] focus:outline-none transition-colors" />
                            <button className="shrink-0 bg-gradient-to-r from-[#c5a059] to-amber-600 hover:from-amber-600 hover:to-[#c5a059] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-[#c5a059]/10 hover:shadow-[#c5a059]/20">
                              <i className="fa-solid fa-paper-plane text-[10px]"></i>
                              {t('reviews.send')}
                            </button>
                          </div>

                          {/* Mobile Layout - Vertical Stack */}
                          <div className="md:hidden space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <input type="text" placeholder={t('reviews.firstName')} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 min-h-[48px] text-white text-sm placeholder-slate-500 focus:border-[#c5a059] focus:outline-none transition-colors" />
                              <input type="text" placeholder={t('reviews.lastName')} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 min-h-[48px] text-white text-sm placeholder-slate-500 focus:border-[#c5a059] focus:outline-none transition-colors" />
                            </div>
                            <input type="text" placeholder={t('reviews.yourReview')} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 min-h-[48px] text-white text-sm placeholder-slate-500 focus:border-[#c5a059] focus:outline-none transition-colors" />
                            <button className="w-full bg-gradient-to-r from-[#c5a059] to-amber-600 hover:from-amber-600 hover:to-[#c5a059] text-white text-sm font-bold px-4 py-3.5 min-h-[48px] rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-[#c5a059]/10">
                              <i className="fa-solid fa-paper-plane"></i>
                              {t('reviews.submit')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dual-Row Kayan Yorumlar — GPU Accelerated */}
                    <div className="relative space-y-4">
                      {/* Fade edges */}
                      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#0f172a] to-transparent z-20 pointer-events-none"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#0f172a] to-transparent z-20 pointer-events-none"></div>

                      {/* Row 1 — Left to Right (15 reviews × 2) */}
                      <div className="flex gap-4 marquee-row-1 px-4">
                        {[...REVIEWS.slice(0, 15), ...REVIEWS.slice(0, 15)].map((review, index) => (
                          <div key={`r1-${review.id}-${index}`} className="review-card-2026 w-[300px] md:w-[360px] flex-shrink-0 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                              {/* Avatar with gradient ring */}
                              <div className="relative">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c5a059] via-amber-500 to-[#c5a059] p-[2px]">
                                  <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center text-[#c5a059] font-bold text-sm">
                                    {review.name.charAt(0)}
                                  </div>
                                </div>
                                {/* Verified dot */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0f172a] flex items-center justify-center">
                                  <i className="fa-solid fa-check text-white text-[6px]"></i>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-semibold text-sm truncate">{review.name}</span>
                                  <span className="text-base">{review.country}</span>
                                </div>
                                {/* Compact rating pill */}
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <div className="flex items-center gap-0.5 bg-amber-400/10 px-2 py-0.5 rounded-full">
                                    <i className="fa-solid fa-star text-amber-400 text-[8px]"></i>
                                    <span className="text-amber-400 text-[10px] font-bold">{review.rating}.0</span>
                                  </div>
                                  <span className="text-slate-600 text-[10px]">•</span>
                                  <span className="text-slate-500 text-[10px]">{t('reviews.verified')}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-300/80 text-[13px] leading-relaxed line-clamp-3">{review.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Row 2 — Right to Left (15 reviews × 2, different set) */}
                      <div className="flex gap-4 marquee-row-2 px-4">
                        {[...REVIEWS.slice(35, 50), ...REVIEWS.slice(35, 50)].map((review, index) => (
                          <div key={`r2-${review.id}-${index}`} className="review-card-2026 w-[300px] md:w-[360px] flex-shrink-0 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                              {/* Avatar with gradient ring */}
                              <div className="relative">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c5a059] via-amber-500 to-[#c5a059] p-[2px]">
                                  <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center text-[#c5a059] font-bold text-sm">
                                    {review.name.charAt(0)}
                                  </div>
                                </div>
                                {/* Verified dot */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0f172a] flex items-center justify-center">
                                  <i className="fa-solid fa-check text-white text-[6px]"></i>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-semibold text-sm truncate">{review.name}</span>
                                  <span className="text-base">{review.country}</span>
                                </div>
                                {/* Compact rating pill */}
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <div className="flex items-center gap-0.5 bg-amber-400/10 px-2 py-0.5 rounded-full">
                                    <i className="fa-solid fa-star text-amber-400 text-[8px]"></i>
                                    <span className="text-amber-400 text-[10px] font-bold">{review.rating}.0</span>
                                                  </div>
                                  <span className="text-slate-600 text-[10px]">•</span>
                                  <span className="text-slate-500 text-[10px]">Doğrulanmış</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-300/80 text-[13px] leading-relaxed line-clamp-3">{review.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </>
              } />
            </Routes>
          )}
        </main>

        {/* Footer - Admin ve Login modunda gizle */}
        {!isAdmin && !isLoginPage && !isAdminPage && (
          <footer id="contact" className="bg-[#020617] text-white py-6 pb-28 lg:pb-6 border-t border-[#c5a059]/20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 text-center md:text-left mb-6">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <img src={siteContent.business.logo || '/logo.png'} alt={`${BUSINESS_INFO.name} Logo`} className="h-12 w-auto" onError={(e) => (e.currentTarget.src = '/logo.png')} />
                  <div>
                    <h4 className="text-white font-black text-xl tracking-tight">ATA FLUG TRANSFER</h4>
                    <p className="text-slate-400 text-xs">{t('footer.tagline')}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[#c5a059] font-bold text-xs uppercase tracking-widest mb-3">{t('footer.contact')}</h4>
                  <ul className="space-y-3 md:space-y-2 text-sm text-slate-300">
                    <li><a href={`tel:${siteContent.business.phone}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#c5a059] transition-colors inline-flex items-center min-h-[44px] md:min-h-0"><i className="fa-solid fa-phone mr-3 text-[#c5a059]"></i>{siteContent.business.phone}</a></li>
                    <li><a href={`mailto:${siteContent.business.email}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#c5a059] transition-colors inline-flex items-center min-h-[44px] md:min-h-0"><i className="fa-solid fa-envelope mr-3 text-[#c5a059]"></i>{siteContent.business.email}</a></li>
                    <li className="inline-flex items-center"><i className="fa-solid fa-location-dot mr-3 text-[#c5a059]"></i>{siteContent.business.address}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[#c5a059] font-bold text-xs uppercase tracking-widest mb-3">{t('footer.quickSupport')}</h4>
                  <div className="flex justify-center md:justify-start space-x-3">
                    <a href={`https://wa.me/${siteContent.business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-11 md:h-11 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl md:text-lg hover:scale-110 active:scale-95 transition-transform shadow-lg"><i className="fa-brands fa-whatsapp"></i></a>
                    <a href={siteContent.business.telegram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-11 md:h-11 bg-sky-500 rounded-full flex items-center justify-center text-white text-xl md:text-lg hover:scale-110 active:scale-95 transition-transform shadow-lg"><i className="fa-brands fa-telegram"></i></a>
                    <a href={siteContent.business.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-11 md:h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl md:text-lg hover:scale-110 active:scale-95 transition-transform shadow-lg"><i className="fa-brands fa-instagram"></i></a>
                    <a href={siteContent.business.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-11 md:h-11 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl md:text-lg hover:scale-110 active:scale-95 transition-transform shadow-lg"><i className="fa-brands fa-facebook-f"></i></a>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-[10px] font-bold tracking-[0.3em] uppercase text-center pt-4 border-t border-white/5">
                © {new Date().getFullYear()} ATA FLUG TRANSFER - ALL RIGHTS RESERVED - DESIGN <a href="https://wa.me/905523890771" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#c5a059] transition-colors">HOZYON</a>
              </p>
            </div>
          </footer>
        )}

        {/* WhatsApp Floating Button - Bottom Left */}
        {!isAdmin && !isLoginPage && !isAdminPage && (
          <a
            href={`https://wa.me/${siteContent.business.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed left-6 z-[90] lg:left-8 group"
            style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
          >
            <div className="relative">
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></div>
              {/* Button */}
              <div className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-200">
                <i className="fa-brands fa-whatsapp text-2xl"></i>
              </div>
            </div>
          </a>
        )}
      </div>
    </SiteProvider >
  );
};

export default App;
