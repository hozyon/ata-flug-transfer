import type { Metadata } from 'next';
import { fetchSiteContent } from '../../lib/supabase-server';
import Iletisim from '../../views/Iletisim';

export async function generateMetadata(): Promise<Metadata> {
    const content = await fetchSiteContent();
    const seo = content.seo;
    const pageSeo = seo?.pagesSeo?.contact;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';
    const url = `${baseUrl}/iletisim`;

    const title = pageSeo?.title || 'İletişim';
    const description = pageSeo?.description || `${content.business.name} ile 7/24 iletişime geçin.`;

    return {
        title,
        description,
        keywords: pageSeo?.keywords || seo?.siteKeywords,
        robots: seo?.robotsDirective || 'index, follow',
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            type: 'website',
            url,
            siteName: content.business.name,
            images: seo?.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630 }] : [],
            locale: 'tr_TR',
        },
        twitter: { card: 'summary_large_image', title, description },
    };
}

export default async function IletisimPage() {
    const content = await fetchSiteContent();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: `İletişim — ${content.business.name}`,
        url: `${baseUrl}/iletisim`,
        mainEntity: {
            '@type': 'LocalBusiness',
            name: content.business.name,
            telephone: content.business.phone,
            email: content.business.email,
            url: baseUrl,
            address: content.business.address ? {
                '@type': 'PostalAddress',
                streetAddress: content.business.address,
                addressLocality: 'Antalya',
                addressCountry: 'TR',
            } : undefined,
            openingHours: 'Mo-Su 00:00-23:59',
            areaServed: 'Antalya, Turkey',
        },
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Iletisim />
        </>
    );
}
