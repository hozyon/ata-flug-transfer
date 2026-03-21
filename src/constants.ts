
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
    phone: "+90 505 228 15 96",
    email: "info@ataflugtransfer.com",
    address: "Antalya, Turkey",
    whatsapp: "905052281596",
    instagram: "https://instagram.com/ataflug",
    facebook: "https://facebook.com/ataflug",
    telegram: "https://t.me/ataflug",
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
    backgrounds: ['/bg1.png', '/bg2.png', '/bg3.png']
  },
  about: {
    title: "Antalya'nın En Prestijli VIP Transfer Hizmeti",
    content: "Ata Flug Transfer, Side, Belek, Alanya ve Kemer bölgelerinde VIP transfer hizmeti sunan lider bir firmadır. En uygun fiyatlarla, konforlu, güvenli, temiz ve bakımlı araçlarımızla kaliteli bir yolculuk sağlıyoruz. Ücretsiz çocuk koltuğu, TV ve mini bar gibi özel imkanlarla donatılmış araçlarımız, profesyonel şoförlerimiz ve 7/24 online rezervasyon kolaylığıyla zamanınızı en iyi şekilde değerlendiriyoruz. Ata Flug Transfer ile konfor ve kaliteyi yaşayın.\n\nAyrıca, müşteri memnuniyetini en üst düzeyde tutmak için sürekli kendimizi geliştiriyor, misafirlerimize özel karşılama ve bagaj desteği gibi ayrıcalıklar sunuyoruz. Antalya Havalimanı başta olmak üzere, bölgedeki tüm transfer noktalarında güvenilir ve hızlı hizmet sağlıyoruz.\n\nSizi ve sevdiklerinizi güvenle, konforla ve zamanında varış noktanıza ulaştırmak için buradayız.",
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
      desc: "Antalya bölgesinde VIP transfer hizmetlerinin standartlarını belirleyen, müşteri memnuniyetini en üst düzeyde tutan ve teknoloji ile inovasyon odaklı yaklaşımıyla sektörün lider markası olmak.",
      items: [
        "Sektörde referans marka olmak",
        "Sürdürülebilir büyüme",
        "Teknolojik yeniliklerle hizmet"
      ]
    },
    mission: {
      title: "Misyonumuz",
      desc: "Misafirlerimize güvenli, konforlu ve zamanında ulaşım hizmeti sunarak tatilin ilk anından itibaren mükemmel bir deneyim yaşatmak. Her transferi bir keyif yolculuğuna dönüştürmek.",
      items: [
        "%100 müşteri memnuniyeti",
        "Zamanında ve güvenli transfer",
        "Profesyonel ve samimi hizmet"
      ]
    },
    values: {
      title: "Hizmet İlkelerimiz",
      desc: "Size en iyi deneyimi sunmak için benimsediğimiz temel prensipler.",
      items: [
        { icon: "fa-handshake", title: "Güvenilirlik", desc: "Söz verdiğimiz her şeyi zamanında ve eksiksiz yerine getiririz." },
        { icon: "fa-clock", title: "Dakiklik", desc: "Zamanınız değerlidir. Planlanan saatte, bekletmeden hizmet." },
        { icon: "fa-star", title: "Kalite", desc: "Son model Mercedes araçlar ve profesyonel kaptanlar." },
        { icon: "fa-heart", title: "Misafir Odaklı", desc: "Sadece transfer değil, konforlu bir karşılama deneyimi." }
      ]
    }
  },
  regions: SCRAPED_REGIONS.map(r => ({
    id: r.name.toLowerCase().replace(/\s+/g, '-').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c'),
    name: r.name,
    desc: r.desc,
    image: r.image,
    icon: 'fa-location-dot',
    price: 50
  })),
  faq: [
    { id: 'f1', q: "Havalimanında şoförümü nasıl bulacağım?", a: "Şoförünüz sizi geliş terminali çıkışında isminizin yazılı olduğu bir tabela ile bekleyecektir." },
    { id: 'f2', q: "Uçuşum rötar yaparsa ne olur?", a: "Uçuşunuzu canlı olarak takip ediyoruz, şoförünüz siz indiğinizde orada olacaktır." },
    { id: 'f3', q: "Bebek koltuğu talep edebilir miyim?", a: "Evet, rezervasyon sırasında bebek veya çocuk koltuğu talebinizi belirtebilirsiniz. Ücretsiz sağlanır." },
    { id: 'f4', q: "Ödeme nasıl yapılır?", a: "Nakit (TL, EUR, USD) veya kredi kartı ile araç içinde ödeme yapabilirsiniz." },
    { id: 'f5', q: "Rezervasyonumu nasıl iptal edebilirim?", a: "Transfer saatinden 24 saat öncesine kadar ücretsiz iptal yapabilirsiniz." },
    { id: 'f6', q: "Grup transferi yapıyor musunuz?", a: "Evet, 16 kişiye kadar grup transferleri için Sprinter araçlarımız mevcuttur." },
    { id: 'f7', q: "Araçlarınızda Wi-Fi var mı?", a: "Evet, tüm VIP araçlarımızda ücretsiz Wi-Fi ve şarj imkanı bulunmaktadır." },
    { id: 'f8', q: "Gece transferi yapıyor musunuz?", a: "Evet, 7/24 transfer hizmeti sunuyoruz. Gece uçuşları için ek ücret yoktur." },
    { id: 'f9', q: "Bagaj sınırı var mı?", a: "Kişi başı 1 bavul ve 1 el bagajı dahildir. Fazla bagaj için önceden bilgi veriniz." },
    { id: 'f10', q: "Şehir turu düzenliyor musunuz?", a: "Evet, Antalya, Belek, Side ve çevresinde günlük turlar düzenliyoruz." },
    { id: 'add-1', q: 'Havalimanında beni nasıl bulacaksınız?', a: 'Uçuş numaranızı takip ediyoruz. İniş sonrası bagajınızı aldıktan sonra çıkışta isminizin yazılı olduğu tabela ile şoförümüz sizi karşılayacaktır. Ayrıca WhatsApp üzerinden anlık konum paylaşımı yapıyoruz.' },
    { id: 'add-2', q: 'Uçağım rötar yaparsa ne olur?', a: 'Uçuş takip sistemiyle rötarları anlık olarak takip ediyoruz. Şoförümüz size ek ücret ödemeden bekleyecektir. Geç saatlerde bile güvenle havalimanından ayrılabilirsiniz.' },
    { id: 'add-3', q: 'Gece transferi yapıyor musunuz?', a: 'Evet, 7/24 hizmet veriyoruz. Gece 03:00 veya 04:00 gibi saatlerde de transferlerimiz mevcuttur. Ek gece ücreti alınmaz.' },
    { id: 'add-4', q: 'Araçlarda bebek koltuğu var mı?', a: 'Evet, ücretsiz olarak bebek koltuğu ve çocuk oturağı sağlıyoruz. Rezervasyon sırasında belirtmeniz yeterlidir.' },
    { id: 'add-5', q: 'Ödemeyi nasıl yapabilirim?', a: 'Nakit (TL, EUR, USD, GBP, RUB), kredi kartı veya havale ile ödeme yapabilirsiniz. Ödeme genellikle transfer sonrasında alınır.' }
  ],
  seo: {
    siteTitle: 'Antalya Havalimanı Transfer | Antalya VIP Transfer',
    titleTemplate: '%s | Ata Flug Transfer',
    siteDescription: 'Antalya Havalimanı\'ndan Kemer, Belek, Side, Alanya ve tüm bölgelere özel VIP transfer hizmeti. 7/24 profesyonel şoförler, Mercedes araçlar, uygun fiyat garantisi.',
    siteKeywords: 'antalya havalimanı transfer, antalya vip transfer, antalya otel transfer, antalya transfer, kemer transfer, belek transfer, side transfer, alanya transfer, antalya airport transfer, özel transfer antalya',
    ogImage: 'https://ataflugtransfer.com/og-image.jpg',
    canonicalUrl: 'https://ataflugtransfer.com',
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
      home:    { title: 'Antalya Havalimanı Transfer | Antalya VIP Transfer | Antalya Otel Transfer', description: 'Antalya Havalimanı\'ndan Kemer, Belek, Side, Alanya ve tüm bölgelere özel VIP transfer hizmeti. 7/24 profesyonel şoförler, Mercedes araçlar, uygun fiyat garantisi.', keywords: 'antalya havalimanı transfer, antalya vip transfer, antalya otel transfer, antalya transfer, airport transfer antalya' },
      about:   { title: 'Hakkımızda | Ata Flug VIP Transfer Antalya', description: 'Ata Flug Transfer; Antalya\'da profesyonel VIP havalimanı transfer hizmeti sunan köklü bir firmadır. Güvenilir şoförler, modern Mercedes araç filosu.', keywords: 'ata flug transfer hakkında, antalya transfer firması, vip transfer antalya hakkında' },
      regions: { title: 'Antalya Transfer Bölgeleri | Kemer, Belek, Side, Alanya Transfer Fiyatları', description: 'Antalya Havalimanı\'ndan Kemer, Alanya, Side, Belek, Manavgat, Marmaris ve tüm bölgelere uygun fiyatlı VIP transfer hizmetleri. Fiyat listesi ve rezervasyon.', keywords: 'kemer transfer fiyatı, alanya transfer fiyatı, side transfer fiyatı, belek transfer fiyatı, antalya bölge transfer' },
      blog:    { title: 'Antalya Transfer Rehberi & Blog | VIP Transfer Bilgileri', description: 'Antalya transfer rehberleri, bölge bilgileri, otel transferleri ve seyahat ipuçları. Kemer, Belek, Side, Alanya için kapsamlı transfer rehberi.', keywords: 'antalya transfer rehberi, kemer transfer bilgi, belek transfer blog, antalya gezi rehberi' },
      faq:     { title: 'Antalya Transfer Sıkça Sorulan Sorular | VIP Transfer SSS', description: 'Antalya VIP transfer hizmeti hakkında sıkça sorulan sorular: fiyatlar, rezervasyon, ödeme, araç özellikleri ve daha fazlası.', keywords: 'antalya transfer sss, transfer fiyat sorular, antalya havalimanı transfer nasıl, vip transfer rezervasyon' },
      contact: { title: 'İletişim | Antalya VIP Transfer Rezervasyon', description: '7/24 Antalya VIP transfer rezervasyonu için bizimle iletişime geçin. WhatsApp, telefon veya e-posta ile ulaşın.', keywords: 'antalya transfer iletişim, vip transfer rezervasyon, antalya transfer telefon, transfer whatsapp' },
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
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Admin1&backgroundColor=c5a059',
    notifyEmail: true,
    notifySms: false,
    notifySystem: true,
    twoFa: false,
  },
};

