'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import BookingForm from './BookingForm';
import { useAppStore } from '../store/useAppStore';
import { createClient } from '../utils/supabase/client';
import { isSupabaseConfigured } from '../lib/supabase';
import { addBooking } from '../app/actions/bookings';

export default function SiteShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

    const {
        isAdmin, setIsAdmin,
        siteContent,
        isBookingFormOpen, setBookingFormOpen,
    } = useAppStore();

    const handleExitAdmin = async () => {
        if (isSupabaseConfigured) {
            const supabase = createClient();
            sessionStorage.removeItem('ata_session_token');
            await supabase.auth.signOut();
        }
        setIsAdmin(false);
        window.location.href = '/';
    };

    const handleAdminToggle = () => {
        if (isAdmin) {
            handleExitAdmin();
        } else {
            window.location.href = '/login';
        }
    };

    // Admin veya Login sayfasındaysak hiçbir şey ekleme, sadece içeriği döndür
    if (isAdminPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col min-h-dvh">
            <Navbar onAdminToggle={handleAdminToggle} isAdmin={isAdmin} />
            <main id="main-content" className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer id="contact" className="bg-[var(--color-darker)] text-white py-12 border-t border-[var(--color-primary)]/20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <div className="flex items-center gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={siteContent.business.logo || '/logo.png'} alt="Logo" className="h-12 w-auto" />
                                <h4 className="text-white font-black text-xl">{siteContent.business.name}</h4>
                            </div>
                            <p className="text-slate-400 text-sm">Premium VIP Transfer Hizmetleri</p>
                        </div>
                        <div>
                            <h4 className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest mb-6">İletişim</h4>
                            <ul className="space-y-4 text-sm text-slate-300">
                                {siteContent.business.phone && (
                                    <li><a href={`tel:${siteContent.business.phone}`} className="hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-3"><i className="fa-solid fa-phone text-[var(--color-primary)]"></i>{siteContent.business.phone}</a></li>
                                )}
                                {siteContent.business.email && (
                                    <li><a href={`mailto:${siteContent.business.email}`} className="hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-3"><i className="fa-solid fa-envelope text-[var(--color-primary)]"></i>{siteContent.business.email}</a></li>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest mb-6">Sosyal Medya</h4>
                            <div className="flex justify-center md:justify-start gap-4">
                                {siteContent.business.whatsapp && <a href={`https://wa.me/${siteContent.business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform"><i className="fa-brands fa-whatsapp"></i></a>}
                                {siteContent.business.instagram && <a href={siteContent.business.instagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-transform"><i className="fa-brands fa-instagram"></i></a>}
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <p className="text-slate-600 text-[10px] uppercase tracking-widest">
                            © {new Date().getFullYear()} {siteContent.business.name} - ALL RIGHTS RESERVED
                        </p>
                    </div>
                </div>
            </footer>

            {/* WhatsApp FAB */}
            <a
                href={`https://wa.me/${siteContent.business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 left-6 z-[90] w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
                <i className="fa-brands fa-whatsapp text-2xl"></i>
            </a>

            {/* Booking Modal */}
            {isBookingFormOpen && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setBookingFormOpen(false)} />
                    <div className="relative w-full max-w-lg bg-[#0a0a0e] rounded-3xl overflow-hidden border border-white/10 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-bold text-xl">Rezervasyon Yap</h3>
                            <button onClick={() => setBookingFormOpen(false)} className="text-white/40 hover:text-white"><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <BookingForm onBookingSubmit={() => setBookingFormOpen(false)} vehicles={siteContent.vehicles} />
                    </div>
                </div>
            )}
        </div>
    );
}
