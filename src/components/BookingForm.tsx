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
  { code: '+47', flag: '🇳🇴', name: 'NO' },
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
      if (formData.pickup === formData.destination) e.route = 'Nereden ve Nereye aynı olamaz.';
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

    const msg = [`✨ *${businessName}* ✨`, '____________________________', '', '⭐ *YENİ REZERVASYON TALEBİ*', '', ...trLines, '', '✅ _Teşekkürler, dönüş bekliyorum._'].join('\n');

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

  const card = "rounded-2xl border border-gray-200 bg-white px-4 py-3 min-h-[56px] focus-within:border-[var(--color-primary)] hover:border-gray-300 transition-colors shadow-sm";
  const lbl = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1";
  const inp = "w-full bg-transparent border-none outline-none text-sm text-gray-900 font-medium placeholder-gray-400";
  const errTxt = "text-red-500 text-[10px] mt-1.5 flex items-center gap-1 font-medium";

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

  const slideClass = animating
    ? (direction === 'forward' ? 'opacity-0 translate-x-4' : 'opacity-0 -translate-x-4')
    : 'opacity-100 translate-x-0';

  return (
    <div className="w-full overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── Step Indicator ── */}
      <div className="px-1 pb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => i < step && goToStep(i)}
              className={`text-[10px] font-black uppercase tracking-wider transition-colors duration-300 outline-none ${i <= step ? 'cursor-pointer' : 'cursor-default'} ${i < step ? 'text-gray-400 hover:text-[var(--color-primary)]' : i === step ? 'text-[var(--color-primary)]' : 'text-gray-300'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary)] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Step Content ── */}
      <div
        className={`flex flex-col gap-3 transition-all duration-220 ease-out ${slideClass}`}
      >

        {/* STEP 0 — Rota */}
        {step === 0 && (
          <>
            <div className="relative">
              <div className="flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm focus-within:border-[var(--color-primary)] transition-colors">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <label htmlFor="bf-pickup" className={lbl}>Nereden</label>
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-circle-dot text-[var(--color-primary)] text-[10px] flex-shrink-0" />
                    <select id="bf-pickup" name="pickup" value={formData.pickup} onChange={handleChange}
                      className="w-full bg-transparent outline-none text-sm text-gray-900 font-semibold appearance-none cursor-pointer truncate">
                      <option value="" disabled hidden>Seçiniz</option>
                      {siteContent.regions.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <label htmlFor="bf-destination" className={lbl}>Nereye</label>
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-location-dot text-[var(--color-primary)] text-[10px] flex-shrink-0" />
                    <select id="bf-destination" name="destination" value={formData.destination} onChange={handleChange}
                      className="w-full bg-transparent outline-none text-sm text-gray-900 font-semibold appearance-none cursor-pointer truncate">
                      <option value="" disabled hidden>Seçiniz</option>
                      {siteContent.regions.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <button type="button" onClick={handleSwapLocations} aria-label="Yer değiştir"
                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 hover:border-[var(--color-primary)] flex items-center justify-center text-gray-400 hover:text-[var(--color-primary)] transition-all active:scale-90 z-10">
                <i className="fa-solid fa-arrow-right-arrow-left text-[10px] rotate-90" />
              </button>
            </div>
            {errors.route && <p className={errTxt}><i className="fa-solid fa-circle-exclamation" />{errors.route}</p>}

            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className={card}>
                <label htmlFor="bf-date" className={lbl}>Tarih</label>
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-calendar-days text-gray-400 text-sm flex-shrink-0" />
                  <input id="bf-date" required type="date" name="date" value={formData.date} onChange={handleChange} min={today} className={inp + ' cursor-pointer'} />
                </div>
                {errors.date && <p className={errTxt}>{errors.date}</p>}
              </div>
              <div className={card}>
                <label htmlFor="bf-time" className={lbl}>Saat</label>
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-clock text-gray-400 text-sm flex-shrink-0" />
                  <input id="bf-time" required type="time" name="time" value={formData.time} onChange={handleChange} className={inp + ' cursor-pointer'} />
                </div>
                {errors.time && <p className={errTxt}>{errors.time}</p>}
              </div>
            </div>
          </>
        )}

        {/* STEP 1 — Kişi */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className={card}>
                <label htmlFor="bf-firstName" className={lbl}>Ad</label>
                <input id="bf-firstName" required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inp} placeholder="Adınız" />
                {errors.firstName && <p className={errTxt}>{errors.firstName}</p>}
              </div>
              <div className={card}>
                <label htmlFor="bf-lastName" className={lbl}>Soyad</label>
                <input id="bf-lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inp} placeholder="Soyadınız" />
              </div>
            </div>

            <div className={card}>
              <label htmlFor="bf-phone" className={lbl}>Telefon</label>
              <div className="flex items-center gap-2">
                <select aria-label="Ülke kodu" name="countryCode" value={formData.countryCode} onChange={handleChange}
                  className="w-[80px] bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 outline-none text-sm text-gray-700 font-medium appearance-none cursor-pointer">
                  {COUNTRY_CODES.map(cc => <option key={cc.code} value={cc.code}>{cc.flag} {cc.code}</option>)}
                </select>
                <input id="bf-phone" required type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inp + ' flex-1 pl-2'} placeholder="555 123 4567" />
              </div>
              {errors.phone && <p className={errTxt}>{errors.phone}</p>}
            </div>

            <div className={card}>
              <label htmlFor="bf-email" className={lbl}>E-posta</label>
              <input id="bf-email" type="email" name="email" value={formData.email} onChange={handleChange} className={inp} placeholder="ornek@email.com" />
            </div>
          </>
        )}

        {/* STEP 2 — Detay */}
        {step === 2 && (
          <>
            <div className="space-y-2">
              <label className={lbl}>Araç Tercihi</label>
              <div className="flex flex-col gap-2.5">
                {vehicles.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, vehicleId: v.id }))}
                    className={`group flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all duration-300 text-left ${
                      formData.vehicleId === v.id
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-md shadow-[var(--color-primary)]/10 ring-1 ring-[var(--color-primary)]'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full border shadow-sm flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      formData.vehicleId === v.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'border-gray-200 bg-gray-50 group-hover:border-gray-300 text-gray-400'
                    }`}>
                      <i className="fa-solid fa-car-side text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-base font-bold truncate transition-colors duration-200 ${formData.vehicleId === v.id ? 'text-gray-900' : 'text-gray-700'}`}>{v.name}</div>
                      {v.capacity && <div className="text-gray-400 font-medium text-[11px] mt-0.5">Maksimum {v.capacity} Kişi</div>}
                    </div>
                    {formData.vehicleId === v.id && (
                      <i className="fa-solid fa-circle-check text-[var(--color-primary)] text-xl flex-shrink-0 animate-in zoom-in" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className={card}>
                <label htmlFor="bf-passengers" className={lbl}>Yolcu Sayısı</label>
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-user-group text-gray-400 text-[10px]" />
                  <select id="bf-passengers" name="passengers" value={formData.passengers} onChange={handleChange} className="w-full bg-transparent outline-none text-sm text-gray-900 font-semibold appearance-none cursor-pointer">
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n} Kişi</option>)}
                  </select>
                </div>
              </div>
              <div className={card}>
                <label htmlFor="bf-flightNumber" className={lbl}>Uçuş No</label>
                <input id="bf-flightNumber" type="text" name="flightNumber" value={formData.flightNumber} onChange={handleChange} className={inp} placeholder="örn. TK2414" />
              </div>
            </div>

            <div className={card}>
              <label htmlFor="bf-notes" className={lbl}>Ek Notlar (Opsiyonel)</label>
              <input id="bf-notes" type="text" name="notes" value={formData.notes} onChange={handleChange} className={inp} placeholder="Bebek koltuğu, ekstra bagaj vs." />
            </div>
          </>
        )}

        {/* STEP 3 — Özet */}
        {step === 3 && (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden text-gray-800">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Rota Detayı</div>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 mt-1">
                  <div className="w-2.5 h-2.5 rounded-full border-2 border-[var(--color-primary)] bg-white" />
                  <div className="w-px h-8 bg-gradient-to-b from-[var(--color-primary)] to-gray-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                </div>
                <div className="flex flex-col justify-between h-[52px]">
                  <span className="text-gray-900 text-sm font-bold">{formData.pickup}</span>
                  <span className="text-gray-900 text-sm font-bold">{formData.destination}</span>
                </div>
                <div className="ml-auto text-right flex flex-col justify-between h-[52px]">
                  <div className="text-gray-500 text-xs font-medium">{formatDate(formData.date)}</div>
                  <div className="text-gray-500 text-xs font-medium">{formData.time}</div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Müşteri</div>
                  <div className="text-gray-900 text-sm font-bold">{(formData.firstName + ' ' + formData.lastName).trim() || '-'}</div>
                  <div className="text-gray-500 text-xs mt-1">{formData.countryCode} {formData.phone}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Kişi</div>
                  <div className="text-gray-900 text-sm font-bold">{formData.passengers} Yolcu</div>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 bg-gray-50">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Araç ve Ekler</div>
                {formData.flightNumber && <div className="text-gray-500 text-xs font-bold bg-white px-2 py-0.5 rounded border border-gray-200">✈️ {formData.flightNumber}</div>}
              </div>
              <div className="text-gray-900 text-sm font-bold mt-2">{selectedVehicle?.name || '-'}</div>
              {formData.notes && <div className="mt-2 text-gray-600 text-xs italic">Not: {formData.notes}</div>}
            </div>
          </div>
        )}

      </div>

      {showToast && (
        <div className="mt-4 flex items-center justify-center gap-3 py-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold text-sm animate-in fade-in slide-in-from-bottom-2">
          <i className="fa-solid fa-check-circle" /> WhatsApp'a aktarılıyor...
        </div>
      )}

      {/* ── CTA ── */}
      <div className="pt-6 flex gap-3">
        {step > 0 && (
          <button type="button" onClick={() => goToStep(step - 1)} className="w-[52px] h-[52px] flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-800 transition-all active:scale-95 shrink-0">
            <i className="fa-solid fa-arrow-left" />
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={() => goToStep(step + 1)} className="flex-1 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm tracking-widest uppercase transition-all shadow-lg shadow-gray-900/20 active:scale-[0.98] h-[52px] flex items-center justify-center gap-3">
            <span>Devam Et</span> <i className="fa-solid fa-arrow-right text-[10px]" />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} className="flex-1 rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-xl shadow-[var(--color-primary)]/20 active:scale-[0.98] h-[52px] flex items-center justify-center gap-3 text-white" style={{ background: 'linear-gradient(135deg, var(--color-primary-light), var(--color-primary))' }}>
            <i className="fa-brands fa-whatsapp text-lg" /> <span>Rezervasyonu Tamamla</span>
          </button>
        )}
      </div>

    </div>
  );
};

export default BookingForm;
