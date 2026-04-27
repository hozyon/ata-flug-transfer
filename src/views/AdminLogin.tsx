'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../utils/supabase/client';
import { isSupabaseConfigured } from '../lib/supabase';

interface AdminLoginProps {
    onLogin?: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState<'email' | 'password' | null>(null);
    const [loginStage, setLoginStage] = useState<'idle' | 'authenticating' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const emailRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleLoginSuccess = () => {
        if (onLogin) onLogin();
        else router.push(`/admin`);
    };

    useEffect(() => {
        setTimeout(() => emailRef.current?.focus(), 800);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || !email || !password) return;

        setIsLoading(true);
        setLoginStage('authenticating');
        setErrorMessage('');

        if (isSupabaseConfigured) {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                setLoginStage('error');
                setIsLoading(false);
                setErrorMessage(error.message.includes('Invalid login credentials') 
                    ? 'E-posta veya şifre hatalı. Lütfen kontrol ediniz.' 
                    : error.message);
                setTimeout(() => setLoginStage('idle'), 3000);
                return;
            }

            setLoginStage('success');
            setTimeout(() => { setIsLoading(false); handleLoginSuccess(); }, 1200);
        } else {
            if (email === 'admin@yönetim.com' && password === 'admin123') {
                setLoginStage('success');
                setTimeout(() => { setIsLoading(false); handleLoginSuccess(); }, 1200);
            } else {
                setLoginStage('error');
                setIsLoading(false);
                setErrorMessage('E-posta veya şifre hatalı.');
                setTimeout(() => setLoginStage('idle'), 3000);
            }
        }
    };

    const handleForgotPassword = async () => {
        if (!email) { setErrorMessage('Önce e-posta adresinizi girin.'); return; }
        if (!isSupabaseConfigured) { setErrorMessage('Supabase yapılandırması gerekli.'); return; }
        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` });
        if (error) setErrorMessage(error.message);
        else { setResetSent(true); setErrorMessage(''); }
    };

    return (
        <div className="h-screen h-[100dvh] flex items-center justify-center bg-[#FDFDFF] overflow-hidden font-outfit text-slate-900 selection:bg-gold/30 selection:text-slate-900 relative">
            <style>{`
                @keyframes blobRotate {
                    0% { transform: rotate(0deg) translate(0, 0) scale(1); }
                    33% { transform: rotate(120deg) translate(40px, -60px) scale(1.1); }
                    66% { transform: rotate(240deg) translate(-30px, 40px) scale(0.9); }
                    100% { transform: rotate(360deg) translate(0, 0) scale(1); }
                }
                @keyframes glassIn {
                    0% { opacity: 0; transform: scale(0.95) translateY(30px); filter: blur(10px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
                }
                @keyframes successZoom {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                .ethereal-blur { backdrop-filter: blur(40px) saturate(180%); }
                .glass-border { border: 1px solid rgba(255, 255, 255, 0.7); }
            `}</style>

            {/* ── 2026 SPATIAL BACKGROUND ── */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-200/20 blur-[140px] transform-gpu" style={{ animation: 'blobRotate 25s infinite linear' }}></div>
                <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-200/20 blur-[130px] transform-gpu" style={{ animation: 'blobRotate 20s infinite linear reverse' }}></div>
                <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-rose-200/10 blur-[100px] transform-gpu" style={{ animation: 'blobRotate 18s infinite ease-in-out' }}></div>
                
                {/* Subtle Grain Texture */}
                <div className="absolute inset-0 opacity-[0.02] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6.png")' }}></div>
            </div>

            {/* ── FLOATING GLASS PANEL ── */}
            <div 
                className="relative z-10 w-full max-w-[480px] px-6 sm:px-0 animate-in duration-1000 ease-[cubic-bezier(0.2,1,0.3,1)]"
                style={{ animation: 'glassIn 1.2s both' }}
            >
                <div className="bg-white/40 ethereal-blur glass-border rounded-[4rem] p-10 sm:p-14 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.5)] relative overflow-hidden group">
                    
                    {/* Top Brand Area */}
                    <div className="flex flex-col items-center text-center mb-12">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-white shadow-[0_15px_35px_rgba(0,0,0,0.03)] flex items-center justify-center mb-6 border border-white group-hover:scale-105 transition-transform duration-700">
                            <i className="fa-solid fa-crown text-3xl text-gold drop-shadow-sm"></i>
                        </div>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Ata Flug Transfer</h2>
                        <h1 className="text-4xl font-black text-slate-900 tracking-[-0.05em] leading-tight">Yönetim Paneli</h1>
                    </div>

                    {loginStage === 'success' ? (
                        <div className="text-center py-10 animate-in fade-in zoom-in duration-700">
                            <div className="w-24 h-24 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(16,185,129,0.1)]" style={{ animation: 'successZoom 2s ease infinite' }}>
                                <i className="fa-solid fa-check text-emerald-500 text-4xl"></i>
                            </div>
                            <p className="text-slate-900 font-black text-2xl tracking-tighter">Oturum Açıldı</p>
                            <p className="text-slate-500 font-medium mt-2">Hazırlanıyor...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-7">
                            {errorMessage && (
                                <div className="p-4 rounded-3xl bg-rose-50/80 border border-rose-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <i className="fa-solid fa-circle-exclamation text-rose-500 text-sm"></i>
                                    <p className="text-rose-700 text-xs font-bold leading-tight">{errorMessage}</p>
                                </div>
                            )}
                            {resetSent && (
                                <div className="p-4 rounded-3xl bg-emerald-50/80 border border-emerald-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <i className="fa-solid fa-envelope-circle-check text-emerald-500 text-sm"></i>
                                    <p className="text-emerald-700 text-xs font-bold leading-tight">Sıfırlama e-postası gönderildi.</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Email Field */}
                                <div className="relative group">
                                    <input 
                                        ref={emailRef}
                                        type="email" 
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        onFocus={() => setIsFocused('email')}
                                        onBlur={() => setIsFocused(null)}
                                        required
                                        className={`w-full bg-white/60 border rounded-[2rem] px-8 py-5 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none transition-all duration-500 ${isFocused === 'email' ? 'border-gold/40 shadow-[0_10px_30px_rgba(197,160,89,0.08)] bg-white' : 'border-white group-hover:border-slate-200'}`}
                                        placeholder="E-posta adresiniz"
                                    />
                                    <i className={`fa-solid fa-at absolute right-8 top-1/2 -translate-y-1/2 text-xs transition-colors duration-500 ${isFocused === 'email' ? 'text-gold' : 'text-slate-300'}`}></i>
                                </div>

                                {/* Password Field */}
                                <div className="relative group">
                                    <input 
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        onFocus={() => setIsFocused('password')}
                                        onBlur={() => setIsFocused(null)}
                                        required
                                        className={`w-full bg-white/60 border rounded-[2rem] px-8 py-5 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none transition-all duration-500 ${isFocused === 'password' ? 'border-gold/40 shadow-[0_10px_30px_rgba(197,160,89,0.08)] bg-white' : 'border-white group-hover:border-slate-200'}`}
                                        placeholder="Şifreniz"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-8 top-1/2 -translate-y-1/2 transition-all duration-300 active:scale-90"
                                    >
                                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs ${isFocused === 'password' ? 'text-gold' : 'text-slate-300 hover:text-slate-500'}`}></i>
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end px-2">
                                <button 
                                    type="button" 
                                    onClick={handleForgotPassword}
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-gold transition-colors"
                                >
                                    Şifremi Unuttum
                                </button>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading || !email || !password}
                                className="w-full py-5 rounded-[2rem] bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] hover:bg-black hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    {loginStage === 'authenticating' ? (
                                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                                    ) : (
                                        <>
                                            <span>Sisteme Eriş</span>
                                            <i className="fa-solid fa-arrow-right-long text-gold group-hover/btn:translate-x-1.5 transition-transform"></i>
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>
                    )}

                    {/* Bottom Links */}
                    <div className="mt-12 pt-10 border-t border-white/50 flex items-center justify-between">
                        <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
                            <i className="fa-solid fa-globe"></i> Ana Site
                        </Link>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">© {new Date().getFullYear()}</p>
                    </div>
                </div>
            </div>

            {/* Spatial Decorative Elements */}
            <div className="absolute top-20 right-20 w-32 h-32 rounded-[2.5rem] bg-white ethereal-blur shadow-2xl z-0 hidden xl:flex items-center justify-center rotate-12 opacity-40">
                <i className="fa-solid fa-shield-halved text-4xl text-slate-100"></i>
            </div>
            <div className="absolute bottom-20 left-20 w-24 h-24 rounded-[2rem] bg-white ethereal-blur shadow-2xl z-0 hidden xl:flex items-center justify-center -rotate-12 opacity-40">
                <i className="fa-solid fa-fingerprint text-3xl text-slate-100"></i>
            </div>
        </div>
    );
};

export default AdminLogin;
