import React, { useState } from 'react';
import { Booking, Vehicle } from '../types';
import { useAppStore } from '../store/useAppStore';

const COUNTRY_CODES = [
  { code: '+90', flag: '🇹🇷', name: 'TR' },
  { code: '+49', flag: '🇩🇪', name: 'DE' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+33', flag: '🇫🇷', name: 'FR' },
  { code: '+7', flag: '🇷🇺', name: 'RU' },
  { code: '+966', flag: '🇸🇦', name: 'SA' },
  { code: '+971', flag: '🇦🇪', name: 'AE' },
  { code: '+1', flag: '🇺🇸', name: 'US' },
  { code: '+31', flag: '🇳🇱', name: 'NL' },
  { code: '+32', flag: '🇧🇪', name: 'BE' },
  { code: '+43', flag: '🇦🇹', name: 'AT' },
  { code: '+41', flag: '🇨🇭', name: 'CH' },
  { code: '+46', flag: '🇸🇪', name: 'SE' },
  { code: '+47', flag: '🇳挪', name: 'NO' },
  { code: '+45', flag: '🇩🇰', name: 'DK' },
  { code: '+48', flag: '🇵🇱', name: 'PL' },
  { code: '+380', flag: '🇺🇦', name: 'UA' },
  { code: '+40', flag: '🇷🇴', name: 'RO' },
  { code: '+30', flag: '🇬🇷', name: 'GR' },
  { code: '+972', flag: '🇮🇱', name: 'IL' },
  { code: '+994', flag: '🇦🇿', name: 'AZ' },
  { code: '+995', flag: '🇬🇪', name: 'GE' },
];

interface BookingFormProps {
  onBookingSubmit: (booking: Partial<Booking>) => void;
  vehicles: Vehicle[];
}

const STEPS = ['Rota', 'Bilgiler', 'Detaylar', 'Özet'] as const;

const BookingForm: React.FC<BookingFormProps> = ({ onBookingSubmit, vehicles }) => {
  const siteContent = useAppStore(state => state.siteContent);
  const businessName = siteContent.business.name;
  const whatsappNumber = siteContent.business.whatsapp;

  const today = new Date().toISOString().split('T')[0];

  const initialState = {
    firstName: '',
    lastName: '',
    countryCode: '+90',
    phone: '',
    email: '',
    pickup: '',
    destination: '',
    date: '',
    time: '',
    passengers: 1,
    vehicleId: vehicles[0]?.id || '',
    flightNumber: '',
    notes: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [animating, setAnimating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handleSwapLocations = () => {
    setFormData(prev => ({ ...prev, pickup: prev.destination, destination: prev.pickup }));
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return dd + '.' + mm + '.' + yy;
  };

  const validateStep = (s: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (formData.pickup === formData.destination) e.route = 'Nereden ve Nereye aynı olamaz. Lütfen farklı bir rota seçin.';
      if (!formData.date) e.date = 'Lütfen tarih seçin.';
      if (!formData.time) e.time = 'Lütfen saat seçin.';
    }
    if (s === 1) {
      if (!formData.firstName.trim()) e.firstName = 'Ad gerekli.';
      if (!formData.phone.trim()) e.phone = 'Telefon gerekli.';
    }
    return e;
  };

  const goToStep = (next: number) => {
    if (animating) return;
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0 && next > step) { setErrors(errs); return; }
    setDirection(next > step ? 'forward' : 'back');
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 220);
  };

  const handleSubmit = () => {
    const fullName = (formData.firstName + ' ' + formData.lastName).trim();
    const fullPhone = formData.countryCode + ' ' + formData.phone;
    const dateFormatted = formatDate(formData.date);
    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

    onBookingSubmit({ ...formData, customerName: fullName, phone: fullPhone, email: formData.email || undefined });

    const trLines = [
      '👤  Ad Soyad: ' + fullName,
      '📱  Telefon: ' + fullPhone,
      '📍  Nereden: ' + formData.pickup,
      '🏁  Nereye: ' + formData.destination,
      '📅  Tarih: ' + dateFormatted,
      '⏰  Saat: ' + formData.time,
      '👥  Kişi: ' + formData.passengers,
      '🚐  Araç: ' + (selectedVehicle?.name || '-'),
    ];
    if (formData.flightNumber) trLines.push('✈️  Uçuş No: ' + formData.flightNumber);
    if (formData.notes) trLines.push('📝  Not: ' + formData.notes);

    const msg = [`✨ *${businessName}* ✨`, '____________________________', '', '⭐ *YENİ REZERVASYON TALEBİ*', '', ...trLines, '', '✅ _Müsaitlik durumu hakkında bilgi bekliyorum._'].join('\n');

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const waNumber = whatsappNumber;
    const waUrl = isMobile
      ? 'https://api.whatsapp.com/send?phone=' + waNumber + '&text=' + encodeURIComponent(msg)
      : 'https://web.whatsapp.com/send?phone=' + waNumber + '&text=' + encodeURIComponent(msg);
    setTimeout(() => { window.open(waUrl, '_blank'); }, 100);
    setFormData(initialState);
    setStep(0);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const card = "rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 min-h-[52px] focus-within:border-[var(--color-primary)]/40 transition-colors";
  const lbl = "block text-[10px] font-bold text-[var(--color-primary)]/60 uppercase tracking-[0.15em] mb-0.5";
  const inp = "w-full bg-transparent outline-none text-[13px] text-white font-medium placeholder-white/20";
  const errTxt = "text-rose-400 text-[10px] mt-1 flex items-center gap-1";

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

  const slideClass = animating
    ? (direction === 'forward' ? 'opacity-0 translate-x-4' : 'opacity-0 -translate-x-4')
    : 'opacity-100 translate-x-0';

  return (
    <div className="w-full overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Step Indicator ── */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => i < step && goToStep(i)}
              className={`text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${i <= step ? 'cursor-pointer' : 'cursor-default'} ${i < step ? 'text-[#c5a059]/60' : i === step ? 'text-[#c5a059]' : 'text-white/20'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="h-0.5 bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#c5a059] to-[#e0c07a] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Step Content ── */}
      <div
        className={`px-3 sm:px-4 flex flex-col gap-2.5 transition-all duration-220 ease-out ${slideClass}`}
        style={{ transitionDuration: '220ms' }}
      >

        {/* STEP 0 — Rota */}
        {step === 0 && (
          <>
            <div className="relative">
              <div className="flex flex-col gap-0 rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden focus-within:border-[var(--color-primary)]/40 transition-colors">
                <div className="px-3 py-2.5">
                  <label htmlFor="bf-pickup" className={lbl}>Nereden</label>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-circle-dot text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                    <select id="bf-pickup" name="pickup" value={formData.pickup} onChange={handleChange}
                      className="w-full bg-transparent outline-none text-[12px] text-white font-medium appearance-none cursor-pointer truncate">
                      {siteContent.regions.map(r => <option key={r.id} value={r.name} className="bg-[#0a0a0e] text-white">{r.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="border-t border-white/[0.06] mx-3" />
                <div className="px-3 py-2.5">
                  <label htmlFor="bf-destination" className={lbl}>Nereye</label>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-location-dot text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                    <select id="bf-destination" name="destination" value={formData.destination} onChange={handleChange}
                      className="w-full bg-transparent outline-none text-[12px] text-white font-medium appearance-none cursor-pointer truncate">
                      {siteContent.regions.map(r => <option key={r.id} value={r.name} className="bg-[#0a0a0e] text-white">{r.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <button type="button" onClick={handleSwapLocations} aria-label="Kalkış ve varış noktalarını değiştir"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0a0a0e] border border-white/[0.1] hover:border-[var(--color-primary)]/40 flex items-center justify-center text-white/40 hover:text-[var(--color-primary)] transition-all active:scale-90 z-10">
                <i className="fa-solid fa-arrow-right-arrow-left text-[9px] rotate-90" aria-hidden="true" />
              </button>
            </div>
            {errors.route && <p className={errTxt}><i className="fa-solid fa-triangle-exclamation text-[9px]" />{errors.route}</p>}

            <div className="grid grid-cols-2 gap-2">
              <div className={card}>
                <label htmlFor="bf-date" className={lbl}>Tarih</label>
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                  <input id="bf-date" required type="date" name="date" value={formData.date} onChange={handleChange}
                    min={today} className={inp + ' cursor-pointer [color-scheme:dark]'} />
                </div>
                {errors.date && <p className="text-rose-400 text-[9px] mt-1">{errors.date}</p>}
              </div>
              <div className={card}>
                <label htmlFor="bf-time" className={lbl}>Saat</label>
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-clock text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                  <input id="bf-time" required type="time" name="time" value={formData.time} onChange={handleChange}
                    className={inp + ' cursor-pointer [color-scheme:dark]'} />
                </div>
                {errors.time && <p className="text-rose-400 text-[9px] mt-1">{errors.time}</p>}
              </div>
            </div>
          </>
        )}

        {/* STEP 1 — Kişisel Bilgiler */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className={card}>
                <label htmlFor="bf-firstName" className={lbl}>Ad</label>
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-user text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                  <input id="bf-firstName" required type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                    className={inp} placeholder="Adınız" autoComplete="given-name" />
                </div>
                {errors.firstName && <p className="text-rose-400 text-[9px] mt-1">{errors.firstName}</p>}
              </div>
              <div className={card}>
                <label htmlFor="bf-lastName" className={lbl}>Soyad</label>
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-user text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                  <input id="bf-lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                    className={inp} placeholder="Soyadınız" autoComplete="family-name" />
                </div>
              </div>
            </div>

            <div className={card}>
              <label htmlFor="bf-phone" className={lbl}>Telefon</label>
              <div className="flex items-center gap-1.5">
                <i className="fa-solid fa-phone text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                <select aria-label="Ülke kodu" name="countryCode" value={formData.countryCode} onChange={handleChange}
                  className="w-[72px] bg-transparent outline-none text-[12px] text-white font-medium appearance-none cursor-pointer shrink-0">
                  {COUNTRY_CODES.map(cc => (
                    <option key={cc.code} value={cc.code} className="bg-[#0a0a0e] text-white">{cc.flag} {cc.code}</option>
                  ))}
                </select>
                <div className="w-px h-4 bg-white/10 flex-shrink-0" />
                <input id="bf-phone" required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className={inp + ' flex-1'} placeholder="555 123 4567" autoComplete="tel" />
              </div>
              {errors.phone && <p className="text-rose-400 text-[9px] mt-1">{errors.phone}</p>}
            </div>

            <div className={card}>
              <label htmlFor="bf-email" className={lbl}>E-posta</label>
              <div className="flex items-center gap-2">
                <i className="fa-regular fa-envelope text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                <input id="bf-email" type="email" name="email" value={formData.email} onChange={handleChange}
                  className={inp} placeholder="ornek@email.com" autoComplete="email" />
              </div>
            </div>
          </>
        )}

        {/* STEP 2 — Detaylar */}
        {step === 2 && (
          <>
            {/* Araç seçimi — card-based */}
            <div>
              <label className={lbl + ' mb-2'}>Araç</label>
              <div className="flex flex-col gap-2">
                {vehicles.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, vehicleId: v.id }))}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left ${
                      formData.vehicleId === v.id
                        ? 'border-[#c5a059]/60 bg-[#c5a059]/[0.07] shadow-[0_0_20px_rgba(197,160,89,0.08)]'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      formData.vehicleId === v.id ? 'border-[#c5a059] bg-[#c5a059]' : 'border-white/20 group-hover:border-white/30'
                    }`}>
                      {formData.vehicleId === v.id
                        ? <i className="fa-solid fa-check text-[#0a0a0e] text-[10px]" />
                        : <i className="fa-solid fa-car-side text-white/30 text-[10px]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[13px] font-semibold truncate transition-colors duration-200 ${formData.vehicleId === v.id ? 'text-white' : 'text-white/70'}`}>{v.name}</div>
                      {v.capacity && <div className="text-white/30 text-[10px] mt-0.5">Kapasite: {v.capacity} kişi</div>}
                    </div>
                    {formData.vehicleId === v.id && (
                      <i className="fa-solid fa-circle-check text-[#c5a059] text-sm flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className={card}>
                <label htmlFor="bf-passengers" className={lbl}>Yolcu</label>
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-user-group text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                  <select id="bf-passengers" name="passengers" value={formData.passengers} onChange={handleChange}
                    className="w-full bg-transparent outline-none text-[12px] text-white font-medium appearance-none cursor-pointer">
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(n => (
                      <option key={n} value={n} className="bg-[#0a0a0e] text-white">{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={card}>
                <label htmlFor="bf-flightNumber" className={lbl}>Uçuş No</label>
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-plane text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                  <input id="bf-flightNumber" type="text" name="flightNumber" value={formData.flightNumber} onChange={handleChange}
                    className={inp} placeholder="TK2414" />
                </div>
              </div>
            </div>

            <div className={card}>
              <label htmlFor="bf-notes" className={lbl}>Not / Ek Bilgi</label>
              <div className="flex items-start gap-2">
                <i className="fa-regular fa-comment text-[var(--color-primary)] text-[9px] flex-shrink-0 mt-0.5" />
                <input id="bf-notes" type="text" name="notes" value={formData.notes} onChange={handleChange}
                  className={inp} placeholder="Bebek koltuğu, extra bagaj vb. (opsiyonel)" />
              </div>
            </div>
          </>
        )}

        {/* STEP 3 — Özet */}
        {step === 3 && (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
            {/* Rota */}
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <div className="text-[9px] font-bold text-[var(--color-primary)]/60 uppercase tracking-[0.15em] mb-2">Rota</div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <i className="fa-solid fa-circle-dot text-[var(--color-primary)] text-[8px]" />
                  <div className="w-px h-4 border-l border-dashed border-white/20" />
                  <i className="fa-solid fa-location-dot text-[var(--color-primary)] text-[8px]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-white text-[12px] font-medium">{formData.pickup}</span>
                  <span className="text-white text-[12px] font-medium">{formData.destination}</span>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-white/40 text-[10px]">{formatDate(formData.date)}</div>
                  <div className="text-white/40 text-[10px]">{formData.time}</div>
                </div>
              </div>
            </div>
            {/* Kişi */}
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <div className="text-[9px] font-bold text-[var(--color-primary)]/60 uppercase tracking-[0.15em] mb-2">Yolcu</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white text-[12px] font-medium">{(formData.firstName + ' ' + formData.lastName).trim() || '-'}</div>
                  <div className="text-white/40 text-[10px] mt-0.5">{formData.countryCode} {formData.phone}</div>
                  {formData.email && <div className="text-white/40 text-[10px]">{formData.email}</div>}
                </div>
                <div className="text-right">
                  <div className="text-white/40 text-[10px]">{formData.passengers} kişi</div>
                </div>
              </div>
            </div>
            {/* Araç */}
            <div className="px-4 py-3">
              <div className="text-[9px] font-bold text-[var(--color-primary)]/60 uppercase tracking-[0.15em] mb-2">Araç</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-car-side text-[var(--color-primary)] text-[11px]" />
                  <span className="text-white text-[12px] font-medium">{selectedVehicle?.name || '-'}</span>
                </div>
                {formData.flightNumber && (
                  <div className="flex items-center gap-1.5 text-white/40 text-[10px]">
                    <i className="fa-solid fa-plane text-[8px]" />
                    <span>{formData.flightNumber}</span>
                  </div>
                )}
              </div>
              {formData.notes && (
                <div className="mt-2 flex items-start gap-2 text-white/40 text-[10px]">
                  <i className="fa-regular fa-comment text-[8px] mt-0.5 flex-shrink-0" />
                  <span>{formData.notes}</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ── Toast ── */}
      {showToast && (
        <div className="mx-3 sm:mx-4 mt-2 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-check text-white text-[10px]" />
          </div>
          <span className="text-emerald-400 text-[12px] font-medium">Talebiniz alındı! WhatsApp'a yönlendiriliyorsunuz...</span>
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="px-3 sm:px-4 pt-3 pb-2 flex gap-2">
        {step > 0 && (
          <button
            type="button"
            onClick={() => goToStep(step - 1)}
            aria-label="Geri"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-sm font-semibold transition-all duration-200 active:scale-[0.97] min-h-[48px]"
          >
            <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => goToStep(step + 1)}
            className="group flex-1 flex items-center justify-center gap-2.5 bg-[var(--color-primary)] hover:bg-[#d4af6a] text-[#0a0a0e] rounded-xl px-5 py-3.5 font-bold text-sm tracking-wide transition-all duration-300 active:scale-[0.98] min-h-[48px]"
          >
            <span>Devam</span>
            <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="group flex-1 flex items-center justify-center gap-2.5 bg-[var(--color-primary)] hover:bg-[#d4af6a] text-[#0a0a0e] rounded-xl px-5 py-3.5 font-bold text-sm tracking-wide transition-all duration-300 active:scale-[0.98] min-h-[48px]"
          >
            <i className="fa-brands fa-whatsapp text-lg" />
            <span>WhatsApp'a Gönder</span>
            <i className="fa-solid fa-arrow-right text-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
