'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../store/useAppStore';
import AdminPanel from './AdminPanel';
import { createClient } from '../utils/supabase/client';
import useSWR from 'swr';
import * as bookingActions from '../app/actions/bookings';
import * as blogActions from '../app/actions/blog';
import * as reviewActions from '../app/actions/reviews';
import * as contentActions from '../app/actions/siteContent';
import { Booking, BlogPost, UserReview, SiteContent } from '../types';

const supabase = createClient();

const fetcher = async (table: string) => {
    const { data, error } = await supabase
        .from(table)
        .select('*')
        .order(table === 'site_content' ? 'id' : 'created_at', { ascending: table === 'site_content' });
    if (error) throw error;
    return data as any[];
};

export default function AdminPanelConnected() {
    const router = useRouter();

    // Fetch data using SWR
    const { data: bookingsRaw, mutate: mutateBookings } = useSWR<any[]>('bookings', fetcher);
    const { data: contentRaw, mutate: mutateContent } = useSWR<any[]>('site_content', fetcher);
    const { data: blogRaw, mutate: mutateBlog } = useSWR<any[]>('blog_posts', fetcher);
    const { data: reviewsRaw, mutate: mutateReviews } = useSWR<any[]>('reviews', fetcher);

    const { setIsAdmin } = useAppStore();

    const handleExitAdmin = async () => {
        setIsAdmin(false);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push(`/`);
    };

    // Helper to map SWR data to types
    const bookings: Booking[] = bookingsRaw?.map(row => ({
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

    const siteContent: SiteContent = contentRaw?.[0]?.content || useAppStore.getState().siteContent;

    const blogPosts: BlogPost[] = blogRaw?.map(row => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt || '',
        content: row.content || '',
        featuredImage: row.featured_image || '',
        category: row.category || '',
        tags: row.tags || [],
        author: row.author || 'Sistem Yöneticisi',
        publishedAt: row.published_at,
        updatedAt: row.updated_at,
        seoTitle: row.seo_title || '',
        seoDescription: row.seo_description || '',
        isPublished: row.is_published,
        viewCount: row.view_count || 0,
    })) || [];

    const userReviews: UserReview[] = reviewsRaw?.map(row => ({
        id: row.id,
        name: row.name,
        country: row.country || '',
        lang: row.lang || 'tr',
        rating: row.rating,
        text: row.text,
        status: row.status,
        createdAt: row.created_at,
    })) || [];

    // Action wrappers
    const onUpdateStatus = async (id: string, status: Booking['status']) => {
        await bookingActions.updateBookingStatus(id, status);
        mutateBookings();
    };

    const onAddBooking = async (b: Partial<Booking>) => {
        await bookingActions.addBooking(b);
        mutateBookings();
    };

    const onDeleteBooking = async (id: string) => {
        await bookingActions.deleteBooking(id);
        mutateBookings();
    };

    const onUpdateSiteContent = async (content: SiteContent) => {
        await contentActions.updateSiteContent(content);
        await mutateContent();
    };

    const onAddBlogPost = async (post: BlogPost) => {
        await blogActions.addBlogPost(post);
        mutateBlog();
    };

    const onUpdateBlogPost = async (post: BlogPost) => {
        await blogActions.updateBlogPost(post);
        mutateBlog();
    };

    const onDeleteBlogPost = async (id: string) => {
        await blogActions.deleteBlogPost(id);
        mutateBlog();
    };


    const onUpdateReviewStatus = async (id: string, status: UserReview['status']) => {
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
            userReviews={userReviews}
            onUpdateReviewStatus={onUpdateReviewStatus}
            onDeleteReview={onDeleteReview}
        />
    );
}
