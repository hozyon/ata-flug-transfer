'use client';

import React, { useEffect } from 'react';
import { SiteProvider } from '../SiteContext';
import { LanguageProvider } from '../i18n/LanguageContext';
import { useAppStore } from '../store/useAppStore';
import CookieConsentBanner from './CookieConsentBanner';
import AuthProvider from './AuthProvider';
import type { Locale } from '../../i18n';

interface AppProvidersProps {
    children: React.ReactNode;
    locale: Locale;
}

function BrandColorSync() {
    const branding = useAppStore(s => s.siteContent.branding);
    useEffect(() => {
        if (!branding) return;
        if (branding.primaryColor) document.documentElement.style.setProperty('--color-primary', branding.primaryColor);
        if (branding.darkBg) document.documentElement.style.setProperty('--color-dark', branding.darkBg);
        if (branding.darkBgDeep) document.documentElement.style.setProperty('--color-darker', branding.darkBgDeep);
    }, [branding]);
    return null;
}

function ServiceWorkerRegistrar() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                // SW registration failure is non-fatal — app works without it
            });
        }
    }, []);
    return null;
}

export default function AppProviders({ children, locale: _locale }: AppProvidersProps) {
    const siteContent = useAppStore(s => s.siteContent);
    const updateSiteContent = useAppStore(s => s.updateSiteContent);

    return (
        <LanguageProvider>
            <SiteProvider value={{ siteContent, updateSiteContent }}>
                <AuthProvider>
                    <BrandColorSync />
                    <ServiceWorkerRegistrar />
                    {children}
                    <CookieConsentBanner />
                </AuthProvider>
            </SiteProvider>
        </LanguageProvider>
    );
}
