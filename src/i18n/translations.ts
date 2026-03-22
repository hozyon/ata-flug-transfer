export type Language = 'en' | 'de' | 'fr' | 'ru' | 'ar' | 'tr';

export const LANGUAGE_LABELS: Record<Language, { label: string; flag: string; native: string }> = {
    en: { label: 'English', flag: '🇬🇧', native: 'English' },
    de: { label: 'Deutsch', flag: '🇩🇪', native: 'Deutsch' },
    fr: { label: 'Français', flag: '🇫🇷', native: 'Français' },
    ru: { label: 'Русский', flag: '🇷🇺', native: 'Русский' },
    ar: { label: 'العربية', flag: '🇸🇦', native: 'العربية' },
    tr: { label: 'Türkçe', flag: '🇹🇷', native: 'Türkçe' },
};

export const DEFAULT_LANGUAGE: Language = 'en';

/**
 * Turkish source texts — used as the base for auto-translation.
 * When language is Turkish → these are returned directly.
 * When language is anything else → these are sent to Google Translate API automatically.
 * 
 * No manual translations needed for any language!
 * Just add Turkish text here and it will be auto-translated to all languages.
 */
const sourceTexts: Record<string, string> = {
    // Navigation
    'nav.home': 'ANA SAYFA', 'nav.corporate': 'KURUMSAL', 'nav.about': 'Hakkımızda', 'nav.vision': 'Vizyon & Misyon',
    'nav.regions': 'BÖLGELER', 'nav.faq': 'S.S.S', 'nav.blog': 'BLOG', 'nav.contact': 'İLETİŞİM',
    'nav.search': 'Ne aramıştınız?',
    'nav.menu': 'Menü',
    'nav.noResults': 'Sonuç bulunamadı',
    'nav.call': 'Ara',
    'nav.admin': 'Yönetici',

    // Hero section
    'hero.eyebrow': 'Premium VIP Transfer', 'hero.title': 'Lüks Ve Konforun', 'hero.titleAccent': 'Yeni Tanımı',
    'hero.subtitle': 'Antalya Havalimanı\'ndan dilediğiniz noktaya, profesyonel şoförler ve son model Mercedes araçlarla.',
    'hero.cta': 'Rezervasyon Yap', 'hero.whatsapp': 'Hızlı Bilgi Al', 'hero.trust.247': '7/24',
    'hero.trust.tracking': 'Anlık Takip', 'hero.trust.vehicle': 'Mercedes Vito',

    // Booking form
    'form.eyebrow': 'Online Rezervasyon', 'form.title': 'Transfer Talebi', 'form.from': 'Nereden', 'form.to': 'Nereye',
    'form.date': 'Tarih', 'form.time': 'Saat', 'form.passengers': 'Yolcu', 'form.vehicle': 'Araç Tipi',
    'form.name': 'Ad Soyad', 'form.namePlaceholder': 'Adınız Soyadınız', 'form.phone': 'Telefon', 'form.phonePlaceholder': '05...',
    'form.submit': 'Teklif Al & WhatsApp\'a Gönder', 'form.swap': 'Yönü Değiştir', 'form.person': 'Kişi',
    'form.trustSecure': 'Güvenli', 'form.trustFast': 'Hızlı Onay', 'form.trustWhatsapp': 'WhatsApp Bildirim',
    'form.successMsg': 'Talebiniz sisteme kaydedildi ve WhatsApp\'a yönlendiriliyorsunuz.',
    'form.waMessage': 'Merhaba, web sitenizden transfer rezervasyonu yapmak istiyorum.',
    'form.waDetails': '📝 *REZERVASYON AÇIKLAMASI*', 'form.waName': '👤 *İsim:*', 'form.waPhone': '📱 *Tel:*',
    'form.waFrom': '📍 *Nereden:*', 'form.waTo': '🏁 *Nereye:*', 'form.waDate': '📅 *Tarih:*',
    'form.waTime': '⏰ *Saat:*', 'form.waPassengers': '👥 *Kişi Sayısı:*', 'form.waVehicle': '🚐 *Araç:*',
    'form.waAvailability': 'Müsaitlik durumu hakkında bilgi alabilir miyim?',

    // Services
    'services.eyebrow': 'Premium Deneyim',
    'services.card1.title': 'Havalimanı Transferi', 'services.card1.desc': 'Lüks Mercedes Vito araçlarımızla kesintisiz karşılama. Uçuş durumunuzu takip ediyor, rötarlarda bekliyoruz.',
    'services.card2.title': 'Özel Şehir Turları', 'services.card2.desc': 'Antalya ve çevresini kendi hızınızda keşfedin. Yerel şoförlerimiz eşliğinde gizli kalmış güzellikleri görün.',
    'services.card3.title': 'VIP Transfer', 'services.card3.desc': 'Kişisel ihtiyaçlarınıza göre uyarlanmış rotalarla mükemmel konforu tasarlayın. Eğlence veya tatil odaklı VIP seyahat.',
    'services.card4.title': 'Şehirlerarası Transfer', 'services.card4.desc': 'Antalya\'dan dilediğiniz şehre, lüks araçlarımızla stressiz ve konforlu uzun yolculuk deneyimi.',

    // Regions
    'regions.eyebrow': 'Premium Transfer', 'regions.title': 'Hizmet', 'regions.titleAccent': 'Bölgelerimiz',
    'regions.desc': 'Antalya\'nın dört bir yanındaki tatil merkezlerine profesyonel ve konforlu ulaşım.', 'regions.airportLabel': 'Antalya Airport',

    // Blog
    'blog.eyebrow': 'Blog', 'blog.title': 'Sizin İçin', 'blog.titleAccent': 'Seçtiklerimiz',
    'blog.readMore': 'Devamını Oku', 'blog.viewAll': 'Tüm Yazıları Gör',

    // Reviews
    'reviews.eyebrow': 'Müşteri Yorumları', 'reviews.count': 'Mutlu Müşteri', 'reviews.avgScore': 'ortalama puan',
    'reviews.verified': 'Doğrulanmış', 'reviews.addReview': 'Sen de yorum ekle',
    'reviews.firstName': 'Adınız', 'reviews.lastName': 'Soyadınız', 'reviews.yourReview': 'Yorumunuz...',
    'reviews.submit': 'Yorum Gönder', 'reviews.send': 'Gönder',

    // Footer
    'footer.tagline': 'Premium VIP Transfer Hizmetleri', 'footer.contact': 'İletişim', 'footer.quickSupport': 'Hızlı Destek',

    // Page titles
    'page.about.title': 'Hakkımızda', 'page.vision.title': 'Vizyon & Misyon', 'page.faq.title': 'Sıkça Sorulan Sorular',
    'page.contact.title': 'İletişim', 'page.regions.title': 'Bölgelerimiz', 'page.blog.title': 'Blog',

    // About page
    'about.eyebrow': 'KURUMSAL', 'about.subtitle': 'Antalya\'nın En Prestijli VIP Transfer Hizmeti',
    'about.contactCta': 'İletişime Geç', 'about.transferService': 'Transfer Hizmeti',
    'about.feat1.title': 'Güven ve Kalite', 'about.feat1.desc': 'Uçuş takibi, zamanında karşılama ve güvenli seyahat garantisi.',
    'about.feat2.title': 'Premium Filo', 'about.feat2.desc': 'Mercedes-Benz Vito ve Sprinter araçlarla konforun tadını çıkarın.',
    'about.feat3.title': '7/24 Destek', 'about.feat3.desc': 'İhtiyaç duyduğunuz her an WhatsApp üzerinden anında iletişim.',

    // Vision page
    'vision.eyebrow': 'KURUMSAL', 'vision.heroDesc': 'Geleceğe bakışımız ve değerlerimiz.', 'vision.valuesEyebrow': 'HİZMET İLKELERİMİZ',

    // FAQ page
    'faq.eyebrow': 'DESTEK', 'faq.subtitle': 'Transfer hizmetimiz hakkında merak ettiğiniz her şey.',
    'faq.moreQ': 'Başka Sorunuz mu Var?', 'faq.moreQDesc': 'WhatsApp üzerinden anında cevap alabilirsiniz.',
    'faq.askWhatsapp': 'WhatsApp ile Soru Sor', 'faq.phone': 'Telefon', 'faq.email': 'E-posta',
    'faq.workHours': 'Çalışma Saatleri', 'faq.service247': '7/24 Hizmet',

    // Contact page
    'contact.eyebrow': 'İLETİŞİM', 'contact.title': 'Bize Ulaşın',
    'contact.subtitle': 'Sorularınız için 7/24 buradayız. Hemen iletişime geçin.',
    'contact.formTitle': 'İletişim Formu', 'contact.namePh': 'Adınız', 'contact.emailPh': 'E-posta',
    'contact.msgPh': 'Mesajınız', 'contact.send': 'Gönder',
    'contact.waMsg': 'Merhaba, web sitesinden yazıyorum.',

    // Regions page
    'regionsPage.eyebrow': 'Hizmet Bölgeleri', 'regionsPage.title': 'Transfer Bölgelerimiz',
    'regionsPage.subtitle': 'Antalya Havalimanı\'ndan tüm popüler tatil bölgelerine VIP transfer.',
    'regionsPage.search': 'Gitmek istediğiniz bölgeyi arayın...', 'regionsPage.noResult': 'Sonuç Bulunamadı',
    'regionsPage.noResultDesc': 'Aramanızla eşleşen transfer bölgesi bulunamadı.',
    'regionsPage.startingFrom': 'Başlayan', 'regionsPage.getPrice': 'Fiyat Al',
    'regionsPage.ctaTitle': 'Özel Fiyat Teklifi Alın',
    'regionsPage.ctaDesc': 'Listede olmayan bir bölge için veya grup transferi için özel fiyat teklifi alın.',
    'regionsPage.ctaBtn': 'WhatsApp ile Fiyat Al',
    'regionsPage.waMsg': 'Merhaba, transfer için fiyat almak istiyorum:',
    'region.descTemplate': '{name} bölgesine konforlu ve güvenli VIP transfer hizmeti.',
    'region.airportDesc': '{name} transfer hizmeti.',

    // Pricing section (home page)
    'pricing.eyebrow': 'Antalya Havalimanı → Tüm Bölgeler',
    'pricing.title': 'Transfer',
    'pricing.titleAccent': 'Fiyatları',
    'pricing.subtitle': 'Tek yön, araç başı — kişi sayısından bağımsız sabit fiyat',
    'pricing.near': 'Yakın Mesafe',
    'pricing.mid': 'Orta Mesafe',
    'pricing.far': 'Uzak Mesafe',
    'pricing.legendNear': 'Yakın mesafe',
    'pricing.legendMid': 'Orta mesafe',
    'pricing.legendFar': 'Uzak mesafe',
    'pricing.note': 'Fiyatlar araç başıdır. Gece transferi (00:00–06:00) ve ekstra bagaj için fiyat değişmez. Listede olmayan bölge için WhatsApp\'tan fiyat alın.',
    'pricing.allRegions': 'Tüm Bölgeler',
    'pricing.search': 'Bölge adı veya fiyat ara...',
    'pricing.regionsLabel': 'bölge',

    // Blog page
    'blogPage.eyebrow': 'Seyahat & Yaşam', 'blogPage.title': 'Antalya Keşif Rehberi',
    'blogPage.subtitle': 'Antalya\'nın gizli kalmış koylarından en lezzetli restoranlarına, tarihi rotalardan gece hayatına kapsamlı bir yolculuk.',
    'blogPage.read': 'Oku', 'blogPage.ctaTitle': 'Tatilinizi Planlamaya Başlayın',
    'blogPage.ctaDesc': 'Gideceğiniz yere karar verdiniz mi? Hemen WhatsApp üzerinden iletişime geçin, size özel VIP transfer planınızı oluşturalım.',
    'blogPage.ctaBtn': 'WhatsApp Rezervasyon',

    // Blog post page
    'blogPost.notFound': 'Aradığınız içerik bulunamadı veya kaldırılmış olabilir.',
    'blogPost.backToBlog': 'Blog\'a Dön', 'blogPost.allPosts': 'Tüm Yazılar', 'blogPost.author': 'Yazar',
    'blogPost.readTime': 'Okuma Süresi', 'blogPost.readMin': '~3 Dakika',
    'blogPost.sidebarTitle': 'Hemen Rezervasyon Yapın',
    'blogPost.sidebarDesc': 'Size özel VIP araçlarımızla konforlu transferin keyfini çıkarın.',
    'blogPost.liveSupport': '7/24 Canlı Destek', 'blogPost.liveSupportDesc': 'Her an yanınızdayız',
    'blogPost.license': 'Resmi Belge & İzinler', 'blogPost.licenseDesc': 'TÜRSAB Onaylı A Grubu',
    'blogPost.waContact': 'WhatsApp ile Ulaşın',
    'blogPost.waMsg': 'Merhaba, yazınızı okudum. Transfer için bilgi almak istiyorum.',
    'blogPost.avgResponse': 'Ortalama yanıt süresi: ~2 dakika',
    'blogPost.readAlso': 'Bunları da Okuyun', 'blogPost.viewAll': 'Tümünü Gör',

    // Blog content templates
    'blogContent.category': 'Gezi ve Transfer Rehberi',
    'blogContent.titleTemplate': '{name}: Transfer ve Gezi Rehberi',
    'blogContent.excerptTemplate': 'Antalya Havalimanı\'ndan {name} bölgesine VIP transfer ve gezi rehberi. {name} gezilecek yerler, en iyi restoranlar ve aktiviteler hakkında detaylı bilgiler.',

    // SEO
    'seo.title': 'Ata Flug Transfer | VIP Havalimanı Transfer Antalya',
    'seo.desc': 'Antalya Havalimanı\'ndan premium VIP transfer hizmeti. Profesyonel şoförler, lüks Mercedes araçlar, 7/24 hizmet.',
};

export default sourceTexts;
