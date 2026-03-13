import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BUSINESS_INFO, BLOG_POSTS, SCRAPED_REGIONS } from '../constants';
import { useSiteContent } from '../SiteContext';
import { NavMenuItem } from '../types';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../i18n/LanguageContext';

interface NavbarProps {
  onAdminToggle: () => void;
  isAdmin: boolean;
  content: NavMenuItem[];
}

const Navbar: React.FC<NavbarProps> = ({ onAdminToggle, isAdmin, content }) => {
  const { siteContent } = useSiteContent();
  const { t } = useLanguage();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Advanced Mobile Menu States
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Reset mobile states when menu closes
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setTimeout(() => {
        setExpandedItems([]);
        setSearchQuery('');
      }, 300);
    }
  }, [isMobileMenuOpen]);

  const toggleSubmenu = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('ana sayfa')) return 'fa-house';
    if (l.includes('kurumsal') || l.includes('hakkımızda')) return 'fa-building-columns';
    if (l.includes('bölgeler')) return 'fa-map-location-dot';
    if (l.includes('s.s.s')) return 'fa-circle-question';
    if (l.includes('blog')) return 'fa-newspaper';
    if (l.includes('iletişim')) return 'fa-headset';
    return 'fa-arrow-right';
  };

  const isSolid = scrolled || isAdmin || isMobileMenuOpen;

  // Map nav item labels to translation keys
  const NAV_KEY_MAP: Record<string, string> = {
    '/': 'nav.home', '/hakkimizda': 'nav.about', '/vizyon-misyon': 'nav.vision',
    '/bolgeler': 'nav.regions', '/sss': 'nav.faq', '/blog': 'nav.blog', '/iletisim': 'nav.contact',
  };
  const translateNav = (item: NavMenuItem) => {
    // Check URL-based mapping first
    if (NAV_KEY_MAP[item.url]) return t(NAV_KEY_MAP[item.url]);
    // Check if label contains corporate-like keywords (parent menu)
    const l = item.label.toLowerCase();
    if (l.includes('kurumsal') || l === 'corporate' || l === 'unternehmen') return t('nav.corporate');
    return item.label;
  };

  // Use live siteContent for navbar items
  const menuItems = siteContent.navbar;

  // Filter menu items based on search
  const filteredItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.subMenus && item.subMenus.some(sub => sub.label.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <>
      {/* Custom Animation Style */}
      <style>{`
        @keyframes logoPop {
          0% { transform: scale(0); opacity: 0; }
          5%, 95% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
        @keyframes textReveal {
          0% { max-width: 0; opacity: 0; margin-left: 0; }
          5%, 95% { max-width: 600px; opacity: 1; margin-left: 0.75rem; }
          100% { max-width: 0; opacity: 0; margin-left: 0; }
        }
        .animate-logo-pop {
          animation: logoPop 20s infinite cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-text-reveal {
          overflow: hidden;
          white-space: nowrap;
          display: inline-block;
          animation: textReveal 20s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* On mobile, text reveal is absolute so it doesn't push other elements */
        @media (max-width: 1023px) {
          .navbar-logo-wrapper .animate-text-reveal {
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
          }
        }
      `}</style>

      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out transform ${isMobileMenuOpen ? '-translate-y-full' : 'translate-y-0'} border-b border-white/[0.12] ${isSolid
          ? "py-1 h-16 shadow-lg"
          : "py-2 h-20 shadow-sm"
          }`}
        style={{ background: 'rgba(15, 23, 42, 0.05)', backdropFilter: 'blur(80px)', WebkitBackdropFilter: 'blur(80px)' }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-0 shrink-0 relative navbar-logo-wrapper">
              <div className="animate-logo-pop z-10 relative">
                <img src={siteContent.business.logo || '/logo.png'} alt="Logo" className="h-10 md:h-12 w-auto object-contain" onError={(e) => (e.currentTarget.src = '/logo.png')} />
              </div>
              <div className="animate-text-reveal">
                <span className="text-lg md:text-xl font-extrabold uppercase leading-none text-white">
                  {BUSINESS_INFO.name}
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-2 font-bold text-[13px] h-full text-white">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => item.subMenus && setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.url}
                    className="px-4 py-2 transition-all flex items-center group relative hover:text-[#c5a059]"
                  >
                    {translateNav(item)}
                    {item.subMenus && (
                      <i className={`fa-solid fa-chevron-down ml-2 text-[10px] opacity-50 group-hover:rotate-180 transition-transform`}></i>
                    )}
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 bg-[#c5a059]"></span>
                  </Link>

                  {item.subMenus && activeDropdown === item.id && (
                    <div className="absolute top-[80%] left-0 w-56 shadow-2xl rounded-xl border border-white/[0.12] py-3 animate-in fade-in slide-in-from-top-2 duration-200" style={{ background: 'rgba(15, 23, 42, 0.05)', backdropFilter: 'blur(80px)', WebkitBackdropFilter: 'blur(80px)' }}>
                      {item.subMenus.map((sub) => (
                        <Link
                          key={sub.id}
                          to={sub.url}
                          className="block px-6 py-2.5 hover:bg-white/10 hover:text-[#c5a059] transition-all text-white/70 text-sm font-semibold"
                        >
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isAdmin ? "bg-[#c5a059]/20 text-[#c5a059]" : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"}`}
                  title="Admin Paneli"
                >
                  <i className={`fa-solid ${isAdmin ? 'fa-user-gear' : 'fa-lock'}`}></i>
                </button>
              </div>
            </div>

            {/* Mobile Toggle Button */}
            <div className="lg:hidden flex items-center gap-1.5">
              <LanguageSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors z-[10001] relative ${isMobileMenuOpen ? "text-white bg-white/10" : "text-white/70 bg-white/5 hover:bg-white/10"}`}
              >
                <i className={`fa-solid ${isMobileMenuOpen ? "fa-xmark" : "fa-bars"} text-lg transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90" : "rotate-0"}`}></i>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* MOBILE DRAWER - REFINED WHITE GLASS DESIGN */}
      <div className={`lg:hidden fixed inset-0 z-[9999] ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-[4px] transition-all duration-500 ease-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[85vw] max-w-[360px] shadow-2xl border-l border-white/[0.12] transform transition-transform duration-500 flex flex-col z-[10000] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)', background: 'rgba(15, 23, 42, 0.05)', backdropFilter: 'blur(80px)', WebkitBackdropFilter: 'blur(80px)' }}
        >
          {/* Header */}
          <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center">
              <div className="flex items-center justify-center animate-logo-pop z-10 relative">
                <img src={siteContent.business.logo || '/logo.png'} alt="Logo" className="h-12 w-auto object-contain grayscale" onError={(e) => (e.currentTarget.src = '/logo.png')} />
              </div>
              <div className="animate-text-reveal">
                <div className="flex flex-col">
                  <h3 className="font-bold text-white leading-none tracking-tight text-lg">{BUSINESS_INFO.name}</h3>
                  <p className="text-[10px] text-white/40 font-medium tracking-widest uppercase mt-1">VIP Transfer</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/50 hover:text-white hover:bg-white/20 border border-white/10 transition-colors active:scale-95"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-4 shrink-0">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa-solid fa-search text-white/30"></i>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.search')}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-[#c5a059]/50 focus:ring-2 focus:ring-[#c5a059]/20 transition-all font-medium"
              />
            </div>
          </div>

          {/* Content List - Scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-y-contain overflow-x-hidden px-3 space-y-1 pb-4">
            {searchQuery ? (
              // SEARCH RESULTS VIEW
              <>
                {(() => {
                  const normalizedQuery = searchQuery.toLowerCase();

                  // 1. Pages
                  const pages = menuItems
                    .filter(item => item.label.toLowerCase().includes(normalizedQuery))
                    .map(item => ({ type: 'SAYFA', label: item.label, url: item.url, icon: 'fa-link' }));

                  // 2. Regions / Blogs
                  const blogs = BLOG_POSTS
                    .filter(post => post.title.toLowerCase().includes(normalizedQuery) || post.tags.some(tag => tag.includes(normalizedQuery)))
                    .map(post => ({ type: 'REHBER', label: post.title, url: `/blog/${post.slug}`, icon: 'fa-map-location-dot' }));

                  // 3. FAQs
                  const faqs = siteContent.faq
                    .filter(f => f.q.toLowerCase().includes(normalizedQuery))
                    .map(f => ({ type: 'SSS', label: f.q, url: '/sss', icon: 'fa-circle-question' }));

                  // 4. Regions (Direct)
                  const regionResults = siteContent.regions
                    .filter(r => r.name.toLowerCase().includes(normalizedQuery))
                    .map(r => ({ type: 'BÖLGE', label: r.name, url: `/bolgeler?q=${encodeURIComponent(r.name)}`, icon: 'fa-location-dot' }));

                  // 5. Vehicles
                  const vehicleResults = siteContent.vehicles
                    .filter(v => v.name.toLowerCase().includes(normalizedQuery) || v.category.toLowerCase().includes(normalizedQuery))
                    .map(v => ({ type: 'ARAÇ', label: v.name, url: '/', icon: 'fa-car' }));

                  // 6. Contact Info (Phone, Email, etc.)
                  const businessResults: { type: string; label: string; url: string; icon: string }[] = [];
                  if (BUSINESS_INFO.phone.includes(normalizedQuery) || 'telefon'.includes(normalizedQuery)) {
                    businessResults.push({ type: 'İLETİŞİM', label: BUSINESS_INFO.phone, url: `tel:${BUSINESS_INFO.phone}`, icon: 'fa-phone' });
                  }
                  if (BUSINESS_INFO.email.includes(normalizedQuery) || 'mail'.includes(normalizedQuery) || 'eposta'.includes(normalizedQuery)) {
                    businessResults.push({ type: 'İLETİŞİM', label: BUSINESS_INFO.email, url: `mailto:${BUSINESS_INFO.email}`, icon: 'fa-envelope' });
                  }
                  if (BUSINESS_INFO.address.toLowerCase().includes(normalizedQuery) || 'adres'.includes(normalizedQuery) || 'konum'.includes(normalizedQuery)) {
                    businessResults.push({ type: 'İLETİŞİM', label: BUSINESS_INFO.address, url: BUSINESS_INFO.mapEmbedUrl, icon: 'fa-map-pin' });
                  }

                  const allResults = [...pages, ...regionResults, ...vehicleResults, ...blogs, ...faqs, ...businessResults];

                  if (allResults.length === 0) {
                    return (
                      <div className="text-center py-8 text-white/30 text-sm">
                        <i className="fa-solid fa-search mb-2 text-2xl opacity-50"></i>
                        <p>Sonuç bulunamadı.</p>
                      </div>
                    );
                  }

                  return allResults.map((result, idx) => (
                    <Link
                      key={idx}
                      to={result.url}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 text-white/50 flex items-center justify-center text-xs shrink-0 group-hover:bg-[#c5a059] group-hover:text-white transition-colors">
                        <i className={`fa-solid ${result.icon}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold text-[#c5a059] tracking-wider border border-[#c5a059]/20 bg-[#c5a059]/5 px-1.5 py-0.5 rounded">{result.type}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white/80 truncate">{result.label}</h4>
                      </div>
                      <i className="fa-solid fa-chevron-right text-[10px] text-white/20 group-hover:text-[#c5a059]"></i>
                    </Link>
                  ));
                })()}
              </>
            ) : (
              // STANDARD MENU VIEW
              filteredItems.map((item, idx) => {
                const isActive = location.pathname === item.url;
                const isExpanded = expandedItems.includes(item.id);
                const itemIcon = getIcon(item.label);

                return (
                  <div
                    key={item.id}
                    className={`group transition-all duration-500 transform ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    <div className={`rounded-xl overflow-hidden transition-all duration-300 ${isActive ? 'bg-white/10 border border-[#c5a059]/30 shadow-md transform scale-[1.02]' : 'border border-transparent hover:bg-white/[0.06] hover:border-white/10'}`}>
                      <div
                        onClick={(e) => {
                          if (item.subMenus) {
                            e.preventDefault();
                            toggleSubmenu(item.id);
                          } else {
                            setIsMobileMenuOpen(false);
                          }
                        }}
                        className="relative flex items-center justify-between px-4 py-4 cursor-pointer"
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#c5a059] rounded-r-full shadow-[0_0_8px_#c5a059]"></div>
                        )}

                        <Link to={item.url} className="flex items-center gap-4 flex-1">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors duration-300 ${isActive ? 'bg-[#c5a059] text-white shadow-lg' : 'bg-white/10 text-white/50 group-hover:bg-[#c5a059] group-hover:text-white'}`}>
                            <i className={`fa-solid ${itemIcon}`}></i>
                          </span>
                          <span className={`tracking-tight font-bold text-[15px] ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>{translateNav(item)}</span>
                        </Link>

                        {item.subMenus ? (
                          <button onClick={(e) => { e.stopPropagation(); toggleSubmenu(item.id); }} className="p-2 -mr-2 text-white/30 group-hover:text-white/60 transition-colors">
                            <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#c5a059]' : ''}`}></i>
                          </button>
                        ) : (
                          <i className="fa-solid fa-chevron-right text-[10px] text-white/20 group-hover:text-[#c5a059] transition-colors"></i>
                        )}
                      </div>

                      {/* Collapsible Submenu */}
                      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="pb-2 pt-1 border-t border-white/10">
                          {item.subMenus?.map(sub => (
                            <Link
                              key={sub.id}
                              to={sub.url}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 pl-16 text-sm text-white/40 font-medium hover:text-[#c5a059] hover:bg-white/[0.05] transition-all relative"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                              {NAV_KEY_MAP[sub.url] ? t(NAV_KEY_MAP[sub.url]) : sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 shrink-0">
            <div className="flex justify-center gap-4">
              {siteContent.business.instagram && (
                <a href={siteContent.business.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 text-white/30 flex items-center justify-center text-sm transition-all hover:scale-110 hover:bg-white/10 hover:text-pink-500">
                  <i className="fa-brands fa-instagram"></i>
                </a>
              )}
              {siteContent.business.facebook && (
                <a href={siteContent.business.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 text-white/30 flex items-center justify-center text-sm transition-all hover:scale-110 hover:bg-white/10 hover:text-blue-500">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              )}
              {siteContent.business.telegram && (
                <a href={siteContent.business.telegram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 text-white/30 flex items-center justify-center text-sm transition-all hover:scale-110 hover:bg-white/10 hover:text-sky-500">
                  <i className="fa-brands fa-telegram"></i>
                </a>
              )}
              <button
                onClick={() => { onAdminToggle(); setIsMobileMenuOpen(false); }}
                className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 text-white/20 flex items-center justify-center text-sm transition-all hover:scale-110 hover:bg-white/10 hover:text-[#c5a059]"
                title="Yönetici"
              >
                <i className="fa-solid fa-gear text-[11px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
