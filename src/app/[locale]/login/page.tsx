import type { Metadata } from 'next';
import AdminLogin from '../../../views/AdminLogin';
import { routing } from '../../../../i18n';

export async function generateStaticParams() {
    return routing.locales.map(locale => ({ locale }));
}

export const metadata: Metadata = {
    title: 'Admin Girişi',
    robots: 'noindex, nofollow',
};

export default function LoginPage() {
    return <AdminLogin />;
}
