import type { Metadata } from 'next';
import { fetchSiteContent } from '../../../../lib/supabase-server';
import Iletisim from '../../../../views/Iletisim';
import { routing } from '../../../../../i18n';

type Props = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
    return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const content = await fetchSiteContent();
    const seo = content.seo;
    const pageSeo = seo?.pagesSeo?.contact;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';
    const url = `${baseUrl}/${locale}/iletisim`;

    const title = pageSeo?.title || 'İletişim';
    const description = pageSeo?.description || `${content.business.name} ile 7/24 iletişime geçin.`;

    const alternates: Record<string, string> = {};
    routing.locales.forEach(l => { alternates[l] = `${baseUrl}/${l}/iletisim`; });

    return {
        title,
        description,
        keywords: pageSeo?.keywords || seo?.siteKeywords,
        robots: seo?.robotsDirective || 'index, follow',
        alternates: { canonical: url, languages: alternates },
        openGraph: {
            title,
            description,
            type: 'website',
            url,
            siteName: content.business.name,
            images: seo?.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630 }] : [],
            locale: locale === 'tr' ? 'tr_TR' : locale === 'de' ? 'de_DE' : 'en_US',
        },
        twitter: { card: 'summary_large_image', title, description },
    };
}

export default async function IletisimPage({ params }: Props) {
    const { locale } = await params;
    const content = await fetchSiteContent();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: `İletişim — ${content.business.name}`,
        url: `${baseUrl}/${locale}/iletisim`,
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