export const DESTINATIONS = [
  "Antalya Havalimanı (AYT)",
  ...SCRAPED_REGIONS
    .map(region => region.name)
    .filter(name => name !== "Antalya Havalimanı (AYT)")
    .sort()
];

export const BUSINESS_INFO = INITIAL_SITE_CONTENT.business;

export const REVIEWS: { id: number; name: string; country: string; lang: string; rating: number; text: string }[] = [];

import { BlogPost } from './types';


const REGION_DETAILS: Record<string, {
  title: string;
  about: string;
  places: string[];
  dining: string[];
  activities: string[];
  hotels?: string[];
  distance?: string;
  duration?: string;
  tips?: string[];
}> = {
  // --- Antalya Merkez ve Yakın Çevre ---
  "Antalya Havalimanı (AYT)": {
    title: "Antalya'nın Dünyaya Açılan Kapısı: Havalimanı Rehberi",
    about: "Akdeniz'in en yoğun ve modern havalimanlarından biri olan Antalya Havalimanı (AYT), her yıl milyonlarca turisti karşılamaktadır. Geniş terminalleri, duty-free mağazaları ve ulaşım olanaklarıyla tatilinizin başlangıç ve bitiş noktasıdır.",
    places: ["T1 ve T2 Dış Hatlar Terminalleri", "CIP Lounge", "Duty Free Mağazaları"],
    dining: ["Terminal içi kafeler", "Fast food restoranları", "Lounge ikramları"],
    activities: ["Alışveriş (Duty Free)", "Lounge'da dinlenme", "Seyahat planlaması"]
  },
  "Antalya (Merkez)": {
    title: "Tarihin ve Modern Yaşamın Buluşma Noktası: Antalya Merkez",
    about: "Kaleiçi'nin dar sokaklarında tarihe dokunabilir, falezlerin üzerindeki parklarda Akdeniz'in sonsuz maviliğini izleyebilirsiniz. Antalya Merkez, hem alışveriş hem de kültür turizmi için idealdir.",
    places: ["Kaleiçi & Hadrian Kapısı", "Antalya Müzesi", "Düden Şelalesi (Aşağı)", "Karaalioğlu Parkı", "Konyaaltı Sahili"],
    dining: ["7 Mehmet Restaurant", "Seraser Fine Dining", "Piyazcı Ahmet", "Börekçi Tevfik"],
    activities: ["Kaleiçi turu", "Müze ziyareti", "Yat limanı gezisi", "Alışveriş (MarkAntalya, TerraCity)"]
  },
  "Kundu": {
    title: "Oteller Bölgesinin Kalbi: Kundu ve Lara",
    about: "Kundu, temalı otelleri ve uçsuz bucaksız kumsalları ile ünlüdür. 'Türk Rivierası'nın Las Vegas'ı' olarak anılan bu bölge, lüks tatil arayanların bir numaralı tercihidir.",
    places: ["Lara Plajı", "Ters Ev (Aksiyon Parkı)", "Sandland (Kum Heykel Müzesi)", "Perge Antik Kenti (Yakın)"],
    dining: ["Kundu Otel Restoranları", "Lara Balık Evi", "Günaydın Kebap"],
    activities: ["Plaj keyfi", "Su sporları", "Alışveriş merkezleri turu", "Kum heykel festivali"],
    hotels: ["Titanic Beach Lara", "Ela Quality Resort", "Paloma Oceana Resort", "Crystal Sunset Luxury Resort", "Kamelya Collection Hotel", "Starlight Resort Hotel"],
    distance: "Antalya Havalimanı'na yaklaşık 15 km",
    duration: "Yaklaşık 20 – 30 dakika",
    tips: [
      "Kundu bölgesindeki mega otellerin farklı giriş kapıları vardır; şoförümüz doğru kapıdan giriş yapacak şekilde yönlendirilir.",
      "Sandland Kum Heykel Müzesi ve Perge Antik Kenti için günlük tur transferi de düzenleyebiliriz.",
      "Ters Ev gibi aktivite merkezlerine gidiş-dönüş için minibüslerimiz hazır.",
      "Aynı güzergahta birden fazla otel varsa grup transferinizi tek araçla organize edebiliriz."
    ]
  },
  "Lara": {
    title: "Lüksün ve Eğlencenin Adresi: Lara",
    about: "Antalya'nın en popüler turizm merkezlerinden biri olan Lara, hem şehir merkezine yakınlığı hem de muhteşem plajlarıyla dikkat çeker. Düden Şelalesi'nin denize döküldüğü nokta buradadır.",
    places: ["Düden Şelalesi", "Lara Plajı (Altınkum)", "TerraCity AVM"],
    dining: ["Kalamar Balık", "BigChefs", "Lara Çorbacısı"],
    activities: ["Düden parkında yürüyüş", "AVM gezisi", "Deniz keyfi", "Gece hayatı"],
    hotels: ["Titanic Mardan Palace", "Akra Hotel Antalya", "Susesi Luxury Resort", "Rixos Downtown Antalya", "Barut Lara", "Sheraton Grand Doha (Lara aynı kuşak)", "Delphin Imperial Hotel"],
    distance: "Antalya Havalimanı'na yaklaşık 13 km",
    duration: "Yaklaşık 15 – 25 dakika",
    tips: [
      "Lara, havalimanına en yakın bölgelerden biridir; kısa mesafe için de sabit fiyat uyguluyoruz.",
      "Titanic Mardan Palace ve Akra Hotel gibi büyük rezidanslar için özel karşılama hizmetimiz mevcuttur.",
      "Düden Şelalesi'nin denize döküldüğü noktayı görmek için akşam üstü ideal; transferinizi buna göre planlayın.",
      "Lara bölgesindeki otellerin bazıları kapalı sahaya sahiptir; giriş kodunu şoförümüz önceden edinir."
    ]
  },
  "Konyaaltı": {
    title: "Mavi Bayraklı Sahil Şeridi: Konyaaltı Rehberi",
    about: "Beydağları manzarası eşliğinde uzanan Konyaaltı Sahili, dünyanın en güzel şehir plajlarından biridir. Modern kafeleri, yürüyüş yolları ve canlı atmosferiyle Antalya'nın kalbinin attığı yerdir.",
    places: ["Konyaaltı Sahili", "Antalya Akvaryum", "Tünektepe Teleferik", "Minicity"],
    dining: ["Food in Box", "Shakespeare Coffee & Bistro", "Vahap Usta Et Restaurant"],
    activities: ["Sahilde bisiklet turu", "Akvaryum gezisi", "Teleferik ile manzara seyri", "Deniz ve güneş keyfi"]
  },

  // --- Belek Bölgesi ---
  "Belek": {
    title: "Golf ve Doğa Tutkunlarının Cenneti: Belek",
    about: "Çam ormanlarının denizle kucaklaştığı Belek, dünya standartlarında golf sahaları ve ultra lüks tesisleriyle tanınır. Sessiz, sakin ve kaliteli bir tatil arayanlar için mükemmeldir.",
    places: ["The Land of Legends", "Aspendos Tiyatrosu", "Perge Antik Kenti", "Belek Halk Plajı", "Dinler Bahçesi"],
    dining: ["Nemo Restaurant", "Piazzetta Italiana", "Belek Çarşı Restoranları"],
    activities: ["Golf oynamak", "Theme park eğlencesi", "Spa & Wellness", "Konser etkinlikleri"],
    hotels: ["Regnum Carya Golf & Spa Resort", "Cornelia Diamond Golf Resort & Spa", "Antalya Belek (ex. Gloria Golf Resort)", "Sueno Hotels Golf Belek", "Calista Luxury Resort", "Adam & Eve Hotel", "Rixos Premium Belek"],
    distance: "Antalya Havalimanı'na yaklaşık 35 km",
    duration: "Yaklaşık 30 – 40 dakika",
    tips: [
      "Golf ekipmanınız varsa önceden belirtin; araçlarımız fazla bagaja uygun şekilde hazırlanır.",
      "Belek otellerinin büyük çoğunluğu kapalı site içindedir; şoförümüz doğru kapıdan giriş yapacak şekilde yönlendirilir.",
      "The Land of Legends ziyareti için sabah erken saatlerde transfer tercih edin.",
      "Aspendos Antik Tiyatrosu'na transfer de hizmetlerimiz arasında yer almaktadır."
    ]
  },
  "Boğazkent": {
    title: "Kuş Cenneti ve Huzur: Boğazkent",
    about: "Belek'in hemen yanı başında, doğası bozulmamış ve kuş cennetine ev sahipliği yapan sakin bir beldedir. Kalabalıktan uzak, huzurlu bir deniz tatili sunar.",
    places: ["Boğazkent Kuş Cenneti", "Halk Plajı", "Köprüçay Deltası"],
    dining: ["Sahil Balıkçıları", "Yöresel Gözlemeciler"],
    activities: ["Kuş gözlemi", "Doğa yürüyüşü", "Sakin plaj günü"]
  },
  "Denizyaka": {
    title: "Mavinin En Sakin Tonu: Denizyaka",
    about: "Antalya'nın huzurlu köşelerinden Denizyaka, lüks otelleri ve geniş kumsalıyla bilinir. Manavgat ve Belek arasında stratejik bir konuma sahiptir.",
    places: ["Lyra Park AVM", "Denizyaka Sahili"],
    dining: ["Otel Restoranları", "Yol üstü lezzet durakları"],
    activities: ["Otel aktiviteleri", "Plaj voleybolu", "Su sporları"]
  },

  // --- Side ve Manavgat Bölgesi ---
  "Side": {
    title: "Antik Kentin Büyüsü: Side Rehberi",
    about: "Tarihin içinde bir tatile ne dersiniz? Side, antik tiyatrosu, Apollon Tapınağı ve çarşısı ile yaşayan bir tarihtir. Gün batımını tapınakların yanında izlemek paha biçilemez.",
    places: ["Apollon Tapınağı", "Side Antik Tiyatrosu", "Side Müzesi", "Manavgat Şelalesi"],
    dining: ["Orfoz Restaurant", "Karma Restaurant", "Liman Restoranları"],
    activities: ["Antik kent gezisi", "Gün batımı izleme", "Tekne turu", "Çarşı alışverişi"],
    hotels: ["Barut Acanthus & Cennet", "Asteria Sorgun Hotel", "Sentido Zeynep Golf & Spa", "IC Hotels Residence", "Wow Side Hotel", "Silence Beach Resort", "Aska Just In Beach"],
    distance: "Antalya Havalimanı'na yaklaşık 65 km",
    duration: "Yaklaşık 55 dakika – 1 saat 10 dakika",
    tips: [
      "Side antik çarşısı özellikle akşam saatlerinde büyüleyici bir atmosfer sunar; bölgeye gece geç varışlar için transferinizi planlayın.",
      "Manavgat Şelalesi ve Side'yi aynı günde görmek isteyenler için şehir içi tur transferi de ayarlayabiliriz.",
      "Bazı Side otelleri plaj ve ana binadan ayrı konumdadır; kapınıza kadar teslim güvencemiz geçerlidir.",
      "Sezon yoğunluğunda (Temmuz-Ağustos) havalimanı taksilerinde uzun bekleme süreleri yaşanabilir; önceden rezervasyon yaptırın."
    ]
  },
  "Manavgat": {
    title: "Şelalelerin ve Doğanın Kenti: Manavgat",
    about: "Ünlü şelalesi ve ırmağıyla Manavgat, doğa severler için kaçırılmayacak bir rotadır. Irmak kenarında kahvaltı yapmak veya tekne turuna çıkmak buranın klasiğidir.",
    places: ["Manavgat Şelalesi", "Manavgat Irmağı", "Külliye Camii", "Seleukeia Antik Kenti"],
    dining: ["Irmak Kenarı Balık Restoranları", "Sultan Sofrası"],
    activities: ["Irmak tekne turu", "Şelale ziyareti", "Pazar alışverişi (Büyük Pazar)"],
    hotels: ["Selectum Colours Side", "Ali Bey Club Manavgat", "Ring Beach Hotel", "Aska Baran Resort"],
    distance: "Antalya Havalimanı'na yaklaşık 72 km",
    duration: "Yaklaşık 1 saat – 1 saat 15 dakika",
    tips: [
      "Manavgat haftalık pazarı genellikle Perşembe günleri kurulur; alışveriş için sabah saatlerinde planlayın.",
      "Manavgat Şelalesi ve Side'yi aynı gün görmek isteyenler için kombinasyon tur transferi düzenliyoruz.",
      "Irmak kenarındaki restoranlar için akşam üstü transfer tercih edin; gün batımında manzara muhteşemdir.",
      "Side-Manavgat bölgesinde birden fazla nokta arasında sizi taşıyabiliriz; şoförünüz bekleyebilir."
    ]
  },
  "Kumköy": {
    title: "Eğlence ve Deniz: Kumköy Tatil Rehberi",
    about: "Side'nin en hareketli bölgelerinden Kumköy, ince kumlu plajları ve renkli gece hayatıyla bilinir. Gençler ve aileler için ideal bir tatil noktasıdır.",
    places: ["Kumköy Plajı", "Kumköy Çarşısı"],
    dining: ["Bistro 2000", "Bulvar Restoranları"],
    activities: ["Plaj partileri", "Alışveriş", "Su sporları"]
  },
  "Çolaklı": {
    title: "Altın Sarısı Kumsallar: Çolaklı",
    about: "Geniş ve sığ deniziyle çocuklu ailelerin favorisi olan Çolaklı, büyük otellerin ve konforlu tatilin adresidir.",
    places: ["Çolaklı Halk Plajı", "Side West Beach"],
    dining: ["Otel büfeleri", "Yerel pideciler"],
    activities: ["Deniz keyfi", "Sahil yürüyüşü", "Animasyon gösterileri"]
  },
  "Evrenseki": {
    title: "Modern ve Düzenli: Evrenseki Sahili",
    about: "Side bölgesinin en yeni ve düzenli sahil bandına sahip Evrenseki, yürüyüş yolları, parkları ve temiz deniziyle öne çıkar.",
    places: ["Evrenseki Kültür Evi", "Sahil Parkı", "Halk Plajı"],
    dining: ["Sahil Kafeteryaları", "Liman Restoran"],
    activities: ["Sabah yürüyüşü", "Voleybol", "Kültür evi ziyareti"]
  },
  "Gündoğdu": {
    title: "Sakinlik Arayanlara: Gündoğdu",
    about: "Side'nin batısında yer alan Gündoğdu, sakin atmosferi ve muhteşem kumsalıyla bilinir. Kalabalıktan uzaklaşmak isteyenler için birebirdir.",
    places: ["Gündoğdu Plajı", "Sarısu Deresi"],
    dining: ["Yöresel Gözlemeciler", "Balık Evi"],
    activities: ["Gün batımı yürüyüşü", "Deniz kaplumbağası gözlemi (sezonunda)"]
  },
  "Sorgun": {
    title: "Çam Ormanlarının İçinde: Sorgun",
    about: "Sorgun, meşhur çam ormanlarıyla çevrili, doğayla iç içe bir bölgedir. Titreyengöl'e yakınlığı ve yeşil doğası ile fark yaratır.",
    places: ["Sorgun Ormanı", "Titreyengöl", "Sorgun Plajı"],
    dining: ["Göl Kenarı Restoranları", "Orman Piknik Alanları"],
    activities: ["Doğa yürüyüşü", "Bisiklet turu", "Kuş gözlemi"]
  },
  "Titreyengöl": {
    title: "Göl ve Denizin Buluşması: Titreyengöl",
    about: "Adını rüzgarla hafifçe titreyen suyundan alan bu göl, etrafındaki yürüyüş parkurları ve otellerle popüler bir turizm merkezidir.",
    places: ["Titreyengöl", "Manavgat Nehri ağzı"],
    dining: ["Göl manzaralı kafeler"],
    activities: ["Göl çevresinde yürüyüş", "Balık tutma", "Fotoğrafçılık"]
  },
  "Kızılağaç": {
    title: "Doğal Güzellikler: Kızılağaç",
    about: "Manavgat'ın doğusunda yer alan Kızılağaç, geniş tatil köyleri ve ağaçlı yollarıyla bilinir. Sessiz ve huzurlu bir bölgedir.",
    places: ["Kızılağaç Sahili", "Nympheum (Yakın)"],
    dining: ["Yöresel köy kahvaltıları"],
    activities: ["Otel aktiviteleri", "Pazar gezisi"]
  },
  "Kızılot": {
    title: "Bakir Kıyılar: Kızılot Rehberi",
    about: "Turizmin daha sakin yaşandığı Kızılot, doğal kıyı şeridi ve huzurlu atmosferiyle kafa dinlemek isteyenler için idealdir.",
    places: ["Kızılot Plajı"],
    dining: ["Yol üstü tesisleri", "Sahil büfeleri"],
    activities: ["Kitap okuma", "Deniz keyfi", "Dinlenme"]
  },

  // --- Alanya Bölgesi ---
  "Alanya": {
    title: "Güneşin Gülümsediği Şehir: Alanya",
    about: "Selçuklu'nun kışlık başkenti, korsanların eski limanı... Alanya, kalesi, mağaraları ve bitmek bilmeyen gece hayatıyla tam bir tatil kompleksidir.",
    places: ["Alanya Kalesi", "Kleopatra Plajı", "Damlataş Mağarası", "Dim Çayı", "Kızılkule"],
    dining: ["Mezza Natural", "Dim Çayı Restoranları", "Yöresel Alanya Bohçası"],
    activities: ["Teleferik turu", "Tekne turu", "Gece kulüpleri", "Mağara gezisi"],
    hotels: ["Rixos Premium Tekirova", "Kirman Leodikya Resort", "Granada Luxury Alanya", "Kirman Hotels Belazur", "Delphin BE Grand Resort", "Utopia World Hotel"],
    distance: "Antalya Havalimanı'na yaklaşık 125 km",
    duration: "Yaklaşık 1 saat 30 dakika – 1 saat 45 dakika",
    tips: [
      "Uçuşunuzdan önce WhatsApp üzerinden rezervasyon yapın; havalimanında araç kuyruğu beklemenize gerek kalmaz.",
      "Gece geç saatlerde inen uçuşlar için 7/24 hizmetimizden faydalanabilirsiniz.",
      "Kleopatra Plajı'na en yakın oteller için önceden konum paylaşın, kapınıza kadar geliyoruz.",
      "Alanya Kalesi'ni görmek isteyenler için sabah erken saatlerde başlamak kalabalığı önler."
    ]
  },
  "Konaklı": {
    title: "Eğlence ve Konfor: Konaklı",
    about: "Alanya'ya çok yakın olan Konaklı, kendi çarşısı, gece kulüpleri ve lüks otelleriyle küçük bir şehir gibidir.",
    places: ["Konaklı Saat Kulesi", "Şarapsa Hanı", "Summer Garden Club"],
    dining: ["Konaklı Çarşı Lokantaları", "Villa Augusto Restaurant"],
    activities: ["Gece hayatı", "Çarşı gezisi", "Kültürel turlar not"]
  },
  "Avsallar": {
    title: "İncekum'un Komşusu: Avsallar",
    about: "Dünyaca ünlü İncekum plajına ev sahipliği yapan Avsallar, sığ ve temiz deniziyle bilinir. Bölgedeki oteller yüksek kalitededir.",
    places: ["İncekum Plajı", "Avsallar Çarşısı"],
    dining: ["Garden&Bar Restaurant", "Yöresel Pideciler"],
    activities: ["Deniz keyfi", "Haftalık pazar alışverişi"]
  },
  "İncekum": {
    title: "Altın Sarısı Kumsal: İncekum Rehberi",
    about: "Adı üzerinde, incecik kumuyla meşhur bu bölge, bölgenin en iyi plajına sahiptir. Çam ormanları içinde kamp ve piknik alanları da mevcuttur.",
    places: ["İncekum Tabiat Parkı", "Halk Plajı"],
    dining: ["Orman kampı kafeleri", "Yol üstü restoranları"],
    activities: ["Kamp", "Piknik", "Yüzme"]
  },
  "Okurcalar": {
    title: "Büyük Otellerin Adresi: Okurcalar",
    about: "Alanya ve Side arasında yer alan Okurcalar, genellikle büyük resort otellerin bulunduğu, tesis içi tatilin ön planda olduğu bir bölgedir.",
    places: ["Alara Grand Bazaar", "Water Planet Aqua Park"],
    dining: ["Otel restoranları"],
    activities: ["Aquapark eğlencesi", "Bazaar alışverişi"]
  },
  "Türkler": {
    title: "Sakin ve Yeşil: Türkler Beldesi",
    about: "Alanya'nın gelişen bölgelerinden Türkler, modern otelleri ve Sealanya Dolphinpark ile aileler için cazip bir seçenektir.",
    places: ["Sealanya Dolphinpark", "Türkler Plajı"],
    dining: ["Liman Restoranları"],
    activities: ["Yunus gösterileri", "Deniz keyfi"]
  },
  "Mahmutlar": {
    title: "Alanya'nın Modern Yüzü: Mahmutlar",
    about: "Yerleşik yabancı nüfusun yoğun olduğu Mahmutlar, uzun sahil şeridi, modern kafeleri ve kozmopolit yapısıyla dikkat çeker.",
    places: ["Naula Antik Kenti", "Mahmutlar Sahili"],
    dining: ["Rus ve İskandinav Restoranları", "Jungleman Cafe"],
    activities: ["Sahil yürüyüşü", "Dünya mutfaklarını deneme", "Bisiklet"]
  },
  "Kestel": {
    title: "Huzurlu Yaşam: Kestel",
    about: "Alanya merkeze yakın ama gürültüden uzak... Kestel, az katlı yapıları ve sakin sahiliyle huzurlu bir konaklama sunar.",
    places: ["Dim Çayı (Denize dökülen kısım)", "Kestel Sahil Parkı"],
    dining: ["Sahil kafeleri"],
    activities: ["Balık tutma", "Yürüyüş"]
  },
  "Kargıcak": {
    title: "Manzara ve Doğa: Kargıcak",
    about: "Torosların eteklerinde, muz bahçeleri arasında yer alan Kargıcak, muhteşem Alanya manzarası ve lüks villalarıyla bilinir.",
    places: ["Syedra Antik Kenti", "Muz Bahçeleri"],
    dining: ["Manzaralı dağ restoranları"],
    activities: ["Antik kent yürüyüşü", "Doğa fotoğrafçılığı"]
  },

  // --- Kemer Bölgesi ---
  "Kemer": {
    title: "Doğa ile Eğlencenin Dansı: Kemer",
    about: "Dağların denize dik indiği, her ton mavinin yeşille buluştuğu Kemer; gece hayatı, marinası ve plajlarıyla eşsizdir.",
    places: ["Ayışığı Parkı", "Yörük Parkı", "Kemer Marina", "Idyros Antik Kenti"],
    dining: ["Qualista Restaurant", "Liman Caddesi Mekanları"],
    activities: ["Tekne turu", "Gece kulüpleri (Aura, Inferno)", "Jeep safari"],
    hotels: ["Rixos Premium Tekirova", "Club Hotel Phaselis Rose", "Amara Prestige Hotel", "Paloma Renaissance Antalya Beach Resort", "TUI MAGIC LIFE Waterworld Belek", "Club Med Palmiye", "Barut Hemera"],
    distance: "Antalya Havalimanı'na yaklaşık 45 km",
    duration: "Yaklaşık 45 dakika – 1 saat",
    tips: [
      "Kemer'e gidiş rotası dağlık ve kıvrımlı; çocuklar ve deniz tutanlar için özel konfor araçlarımızı tercih edin.",
      "Tahtalı Dağı teleferik istasyonuna transfer için ayrı rezervasyon açabilirsiniz.",
      "Marina bölgesindeki oteller için liman girişini şoförümüz bilmektedir; endişelenmeyin.",
      "Gece kulüplerine gidiş-dönüş transfer için saatlik kiralama seçeneğimiz de mevcuttur."
    ]
  },
  "Göynük": {
    title: "Kanyonların Arasında: Göynük",
    about: "Muhteşem kanyonu ve doğa parkurlarıyla Göynük, macera severler için bir cennet. Doğal güzellikleri ve lüks otelleri bir arada sunar.",
    places: ["Göynük Kanyonu", "Dinopark"],
    dining: ["Kanyon girişindeki tesisler", "Yöresel kahvaltıcılar"],
    activities: ["Kanyoning", "Zipline", "Trekking"]
  },
  "Beldibi": {
    title: "Dağ ve Deniz Arasında: Beldibi",
    about: "Kemer'in girişinde yer alan Beldibi, sahil boyunca uzanan otelleri ve arkasındaki heybetli dağ manzarasıyla bilinir. Mağarasıyla da tarih öncesine ışık tutar.",
    places: ["Beldibi Mağarası", "Sahil Parkı"],
    dining: ["Balık restoranları", "Çay bahçeleri"],
    activities: ["Mağara ziyareti", "Yüzme", "Doğa yürüyüşü"]
  },
  "Çamyuva": {
    title: "Zeytin ve Portakal Bahçeleri: Çamyuva",
    about: "Doğal dokusunu koruyan, sakin ve şirin bir tatil beldesi. DoluSu Park gibi eğlence merkezlerine ev sahipliği yapar.",
    places: ["DoluSu Park", "Çamyuva Plajı"],
    dining: ["Monte Lara Restaurant", "Ciğerci Şahin"],
    activities: ["Su kaydırakları", "Atv safari", "Sahil keyfi"]
  },
  "Kiriş": {
    title: "Lüks ve Konfor: Kiriş",
    about: "Kemer merkeze komşu olan Kiriş, yüksek kaliteli tatil köyleri ve temiz deniziyle öne çıkar.",
    places: ["Kiriş Sahili", "Alışveriş Caddesi"],
    dining: ["Otel restoranları"],
    activities: ["Su sporları", "Otel aktiviteleri"]
  },
  "Tekirova": {
    title: "Üç Adalar Manzarası: Tekirova",
    about: "Kemer'in en elit bölgelerinden biridir. Phaselis antik kentine yakınlığı, Tahtalı Dağı'nın en iyi göründüğü nokta olmasıyla ayrıcalıklıdır.",
    places: ["Phaselis Antik Kenti", "Olympos Teleferik", "Eko Park", "Üç Adalar (Dalış)"],
    dining: ["Ulupınar Restoranları (Yakın)", "Tekirova Çarşı"],
    activities: ["Antik kent gezisi", "Teleferik", "Dalış turu"]
  },
  "Çıralı": {
    title: "Doğanın Kucağında: Çıralı",
    about: "Betonlaşmanın olmadığı, caretta carettaların yuvası, portakal bahçeleri içindeki pansiyonlarıyla Çıralı, huzurun diğer adıdır.",
    places: ["Yanartaş (Chimera)", "Olimpos Antik Kenti", "Çıralı Sahili"],
    dining: ["Karakuş Restaurant", "Yörük Restoran"],
    activities: ["Yanartaş tırmanışı", "Yoga", "Bisiklet turu"]
  },
  "Olimpos": {
    title: "Ağaç Evler ve Tarih: Olimpos",
    about: "Sırt çantalı gezginlerin, doğa aşıklarının buluşma noktası. Antik kent kalıntıları arasından denize girmek büyüleyici bir deneyim.",
    places: ["Olimpos Antik Kenti", "Korsan Koyu"],
    dining: ["Pansiyon yemekleri", "Gözleme evleri"],
    activities: ["Kaya tırmanışı", "Antik kent keşfi", "Tekne turu"]
  },
  "Adrasan": {
    title: "Sakin Koyların Adresi: Adrasan",
    about: "Rüzgardan korunaklı koyu, cam gibi deniziyle Adrasan, tekne turlarının (Suluada) başlangıç noktasıdır.",
    places: ["Suluada", "Adrasan Deresi", "Gelidonya Feneri (Parkur başı)"],
    dining: ["Dere kenarı restoranları", "Chill House Lounge"],
    activities: ["Suluada tekne turu", "Kano", "Likya Yolu yürüyüşü"]
  },

  // --- Kaş/Kalkan/Diğer ---
  "Kaş": {
    title: "Aşkın ve Mavinin Kenti: Kaş",
    about: "Her sokağı denize çıkan, begonvillerle süslü, kendine has ruhu olan kasaba. Dalış, yamaç paraşütü ve gün batımı burada bir başkadır.",
    places: ["Kaputaş Plajı", "Antiphellos Tiyatrosu", "Uzun Çarşı", "Hidayet Koyu"],
    dining: ["Zaika Ocakbaşı", "Bi Lokma", "L'Apéro"],
    activities: ["Dalış (Scuba)", "Meis Adası turu", "Yamaç paraşütü", "Caz dinletileri"],
    hotels: ["Hillside Beach Club (yakın bölge)", "Villa Mahal Kaş", "Kaş Arkin Club Hotel", "Olive Garden Hotel Kaş", "Aquapark Hotel Kaş"],
    distance: "Antalya Havalimanı'na yaklaşık 185 km",
    duration: "Yaklaşık 2 saat 30 dakika – 3 saat",
    tips: [
      "Kaş uzak bir mesafede olduğundan çocuklu aileler için konforlu minibüs transferi tercih edilmelidir.",
      "Kaputaş Plajı yol kenarındadır; transferiniz sırasında bir mola verebilirsiniz, şoförünüze bildirin.",
      "Meis Adası feribot saatlerine göre transfer saatinizi planlayın; biz de size yardımcı olabiliriz.",
      "Uzun yol için araçlarımızda Wi-Fi ve şarj imkanı mevcuttur."
    ]
  },
  "Kalkan": {
    title: "Romantizm ve Lüks: Kalkan",
    about: "Beyaz badanalı evleri, dar sokakları ve sonsuzluk havuzlu villalarıyla Türkiye'nin en sofistike tatil beldelerinden biridir.",
    places: ["Kaputaş Plajı", "Patara Plajı", "Kalkan Marina"],
    dining: ["Salonika 1881", "Aubergine", "Teras restoranlar"],
    activities: ["Villa keyfi", "Beach club", "Romantik akşam yemekleri"],
    hotels: ["Patara Prince Hotel & Resort", "Club Patara Kelebek Hotel", "Villa Kalkan", "Harbour View Hotel Kalkan", "Pirat Hotel Kalkan"],
    distance: "Antalya Havalimanı'na yaklaşık 200 km",
    duration: "Yaklaşık 2 saat 45 dakika – 3 saat 15 dakika",
    tips: [
      "Kalkan'ın dar ve yokuşlu sokakları için küçük araç yerine standart sedan veya Vito tercih edin.",
      "Patara Plajı, Kalkan'dan yaklaşık 20 dakika uzaklıktadır; günlük transfer ayarlayabiliriz.",
      "Gece geç saatlerde bölgeye ulaşıyorsanız şoförünüz yol bilgisi açısından önceden bilgilendirilir.",
      "Kaş ve Kalkan arasındaki transferleri de sağlıyoruz; iki bölge arası gezi planı yapabilirsiniz."
    ]
  },
  "Finike": {
    title: "Portakalın Başkenti: Finike",
    about: "Dünyanın en lezzetli portakallarının yetiştiği, sakin liman kenti. Arykanda Antik Kenti gibi gizli hazinelere ev sahipliği yapar.",
    places: ["Arykanda Antik Kenti", "Andrea Doria Koyu", "Gökliman Plajı"],
    dining: ["Finike Marina Restoranları", "Şişçi İbo (Korkuteli yolunda ama meşhur)"],
    activities: ["Tarihi gezi", "Balık tutma", "Sakin yüzme"]
  },
  "Demre": {
    title: "Noel Baba'nın Toprakları: Demre",
    about: "Tarihi Myra antik kenti ve Noel Baba Kilisesi ile Hristiyan dünyası için kutsal sayılan, aynı zamanda Kekova turlarının merkezi.",
    places: ["Noel Baba Kilisesi", "Myra Antik Kenti", "Kekova (Batık Şehir)"],
    dining: ["Kaya Restaurant", "Mavi Yengeç (Denemeniz Lazım)"],
    activities: ["Kekova tekne turu", "Tarihi yerler ziyareti"]
  },
  "Kumluca": {
    title: "Verimli Topraklar ve Koylar: Kumluca",
    about: "Tarımın merkezi olmasının yanı sıra, Adrasan ve Olympos gibi cennet köşeleri sınırlarında barındıran ilçe.",
    places: ["Rhodiapolis Antik Kenti", "Korsan Koyu", "Mavikent Sahili"],
    dining: ["Yöresel esnaf lokantaları"],
    activities: ["Koy keşifleri", "Doğa gezileri"]
  },
  "Fethiye": {
    title: "Yeryüzü Cenneti: Fethiye",
    about: "Ölüdeniz'i, Kelebekler Vadisi ve Saklıkent'i ile Fethiye, sadece Türkiye'nin değil dünyanın en güzel coğrafyalarından biridir.",
    places: ["Ölüdeniz", "Kelebekler Vadisi", "Amintas Kaya Mezarları", "Paspatur Çarşısı"],
    dining: ["Balık Pazarı (Seç&Pişir)", "Mozaik Bahçe"],
    activities: ["Yamaç paraşütü", "12 Adalar tekne turu", "Likya yolu yürüyüşü"]
  },
  "Ölüdeniz": {
    title: "Dünyanın En Güzel Kumsalı: Ölüdeniz",
    about: "Turkuaz rengi denizi ve bembeyaz kumsalıyla bir kartpostal karesi. Babadağ'dan süzülen paraşütleri izleyerek denize girmek eşsizdir.",
    places: ["Belcekız Plajı", "Kumburnu", "Babadağ"],
    dining: ["Buzz Beach Bar", "Oyster Restaurant"],
    activities: ["Babadağ Teleferik", "Yamaç paraşütü", "Kano"]
  },
  "Göcek": {
    title: "Mavi Yolculuğun Kalbi: Göcek",
    about: "Dünyaca ünlü marinaları, dantel gibi işlenmiş koyları ve adalarıyla tekne tutkunlarının vazgeçilmez adresidir.",
    places: ["12 Adalar", "Göcek Marina", "Bedri Rahmi Koyu"],
    dining: ["West Cafe", "Can Restaurant", "Lotis Kitchen"],
    activities: ["Özel tekne kiralama", "Koy turları", "Akşam yemeği"]
  },
  "Marmaris": {
    title: "Ege ve Akdeniz'in Buluşması: Marmaris",
    about: "Çam ormanlarıyla kaplı dağların çevrelediği Marmaris, uzun sahil şeridi, kalesi ve hareketli limanıyla her zaman canlıdır.",
    places: ["Marmaris Kalesi", "İçmeler Plajı", "Turunç", "Kızkumu"],
    dining: ["Marmaris Marina Restoranları", "Pineapple"],
    activities: ["Mavi tur", "Jeep safari", "Dalyan turu"]
  },
  "Bodrum": {
    title: "Beyaz Evler ve Begonviller: Bodrum",
    about: "Türkiye'nin en popüler tatil destinasyonu. Kalesi, Halikarnas Mozolesi ve hiç uyumayan gece hayatıyla bir fenomendir.",
    places: ["Bodrum Kalesi", "Antik Tiyatro", "Yalıkavak Marina", "Gümüşlük"],
    dining: ["Gemibaşı", "Mimoza (Gümüşlük)", "Sünger Pizza"],
    activities: ["Bodrum geceleri", "Mavi yolculuk", "Sanat ve konser etkinlikleri"]
  },
  "Dalaman": {
    title: "Bölgenin Ulaşım Üssü: Dalaman",
    about: "Sarsala Koyu gibi gizli güzelliklere sahip olan Dalaman, genellikle havalimanıyla bilinse de termal kaynakları ve rafting çayıyla da değerlidir.",
    places: ["Sarsala Koyu", "Dalaman Çayı", "Kükürt Kaplıcaları"],
    dining: ["Çınar Restaurant", "Sığla Restaurant"],
    activities: ["Rafting", "Kaplıca ziyareti", "Koy gezisi"]
  }
};

