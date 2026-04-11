'use client';

import dynamic from 'next/dynamic';

const AdminPanelConnected = dynamic(
    () => import('../../../components/AdminPanelConnected'),
    { ssr: false, loading: () => <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" /></div> }
);

export default function AdminPageClient() {
    return <AdminPanelConnected />;
}
