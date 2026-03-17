import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BUSINESS_INFO, BLOG_POSTS } from '../constants';
import { useSiteContent } from '../SiteContext';
import type { NavMenuItem } from '../types';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppStore } from '../store/useAppStore';

interface NavbarProps {
  onAdminToggle: () => void;
  isAdmin: boolean;
  content: NavMenuItem[];
}

/* ─── Animated hamburger SVG ─────────────────────────────────── */
const HamburgerIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg
    width="20" height="20" viewBox="0 0 20 20"
    fill="none" aria-hidden="true"
    style={{ overflow: 'visible' }}
  >
    {/* top bar */}
    <line
      x1="2" y1="5" x2="18" y2="5"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
      style={{
        transformOrigin: '10px 5px',
        transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)',
        transform: isOpen ? 'translateY(5px) rotate(45deg)' : 'none',
      }}
    />
    {/* middle bar */}
    <line
      x1="2" y1="10" x2="18" y2="10"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
      style={{
        transformOrigin: '10px 10px',
        transition: 'opacity 0.22s ease, transform 0.38s cubic-bezier(0.4,0,0.2,1)',
        opacity: isOpen ? 0 : 1,
        transform: isOpen ? 'scaleX(0.3)' : 'none',
      }}
    />
    {/* bottom bar */}
    <line
      x1="2" y1="15" x2="18" y2="15"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
      style={{
        transformOrigin: '10px 15px',
        transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1)',
        transform: isOpen ? 'translateY(-5px) rotate(-45deg)' : 'none',
      }}
    />
  </svg>
);

