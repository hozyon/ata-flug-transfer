
export interface BrandingSettings {
  primaryColor: string;
  darkBg: string;
  darkBgDeep: string;
  favicon?: string;
}

export interface CurrencySettings {
  symbol: string;
  code: string;
}

export interface Vehicle {
  id: string;
  name: string;
  category: 'Business' | 'VIP' | 'Large Group' | 'Premium';
  capacity: number;
  luggage: number;
  basePrice: number;
  image: string;
  features?: string[];
}

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  vehicleId: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'Rejected' | 'Deleted';
  totalPrice: number;
  createdAt: string;
  notes?: string;
  flightNumber?: string;
}

export interface NavMenuItem {
  id?: string;
  label: string;
  url: string;
  subMenus?: NavMenuItem[];
}

export interface BusinessSettings {
  name: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  telegram: string;
  mapEmbedUrl: string;
  logo?: string;
}

export interface SeoSettings {
  siteTitle: string;           // e.g. "Ata Flug Transfer | Antalya VIP Havalimanı Transfer"
  titleTemplate: string;       // e.g. "%s | Ata Flug Transfer"
  siteDescription: string;     // 160 chars max
  siteKeywords: string;        // comma separated
  ogImage: string;             // absolute URL for default OG image
  canonicalUrl: string;        // e.g. "https://ataflugtransfer.com"
  googleSiteVerification: string;
  bingVerification: string;
  twitterHandle: string;       // e.g. "@ataflugtransfer"
  robotsDirective: string;     // "index, follow"
  structuredData: {
    businessType: string;      // "TravelAgency"
    priceRange: string;        // "€€"
    areaServed: string;        // "Antalya, Turkey"
    openingHours: string;      // "Mo-Su 00:00-24:00"
    latitude: string;
    longitude: string;
  };
  pagesSeo: {
    home:    { title: string; description: string; keywords: string };
    about:   { title: string; description: string; keywords: string };
    regions: { title: string; description: string; keywords: string };
    blog:    { title: string; description: string; keywords: string };
    faq:     { title: string; description: string; keywords: string };
    contact: { title: string; description: string; keywords: string };
  };
}

export interface SiteContent {
  navbar: NavMenuItem[];
  business: BusinessSettings;
  vehicles: Vehicle[];
  mapBgImage: string;
  hero: {
    accent: string;
    title: string;
    titleAccent: string;
    desc: string;
    bgImage: string;
    backgrounds: string[];
  };
  about: {
    title: string;
    content: string;
    image: string;
    bannerImage: string;
    experienceYear: string;
  };
  visionMission: {
    hero: {
      title: string;
      desc: string;
      bannerImage: string;
    };
    vision: {
      title: string;
      desc: string;
      items: string[];
    };
    mission: {
      title: string;
      desc: string;
      items: string[];
    };
    values: {
      title: string;
      desc: string;
      items: { icon: string; title: string; desc: string }[];
    };
  };
  regions: Region[];
  faq: {
    id: string;
    q: string;
    a: string;
    hidden?: boolean;
  }[];
  seo: SeoSettings;
  branding?: BrandingSettings;
  currency?: CurrencySettings;
  adminAccount?: {
    fullName: string;
    email: string;
    phone: string;
    notifyEmail: boolean;
    notifySms: boolean;
    notifySystem: boolean;
    twoFa: boolean;
    passwordHistory?: string[];
    activeSessionToken?: string;
  };
}

export interface Region {
  id: string;
  name: string;
  desc: string;
  image: string;
  icon: string;
  price?: number;
}

// Blog Post Interface
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
  isPublished: boolean;
  viewCount: number;
}

// User Review Interface (yorum onay sistemi için)
export interface UserReview {
  id: string;
  name: string;
  country: string;
  lang: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected' | 'deleted';
  createdAt: string;
}
