'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '../utils/supabase/client';
import { isSupabaseConfigured } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';
import { INITIAL_SITE_CONTENT } from '../constants';

/**
 * AuthProvider — Supabase auth state observer.
 * Handles session lifecycle: login, logout, password recovery, single-session enforcement.
 * Must be rendered inside AppProviders (which provides the Zustand store).
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { setIsAdmin, isAdmin } = useAppStore();
    const isRecoveryModeRef = useRef(false);
    const supabase = createClient();

    const applySessionToken = async () => {
        if (!isSupabaseConfigured) return;

        const baseContent = useAppStore.getState().siteContent;
        if (baseContent === INITIAL_SITE_CONTENT) return;

        const token = crypto.randomUUID();
        sessionStorage.setItem('ata_session_token', token);

        const newContent = {
            ...baseContent,
            adminAccount: { ...baseContent.adminAccount!, activeSessionToken: token },
        };
        useAppStore.getState().setSiteContent(newContent);

        const { error } = await supabase
            .from('site_content')
            .upsert({ id: 1, content: newContent as unknown as Record<string, unknown> });
        if (error) {
            console.error('Session token write failed:', error);
            sessionStorage.removeItem('ata_session_token');
        }
    };

    useEffect(() => {
        if (!isSupabaseConfigured) return;

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                isRecoveryModeRef.current = true;
                setIsAdmin(false);
            } else if (event === 'INITIAL_SESSION') {
                if (!isRecoveryModeRef.current) {
                    setIsAdmin(!!session);
                    if (session && !sessionStorage.getItem('ata_session_token')) {
                        applySessionToken();
                    }
                }
            } else if (event === 'SIGNED_IN' && session) {
                if (!isRecoveryModeRef.current) {
                    setIsAdmin(true);
                }
            } else if (event === 'SIGNED_OUT') {
                isRecoveryModeRef.current = false;
                setIsAdmin(false);
                router.push('/');
            }
        });

        return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Single-session enforcement: check every 30s if our token is still active
    useEffect(() => {
        if (!isAdmin || !isSupabaseConfigured) return;

        const interval = setInterval(async () => {
            const localToken = sessionStorage.getItem('ata_session_token');
            if (!localToken) return;

            const { data } = await supabase
                .from('site_content')
                .select('content')
                .eq('id', 1)
                .single();
            const dbToken = (data?.content as Record<string, unknown> | null)
                ? ((data?.content as Record<string, Record<string, unknown>>)?.adminAccount?.activeSessionToken as string | undefined)
                : undefined;

            if (dbToken && dbToken !== localToken) {
                sessionStorage.removeItem('ata_session_token');
                await supabase.auth.signOut();
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [isAdmin, supabase]);

    // Redirect admin to /admin if logged in and on login page
    useEffect(() => {
        if (isAdmin && pathname?.includes('/login')) {
            // Extract locale from pathname (e.g. /tr/login -> /tr/admin)
            const localeMatch = pathname.match(/^\/([a-z]{2})\//);
            const locale = localeMatch ? localeMatch[1] : 'tr';
            router.push(`/${locale}/admin`);
        }
    }, [isAdmin, pathname, router]);

    return <>{children}</>;
}
