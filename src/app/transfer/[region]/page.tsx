import type { Metadata } from 'next';
import { fetchSiteContent } from '../../../lib/supabase-server';
import TransferDestination from '../../../views/TransferDestination';
import { slugify } from '../../../utils/slugify';

type Props = { params: Promise<{ region: string }> };

export async function generateStaticParams() {
    const content = await fetchSiteContent();
    return content.regions
        .filter(r => r.isActive !== false)
        .map(r => ({ region: `${slugify(r.name)}-transfer` }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { region } = await params;
    const content = await fetchSiteContent();
    const seo = content.seo;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';
    const url = `${baseUrl}/transfer/${region}`;

    const regionSlug = region.replace(/-transfer$/, '');
    const matchedRegion = content.regions.find(r => slugify(r.name) === regionSlug);

    const regionName = matchedRegion?.name || region.replace(/-/g, ' ');
    const price = matchedRegion?.price;

    const title = `${regionName} Transfer${price ? ` — €${price}'den Başlayan Fiyatlar` : ''}`;
    const description = `Antalya Havalimanı'ndan ${regionName}'e özel VIP transfer hizmeti.${price ? ` €${price}'den başlayan fiyatlarla.` : ''} 7/24 hizmet, konforlu araçlar.`;

    return {
        title,
        description,
        keywords: `${regionName} transfer, ${regionName} havalimanı transfer, antalya ${regionName} transfer`,
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

export default async function TransferDestinationPage({ params }: Props) {
    const { region } = await params;
    const content = await fetchSiteContent();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';

    const regionSlug = region.replace(/-transfer$/, '');
    const matchedRegion = content.regions.find(r => slugify(r.name) === regionSlug);

    if (!matchedRegion) return <TransferDestination />;

    const price = matchedRegion.price;
    const regionName = matchedRegion.name;

    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `${regionName} Transfer`,
        description: `Antalya Havalimanı'ndan ${regionName}'e VIP transfer hizmeti.`,
        url: `${baseUrl}/transfer/${region}`,
        provider: {
            '@type': 'LocalBusiness',
            name: content.business.name,
            telephone: content.business.phone,
            email: content.business.email,
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Antalya',
                addressCountry: 'TR',
                streetAddress: content.business.address,
            },
        },
        areaServed: {
            '@type': 'Place',
            name: regionName,
            address: { '@type': 'PostalAddress', addressLocality: regionName, addressCountry: 'TR' },
        },
        ...(price ? {
            offers: {
                '@type': 'Offer',
                price: price.toString(),
                priceCurrency: 'EUR',
                availability: 'https://schema.org/InStock',
            },
        } : {}),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
            <TransferDestination />
        </>
    );
}
