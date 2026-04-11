import { createClient } from './client';

export const fetcher = async (table: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from(table)
        .select('*');
    if (error) throw error;
    return data;
};
