import type { Metadata } from 'next';
import AdminLogin from '../../views/AdminLogin';

export const metadata: Metadata = {
    title: 'Admin Girişi',
    robots: 'noindex, nofollow',
};

export default function LoginPage() {
    return <AdminLogin />;
}
