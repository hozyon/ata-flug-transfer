import { getTranslations } from 'next-intl/server';

export default async function Loading() {
    const t = await getTranslations('common');

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8f7f4' }}>
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 text-sm font-medium tracking-wide">{t('loading')}</p>
            </div>
        </div>
    );
}
