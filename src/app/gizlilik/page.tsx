import type { Metadata } from 'next';
import { fetchSiteContent } from '../../lib/supabase-server';

export async function generateMetadata(): Promise<Metadata> {
    const content = await fetchSiteContent();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app';
    const url = `${baseUrl}/gizlilik`;

    return {
        title: `Gizlilik Politikası | ${content.business.name}`,
        description: 'Kişisel verilerinizin nasıl işlendiğine dair bilgi edinmek için gizlilik politikamızı inceleyin.',
        robots: 'noindex, follow',
        alternates: { canonical: url },
    };
}

export default async function GizlilikPage() {
    const content = await fetchSiteContent();
    const name = content.business.name;
    const email = content.business.email;

    return (
        <div className="min-h-screen" style={{ background: '#f8f7f4' }}>
            {/* Banner */}
            <div className="bg-[var(--color-darker)] pt-28 pb-12 text-center px-4">
                <h1 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-3">
                    Gizlilik Politikası
                </h1>
                <p className="text-slate-400 text-sm">Son Güncelleme: 2025-01-01</p>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-8 text-slate-700 text-[15px] leading-relaxed">

                    <section>
                        <h2 className="text-xl font-playfair font-bold text-slate-800 mb-3">1. Giriş</h2>
                        <p>{name} olarak kişisel verilerinizin gizliliğini korumayı taahhüt ediyoruz. Bu politika, hizmetlerimizi kullanırken toplanan verilerin nasıl işlendiğini açıklamaktadır.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-playfair font-bold text-slate-800 mb-3">2. Toplanan Veriler</h2>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Ad, soyad ve iletişim bilgileri</li>
                            <li>Transfer rezervasyon detayları (tarih, saat, konum)</li>
                            <li>Uçuş bilgileri</li>
                            <li>Mesaj ve talep içerikleri</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-playfair font-bold text-slate-800 mb-3">3. Verilerin Kullanımı</h2>
                        <p>Toplanan veriler yalnızca rezervasyon işlemleri, müşteri desteği ve hizmet kalitesinin iyileştirilmesi amacıyla kullanılmaktadır. Verileriniz üçüncü taraflarla paylaşılmamaktadır.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-playfair font-bold text-slate-800 mb-3">4. Veri Güvenliği</h2>
                        <p>Verileriniz güvenli sunucularda şifrelenmiş biçimde saklanmaktadır. Yetkisiz erişime karşı endüstri standardı güvenlik önlemleri uygulanmaktadır.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-playfair font-bold text-slate-800 mb-3">5. İletişim</h2>
                        <p>
                            Kişisel verilerinizle ilgili talepleriniz için bize ulaşın:{' '}
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
