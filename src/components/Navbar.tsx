'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSiteContent } from '../SiteContext';
import { useAppStore } from '../store/useAppStore';
import useSWR from 'swr';
import { fetcher } from '../utils/supabase/fetcher';
import { BlogPost } from '../types';

interface NavbarProps {
  onAdminToggle: () => void;
  isAdmin: boolean;
}

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

const Navbar: React.FC<NavbarProps> = ({ onAdminToggle, isAdmin }) => {
  const { siteContent } = useSiteContent();
  const { setBookingFormOpen } = useAppStore();
  const { data: blogPostsRaw } = useSWR('blog_posts', fetcher);
  
  const blogPosts: BlogPost[] = blogPostsRaw?.map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    category: row.category || '',
    tags: row.tags || [],
  })) || [];

  const pathname = usePathname();
  const router = useRouter();

  const adminTapCount = useRef(0);
  const adminTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAdminTap = () => {
    if (isAdmin) { onAdminToggle(); close(); return; }
    adminTapCount.current += 1;
    if (adminTapTimer.current) clearTimeout(adminTapTimer.current);
    if (adminTapCount.current >= 5) {
      adminTapCount.current = 0;
      close();
      router.push(`/login`);
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
    const blogs = blogPosts.filter(p => (p.title || '').toLowerCase().includes(nq) || (p.tags||[]).some((tag: string) => tag.includes(nq)))
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
        @keyframes navbarIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .navbar-enter { animation: navbarIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards; }

        .nav-link-desktop {
          position: relative;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          transition: color 0.2s ease, background 0.2s ease;
          white-space: nowrap;
        }
        .nav-link-desktop:hover {
          color: var(--color-text);
          background: rgba(0,0,0,0.03);
        }
        .nav-link-desktop.active {
          color: var(--color-primary);
          background: rgba(197,160,89,0.08);
        }

        @keyframes sheetIn  { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes sheetOut { from { transform: translateY(0); } to { transform: translateY(100%); } }
        .sheet-enter { animation: sheetIn  .45s cubic-bezier(.32,.72,0,1) forwards; }
        .sheet-exit  { animation: sheetOut .35s cubic-bezier(.4, 0,.6,1) forwards; }

        .cta-pulse { transition: all 0.3s ease; }
        .cta-pulse:hover { box-shadow: 0 4px 15px rgba(197,160,89,0.3); transform: translateY(-1px); }

        .search-ring:focus-within { box-shadow: 0 0 0 1px var(--color-primary); border-color: var(--color-primary); }
      `}</style>

      <header
        className="navbar-enter fixed top-0 left-0 w-full z-[100]"
        style={{ height: '72px', transform: 'translateZ(0)' }}
      >
        {/* Base layer (glass) */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.03)' : 'none',
          transition: 'all 0.4s ease'
        }} />

        <nav className="max-w-7xl mx-auto px-6 h-full relative flex items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src={siteContent.business.logo || '/logo.png'}
              alt={siteContent.business.name}
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              style={{ filter: 'brightness(0) opacity(0.9)' }} 
              onError={e => (e.currentTarget.src = '/logo.png')}
            />
            <div className="block">
              <div className="hidden xs:block text-[9px] font-bold text-gray-400 uppercase tracking-[0.25em] leading-none mb-0.5">
                VIP TRANSFER
              </div>
              <div className="text-[14px] sm:text-[16px] font-extrabold text-[#1a1a1a] uppercase tracking-wider leading-none"
                style={{ fontFamily: "'Outfit', sans-serif" }}>
                {siteContent.business.name}
              </div>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden lg:flex items-center gap-2 h-full">
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
                    {hasSubMenu && <i className={`fa-solid fa-chevron-down text-[9px] opacity-70 transition-transform ${activeDropdown === item.id ? 'rotate-180' : ''}`} />}
                  </Link>

                  {hasSubMenu && activeDropdown === item.id && (
                    <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-48 py-2 rounded-2xl bg-white border border-gray-100 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 rounded-sm bg-white border-t border-l border-gray-100" />
                      {(item.subMenus ?? []).map(sub => (
                        <Link key={sub.id} href={sub.url} className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors mx-1 rounded-xl">
                          <span className="w-1 h-1 rounded-full bg-[var(--color-primary)] shrink-0" />
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
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {siteContent.business.phone && (
              <a href={`tel:${siteContent.business.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-[var(--color-primary)] text-xs font-bold tracking-wide transition-colors">
                <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100"><i className="fa-solid fa-phone text-[8px]" /></div>
                {siteContent.business.phone}
              </a>
            )}

            <button onClick={() => setBookingFormOpen(true)} className="btn-gold px-6 py-3 text-xs uppercase tracking-widest flex items-center gap-2 shadow-sm">
              <i className="fa-solid fa-car-side text-[10px]" />
              REZERVASYON
            </button>
            <button onClick={onAdminToggle} title="Admin" className="opacity-0 w-2 h-2 rounded-full hover:opacity-20 bg-gray-300">.</button>
          </div>

          {/* ── Mobile right ── */}
          <div className="lg:hidden flex items-center gap-2">
            <button onClick={() => setBookingFormOpen(true)} className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-primary)] text-white hover:shadow-md transition-all">
              <i className="fa-solid fa-calendar-check text-sm" />
            </button>
            <button onClick={() => setIsMobileMenuOpen(v => !v)} className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-700 border border-gray-200 transition-all">
              <HamburgerIcon isOpen={isMobileMenuOpen} />
            </button>
          </div>

        </nav>
      </header>

      {/* ── MOBILE SHEET ── */}
      <div className={`lg:hidden fixed inset-0 z-[9990] ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className="absolute inset-0 bg-gray-900/30 transition-opacity duration-500" style={{ opacity: isMobileMenuOpen ? 1 : 0, backdropFilter: isMobileMenuOpen ? 'blur(4px)' : 'none' }} onClick={close} />
        
        <div className={`absolute left-0 right-0 bottom-0 flex flex-col z-[9995] bg-white rounded-t-[2.5rem] border-t border-gray-100 shadow-2xl ${isMobileMenuOpen ? 'sheet-enter' : 'sheet-exit pointer-events-none'}`} style={{ maxHeight: '94dvh', paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="w-12 h-1 rounded-full bg-gray-200" /></div>

          <div className="px-6 py-4 flex items-center justify-between shrink-0">
            <div className="text-xl font-bold uppercase tracking-wider">{siteContent.business.name}</div>
            <button onClick={close} className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-500 hover:text-gray-900 border border-gray-100">
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <div className="px-6 pb-4 grid grid-cols-2 gap-3 shrink-0">
            <button onClick={() => { setBookingFormOpen(true); close(); }} className="btn-gold py-4 text-xs tracking-wider flex items-center justify-center gap-2">
              <i className="fa-solid fa-calendar-check" /> Rezervasyon
            </button>
            <a href={`https://wa.me/${siteContent.business.whatsapp}`} onClick={close} className="bg-[#25D366] text-white rounded-2xl py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1DA851] transition-colors">
              <i className="fa-brands fa-whatsapp text-sm" /> WhatsApp
            </a>
          </div>

          <div className="px-6 pb-4 shrink-0">
            <div className="search-ring flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 transition-all">
              <i className="fa-solid fa-magnifying-glass text-gray-400" />
              <input ref={searchRef} type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} placeholder="Site içi ara..." className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400 font-medium" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {searchQuery.length > 1 ? (
              <div className="space-y-1">
                {searchResults.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm">Sonuç bulunamadı</div>
                ) : searchResults.map((r, i) => (
                  <Link key={i} href={r.url} onClick={close} className="flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center"><i className={`fa-solid ${r.icon}`} /></div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">{r.type}</div>
                      <div className="text-sm font-semibold text-gray-900">{r.label}</div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const hasSubMenu = !!(item.subMenus && item.subMenus.length > 0 && item.url !== '/bolgeler');
                  const isActive = pathname === item.url || (hasSubMenu && item.subMenus?.some(s => pathname === s.url));
                  const isExpanded = item.id ? expandedItems.includes(item.id) : false;
                  return (
                    <div key={item.id} className="nav-row visible">
                      <div className={`rounded-2xl transition-colors ${isActive ? 'bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20' : 'hover:bg-gray-50'}`}>
                        <div className="flex items-center">
                          <Link href={item.url} onClick={() => !hasSubMenu && close()} className="flex items-center gap-4 flex-1 px-4 py-4">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${isActive ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
                              <i className={`fa-solid ${getIcon(item.label)}`} />
                            </div>
                            <span className={`uppercase font-bold text-sm tracking-wide ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-700'}`}>{item.label}</span>
                          </Link>
                          {hasSubMenu && (
                            <button onClick={() => item.id && toggleSubmenu(item.id)} className="px-4 py-4 text-gray-400 hover:text-gray-900">
                              <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>
                        {hasSubMenu && isExpanded && (
                          <div className="pl-[3.5rem] pr-4 pb-4 space-y-1">
                            {item.subMenus?.map(sub => (
                              <Link key={sub.id} href={sub.url} onClick={close} className="flex items-center gap-2 py-2 px-3 text-sm font-semibold text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-gray-50">
            <div className="flex items-center gap-2 text-gray-400">
              <a href={siteContent.business.instagram} target="_blank" className="hover:text-pink-500 p-2"><i className="fa-brands fa-instagram" /></a>
              <a href={siteContent.business.facebook} target="_blank" className="hover:text-blue-500 p-2"><i className="fa-brands fa-facebook-f" /></a>
            </div>
            <button onClick={handleAdminTap} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2 rounded-lg hover:bg-gray-200">
              {isAdmin ? 'Panel' : 'v2.5'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Navbar;
