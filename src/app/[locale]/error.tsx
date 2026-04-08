'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const t = useTranslations('common');

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center px-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-triangle-exclamation text-red-400 text-2xl" />
                </div>
                <h2 className="text-2xl font-playfair font-bold text-slate-800 mb-2">Bir şeyler yanlış gitti</h2>
                <p className="text-slate-500 mb-6">Sayfa yüklenirken bir hata oluştu.</p>
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 bg-[#c5a059] text-[#0f172a] font-bold px-6 py-2.5 rounded-full hover:bg-[#d4af6a] transition-colors"
                >
                    <i className="fa-solid fa-rotate-right" />
                    <span>{t('tryAgain')}</span>
                </button>
            </div>
        </div>
    );
}
