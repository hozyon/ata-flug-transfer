import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
                @keyframes goldShimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes fadeUp {
                    0% { opacity: 0; transform: translateY(16px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
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

                {/* Top: Logo */}
                <div className="relative animate-in fade-in slide-in-from-bottom-3 duration-700">
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

            {/* ── RIGHT: Visual Panel ── */}
            <div className="hidden lg:block flex-1 relative overflow-hidden">
                {/* Background image */}
                <img
                    src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=85&w=2070&auto=format&fit=crop"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                    style={{ filter: 'brightness(0.35) saturate(0.8)' }}
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-[#020617]/40" />

                {/* Diagonal gold accent line */}
                <div className="absolute top-0 right-[30%] w-px h-full opacity-20"
                    style={{ background: 'linear-gradient(to bottom, transparent 0%, #c5a059 30%, #c5a059 70%, transparent 100%)', transform: 'rotate(15deg) scaleY(1.5)', transformOrigin: 'top' }} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-12 xl:p-16">
                    {/* Top badge */}
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
                        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#c5a059] to-amber-700" />
                        <div>
                            <p className="text-[#c5a059] text-[10px] font-black tracking-[0.3em] uppercase">Antalya'nın</p>
                            <p className="text-white/60 text-[10px] font-bold tracking-[0.2em] uppercase">VIP Transfer Hizmeti</p>
                        </div>
                    </div>

                    {/* Center: Main headline */}
                    <div className="max-w-lg">
                        <p className="text-[#c5a059]/60 text-xs font-black tracking-[0.4em] uppercase mb-4"
                            style={{ animation: 'slideInText 0.7s ease 0.4s both' }}>
                            Yönetim Merkezi
                        </p>
                        <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight"
                            style={{ animation: 'slideInText 0.7s ease 0.5s both' }}>
                            Kusursuz Hizmet,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a059] via-amber-400 to-[#c5a059]">
                                Akıllı Yönetim
                            </span>
                        </h2>
                        <p className="text-slate-400 text-[14px] leading-relaxed max-w-sm"
                            style={{ animation: 'slideInText 0.7s ease 0.6s both' }}>
                            Tüm transfer operasyonlarınızı tek ekrandan yönetin. Gerçek zamanlı rezervasyon takibi, gelir analizi ve filo yönetimi.
                        </p>
                    </div>

                    {/* Bottom: Stats row */}
                    <div className="flex items-center gap-6" style={{ animation: 'slideInText 0.7s ease 0.7s both' }}>
                        {[
                            { value: '7/24', label: 'Kesintisiz Erişim' },
                            { value: '256-bit', label: 'SSL Şifreleme' },
                            { value: '99.9%', label: 'Sistem Uptime' },
                        ].map((stat, i) => (
                            <React.Fragment key={stat.label}>
                                <div>
                                    <p className="text-white font-black text-lg leading-none">{stat.value}</p>
                                    <p className="text-slate-600 text-[10px] font-bold uppercase tracking-wider mt-1">{stat.label}</p>
                                </div>
                                {i < 2 && <div className="w-px h-8 bg-white/[0.07]" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