/* ─── Main component ─────────────────────────────────────────── */
const Navbar: React.FC<NavbarProps> = ({ onAdminToggle, isAdmin }) => {
  const { siteContent } = useSiteContent();
  const { t } = useLanguage();
  const { setBookingFormOpen } = useAppStore();
  const location = useLocation();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  /* reset state on close */
  useEffect(() => {
    if (!isMobileMenuOpen) {
      const t = setTimeout(() => { setExpandedItems([]); setSearchQuery(''); }, 400);
      return () => clearTimeout(t);
    }
  }, [isMobileMenuOpen]);

  /* close on route change — wrapped in microtask to avoid sync setState in effect */
  useEffect(() => {
    const id = setTimeout(() => setIsMobileMenuOpen(false), 0);
    return () => clearTimeout(id);
  }, [location.pathname]);

  const toggleSubmenu = (id: string) =>
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );

  const close = () => setIsMobileMenuOpen(false);

  /* ── nav helpers ──────────────────────────────────────────── */
  const NAV_KEY_MAP: Record<string, string> = {
    '/': 'nav.home', '/hakkimizda': 'nav.about', '/vizyon-misyon': 'nav.vision',
    '/bolgeler': 'nav.regions', '/sss': 'nav.faq', '/blog': 'nav.blog', '/iletisim': 'nav.contact',
  };

  const translateNav = (item: NavMenuItem) => {
    if (NAV_KEY_MAP[item.url]) return t(NAV_KEY_MAP[item.url]);
    const l = item.label.toLowerCase();
    if (l.includes('kurumsal') || l === 'corporate' || l === 'unternehmen') return t('nav.corporate');
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
  const isSolid = scrolled || isAdmin;

  /* ── search results ──────────────────────────────────────── */
  const buildResults = (q: string) => {
    const nq = q.toLowerCase();
    const pages = menuItems
      .filter(i => i.label.toLowerCase().includes(nq))
      .map(i => ({ type: 'SAYFA', label: i.label, url: i.url, icon: 'fa-link' }));
    const blogs = BLOG_POSTS
      .filter(p => p.title.toLowerCase().includes(nq) || p.tags.some(tag => tag.includes(nq)))
      .slice(0, 4)
      .map(p => ({ type: 'BLOG', label: p.title, url: `/blog/${p.slug}`, icon: 'fa-newspaper' }));
    const regions = siteContent.regions
      .filter(r => r.name.toLowerCase().includes(nq))
      .slice(0, 4)
      .map(r => ({ type: 'BÖLGE', label: r.name, url: `/bolgeler?q=${encodeURIComponent(r.name)}`, icon: 'fa-location-dot' }));
    const faqs = siteContent.faq
      .filter(f => f.q.toLowerCase().includes(nq))
      .slice(0, 3)
      .map(f => ({ type: 'SSS', label: f.q, url: '/sss', icon: 'fa-circle-question' }));
    return [...pages, ...regions, ...blogs, ...faqs];
  };

  const searchResults = searchQuery.length > 1 ? buildResults(searchQuery) : [];

  /* ─────────────────────────────────────────────────────────── */
  return (
    <>
      {/* ── STYLES ─────────────────────────────────────────── */}
      <style>{`
        @keyframes logoPop {
          0%   { transform: scale(0); opacity: 0; }
          5%,95%{ transform: scale(1); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
        @keyframes textReveal {
          0%   { max-width: 0;     opacity: 0; margin-left: 0; }
          5%,95%{ max-width: 600px; opacity: 1; margin-left: .75rem; }
          100% { max-width: 0;     opacity: 0; margin-left: 0; }
        }
        .animate-logo-pop   { animation: logoPop    20s infinite cubic-bezier(.34,1.56,.64,1); }
        .animate-text-reveal{
          overflow: hidden; white-space: nowrap; display: inline-block;
          animation: textReveal 20s infinite cubic-bezier(.4,0,.2,1);
        }
        @media (max-width:1023px){
          .navbar-logo-wrapper .animate-text-reveal{
            position:absolute; left:100%; top:50%;
            transform:translateY(-50%); pointer-events:none;
          }
        }

        /* ── mobile sheet animations ── */
        @keyframes sheetIn {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes sheetOut {
          from { transform: translateY(0); }
          to   { transform: translateY(100%); }
        }
        .sheet-enter { animation: sheetIn  .45s cubic-bezier(.32,.72,0,1) forwards; }
        .sheet-exit  { animation: sheetOut .35s cubic-bezier(.4, 0,.6,1) forwards; }

        /* stagger each nav row */
        .nav-row { opacity: 0; transform: translateY(14px); }
        .nav-row.visible {
          animation: navRowIn .38s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes navRowIn {
          to { opacity:1; transform: translateY(0); }
        }

        /* quick action pulse */
        @keyframes qaPulse {
          0%,100%{ box-shadow: 0 0 0 0 rgba(197,160,89,.25); }
          50%    { box-shadow: 0 0 0 8px rgba(197,160,89,.0); }
        }
        .qa-primary { animation: qaPulse 2.5s ease-in-out infinite; }

        /* WA pulse */
        @keyframes waPulse {
          0%,100%{ box-shadow: 0 0 0 0 rgba(37,211,102,.25); }
          50%    { box-shadow: 0 0 0 8px rgba(37,211,102,.0); }
        }
        .qa-wa { animation: waPulse 2.5s ease-in-out infinite 0.6s; }

        /* search ring */
        .search-ring:focus-within {
          box-shadow: 0 0 0 2px rgba(197,160,89,.35);
        }

        /* active pill slide */
        .active-pill {
          background: linear-gradient(135deg,rgba(197,160,89,.18) 0%,rgba(197,160,89,.06) 100%);
          border: 1px solid rgba(197,160,89,.22);
        }
      `}</style>

      {/* ── TOP HEADER ─────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 border-b border-white/[0.09]
          ${isSolid ? 'py-1 h-16 shadow-lg' : 'py-2 h-20 shadow-sm'}`}
        style={{
          background: 'rgba(15,23,42,0.06)',
          backdropFilter: 'blur(80px)',
          WebkitBackdropFilter: 'blur(80px)',
          paddingLeft:  'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">

            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0 relative navbar-logo-wrapper">
              <div className="animate-logo-pop z-10 relative">
                <img
                  src={siteContent.business.logo || '/logo.png'} alt="Logo"
                  className="h-10 md:h-12 w-auto object-contain"
                  onError={e => (e.currentTarget.src = '/logo.png')}
                />
              </div>
              <div className="animate-text-reveal">
                <span className="text-lg md:text-xl font-extrabold uppercase leading-none text-white">
                  {BUSINESS_INFO.name}
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center space-x-2 font-bold text-[13px] h-full text-white">
              {menuItems.map(item => (
                <div
                  key={item.id}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => item.subMenus && setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.url}
                    className="px-4 py-2 transition-all flex items-center group relative hover:text-[var(--color-primary)]"
                  >
                    {translateNav(item)}
                    {item.subMenus && (
                      <i className="fa-solid fa-chevron-down ml-2 text-[10px] opacity-50 group-hover:rotate-180 transition-transform" />
                    )}
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 bg-[var(--color-primary)]" />
                  </Link>
                  {item.subMenus && activeDropdown === item.id && (
                    <div
                      className="absolute top-[80%] left-0 w-56 shadow-2xl rounded-xl border border-white/[0.12] py-3 animate-in fade-in slide-in-from-top-2 duration-200"
                      style={{ background: 'rgba(15,23,42,.06)', backdropFilter: 'blur(80px)', WebkitBackdropFilter: 'blur(80px)' }}
                    >
                      {item.subMenus.map(sub => (
                        <Link key={sub.id} to={sub.url}
                          className="block px-6 py-2.5 hover:bg-white/10 hover:text-[var(--color-primary)] transition-all text-white/70 text-sm font-semibold">
                          {NAV_KEY_MAP[sub.url] ? t(NAV_KEY_MAP[sub.url]) : sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pl-4 ml-4 flex items-center border-l border-white/20 gap-3">
                <LanguageSwitcher />
                <button
                  onClick={onAdminToggle}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${isAdmin ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'}`}
                  title="Admin Paneli"
                >
                  <i className={`fa-solid ${isAdmin ? 'fa-user-gear' : 'fa-lock'}`} />
                </button>
              </div>
            </div>

            {/* Mobile right controls */}
            <div className="lg:hidden flex items-center gap-1">
              <LanguageSwitcher />

              {/* Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(v => !v)}
                aria-label={isMobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
                aria-expanded={isMobileMenuOpen}
                className={`relative w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 active:scale-90
                  ${isMobileMenuOpen
                    ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/25'
                    : 'bg-white/[0.07] text-white/80 border border-white/[0.08] hover:bg-white/[0.12]'}`}
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
          style={{ opacity: isMobileMenuOpen ? 1 : 0, backdropFilter: isMobileMenuOpen ? 'blur(6px)' : 'none', WebkitBackdropFilter: isMobileMenuOpen ? 'blur(6px)' : 'none' }}
          onClick={close}
        />

        {/* Bottom sheet panel */}
        <div
          className={`absolute left-0 right-0 bottom-0 flex flex-col z-[9995] overflow-hidden
            rounded-t-[2.25rem] border-t border-white/[0.10]
            ${isMobileMenuOpen ? 'sheet-enter' : 'sheet-exit pointer-events-none'}`}
          style={{
            maxHeight: '94dvh',
            background: 'rgba(6,9,20,0.88)',
            backdropFilter: 'blur(64px)',
            WebkitBackdropFilter: 'blur(64px)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* ── Drag handle ── */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-[3.5px] rounded-full bg-white/20" />
          </div>

          {/* ── Sheet header ── */}
          <div className="px-5 pt-3 pb-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/[0.07] flex items-center justify-center shrink-0 border border-white/[0.08]">
                <img
                  src={siteContent.business.logo || '/logo.png'} alt="Logo"
                  className="w-full h-full object-contain scale-90"
                  onError={e => (e.currentTarget.src = '/logo.png')}
                />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/35 uppercase tracking-[0.2em] leading-none mb-0.5">{siteContent.business?.name || 'ATA FLUG'}</p>
                <p className="text-[15px] font-extrabold text-white leading-none tracking-tight">TRANSFER</p>
              </div>
            </div>
            <button
              onClick={close}
              className="w-11 h-11 rounded-full flex items-center justify-center bg-white/[0.07] text-white/50 hover:text-white border border-white/[0.08] active:scale-90 transition-all"
              aria-label="Kapat"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* ── Quick action CTAs ── */}
          <div className="px-5 pb-4 grid grid-cols-2 gap-2.5 shrink-0">
            <button
              onClick={() => { setBookingFormOpen(true); close(); }}
              className="qa-primary flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-[13px] text-[var(--color-dark)] active:scale-[0.97] transition-transform"
              style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 70%, white 30%), var(--color-primary))' }}
            >
              <i className="fa-solid fa-calendar-check text-sm" />
              <span className="tracking-wide">{t('hero.cta')}</span>
            </button>
            <a
              href={`https://wa.me/${siteContent.business.whatsapp}`}
              target="_blank" rel="noopener noreferrer"
              onClick={close}
              className="qa-wa flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-[13px] text-white active:scale-[0.97] transition-transform"
              style={{ background: 'linear-gradient(135deg,#25d366cc,#1da850cc)', border: '1px solid rgba(37,211,102,.25)' }}
            >
              <i className="fa-brands fa-whatsapp text-lg" />
              <span className="tracking-wide">WhatsApp</span>
            </a>
          </div>

          {/* ── Search bar ── */}
          <div className="px-5 pb-3 shrink-0">
            <div
              className="search-ring flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/[0.09] transition-all"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <i className={`fa-solid fa-${searchFocused || searchQuery ? 'magnifying-glass text-[var(--color-primary)]' : 'magnifying-glass text-white/25'} text-sm transition-colors`} />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder={t('nav.search')}
                className="flex-1 bg-transparent outline-none text-[14px] text-white placeholder-white/25 font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-white/30 hover:text-white/60 transition-colors active:scale-90 p-1">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-3" style={{ WebkitOverflowScrolling: 'touch' }}>

            {/* ---- SEARCH RESULTS ---- */}
            {searchQuery.length > 1 ? (
              <div className="space-y-1 pt-1">
                {searchResults.length === 0 ? (
                  <div className="flex flex-col items-center py-10 gap-3 text-white/25">
                    <i className="fa-solid fa-magnifying-glass text-3xl" />
                    <p className="text-sm font-medium">Sonuç bulunamadı</p>
                  </div>
                ) : searchResults.map((r, i) => (
                  <Link
                    key={i} to={r.url} onClick={close}
                    className="flex items-center gap-3.5 px-3 py-3.5 rounded-2xl hover:bg-white/[0.06] active:bg-white/[0.09] transition-colors group"
                  >
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
              /* ---- MAIN NAV LIST ---- */
              <>
                {/* section label */}
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.25em] px-2 pb-2 pt-1">Menü</p>

                <div className="space-y-0.5">
                  {menuItems.map((item, idx) => {
                    const isActive = location.pathname === item.url ||
                      (item.subMenus?.some(s => location.pathname === s.url));
                    const isExpanded = expandedItems.includes(item.id);
                    const icon = getIcon(item.label);

                    return (
                      <div
                        key={item.id}
                        className={`nav-row ${isMobileMenuOpen ? 'visible' : ''}`}
                        style={{ animationDelay: `${80 + idx * 45}ms` }}
                      >
                        {/* row */}
                        <div className={`rounded-2xl overflow-hidden transition-colors ${isActive ? 'active-pill' : ''}`}>
                          <div className="flex items-center">
                            <Link
                              to={item.url}
                              onClick={() => !item.subMenus && close()}
                              className="flex items-center gap-4 flex-1 px-4 py-[17px] active:bg-white/[0.04] transition-colors"
                            >
                              {/* icon container */}
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[15px] shrink-0 transition-all
                                ${isActive
                                  ? 'bg-gradient-to-br from-[var(--color-primary)] to-[#a8864a] text-white shadow-md shadow-[var(--color-primary)]/25'
                                  : 'bg-white/[0.06] text-white/35 border border-white/[0.06]'
                                }`}>
                                <i className={`fa-solid ${icon}`} />
                              </div>

                              {/* label */}
                              <span className={`font-bold text-[15.5px] tracking-[-0.01em] transition-colors
                                ${isActive ? 'text-white' : 'text-white/55'}`}>
                                {translateNav(item)}
                              </span>

                              {/* active dot */}
                              {isActive && !item.subMenus && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mr-1" />
                              )}
                            </Link>

                            {/* submenu toggle */}
                            {item.subMenus && (
                              <button
                                onClick={() => toggleSubmenu(item.id)}
                                className="px-4 py-[17px] flex items-center justify-center text-white/25 hover:text-white/60 active:bg-white/[0.04] transition-colors"
                                aria-expanded={isExpanded}
                              >
                                <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300
                                  ${isExpanded ? 'rotate-180 text-[var(--color-primary)]' : ''}`} />
                              </button>
                            )}
                            {/* right arrow for non-submenu */}
                            {!item.subMenus && !isActive && (
                              <i className="fa-solid fa-chevron-right text-[9px] text-white/[0.12] mr-4" />
                            )}
                          </div>

                          {/* collapsible sub-items */}
                          <div className={`transition-all duration-300 ease-in-out overflow-hidden
                            ${isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="ml-[2.5rem] sm:ml-[3.25rem] mr-3 mb-2 border-l-2 border-white/[0.06] pl-4 space-y-0.5">
                              {item.subMenus?.map(sub => (
                                <Link
                                  key={sub.id} to={sub.url} onClick={close}
                                  className={`flex items-center gap-2 py-3 px-2 text-[13.5px] font-semibold rounded-xl transition-colors active:bg-white/[0.06]
                                    ${location.pathname === sub.url ? 'text-[var(--color-primary)]' : 'text-white/35 hover:text-white/70'}`}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
                                  {NAV_KEY_MAP[sub.url] ? t(NAV_KEY_MAP[sub.url]) : sub.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ── divider ── */}
                <div className="my-4 border-t border-white/[0.06]" />

                {/* ── Contact row ── */}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${siteContent.business.phone}`}
                    className="nav-row visible flex items-center gap-2.5 px-3.5 py-3.5 rounded-2xl border border-white/[0.05] active:bg-white/[0.06] transition-colors"
                    style={{ background: 'rgba(255,255,255,0.03)', animationDelay: `${80 + menuItems.length * 45 + 80}ms` }}
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-phone text-emerald-400 text-xs" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-white/25 uppercase tracking-wider">Ara</p>
                      <p className="text-[11px] font-bold text-white/60 truncate">{siteContent.business.phone}</p>
                    </div>
                  </a>
                  <a
                    href={`mailto:${siteContent.business.email}`}
                    className="nav-row visible flex items-center gap-2.5 px-3.5 py-3.5 rounded-2xl border border-white/[0.05] active:bg-white/[0.06] transition-colors"
                    style={{ background: 'rgba(255,255,255,0.03)', animationDelay: `${80 + menuItems.length * 45 + 100}ms` }}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-envelope text-[var(--color-primary)] text-xs" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-white/25 uppercase tracking-wider">E-posta</p>
                      <p className="text-[11px] font-bold text-white/60 truncate">{siteContent.business.email}</p>
                    </div>
                  </a>
                </div>
              </>
            )}
          </div>

          {/* ── Footer: social links + admin ── */}
          <div className="px-5 pt-3 pb-3 border-t border-white/[0.06] shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {siteContent.business.instagram && (
                <a href={siteContent.business.instagram} target="_blank" rel="noopener noreferrer" onClick={close}
                  className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-white/30 hover:text-pink-400 hover:bg-pink-500/10 transition-all active:scale-90">
                  <i className="fa-brands fa-instagram text-sm" />
                </a>
              )}
              {siteContent.business.facebook && (
                <a href={siteContent.business.facebook} target="_blank" rel="noopener noreferrer" onClick={close}
                  className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-white/30 hover:text-blue-400 hover:bg-blue-500/10 transition-all active:scale-90">
                  <i className="fa-brands fa-facebook-f text-sm" />
                </a>
              )}
              {siteContent.business.telegram && (
                <a href={siteContent.business.telegram} target="_blank" rel="noopener noreferrer" onClick={close}
                  className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-white/30 hover:text-sky-400 hover:bg-sky-500/10 transition-all active:scale-90">
                  <i className="fa-brands fa-telegram text-sm" />
                </a>
              )}
            </div>

            <button
              onClick={() => { onAdminToggle(); close(); }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/25 hover:text-[var(--color-primary)]/70 hover:bg-[var(--color-primary)]/[0.07] transition-all active:scale-95 text-[12px] font-bold"
            >
              <i className="fa-solid fa-gear text-[11px]" />
              <span>Yönetici</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
