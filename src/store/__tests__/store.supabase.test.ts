/**
 * Store action tests — Supabase mode (isSupabaseConfigured = true)
 *
 * Verifies that delete/update operations throw on Supabase errors
 * and restore optimistic UI state (RLS fix).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// ── Controllable Supabase mock ────────────────────────────────────────────────
// vi.hoisted ensures these are available inside the vi.mock factory below
const { mockEqFn, mockNeqFn, mockUpsertFn } = vi.hoisted(() => ({
    mockEqFn: vi.fn(),
    mockNeqFn: vi.fn(),
    mockUpsertFn: vi.fn(),
}));

vi.mock('../../lib/supabase', () => ({
    isSupabaseConfigured: true,
    supabase: {
        from: vi.fn(() => ({
            delete: vi.fn(() => ({ eq: mockEqFn, neq: mockNeqFn })),
            upsert: mockUpsertFn,
            select: vi.fn(() => ({
                eq: vi.fn(() => ({ single: vi.fn().mockResolvedValue({ data: null, error: null }) })),
                order: vi.fn().mockResolvedValue({ data: [], error: null }),
            })),
        })),
    },
}));

import { useAppStore } from '../useAppStore';
import { INITIAL_SITE_CONTENT } from '../../constants';

function resetStore() {
    useAppStore.setState({
        isAdmin: false,
        siteContent: INITIAL_SITE_CONTENT,
        bookings: [],
        blogPosts: [],
        userReviews: [],
        isBookingFormOpen: false,
        isLoading: false,
    });
}

beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
});

// ── updateSiteContent throws on Supabase error ────────────────────────────────

describe('updateSiteContent (Supabase error)', () => {
    it('throws when Supabase upsert fails', async () => {
        mockUpsertFn.mockResolvedValue({ error: { message: 'RLS violation' } });

        const updated = { ...INITIAL_SITE_CONTENT, mapBgImage: 'fail.jpg' };
        await expect(useAppStore.getState().updateSiteContent(updated)).rejects.toThrow('RLS violation');
    });
});

// ── deleteBlogPost throws and restores state ──────────────────────────────────

describe('deleteBlogPost (Supabase error)', () => {
    it('throws when Supabase delete fails', async () => {
        mockEqFn.mockResolvedValue({ error: { message: 'not authenticated' } });

        const post = { id: 'p1', slug: 's1', title: 'X', excerpt: '', content: '', featuredImage: '', category: '', tags: [], author: '', publishedAt: '', updatedAt: '', seoTitle: '', seoDescription: '', isPublished: true, viewCount: 0 };
        useAppStore.setState({ blogPosts: [post] });

        await expect(useAppStore.getState().deleteBlogPost('p1')).rejects.toThrow('not authenticated');
    });

    it('restores blogPosts to pre-delete state on error', async () => {
        mockEqFn.mockResolvedValue({ error: { message: 'not authenticated' } });

        const post = { id: 'p1', slug: 's1', title: 'X', excerpt: '', content: '', featuredImage: '', category: '', tags: [], author: '', publishedAt: '', updatedAt: '', seoTitle: '', seoDescription: '', isPublished: true, viewCount: 0 };
        useAppStore.setState({ blogPosts: [post] });

        try { await useAppStore.getState().deleteBlogPost('p1'); } catch { /* expected */ }

        expect(useAppStore.getState().blogPosts).toHaveLength(1);
        expect(useAppStore.getState().blogPosts[0].id).toBe('p1');
    });
});

// ── deleteBooking throws and restores state ───────────────────────────────────

describe('deleteBooking (Supabase error)', () => {
    it('throws when Supabase delete fails', async () => {
        mockEqFn.mockResolvedValue({ error: { message: 'not authenticated' } });

        const booking = { id: 'TR-99999', customerName: 'Ali', phone: '0500', pickup: 'AYT', destination: 'Kemer', date: '2026-06-01', time: '10:00', passengers: 1, vehicleId: 'v1', status: 'Pending' as const, totalPrice: 50, createdAt: '' };
        useAppStore.setState({ bookings: [booking] });

        await expect(useAppStore.getState().deleteBooking('TR-99999')).rejects.toThrow('not authenticated');
    });

    it('restores bookings to pre-delete state on error', async () => {
        mockEqFn.mockResolvedValue({ error: { message: 'not authenticated' } });

        const booking = { id: 'TR-99999', customerName: 'Ali', phone: '0500', pickup: 'AYT', destination: 'Kemer', date: '2026-06-01', time: '10:00', passengers: 1, vehicleId: 'v1', status: 'Pending' as const, totalPrice: 50, createdAt: '' };
        useAppStore.setState({ bookings: [booking] });

        try { await useAppStore.getState().deleteBooking('TR-99999'); } catch { /* expected */ }

        expect(useAppStore.getState().bookings).toHaveLength(1);
        expect(useAppStore.getState().bookings[0].id).toBe('TR-99999');
    });
});

// ── deleteReview throws and restores state ────────────────────────────────────

describe('deleteReview (Supabase error)', () => {
    it('throws when Supabase delete fails', async () => {
        mockEqFn.mockResolvedValue({ error: { message: 'not authenticated' } });

        const review = { id: 'rev-1', name: 'Ali', country: 'TR', lang: 'tr', rating: 5, text: 'İyi', status: 'approved' as const, createdAt: '' };
        useAppStore.setState({ userReviews: [review] });

        await expect(useAppStore.getState().deleteReview('rev-1')).rejects.toThrow('not authenticated');
    });

    it('restores userReviews to pre-delete state on error', async () => {
        mockEqFn.mockResolvedValue({ error: { message: 'not authenticated' } });

        const review = { id: 'rev-1', name: 'Ali', country: 'TR', lang: 'tr', rating: 5, text: 'İyi', status: 'approved' as const, createdAt: '' };
        useAppStore.setState({ userReviews: [review] });

        try { await useAppStore.getState().deleteReview('rev-1'); } catch { /* expected */ }

        expect(useAppStore.getState().userReviews).toHaveLength(1);
    });
});

// ── clearAllBlogPosts throws and restores state ───────────────────────────────

describe('clearAllBlogPosts (Supabase error)', () => {
    it('throws when Supabase delete fails', async () => {
        mockNeqFn.mockResolvedValue({ error: { message: 'not authenticated' } });

        const post = { id: 'p1', slug: 's1', title: 'X', excerpt: '', content: '', featuredImage: '', category: '', tags: [], author: '', publishedAt: '', updatedAt: '', seoTitle: '', seoDescription: '', isPublished: true, viewCount: 0 };
        useAppStore.setState({ blogPosts: [post] });

        await expect(useAppStore.getState().clearAllBlogPosts()).rejects.toThrow('not authenticated');
    });

    it('restores blogPosts on error', async () => {
        mockNeqFn.mockResolvedValue({ error: { message: 'not authenticated' } });

        const post = { id: 'p1', slug: 's1', title: 'X', excerpt: '', content: '', featuredImage: '', category: '', tags: [], author: '', publishedAt: '', updatedAt: '', seoTitle: '', seoDescription: '', isPublished: true, viewCount: 0 };
        useAppStore.setState({ blogPosts: [post] });

        try { await useAppStore.getState().clearAllBlogPosts(); } catch { /* expected */ }

        expect(useAppStore.getState().blogPosts).toHaveLength(1);
    });
});
