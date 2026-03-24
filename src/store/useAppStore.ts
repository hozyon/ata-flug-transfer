import { create } from 'zustand';
import { Booking, SiteContent, BlogPost, UserReview } from '../types';
import { INITIAL_SITE_CONTENT } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mergeContent } from './mergeContent';

interface AppStore {
    // State
    isAdmin: boolean;
    siteContent: SiteContent;
    bookings: Booking[];
    blogPosts: BlogPost[];
    userReviews: UserReview[];
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

    // Blog
    addBlogPost: (post: BlogPost) => Promise<void>;
    updateBlogPost: (post: BlogPost) => Promise<void>;
    deleteBlogPost: (id: string) => Promise<void>;
    clearAllBlogPosts: () => Promise<void>;

    // Reviews
    addReview: (review: Omit<UserReview, 'id' | 'status' | 'createdAt'>) => Promise<void>;
    updateReviewStatus: (id: string, status: UserReview['status']) => Promise<void>;
    deleteReview: (id: string) => Promise<void>;
}


// ─── Map Supabase row → BlogPost ─────────────────────────────────────────────
function rowToBlogPost(row: Record<string, unknown>): BlogPost {
    return {
        id: row.id as string,
        slug: row.slug as string,
        title: row.title as string,
        excerpt: (row.excerpt as string) || '',
        content: (row.content as string) || '',
        featuredImage: (row.featured_image as string) || '',
        category: (row.category as string) || '',
        tags: (row.tags as string[]) || [],
        author: (row.author as string) || 'Ata Flug Transfer',
        publishedAt: (row.published_at as string) || new Date().toISOString(),
        updatedAt: (row.updated_at as string) || new Date().toISOString(),
        seoTitle: (row.seo_title as string) || '',
        seoDescription: (row.seo_description as string) || '',
        isPublished: (row.is_published as boolean) || false,
        viewCount: (row.view_count as number) || 0,
    };
}

function blogPostToRow(p: BlogPost) {
    return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || null,
        content: p.content || null,
        featured_image: p.featuredImage || null,
        category: p.category || null,
        tags: p.tags || [],
        author: p.author || 'Ata Flug Transfer',
        published_at: p.publishedAt || new Date().toISOString(),
        updated_at: p.updatedAt || new Date().toISOString(),
        seo_title: p.seoTitle || null,
        seo_description: p.seoDescription || null,
        is_published: p.isPublished || false,
        view_count: p.viewCount || 0,
    };
}

