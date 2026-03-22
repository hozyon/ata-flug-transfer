/**
 * Store action tests — localStorage mode (isSupabaseConfigured = false)
 *
 * These tests verify that the Zustand store correctly manages state
 * and persists to localStorage when Supabase is not configured.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock supabase BEFORE importing the store so the module sees configured = false
vi.mock('../../lib/supabase', () => ({
    isSupabaseConfigured: false,
    supabase: { from: vi.fn() },
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
    localStorage.clear();
});

// ── updateSiteContent ─────────────────────────────────────────────────────────

describe('updateSiteContent (localStorage mode)', () => {
    it('updates siteContent in store', async () => {
        const updated = { ...INITIAL_SITE_CONTENT, mapBgImage: 'custom.jpg' };
        await useAppStore.getState().updateSiteContent(updated);
        expect(useAppStore.getState().siteContent.mapBgImage).toBe('custom.jpg');
    });

    it('persists to localStorage', async () => {
        const updated = { ...INITIAL_SITE_CONTENT, mapBgImage: 'persisted.jpg' };
        await useAppStore.getState().updateSiteContent(updated);
        const saved = JSON.parse(localStorage.getItem('ata_site_content_v10') || '{}');
        expect(saved.mapBgImage).toBe('persisted.jpg');
    });
});

// ── deleteBlogPost ────────────────────────────────────────────────────────────

describe('deleteBlogPost (localStorage mode)', () => {
    it('removes the post from store state', async () => {
        const post = {
            id: 'post-1',
            slug: 'test-post',
            title: 'Test',
            excerpt: '',
            content: '',
            featuredImage: '',
            category: '',
            tags: [],
            author: 'Test',
            publishedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            seoTitle: '',
            seoDescription: '',
            isPublished: true,
            viewCount: 0,
        };
        useAppStore.setState({ blogPosts: [post] });

        await useAppStore.getState().deleteBlogPost('post-1');

        expect(useAppStore.getState().blogPosts).toHaveLength(0);
    });

    it('only removes the targeted post, keeps others', async () => {
        const post1 = { id: 'p1', slug: 's1', title: 'A', excerpt: '', content: '', featuredImage: '', category: '', tags: [], author: '', publishedAt: '', updatedAt: '', seoTitle: '', seoDescription: '', isPublished: true, viewCount: 0 };
        const post2 = { id: 'p2', slug: 's2', title: 'B', excerpt: '', content: '', featuredImage: '', category: '', tags: [], author: '', publishedAt: '', updatedAt: '', seoTitle: '', seoDescription: '', isPublished: true, viewCount: 0 };
        useAppStore.setState({ blogPosts: [post1, post2] });

        await useAppStore.getState().deleteBlogPost('p1');

        const remaining = useAppStore.getState().blogPosts;
        expect(remaining).toHaveLength(1);
        expect(remaining[0].id).toBe('p2');
    });
});

// ── deleteBooking ─────────────────────────────────────────────────────────────

describe('deleteBooking (localStorage mode)', () => {
    it('removes the booking from store state', async () => {
        const booking = {
            id: 'TR-11111',
            customerName: 'Ali',
            phone: '05001234567',
            pickup: 'Antalya',
            destination: 'Kemer',
            date: '2026-06-01',
            time: '10:00',
            passengers: 2,
            vehicleId: 'v1',
            status: 'Pending' as const,
            totalPrice: 50,
            createdAt: new Date().toISOString(),
        };
        useAppStore.setState({ bookings: [booking] });

        await useAppStore.getState().deleteBooking('TR-11111');

        expect(useAppStore.getState().bookings).toHaveLength(0);
    });
});

// ── deleteReview ──────────────────────────────────────────────────────────────

describe('deleteReview (localStorage mode)', () => {
    it('removes the review from store state', async () => {
        const review = {
            id: 'rev-1',
            name: 'Müşteri',
            country: 'TR',
            lang: 'tr',
            rating: 5,
            text: 'Mükemmel',
            status: 'approved' as const,
            createdAt: new Date().toISOString(),
        };
        useAppStore.setState({ userReviews: [review] });

        await useAppStore.getState().deleteReview('rev-1');

        expect(useAppStore.getState().userReviews).toHaveLength(0);
    });
});

// ── clearAllBlogPosts ─────────────────────────────────────────────────────────

describe('clearAllBlogPosts (localStorage mode)', () => {
    it('empties blogPosts in store', async () => {
        const post = { id: 'p1', slug: 's1', title: 'X', excerpt: '', content: '', featuredImage: '', category: '', tags: [], author: '', publishedAt: '', updatedAt: '', seoTitle: '', seoDescription: '', isPublished: true, viewCount: 0 };
        useAppStore.setState({ blogPosts: [post] });

        await useAppStore.getState().clearAllBlogPosts();

        expect(useAppStore.getState().blogPosts).toHaveLength(0);
    });

    it('removes ata_blog_posts_v1 from localStorage', async () => {
        localStorage.setItem('ata_blog_posts_v1', JSON.stringify([{ id: 'x' }]));

        await useAppStore.getState().clearAllBlogPosts();

        expect(localStorage.getItem('ata_blog_posts_v1')).toBeNull();
    });
});