// Generates a realistic 2026 date spread from Jan 5 to Mar 19
function blogDate(index: number): string {
  const total = SCRAPED_REGIONS.length;
  const startDay = 5;  // Jan 5, 2026
  const endDay = 78;   // Mar 19, 2026
  const variance = [0, 1, -1, 2, 0, -1, 1, 0, 2, -1][index % 10];
  const day = Math.min(endDay, Math.max(startDay,
    Math.round(startDay + (index / Math.max(total - 1, 1)) * (endDay - startDay)) + variance
  ));
  const d = new Date(2026, 0, day);
  return d.toISOString().split('T')[0];
}

export const BLOG_POSTS: BlogPost[] = SCRAPED_REGIONS.map((region, index) => {
  const slug = region.name.toLowerCase()
    .replace(/ /g, '-')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[üÜ]/g, 'u')
    .replace(/[şŞ]/g, 's')
    .replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[çÇ]/g, 'c')
    .replace(/[^a-z0-9-]/g, '');

  const details = REGION_DETAILS[region.name] || REGION_DETAILS[Object.keys(REGION_DETAILS).find(k => region.name.includes(k)) || ""] || {
    title: `${region.name} Gezi Rehberi: Ulaşım ve İpuçları`,
    about: `${region.name}, Antalya'nın keşfedilmeyi bekleyen özel köşelerinden biridir. Sessizliği, doğası ve temiz deniziyle ziyaretçilerine huzurlu bir tatil vaat eder.`,
    places: ["Bölge Plajı", "Çarşı Merkezi", "Yakın Tarihi Kalıntılar"],
    dining: ["Sahil Restoranları", "Yöresel Lezzet Durakları"],
    activities: ["Deniz ve güneş keyfi", "Doğa yürüyüşü", "Dinlenme"]
  };

  const regionSlugLower = region.name.toLowerCase();
  const hasHotels = details.hotels && details.hotels.length > 0;
  const hasTips = details.tips && details.tips.length > 0;
  const distanceInfo = details.distance || `Antalya Havalimanı'ndan ${region.name} bölgesine mesafe trafiğe bağlı olarak değişmektedir`;
  const durationInfo = details.duration || 'Yaklaşık süre trafiğe ve güzergâha göre değişmektedir';

  return {
    id: `blog-${index + 1}`,
    slug: `${slug}-transfer-rehberi`,
    title: `${region.name} Transfer | Antalya Havalimanı (AYT) → ${region.name} VIP Ulaşım 2026`,
    excerpt: `Antalya Havalimanı'ndan (AYT) ${region.name}'ye özel VIP transfer. Sabit fiyat, karşılama, ücretsiz bebek koltuğu dahil. 7/24 WhatsApp rezervasyon. ${region.name} gezilecek yerler ve seyahat rehberi.`,
    content: `# ${region.name} Transfer | Antalya Havalimanı (AYT) → ${region.name} VIP Ulaşım 2026

${details.about}

**Ata Flug Transfer** olarak, **Antalya Havalimanı (AYT)**'ndan **${region.name}**'ye özel VIP transfer hizmeti sunuyoruz. Mercedes Vito ve Sprinter araç filomuz, profesyonel şoförlerimiz ve 7/24 WhatsApp desteğimizle tatiliniz havalimanından itibaren başlasın. **En ucuz fiyat garantisi** ve **sabit fiyat** politikamızla sürpriz ücretler tarih oldu.

---

## Antalya Havalimanı'ndan ${region.name}'ye Ulaşım: Mesafe ve Süre

- **Mesafe:** ${distanceInfo}
- **Tahmini Süre:** ${durationInfo}
- **Güzergâh:** D400 karayolu üzerinden en hızlı güzergah kullanılır; yoğun sezonlarda alternatif rotalar tercih edilir.

> Şoförümüz uçuşunuzu canlı olarak takip eder. Rötarınız olsa bile sizi bekler — ek ücret talep etmeden.

---

## Özel Transfer mi, Paylaşımlı Transfer mi? Fark Nedir?

Türkiye'de havalimanı transferi için iki temel seçenek bulunur. Doğru kararı verebilmek için aralarındaki farkları bilmek önemlidir:

| Özellik | **Özel Transfer (Ata Flug)** | Paylaşımlı Transfer |
|---|---|---|
| Araç | Yalnızca size özel | Birden fazla yolcu |
| Bekleme | Yok, direkt hareket | Diğer yolcular toplanır |
| Fiyat | Sabit, önceden bilinen | Değişken veya kişi başı |
| Bagaj | Sınırsız (araç kapasitesi kadar) | Kısıtlı |
| Bebek Koltuğu | Ücretsiz dahil | Çoğunlukla ücretli / yok |
| Karşılama | İsim tabelası ile terminal çıkışında | Belirli bir buluşma noktası |
| 7/24 Hizmet | Evet | Genellikle sınırlı saatler |

**Özel transfer**, aile tatillerinde, yorucu uzun uçuş sonrasında ve lüks konaklama yapan misafirler için açık ara daha konforlu ve hesaplı bir seçenektir.

---

## Neden Ata Flug Transfer?

${region.name}'ye giden yüzlerce misafir Ata Flug Transfer'i tercih ediyor. İşte 5 temel neden:

- **Sabit ve Şeffaf Fiyat:** Rezervasyon anında öğrendiğiniz fiyat, ödediğiniz fiyattır. Taksi tezgahları, gece tarifeleri veya bagaj ücretleri yoktur.
- **Ücretsiz Bebek ve Çocuk Koltuğu:** Tüm transferlerimizde bebek koltuğu ve çocuk oturağı ücretsiz sağlanır; rezervasyonda belirtmeniz yeterli.
- **Uçuş Takibi & Ücretsiz Bekleme:** Uçuşunuz rötarlı olsa bile şoförümüz sizi bekler. Ek ücret talep edilmez.
- **Meet & Greet Karşılama:** Terminal çıkışında isminizin yazılı olduğu tabela ve WhatsApp konum paylaşımı ile şoförünüzü kolayca bulursunuz.
- **7/24 Hizmet, Gece Ücreti Yok:** Gece 02:00 veya 04:00'te inen uçuşlar için bile ek ücret uygulanmaz.

---

## ${region.name} Bölgesinde Gezilecek Yerler

${region.name} ve çevresinde görmeniz gereken başlıca noktalar:

${details.places.map(place => `- **${place}**: Bölgenin en popüler noktalarından biri. Ziyaret listenize mutlaka ekleyin.`).join('\n')}

${hasHotels ? `---

## ${region.name} Bölgesindeki Popüler Oteller

Bölgede konaklayan misafirlerimizin sıklıkla tercih ettiği oteller:

${details.hotels!.map(hotel => `- **${hotel}**`).join('\n')}

> Bu otellerin tamamına kapıdan kapıya transfer hizmeti sunuyoruz. Otel isminizi rezervasyon formuna ekleyin; şoförümüz doğru girişe yönlendirilir.` : ''}

---

## ${region.name} Yeme & İçme Rehberi

"Nerede ne yenir?" diyorsanız, işte önerilerimiz:

${details.dining.map(food => `- **${food}**: Bölge mutfağını yansıtan, yerel ve turistlerin favorisi mekanlardan biri.`).join('\n')}

---

## ${region.name}'de Yapılabilecek Aktiviteler

Tatilinizi renklendirecek aktivite önerileri:

${details.activities.map(act => `- **${act}**: ${region.name}'nin sunduğu en keyifli deneyimlerden biri.`).join('\n')}

---

${hasTips ? `## ${region.name} Transfer İpuçları

${details.tips!.map(tip => `- ${tip}`).join('\n')}

---

` : ''}## Sıkça Sorulan Sorular (SSS) — ${region.name} Transfer

### Antalya Havalimanı'ndan ${region.name}'ye transfer ne kadar sürer?
${durationInfo}. Hava durumu ve yol koşullarına bağlı olarak hafif değişim olabilir. Şoförümüz en hızlı güzergahı kullanır.

### ${region.name} transferi için fiyat nasıl öğrenilir?
WhatsApp üzerinden bize mesaj atmanız yeterlidir: **[+90 505 228 15 96](https://wa.me/905052281596)**. Gideceğiniz otel veya adresin adını yazın, birkaç dakika içinde sabit fiyat teklifi alırsınız.

### Araçta bebek koltuğu var mı?
Evet. Tüm transferlerimizde bebek koltuğu ve çocuk oturağı **ücretsiz** olarak sağlanır. Rezervasyon sırasında çocuk yaşını belirtmeniz yeterlidir.

### Uçuşum rötar yaparsa ne olur?
Uçuşunuzu anlık takip ediyoruz. Rötarınız olsa bile şoförünüz sizi bekler; herhangi bir ek ücret talep edilmez.

### Gece geç saatlerde transfer yapıyor musunuz?
Evet, **7/24** hizmet sunuyoruz. Gece 01:00, 02:00 veya 04:00'te inen uçuşlar için ek gece ücreti uygulanmaz.

### Nasıl ödeme yapabilirim?
Nakit (TL, EUR, USD, GBP) veya kredi kartı ile araç içinde ödeme yapabilirsiniz. Ödeme genellikle transfer sonrasında alınır.

### Büyük grup transferi mümkün mü?
Evet. 16 kişiye kadar gruplar için Mercedes Sprinter araçlarımız mevcuttur. Daha büyük gruplar için birden fazla araç organize edebiliriz.

### Havalimanında şoförümü nasıl bulurum?
Şoförünüz çıkış kapısında isminizin yazılı olduğu tabela ile sizi karşılar. Ayrıca WhatsApp üzerinden anlık konum paylaşımı yapılır.

---

## ${region.name} Transfer Rezervasyonu — Hemen Fiyat Alın

Antalya Havalimanı (AYT) çıkışında sizi bekleyen, konforlu ve güvenilir özel transfer için şimdi rezervasyon yapın:

**[WhatsApp ile Anlık Fiyat Al & Rezervasyon Yap →](https://wa.me/905052281596)**

Diğer bölgeler ve transfer güzergahları için [tüm bölgeler sayfamızı](/bolgeler) ve [blog rehberlerimizi](/blog) inceleyebilirsiniz.`,
    featuredImage: region.image,
    category: 'Gezi ve Transfer Rehberi',
    tags: [
      'antalya transfer',
      'antalya airport transfer',
      'antalya havalimanı transfer',
      'antalya vip transfer',
      regionSlugLower,
      `${regionSlugLower} transfer`,
      `${regionSlugLower} hotel transfer`,
      `${regionSlugLower} vip transfer`,
      'özel transfer antalya',
      'gezi rehberi',
      ...details.places.slice(0, 2)
    ],
    author: 'Ata Flug Editör',
    publishedAt: blogDate(index),
    updatedAt: blogDate(index),
    seoTitle: `${region.name} Transfer | Antalya Havalimanı → ${region.name} VIP Ulaşım 2026`,
    seoDescription: `Antalya Havalimanı'ndan ${region.name}'ye özel VIP transfer. Sabit fiyat, karşılama, bebek koltuğu dahil. Hemen fiyat alın: 7/24 WhatsApp.`,
    isPublished: true,
    viewCount: 0
  };
});

import { Booking } from './types';

export const MOCK_BOOKINGS: Booking[] = [];


