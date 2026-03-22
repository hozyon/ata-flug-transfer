
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route, useLocation, Link, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookingForm from './components/BookingForm';
import TextureBackground from './components/TextureBackground';
import { useLanguage } from './i18n/LanguageContext';
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
import { REVIEWS, BLOG_POSTS } from './constants';
import { SiteProvider } from './SiteContext';
import { useAppStore } from './store/useAppStore';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { useScrollReveal } from './hooks/useScrollReveal';

// Page imports
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Hakkimizda from './pages/Hakkimizda';
import VizyonMisyon from './pages/VizyonMisyon';
import Bolgeler from './pages/Bolgeler';
import SSS from './pages/SSS';
import Iletisim from './pages/Iletisim';
import AdminLogin from './pages/AdminLogin';
import TransferDestination from './pages/TransferDestination';
import ErrorBoundary from './components/ErrorBoundary';

// Computed once at module load — avoids calling Math.random during render
const RANDOM_BLOG_POSTS = [...BLOG_POSTS].sort(() => 0.5 - Math.random()).slice(0, 4);

const App: React.FC = () => {
  const {
    isAdmin, setIsAdmin,
    siteContent, updateSiteContent: handleUpdateSiteContent,
    bookings, isBookingFormOpen, setBookingFormOpen: setIsBookingFormOpen,
    initializeStore, addBooking: handleNewBooking, updateBookingStatus, deleteBooking: handleDeleteBooking,
    blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
    userReviews, addReview, updateReviewStatus, deleteReview,
  } = useAppStore();

  useScrollReveal();

  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isAdminPage = location.pathname.startsWith('/admin');
  const ADMIN_PUBLIC_PATHS = ['/hakkimizda', '/vizyon-misyon', '/bolgeler', '/sss', '/blog', '/iletisim'];
  const isPublicBrowse = isAdmin && (
    ADMIN_PUBLIC_PATHS.includes(location.pathname) ||
    location.pathname.startsWith('/blog/')
  );

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewFirst, setReviewFirst] = useState('');
  const [reviewLast, setReviewLast] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const [priceSearch, setPriceSearch] = useState('');
  const [authChecking, setAuthChecking] = useState(isSupabaseConfigured);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const handleReviewSubmit = async () => {
    if (!reviewFirst.trim() || !reviewText.trim() || reviewRating === 0) return;
    setReviewSubmitting(true);
    await addReview({
      name: `${reviewFirst.trim()} ${reviewLast.trim()}`.trim(),
      country: '',
      lang: 'tr',
      rating: reviewRating,
      text: reviewText.trim(),
    });
    setReviewFirst(''); setReviewLast(''); setReviewText(''); setReviewRating(0);
    setReviewSubmitting(false); setReviewDone(true);
    setTimeout(() => setReviewDone(false), 4000);
  };

  // Ref to block isAdmin=true when PASSWORD_RECOVERY token is in URL
  const isRecoveryModeRef = useRef(false);
  const { t, language } = useLanguage();

  // Generate and persist a session token (single-session enforcement)
  const applySessionToken = async () => {
    if (!isSupabaseConfigured) return;
    const token = crypto.randomUUID();
    sessionStorage.setItem('ata_session_token', token);
    // Update in-memory store immediately (sync)
    const { siteContent: sc } = useAppStore.getState();
    const newContent = { ...sc, adminAccount: { ...sc.adminAccount!, activeSessionToken: token } };
    useAppStore.getState().setSiteContent(newContent);
    // Write directly to Supabase — if it fails, clear sessionStorage so checks won't false-kick
    const { error } = await supabase
      .from('site_content')
      .upsert({ id: 1, content: newContent as unknown as Record<string, unknown> });
    if (error) {
      console.error('Session token write failed:', error);
      sessionStorage.removeItem('ata_session_token');
    }
  };

  // Handle successful login
  const handleLoginSuccess = async () => {
    await applySessionToken();
    setIsAdmin(true);
    navigate('/admin');
  };

  // Exit admin: sign out and navigate to home
  const handleExitAdmin = async () => {
    if (isSupabaseConfigured) {
      sessionStorage.removeItem('ata_session_token');
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
      if (event === 'PASSWORD_RECOVERY') {
        // Must be handled FIRST — set ref synchronously so INITIAL_SESSION won't set isAdmin=true
        isRecoveryModeRef.current = true;
        setIsAdmin(false);
        setAuthChecking(false);
        setShowResetModal(true);
      } else if (event === 'INITIAL_SESSION') {
        if (!isRecoveryModeRef.current) {
          setIsAdmin(!!session);
          // If restoring session from existing Supabase session (page refresh / browser reopen)
          // and no sessionStorage token exists, generate a fresh one to invalidate other devices
          if (session && !sessionStorage.getItem('ata_session_token')) {
            applySessionToken();
          }
        }
        setAuthChecking(false);
      } else if (event === 'SIGNED_IN' && session) {
        if (!isRecoveryModeRef.current) {
          setIsAdmin(true);
        }
      } else if (event === 'SIGNED_OUT') {
        isRecoveryModeRef.current = false;
        setIsAdmin(false);
        navigate('/');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Single-session enforcement: check every 30s if our token is still active
  useEffect(() => {
    if (!isAdmin || !isSupabaseConfigured) return;

    const interval = setInterval(async () => {
      // Read fresh each tick (token may have been set after effect ran)
      const localToken = sessionStorage.getItem('ata_session_token');
      if (!localToken) return;

      const { data } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 1)
        .single();
      const dbToken = (data?.content as any)?.adminAccount?.activeSessionToken;
      if (dbToken && dbToken !== localToken) {
        // Another device has taken over — force logout
        sessionStorage.removeItem('ata_session_token');
        await supabase.auth.signOut();
        // SIGNED_OUT event will handle setIsAdmin(false) + navigate('/')
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAdmin]);

  // Lock body scroll in Admin Mode for App-like feel (not when browsing public pages)
  useEffect(() => {
    if (isAdmin && !isPublicBrowse) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAdmin, isPublicBrowse]);

  // Apply brand colors as CSS custom properties
  useEffect(() => {
    const b = siteContent.branding;
    if (!b) return;
    if (b.primaryColor) document.documentElement.style.setProperty('--color-primary', b.primaryColor);
    if (b.darkBg) document.documentElement.style.setProperty('--color-dark', b.darkBg);
    if (b.darkBgDeep) document.documentElement.style.setProperty('--color-darker', b.darkBgDeep);
  }, [siteContent.branding]);

  // Apply favicon dynamically
  useEffect(() => {
    const faviconUrl = siteContent.branding?.favicon || siteContent.business.logo || '/favicon.ico';
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }, [siteContent.branding?.favicon, siteContent.business.logo]);
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




  if (authChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0f172a]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#c5a059] border-t-transparent" />
      </div>
    );
  }

  return (
    <SiteProvider value={{ siteContent, updateSiteContent: handleUpdateSiteContent }}>
      <div className={`flex flex-col ${isLoginPage ? 'h-screen overflow-hidden' : 'min-h-screen'} ${isAdmin && !isPublicBrowse ? 'bg-slate-900' : isLoginPage ? 'bg-[#030712]' : 'bg-white'}`}>
        {/* Navbar - Admin modunda ve Login sayfasında gizle (public browse modunda göster) */}
        {(!isAdmin || isPublicBrowse) && !isLoginPage && !isAdminPage && (
          <Navbar
            onAdminToggle={() => {
              if (isPublicBrowse) {
                navigate('/'); // root → admin panel
              } else if (isAdmin) {
                handleExitAdmin();
              } else {
                navigate('/login');
              }
            }}
            isAdmin={isAdmin}
            content={siteContent.navbar}
          />
        )}

        <main className={`${isLoginPage ? 'flex-1' : 'flex-grow'} ${isAdmin && !isPublicBrowse ? 'bg-slate-900' : ''}`}>
          {isAdmin && !isPublicBrowse ? (
            <ErrorBoundary>
              <React.Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-[#0f172a]"><div className="h-10 w-10 animate-spin rounded-full border-4 border-[#c5a059] border-t-transparent" /></div>}>
                <AdminPanel
                  bookings={bookings}
                  onUpdateStatus={updateBookingStatus}
                  onAddBooking={handleNewBooking}
                  siteContent={siteContent}
                  onUpdateSiteContent={handleUpdateSiteContent}
                  onDeleteBooking={handleDeleteBooking}
                  onExitAdmin={handleExitAdmin}
                  blogPosts={blogPosts}
                  onAddBlogPost={addBlogPost}
                  onUpdateBlogPost={updateBlogPost}
                  onDeleteBlogPost={deleteBlogPost}
                  userReviews={userReviews}
                  onUpdateReviewStatus={updateReviewStatus}
                  onDeleteReview={deleteReview}
                />
              </React.Suspense>
            </ErrorBoundary>
          ) : (
            <Routes location={location} key={location.pathname}>
              <Route path="/blog" element={<div className="page-enter"><Blog /></div>} />
              <Route path="/blog/:slug" element={<div className="page-enter"><BlogPost /></div>} />
              <Route path="/hakkimizda" element={<div className="page-enter"><Hakkimizda /></div>} />
              <Route path="/vizyon-misyon" element={<div className="page-enter"><VizyonMisyon /></div>} />
              <Route path="/bolgeler" element={<div className="page-enter"><Bolgeler /></div>} />
              <Route path="/sss" element={<div className="page-enter"><SSS /></div>} />
              <Route path="/iletisim" element={<div className="page-enter"><Iletisim /></div>} />
              <Route path="/login" element={<div className="page-enter"><AdminLogin onLogin={handleLoginSuccess} /></div>} />
              <Route path="/admin/*" element={<Navigate to="/login" replace />} />
              <Route path="/:transferSlug" element={<div className="page-enter"><TransferDestination /></div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/" element={
                <>

                  <Helmet>
                    <title>{siteContent.seo?.pagesSeo?.home?.title || siteContent.seo?.siteTitle || `${siteContent.hero.title} | ${siteContent.business.name}`}</title>
                    <meta name="description" content={siteContent.seo?.pagesSeo?.home?.description || siteContent.seo?.siteDescription || siteContent.hero.desc} />
                    <meta name="keywords" content={siteContent.seo?.pagesSeo?.home?.keywords || siteContent.seo?.siteKeywords || ''} />
                    <meta name="robots" content={siteContent.seo?.robotsDirective || 'index, follow'} />
                    <link rel="canonical" href={siteContent.seo?.canonicalUrl || 'https://ataflugtransfer.com'} />
                    {/* Hreflang for multi-language SEO */}
                    <link rel="alternate" hrefLang="tr" href={`${siteContent.seo?.canonicalUrl || 'https://ataflugtransfer.com'}`} />
                    <link rel="alternate" hrefLang="en" href={`${siteContent.seo?.canonicalUrl || 'https://ataflugtransfer.com'}`} />
                    <link rel="alternate" hrefLang="de" href={`${siteContent.seo?.canonicalUrl || 'https://ataflugtransfer.com'}`} />
                    <link rel="alternate" hrefLang="ru" href={`${siteContent.seo?.canonicalUrl || 'https://ataflugtransfer.com'}`} />
                    <link rel="alternate" hrefLang="x-default" href={`${siteContent.seo?.canonicalUrl || 'https://ataflugtransfer.com'}`} />
                    <meta property="og:title" content={siteContent.seo?.pagesSeo?.home?.title || siteContent.hero.title} />
                    <meta property="og:description" content={siteContent.seo?.pagesSeo?.home?.description || siteContent.seo?.siteDescription || siteContent.hero.desc} />
                    <meta property="og:type" content="website" />
                    <meta property="og:image" content={siteContent.seo?.ogImage || ''} />
                    <meta property="og:image:width" content="1200" />
                    <meta property="og:image:height" content="630" />
                    <meta property="og:url" content={siteContent.seo?.canonicalUrl || ''} />
                    <meta property="og:locale" content="tr_TR" />
                    <meta property="og:locale:alternate" content="en_US" />
                    <meta property="og:locale:alternate" content="de_DE" />
                    <meta property="og:locale:alternate" content="ru_RU" />
                    <meta property="og:site_name" content={siteContent.business.name} />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:site" content={siteContent.seo?.twitterHandle || ''} />
                    <meta name="twitter:title" content={siteContent.seo?.pagesSeo?.home?.title || siteContent.hero.title} />
                    <meta name="twitter:description" content={siteContent.seo?.pagesSeo?.home?.description || siteContent.seo?.siteDescription || ''} />
                    <meta name="twitter:image" content={siteContent.seo?.ogImage || ''} />
                    {siteContent.seo?.googleSiteVerification && <meta name="google-site-verification" content={siteContent.seo.googleSiteVerification} />}
                    {siteContent.seo?.bingVerification && <meta name="msvalidate.01" content={siteContent.seo.bingVerification} />}
                    <link rel="icon" href={siteContent.branding?.favicon || siteContent.business.logo || '/favicon.ico'} />
                    <link rel="apple-touch-icon" href={siteContent.business.logo || '/favicon.ico'} />
                    <script type="application/ld+json">{JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "LocalBusiness",
                      "name": siteContent.business.name,
                      "url": siteContent.seo?.canonicalUrl || '',
                      "telephone": siteContent.business.phone,
                      "email": siteContent.business.email,
                      "image": siteContent.seo?.ogImage || '',
                      "logo": siteContent.business.logo || '',
                      "description": "Antalya Havalimanı'ndan Kemer, Belek, Side, Alanya ve tüm bölgelere özel VIP transfer hizmeti. 7/24 profesyonel şoförler, Mercedes araçlar.",
                      "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Antalya",
                        "addressRegion": "Antalya",
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
                      "areaServed": ["Antalya", "Kemer", "Belek", "Side", "Alanya", "Manavgat", "Marmaris", "Fethiye", "Bodrum"],
                      "servesCuisine": null,
                      "currenciesAccepted": "EUR, USD, TRY, GBP, RUB",
                      "paymentAccepted": "Cash, Credit Card",
                      "hasMap": siteContent.business.mapEmbedUrl || '',
                      "sameAs": [
                        siteContent.business.instagram || '',
                        siteContent.business.facebook || '',
                      ].filter(Boolean),
                      "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "5",
                        "bestRating": "5",
                        "ratingCount": "150"
                      }
                    })}</script>
                  </Helmet>
                  <section id="home" className="relative min-h-[100svh] flex flex-col bg-[var(--color-darker)] overflow-hidden">
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
                      <div className="absolute bottom-0 left-0 right-0 h-40 z-10 bg-gradient-to-t from-[var(--color-darker)] to-transparent"></div>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-5 lg:px-10 w-full flex-1 flex flex-col justify-end lg:justify-center pb-32 lg:pb-20 pt-24 lg:pt-20">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-16 w-full">

                        {/* Left: Text Content */}
                        <div className="flex-1 max-w-2xl animate-fadeInUp">
                          {/* Eyebrow */}
                          <div className="inline-flex items-center gap-2 mb-5">
                            <span className="w-8 h-[2px] bg-[var(--color-primary)]"></span>
                            <span className="text-[var(--color-primary)] text-[11px] font-bold uppercase tracking-[0.25em]" style={{ fontFamily: "'Outfit', sans-serif" }}>{t('hero.eyebrow')}</span>
                          </div>

                          {/* Headline */}
                          <h1 className="text-[1.9rem] sm:text-[2.6rem] md:text-5xl lg:text-6xl xl:text-[72px] font-bold text-white leading-[1.1] sm:leading-[1.05] mb-5 tracking-[-0.02em]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {t('hero.title')}
                            <br />
                            <span className="bg-gradient-to-r from-[#ebd299] via-[var(--color-primary)] to-[#a8864a] bg-clip-text text-transparent">{t('hero.titleAccent')}</span>
                          </h1>

                          {/* Subtitle */}
                          <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-lg mb-8 font-light" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {t('hero.subtitle')}
                          </p>

                          {/* Dual CTA */}
                          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 mb-10 lg:mb-0">
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
                              className="group border border-[var(--color-primary)]/40 hover:border-[var(--color-primary)] bg-white/5 hover:bg-[var(--color-primary)]/10 backdrop-blur-sm text-white font-semibold text-sm md:text-base px-7 py-3.5 md:px-9 md:py-4 rounded-full flex items-center justify-center gap-3 transition-all duration-300"
                              style={{ fontFamily: "'Outfit', sans-serif", animation: 'breathe 3s ease-in-out infinite' }}
                            >
                              <i className="fa-solid fa-calendar-check text-sm text-[var(--color-primary)]"></i>
                              <span className="tracking-wide">{t('hero.cta')}</span>
                              <i className="fa-solid fa-arrow-right text-xs text-[var(--color-primary)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></i>
                            </button>
                            <a
                              href={`https://wa.me/${siteContent.business.whatsapp}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group border border-white/20 hover:border-[#25D366]/60 bg-white/5 hover:bg-[#25D366]/10 backdrop-blur-sm text-white font-semibold text-sm md:text-base px-7 py-3.5 md:px-9 md:py-4 rounded-full flex items-center justify-center gap-3 transition-all duration-300"
                              style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                              <i className="fa-brands fa-whatsapp text-lg text-[#25D366]"></i>
                              <span className="tracking-wide">{t('hero.whatsapp')}</span>
                            </a>
                          </div>
                        </div>

                      </div>
                    </div>


                    {/* Trust Bar (Bottom) */}
                    <div className="absolute bottom-0 left-0 right-0 z-30">
                      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-10 pb-5 md:pb-6 flex items-center gap-2 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        <div className="flex items-center gap-2 text-white/50 text-xs md:text-sm">
                          <i className="fa-solid fa-headset text-[var(--color-primary)] text-sm"></i>
                          <span>{t('hero.trust.247')}</span>
                        </div>
                        <div style={{ width: 1, height: 22, flexShrink: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(197,160,89,0.55) 30%, rgba(197,160,89,0.8) 50%, rgba(197,160,89,0.55) 70%, transparent 100%)' }} />
                        <div className="flex items-center gap-2 text-white/50 text-xs md:text-sm">
                          <i className="fa-solid fa-clock text-[var(--color-primary)] text-sm"></i>
                          <span>{t('hero.trust.tracking')}</span>
                        </div>
                        <div className="hidden sm:block" style={{ width: 1, height: 22, flexShrink: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(197,160,89,0.55) 30%, rgba(197,160,89,0.8) 50%, rgba(197,160,89,0.55) 70%, transparent 100%)' }} />
                        <div className="hidden sm:flex items-center gap-2 text-white/50 text-xs md:text-sm">
                          <i className="fa-solid fa-car text-[var(--color-primary)] text-sm"></i>
                          <span>{t('hero.trust.vehicle')}</span>
                        </div>
                        <div style={{ width: 1, height: 22, flexShrink: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(197,160,89,0.55) 30%, rgba(197,160,89,0.8) 50%, rgba(197,160,89,0.55) 70%, transparent 100%)' }} />
                        <div className="flex items-center gap-2 text-white/50 text-xs md:text-sm">
                          <i className="fa-solid fa-location-dot text-[var(--color-primary)] text-sm"></i>
                          <div className="w-[100px] sm:w-[140px] overflow-hidden">
                            <span
                              key={currentRegionIndex}
                              className={`block whitespace-nowrap text-ellipsis overflow-hidden transition-all duration-300 ${isFading ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0 region-animate'}`}
                            >
                              {siteContent.regions[currentRegionIndex]?.name || 'Antalya'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* ── Pricing Section ── */}
                  {(() => {
                    const sym = siteContent.currency?.symbol || '€';
                    const allRegions = siteContent.regions;
                    if (allRegions.length === 0) return null;

                    // Only show regions that have a price set
                    const pricedRegions = allRegions.filter(r => r.price && r.price > 0);
                    const sorted = [...pricedRegions].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
                    const groups = [
                      { labelKey: 'pricing.near', accent: '#34d399', accentBg: 'rgba(52,211,153,0.08)', borderClr: 'rgba(52,211,153,0.2)', regions: sorted.filter(r => (r.price ?? 0) <= 60) },
                      { labelKey: 'pricing.mid',  accent: '#c5a059', accentBg: 'rgba(197,160,89,0.08)',  borderClr: 'rgba(197,160,89,0.2)',  regions: sorted.filter(r => (r.price ?? 0) > 60 && (r.price ?? 0) <= 120) },
                      { labelKey: 'pricing.far',  accent: '#fb7185', accentBg: 'rgba(251,113,133,0.08)', borderClr: 'rgba(251,113,133,0.2)', regions: sorted.filter(r => (r.price ?? 0) > 120) },
                    ].filter(g => g.regions.length > 0);

                    const LANG_FLAGS: Record<string, string> = { en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', ru: '🇷🇺', ar: '🇸🇦', tr: '🇹🇷' };
                    const buildWaUrl = (regionName: string, price: number | undefined) => {
                      const priceStr = price ? `${sym}${price}` : '—';
                      const trBody =
                        `✈️ *${siteContent.business.name}*\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n🇹🇷 *Transfer Rezervasyon Talebi*\n\n🚐  *Güzergah:* Antalya Havalimanı → ${regionName}\n💶  *Fiyat:* ${priceStr}\n📩  Merhaba, bu güzergah için rezervasyon yapmak istiyorum.\n\n⏳ _Yanıt süresi: ~2 dakika_`;
                      if (language === 'tr') return `https://wa.me/${siteContent.business.whatsapp}?text=${encodeURIComponent(trBody)}`;
                      const flag = LANG_FLAGS[language] || '🌐';
                      const intlBody =
                        `✈️ *${siteContent.business.name}*\n▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔\n\n${flag} *Transfer Booking Request*\n\n🚐  *Route:* Antalya Airport → ${regionName}\n💶  *Price:* ${priceStr}\n📩  Hello, I would like to book a transfer for this route.\n\n┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈\n\n🇹🇷 *Transfer Rezervasyon Talebi*\n\n🚐  *Güzergah:* Antalya Havalimanı → ${regionName}\n💶  *Fiyat:* ${priceStr}\n📩  Merhaba, bu güzergah için rezervasyon yapmak istiyorum.`;
                      return `https://wa.me/${siteContent.business.whatsapp}?text=${encodeURIComponent(intlBody)}`;
                    };

                    const searchBase = pricedRegions;
                    const filteredRegions = priceSearch.trim()
                      ? searchBase.filter(r => {
                          const q = priceSearch.trim().toLowerCase();
                          return r.name.toLowerCase().includes(q) || String(r.price ?? '').includes(q);
                        })
                      : searchBase;
                    const filteredGroups = [
                      { labelKey: 'pricing.near', accent: '#34d399', accentBg: 'rgba(52,211,153,0.08)', borderClr: 'rgba(52,211,153,0.2)', regions: filteredRegions.filter(r => (r.price ?? 0) <= 60) },
                      { labelKey: 'pricing.mid',  accent: '#c5a059', accentBg: 'rgba(197,160,89,0.08)',  borderClr: 'rgba(197,160,89,0.2)',  regions: filteredRegions.filter(r => (r.price ?? 0) > 60 && (r.price ?? 0) <= 120) },
                      { labelKey: 'pricing.far',  accent: '#fb7185', accentBg: 'rgba(251,113,133,0.08)', borderClr: 'rgba(251,113,133,0.2)', regions: filteredRegions.filter(r => (r.price ?? 0) > 120) },
                    ].filter(g => g.regions.length > 0);

                    const activeGroups = priceSearch.trim() ? filteredGroups : groups;

                    return (
                      <section className="relative overflow-hidden py-0" style={{ background: 'linear-gradient(160deg, #080c16 0%, #0c1220 50%, #080c16 100%)' }}>

                        {/* Diamond crosshatch */}
                        <div className="absolute inset-0 opacity-[0.12]" style={{
                          backgroundImage: `repeating-linear-gradient(45deg, rgba(197,160,89,0.5) 0px, rgba(197,160,89,0.5) 1px, transparent 1px, transparent 22px), repeating-linear-gradient(-45deg, rgba(197,160,89,0.5) 0px, rgba(197,160,89,0.5) 1px, transparent 1px, transparent 22px)`,
                        }} />
                        {/* Gold radial glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] opacity-[0.18]" style={{ background: 'radial-gradient(ellipse, #c5a059 0%, transparent 70%)' }} />

                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10">

                          {/* ── Header row: title left, legend right ── */}
                          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
                            <div className="reveal">
                              <div className="flex items-center gap-2.5 mb-2.5">
                                <span className="w-5 h-px" style={{ background: '#c5a059' }}></span>
                                <span className="text-[9px] font-black tracking-[0.4em] uppercase" style={{ color: '#c5a059' }}>{t('pricing.eyebrow')}</span>
                              </div>
                              <h2 className="text-[26px] md:text-[34px] font-black tracking-tight leading-none text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                {t('pricing.title')}&nbsp;<span style={{ color: '#c5a059' }}>{t('pricing.titleAccent')}</span>
                              </h2>
                              <p className="text-white/35 text-[12px] mt-1.5 font-medium">{t('pricing.subtitle')}</p>
                            </div>
                            {/* Legend — only visible sm+ */}
                            <div className="hidden sm:flex items-center gap-5 pb-1">
                              {[
                                { color: '#34d399', lk: 'pricing.legendNear' },
                                { color: '#c5a059', lk: 'pricing.legendMid' },
                                { color: '#fb7185', lk: 'pricing.legendFar' },
                              ].map(item => (
                                <div key={item.lk} className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color }}></span>
                                  <span className="text-[10px] text-white/35 font-medium">{t(item.lk)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* ── Toolbar: search full-width slim bar ── */}
                          <div className="flex items-center gap-3 mb-7 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <i className="fa-solid fa-magnifying-glass text-white/25 text-[11px] shrink-0"></i>
                            <input
                              type="text"
                              value={priceSearch}
                              onChange={e => setPriceSearch(e.target.value)}
                              placeholder={t('pricing.search') || 'Bölge adı veya fiyat ara...'}
                              className="flex-1 bg-transparent text-[12px] text-white/70 placeholder-white/20 focus:outline-none"
                            />
                            {priceSearch
                              ? <button onClick={() => setPriceSearch('')} className="text-white/30 hover:text-white/70 transition-colors shrink-0"><i className="fa-solid fa-xmark text-[11px]"></i></button>
                              : <span className="text-[10px] text-white/15 font-mono shrink-0">{pricedRegions.length} bölge</span>
                            }
                          </div>

                          {/* ── Groups ── */}
                          {activeGroups.length === 0 ? (
                            <div className="text-center py-12">
                              <i className="fa-solid fa-magnifying-glass text-white/10 text-3xl mb-3 block"></i>
                              <p className="text-white/25 text-sm">Sonuç bulunamadı</p>
                            </div>
                          ) : (
                            <div className="space-y-7">
                              {activeGroups.map(group => (
                                <div key={group.labelKey}>
                                  <div className="flex items-center gap-3 mb-3">
                                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: group.accent }}></span>
                                    <span className="text-[8.5px] font-black uppercase tracking-[0.4em]" style={{ color: group.accent }}>{t(group.labelKey)}</span>
                                    <span className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${group.borderClr}, transparent)` }}></span>
                                    <span className="text-[9px] font-bold text-white/20">{group.regions.length}</span>
                                  </div>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 stagger-children">
                                    {group.regions.map(region => (
                                      <a
                                        key={region.id}
                                        href={buildWaUrl(region.name, region.price)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="reveal group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl transition-all duration-200"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                                        onMouseEnter={e => {
                                          (e.currentTarget as HTMLAnchorElement).style.background = group.accentBg;
                                          (e.currentTarget as HTMLAnchorElement).style.borderColor = group.borderClr;
                                        }}
                                        onMouseLeave={e => {
                                          (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                                          (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.07)';
                                        }}
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <i className="fa-solid fa-location-dot text-[10px] shrink-0 text-white/25 group-hover:text-white/55 transition-colors duration-200"></i>
                                          <span className="text-white/80 text-[12px] font-semibold truncate group-hover:text-white transition-colors duration-200" style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.01em' }}>{region.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                          <span className="font-black text-[13px] leading-none" style={{ color: group.accent, fontFamily: "'Outfit', sans-serif" }}>
                                            {sym}{region.price}
                                          </span>
                                          {/* WhatsApp pulse icon */}
                                          <span className="relative w-4 h-4 flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-[#25D366] opacity-30"></span>
                                            <i className="fa-brands fa-whatsapp text-[#25D366] text-[13px] relative"></i>
                                          </span>
                                        </div>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* ── Footer ── */}
                          <div className="mt-7 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-start gap-2">
                              <i className="fa-solid fa-circle-info text-white/20 text-[9px] mt-[3px] shrink-0"></i>
                              <p className="text-white/25 text-[10.5px] leading-relaxed max-w-lg">{t('pricing.note')}</p>
                            </div>
                            <a
                              href="/bolgeler"
                              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-white/45 hover:text-[var(--color-primary)] text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-200"
                              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(197,160,89,0.35)'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(197,160,89,0.05)'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                            >
                              {t('pricing.allRegions')}
                              <i className="fa-solid fa-arrow-right text-[8px]"></i>
                            </a>
                          </div>

                        </div>
                      </section>
                    );
                  })()}

                  {/* ── Section Divider ── */}
                  <div className="relative bg-slate-50 flex items-center justify-center py-6">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                    <div className="relative flex items-center gap-3 px-5 py-2 rounded-full border border-slate-200 bg-white shadow-sm">
                      <span className="w-4 h-px bg-gradient-to-r from-transparent to-[var(--color-primary)]/50"></span>
                      <i className="fa-solid fa-car-side text-[var(--color-primary)] text-[10px]"></i>
                      <span className="text-[9px] font-black tracking-[0.3em] text-slate-400 uppercase">VIP Transfer</span>
                      <i className="fa-solid fa-star text-[var(--color-primary)] text-[7px]"></i>
                      <span className="text-[9px] font-black tracking-[0.3em] text-slate-400 uppercase">Premium</span>
                      <i className="fa-solid fa-car-side text-[var(--color-primary)] text-[10px] scale-x-[-1]"></i>
                      <span className="w-4 h-px bg-gradient-to-l from-transparent to-[var(--color-primary)]/50"></span>
                    </div>
                  </div>

                  <section id="about" className="py-4 md:py-6 bg-slate-50 relative group/section">
                    <TextureBackground />

                    <div className="max-w-7xl mx-auto px-4 lg:px-6 relative z-10 w-full">
                      <div className="relative">
                        {/* Admin Edit Trigger */}
                        {isAdmin && (
                          <button className="absolute -top-6 right-0 text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded hover:bg-[var(--color-primary)] hover:text-white transition-colors flex items-center gap-1 z-50 shadow-sm border border-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            EDIT
                          </button>
                        )}

                        {/* Section Header */}
                        <div className="text-center mb-6 md:mb-8">
                          <div className="inline-flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-gradient-to-r from-transparent to-[var(--color-primary)]"></span>
                            <h2 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">{t('services.eyebrow')}</h2>
                            <span className="w-8 h-px bg-gradient-to-l from-transparent to-[var(--color-primary)]"></span>
                          </div>
                        </div>

                        {/* Premium Services Grid Minimal */}
                        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 stagger-children">
                          {/* Card 1 */}
                          <div className="reveal bg-white rounded-[2rem] p-6 xl:p-8 border border-slate-100 transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md hover:bg-slate-50/50 group flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-xl bg-amber-50/50 flex items-center justify-center text-[var(--color-primary)] mb-4 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-200">
                              <i className="fa-solid fa-plane-arrival text-xl"></i>
                            </div>
                            <h4 className="text-slate-900 font-playfair font-bold text-lg mb-3">{t('services.card1.title')}</h4>
                            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                              {t('services.card1.desc')}
                            </p>
                          </div>

                          {/* Card 2 */}
                          <div className="reveal bg-white rounded-[2rem] p-6 xl:p-8 border border-slate-100 transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md hover:bg-slate-50/50 group flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-xl bg-amber-50/50 flex items-center justify-center text-[var(--color-primary)] mb-4 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-200">
                              <i className="fa-solid fa-map text-xl"></i>
                            </div>
                            <h4 className="text-slate-900 font-playfair font-bold text-lg mb-3">{t('services.card2.title')}</h4>
                            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                              {t('services.card2.desc')}
                            </p>
                          </div>

                          {/* Card 3 */}
                          <div className="reveal bg-white rounded-[2rem] p-6 xl:p-8 border border-slate-100 transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md hover:bg-slate-50/50 group flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-xl bg-amber-50/50 flex items-center justify-center text-[var(--color-primary)] mb-4 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-200">
                              <i className="fa-solid fa-route text-xl"></i>
                            </div>
                            <h4 className="text-slate-900 font-playfair font-bold text-lg mb-3">{t('services.card3.title')}</h4>
                            <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                              {t('services.card3.desc')}
                            </p>
                          </div>

                          {/* Card 4 */}
                          <div className="reveal bg-white rounded-[2rem] p-6 xl:p-8 border border-slate-100 transition-all duration-200 hover:border-[var(--color-primary)]/30 hover:shadow-md hover:bg-slate-50/50 group flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-xl bg-amber-50/50 flex items-center justify-center text-[var(--color-primary)] mb-4 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-200">
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
                      <div className="absolute inset-0 z-10" style={{ backgroundImage: 'radial-gradient(var(--color-primary) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.03 }}></div>
                    </div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4">
                      {/* Section Header */}
                      <div className="text-center mb-10 md:mb-12">
                        <div className="inline-flex items-center gap-2 mb-3">
                          <span className="w-8 h-px bg-gradient-to-r from-transparent to-[var(--color-primary)]"></span>
                          <span className="text-[var(--color-primary)] font-bold text-[11px] uppercase tracking-[0.3em]">{t('regions.eyebrow')}</span>
                          <span className="w-8 h-px bg-gradient-to-l from-transparent to-[var(--color-primary)]"></span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold leading-tight">
                          {t('regions.title')} <span className="bg-gradient-to-r from-[var(--color-primary)] via-[#e0c07a] to-[var(--color-primary)] bg-clip-text text-transparent">{t('regions.titleAccent')}</span>
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
                            <div className="absolute inset-0 rounded-lg border border-white/[0.08] group-hover:border-[var(--color-primary)]/40 transition-colors duration-300"></div>
                            {region.price ? (
                              <div className="absolute top-3 right-3 z-10">
                                <span className="bg-black/40 text-white px-2.5 py-1 rounded text-[11px] font-bold">{siteContent.currency?.symbol || '€'}{region.price}</span>
                              </div>
                            ) : null}
                            <div className="absolute bottom-0 left-0 w-full p-3 md:p-4 z-10">
                              <span className="text-white/60 text-[10px] font-semibold uppercase tracking-wider block">{t('regions.airportLabel')}</span>
                              <svg width="14" height="22" viewBox="0 0 14 22" className="my-1 block" fill="none">
                                <path d="M7 0l3.5 4.5H8.5v2h-3v-2H3.5L7 0z" fill="var(--color-primary)" />
                                <line x1="7" y1="8" x2="7" y2="14" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="2 2" />
                                <path d="M7 22l-3.5-4.5H5.5v-2h3v2h2L7 22z" fill="var(--color-primary)" />
                              </svg>
                              <h3 className="text-sm md:text-base font-bold text-white leading-tight group-hover:text-[var(--color-primary)] transition-colors duration-300">{region.name}</h3>
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
                            <div className="absolute inset-0 rounded-lg border border-white/[0.08] group-hover:border-[var(--color-primary)]/40 transition-colors duration-300"></div>
                            {region.price ? (
                              <div className="absolute top-3 right-3 z-10">
                                <span className="bg-black/40 text-white px-2.5 py-1 rounded text-[11px] font-bold">{siteContent.currency?.symbol || '€'}{region.price}</span>
                              </div>
                            ) : null}
                            <div className="absolute bottom-0 left-0 w-full p-3 md:p-4 z-10">
                              <span className="text-white/60 text-[10px] font-semibold uppercase tracking-wider block">Antalya Airport</span>
                              <svg width="14" height="22" viewBox="0 0 14 22" className="my-1 block" fill="none">
                                <path d="M7 0l3.5 4.5H8.5v2h-3v-2H3.5L7 0z" fill="var(--color-primary)" />
                                <line x1="7" y1="8" x2="7" y2="14" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="2 2" />
                                <path d="M7 22l-3.5-4.5H5.5v-2h3v2h2L7 22z" fill="var(--color-primary)" />
                              </svg>
                              <h3 className="text-sm md:text-base font-bold text-white leading-tight group-hover:text-[var(--color-primary)] transition-colors duration-300">{region.name}</h3>
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
                          <span className="w-8 h-px bg-gradient-to-r from-transparent to-[var(--color-primary)]"></span>
                          <span className="text-[var(--color-primary)] font-bold text-[11px] uppercase tracking-[0.3em]">{t('blog.eyebrow')}</span>
                          <span className="w-8 h-px bg-gradient-to-l from-transparent to-[var(--color-primary)]"></span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold leading-tight text-slate-900">
                          {t('blog.title')} <span className="bg-gradient-to-r from-[var(--color-primary)] via-[#e0c07a] to-[var(--color-primary)] bg-clip-text text-transparent">{t('blog.titleAccent')}</span>
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {RANDOM_BLOG_POSTS.map((post) => (
                          <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className="relative h-40 overflow-hidden">
                              <img src={post.featuredImage} alt={t(post.title)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                              <span className="absolute bottom-2 left-3 text-[10px] font-bold text-white/80 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-0.5">{t(post.category)}</span>
                            </div>
                            <div className="p-4">
                              <h3 className="text-sm font-bold text-[var(--color-dark)] line-clamp-2 mb-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug">{t(post.title)}</h3>
                              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{t(post.excerpt)}</p>
                              <div className="mt-3 flex items-center gap-1 text-[var(--color-primary)] text-xs font-semibold">
                                <span>{t('blog.readMore')}</span>
                                <i className="fa-solid fa-arrow-right text-[9px] group-hover:translate-x-1 transition-transform"></i>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="text-center mt-8">
                        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[var(--color-primary)] transition-colors">
                          <span>{t('blog.viewAll')}</span>
                          <i className="fa-solid fa-arrow-right text-xs"></i>
                        </Link>
                      </div>
                    </div>
                  </section>

                  {/* Müşteri Yorumları — 2026 UI */}
                  <section id="reviews" className="py-8 md:py-10 bg-[var(--color-dark)] overflow-hidden relative">
                    {/* Ambient glow */}
                    <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-[var(--color-primary)]/[0.03] rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-[var(--color-primary)]/[0.02] rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto px-4 mb-10 md:mb-14 relative z-10">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 mb-3">
                          <span className="w-8 h-px bg-gradient-to-r from-transparent to-[var(--color-primary)]"></span>
                          <span className="text-[var(--color-primary)] font-bold text-[11px] uppercase tracking-[0.3em]">{t('reviews.eyebrow')}</span>
                          <span className="w-8 h-px bg-gradient-to-l from-transparent to-[var(--color-primary)]"></span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white leading-tight">
                          <span className="bg-gradient-to-r from-[var(--color-primary)] via-[#e0c07a] to-[var(--color-primary)] bg-clip-text text-transparent">2.847</span> {t('reviews.count')}
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
                              <i className="fa-solid fa-pen text-[var(--color-primary)] text-xs"></i>
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

                          {reviewDone ? (
                            <div className="flex items-center justify-center gap-3 py-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <i className="fa-solid fa-check text-emerald-400 text-sm"></i>
                              </div>
                              <p className="text-emerald-400 font-semibold text-sm">{t('reviews.thankYou') || 'Yorumunuz alındı, inceleme sonrası yayınlanacak.'}</p>
                            </div>
                          ) : (<>
                          {/* Desktop Layout */}
                          <div className="hidden md:flex items-center gap-3">
                            <div className="flex items-center gap-2 shrink-0">
                              <i className="fa-solid fa-pen text-[var(--color-primary)] text-xs"></i>
                              <span className="text-white text-sm font-medium">{t('reviews.addReview')}:</span>
                            </div>
                            <div className="flex gap-0.5 shrink-0">
                              {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} onClick={() => setReviewRating(star)}
                                  className={`text-sm transition-colors ${star <= reviewRating ? 'text-amber-400' : 'text-slate-600 hover:text-amber-400'}`}>
                                  <i className="fa-solid fa-star"></i>
                                </button>
                              ))}
                            </div>
                            <input type="text" value={reviewFirst} onChange={e => setReviewFirst(e.target.value)} placeholder={t('reviews.firstName')} className="flex-1 min-w-[60px] bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:border-[var(--color-primary)] focus:outline-none transition-colors" />
                            <input type="text" value={reviewLast} onChange={e => setReviewLast(e.target.value)} placeholder={t('reviews.lastName')} className="flex-1 min-w-[60px] bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:border-[var(--color-primary)] focus:outline-none transition-colors" />
                            <input type="text" value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder={t('reviews.yourReview')} className="flex-[2] min-w-[100px] bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs placeholder-slate-500 focus:border-[var(--color-primary)] focus:outline-none transition-colors" />
                            <button onClick={handleReviewSubmit} disabled={reviewSubmitting || !reviewFirst.trim() || !reviewText.trim() || reviewRating === 0}
                              className="shrink-0 bg-gradient-to-r from-[var(--color-primary)] to-amber-600 hover:from-amber-600 hover:to-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-[var(--color-primary)]/10 hover:shadow-[var(--color-primary)]/20">
                              {reviewSubmitting ? <i className="fa-solid fa-circle-notch fa-spin text-[10px]"></i> : <i className="fa-solid fa-paper-plane text-[10px]"></i>}
                              {t('reviews.send')}
                            </button>
                          </div>

                          {/* Mobile Layout - Vertical Stack */}
                          <div className="md:hidden space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <input type="text" value={reviewFirst} onChange={e => setReviewFirst(e.target.value)} placeholder={t('reviews.firstName')} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 min-h-[48px] text-white text-sm placeholder-slate-500 focus:border-[var(--color-primary)] focus:outline-none transition-colors" />
                              <input type="text" value={reviewLast} onChange={e => setReviewLast(e.target.value)} placeholder={t('reviews.lastName')} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 min-h-[48px] text-white text-sm placeholder-slate-500 focus:border-[var(--color-primary)] focus:outline-none transition-colors" />
                            </div>
                            <input type="text" value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder={t('reviews.yourReview')} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 min-h-[48px] text-white text-sm placeholder-slate-500 focus:border-[var(--color-primary)] focus:outline-none transition-colors" />
                            <button onClick={handleReviewSubmit} disabled={reviewSubmitting || !reviewFirst.trim() || !reviewText.trim() || reviewRating === 0}
                              className="w-full bg-gradient-to-r from-[var(--color-primary)] to-amber-600 hover:from-amber-600 hover:to-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold px-4 py-3.5 min-h-[48px] rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-[var(--color-primary)]/10">
                              {reviewSubmitting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                              {t('reviews.submit')}
                            </button>
                          </div>
                          </>)}
                        </div>
                      </div>
                    </div>

                    {/* Dual-Row Kayan Yorumlar — GPU Accelerated */}
                    {(() => {
                      const approvedUserReviews = userReviews.filter(r => r.status === 'approved');
                      const allMarquee = [...approvedUserReviews, ...REVIEWS];
                      const row1 = allMarquee.slice(0, Math.max(15, approvedUserReviews.length + 8));
                      const row2 = allMarquee.slice(row1.length, row1.length + 15).length >= 5
                        ? allMarquee.slice(row1.length, row1.length + 15)
                        : REVIEWS.slice(35, 50);
                      return (
                    <div className="relative space-y-4">
                      {/* Fade edges */}
                      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[var(--color-dark)] to-transparent z-20 pointer-events-none"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[var(--color-dark)] to-transparent z-20 pointer-events-none"></div>

                      {/* Row 1 — Left to Right */}
                      <div className="flex gap-4 marquee-row-1 px-4">
                        {[...row1, ...row1].map((review, index) => (
                          <div key={`r1-${review.id}-${index}`} className="review-card-2026 w-[300px] md:w-[360px] flex-shrink-0 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                              {/* Avatar with gradient ring */}
                              <div className="relative">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-primary)] via-amber-500 to-[var(--color-primary)] p-[2px]">
                                  <div className="w-full h-full rounded-full bg-[var(--color-dark)] flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">
                                    {review.name.charAt(0)}
                                  </div>
                                </div>
                                {/* Verified dot */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[var(--color-dark)] flex items-center justify-center">
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

                      {/* Row 2 — Right to Left */}
                      <div className="flex gap-4 marquee-row-2 px-4">
                        {[...row2, ...row2].map((review, index) => (
                          <div key={`r2-${review.id}-${index}`} className="review-card-2026 w-[300px] md:w-[360px] flex-shrink-0 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                              {/* Avatar with gradient ring */}
                              <div className="relative">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-primary)] via-amber-500 to-[var(--color-primary)] p-[2px]">
                                  <div className="w-full h-full rounded-full bg-[var(--color-dark)] flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">
                                    {review.name.charAt(0)}
                                  </div>
                                </div>
                                {/* Verified dot */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[var(--color-dark)] flex items-center justify-center">
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
                      );
                    })()}
                  </section>
                </>
              } />
            </Routes>
          )}
        </main>

        {/* ── Global Booking Modal — tüm sayfalarda çalışır ── */}
        {isBookingFormOpen && (
          <div className="fixed inset-0 z-[500] flex items-end justify-center lg:items-center p-0 lg:p-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={() => setIsBookingFormOpen(false)} />
            <div className="relative w-full lg:max-w-[480px] max-h-[95vh] lg:max-h-[92vh] animate-in slide-in-from-bottom lg:zoom-in-95 duration-400 ease-out">
              <div className="rounded-t-[2rem] lg:rounded-3xl shadow-2xl shadow-black/60 overflow-hidden relative border-t lg:border border-white/10"
                style={{ background: 'rgba(10,10,14,0.88)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}>
                <div className="flex justify-center pt-3 pb-1 lg:hidden">
                  <div className="w-10 h-1 rounded-full bg-white/15" />
                </div>
                <div className="px-6 pt-5 pb-4 lg:pt-7 flex items-start justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 mb-2">
                      <span className="w-5 h-[2px] bg-[var(--color-primary)]" />
                      <span className="text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: "'Outfit', sans-serif" }}>{t('form.eyebrow')}</span>
                    </div>
                    <h3 className="text-white font-bold text-xl" style={{ fontFamily: "'Outfit', sans-serif" }}>{t('form.title')}</h3>
                  </div>
                  <button onClick={() => setIsBookingFormOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors mt-1">
                    <i className="fa-solid fa-xmark text-sm" />
                  </button>
                </div>
                <div className="px-2 pb-4 lg:pb-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                  <BookingForm onBookingSubmit={(booking) => { handleNewBooking(booking); setIsBookingFormOpen(false); }} vehicles={siteContent.vehicles} />
                </div>
                <div className="px-6 py-3 border-t border-white/[0.06] flex items-center justify-center gap-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
                    <i className="fa-solid fa-lock text-[8px] text-emerald-400" /><span>{t('form.trustSecure')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
                    <i className="fa-solid fa-bolt text-[8px] text-amber-400" /><span>{t('form.trustFast')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
                    <i className="fa-brands fa-whatsapp text-[8px] text-[#25D366]" /><span>{t('form.trustWhatsapp')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer - Admin ve Login modunda gizle (public browse modunda göster) */}
        {(!isAdmin || isPublicBrowse) && !isLoginPage && !isAdminPage && (
          <footer id="contact" className="bg-[var(--color-darker)] text-white py-6 pb-28 lg:pb-6 border-t border-[var(--color-primary)]/20">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 text-center md:text-left mb-6">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <img src={siteContent.business.logo || '/logo.png'} alt={`${siteContent.business.name} Logo`} className="h-12 w-auto" onError={(e) => (e.currentTarget.src = '/logo.png')} />
                  <div>
                    <h4 className="text-white font-black text-xl tracking-tight">{siteContent.business.name}</h4>
                    <p className="text-slate-400 text-xs">{t('footer.tagline')}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest mb-3">{t('footer.contact')}</h4>
                  <ul className="space-y-3 md:space-y-2 text-sm text-slate-300">
                    <li><a href={`tel:${siteContent.business.phone}`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)] transition-colors inline-flex items-center min-h-[44px] md:min-h-0"><i className="fa-solid fa-phone mr-3 text-[var(--color-primary)]"></i>{siteContent.business.phone}</a></li>
                    <li><a href={`mailto:${siteContent.business.email}`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-primary)] transition-colors inline-flex items-center min-h-[44px] md:min-h-0"><i className="fa-solid fa-envelope mr-3 text-[var(--color-primary)]"></i>{siteContent.business.email}</a></li>
                    <li className="inline-flex items-center"><i className="fa-solid fa-location-dot mr-3 text-[var(--color-primary)]"></i>{siteContent.business.address}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest mb-3">{t('footer.quickSupport')}</h4>
                  <div className="flex justify-center md:justify-start space-x-3">
                    <a href={`https://wa.me/${siteContent.business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-11 md:h-11 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl md:text-lg hover:scale-110 active:scale-95 transition-transform shadow-lg"><i className="fa-brands fa-whatsapp"></i></a>
                    <a href={siteContent.business.telegram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-11 md:h-11 bg-sky-500 rounded-full flex items-center justify-center text-white text-xl md:text-lg hover:scale-110 active:scale-95 transition-transform shadow-lg"><i className="fa-brands fa-telegram"></i></a>
                    <a href={siteContent.business.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-11 md:h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl md:text-lg hover:scale-110 active:scale-95 transition-transform shadow-lg"><i className="fa-brands fa-instagram"></i></a>
                    <a href={siteContent.business.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-11 md:h-11 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl md:text-lg hover:scale-110 active:scale-95 transition-transform shadow-lg"><i className="fa-brands fa-facebook-f"></i></a>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-[10px] font-bold tracking-[0.3em] uppercase text-center pt-4 border-t border-white/5">
                © {new Date().getFullYear()} {siteContent.business.name} - ALL RIGHTS RESERVED - DESIGN{' '}
                <a
                  href="https://wa.me/905523890771"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  style={{
                    fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
                    color: '#c5a059',
                    letterSpacing: '0.18em',
                    textShadow: '0 0 8px rgba(197,160,89,0.7), 0 0 20px rgba(197,160,89,0.4)',
                    animation: 'hozyonPulse 2.4s ease-in-out infinite',
                  }}
                >
                  HOZYON
                </a>
              </p>
            </div>
          </footer>
        )}

        {/* WhatsApp Floating Button - Bottom Left */}
        {(!isAdmin || isPublicBrowse) && !isLoginPage && !isAdminPage && (
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
      {/* ── Şifre Sıfırlama Modal ── */}
      {showResetModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#0f172a] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#c5a059]/10 flex items-center justify-center">
                <i className="fa-solid fa-key text-[#c5a059]"></i>
              </div>
              <div>
                <h2 className="text-white font-black text-base">Yeni Şifre Belirle</h2>
                <p className="text-slate-500 text-[11px]">Şifre sıfırlama bağlantısı doğrulandı</p>
              </div>
            </div>
            {resetMessage && (
              <div className={`mb-4 px-3 py-2.5 rounded-xl text-[12px] ${resetMessage.startsWith('✓') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                {resetMessage}
              </div>
            )}
            <div className="space-y-3">
              <input
                type="password"
                value={resetNewPassword}
                onChange={e => setResetNewPassword(e.target.value)}
                placeholder="Yeni şifre"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-[#c5a059]/50"
              />
              <input
                type="password"
                value={resetConfirmPassword}
                onChange={e => setResetConfirmPassword(e.target.value)}
                placeholder="Yeni şifre (tekrar)"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none focus:border-[#c5a059]/50"
              />
              <button
                disabled={resetLoading || !resetNewPassword || resetNewPassword !== resetConfirmPassword || resetNewPassword.length < 6}
                onClick={async () => {
                  if (resetNewPassword !== resetConfirmPassword) { setResetMessage('Şifreler eşleşmiyor'); return; }
                  if (resetNewPassword.length < 6) { setResetMessage('En az 6 karakter gerekli'); return; }
                  setResetLoading(true);
                  const { error } = await supabase.auth.updateUser({ password: resetNewPassword });
                  setResetLoading(false);
                  if (error) { setResetMessage(error.message); return; }
                  setResetMessage('✓ Şifreniz başarıyla güncellendi!');
                  setTimeout(async () => {
                    isRecoveryModeRef.current = false;
                    await supabase.auth.signOut();
                    setShowResetModal(false);
                    setResetNewPassword('');
                    setResetConfirmPassword('');
                    setResetMessage('');
                    navigate('/login');
                  }, 1500);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#c5a059] to-amber-600 text-white text-sm font-black disabled:opacity-40 disabled:cursor-not-allowed hover:from-amber-600 hover:to-amber-700 transition-all"
              >
                {resetLoading ? 'Güncelleniyor...' : 'ŞİFREYİ GÜNCELLE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </SiteProvider >
  );
};

export default App;
