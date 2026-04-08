import { routing } from '../../../../i18n';
import AdminPageClient from './AdminPageClient';

export async function generateStaticParams() {
    return routing.locales.map(locale => ({ locale }));
}

export default function AdminPage() {
    return <AdminPageClient />;
}
