import type { Metadata } from 'next';
import { fetchSiteContent } from '../../lib/supabase-server';
import Fiyatlar from '../../views/Fiyatlar';
import { slugify } from '../../utils/slugify';

export async function generateMetadata(): Promise<Metadata> {
    const content = await fetchSiteContent();
    const seo = content.seo;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';
    const url = `${baseUrl}/fiyatlar`;

    const activeRegions = content.regions.filter(r => r.isActive !== false);
    const title = `Transfer Fiyatları — Antalya ${activeRegions.length}+ Bölge`;
    const description = `Antalya Havalimanı transfer fiyatları. Kemer, Belek, Side, Alanya ve ${activeRegions.length}+ bölgeye VIP transfer. Şeffaf fiyatlar, gizli ücret yok.`;

    return {
        title,
        description,
        keywords: `antalya transfer fiyatları, havalimanı transfer fiyat, ${activeRegions.map(r => `${r.name.toLowerCase()} transfer`).slice(0, 5).join(', ')}`,
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

export default async function FiyatlarPage() {
    const content = await fetchSiteContent();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';

    const activeRegions = content.regions.filter(r => r.isActive !== false);

    const priceSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Antalya Transfer Fiyatları',
        itemListElement: activeRegions.map((region, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: `${region.name} Transfer`,
            url: `${baseUrl}/transfer/${slugify(region.name)}-transfer`,
            item: {
                '@type': 'Offer',
                price: (region.price ?? 0).toString(),
                priceCurrency: 'EUR',
                name: `${region.name} Transfer`,
            },
        })),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(priceSchema) }} />
            <Fiyatlar />
        </>
    );
}
