import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';

export default async function LocaleNotFound() {
    const locale = await getLocale();
    const t = await getTranslations('NotFoundPage');

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center px-4">
                <h1 className="text-8xl font-playfair font-bold text-slate-800 mb-4">404</h1>
                <p className="text-slate-500 text-lg mb-8">{t('description')}</p>
                <Link
                    href={`/${locale}`}
                    className="inline-flex items-center gap-2 bg-[#c5a059] text-[#0f172a] font-bold px-8 py-3 rounded-full hover:bg-[#d4af6a] transition-colors"
                >
                    <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                    <span>{t('backHome')}</span>
                </Link>
            </div>
        </div>
    );
}
