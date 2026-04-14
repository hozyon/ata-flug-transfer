import type { Metadata } from 'next';
import { fetchSiteContent } from '../../lib/supabase-server';
import VizyonMisyon from '../../views/VizyonMisyon';

export async function generateMetadata(): Promise<Metadata> {
    const content = await fetchSiteContent();
    const seo = content.seo;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';
    const url = `${baseUrl}/vizyon-misyon`;

    const title = `Vizyon & Misyon | ${content.business.name}`;
    const description = seo?.pagesSeo?.about?.description
        ? `${content.business.name} vizyon ve misyonu. ${seo.pagesSeo.about.description}`
        : "Ata Flug Transfer vizyon ve misyonu. Antalya'da güvenilir VIP transfer hizmeti sunma amacımız ve değerlerimiz.";

    return {
        title,
        description,
        keywords: seo?.siteKeywords,
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

export default async function VizyonMisyonPage() {
    const content = await fetchSiteContent();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: `Vizyon & Misyon — ${content.business.name}`,
        url: `${baseUrl}/vizyon-misyon`,
        publisher: {
            '@type': 'Organization',
            name: content.business.name,
            url: baseUrl,
        },
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <VizyonMisyon />
        </>
    );
}
