'use client';

import React, { useEffect, useRef } from 'react';
import { SiteProvider } from '../SiteContext';
import { useAppStore } from '../store/useAppStore';
import CookieConsentBanner from './CookieConsentBanner';
import AuthProvider from './AuthProvider';
import type { SiteContent } from '../types';
import { updateSiteContent } from '../app/actions/siteContent';

interface AppProvidersProps {
    children: React.ReactNode;
    initialSiteContent: SiteContent;
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
        // SW disabled — unregister any existing registrations
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(regs => {
                regs.forEach(reg => reg.unregister());
            });
        }
    }, []);
    return null;
}

export default function AppProviders({ children, initialSiteContent }: AppProvidersProps) {
    // Hydrate store with server data on initialization
    const hasHydrated = useRef(false);
    if (!hasHydrated.current) {
        useAppStore.setState({ siteContent: initialSiteContent });
        hasHydrated.current = true;
    }

    const siteContent = useAppStore(s => s.siteContent);

    return (
        <SiteProvider value={{ siteContent, updateSiteContent: async (content) => { await updateSiteContent(content); } }}>
            <AuthProvider>
                <BrandColorSync />
                <ServiceWorkerRegistrar />
                {children}
                <CookieConsentBanner />
            </AuthProvider>
        </SiteProvider>
    );
}
