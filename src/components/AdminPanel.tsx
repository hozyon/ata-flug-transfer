import React, { useState, useEffect, useRef, useMemo, useCallback, Suspense, lazy } from 'react';
// ParticlesBackground removed — unused
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { MobileSpotlight } from './admin/MobileSpotlight';
import { KpiCarousel } from './admin/KpiCarousel';
import { Sparkline } from './admin/Sparkline';
import { AnimatedNumber } from './admin/AnimatedNumber';
import { ContextMenu } from './admin/ContextMenu';
import { MobileBookingItem } from './admin/MobileBookingItem';
import { AdminConfirmModal } from './admin/AdminConfirmModal';

import { haptic } from '../utils/haptic';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Booking, SiteContent, Vehicle, BlogPost, UserReview, AdminAccountForm } from '../types';
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

// Static mapping — defined at module level to avoid useMemo dependency warning
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

// ─── Error Boundary for lazy-loaded admin views ───────────────────────────────
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
        <div className="flex flex-col items-center justify-center p-20 text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <i className="fa-solid fa-triangle-exclamation text-red-400 text-2xl"></i>
          </div>
          <div>
            <p className="text-white font-bold text-lg mb-1">Bu sayfa yüklenirken bir hata oluştu</p>
            <p className="text-white/40 text-sm">{this.state.error?.message || 'Bilinmeyen hata'}</p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-6 py-2.5 bg-[var(--color-primary)] text-[#0f172a] font-bold rounded-xl text-sm hover:bg-[#d4af6a] transition-colors"
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

// ── Sidebar sub-components (defined outside AdminPanel to avoid react/no-unstable-nested-components) ──

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
            ? `px-3 py-2.5 gap-3 ${isActive ? 'bg-gradient-to-r from-[var(--color-primary)]/[0.15] via-[var(--color-primary)]/[0.05] to-transparent shadow-[inset_1px_0_0_0_rgba(255,255,255,0.05)]' : 'hover:bg-white/[0.06] text-slate-400'}`
            : `justify-center p-2.5 ${isActive ? 'bg-[var(--color-primary)]/[0.18] shadow-[0_8px_20px_rgba(0,0,0,0.3)]' : 'hover:bg-white/[0.06] text-slate-500'}`
        }`}
      >
        {isActive && isSidebarOpen && (
          <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] bg-gradient-to-b from-[var(--color-primary)] to-[#d4a832] rounded-r-full shadow-[0_0_15px_rgba(197,160,89,0.7)]" />
        )}
        <div className={`shrink-0 transition-all duration-300 ${isActive ? 'text-[var(--color-primary)] scale-110 drop-shadow-[0_0_10px_rgba(197,160,89,0.4)]' : 'group-hover:text-slate-200 group-hover:scale-105'}`}>
          {icon}
        </div>
        {isSidebarOpen && (
          <span className={`font-outfit text-[12.5px] font-[600] whitespace-nowrap truncate tracking-[0.015em] transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
            {label}
          </span>
        )}
        {badge > 0 && (
          <span className={`flex items-center justify-center text-[9px] font-black rounded-lg bg-red-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.35)] ${isSidebarOpen ? 'ml-auto px-1.5 py-0.5 min-w-[18px] h-[18px] shrink-0' : 'absolute -top-1 -right-1 w-[15px] h-[15px]'}`}>
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </button>
      {!isSidebarOpen && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 pointer-events-none opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 z-[100]">
          <div className="relative px-4 py-2.5 rounded-xl bg-[#0a0e1a] backdrop-blur-3xl transform-gpu border border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.6)] whitespace-nowrap">
            <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] bg-gradient-to-b from-[var(--color-primary)] to-[#d4a832] rounded-r-full" />
            <div className="flex items-center gap-3 pl-1">
              <span className="text-[13px] font-bold text-white tracking-wide">{label}</span>
              {badge > 0 && <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[9px] font-black shadow-lg shadow-red-500/20">{badge}</span>}
            </div>
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-[#0a0e1a]" />
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
  <div className="flex items-center gap-2.5 px-3.5 pt-3 pb-1.5">
    <span className="font-outfit text-[9px] font-[750] text-slate-600 uppercase tracking-[0.25em] whitespace-nowrap">{label}</span>
    <div className="flex-1 h-px bg-gradient-to-r from-white/[0.07] to-transparent" />
  </div>
) : <div className="pt-2.5" />;

const AdminPanel: React.FC<AdminPanelProps> = ({ bookings, onUpdateStatus, onAddBooking, siteContent, onUpdateSiteContent, onExitAdmin, onDeleteBooking, blogPosts: blogPostsProp, onAddBlogPost, onUpdateBlogPost, onDeleteBlogPost, userReviews: userReviewsProp, onUpdateReviewStatus, onDeleteReview }) => {
  // Theme Toggle
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('site_admin_theme');
    return saved ? saved === 'dark' : true;
  });

  const toggleTheme = () => {
    setIsDarkTheme(prev => {
      const next = !prev;
      localStorage.setItem('site_admin_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Live Clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);


  // Initialize View from Hash
  const getInitialView = (): DashboardView => {
    const hash = window.location.hash;
    const prefix = '#/admin/';
    if (hash.startsWith(prefix)) {
      const view = hash.substring(prefix.length) as DashboardView;
      return view || 'overview';
    }
    return 'overview';
  };

  const [activeView, setActiveView] = useState<DashboardView>(getInitialView);

  // Sync Hash with View
  useEffect(() => {
    window.location.hash = `#/admin/${activeView}`;
  }, [activeView]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; description: string; onConfirm: () => void; type: 'danger' | 'warning' | 'info' }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => { },
    type: 'info'
  });

  const confirmAction = (options: { title: string; description: string; onConfirm: () => void; type?: 'danger' | 'warning' | 'info' }) => {
    setConfirmModal({
      isOpen: true,
      title: options.title,
      description: options.description,
      onConfirm: options.onConfirm,
      type: options.type || 'info'
    });
  };

  const [isCorporateOpen, setIsCorporateOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editContent, setEditContent] = useState<SiteContent>(siteContent);
  const editContentInitialized = useRef(false);
  const lastKnownServerContent = useRef<SiteContent>(siteContent);

  useEffect(() => {
    // 1. Initial Load
    if (!editContentInitialized.current && siteContent !== INITIAL_SITE_CONTENT) {
      setEditContent(siteContent);
      lastKnownServerContent.current = siteContent;
      editContentInitialized.current = true;
      return;
    }

    // 2. Background SWR Update
    // If the server data changed and it's DIFFERENT from what we last saw from the server
    if (JSON.stringify(siteContent) !== JSON.stringify(lastKnownServerContent.current)) {
      // Check if the user has made ANY local edits compared to our last known server state
      const isDirty = JSON.stringify(editContent) !== JSON.stringify(lastKnownServerContent.current);
      
      if (!isDirty) {
        // Safe to just update everything
        setEditContent(siteContent);
      } else {
        // User has edits. We only want to merge fields that the user HASN'T touched.
        // For simplicity in this complex JSON structure, we show a toast or merge top-level if needed.
        // Here we'll do a shallow merge of top-level keys that haven't changed locally.
        setEditContent(prev => {
          const next = { ...prev };
          (Object.keys(siteContent) as Array<keyof SiteContent>).forEach(key => {
            if (JSON.stringify(prev[key]) === JSON.stringify(lastKnownServerContent.current[key])) {
              // User hasn't touched this key, so we can update it from server
              (next as any)[key] = siteContent[key];
            }
          });
          return next;
        });
      }
      lastKnownServerContent.current = siteContent;
    }
  }, [siteContent, editContent]);
  const [_searchTerm, _setSearchTerm] = useState('');
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);
  const [selectedBookingForView, setSelectedBookingForView] = useState<Booking | null>(null);

  // Blog States — Supabase-backed via props
  const blogPosts = blogPostsProp;
  const setBlogPosts = async (posts: BlogPost[] | ((prev: BlogPost[]) => BlogPost[])) => {
    const next = typeof posts === 'function' ? posts(blogPostsProp) : posts;
    // Diff against current to find what changed
    const added = next.filter(p => !blogPostsProp.find(e => e.id === p.id));
    const removed = blogPostsProp.filter(e => !next.find(p => p.id === e.id));
    const updated = next.filter(p => {
      const existing = blogPostsProp.find(e => e.id === p.id);
      if (!existing) return false;
      return existing.title !== p.title || existing.content !== p.content ||
        existing.slug !== p.slug || existing.excerpt !== p.excerpt ||
        existing.isPublished !== p.isPublished || existing.featuredImage !== p.featuredImage ||
        existing.category !== p.category || existing.seoTitle !== p.seoTitle ||
        existing.seoDescription !== p.seoDescription || existing.scheduledAt !== p.scheduledAt ||
        JSON.stringify(existing.tags) !== JSON.stringify(p.tags);
    });
    try {
      const results = await Promise.allSettled([
        ...added.map(p => onAddBlogPost(p)),
        ...updated.map(p => onUpdateBlogPost(p)),
        ...removed.map(p => onDeleteBlogPost(p.id))
      ]);
      const failures = results.filter(r => r.status === 'rejected');
      if (failures.length > 0) {
        const firstError = (failures[0] as PromiseRejectedResult).reason;
        console.error('Some blog post operations failed:', failures);
        showToast(`${failures.length} işlem başarısız oldu: ${firstError.message || 'Bilinmeyen hata'}`, 'error');
      } else if (results.length > 0) {
        showToast('Blog yazıları başarıyla güncellendi', 'success');
      }
    } catch (error: any) {
      console.error('Blog post operation failed:', error);
      showToast(error.message || 'Blog yazısı güncellenirken hata oluştu', 'error');
    }
  };
  const [_editingBlogPost, _setEditingBlogPost] = useState<BlogPost | null>(null);
  const [_isAddBlogModalOpen, setIsAddBlogModalOpen] = useState(false);
  const [_newBlogPost, _setNewBlogPost] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Havalimanı Transfer',
    featuredImage: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=800',
    isPublished: false
  });
  const [_showBlogPreview, _setShowBlogPreview] = useState(false);
  const [blogTab, setBlogTab] = useState<'published' | 'draft'>('published');
  const [blogSearchTerm, setBlogSearchTerm] = useState('');
  const [blogCategories, setBlogCategories] = useState<string[]>([
    'Havalimanı Transfer',
    'Şehir İçi Transfer',
    'Otel Transfer',
    'Tatil & Resort Transfer',
    'Turistik Transfer',
    'Şehirlerarası Transfer',
    'Doğa & Macera Transfer',
    'Kültür & Tarih Transfer',
  ]);

  // Sync categories from loaded blog posts (Supabase'den gelen gerçek kategoriler)
  React.useEffect(() => {
    if (blogPostsProp.length > 0) {
      const fromPosts = [...new Set(blogPostsProp.map(p => p.category).filter(Boolean))];
      setBlogCategories(prev => [...new Set([...prev, ...fromPosts])]);
    }
  }, [blogPostsProp]);
  // Hero Images State
  const [selectedHeroImages, setSelectedHeroImages] = useState<number[]>([]);
  const heroBackgrounds = editContent.hero?.backgrounds || [];
  const updateHeroBackgrounds = (newBackgrounds: string[]) => {
    setEditContent({ ...editContent, hero: { ...editContent.hero, backgrounds: newBackgrounds } });
  };

  useEffect(() => { setSelectedHeroImages([]); }, [heroBackgrounds.length]);

  // Review States — Supabase-backed via props
  const userReviews = userReviewsProp;
  const setUserReviews = async (reviews: UserReview[] | ((prev: UserReview[]) => UserReview[])) => {
    const next = typeof reviews === 'function' ? reviews(userReviewsProp) : reviews;
    const removed = userReviewsProp.filter(r => !next.find(n => n.id === r.id));
    const changed = next.filter(r => {
      const existing = userReviewsProp.find(e => e.id === r.id);
      return existing && existing.status !== r.status;
    });
    try {
      const results = await Promise.allSettled([
        ...changed.map(r => onUpdateReviewStatus(r.id, r.status)),
        ...removed.map(r => onDeleteReview(r.id))
      ]);
      const failures = results.filter(r => r.status === 'rejected');
      if (failures.length > 0) {
        const firstError = (failures[0] as PromiseRejectedResult).reason;
        console.error('Some review operations failed:', failures);
        showToast(`${failures.length} işlem başarısız oldu: ${firstError.message || 'Bilinmeyen hata'}`, 'error');
      } else if (results.length > 0) {
        showToast('Yorumlar başarıyla güncellendi', 'success');
      }
    } catch (error: any) {
      console.error('Review operation failed:', error);
      showToast(error.message || 'Yorum güncellenirken hata oluştu', 'error');
    }
  };
  const [siteReviews, _setSiteReviews] = useState<never[]>([]);
  const [editableReviewsTab, setEditableReviewsTab] = useState<'pending' | 'approved' | 'rejected' | 'deleted'>('pending');


  // Vehicle Drawer State
  const VEHICLE_FEATURES = ['Ücretsiz Wifi', 'Klima', 'Deri Koltuk', 'Buzdolabı', 'TV Ünitesi', 'Araç İçi İkram', 'USB Şarj', 'Özel Şoför', 'TÜRSAB Sigorta'];
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleForm, setVehicleForm] = useState<Partial<Vehicle>>({
    id: '', name: '', category: 'VIP', capacity: 4, luggage: 4, image: '', features: []
  });
  const [vehicleTab, setVehicleTab] = useState<'info' | 'features' | 'media'>('info');

  const [faqFilter, setFaqFilter] = useState<'all' | 'answered' | 'unanswered'>('all');

  // Drag & Drop State
  const [_draggedItem, _setDraggedItem] = useState<number | null>(null);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'delete' | 'success' | 'warning' | 'error' | 'info' } | null>(null);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ isOpen: boolean; position: { top: number; left: number }; booking: Booking | null }>({ isOpen: false, position: { top: 0, left: 0 }, booking: null });

  const showToast = (message: string, type: 'delete' | 'success' | 'warning' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };





  // New Booking Form State
  const [newBookingData, setNewBookingData] = useState<Partial<Booking>>({
    customerName: '',
    phone: '',
    pickup: '',
    destination: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    passengers: 1,
    vehicleId: editContent.vehicles[0]?.id || ''
  });

  // Stats calculation
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const activeBookings = bookings.filter(b => b.status !== 'Deleted');
    const totalRevenue = activeBookings.reduce((sum, b) => b.status !== 'Cancelled' ? sum + b.totalPrice : sum, 0);
    const confirmed = activeBookings.filter(b => b.status === 'Confirmed').length;
    const pending = activeBookings.filter(b => b.status === 'Pending').length;
    const completed = activeBookings.filter(b => b.status === 'Completed').length;
    const todayBookings = activeBookings.filter(b => b.date === today).length;

    // Real weekly data from bookings
    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const now = new Date();
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      return {
        name: dayNames[d.getDay()],
        v: activeBookings.filter(b => b.createdAt?.startsWith(dateStr)).length
      };
    });

    // Revenue trend: this week vs last week
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(thisWeekStart.getDate() - 7);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const thisWeekRevenue = activeBookings
      .filter(b => new Date(b.createdAt) >= thisWeekStart && b.status !== 'Cancelled')
      .reduce((s, b) => s + b.totalPrice, 0);
    const lastWeekRevenue = activeBookings
      .filter(b => new Date(b.createdAt) >= lastWeekStart && new Date(b.createdAt) < thisWeekStart && b.status !== 'Cancelled')
      .reduce((s, b) => s + b.totalPrice, 0);
    const revenueTrend = lastWeekRevenue > 0 ? ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue * 100) : 0;

    // Popular Areas (Bölgeler)
    const areaCounts: Record<string, number> = {};
    activeBookings.forEach(b => {
      // Split by comma and take the first part to normalize area names (e.g. "Antalya Airport, Terminal 1" -> "Antalya Airport")
      const pickupArea = b.pickup.split(',')[0].trim();
      const destArea = b.destination.split(',')[0].trim();

      areaCounts[pickupArea] = (areaCounts[pickupArea] || 0) + 1;
      areaCounts[destArea] = (areaCounts[destArea] || 0) + 1;
    });

    // Sort and take top 4 areas
    const popularAreas = Object.entries(areaCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({ name, count }));

    // Monthly comparison
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const thisMonthBookings = activeBookings.filter(b => {
      const d = new Date(b.createdAt);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;
    const lastMonthBookings = activeBookings.filter(b => {
      const d = new Date(b.createdAt);
      return d.getMonth() === (thisMonth === 0 ? 11 : thisMonth - 1) && d.getFullYear() === (thisMonth === 0 ? thisYear - 1 : thisYear);
    }).length;
    const monthlyTrend = lastMonthBookings > 0 ? ((thisMonthBookings - lastMonthBookings) / lastMonthBookings * 100) : 0;

    // Returning customer rate
    const phoneCounts: Record<string, number> = {};
    activeBookings.forEach(b => { if (b.phone) phoneCounts[b.phone] = (phoneCounts[b.phone] || 0) + 1; });
    const uniqueCustomers = Object.keys(phoneCounts).length;
    const returningCustomers = Object.values(phoneCounts).filter(c => c > 1).length;
    const returningRate = uniqueCustomers > 0 ? Math.round((returningCustomers / uniqueCustomers) * 100) : 0;

    // Vehicle occupancy rate
    const vehicleOccupancy = editContent.vehicles.map(v => {
      const vBookings = activeBookings.filter(b => b.vehicleId === v.id);
      const avgPassengers = vBookings.length > 0
        ? Math.round(vBookings.reduce((s, b) => s + b.passengers, 0) / vBookings.length * 10) / 10
        : 0;
      return { name: v.name.split(' ').slice(-1)[0], capacity: v.capacity, avg: avgPassengers, pct: v.capacity > 0 ? Math.round((avgPassengers / v.capacity) * 100) : 0 };
    });

    const categoryData = editContent.vehicles.map(v => ({
      name: v.name,
      value: activeBookings.filter(b => b.vehicleId === v.id).length || 0
    }));

    // 30-day booking trend
    const monthlyTrendData = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (29 - i));
      const dateStr = d.toISOString().split('T')[0];
      return {
        day: `${d.getDate()}/${d.getMonth() + 1}`,
        count: activeBookings.filter(b => b.createdAt?.startsWith(dateStr)).length
      };
    });

    // Status distribution
    const statusData = [
      { name: 'Beklemede', value: pending, fill: '#f59e0b' },
      { name: 'Onaylı', value: confirmed, fill: '#3b82f6' },
      { name: 'Tamamlandı', value: completed, fill: '#10b981' },
      { name: 'İptal', value: activeBookings.filter(b => b.status === 'Cancelled').length, fill: '#ef4444' },
      { name: 'Reddedildi', value: activeBookings.filter(b => b.status === 'Rejected').length, fill: '#64748b' },
    ].filter(d => d.value > 0);

    // Vehicle revenue
    const vehicleRevenue = editContent.vehicles.map(v => {
      const revenue = activeBookings.filter(b => b.vehicleId === v.id && b.status === 'Completed').reduce((s, b) => s + b.totalPrice, 0);
      return { name: v.name.split(' ').slice(-1)[0] || v.name, revenue };
    }).filter(v => v.revenue > 0);

    // Country Stats
    const allReviews = [...userReviews, ...siteReviews];
    const countryStats: Record<string, number> = {};
    allReviews.forEach(r => {
      if (r.country) countryStats[r.country] = (countryStats[r.country] || 0) + 1;
    });
    const totalReviews = allReviews.length;
    const topCountries = Object.entries(countryStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count, percent: totalReviews > 0 ? (count / totalReviews) * 100 : 0 }));

    return {
      totalRevenue, confirmed, pending, completed, todayBookings,
      weeklyData, categoryData, topCountries,
      revenueTrend, popularAreas,
      thisMonthBookings, lastMonthBookings, monthlyTrend,
      returningRate, uniqueCustomers, returningCustomers,
      vehicleOccupancy,
      monthlyTrendData, statusData, vehicleRevenue
    };
  }, [bookings, editContent.vehicles, userReviews, siteReviews]);


  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      const key = e.key.toLowerCase();
      if (key === 'd') setActiveView('overview');
      else if (key === 'b') setActiveView('bookings');
      else if (key === 'r') setActiveView('reviews');
      else if (key === 'n') { setActiveView('bookings'); setTimeout(() => setIsAddBookingModalOpen(true), 100); }
      else if (key === 'escape') onExitAdmin();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExitAdmin]);

  // --- Ordering Logic ---
  const moveItem = <T,>(list: T[], index: number, direction: 'up' | 'down'): T[] => {
    const newList = [...list];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return newList;
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    return newList;
  };


  // Auto-save
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  // Ref so the timer closure always reads the LATEST siteContent, not a stale snapshot
  const siteContentRef = useRef(siteContent);
  useEffect(() => { siteContentRef.current = siteContent; }, [siteContent]);

  // Ref to always capture the latest editContent inside the async timer closure
  const editContentRef = useRef(editContent);
  useEffect(() => { editContentRef.current = editContent; }, [editContent]);

  const isSavingRef = useRef(false);
  const hasPendingSaveRef = useRef(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const triggerSave = async () => {
      if (isSavingRef.current) {
        hasPendingSaveRef.current = true;
        return;
      }

      isSavingRef.current = true;
      hasPendingSaveRef.current = false;
      setSaveStatus('saving');

      try {
        // Always read the LATEST editContent and siteContent via refs to avoid stale closures
        const toSave = { ...editContentRef.current, adminAccount: siteContentRef.current.adminAccount };
        await onUpdateSiteContent(toSave);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error: any) {
        setSaveStatus('idle');
        showToast(error.message || 'Kayıt başarısız — internet bağlantınızı kontrol edin', 'error');
      } finally {
        isSavingRef.current = false;
        // If changes happened while we were saving, trigger another save
        if (hasPendingSaveRef.current) {
          triggerSave();
        }
      }
    };

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(triggerSave, 500);

    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editContent]);

  // ── UNDO / REDO ──
  const undoStackRef = useRef<SiteContent[]>([]);
  const redoStackRef = useRef<SiteContent[]>([]);
  const pushUndo = (prev: SiteContent) => {
    undoStackRef.current = [...undoStackRef.current.slice(-19), prev];
    redoStackRef.current = [];
  };
  const handleUndo = () => {
    if (undoStackRef.current.length === 0) return;
    const prev = undoStackRef.current.pop()!;
    redoStackRef.current.push(editContent);
    isFirstRender.current = true;
    setEditContent(prev);
    setTimeout(() => { isFirstRender.current = false; }, 100);
    showToast('Geri alındı', 'success');
  };
  const handleRedo = () => {
    if (redoStackRef.current.length === 0) return;
    const next = redoStackRef.current.pop()!;
    undoStackRef.current.push(editContent);
    isFirstRender.current = true;
    setEditContent(next);
    setTimeout(() => { isFirstRender.current = false; }, 100);
    showToast('Yeniden yapıldı', 'success');
  };
  // Wrap setEditContent to auto-push undo
  const updateContent = (newContent: SiteContent) => {
    pushUndo(editContent);
    setEditContent(newContent);
  };

  // ── PULL TO REFRESH ──
  const mainRef = useRef<HTMLElement>(null);
  const handlePullRefresh = useCallback(() => {
    haptic.success();
    // Simulate data refresh
    showToast('Veriler güncellendi', 'success');
  }, []);
  const { pullDistance, isRefreshing, handlers: pullHandlers } = usePullToRefresh(handlePullRefresh, mainRef);

  // ── COMMAND PALETTE ──
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const commandInputRef = useRef<HTMLInputElement>(null);

  const commandItems = useMemo(() => {
    const pages = Object.entries(VIEW_LABELS).map(([id, v]) => ({ id, type: 'page' as const, ...v }));
    const actions = [
      { id: 'action-new-booking', type: 'action' as const, label: 'Yeni Rezervasyon', icon: 'fa-plus', description: 'Yeni rezervasyon ekle' },
      { id: 'action-new-blog', type: 'action' as const, label: 'Yeni Blog Yazısı', icon: 'fa-pen', description: 'Yeni blog oluştur' },
      { id: 'action-new-faq', type: 'action' as const, label: 'Yeni S.S.S', icon: 'fa-circle-question', description: 'Yeni soru ekle' },
      { id: 'action-undo', type: 'action' as const, label: 'Geri Al', icon: 'fa-rotate-left', description: 'Son değişikliği geri al' },
      { id: 'action-redo', type: 'action' as const, label: 'Yeniden Yap', icon: 'fa-rotate-right', description: 'Geri alınanı tekrar uygula' },
    ];
    const all = [...pages, ...actions];
    if (!commandSearch.trim()) return all;
    const q = commandSearch.toLowerCase();
    return all.filter(i => i.label.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
  }, [commandSearch]);

  const handleCommandSelect = (item: typeof commandItems[0]) => {
    setIsCommandPaletteOpen(false);
    setCommandSearch('');
    if (item.type === 'page') {
      setActiveView(item.id as DashboardView);
    } else if (item.id === 'action-new-booking') {
      setIsAddBookingModalOpen(true);
    } else if (item.id === 'action-new-blog') {
      setIsAddBlogModalOpen(true);
    } else if (item.id === 'action-new-faq') {
      const newId = Date.now().toString();
      updateContent({ ...editContent, faq: [...editContent.faq, { id: newId, q: 'Yeni Soru', a: '' }] });
      setActiveView('faq' as DashboardView);
    } else if (item.id === 'action-undo') {
      handleUndo();
    } else if (item.id === 'action-redo') {
      handleRedo();
    }
  };

  // ── ACCOUNT SETTINGS STATE ──
  const [accountForm, setAccountForm] = useState<AdminAccountForm>(() => {
    const saved = siteContent.adminAccount;
    return {
      fullName: saved?.fullName ?? INITIAL_SITE_CONTENT.adminAccount!.fullName,
      email: saved?.email ?? INITIAL_SITE_CONTENT.adminAccount!.email,
      phone: saved?.phone ?? INITIAL_SITE_CONTENT.adminAccount!.phone,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      notifyEmail: saved?.notifyEmail ?? true,
      notifySms: saved?.notifySms ?? false,
      notifySystem: saved?.notifySystem ?? true,
      twoFa: saved?.twoFa ?? false,
    };
  });

  useEffect(() => {
    const saved = siteContent.adminAccount;
    if (!saved) return;
    setAccountForm(prev => ({
      ...prev,
      fullName: saved.fullName ?? prev.fullName,
      email: saved.email ?? prev.email,
      phone: saved.phone ?? prev.phone,
      notifyEmail: saved.notifyEmail ?? prev.notifyEmail,
      notifySms: saved.notifySms ?? prev.notifySms,
      notifySystem: saved.notifySystem ?? prev.notifySystem,
      twoFa: saved.twoFa ?? prev.twoFa,
    }));
  // Use individual primitive fields as deps (not the object ref) to reliably detect changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    siteContent.adminAccount?.fullName,
    siteContent.adminAccount?.email,
    siteContent.adminAccount?.phone,
    siteContent.adminAccount?.notifyEmail,
    siteContent.adminAccount?.notifySms,
    siteContent.adminAccount?.notifySystem,
    siteContent.adminAccount?.twoFa,
  ]);


  const handleUpdatePassword = async (currentPassword: string, newPassword: string): Promise<{ error: string | null }> => {
    if (isSupabaseConfigured) {
      // Re-authenticate with current password to verify it and ensure an active session exists
      const email = siteContent.adminAccount?.email || accountForm.email;
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
      if (signInError) return { error: 'Mevcut şifre yanlış' };
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error: error.message };
    }

    return { error: null };
  };

  // ── SKELETON LOADING ──
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const prevViewRef = useRef(activeView);
  useEffect(() => {
    if (prevViewRef.current !== activeView) {
      setIsPageTransitioning(true);
      const t = setTimeout(() => setIsPageTransitioning(false), 400);
      prevViewRef.current = activeView;
      return () => clearTimeout(t);
    }
  }, [activeView]);

  // ── KEYBOARD SHORTCUTS ──
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable;

      // ⌘K / Ctrl+K — Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }
      // Ctrl+Z — Undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        if (!isInput) { e.preventDefault(); handleUndo(); return; }
      }
      // Ctrl+Shift+Z — Redo
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        if (!isInput) { e.preventDefault(); handleRedo(); return; }
      }
      // Escape — Close overlays
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) { setIsCommandPaletteOpen(false); return; }
        if (showShortcutsHelp) { setShowShortcutsHelp(false); return; }
      }

      if (isInput) return; // Skip shortcuts when typing

      // ? — Show shortcuts help
      if (e.key === '?') { e.preventDefault(); setShowShortcutsHelp(prev => !prev); return; }
      // N — New item (context-aware)
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (activeView === 'bookings') setIsAddBookingModalOpen(true);
        else if (activeView === 'blog') setIsAddBlogModalOpen(true);
        else if (activeView === 'faq') {
          const newId = Date.now().toString();
          updateContent({ ...editContent, faq: [...editContent.faq, { id: newId, q: 'Yeni Soru', a: '' }] });
        }
        return;
      }
      // 1-9 — Navigate to pages
      const navKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
      const navViews = ['overview', 'bookings', 'blog', 'reviews', 'hero-images', 'site-settings', 'regions', 'fleet'];
      const keyIdx = navKeys.indexOf(e.key);
      if (keyIdx !== -1 && navViews[keyIdx]) {
        e.preventDefault();
        setActiveView(navViews[keyIdx] as DashboardView);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, editContent, isCommandPaletteOpen, showShortcutsHelp]); // handleRedo/handleUndo/updateContent are stable inline fns

  // Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  /* ----------------------------------------------------------------------------------
   * STATE: Weather & Currency
   * ---------------------------------------------------------------------------------- */
  const [weather, setWeather] = useState<{ temp: number; icon: string } | null>(null);
  const [rates, setRates] = useState<{ usd: number; eur: number }>({ usd: 0, eur: 0 });
  const [userIp, setUserIp] = useState<string>('');

  useEffect(() => {
    // 1. Weather Fetch — Open-Meteo (free, CORS-friendly, no API key)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=36.9&longitude=30.71&current=temperature_2m,weather_code&timezone=Europe/Istanbul')
      .then((res) => res.json())
      .then((data) => {
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        setWeather({ temp, icon: String(code) });
      })
      .catch((err) => console.error('Weather fetch error:', err));

    // 2. Currency Fetch
    const fetchRates = async () => {
      try {
        const [usdRes, eurRes] = await Promise.all([
          fetch('https://api.frankfurter.app/latest?from=USD&to=TRY'),
          fetch('https://api.frankfurter.app/latest?from=EUR&to=TRY')
        ]);
        const usdData = await usdRes.json();
        const eurData = await eurRes.json();
        setRates({ usd: usdData.rates.TRY, eur: eurData.rates.TRY });
      } catch (e) {
        console.error('Currency fetch error:', e);
      }
    };
    fetchRates();

    // 3. IP Fetch
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setUserIp(data.ip))
      .catch(err => console.error('IP fetch error:', err));
  }, []);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // Normalize customer name - remove newlines and extra spaces
    const normalizedBooking = {
      ...newBookingData,
      customerName: newBookingData.customerName?.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim() || ''
    };
    onAddBooking(normalizedBooking);
    setIsAddBookingModalOpen(false);
    // Reset form
    setNewBookingData({
      customerName: '',
      phone: '',
      pickup: siteContent.regions[0]?.name || 'Antalya Havalimanı',
      destination: siteContent.regions[1]?.name || '',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
      passengers: 1,
      vehicleId: editContent.vehicles[0]?.id || ''
    });
  };

  const _COLORS = ['#c5a059', '#0f172a', '#64748b', '#2563eb', '#10b981'];

  // Time-based greeting
  const getGreeting = () => {
    const h = currentTime.getHours();
    if (h < 6) return { text: 'İyi Geceler', emoji: '🌙' };
    if (h < 12) return { text: 'Günaydın', emoji: '☀️' };
    if (h < 18) return { text: 'İyi Günler', emoji: '🌤️' };
    return { text: 'İyi Akşamlar', emoji: '🌆' };
  };
  const greeting = getGreeting();

  // Notification badge counts
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const pendingReviews = userReviews.filter(r => r.status === 'pending').length;

  return (
    <div data-admin-theme={isDarkTheme ? 'dark' : 'light'} className="flex h-screen overflow-hidden relative bg-[#06080F] text-slate-200 selection:bg-[var(--color-primary)] selection:text-white">
      {/* 2026 SaaS Static Premium Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Deep Ambient Base Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#111827_0%,#06080F_100%)]"></div>
        {/* Static Subtle Color Accents */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent"></div>
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-3xl transform-gpu opacity-50"></div>
        {/* Subtle Noise Texture Overlay (Static) */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      {/* Toast — Apple top-center notification */}
      {toast && (
        <div role="alert" aria-live="polite" className="fixed top-0 inset-x-0 z-[300] flex justify-center pointer-events-none">
          <div
            className="pointer-events-auto animate-in slide-in-from-top-full fade-in duration-500 w-full sm:w-auto sm:min-w-[320px] sm:max-w-[460px]"
            style={{ animationTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
          >
            <div className={`relative flex items-center gap-3 px-4 py-3.5 backdrop-blur-3xl transform-gpu overflow-hidden rounded-b-2xl border-x border-b shadow-[0_16px_48px_rgba(0,0,0,0.55)] ${
              ['delete', 'error'].includes(toast.type)
                ? 'bg-[#120a0a]/97 border-red-500/15'
                : toast.type === 'success'
                ? 'bg-[#080f0d]/97 border-emerald-500/15'
                : toast.type === 'info'
                ? 'bg-[#080d14]/97 border-blue-500/15'
                : 'bg-[#100d06]/97 border-amber-500/15'
            }`}>
              {/* Icon */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                ['delete', 'error'].includes(toast.type) ? 'bg-red-500/15 text-red-400'
                : toast.type === 'success' ? 'bg-emerald-500/15 text-emerald-400'
                : toast.type === 'info' ? 'bg-blue-500/15 text-blue-400'
                : 'bg-amber-500/15 text-amber-400'
              }`}>
                <i className={`fa-solid ${toast.type === 'delete' ? 'fa-trash' : toast.type === 'error' ? 'fa-circle-xmark' : toast.type === 'success' ? 'fa-circle-check' : toast.type === 'info' ? 'fa-circle-info' : 'fa-triangle-exclamation'} text-xs`}></i>
              </div>
              {/* Message */}
              <p className="flex-1 text-[13px] font-semibold text-white leading-tight">{toast.message}</p>
              {/* Close */}
              <button onClick={() => setToast(null)} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 transition-colors shrink-0">
                <i className="fa-solid fa-xmark text-[10px]"></i>
              </button>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px]">
                <div className={`h-full ${['delete','error'].includes(toast.type) ? 'bg-red-500/40' : toast.type === 'success' ? 'bg-emerald-500/40' : toast.type === 'info' ? 'bg-blue-500/40' : 'bg-amber-500/40'}`}
                  style={{ animation: 'toast-progress 3s linear forwards' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Booking Details - Sidebar Drawer */}
      {selectedBookingForView && (
  <div className="fixed inset-0 z-[210]">
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={() => setSelectedBookingForView(null)}
    />

    <div className="absolute right-0 top-0 h-full w-full max-w-[480px] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">

      {/* Status Color Banner Header */}
      {(() => {
        const s = selectedBookingForView.status;
        const bannerMap: Record<string, { bg: string; text: string; label: string; icon: string }> = {
          Pending:   { bg: 'from-amber-500/20 to-amber-900/10 border-amber-500/30',   text: 'text-amber-300',   label: 'BEKLEMEDEKİ',   icon: 'fa-clock' },
          Confirmed: { bg: 'from-blue-500/20 to-blue-900/10 border-blue-500/30',       text: 'text-blue-300',    label: 'ONAYLANMIŞ',     icon: 'fa-circle-check' },
          Completed: { bg: 'from-emerald-500/20 to-emerald-900/10 border-emerald-500/30', text: 'text-emerald-300', label: 'TAMAMLANMIŞ', icon: 'fa-flag-checkered' },
          Cancelled: { bg: 'from-red-500/20 to-red-900/10 border-red-500/30',           text: 'text-red-300',     label: 'İPTAL EDİLMİŞ',  icon: 'fa-ban' },
          Rejected:  { bg: 'from-slate-500/20 to-slate-900/10 border-slate-500/30',     text: 'text-slate-300',   label: 'REDDEDİLMİŞ',    icon: 'fa-xmark-circle' },
        };
        const bm = bannerMap[s] || bannerMap['Pending'];
        return (
          <div className={`bg-gradient-to-r ${bm.bg} border-b px-6 py-4 flex items-center justify-between shrink-0 bg-slate-900`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center ${bm.text}`}>
                <i className={`fa-solid ${bm.icon} text-base`}></i>
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${bm.text} opacity-80`}>Rezervasyon Durumu</p>
                <p className={`text-sm font-black ${bm.text}`}>{bm.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right mr-2">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">REF</p>
                <p className="text-[10px] font-mono text-slate-400">#{selectedBookingForView.id.slice(-8).toUpperCase()}</p>
              </div>
              <button
                onClick={() => setSelectedBookingForView(null)}
                className="w-9 h-9 rounded-xl bg-black/20 hover:bg-black/40 text-slate-400 hover:text-white transition-all flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark text-base"></i>
              </button>
            </div>
          </div>
        );
      })()}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-y-contain bg-gradient-to-b from-slate-900 to-slate-950">

        {/* Price Hero */}
        <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Toplam Tutar</p>
            <p className="text-4xl font-black text-[var(--color-primary)] leading-none">{siteContent.currency?.symbol || '€'}{selectedBookingForView.totalPrice}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Kayıt Tarihi</p>
            <p className="text-xs font-bold text-slate-300">{new Date(selectedBookingForView.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            <p className="text-[10px] text-slate-500">{new Date(selectedBookingForView.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>

        <div className="p-5 space-y-4">

          {/* Customer Card */}
          <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03]">
            <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center gap-2">
              <i className="fa-solid fa-user-tie text-blue-400 text-[11px]"></i>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Müşteri</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <span className="text-lg font-black text-blue-300">{selectedBookingForView.customerName.replace(/[\n\r]+/g, ' ').trim().charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-base font-black text-white leading-tight">{selectedBookingForView.customerName.replace(/[\n\r]+/g, ' ').trim()}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Yolcu Sayısı: <span className="text-slate-300 font-bold">{selectedBookingForView.passengers} kişi</span></p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                      <i className="fa-solid fa-phone text-emerald-400 text-[10px]"></i>
                    </div>
                    <span className="text-sm font-bold text-white">{selectedBookingForView.phone}</span>
                  </div>
                  <a
                    href={`https://wa.me/${selectedBookingForView.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Merhaba ${selectedBookingForView.customerName.replace(/[\n\r]+/g, ' ').trim()}, ${siteContent.business.name} rezervasyonunuz onaylandı.\n📅 ${selectedBookingForView.date} ${selectedBookingForView.time}\n📍 ${selectedBookingForView.pickup} → ${selectedBookingForView.destination}`)}`}
                    target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[11px] font-black hover:bg-emerald-500/30 transition-all">
                    <i className="fa-brands fa-whatsapp"></i> WhatsApp
                  </a>
                </div>
                {selectedBookingForView.email && (
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
                        <i className="fa-solid fa-envelope text-blue-400 text-[10px]"></i>
                      </div>
                      <span className="text-xs font-bold text-white truncate max-w-[140px]">{selectedBookingForView.email}</span>
                    </div>
                    <a
                      href={`mailto:${selectedBookingForView.email}?subject=${encodeURIComponent(`Rezervasyon Onayı - ${siteContent.business.name}`)}&body=${encodeURIComponent(`Sayın ${selectedBookingForView.customerName.replace(/[\n\r]+/g, ' ').trim()},\n\nRezervasyon bilgileriniz:\nTarih: ${selectedBookingForView.date} ${selectedBookingForView.time}\nKalkış: ${selectedBookingForView.pickup}\nVarış: ${selectedBookingForView.destination}\n\n${siteContent.business.name}`)}`}
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/20 text-[11px] font-black hover:bg-blue-500/30 transition-all">
                      <i className="fa-solid fa-paper-plane text-[10px]"></i> E-posta
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Route Card */}
          <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03]">
            <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center gap-2">
              <i className="fa-solid fa-route text-emerald-400 text-[11px]"></i>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Güzergah</span>
            </div>
            <div className="p-4">
              <div className="flex items-stretch gap-3">
                <div className="flex flex-col items-center gap-1 pt-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                  <div className="flex-1 w-[2px] bg-gradient-to-b from-emerald-400/50 to-[var(--color-primary)]/50 min-h-[28px]"></div>
                  <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_rgba(197,160,89,0.5)]"></div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Alış Noktası</p>
                    <p className="text-sm font-bold text-white leading-tight">{selectedBookingForView.pickup}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10">
                    <p className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-widest mb-1">Varış Noktası</p>
                    <p className="text-sm font-bold text-white leading-tight">{selectedBookingForView.destination}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date, Time & Vehicle Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-calendar-days text-purple-400 text-xs"></i>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tarih</span>
              </div>
              <p className="text-base font-black text-white">{selectedBookingForView.date.split('-').reverse().join('.')}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-clock text-amber-400 text-xs"></i>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Saat</span>
              </div>
              <p className="text-base font-black text-white">{selectedBookingForView.time}</p>
            </div>
          </div>

          {/* Vehicle */}
          {(() => {
            const vehicle = editContent.vehicles.find(v => v.id === selectedBookingForView.vehicleId);
            return vehicle ? (
              <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03]">
                <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center gap-2">
                  <i className="fa-solid fa-car text-[var(--color-primary)] text-[11px]"></i>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Araç Bilgisi</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-white mb-2">{vehicle.name}</p>
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] font-bold text-slate-300">
                        <i className="fa-solid fa-users text-[var(--color-primary)] text-[9px]"></i>
                        {selectedBookingForView.passengers}/{vehicle.capacity} kişi
                      </span>
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] font-bold text-slate-300">
                        <i className="fa-solid fa-suitcase text-[var(--color-primary)] text-[9px]"></i>
                        Max {vehicle.luggage}
                      </span>
                    </div>
                  </div>
                  <div className="w-16 h-10 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
                    <i className="fa-solid fa-car-side text-[var(--color-primary)] text-xl"></i>
                  </div>
                </div>
              </div>
            ) : null;
          })()}

          {/* Flight Number */}
          {selectedBookingForView.flightNumber && (
            <div className="rounded-2xl border border-sky-500/20 bg-sky-500/[0.06] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-plane text-sky-400 text-sm"></i>
              </div>
              <div>
                <p className="text-[9px] font-black text-sky-400/70 uppercase tracking-widest mb-0.5">Uçuş Numarası</p>
                <p className="text-base font-black text-sky-300 tracking-widest">{selectedBookingForView.flightNumber}</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {selectedBookingForView.notes && (
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03]">
              <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center gap-2">
                <i className="fa-solid fa-note-sticky text-slate-400 text-[11px]"></i>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notlar</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-300 leading-relaxed">{selectedBookingForView.notes}</p>
              </div>
            </div>
          )}

          {/* Status Change - Button Group */}
          <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03]">
            <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center gap-2">
              <i className="fa-solid fa-arrows-rotate text-violet-400 text-[11px]"></i>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Durum Güncelle</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {[
                { value: 'Confirmed', label: 'ONAYLA', icon: 'fa-circle-check', style: 'bg-blue-500/15 border-blue-500/30 text-blue-300 hover:bg-blue-500 hover:text-white hover:border-blue-500' },
                { value: 'Completed', label: 'TAMAMLANDI', icon: 'fa-flag-checkered', style: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500 hover:text-white hover:border-emerald-500' },
                { value: 'Pending', label: 'BEKLEMEYE AL', icon: 'fa-clock', style: 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-white hover:border-amber-500' },
                { value: 'Cancelled', label: 'İPTAL ET', icon: 'fa-ban', style: 'bg-red-500/15 border-red-500/30 text-red-300 hover:bg-red-500 hover:text-white hover:border-red-500' },
              ].map(btn => (
                <button
                  key={btn.value}
                  onClick={() => {
                    onUpdateStatus(selectedBookingForView.id, btn.value as Booking['status']);
                    setSelectedBookingForView({ ...selectedBookingForView, status: btn.value as Booking['status'] });
                  }}
                  disabled={selectedBookingForView.status === btn.value}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-[11px] font-black transition-all ${btn.style} ${selectedBookingForView.status === btn.value ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <i className={`fa-solid ${btn.icon} text-[10px]`}></i>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-950 border-t border-white/10 px-5 py-4 flex items-center justify-between shrink-0">
        <button
          onClick={() => {
            if (window.confirm('Bu rezervasyonu silmek istediğinizden emin misiniz?')) {
              onDeleteBooking(selectedBookingForView.id);
              setSelectedBookingForView(null);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-[11px] font-black transition-all"
        >
          <i className="fa-solid fa-trash text-[10px]"></i>
          SİL
        </button>
        <button
          onClick={() => setSelectedBookingForView(null)}
          className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 text-[11px] font-black transition-all"
        >
          KAPAT
        </button>
      </div>
    </div>
  </div>
)}

      {/* Add Booking Modal */}
      {
        isAddBookingModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddBookingModalOpen(false)}></div>
            <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900">Yeni Rezervasyon Ekle</h3>
                <button onClick={() => setIsAddBookingModalOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-50 text-slate-400">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <form onSubmit={handleCreateBooking} className="p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Müşteri Adı</label>
                    <input required className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold" value={newBookingData.customerName} onChange={e => setNewBookingData({ ...newBookingData, customerName: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telefon</label>
                    <input required className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold" value={newBookingData.phone} onChange={e => setNewBookingData({ ...newBookingData, phone: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nereden</label>
                    <select className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold" value={newBookingData.pickup} onChange={e => setNewBookingData({ ...newBookingData, pickup: e.target.value })}>
                      <option value="Antalya Havalimanı (AYT)">Antalya Havalimanı (AYT)</option>
                      {editContent.regions.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nereye</label>
                    <select className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold" value={newBookingData.destination} onChange={e => setNewBookingData({ ...newBookingData, destination: e.target.value })}>
                      <option value="Antalya Havalimanı (AYT)">Antalya Havalimanı (AYT)</option>
                      {editContent.regions.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarih</label>
                    <input type="date" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold" value={newBookingData.date} onChange={e => setNewBookingData({ ...newBookingData, date: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saat</label>
                    <input type="time" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold" value={newBookingData.time} onChange={e => setNewBookingData({ ...newBookingData, time: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kişi</label>
                    <input type="number" className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold" value={newBookingData.passengers} onChange={e => setNewBookingData({ ...newBookingData, passengers: parseInt(e.target.value) })} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Araç Seçimi</label>
                  <select className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold" value={newBookingData.vehicleId} onChange={e => setNewBookingData({ ...newBookingData, vehicleId: e.target.value })}>
                    {editContent.vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full bg-[var(--color-primary)] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-gold/20 hover:bg-[#b08d4a] transition-all mt-4">Rezervasyonu Kaydet</button>
              </form>
            </div>
          </div>
        )
      }


      {/* Sidebar — Elite Luxury Design */}
      <aside
        className={`hidden xl:flex ${isSidebarOpen ? 'w-[280px]' : 'w-[84px]'} transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] relative flex-col z-[100] h-screen shrink-0 backdrop-blur-2xl transform-gpu`}
        style={{ 
          background: 'rgba(2, 6, 23, 0.45)', 
          borderRight: '1px solid rgba(255,255,255,0.06)', 
          boxShadow: '20px 0 80px -20px rgba(0,0,0,0.5)' 
        }}
      >
        {/* Top Accent Glow */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[var(--color-primary)]/[0.08] via-transparent to-transparent pointer-events-none z-0" />

        {/* ── BRAND HEADER ── */}
        <div className={`h-24 flex items-center shrink-0 border-b border-white/[0.04] relative z-10 overflow-hidden transition-all duration-500 ${isSidebarOpen ? 'px-6 gap-4' : 'justify-center px-0'}`}>
          <div className="relative shrink-0 group/logo">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[#d4a832] p-[1px] shadow-[0_8px_30px_rgba(197,160,89,0.35)] transition-transform duration-500 group-hover/logo:scale-110">
              <div className="w-full h-full rounded-[15px] bg-[#020617] flex items-center justify-center">
                <i className="fa-solid fa-crown text-[var(--color-primary)] text-lg drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]"></i>
              </div>
            </div>
            {!isSidebarOpen && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#020617] shadow-lg"></div>
            )}
          </div>
          
          {isSidebarOpen && (
            <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex items-center gap-2">
                <span className="font-outfit text-[14px] font-[900] text-white tracking-[0.18em] leading-none uppercase">ELITE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_rgba(197,160,89,1)]"></span>
              </div>
              <p className="font-outfit text-[9px] font-[700] text-slate-500 tracking-[0.4em] uppercase mt-1.5 opacity-80">CONTROL PANEL</p>
            </div>
          )}

          {isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="w-8 h-8 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] flex items-center justify-center text-slate-500 hover:text-white transition-all group/toggle"
            >
              <i className="fa-solid fa-indent text-[10px] group-hover:-translate-x-0.5 transition-transform"></i>
            </button>
          )}
        </div>

        {/* ── EXPAND TOGGLE (Collapsed Mode) ── */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="absolute -right-3 top-28 w-6 h-12 bg-[var(--color-primary)] hover:bg-[#d4a832] rounded-full flex items-center justify-center text-[#06080F] shadow-[0_0_20px_rgba(197,160,89,0.4)] text-[10px] transition-all z-[60] group/expand"
          >
            <i className="fa-solid fa-chevron-right text-[9px] group-hover:translate-x-0.5 transition-transform"></i>
          </button>
        )}

        {/* ── NAVIGATION ── */}
        <nav className="flex-1 flex flex-col py-6 overflow-y-auto scrollbar-hide relative z-10 px-3">
          <div className="space-y-8">
            {/* Primary Modules */}
            <div>
              <SidebarGroupLabel label="Operasyon" isSidebarOpen={isSidebarOpen} />
              <div className="space-y-1">
                <SidebarNavItem id="overview" label="Dashboard" activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} icon={<i className="fa-solid fa-grid-2"></i>} />
                <SidebarNavItem id="bookings" label="Rezervasyonlar" badge={pendingCount} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} icon={<i className="fa-solid fa-calendar-clock"></i>} />
                <SidebarNavItem id="reviews" label="Yorumlar" badge={pendingReviews} activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} icon={<i className="fa-solid fa-star"></i>} />
              </div>
            </div>

            {/* Content & Design */}
            <div>
              <SidebarGroupLabel label="İçerik & Katalog" isSidebarOpen={isSidebarOpen} />
              <div className="space-y-1">
                <SidebarNavItem id="blog" label="Blog Yönetimi" activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} icon={<i className="fa-solid fa-pen-nib"></i>} />
                <SidebarNavItem id="regions" label="Bölge & Fiyat" activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} icon={<i className="fa-solid fa-map-location-dot"></i>} />
                <SidebarNavItem id="fleet" label="Araçlar" activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} icon={<i className="fa-solid fa-car-rear"></i>} />
              </div>
            </div>

            {/* Site Management */}
            <div>
              <SidebarGroupLabel label="Site Yönetimi" isSidebarOpen={isSidebarOpen} />
              <div className="space-y-1">
                <SidebarNavItem id="hero-images" label="Anasayfa Banner" activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} icon={<i className="fa-solid fa-images"></i>} />
                <SidebarNavItem id="site-settings" label="Menü Yönetimi" activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} icon={<i className="fa-solid fa-sliders"></i>} />
                <SidebarNavItem id="faq" label="S.S.S" activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} icon={<i className="fa-solid fa-circle-question"></i>} />
                
                {/* Corporate Sub-menu */}
                <div className="relative group">
                  <button
                    onClick={() => { if (!isSidebarOpen) setIsSidebarOpen(true); setIsCorporateOpen(!isCorporateOpen); if (!isCorporateOpen) setActiveView('about'); }}
                    className={`w-full rounded-xl flex items-center transition-all duration-300 relative ${
                      isSidebarOpen
                        ? `px-3 py-2.5 gap-3 ${(activeView === 'about' || activeView === 'visionMission') ? 'bg-gradient-to-r from-[var(--color-primary)]/[0.15] via-[var(--color-primary)]/[0.05] to-transparent' : 'hover:bg-white/[0.06]'}`
                        : `justify-center p-2.5 ${(activeView === 'about' || activeView === 'visionMission') ? 'bg-[var(--color-primary)]/[0.18]' : 'hover:bg-white/[0.06]'}`
                    }`}
                  >
                    {(activeView === 'about' || activeView === 'visionMission') && isSidebarOpen && (
                      <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] bg-gradient-to-b from-[var(--color-primary)] to-[#d4a832] rounded-r-full shadow-[0_0_15px_rgba(197,160,89,0.7)]" />
                    )}
                    <div className={`shrink-0 transition-all duration-300 ${(activeView === 'about' || activeView === 'visionMission') ? 'text-[var(--color-primary)] drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]' : 'text-slate-500 group-hover:text-slate-300'}`}>
                      <i className="fa-solid fa-building-columns"></i>
                    </div>
                    {isSidebarOpen && (
                      <>
                        <span className={`text-[12.5px] font-[600] whitespace-nowrap truncate flex-1 text-left tracking-wide transition-colors ${(activeView === 'about' || activeView === 'visionMission') ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>Kurumsal</span>
                        <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${isCorporateOpen ? 'rotate-180 text-[var(--color-primary)]' : 'text-slate-600'}`}></i>
                      </>
                    )}
                  </button>
                  {isSidebarOpen && isCorporateOpen && (
                    <div className="mt-1 space-y-1 pl-9 pr-1 animate-in fade-in slide-in-from-top-2 duration-300">
                      {[{ id: 'about', label: 'Hakkımızda' }, { id: 'visionMission', label: 'Vizyon & Misyon' }].map(s => (
                        <button key={s.id} onClick={() => setActiveView(s.id as DashboardView)} className={`w-full text-left py-2 px-3 rounded-lg text-[11px] font-bold tracking-wide transition-all duration-200 flex items-center gap-2 ${activeView === s.id ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                          <span className={`w-1 h-1 rounded-full shrink-0 ${activeView === s.id ? 'bg-[var(--color-primary)] shadow-[0_0_5px_rgba(197,160,89,1)]' : 'bg-slate-700'}`}></span>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {!isSidebarOpen && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 pointer-events-none opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 z-[100]">
                      <div className="relative px-4 py-2.5 rounded-xl bg-[#0a0e1a] backdrop-blur-3xl transform-gpu border border-white/[0.1] shadow-2xl shadow-black/70 whitespace-nowrap">
                        <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] bg-gradient-to-b from-[var(--color-primary)] to-[#d4a832] rounded-r-full" />
                        <span className="text-[13px] font-bold text-white pl-1">Kurumsal</span>
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-[#0a0e1a]" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* ── SIDEBAR FOOTER ── */}
        <div className="shrink-0 border-t border-white/[0.04] p-3 space-y-2 relative z-10 bg-gradient-to-t from-white/[0.02] to-transparent">
          <SidebarNavItem id="business" label="İşletme Ayarları" activeView={activeView} isSidebarOpen={isSidebarOpen} onNavigate={(v) => setActiveView(v as DashboardView)} icon={<i className="fa-solid fa-briefcase"></i>} />
          
          <div className={`flex items-center gap-1.5 p-1 ${isSidebarOpen ? '' : 'flex-col'}`}>
            <a href="/" target="_blank" rel="noopener noreferrer" title="Siteyi Görüntüle" className={`flex items-center justify-center gap-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.05] transition-all group ${isSidebarOpen ? 'flex-1 py-2.5 bg-white/[0.02] border border-white/[0.05]' : 'w-10 h-10'}`}>
              <i className="fa-solid fa-arrow-up-right-from-square text-[11px] group-hover:text-[var(--color-primary)] transition-colors"></i>
              {isSidebarOpen && <span className="text-[11px] font-bold">Siteyi Gör</span>}
            </a>
            <button onClick={toggleTheme} title={isDarkTheme ? 'Açık Tema' : 'Koyu Tema'} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-[var(--color-primary)] hover:bg-white/[0.05] transition-all shrink-0">
              <i className={`fa-solid ${isDarkTheme ? 'fa-sun' : 'fa-moon'} text-xs`}></i>
            </button>
            <button onClick={onExitAdmin} title="Çıkış" className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-all shrink-0">
              <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav
        className="xl:hidden fixed bottom-0 left-0 right-0 z-[60] safe-area-bottom"
        style={{ background: 'rgba(6, 8, 15, 0.85)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex items-center justify-around h-[60px] px-1">
          {[
            { id: 'overview', label: 'Panel', icon: 'fa-chart-pie', badge: 0 },
            { id: 'bookings', label: 'Rez.', icon: 'fa-calendar-check', badge: pendingCount },
            { id: 'reviews', label: 'Yorum', icon: 'fa-star', badge: pendingReviews },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveView(tab.id as DashboardView); setIsMobileMenuOpen(false); }}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all relative ${activeView === tab.id && !isMobileMenuOpen ? 'text-[var(--color-primary)]' : 'text-slate-600 active:text-slate-400'}`}
            >
              {activeView === tab.id && !isMobileMenuOpen && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[var(--color-primary)] rounded-full shadow-[0_0_8px_rgba(197,160,89,0.5)]" />
              )}
              <div className="relative">
                <i className={`fa-solid ${tab.icon} text-[16px]`}></i>
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-[14px] h-[14px] flex items-center justify-center text-[7px] font-black rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-bold tracking-wide">{tab.label}</span>
            </button>
          ))}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-all relative ${isMobileMenuOpen ? 'text-[var(--color-primary)]' : 'text-slate-600 active:text-slate-400'}`}
          >
            {isMobileMenuOpen && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[var(--color-primary)] rounded-full" />}
            {isMobileMenuOpen ? (
              <i className="fa-solid fa-xmark text-[16px] transition-transform duration-200 rotate-90"></i>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="transition-transform duration-200">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
                <rect x="11" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
                <rect x="1" y="11" width="6" height="6" rx="1.5" fill="currentColor" />
                <rect x="11" y="11" width="6" height="6" rx="1.5" fill="currentColor" />
              </svg>
            )}
            <span className="text-[9px] font-bold tracking-wide">{isMobileMenuOpen ? 'Kapat' : 'Menü'}</span>
          </button>
        </div>

        {isMobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[-1]" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="absolute bottom-full left-0 right-0 rounded-t-[28px] p-5 pt-3 animate-in slide-in-from-bottom-4 duration-300 shadow-2xl max-h-[75vh] overflow-y-auto scrollbar-hide border-t border-white/[0.06]"
              style={{ background: 'rgba(6, 8, 15, 0.95)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}>
              <div className="w-9 h-1 rounded-full bg-white/15 mx-auto mb-4" />

              <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.15em] px-1 mb-2">Ana Modüller</p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                    {([
                      { id: 'overview', label: 'Dashboard', icon: 'fa-chart-pie', color: 'text-blue-400' },
                      { id: 'bookings', label: 'Rezervasyon', icon: 'fa-calendar-check', color: 'text-emerald-400', badge: pendingCount },
                      { id: 'reviews', label: 'Yorumlar', icon: 'fa-star', color: 'text-amber-400', badge: pendingReviews },
                      { id: 'regions', label: 'Bölge & Fiyat', icon: 'fa-map-location-dot', color: 'text-teal-400' },
                    ] as const).map(item => (
                      <button key={item.id} onClick={() => { setActiveView(item.id as DashboardView); setIsMobileMenuOpen(false); }}
                        className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl transition-all active:scale-95 ${activeView === item.id ? 'bg-[var(--color-primary)]/10 ring-1 ring-[var(--color-primary)]/20' : 'bg-white/[0.03]'}`}>
                        <div className="relative">
                          <i className={`fa-solid ${item.icon} ${activeView === item.id ? 'text-[var(--color-primary)]' : item.color} text-[17px]`}></i>
                          {('badge' in item && item.badge > 0) && <span className="absolute -top-1 -right-2.5 w-[13px] h-[13px] flex items-center justify-center text-[7px] font-black rounded-full bg-red-500 text-white">{item.badge}</span>}
                        </div>
                        <span className={`text-[9px] font-bold leading-tight text-center ${activeView === item.id ? 'text-[var(--color-primary)]' : 'text-slate-500'}`}>{item.label}</span>
                      </button>
                    ))}
              </div>

              <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.15em] px-1 mb-2">İçerik Yönetimi</p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { id: 'blog', label: 'Blog', icon: 'fa-newspaper', color: 'text-purple-400' },
                  { id: 'hero-images', label: 'Banner', icon: 'fa-images', color: 'text-pink-400' },
                  { id: 'fleet', label: 'Araçlar', icon: 'fa-car-side', color: 'text-red-400' },
                  { id: 'faq', label: 'S.S.S', icon: 'fa-circle-question', color: 'text-indigo-400' },
                  { id: 'about', label: 'Hakkımızda', icon: 'fa-info-circle', color: 'text-sky-400' },
                  { id: 'visionMission', label: 'Vizyon', icon: 'fa-bullseye', color: 'text-violet-400' },
                  { id: 'site-settings', label: 'Menü', icon: 'fa-bars', color: 'text-cyan-400' },
                ].map(item => (
                  <button key={item.id} onClick={() => { setActiveView(item.id as DashboardView); setIsMobileMenuOpen(false); }}
                    className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl transition-all active:scale-95 ${activeView === item.id ? 'bg-[var(--color-primary)]/10 ring-1 ring-[var(--color-primary)]/20' : 'bg-white/[0.03]'}`}>
                    <i className={`fa-solid ${item.icon} ${activeView === item.id ? 'text-[var(--color-primary)]' : item.color} text-[17px]`}></i>
                    <span className={`text-[9px] font-bold leading-tight text-center ${activeView === item.id ? 'text-[var(--color-primary)]' : 'text-slate-500'}`}>{item.label}</span>
                  </button>
                ))}
              </div>

              <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.15em] px-1 mb-2">Sistem</p>
              <div className="flex gap-2">
                {[
                  { id: 'business', label: 'İşletme Ayarları', icon: 'fa-briefcase' },
                ].map(item => (
                  <button key={item.id} onClick={() => { setActiveView(item.id as DashboardView); setIsMobileMenuOpen(false); }}
                    className={`flex-1 flex items-center gap-2.5 py-3 px-3.5 rounded-2xl transition-all active:scale-[0.97] ${activeView === item.id ? 'bg-[var(--color-primary)]/10 ring-1 ring-[var(--color-primary)]/20' : 'bg-white/[0.03]'}`}>
                    <i className={`fa-solid ${item.icon} ${activeView === item.id ? 'text-[var(--color-primary)]' : 'text-slate-500'} text-sm`}></i>
                    <span className={`text-[11px] font-bold ${activeView === item.id ? 'text-[var(--color-primary)]' : 'text-slate-500'}`}>{item.label}</span>
                  </button>
                ))}
                <a href="/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 py-3 px-3.5 rounded-2xl bg-white/[0.03] transition-all active:scale-[0.97]">
                  <i className="fa-solid fa-arrow-up-right-from-square text-[var(--color-primary)] text-sm"></i>
                  <span className="text-[11px] font-bold text-slate-500">Site</span>
                </a>
              </div>
            </div>
          </>
        )}
      </nav>


      {/* Mobile Spotlight FAB */}
      <MobileSpotlight items={commandItems} onExecute={handleCommandSelect} />

      {/* Global Context Menu */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
        position={contextMenu.position}
        actions={
          contextMenu.booking ? [
            { id: 'view', label: 'Görüntüle', icon: 'fa-eye', color: 'text-slate-400', onClick: () => setSelectedBookingForView(contextMenu.booking) },
            ...(contextMenu.booking.status === 'Pending' ? [
              { id: 'confirm', label: 'Onayla', icon: 'fa-check', color: 'text-emerald-400', onClick: () => onUpdateStatus(contextMenu.booking!.id, 'Confirmed') },
              { id: 'reject', label: 'Reddet', icon: 'fa-xmark', color: 'text-red-400', onClick: () => onUpdateStatus(contextMenu.booking!.id, 'Rejected') },
            ] : []),
            ...(contextMenu.booking.status === 'Confirmed' ? [
              { id: 'complete', label: 'Tamamlandı İşaretle', icon: 'fa-flag-checkered', color: 'text-violet-400', onClick: () => onUpdateStatus(contextMenu.booking!.id, 'Completed') },
            ] : []),
            { id: 'delete', label: 'Sil', icon: 'fa-trash-can', color: '', destructive: true, onClick: () => onDeleteBooking(contextMenu.booking!.id) }
          ] : []
        }
      >
        {/* Render a clone of the item being long-pressed so it visually stays "lifted" in the menu */}
        {contextMenu.booking && (
          <div className="bg-[#1e293b]/95 backdrop-blur-3xl transform-gpu rounded-2xl overflow-hidden border border-white/10 opacity-60">
            <MobileBookingItem booking={contextMenu.booking} onClick={() => { }} onContextMenu={() => { }} isToday={false} />
          </div>
        )}
      </ContextMenu>

      {/* Main Content */}
      {/* Main Content - Scrollable */}
      <main
        ref={mainRef}
        className="flex-1 h-full overflow-y-auto overflow-x-hidden p-4 md:px-8 md:py-4 pb-24 xl:pb-4 scrollbar-thin relative z-10 overscroll-y-contain touch-pan-y"
        {...pullHandlers}
      >
        {/* Pull-to-Refresh Indicator */}
        {(pullDistance > 0 || isRefreshing) && (
          <div
            className="flex items-center justify-center transition-all duration-200 overflow-hidden"
            style={{ height: pullDistance || (isRefreshing ? 48 : 0), opacity: Math.min(1, pullDistance / 60) }}
          >
            <div className={`w-8 h-8 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center ${isRefreshing ? 'animate-spin' : ''}`}>
              {isRefreshing ? (
                <i className="fa-solid fa-circle-notch text-[var(--color-primary)] text-sm"></i>
              ) : (
                <i className={`fa-solid fa-arrow-down text-[var(--color-primary)] text-xs transition-transform ${pullDistance >= 80 ? 'rotate-180' : ''}`}></i>
              )}
            </div>
          </div>
        )}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-50">
          <div className="relative z-10">
            {/* Breadcrumb — Ultra Minimal Elite Style */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <button 
                  onClick={() => setActiveView('overview')} 
                  className={`text-[9px] font-black uppercase tracking-[0.1em] transition-colors ${activeView === 'overview' ? 'text-[var(--color-primary)]' : 'text-slate-500 hover:text-white'}`}
                >
                  Elite Control
                </button>
                {activeView !== 'overview' && (
                  <>
                    <i className="fa-solid fa-chevron-right text-[7px] text-slate-700"></i>
                    <span className="text-[9px] font-black text-[var(--color-primary)] uppercase tracking-[0.1em]">{VIEW_LABELS[activeView]?.label || activeView}</span>
                  </>
                )}
              </div>
              {activeView === 'overview' && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-[0.1em]">Canlı Sistem</span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h1 className={`font-outfit text-[2.25rem] font-[900] tracking-[-0.03em] ${isDarkTheme ? 'text-white' : 'text-slate-900'} leading-none`}>
                {activeView === 'overview' ? 'Dashboard' : (VIEW_LABELS[activeView]?.label || activeView)}
              </h1>
              <p className={`text-[13px] mt-3 ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'} max-w-lg leading-relaxed font-medium opacity-80`}>
                {activeView === 'overview'
                  ? <>{greeting.emoji} {greeting.text}, <span className="text-[var(--color-primary)] font-bold">Yönetici</span>. Bugün için her şey yolunda görünüyor.</>
                  : (VIEW_LABELS[activeView]?.description || 'Operasyonel veriler ve kontrol merkezi.')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10 self-end md:self-center">
            {/* Action Group */}
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-md">
              <button onClick={handleUndo} className="w-9 h-9 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center group" title="Geri Al (⌘Z)">
                <i className="fa-solid fa-rotate-left text-xs group-active:-rotate-45 transition-transform"></i>
              </button>
              <button onClick={handleRedo} className="w-9 h-9 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center group" title="Yeniden Yap (⌘⇧Z)">
                <i className="fa-solid fa-rotate-right text-xs group-active:rotate-45 transition-transform"></i>
              </button>
              
              <div className="w-px h-6 bg-white/[0.08] mx-1"></div>

              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group"
              >
                <i className="fa-solid fa-magnifying-glass text-slate-400 text-xs group-hover:text-[var(--color-primary)] transition-colors"></i>
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors">Komut Ara</span>
                <kbd className="text-[9px] font-black text-slate-600 bg-black/20 px-1.5 py-0.5 rounded border border-white/5">⌘K</kbd>
              </button>
            </div>

            {/* Auto-save & Profile */}
            <div className="flex items-center gap-4 pl-2">
              <div className="flex flex-col items-end">
                {saveStatus === 'saving' ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <i className="fa-solid fa-circle-notch fa-spin text-amber-500 text-[10px]"></i>
                    <span className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest">Saving</span>
                  </div>
                ) : saveStatus === 'saved' ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>
                    <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">Synced</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Auto-Save</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setActiveView('business')}
                className="relative group p-0.5 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[#d4a832] shadow-[0_8px_25px_rgba(197,160,89,0.25)] hover:scale-105 transition-all duration-500"
              >
                <div className="w-11 h-11 rounded-[14px] bg-[#020617] flex items-center justify-center border-2 border-[#020617] overflow-hidden relative">
                  <span className="text-[var(--color-primary)] font-black text-base drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]">
                    {(accountForm.fullName || 'A').charAt(0).toUpperCase()}
                  </span>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors"></div>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Skeleton Loading */}
        {isPageTransitioning && (
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-2xl admin-skeleton" />)}
            </div>
            <div className="h-12 rounded-2xl admin-skeleton" />
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-2xl admin-skeleton" />)}
            </div>
          </div>
        )}

        {activeView === 'overview' && (
          <div className="space-y-5">

            {/* Live Status Bar */}
            {(() => {
              const wCode = parseInt(weather?.icon || '0');
              const weatherIcon = wCode === 0 ? 'fa-sun text-amber-400'
                : wCode <= 2 ? 'fa-cloud-sun text-amber-300'
                : wCode === 3 ? 'fa-cloud text-slate-400'
                : wCode <= 48 ? 'fa-smog text-slate-500'
                : wCode <= 67 ? 'fa-cloud-rain text-sky-400'
                : wCode <= 77 ? 'fa-snowflake text-sky-300'
                : wCode <= 82 ? 'fa-cloud-showers-heavy text-sky-400'
                : 'fa-bolt text-yellow-400';
              return (
                <div className="rounded-2xl border border-white/[0.07] px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)' }}>

                  {/* Row 1 (mobile) / Left (desktop): Status badges */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse shrink-0"></span>
                      <span className="font-bold text-emerald-400 uppercase tracking-wider">Sistem Aktif</span>
                    </div>
                    {/* DB Sync Status */}
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border ${isSupabaseConfigured ? 'bg-blue-400/10 border-blue-400/20' : 'bg-amber-400/10 border-amber-400/20'}`}>
                      <i className={`fa-solid ${isSupabaseConfigured ? 'fa-database text-blue-400' : 'fa-hard-drive text-amber-400'} text-[9px]`}></i>
                      <span className={`font-semibold ${isSupabaseConfigured ? 'text-blue-400' : 'text-amber-400'}`}>{isSupabaseConfigured ? 'Supabase' : 'Local'}</span>
                      {saveStatus === 'saving' && <i className="fa-solid fa-circle-notch fa-spin text-[9px] text-slate-400"></i>}
                      {saveStatus === 'saved' && <i className="fa-solid fa-check text-[9px] text-emerald-400"></i>}
                    </div>
                    {stats.pending > 0 && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20">
                        <i className="fa-solid fa-clock text-amber-400 text-[9px]"></i>
                        <span className="font-semibold text-amber-400">{stats.pending} bekleyen</span>
                      </div>
                    )}
                    {stats.pending === 0 && stats.confirmed + stats.completed > 0 && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                        <i className="fa-solid fa-check text-emerald-400 text-[9px]"></i>
                        <span className="font-semibold text-emerald-400">Tümü işlendi</span>
                      </div>
                    )}
                  </div>

                  {/* Row 2 (mobile) / Right (desktop): Live metrics */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    {/* Clock */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.07] text-white font-mono font-bold tabular-nums">
                      <i className="fa-regular fa-clock text-slate-500 text-[9px]"></i>
                      {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    {/* Weather */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.07]">
                      <i className={`fa-solid ${weatherIcon} text-[10px]`}></i>
                      <span className="font-bold text-white">{weather ? `${weather.temp}°C` : '--°C'}</span>
                      <span className="text-slate-500 hidden sm:inline">Antalya</span>
                    </div>
                    {/* Currency */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.07]">
                      <span className="text-slate-500 font-medium text-[10px]">$</span>
                      <span className="font-bold text-white tabular-nums">{rates.usd ? rates.usd.toFixed(1) : '--'}</span>
                      <span className="text-white/20">·</span>
                      <span className="text-slate-500 font-medium text-[10px]">€</span>
                      <span className="font-bold text-white tabular-nums">{rates.eur ? rates.eur.toFixed(1) : '--'}</span>
                      <span className="text-slate-600 text-[9px]">₺</span>
                    </div>
                    {/* IP — md+ only */}
                    {userIp && (
                      <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.07]">
                        <i className="fa-solid fa-shield-halved text-emerald-500 text-[9px]"></i>
                        <span className="font-mono text-slate-400">{userIp}</span>
                      </div>
                    )}
                    {/* Shortcuts — xl+ only */}
                    <div className="hidden xl:flex items-center gap-1 text-[10px] ml-1">
                      {['D','B','R','N'].map(k => (
                        <kbd key={k} className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.04] font-mono text-slate-500">{k}</kbd>
                      ))}
                    </div>
                    {/* Theme toggle — iOS pill */}
                    <button onClick={toggleTheme} title={isDarkTheme ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
                      className="relative shrink-0 rounded-full cursor-pointer select-none ml-1"
                      style={{ width: 100, height: 28, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <span className="absolute inset-y-[3px] w-[47px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                        style={{ left: isDarkTheme ? 3 : 50, background: 'linear-gradient(135deg,rgba(197,160,89,0.85),rgba(197,160,89,0.55))', boxShadow: '0 2px 10px rgba(197,160,89,0.3)' }} />
                      <span className="absolute inset-0 flex">
                        <span className={`flex-1 flex items-center justify-center gap-1 z-10 transition-colors duration-200 ${isDarkTheme ? 'text-slate-900' : 'text-slate-500'}`}>
                          <i className="fa-solid fa-moon" style={{ fontSize: 9 }}></i>
                          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.04em' }}>Dark</span>
                        </span>
                        <span className={`flex-1 flex items-center justify-center gap-1 z-10 transition-colors duration-200 ${!isDarkTheme ? 'text-slate-900' : 'text-slate-500'}`}>
                          <i className="fa-solid fa-sun" style={{ fontSize: 9 }}></i>
                          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.04em' }}>Light</span>
                        </span>
                      </span>
                    </button>
                  </div>

                </div>
              );
            })()}

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => { setActiveView('bookings'); }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--color-primary)] text-[#06080F] text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_12px_rgba(197,160,89,0.3)]"
              >
                <i className="fa-solid fa-plus text-[10px]"></i>
                Yeni Rezervasyon
              </button>
              <button
                onClick={() => setActiveView('bookings')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.07] text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white active:scale-95 transition-all"
              >
                <i className="fa-solid fa-calendar-check text-slate-500 text-[10px]"></i>
                Rezervasyonlar
                {pendingCount > 0 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-[9px] font-black text-white">{pendingCount}</span>
                )}
              </button>
              <button
                onClick={() => setActiveView('blog')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.07] text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white active:scale-95 transition-all"
              >
                <i className="fa-solid fa-pen-nib text-slate-500 text-[10px]"></i>
                Blog Yazısı Ekle
              </button>
              <button
                onClick={() => setActiveView('reviews')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.07] text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white active:scale-95 transition-all"
              >
                <i className="fa-solid fa-star text-slate-500 text-[10px]"></i>
                Yorumlar
                {pendingReviews > 0 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-[9px] font-black text-white">{pendingReviews}</span>
                )}
              </button>
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.07] text-xs font-semibold text-slate-400 hover:bg-white/[0.08] hover:text-white active:scale-95 transition-all ml-auto"
              >
                <i className="fa-solid fa-wand-magic-sparkles text-indigo-400 text-[10px]"></i>
                Asistan
                <kbd className="bg-white/10 border border-white/20 px-1 py-0.5 rounded font-mono text-[9px] text-slate-500">⌘K</kbd>
              </button>
            </div>

            {/* ── TODAY'S TRANSFERS: ELITE LIVE TRACKER ── */}
            {(() => {
              const today = new Date().toISOString().split('T')[0];
              const todayTransfers = bookings
                .filter(b => b.date === today && b.status !== 'Deleted' && b.status !== 'Cancelled')
                .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
              
              if (todayTransfers.length === 0) return null;
              
              return (
                <div className="relative group overflow-hidden rounded-[2.5rem] border border-[var(--color-primary)]/20 bg-[#020617]/40 backdrop-blur-2xl transform-gpu shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-700 hover:border-[var(--color-primary)]/40">
                  {/* Subtle Background Animation */}
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-primary)]/5 blur-3xl transform-gpu opacity-50 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-[var(--color-primary)]/10 transition-colors duration-1000"></div>
                  
                  <div className="relative z-10 flex flex-col lg:flex-row items-stretch">
                    {/* Header Sidebar (Left) */}
                    <div className="lg:w-64 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.06] bg-white/[0.02]">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]"></div>
                          <span className="text-[11px] font-[900] text-white tracking-[0.2em] uppercase">Canlı Takip</span>
                        </div>
                        <h3 className="text-2xl font-[900] text-white tracking-tight leading-tight">Bugünün<br/>Transferleri</h3>
                        <p className="text-slate-500 text-[13px] mt-4 font-medium leading-relaxed">Operasyonu buradan anlık olarak yönetin.</p>
                      </div>
                      
                      <div className="mt-8 flex items-baseline gap-2">
                        <span className="text-4xl font-[900] text-[var(--color-primary)] tracking-tighter tabular-nums">{todayTransfers.length}</span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Planlı Araç</span>
                      </div>
                    </div>

                    {/* Transfers Horizontal Scroll (Right) */}
                    <div className="flex-1 p-6 flex gap-5 overflow-x-auto admin-scrollbar pb-8 pt-4">
                      {todayTransfers.map(b => {
                        const statusColor = b.status === 'Confirmed' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                          : b.status === 'Completed' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                        const statusLabel = b.status === 'Confirmed' ? 'Onaylı' : b.status === 'Completed' ? 'Tamamlandı' : 'Beklemede';
                        
                        return (
                          <div
                            key={b.id}
                            onClick={() => setSelectedBookingForView(b)}
                            className="shrink-0 w-[280px] p-5 rounded-[2rem] bg-white/[0.03] border border-white/[0.06] hover:border-[var(--color-primary)]/40 hover:bg-white/[0.06] transition-all duration-500 cursor-pointer group/card shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)]"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <i className="fa-solid fa-clock text-[var(--color-primary)] text-[10px] opacity-70"></i>
                                <span className="text-[15px] font-[900] text-white font-mono tabular-nums tracking-tighter">{b.time || '--:--'}</span>
                              </div>
                              <span className={`text-[9px] font-[800] px-2.5 py-1 rounded-lg border tracking-wider uppercase ${statusColor}`}>{statusLabel}</span>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <p className="text-[14px] font-[800] text-white truncate group-hover/card:text-[var(--color-primary)] transition-colors duration-300">{b.customerName.replace(/[\n\r]+/g, ' ').trim()}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/40"></div>
                                  <span className="text-[11px] font-bold text-slate-400 truncate">{b.pickup.split(',')[0]}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                                  <span className="text-[11px] font-bold text-slate-500 truncate">{b.destination.split(',')[0]}</span>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex -space-x-2">
                                    {[...Array(Math.min(b.passengers, 3))].map((_, i) => (
                                      <div key={i} className="w-5 h-5 rounded-full bg-slate-800 border border-[#020617] flex items-center justify-center">
                                        <i className="fa-solid fa-user text-[7px] text-slate-500"></i>
                                      </div>
                                    ))}
                                    {b.passengers > 3 && (
                                      <div className="w-5 h-5 rounded-full bg-slate-800 border border-[#020617] flex items-center justify-center text-[7px] font-black text-slate-400">
                                        +{b.passengers - 3}
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-500">{b.passengers} Yolcu</span>
                                </div>
                                <span className="text-[13px] font-[900] text-white tracking-tighter">{siteContent.currency?.symbol || '€'}{b.totalPrice}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* KPI Cards — Flat, Minimal + Today + Trend — Mobile: horizontal scroll snap carousel */}
            {(() => {
              const kpiItems = [
                { label: 'Toplam Ciro', val: `${siteContent.currency?.symbol || '€'}${stats.totalRevenue.toLocaleString()}`, icon: 'fa-coins', color: 'text-amber-400', bg: 'bg-amber-400/10', trend: stats.revenueTrend !== 0 ? `${stats.revenueTrend > 0 ? '+' : ''}${stats.revenueTrend.toFixed(0)}%` : null, trendUp: stats.revenueTrend > 0 },
                { label: 'Onaylı', val: stats.confirmed, icon: 'fa-circle-check', color: 'text-emerald-400', bg: 'bg-emerald-400/10', trend: null, trendUp: false },
                { label: 'Bekleyen', val: stats.pending, icon: 'fa-clock', color: 'text-blue-400', bg: 'bg-blue-400/10', trend: null, trendUp: false },
                { label: 'Tamamlanan', val: stats.completed, icon: 'fa-check-double', color: 'text-violet-400', bg: 'bg-violet-400/10', trend: null, trendUp: false },
                { label: 'Bugün', val: stats.todayBookings, icon: 'fa-calendar-day', color: 'text-rose-400', bg: 'bg-rose-400/10', trend: null, trendUp: false },
              ];
              return (
                <>
                  {/* Desktop Bento Grid */}
                  <div className="hidden lg:grid grid-cols-4 xl:grid-cols-6 gap-4">
                    {/* Bento Box 1: Revenue (Hero KPI) */}
                    <div onClick={() => setActiveView('bookings')} className="col-span-2 row-span-2 p-5 rounded-3xl bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-primary)]/5 to-transparent border border-white/[0.08] hover:border-[var(--color-primary)]/30 hover:shadow-2xl hover:shadow-[var(--color-primary)]/20 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[160px] cursor-pointer" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), inset 1px 0 0 0 rgba(255, 255, 255, 0.02)' }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-50 z-0 pointer-events-none"></div>
                      <div className="relative z-10 flex items-start justify-between mb-4">
                        <div>
                          <p className="font-outfit text-[11px] font-[700] text-[var(--color-primary)] uppercase tracking-[0.12em] mb-1.5 opacity-80">Toplam Ciro</p>
                          <p className="font-outfit text-[2.35rem] font-[800] text-white tracking-[-0.025em] flex items-baseline gap-1">{siteContent.currency?.symbol || '€'}<span className="tabular-nums"><AnimatedNumber value={stats.totalRevenue} /></span></p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/20 flex items-center justify-center backdrop-blur-md border border-[var(--color-primary)]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                          <i className="fa-solid fa-coins text-[var(--color-primary)] text-xl"></i>
                        </div>
                      </div>

                      {/* Sparkline & Trend */}
                      <div className="relative z-10 flex items-end justify-between mt-auto">
                        <div className="flex-1 max-w-[140px] h-10 opacity-70 group-hover:opacity-100 transition-opacity">
                          <Sparkline data={stats.weeklyData.length > 0 ? stats.weeklyData.map(d => d.v) : [0,0,0,0,0,0,0]} color="amber-500" />
                        </div>
                        {stats.revenueTrend !== 0 && (
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md border shadow-lg ${stats.revenueTrend > 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                            <i className={`fa-solid ${stats.revenueTrend > 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'} text-[10px]`}></i>
                            <span className="text-[11px] font-bold">{stats.revenueTrend > 0 ? '+' : ''}{stats.revenueTrend.toFixed(0)}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Other KPIs as standard minimal bento boxes */}
                    {kpiItems.slice(1).map((kpi, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveView('bookings')}
                        onPointerEnter={() => haptic.tap()}
                        className="col-span-1 p-4 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between"
                        style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div className="flex items-start justify-between mb-3 relative z-10">
                          <div className={`w-10 h-10 rounded-2xl ${kpi.bg} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                            <i className={`fa-solid ${kpi.icon} ${kpi.color} text-sm`}></i>
                          </div>
                          {idx === 0 && ( /* Optional mini sparkline for first item */
                            <div className="w-12 h-6 opacity-30 group-hover:opacity-60 transition-opacity">
                              <Sparkline data={[50, 60, 45, 80, 75, 90]} color="emerald-400" />
                            </div>
                          )}
                        </div>
                        <div className="relative z-10">
                          <p className="font-outfit text-[1.65rem] font-[800] text-white tracking-[-0.02em] tabular-nums mb-0.5">
                            {typeof kpi.val === 'number' ? <AnimatedNumber value={kpi.val} /> : kpi.val}
                          </p>
                          <p className="font-outfit text-[10px] font-[700] text-slate-500 uppercase tracking-[0.08em]">{kpi.label}</p>
                        </div>
                      </div>
                    ))}

                    {/* Additional Bento Box: Conversion / Completion Rate */}
                    <div onClick={() => setActiveView('bookings')} className="col-span-2 xl:col-span-1 row-span-2 xl:row-span-1 p-4 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-2xl bg-sky-400/10 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3">
                          <i className="fa-solid fa-arrow-trend-up text-sky-400 text-sm"></i>
                        </div>
                      </div>
                      <div>
                        <p className="font-outfit text-[1.65rem] font-[800] text-white tracking-[-0.02em] tabular-nums mb-0.5">
                          {stats.completed + stats.confirmed > 0
                            ? `%${Math.round((stats.completed / Math.max(stats.completed + stats.confirmed + stats.pending, 1)) * 100)}`
                            : '%0'}
                        </p>
                        <p className="font-outfit text-[10px] font-[700] text-slate-500 uppercase tracking-[0.08em]">Tamamlanma</p>
                        <p className="text-[10px] text-slate-600 mt-1">{stats.completed} / {stats.completed + stats.confirmed + stats.pending} transfer</p>
                      </div>
                    </div>
                  </div>
                  {/* Mobile horizontal scroll snap carousel */}
                  <KpiCarousel items={kpiItems} />
                </>
              );
            })()}

            {/* Main Grid — 8+4 Layout */}
            <div className="grid grid-cols-12 gap-4">

              {/* Son Rezervasyonlar — Today Highlight + Quick Actions */}
              <div className="col-span-12 lg:col-span-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                      <i className="fa-solid fa-calendar-lines text-[var(--color-primary)] text-[11px]"></i>
                    </div>
                    <div>
                      <h3 className="font-outfit text-[13.5px] font-[700] text-white leading-none tracking-[0.005em]">Son Rezervasyonlar</h3>
                      <p className="text-[10.5px] text-slate-500 mt-0.5">{bookings.filter(b => b.status !== 'Deleted').length} toplam rezervasyon</p>
                    </div>
                    {stats.todayBookings > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20 ml-1">
                        <span className="w-1 h-1 rounded-full bg-rose-400 inline-block mr-1 animate-pulse"></span>Bugün {stats.todayBookings}
                      </span>
                    )}
                  </div>
                  <button onClick={() => setActiveView('bookings')} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-[var(--color-primary)] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04]">
                    Tümünü Gör <i className="fa-solid fa-arrow-right text-[9px]"></i>
                  </button>
                </div>

                <div className="hidden sm:block overflow-x-auto scrollbar-hide">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="font-outfit text-[9.5px] font-[750] text-slate-500 uppercase tracking-[0.12em] border-b border-white/[0.04]">
                        <th className="px-5 py-3 text-left">Müşteri</th>
                        <th className="px-3 py-3 text-left hidden sm:table-cell">Güzergah</th>
                        <th className="px-3 py-3 text-left hidden md:table-cell">Tarih</th>
                        <th className="px-3 py-3 text-left">Tutar</th>
                        <th className="px-3 py-3 text-left">Durum</th>
                        <th className="px-3 py-3 text-left hidden lg:table-cell">İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const today = new Date().toISOString().split('T')[0];
                        return bookings
                          .filter(b => b.status !== 'Deleted')
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .slice(0, 8)
                          .map((b) => {
                            const isToday = b.date === today;
                            return (
                              <tr
                                key={b.id}
                                onClick={() => setSelectedBookingForView(b)}
                                className={`border-b cursor-pointer transition-colors group ${isToday
                                  ? 'border-l-2 border-l-[var(--color-primary)] border-b-white/[0.05] bg-[var(--color-primary)]/[0.04] hover:bg-[var(--color-primary)]/[0.08]'
                                  : 'border-b-white/[0.03] hover:bg-white/[0.03]'
                                  }`}
                              >
                                <td className="px-5 py-3">
                                  <div className="flex items-center gap-2.5">
                                    {/* Avatar initials */}
                                    <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/20 flex items-center justify-center shrink-0">
                                      <span className="text-[10px] font-black text-[var(--color-primary)]">
                                        {b.customerName.replace(/[\n\r]+/g, ' ').trim().split(' ').map((n: string) => n[0]).slice(0,2).join('').toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <p className="text-xs font-semibold text-white group-hover:text-[var(--color-primary)] transition-colors truncate max-w-[120px]">{b.customerName.replace(/[\n\r]+/g, ' ').trim()}</p>
                                        {isToday && b.status !== 'Completed' && (
                                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[8px] font-black uppercase px-1.5 py-0.5 rounded shadow-[0_0_5px_rgba(16,185,129,0.2)] animate-pulse shrink-0">Bugün</span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <p className="text-[10px] text-slate-500">{b.phone}</p>
                                        {b.flightNumber && (
                                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                            <i className="fa-solid fa-plane text-[7px] mr-1"></i>{b.flightNumber}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-3 hidden sm:table-cell">
                                  <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{b.pickup} → {b.destination}</p>
                                </td>
                                <td className="px-3 py-3 hidden md:table-cell">
                                  <p className="text-[11px] text-slate-400 tabular-nums">{b.date.split('-').reverse().join('.')}</p>
                                </td>
                                <td className="px-3 py-3">
                                  <span className="text-xs font-bold text-white">{siteContent.currency?.symbol || '€'}{b.totalPrice}</span>
                                </td>
                                <td className="px-3 py-3">
                                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${b.status === 'Confirmed' ? 'bg-blue-500/15 text-blue-400' :
                                    b.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-400' :
                                      b.status === 'Cancelled' ? 'bg-red-500/15 text-red-400' :
                                        b.status === 'Rejected' ? 'bg-slate-500/15 text-slate-400' :
                                          'bg-amber-500/15 text-amber-400'
                                    }`}>
                                    {{
                                      'Pending': 'Beklemede',
                                      'Confirmed': 'Onaylı',
                                      'Completed': 'Tamamlandı',
                                      'Cancelled': 'İptal',
                                      'Rejected': 'Reddedildi',
                                      'Deleted': 'Silindi',
                                    }[b.status] || b.status}
                                  </span>
                                </td>
                                <td className="px-3 py-3 hidden lg:table-cell">
                                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                    {b.status === 'Pending' && (
                                      <>
                                        <button onClick={() => onUpdateStatus(b.id, 'Confirmed')} className="w-6 h-6 rounded-md bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 flex items-center justify-center transition-colors" title="Onayla">
                                          <i className="fa-solid fa-check text-[9px]"></i>
                                        </button>
                                        <button onClick={() => onUpdateStatus(b.id, 'Rejected')} className="w-6 h-6 rounded-md bg-red-500/15 text-red-400 hover:bg-red-500/30 flex items-center justify-center transition-colors" title="Reddet">
                                          <i className="fa-solid fa-xmark text-[9px]"></i>
                                        </button>
                                      </>
                                    )}
                                    {b.status === 'Confirmed' && (
                                      <button onClick={() => onUpdateStatus(b.id, 'Completed')} className="w-6 h-6 rounded-md bg-violet-500/15 text-violet-400 hover:bg-violet-500/30 flex items-center justify-center transition-colors" title="Tamamla">
                                        <i className="fa-solid fa-flag-checkered text-[9px]"></i>
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          });
                      })()}
                    </tbody>
                  </table>
                  {bookings.filter(b => b.status !== 'Deleted').length === 0 && (
                    <div className="py-12 text-center text-slate-500">
                      <i className="fa-solid fa-inbox text-2xl mb-2 block opacity-40"></i>
                      <p className="text-xs">Henüz rezervasyon yok</p>
                    </div>
                  )}
                </div>

                {/* ── MOBILE LIST VIEW ── */}
                <div className="sm:hidden flex flex-col divide-y divide-white/[0.04]">
                  {(() => {
                    const today = new Date().toISOString().split('T')[0];
                    const recent = bookings.filter(b => b.status !== 'Deleted').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

                    if (recent.length === 0) {
                      return (
                        <div className="py-8 text-center text-slate-500">
                          <i className="fa-solid fa-inbox text-xl mb-2 block opacity-40"></i>
                          <p className="text-xs">Henüz rezervasyon yok</p>
                        </div>
                      );
                    }

                    return recent.map(b => (
                      <MobileBookingItem
                        key={b.id}
                        booking={b}
                        onClick={setSelectedBookingForView}
                        onContextMenu={(e, booking) => setContextMenu({ isOpen: true, position: { top: e.clientY, left: e.clientX }, booking })}
                        isToday={b.date === today}
                      />
                    ));
                  })()}
                </div>
              </div>

              {/* Right Column — Pie + Countries */}
              <div className="col-span-12 xl:col-span-4 space-y-4">

                {/* Ülke Dağılımı */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <h3 className="font-outfit text-[11px] font-[700] text-slate-300 uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-globe text-[var(--color-primary)] text-[10px]"></i>
                    Müşteri Ülkeleri
                  </h3>
                  <div className="space-y-2.5">
                    {stats.topCountries.slice(0, 4).map((c, i) => (
                      <div key={i} className="group">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-2">
                            <span className="text-lg leading-none">{c.name}</span>
                            <span className="text-[11px] font-medium text-slate-300">{getCountryName(c.name)}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500">{c.count} transfer</span>
                            <span className="text-[10px] font-bold text-slate-400 w-8 text-right">{Math.round(c.percent)}%</span>
                          </div>
                        </div>
                        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(c.percent, 100)}%`, background: `linear-gradient(90deg, var(--color-primary), var(--color-primary)99)` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    {stats.topCountries.length === 0 && (
                      <div className="flex flex-col items-center py-4 gap-2">
                        <i className="fa-solid fa-globe text-slate-700 text-xl"></i>
                        <p className="text-slate-600 text-xs">Henüz yorum verisi yok</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Aylık Karşılaştırma + Dönüş Oranı */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <h3 className="font-outfit text-[11px] font-[700] text-slate-300 uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-chart-simple text-[var(--color-primary)] text-[10px]"></i>
                    Performans
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.05] hover:bg-white/[0.06] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Bu Ay</p>
                        {stats.monthlyTrend !== 0 && (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${stats.monthlyTrend > 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                            {stats.monthlyTrend > 0 ? '↑' : '↓'}{Math.abs(stats.monthlyTrend).toFixed(0)}%
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-black text-white tabular-nums">{stats.thisMonthBookings}</p>
                      <p className="text-[10px] text-slate-600 mt-1">geçen ay: {stats.lastMonthBookings}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.05] hover:bg-white/[0.06] transition-colors">
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide mb-2">Sadakat</p>
                      <p className="text-2xl font-black text-white tabular-nums">%{stats.returningRate}</p>
                      <p className="text-[10px] text-slate-600 mt-1">{stats.returningCustomers} dönen / {stats.uniqueCustomers} müşteri</p>
                    </div>
                  </div>
                </div>

                {/* Araç Dağılımı — Compact Pie */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-chart-pie text-[var(--color-primary)] text-[10px]"></i>
                    Araç Dağılımı
                  </h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={stats.categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={58} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {stats.categoryData.map((_, index) => <Cell key={`cell-${index}`} fill={['#c5a059', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'][index % 5]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-3 space-y-1.5">
                    {stats.categoryData.slice(0, 4).map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-2 text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: [getComputedStyle(document.documentElement).getPropertyValue('--color-primary') || '#c5a059', '#3b82f6', '#10b981', '#8b5cf6'][i % 4] }}></span>
                          {item.name}
                        </span>
                        <span className="font-bold text-slate-300">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Haftalık Rezervasyon Grafiği */}
              <div className="col-span-12 lg:col-span-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                      <i className="fa-solid fa-chart-bar text-[var(--color-primary)] text-[11px]"></i>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-none">Haftalık Dağılım</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Son 7 günlük rezervasyon sayısı</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 tabular-nums">
                    {stats.weeklyData.reduce((s, d) => s + d.v, 0)} rezervasyon
                  </div>
                </div>
                <div className="h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.weeklyData} barSize={24} barCategoryGap="30%">
                      <defs>
                        <linearGradient id="weeklyBarGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} width={20} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ background: 'var(--color-dark)', border: '1px solid rgba(197,160,89,0.2)', borderRadius: '10px', fontSize: '11px' }}
                        formatter={(v: number) => [v, 'Rezervasyon']}
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                      />
                      <Bar dataKey="v" name="Rezervasyon" fill="url(#weeklyBarGrad)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Araç Bazlı Gelir — now takes 6 cols */}

              {/* 30-Day Trend Chart — Full Width */}
              <div className="col-span-12 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                      <i className="fa-solid fa-chart-area text-[var(--color-primary)] text-[11px]"></i>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-none">Rezervasyon Trendi</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Son 30 günlük transfer aktivitesi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.05]">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]"></span> Transfer
                  </div>
                </div>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.monthlyTrendData}>
                      <defs>
                        <linearGradient id="goldGrad30" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 9 }} interval={4} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} width={25} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: 'var(--color-dark)', border: '1px solid rgba(197,160,89,0.2)', borderRadius: '10px', fontSize: '11px' }} />
                      <Area type="monotone" dataKey="count" name="Rezervasyon" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#goldGrad30)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Distribution + Vehicle Revenue — 2 column */}
              <div className="col-span-12 lg:col-span-5 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-chart-pie text-[var(--color-primary)] text-[10px]"></i>
                  Durum Dağılımı
                </h3>
                {stats.statusData.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-slate-600 text-xs">Veri yok</div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie data={stats.statusData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value" strokeWidth={0}>
                          {stats.statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '11px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-2 space-y-1.5">
                      {stats.statusData.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-2 text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.fill }}></span>
                            {item.name}
                          </span>
                          <span className="font-bold text-slate-300">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="col-span-12 lg:col-span-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-chart-bar text-[var(--color-primary)] text-[10px]"></i>
                  Araç Bazlı Gelir
                </h3>
                {stats.vehicleRevenue.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-slate-600 text-xs">Tamamlanan rezervasyon yok</div>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={stats.vehicleRevenue} barSize={20}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} width={45} tickFormatter={v => `${siteContent.currency?.symbol || '€'}${v}`} />
                      <Tooltip contentStyle={{ background: 'var(--color-dark)', border: '1px solid rgba(197,160,89,0.2)', borderRadius: '10px', fontSize: '11px' }} formatter={(v: number) => [`${siteContent.currency?.symbol || '€'}${v}`, 'Gelir']} />
                      <Bar dataKey="revenue" name="Gelir" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Bottom Row — Popular Areas + Vehicle Occupancy */}
              <div className="col-span-12 lg:col-span-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs font-bold text-slate-400 gap-2 flex items-center uppercase tracking-wider">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    Popüler Bölgeler
                  </h3>
                </div>

                {stats.popularAreas.length > 0 ? (
                  <div className="flex-1 flex flex-col justify-between gap-3">
                    {stats.popularAreas.map((area, idx) => {
                      // Calculate percentage based on the top area
                      const maxCount = stats.popularAreas[0].count;
                      const percentage = Math.round((area.count / maxCount) * 100);

                      return (
                        <div key={idx} className="group relative flex flex-col p-3.5 rounded-xl bg-white/[0.015] hover:bg-white/[0.04] border border-white/5 transition-colors cursor-pointer overflow-hidden gap-1.5">
                          {/* Background Progress Bar */}
                          <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[var(--color-primary)]/15 to-transparent transition-all duration-700 ease-out" style={{ width: `${percentage}%` }} />

                          <div className="flex items-center justify-between relative z-10 w-full">
                            <div className="flex items-center gap-3 w-full pr-2">
                              {/* Rank Indicator */}
                              <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[11px] font-black ${idx === 0 ? 'bg-[var(--color-primary)] text-white shadow-[0_0_12px_rgba(197,160,89,0.5)]' : 'bg-slate-800 text-slate-400'}`}>
                                {idx + 1}
                              </div>

                              {/* Area Info */}
                              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                <span className="text-[14px] font-bold text-slate-100 whitespace-normal break-words leading-tight">
                                  {area.name}
                                </span>
                              </div>
                            </div>

                            {/* Trip Count */}
                            <div className="text-right shrink-0 pl-3">
                              <div className="text-[16px] font-black text-white">{area.count} <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">İşlem</span></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 mb-3"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                    <p className="text-slate-500 text-xs text-center font-medium">Henüz yeterli veri yok</p>
                  </div>
                )}
              </div>

              <div className="col-span-12 lg:col-span-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-gauge-high text-[var(--color-primary)] text-[10px]"></i>
                  Araç Doluluk Oranı
                </h3>
                <div className="space-y-3">
                  {stats.vehicleOccupancy.map((v, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-slate-400">{v.name}</span>
                        <span className="text-[10px] font-bold text-slate-500">{v.avg}/{v.capacity} <span className="text-slate-600">(%{v.pct})</span></span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${v.pct > 70 ? 'bg-emerald-400' : v.pct > 40 ? 'bg-amber-400' : 'bg-slate-500'}`} style={{ width: `${Math.min(v.pct, 100)}%` }}></div>
                      </div>
                    </div>
                  ))}
                  {stats.vehicleOccupancy.length === 0 && <p className="text-slate-600 text-xs text-center py-3">Henüz veri yok</p>}
                </div>
              </div>
            </div>
          </div>
        )
        }

        <AdminViewErrorBoundary activeView={activeView}>
        <Suspense fallback={<div className="flex items-center justify-center p-20"><i className="fa-solid fa-circle-notch fa-spin text-3xl text-[var(--color-primary)]"></i></div>}>
          <div key={activeView} className="animate-in fade-in slide-in-from-right-4 duration-500">
          {
            activeView === 'bookings' && (
              <BookingsView
                bookings={bookings}
                onUpdateStatus={onUpdateStatus}
                onDeleteBooking={onDeleteBooking}
                setSelectedBookingForView={setSelectedBookingForView}
                showToast={showToast}
                confirmAction={confirmAction}
              />
            )
          }

          {
            activeView === 'site-settings' && (
              <SiteSettingsView
                editContent={editContent}
                setEditContent={setEditContent}
                _confirmAction={confirmAction}
              />
            )
          }

          {
            activeView === 'regions' && (
              <RegionsView
                editContent={editContent}
                setEditContent={setEditContent}
                showToast={showToast}
                confirmAction={confirmAction}
              />
            )
          }

          {
            activeView === 'fleet' && (
              <FleetView
                editContent={editContent}
                setEditContent={setEditContent}
                setVehicleForm={(f) => { setVehicleForm(f); setVehicleTab('info'); }}
                setIsVehicleModalOpen={setIsVehicleModalOpen}
                moveItem={moveItem}
                confirmAction={confirmAction}
              />
            )
          }

          {
            activeView === 'faq' && (
              <FAQView
                editContent={editContent}
                setEditContent={setEditContent}
                faqFilter={faqFilter}
                setFaqFilter={setFaqFilter}
                confirmAction={confirmAction}
              />
            )
          }          {
            activeView === 'business' && (
              <BusinessSettingsView
                editContent={editContent}
                setEditContent={setEditContent}
                accountForm={accountForm}
                setAccountForm={setAccountForm}
                onUpdatePassword={handleUpdatePassword}
                onExitAdmin={onExitAdmin}
                showToast={showToast}
              />            )
          }
          {
            activeView === 'about' && (
              <AboutView
                editContent={editContent}
                setEditContent={setEditContent}
                _confirmAction={confirmAction}
              />
            )
          }

          {
            activeView === 'visionMission' && (
              <VisionMissionView
                editContent={editContent}
                setEditContent={setEditContent}
                _confirmAction={confirmAction}
              />
            )
          }

          {
            activeView === 'blog' && (
              <BlogView
                blogPosts={blogPosts}
                setBlogPosts={setBlogPosts}
                blogTab={blogTab}
                setBlogTab={setBlogTab}
                blogCategories={blogCategories}
                blogSearchTerm={blogSearchTerm}
                setBlogSearchTerm={setBlogSearchTerm}
                showToast={showToast}
                confirmAction={confirmAction}
              />
            )
          }
          {/* Reviews View */}
          {
            activeView === 'reviews' && (
              <ReviewsView
                userReviews={userReviews}
                setUserReviews={setUserReviews}
                siteReviews={siteReviews}
                editableReviewsTab={editableReviewsTab}
                setEditableReviewsTab={setEditableReviewsTab}
              />
            )
          }          {
            activeView === 'hero-images' && (
              <HeroImagesView
                heroBackgrounds={heroBackgrounds}
                updateHeroBackgrounds={updateHeroBackgrounds}
                selectedHeroImages={selectedHeroImages}
                setSelectedHeroImages={setSelectedHeroImages}
                _confirmAction={confirmAction}
              />
            )
          }
          </div>
          </Suspense>        </AdminViewErrorBoundary>
      </main >

      {/* Vehicle Drawer */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 z-[200]">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsVehicleModalOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-[#0d1117] shadow-2xl animate-in slide-in-from-right duration-300 border-l border-white/[0.08] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg ${vehicleForm.id ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                  <i className={`fa-solid ${vehicleForm.id ? 'fa-pen' : 'fa-plus'} text-sm`}></i>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-white">{vehicleForm.id ? 'Aracı Düzenle' : 'Yeni Araç Ekle'}</h3>
                  <p className="text-[10px] text-slate-500">
                    {vehicleForm.name || 'İsimsiz araç'} ·{' '}
                    <span className={vehicleForm.category === 'VIP' ? 'text-amber-400' : vehicleForm.category === 'Business' ? 'text-violet-400' : 'text-blue-400'}>{vehicleForm.category}</span>
                    {' '}· {vehicleForm.capacity || 0} kişi · {vehicleForm.features?.length || 0} donanım
                  </p>
                </div>
              </div>
              <button onClick={() => setIsVehicleModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-colors">
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 px-5 py-2 border-b border-white/[0.06] shrink-0">
              {([
                { id: 'info' as const, label: 'Bilgiler', icon: 'fa-car-side' },
                { id: 'features' as const, label: 'Donanımlar', icon: 'fa-star' },
                { id: 'media' as const, label: 'Görsel', icon: 'fa-image' },
              ] as const).map(t => (
                <button key={t.id} onClick={() => setVehicleTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors duration-150 ${vehicleTab === t.id ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>
                  <i className={`fa-solid ${t.icon} text-[9px]`}></i>
                  {t.label}
                  {t.id === 'features' && (vehicleForm.features?.length || 0) > 0 && (
                    <span className="ml-0.5 text-[9px] font-black text-[var(--color-primary)]">{vehicleForm.features?.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">

              {/* ── Bilgiler tab ── */}
              {vehicleTab === 'info' && (
                <div className="p-5 space-y-5">
                  {/* Preview banner */}
                  <div className="relative h-36 rounded-2xl overflow-hidden bg-black/30 border border-white/[0.06]">
                    {vehicleForm.image ? (
                      <img src={vehicleForm.image} className="w-full h-full object-cover" alt={vehicleForm.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="fa-solid fa-car-side text-4xl text-slate-700"></i>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="font-outfit font-bold text-white text-lg leading-tight">{vehicleForm.name || 'Araç adı girin...'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${vehicleForm.category === 'VIP' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : vehicleForm.category === 'Business' ? 'bg-violet-500/20 text-violet-400 border-violet-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>{vehicleForm.category}</span>
                        <span className="text-[10px] text-slate-400"><i className="fa-solid fa-user text-[8px] mr-1 text-[var(--color-primary)]"></i>{vehicleForm.capacity} kişi</span>
                        <span className="text-[10px] text-slate-400"><i className="fa-solid fa-suitcase text-[8px] mr-1 text-blue-400"></i>{vehicleForm.luggage} bagaj</span>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <i className="fa-solid fa-car-side text-[var(--color-primary)] text-[8px]"></i> Araç Adı / Model
                    </label>
                    <input
                      className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 outline-none transition-colors font-bold"
                      value={vehicleForm.name || ''} onChange={e => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                      placeholder="Örn: Mercedes Vito VIP" />
                  </div>

                  {/* Category + Capacity + Luggage */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Kategori</label>
                      <select
                        className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white focus:border-[var(--color-primary)]/50 outline-none transition-colors"
                        value={vehicleForm.category || 'VIP'} onChange={e => setVehicleForm({ ...vehicleForm, category: e.target.value as Vehicle['category'] })}>

                        <option value="VIP">VIP</option>
                        <option value="Business">Business</option>
                        <option value="Large Group">Grup</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <i className="fa-solid fa-user text-[var(--color-primary)] text-[8px]"></i> Kişi
                      </label>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setVehicleForm({ ...vehicleForm, capacity: Math.max(1, (vehicleForm.capacity || 1) - 1) })}
                          className="w-8 h-10 rounded-l-xl bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors text-sm font-bold">-</button>
                        <input type="number" min={1} max={20}
                          className="flex-1 bg-white/[0.04] border-y border-white/[0.07] py-2.5 text-sm text-white text-center focus:border-[var(--color-primary)]/50 outline-none"
                          value={vehicleForm.capacity || ''} onChange={e => setVehicleForm({ ...vehicleForm, capacity: parseInt(e.target.value) || 1 })} />
                        <button onClick={() => setVehicleForm({ ...vehicleForm, capacity: Math.min(20, (vehicleForm.capacity || 1) + 1) })}
                          className="w-8 h-10 rounded-r-xl bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors text-sm font-bold">+</button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <i className="fa-solid fa-suitcase text-blue-400 text-[8px]"></i> Bagaj
                      </label>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setVehicleForm({ ...vehicleForm, luggage: Math.max(0, (vehicleForm.luggage || 0) - 1) })}
                          className="w-8 h-10 rounded-l-xl bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors text-sm font-bold">-</button>
                        <input type="number" min={0} max={20}
                          className="flex-1 bg-white/[0.04] border-y border-white/[0.07] py-2.5 text-sm text-white text-center focus:border-[var(--color-primary)]/50 outline-none"
                          value={vehicleForm.luggage || ''} onChange={e => setVehicleForm({ ...vehicleForm, luggage: parseInt(e.target.value) || 0 })} />
                        <button onClick={() => setVehicleForm({ ...vehicleForm, luggage: Math.min(20, (vehicleForm.luggage || 0) + 1) })}
                          className="w-8 h-10 rounded-r-xl bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors text-sm font-bold">+</button>
                      </div>
                    </div>
                  </div>

                  {/* Quick feature summary */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider mb-3">Seçili Donanımlar</p>
                    {(vehicleForm.features?.length || 0) === 0 ? (
                      <button onClick={() => setVehicleTab('features')} className="text-[11px] text-slate-600 hover:text-violet-400 transition-colors">
                        <i className="fa-solid fa-plus text-[9px] mr-1"></i> Donanım sekmesinden ekleyin
                      </button>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {vehicleForm.features?.map(f => (
                          <span key={f} className="text-[10px] px-2 py-1 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/15 font-medium">{f}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Donanımlar tab ── */}
              {vehicleTab === 'features' && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] text-slate-500">{vehicleForm.features?.length || 0} / {VEHICLE_FEATURES.length} seçili</p>
                    <button onClick={() => setVehicleForm({ ...vehicleForm, features: vehicleForm.features?.length === VEHICLE_FEATURES.length ? [] : [...VEHICLE_FEATURES] })}
                      className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors">
                      {vehicleForm.features?.length === VEHICLE_FEATURES.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {VEHICLE_FEATURES.map((f) => {
                      const icons: Record<string, string> = {
                        'Ücretsiz Wifi': 'fa-wifi', 'Klima': 'fa-snowflake', 'Deri Koltuk': 'fa-couch',
                        'Buzdolabı': 'fa-temperature-low', 'TV Ünitesi': 'fa-tv', 'Araç İçi İkram': 'fa-wine-glass',
                        'USB Şarj': 'fa-plug', 'Özel Şoför': 'fa-user-tie', 'TÜRSAB Sigorta': 'fa-shield-halved'
                      };
                      const isSelected = vehicleForm.features?.includes(f);
                      return (
                        <button key={f} onClick={() => {
                          const feats = vehicleForm.features || [];
                          setVehicleForm({ ...vehicleForm, features: isSelected ? feats.filter(x => x !== f) : [...feats, f] });
                        }}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${isSelected ? 'bg-[var(--color-primary)]/[0.08] border-[var(--color-primary)]/25 shadow-sm' : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/10'}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/30' : 'bg-white/5'}`}>
                            <i className={`fa-solid ${icons[f] || 'fa-star'} text-[11px] ${isSelected ? 'text-white' : 'text-slate-500'}`}></i>
                          </div>
                          <span className={`text-[13px] font-semibold ${isSelected ? 'text-white' : 'text-slate-400'}`}>{f}</span>
                          <div className={`ml-auto w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${isSelected ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-white/20'}`}>
                            {isSelected && <i className="fa-solid fa-check text-white text-[9px]"></i>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Görsel tab ── */}
              {vehicleTab === 'media' && (
                <div className="p-5 space-y-4">
                  {/* Current preview */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/30 border border-white/[0.06]">
                    {vehicleForm.image ? (
                      <img src={vehicleForm.image} className="w-full h-full object-cover" alt={vehicleForm.name} />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <i className="fa-solid fa-car-side text-4xl text-slate-700"></i>
                        <p className="text-xs text-slate-600">Henüz görsel yok</p>
                      </div>
                    )}
                  </div>

                  {/* Upload */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Dosyadan Yükle</label>
                    <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] border-dashed hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/[0.03] transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
                        <i className="fa-solid fa-cloud-arrow-up text-[var(--color-primary)] text-[11px]"></i>
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-white">Görsel yükle</p>
                        <p className="text-[10px] text-slate-600">JPG, PNG, WebP · Max 5MB</p>
                      </div>
                      <input type="file" accept="image/*" className="hidden"
                        onChange={e => handleImageUpload(e, b => setVehicleForm({ ...vehicleForm, image: b }))} />
                    </label>
                  </div>

                  {/* URL input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider">Görsel URL</label>
                    <input
                      className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-[var(--color-primary)]/50 outline-none transition-colors font-mono text-xs"
                      value={vehicleForm.image?.startsWith('data:') ? '' : vehicleForm.image || ''}
                      onChange={e => setVehicleForm({ ...vehicleForm, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..." />
                    {vehicleForm.image?.startsWith('data:') && (
                      <p className="text-[10px] text-emerald-400"><i className="fa-solid fa-circle-check mr-1"></i>Base64 dosya yüklendi</p>
                    )}
                  </div>

                  {/* Stock suggestions */}
                  <div>
                    <p className="text-[10px] font-bold font-outfit text-slate-500 uppercase tracking-wider mb-2">Hızlı Seçim</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&q=80&w=800',
                        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=800',
                        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
                      ].map((url, i) => (
                        <button key={i} onClick={() => setVehicleForm({ ...vehicleForm, image: url })}
                          className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${vehicleForm.image === url ? 'border-[var(--color-primary)] shadow-[0_0_12px_rgba(197,160,89,0.4)]' : 'border-transparent hover:border-white/20'}`}>
                          <img src={url} className="w-full h-full object-cover" alt={`Stok ${i + 1}`} />
                          {vehicleForm.image === url && (
                            <div className="absolute inset-0 bg-[var(--color-primary)]/20 flex items-center justify-center">
                              <i className="fa-solid fa-check text-white text-lg"></i>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 px-5 py-4 border-t border-white/[0.08] bg-white/[0.02] flex items-center gap-3">
              <button onClick={() => setIsVehicleModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold transition-colors">
                İptal
              </button>
              <button onClick={() => {
                if (!vehicleForm.name?.trim()) { showToast('Araç adı zorunludur', 'error'); setVehicleTab('info'); return; }
                const newVehicle = { ...vehicleForm, id: vehicleForm.id || Date.now().toString(), basePrice: 0 } as Vehicle;
                if (vehicleForm.id && editContent.vehicles.find(v => v.id === vehicleForm.id)) {
                  setEditContent({ ...editContent, vehicles: editContent.vehicles.map(v => v.id === vehicleForm.id ? newVehicle : v) });
                  showToast('Araç güncellendi', 'success');
                } else {
                  setEditContent({ ...editContent, vehicles: [...editContent.vehicles, newVehicle] });
                  showToast('Yeni araç eklendi', 'success');
                }
                setIsVehicleModalOpen(false);
              }}
                className="flex-1 bg-[var(--color-primary)] hover:bg-amber-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 transition-colors flex items-center justify-center gap-2">
                <i className="fa-solid fa-floppy-disk text-[11px]"></i> Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── COMMAND PALETTE OVERLAY ── */}
      {
        isCommandPaletteOpen && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]" onClick={() => setIsCommandPaletteOpen(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div
              className="relative rounded-2xl border border-white/[0.12] shadow-2xl shadow-black/30 w-full max-w-lg overflow-hidden backdrop-blur-2xl transform-gpu"
              style={{ background: 'rgba(15, 23, 42, 0.95)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-white/[0.08]">
                <i className="fa-solid fa-search text-white/50 text-sm"></i>
                <input
                  ref={commandInputRef}
                  autoFocus
                  className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-white/40"
                  placeholder="Sayfa ara veya komut yaz..."
                  value={commandSearch}
                  onChange={e => setCommandSearch(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Escape') setIsCommandPaletteOpen(false);
                    if (e.key === 'Enter' && commandItems.length > 0) handleCommandSelect(commandItems[0]);
                  }}
                />
                <kbd className="text-[9px] font-mono font-bold text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-72 overflow-y-auto py-2 bg-transparent">
                {commandItems.length === 0 ? (
                  <div className="text-center py-8 text-white/40 text-sm">Sonuç bulunamadı</div>
                ) : (
                  <>
                    {/* Pages */}
                    {commandItems.filter(i => i.type === 'page').length > 0 && (
                      <div className="px-4 py-1.5"><span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Sayfalar</span></div>
                    )}
                    {commandItems.filter(i => i.type === 'page').map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleCommandSelect(item)}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/[0.06] transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                          <i className={`fa-solid ${item.icon} text-white/60 text-xs`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium">{item.label}</p>
                          <p className="text-[10px] text-white/40">{item.description}</p>
                        </div>
                        {activeView === item.id && <span className="text-[9px] font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(197,160,89,0.2)]">Aktif</span>}
                      </button>
                    ))}
                    {/* Actions */}
                    {commandItems.filter(i => i.type === 'action').length > 0 && (
                      <div className="px-4 py-1.5 mt-1 border-t border-white/[0.08]"><span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Aksiyonlar</span></div>
                    )}
                    {commandItems.filter(i => i.type === 'action').map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleCommandSelect(item)}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/[0.06] transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                          <i className={`fa-solid ${item.icon} text-[var(--color-primary)] text-xs`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium">{item.label}</p>
                          <p className="text-[10px] text-white/40">{item.description}</p>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-white/5 flex items-center gap-4 text-[9px] text-slate-600">
                <span><kbd className="font-mono bg-white/5 px-1 py-0.5 rounded border border-white/10 mr-1">↵</kbd> Seç</span>
                <span><kbd className="font-mono bg-white/5 px-1 py-0.5 rounded border border-white/10 mr-1">ESC</kbd> Kapat</span>
                <span><kbd className="font-mono bg-white/5 px-1 py-0.5 rounded border border-white/10 mr-1">?</kbd> Kısayollar</span>
              </div>
            </div>
          </div>
        )
      }

      {/* ── KEYBOARD SHORTCUTS HELP ── */}
      {
        showShortcutsHelp && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => setShowShortcutsHelp(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative bg-[var(--color-dark)] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <i className="fa-solid fa-keyboard text-[var(--color-primary)]"></i> Klavye Kısayolları
                </h3>
                <button onClick={() => setShowShortcutsHelp(false)} className="w-7 h-7 rounded-lg bg-white/5 text-slate-400 hover:text-white flex items-center justify-center">
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              </div>
              <div className="p-5 space-y-1 max-h-80 overflow-y-auto">
                {[
                  { key: '⌘K', desc: 'Komut paleti aç' },
                  { key: '⌘Z', desc: 'Geri al' },
                  { key: '⌘⇧Z', desc: 'Yeniden yap' },
                  { key: '?', desc: 'Bu yardımı göster' },
                  { key: 'N', desc: 'Yeni öğe ekle (sayfaya göre)' },
                  { key: 'ESC', desc: 'Açık pencereyi kapat' },
                  { key: '1', desc: 'Dashboard' },
                  { key: '2', desc: 'Rezervasyonlar' },
                  { key: '3', desc: 'Blog' },
                  { key: '4', desc: 'Yorumlar' },
                  { key: '5', desc: 'Banner' },
                  { key: '6', desc: 'Menü' },
                  { key: '7', desc: 'Bölge & Fiyat' },
                  { key: '8', desc: 'Araçlar' },
                ].map(s => (
                  <div key={s.key} className="flex items-center justify-between py-2 px-1 rounded-lg hover:bg-white/[0.02]">
                    <span className="text-sm text-slate-300">{s.desc}</span>
                    <kbd className="text-[10px] font-mono font-bold text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/10 min-w-[32px] text-center">{s.key}</kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }
      {/* ── CONFIRM MODAL ── */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        type={confirmModal.type}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
      />
    </div >

  );
};

export default AdminPanel;
