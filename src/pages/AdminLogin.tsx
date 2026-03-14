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
            if (email === 'admin@ataflugtransfer.com' && password === 'admin123') {
                setLoginStage('success');
                setTimeout(() => {
                    setIsLoading(false);
                    onLogin();
                }, 800);
            } else {
                setLoginStage('error');
                setIsLoading(false);
                setErrorMessage('E-posta veya şifre hatalı. (Dev modu: admin@ataflugtransfer.com / admin123)');
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
            redirectTo: `${window.location.origin}/reset-password`,
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
        <div className="h-screen h-[100dvh] flex flex-col lg:flex-row bg-[#030712] relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-[var(--color-primary)]/8 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-20%] left-[-10%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
                <div className="hidden sm:block absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-violet-600/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />

                {particles.map(p => (
                    <div key={p.id}
                        className="absolute rounded-full bg-[var(--color-primary)]"
                        style={{
                            left: `${p.x}%`, width: `${p.size}px`, height: `${p.size}px`,
                            opacity: p.opacity,
                            animation: `floatUp ${p.speed}s linear infinite`,
                            animationDelay: `-${p.delay}s`,
                        }} />
                ))}

                <div className="absolute inset-0 opacity-[0.02]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            <style>{`
                @keyframes floatUp {
                    0% { transform: translateY(100vh) scale(0); opacity: 0; }
                    10% { opacity: var(--particle-opacity, 0.2); transform: scale(1); }
                    90% { opacity: var(--particle-opacity, 0.2); }
                    100% { transform: translateY(-20vh) scale(0); opacity: 0; }
                }
                @keyframes slideInText {
                    0% { opacity: 0; transform: translateY(20px); }
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
            `}</style>

            {/* Left: Login Form */}
            <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 flex flex-col justify-center items-center px-5 sm:px-8 md:px-12 py-6 sm:py-8 relative z-10 flex-1 lg:flex-initial overflow-hidden">
                <div className="w-full max-w-[380px]">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8 sm:mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-amber-700 flex items-center justify-center shadow-2xl shadow-[var(--color-primary)]/30 mb-5 relative">
                            <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain brightness-0 invert" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-[3px] border-[#030712] flex items-center justify-center">
                                <i className="fa-solid fa-check text-[6px] text-white"></i>
                            </div>
                        </div>
                        <h2 className="text-white/40 font-bold text-[10px] tracking-[0.4em] uppercase">Admin Panel</h2>
                    </div>

                    {/* Login Card */}
                    <div className={`relative rounded-2xl border transition-all duration-500 ${
                        loginStage === 'success'
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : loginStage === 'error'
                            ? 'bg-red-500/5 border-red-500/20'
                            : 'bg-white/[0.03] border-white/[0.06]'
                    }`}
                        style={loginStage === 'error' ? { animation: 'errorShake 0.5s ease-out' } : undefined}>

                        {isFocused && <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[var(--color-primary)]/20 to-transparent opacity-50 pointer-events-none" />}

                        <div className="relative p-5 sm:p-8">
                            {loginStage === 'success' ? (
                                <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 flex items-center justify-center mb-4 shadow-2xl" style={{ animation: 'successPulse 1.5s ease infinite' }}>
                                        <i className="fa-solid fa-check text-white text-2xl"></i>
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1">Hoş Geldiniz!</h3>
                                    <p className="text-slate-400 text-sm">Yönlendiriliyorsunuz...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-7 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                                        <h1 className="text-[22px] font-bold text-white mb-1.5">Giriş Yapın</h1>
                                        <p className="text-slate-500 text-[13px]">Panel erişimi için hesap bilgilerinizi girin</p>
                                    </div>

                                    {/* Password reset success message */}
                                    {resetSent && (
                                        <div className="mb-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in duration-300">
                                            <i className="fa-solid fa-envelope-circle-check text-emerald-400 text-sm"></i>
                                            <p className="text-emerald-400 text-[12px]">Şifre sıfırlama bağlantısı e-postanıza gönderildi.</p>
                                        </div>
                                    )}

                                    {/* Error message */}
                                    {errorMessage && (
                                        <div className="mb-4 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in duration-300">
                                            <i className="fa-solid fa-circle-exclamation text-red-400 text-sm mt-0.5 flex-shrink-0"></i>
                                            <p className="text-red-400 text-[12px] leading-relaxed">{errorMessage}</p>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                                        {/* Email */}
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                                                <i className="fa-solid fa-envelope text-[8px] text-[var(--color-primary)]"></i> E-posta
                                            </label>
                                            <div className={`relative rounded-xl border transition-all duration-300 ${isFocused === 'email' ? 'border-[var(--color-primary)]/50 bg-white/[0.04] shadow-lg shadow-[var(--color-primary)]/5' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'}`}>
                                                <i className={`fa-solid fa-at absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-colors duration-300 ${isFocused === 'email' ? 'text-[var(--color-primary)]' : 'text-slate-600'}`}></i>
                                                <input
                                                    ref={emailRef}
                                                    type="email"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    onFocus={() => setIsFocused('email')}
                                                    onBlur={() => setIsFocused(null)}
                                                    className="w-full bg-transparent pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none"
                                                    placeholder="admin@ataflugtransfer.com"
                                                    autoComplete="email"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <div className="flex justify-between items-center mb-2.5">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                                    <i className="fa-solid fa-lock text-[8px] text-[var(--color-primary)]"></i> Şifre
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={handleForgotPassword}
                                                    className="text-[10px] text-[var(--color-primary)]/60 hover:text-[var(--color-primary)] font-bold transition-colors">
                                                    Şifremi Unuttum?
                                                </button>
                                            </div>
                                            <div className={`relative rounded-xl border transition-all duration-300 ${isFocused === 'password' ? 'border-[var(--color-primary)]/50 bg-white/[0.04] shadow-lg shadow-[var(--color-primary)]/5' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10'}`}>
                                                <i className={`fa-solid fa-fingerprint absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-colors duration-300 ${isFocused === 'password' ? 'text-[var(--color-primary)]' : 'text-slate-600'}`}></i>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    onFocus={() => setIsFocused('password')}
                                                    onBlur={() => setIsFocused(null)}
                                                    className="w-full bg-transparent pl-11 pr-12 py-3.5 text-sm text-white placeholder-slate-600 outline-none"
                                                    placeholder="••••••••"
                                                    autoComplete="current-password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors">
                                                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={isLoading || !email || !password}
                                            className="group relative w-full h-[52px] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-amber-600 transition-all duration-300 group-hover:from-amber-600 group-hover:to-[var(--color-primary)]" />
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                <div className="absolute -inset-full top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_infinite]" />
                                            </div>
                                            <div className="relative h-full flex items-center justify-center gap-2.5">
                                                {loginStage === 'authenticating' ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        <span className="font-bold text-white text-sm tracking-wide">Doğrulanıyor...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="font-bold text-white text-sm tracking-wider uppercase">Giriş Yap</span>
                                                        <i className="fa-solid fa-arrow-right text-white/80 text-sm transition-transform duration-300 group-hover:translate-x-1"></i>
                                                    </>
                                                )}
                                            </div>
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                    {!isSupabaseConfigured && (
                        <div className="mt-4 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <p className="text-amber-400/80 text-[11px] text-center">
                                <i className="fa-solid fa-triangle-exclamation mr-1.5"></i>
                                Geliştirme modu — Supabase yapılandırılmadı
                            </p>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-4 left-0 right-0 text-center z-20">
                    <p className="text-slate-700 text-[10px] font-medium">
                        © {new Date().getFullYear()} ATA FLUG TRANSFER · <span className="text-slate-600">v3.0.0</span>
                    </p>
                </div>
            </div>

            {/* Right: Visual Panel */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
                        alt="" className="w-full h-full object-cover opacity-30 scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/90 to-[#030712]/60"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/50"></div>
                </div>

                <div className="relative z-10 max-w-xl px-8 xl:px-16">
                    <div className="flex flex-wrap gap-3 lg:gap-4 mb-10">
                        {[
                            { value: '99.9%', label: 'Uptime', icon: 'fa-server', color: 'text-emerald-400' },
                            { value: '256-bit', label: 'Şifreleme', icon: 'fa-shield-halved', color: 'text-blue-400' },
                            { value: '24/7', label: 'Erişim', icon: 'fa-clock', color: 'text-violet-400' },
                        ].map((stat, i) => (
                            <div key={i} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700"
                                style={{ animationDelay: `${i * 150 + 300}ms` }}>
                                <div className="flex items-center gap-2 mb-1">
                                    <i className={`fa-solid ${stat.icon} ${stat.color} text-[10px]`}></i>
                                    <span className="text-white font-black text-sm">{stat.value}</span>
                                </div>
                                <p className="text-slate-600 text-[9px] font-bold uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mb-8" key={sloganIndex}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 mb-6"
                            style={{ animation: 'slideInText 0.6s ease-out' }}>
                            <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full shadow-[0_0_8px_var(--color-primary)]"></span>
                            <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">Güvenli Erişim</span>
                        </div>
                        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-5 leading-[1.15]"
                            style={{ animation: 'slideInText 0.6s ease-out 0.1s both' }}>
                            {activeSlogan.title}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-amber-400">
                                {activeSlogan.highlight}
                            </span>
                        </h2>
                        <p className="text-slate-400 text-[15px] leading-relaxed max-w-md"
                            style={{ animation: 'slideInText 0.6s ease-out 0.2s both' }}>
                            {activeSlogan.desc}
                        </p>
                    </div>

                    <div className="flex gap-1.5">
                        {LOGIN_SLOGANS.map((_, i) => (
                            <button key={i} onClick={() => setSloganIndex(i)}
                                className={`h-1 rounded-full transition-all duration-500 ${i === sloganIndex ? 'w-8 bg-[var(--color-primary)]' : 'w-1.5 bg-white/10 hover:bg-white/20'}`} />
                        ))}
                    </div>

                    <div className="mt-14 grid grid-cols-3 gap-3">
                        {[
                            { icon: 'fa-chart-mixed', label: 'Analitik Dashboard', color: 'from-blue-500/10 to-indigo-500/5', border: 'border-blue-500/10' },
                            { icon: 'fa-users-gear', label: 'Çoklu Kullanıcı', color: 'from-violet-500/10 to-purple-500/5', border: 'border-violet-500/10' },
                            { icon: 'fa-bell', label: 'Akıllı Bildirimler', color: 'from-[var(--color-primary)]/10 to-amber-500/5', border: 'border-[var(--color-primary)]/10' },
                        ].map((feat, i) => (
                            <div key={i} className={`p-3 rounded-xl bg-gradient-to-br ${feat.color} border ${feat.border} backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700`}
                                style={{ animationDelay: `${i * 100 + 600}ms` }}>
                                <i className={`fa-solid ${feat.icon} text-white/40 text-lg mb-2 block`}></i>
                                <p className="text-white/50 text-[10px] font-bold">{feat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
