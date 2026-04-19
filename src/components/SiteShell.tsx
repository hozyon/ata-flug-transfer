'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import BookingForm from './BookingForm';
import { useAppStore } from '../store/useAppStore';
import { createClient } from '../utils/supabase/client';
import { isSupabaseConfigured } from '../lib/supabase';

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
        <div className="flex flex-col min-h-dvh bg-[var(--color-background)]">
            <Navbar onAdminToggle={handleAdminToggle} isAdmin={isAdmin} />
            <main id="main-content" className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer id="contact" className="bg-[var(--color-surface)] text-[var(--color-text)] py-16 border-t border-[var(--color-border)]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                        <div className="flex flex-col items-center md:items-start gap-5">
                            <div className="flex items-center gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={siteContent.business.logo || '/logo.png'} alt="Logo" className="h-10 w-auto" style={{ filter: 'invert(1) contrast(1.2) brightness(0.2)' }} />
                                <h4 className="text-[var(--color-text)] font-extrabold text-xl font-outfit uppercase tracking-wider">{siteContent.business.name}</h4>
                            </div>
                            <p className="text-[var(--color-text-muted)] text-sm font-light">Premium VIP Transfer Deneyimi</p>
                        </div>
                        <div>
                            <h4 className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-[0.2em] mb-6">İletişim</h4>
                            <ul className="space-y-4 text-sm text-[var(--color-text-muted)] font-medium">
                                {siteContent.business.phone && (
                                    <li><a href={`tel:${siteContent.business.phone}`} className="hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-3"><i className="fa-solid fa-phone text-[var(--color-primary)]"></i>{siteContent.business.phone}</a></li>
                                )}
                                {siteContent.business.email && (
                                    <li><a href={`mailto:${siteContent.business.email}`} className="hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-3"><i className="fa-solid fa-envelope text-[var(--color-primary)]"></i>{siteContent.business.email}</a></li>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-[0.2em] mb-6">Sosyal Medya</h4>
                            <div className="flex justify-center md:justify-start gap-4">
                                {siteContent.business.whatsapp && <a href={`https://wa.me/${siteContent.business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-full flex items-center justify-center text-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm"><i className="fa-brands fa-whatsapp"></i></a>}
                                {siteContent.business.instagram && <a href={siteContent.business.instagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 bg-pink-50 text-pink-500 border border-pink-100 rounded-full flex items-center justify-center text-lg hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all shadow-sm"><i className="fa-brands fa-instagram"></i></a>}
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 pt-8 border-t border-[var(--color-border)] text-center">
                        <p className="text-[var(--color-text-muted)] text-[10px] sm:text-xs uppercase tracking-widest font-semibold">
                            © {new Date().getFullYear()} {siteContent.business.name}. Tüm Hakları Saklıdır.
                        </p>
                    </div>
                </div>
            </footer>

            {/* WhatsApp FAB */}
            <a
                href={`https://wa.me/${siteContent.business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 left-6 z-[90] w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.3)] hover:scale-105 hover:shadow-[0_12px_40px_rgba(37,211,102,0.4)] transition-all"
            >
                <i className="fa-brands fa-whatsapp text-2xl"></i>
            </a>

            {/* Booking Modal */}
            {isBookingFormOpen && (
                <div className="fixed inset-0 z-[500] flex flex-col items-center justify-end sm:justify-center p-0 sm:p-4">
                    <div className="absolute inset-0 bg-[rgba(253,251,247,0.7)] backdrop-blur-xl transition-all duration-300" onClick={() => setBookingFormOpen(false)} />
                    <div className="relative w-full max-w-lg bg-[var(--color-surface)] sm:rounded-[2rem] rounded-t-[2rem] overflow-hidden border border-[var(--color-border)] p-6 shadow-2xl safe-area-bottom animate-in slide-in-from-bottom-10 fade-in duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[var(--color-text)] font-playfair font-medium text-3xl tracking-tight">Rezervasyon</h3>
                            <button onClick={() => setBookingFormOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:shadow-sm border border-[var(--color-border)] transition-all">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <BookingForm onBookingSubmit={() => setBookingFormOpen(false)} vehicles={siteContent.vehicles} />
                    </div>
                </div>
            )}
        </div>
    );
}
