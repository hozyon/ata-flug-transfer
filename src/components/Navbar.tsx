'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSiteContent } from '../SiteContext';
import type { NavMenuItem } from '../types';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';
import { useLanguage, LANGUAGE_LABELS, type Language } from '../i18n/LanguageContext';
import { useAppStore } from '../store/useAppStore';

interface NavbarProps {
  onAdminToggle: () => void;
  isAdmin: boolean;
  content: NavMenuItem[];
}

/* ─── Animated hamburger SVG ─────────────────────────────────── */
const HamburgerIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ overflow: 'visible' }}>
    <line x1="2" y1="5" x2="18" y2="5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
      style={{ transformOrigin: '10px 5px', transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)', transform: isOpen ? 'translateY(5px) rotate(45deg)' : 'none' }} />
    <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
      style={{ transformOrigin: '10px 10px', transition: 'opacity 0.22s ease, transform 0.38s cubic-bezier(0.4,0,0.2,1)', opacity: isOpen ? 0 : 1, transform: isOpen ? 'scaleX(0.3)' : 'none' }} />
    <line x1="2" y1="15" x2="18" y2="15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
      style={{ transformOrigin: '10px 15px', transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)', transform: isOpen ? 'translateY(-5px) rotate(-45deg)' : 'none' }} />
  </svg>
);

/* ─── Main component ─────────────────────────────────────────── */
const Navbar: React.FC<NavbarProps> = ({ onAdminToggle, isAdmin }) => {
  const { siteContent } = useSiteContent();
  const { language, setLanguage } = useLanguage();
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const tHero = useTranslations('hero');
  const tFaq = useTranslations('faq');
  const { setBookingFormOpen, blogPosts } = useAppStore();
  const pathname = usePathname();
  const router = useRouter();

  const adminTapCount = useRef(0);
  const adminTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Extract locale from pathname
  const localeMatch = pathname?.match(/^\/([a-z]{2})(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : 'tr';

  const handleAdminTap = () => {
    if (isAdmin) { onAdminToggle(); close(); return; }
    adminTapCount.current += 1;
    if (adminTapTimer.current) clearTimeout(adminTapTimer.current);
    if (adminTapCount.current >= 5) {
      adminTapCount.current = 0;
      close();
      router.push(`/${locale}/login`);
      return;
    }
    adminTapTimer.current = setTimeout(() => { adminTapCount.current = 0; }, 1500);
  };

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      const timer = setTimeout(() => { setExpandedItems([]); setSearchQuery(''); }, 400);
      return () => clearTimeout(timer);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const id = setTimeout(() => setIsMobileMenuOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  const toggleSubmenu = (id: string) =>
    setExpandedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const close = () => setIsMobileMenuOpen(false);

  const NAV_KEY_MAP: Record<string, Parameters<typeof tNav>[0]> = {
    '/': 'home', '/hakkimizda': 'about', '/vizyon-misyon': 'vision',
    '/bolgeler': 'regions', '/sss': 'faq', '/blog': 'blog', '/iletisim': 'contact',
  };

  const translateNav = (item: NavMenuItem) => {
    if (NAV_KEY_MAP[item.url]) return tNav(NAV_KEY_MAP[item.url]);
    const l = item.label.toLowerCase();
    if (l.includes('kurumsal') || l === 'corporate' || l === 'unternehmen') return tNav('corporate');
    return item.label;
  };

  const getIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('ana sayfa')) return 'fa-house';
    if (l.includes('kurumsal') || l.includes('hakkımızda')) return 'fa-building-columns';
    if (l.includes('bölgeler')) return 'fa-map-location-dot';
    if (l.includes('s.s.s')) return 'fa-circle-question';
    if (l.includes('blog')) return 'fa-newspaper';
    if (l.includes('iletişim')) return 'fa-headset';
    return 'fa-circle-dot';
  };

  const menuItems = siteContent.navbar;

  const buildResults = (q: string) => {
    const nq = q.toLowerCase();
    const pages = menuItems.filter(i => i.label.toLowerCase().includes(nq))
      .map(i => ({ type: 'SAYFA', label: i.label, url: i.url, icon: 'fa-link' }));
    const blogs = blogPosts.filter(p => p.title.toLowerCase().includes(nq) || p.tags.some((tag: string) => tag.includes(nq)))
      .slice(0, 4).map(p => ({ type: 'BLOG', label: p.title, url: `/blog/${p.slug}`, icon: 'fa-newspaper' }));
    const regions = siteContent.regions.filter(r => r.name.toLowerCase().includes(nq))
      .slice(0, 4).map(r => ({ type: 'BÖLGE', label: r.name, url: `/bolgeler?q=${encodeURIComponent(r.name)}`, icon: 'fa-location-dot' }));
    const faqs = siteContent.faq.filter(f => f.q.toLowerCase().includes(nq))
      .slice(0, 3).map(f => ({ type: 'SSS', label: f.q, url: '/sss', icon: 'fa-circle-question' }));
    return [...pages, ...regions, ...blogs, ...faqs];
  };

  const searchResults = searchQuery.length > 1 ? buildResults(searchQuery) : [];

  return (
    <>
      <style>{`
        /* ── Navbar enter ── */
        @keyframes navbarIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .navbar-enter { animation: navbarIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards; }

        /* ── Gold accent line ── */
        .navbar-accent-line {
          position: absolute;
          inset: 0 0 auto 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(197,160,89,0.6) 30%, rgba(197,160,89,0.9) 50%, rgba(197,160,89,0.6) 70%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .navbar-accent-line.visible { opacity: 1; }

        /* ── Desktop nav link ── */
        .nav-link-desktop {
          position: relative;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 5px 9px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          transition: color 0.2s ease, background 0.2s ease;
          white-space: nowrap;
        }
        .nav-link-desktop:hover {
          color: rgba(255,255,255,0.95);
          background: rgba(255,255,255,0.05);
        }
        .nav-link-desktop.active {
          color: var(--color-primary);
          background: rgba(197,160,89,0.08);
        }
        .nav-link-desktop .underline-bar {
          position: absolute;
          bottom: 0; left: 9px; right: 9px;
          height: 1.5px;
          background: var(--color-primary);
          border-radius: 1px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        .nav-link-desktop:hover .underline-bar,
        .nav-link-desktop.active .underline-bar { transform: scaleX(1); }

        /* ── mobile sheet animations ── */
        @keyframes sheetIn  { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes sheetOut { from { transform: translateY(0); } to { transform: translateY(100%); } }
        .sheet-enter { animation: sheetIn  .45s cubic-bezier(.32,.72,0,1) forwards; }
        .sheet-exit  { animation: sheetOut .35s cubic-bezier(.4, 0,.6,1) forwards; }

        /* ── nav row stagger ── */
        .nav-row { opacity: 0; transform: translateY(14px); }
        .nav-row.visible { animation: navRowIn .38s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes navRowIn { to { opacity:1; transform: translateY(0); } }

        /* ── CTA pulse ── */
        @keyframes ctaPulse {
          0%,100%{ box-shadow: 0 0 0 0 rgba(197,160,89,.3); }
          50%    { box-shadow: 0 0 0 6px rgba(197,160,89,.0); }
        }
        .cta-pulse { animation: ctaPulse 2.8s ease-in-out infinite; }

        @keyframes waPulse {
          0%,100%{ box-shadow: 0 0 0 0 rgba(37,211,102,.25); }
          50%    { box-shadow: 0 0 0 8px rgba(37,211,102,.0); }
        }
        .qa-wa { animation: waPulse 2.5s ease-in-out infinite 0.6s; }

        .search-ring:focus-within { box-shadow: 0 0 0 2px rgba(197,160,89,.35); }

        .active-pill {
          background: linear-gradient(135deg,rgba(197,160,89,.18) 0%,rgba(197,160,89,.06) 100%);
          border: 1px solid rgba(197,160,89,.22);
        }

        /* ── Phone number shimmer ── */
        @keyframes phoneShimmer {
          0%  { opacity: 0.45; }
          50% { opacity: 0.75; }
          100%{ opacity: 0.45; }
        }
        .phone-shimmer { animation: phoneShimmer 3s ease-in-out infinite; }
      `}</style>

      {/* ── TOP HEADER ─────────────────────────────────────── */}
      <header
        className="navbar-enter fixed top-0 left-0 w-full z-[100]"
        style={{
          height: '68px',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
          transform: 'translateZ(0)',
        }}
      >
        {/* Base layer — always visible, never transitions (no jitter) */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'rgba(8,10,20,0.22)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }} />
        {/* Scrolled overlay — opacity-only transition (GPU layer, zero jitter) */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'rgba(8,10,20,0.90)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          opacity: scrolled ? 1 : 0,
          transition: 'opacity 0.35s ease',
          willChange: 'opacity',
        }} />
        {/* Gold top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px', pointerEvents: 'none',
          background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.7) 30%, rgba(197,160,89,0.95) 50%, rgba(197,160,89,0.7) 70%, transparent)',
          opacity: scrolled ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }} />

        <nav className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 h-full relative">
          <div className="flex items-center justify-between h-full gap-4">

            {/* ── Logo ── */}
            <Link href={`/${locale}`} className="flex items-center gap-3 shrink-0 group">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={siteContent.business.logo || '/logo.png'}
                  alt={siteContent.business.name || 'Logo'}
                  className="h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={e => (e.currentTarget.src = '/logo.png')}
                />
              </div>
              <div className="block">
                <div className="hidden xs:block text-[10px] font-bold text-white/30 uppercase tracking-[0.25em] leading-none">
                  {tHero('eyebrow') || 'VIP Transfer'}
                </div>
                <div className="text-[12px] sm:text-[15px] font-extrabold text-white leading-tight tracking-tight"
                  style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {siteContent.business.name}
                </div>
              </div>
            </Link>

            {/* ── Desktop nav ── */}
            <div className="hidden lg:flex items-center gap-1 h-full flex-1 justify-center">
              {menuItems.map(item => {
                const hasSubMenu = !!(item.subMenus && item.subMenus.length > 0 && item.url !== '/bolgeler');
                const isActive = pathname === item.url || (item.url !== '/' && (pathname ?? '').startsWith(item.url));
                return (
                  <div
                    key={item.id}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => hasSubMenu && item.id && setActiveDropdown(item.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={`/${locale}${item.url}`}
                      className={`nav-link-desktop ${isActive ? 'active' : ''}`}
                    >
                      {translateNav(item)}
                      {hasSubMenu && (
                        <i className={`fa-solid fa-chevron-down text-[9px] opacity-50 transition-transform duration-200 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                      )}
                      <span className="underline-bar" />
                    </Link>

                    {/* Dropdown */}
                    {hasSubMenu && activeDropdown === item.id && (
                      <div
                        className="absolute top-[calc(100%-4px)] left-1/2 -translate-x-1/2 w-52 py-2 rounded-2xl border border-white/[0.10] shadow-2xl shadow-black/40 animate-in fade-in slide-in-from-top-1 duration-150"
                        style={{ background: 'rgba(10,12,24,0.95)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
                      >
                        {/* Arrow */}
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 rounded-sm border-t border-l border-white/[0.10]"
                          style={{ background: 'rgba(10,12,24,0.95)' }} />
                        {(item.subMenus ?? []).map(sub => (
                          <Link key={sub.id} href={`/${locale}${sub.url}`}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] font-semibold text-white/55 hover:text-white hover:bg-white/[0.06] transition-all mx-1 rounded-xl">
                            <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]/50 shrink-0" />
                            {NAV_KEY_MAP[sub.url] ? tNav(NAV_KEY_MAP[sub.url]) : sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Desktop right: phone + CTA + lang + admin ── */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">

              {/* Phone (subtle) */}
              {siteContent.business.phone && (
                <a
                  href={`tel:${siteContent.business.phone}`}
                  className="phone-shimmer flex items-center gap-1.5 text-white/45 hover:text-[var(--color-primary)] text-[11px] font-semibold tracking-wide transition-colors duration-200 px-2"
                >
                  <i className="fa-solid fa-phone text-[9px]" />
                  <span className="hidden xl:block">{siteContent.business.phone}</span>
                </a>
              )}

              {/* Gold ayraç */}
              <div style={{
                width: 1,
                height: 22,
                background: 'linear-gradient(180deg, transparent 0%, rgba(197,160,89,0.55) 30%, rgba(197,160,89,0.8) 50%, rgba(197,160,89,0.55) 70%, transparent 100%)',
                margin: '0 4px',
                flexShrink: 0,
              }} />

              {/* Rezervasyon CTA */}
              <button
                onClick={() => setBookingFormOpen(true)}
                className="relative flex items-center gap-2 overflow-hidden rounded-xl font-black text-[11.5px] uppercase tracking-[0.09em] transition-all duration-200 active:scale-[0.96] hover:-translate-y-px"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  background: 'linear-gradient(135deg, #e8d49a 0%, #c5a059 55%, #9e7b38 100%)',
                  color: '#0a0c14',
                  padding: '9px 18px',
                  boxShadow: '0 2px 16px rgba(197,160,89,0.35), inset 0 1px 0 rgba(255,255,255,0.28)',
                }}
              >
                <i className="fa-solid fa-car-side text-[11px] shrink-0" />
                <span>{tHero('cta')}</span>
                {/* Shine sweep */}
                <span style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
                  animation: 'shine 3s ease-in-out infinite 2s',
                  pointerEvents: 'none',
                }} />
              </button>

              {/* Gold ayraç */}
              <div style={{
                width: 1,
                height: 22,
                background: 'linear-gradient(180deg, transparent 0%, rgba(197,160,89,0.55) 30%, rgba(197,160,89,0.8) 50%, rgba(197,160,89,0.55) 70%, transparent 100%)',
                margin: '0 4px',
                flexShrink: 0,
              }} />

              <LanguageSwitcher />

              {/* Admin — version badge camouflage */}
              <button
                onClick={onAdminToggle}
                title="ATA Flug Transfer"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '5px 5px',
                  cursor: 'default',
                  opacity: isAdmin ? 0.45 : 0.12,
                  transition: 'opacity 0.5s ease',
                  fontFamily: "'Outfit', monospace",
                  fontSize: '8.5px',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: isAdmin ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
                  lineHeight: 1,
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = isAdmin ? '0.65' : '0.18'; (e.currentTarget as HTMLButtonElement).style.cursor = 'pointer'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = isAdmin ? '0.45' : '0.12'; (e.currentTarget as HTMLButtonElement).style.cursor = 'default'; }}
              >
                v2
              </button>

            </div>

            {/* ── Mobile right controls ── */}
            <div className="lg:hidden flex items-center gap-1.5">
              <LanguageSwitcher />

              {/* Mobile quick booking */}
              <button
                onClick={() => setBookingFormOpen(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/25 text-[var(--color-primary)] transition-all active:scale-90"
                aria-label="Rezervasyon yap"
              >
                <i className="fa-solid fa-calendar-check text-[12px]" />
              </button>

              {/* Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(v => !v)}
                aria-label={isMobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                aria-expanded={isMobileMenuOpen}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 active:scale-90 border
                  ${isMobileMenuOpen
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20'
                    : 'bg-white/[0.06] text-white/70 border-white/[0.07] hover:bg-white/10'}`}
              >
                <HamburgerIcon isOpen={isMobileMenuOpen} />
              </button>
            </div>

          </div>
        </nav>
      </header>

      {/* ── MOBILE FULL-SCREEN SHEET ────────────────────────── */}
      <div
        className={`lg:hidden fixed inset-0 z-[9990] ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        role="dialog" aria-modal="true" aria-label="Navigasyon menüsü"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/55 transition-opacity duration-500"
          style={{
            opacity: isMobileMenuOpen ? 1 : 0,
            backdropFilter: isMobileMenuOpen ? 'blur(6px)' : 'none',
            WebkitBackdropFilter: isMobileMenuOpen ? 'blur(6px)' : 'none',
          }}
          onClick={close}
        />

        {/* Bottom sheet panel */}
        <div
          className={`absolute left-0 right-0 bottom-0 flex flex-col z-[9995] overflow-hidden rounded-t-[2.25rem] border-t border-white/[0.10]
            ${isMobileMenuOpen ? 'sheet-enter' : 'sheet-exit pointer-events-none'}`}
          style={{
            maxHeight: '94dvh',
            background: 'rgba(6,9,20,0.92)',
            backdropFilter: 'blur(64px)',
            WebkitBackdropFilter: 'blur(64px)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* Gold top accent line */}
          <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(197,160,89,0.5) 30%, rgba(197,160,89,0.8) 50%, rgba(197,160,89,0.5) 70%, transparent)' }} />

          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-[3.5px] rounded-full bg-white/15" />
          </div>

          {/* Sheet header */}
          <div className="px-5 pt-2 pb-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/[0.07] flex items-center justify-center shrink-0 border border-white/[0.08]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={siteContent.business.logo || '/logo.png'} alt="Logo"
                  className="w-full h-full object-contain scale-90"
                  onError={e => (e.currentTarget.src = '/logo.png')} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[var(--color-primary)]/50 uppercase tracking-[0.22em] leading-none mb-0.5">
                  {tHero('eyebrow') || 'VIP Transfer'}
                </p>
                <p className="text-[15px] font-extrabold text-white leading-none tracking-tight"
                  style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {siteContent.business?.name || 'ATA FLUG'}
                </p>
              </div>
            </div>
            <button onClick={close}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.06] text-white/40 hover:text-white border border-white/[0.07] active:scale-90 transition-all"
              aria-label={tCommon('close')}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Quick action CTAs */}
          <div className="px-5 pb-3.5 grid grid-cols-2 gap-2 shrink-0">
            <button
              onClick={() => { setBookingFormOpen(true); close(); }}
              className="cta-pulse flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-[13px] text-[#0a0a0e] active:scale-[0.97] transition-transform"
              style={{ background: 'linear-gradient(135deg, #dfc380, var(--color-primary))' }}
            >
              <i className="fa-solid fa-calendar-check text-sm" />
              <span className="tracking-wide">{tHero('cta')}</span>
            </button>
            <a
              href={`https://wa.me/${siteContent.business.whatsapp}`}
              target="_blank" rel="noopener noreferrer"
              onClick={close}
              className="qa-wa flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-[13px] text-white active:scale-[0.97] transition-transform"
              style={{ background: 'linear-gradient(135deg,rgba(37,211,102,0.85),rgba(29,168,80,0.85))', border: '1px solid rgba(37,211,102,.2)' }}
            >
              <i className="fa-brands fa-whatsapp text-lg" />
              <span className="tracking-wide">WhatsApp</span>
            </a>
          </div>

          {/* Search bar */}
          <div className="px-5 pb-3 shrink-0">
            <div
              className="search-ring flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/[0.08] transition-all"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <i className={`fa-solid fa-magnifying-glass text-sm transition-colors ${searchFocused || searchQuery ? 'text-[var(--color-primary)]' : 'text-white/25'}`} />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder={tNav('search')}
                className="flex-1 bg-transparent outline-none text-[14px] text-white placeholder-white/25 font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} aria-label={tCommon('close')} className="text-white/30 hover:text-white/60 transition-colors active:scale-90 p-1">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-3" style={{ WebkitOverflowScrolling: 'touch' }}>

            {searchQuery.length > 1 ? (
              <div className="space-y-1 pt-1">
                {searchResults.length === 0 ? (
                  <div className="flex flex-col items-center py-10 gap-3 text-white/25">
                    <i className="fa-solid fa-magnifying-glass text-3xl" />
                    <p className="text-sm font-medium">{tNav('noResults')}</p>
                  </div>
                ) : searchResults.map((r, i) => (
                  <Link key={i} href={`/${locale}${r.url}`} onClick={close}
                    className="flex items-center gap-3.5 px-3 py-3.5 rounded-2xl hover:bg-white/[0.06] active:bg-white/[0.09] transition-colors group">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.07] text-white/40 group-hover:bg-[var(--color-primary)]/15 group-hover:text-[var(--color-primary)] flex items-center justify-center text-sm shrink-0 transition-colors border border-white/[0.06]">
                      <i className={`fa-solid ${r.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-[9px] font-black text-[var(--color-primary)]/60 uppercase tracking-[0.18em] mb-0.5">{r.type}</span>
                      <span className="block text-[13px] font-semibold text-white/75 truncate group-hover:text-white transition-colors">{r.label}</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-[9px] text-white/15 group-hover:text-[var(--color-primary)]/60 transition-colors" />
                  </Link>
                ))}
              </div>
            ) : (
              <>
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.25em] px-2 pb-2 pt-1">{tNav('menu')}</p>

                <div className="space-y-0.5">
                  {menuItems.map((item, idx) => {
                    const hasSubMenu = !!(item.subMenus && item.subMenus.length > 0 && item.url !== '/bolgeler');
                    const isActive = pathname === item.url ||
                      (hasSubMenu && item.subMenus?.some(s => pathname === s.url));
                    const isExpanded = item.id ? expandedItems.includes(item.id) : false;
                    const icon = getIcon(item.label);

                    return (
                      <div
                        key={item.id}
                        className={`nav-row ${isMobileMenuOpen ? 'visible' : ''}`}
                        style={{ animationDelay: `${60 + idx * 40}ms` }}
                      >
                        <div className={`rounded-2xl overflow-hidden transition-colors ${isActive ? 'active-pill' : ''}`}>
                          <div className="flex items-center">
                            <Link
                              href={`/${locale}${item.url}`}
                              onClick={() => !hasSubMenu && close()}
                              className="flex items-center gap-4 flex-1 px-4 py-[15px] active:bg-white/[0.04] transition-colors"
                            >
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[14px] shrink-0 transition-all
                                ${isActive
                                  ? 'bg-gradient-to-br from-[var(--color-primary)] to-[#a8864a] text-[#0a0a0e] shadow-md shadow-[var(--color-primary)]/20'
                                  : 'bg-white/[0.05] text-white/30 border border-white/[0.06]'}`}>
                                <i className={`fa-solid ${icon}`} />
                              </div>
                              <span className={`uppercase font-bold text-[14.5px] tracking-[0.02em] transition-colors
                                ${isActive ? 'text-white' : 'text-white/50'}`}>
                                {translateNav(item)}
                              </span>
                              {isActive && !hasSubMenu && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mr-1" />
                              )}
                            </Link>

                            {hasSubMenu && (
                              <button
                                onClick={() => item.id && toggleSubmenu(item.id)}
                                className="px-4 py-[15px] flex items-center justify-center text-white/25 hover:text-white/60 active:bg-white/[0.04] transition-colors"
                                aria-expanded={isExpanded}
                                aria-label={isExpanded ? tCommon('close') : item.label}
                              >
                                <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[var(--color-primary)]' : ''}`} aria-hidden="true" />
                              </button>
                            )}
                            {!hasSubMenu && !isActive && (
                              <i className="fa-solid fa-chevron-right text-[9px] text-white/[0.12] mr-4" />
                            )}
                          </div>

                          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded && hasSubMenu ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="ml-[3.25rem] mr-3 mb-2 border-l-2 border-[var(--color-primary)]/10 pl-4 space-y-0.5">
                              {hasSubMenu && item.subMenus?.map(sub => (
                                <Link key={sub.id} href={`/${locale}${sub.url}`} onClick={close}
                                  className={`flex items-center gap-2 py-2.5 px-2 text-[13px] font-semibold rounded-xl transition-colors active:bg-white/[0.06]
                                    ${pathname === sub.url ? 'text-[var(--color-primary)]' : 'text-white/35 hover:text-white/70'}`}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0" />
                                  {NAV_KEY_MAP[sub.url] ? tNav(NAV_KEY_MAP[sub.url]) : sub.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="my-4 border-t border-white/[0.05]" />

                {/* Language selector row */}
                <div className="flex items-center gap-2 flex-wrap pb-3">
                  {(Object.entries(LANGUAGE_LABELS) as [Language, { label: string; flag: string; native: string }][]).map(([code, info]) => (
                    <button
                      key={code}
                      onClick={() => setLanguage(code)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold transition-all active:scale-95 border
                        ${language === code
                          ? 'bg-[var(--color-primary)]/15 border-[var(--color-primary)]/30 text-[var(--color-primary)]'
                          : 'bg-white/[0.04] border-white/[0.06] text-white/35 hover:text-white/60'}`}
                    >
                      <span className="text-base leading-none">{info.flag}</span>
                      <span>{info.native}</span>
                    </button>
                  ))}
                </div>

                <div className="mb-3 border-t border-white/[0.05]" />

                {/* Contact row */}
                <div className="grid grid-cols-2 gap-2">
                  <a href={`tel:${siteContent.business.phone}`}
                    className="nav-row visible flex items-center gap-2.5 px-3.5 py-3.5 rounded-2xl border border-white/[0.05] active:bg-white/[0.06] transition-colors"
                    style={{ background: 'rgba(255,255,255,0.03)', animationDelay: `${60 + menuItems.length * 40 + 80}ms` }}>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-phone text-emerald-400 text-xs" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-white/25 uppercase tracking-wider">{tNav('call')}</p>
                      <p className="text-[11px] font-bold text-white/55 truncate">{siteContent.business.phone}</p>
                    </div>
                  </a>
                  <a href={`mailto:${siteContent.business.email}`}
                    className="nav-row visible flex items-center gap-2.5 px-3.5 py-3.5 rounded-2xl border border-white/[0.05] active:bg-white/[0.06] transition-colors"
                    style={{ background: 'rgba(255,255,255,0.03)', animationDelay: `${60 + menuItems.length * 40 + 100}ms` }}>
                    <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-envelope text-[var(--color-primary)] text-xs" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-white/25 uppercase tracking-wider">{tFaq('email')}</p>
                      <p className="text-[11px] font-bold text-white/55 truncate">{siteContent.business.email}</p>
                    </div>
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Footer: social + admin */}
          <div className="px-5 pt-3 pb-2 border-t border-white/[0.05] shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {siteContent.business.instagram && (
                <a href={siteContent.business.instagram} target="_blank" rel="noopener noreferrer" onClick={close}
                  className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/25 hover:text-pink-400 hover:bg-pink-500/10 transition-all active:scale-90">
                  <i className="fa-brands fa-instagram text-sm" />
                </a>
              )}
              {siteContent.business.facebook && (
                <a href={siteContent.business.facebook} target="_blank" rel="noopener noreferrer" onClick={close}
                  className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/25 hover:text-blue-400 hover:bg-blue-500/10 transition-all active:scale-90">
                  <i className="fa-brands fa-facebook-f text-sm" />
                </a>
              )}
              {siteContent.business.telegram && (
                <a href={siteContent.business.telegram} target="_blank" rel="noopener noreferrer" onClick={close}
                  className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/25 hover:text-sky-400 hover:bg-sky-500/10 transition-all active:scale-90">
                  <i className="fa-brands fa-telegram text-sm" />
                </a>
              )}
            </div>

            <button
              onClick={handleAdminTap}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all active:scale-95 text-[11px] font-bold
                ${isAdmin
                  ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)]/70'
                  : 'bg-white/[0.04] border border-white/[0.06] text-white/25 hover:text-white/40'}`}
              title={isAdmin ? 'Panel' : 'v2.4'}
            >
              <i className={`fa-solid ${isAdmin ? 'fa-user-gear' : 'fa-gear'} text-[10px]`} />
              <span>{tNav('admin')}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
