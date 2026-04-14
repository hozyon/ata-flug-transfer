import type { Metadata } from 'next';
import { fetchSiteContent } from '../../lib/supabase-server';
import SSS from '../../views/SSS';

export async function generateMetadata(): Promise<Metadata> {
    const content = await fetchSiteContent();
    const seo = content.seo;
    const pageSeo = seo?.pagesSeo?.faq;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';
    const url = `${baseUrl}/sss`;

    const title = pageSeo?.title || 'Sıkça Sorulan Sorular';
    const description = pageSeo?.description || 'Antalya transfer hizmeti hakkında merak ettiğiniz tüm sorular ve cevapları.';

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

export default async function SSSPage() {
    const content = await fetchSiteContent();

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: content.faq.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <SSS />
        </>
    );
}
