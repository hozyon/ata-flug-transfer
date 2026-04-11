'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '../store/useAppStore';
import AdminPanel from './AdminPanel';
import { createClient } from '../utils/supabase/client';
import useSWR from 'swr';
import * as bookingActions from '../app/actions/bookings';
import * as blogActions from '../app/actions/blog';
import * as reviewActions from '../app/actions/reviews';
import * as contentActions from '../app/actions/siteContent';

const supabase = createClient();

const fetcher = async (table: string) => {
    const { data, error } = await supabase
        .from(table)
        .select('*')
        .order(table === 'site_content' ? 'id' : 'created_at', { ascending: table === 'site_content' });
    if (error) throw error;
    return data;
};

export default function AdminPanelConnected() {
    const pathname = usePathname();
    const router = useRouter();
    const localeMatch = pathname?.match(/^\/([a-z]{2})(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : 'tr';

    // Fetch data using SWR
    const { data: bookingsRaw, mutate: mutateBookings } = useSWR('bookings', fetcher);
    const { data: contentRaw, mutate: mutateContent } = useSWR('site_content', fetcher);
    const { data: blogRaw, mutate: mutateBlog } = useSWR('blog_posts', fetcher);
    const { data: reviewsRaw, mutate: mutateReviews } = useSWR('reviews', fetcher);

    const { setIsAdmin } = useAppStore();

    const handleExitAdmin = async () => {
        setIsAdmin(false);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push(`/${locale}`);
    };

    // Helper to map SWR data to types
    const bookings = bookingsRaw?.map(row => ({
        id: row.id,
        customerName: row.customer_name,
        phone: row.phone,
        email: row.email || undefined,
        pickup: row.pickup,
        destination: row.destination,
        date: row.date,
        time: row.time,
        passengers: row.passengers,
        vehicleId: row.vehicle_id,
        status: row.status,
        totalPrice: Number(row.total_price),
        createdAt: row.created_at,
        notes: row.notes || undefined,
        flightNumber: row.flight_number || undefined,
    })) || [];

    const siteContent = contentRaw?.[0]?.content || useAppStore.getState().siteContent;

    const blogPosts = blogRaw?.map(row => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt || '',
        content: row.content || '',
        featuredImage: row.featured_image || '',
        category: row.category || '',
        tags: row.tags || [],
        author: row.author || 'Ata Flug Transfer',
        publishedAt: row.published_at,
        updatedAt: row.updated_at,
        seoTitle: row.seo_title || '',
        seoDescription: row.seo_description || '',
        isPublished: row.is_published,
        viewCount: row.view_count || 0,
    })) || [];

    const userReviews = reviewsRaw?.map(row => ({
        id: row.id,
        name: row.name,
        country: row.country || '',
        lang: row.lang || 'tr',
        rating: row.rating,
        text: row.text,
        status: row.status,
        createdAt: row.created_at,
    })) || [];

    // Action wrappers that also update SWR cache
    const onUpdateStatus = async (id: string, status: any) => {
        await bookingActions.updateBookingStatus(id, status);
        mutateBookings();
    };

    const onAddBooking = async (b: any) => {
        await bookingActions.addBooking(b);
        mutateBookings();
    };

    const onDeleteBooking = async (id: string) => {
        await bookingActions.deleteBooking(id);
        mutateBookings();
    };

    const onUpdateSiteContent = async (content: any) => {
        await contentActions.updateSiteContent(content);
        mutateContent();
    };

    const onAddBlogPost = async (post: any) => {
        await blogActions.addBlogPost(post);
        mutateBlog();
    };

    const onUpdateBlogPost = async (post: any) => {
        await blogActions.updateBlogPost(post);
        mutateBlog();
    };

    const onDeleteBlogPost = async (id: string) => {
        await blogActions.deleteBlogPost(id);
        mutateBlog();
    };

    const onClearAllBlogPosts = async () => {
        await blogActions.clearAllBlogPosts();
        mutateBlog();
    };

    const onUpdateReviewStatus = async (id: string, status: any) => {
        await reviewActions.updateReviewStatus(id, status);
        mutateReviews();
    };

    const onDeleteReview = async (id: string) => {
        await reviewActions.deleteReview(id);
        mutateReviews();
    };

    return (
        <AdminPanel
            bookings={bookings}
            onUpdateStatus={onUpdateStatus}
            onAddBooking={onAddBooking}
            siteContent={siteContent}
            onUpdateSiteContent={onUpdateSiteContent}
            onExitAdmin={handleExitAdmin}
            onDeleteBooking={onDeleteBooking}
            blogPosts={blogPosts}
            onAddBlogPost={onAddBlogPost}
            onUpdateBlogPost={onUpdateBlogPost}
            onDeleteBlogPost={onDeleteBlogPost}
            onClearAllBlogPosts={onClearAllBlogPosts}
            userReviews={userReviews}
            onUpdateReviewStatus={onUpdateReviewStatus}
            onDeleteReview={onDeleteReview}
        />
    );
}
