import React, { useState, useEffect, useRef, useMemo, Suspense, lazy, useCallback } from 'react';
import { AdminConfirmModal } from './admin/AdminConfirmModal';
import { Booking, SiteContent, Vehicle, BlogPost, UserReview, AdminAccountForm as _AdminAccountForm } from '../types';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, AreaChart, Area, BarChart, Bar
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
  'business':      { label: 'HESAP AYARLARI',      icon: 'fa-user-gear',               description: 'İşletme bilgileri, profil ve güvenlik ayarları' },
  'about':         { label: 'HAKKIMIZDA',          icon: 'fa-info-circle',             description: 'Hakkımızda sayfası içeriği' },
  'visionMission': { label: 'VİZYON & MİSYON',    icon: 'fa-bullseye',                description: 'Vizyon ve misyon sayfası' },
};

class AdminViewErrorBoundary extends React.Component<{ activeView: string; children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidUpdate(prevProps: { activeView: string }) {
    if (prevProps.activeView !== this.props.activeView && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-20 text-center gap-6 bg-white/40 backdrop-blur-2xl rounded-[3rem] border border-white/60 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 text-2xl shadow-sm"><i className="fa-solid fa-triangle-exclamation"></i></div>
          <div><p className="text-slate-900 font-black text-xl mb-1 tracking-tight">Sayfa yüklenirken hata oluştu</p><p className="text-slate-500 text-sm font-medium">{(this.state.error as any)?.message}</p></div>
          <button onClick={() => this.setState({ hasError: false, error: null })} className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl">Tekrar Dene</button>
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

const SidebarNavItem: React.FC<{ id: string; label: string; badge?: number; icon: React.ReactNode; activeView: string; isSidebarOpen: boolean; onNavigate: (id: string) => void }> = ({ id, label, badge = 0, icon, activeView, isSidebarOpen, onNavigate }) => {
  const isActive = activeView === id;
  return (
    <div className="relative group px-3">
      <button
        onClick={() => onNavigate(id)}
        className={`w-full rounded-2xl flex items-center transition-all duration-500 relative overflow-hidden ${
          isSidebarOpen
            ? `px-5 py-3.5 gap-4 ${isActive ? 'bg-white shadow-[0_15px_35px_rgba(0,0,0,0.04)] text-slate-900 ring-1 ring-slate-100' : 'hover:bg-white/60 text-slate-400 hover:text-slate-900'}`
            : `justify-center p-3.5 ${isActive ? 'bg-white shadow-[0_15px_35px_rgba(0,0,0,0.04)] text-gold ring-1 ring-slate-100 scale-105' : 'hover:bg-white/60 text-slate-400 hover:text-slate-900'}`
        }`}
      >
        <div className={`absolute inset-0 bg-gradient-to-tr from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${isActive ? 'opacity-40' : ''}`} />
        {isActive && isSidebarOpen && <div className="absolute left-0 top-[30%] bottom-[30%] w-1 bg-gold rounded-r-full shadow-[0_0_10px_rgba(197,160,89,0.5)]" />}
        <div className={`shrink-0 transition-all duration-500 relative z-10 ${isActive ? 'text-gold scale-110' : 'group-hover:scale-105'}`}>{icon}</div>
        {isSidebarOpen && <span className={`font-outfit text-[14px] font-bold whitespace-nowrap truncate tracking-tight relative z-10 transition-all duration-500 ${isActive ? 'text-slate-900' : ''}`}>{label}</span>}
        {badge > 0 && <span className={`flex items-center justify-center text-[9px] font-black rounded-full bg-slate-900 text-white shadow-xl relative z-10 ${isSidebarOpen ? 'ml-auto px-2 py-0.5 min-w-[20px] h-[20px]' : 'absolute top-1.5 right-1.5 w-[16px] h-[16px]'}`}>{badge > 9 ? '9+' : badge}</span>}
      </button>
      {!isSidebarOpen && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-5 pointer-events-none opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500 z-[100]">
          <div className="relative px-5 py-3 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl whitespace-nowrap">
            <div className="flex items-center gap-3"><span className="text-[12px] font-black text-white tracking-widest uppercase">{label}</span>{badge > 0 && <span className="px-2 py-0.5 rounded-lg bg-gold text-slate-900 text-[9px] font-black">{badge}</span>}</div>
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-slate-900/90" />
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarGroupLabel: React.FC<{ label: string; isSidebarOpen: boolean }> = ({ label, isSidebarOpen }) => isSidebarOpen ? (
  <div className="flex items-center gap-3 px-8 pt-6 pb-2">
    <span className="font-outfit text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] whitespace-nowrap opacity-60">{label}</span>
    <div className="flex-1 h-px bg-white/40" />
  </div>
) : <div className="pt-4" />;

const AdminPanel: React.FC<AdminPanelProps> = ({ bookings, onUpdateStatus, onAddBooking: _onAddBooking, siteContent, onUpdateSiteContent, onExitAdmin, onDeleteBooking, blogPosts: blogPostsProp, onAddBlogPost: _onAddBlogPost, onUpdateBlogPost: _onUpdateBlogPost, onDeleteBlogPost: _onDeleteBlogPost, userReviews: userReviewsProp, onUpdateReviewStatus: _onUpdateReviewStatus, onDeleteReview: _onDeleteReview }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer); }, []);

  const [activeView, setActiveView] = useState<DashboardView>(() => {
    const h = window.location.hash; const p = '#/admin/';
    return (h.startsWith(p) ? h.substring(p.length) : 'overview') as DashboardView;
  });
  useEffect(() => { window.location.hash = `#/admin/${activeView}`; }, [activeView]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; description: string; onConfirm: () => void; type: 'danger' | 'warning' | 'info' }>({
    isOpen: false, title: '', description: '', onConfirm: () => { }, type: 'info'
  });
  const confirmAction = (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => {
    setConfirmModal({ isOpen: true, title: options.title, description: options.description, onConfirm: options.onConfirm, type: options.type || 'info' });
  };

  const [editContent, setEditContent] = useState<SiteContent>(siteContent);
  const initialized = useRef(false);
  useEffect(() => { if (!initialized.current && siteContent !== INITIAL_SITE_CONTENT) { setEditContent(siteContent); initialized.current = true; } }, [siteContent]);

  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const showToast = useCallback((message: string, type: string = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); }, []);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  useEffect(() => {
    if (JSON.stringify(editContent) === JSON.stringify(siteContent)) return;
    const t = setTimeout(async () => {
      setSaveStatus('saving');
      try { await onUpdateSiteContent(editContent); setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000); }
      catch (e: any) { setSaveStatus('idle'); showToast(e.message, 'error'); }
    }, 1200);
    return () => clearTimeout(t);
  }, [editContent, onUpdateSiteContent, siteContent, showToast]);

  const [accountForm, setAccountForm] = useState<_AdminAccountForm>({ 
    fullName: siteContent.adminAccount?.fullName || '', 
    email: siteContent.adminAccount?.email || '', 
    phone: siteContent.adminAccount?.phone || '', 
    currentPassword: '', newPassword: '', confirmPassword: '',
    notifyEmail: siteContent.adminAccount?.notifyEmail ?? true, 
    notifySms: siteContent.adminAccount?.notifySms ?? false, 
    notifySystem: siteContent.adminAccount?.notifySystem ?? true, 
    twoFa: siteContent.adminAccount?.twoFa ?? false 
  });

  useEffect(() => {
    const updated = { fullName: accountForm.fullName, email: accountForm.email, phone: accountForm.phone, notifyEmail: accountForm.notifyEmail, notifySms: accountForm.notifySms, notifySystem: accountForm.notifySystem, twoFa: accountForm.twoFa };
    if (JSON.stringify(updated) !== JSON.stringify(editContent.adminAccount)) { setEditContent(prev => ({ ...prev, adminAccount: updated })); }
  }, [accountForm, editContent.adminAccount]);

  const [_selectedBookingForView, setSelectedBookingForView] = useState<Booking | null>(null);

  const [blogTab, setBlogTab] = useState<'published' | 'draft'>('published');
  const [blogSearchTerm, setBlogSearchTerm] = useState('');
  const [editableReviewsTab, setEditableReviewsTab] = useState<'pending' | 'approved' | 'rejected' | 'deleted'>('pending');
  const [faqFilter, setFaqFilter] = useState<'all' | 'answered' | 'unanswered'>('all');
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleForm, setVehicleForm] = useState<Partial<Vehicle>>({ id: '', name: '', category: 'VIP', capacity: 4, luggage: 4, image: '', features: [] });

