import { SiteContent } from './types';

export const SCRAPED_REGIONS = [
  { name: "Antalya Havalimanı (AYT)", image: "/images/regions/ayt.png", desc: "Antalya Havalimanı (AYT) transfer hizmeti." },
  { name: "Antalya (Merkez)", image: "/images/regions/merkezantalya.png", desc: "Antalya (Merkez) bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Kundu", image: "/images/regions/kundu.png", desc: "Kundu bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Konyaaltı", image: "/images/regions/konyaalti.png", desc: "Konyaaltı bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Belek", image: "/images/regions/belek.png", desc: "Belek bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Çolaklı", image: "/images/regions/colakli.png", desc: "Çolaklı bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Evrenseki", image: "/images/regions/evrenseki.png", desc: "Evrenseki bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Kumköy", image: "/images/regions/kumkoy.png", desc: "Kumköy bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Side", image: "/images/regions/side.png", desc: "Side bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Beldibi", image: "/images/regions/beldibi.png", desc: "Beldibi bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Göynük", image: "/images/regions/goynuk.png", desc: "Göynük bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Kemer", image: "/images/regions/kemer.png", desc: "Kemer bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Tekirova", image: "/images/regions/tekirova.png", desc: "Tekirova bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Kızılağaç", image: "/images/regions/kizilagac.png", desc: "Kızılağaç bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Okurcalar", image: "/images/regions/okurcalar.png", desc: "Okurcalar bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "İncekum", image: "/images/regions/incekum.png", desc: "İncekum bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Türkler", image: "/images/regions/turkler.png", desc: "Türkler bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Konaklı", image: "/images/regions/konakli.png", desc: "Konaklı bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Alanya", image: "/images/regions/alanya.png", desc: "Alanya bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Mahmutlar", image: "/images/regions/mahmutlar.png", desc: "Mahmutlar bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Kargıcak", image: "/images/regions/kargicak.png", desc: "Kargıcak bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Adrasan", image: "/images/regions/adrasan.png", desc: "Adrasan bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Lara", image: "/images/regions/lara.png", desc: "Lara bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Bodrum", image: "/images/regions/bodrum.png", desc: "Bodrum bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Dalaman", image: "/images/regions/dalaman.png", desc: "Dalaman bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Fethiye", image: "/images/regions/fethiye.png", desc: "Fethiye bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Göcek", image: "/images/regions/gocek.png", desc: "Göcek bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Marmaris", image: "/images/regions/marmaris.png", desc: "Marmaris bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Ölüdeniz", image: "/images/regions/oludeniz.png", desc: "Ölüdeniz bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Avsallar", image: "/images/regions/avsallar.png", desc: "Avsallar bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Boğazkent", image: "/images/regions/bogazkent.png", desc: "Boğazkent bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Çamyuva", image: "/images/regions/camyuva.png", desc: "Çamyuva bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Çıralı", image: "/images/regions/cirali.png", desc: "Çıralı bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Demre", image: "/images/regions/demre.png", desc: "Demre bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Denizyaka", image: "/images/regions/denizyaka.png", desc: "Denizyaka bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Finike", image: "/images/regions/finike.png", desc: "Finike bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Gündoğdu", image: "/images/regions/gundogdu.png", desc: "Gündoğdu bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Kalkan", image: "/images/regions/kalkan.png", desc: "Kalkan bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Kaş", image: "/images/regions/kas.png", desc: "Kaş bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Kestel", image: "/images/regions/kestel.png", desc: "Kestel bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Kızılot", image: "/images/regions/kizilot.png", desc: "Kızılot bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Kiriş", image: "/images/regions/kiris.png", desc: "Kiriş bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Kumluca", image: "/images/regions/kumluca.png", desc: "Kumluca bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Manavgat", image: "/images/regions/manavgat.png", desc: "Manavgat bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Olimpos", image: "/images/regions/olimpos.png", desc: "Olimpos bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Sorgun", image: "/images/regions/sorgun.png", desc: "Sorgun bölgesine konforlu ve güvenli VIP transfer hizmeti." },
  { name: "Titreyengöl", image: "/images/regions/titreyengol.png", desc: "Titreyengöl bölgesine konforlu ve güvenli VIP transfer hizmeti." }
];

export const INITIAL_SITE_CONTENT: SiteContent = {
  navbar: [
    { id: '1', label: "ANA SAYFA", url: "/" },
    {
      id: '2',
      label: "KURUMSAL",
      url: "/hakkimizda",
      subMenus: [
        { id: '2-1', label: 'Hakkımızda', url: '/hakkimizda' },
        { id: '2-2', label: 'Vizyon & Misyon', url: '/vizyon-misyon' }
      ]
    },
    { id: '3', label: "BÖLGELER", url: "/bolgeler" },
    { id: '4', label: "S.S.S", url: "/sss" },
    { id: '5', label: "BLOG", url: "/blog" },
    { id: '6', label: "İLETİŞİM", url: "/iletisim" }
  ],
  business: {
    name: "ATA FLUG TRANSFER",
    phone: "",
    email: "",
    address: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    telegram: "",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d49731.614179975106!2d31.435059487862148!3d36.7799226034246!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6388f97fd7616259%3A0x950a0fc95df9f8ba!2sAta%20Flug%20Transfer!5e0!3m2!1str!2str!4v1769547150156!5m2!1str!2str",
    logo: "/logo.png"
  },
  vehicles: [
    {
      id: 'v1',
      name: 'Mercedes-Benz Vito VIP',
      category: 'VIP',
      capacity: 6,
      luggage: 6,
      basePrice: 40,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'v2',
      name: 'Mercedes-Benz Sprinter',
      category: 'Large Group',
      capacity: 16,
      luggage: 16,
      basePrice: 80,
      image: 'https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?auto=format&fit=crop&q=80&w=800'
    }
  ],
  mapBgImage: "https://images.unsplash.com/photo-1506012733851-bb97455a4746?auto=format&fit=crop&q=80&w=2000",
  hero: {
    accent: "",
    title: "Lüks ve Konforun",
    titleAccent: "Yeni Tanımı",
    desc: "Antalya Havalimanı'ndan dilediğiniz her noktaya modern araç filomuz ve profesyonel ekibimizle eşsiz bir VIP deneyimi yaşayın.",
    bgImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2000",
    backgrounds: ['/bg1.webp', '/bg2.webp', '/bg3.webp']
  },
  about: {
    title: "Antalya'nın En Prestijli VIP Transfer Hizmeti",
    content: "Ata Flug Transfer, Side, Belek, Alanya ve Kemer bölgelerinde VIP transfer hizmeti sunan lider bir firmadır.",
    image: "/images/about-custom.jpg",
    bannerImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=2000",
    experienceYear: "Profesyonel"
  },
  visionMission: {
    hero: {
      title: "Vizyon & Misyon",
      desc: "Geleceğe bakışımız ve değerlerimiz.",
      bannerImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=2000"
    },
    vision: {
      title: "Vizyonumuz",
      desc: "Antalya bölgesinde VIP transfer hizmetlerinin standartlarını belirleyen lider marka olmak.",
      items: ["Sektörde referans marka olmak", "Sürdürülebilir büyüme"]
    },
    mission: {
      title: "Misyonumuz",
      desc: "Güvenli ve konforlu ulaşım sağlamak.",
      items: ["%100 müşteri memnuniyeti", "Güvenli transfer"]
    },
    values: {
      title: "Hizmet İlkelerimiz",
      desc: "Temel prensiplerimiz.",
      items: [
        { icon: "fa-handshake", title: "Güvenilirlik", desc: "Sözümüzü tutarız." },
        { icon: "fa-clock", title: "Dakiklik", desc: "Zamanında hizmet." }
      ]
    }
  },
  regions: SCRAPED_REGIONS.map(r => ({
    id: r.name.toLowerCase().replace(/\s+/g, '-').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c'),
    name: r.name,
    desc: r.desc,
    image: r.image,
    icon: 'fa-location-dot',
  })),
  faq: [
    { id: 'f1', q: "Havalimanında şoförümü nasıl bulacağım?", a: "Şoförünüz sizi geliş terminali çıkışında isminizin yazılı olduğu bir tabela ile bekleyecektir." }
  ],
  seo: {
    siteTitle: 'Antalya Havalimanı Transfer | Antalya VIP Transfer',
    titleTemplate: '%s | Ata Flug Transfer',
    siteDescription: 'Antalya Havalimanı transfer hizmeti.',
    siteKeywords: 'antalya transfer',
    ogImage: '',
    canonicalUrl: 'https://www.ataflugtransfer.com',
    googleSiteVerification: '',
    bingVerification: '',
    twitterHandle: '@ataflugtransfer',
    robotsDirective: 'index, follow',
    structuredData: {
      businessType: 'LocalBusiness',
      priceRange: '€€',
      areaServed: 'Antalya, Turkey',
      openingHours: 'Mo-Su 00:00-24:00',
      latitude: '36.8841',
      longitude: '30.7056',
    },
    pagesSeo: {
      home: { title: 'Antalya VIP Transfer', description: 'Antalya Havalimanı VIP transfer hizmeti.', keywords: 'antalya transfer' },
      about: { title: '', description: '', keywords: '' },
      regions: { title: '', description: '', keywords: '' },
      blog: { title: '', description: '', keywords: '' },
      faq: { title: '', description: '', keywords: '' },
      contact: { title: '', description: '', keywords: '' },
    },
  },
  branding: {
    primaryColor: '#c5a059',
    darkBg: '#0f172a',
    darkBgDeep: '#020617',
    favicon: '/favicon.ico',
  },
  currency: {
    symbol: '€',
    code: 'EUR',
  },
  adminAccount: {
    fullName: 'Admin',
    email: 'ataflugtransfer@gmail.com',
    phone: '+90 505 228 15 96',
    notifyEmail: true,
    notifySms: false,
    notifySystem: true,
    twoFa: false,
  },
};

// End of file
