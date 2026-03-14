
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
    siteTitle: 'Ata Flug Transfer | Antalya VIP Havalimanı Transfer Hizmeti',
    titleTemplate: '%s | Ata Flug Transfer',
    siteDescription: 'Antalya Havalimanı\'ndan tüm Türkiye\'ye VIP ve özel transfer hizmeti. 7/24 profesyonel sürücüler, konforlu araçlar, uygun fiyatlar.',
    siteKeywords: 'antalya transfer, antalya havalimanı transfer, vip transfer antalya, airport transfer turkey, antalya taxi, özel transfer',
    ogImage: 'https://ataflugtransfer.com/og-image.jpg',
    canonicalUrl: 'https://ataflugtransfer.com',
    googleSiteVerification: '',
    bingVerification: '',
    twitterHandle: '@ataflugtransfer',
    robotsDirective: 'index, follow',
    structuredData: {
      businessType: 'TravelAgency',
      priceRange: '€€',
      areaServed: 'Antalya, Turkey',
      openingHours: 'Mo-Su 00:00-24:00',
      latitude: '36.8841',
      longitude: '30.7056',
    },
    pagesSeo: {
      home:    { title: 'Antalya VIP Havalimanı Transfer', description: 'Antalya Havalimanı\'ndan tüm Türkiye\'ye VIP ve özel transfer hizmeti. 7/24 profesyonel sürücüler, konforlu araçlar.', keywords: 'antalya transfer, vip transfer, havalimanı transfer' },
      about:   { title: 'Hakkımızda', description: 'Ata Flug Transfer olarak 10+ yıllık deneyimimizle Antalya\'da güvenilir VIP transfer hizmeti sunuyoruz.', keywords: 'ata flug transfer hakkında, antalya transfer firması' },
      regions: { title: 'Transfer Bölgeleri', description: 'Antalya Havalimanı\'ndan Kemer, Alanya, Side, Belek ve tüm bölgelere uygun fiyatlı transfer hizmetleri.', keywords: 'kemer transfer, alanya transfer, side transfer, belek transfer' },
      blog:    { title: 'Transfer Rehberi & Blog', description: 'Antalya transfer rehberleri, bölge bilgileri ve seyahat ipuçları.', keywords: 'antalya rehber, transfer blog, antalya gezi' },
      faq:     { title: 'Sıkça Sorulan Sorular', description: 'Antalya transfer hizmeti hakkında merak ettiğiniz tüm sorular ve cevapları.', keywords: 'transfer sss, antalya transfer fiyat, nasıl rezervasyon' },
      contact: { title: 'İletişim', description: 'Ata Flug Transfer ile 7/24 iletişime geçin. WhatsApp, telefon veya e-posta ile ulaşın.', keywords: 'ata flug transfer iletişim, antalya transfer telefon' },
    },
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

