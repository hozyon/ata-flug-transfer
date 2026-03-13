
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
