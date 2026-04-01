/**
 * Schema.org JSON-LD structured data helpers.
 * Use these in <Helmet> or <script type="application/ld+json"> tags.
 */

const BASE_URL = 'https://www.ataflugtransfer.com';

export interface BusinessInfo {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  logo?: string;
  instagram?: string;
  facebook?: string;
}

/** LocalBusiness / TravelAgency — global, tüm sayfalarda kullanılır */
export function buildLocalBusinessSchema(business: BusinessInfo, priceRange = '€€') {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: business.name,
    description: 'VIP Airport Transfer Service in Antalya, Turkey. Mercedes vehicles, 24/7 service, fixed prices.',
    url: BASE_URL,
    telephone: business.phone,
    email: business.email,
    logo: business.logo,
    image: `${BASE_URL}/og-image.jpg`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Antalya',
      addressRegion: 'Antalya',
      addressCountry: 'TR',
      streetAddress: business.address || 'Antalya Havalimanı, Antalya',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '36.8841',
      longitude: '30.7056',
    },
    priceRange,
    currenciesAccepted: 'EUR, USD, TRY, GBP',
    paymentAccepted: 'Cash, Credit Card',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    areaServed: ['Antalya', 'Kemer', 'Belek', 'Side', 'Alanya', 'Manavgat', 'Lara', 'Konyaaltı', 'Kaş'],
    sameAs: [
      business.instagram ? `https://instagram.com/${business.instagram.replace('@', '')}` : null,
      business.facebook ? `https://facebook.com/${business.facebook.replace('@', '')}` : null,
    ].filter(Boolean),
  };
}

/** WebSite schema — sadece ana sayfada */
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ata Flug Transfer',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/bolgeler?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/** TaxiService / bölge transferi — bölge sayfalarında */
export function buildTaxiServiceSchema(options: {
  regionName: string;
  regionSlug: string;
  description: string;
  price?: number;
  currencySymbol?: string;
  businessName: string;
  businessPhone: string;
}) {
  const { regionName, regionSlug, description, price, currencySymbol = '€', businessName, businessPhone } = options;
  return {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    name: `${regionName} Transfer — ${businessName}`,
    description,
    url: `${BASE_URL}/${regionSlug}-transfer`,
    provider: {
      '@type': 'LocalBusiness',
      name: businessName,
      telephone: businessPhone,
      url: BASE_URL,
    },
    areaServed: {
      '@type': 'Place',
      name: `${regionName}, Antalya, Turkey`,
    },
    serviceType: 'VIP Airport Transfer',
    ...(price != null && {
      offers: {
        '@type': 'Offer',
        price: String(price),
        priceCurrency: currencySymbol === '€' ? 'EUR' : currencySymbol === '$' ? 'USD' : 'EUR',
        availability: 'https://schema.org/InStock',
        priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
      },
    }),
  };
}

/** FAQPage schema */
export function buildFaqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

/** AggregateRating schema */
export function buildAggregateRatingSchema(options: {
  businessName: string;
  ratingValue: number;
  reviewCount: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: options.businessName,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(options.ratingValue.toFixed(1)),
      bestRating: '5',
      worstRating: '1',
      reviewCount: String(options.reviewCount),
    },
  };
}
