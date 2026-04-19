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

    if (isAdminPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col min-h-dvh bg-[var(--color-background)]">
            <Navbar onAdminToggle={handleAdminToggle} isAdmin={isAdmin} />
            <main id="main-content" className="flex-grow">
                {children}
            </main>

            {/* ── EDITORIAL FOOTER ── */}
            <footer id="contact" className="bg-white text-[var(--color-text)] py-20 border-t border-[var(--color-border)]">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
                        {/* Brand Column */}
                        <div className="md:col-span-5 flex flex-col gap-8">
                            <div>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={siteContent.business.logo || '/logo.png'} alt="Logo" className="h-10 w-auto mix-blend-difference" style={{ filter: 'brightness(0)' }} />
                            </div>
                            <p className="text-[var(--color-text-muted)] text-[13px] font-outfit max-w-sm leading-relaxed">
                                Antalya'nın kalbinden, VIP transfer ve concierge hizmetlerinde zirveyi hedefleyenlerin eşsiz yolculuğu. Sadece bir taşıma değil, zamanın ötesinde bir deneyim.
                            </p>
                        </div>
                        
                        {/* Contact Column */}
                        <div className="md:col-span-4 flex flex-col gap-6">
                            <h4 className="text-[var(--color-text)] font-semibold text-[9px] uppercase tracking-[0.2em]">Merkez Ofis</h4>
                            <div className="space-y-4 text-[13px] text-[var(--color-text-muted)] font-outfit">
                                <p className="leading-relaxed max-w-xs">{siteContent.business.address}</p>
                                {siteContent.business.phone && (
                                    <p><a href={`tel:${siteContent.business.phone}`} className="hover:text-[var(--color-text)] transition-colors">{siteContent.business.phone}</a></p>
                                )}
                                {siteContent.business.email && (
                                    <p><a href={`mailto:${siteContent.business.email}`} className="hover:text-[var(--color-text)] transition-colors">{siteContent.business.email}</a></p>
                                )}
                            </div>
                        </div>

                        {/* Social Column */}
                        <div className="md:col-span-3 flex flex-col gap-6">
                            <h4 className="text-[var(--color-text)] font-semibold text-[9px] uppercase tracking-[0.2em]">Sosyal Medya</h4>
                            <ul className="space-y-4 text-[13px] text-[var(--color-text-muted)] font-outfit">
                                {siteContent.business.instagram && <li><a href={siteContent.business.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors flex items-center gap-3"><i className="fa-brands fa-instagram"></i> Instagram</a></li>}
                                {siteContent.business.facebook && <li><a href={siteContent.business.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors flex items-center gap-3"><i className="fa-brands fa-facebook"></i> Facebook</a></li>}
                                {siteContent.business.whatsapp && <li><a href={`https://wa.me/${siteContent.business.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#25d366] transition-colors flex items-center gap-3"><i className="fa-brands fa-whatsapp"></i> WhatsApp</a></li>}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="mt-20 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[var(--color-text-muted)] text-[10px] uppercase tracking-widest font-semibold flex items-center gap-2">
                            <span>© {new Date().getFullYear()}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{siteContent.business.name}</span>
                        </p>
                        <p className="text-[var(--color-text-muted)] text-[10px] uppercase tracking-widest font-semibold">Tüm Hakları Saklıdır.</p>
                    </div>
                </div>
            </footer>

            {/* Float WhatsApp */}
            <a
                href={`https://wa.me/${siteContent.business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 left-6 z-[90] w-16 h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center transition-all duration-500 shadow-[0_0_20px_rgba(37,211,102,0.5)] whatsapp-float-pulse"
            >
                <i className="fa-brands fa-whatsapp text-3xl"></i>
            </a>

            <style>{`
                @keyframes whatsappPulse {
                    0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.8); }
                    70% { box-shadow: 0 0 0 25px rgba(37, 211, 102, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
                }
                .whatsapp-float-pulse {
                    animation: whatsappPulse 2s infinite;
                }
            `}</style>

            {/* Full Screen Booking Overlay */}
            {isBookingFormOpen && (
                <div className="fixed inset-0 z-[500] flex">
                    <div className="absolute inset-0 bg-[#f8f8f8] transition-all duration-500 animate-in fade-in" />
                    
                    <div className="relative w-full h-full max-w-[800px] mx-auto flex flex-col pt-12 sm:pt-20 px-4 sm:px-12 animate-in slide-in-from-bottom-20 fade-in duration-700 ease-out">
                        <div className="flex justify-between items-center mb-10 shrink-0">
                            <div>
                                <p className="text-[var(--color-text-muted)] text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">Rezervasyon</p>
                                <h3 className="text-[var(--color-text)] font-playfair font-medium text-4xl sm:text-5xl tracking-tight">VIP Transfer</h3>
                            </div>
                            <button onClick={() => setBookingFormOpen(false)} className="w-12 h-12 rounded-none flex items-center justify-center bg-white border border-gray-200 text-gray-900 shadow-sm hover:bg-gray-50 transition-all active:scale-95">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar pr-2">
                            <BookingForm onBookingSubmit={() => setBookingFormOpen(false)} vehicles={siteContent.vehicles} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
