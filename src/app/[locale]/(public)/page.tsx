import type { Metadata } from 'next';
import { fetchSiteContent, fetchBlogPosts, fetchReviews } from '../../../lib/supabase-server';
import HomePage from '../../../components/HomePage';
import { routing } from '../../../../i18n';

type Props = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
    return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const content = await fetchSiteContent();
    const seo = content.seo;
    const pageSeo = seo?.pagesSeo?.home;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';

    const title = pageSeo?.title || seo?.siteTitle || `${content.business.name} | VIP Transfer Antalya`;
    const description = pageSeo?.description || seo?.siteDescription || content.hero?.desc || "Antalya Havalimanı'ndan premium VIP transfer hizmeti.";

    const alternates: Record<string, string> = {};
    routing.locales.forEach(l => { alternates[l] = `${baseUrl}/${l}`; });

    return {
        title,
        description,
        keywords: pageSeo?.keywords || seo?.siteKeywords,
        robots: seo?.robotsDirective || 'index, follow',
        alternates: {
            canonical: `${baseUrl}/${locale}`,
            languages: alternates,
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: `${baseUrl}/${locale}`,
            siteName: content.business.name,
            images: seo?.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630 }] : [],
            locale: locale === 'tr' ? 'tr_TR' : locale === 'de' ? 'de_DE' : 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: seo?.ogImage ? [seo.ogImage] : [],
        },
        verification: {
            google: seo?.googleSiteVerification,
            other: seo?.bingVerification ? { 'msvalidate.01': seo.bingVerification } : undefined,
        },
    };
}

export default async function HomePageRoute({ params }: Props) {
    const { locale } = await params;
    const [content, blogPosts, userReviews] = await Promise.all([
        fetchSiteContent(),
        fetchBlogPosts(),
        fetchReviews()
    ]);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';
    const seo = content.seo;

    const businessSchema = seo?.structuredData ? {
        '@context': 'https://schema.org',
        '@type': seo.structuredData.businessType || 'TravelAgency',
        name: content.business.name,
        url: seo.canonicalUrl || baseUrl,
        telephone: content.business.phone,
        email: content.business.email,
        image: seo.ogImage || '',
        logo: content.business.logo || '',
        description: "Antalya Havalimanı'ndan Kemer, Belek, Side, Alanya ve tüm bölgelere özel VIP transfer.",
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Antalya',
            addressRegion: 'Antalya',
            addressCountry: 'TR',
            streetAddress: content.business.address,
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: seo.structuredData.latitude || '36.8841',
            longitude: seo.structuredData.longitude || '30.7056',
        },
        priceRange: seo.structuredData.priceRange || '€€',
        openingHours: seo.structuredData.openingHours || 'Mo-Su 00:00-24:00',
        areaServed: ['Antalya', 'Kemer', 'Belek', 'Side', 'Alanya', 'Manavgat'],
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', bestRating: '5', ratingCount: '150' },
    } : null;

    return (
        <>
            {businessSchema && (
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />
            )}
            <HomePage locale={locale} blogPosts={blogPosts} userReviews={userReviews} />
        </>
    );
}