  const [blogCategories, setBlogCategories] = useState<string[]>(['Havalimanı Transfer', 'Şehir İçi Transfer', 'Otel Transfer']);
  useEffect(() => { if (blogPostsProp.length > 0) { const fromPosts = [...new Set(blogPostsProp.map(p => p.category).filter(Boolean))]; setBlogCategories(prev => [...new Set([...prev, ...fromPosts])]); } }, [blogPostsProp]);

  const setBlogPosts = async (posts: BlogPost[] | ((prev: BlogPost[]) => BlogPost[])) => {
    const next = typeof posts === 'function' ? posts(blogPostsProp) : posts;
    const added = next.filter(p => !blogPostsProp.find(e => e.id === p.id));
    const removed = blogPostsProp.filter(e => !next.find(p => p.id === e.id));
    const updated = next.filter(p => { const ex = blogPostsProp.find(e => e.id === p.id); return ex && JSON.stringify(ex) !== JSON.stringify(p); });
    try { await Promise.all([...added.map(p => _onAddBlogPost(p)), ...updated.map(p => _onUpdateBlogPost(p)), ...removed.map(p => _onDeleteBlogPost(p.id))]); showToast('Blog güncellendi'); }
    catch (e: any) { showToast(e.message, 'error'); }
  };

  const setUserReviews = async (reviews: UserReview[] | ((prev: UserReview[]) => UserReview[])) => {
    const next = typeof reviews === 'function' ? reviews(userReviewsProp) : reviews;
    const removed = userReviewsProp.filter(r => !next.find(n => n.id === r.id));
    const changed = next.filter(r => { const ex = userReviewsProp.find(e => e.id === r.id); return ex && ex.status !== r.status; });
    try { await Promise.all([...changed.map(r => _onUpdateReviewStatus(r.id, r.status)), ...removed.map(r => _onDeleteReview(r.id))]); showToast('Yorumlar güncellendi'); }
    catch (e: any) { showToast(e.message, 'error'); }
  };

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const active = bookings.filter(b => b.status !== 'Deleted');
    const totalRevenue = active.reduce((sum, b) => b.status !== 'Cancelled' ? sum + b.totalPrice : sum, 0);
    const confirmed = active.filter(b => b.status === 'Confirmed').length;
    const pending = active.filter(b => b.status === 'Pending').length;
    const completed = active.filter(b => b.status === 'Completed').length;
    const todayBookings = active.filter(b => b.date === todayStr).length;
    const now = new Date();
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now); d.setDate(d.getDate() - (6 - i));
      const ds = d.toISOString().split('T')[0];
      return { d: d.toLocaleDateString('tr-TR', { weekday: 'short' }), v: active.filter(b => b.createdAt?.startsWith(ds)).length };
    });
    const statusData = [
      { name: 'Beklemede', value: pending, fill: '#f59e0b' },
      { name: 'Onaylı', value: confirmed, fill: '#3b82f6' },
      { name: 'Tamamlandı', value: completed, fill: '#10b981' },
      { name: 'İptal', value: active.filter(b => b.status === 'Cancelled').length, fill: '#ef4444' },
    ].filter(d => d.value > 0);
    const countryStats: Record<string, number> = {};
    userReviewsProp.forEach(r => { if (r.country) countryStats[r.country] = (countryStats[r.country] || 0) + 1; });
    const topCountries = Object.entries(countryStats).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count, percent: userReviewsProp.length > 0 ? (count / userReviewsProp.length) * 100 : 0 }));
    return { totalRevenue, confirmed, pending, completed, todayBookings, weeklyData, topCountries, statusData };
  }, [bookings, userReviewsProp]);

  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  useEffect(() => { setIsPageTransitioning(true); const t = setTimeout(() => setIsPageTransitioning(false), 400); return () => clearTimeout(t); }, [activeView]);

  const getGreeting = () => {
    const h = currentTime.getHours();
    if (h < 6) return { text: 'Huzurlu Geceler', emoji: '🌙' };
    if (h < 12) return { text: 'Keyifli Sabahlar', emoji: '☀️' };
    if (h < 18) return { text: 'İyi Günler', emoji: '🌤️' };
    return { text: 'Huzurlu Akşamlar', emoji: '🌆' };
  };
  const greeting = getGreeting();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-slate-900 selection:bg-gold/30 selection:text-slate-900 font-outfit relative">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-100/30 blur-[120px] transform-gpu animate-[blobRotate_30s_infinite_linear]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-100/30 blur-[100px] transform-gpu animate-[blobRotate_25s_infinite_linear_reverse]" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-rose-100/20 blur-[80px] transform-gpu animate-[blobRotate_20s_infinite_ease-in-out]" />
      </div>

      <style>{`
        @keyframes blobRotate {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(40px, -60px) rotate(120deg) scale(1.1); }
          66% { transform: translate(-30px, 40px) rotate(240deg) scale(0.9); }
          100% { transform: translate(0, 0) rotate(360deg) scale(1); }
        }
        .admin-glass-panel { background: rgba(255, 255, 255, 0.45); backdrop-filter: blur(40px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.7); }
      `}</style>

      <div className="py-6 pl-6 h-full z-50">
        <aside className={`h-full flex flex-col admin-glass-panel rounded-[3rem] transition-all duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden relative ${isSidebarOpen ? 'w-[280px]' : 'w-[88px]'}`}>
          <div className={`h-24 flex items-center shrink-0 border-b border-white/40 relative overflow-hidden transition-all duration-500 ${isSidebarOpen ? 'px-8 gap-4' : 'justify-center'}`}>
            <div className="w-11 h-11 rounded-[18px] bg-slate-900 flex items-center justify-center text-white shadow-2xl group/logo cursor-pointer active:scale-90 transition-all duration-500"><i className="fa-solid fa-crown text-lg text-gold"></i></div>
            {isSidebarOpen && <div className="animate-in fade-in slide-in-from-left-4 duration-700"><p className="font-black text-slate-900 tracking-tight text-[15px] uppercase">ELITE PANEL</p><p className="text-[9px] text-slate-400 font-black tracking-[0.3em] leading-none mt-1">Management</p></div>}
          </div>
          <nav className="flex-1 py-8 space-y-9 overflow-y-auto scrollbar-hide relative z-10">
            <div><SidebarGroupLabel label="Operasyon" isSidebarOpen={isSidebarOpen} /><div className="space-y-1.5 mt-2">
              <SidebarNavItem id="overview" label="Dashboard" icon={<i className="fa-solid fa-grid-2"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} />
              <SidebarNavItem id="bookings" label="Rezervasyonlar" badge={stats.pending} icon={<i className="fa-solid fa-calendar-clock"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} />
              <SidebarNavItem id="reviews" label="Yorumlar" icon={<i className="fa-solid fa-star"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} />
            </div></div>
            <div><SidebarGroupLabel label="Katalog" isSidebarOpen={isSidebarOpen} /><div className="space-y-1.5 mt-2">
              <SidebarNavItem id="blog" label="Blog Yazıları" icon={<i className="fa-solid fa-pen-nib"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} />
              <SidebarNavItem id="regions" label="Bölge & Fiyat" icon={<i className="fa-solid fa-map-location-dot"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} />
              <SidebarNavItem id="fleet" label="Araç Filosu" icon={<i className="fa-solid fa-car-rear"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} />
            </div></div>
            <div><SidebarGroupLabel label="Sistem" isSidebarOpen={isSidebarOpen} /><div className="space-y-1.5 mt-2">
              <SidebarNavItem id="hero-images" label="Görsel Yönetimi" icon={<i className="fa-solid fa-images"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} />
              <SidebarNavItem id="site-settings" label="Navigasyon" icon={<i className="fa-solid fa-sliders"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} />
              <SidebarNavItem id="faq" label="S.S.S" icon={<i className="fa-solid fa-circle-question"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} />
            </div></div>
          </nav>
          <div className="p-4 border-t border-white/40 bg-white/10 z-20">
            <SidebarNavItem id="business" label="Hesap & Profil" icon={<i className="fa-solid fa-user-gear"></i>} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} />
            <button onClick={onExitAdmin} className={`group mt-3 w-full flex items-center ${isSidebarOpen ? 'px-5 py-3 gap-4' : 'justify-center p-3'} text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 rounded-2xl transition-all duration-300 font-bold text-sm`}><i className="fa-solid fa-arrow-right-from-bracket group-hover:rotate-12 transition-transform"></i>{isSidebarOpen && <span>Güvenli Çıkış</span>}</button>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute -right-3 top-28 w-6 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-600 transition-all shadow-md z-[60]"><i className={`fa-solid ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'} text-[8px]`}></i></button>
        </aside>
      </div>

      <main className="flex-1 overflow-y-auto relative z-10 scrollbar-hide">
        <div className="p-6 md:p-10 space-y-10">
          <header className="admin-glass-panel rounded-[2.5rem] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.04)] animate-in slide-in-from-top-4 duration-1000">
            <div><div className="flex items-center gap-3 mb-4"><div className="px-3 py-1 rounded-full bg-slate-900 text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg">SYSTEM CORE</div>{activeView === 'overview' && <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> LIVE</div>}</div><h1 className="text-4xl font-black tracking-[-0.05em] text-slate-900 leading-tight">{activeView === 'overview' ? 'Panel Özeti' : VIEW_LABELS[activeView]?.label}</h1><p className="text-slate-400 text-[13px] mt-2 font-bold uppercase tracking-widest opacity-80">{greeting.emoji} {greeting.text}, verileriniz güvende.</p></div>
            <div className="flex flex-wrap items-center gap-5"><div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/40 border border-white/60 shadow-sm transition-all duration-500">{saveStatus === 'saving' ? (<><div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div><span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Kaydediliyor</span></>) : saveStatus === 'saved' ? (<><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Güncel</span></>) : (<><div className="w-2 h-2 rounded-full bg-slate-300"></div><span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Otomatik Kayıt</span></>)}</div><div className="h-10 w-px bg-slate-100 hidden md:block" /><button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center shadow-sm"><i className={`fa-solid ${isSidebarOpen ? 'fa-indent' : 'fa-outdent'} text-lg`}></i></button><button onClick={() => setActiveView('business')} className="group relative p-1 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 active:scale-95"><div className="w-11 h-11 rounded-[14px] bg-slate-900 flex items-center justify-center text-gold font-black text-sm">{(accountForm.fullName || 'A').charAt(0).toUpperCase()}</div></button></div>
          </header>

          {isPageTransitioning ? (
            <div className="space-y-10 animate-pulse"><div className="grid grid-cols-4 gap-8">{[1,2,3,4].map(i => <div key={i} className="h-40 bg-white/20 rounded-[3rem] border border-white/40" />)}</div><div className="h-[500px] bg-white/20 rounded-[4rem] border border-white/40" /></div>
          ) : activeView === 'overview' ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-[cubic-bezier(0.2,1,0.3,1)]">
              <div className="grid grid-cols-12 gap-8 items-stretch">
                <div className="col-span-12 lg:col-span-7 xl:col-span-8 admin-glass-panel rounded-[3.5rem] p-12 shadow-sm relative overflow-hidden group transition-all duration-700"><div className="relative z-10"><div className="flex items-center gap-4 mb-10"><div className="w-14 h-14 rounded-[22px] bg-slate-900 flex items-center justify-center text-gold shadow-2xl group-hover:scale-110 transition-all duration-500"><i className="fa-solid fa-coins text-2xl"></i></div><div><p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Mali Portföy</p><h4 className="text-sm font-bold text-slate-900 mt-0.5">Toplam Net Ciro</h4></div></div><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-10"><div><p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">BRÜT KAZANÇ</p><h3 className="text-7xl font-black text-slate-900 tracking-[-0.06em] tabular-nums"><span className="text-3xl mr-2 text-gold opacity-80">{siteContent.currency?.symbol || '€'}</span>{stats.totalRevenue.toLocaleString()}</h3></div><div className="flex-1 max-w-[280px] h-32 opacity-30 group-hover:opacity-100 transition-all duration-1000"><ResponsiveContainer width="100%" height="100%"><AreaChart data={stats.weeklyData}><defs><linearGradient id="goldMesh" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c5a059" stopOpacity={0.8} /><stop offset="100%" stopColor="#c5a059" stopOpacity={0.1} /></linearGradient></defs><Area type="monotone" dataKey="v" stroke="#c5a059" strokeWidth={4} fill="url(#goldMesh)" /></AreaChart></ResponsiveContainer></div></div></div><div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-gold/10 transition-all duration-1000" /></div>
                <div className="col-span-12 lg:col-span-5 xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                  {[{ label: 'AKTİF ONAYLI', val: stats.confirmed, icon: 'fa-circle-check', color: 'text-blue-500', bg: 'bg-blue-50/50' }, { label: 'BEKLEYEN İŞLEM', val: stats.pending, icon: 'fa-clock', color: 'text-amber-600', bg: 'bg-amber-50/50' }].map((kpi, i) => (
                    <div key={i} className="admin-glass-panel rounded-[3rem] p-8 shadow-sm group hover:scale-[1.02] transition-all duration-500 cursor-pointer overflow-hidden relative"><div className="flex items-center justify-between relative z-10"><div className={`w-14 h-14 rounded-2xl ${kpi.bg} border border-white/60 flex items-center justify-center ${kpi.color} shadow-sm group-hover:scale-110 transition-transform duration-700`}><i className={`fa-solid ${kpi.icon} text-xl`}></i></div><div className="text-right"><p className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">{kpi.val}</p><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{kpi.label}</p></div></div><div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-slate-900/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-colors" /></div>
                  ))}
                </div>
              </div>

              <div className="admin-glass-panel rounded-[4rem] p-10 shadow-sm relative overflow-hidden group"><div className="flex flex-col lg:flex-row gap-12 items-stretch"><div className="lg:w-[320px] shrink-0 border-b lg:border-b-0 lg:border-r border-white/40 pb-10 lg:pb-0 lg:pr-12"><div className="flex items-center gap-3 mb-6"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.6)]"></div><span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em]">Live Feed</span></div><h3 className="text-3xl font-black text-slate-900 tracking-[-0.04em] leading-[1.1]">Bugünün<br/>Operasyonu</h3><p className="text-slate-500 text-[14px] mt-4 font-medium leading-relaxed">Sistemde anlık takip edilen transferler.</p><div className="mt-12 flex items-baseline gap-3"><span className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">{stats.todayBookings}</span><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-tight">ARAÇ<br/>HAREKETLİ</p></div></div><div className="flex-1 flex gap-8 overflow-x-auto pb-6 pt-2 scrollbar-hide snap-x">{bookings.filter(b => b.date === today).length > 0 ? (bookings.filter(b => b.date === today).map(b => (
                <div key={b.id} onClick={() => setSelectedBookingForView(b)} className="shrink-0 w-[320px] p-8 rounded-[3rem] bg-white/60 border border-white hover:bg-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-700 cursor-pointer snap-start group/card"><div className="flex items-center justify-between mb-6"><div className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-100 group-hover/card:bg-slate-900 group-hover/card:text-white transition-colors duration-500"><i className="fa-solid fa-clock text-[10px] opacity-60"></i><span className="text-sm font-black font-mono tracking-tighter">{b.time}</span></div><span className={`text-[9px] font-black px-3 py-1 rounded-full border tracking-widest uppercase shadow-sm ${b.status === 'Confirmed' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{b.status}</span></div><div className="space-y-1 mb-8"><h5 className="text-[17px] font-black text-slate-900 group-hover/card:text-gold transition-colors truncate">{b.customerName}</h5><div className="flex items-center gap-2"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{b.passengers} Yolcu</span><div className="w-1 h-1 rounded-full bg-slate-200" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VIP Transfer</span></div></div><div className="pt-6 border-t border-slate-50 flex items-center justify-between"><div className="flex items-center gap-2 text-slate-500"><i className="fa-solid fa-map-pin text-[10px] text-indigo-400"></i><span className="text-[12px] font-bold truncate max-w-[120px]">{b.destination.split(',')[0]}</span></div><span className="text-xl font-black text-slate-900 tracking-tighter">{siteContent.currency?.symbol || '€'}{b.totalPrice}</span></div></div>
              ))) : (<div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 p-12 text-center group-hover:bg-white/80 transition-colors duration-700"><i className="fa-regular fa-calendar-circle-minus text-4xl text-slate-200 mb-4"></i><p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Bugün için transfer bulunmuyor</p></div>)}</div></div></div>

              <div className="grid grid-cols-12 gap-8 items-stretch">
                <div className="col-span-12 lg:col-span-8 admin-glass-panel rounded-[3.5rem] p-10 shadow-sm relative overflow-hidden"><div className="flex items-center justify-between mb-10"><div><h3 className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-3"><i className="fa-solid fa-chart-area text-indigo-500"></i> Haftalık Performans</h3><p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Yoğunluk Analizi</p></div><div className="px-4 py-2 rounded-2xl bg-white/60 border border-white/80 text-[11px] font-black text-slate-500 tracking-widest uppercase shadow-sm">Son 7 Gün</div></div><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={stats.weeklyData} barSize={40} barGap={12}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:11, fontWeight:800}} dy={15} /><YAxis axisLine={false} tickLine={false} tick={{fill:'#94a3b8', fontSize:11, fontWeight:800}} /><Tooltip cursor={{fill: 'rgba(255,255,255,0.4)', radius: 15}} contentStyle={{borderRadius: '24px', border: '1px solid rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', fontSize: '13px', fontWeight: 'bold'}} /><Bar dataKey="v" fill="var(--color-primary)" radius={[15, 15, 15, 15]}>{stats.weeklyData.map((_e, index) => (<Cell key={`cell-${index}`} fill={index === stats.weeklyData.length - 1 ? '#0F172A' : '#C5A059'} />))}</Bar></BarChart></ResponsiveContainer></div></div>
                <div className="col-span-12 lg:col-span-4 admin-glass-panel rounded-[3.5rem] p-10 shadow-sm overflow-hidden text-center flex flex-col items-center justify-center relative"><h3 className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-3 mb-10"><i className="fa-solid fa-chart-pie text-emerald-500"></i> Durum Dağılımı</h3><div className="h-64 flex flex-col items-center relative w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={stats.statusData} innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" strokeWidth={0}>{stats.statusData.map((e, index) => <Cell key={index} fill={e.fill} />)}</Pie><Tooltip contentStyle={{borderRadius: '24px', border: 'none', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: '12px', fontWeight: 'bold'}} /></PieChart></ResponsiveContainer><div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TOPLAM</span><span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{stats.confirmed + stats.pending + stats.completed}</span></div></div></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 admin-glass-panel rounded-[3.5rem] p-10 shadow-sm overflow-hidden"><div className="flex items-center justify-between mb-10"><h3 className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-3"><i className="fa-solid fa-list-ul text-blue-500"></i> Son Kayıtlar</h3><button onClick={() => setActiveView('bookings')} className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-black transition-all">Tümünü Gör</button></div><div className="overflow-x-auto scrollbar-hide"><table className="w-full text-left"><thead><tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] border-b border-white/40"><th className="pb-5 px-4">MÜŞTERİ</th><th className="pb-5 px-4">ROTA</th><th className="pb-5 px-4 text-right">DURUM</th></tr></thead><tbody className="divide-y divide-white/40">{bookings.filter(b => b.status !== 'Deleted').slice(0, 5).map(b => (
                  <tr key={b.id} onClick={() => setSelectedBookingForView(b)} className="group cursor-pointer hover:bg-white/60 transition-all duration-300"><td className="py-6 px-4"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-[14px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-black group-hover:text-gold transition-colors">{b.customerName.charAt(0).toUpperCase()}</div><div><p className="text-[15px] font-black text-slate-900 group-hover:text-gold transition-all tracking-tight leading-none">{b.customerName}</p><p className="text-[11px] text-slate-400 font-medium mt-1.5">{b.phone}</p></div></div></td><td className="py-6 px-4"><div className="flex flex-col gap-1"><p className="text-[12px] font-bold text-slate-600 truncate max-w-[180px]">{b.destination.split(',')[0]}</p><p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{b.time}</p></div></td><td className="py-6 px-4 text-right"><span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black tracking-widest uppercase shadow-sm ${b.status === 'Confirmed' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{b.status}</span></td></tr>
                ))}</tbody></table></div></div>
                <div className="lg:col-span-4 admin-glass-panel rounded-[3.5rem] p-10 shadow-sm relative overflow-hidden h-full"><h3 className="text-lg font-black text-slate-900 tracking-tight uppercase flex items-center gap-3 mb-10"><i className="fa-solid fa-earth-europe text-amber-500"></i> Global Pazar</h3><div className="space-y-7 relative z-10">{stats.topCountries.map((c, i) => (<div key={i} className="group cursor-default"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-3"><span className="text-2xl leading-none grayscale-[0.6] group-hover:grayscale-0 transition-all duration-700">{c.name}</span><span className="text-xs font-black text-slate-700 uppercase tracking-widest">{getCountryName(c.name)}</span></div><span className="text-[13px] font-black text-slate-900 tabular-nums">{Math.round(c.percent)}%</span></div><div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-gold rounded-full transition-all duration-1000 ease-out" style={{width: `${c.percent}%`}}></div></div></div>))}</div><i className="fa-solid fa-earth-americas absolute bottom-[-40px] right-[-40px] text-[200px] text-slate-900/5 rotate-[-15deg] pointer-events-none" /></div>
              </div>
            </div>
          ) : (
            <AdminViewErrorBoundary activeView={activeView}>
              <Suspense fallback={<div className="flex items-center justify-center p-20"><i className="fa-solid fa-circle-notch fa-spin text-3xl text-gold"></i></div>}>
                <div key={activeView} className="animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
                  {activeView === 'bookings' && <BookingsView bookings={bookings} onUpdateStatus={onUpdateStatus} onDeleteBooking={onDeleteBooking} setSelectedBookingForView={setSelectedBookingForView} showToast={showToast} confirmAction={confirmAction} />}
                  {activeView === 'blog' && <BlogView blogPosts={blogPostsProp} setBlogPosts={setBlogPosts} blogTab={blogTab} setBlogTab={setBlogTab} blogCategories={blogCategories} blogSearchTerm={blogSearchTerm} setBlogSearchTerm={setBlogSearchTerm} showToast={showToast} _confirmAction={confirmAction} />}
                  {activeView === 'fleet' && <FleetView editContent={editContent} setEditContent={setEditContent} setVehicleForm={setVehicleForm} setIsVehicleModalOpen={setIsVehicleModalOpen} moveItem={(list, index, dir) => { const next = [...list]; const to = dir === 'up' ? index - 1 : index + 1; if (to >= 0 && to < next.length) { [next[index], next[to]] = [next[to], next[index]]; } return next; }} confirmAction={confirmAction} />}
                  {activeView === 'regions' && <RegionsView editContent={editContent} setEditContent={setEditContent} showToast={showToast} confirmAction={confirmAction} />}
                  {activeView === 'reviews' && <ReviewsView userReviews={userReviewsProp} setUserReviews={setUserReviews} siteReviews={[]} editableReviewsTab={editableReviewsTab} setEditableReviewsTab={setEditableReviewsTab} />}
                  {activeView === 'faq' && <FAQView editContent={editContent} setEditContent={setEditContent} faqFilter={faqFilter} setFaqFilter={setFaqFilter} confirmAction={confirmAction} />}
                  {activeView === 'site-settings' && <SiteSettingsView editContent={editContent} setEditContent={setEditContent} confirmAction={confirmAction} />}
                  {activeView === 'hero-images' && <HeroImagesView heroBackgrounds={editContent.hero?.backgrounds || []} updateHeroBackgrounds={bgs => setEditContent({...editContent, hero: { ...editContent.hero, backgrounds: bgs }})} selectedHeroImages={[]} setSelectedHeroImages={() => {}} _confirmAction={confirmAction} />}
                  {activeView === 'about' && <AboutView editContent={editContent} setEditContent={setEditContent} _confirmAction={confirmAction} />}
                  {activeView === 'visionMission' && <VisionMissionView editContent={editContent} setEditContent={setEditContent} _confirmAction={confirmAction} />}
                  {activeView === 'business' && <BusinessSettingsView editContent={editContent} setEditContent={setEditContent} accountForm={accountForm} setAccountForm={setAccountForm} onUpdatePassword={async () => ({ error: null })} onExitAdmin={onExitAdmin} showToast={showToast} />}
                </div>
              </Suspense>
            </AdminViewErrorBoundary>
          )}
        </div>
      </main>

      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-[200]">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsVehicleModalOpen(false)} />
          <div className="absolute right-6 top-6 bottom-6 w-full max-w-xl bg-white/80 backdrop-blur-3xl rounded-[4rem] border border-white shadow-2xl animate-in slide-in-from-right-8 duration-700 flex flex-col">
            <div className="px-12 py-8 border-b border-white/40 flex items-center justify-between shrink-0"><h3 className="text-xl font-black text-slate-900">{vehicleForm.id ? 'Aracı Düzenle' : 'Yeni Araç Ekle'}</h3><button onClick={() => setIsVehicleModalOpen(false)} className="w-14 h-14 rounded-full bg-white border border-slate-100 shadow-sm hover:bg-slate-50 text-slate-400 flex items-center justify-center transition-all active:scale-90"><i className="fa-solid fa-xmark text-xl"></i></button></div>
            <div className="flex-1 overflow-y-auto p-12 space-y-12 bg-slate-50/30 admin-scrollbar">
               <div className="space-y-4"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">ARAÇ ADI</label><input className="w-full bg-white/60 border border-white rounded-[2rem] px-8 py-5 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:shadow-xl transition-all duration-500 shadow-sm" value={vehicleForm.name || ''} onChange={e => setVehicleForm({...vehicleForm, name: e.target.value})} /></div>
               <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-4"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">KATEGORİ</label><select className="w-full bg-white/60 border border-white rounded-[2rem] px-8 py-5 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:shadow-xl transition-all duration-500 shadow-sm" value={vehicleForm.category} onChange={e => setVehicleForm({...vehicleForm, category: e.target.value as any})}><option value="VIP">VIP</option><option value="Business">Business</option><option value="Large Group">Grup</option></select></div>
                 <div className="space-y-4"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">KAPASİTE</label><input type="number" className="w-full bg-white/60 border border-white rounded-[2rem] px-8 py-5 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:shadow-xl transition-all duration-500 shadow-sm" value={vehicleForm.capacity || 0} onChange={e => setVehicleForm({...vehicleForm, capacity: parseInt(e.target.value)})} /></div>
               </div>
               <div className="space-y-4"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">GÖRSEL URL</label><input className="w-full bg-white/60 border border-white rounded-[2rem] px-8 py-5 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:shadow-xl transition-all duration-500 shadow-sm" value={vehicleForm.image || ''} onChange={e => setVehicleForm({...vehicleForm, image: e.target.value})} /></div>
            </div>
            <div className="p-12 border-t border-white/40 bg-white/20 backdrop-blur-md shrink-0"><button onClick={() => { setEditContent({...editContent, vehicles: vehicleForm.id ? editContent.vehicles.map(v => v.id === vehicleForm.id ? (vehicleForm as Vehicle) : v) : [...editContent.vehicles, {...vehicleForm, id: Date.now().toString()} as Vehicle]}); setIsVehicleModalOpen(false); showToast('Araç kaydedildi'); }} className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-black transition-all active:scale-95">DEĞİŞİKLİKLERİ KAYDET</button></div>
          </div>
        </div>
      )}

      <AdminConfirmModal isOpen={confirmModal.isOpen} title={confirmModal.title} description={confirmModal.description} type={confirmModal.type} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} onConfirm={confirmModal.onConfirm} />
      
      {toast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[400] animate-in slide-in-from-top-12 duration-500"><div className={`px-10 py-5 rounded-[2.5rem] shadow-2xl border flex items-center gap-4 backdrop-blur-3xl ${toast.type === 'error' ? 'bg-rose-50/90 border-rose-100 text-rose-600 shadow-rose-200/40' : 'bg-white/90 border-white/60 text-slate-900 shadow-slate-200/40'}`}><i className={`fa-solid ${toast.type === 'error' ? 'fa-circle-xmark text-rose-500' : 'fa-circle-check text-emerald-500'} text-xl`}></i><span className="text-[15px] font-black tracking-tight">{toast.message}</span></div></div>
      )}
    </div>
  );
};

export default AdminPanel;
