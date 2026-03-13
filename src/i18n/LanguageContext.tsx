import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
import sourceTexts, { Language, DEFAULT_LANGUAGE, LANGUAGE_LABELS } from './translations';
import { translationService, TRANSLATION_DEBOUNCE_MS } from './TranslationService';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (keyOrText: string) => string;
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('ata_language');
        if (saved && saved in LANGUAGE_LABELS) return saved as Language;
        return DEFAULT_LANGUAGE;
    });

    const [, setTick] = useState(0);
    const pendingTexts = useRef<Set<string>>(new Set());
    const batchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isTranslating = useRef(false);

    useEffect(() => {
        translationService.setLanguage(language);
    }, [language]);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('ata_language', lang);
        translationService.setLanguage(lang);
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = lang;
        // Clear pending to re-queue with new language
        pendingTexts.current.clear();
    }, []);

    // Fire batch translation
    const fireBatch = useCallback(() => {
        if (isTranslating.current) return;
        if (pendingTexts.current.size === 0) return;

        const texts = Array.from(pendingTexts.current);
        pendingTexts.current.clear();
        isTranslating.current = true;

        translationService.translateBatch(texts)
            .then(() => {
                isTranslating.current = false;
                setTick(prev => prev + 1);

                // If more texts accumulated while translating, fire again
                if (pendingTexts.current.size > 0) {
                    fireBatch();
                }
            })
            .catch(() => {
                isTranslating.current = false;
                setTick(prev => prev + 1);
            });
    }, []);

    const t = useCallback((keyOrText: string): string => {
        if (!keyOrText) return keyOrText;

        // Resolve: key → Turkish text, or use raw text directly
        const turkishText = sourceTexts[keyOrText] || keyOrText;

        // Turkish → return immediately
        if (language === 'tr') return turkishText;

        // Check cache (instant)
        const cached = translationService.getCached(turkishText);
        if (cached) return cached;

        // Queue for batch translation
        pendingTexts.current.add(turkishText);

        if (batchTimer.current) clearTimeout(batchTimer.current);
        batchTimer.current = setTimeout(fireBatch, TRANSLATION_DEBOUNCE_MS);

        // Return Turkish while waiting
        return turkishText;
    }, [language, fireBatch]);

    const isRTL = language === 'ar';

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
    return ctx;
};

export { type Language, LANGUAGE_LABELS } from './translations';