export const REVIEWS = [
  // Almanca Yorumlar (35 adet)
  { id: 1, name: "Hans Müller", country: "🇩🇪", lang: "de", rating: 5, text: "Ausgezeichneter Service von Ata Flug Transfer! Der Fahrer Herr İsmail war pünktlich und sehr freundlich. Das Fahrzeug war sauber und komfortabel. Absolut empfehlenswert!" },
  { id: 2, name: "Klaus Schmidt", country: "🇩🇪", lang: "de", rating: 5, text: "Perfekter Transfer vom Flughafen Antalya zum Hotel in Belek. Herr İsmail hat auf unseren verspäteten Flug gewartet. Super Service!" },
  { id: 3, name: "Wolfgang Bauer", country: "🇩🇪", lang: "de", rating: 5, text: "Wir haben den VIP-Transfer von Ata Flug für unsere Familie gebucht. Alles war perfekt organisiert. Die Mercedes V-Klasse war sehr luxuriös." },
  { id: 4, name: "Thomas Weber", country: "🇦🇹", lang: "de", rating: 5, text: "Lieber İsmail, vielen Dank für den tollen Service! Wir kommen jedes Jahr nach Antalya und werden immer Ata Flug Transfer nutzen." },
  { id: 5, name: "Markus Fischer", country: "🇩🇪", lang: "de", rating: 5, text: "Der Fahrer hat auf unseren verspäteten Flug gewartet - 3 Stunden ohne Aufpreis! Das nenne ich Kundenservice. Danke Herr İsmail!" },
  { id: 6, name: "Stefan Huber", country: "🇨🇭", lang: "de", rating: 5, text: "Wir kommen jedes Jahr nach Antalya und nutzen immer Ata Flug Transfer. Herr İsmail ist der beste! Zuverlässig, freundlich, professionell." },
  { id: 7, name: "Heinz Braun", country: "🇩🇪", lang: "de", rating: 4, text: "Preis-Leistung stimmt bei Ata Flug. Fahrer İsmail war sehr professionell. Wir hatten eine angenehme Fahrt nach Side." },
  { id: 8, name: "Gerhard Hoffmann", country: "🇩🇪", lang: "de", rating: 5, text: "Sauberes Fahrzeug, klimatisiert, Wasser und Snacks. Perfekt für den heißen Sommer! Ata Flug Transfer - immer wieder gerne!" },
  { id: 9, name: "Franz Schneider", country: "🇦🇹", lang: "de", rating: 5, text: "Absolut empfehlenswert! Herr İsmail hat uns sogar Restaurant-Tipps gegeben. Werden bei unserem nächsten Urlaub wiederkommen." },
  { id: 10, name: "Jürgen Meyer", country: "🇩🇪", lang: "de", rating: 5, text: "Lieber İsmail, danke für den tollen Service! Ihre Firma Ata Flug ist die beste in Antalya. Wir werden Sie all unseren Freunden empfehlen." },
  { id: 11, name: "Ralf Zimmermann", country: "🇩🇪", lang: "de", rating: 5, text: "Unser Flug hatte 4 Stunden Verspätung. Herr İsmail hat die ganze Zeit gewartet und uns freundlich empfangen. Top Service!" },
  { id: 12, name: "Peter Krause", country: "🇩🇪", lang: "de", rating: 5, text: "Die Buchung über WhatsApp war super einfach. Ata Flug hat sofort geantwortet. Am Flughafen stand Herr İsmail mit Namensschild bereit." },
  { id: 13, name: "Uwe Richter", country: "🇩🇪", lang: "de", rating: 4, text: "Wir sind eine Gruppe von 8 Personen. Ata Flug hat uns einen Sprinter geschickt. Sehr komfortabel und günstig!" },
  { id: 14, name: "Dieter Koch", country: "🇩🇪", lang: "de", rating: 5, text: "Kindersitze wurden kostenlos bereitgestellt. Bei Ata Flug denkt man an alles. Vielen Dank Herr İsmail!" },
  { id: 15, name: "Bernd Schäfer", country: "🇩🇪", lang: "de", rating: 5, text: "Vom Flughafen Antalya nach Kemer - schnell, sicher, komfortabel. Ata Flug Transfer ist unser Favorit!" },
  { id: 16, name: "Günter Wagner", country: "🇩🇪", lang: "de", rating: 5, text: "Herr İsmail spricht sehr gut Deutsch! Das hat die Kommunikation so einfach gemacht. Ata Flug - wir kommen wieder!" },
  { id: 17, name: "Helmut Becker", country: "🇩🇪", lang: "de", rating: 5, text: "Nachtflug um 3 Uhr morgens - kein Problem für Ata Flug. Herr İsmail war pünktlich da. Großartig!" },
  { id: 18, name: "Werner Schulz", country: "🇩🇪", lang: "de", rating: 5, text: "Die Mercedes E-Klasse war wie neu. Leder, Klimaanlage, Wasser - alles dabei. Danke Ata Flug Transfer!" },
  { id: 19, name: "Karl Lange", country: "🇩🇪", lang: "de", rating: 5, text: "Lieber İsmail, Sie haben unseren Urlaub perfekt gestartet. Vielen herzlichen Dank für alles!" },
  { id: 20, name: "Fritz Maier", country: "🇦🇹", lang: "de", rating: 5, text: "Ata Flug Transfer - jahrelange Erfahrung merkt man sofort. Professionell von A bis Z. Herr İsmail ist ein Profi!" },
  { id: 21, name: "Manfred Keller", country: "🇩🇪", lang: "de", rating: 4, text: "Transfer nach Alanya - 1,5 Stunden Fahrt wie im Flug vergangen. Bequeme Sitze, gute Musik. Danke İsmail!" },
  { id: 22, name: "Horst Braun", country: "🇩🇪", lang: "de", rating: 5, text: "Wir haben Ata Flug über Google gefunden. Beste Entscheidung! İsmail Bey ist sehr zuverlässig." },
  { id: 23, name: "Erich Neumann", country: "🇩🇪", lang: "de", rating: 5, text: "Der Rücktransfer zum Flughafen war genauso perfekt. Ata Flug denkt an alles. Pünktlich wie immer!" },
  { id: 24, name: "Otto Schwarz", country: "🇨🇭", lang: "de", rating: 5, text: "Dear İsmail, your service is outstanding! Ata Flug Transfer is the best in Turkey. Thank you so much!" },
  { id: 25, name: "Ludwig Herrmann", country: "🇩🇪", lang: "de", rating: 5, text: "Hin- und Rücktransfer gebucht. Beide Male pünktlich, freundlich, professionell. İsmail Bey - Sie sind der Beste!" },
  { id: 26, name: "Siegfried Paul", country: "🇩🇪", lang: "de", rating: 5, text: "Unser Gepäck wurde sorgfältig behandelt. Der Fahrer hat uns bei allem geholfen. Ata Flug - Top Service!" },
  { id: 27, name: "Rudolf Frank", country: "🇩🇪", lang: "de", rating: 5, text: "Die WhatsApp-Kommunikation mit İsmail Bey war super. Schnelle Antworten, klare Infos. Sehr professionell!" },
  { id: 28, name: "Herbert König", country: "🇦🇹", lang: "de", rating: 5, text: "Wir sind Stammkunden bei Ata Flug Transfer. Seit 5 Jahren immer zufrieden. İsmail Bey kennt uns schon!" },
  { id: 29, name: "Erwin Kaiser", country: "🇩🇪", lang: "de", rating: 5, text: "Nach Kaş gefahren - lange Strecke, aber sehr angenehm. İsmail Bey hat uns viel über die Region erzählt." },
  { id: 30, name: "Alfred Vogel", country: "🇩🇪", lang: "de", rating: 5, text: "Ata Flug Transfer hat unsere Hochzeitsreise perfekt gestartet. Champagner im Auto! Danke İsmail Bey!" },
  { id: 31, name: "Joachim Roth", country: "🇩🇪", lang: "de", rating: 4, text: "Flughafen Antalya nach Lara - nur 20 Minuten. Schnell, sauber, günstig. Ata Flug ist die beste Wahl!" },
  { id: 32, name: "Ernst Werner", country: "🇩🇪", lang: "de", rating: 5, text: "İsmail Bey hat auf uns mit einem Schild gewartet. Sehr organisiert. Ata Flug Transfer - immer wieder!" },
  { id: 33, name: "Gottfried Fuchs", country: "🇨🇭", lang: "de", rating: 5, text: "Schweizer Pünktlichkeit trifft auf türkische Gastfreundschaft. Ata Flug ist perfekt! Danke İsmail!" },
  { id: 34, name: "Wilfried Haas", country: "🇩🇪", lang: "de", rating: 5, text: "Wir haben 3 Kindersitze gebraucht. Ata Flug hat alles organisiert. Kostenlos! Vielen Dank!" },
  { id: 35, name: "Reinhard Berg", country: "🇩🇪", lang: "de", rating: 5, text: "Lieber İsmail Bey, Sie haben uns den Start in den Urlaub versüßt. Ata Flug Transfer ist einfach klasse!" },

  // Rusça Yorumlar (35 adet)
  { id: 36, name: "Иван Петров", country: "🇷🇺", lang: "ru", rating: 5, text: "Отличный сервис от Ata Flug Transfer! Водитель Исмаил Бей был вовремя и очень вежлив. Машина была чистой и удобной. Рекомендую!" },
  { id: 37, name: "Александр Иванов", country: "🇷🇺", lang: "ru", rating: 5, text: "Лучший трансфер в Анталии! Ata Flug - это качество и надежность. Исмаил Бей - профессионал своего дела!" },
  { id: 38, name: "Дмитрий Соколов", country: "🇷🇺", lang: "ru", rating: 5, text: "Заказывали трансфер в Сиде через Ata Flug. Все прошло отлично! Исмаил Бей ждал нас с табличкой. Спасибо!" },
  { id: 39, name: "Сергей Новиков", country: "🇷🇺", lang: "ru", rating: 5, text: "Водитель Исмаил встретил нас с табличкой в аэропорту. Всё очень организовано. Ata Flug Transfer - лучшие!" },
  { id: 40, name: "Ольга Козлова", country: "🇷🇺", lang: "ru", rating: 5, text: "Детское кресло предоставили бесплатно. Ata Flug думает о клиентах! Очень довольны сервисом Исмаила Бея!" },
  { id: 41, name: "Елена Морозова", country: "🇷🇺", lang: "ru", rating: 5, text: "Быстрый ответ в WhatsApp от Исмаила. Удобное бронирование! Ata Flug Transfer - рекомендую всем друзьям!" },
  { id: 42, name: "Андрей Волков", country: "🇷🇺", lang: "ru", rating: 5, text: "Водитель Исмаил Бей был очень дружелюбным и помог с багажом. Ata Flug - это VIP сервис по доступной цене!" },
  { id: 43, name: "Наталья Белова", country: "🇷🇺", lang: "ru", rating: 5, text: "Кондиционер, холодная вода, Wi-Fi в машине. Пять звезд для Ata Flug Transfer! Исмаил Бей - лучший водитель!" },
  { id: 44, name: "Михаил Кузнецов", country: "🇷🇺", lang: "ru", rating: 5, text: "Дорогой Исмаил, спасибо за отличный сервис! Ata Flug Transfer - это надежность и комфорт. Будем рекомендовать!" },
  { id: 45, name: "Татьяна Смирнова", country: "🇷🇺", lang: "ru", rating: 5, text: "Наш рейс задержался на 5 часов. Исмаил Бей ждал нас без дополнительной платы! Ata Flug - это сервис!" },
  { id: 46, name: "Владимир Попов", country: "🇷🇺", lang: "ru", rating: 5, text: "Трансфер в Кемер прошел идеально. Мерседес V-класса, кожаные сиденья. Ata Flug Transfer - наш выбор!" },
  { id: 47, name: "Анна Федорова", country: "🇷🇺", lang: "ru", rating: 4, text: "Исмаил Бей говорит по-русски! Это так удобно. Ata Flug думает о русских туристах. Большое спасибо!" },
  { id: 48, name: "Николай Семенов", country: "🇷🇺", lang: "ru", rating: 5, text: "Заказали трансфер для группы 12 человек. Ata Flug прислали 2 машины. Все было организовано идеально!" },
  { id: 49, name: "Марина Орлова", country: "🇷🇺", lang: "ru", rating: 5, text: "Летели ночным рейсом. Исмаил Бей встретил нас в 4 утра с улыбкой! Ata Flug - настоящие профессионалы!" },
  { id: 50, name: "Алексей Лебедев", country: "🇷🇺", lang: "ru", rating: 5, text: "Ata Flug Transfer работает уже много лет. Это чувствуется в каждой детали. Исмаил Бей - мастер своего дела!" },
  { id: 51, name: "Екатерина Новикова", country: "🇷🇺", lang: "ru", rating: 5, text: "Дорогой Исмаил, спасибо за прекрасный сервис! Вы сделали наш отпуск незабываемым с первых минут!" },
  { id: 52, name: "Виктор Зайцев", country: "🇷🇺", lang: "ru", rating: 5, text: "Мы ездим в Анталию каждый год и всегда выбираем Ata Flug. Исмаил Бей уже как друг семьи!" },
  { id: 53, name: "Светлана Павлова", country: "🇷🇺", lang: "ru", rating: 4, text: "Трансфер в Аланью - долгая дорога, но с Ata Flug время пролетело незаметно. Удобно и комфортно!" },
  { id: 54, name: "Игорь Голубев", country: "🇷🇺", lang: "ru", rating: 5, text: "Исмаил Бей порекомендовал отличные рестораны в Сиде. Не просто водитель, а настоящий гид! Ata Flug - супер!" },
  { id: 55, name: "Оксана Тимофеева", country: "🇷🇺", lang: "ru", rating: 5, text: "Заказывали через WhatsApp у Исмаила. Ответил за 5 минут! Ata Flug Transfer - быстро и удобно!" },
  { id: 56, name: "Роман Соловьев", country: "🇷🇺", lang: "ru", rating: 5, text: "VIP трансфер - это про Ata Flug. Мерседес S-класса, шампанское, фрукты. Исмаил Бей - профессионал!" },
  { id: 57, name: "Людмила Королева", country: "🇷🇺", lang: "ru", rating: 5, text: "Мы с мужем отмечали годовщину свадьбы. Ata Flug украсили машину цветами! Спасибо Исмаилу Бею!" },
  { id: 58, name: "Денис Воробьев", country: "🇷🇺", lang: "ru", rating: 4, text: "Цена-качество у Ata Flug Transfer на высоте. Исмаил Бей - честный и надежный. Рекомендую!" },
  { id: 59, name: "Ирина Максимова", country: "🇷🇺", lang: "ru", rating: 5, text: "Трое детей с нами - Ata Flug предоставили 3 детских кресла бесплатно! Исмаил Бей - спасибо огромное!" },
  { id: 60, name: "Павел Егоров", country: "🇷🇺", lang: "ru", rating: 5, text: "Обратный трансфер в аэропорт был таким же идеальным. Ata Flug - стабильное качество. Исмаил Бей - лучший!" },
  { id: 61, name: "Юлия Романова", country: "🇷🇺", lang: "ru", rating: 5, text: "Дорогой Исмаил, ваш сервис превзошел все ожидания! Ata Flug Transfer - это эталон качества в Турции!" },
  { id: 62, name: "Константин Миронов", country: "🇷🇺", lang: "ru", rating: 5, text: "Летели из Москвы, трансфер до Каша - 4 часа дороги. С Ata Flug это было комфортное путешествие!" },
  { id: 63, name: "Валентина Степанова", country: "🇷🇺", lang: "ru", rating: 5, text: "Исмаил Бей встретил нас с холодными напитками в жару. Такая забота о клиентах! Ata Flug - молодцы!" },
  { id: 64, name: "Артем Козлов", country: "🇷🇺", lang: "ru", rating: 5, text: "Бронировал через сайт Ata Flug. Получил подтверждение и инструкции моментально. Исмаил Бей на связи 24/7!" },
  { id: 65, name: "Кристина Белова", country: "🇷🇺", lang: "ru", rating: 5, text: "Мы группа из 15 человек. Ata Flug организовали трансфер безупречно. Исмаил Бей - организатор от бога!" },
  { id: 66, name: "Евгений Крылов", country: "🇷🇺", lang: "ru", rating: 5, text: "Многолетний опыт Ata Flug чувствуется сразу. Всё продумано до мелочей. Исмаил Бей знает свое дело!" },
  { id: 67, name: "Надежда Сорокина", country: "🇷🇺", lang: "ru", rating: 5, text: "Ночной рейс, уставшие дети - Исмаил Бей создал тихую атмосферу в машине. Ata Flug думает о семьях!" },
  { id: 68, name: "Григорий Макаров", country: "🇷🇺", lang: "ru", rating: 5, text: "Прилетели в Анталию в 10-й раз. И в 10-й раз выбираем Ata Flug Transfer! Исмаил Бей - наш постоянный водитель!" },
  { id: 69, name: "Анастасия Филиппова", country: "🇷🇺", lang: "ru", rating: 5, text: "Дорогой Исмаил, вы и ваша команда Ata Flug - просто супер! Сервис мирового класса в Турции. Браво!" },
  { id: 70, name: "Вадим Комаров", country: "🇷🇺", lang: "ru", rating: 5, text: "Ata Flug Transfer - это гарантия спокойного начала отпуска. Исмаил Бей никогда не подводит. Спасибо!" },

  // İngilizce Yorumlar (15 adet)
  { id: 71, name: "John Smith", country: "🇬🇧", lang: "en", rating: 5, text: "Amazing transfer service from Ata Flug! Professional driver Mr. İsmail, clean Mercedes, smooth ride. Highly recommend for airport transfers!" },
  { id: 72, name: "Emma Wilson", country: "🇬🇧", lang: "en", rating: 5, text: "Best transfer service in Antalya! Mr. İsmail from Ata Flug tracked our flight and was waiting for us. Exceptional service!" },
  { id: 73, name: "Sarah Johnson", country: "🇺🇸", lang: "en", rating: 5, text: "Smooth and comfortable ride with Ata Flug Transfer. Dear İsmail was waiting with a sign. Great experience from start to finish!" },
  { id: 74, name: "Michael Brown", country: "🇬🇧", lang: "en", rating: 5, text: "Used Ata Flug Transfer twice now. Mr. İsmail provides consistently excellent service! Will use again and again!" },
  { id: 75, name: "James Taylor", country: "🇦🇺", lang: "en", rating: 5, text: "Long drive to Kas but the Mercedes from Ata Flug was so comfortable. Mr. İsmail made the journey enjoyable. Great service!" },
  { id: 76, name: "David Miller", country: "🇨🇦", lang: "en", rating: 5, text: "WhatsApp support from Ata Flug was very responsive. İsmail answered within minutes. Easy booking process!" },
  { id: 77, name: "Lisa Anderson", country: "🇺🇸", lang: "en", rating: 4, text: "Our driver Mr. İsmail from Ata Flug was amazing! So friendly and helpful. Made us feel like VIPs!" },
  { id: 78, name: "Robert Williams", country: "🇬🇧", lang: "en", rating: 5, text: "Air-conditioned Mercedes, cold water, wifi - all provided by Ata Flug Transfer. Five star service from Mr. İsmail!" },
  { id: 79, name: "Jennifer Davis", country: "🇺🇸", lang: "en", rating: 5, text: "Will definitely use Ata Flug again on our next trip to Antalya. Dear İsmail, thank you for everything!" },
  { id: 80, name: "Christopher Martin", country: "🇬🇧", lang: "en", rating: 5, text: "Ata Flug Transfer is the gold standard for airport transfers in Turkey. Mr. İsmail sets the bar high!" },
  { id: 81, name: "Amanda White", country: "🇺🇸", lang: "en", rating: 5, text: "Family of 6 with lots of luggage - no problem for Ata Flug! Mr. İsmail organized everything perfectly." },
  { id: 82, name: "Daniel Thompson", country: "🇦🇺", lang: "en", rating: 5, text: "Dear İsmail and the Ata Flug team - you made our honeymoon start perfectly. Champagne in the car was a nice touch!" },
  { id: 83, name: "Jessica Garcia", country: "🇺🇸", lang: "en", rating: 4, text: "Years of experience shows! Ata Flug Transfer knows exactly what travelers need. Mr. İsmail is a pro!" },
  { id: 84, name: "Andrew Robinson", country: "🇬🇧", lang: "en", rating: 5, text: "Flight delayed by 3 hours - Mr. İsmail from Ata Flug waited without any extra charge. That's real customer service!" },
  { id: 85, name: "Stephanie Lee", country: "🇨🇦", lang: "en", rating: 5, text: "Ata Flug Transfer - the only transfer company you need in Antalya. Mr. İsmail keeps his word every time!" },

  // Türkçe Yorumlar (10 adet)
  { id: 86, name: "Ahmet Yılmaz", country: "🇹🇷", lang: "tr", rating: 5, text: "Mukemmel hizmet! Ata Flug ile herşey cok güzeldi. İsmail abi çok nazik ve yardımseverdi. Kesinlkle tavsiye ediyorum herkese." },
  { id: 87, name: "Mehmet Kaya", country: "🇹🇷", lang: "tr", rating: 5, text: "Yılların tecrübesi kendini gösteriyo. Ata Flug ve İsmail Ağabey ile herşey süperdi! Gelecek seferde yine arayacağız." },
  { id: 88, name: "Fatma Demir", country: "🇹🇷", lang: "tr", rating: 5, text: "Gece uçuşumuz için transfer aldık. Şoför İsmail Bey saatlerce bekledi, çok teşekkürler Ata Flug!" },
  { id: 89, name: "Ayşe Öztürk", country: "🇹🇷", lang: "tr", rating: 5, text: "Bebek koltugu istedik, Ata Flug hicbir sorun cıkarmadı. Ucretsiz verdiler. Sevgili İsmail Bey cok yardımcı oldu teşekkurler!" },
  { id: 90, name: "Ali Çelik", country: "🇹🇷", lang: "tr", rating: 5, text: "Alanya'ya transfer aldık. Fiyat/performans harika! Ata Flug Transfer Antalya'nın en iyisi." },
  { id: 91, name: "Zeynep Arslan", country: "🇹🇷", lang: "tr", rating: 5, text: "Whatsapptan İsmail abiye ulaştık, cok hızlı donüş aldık. Ata Flug ile iletisim bayağı kolay." },
  { id: 92, name: "Mustafa Şahin", country: "🇹�R", lang: "tr", rating: 5, text: "Şoför İsmail Bey çok yardımcı oldu. Ata Flug Transfer'e teşekkürler! Her zaman tercihimiz olacak." },
  { id: 93, name: "Hakan Aydın", country: "🇹🇷", lang: "tr", rating: 4, text: "Klimalı araç, soğuk su ikramı. Ata Flug'dan 5 yıldızlı hizmet! İsmail Bey gerçek bir profesyonel." },
  { id: 94, name: "Elif Yıldız", country: "🇹🇷", lang: "tr", rating: 5, text: "Sevgili İsmail Ağabey, Ata Flug ile harika bi deneyim yaşadık. Tatilmiz sizinle başladı, cok tesekürler!" },
  { id: 95, name: "Can Demir", country: "🇹🇷", lang: "tr", rating: 5, text: "10 kişilik grup için Ata Flug'dan minibüs tuttuk. İsmail Bey mükemmel organize etti. Herkese tavsiye ederim!" },

  // Diğer Diller (5 adet)
  { id: 96, name: "Jan de Vries", country: "🇳🇱", lang: "nl", rating: 5, text: "Perfecte service van Ata Flug Transfer! İsmail Bey was op tijd en zeer vriendelijk. Aanrader!" },
  { id: 97, name: "محمد علي", country: "🇸🇦", lang: "ar", rating: 5, text: "خدمة ممتازة من Ata Flug! إسماعيل بيه كان محترفاً جداً. السيارة نظيفة ومريحة. شكراً جزيلاً!" },
  { id: 98, name: "Sophie de Groot", country: "🇳🇱", lang: "nl", rating: 5, text: "Wij zijn zeer tevreden met Ata Flug Transfer. İsmail Bey is een topkeeper. Bedankt!" },
  { id: 99, name: "أحمد محمد", country: "🇦🇪", lang: "ar", rating: 5, text: "خدمة VIP حقيقية من Ata Flug! سيارة مرسيدس فاخرة وإسماعيل بيه سائق محترف. ننصح بها للجميع." },
  { id: 100, name: "Pieter van Dijk", country: "🇳🇱", lang: "nl", rating: 5, text: "Dear İsmail, Ata Flug Transfer is de beste in Antalya. Absoluut aan te bevelen. Bedankt voor alles!" }
];

