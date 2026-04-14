'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'ata_cookie_consent';

const updateConsent = (granted: boolean) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
            analytics_storage: granted ? 'granted' : 'denied',
            ad_storage: granted ? 'granted' : 'denied',
        });
    }
};

export default function CookieConsentBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(STORAGE_KEY);
        if (!consent) {
            setVisible(true);
        } else if (consent === 'accepted') {
            updateConsent(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem(STORAGE_KEY, 'accepted');
        setVisible(false);
        updateConsent(true);
    };

    const reject = () => {
        localStorage.setItem(STORAGE_KEY, 'rejected');
        setVisible(false);
        updateConsent(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 z-[9999] bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-white font-bold mb-2">Çerez Kullanımı</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Size daha iyi bir deneyim sunabilmek için çerezleri kullanıyoruz. Devam ederek çerez politikamızı kabul etmiş sayılırsınız. 
                <Link href="/gizlilik" className="text-amber-500 hover:underline ml-1">Detaylı bilgi</Link>
            </p>
            <div className="flex gap-3">
                <button
                    onClick={reject}
                    className="flex-1 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors font-medium border border-white/5 rounded"
                >
                    Reddet
                </button>
                <button
                    onClick={accept}
                    className="flex-1 px-4 py-2 text-sm bg-amber-500 text-black rounded hover:bg-amber-400 transition-colors font-semibold"
                >
                    Kabul Et
                </button>
            </div>
        </div>
    );
}
