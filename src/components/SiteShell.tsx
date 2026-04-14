'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';
import BookingForm from './BookingForm';
import { useAppStore } from '../store/useAppStore';
import { createClient } from '../utils/supabase/client';
import { isSupabaseConfigured } from '../lib/supabase';
import { addBooking } from '../app/actions/bookings';

/**
 * SiteShell — wraps public pages with Navbar, Footer, WhatsApp button, BookingModal.
 * Used in every public page layout.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const {
        isAdmin, setIsAdmin,
        siteContent,
        isBookingFormOpen, setBookingFormOpen,
    } = useAppStore();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleExitAdmin = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        if (isSupabaseConfigured) {
            const supabase = createClient();
            sessionStorage.removeItem('ata_session_token');
            await supabase.auth.signOut();
        }
        setIsAdmin(false);
        router.push(`/`);
        setIsLoggingOut(false);
    };

    const handleAdminToggle = () => {
        if (isAdmin) {
            handleExitAdmin();
        } else {
            router.push(`/login`);
        }
    };

    return (
        <div className="flex flex-col min-h-dvh">
            {/* Skip navigation link — visible only on focus for keyboard users */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--color-primary)] focus:text-black focus:font-semibold focus:text-sm"
            >
                İçeriğe geç
            </a>
            <Navbar
                onAdminToggle={handleAdminToggle}
                isAdmin={isAdmin}
            />

            <main id="main-content" className="flex-grow">
                {children}
            </main>

            {/* ── Footer ── */}
            <footer id="contact" className="bg-[var(--color-darker)] text-white py-6 pb-28 lg:pb-6 border-t border-[var(--color-primary)]/20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 text-center md:text-left mb-6">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={siteContent.business.logo || '/logo.png'}
                                alt={`${siteContent.business.name} Logo`}
                                className="h-12 w-auto"
                                onError={(e) => ((e.currentTarget as HTMLImageElement).src = '/logo.png')}
                            />
                            <div>
                                <h4 className="text-white font-black text-xl tracking-tight">{siteContent.business.name}</h4>
                                <p className="text-slate-400 text-xs">Premium VIP Transfer Hizmetleri</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest mb-3">İletişim</h4>
                            <ul className="space-y-3 md:space-y-2 text-sm text-slate-300">
                                {siteContent.business.phone && (
                                    <li><a href={`tel:${siteContent.business.phone}`} rel="noopener noreferrer" className="hover:text-[var(--color-primary)] transition-colors inline-flex items-center min-h-[44px] md:min-h-0"><i className="fa-solid fa-phone mr-3 text-[var(--color-primary)]"></i>{siteContent.business.phone}</a></li>
                                )}
                                {siteContent.business.email && (
                                    <li><a href={`mailto:${siteContent.business.email}`} className="hover:text-[var(--color-primary)] transition-colors inline-flex items-center min-h-[44px] md:min-h-0"><i className="fa-solid fa-envelope mr-3 text-[var(--color-primary)]"></i>{siteContent.business.email}</a></li>
                                )}
                                {siteContent.business.address && (
                                    <li className="inline-flex items-center"><i className="fa-solid fa-location-dot mr-3 text-[var(--color-primary)]"></i>{siteContent.business.address}</li>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest mb-3">Hızlı Destek</h4>
                            <div className="flex justify-center md:justify-start space-x-3">
                                {siteContent.business.whatsapp && <a href={`https://wa.me/${siteContent.business.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-12 h-12 md:w-11 md:h-11 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 active:scale-95 transition-transform shadow-lg"><i className="fa-brands fa-whatsapp"></i></a>}
                                {siteContent.business.telegram && <a href={siteContent.business.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-12 h-12 md:w-11 md:h-11 bg-sky-500 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 active:scale-95 transition-transform shadow-lg"><i className="fa-brands fa-telegram"></i></a>}
                                {siteContent.business.instagram && <a href={siteContent.business.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 md:w-11 md:h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 active:scale-95 transition-transform shadow-lg"><i className="fa-brands fa-instagram"></i></a>}
                                {siteContent.business.facebook && <a href={siteContent.business.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-12 h-12 md:w-11 md:h-11 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 active:scale-95 transition-transform shadow-lg"><i className="fa-brands fa-facebook-f"></i></a>}
                            </div>
                        </div>
                    </div>
                    <p className="text-slate-600 text-[10px] font-bold tracking-[0.3em] uppercase text-center pt-4 border-t border-white/5">
                        © {new Date().getFullYear()} {siteContent.business.name} - ALL RIGHTS RESERVED - DESIGN{' '}
                        <a
                            href="https://wa.me/905523890771"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition-opacity"
                            style={{
                                fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
                                color: '#c5a059',
                                letterSpacing: '0.18em',
                                textShadow: '0 0 8px rgba(197,160,89,0.7), 0 0 20px rgba(197,160,89,0.4)',
                            }}
                        >
                            HOZYON
                        </a>
                    </p>
                </div>
            </footer>

            {/* WhatsApp Floating Button */}
            <a
                href={`https://wa.me/${siteContent.business.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp ile iletişime geçin"
                className="fixed left-6 z-[90] lg:left-8 group"
                style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
            >
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></div>
                    <div className="relative w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-200">
                        <i className="fa-brands fa-whatsapp text-2xl"></i>
                    </div>
                </div>
            </a>

            {/* Global Booking Modal */}
            {isBookingFormOpen && (
                <div className="fixed inset-0 z-[500] flex items-end justify-center lg:items-center p-0 lg:p-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={() => setBookingFormOpen(false)} />
                    <div className="relative w-full lg:max-w-[480px] max-h-[95vh] lg:max-h-[92vh]">
                        <div className="rounded-t-[2rem] lg:rounded-3xl shadow-2xl shadow-black/60 overflow-hidden relative border-t lg:border border-white/10"
                            style={{ background: 'rgba(10,10,14,0.88)', backdropFilter: 'blur(40px)' }}>
                            <div className="flex justify-center pt-3 pb-1 lg:hidden">
                                <div className="w-10 h-1 rounded-full bg-white/15" />
                            </div>
                            <div className="px-6 pt-5 pb-4 lg:pt-7 flex items-start justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 mb-2">
                                        <span className="w-5 h-[2px] bg-[var(--color-primary)]" />
                                        <span className="text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-[0.2em]">Online Rezervasyon</span>
                                    </div>
                                    <h3 className="text-white font-bold text-xl">Transfer Talebi</h3>
                                </div>
                                <button
                                    onClick={() => setBookingFormOpen(false)}
                                    className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors mt-1"
                                    aria-label="Kapat"
                                >
                                    <i className="fa-solid fa-xmark text-sm" />
                                </button>
                            </div>
                            <div className="px-2 pb-4 lg:pb-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                                <BookingForm
                                    onBookingSubmit={(booking) => { addBooking(booking); setBookingFormOpen(false); }}
                                    vehicles={siteContent.vehicles}
                                />
                            </div>
                            <div className="px-6 py-3 border-t border-white/[0.06] flex items-center justify-center gap-5">
                                <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
                                    <i className="fa-solid fa-lock text-[8px] text-emerald-400" /><span>Güvenli</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
                                    <i className="fa-solid fa-bolt text-[8px] text-amber-400" /><span>Hızlı Onay</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
                                    <i className="fa-brands fa-whatsapp text-[8px] text-[#25D366]" /><span>WhatsApp Bildirim</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
