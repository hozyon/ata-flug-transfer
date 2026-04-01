/**
 * Bölge bazlı fiyat tablosu verisi.
 * Bu veriler sadece fallback/placeholder olarak kullanılır.
 * Gerçek fiyatlar Supabase'deki siteContent.regions[].price'dan gelir.
 */

export interface PricingRow {
  region: string;
  slug: string;
  distanceKm: number;
  durationMin: number;
  ekonomi: number;
  vipVan: number;
  sprinter: number;
  luksVip: number;
}

export const PRICING_DATA: PricingRow[] = [
  { region: 'Lara / Kundu',    slug: 'lara',         distanceKm: 12,  durationMin: 15,  ekonomi: 25,  vipVan: 35,  sprinter: 45,  luksVip: 60 },
  { region: 'Konyaaltı',       slug: 'konyaalti',    distanceKm: 18,  durationMin: 20,  ekonomi: 25,  vipVan: 35,  sprinter: 45,  luksVip: 60 },
  { region: 'Beldibi',         slug: 'beldibi',      distanceKm: 40,  durationMin: 40,  ekonomi: 30,  vipVan: 40,  sprinter: 50,  luksVip: 65 },
  { region: 'Belek',           slug: 'belek',        distanceKm: 34,  durationMin: 30,  ekonomi: 35,  vipVan: 45,  sprinter: 55,  luksVip: 75 },
  { region: 'Kemer',           slug: 'kemer',        distanceKm: 57,  durationMin: 60,  ekonomi: 40,  vipVan: 55,  sprinter: 70,  luksVip: 90 },
  { region: 'Side / Manavgat', slug: 'side',         distanceKm: 65,  durationMin: 55,  ekonomi: 45,  vipVan: 60,  sprinter: 75,  luksVip: 95 },
  { region: 'Alanya',          slug: 'alanya',       distanceKm: 124, durationMin: 105, ekonomi: 65,  vipVan: 85,  sprinter: 100, luksVip: 130 },
  { region: 'Kaş',             slug: 'kas',          distanceKm: 187, durationMin: 150, ekonomi: 90,  vipVan: 120, sprinter: 150, luksVip: 190 },
];