import { BlogPost } from './types';


const REGION_DETAILS: Record<string, { title: string; about: string; places: string[]; dining: string[]; activities: string[] }> = {
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
    activities: ["Plaj keyfi", "Su sporları", "Alışveriş merkezleri turu", "Kum heykel festivali"]
  },
  "Lara": {
    title: "Lüksün ve Eğlencenin Adresi: Lara",
    about: "Antalya'nın en popüler turizm merkezlerinden biri olan Lara, hem şehir merkezine yakınlığı hem de muhteşem plajlarıyla dikkat çeker. Düden Şelalesi'nin denize döküldüğü nokta buradadır.",
    places: ["Düden Şelalesi", "Lara Plajı (Altınkum)", "TerraCity AVM"],
    dining: ["Kalamar Balık", "BigChefs", "Lara Çorbacısı"],
    activities: ["Düden parkında yürüyüş", "AVM gezisi", "Deniz keyfi", "Gece hayatı"]
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
    activities: ["Golf oynamak", "Theme park eğlencesi", "Spa & Wellness", "Konser etkinlikleri"]
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
    activities: ["Antik kent gezisi", "Gün batımı izleme", "Tekne turu", "Çarşı alışverişi"]
  },
  "Manavgat": {
    title: "Şelalelerin ve Doğanın Kenti: Manavgat",
    about: "Ünlü şelalesi ve ırmağıyla Manavgat, doğa severler için kaçırılmayacak bir rotadır. Irmak kenarında kahvaltı yapmak veya tekne turuna çıkmak buranın klasiğidir.",
    places: ["Manavgat Şelalesi", "Manavgat Irmağı", "Külliye Camii", "Seleukeia Antik Kenti"],
    dining: ["Irmak Kenarı Balık Restoranları", "Sultan Sofrası"],
    activities: ["Irmak tekne turu", "Şelale ziyareti", "Pazar alışverişi (Büyük Pazar)"]
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
    activities: ["Teleferik turu", "Tekne turu", "Gece kulüpleri", "Mağara gezisi"]
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
    activities: ["Tekne turu", "Gece kulüpleri (Aura, Inferno)", "Jeep safari"]
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
    activities: ["Dalış (Scuba)", "Meis Adası turu", "Yamaç paraşütü", "Caz dinletileri"]
  },
  "Kalkan": {
    title: "Romantizm ve Lüks: Kalkan",
    about: "Beyaz badanalı evleri, dar sokakları ve sonsuzluk havuzlu villalarıyla Türkiye'nin en sofistike tatil beldelerinden biridir.",
    places: ["Kaputaş Plajı", "Patara Plajı", "Kalkan Marina"],
    dining: ["Salonika 1881", "Aubergine", "Teras restoranlar"],
    activities: ["Villa keyfi", "Beach club", "Romantik akşam yemekleri"]
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

  return {
    id: `blog-${index + 1}`,
    slug: `${slug}-transfer-rehberi`,
    title: details.title,
    excerpt: `Antalya Havalimanı'ndan ${region.name} bölgesine VIP transfer ve gezi rehberi. ${region.name} gezilecek yerler, en iyi restoranlar ve aktiviteler hakkında detaylı bilgiler.`,
    content: `# ${details.title}

${details.about}

**Ata Flug Transfer** olarak, Antalya Havalimanı'ndan (AYT) **${region.name}** bölgesine konforlu, güvenli ve VIP araçlarımızla ulaşımınızı sağlıyoruz. Tatiliniz yolda başlasın!

## Antalya Havalimanı - ${region.name} Ulaşım Seçenekleri

Tatil planınızı yaptınız, peki otelinize nasıl gideceksiniz? İşte seçenekleriniz:

### Özel VIP Transfer (En Konforlu)
Havalimanında sıra beklemeden, size özel tahsis edilmiş Mercedes Vito veya Sprinter araçlarla doğrudan otelinize ulaşın.
- **Karşılama:** Çıkış kapısında isminizle karşılama.
- **Konfor:** Geniş deri koltuklar, klima, Wi-Fi.
- **Gizlilik:** Sadece size ve ailenize özel araç.

### Taksi
Havalimanı taksileri mevcuttur ancak sezon yoğunluğunda sıra olabilir ve fiyatlar belirsizdir.

## ${region.name} Bölgesinde Gezilecek Yerler

${region.name} ve çevresinde görmeniz gereken başlıca noktalar:

${details.places.map(place => `- **${place}**: Bölgenin en popüler noktalarından biri. Mutlaka listenize ekleyin.`).join('\n')}

## ${region.name} Yeme & İçme Rehberi

"Nerede ne yenir?" diyorsanız, işte önerilerimiz:

${details.dining.map(food => `- **${food}**: Lezzet durakları arasında öne çıkan bir seçenek.`).join('\n')}

## Yapılabilecek Aktiviteler

Tatilinizi renklendirecek aktivite önerileri:

${details.activities.map(act => `- ${act}`).join('\n')}

## Sıkça Sorulan Sorular

**Transfer ne kadar sürüyor?**
Antalya Havalimanı'ndan ${region.name} bölgesine ulaşım süresi, trafiğe bağlı olarak değişmekle birlikte deneyimli şoförlerimizle en kısa sürede sağlanır.

**Araçta bebek koltuğu var mı?**
Evet, **ücretsiz** olarak bebek koltuğu sağlıyoruz. Lütfen rezervasyon sırasında belirtiniz.

**Nasıl rezervasyon yapabilirim?**
Aşağıdaki butona tıklayarak WhatsApp üzerinden saniyeler içinde fiyat alabilir ve rezervasyon yapabilirsiniz.

**[WhatsApp ile Hızlı Fiyat Al & Rezervasyon Yap](https://wa.me/905052281596)**`,
    featuredImage: region.image,
    category: 'Gezi ve Transfer Rehberi',
    tags: ['antalya transfer', region.name.toLowerCase(), 'vip transfer', 'gezi rehberi', ...details.places.slice(0, 2)],
    author: 'Ata Flug Editör',
    publishedAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    seoTitle: `${region.name} Transfer ve Gezi Rehberi 2024 | ${region.name} Ulaşım`,
    seoDescription: `${region.name} ulaşım rehberi ve gezilecek yerler. Antalya Havalimanı'ndan ${region.name} VIP transfer, restoran önerileri ve aktiviteler.`,
    isPublished: true,
    viewCount: Math.floor(Math.random() * 1000) + 100
  };
});

