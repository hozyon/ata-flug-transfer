'use server'

import { createClient } from '../../utils/supabase/server'
import { BlogPost } from '../../types'
import { revalidatePath } from 'next/cache'

function blogPostToRow(p: BlogPost) {
    return {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || null,
        content: p.content || null,
        featured_image: p.featuredImage || null,
        category: p.category || null,
        tags: p.tags || [],
        author: p.author || 'Ata Flug Transfer',
        published_at: p.publishedAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        seo_title: p.seoTitle || null,
        seo_description: p.seoDescription || null,
        is_published: p.isPublished || false,
        view_count: p.viewCount || 0,
    }
}

export async function addBlogPost(post: BlogPost) {
    const supabase = await createClient()
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('blog_posts')
        .insert(blogPostToRow(post))

    if (error) {
        console.error('Failed to add blog post:', error)
        throw new Error(error.message)
    }

    revalidatePath('/blog')
    revalidatePath('/admin')
}

export async function updateBlogPost(post: BlogPost) {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('blog_posts')
        .update(blogPostToRow(post))
        .eq('id', post.id)

    if (error) {
        console.error('Failed to update blog post:', error)
        throw new Error(error.message)
    }

    revalidatePath('/blog')
    revalidatePath(`/blog/${post.slug}`)
    revalidatePath('/admin')
}

export async function deleteBlogPost(id: string) {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Failed to delete blog post:', error)
        throw new Error(error.message)
    }

    revalidatePath('/blog')
    revalidatePath('/admin')
}

export async function clearAllBlogPosts() {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('blog_posts')
        .delete()
        .not('id', 'is', null)

    if (error) {
        console.error('Failed to clear blog posts:', error)
        throw new Error(error.message)
    }

    revalidatePath('/blog')
    revalidatePath('/admin')
}
