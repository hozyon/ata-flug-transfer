'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { grantConsent, denyConsent } from '../lib/gtag';

const STORAGE_KEY = 'ata_cookie_consent';

export default function CookieConsentBanner() {
    const t = useTranslations('cookie');
    const pathname = usePathname();
    const locale = pathname?.match(/^\/([a-z]{2})(\/|$)/)?.[1] ?? 'tr';
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(STORAGE_KEY);
        if (!consent) {
            setVisible(true);
        } else if (consent === 'accepted') {
            grantConsent();
        }
    }, []);

    const accept = () => {
        localStorage.setItem(STORAGE_KEY, 'accepted');
        setVisible(false);
        grantConsent();
    };

    const reject = () => {
        localStorage.setItem(STORAGE_KEY, 'rejected');
        setVisible(false);
        denyConsent();
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-label="Cookie consent"
            className="fixed bottom-0 left-0 right-0 z-[150] bg-slate-900 text-white px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg"
        >
            <p className="text-sm text-slate-300 flex-1">
                {t('message')}{' '}
                <Link
                    href={`/${locale}/gizlilik`}
                    className="underline underline-offset-2 text-slate-400 hover:text-white transition-colors text-xs"
                >
                    {t('learnMore')}
                </Link>
            </p>
            <div className="flex gap-2 shrink-0">
                <button
                    onClick={reject}
                    className="px-4 py-2 text-sm border border-slate-600 rounded hover:border-slate-400 transition-colors"
                >
                    {t('reject')}
                </button>
                <button
                    onClick={accept}
                    className="px-4 py-2 text-sm bg-amber-500 text-black rounded hover:bg-amber-400 transition-colors font-semibold"
                >
                    {t('accept')}
                </button>
            </div>
        </div>
    );
}