import { Booking } from './types';

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'TR-84921',
    customerName: 'Ahmet Yılmaz',
    phone: '0532 555 1234',
    pickup: 'Antalya Havalimanı (AYT)',
    destination: 'Belek Oteller Bölgesi',
    date: '2024-05-15',
    time: '14:30',
    passengers: 3,
    vehicleId: 'v1',
    status: 'Completed',
    totalPrice: 50,
    createdAt: '2024-05-10T10:00:00.000Z',
    flightNumber: 'TK2414',
    notes: 'Bebek koltuğu gerekli'
  },
  {
    id: 'TR-15203',
    customerName: 'John Smith',
    phone: '+44 7700 900500',
    pickup: 'Antalya Havalimanı (AYT)',
    destination: 'Side / Manavgat',
    date: '2024-06-20',
    time: '18:45',
    passengers: 4,
    vehicleId: 'v1',
    status: 'Confirmed',
    totalPrice: 55,
    createdAt: '2024-06-01T09:15:00.000Z',
    flightNumber: 'BA2107'
  },
  {
    id: 'TR-93482',
    customerName: 'Elena Petrova',
    phone: '+7 900 123-45-67',
    pickup: 'Kemer',
    destination: 'Antalya Havalimanı (AYT)',
    date: '2024-07-10',
    time: '04:00',
    passengers: 2,
    vehicleId: 'v2',
    status: 'Pending',
    totalPrice: 45,
    createdAt: '2024-07-09T20:30:00.000Z',
    notes: 'Extra bagaj 3 adet'
  },
  {
    id: 'TR-27156',
    customerName: 'Mehmet Demir',
    phone: '0505 123 4567',
    pickup: 'Alanya',
    destination: 'Antalya Havalimanı (AYT)',
    date: '2024-08-05',
    time: '11:00',
    passengers: 6,
    vehicleId: 'v2',
    status: 'Confirmed',
    totalPrice: 85,
    createdAt: '2024-08-01T14:20:00.000Z'
  }
];


