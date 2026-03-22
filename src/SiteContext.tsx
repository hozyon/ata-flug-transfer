import React, { createContext, useContext, ReactNode } from 'react';
import { SiteContent } from './types';

interface SiteContextType {
    siteContent: SiteContent;
    updateSiteContent: (newContent: SiteContent) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{
    children: ReactNode;
    value: { siteContent: SiteContent; updateSiteContent: (n: SiteContent) => void }
}> = ({ children, value }) => {
    return (
        <SiteContext.Provider value={value}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSiteContent = () => {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error('useSiteContent must be used within a SiteProvider');
    }
    return context;
};
