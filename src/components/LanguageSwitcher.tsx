import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LANGUAGE_LABELS, type Language } from '../i18n/LanguageContext';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const current = LANGUAGE_LABELS[language];
    const languages = Object.entries(LANGUAGE_LABELS) as [Language, typeof current][];

    return (
        <div ref={ref} className="relative" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center gap-1.5 overflow-hidden rounded-xl font-black text-[11.5px] uppercase tracking-[0.09em] transition-all duration-200 active:scale-[0.96] hover:-translate-y-px"
                style={{
                    fontFamily: "'Outfit', sans-serif",
                    background: 'linear-gradient(135deg, rgba(232,212,154,0.28) 0%, rgba(197,160,89,0.38) 55%, rgba(158,123,56,0.28) 100%)',
                    color: '#e8d49a',
                    padding: '9px 14px',
                    border: '1px solid rgba(197,160,89,0.3)',
                    boxShadow: '0 2px 12px rgba(197,160,89,0.12), inset 0 1px 0 rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                }}
            >
                <span className="text-base leading-none">{current.flag}</span>
                <span className="hidden sm:inline">{current.native}</span>
                <i className={`fa-solid fa-chevron-down text-[8px] opacity-60 transition-transform duration-200 hidden sm:inline ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/40 z-[100] animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                        background: 'rgba(10, 10, 14, 0.92)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)'
                    }}
                >
                    {languages.map(([code, info]) => (
                        <button
                            key={code}
                            onClick={() => { setLanguage(code); setIsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors duration-150 ${code === language
                                ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                                : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                                }`}
                        >
                            <span className="text-lg leading-none">{info.flag}</span>
                            <span className="font-medium">{info.native}</span>
                            {code === language && (
                                <i className="fa-solid fa-check text-[10px] text-[var(--color-primary)] ml-auto"></i>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
