'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fa-solid fa-triangle-exclamation text-red-500 text-3xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Bir hata oluştu</h2>
                <p className="text-slate-400 mb-8">Üzgünüz, bir şeyler ters gitti. Lütfen sayfayı yenilemeyi deneyin.</p>
                <button
                    onClick={() => reset()}
                    className="px-8 py-3 bg-[#c5a059] text-[#0f172a] font-bold rounded-xl hover:bg-[#d4af6a] transition-all"
                >
                    Tekrar Dene
                </button>
            </div>
        </div>
    );
}
