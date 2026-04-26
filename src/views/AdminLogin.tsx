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
        if (onLogin) {
            onLogin();
        } else {
            router.push(`/admin`);
        }
    };

    useEffect(() => {
        setTimeout(() => emailRef.current?.focus(), 600);
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
                if (error.message.includes('Invalid login credentials')) {
                    setErrorMessage('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
                } else if (error.message.includes('Email not confirmed')) {
                    setErrorMessage('E-posta adresiniz henüz doğrulanmamış.');
                } else {
                    setErrorMessage(error.message);
                }
                setTimeout(() => setLoginStage('idle'), 2000);
                return;
            }

            setLoginStage('success');
            setTimeout(() => {
                setIsLoading(false);
                handleLoginSuccess();
            }, 800);
        } else {
            if (email === 'admin@yönetim.com' && password === 'admin123') {
                setLoginStage('success');
                setTimeout(() => {
                    setIsLoading(false);
                    handleLoginSuccess();
                }, 800);
            } else {
                setLoginStage('error');
                setIsLoading(false);
                setErrorMessage('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
                setTimeout(() => setLoginStage('idle'), 2000);
            }
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setErrorMessage('Şifre sıfırlama için önce e-posta adresinizi girin.');
            return;
        }
        if (!isSupabaseConfigured) {
            setErrorMessage('Bu özellik için Supabase yapılandırması gereklidir.');
            return;
        }
        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/login`,
        });
        if (error) {
            setErrorMessage(error.message);
        } else {
            setResetSent(true);
            setErrorMessage('');
        }
    };

    return (
        <div className="h-screen h-[100dvh] flex bg-slate-50 overflow-hidden font-outfit text-slate-900 selection:bg-[var(--color-primary)] selection:text-white">
            <style>{`
                @keyframes fadeUp {
                    0% { opacity: 0; transform: translateY(16px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes blobMove1 {
                    0%   { transform: translate(0px, 0px) scale(1); }
                    33%  { transform: translate(30px, -50px) scale(1.1); }
                    66%  { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes blobMove2 {
                    0%   { transform: translate(0px, 0px) scale(1); }
                    33%  { transform: translate(-30px, 50px) scale(1.1); }
                    66%  { transform: translate(20px, -20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes successPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.2); }
                    50% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
                }
                @keyframes errorShake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-6px); }
                    40%, 80% { transform: translateX(6px); }
                }
            `}</style>

            {/* ── LEFT: Login Panel ── */}
            <div className="relative w-full lg:w-[480px] xl:w-[540px] shrink-0 flex flex-col justify-between px-8 sm:px-16 py-12 z-10 bg-white shadow-[20px_0_60px_-20px_rgba(0,0,0,0.05)] border-r border-slate-100 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] rounded-full bg-[var(--color-primary)] opacity-[0.03] blur-[100px] transform-gpu"></div>
                </div>

                <div className="relative animate-in fade-in slide-in-from-bottom-3 duration-700">
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors duration-300"
                        >
                            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                            Siteye Dön
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-amber-100">
                            <i className="fa-solid fa-crown text-white text-xl"></i>
                        </div>
                        <div>
                            <p className="text-slate-900 font-black text-[16px] tracking-tight leading-none">ELITE MANAGEMENT</p>
                            <p className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase mt-1">Kontrol Paneli</p>
                        </div>
                    </div>
                </div>

                <div className="relative w-full max-w-[360px] mx-auto my-auto">
                    {loginStage === 'success' ? (
                        <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 mx-auto rounded-[2rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6" style={{ animation: 'successPulse 1.5s ease infinite' }}>
                                <i className="fa-solid fa-check text-emerald-500 text-3xl" aria-hidden="true"></i>
                            </div>
                            <h3 className="text-slate-900 font-black text-2xl mb-2 tracking-tight">Hoş Geldiniz</h3>
                            <p className="text-slate-500 font-medium">Güvenli alana yönlendiriliyorsunuz...</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-10" style={{ animation: 'fadeUp 0.6s ease both' }}>
                                <h1 className="text-[32px] font-black text-slate-900 mb-3 tracking-tight leading-none">Güvenli Giriş</h1>
                                <p className="text-slate-500 font-medium leading-relaxed">Sistem yönetimi için yetkili erişim bilgilerini giriniz.</p>
                            </div>

                            {resetSent && (
                                <div className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 animate-in fade-in duration-300 shadow-sm">
                                    <i className="fa-solid fa-envelope-circle-check text-emerald-500 shrink-0 text-lg" aria-hidden="true"></i>
                                    <p className="text-emerald-700 text-[13px] font-bold">Sıfırlama bağlantısı e-postanıza gönderildi.</p>
                                </div>
                            )}
                            {errorMessage && (
                                <div className="mb-6 flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-rose-50 border border-rose-100 animate-in fade-in duration-300 shadow-sm"
                                    style={loginStage === 'error' ? { animation: 'errorShake 0.5s ease-out' } : undefined}>
                                    <i className="fa-solid fa-circle-exclamation text-rose-500 mt-0.5 shrink-0 text-base" aria-hidden="true"></i>
                                    <p className="text-rose-700 text-[13px] font-bold leading-relaxed">{errorMessage}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6" style={{ animation: 'fadeUp 0.6s ease 0.1s both' }}>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-posta Adresi</label>
                                    <div className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${isFocused === 'email' ? 'border-[var(--color-primary)]/40 bg-white shadow-[0_4px_20px_rgba(197,160,89,0.08)]' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}>
                                        <i className={`fa-solid fa-at absolute left-5 top-1/2 -translate-y-1/2 text-sm transition-colors ${isFocused === 'email' ? 'text-[var(--color-primary)]' : 'text-slate-400'}`}></i>
                                        <input ref={emailRef} type="email" value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            onFocus={() => setIsFocused('email')} onBlur={() => setIsFocused(null)}
                                            className="w-full bg-transparent pl-12 pr-5 py-4 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none"
                                            placeholder="admin@ataflug.com" autoComplete="email" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1 pr-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Şifre</label>
                                        <button type="button" onClick={handleForgotPassword}
                                            className="text-[10px] text-slate-400 hover:text-slate-900 font-bold transition-colors uppercase tracking-wider">
                                            Şifremi Unuttum
                                        </button>
                                    </div>
                                    <div className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${isFocused === 'password' ? 'border-[var(--color-primary)]/40 bg-white shadow-[0_4px_20px_rgba(197,160,89,0.08)]' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}>
                                        <i className={`fa-solid fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-sm transition-colors ${isFocused === 'password' ? 'text-[var(--color-primary)]' : 'text-slate-400'}`}></i>
                                        <input type={showPassword ? 'text' : 'password'} value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            onFocus={() => setIsFocused('password')} onBlur={() => setIsFocused(null)}
                                            className="w-full bg-transparent pl-12 pr-12 py-4 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none"
                                            placeholder="••••••••••" autoComplete="current-password" required />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">
                                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" disabled={isLoading || !email || !password}
                                    className="relative w-full py-4 rounded-2xl overflow-hidden transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 hover:bg-black shadow-xl shadow-slate-200 mt-4 group">
                                    <div className="relative flex items-center justify-center gap-3">
                                        {loginStage === 'authenticating' ? (
                                            <>
                                                <i className="fa-solid fa-circle-notch fa-spin text-white"></i>
                                                <span className="font-black text-white text-[11px] tracking-[0.2em] uppercase">Doğrulanıyor</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="font-black text-white text-[11px] tracking-[0.2em] uppercase">Sisteme Giriş Yap</span>
                                                <i className="fa-solid fa-arrow-right text-white/50 text-xs transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"></i>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <div className="relative flex items-center justify-between mt-auto pt-8">
                    <p className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">© {new Date().getFullYear()} ATA FLUG TRANSFER</p>
                    {!isSupabaseConfigured && (
                        <span className="px-2 py-1 rounded-md bg-amber-50 border border-amber-100 text-amber-600 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                            <i className="fa-solid fa-flask text-[10px]" aria-hidden="true"></i> LOKAL MOD
                        </span>
                    )}
                </div>
            </div>

            {/* ── RIGHT: Animated Visual Panel ── */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center bg-white">
                {/* Soft Abstract Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute w-[800px] h-[800px] rounded-full blur-[100px]"
                        style={{ background: 'var(--color-primary)', opacity: 0.05, top: '-20%', right: '-10%', animation: 'blobMove1 20s ease-in-out infinite alternate' }} />
                    <div className="absolute w-[600px] h-[600px] rounded-full blur-[80px]"
                        style={{ background: '#3b82f6', opacity: 0.03, bottom: '-10%', left: '10%', animation: 'blobMove2 15s ease-in-out infinite alternate' }} />
                    
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                </div>

                <div className="relative z-10 px-16 max-w-2xl text-center">
                    <div className="w-24 h-24 mx-auto bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center shadow-sm mb-10" style={{ animation: 'fadeUp 0.8s ease 0.2s both' }}>
                        <i className="fa-solid fa-chart-line text-[var(--color-primary)] text-4xl opacity-80"></i>
                    </div>

                    <h2 className="text-4xl xl:text-5xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tighter"
                        style={{ animation: 'fadeUp 0.8s ease 0.3s both' }}>
                        Modern, Hızlı ve <br/>
                        <span className="text-[var(--color-primary)]">
                            Güvenilir Yönetim
                        </span>
                    </h2>
                    
                    <p className="text-slate-500 font-medium text-[15px] leading-relaxed mb-12 max-w-lg mx-auto"
                        style={{ animation: 'fadeUp 0.8s ease 0.4s both' }}>
                        Rezervasyonlarınızı, filonuzu ve tüm dijital varlıklarınızı kusursuz bir deneyimle tek ekrandan kontrol edin.
                    </p>

                    <div className="flex items-center justify-center gap-8" style={{ animation: 'fadeUp 0.8s ease 0.5s both' }}>
                        {[
                            { icon: 'fa-bolt', label: 'Yüksek Performans' },
                            { icon: 'fa-shield-halved', label: 'Güvenli Altyapı' },
                            { icon: 'fa-mobile-screen', label: 'Mobil Uyumlu' },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                                    <i className={`fa-solid ${stat.icon} text-lg`}></i>
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
