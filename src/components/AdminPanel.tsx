import React, { useState, useEffect, useRef, useMemo, Suspense, lazy } from 'react';
import { AdminConfirmModal } from './admin/AdminConfirmModal';
import { Booking, SiteContent, Vehicle, BlogPost, UserReview, AdminAccountForm } from '../types';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, BarChart, Bar
} from 'recharts';

// Lazy-loaded admin views for code splitting
const BookingsView = lazy(() => import('./admin/views/BookingsView').then(m => ({ default: m.BookingsView })));
const SiteSettingsView = lazy(() => import('./admin/views/SiteSettingsView').then(m => ({ default: m.SiteSettingsView })));
const RegionsView = lazy(() => import('./admin/views/RegionsView').then(m => ({ default: m.RegionsView })));
const FAQView = lazy(() => import('./admin/views/FAQView').then(m => ({ default: m.FAQView })));
const BusinessSettingsView = lazy(() => import('./admin/views/BusinessSettingsView').then(m => ({ default: m.BusinessSettingsView })));
const FleetView = lazy(() => import('./admin/views/FleetView').then(m => ({ default: m.FleetView })));
const AboutView = lazy(() => import('./admin/views/AboutView').then(m => ({ default: m.AboutView })));
const VisionMissionView = lazy(() => import('./admin/views/VisionMissionView').then(m => ({ default: m.VisionMissionView })));
const BlogView = lazy(() => import('./admin/views/BlogView').then(m => ({ default: m.BlogView })));
const ReviewsView = lazy(() => import('./admin/views/ReviewsView').then(m => ({ default: m.ReviewsView })));
const HeroImagesView = lazy(() => import('./admin/views/HeroImagesView').then(m => ({ default: m.HeroImagesView })));

import { INITIAL_SITE_CONTENT } from '../constants';

// Static mapping
const VIEW_LABELS: Record<string, { label: string; icon: string; description: string }> = {
  'overview':      { label: 'DASHBOARD',          icon: 'fa-chart-pie',               description: 'Genel bakış ve istatistikler' },
  'bookings':      { label: 'REZERVASYONLAR',      icon: 'fa-calendar-check',          description: 'Rezervasyon yönetimi' },
  'blog':          { label: 'BLOG YÖNETİMİ',       icon: 'fa-newspaper',               description: 'Blog yazıları' },
  'reviews':       { label: 'YORUMLAR',            icon: 'fa-star',                    description: 'Yorum moderasyonu' },
  'hero-images':   { label: 'ANASAYFA BANNER',     icon: 'fa-images',                  description: 'Slider görselleri' },
  'site-settings': { label: 'MENÜ YÖNETİMİ',       icon: 'fa-bars',                    description: 'Site menü yapısı' },
  'regions':       { label: 'BÖLGE & FİYAT',       icon: 'fa-map-location-dot',        description: 'Transfer bölgeleri ve fiyatları' },
  'fleet':         { label: 'ARAÇLAR',             icon: 'fa-car-side',                description: 'Araç filosu' },
  'faq':           { label: 'S.S.S',               icon: 'fa-circle-question',         description: 'Sıkça sorulan sorular' },
  'business':      { label: 'İŞLETME AYARLARI',   icon: 'fa-briefcase',               description: 'İşletme bilgileri, profil ve güvenlik ayarları' },
  'about':         { label: 'HAKKIMIZDA',          icon: 'fa-info-circle',             description: 'Hakkımızda sayfası içeriği' },
  'visionMission': { label: 'VİZYON & MİSYON',    icon: 'fa-bullseye',                description: 'Vizyon ve misyon sayfası' },
};

