import { create } from 'zustand';
import { Booking, SiteContent } from '../types';
import { INITIAL_SITE_CONTENT, MOCK_BOOKINGS } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AppStore {
    // State
    isAdmin: boolean;
    siteContent: SiteContent;
    bookings: Booking[];
    isBookingFormOpen: boolean;
    isLoading: boolean;

    // Actions
    setIsAdmin: (isAdmin: boolean) => void;
    setSiteContent: (content: SiteContent) => void;
    updateSiteContent: (newContent: SiteContent) => Promise<void>;

    initializeStore: () => Promise<void>;

    addBooking: (partialBooking: Partial<Booking>) => Promise<void>;
    updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
    deleteBooking: (id: string) => Promise<void>;
    setBookingFormOpen: (isOpen: boolean) => void;
}

// ─── localStorage helpers (fallback when Supabase not configured) ───────────
const LS_BOOKINGS = 'ata_bookings_v6';
const LS_CONTENT = 'ata_site_content_v10';

function loadBookingsFromLS(): Booking[] {
    try {
        const saved = localStorage.getItem(LS_BOOKINGS);
        return saved ? JSON.parse(saved) : MOCK_BOOKINGS;
    } catch { return MOCK_BOOKINGS; }
}

function saveBookingsToLS(bookings: Booking[]) {
    localStorage.setItem(LS_BOOKINGS, JSON.stringify(bookings));
}

function loadContentFromLS(): SiteContent {
    try {
        const saved = localStorage.getItem(LS_CONTENT);
        if (!saved) return INITIAL_SITE_CONTENT;
        return mergeContent(JSON.parse(saved));
    } catch { return INITIAL_SITE_CONTENT; }
}

function saveContentToLS(content: SiteContent) {
    localStorage.setItem(LS_CONTENT, JSON.stringify(content));
}

// ─── Merge persisted content with INITIAL defaults ───────────────────────────
function mergeContent(parsed: SiteContent): SiteContent {
    const merged: SiteContent = {
        ...INITIAL_SITE_CONTENT,
        ...parsed,
        hero: { ...INITIAL_SITE_CONTENT.hero, ...(parsed.hero || {}) },
        about: { ...INITIAL_SITE_CONTENT.about, ...(parsed.about || {}) },
        business: { ...INITIAL_SITE_CONTENT.business, ...(parsed.business || {}) },
        visionMission: { ...INITIAL_SITE_CONTENT.visionMission, ...(parsed.visionMission || {}) },
        seo: {
            ...INITIAL_SITE_CONTENT.seo,
            ...(parsed.seo || {}),
            structuredData: { ...INITIAL_SITE_CONTENT.seo.structuredData, ...(parsed.seo?.structuredData || {}) },
            pagesSeo: { ...INITIAL_SITE_CONTENT.seo.pagesSeo, ...(parsed.seo?.pagesSeo || {}) },
        },
        branding: { ...INITIAL_SITE_CONTENT.branding, ...(parsed.branding || {}) },
        currency: { ...INITIAL_SITE_CONTENT.currency, ...(parsed.currency || {}) },
    };
    if (!Array.isArray(merged.hero.backgrounds) || merged.hero.backgrounds.length === 0) {
        merged.hero.backgrounds = INITIAL_SITE_CONTENT.hero.backgrounds;
    }
    return merged;
}

// ─── Generate booking ID ─────────────────────────────────────────────────────
function generateBookingId(): string {
    return `TR-${Math.floor(10000 + Math.random() * 90000)}`;
}

// ─── Map Supabase row → Booking ──────────────────────────────────────────────
function rowToBooking(row: Record<string, unknown>): Booking {
    return {
        id: row.id as string,
        customerName: row.customer_name as string,
        phone: row.phone as string,
        email: (row.email as string) || undefined,
        pickup: row.pickup as string,
        destination: row.destination as string,
        date: row.date as string,
        time: row.time as string,
        passengers: row.passengers as number,
        vehicleId: row.vehicle_id as string,
        status: row.status as Booking['status'],
        totalPrice: row.total_price as number,
        createdAt: row.created_at as string,
        notes: (row.notes as string) || undefined,
        flightNumber: (row.flight_number as string) || undefined,
    };
}

// ─── Map Booking → Supabase insert payload ───────────────────────────────────
function bookingToRow(b: Booking) {
    return {
        id: b.id,
        customer_name: b.customerName,
        phone: b.phone,
        email: b.email || null,
        pickup: b.pickup,
        destination: b.destination,
        date: b.date,
        time: b.time,
        passengers: b.passengers,
        vehicle_id: b.vehicleId,
        status: b.status,
        total_price: b.totalPrice,
        notes: b.notes || null,
        flight_number: b.flightNumber || null,
    };
}

