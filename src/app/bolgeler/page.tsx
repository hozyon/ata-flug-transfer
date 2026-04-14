import type { Metadata } from 'next';
import { Suspense } from 'react';
import { fetchSiteContent } from '../../lib/supabase-server';
import Bolgeler from '../../views/Bolgeler';
import { slugify } from '../../utils/slugify';

export async function generateMetadata(): Promise<Metadata> {
    const content = await fetchSiteContent();
    const seo = content.seo;
    const pageSeo = seo?.pagesSeo?.regions;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';
    const url = `${baseUrl}/bolgeler`;

    const title = pageSeo?.title || 'Transfer Bölgeleri';
    const description = pageSeo?.description || `Antalya Havalimanı'ndan ${content.regions.length}+ bölgeye VIP transfer hizmeti.`;

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

export default async function BolgelerPage() {
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
            url: `${baseUrl}/transfer/${slugify(region.name)}-transfer`,
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
