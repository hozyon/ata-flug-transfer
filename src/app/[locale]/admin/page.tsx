import { routing } from '../../../../i18n';
import AdminPageClient from './AdminPageClient';
import { createClient } from '../../../utils/supabase/server';
import { redirect } from 'next/navigation';

export async function generateStaticParams() {
    return routing.locales.map(locale => ({ locale }));
}

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: PageProps) {
    const { locale } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect(`/${locale}/login`);
    }

    return <AdminPageClient />;
}

