import type { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchSiteContent } from '../../../../lib/supabase-server';
import Bolgeler from '../../../../views/Bolgeler';
import { routing } from '../../../../../i18n';
import { slugify } from '../../../../utils/slugify';

type Props = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
    return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const content = await fetchSiteContent();
    const seo = content.seo;
    const pageSeo = seo?.pagesSeo?.regions;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';
    const url = `${baseUrl}/${locale}/bolgeler`;

    const title = pageSeo?.title || 'Transfer Bölgeleri';
    const description = pageSeo?.description || `Antalya Havalimanı'ndan ${content.regions.length}+ bölgeye VIP transfer hizmeti.`;

    const alternates: Record<string, string> = {};
    routing.locales.forEach(l => { alternates[l] = `${baseUrl}/${l}/bolgeler`; });

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

export default async function BolgelerPage({ params }: Props) {
    const { locale } = await params;
    const content = await fetchSiteContent();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';

    const activeRegions = content.regions.filter(r => r.isActive !== false);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Antalya Transfer Bölgeleri',
        description: `Antalya Havalimanı'ndan ${activeRegions.length} bölgeye VIP transfer`,
        numberOfItems: activeRegions.length,
        itemListElement: activeRegions.map((region, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: region.name,
            url: `${baseUrl}/${locale}/transfer/${slugify(region.name)}-transfer`,
        })),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Suspense>
                <Bolgeler />
            </Suspense>
        </>
    );
}
