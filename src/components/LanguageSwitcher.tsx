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
                className="flex items-center gap-1.5 px-2 py-2 sm:px-3 sm:py-2 rounded-xl sm:rounded-full border border-white/0 sm:border-white/10 bg-white/0 sm:bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white text-xs font-medium transition-all duration-200"
            >
                <span className="text-base leading-none">{current.flag}</span>
                <span className="hidden sm:inline">{current.native}</span>
                <i className={`fa-solid fa-chevron-down text-[8px] text-white/40 transition-transform duration-200 hidden sm:inline ${isOpen ? 'rotate-180' : ''}`}></i>
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
                                ? 'bg-[#c5a059]/10 text-[#c5a059]'
                                : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                                }`}
                        >
                            <span className="text-lg leading-none">{info.flag}</span>
                            <span className="font-medium">{info.native}</span>
                            {code === language && (
                                <i className="fa-solid fa-check text-[10px] text-[#c5a059] ml-auto"></i>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
