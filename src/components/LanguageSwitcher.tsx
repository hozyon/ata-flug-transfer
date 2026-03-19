import React, { useState, useRef } from 'react';
import { useLanguage, LANGUAGE_LABELS, type Language } from '../i18n/LanguageContext';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const current = LANGUAGE_LABELS[language];
    const languages = Object.entries(LANGUAGE_LABELS) as [Language, typeof current][];

    const handleMouseEnter = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        closeTimer.current = setTimeout(() => setIsOpen(false), 150);
    };

    return (
        <div
            className="relative"
            style={{ fontFamily: "'Outfit', sans-serif" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                className="relative flex items-center gap-1.5 overflow-hidden rounded-xl font-black text-[11.5px] uppercase tracking-[0.09em] transition-all duration-200 active:scale-[0.96] hover:-translate-y-px"
                style={{
                    fontFamily: "'Outfit', sans-serif",
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.45)',
                    padding: '9px 14px',
                    border: '1px solid transparent',
                    boxShadow: 'none',
                }}
            >
                <span className="text-base leading-none">{current.flag}</span>
                <span className="hidden sm:inline">{current.native}</span>
                <i className={`fa-solid fa-chevron-down text-[8px] opacity-40 transition-transform duration-200 hidden sm:inline ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div
                    className="absolute top-full right-0 mt-1 w-44 rounded-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-150"
                    style={{
                        background: 'rgba(8,10,20,0.45)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                    }}
                >
                    {languages.map(([code, info]) => (
                        <button
                            key={code}
                            onClick={() => { setLanguage(code); setIsOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors duration-150 ${code === language
                                ? 'text-[var(--color-primary)]'
                                : 'text-white/50 hover:text-white/80'
                            }`}
                            style={code === language ? { background: 'rgba(197,160,89,0.08)' } : {}}
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
