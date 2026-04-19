import '../index.css';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import AppProviders from '../components/AppProviders';
import SiteShell from '../components/SiteShell';
import { montserrat, outfit, playfair } from '../lib/fonts';
import { fetchSiteContent } from '../lib/supabase-server';

export const viewport: Viewport = {
    themeColor: '#c5a059',
};

export async function generateMetadata(): Promise<Metadata> {
    const content = await fetchSiteContent();
    const seo = content.seo;
    const pageSeo = seo?.pagesSeo?.home;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';

    const title = pageSeo?.title || seo?.siteTitle || `${content.business.name} | VIP Transfer Antalya`;
    const description = pageSeo?.description || seo?.siteDescription || content.hero?.desc || "Antalya Havalimanı'ndan premium VIP transfer hizmeti.";

    return {
        title: {
            default: title,
            template: `%s | ${content.business.name}`,
        },
        description,
        keywords: pageSeo?.keywords || seo?.siteKeywords,
        metadataBase: new URL(baseUrl),
        manifest: '/manifest.json',
        icons: {
            icon: content?.branding?.favicon || '/favicon.ico',
            apple: content?.branding?.favicon || '/apple-touch-icon.png',
        },
        robots: seo?.robotsDirective || 'index, follow',
        alternates: {
            canonical: baseUrl,
        },
        openGraph: {
            title,
            description,
            type: 'website',
            url: baseUrl,
            siteName: content.business.name,
            images: seo?.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630 }] : [],
            locale: 'tr_TR',
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

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const siteContent = await fetchSiteContent();

    return (
        <html
            lang="tr"
            className={`${montserrat.variable} ${outfit.variable} ${playfair.variable}`}
            suppressHydrationWarning
        >
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
            </head>
            <body suppressHydrationWarning>
                <AppProviders initialSiteContent={siteContent}>
                    <SiteShell>
                        {children}
                    </SiteShell>
                </AppProviders>
                {GA_ID && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                            strategy="afterInteractive"
                        />
                        <Script id="gtag-init" strategy="afterInteractive">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('consent', 'default', {
                                    analytics_storage: 'denied',
                                    ad_storage: 'denied',
                                    wait_for_update: 500
                                });
                                gtag('config', '${GA_ID}', { send_page_view: false });
                            `}
                        </Script>
                    </>
                )}
            </body>
        </html>
    );
}
