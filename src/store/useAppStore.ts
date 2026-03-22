import { create } from 'zustand';
import { Booking, SiteContent, BlogPost, UserReview } from '../types';
import { INITIAL_SITE_CONTENT, MOCK_BOOKINGS, BLOG_POSTS } from '../constants';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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

    // Reviews
    addReview: (review: Omit<UserReview, 'id' | 'status' | 'createdAt'>) => Promise<void>;
    updateReviewStatus: (id: string, status: UserReview['status']) => Promise<void>;
    deleteReview: (id: string) => Promise<void>;
}

// ─── localStorage helpers (fallback when Supabase not configured) ───────────
const LS_BOOKINGS = 'ata_bookings_v6';
const LS_CONTENT = 'ata_site_content_v10';
const LS_BLOG = 'ata_blog_posts_v1';
const LS_REVIEWS = 'ata_user_reviews_v1';

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

function loadBlogFromLS(): BlogPost[] {
    try {
        const saved = localStorage.getItem(LS_BLOG);
        return saved ? JSON.parse(saved) : BLOG_POSTS;
    } catch { return BLOG_POSTS; }
}

function saveBlogToLS(posts: BlogPost[]) {
    localStorage.setItem(LS_BLOG, JSON.stringify(posts));
}

function loadReviewsFromLS(): UserReview[] {
    try {
        const saved = localStorage.getItem(LS_REVIEWS);
        return saved ? JSON.parse(saved) : [];
    } catch { return []; }
}

function saveReviewsToLS(reviews: UserReview[]) {
    localStorage.setItem(LS_REVIEWS, JSON.stringify(reviews));
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
        adminAccount: parsed.adminAccount
            ? { ...INITIAL_SITE_CONTENT.adminAccount, ...parsed.adminAccount }
            : INITIAL_SITE_CONTENT.adminAccount,
    };
    if (!Array.isArray(merged.hero.backgrounds) || merged.hero.backgrounds.length === 0) {
        merged.hero.backgrounds = INITIAL_SITE_CONTENT.hero.backgrounds;
    }
    // Strip subMenus from /bolgeler nav item (enforced rule)
    if (Array.isArray(merged.navbar)) {
        merged.navbar = merged.navbar.map(item =>
            item.url === '/bolgeler' ? { ...item, subMenus: [] } : item
        );
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
                    blogPosts: (!blogRes.error && blogRes.data && blogRes.data.length > 0) ? blogRes.data.map(rowToBlogPost) : loadBlogFromLS(),
                    userReviews: (!reviewsRes.error && reviewsRes.data) ? reviewsRes.data.map(rowToReview) : [],
                });
            } catch (err) {
                console.error('Supabase init error, falling back to localStorage:', err);
                set({
                    bookings: loadBookingsFromLS(),
                    siteContent: loadContentFromLS(),
                    blogPosts: loadBlogFromLS(),
                    userReviews: loadReviewsFromLS(),
                });
            }
        } else {
            // ── localStorage fallback ───────────────────────────────────────
            set({
                bookings: loadBookingsFromLS(),
                siteContent: loadContentFromLS(),
                blogPosts: loadBlogFromLS(),
                userReviews: loadReviewsFromLS(),
            });
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
                const { error } = await supabase.from('bookings').delete().eq('id', id);
                if (error) throw error;
            } catch (err) {
                console.error('Failed to delete booking from Supabase:', err);
                saveBookingsToLS(updated);
            }
        } else {
            saveBookingsToLS(updated);
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
                saveBlogToLS(updated);
                throw new Error(error.message);
            }
        } else {
            saveBlogToLS(updated);
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
                saveBlogToLS(updated);
                throw new Error(error.message);
            }
        } else {
            saveBlogToLS(updated);
        }
    },

    deleteBlogPost: async (id) => {
        const { blogPosts } = get();
        const updated = blogPosts.filter(p => p.id !== id);
        set({ blogPosts: updated });

        if (isSupabaseConfigured) {
            try {
                const { error } = await supabase.from('blog_posts').delete().eq('id', id);
                if (error) throw error;
            } catch (err) {
                console.error('Failed to delete blog post from Supabase:', err);
                saveBlogToLS(updated);
            }
        } else {
            saveBlogToLS(updated);
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
                saveReviewsToLS(updated);
            }
        } else {
            saveReviewsToLS(updated);
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
                saveReviewsToLS(updated);
            }
        } else {
            saveReviewsToLS(updated);
        }
    },

    deleteReview: async (id) => {
        const { userReviews } = get();
        const updated = userReviews.filter(r => r.id !== id);
        set({ userReviews: updated });

        if (isSupabaseConfigured) {
            try {
                const { error } = await supabase.from('reviews').delete().eq('id', id);
                if (error) throw error;
            } catch (err) {
                console.error('Failed to delete review from Supabase:', err);
                saveReviewsToLS(updated);
            }
        } else {
            saveReviewsToLS(updated);
        }
    },
}));
