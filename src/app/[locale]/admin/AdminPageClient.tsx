'use client';

import dynamic from 'next/dynamic';
import { useAppStore } from '../../../store/useAppStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AdminPanelConnected = dynamic(
    () => import('../../../components/AdminPanelConnected'),
    { ssr: false, loading: () => <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" /></div> }
);

export default function AdminPageClient() {
    const isAdmin = useAppStore(s => s.isAdmin);
    const pathname = usePathname();
    const router = useRouter();

    const localeMatch = pathname?.match(/^\/([a-z]{2})(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : 'tr';

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isAdmin) {
                router.replace(`/${locale}/login`);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [isAdmin, locale, router]);

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return <AdminPanelConnected />;
}
