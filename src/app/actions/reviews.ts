'use server'

import { createClient } from '../../utils/supabase/server'
import { UserReview } from '../../types'
import { revalidatePath } from 'next/cache'

export async function addReview(review: Omit<UserReview, 'id' | 'status' | 'createdAt'>) {
    const supabase = await createClient()

    // Public action (customers can submit reviews)
    const { error } = await supabase.from('reviews').insert({
        name: review.name,
        country: review.country,
        lang: review.lang || 'tr',
        rating: review.rating,
        text: review.text,
        status: 'pending',
    })

    if (error) {
        console.error('Failed to add review:', error)
        throw new Error(error.message)
    }

    revalidatePath('/admin')
}

export async function updateReviewStatus(id: string, status: UserReview['status']) {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', id)

    if (error) {
        console.error('Failed to update review status:', error)
        throw new Error(error.message)
    }

    revalidatePath('/')
    revalidatePath('/admin')
}

export async function deleteReview(id: string) {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Failed to delete review:', error)
        throw new Error(error.message)
    }

    revalidatePath('/')
    revalidatePath('/admin')
}
