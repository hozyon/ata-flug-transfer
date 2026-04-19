'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSiteContent } from '../SiteContext';
import { useAppStore } from '../store/useAppStore';

interface NavbarProps {
  onAdminToggle: () => void;
  isAdmin: boolean;
}

const HamburgerIcon: React.FC<{ isOpen: boolean; scrolled: boolean }> = ({ isOpen, scrolled }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ overflow: 'visible' }}>
    <line x1="3" y1="8" x2="21" y2="8" stroke={isOpen || scrolled ? "#111" : "#fff"} strokeWidth="1.2" strokeLinecap="square"
      style={{ transformOrigin: '12px 8px', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', transform: isOpen ? 'translateY(4px) rotate(45deg)' : 'none' }} />
    <line x1="3" y1="16" x2="21" y2="16" stroke={isOpen || scrolled ? "#111" : "#fff"} strokeWidth="1.2" strokeLinecap="square"
      style={{ transformOrigin: '12px 16px', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', transform: isOpen ? 'translateY(-4px) rotate(-45deg)' : 'none' }} />
  </svg>
);

const Navbar: React.FC<NavbarProps> = ({ onAdminToggle }) => {
  const { siteContent } = useSiteContent();
  const { setBookingFormOpen } = useAppStore();

  const pathname = usePathname();
  const isHome = pathname === '/';

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      const timer = setTimeout(() => {}, 400);
      return () => clearTimeout(timer);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const id = setTimeout(() => setIsMobileMenuOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  const close = () => setIsMobileMenuOpen(false);

  const menuItems = siteContent.navbar;

  return (
    <>
      <style>{`
        .nav-link-desktop {
          position: relative;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          white-space: nowrap;
        }
        /* Top Navigation Unscrolled (White Text) */
        .header-top .nav-link-desktop { color: rgba(255, 255, 255, 0.7); }
        .header-top .nav-link-desktop:hover { color: #ffffff; }
        .header-top .nav-link-desktop.active { color: #ffffff; border-bottom: 1px solid #ffffff; padding-bottom: 7px; }

        /* Top Navigation Scrolled (Black Text) */
        .header-scrolled .nav-link-desktop { color: rgba(17, 17, 17, 0.5); }
        .header-scrolled .nav-link-desktop:hover { color: #111111; }
        .header-scrolled .nav-link-desktop.active { color: #111111; border-bottom: 1px solid #111111; padding-bottom: 7px; }

        @keyframes sheetIn  { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes sheetOut { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-10px); opacity: 0; } }
        .sheet-enter { animation: sheetIn  .6s cubic-bezier(0.16,1,0.3,1) forwards; }
        .sheet-exit  { animation: sheetOut .4s cubic-bezier(0.16,1,0.3,1) forwards; }

      `}</style>

      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'header-scrolled' : 'header-top'}`}
        style={{ height: '80px', transform: 'translateZ(0)' }}
      >
        {/* Base layer (glass) */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: scrolled ? 'rgba(255,255,255,0.98)' : (isHome ? 'transparent' : '#111'),
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }} />

        <nav className="max-w-[1400px] mx-auto px-6 h-full relative flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={siteContent.business.logo || '/logo.png'}
              alt={siteContent.business.name}
              className="h-10 w-auto object-contain transition-all duration-500"
              style={{ filter: scrolled ? 'brightness(0)' : 'brightness(100) drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} 
              onError={e => (e.currentTarget.src = '/logo.png')}
            />
            <div className="block">
              <div className={`hidden xs:block text-[9px] font-bold uppercase tracking-[0.25em] leading-none mb-0.5 transition-colors duration-500 ${scrolled ? 'text-[#888]' : 'text-white/70'}`}>
                VIP TRANSFER
              </div>
              <div className={`text-[14px] sm:text-[16px] font-extrabold uppercase tracking-wider leading-none transition-colors duration-500 font-outfit ${scrolled ? 'text-[#111]' : 'text-white drop-shadow-md'}`}>
                {siteContent.business.name}
              </div>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden lg:flex items-center gap-6 h-full">
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
                  <Link href={item.url} className={`nav-link-desktop ${isActive ? 'active' : ''}`}>
                    {item.label}
                  </Link>

                  {hasSubMenu && activeDropdown === item.id && (
                    <div className="absolute top-[calc(100%-16px)] left-0 w-56 py-3 bg-white border border-gray-100 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                      {(item.subMenus ?? []).map(sub => (
                        <Link key={sub.id} href={sub.url} className="block px-6 py-2.5 text-[11px] uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors">
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Desktop right ── */}
          <div className="hidden lg:flex items-center gap-6 shrink-0">
            <button onClick={() => setBookingFormOpen(true)} className={`px-6 py-3 font-bold text-[10px] uppercase tracking-[0.15em] transition-all duration-500 ${scrolled ? 'bg-[#111] text-white hover:bg-black' : 'bg-white text-[#111] hover:opacity-90 shadow-md'}`}>
               REZERVASYON
            </button>
            <button onClick={onAdminToggle} title="Admin" className="opacity-0 w-2 h-2 hover:opacity-20 bg-gray-500">.</button>
          </div>

          {/* ── Mobile right ── */}
          <div className="lg:hidden flex items-center gap-3">
            <button onClick={() => setBookingFormOpen(true)} className={`w-10 h-10 flex items-center justify-center transition-all shadow-sm ${scrolled ? 'bg-[#111] text-white' : 'bg-white text-[#111]'}`}>
              <i className="fa-solid fa-car-side text-[10px]" />
            </button>
            <button onClick={() => setIsMobileMenuOpen(v => !v)} className="w-10 h-10 flex items-center justify-center transition-all group">
              <HamburgerIcon isOpen={isMobileMenuOpen} scrolled={scrolled} />
            </button>
          </div>

        </nav>
      </header>

      {/* ── MOBILE SHEET (Ultra Minimal) ── */}
      <div className={`lg:hidden fixed inset-0 z-[9990] ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xl transition-all duration-500" style={{ opacity: isMobileMenuOpen ? 1 : 0 }} onClick={close} />
        
        <div className={`absolute left-0 right-0 top-0 w-full h-[100dvh] flex flex-col z-[9995] bg-transparent ${isMobileMenuOpen ? 'sheet-enter' : 'sheet-exit pointer-events-none'}`}>
          <div className="flex items-center justify-between px-6 h-[80px] shrink-0 border-b border-gray-100/50">
            <div className="text-[14px] font-extrabold uppercase tracking-widest text-[#111]">{siteContent.business.name}</div>
            <button onClick={close} className="w-10 h-10 flex items-center justify-center text-[#111]">
              <i className="fa-solid fa-xmark text-xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col justify-center">
            <div className="space-y-6">
                {menuItems.map((item) => {
                  const hasSubMenu = !!(item.subMenus && item.subMenus.length > 0 && item.url !== '/bolgeler');
                  const isActive = pathname === item.url || (hasSubMenu && item.subMenus?.some(s => pathname === s.url));
                  return (
                    <div key={item.id} className="text-center">
                      <Link href={item.url} onClick={() => !hasSubMenu && close()} className={`text-3xl font-playfair font-medium transition-colors ${isActive ? 'text-[#111] italic' : 'text-[#888]'}`}>
                        {item.label}
                      </Link>
                      {hasSubMenu && (
                          <div className="mt-4 flex flex-col space-y-3">
                            {item.subMenus?.map(sub => (
                              <Link key={sub.id} href={sub.url} onClick={close} className="text-[11px] uppercase tracking-widest text-gray-500 hover:text-gray-900">
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="mt-16 pt-10 border-t border-gray-200 flex flex-col items-center gap-6">
                <button onClick={() => { setBookingFormOpen(true); close(); }} className="w-full max-w-[200px] py-4 bg-[#111] text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                  Rezervasyon
                </button>
                <div className="flex gap-6 text-[#111] text-lg">
                  <a href={siteContent.business.instagram} target="_blank" className="hover:opacity-50"><i className="fa-brands fa-instagram" /></a>
                  <a href={siteContent.business.facebook} target="_blank" className="hover:opacity-50"><i className="fa-brands fa-facebook-f" /></a>
                  <a href={`https://wa.me/${siteContent.business.whatsapp}`} target="_blank" className="hover:opacity-50"><i className="fa-brands fa-whatsapp" /></a>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