// ─── Map Supabase row → UserReview ───────────────────────────────────────────
function rowToReview(row: Record<string, unknown>): UserReview {
    return {
        id: row.id as string,
        name: row.name as string,
        country: (row.country as string) || '',
        lang: (row.lang as string) || 'tr',
        rating: row.rating as number,
        text: row.text as string,
        status: row.status as UserReview['status'],
        createdAt: row.created_at as string,
    };
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
    blogPosts: [],
    userReviews: [],
    isBookingFormOpen: false,
    isLoading: false,

    setIsAdmin: (isAdmin) => set({ isAdmin }),
    setBookingFormOpen: (isOpen) => set({ isBookingFormOpen: isOpen }),

    initializeStore: async () => {
        set({ isLoading: true });

        if (isSupabaseConfigured) {
            // ── Load from Supabase ──────────────────────────────────────────
            try {
                const [bookingsRes, contentRes, blogRes, reviewsRes] = await Promise.all([
                    supabase.from('bookings').select('*').order('created_at', { ascending: false }),
                    supabase.from('site_content').select('content').eq('id', 1).single(),
                    supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
                    supabase.from('reviews').select('*').order('created_at', { ascending: false }),
                ]);

                set({
                    bookings: (!bookingsRes.error && bookingsRes.data) ? bookingsRes.data.map(rowToBooking) : [],
                    siteContent: (!contentRes.error && contentRes.data?.content) ? mergeContent(contentRes.data.content as SiteContent) : INITIAL_SITE_CONTENT,
                    blogPosts: (!blogRes.error && blogRes.data) ? blogRes.data.map(rowToBlogPost) : [],
                    userReviews: (!reviewsRes.error && reviewsRes.data) ? reviewsRes.data.map(rowToReview) : [],
                });
            } catch (err) {
                console.error('Supabase init error:', err);
                // Supabase configured ama hata aldık → boş state, localStorage'dan veri alma
                set({
                    bookings: [],
                    siteContent: INITIAL_SITE_CONTENT,
                    blogPosts: [],
                    userReviews: [],
                });
            }
        } else {
            // Supabase yapılandırılmadıysa boş state — veri yok
            set({
                bookings: [],
                siteContent: INITIAL_SITE_CONTENT,
                blogPosts: [],
                userReviews: [],
            });
        }

        set({ isLoading: false });
    },

    setSiteContent: (content) => set({ siteContent: content }),

    updateSiteContent: async (newContent) => {
        set({ siteContent: newContent });

        if (isSupabaseConfigured) {
            const { error } = await supabase
                .from('site_content')
                .upsert({ id: 1, content: newContent as unknown as Record<string, unknown> });
            if (error) {
                console.error('Failed to save site content to Supabase:', error);
                throw new Error(error.message); // AdminPanel'in catch bloğu çalışsın
            }
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
                set({ bookings: [newBooking, ...bookings] });
            }
        } else {
            set({ bookings: [newBooking, ...bookings] });
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
            }
        }
    },

    deleteBooking: async (id) => {
        const { bookings } = get();
        const updated = bookings.filter(b => b.id !== id);
        set({ bookings: updated });

        if (isSupabaseConfigured) {
            const { error } = await supabase.from('bookings').delete().eq('id', id);
            if (error) {
                set({ bookings }); // restore optimistic update
                throw new Error(error.message);
            }
        }
    },

    // ── Blog CRUD ─────────────────────────────────────────────────────────────
    addBlogPost: async (post) => {
        const { blogPosts } = get();
        const updated = [post, ...blogPosts];
        set({ blogPosts: updated });

        if (isSupabaseConfigured) {
            const { error } = await supabase.from('blog_posts').insert(blogPostToRow(post));
            if (error) {
                console.error('Failed to save blog post to Supabase:', error);
                throw new Error(error.message);
            }
        }
    },

    updateBlogPost: async (post) => {
        const { blogPosts } = get();
        const updated = blogPosts.map(p => p.id === post.id ? post : p);
        set({ blogPosts: updated });

        if (isSupabaseConfigured) {
            const { error } = await supabase.from('blog_posts').upsert(blogPostToRow(post));
            if (error) {
                console.error('Failed to update blog post in Supabase:', error);
                throw new Error(error.message);
            }
        }
    },

    clearAllBlogPosts: async () => {
        const { blogPosts } = get();
        set({ blogPosts: [] });
        if (isSupabaseConfigured) {
            // Supabase RLS requires authenticated user — this runs inside admin session
            const { error } = await supabase.from('blog_posts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            if (error) {
                set({ blogPosts }); // restore
                throw new Error(error.message);
            }
        }
    },

    deleteBlogPost: async (id) => {
        const { blogPosts } = get();
        const updated = blogPosts.filter(p => p.id !== id);
        set({ blogPosts: updated });

        if (isSupabaseConfigured) {
            const { error } = await supabase.from('blog_posts').delete().eq('id', id);
            if (error) {
                set({ blogPosts }); // restore optimistic update
                throw new Error(error.message);
            }
        }
    },

    // ── Review CRUD ───────────────────────────────────────────────────────────
    addReview: async (review) => {
        const newReview: UserReview = {
            ...review,
            id: crypto.randomUUID(),
            status: 'pending',
            createdAt: new Date().toISOString(),
        };
        const { userReviews } = get();
        const updated = [newReview, ...userReviews];
        set({ userReviews: updated });
        if (isSupabaseConfigured) {
            try {
                const { error } = await supabase.from('reviews').insert({
                    id: newReview.id,
                    name: newReview.name,
                    country: newReview.country,
                    lang: newReview.lang,
                    rating: newReview.rating,
                    text: newReview.text,
                    status: newReview.status,
                    created_at: newReview.createdAt,
                });
                if (error) throw error;
            } catch (err) {
                console.error('Failed to add review to Supabase:', err);
            }
        }
    },

    updateReviewStatus: async (id, status) => {
        const { userReviews } = get();
        const updated = userReviews.map(r => r.id === id ? { ...r, status } : r);
        set({ userReviews: updated });

        if (isSupabaseConfigured) {
            try {
                const { error } = await supabase.from('reviews').update({ status }).eq('id', id);
                if (error) throw error;
            } catch (err) {
                console.error('Failed to update review status in Supabase:', err);
            }
        }
    },

    deleteReview: async (id) => {
        const { userReviews } = get();
        const updated = userReviews.filter(r => r.id !== id);
        set({ userReviews: updated });

        if (isSupabaseConfigured) {
            const { error } = await supabase.from('reviews').delete().eq('id', id);
            if (error) {
                set({ userReviews }); // restore optimistic update
                throw new Error(error.message);
            }
        }
    },
}));
