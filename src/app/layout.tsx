import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
    title: {
        default: 'Ata Flug Transfer | VIP Havalimanı Transfer Antalya',
        template: '%s | Ata Flug Transfer',
    },
    description: "Antalya Havalimanı'ndan premium VIP transfer hizmeti. Profesyonel şoförler, lüks Mercedes araçlar, 7/24 hizmet.",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app'),
    manifest: '/manifest.json',
    themeColor: '#c5a059',
};

// html/body is rendered by [locale]/layout.tsx so lang= can be set per locale.
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return children;
}