// Error Boundary
interface EBState { hasError: boolean; error: Error | null; }
class AdminViewErrorBoundary extends React.Component<{ activeView: string; children: React.ReactNode }, EBState> {
  state: EBState = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error): EBState { return { hasError: true, error }; }
  componentDidUpdate(prevProps: { activeView: string }) {
    if (prevProps.activeView !== this.props.activeView && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-20 text-center gap-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <i className="fa-solid fa-triangle-exclamation text-red-500 text-2xl"></i>
          </div>
          <div>
            <p className="text-slate-900 font-bold text-lg mb-1">Bu sayfa yüklenirken bir hata oluştu</p>
            <p className="text-slate-400 text-sm font-medium">{this.state.error?.message || 'Bilinmeyen hata'}</p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-xl text-sm hover:brightness-105 transition-all shadow-[0_8px_30px_rgba(197,160,89,0.2)]"
          >
            <i className="fa-solid fa-rotate-right mr-2"></i>Tekrar Dene
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

interface AdminPanelProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: Booking['status']) => void;
  onAddBooking: (booking: Partial<Booking>) => void;
  siteContent: SiteContent;
  onUpdateSiteContent: (content: SiteContent) => Promise<void>;
  onExitAdmin: () => void;
  onDeleteBooking: (id: string) => void;
  blogPosts: BlogPost[];
  onAddBlogPost: (post: BlogPost) => Promise<void>;
  onUpdateBlogPost: (post: BlogPost) => Promise<void>;
  onDeleteBlogPost: (id: string) => Promise<void>;
  userReviews: UserReview[];
  onUpdateReviewStatus: (id: string, status: UserReview['status']) => Promise<void>;
  onDeleteReview: (id: string) => Promise<void>;
}

type DashboardView = 'overview' | 'bookings' | 'site-settings' | 'hero-images' | 'regions' | 'fleet' | 'blog' | 'reviews' | 'faq' | 'business' | 'about' | 'visionMission';

const COUNTRY_NAMES: Record<string, string> = {
  '🇩🇪': 'Almanya', '🇹🇷': 'Türkiye', '🇬🇧': 'İngiltere', '🇺🇸': 'ABD', '🇷🇺': 'Rusya',
  '🇦🇹': 'Avusturya', '🇨🇭': 'İsviçre', '🇳🇱': 'Hollanda', '🇸🇦': 'Suudi Arabistan',
  '🇦🇪': 'BAE', '🇦🇺': 'Avustralya', '🇨🇦': 'Kanada', '🇫🇷': 'Fransa', '🇮🇹': 'İtalya',
  '🇵🇱': 'Polonya', '🇺🇦': 'Ukrayna', '🇸🇪': 'İsveç', '🇳🇴': 'Norveç', '🇩🇰': 'Danimarka'
};

const getCountryName = (flag: string) => COUNTRY_NAMES[flag] || 'Bilinmiyor';

