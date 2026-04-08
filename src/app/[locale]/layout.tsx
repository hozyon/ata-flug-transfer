import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { routing } from '../../../i18n';
import type { Locale } from '../../../i18n';
import AppProviders from '../../components/AppProviders';
import { montserrat, outfit, playfair } from '../../lib/fonts';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export async function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html
            lang={locale}
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
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <AppProviders locale={locale as Locale}>
                        {children}
                    </AppProviders>
                </NextIntlClientProvider>
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
