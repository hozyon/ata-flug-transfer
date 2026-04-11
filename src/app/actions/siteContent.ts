'use server'

import { createClient } from '../../utils/supabase/server'
import { SiteContent } from '../../types'
import { revalidatePath } from 'next/cache'

export async function updateSiteContent(newContent: SiteContent) {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('site_content')
        .upsert({ id: 1, content: newContent as any })

    if (error) {
        console.error('Failed to update site content:', error)
        throw new Error(error.message)
    }

    revalidatePath('/', 'layout') // Revalidate everything as site content affects all pages
}
