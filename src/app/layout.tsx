import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
    themeColor: '#c5a059',
};

export const metadata: Metadata = {
    title: {
        default: 'Ata Flug Transfer | VIP Havalimanı Transfer Antalya',
        template: '%s | Ata Flug Transfer',
    },
    description: "Antalya Havalimanı'ndan premium VIP transfer hizmeti. Profesyonel şoförler, lüks Mercedes araçlar, 7/24 hizmet.",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ata-flug-transfer.vercel.app'),
    manifest: '/manifest.json',
};

// html/body is rendered by [locale]/layout.tsx so lang= can be set per locale.
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return children;
}