// Sidebar sub-components
interface SidebarNavItemProps {
  id: string;
  label: string;
  badge?: number;
  icon: React.ReactNode;
  activeView: string;
  isSidebarOpen: boolean;
  onNavigate: (id: string) => void;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ id, label, badge = 0, icon, activeView, isSidebarOpen, onNavigate }) => {
  const isActive = activeView === id;
  return (
    <div className="relative group">
      <button
        onClick={() => onNavigate(id)}
        className={`w-full rounded-xl flex items-center transition-all duration-300 relative ${
          isSidebarOpen
            ? `px-4 py-2.5 gap-3.5 ${isActive ? 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-slate-900 border border-slate-100' : 'hover:bg-slate-100/80 text-slate-500 hover:text-slate-900'}`
            : `justify-center p-2.5 ${isActive ? 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-[var(--color-primary)] border border-slate-100' : 'hover:bg-slate-100/80 text-slate-400 hover:text-slate-900'}`
        }`}
      >
        {isActive && isSidebarOpen && (
          <div className="absolute left-0 top-[25%] bottom-[25%] w-[3px] bg-[var(--color-primary)] rounded-r-full shadow-[0_0_8px_rgba(197,160,89,0.4)]" />
        )}
        <div className={`shrink-0 transition-all duration-300 ${isActive ? 'text-[var(--color-primary)] scale-110' : 'group-hover:scale-105'}`}>
          {icon}
        </div>
        {isSidebarOpen && (
          <span className={`font-outfit text-[13px] font-[600] whitespace-nowrap truncate tracking-tight transition-all duration-300 ${isActive ? 'text-slate-900' : ''}`}>
            {label}
          </span>
        )}
        {badge > 0 && (
          <span className={`flex items-center justify-center text-[10px] font-bold rounded-lg bg-[var(--color-primary)] text-white shadow-[0_4px_10px_rgba(197,160,89,0.3)] ${isSidebarOpen ? 'ml-auto px-1.5 py-0.5 min-w-[20px] h-[20px]' : 'absolute -top-1 -right-1 w-[16px] h-[16px]'}`}>
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </button>
      {!isSidebarOpen && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 pointer-events-none opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 z-[100]">
          <div className="relative px-4 py-2.5 rounded-xl bg-white border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.08)] whitespace-nowrap">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-bold text-slate-900 tracking-tight">{label}</span>
              {badge > 0 && <span className="px-2 py-0.5 rounded-md bg-[var(--color-primary)] text-white text-[10px] font-bold">{badge}</span>}
            </div>
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-white" />
          </div>
        </div>
      )}
    </div>
  );
};

interface SidebarGroupLabelProps {
  label: string;
  isSidebarOpen: boolean;
}

const SidebarGroupLabel: React.FC<SidebarGroupLabelProps> = ({ label, isSidebarOpen }) => isSidebarOpen ? (
  <div className="flex items-center gap-3 px-4 pt-6 pb-2">
    <span className="font-outfit text-[10px] font-[800] text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">{label}</span>
    <div className="flex-1 h-px bg-slate-100" />
  </div>
) : <div className="pt-4" />;

const AdminPanel: React.FC<AdminPanelProps> = ({ bookings, onUpdateStatus, onAddBooking: _onAddBooking, siteContent, onUpdateSiteContent, onExitAdmin, onDeleteBooking, blogPosts: blogPostsProp, onAddBlogPost, onUpdateBlogPost, onDeleteBlogPost, userReviews: userReviewsProp, onUpdateReviewStatus, onDeleteReview }) => {
  // Theme — Force Light Minimalism
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getInitialView = (): DashboardView => {
    const hash = window.location.hash;
    const prefix = '#/admin/';
    if (hash.startsWith(prefix)) return hash.substring(prefix.length) as DashboardView || 'overview';
    return 'overview';
  };

  const [activeView, setActiveView] = useState<DashboardView>(getInitialView);
  useEffect(() => { window.location.hash = `#/admin/${activeView}`; }, [activeView]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; description: string; onConfirm: () => void; type: 'danger' | 'warning' | 'info' }>({
    isOpen: false, title: '', description: '', onConfirm: () => { }, type: 'info'
  });

  const confirmAction = (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => {
    setConfirmModal({ isOpen: true, title: options.title, description: options.description, onConfirm: options.onConfirm, type: options.type || 'info' });
  };

  const [editContent, setEditContent] = useState<SiteContent>(siteContent);
  const editContentInitialized = useRef(false);
  const lastKnownServerContent = useRef<SiteContent>(siteContent);

  useEffect(() => {
    if (!editContentInitialized.current && siteContent !== INITIAL_SITE_CONTENT) {
      setEditContent(siteContent);
      lastKnownServerContent.current = siteContent;
      editContentInitialized.current = true;
      return;
    }
    if (JSON.stringify(siteContent) !== JSON.stringify(lastKnownServerContent.current)) {
      const isDirty = JSON.stringify(editContent) !== JSON.stringify(lastKnownServerContent.current);
      if (!isDirty) { setEditContent(siteContent); }
      else {
        setEditContent(prev => {
          const next = { ...prev };
          (Object.keys(siteContent) as Array<keyof SiteContent>).forEach(key => {
            if (JSON.stringify(prev[key]) === JSON.stringify(lastKnownServerContent.current[key])) (next as any)[key] = siteContent[key];
          });
          return next;
        });
      }
      lastKnownServerContent.current = siteContent;
    }
  }, [siteContent, editContent]);

  const [_selectedBookingForView, setSelectedBookingForView] = useState<Booking | null>(null);

  // Blog Logic
  const setBlogPosts = async (posts: BlogPost[] | ((prev: BlogPost[]) => BlogPost[])) => {
    const next = typeof posts === 'function' ? posts(blogPostsProp) : posts;
    const added = next.filter(p => !blogPostsProp.find(e => e.id === p.id));
    const removed = blogPostsProp.filter(e => !next.find(p => p.id === e.id));
    const updated = next.filter(p => {
      const existing = blogPostsProp.find(e => e.id === p.id);
      return existing && JSON.stringify(existing) !== JSON.stringify(p);
    });
    try {
      await Promise.all([
        ...added.map(p => onAddBlogPost(p)),
        ...updated.map(p => onUpdateBlogPost(p)),
        ...removed.map(p => onDeleteBlogPost(p.id))
      ]);
      showToast('Blog yazıları güncellendi');
    } catch (e: any) { showToast(e.message, 'error'); }
  };

  const [blogTab, setBlogTab] = useState<'published' | 'draft'>('published');
  const [blogSearchTerm, setBlogSearchTerm] = useState('');
  const [blogCategories, setBlogCategories] = useState<string[]>(['Havalimanı Transfer', 'Şehir İçi Transfer', 'Otel Transfer']);

  useEffect(() => {
    if (blogPostsProp.length > 0) {
      const fromPosts = [...new Set(blogPostsProp.map(p => p.category).filter(Boolean))];
      setBlogCategories(prev => [...new Set([...prev, ...fromPosts])]);
    }
  }, [blogPostsProp]);

  // Review Logic
  const setUserReviews = async (reviews: UserReview[] | ((prev: UserReview[]) => UserReview[])) => {
    const next = typeof reviews === 'function' ? reviews(userReviewsProp) : reviews;
    const removed = userReviewsProp.filter(r => !next.find(n => n.id === r.id));
    const changed = next.filter(r => {
      const existing = userReviewsProp.find(e => e.id === r.id);
      return existing && existing.status !== r.status;
    });
    try {
      await Promise.all([
        ...changed.map(r => onUpdateReviewStatus(r.id, r.status)),
        ...removed.map(r => onDeleteReview(r.id))
      ]);
      showToast('Yorumlar güncellendi');
    } catch (e: any) { showToast(e.message, 'error'); }
  };

  const [editableReviewsTab, setEditableReviewsTab] = useState<'pending' | 'approved' | 'rejected' | 'deleted'>('pending');

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleForm, setVehicleForm] = useState<Partial<Vehicle>>({ id: '', name: '', category: 'VIP', capacity: 4, luggage: 4, image: '', features: [] });

  const [faqFilter, setFaqFilter] = useState<'all' | 'answered' | 'unanswered'>('all');
  const [toast, setToast] = useState<{ message: string; type: 'delete' | 'success' | 'warning' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'delete' | 'success' | 'warning' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const active = bookings.filter(b => b.status !== 'Deleted');
    const totalRevenue = active.reduce((sum, b) => b.status !== 'Cancelled' ? sum + b.totalPrice : sum, 0);
    const confirmed = active.filter(b => b.status === 'Confirmed').length;
    const pending = active.filter(b => b.status === 'Pending').length;
    const completed = active.filter(b => b.status === 'Completed').length;
    const todayBookings = active.filter(b => b.date === today).length;

    const now = new Date();
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now); d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      return { d: d.toLocaleDateString('tr-TR', { weekday: 'short' }), v: active.filter(b => b.createdAt?.startsWith(dateStr)).length };
    });

    const statusData = [
      { name: 'Beklemede', value: pending, fill: '#f59e0b' },
      { name: 'Onaylı', value: confirmed, fill: '#3b82f6' },
      { name: 'Tamamlandı', value: completed, fill: '#10b981' },
      { name: 'İptal', value: active.filter(b => b.status === 'Cancelled').length, fill: '#ef4444' },
    ].filter(d => d.value > 0);

    const countryStats: Record<string, number> = {};
    [...userReviewsProp].forEach(r => { if (r.country) countryStats[r.country] = (countryStats[r.country] || 0) + 1; });
    const topCountries = Object.entries(countryStats).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count, percent: userReviewsProp.length > 0 ? (count / userReviewsProp.length) * 100 : 0 }));

    return { totalRevenue, confirmed, pending, completed, todayBookings, weeklyData, topCountries, statusData };
  }, [bookings, userReviewsProp]);

  // Auto-save
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  useEffect(() => {
    if (editContent === siteContent) return;
    const t = setTimeout(async () => {
      setSaveStatus('saving');
      try { await onUpdateSiteContent(editContent); setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000); }
      catch (e: any) { setSaveStatus('idle'); showToast(e.message, 'error'); }
    }, 1000);
    return () => clearTimeout(t);
  }, [editContent, onUpdateSiteContent, siteContent]);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const commandItems = useMemo(() => Object.entries(VIEW_LABELS).map(([id, v]) => ({ id, label: v.label, description: v.description, icon: v.icon })), []);
  const handleCommandSelect = (item: any) => { setActiveView(item.id); setIsCommandPaletteOpen(false); };

  const [accountForm, setAccountForm] = useState<AdminAccountForm>({ 
    fullName: siteContent.adminAccount?.fullName || '', 
    email: siteContent.adminAccount?.email || '', 
    phone: siteContent.adminAccount?.phone || '', 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '', 
    notifyEmail: siteContent.adminAccount?.notifyEmail ?? true, 
    notifySms: siteContent.adminAccount?.notifySms ?? false, 
    notifySystem: siteContent.adminAccount?.notifySystem ?? true, 
    twoFa: siteContent.adminAccount?.twoFa ?? false 
  });

  // Sync accountForm changes to editContent to trigger auto-save
  useEffect(() => {
    const updatedAccount = {
      fullName: accountForm.fullName,
      email: accountForm.email,
      phone: accountForm.phone,
      notifyEmail: accountForm.notifyEmail,
      notifySms: accountForm.notifySms,
      notifySystem: accountForm.notifySystem,
      twoFa: accountForm.twoFa
    };
    
    if (JSON.stringify(updatedAccount) !== JSON.stringify(editContent.adminAccount)) {
      setEditContent(prev => ({ ...prev, adminAccount: updatedAccount }));
    }
  }, [accountForm, editContent.adminAccount]);

  const handleUpdatePassword = async () => ({ error: null });

  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  useEffect(() => { 
    setIsPageTransitioning(true); 
    const t = setTimeout(() => setIsPageTransitioning(false), 400); 
    return () => clearTimeout(t); 
  }, [activeView]);

  const getGreeting = () => {
    const h = currentTime.getHours();
    if (h < 6) return { text: 'Huzurlu Geceler', emoji: '🌙' };
    if (h < 12) return { text: 'Keyifli Sabahlar', emoji: '☀️' };
    if (h < 18) return { text: 'İyi Günler', emoji: '🌤️' };
    return { text: 'Huzurlu Akşamlar', emoji: '🌆' };
  };
  const greeting = getGreeting();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-slate-900 selection:bg-[var(--color-primary)] selection:text-white font-outfit">
      {/* Sidebar — Advanced Elite UI */}
      <aside className={`hidden xl:flex ${isSidebarOpen ? 'w-[280px]' : 'w-[88px]'} flex-col bg-white border-r border-slate-100 transition-all duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] shadow-[20px_0_60px_-20px_rgba(0,0,0,0.03)] z-50 relative overflow-hidden`}>
        {/* Sidebar Background Ornament */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none -z-10" />
        
        <div className={`h-24 flex items-center shrink-0 border-b border-slate-50 relative overflow-hidden transition-all duration-500 ${isSidebarOpen ? 'px-8 gap-4' : 'justify-center'}`}>
          <div className="relative group/logo">
            <div className="w-11 h-11 rounded-[18px] bg-slate-900 flex items-center justify-center text-white shadow-2xl shadow-slate-200 transition-transform duration-500 group-hover/logo:scale-110 active:scale-90 cursor-pointer">
              <i className="fa-solid fa-crown text-lg text-gold"></i>
            </div>
            {!isSidebarOpen && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse shadow-sm"></div>
            )}
          </div>
          {isSidebarOpen && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
              <p className="font-black text-slate-900 tracking-tight text-[15px] uppercase">ELITE PANEL</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] leading-none mt-1">Management</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-8 px-4 space-y-9 overflow-y-auto scrollbar-hide relative z-10">
          <div>
            <SidebarGroupLabel label="Operasyon" isSidebarOpen={isSidebarOpen} />
            <div className="space-y-1.5 mt-2">
              <SidebarNavItem id="overview" label="Dashboard" icon={<i className="fa-solid fa-grid-2"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={v => setActiveView(v as DashboardView)} />
              <SidebarNavItem id="bookings" label="Rezervasyonlar" badge={stats.pending} icon={<i className="fa-solid fa-calendar-clock"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={v => setActiveView(v as DashboardView)} />
              <SidebarNavItem id="reviews" label="Yorumlar" icon={<i className="fa-solid fa-star"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={v => setActiveView(v as DashboardView)} />
            </div>
          </div>
          <div>
            <SidebarGroupLabel label="İçerik & Katalog" isSidebarOpen={isSidebarOpen} />
            <div className="space-y-1.5 mt-2">
              <SidebarNavItem id="blog" label="Blog Yönetimi" icon={<i className="fa-solid fa-pen-nib"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={v => setActiveView(v as DashboardView)} />
              <SidebarNavItem id="regions" label="Bölge & Fiyat" icon={<i className="fa-solid fa-map-location-dot"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={v => setActiveView(v as DashboardView)} />
              <SidebarNavItem id="fleet" label="Araç Filosu" icon={<i className="fa-solid fa-car-rear"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={v => setActiveView(v as DashboardView)} />
            </div>
          </div>
          <div>
            <SidebarGroupLabel label="Site Ayarları" isSidebarOpen={isSidebarOpen} />
            <div className="space-y-1.5 mt-2">
              <SidebarNavItem id="hero-images" label="Banner Yönetimi" icon={<i className="fa-solid fa-images"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={v => setActiveView(v as DashboardView)} />
              <SidebarNavItem id="site-settings" label="Menü Kontrolü" icon={<i className="fa-solid fa-sliders"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={v => setActiveView(v as DashboardView)} />
              <SidebarNavItem id="faq" label="S.S.S" icon={<i className="fa-solid fa-circle-question"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={v => setActiveView(v as DashboardView)} />
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/40 relative z-20">
          <SidebarNavItem id="business" label="Hesap Ayarları" icon={<i className="fa-solid fa-user-gear"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={v => setActiveView(v as DashboardView)} />
          <button 
            onClick={onExitAdmin} 
            className={`group mt-3 w-full flex items-center ${isSidebarOpen ? 'px-4 py-3 gap-3.5' : 'justify-center p-3'} text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-300 font-bold text-sm relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-rose-50/0 group-hover:bg-rose-50/100 transition-colors duration-300"></div>
            <i className="fa-solid fa-arrow-right-from-bracket relative z-10 group-hover:rotate-12 transition-transform"></i>
            {isSidebarOpen && <span className="relative z-10 tracking-tight">Güvenli Çıkış</span>}
          </button>
        </div>

        {/* Sidebar Toggle — Apple Desktop Style */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-28 w-6 h-12 bg-white border border-slate-100 hover:border-slate-200 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-600 transition-all shadow-md group/toggle z-[60]"
        >
          <i className={`fa-solid ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-[9px] transition-transform duration-500 group-hover/toggle:scale-125`}></i>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                ELITE CONTROL
              </div>
              {activeView === 'overview' && (
                <div className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> CANLI SİSTEM
                </div>
              )}
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900">{activeView === 'overview' ? 'Panel Özeti' : VIEW_LABELS[activeView]?.label}</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">{greeting.emoji} {greeting.text}, bugün için her şey yolunda.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-100 shadow-sm">
              {saveStatus === 'saving' ? (
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5"><i className="fa-solid fa-circle-notch fa-spin"></i> KAYDEDİLİYOR</span>
              ) : saveStatus === 'saved' ? (
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5"><i className="fa-solid fa-check"></i> GÜNCEL</span>
              ) : (
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OTOMATİK KAYIT</span>
              )}
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-500 hover:text-slate-900 transition-all flex items-center justify-center shadow-sm">
              <i className={`fa-solid ${isSidebarOpen ? 'fa-indent' : 'fa-outdent'}`}></i>
            </button>
          </div>
        </header>

        {isPageTransitioning ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-4 gap-6">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100" />)}</div>
            <div className="h-96 bg-white rounded-3xl border border-slate-100" />
          </div>
        ) : activeView === 'overview' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[
                { label: 'TOPLAM CİRO', val: stats.totalRevenue, icon: 'fa-coins', color: 'text-amber-500', bg: 'bg-amber-50', isPrice: true },
                { label: 'ONAYLI', val: stats.confirmed, icon: 'fa-circle-check', color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: 'BEKLEYEN', val: stats.pending, icon: 'fa-clock', color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'BUGÜN', val: stats.todayBookings, icon: 'fa-calendar-day', color: 'text-rose-500', bg: 'bg-rose-50' },
              ].map((kpi, idx) => (
                <div key={idx} className="p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className={`w-12 h-12 rounded-2xl ${kpi.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500`}>
                    <i className={`fa-solid ${kpi.icon} ${kpi.color} text-lg`}></i>
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums mb-1">{kpi.isPrice && (siteContent.currency?.symbol || '€')}{kpi.val}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Today's Tracker */}
            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="flex flex-col lg:flex-row gap-10">
                 <div className="lg:w-1/4">
                    <p className="text-[11px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-4">Canlı Takip</p>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">Bugünün<br/>Transferleri</h3>
                    <p className="text-slate-500 text-sm mt-4 font-medium">Anlık operasyon ve araç durumu.</p>
                    <div className="mt-10">
                      <span className="text-5xl font-black text-slate-900 tracking-tighter">{stats.todayBookings}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Araç Yolda</span>
                    </div>
                 </div>
                 <div className="lg:w-3/4 flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    {bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).map(b => (
                      <div key={b.id} onClick={() => setSelectedBookingForView(b)} className="shrink-0 w-64 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-gold/30 hover:bg-white transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-black text-slate-900 font-mono">{b.time}</span>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${b.status === 'Confirmed' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{b.status}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 truncate mb-1">{b.customerName}</p>
                        <p className="text-[10px] text-slate-500 truncate">{b.pickup.split(',')[0]} → {b.destination.split(',')[0]}</p>
                      </div>
                    ))}
                    {stats.todayBookings === 0 && <div className="flex-1 flex items-center justify-center text-slate-300 text-sm font-bold uppercase tracking-widest italic">Bugün için transfer bulunmuyor</div>}
                 </div>
               </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3"><i className="fa-solid fa-chart-line text-indigo-500"></i> Haftalık Dağılım</h3>
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={stats.weeklyData} barSize={32}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:10, fontWeight:700}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:10, fontWeight:700}} />
                        <Tooltip cursor={{fill: '#f8fafc', radius: 10}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold'}} />
                        <Bar dataKey="v" fill="var(--color-primary)" radius={[8, 8, 8, 8]} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </div>
               <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3"><i className="fa-solid fa-chart-pie text-emerald-500"></i> Durum Dağılımı</h3>
                 <div className="h-64 flex flex-col md:flex-row items-center gap-6">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={stats.statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" strokeWidth={0}>
                          {stats.statusData.map((e, index) => <Cell key={index} fill={e.fill} />)}
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold'}} />
                     </PieChart>
                   </ResponsiveContainer>
                   <div className="w-full space-y-2">
                      {stats.statusData.map((s, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                          <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-2 h-2 rounded-full" style={{backgroundColor: s.fill}}></span>{s.name}</span>
                          <span className="text-sm font-black text-slate-900">{s.value}</span>
                        </div>
                      ))}
                   </div>
                 </div>
               </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3"><i className="fa-solid fa-list-check text-blue-500"></i> Son Rezervasyonlar</h3>
                    <button onClick={() => setActiveView('bookings')} className="text-[10px] font-black text-slate-400 hover:text-gold transition-all uppercase tracking-widest">Tümünü Gör</button>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                        <th className="pb-4">Müşteri</th>
                        <th className="pb-4">Güzergah</th>
                        <th className="pb-4">Tutar</th>
                        <th className="pb-4">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {bookings.filter(b => b.status !== 'Deleted').slice(0, 5).map(b => (
                        <tr key={b.id} onClick={() => setSelectedBookingForView(b)} className="group cursor-pointer hover:bg-slate-50 transition-all">
                          <td className="py-4">
                            <p className="text-sm font-bold text-slate-900 group-hover:text-gold transition-all">{b.customerName}</p>
                            <p className="text-[10px] text-slate-400">{b.phone}</p>
                          </td>
                          <td className="py-4 text-xs font-medium text-slate-500">{b.pickup.split(',')[0]} → {b.destination.split(',')[0]}</td>
                          <td className="py-4 text-sm font-black text-slate-900">{siteContent.currency?.symbol || '€'}{b.totalPrice}</td>
                          <td className="py-4"><span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border ${b.status === 'Confirmed' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{b.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
               <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3"><i className="fa-solid fa-globe text-amber-500"></i> Müşteri Ülkeleri</h3>
                  <div className="space-y-5">
                    {stats.topCountries.map((c, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-2"><span>{c.name}</span>{getCountryName(c.name)}</span>
                          <span className="text-xs font-black text-slate-900">{Math.round(c.percent)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full bg-gold rounded-full" style={{width: `${c.percent}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <AdminViewErrorBoundary activeView={activeView}>
            <Suspense fallback={<div className="flex items-center justify-center p-20"><i className="fa-solid fa-circle-notch fa-spin text-3xl text-gold"></i></div>}>
              <div key={activeView} className="animate-in fade-in slide-in-from-right-4 duration-500">
                {activeView === 'bookings' && <BookingsView bookings={bookings} onUpdateStatus={onUpdateStatus} onDeleteBooking={onDeleteBooking} setSelectedBookingForView={setSelectedBookingForView} showToast={showToast} confirmAction={confirmAction} />}
                {activeView === 'blog' && <BlogView blogPosts={blogPostsProp} setBlogPosts={setBlogPosts} blogTab={blogTab} setBlogTab={setBlogTab} blogCategories={blogCategories} blogSearchTerm={blogSearchTerm} setBlogSearchTerm={setBlogSearchTerm} showToast={showToast} confirmAction={confirmAction} />}
                {activeView === 'fleet' && <FleetView editContent={editContent} setEditContent={setEditContent} setVehicleForm={setVehicleForm} setIsVehicleModalOpen={setIsVehicleModalOpen} moveItem={(list, index, dir) => { const next = [...list]; const to = dir === 'up' ? index - 1 : index + 1; if (to >= 0 && to < next.length) { [next[index], next[to]] = [next[to], next[index]]; } return next; }} confirmAction={confirmAction} />}
                {activeView === 'regions' && <RegionsView editContent={editContent} setEditContent={setEditContent} showToast={showToast} confirmAction={confirmAction} />}
                {activeView === 'reviews' && <ReviewsView userReviews={userReviewsProp} setUserReviews={setUserReviews} siteReviews={[]} editableReviewsTab={editableReviewsTab} setEditableReviewsTab={setEditableReviewsTab} />}
                {activeView === 'faq' && <FAQView editContent={editContent} setEditContent={setEditContent} faqFilter={faqFilter} setFaqFilter={setFaqFilter} confirmAction={confirmAction} />}
                {activeView === 'site-settings' && <SiteSettingsView editContent={editContent} setEditContent={setEditContent} confirmAction={confirmAction} />}
                {activeView === 'hero-images' && <HeroImagesView heroBackgrounds={editContent.hero?.backgrounds || []} updateHeroBackgrounds={bgs => setEditContent({...editContent, hero: { ...editContent.hero, backgrounds: bgs }})} selectedHeroImages={[]} setSelectedHeroImages={() => {}} _confirmAction={confirmAction} />}
                {activeView === 'about' && <AboutView editContent={editContent} setEditContent={setEditContent} _confirmAction={confirmAction} />}
                {activeView === 'visionMission' && <VisionMissionView editContent={editContent} setEditContent={setEditContent} _confirmAction={confirmAction} />}
                {activeView === 'business' && <BusinessSettingsView editContent={editContent} setEditContent={setEditContent} accountForm={accountForm} setAccountForm={setAccountForm} onUpdatePassword={handleUpdatePassword} onExitAdmin={onExitAdmin} showToast={showToast} />}
              </div>
            </Suspense>
          </AdminViewErrorBoundary>
        )}
      </main>

      {/* Vehicle Drawer */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-[200]">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsVehicleModalOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">{vehicleForm.id ? 'Aracı Düzenle' : 'Yeni Araç Ekle'}</h3>
              <button onClick={() => setIsVehicleModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-50 text-slate-400"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Araç Adı</label>
                 <input className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" value={vehicleForm.name} onChange={e => setVehicleForm({...vehicleForm, name: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</label>
                   <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" value={vehicleForm.category} onChange={e => setVehicleForm({...vehicleForm, category: e.target.value as any})}>
                     <option value="VIP">VIP</option>
                     <option value="Business">Business</option>
                     <option value="Large Group">Grup</option>
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kapasite</label>
                   <input type="number" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" value={vehicleForm.capacity} onChange={e => setVehicleForm({...vehicleForm, capacity: parseInt(e.target.value)})} />
                 </div>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Görsel URL</label>
                 <input className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" value={vehicleForm.image} onChange={e => setVehicleForm({...vehicleForm, image: e.target.value})} />
               </div>
            </div>
            <div className="p-8 border-t border-slate-50">
              <button onClick={() => { setEditContent({...editContent, vehicles: vehicleForm.id ? editContent.vehicles.map(v => v.id === vehicleForm.id ? vehicleForm as Vehicle : v) : [...editContent.vehicles, {...vehicleForm, id: Date.now().toString()} as Vehicle]}); setIsVehicleModalOpen(false); showToast('Araç kaydedildi'); }} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Aracı Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* Command Palette */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-20" onClick={() => setIsCommandPaletteOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
              <input autoFocus className="flex-1 border-none outline-none text-sm font-bold placeholder-slate-300" placeholder="Komut yazın veya sayfa arayın..." />
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {commandItems.map(i => (
                <button key={i.id} onClick={() => handleCommandSelect(i)} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all text-left">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><i className={`fa-solid ${i.icon}`}></i></div>
                  <div><p className="text-sm font-black text-slate-900">{i.label}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{i.description}</p></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <AdminConfirmModal isOpen={confirmModal.isOpen} title={confirmModal.title} description={confirmModal.description} type={confirmModal.type} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} onConfirm={confirmModal.onConfirm} />
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[400] animate-in slide-in-from-top-10 duration-500">
           <div className={`px-6 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-white border-slate-100 text-slate-900'}`}>
             <i className={`fa-solid ${toast.type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check'} ${toast.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}></i>
             <span className="text-sm font-black">{toast.message}</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
