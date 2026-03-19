import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminLoginProps {
    onLogin: () => void;
}

const LOGIN_SLOGANS = [
    { title: "Yönetim", highlight: "Kontrol Merkezi", desc: "Operasyonel süreçlerinizi anlık takip edin, rezervasyonları yönetin ve işinizi büyütün." },
    { title: "Kusursuz", highlight: "Müşteri Deneyimi", desc: "Her transferi unutulmaz bir yolculuğa dönüştürmek için ihtiyacınız olan tüm araçlar burada." },
    { title: "Akıllı", highlight: "Filo Yönetimi", desc: "Araçlarınızın durumunu, konumunu ve performansını tek bir ekrandan zahmetsizce izleyin." },
    { title: "Global", highlight: "Turizm Vizyonu", desc: "Antalya'nın lider transfer markası olarak operasyonlarınızı dünya standartlarında yönetin." },
    { title: "Veriye Dayalı", highlight: "Büyüme Stratejisi", desc: "Rezervasyon istatistiklerini analiz edin, doğru kararlar alarak cironuzu artırın." },
    { title: "Profesyonel", highlight: "Transfer Çözümleri", desc: "Karmaşık operasyonları basitleştiren, verimliliği artıran modern yönetim arayüzü." },
    { title: "Lüks ve", highlight: "Konforun Adresi", desc: "VIP müşterilerinize sunduğunuz ayrıcalıklı hizmeti, yönetim panelinizde de hissedin." },
    { title: "Maksimum", highlight: "Verimlilik", desc: "Otomatik süreçler ve akıllı bildirimlerle iş yükünü azaltın, hedeflerinize odaklanın." }
];

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState<'email' | 'password' | null>(null);
    const [loginStage, setLoginStage] = useState<'idle' | 'authenticating' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const [sloganIndex, setSloganIndex] = useState(Math.floor(Math.random() * LOGIN_SLOGANS.length));
    const [particles] = useState(() =>
        Array.from({ length: 40 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 20 + 15,
            delay: Math.random() * 10,
            opacity: Math.random() * 0.3 + 0.1,
        }))
    );
    const emailRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => emailRef.current?.focus(), 600);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setSloganIndex(prev => (prev + 1) % LOGIN_SLOGANS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || !email || !password) return;

        setIsLoading(true);
        setLoginStage('authenticating');
        setErrorMessage('');

        if (isSupabaseConfigured) {
            // Real Supabase authentication
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
                onLogin();
            }, 800);
        } else {
            // Dev fallback: simple hardcoded check
            if (email === 'ataflugtransfer@gmail.com' && password === 'Trak1ng-16') {
                setLoginStage('success');
                setTimeout(() => {
                    setIsLoading(false);
                    onLogin();
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

    const activeSlogan = LOGIN_SLOGANS[sloganIndex];

    return (
        <div className="h-screen h-[100dvh] flex bg-[#020617] overflow-hidden">
            <style>{`
                @keyframes slideInText {
                    0% { opacity: 0; transform: translateY(24px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes successPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                    50% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
                }
                @keyframes errorShake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-6px); }
                    40%, 80% { transform: translateX(6px); }
                }
                @keyframes fadeUp {
                    0% { opacity: 0; transform: translateY(16px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes goldShimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes sloganFadeIn {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes scanBeam {
                    0% { top: -2px; opacity: 0; }
                    5% { opacity: 1; }
                    95% { opacity: 0.6; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes radarPulse {
                    0% { transform: scale(0.6); opacity: 0.7; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                @keyframes dataBlink {
                    0%, 100% { opacity: 0.15; }
                    50% { opacity: 0.6; }
                }
                @keyframes cornerGlow {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.9; }
                }
                .cyber-scan { animation: scanBeam 5s linear infinite; position: absolute; left: 0; right: 0; height: 1px; }
                .radar-ring { animation: radarPulse 3s ease-out infinite; position: absolute; border-radius: 50%; border: 1px solid rgba(197,160,89,0.5); }
                .data-node { animation: dataBlink 2s ease-in-out infinite; position: absolute; width: 3px; height: 3px; border-radius: 50%; background: #c5a059; }
                .corner-bracket { animation: cornerGlow 3s ease-in-out infinite; position: absolute; width: 20px; height: 20px; }

                /* ── NEW: enhanced cyber animations ── */
                @keyframes matrixDrop {
                    0%   { transform: translateY(-100%); opacity: 0; }
                    5%   { opacity: 1; }
                    90%  { opacity: 0.7; }
                    100% { transform: translateY(1800%); opacity: 0; }
                }
                @keyframes hudRotate {
                    0%   { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes hudRotateRev {
                    0%   { transform: rotate(0deg); }
                    100% { transform: rotate(-360deg); }
                }
                @keyframes scanlineScroll {
                    0%   { background-position: 0 0; }
                    100% { background-position: 0 100px; }
                }
                @keyframes dataPulse {
                    0%, 100% { opacity: 0.06; }
                    50%       { opacity: 0.18; }
                }
                @keyframes tickerScroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes sparkFly {
                    0%   { transform: translate(0,0) scale(1); opacity: 0.9; }
                    100% { transform: translate(var(--sx), var(--sy)) scale(0); opacity: 0; }
                }
                @keyframes nodeOrbit {
                    0%   { transform: rotate(0deg) translateX(var(--or)) rotate(0deg); }
                    100% { transform: rotate(360deg) translateX(var(--or)) rotate(-360deg); }
                }
                @keyframes beamSlide {
                    0%   { transform: translateX(-120%); }
                    100% { transform: translateX(220%); }
                }
                @keyframes hexFade {
                    0%, 100% { opacity: 0.04; transform: scale(1) rotate(0deg); }
                    50%       { opacity: 0.10; transform: scale(1.06) rotate(3deg); }
                }
                @keyframes altimeterScroll {
                    0%   { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                @keyframes blinkFast {
                    0%, 49% { opacity: 1; }
                    50%, 100% { opacity: 0; }
                }
                @keyframes waveBar {
                    0%, 100% { height: 4px; }
                    50%       { height: var(--bh); }
                }
                @keyframes reticlePing {
                    0%   { transform: scale(0.4); opacity: 0.9; }
                    100% { transform: scale(2.8); opacity: 0; }
                }
                @keyframes glitchShift {
                    0%, 92%, 100% { clip-path: none; transform: skewX(0deg); }
                    93%           { clip-path: polygon(0 18%, 100% 18%, 100% 22%, 0 22%); transform: skewX(-3deg) translateX(4px); opacity: 0.7; }
                    95%           { clip-path: polygon(0 60%, 100% 60%, 100% 66%, 0 66%); transform: skewX(2deg) translateX(-3px); opacity: 0.8; }
                    97%           { clip-path: none; transform: skewX(0deg); }
                }

                .matrix-col { position: absolute; top: 0; font-family: 'Courier New', monospace; font-size: 11px; line-height: 1.6; color: rgba(197,160,89,0.55); writing-mode: horizontal-tb; animation: matrixDrop linear infinite; will-change: transform; pointer-events: none; }
                .hud-ring-spin  { animation: hudRotate    linear infinite; transform-origin: center; }
                .hud-ring-rev   { animation: hudRotateRev linear infinite; transform-origin: center; }
                .beam-bar { position: absolute; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, transparent 0%, rgba(197,160,89,0.6) 40%, rgba(14,165,233,0.5) 60%, transparent 100%); animation: beamSlide linear infinite; }
                .hex-tile { position: absolute; animation: hexFade ease-in-out infinite; pointer-events: none; }
                .altimeter-strip { animation: altimeterScroll 6s linear infinite; }
                .ticker-inner { display: flex; animation: tickerScroll 28s linear infinite; white-space: nowrap; }
                .wave-bar { display: inline-block; background: #c5a059; border-radius: 2px; animation: waveBar ease-in-out infinite; }
            `}</style>

            {/* ── LEFT: Login Panel ── */}
            <div className="relative w-full lg:w-[460px] xl:w-[500px] shrink-0 flex flex-col justify-between px-8 sm:px-12 py-10 z-10 overflow-hidden">
                {/* Subtle background texture */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(197,160,89,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(197,160,89,0.04) 0%, transparent 50%)' }} />
                    <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    {/* Gold right border */}
                    <div className="hidden lg:block absolute right-0 top-[10%] bottom-[10%] w-px bg-gradient-to-b from-transparent via-[#c5a059]/20 to-transparent" />
                </div>

                {/* Top: Logo + Back link */}
                <div className="relative animate-in fade-in slide-in-from-bottom-3 duration-700">
                    {/* Back to home link */}
                    <div className="mb-6">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-[11px] font-semibold transition-colors duration-200"
                            style={{ color: 'rgba(197,160,89,0.5)', fontFamily: "'Outfit', sans-serif", letterSpacing: '0.04em' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(197,160,89,0.85)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(197,160,89,0.5)')}
                        >
                            <i className="fa-solid fa-arrow-left text-[9px]" />
                            Ana Sayfaya Dön
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#c5a059] to-amber-700 flex items-center justify-center shadow-lg shadow-[#c5a059]/20">
                            <img src="/logo.png" alt="Logo" className="h-7 w-auto object-contain brightness-0 invert" />
                        </div>
                        <div>
                            <p className="text-white font-black text-[13px] tracking-wide">ATA FLUG TRANSFER</p>
                            <p className="text-[#c5a059]/60 text-[10px] font-bold tracking-[0.2em] uppercase">Yönetim Paneli</p>
                        </div>
                    </div>
                </div>

                {/* Center: Form */}
                <div className="relative w-full max-w-[360px] mx-auto">
                    {loginStage === 'success' ? (
                        <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5" style={{ animation: 'successPulse 1.5s ease infinite' }}>
                                <i className="fa-solid fa-check text-emerald-400 text-3xl"></i>
                            </div>
                            <h3 className="text-white font-black text-xl mb-2 tracking-wide">Hoş Geldiniz</h3>
                            <p className="text-slate-500 text-sm">Panele yönlendiriliyorsunuz...</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8" style={{ animation: 'fadeUp 0.6s ease both' }}>
                                <h1 className="text-[28px] font-black text-white mb-2 tracking-tight">Güvenli Giriş</h1>
                                <p className="text-slate-500 text-[13px]">Yetkili personel erişimi</p>
                            </div>

                            {resetSent && (
                                <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 animate-in fade-in duration-300">
                                    <i className="fa-solid fa-envelope-circle-check text-emerald-400 shrink-0"></i>
                                    <p className="text-emerald-400 text-[12px]">Sıfırlama bağlantısı e-postanıza gönderildi.</p>
                                </div>
                            )}
                            {errorMessage && (
                                <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20 animate-in fade-in duration-300"
                                    style={loginStage === 'error' ? { animation: 'errorShake 0.5s ease-out' } : undefined}>
                                    <i className="fa-solid fa-circle-exclamation text-red-400 text-sm mt-0.5 shrink-0"></i>
                                    <p className="text-red-400 text-[12px] leading-relaxed">{errorMessage}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4" style={{ animation: 'fadeUp 0.6s ease 0.1s both' }}>
                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.15em]">E-posta</label>
                                    <div className={`relative rounded-xl border transition-all duration-200 ${isFocused === 'email' ? 'border-[#c5a059]/40 bg-[#c5a059]/[0.04] shadow-[0_0_20px_rgba(197,160,89,0.08)]' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12]'}`}>
                                        <i className={`fa-solid fa-at absolute left-4 top-1/2 -translate-y-1/2 text-xs transition-colors ${isFocused === 'email' ? 'text-[#c5a059]' : 'text-slate-700'}`}></i>
                                        <input ref={emailRef} type="email" value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            onFocus={() => setIsFocused('email')} onBlur={() => setIsFocused(null)}
                                            className="w-full bg-transparent pl-10 pr-4 py-3.5 text-[13px] text-white placeholder-slate-700 outline-none"
                                            placeholder="mail@örnek.com" autoComplete="email" required />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.15em]">Şifre</label>
                                        <button type="button" onClick={handleForgotPassword}
                                            className="text-[10px] text-[#c5a059]/50 hover:text-[#c5a059] font-bold transition-colors">
                                            Şifremi Unuttum?
                                        </button>
                                    </div>
                                    <div className={`relative rounded-xl border transition-all duration-200 ${isFocused === 'password' ? 'border-[#c5a059]/40 bg-[#c5a059]/[0.04] shadow-[0_0_20px_rgba(197,160,89,0.08)]' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12]'}`}>
                                        <i className={`fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-xs transition-colors ${isFocused === 'password' ? 'text-[#c5a059]' : 'text-slate-700'}`}></i>
                                        <input type={showPassword ? 'text' : 'password'} value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            onFocus={() => setIsFocused('password')} onBlur={() => setIsFocused(null)}
                                            className="w-full bg-transparent pl-10 pr-12 py-3.5 text-[13px] text-white placeholder-slate-700 outline-none"
                                            placeholder="••••••••••" autoComplete="current-password" required />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-slate-400 transition-colors">
                                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button type="submit" disabled={isLoading || !email || !password}
                                    className="group relative w-full h-[50px] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-2">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#c5a059] via-amber-500 to-[#c5a059] bg-[length:200%_100%] transition-all duration-500 group-hover:bg-[position:100%_0]" style={{ backgroundPosition: '0% 0%' }} />
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-amber-600 to-amber-500" />
                                    <div className="relative h-full flex items-center justify-center gap-2.5">
                                        {loginStage === 'authenticating' ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                                <span className="font-black text-white text-[13px] tracking-widest uppercase">Doğrulanıyor</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="font-black text-white text-[13px] tracking-widest uppercase">Giriş Yap</span>
                                                <i className="fa-solid fa-arrow-right text-white/70 text-xs transition-transform duration-300 group-hover:translate-x-1"></i>
                                            </>
                                        )}
                                    </div>
                                </button>
                            </form>
                        </>
                    )}
                </div>

                {/* Bottom */}
                <div className="relative flex items-center justify-between">
                    <p className="text-slate-800 text-[10px]">© {new Date().getFullYear()} Ata Flug Transfer</p>
                    {!isSupabaseConfigured && (
                        <span className="text-amber-600/60 text-[10px] flex items-center gap-1">
                            <i className="fa-solid fa-triangle-exclamation text-[8px]"></i> Dev modu
                        </span>
                    )}
                </div>
            </div>

            {/* ── RIGHT: Cyber Digital Panel ── */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden items-end justify-start">

                {/* ═══════════════════════════════════════════════
                    LAYER 0 — Base: deep space gradient
                ═══════════════════════════════════════════════ */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #020617 0%, #040d21 45%, #020a1a 100%)' }} />

                {/* ═══════════════════════════════════════════════
                    LAYER 1 — Fine dot grid (matrix cells)
                ═══════════════════════════════════════════════ */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(circle, rgba(197,160,89,0.18) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                    animation: 'dataPulse 8s ease-in-out infinite',
                }} />

                {/* ═══════════════════════════════════════════════
                    LAYER 2 — Coarse tactical grid
                ═══════════════════════════════════════════════ */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'linear-gradient(rgba(197,160,89,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.07) 1px, transparent 1px)',
                    backgroundSize: '160px 160px',
                }} />

                {/* ═══════════════════════════════════════════════
                    LAYER 3 — CRT scanlines
                ═══════════════════════════════════════════════ */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.28) 3px, rgba(0,0,0,0.28) 4px)',
                    animation: 'scanlineScroll 3s linear infinite',
                    zIndex: 2,
                }} />

                {/* ═══════════════════════════════════════════════
                    LAYER 4 — Atmospheric radial glows
                ═══════════════════════════════════════════════ */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 65% 60% at 58% 40%, rgba(197,160,89,0.10) 0%, transparent 72%)' }} />
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 40% 35% at 12% 80%, rgba(14,165,233,0.07) 0%, transparent 65%)' }} />
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 30% 25% at 88% 15%, rgba(197,160,89,0.06) 0%, transparent 60%)' }} />

                {/* ═══════════════════════════════════════════════
                    LAYER 5 — Matrix rain columns
                ═══════════════════════════════════════════════ */}
                {[
                    { left: '6%',  chars: '01↑↓ΔΠΣΩ', dur: '9s',  delay: '0s',   opacity: 0.28 },
                    { left: '14%', chars: 'TRK●◆▲▼', dur: '12s', delay: '2.1s', opacity: 0.18 },
                    { left: '23%', chars: '72A9F0EC', dur: '8s',  delay: '0.7s', opacity: 0.22 },
                    { left: '33%', chars: '0110SYS▪', dur: '14s', delay: '3.4s', opacity: 0.14 },
                    { left: '42%', chars: 'VIP★ATA■', dur: '10s', delay: '1.5s', opacity: 0.20 },
                    { left: '54%', chars: 'NET◉ΔSEC', dur: '11s', delay: '4.2s', opacity: 0.16 },
                    { left: '64%', chars: 'FF00C5A0', dur: '7s',  delay: '0.3s', opacity: 0.26 },
                    { left: '75%', chars: '↕⊕▶AUTH', dur: '13s', delay: '2.8s', opacity: 0.15 },
                    { left: '85%', chars: '24/7RUN●', dur: '9s',  delay: '1.1s', opacity: 0.22 },
                    { left: '93%', chars: 'OKΣ01NET', dur: '11s', delay: '5.0s', opacity: 0.17 },
                ].map((col, i) => (
                    <div key={i} className="matrix-col" style={{
                        left: col.left, opacity: col.opacity,
                        animationDuration: col.dur, animationDelay: col.delay,
                        letterSpacing: '0.05em', userSelect: 'none',
                    }}>
                        {col.chars.split('').map((ch, j) => (
                            <div key={j} style={{ opacity: j % 2 === 0 ? 1 : 0.5 }}>{ch}</div>
                        ))}
                    </div>
                ))}

                {/* ═══════════════════════════════════════════════
                    LAYER 6 — Horizontal sweep beams
                ═══════════════════════════════════════════════ */}
                <div className="beam-bar" style={{ animationDuration: '7s', animationDelay: '0s', left: 0 }} />
                <div className="beam-bar" style={{ animationDuration: '11s', animationDelay: '3.5s', left: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(14,165,233,0.45) 45%, rgba(197,160,89,0.3) 55%, transparent 100%)' }} />

                {/* ═══════════════════════════════════════════════
                    LAYER 7 — HUD Reticle / targeting ring (center-right)
                ═══════════════════════════════════════════════ */}
                <div style={{ position: 'absolute', top: '34%', left: '58%', width: 180, height: 180, transform: 'translate(-50%,-50%)' }}>
                    {/* Outer dashed ring spinning */}
                    <div className="hud-ring-spin" style={{
                        position: 'absolute', inset: 0, borderRadius: '50%',
                        border: '1px dashed rgba(197,160,89,0.25)',
                        animationDuration: '22s',
                    }} />
                    {/* Mid ring counter-spinning */}
                    <div className="hud-ring-rev" style={{
                        position: 'absolute', inset: '20px', borderRadius: '50%',
                        border: '1px solid rgba(197,160,89,0.18)',
                        animationDuration: '14s',
                        boxShadow: '0 0 12px rgba(197,160,89,0.08) inset',
                    }} />
                    {/* Inner solid ring */}
                    <div style={{
                        position: 'absolute', inset: '46px', borderRadius: '50%',
                        border: '1px solid rgba(197,160,89,0.35)',
                        boxShadow: '0 0 18px rgba(197,160,89,0.12)',
                    }} />
                    {/* Center crosshair dot */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                        width: 6, height: 6, borderRadius: '50%', background: '#c5a059',
                        boxShadow: '0 0 14px 4px rgba(197,160,89,0.5)',
                        animation: 'dataBlink 2s ease-in-out infinite',
                    }} />
                    {/* Crosshair lines */}
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(197,160,89,0.2) 30%, rgba(197,160,89,0.5) 50%, rgba(197,160,89,0.2) 70%, transparent 100%)' }} />
                    <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(180deg, transparent 0%, rgba(197,160,89,0.2) 30%, rgba(197,160,89,0.5) 50%, rgba(197,160,89,0.2) 70%, transparent 100%)' }} />
                    {/* Corner tick marks on outer ring */}
                    {[0, 90, 180, 270].map(deg => (
                        <div key={deg} style={{
                            position: 'absolute', top: '50%', left: '50%', width: 12, height: 2,
                            background: 'rgba(197,160,89,0.6)',
                            transformOrigin: '-78px 0',
                            transform: `rotate(${deg}deg) translateX(-78px) translateY(-50%)`,
                        }} />
                    ))}
                    {/* Radar pulse rings */}
                    {[0, 1.2, 2.4].map((delay, i) => (
                        <div key={i} className="radar-ring" style={{
                            width: 60, height: 60,
                            left: 'calc(50% - 30px)', top: 'calc(50% - 30px)',
                            animationDelay: `${delay}s`, animationDuration: '3.6s',
                            borderColor: 'rgba(197,160,89,0.4)',
                        }} />
                    ))}
                    {/* Reticle label */}
                    <div style={{
                        position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
                        fontFamily: "'Outfit', monospace", fontSize: 8, fontWeight: 700,
                        letterSpacing: '0.18em', color: 'rgba(197,160,89,0.4)',
                        animation: 'blinkFast 4s step-end infinite',
                    }}>LOCKED</div>
                </div>

                {/* ═══════════════════════════════════════════════
                    LAYER 8 — Hexagonal tile overlays
                ═══════════════════════════════════════════════ */}
                {[
                    { top: '8%',  left: '70%', size: 80,  delay: '0s',   dur: '7s'  },
                    { top: '18%', left: '20%', size: 56,  delay: '2.4s', dur: '9s'  },
                    { top: '62%', left: '78%', size: 68,  delay: '1.2s', dur: '11s' },
                    { top: '72%', left: '40%', size: 44,  delay: '3.6s', dur: '8s'  },
                ].map((h, i) => (
                    <div key={i} className="hex-tile" style={{
                        top: h.top, left: h.left, width: h.size, height: h.size,
                        animationDelay: h.delay, animationDuration: h.dur,
                        border: '1px solid rgba(197,160,89,0.12)',
                        clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
                        background: 'rgba(197,160,89,0.02)',
                    }} />
                ))}

                {/* ═══════════════════════════════════════════════
                    LAYER 9 — Orbiting data nodes
                ═══════════════════════════════════════════════ */}
                {[
                    { cx: '58%', cy: '34%', or: 100, dur: '18s', delay: '0s',   color: '#c5a059', size: 4 },
                    { cx: '58%', cy: '34%', or: 100, dur: '18s', delay: '6s',   color: '#0ea5e9', size: 3 },
                    { cx: '58%', cy: '34%', or: 100, dur: '18s', delay: '12s',  color: '#c5a059', size: 3 },
                ].map((n, i) => (
                    <div key={i} style={{
                        position: 'absolute', top: n.cy, left: n.cx,
                        width: n.size, height: n.size, marginLeft: -n.size/2, marginTop: -n.size/2,
                        borderRadius: '50%', background: n.color,
                        boxShadow: `0 0 8px 2px ${n.color}88`,
                        // @ts-ignore
                        '--or': `${n.or}px`,
                        animation: `nodeOrbit ${n.dur} linear ${n.delay} infinite`,
                    } as React.CSSProperties} />
                ))}

                {/* ═══════════════════════════════════════════════
                    LAYER 10 — Scatter data nodes
                ═══════════════════════════════════════════════ */}
                {[
                    { x: '7%',  y: '14%', d: '0s',   c: '#c5a059' },
                    { x: '18%', y: '8%',  d: '0.8s', c: '#0ea5e9' },
                    { x: '78%', y: '10%', d: '0.4s', c: '#c5a059' },
                    { x: '91%', y: '28%', d: '1.3s', c: '#c5a059' },
                    { x: '9%',  y: '48%', d: '0.6s', c: '#0ea5e9' },
                    { x: '88%', y: '55%', d: '2.0s', c: '#c5a059' },
                    { x: '27%', y: '76%', d: '1.7s', c: '#c5a059' },
                    { x: '68%', y: '80%', d: '0.2s', c: '#0ea5e9' },
                    { x: '82%', y: '87%', d: '1.1s', c: '#c5a059' },
                    { x: '44%', y: '92%', d: '2.5s', c: '#c5a059' },
                    { x: '35%', y: '22%', d: '3.0s', c: '#0ea5e9' },
                ].map((n, i) => (
                    <div key={i} className="data-node" style={{
                        left: n.x, top: n.y, animationDelay: n.d,
                        background: n.c,
                        boxShadow: `0 0 8px 2px ${n.c}99`,
                        width: i % 3 === 0 ? 4 : 3, height: i % 3 === 0 ? 4 : 3,
                    }} />
                ))}

                {/* ═══════════════════════════════════════════════
                    LAYER 11 — SVG network connection lines
                ═══════════════════════════════════════════════ */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
                    <line x1="7%"  y1="14%" x2="18%" y2="8%"  stroke="rgba(197,160,89,0.12)" strokeWidth="0.5" />
                    <line x1="18%" y1="8%"  x2="35%" y2="22%" stroke="rgba(197,160,89,0.10)" strokeWidth="0.5" />
                    <line x1="78%" y1="10%" x2="91%" y2="28%" stroke="rgba(197,160,89,0.10)" strokeWidth="0.5" />
                    <line x1="91%" y1="28%" x2="88%" y2="55%" stroke="rgba(197,160,89,0.08)" strokeWidth="0.5" />
                    <line x1="9%"  y1="48%" x2="27%" y2="76%" stroke="rgba(14,165,233,0.10)"  strokeWidth="0.5" />
                    <line x1="68%" y1="80%" x2="82%" y2="87%" stroke="rgba(197,160,89,0.10)" strokeWidth="0.5" />
                    <line x1="44%" y1="92%" x2="27%" y2="76%" stroke="rgba(197,160,89,0.08)" strokeWidth="0.5" />
                    <line x1="35%" y1="22%" x2="7%"  y2="14%" stroke="rgba(14,165,233,0.08)"  strokeWidth="0.5" />
                </svg>

                {/* ═══════════════════════════════════════════════
                    LAYER 12 — Altimeter/altitude tape (right side)
                ═══════════════════════════════════════════════ */}
                <div style={{
                    position: 'absolute', right: 28, top: '18%', bottom: '18%',
                    width: 38, overflow: 'hidden',
                    border: '1px solid rgba(197,160,89,0.12)',
                    background: 'rgba(2,6,23,0.6)',
                }}>
                    <div className="altimeter-strip" style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: 'rgba(197,160,89,0.4)', padding: '0 4px', lineHeight: '18px' }}>
                        {Array.from({ length: 30 }, (_, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i % 5 === 4 ? '1px solid rgba(197,160,89,0.15)' : 'none' }}>
                                <span style={{ opacity: i % 5 === 4 ? 0.8 : 0.3 }}>{i % 5 === 4 ? `${(30 - i) * 100}` : '·'}</span>
                                <span style={{ opacity: 0.2 }}>|</span>
                            </div>
                        ))}
                        {Array.from({ length: 30 }, (_, i) => (
                            <div key={`r${i}`} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i % 5 === 4 ? '1px solid rgba(197,160,89,0.15)' : 'none' }}>
                                <span style={{ opacity: i % 5 === 4 ? 0.8 : 0.3 }}>{i % 5 === 4 ? `${(30 - i) * 100}` : '·'}</span>
                                <span style={{ opacity: 0.2 }}>|</span>
                            </div>
                        ))}
                    </div>
                    {/* Current value marker */}
                    <div style={{
                        position: 'absolute', top: '50%', left: 0, right: 0, height: 14,
                        marginTop: -7, background: 'rgba(197,160,89,0.15)',
                        borderTop: '1px solid rgba(197,160,89,0.6)', borderBottom: '1px solid rgba(197,160,89,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Courier New', monospace", fontSize: 8, fontWeight: 700,
                        color: '#c5a059',
                    }}>ALT</div>
                </div>

                {/* ═══════════════════════════════════════════════
                    LAYER 13 — Wave audio visualizer bar (horizontal)
                ═══════════════════════════════════════════════ */}
                <div style={{
                    position: 'absolute', top: '50%', left: '4%', display: 'flex',
                    alignItems: 'center', gap: 2, height: 28, marginTop: -14,
                }}>
                    {Array.from({ length: 22 }, (_, i) => {
                        const bh = [6, 10, 16, 22, 18, 12, 8, 20, 24, 14, 10, 18, 22, 16, 8, 12, 20, 14, 6, 18, 10, 16][i];
                        return (
                            <div key={i} className="wave-bar" style={{
                                width: 2,
                                // @ts-ignore
                                '--bh': `${bh}px`,
                                animationDuration: `${0.6 + (i % 5) * 0.18}s`,
                                animationDelay: `${(i * 0.07) % 0.8}s`,
                                opacity: 0.35 + (i % 3) * 0.08,
                                background: i % 4 === 0 ? '#0ea5e9' : '#c5a059',
                            } as React.CSSProperties} />
                        );
                    })}
                </div>

                {/* ═══════════════════════════════════════════════
                    LAYER 14 — Horizontal scan beams (legacy, kept)
                ═══════════════════════════════════════════════ */}
                <div className="cyber-scan" style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(197,160,89,0.0) 15%, rgba(197,160,89,0.45) 50%, rgba(197,160,89,0.0) 85%, transparent 100%)',
                    animationDelay: '0s', animationDuration: '6s',
                }} />
                <div className="cyber-scan" style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(14,165,233,0.0) 15%, rgba(14,165,233,0.25) 50%, rgba(14,165,233,0.0) 85%, transparent 100%)',
                    animationDelay: '3s', animationDuration: '6s',
                }} />

                {/* ═══════════════════════════════════════════════
                    LAYER 15 — Corner brackets (enhanced)
                ═══════════════════════════════════════════════ */}
                <div className="corner-bracket" style={{ top: 20, left: 20, width: 28, height: 28, borderTop: '2px solid rgba(197,160,89,0.7)', borderLeft: '2px solid rgba(197,160,89,0.7)' }} />
                <div className="corner-bracket" style={{ top: 20, right: 20, width: 28, height: 28, borderTop: '2px solid rgba(197,160,89,0.7)', borderRight: '2px solid rgba(197,160,89,0.7)', animationDelay: '0.75s' }} />
                <div className="corner-bracket" style={{ bottom: 20, left: 20, width: 28, height: 28, borderBottom: '2px solid rgba(197,160,89,0.7)', borderLeft: '2px solid rgba(197,160,89,0.7)', animationDelay: '1.5s' }} />
                <div className="corner-bracket" style={{ bottom: 20, right: 20, width: 28, height: 28, borderBottom: '2px solid rgba(197,160,89,0.7)', borderRight: '2px solid rgba(197,160,89,0.7)', animationDelay: '2.25s' }} />
                {/* Inner corner accents */}
                <div style={{ position: 'absolute', top: 52, left: 52, width: 14, height: 14, borderTop: '1px solid rgba(197,160,89,0.3)', borderLeft: '1px solid rgba(197,160,89,0.3)' }} />
                <div style={{ position: 'absolute', top: 52, right: 52, width: 14, height: 14, borderTop: '1px solid rgba(197,160,89,0.3)', borderRight: '1px solid rgba(197,160,89,0.3)' }} />
                <div style={{ position: 'absolute', bottom: 52, left: 52, width: 14, height: 14, borderBottom: '1px solid rgba(197,160,89,0.3)', borderLeft: '1px solid rgba(197,160,89,0.3)' }} />
                <div style={{ position: 'absolute', bottom: 52, right: 52, width: 14, height: 14, borderBottom: '1px solid rgba(197,160,89,0.3)', borderRight: '1px solid rgba(197,160,89,0.3)' }} />

                {/* ═══════════════════════════════════════════════
                    LAYER 16 — System status HUD bar (top)
                ═══════════════════════════════════════════════ */}
                <div style={{
                    position: 'absolute', top: 28, left: 60, right: 72,
                    display: 'flex', alignItems: 'center', gap: 14,
                    animation: 'fadeUp 0.8s ease 0.7s both', zIndex: 5,
                }}>
                    {[
                        { label: 'SYS', val: 'NOMINAL', delay: 0 },
                        { label: 'SEC', val: '256-ENC', delay: 0.4 },
                        { label: 'NET', val: 'ONLINE',  delay: 0.8 },
                        { label: 'DB',  val: 'SYNC',    delay: 1.2 },
                    ].map((s) => (
                        <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{
                                width: 5, height: 5, borderRadius: '50%', background: '#c5a059',
                                boxShadow: '0 0 8px #c5a059',
                                animation: `dataBlink ${1.6 + s.delay}s ease-in-out infinite`,
                            }} />
                            <span style={{ fontFamily: "'Outfit', monospace", fontSize: 8, fontWeight: 700, letterSpacing: '0.16em', color: 'rgba(197,160,89,0.4)' }}>
                                {s.label} <span style={{ color: 'rgba(197,160,89,0.65)' }}>{s.val}</span>
                            </span>
                        </div>
                    ))}
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(197,160,89,0.15), transparent)' }} />
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 8, color: 'rgba(197,160,89,0.28)', letterSpacing: '0.08em' }}>
                        <span style={{ animation: 'blinkFast 1s step-end infinite' }}>▮</span> SECURE SESSION v3.1.0
                    </span>
                </div>

                {/* ═══════════════════════════════════════════════
                    LAYER 17 — Data stream ticker (bottom ticker tape)
                ═══════════════════════════════════════════════ */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 26, overflow: 'hidden',
                    borderTop: '1px solid rgba(197,160,89,0.12)',
                    background: 'rgba(2,6,23,0.7)',
                    zIndex: 6,
                }}>
                    <div className="ticker-inner" style={{ fontFamily: "'Courier New', monospace", fontSize: 9, color: 'rgba(197,160,89,0.45)', lineHeight: '26px', paddingLeft: 8 }}>
                        {/* Doubled for seamless loop */}
                        {[...Array(2)].map((_, outer) => (
                            <span key={outer}>
                                {[
                                    'ATA FLUG TRANSFER', '◆', 'ANTALYA HUB', '●', 'SECURE AUTH GATEWAY',
                                    '◆', 'VIP TRANSFER OPS', '●', 'FLEET MGMT ONLINE', '◆', 'BOOKING ENGINE ACTIVE',
                                    '●', 'WEATHER: CLR', '◆', 'ACTIVE VEHICLES: 12', '●', 'SESSIONS: PROTECTED',
                                    '◆', 'UPTIME: 99.9%', '●', 'LAT: 36.8969° N', '◆', 'LNG: 30.7133° E',
                                    '●', 'AYT AIRPORT: LIVE', '◆', 'ENCRYPTION: AES-256',
                                ].map((token, i) => (
                                    <span key={i} style={{
                                        marginRight: 18,
                                        color: token === '◆' ? 'rgba(14,165,233,0.5)' : token === '●' ? 'rgba(197,160,89,0.3)' : 'rgba(197,160,89,0.5)',
                                        fontSize: (token === '◆' || token === '●') ? 7 : 9,
                                    }}>{token}</span>
                                ))}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════
                    LAYER 18 — Horizontal data marker lines
                ═══════════════════════════════════════════════ */}
                {[
                    { top: '20%', g: 0.08, label: 'ALT 3200' },
                    { top: '38%', g: 0.12, label: '' },
                    { top: '55%', g: 0.10, label: 'WAYPOINT' },
                    { top: '72%', g: 0.07, label: '' },
                ].map((ln, i) => (
                    <div key={i} style={{ position: 'absolute', left: 0, right: 44, top: ln.top, height: 1, zIndex: 1 }}>
                        <div style={{ height: '100%', background: `linear-gradient(90deg, transparent 0%, rgba(197,160,89,${ln.g}) 20%, rgba(197,160,89,${ln.g * 1.6}) 60%, transparent 100%)` }} />
                        {ln.label && (
                            <span style={{
                                position: 'absolute', right: 0, top: -8,
                                fontFamily: "'Courier New', monospace", fontSize: 7,
                                color: 'rgba(197,160,89,0.25)', letterSpacing: '0.12em',
                            }}>{ln.label}</span>
                        )}
                    </div>
                ))}

                {/* ═══════════════════════════════════════════════
                    LAYER 19 — Gold top edge accent
                ═══════════════════════════════════════════════ */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 10,
                    background: 'linear-gradient(90deg, rgba(197,160,89,0.8) 0%, rgba(197,160,89,0.4) 55%, rgba(14,165,233,0.3) 80%, transparent 100%)',
                }} />

                {/* ═══════════════════════════════════════════════
                    FOREGROUND CONTENT — overlaid on all animation layers
                ═══════════════════════════════════════════════ */}

                {/* Content pinned to bottom-left */}
                <div className="relative px-12 xl:px-16 pb-10 max-w-xl" style={{ zIndex: 20, paddingBottom: 48 }}>

                    {/* Badge */}
                    <div className="mb-5" style={{ animation: 'fadeUp 0.8s ease 0.3s both' }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '6px 14px', borderRadius: 999,
                            border: '1px solid rgba(197,160,89,0.28)',
                            background: 'rgba(197,160,89,0.07)',
                            fontFamily: "'Outfit', sans-serif", fontSize: 9, fontWeight: 800,
                            letterSpacing: '0.22em', color: 'rgba(197,160,89,0.8)',
                            textTransform: 'uppercase',
                            backdropFilter: 'blur(4px)',
                        }}>
                            <span style={{
                                width: 6, height: 6, borderRadius: '50%', background: '#c5a059',
                                boxShadow: '0 0 8px #c5a059',
                                animation: 'dataBlink 1.8s ease-in-out infinite',
                            }} />
                            Yönetim Merkezi
                            <span style={{ width: 1, height: 10, background: 'rgba(197,160,89,0.3)' }} />
                            <span style={{ fontSize: 8, opacity: 0.6 }}>SECURED</span>
                        </span>
                    </div>

                    {/* Headline */}
                    <h2 style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 'clamp(2rem, 3.2vw, 2.8rem)',
                        fontWeight: 900,
                        color: '#fff',
                        lineHeight: 1.08,
                        marginBottom: 16,
                        letterSpacing: '-0.02em',
                        animation: 'fadeUp 0.8s ease 0.4s both',
                        textShadow: '0 2px 24px rgba(197,160,89,0.18)',
                    }}>
                        Kusursuz Hizmet,
                        <br />
                        <span style={{
                            background: 'linear-gradient(90deg, #e8d595, #c5a059, #d4b06a, #e0cb8b, #c5a059)',
                            backgroundSize: '300% 100%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            animation: 'goldShimmer 4s linear infinite',
                        }}>
                            Akıllı Yönetim
                        </span>
                    </h2>

                    {/* Rotating slogan quote */}
                    <div style={{ marginBottom: 28, minHeight: 52, animation: 'fadeUp 0.8s ease 0.5s both' }}>
                        {/* Glitch wrapper */}
                        <p key={sloganIndex} style={{
                            fontSize: 12, lineHeight: 1.65,
                            color: 'rgba(255,255,255,0.36)',
                            fontFamily: "'Montserrat', sans-serif",
                            animation: 'sloganFadeIn 0.6s ease both, glitchShift 9s ease-in-out infinite',
                            borderLeft: '2px solid rgba(197,160,89,0.25)',
                            paddingLeft: 12,
                        }}>
                            "{activeSlogan.desc}"
                        </p>
                    </div>

                    {/* Stats row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, animation: 'fadeUp 0.8s ease 0.6s both' }}>
                        {[
                            { value: '7/24',   label: 'Erişim'     },
                            { value: '256-bit', label: 'Şifreleme' },
                            { value: '99.9%',  label: 'Uptime'     },
                        ].map((stat, i) => (
                            <React.Fragment key={stat.label}>
                                <div>
                                    <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 16, color: '#c5a059', lineHeight: 1, textShadow: '0 0 12px rgba(197,160,89,0.4)' }}>{stat.value}</p>
                                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>{stat.label}</p>
                                </div>
                                {i < 2 && <div style={{ width: 1, height: 24, background: 'linear-gradient(180deg, transparent, rgba(197,160,89,0.22), transparent)' }} />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Business name — top right watermark */}
                <div style={{
                    position: 'absolute', top: 52, right: 60, textAlign: 'right',
                    animation: 'fadeUp 0.8s ease 0.7s both', zIndex: 20,
                }}>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(197,160,89,0.45)' }}>ATA FLUG TRANSFER</p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.14)', marginTop: 3 }}>VIP Airport Transfer · Antalya</p>
                    <div style={{ marginTop: 6, display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                        {['AYT', 'IST', 'DLM'].map(code => (
                            <span key={code} style={{
                                fontFamily: "'Courier New', monospace", fontSize: 7, fontWeight: 700,
                                color: 'rgba(14,165,233,0.5)', letterSpacing: '0.1em',
                                padding: '1px 4px', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 2,
                            }}>{code}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
