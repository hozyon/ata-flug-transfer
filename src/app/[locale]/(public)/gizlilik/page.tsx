import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { fetchSiteContent } from '../../../../lib/supabase-server';
import { routing } from '../../../../../i18n';

type Props = { params: Promise<{ locale: string }> };

export async function generateStaticParams() {
    return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const content = await fetchSiteContent();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';
    const url = `${baseUrl}/${locale}/gizlilik`;
    const alternates: Record<string, string> = {};
    routing.locales.forEach(l => { alternates[l] = `${baseUrl}/${l}/gizlilik`; });

    return {
        title: `Gizlilik Politikası | ${content.business.name}`,
        description: 'Kişisel verilerinizin nasıl işlendiğine dair bilgi edinmek için gizlilik politikamızı inceleyin.',
        robots: 'noindex, follow',
        alternates: { canonical: url, languages: alternates },
    };
}

export default async function GizlilikPage({ params }: Props) {
    const { locale: _locale } = await params;
    const content = await fetchSiteContent();
    const t = await getTranslations('privacy');
    const name = content.business.name;
    const email = content.business.email;

    return (
        <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
            {/* Banner */}
            <div className="bg-[var(--color-darker)] pt-28 pb-12 text-center px-4">
                <h1 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-3">
                    {t('title')}
                </h1>
                <p className="text-slate-400 text-sm">{t('lastUpdated')}: 2025-01-01</p>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-8 text-slate-700 text-[15px] leading-relaxed">

                    <section>
                        <h2 className="text-xl font-playfair font-bold text-slate-800 mb-3">{t('section1.title')}</h2>
                        <p>{t('section1.body', { name })}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-playfair font-bold text-slate-800 mb-3">{t('section2.title')}</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>{t('section2.item1')}</li>
                            <li>{t('section2.item2')}</li>
                            <li>{t('section2.item3')}</li>
                            <li>{t('section2.item4')}</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-playfair font-bold text-slate-800 mb-3">{t('section3.title')}</h2>
                        <p>{t('section3.body')}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-playfair font-bold text-slate-800 mb-3">{t('section4.title')}</h2>
                        <p>{t('section4.body')}</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-playfair font-bold text-slate-800 mb-3">{t('section5.title')}</h2>
                        <p>
                            {t('section5.body')}{' '}
                            {email && (
                                <a href={`mailto:${email}`} className="text-[var(--color-primary)] hover:underline">
                                    {email}
                                </a>
                            )}
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
