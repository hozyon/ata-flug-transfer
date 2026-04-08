export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

export function pageview(url: string) {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;
    window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
}

export function grantConsent() {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
    });
}

export function denyConsent() {
    if (typeof window === 'undefined' || !window.gtag) return;
    window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
    });
}
