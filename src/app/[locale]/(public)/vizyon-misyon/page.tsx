import type { Metadata } from 'next';
import { fetchSiteContent } from '../../../../lib/supabase-server';
import VizyonMisyon from '../../../../views/VizyonMisyon';
import { routing } from '../../../../../i18n';

type Props = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
    return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const content = await fetchSiteContent();
    const seo = content.seo;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';
    const url = `${baseUrl}/${locale}/vizyon-misyon`;

    const title = `Vizyon & Misyon | ${content.business.name}`;
    const description = seo?.pagesSeo?.about?.description
        ? `${content.business.name} vizyon ve misyonu. ${seo.pagesSeo.about.description}`
        : "Ata Flug Transfer vizyon ve misyonu. Antalya'da güvenilir VIP transfer hizmeti sunma amacımız ve değerlerimiz.";

    const alternates: Record<string, string> = {};
    routing.locales.forEach(l => { alternates[l] = `${baseUrl}/${l}/vizyon-misyon`; });

    return {
        title,
        description,
        keywords: seo?.siteKeywords,
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

export default async function VizyonMisyonPage({ params }: Props) {
    const { locale } = await params;
    const content = await fetchSiteContent();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: `Vizyon & Misyon — ${content.business.name}`,
        url: `${baseUrl}/${locale}/vizyon-misyon`,
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