export const useAppStore = create<AppStore>((set, get) => ({
    isAdmin: false,
    siteContent: INITIAL_SITE_CONTENT,
    bookings: [],
    isBookingFormOpen: false,
    isLoading: false,

    setIsAdmin: (isAdmin) => set({ isAdmin }),
    setBookingFormOpen: (isOpen) => set({ isBookingFormOpen: isOpen }),

    initializeStore: async () => {
        set({ isLoading: true });

        if (isSupabaseConfigured) {
            // ── Load from Supabase ──────────────────────────────────────────
            try {
                const [bookingsRes, contentRes] = await Promise.all([
                    supabase.from('bookings').select('*').order('created_at', { ascending: false }),
                    supabase.from('site_content').select('content').eq('id', 1).single(),
                ]);

                if (!bookingsRes.error && bookingsRes.data) {
                    set({ bookings: bookingsRes.data.map(rowToBooking) });
                } else {
                    set({ bookings: [] });
                }

                if (!contentRes.error && contentRes.data?.content) {
                    set({ siteContent: mergeContent(contentRes.data.content as SiteContent) });
                } else {
                    set({ siteContent: INITIAL_SITE_CONTENT });
                }
            } catch (err) {
                console.error('Supabase init error, falling back to localStorage:', err);
                set({
                    bookings: loadBookingsFromLS(),
                    siteContent: loadContentFromLS(),
                });
            }
        } else {
            // ── localStorage fallback ───────────────────────────────────────
            set({ bookings: loadBookingsFromLS(), siteContent: loadContentFromLS() });
        }

        set({ isLoading: false });
    },

    setSiteContent: (content) => set({ siteContent: content }),

    updateSiteContent: async (newContent) => {
        set({ siteContent: newContent });

        if (isSupabaseConfigured) {
            try {
                const { error } = await supabase
                    .from('site_content')
                    .upsert({ id: 1, content: newContent as unknown as Record<string, unknown> });
                if (error) throw error;
            } catch (err) {
                console.error('Failed to save site content to Supabase:', err);
                saveContentToLS(newContent);
            }
        } else {
            saveContentToLS(newContent);
        }
    },

    addBooking: async (partialBooking) => {
        const { siteContent, bookings } = get();
        const vehicle = siteContent.vehicles.find(v => v.id === partialBooking.vehicleId);

        // Calculate price: use region price if available, otherwise vehicle basePrice
        const region = siteContent.regions.find(
            r => r.name === partialBooking.destination || r.name === partialBooking.pickup
        );
        const totalPrice = region?.price ?? vehicle?.basePrice ?? 40;

        const newBooking: Booking = {
            id: generateBookingId(),
            customerName: partialBooking.customerName || '',
            phone: partialBooking.phone || '',
            email: partialBooking.email || undefined,
            pickup: partialBooking.pickup || '',
            destination: partialBooking.destination || '',
            date: partialBooking.date || '',
            time: partialBooking.time || '',
            passengers: partialBooking.passengers || 1,
            vehicleId: partialBooking.vehicleId || siteContent.vehicles[0]?.id || '',
            status: 'Pending',
            totalPrice,
            createdAt: new Date().toISOString(),
            notes: partialBooking.notes || undefined,
            flightNumber: partialBooking.flightNumber || undefined,
        };

        if (isSupabaseConfigured) {
            try {
                const { data, error } = await supabase
                    .from('bookings')
                    .insert(bookingToRow(newBooking))
                    .select()
                    .single();
                if (error) throw error;
                const saved = rowToBooking(data as Record<string, unknown>);
                set({ bookings: [saved, ...bookings] });
            } catch (err) {
                console.error('Failed to save booking to Supabase:', err);
                const updated = [newBooking, ...bookings];
                set({ bookings: updated });
                saveBookingsToLS(updated);
            }
        } else {
            const updated = [newBooking, ...bookings];
            set({ bookings: updated });
            saveBookingsToLS(updated);
        }
    },

    updateBookingStatus: async (id, status) => {
        const { bookings } = get();
        const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
        set({ bookings: updated });

        if (isSupabaseConfigured) {
            try {
                const { error } = await supabase
                    .from('bookings')
                    .update({ status })
                    .eq('id', id);
                if (error) throw error;
            } catch (err) {
                console.error('Failed to update booking status in Supabase:', err);
                saveBookingsToLS(updated);
            }
        } else {
            saveBookingsToLS(updated);
        }
    },

    deleteBooking: async (id) => {
        const { bookings } = get();
        const updated = bookings.filter(b => b.id !== id);
        set({ bookings: updated });

        if (isSupabaseConfigured) {
            try {
                const { error } = await supabase
                    .from('bookings')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
            } catch (err) {
                console.error('Failed to delete booking from Supabase:', err);
                saveBookingsToLS(updated);
            }
        } else {
            saveBookingsToLS(updated);
        }
    },
}));
