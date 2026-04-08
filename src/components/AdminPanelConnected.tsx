'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '../store/useAppStore';
import AdminPanel from './AdminPanel';
import { supabase } from '../lib/supabase';

/**
 * Connects AdminPanel props to the Zustand store.
 * This wrapper is needed because AdminPanel was designed with explicit props
 * (passed from App.tsx in the old Vite setup).
 */
export default function AdminPanelConnected() {
    const pathname = usePathname();
    const router = useRouter();
    const localeMatch = pathname?.match(/^\/([a-z]{2})(\/|$)/);
    const locale = localeMatch ? localeMatch[1] : 'tr';

    const {
        bookings,
        siteContent,
        blogPosts,
        userReviews,
        updateBookingStatus,
        addBooking,
        updateSiteContent,
        deleteBooking,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        clearAllBlogPosts,
        updateReviewStatus,
        deleteReview,
        setIsAdmin,
    } = useAppStore();

    const handleExitAdmin = async () => {
        setIsAdmin(false);
        await supabase.auth.signOut();
        router.push(`/${locale}`);
    };

    return (
        <AdminPanel
            bookings={bookings}
            onUpdateStatus={updateBookingStatus}
            onAddBooking={addBooking}
            siteContent={siteContent}
            onUpdateSiteContent={updateSiteContent}
            onExitAdmin={handleExitAdmin}
            onDeleteBooking={deleteBooking}
            blogPosts={blogPosts}
            onAddBlogPost={addBlogPost}
            onUpdateBlogPost={updateBlogPost}
            onDeleteBlogPost={deleteBlogPost}
            onClearAllBlogPosts={clearAllBlogPosts}
            userReviews={userReviews}
            onUpdateReviewStatus={updateReviewStatus}
            onDeleteReview={deleteReview}
        />
    );
}
