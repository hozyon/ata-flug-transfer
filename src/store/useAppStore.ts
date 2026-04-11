import { create } from 'zustand';
import { SiteContent } from '../types';
import { INITIAL_SITE_CONTENT } from '../constants';

interface AppStore {
    // State
    isAdmin: boolean;
    siteContent: SiteContent;
    isBookingFormOpen: boolean;
    isLoading: boolean;

    // Actions
    setIsAdmin: (isAdmin: boolean) => void;
    setSiteContent: (content: SiteContent) => void;
    setBookingFormOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
    isAdmin: false,
    siteContent: INITIAL_SITE_CONTENT,
    isBookingFormOpen: false,
    isLoading: false,

    setIsAdmin: (isAdmin) => set({ isAdmin }),
    setBookingFormOpen: (isOpen) => set({ isBookingFormOpen: isOpen }),
    setSiteContent: (content) => set({ siteContent: content }),
}));
