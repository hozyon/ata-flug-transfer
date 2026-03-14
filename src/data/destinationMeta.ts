export interface DestinationMeta {
  distanceKm: number;
  durationMin: number;
  highlights: string[];
  uniqueDesc: string;
  faqs: { q: string; a: string }[];
}

export const DESTINATION_META: Record<string, DestinationMeta> = {
  'antalya-havalimani-ayt': {
    distanceKm: 0,
    durationMin: 0,
    highlights: ['Terminal 1 ve Terminal 2', 'VIP Lounge Alanları', 'Duty Free Mağazaları', 'Uluslararası Hatlar', 'İç Hat Uçuşları'],
    uniqueDesc: 'Antalya Havalimanı (AYT), Türkiye\'nin en yoğun üçüncü havalimanıdır ve yılda 30 milyonun üzerinde yolcuya hizmet vermektedir. Havalimanı, modern altyapısı ve geniş terminal kapasitesiyle dünya genelindeki turistleri Antalya\'ya bağlamaktadır. ATA Flug Transfer olarak havalimanının tüm çıkış kapılarında profesyonel karşılama hizmeti sunmaktayız.',
    faqs: [
      { q: 'Antalya Havalimanı\'nda nasıl karşılanacağım?', a: 'Şoförümüz adınıza hazırladığı isim tabelasıyla bagaj çıkışında sizi bekleyecektir. Uçuşunuzu anlık takip ettiğimiz için erken ya da geç gelmeniz durumunda ekstra ücret talep etmiyoruz.' },
      { q: 'Havalimanı transfer rezervasyonu ne kadar önceden yapılmalı?', a: 'En az 24 saat öncesinden rezervasyon yapmanızı öneririz. Ancak acil durumlarda WhatsApp üzerinden anlık rezervasyon da kabul etmekteyiz.' }
    ]
  },
  'antalya-merkez': {
    distanceKm: 15,
    durationMin: 20,
    highlights: ['Kaleiçi Tarihi Bölgesi', 'Antalya Müzesi', 'Hadrian Kapısı', 'Düden Şelalesi', 'Konyaaltı Plajı'],
    uniqueDesc: 'Antalya Merkez, antik tarihi ve modern yaşamı bir arada sunan Türkiye\'nin en büyük turizm şehirlerinden biridir. Kaleiçi\'nin tarihi dokusu, Hadrian Kapısı ve Antalya Müzesi şehrin öne çıkan kültürel hazineleridir. Havalimanına yalnızca 15 km mesafedeki şehir merkezine konforlu transferler sunmaktayız.',
    faqs: [
      { q: 'Antalya Havalimanı\'ndan Antalya Merkez\'e transfer süresi ne kadar?', a: 'Trafik durumuna bağlı olarak yaklaşık 20 dakika sürmektedir. Mercedes araçlarımızla konforlu bir yolculuk deneyimi yaşarsınız.' },
      { q: 'Antalya Merkez transfer ücreti nasıl belirleniyor?', a: 'Fiyatlarımız araç tipine ve yolcu sayısına göre değişmektedir. WhatsApp\'tan iletişime geçerek anlık fiyat teklifi alabilirsiniz.' }
    ]
  },
  'kundu': {
    distanceKm: 20,
    durationMin: 25,
    highlights: ['Lüks 5 Yıldızlı Oteller', 'Regnum Carya', 'Rixos Premium', 'Özel Plajlar', 'Spa ve Wellness Merkezleri'],
    uniqueDesc: 'Kundu, Antalya\'nın en prestijli konaklama bölgelerinden biri olup dünyaca ünlü lüks resort otelleriyle bilinmektedir. Regnum Carya, Rixos Premium ve Gloria gibi 5 yıldızlı devler bu bölgede yer almaktadır. Havalimanına 20 km yakınlığıyla en pratik transfer rotalarından biri olan Kundu\'ya VIP araçlarımızla konforlu transferler düzenliyoruz.',
    faqs: [
      { q: 'Antalya Havalimanı\'ndan Kundu\'ya transfer ne kadar sürer?', a: 'Ortalama 25 dakika sürmektedir. Otel lobisine kadar doğrudan ulaşım sağlıyoruz.' },
      { q: 'Kundu otelleri için grup transfer hizmeti var mı?', a: 'Evet, geniş kapasiteli Sprinter ve minibüs araçlarımızla büyük gruplar için de transfer hizmeti sunuyoruz.' }
    ]
  },
  'konyaalti': {
    distanceKm: 20,
    durationMin: 25,
    highlights: ['Konyaaltı Plajı', 'Antalya Aquarium', 'Bağcılar Parkı', 'Olympos Teleferik İstasyonu', 'Migros Alışveriş Merkezi'],
    uniqueDesc: 'Konyaaltı, mavi bayraklı plajı ve modern yaşam alanlarıyla Antalya\'nın en çok tercih edilen mahallelerinden biridir. Dünyanın en büyük tünel akvaryumuna ev sahipliği yapan Antalya Aquarium da bu bölgededir. Sahil boyunca uzanan düzenli plaj şeridi ve çevre yollarıyla ulaşımı kolay olan Konyaaltı\'na transferlerinizi güvenle teslim edin.',
    faqs: [
      { q: 'Konyaaltı transfer saatleri nelerdir?', a: '7/24 transfer hizmeti sunmaktayız. Sabahın erken saatlerinde ya da gece geç saatlerde de rezervasyon yapabilirsiniz.' },
      { q: 'Konyaaltı\'ndaki bir apartmana transfer yapılır mı?', a: 'Evet, otel yanı sıra apartman, villa ve yazlık adreslerine de kapıdan kapıya transfer hizmeti veriyoruz.' }
    ]
  },
  'belek': {
    distanceKm: 40,
    durationMin: 35,
    highlights: ['Nick Faldo Golf Sahası', 'Gloria Golf Resort', 'Cornelia Diamond Golf Club', 'Regnum Carya Golf', 'Belek Sahilleri'],
    uniqueDesc: 'Belek, Türkiye\'nin golf başkenti olarak bilinir ve dünyaca ünlü golf sahaları ile 5 yıldızlı resort otellere ev sahipliği yapar. Her yıl Avrupa\'nın dört bir yanından golf tutkunları bu bölgeyi ziyaret etmektedir. Antalya Havalimanı\'na 40 km mesafede olan Belek\'e doğrudan, konforlu ve dakik transfer hizmeti sunuyoruz.',
    faqs: [
      { q: 'Antalya Havalimanı\'ndan Belek\'e transfer süresi nedir?', a: 'Yaklaşık 35 dakika sürmektedir. Ekspresi yolunu kullandığımız için trafik aksaklığı yaşanmaz.' },
      { q: 'Belek\'te golf ekipmanları için bagaj desteği var mı?', a: 'Evet, golf çantaları dahil büyük hacimli bagajlarınız için geniş bagaj bölümüne sahip araçlarımız mevcuttur.' }
    ]
  },
  'colakli': {
    distanceKm: 75,
    durationMin: 60,
    highlights: ['Çolaklı Plajı', 'Side Antik Kenti (yakın)', 'Manavgat Şelalesi', 'Yerel Pazarlar', 'Aile Otelleri'],
    uniqueDesc: 'Çolaklı, Side\'ye yakın konumuyla Türk Rivierası\'nın sakin tatil beldelerinden biridir. Uzun kumsalları ve aile dostu oteliyle tatilciler arasında popülerliği giderek artmaktadır. Antalya Havalimanı\'ndan 75 km uzakta olan Çolaklı\'ya konforlu ve güvenli transfer hizmeti sunuyoruz.',
    faqs: [
      { q: 'Çolaklı\'ya transfer süresi ne kadar?', a: 'Antalya Havalimanı\'ndan yaklaşık 60 dakika sürmektedir. D400 karayolunu kullanarak güvenli ve konforlu bir yolculuk sağlıyoruz.' },
      { q: 'Çolaklı\'ya gece transferi mümkün mü?', a: 'Evet, 7/24 hizmet veriyoruz. Gece yarısı ya da sabahın erken saatlerindeki uçuşlar için de transfer düzenleyebiliriz.' }
    ]
  },
  'evrenseki': {
    distanceKm: 80,
    durationMin: 65,
    highlights: ['Evrenseki Plajı', 'Side Antik Kenti', 'Tatlısu Kanalı', 'Aile Otelleri', 'Aqua Park Tesisleri'],
    uniqueDesc: 'Evrenseki, Side\'ye bağlı sakin ve doğal bir tatil beldesidir. Uzun kumsalı ve temiz deniziyle aile tatilleri için ideal olan Evrenseki, antik Side\'ye de yakın konumdadır. Antalya Havalimanı\'ndan yaklaşık 80 km mesafede olan bu güzel bölgeye rahat transferler organize ediyoruz.',
    faqs: [
      { q: 'Evrenseki transfer fiyatı nedir?', a: 'Fiyatlar araç tipine ve sefer sayısına göre değişmektedir. WhatsApp\'tan bize ulaşarak anlık fiyat öğrenebilirsiniz.' },
      { q: 'Evrenseki\'ye çocuklu aile transferi yapılır mı?', a: 'Evet, ücretsiz bebek koltuğu ve çocuk güvenlik koltuğu ile aile transferlerinizi güvenle gerçekleştiriyoruz.' }
    ]
  },
  'kumkoy': {
    distanceKm: 82,
    durationMin: 65,
    highlights: ['Kumköy Plajı', 'Side Yakını', 'Aqua Parks', 'Aile Otelleri', 'Manavgat Nehri'],
    uniqueDesc: 'Kumköy, Side\'ye yürüme mesafesinde konumuyla tatilciler için son derece elverişli bir beldedir. Geniş kumsalı ve all-inclusive otelleriyle aile tatillerinin vazgeçilmezi olan Kumköy\'e Antalya Havalimanı\'ndan 82 km mesafede olup konforlu bir transfer deneyimi sunuyoruz.',
    faqs: [
      { q: 'Kumköy transfer ile Side arasında geçiş yapılabilir mi?', a: 'Evet, aynı transfer paketi kapsamında Side\'ye de uğrama talebinde bulunabilirsiniz.' },
      { q: 'Kumköy\'e kaç kişilik araçlar gönderilebilir?', a: 'Minibüs (8 kişi) ve Sprinter (16 kişi) seçeneklerimizle büyük grupları da rahatça taşıyabiliriz.' }
    ]
  },
  'side': {
    distanceKm: 75,
    durationMin: 60,
    highlights: ['Apollon Tapınağı', 'Side Antik Tiyatrosu', 'Side Müzesi', 'Manavgat Şelalesi', 'Side Marina'],
    uniqueDesc: 'Side, tarihi Apollon Tapınağı ve antik tiyatrosuyla Türkiye\'nin en önemli arkeolojik bölgelerinden biridir. Sahil boyunca uzanan eski kentinin büyüleyici atmosferi ve modern tatil imkânları bir arada sunan Side, her yıl milyonlarca ziyaretçiyi ağırlamaktadır. Antalya Havalimanı\'ndan 75 km uzaklıktaki bu tarihi beldeye VIP transferler düzenliyoruz.',
    faqs: [
      { q: 'Antalya Havalimanı\'ndan Side\'ye transfer süresi ne kadar?', a: 'Ortalama 60 dakika sürmektedir. Otoyol ve D400 güzergahını kullanarak trafikten bağımsız bir yolculuk sağlıyoruz.' },
      { q: 'Side antik kent girişine kadar bırakıyor musunuz?', a: 'Evet, aracımız Side\'nin ana girişine kadar ulaşmaktadır. Antik kentin içi araç trafiğine kapalı olduğundan en yakın noktaya bırakıyoruz.' }
    ]
  },
  'beldibi': {
    distanceKm: 40,
    durationMin: 40,
    highlights: ['Beldibi Plajı', 'Kartal Kayalıkları', 'Kemer Yakını', 'Doğa Yürüyüşleri', 'Çam Ormanları'],
    uniqueDesc: 'Beldibi, Kemer\'in hemen kuzeyinde yer alan sakin ve doğayla iç içe bir tatil beldesidir. Çam ormanları arasında uzanan kıyı şeridi ve temiz denizi ile Beldibi, doğa tutkunlarına hitap etmektedir. Antalya Havalimanı\'ndan yaklaşık 40 km mesafede olan bu huzurlu bölgeye konforlu transferler sağlıyoruz.',
    faqs: [
      { q: 'Beldibi transfer süresi ne kadar?', a: 'Sahil yolunu kullanan transferlerimiz Beldibi\'ne yaklaşık 40 dakikada ulaşmaktadır.' },
      { q: 'Beldibi\'ndeki küçük pansiyonlara da transfer yapılır mı?', a: 'Evet, büyük otel olsun küçük pansiyon olsun tüm konaklama adreslerine transfer hizmeti veriyoruz.' }
    ]
  },
  'goynuk': {
    distanceKm: 43,
    durationMin: 42,
    highlights: ['Göynük Kanyonu', 'Doğal Havuzlar', 'Göynük Plajı', 'Kemer Yakını', 'Trekking Parkurları'],
    uniqueDesc: 'Göynük, Lykia Yolu\'nun en güzel güzergahlarından birini barındıran ve eşsiz kanyonuyla tanınan doğa harikası bir beldedir. Şeffaf suları ve doğal havuzlarıyla Göynük Kanyonu, hem yerel hem de yabancı doğa tutkunlarının akınına uğramaktadır. Antalya Havalimanı\'ndan 43 km mesafedeki Göynük\'e güvenli ve konforlu transferler sunuyoruz.',
    faqs: [
      { q: 'Göynük\'e transfer yaparken kanyona da uğranır mı?', a: 'Doğrudan konaklama yerinize transfer yapıyoruz, ancak talep halinde kanyon girişine bırakma da ayarlanabilir.' },
      { q: 'Göynük transfer ücreti Kemer ile aynı mı?', a: 'Göynük, Kemer\'e yakın olduğundan fiyatlar benzerdir. Kesin fiyat için WhatsApp\'tan bilgi alabilirsiniz.' }
    ]
  },
  'kemer': {
    distanceKm: 47,
    durationMin: 45,
    highlights: ['Kemer Marina', 'Phaselis Antik Kenti', 'Olimpos Teleferik', 'Cennet ve Cehennem Mağaraları', 'Kemer Plajları'],
    uniqueDesc: 'Kemer, Antalya\'nın en gözde tatil beldelerinden biridir. Turkuaz koyları ve antik kentleriyle ünlü olan Kemer, aynı zamanda Türkiye\'nin en büyük marinalarından birine ev sahipliği yapmaktadır. Lüks otelleri ve dünya standartlarında hizmetiyle her yıl milyonlarca turisti ağırlamaktadır.',
    faqs: [
      { q: 'Antalya Havalimanı\'ndan Kemer\'e transfer kaç dakika sürer?', a: 'Yaklaşık 45 dakika sürmektedir. Sahil yolundan geçen güzergahımız manzaralı bir yolculuk sunar.' },
      { q: 'Kemer Marina\'ya kadar transfer yapılır mı?', a: 'Evet, marina başta olmak üzere Kemer\'deki tüm oteller, apart oteller ve villalara transfer hizmeti veriyoruz.' }
    ]
  },
  'tekirova': {
    distanceKm: 60,
    durationMin: 58,
    highlights: ['Phaselis Antik Kenti', 'Tekirova Plajı', 'Beydağları Milli Parkı', 'Kemer Yakını', 'Dalış Noktaları'],
    uniqueDesc: 'Tekirova, Phaselis Antik Kenti\'nin hemen yanı başında, Beydağları Milli Parkı\'nın kıyısında konumlanan eşsiz bir tatil beldesidir. Antik kentin limanlarında yüzme imkânı ve doğal koylarıyla Tekirova, kalabalıktan uzak tatil arayanların gözdesidir. Antalya Havalimanı\'ndan 60 km mesafede olan bu cennet köşesine özel transferler düzenliyoruz.',
    faqs: [
      { q: 'Tekirova\'ya transfer süresi ne kadar?', a: 'Antalya Havalimanı\'ndan yaklaşık 58 dakika sürmektedir. Sahil yolunu tercih eden güzergahımız konforlu ve manzaralıdır.' },
      { q: 'Phaselis Antik Kenti girişine transfer yapılır mı?', a: 'Evet, Phaselis ziyaret programınız varsa hem antik kent girişine hem de otel adresinize transfer organize ediyoruz.' }
    ]
  },
  'kizilagac': {
    distanceKm: 110,
    durationMin: 90,
    highlights: ['Kızılağaç Plajı', 'Alanya Yakını', 'Sakin Tatil Ortamı', 'Taze Deniz Ürünleri', 'Doğal Koylar'],
    uniqueDesc: 'Kızılağaç, Alanya\'ya yakın konumuyla kalabalıktan kaçmak isteyenlerin sığınağı olan sakin bir tatil beldesidir. Doğal koyları ve taze deniz ürünleriyle yerel lezzetleri tattırabilen Kızılağaç, her geçen yıl daha fazla tatilciyi kendine çekmektedir. Antalya Havalimanı\'ndan 110 km uzaktaki bu bölgeye güvenli ve konforlu VIP transferler sunuyoruz.',
    faqs: [
      { q: 'Kızılağaç\'a transfer süresi nedir?', a: 'Yaklaşık 90 dakika sürmektedir. D400 karayolu üzerinden konforlu bir yolculukla ulaşıyoruz.' },
      { q: 'Kızılağaç\'tan Alanya\'ya gün içi transfer yapılır mı?', a: 'Evet, günübirlik transfer taleplerini de karşılıyoruz. WhatsApp\'tan rezervasyon yapabilirsiniz.' }
    ]
  },
  'okurcalar': {
    distanceKm: 125,
    durationMin: 100,
    highlights: ['Okurcalar Plajı', 'Aqua Park Tesisleri', 'Büyük Resort Oteller', 'Alanya Yakını', 'Gece Hayatı'],
    uniqueDesc: 'Okurcalar, Alanya\'ya yakın konumuyla büyük resort otelleri barındıran hareketli bir tatil beldesidir. Aqua park tesisleri ve all-inclusive otelleriyle aile tatillerine uygun olan bu bölge, özellikle Alman ve Rus turistler arasında popülerdir. Antalya Havalimanı\'ndan 125 km mesafede olan Okurcalar\'a güvenle transfer yapıyoruz.',
    faqs: [
      { q: 'Okurcalar transfer kaç saat sürer?', a: 'Yaklaşık 100 dakika (1 saat 40 dakika) sürmektedir. Konforlu Mercedes araçlarımızla keyifli bir yolculuk yaşarsınız.' },
      { q: 'Büyük otel grupları için Okurcalar transferi mümkün mü?', a: 'Evet, çok sayıda kişi için Sprinter ve büyük araçlarla grup transferleri organize ediyoruz.' }
    ]
  },
  'incekum': {
    distanceKm: 135,
    durationMin: 110,
    highlights: ['İncekum Plajı', 'Avsallar Yakını', 'All-Inclusive Oteller', 'Uzun Kumsal', 'Sakin Tatil'],
    uniqueDesc: 'İncekum, adını ince ve beyaz kumundan alan, Avsallar\'a bağlı sakin bir tatil beldesidir. Uzun kum plajı ve sakin atmosferiyle dinlenmek isteyen tatilcilerin tercihi olan İncekum, all-inclusive otelleriyle de öne çıkmaktadır. Antalya Havalimanı\'ndan 135 km mesafede olan İncekum\'a VIP transfer hizmeti sunmaktayız.',
    faqs: [
      { q: 'İncekum\'a transfer süresi ne kadar?', a: 'Antalya Havalimanı\'ndan yaklaşık 110 dakika sürmektedir. Uzun yolculukta konforunuz için araçlarımızda klima ve Wi-Fi mevcuttur.' },
      { q: 'İncekum transferi için önceden rezervasyon şart mı?', a: 'Kesin yer garantisi için en az 24 saat öncesinden rezervasyon öneriyoruz, ancak acil durumlarda anlık talepleri de değerlendiriyoruz.' }
    ]
  },
  'turkler': {
    distanceKm: 140,
    durationMin: 115,
    highlights: ['Türkler Plajı', 'Alanya Yakını', 'Doğal Plajlar', 'Balıkçı Tekneleri', 'Sakin Köy Atmosferi'],
    uniqueDesc: 'Türkler, Alanya yakınında kalabalıktan uzak doğal plajlarıyla ünlü sakin bir tatil beldesidir. Balıkçı tekne turları ve taze deniz ürünleriyle Ege yaşam tarzını yansıtan bu köyde tatil, şehrin gürültüsünden kaçmak için ideal bir seçenektir. Antalya Havalimanı\'ndan 140 km uzaktaki Türkler\'e özel VIP transfer hizmeti sağlıyoruz.',
    faqs: [
      { q: 'Türkler bölgesine transfer yapılır mı?', a: 'Evet, Türkler dahil Antalya bölgesindeki tüm tatil beldelerine transfer hizmeti sunuyoruz.' },
      { q: 'Türkler transfer süresi nedir?', a: 'Antalya Havalimanı\'ndan yaklaşık 115 dakika sürmektedir.' }
    ]
  },
  'konakli': {
    distanceKm: 145,
    durationMin: 115,
    highlights: ['Konaklı Plajı', 'Alanya Yakını', 'All-Inclusive Oteller', 'Aqua Parklar', 'Atatürk Bulvarı'],
    uniqueDesc: 'Konaklı, Alanya\'ya bağlı ve sahil boyunca uzanan büyük resort otelleriyle tanınan bir tatil beldesidir. All-inclusive konseptli devasa otelleri ve su parkı tesisleriyle özellikle aile tatillerine uygun olan Konaklı, her sezon yoğun bir turist akını yaşar. Antalya Havalimanı\'ndan 145 km uzaktaki Konaklı\'ya güvenli ve konforlu transferler sağlıyoruz.',
    faqs: [
      { q: 'Konaklı\'ya transfer süresi ne kadar?', a: 'Yaklaşık 115 dakika sürmektedir. Uzun yolculuk için araçlarımızda klima, Wi-Fi ve geniş koltuk konforu sunuyoruz.' },
      { q: 'Konaklı\'daki her otele ulaşım yapılır mı?', a: 'Evet, Konaklı\'daki tüm oteller, apart oteller ve villa adreslerine kapıdan kapıya servis veriyoruz.' }
    ]
  },
  'alanya': {
    distanceKm: 150,
    durationMin: 120,
    highlights: ['Alanya Kalesi', 'Kleopatra Plajı', 'Kızılkule', 'Damlataş Mağarası', 'Alanya Marina'],
    uniqueDesc: 'Alanya, Osmanlı döneminden kalma kalesi ve efsanevi Kleopatra Plajı ile Türkiye\'nin en popüler turizm destinasyonlarından biridir. Kızılkule\'nin silueti ve denize karşı kurulu kalenin manzarası Alanya\'ya özgün bir kimlik katmaktadır. Antalya Havalimanı\'ndan 150 km mesafede olan Alanya\'ya VIP ve konforlu transfer hizmeti sunuyoruz.',
    faqs: [
      { q: 'Antalya Havalimanı\'ndan Alanya\'ya transfer süresi nedir?', a: 'Yaklaşık 2 saat (120 dakika) sürmektedir. Araçlarımızda klima, Wi-Fi ve geniş koltuk konforu mevcuttur.' },
      { q: 'Alanya transfer saatleri nelerdir?', a: '7/24 hizmet veriyoruz. Gece yarısı ve sabah erken saatlerde de transfer organize edebiliyoruz.' }
    ]
  },
  'mahmutlar': {
    distanceKm: 160,
    durationMin: 130,
    highlights: ['Mahmutlar Plajı', 'Alanya Yakını', 'Rus Mutfağı Restoranları', 'Bazar ve Pazarlar', 'Uzun Sahil Şeridi'],
    uniqueDesc: 'Mahmutlar, Alanya\'ya bağlı ve özellikle Rus ve Kazak turistlerin yoğun ilgisini çeken kozmopolit bir tatil beldesidir. Uzun sahil şeridi, uygun fiyatlı apart otelleri ve çeşitli restoranlarıyla canlı bir yaşam sunan Mahmutlar, kalabalık tatil arayanlar için ideal bir destinasyondur. Antalya Havalimanı\'ndan 160 km uzaktaki bu bölgeye konforlu transferler organize ediyoruz.',
    faqs: [
      { q: 'Mahmutlar\'a transfer süresi ne kadar?', a: 'Yaklaşık 130 dakika (2 saat 10 dakika) sürmektedir. Keyifli ve konforlu bir yolculuk için araçlarımız tam teçhizatlıdır.' },
      { q: 'Mahmutlar apart otellere de transfer yapılır mı?', a: 'Evet, resort oteller dahil her türlü konaklama adresine kapıdan kapıya transfer hizmeti sunuyoruz.' }
    ]
  },
  'kargicak': {
    distanceKm: 165,
    durationMin: 135,
    highlights: ['Kargıcak Plajı', 'Alanya Yakını', 'Doğal Koylar', 'Yeşil Bahçeli Villalar', 'Sakin Tatil Ortamı'],
    uniqueDesc: 'Kargıcak, Alanya\'nın doğusunda yer alan sakin ve yeşil bir tatil beldesidir. Doğal koyları ve villa tipi konaklama seçenekleriyle kalabalıktan uzak bir tatil arayan ziyaretçilerin tercih ettiği Kargıcak, giderek büyüyen bir turist potansiyeline sahiptir. Antalya Havalimanı\'ndan 165 km uzaktaki bu güzel bölgeye VIP transfer hizmeti sağlıyoruz.',
    faqs: [
      { q: 'Kargıcak transfer süresi nedir?', a: 'Yaklaşık 135 dakika sürmektedir. Uzun yolculuklarda konfor ve güvenlik önceliğimizdir.' },
      { q: 'Kargıcak villalarına transfer yapılır mı?', a: 'Evet, otel olmayan villa ve özel konaklama adreslerine de kapıdan kapıya transfer hizmeti veriyoruz.' }
    ]
  },
  'adrasan': {
    distanceKm: 80,
    durationMin: 80,
    highlights: ['Adrasan Koyu', 'Olimpos Yakını', 'Çıralı Yakını', 'Doğal Plaj', 'Caretta Caretta Yuvası'],
    uniqueDesc: 'Adrasan, araç trafiğine kapalı doğal plajı ve caretta caretta yuvalarıyla Türkiye\'nin en değerli koylarından birini barındırmaktadır. Olimpos ve Çıralı\'ya yakın konumuyla bu üç koyun birlikte keşfedilebileceği güzergahta yer alan Adrasan, ekoturizm tutkunlarının rotasındadır. Antalya Havalimanı\'ndan 80 km mesafedeki bu doğa harikasına özel transferler sunuyoruz.',
    faqs: [
      { q: 'Adrasan\'a araçla ulaşım mümkün mü?', a: 'Evet, Adrasan köyüne kadar araçla ulaşım mümkündür. Plajın kendisi araç trafiğine kapalı olup kısa bir yürüyüş gerektirir.' },
      { q: 'Adrasan transfer süresi ne kadar?', a: 'Antalya Havalimanı\'ndan yaklaşık 80 dakika sürmektedir. Dağlık arazi nedeniyle dikkatli ve deneyimli şoförlerimiz görev yapmaktadır.' }
    ]
  },
  'lara': {
    distanceKm: 18,
    durationMin: 22,
    highlights: ['Lara Plajı', 'Waterfall Park', 'Lara Otelleri', 'Düden Şelalesi', 'AquaCity Su Parkı'],
    uniqueDesc: 'Lara, Antalya Havalimanı\'na yakınlığı ve dünyaca ünlü 5 yıldızlı resort otelleriyle Antalya\'nın en prestijli tatil bölgelerinden biridir. Mavi bayraklı kumsalı, Düden Şelalesi ve AquaCity su parkıyla her yaştan tatilciyi cezbeden Lara, lüks konaklama seçenekleriyle de öne çıkmaktadır. Havalimanına sadece 18 km mesafedeki Lara\'ya hızlı ve konforlu transferler sağlıyoruz.',
    faqs: [
      { q: 'Antalya Havalimanı\'ndan Lara\'ya transfer süresi nedir?', a: 'Yaklaşık 22 dakika gibi çok kısa bir sürede ulaşabilirsiniz. Lara, havalimanına en yakın tatil bölgelerinden biridir.' },
      { q: 'Lara\'daki 5 yıldızlı oteller için transfer fiyatı nedir?', a: 'Fiyatlar araç tipine göre değişmektedir. Kısa mesafe olduğundan uygun fiyatlı seçenekler mevcuttur. WhatsApp\'tan bilgi alabilirsiniz.' }
    ]
  },
  'bodrum': {
    distanceKm: 290,
    durationMin: 240,
    highlights: ['Bodrum Kalesi', 'Mausoleum', 'Bodrum Marina', 'Gümbet Plajı', 'Yalıkavak Çarşısı'],
    uniqueDesc: 'Bodrum, Ege\'nin en gözde tatil destinasyonu olup antik Halikarnas\'ın kalıntılarını modern lüks yaşamla harmanlayan eşsiz bir şehirdir. Bodrum Kalesi, dünyanın yedi harikasından biri olan Mausoleum\'un bulunduğu bu şehir, sefahat ve tarih meraklılarına aynı anda hitap etmektedir. Antalya Havalimanı\'ndan 290 km uzakta olan Bodrum\'a konforlu VIP transfer hizmeti sunmaktayız.',
    faqs: [
      { q: 'Antalya Havalimanı\'ndan Bodrum\'a transfer ne kadar sürer?', a: 'Yaklaşık 4 saat (240 dakika) sürmektedir. Uzun yolculuk için klimalı, Wi-Fi\'lı konforlu araçlarımızla keyifli bir yolculuk yaşarsınız.' },
      { q: 'Bodrum transferi için ön ödeme gerekiyor mu?', a: 'Hayır, ödeme nakit veya kart olarak yolculuk tamamlandıktan sonra ya da öncesinde yapılabilir. Esnek ödeme seçenekleri sunuyoruz.' }
    ]
  },
  'dalaman': {
    distanceKm: 230,
    durationMin: 200,
    highlights: ['Dalaman Havalimanı (DLM)', 'Dalyan Kanalı', 'İztuzu Plajı', 'Kaunos Antik Kenti', 'Köyceğiz Gölü'],
    uniqueDesc: 'Dalaman, kendi havalimanına rağmen Antalya Havalimanı\'ndan gelen transferlerle de ulaşılan, doğal güzellikleriyle öne çıkan bir destinasyondur. Yakınındaki Dalyan kanalı, İztuzu plajı ve Kaunos antik kentine geçit veren Dalaman, ekoturizm ve kültür turları için ideal bir merkez konumundadır. Antalya Havalimanı\'ndan 230 km uzaktaki Dalaman\'a VIP transfer düzenliyoruz.',
    faqs: [
      { q: 'Antalya Havalimanı\'ndan Dalaman\'a transfer süresi ne kadar?', a: 'Yaklaşık 200 dakika (3 saat 20 dakika) sürmektedir. Uzun yolculuk için konforlu araçlarımız ve deneyimli şoförlerimiz hizmetinizdedir.' },
      { q: 'Dalaman\'dan Dalyan\'a geçiş yapılır mı?', a: 'Evet, Dalaman merkez yanı sıra Dalyan ve diğer çevre noktalara da transfer organize edebiliyoruz.' }
    ]
  },
  'fethiye': {
    distanceKm: 200,
    durationMin: 175,
    highlights: ['Ölüdeniz Lagünü', 'Kayaköy', 'Saklıkent Kanyonu', 'Fethiye Marina', 'Likya Yolu'],
    uniqueDesc: 'Fethiye, dünyaca ünlü Ölüdeniz lagünü ve Saklıkent Kanyonu ile Türkiye\'nin en popüler destinasyonlarından biridir. Tarihi Kayaköy ve Likya Yolu\'nun güzergahında yer alan bu kentin marinası ve çarşısı ayrı bir canlılık katmaktadır. Antalya Havalimanı\'ndan 200 km mesafede olan Fethiye\'ye konforlu ve güvenli VIP transferler düzenliyoruz.',
    faqs: [
      { q: 'Antalya Havalimanı\'ndan Fethiye\'ye transfer süresi nedir?', a: 'Yaklaşık 175 dakika (2 saat 55 dakika) sürmektedir. Güzergah boyunca akdeniz manzarası eşliğinde konforlu bir yolculuk yaşarsınız.' },
      { q: 'Fethiye\'ye gece transferi mümkün mü?', a: 'Evet, 7/24 hizmet veriyoruz. Gece uçuşlarından sonra da güvenli şekilde Fethiye\'ye ulaşmanızı sağlıyoruz.' }
    ]
  },
  'gocek': {
    distanceKm: 215,
    durationMin: 185,
    highlights: ['Göcek Marina', 'Yat Limanı', 'Göcek Adaları', 'Tersane Koyu', 'Lüks Tekneler'],
    uniqueDesc: 'Göcek, yat tutkunlarının ve lüks tatil arayanların gözdesi olan butik bir marinalar kentidir. Eşsiz adaları ve doğal koylarıyla güneşin son ışığında mavi yolculukların başladığı nokta olan Göcek, sakin ve seçkin bir tatil için idealdir. Antalya Havalimanı\'ndan 215 km uzakta olan Göcek\'e VIP transfer hizmeti sunmaktayız.',
    faqs: [
      { q: 'Göcek Marina\'ya transfer yapılır mı?', a: 'Evet, doğrudan marina ve yat limanı girişine kadar transfer hizmeti sağlıyoruz.' },
      { q: 'Göcek transfer süresi ne kadar?', a: 'Antalya Havalimanı\'ndan yaklaşık 185 dakika (3 saat 5 dakika) sürmektedir.' }
    ]
  },
  'marmaris': {
    distanceKm: 310,
    durationMin: 260,
    highlights: ['Marmaris Kalesi', 'Marmaris Marina', 'İçmeler Plajı', 'Bar Sokağı', 'Tekne Turları'],
    uniqueDesc: 'Marmaris, devasa marinası, canlı gece hayatı ve çevre koylarıyla her yıl milyonlarca turisti ağırlayan efsanevi bir destinasyondur. İçmeler gibi komşu beldelerle birlikte oluşturduğu tatil kümelenmesi ve çevre adaları keşfetmek için düzenlenen tekne turlarıyla öne çıkan Marmaris, Ege\'nin en kozmopolit tatil şehridir. Antalya Havalimanı\'ndan 310 km uzaktaki Marmaris\'e konforlu transferler sunuyoruz.',
    faqs: [
      { q: 'Antalya Havalimanı\'ndan Marmaris\'e transfer süresi nedir?', a: 'Yaklaşık 260 dakika (4 saat 20 dakika) sürmektedir. Bu uzun yolculuk için klimalı, Wi-Fi\'lı ve geniş koltuklı araçlarımız hazır.' },
      { q: 'Marmaris\'e iki kişi için özel transfer fiyatı nedir?', a: 'Fiyatlar araç tipine göre değişmektedir. Sedan ve VIP araç seçenekleri için WhatsApp\'tan fiyat teklifi alabilirsiniz.' }
    ]
  },
  'oludeniz': {
    distanceKm: 195,
    durationMin: 170,
    highlights: ['Ölüdeniz Lagünü', 'Babadağ Yamaç Paraşütü', 'Belcegiz Plajı', 'Butterfly Valley', 'Mavi Mağara'],
    uniqueDesc: 'Ölüdeniz, kristal berraklığındaki lagünü ve Babadağ\'dan yapılan yamaç paraşütü aktivitesiyle dünyada en çok fotoğraflanan sahiller arasında yer almaktadır. Mavi bayraklı plajı ve çevre koylarıyla doğanın sunduğu en güzel tablolardan birini oluşturan Ölüdeniz\'e Antalya Havalimanı\'ndan 195 km mesafede VIP transfer hizmeti veriyoruz.',
    faqs: [
      { q: 'Ölüdeniz\'e transfer süresi nedir?', a: 'Yaklaşık 170 dakika (2 saat 50 dakika) sürmektedir. Fethiye üzerinden dağ yollarını geçen güzergahımız deneyimli şoförlerimiz tarafından takip edilmektedir.' },
      { q: 'Ölüdeniz\'den yamaç paraşütü noktasına transfer yapılır mı?', a: 'Evet, Babadağ kalkış noktasına kadar transfer organize edebiliyoruz.' }
    ]
  },
  'avsallar': {
    distanceKm: 130,
    durationMin: 105,
    highlights: ['Avsallar Plajı', 'İncekum Yakını', 'All-Inclusive Oteller', 'Uzun Kumsal', 'Su Sporları'],
    uniqueDesc: 'Avsallar, Alanya\'ya yakın konumuyla uygun fiyatlı all-inclusive otelleri ve uzun kumsal şeridiyle aile tatillerinin vazgeçilmezi olan bir tatil beldesidir. İncekum plajının başladığı nokta olan Avsallar, sakin tatil ortamı ve su sporları imkânlarıyla tatilcileri memnun etmektedir. Antalya Havalimanı\'ndan 130 km mesafedeki Avsallar\'a konforlu transferler sunuyoruz.',
    faqs: [
      { q: 'Avsallar transfer süresi nedir?', a: 'Yaklaşık 105 dakika sürmektedir. Yolculuk boyunca klimanız ve Wi-Fi\'ınız aktif olarak hizmetinizdedir.' },
      { q: 'Avsallar\'daki apart otellere transfer yapılır mı?', a: 'Evet, büyük resort oteller dahil tüm konaklama türlerine kapıdan kapıya transfer hizmeti veriyoruz.' }
    ]
  },
  'bogazkent': {
    distanceKm: 50,
    durationMin: 45,
    highlights: ['Boğazkent Plajı', 'Belek Yakını', 'Golf Sahaları', 'Köprülü Kanyon Yakını', 'Yeşil Doğa'],
    uniqueDesc: 'Boğazkent, Belek\'e yakın konumuyla golf turizminin etkisini taşıyan ve lüks konaklama seçenekleri sunan bir tatil beldesidir. Köprülü Kanyon\'a yakınlığıyla doğa turizmini de bünyesinde barındıran Boğazkent, hem aktif hem de huzurlu tatil arayanlar için idealdir. Antalya Havalimanı\'ndan 50 km mesafedeki bu bölgeye konforlu VIP transferler düzenliyoruz.',
    faqs: [
      { q: 'Boğazkent transfer süresi ne kadar?', a: 'Yaklaşık 45 dakika sürmektedir. Belek güzergahını kullanan aracımız hızlı ve konforlu bir yolculuk sunar.' },
      { q: 'Boğazkent\'ten Köprülü Kanyon\'a gidip gelme transferi mümkün mü?', a: 'Evet, günübirlik tur transferleri için de hizmet veriyoruz. WhatsApp\'tan detaylı bilgi alabilirsiniz.' }
    ]
  },
  'camyuva': {
    distanceKm: 55,
    durationMin: 52,
    highlights: ['Çamyuva Plajı', 'Kemer Yakını', 'Çam Ormanları', 'Sakin Tatil Ortamı', 'Su Sporları'],
    uniqueDesc: 'Çamyuva, adını çam ormanlarından alan ve Kemer\'e komşu sakin bir tatil beldesidir. Yemyeşil çam ağaçları ve temiz denizi ile Çamyuva, doğayla iç içe bir tatil arayanların tercih ettiği küçük bir cennettir. Antalya Havalimanı\'ndan 55 km uzaktaki Çamyuva\'ya konforlu ve hızlı VIP transferler sunuyoruz.',
    faqs: [
      { q: 'Çamyuva transfer süresi nedir?', a: 'Antalya Havalimanı\'ndan yaklaşık 52 dakika sürmektedir. Sahil yolunu kullanan güzergahımız keyiflidir.' },
      { q: 'Çamyuva\'dan Kemer\'e transfer yapılır mı?', a: 'Evet, Çamyuva - Kemer arası kısa bir mesafe olduğundan kombine transfer talepleri de karşılanabilir.' }
    ]
  },
  'cirali': {
    distanceKm: 78,
    durationMin: 78,
    highlights: ['Çıralı Plajı', 'Yanartaş (Chimaera)', 'Olimpos Antik Kenti', 'Caretta Caretta Yuvası', 'Doğal Plaj'],
    uniqueDesc: 'Çıralı, doğal tahta evleri, caretta caretta yuvası ve yanardağ efsaneleriyle tarihe konu olan gizemli Yanartaş ile eşsiz bir deneyim sunar. Araç trafiğine büyük ölçüde kapalı olan Çıralı, ekolojik tatil konseptinin simgesi haline gelmiştir. Antalya Havalimanı\'ndan 78 km uzaktaki bu eşsiz koya konforlu özel transferler düzenliyoruz.',
    faqs: [
      { q: 'Çıralı\'ya araçla girmek mümkün mü?', a: 'Köy girişine kadar araçla ulaşılabilmektedir. Konaklama noktanıza bagajlarınızla ulaşmanız için en uygun noktaya bırakılırsınız.' },
      { q: 'Yanartaş\'a gece transferi yapılır mı?', a: 'Evet, Yanartaş gece görüntüsü için düzenlenen özel gece transferlerini de organize edebiliyoruz.' }
    ]
  },
  'demre': {
    distanceKm: 145,
    durationMin: 130,
    highlights: ['Noel Baba Kilisesi', 'Myra Antik Kenti', 'Kekova Batık Şehri', 'Andriake Limanı', 'Demre Çarşısı'],
    uniqueDesc: 'Demre, Noel Baba\'nın doğduğu şehir olarak tüm dünyada tanınan ve Myra Antik Kenti ile Kekova Batık Şehri\'ne kapı açan tarihi bir destinasyondur. Her yıl milyonlarca Hristiyan ziyaretçinin Noel Baba\'nın Kilisesi\'ni ziyaret ettiği Demre, aynı zamanda limon ve domates bahçeleriyle verimli tarım arazileriyle de ünlüdür. Antalya Havalimanı\'ndan 145 km uzaktaki Demre\'ye VIP transferler sunuyoruz.',
    faqs: [
      { q: 'Demre (Myra) transfer süresi ne kadar?', a: 'Antalya Havalimanı\'ndan yaklaşık 130 dakika sürmektedir. Sahil yolundan giden güzergahımız güvenli ve manzaralıdır.' },
      { q: 'Kekova tekne turuna başlamak için Demre\'ye transfer yapılır mı?', a: 'Evet, Kekova tekne turu için gerekli tüm noktaları kapsayan transfer düzenleyebiliriz.' }
    ]
  },
  'denizyaka': {
    distanceKm: 70,
    durationMin: 58,
    highlights: ['Denizyaka Plajı', 'Manavgat Yakını', 'Sakin Tatil Ortamı', 'Doğal Koylar', 'Taze Balık Restoranları'],
    uniqueDesc: 'Denizyaka, Manavgat\'a yakın ve turistik kalabalıktan uzak sakin bir tatil köyüdür. Doğal koyları ve taze balık restoranlarıyla yerel tatil kültürünü yansıtan Denizyaka, huzur arayanların tercih ettiği bir beldedir. Antalya Havalimanı\'ndan 70 km mesafedeki Denizyaka\'ya konforlu transfer hizmeti sunmaktayız.',
    faqs: [
      { q: 'Denizyaka transfer süresi nedir?', a: 'Yaklaşık 58 dakika sürmektedir. D400 güzergahından hızlı bir şekilde ulaşım sağlıyoruz.' },
      { q: 'Denizyaka\'daki küçük pansiyonlara transfer yapılır mı?', a: 'Evet, tüm konaklama türlerine kapıdan kapıya servis sağlıyoruz.' }
    ]
  },
  'finike': {
    distanceKm: 170,
    durationMin: 150,
    highlights: ['Finike Portakal Bahçeleri', 'Finike Marina', 'Arykanda Antik Kenti', 'Limyra Antik Kenti', 'Finike Plajı'],
    uniqueDesc: 'Finike, tatlı portakallarıyla tüm Türkiye\'de tanınan ve Lykia\'nın en sağlıklı yaşam mekânlarından biri kabul edilen şirin bir sahil kentidir. Yat limanı, antik kentleri ve uzun sahiliyle Finike, sessiz ama bir o kadar zengin bir tatil sunmaktadır. Antalya Havalimanı\'ndan 170 km mesafedeki Finike\'ye VIP transferler düzenliyoruz.',
    faqs: [
      { q: 'Finike transfer süresi ne kadar?', a: 'Antalya Havalimanı\'ndan yaklaşık 150 dakika (2,5 saat) sürmektedir. Uzun yolculuk için konforlu araçlarımız hizmetinizdedir.' },
      { q: 'Finike\'den Arykanda Antik Kenti\'ne transfer yapılır mı?', a: 'Evet, Finike merkezinden çevre tarihi noktalara günübirlik transferler de organize edebiliyoruz.' }
    ]
  },
  'gundogdu': {
    distanceKm: 90,
    durationMin: 75,
    highlights: ['Gündoğdu Plajı', 'Manavgat Yakını', 'Doğal Kumsal', 'Aile Tatil Ortamı', 'Side Yakını'],
    uniqueDesc: 'Gündoğdu, Side ve Manavgat\'ın hemen yakınında, doğal kumsalı ve sakin ortamıyla aile tatillerine uygun bir beldedir. Şehrin gürültüsünden uzak, otantik bir tatil deneyimi sunan Gündoğdu\'da doğal plajlar ve yerel restoranlar ön plana çıkmaktadır. Antalya Havalimanı\'ndan 90 km mesafedeki bu bölgeye konforlu transferler sunuyoruz.',
    faqs: [
      { q: 'Gündoğdu transfer süresi nedir?', a: 'Yaklaşık 75 dakika sürmektedir. D400 üzerinden rahat bir yolculuk gerçekleştirilmektedir.' },
      { q: 'Gündoğdu\'dan Side\'ye gidip gelme transferi mümkün mü?', a: 'Evet, kombine güzergah talepleri için lütfen WhatsApp\'tan bizimle iletişime geçin.' }
    ]
  },
  'kalkan': {
    distanceKm: 210,
    durationMin: 180,
    highlights: ['Kalkan Limanı', 'Kaputaş Plajı', 'Patara Plajı', 'Likya Yolu', 'Kalkan Çarşısı'],
    uniqueDesc: 'Kalkan, butik otelleri, beyaz badanalı evleri ve Akdeniz mutfağıyla Türkiye\'nin en şık ve romantik tatil beldelerinden biridir. Yakınındaki Kaputaş ve Patara plajları ile Likya Yolu\'na çıkış noktası olan Kalkan, keşfedilmeyi bekleyen hazinelerle doludur. Antalya Havalimanı\'ndan 210 km uzaktaki Kalkan\'a konforlu VIP transferler düzenliyoruz.',
    faqs: [
      { q: 'Kalkan transfer süresi nedir?', a: 'Yaklaşık 180 dakika (3 saat) sürmektedir. Güzergah boyunca muhteşem Akdeniz manzarası eşliğinde keyifli bir yolculuk yaşarsınız.' },
      { q: 'Kalkan\'dan Kaputaş Plajı\'na transfer yapılır mı?', a: 'Evet, Kaputaş plajı Kalkan\'a çok yakın olduğundan günübirlik transfer taleplerini de karşılıyoruz.' }
    ]
  },
  'kas': {
    distanceKm: 220,
    durationMin: 190,
    highlights: ['Kaş Limanı', 'Kekova Batık Şehri', 'Mavi Mağara', 'Patara Plajı', 'Dalış Noktaları'],
    uniqueDesc: 'Kaş, Ege ve Akdeniz\'in kesiştiği noktada, antik Lykia uygarlığının izlerini taşıyan ve dünya genelinde en iyi dalış noktalarından biri olarak kabul edilen büyüleyici bir kenttir. Kekova Batık Şehri\'ne tekne turları ve Patara\'nın uzun kumsalına yakınlığıyla Kaş, hem macera hem de dinlence arayanları bir arada memnun etmektedir. Antalya Havalimanı\'ndan 220 km uzaktaki Kaş\'a VIP transferler düzenliyoruz.',
    faqs: [
      { q: 'Kaş transfer süresi ne kadar?', a: 'Yaklaşık 190 dakika (3 saat 10 dakika) sürmektedir. Dağlık güzergah deneyimli şoförlerimiz tarafından güvenle aşılmaktadır.' },
      { q: 'Kaş\'tan Kekova\'ya geçiş için transfer düzenlenebilir mi?', a: 'Evet, Kekova tekne turu başlangıç noktalarına kadar transfer organize edebiliyoruz.' }
    ]
  },
  'kestel': {
    distanceKm: 168,
    durationMin: 135,
    highlights: ['Kestel Plajı', 'Alanya Yakını', 'Muz Bahçeleri', 'Sakin Tatil Ortamı', 'Yerel Pazarlar'],
    uniqueDesc: 'Kestel, Alanya\'nın batısında yer alan ve muz bahçeleriyle çevrili sakin bir tatil beldesidir. Alanya\'ya yakın konumuyla her türlü hizmete kolay erişim imkânı sunarken kendine has sakin atmosferini koruyan Kestel, doğal bir tatil arayanlar için güzel bir seçenektir. Antalya Havalimanı\'ndan 168 km mesafedeki Kestel\'e konforlu transferler sunuyoruz.',
    faqs: [
      { q: 'Kestel transfer süresi nedir?', a: 'Yaklaşık 135 dakika sürmektedir. D400 üzerinden güvenli bir yolculukla ulaşım sağlıyoruz.' },
      { q: 'Kestel\'den Alanya\'ya gidip gelme transferi yapılır mı?', a: 'Evet, Kestel - Alanya arası çok kısa bir mesafe olduğundan kombine transferler organize edebiliyoruz.' }
    ]
  },
  'kizilot': {
    distanceKm: 115,
    durationMin: 95,
    highlights: ['Kızılot Plajı', 'Alanya Yakını', 'Doğal Kumsal', 'Muz Bahçeleri', 'Sakin Köy Tatili'],
    uniqueDesc: 'Kızılot, Alanya\'ya yakın konumuyla kalabalıktan uzak, doğal plajı ve taze muz bahçeleriyle sakin bir tatil ortamı sunan bir beldedir. Henüz büyük otellerin girmediği bu bölge, otantik bir tatil deneyimi arayanlar için ideal bir destinasyon olmayı sürdürmektedir. Antalya Havalimanı\'ndan 115 km mesafedeki Kızılot\'a özel transfer hizmeti sunuyoruz.',
    faqs: [
      { q: 'Kızılot transfer süresi nedir?', a: 'Antalya Havalimanı\'ndan yaklaşık 95 dakika sürmektedir.' },
      { q: 'Kızılot\'a küçük konuklara (çocuklara) uygun araçlar var mı?', a: 'Evet, ücretsiz bebek koltuğu ve çocuk koltuğu ile aile transferlerinizi güvenle gerçekleştiriyoruz.' }
    ]
  },
  'kiris': {
    distanceKm: 52,
    durationMin: 50,
    highlights: ['Kiriş Plajı', 'Kemer Yakını', 'All-Inclusive Oteller', 'Su Sporları', 'Çam Ormanları'],
    uniqueDesc: 'Kiriş, Kemer\'e bağlı sakin bir tatil beldesi olup all-inclusive konseptiyle hizmet veren büyük otelleri ve çam ormanları arasındaki konumuyla öne çıkmaktadır. Temiz denizi ve manzaralı plajıyla Kiriş, Kemer\'in sakin versiyonu olarak değerlendirilebilir. Antalya Havalimanı\'ndan 52 km mesafedeki Kiriş\'e VIP transfer hizmeti sunmaktayız.',
    faqs: [
      { q: 'Kiriş transfer süresi nedir?', a: 'Antalya Havalimanı\'ndan yaklaşık 50 dakika sürmektedir.' },
      { q: 'Kiriş ile Kemer arasında transfer yapılır mı?', a: 'Evet, Kiriş - Kemer arası kombine transferler talep halinde organize edilebilir.' }
    ]
  },
  'kumluca': {
    distanceKm: 155,
    durationMin: 135,
    highlights: ['Kumluca Plajı', 'Finike Yakını', 'Tarım Arazileri', 'Phaselis Yakını', 'Doğal Koylar'],
    uniqueDesc: 'Kumluca, domates ve narenciye üretiminin merkezi olduğu verimli ovaları ve sakin sahiliyle ayrışan bir Akdeniz beldesidiir. Finike ve Phaselis\'e yakın konumuyla tarih ve doğayı bir arada keşfetmek isteyenler için ideal olan Kumluca\'ya Antalya Havalimanı\'ndan 155 km mesafede konforlu transferler sunuyoruz.',
    faqs: [
      { q: 'Kumluca transfer süresi ne kadar?', a: 'Yaklaşık 135 dakika sürmektedir. Sahil yolunu kullanan güzergahımız manzaralı ve güvenlidir.' },
      { q: 'Kumluca\'dan Phaselis\'e gün içi transfer mümkün mü?', a: 'Evet, Phaselis Antik Kenti\'ne günübirlik transfer taleplerinizi de karşılıyoruz.' }
    ]
  },
  'manavgat': {
    distanceKm: 85,
    durationMin: 70,
    highlights: ['Manavgat Şelalesi', 'Manavgat Çarşısı', 'Manavgat Nehri Tekne Turları', 'Side Yakını', 'Yerel Pazarlar'],
    uniqueDesc: 'Manavgat, Türkiye\'nin en büyük nehir şelalesine ev sahipliği yapan ve Side antik kentine yakınlığıyla turizmin yoğun yaşandığı bir ilçe merkezidir. Nehir boyunca düzenlenen tekne turları ve Salı günleri kurulan renkli pazarıyla yerel kültürü tanımak isteyen ziyaretçileri cezbetmektedir. Antalya Havalimanı\'ndan 85 km uzaktaki Manavgat\'a konforlu VIP transfer hizmeti sunuyoruz.',
    faqs: [
      { q: 'Antalya Havalimanı\'ndan Manavgat\'a transfer süresi nedir?', a: 'Yaklaşık 70 dakika sürmektedir. D400 güzergahından rahat ve hızlı bir yolculukla ulaşıyoruz.' },
      { q: 'Manavgat Şelalesi\'ne kadar transfer yapılır mı?', a: 'Evet, Manavgat merkezi yanı sıra şelale girişine kadar transfer organize edebiliyoruz.' }
    ]
  },
  'olimpos': {
    distanceKm: 75,
    durationMin: 75,
    highlights: ['Olimpos Antik Kenti', 'Olimpos Plajı', 'Teleferik (Tahtalı Dağı)', 'Yanartaş', 'Çıralı Yakını'],
    uniqueDesc: 'Olimpos, antik liman kenti kalıntıları, efsanevi Yanartaş ve Tahtalı Dağı teleferikiyle Lykia\'nın en büyüleyici destinasyonlarından biridir. Ağaç evleri ve hippie atmosferiyle genç gezginlerin sevgili adresi olan Olimpos, aynı zamanda bölgenin en uzun doğal plajlarından birine ev sahipliği yapmaktadır. Antalya Havalimanı\'ndan 75 km uzaktaki Olimpos\'a konforlu transferler sunuyoruz.',
    faqs: [
      { q: 'Olimpos transfer süresi ne kadar?', a: 'Yaklaşık 75 dakika sürmektedir. Sahil yolu ve dağ yollarını kullanan güzergah deneyimli şoförlerimizce güvenle tamamlanmaktadır.' },
      { q: 'Olimpos Teleferik (Tahtalı) girişine transfer yapılır mı?', a: 'Evet, Tahtalı Dağı teleferik istasyonuna kadar transfer organize edebiliyoruz.' }
    ]
  },
  'sorgun': {
    distanceKm: 78,
    durationMin: 62,
    highlights: ['Sorgun Plajı', 'Side Yakını', 'All-Inclusive Oteller', 'Çam Ormanları', 'Su Sporları'],
    uniqueDesc: 'Sorgun, Side\'ye yakın konumuyla çam ormanları arasına kurulu all-inclusive otelleri ve uzun doğal plajıyla öne çıkan bir tatil beldesidir. Yeşil ve mavinin buluştuğu bu bölge, sessiz ve huzurlu bir tatil ortamı arayanlar için idealdir. Antalya Havalimanı\'ndan 78 km uzaktaki Sorgun\'a konforlu ve dakik VIP transferler düzenliyoruz.',
    faqs: [
      { q: 'Sorgun transfer süresi nedir?', a: 'Antalya Havalimanı\'ndan yaklaşık 62 dakika sürmektedir. Hızlı ve konforlu bir ulaşım sağlıyoruz.' },
      { q: 'Sorgun\'daki otellerin özel plajına kadar transfer yapılır mı?', a: 'Evet, her otelin güvenlik girişine kadar transfer hizmeti sunuyoruz.' }
    ]
  },
  'titreyengol': {
    distanceKm: 82,
    durationMin: 65,
    highlights: ['Titreyengöl Gölü', 'Side Yakını', 'Doğa Yürüyüşleri', 'All-Inclusive Oteller', 'Kuş Gözlemciliği'],
    uniqueDesc: 'Titreyengöl, adını bölgedeki tatlı su gölünden alan ve Side\'ye yakın konumuyla doğa turizmine elverişli bir tatil beldesidir. Gölü, bölgeye has kuş türleri ve all-inclusive otelleriyle Titreyengöl, farklı tatil tercihlerine hitap etmektedir. Antalya Havalimanı\'ndan 82 km mesafedeki Titreyengöl\'e konforlu VIP transferler sunuyoruz.',
    faqs: [
      { q: 'Titreyengöl transfer süresi ne kadar?', a: 'Yaklaşık 65 dakika sürmektedir. D400 güzergahından hızlı bir şekilde ulaşım sağlıyoruz.' },
      { q: 'Titreyengöl\'deki otellerin tamamına transfer yapılır mı?', a: 'Evet, bölgedeki tüm otel adreslerine kapıdan kapıya servis veriyoruz.' }
    ]
  }
};
