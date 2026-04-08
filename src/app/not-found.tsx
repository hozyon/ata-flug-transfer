import Link from 'next/link';

// Root not-found — no locale context available here, uses Turkish fallback.
// Per-locale 404 is handled by app/[locale]/not-found.tsx
export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center px-4">
                <h1 className="text-8xl font-playfair font-bold text-slate-800 mb-4">404</h1>
                <p className="text-slate-500 text-lg mb-8">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
                <Link
                    href="/tr"
                    className="inline-flex items-center gap-2 bg-[#c5a059] text-[#0f172a] font-bold px-8 py-3 rounded-full hover:bg-[#d4af6a] transition-colors"
                >
                    <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                    <span>Ana Sayfaya Dön</span>
                </Link>
            </div>
        </div>
    );
}
