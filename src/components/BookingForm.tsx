import React, { useState } from 'react';
import { DESTINATIONS, BUSINESS_INFO } from '../constants';
import { Booking, Vehicle } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
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
  const { t, language } = useLanguage();
  const businessName = useAppStore(state => state.siteContent.business.name);
  const whatsappNumber = useAppStore(state => state.siteContent.business.whatsapp);

  const today = new Date().toISOString().split('T')[0];

  const initialState = {
    firstName: '',
    lastName: '',
    countryCode: '+90',
    phone: '',
    email: '',
    pickup: DESTINATIONS[0],
    destination: DESTINATIONS[1],
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
      if (formData.pickup === formData.destination) e.route = t('Nereden ve Nereye aynı olamaz. Lütfen farklı bir rota seçin.');
      if (!formData.date) e.date = t('Lütfen tarih seçin.');
      if (!formData.time) e.time = t('Lütfen saat seçin.');
    }
    if (s === 1) {
      if (!formData.firstName.trim()) e.firstName = t('Ad gerekli.');
      if (!formData.phone.trim()) e.phone = t('Telefon gerekli.');
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

    let msg = '';
    if (language === 'tr') {
      msg = [`✨ *${businessName}* ✨`, '____________________________', '', '⭐ *YENİ REZERVASYON TALEBİ*', '', ...trLines, '', '✅ _Müsaitlik durumu hakkında bilgi bekliyorum._'].join('\n');
    } else {
      const langFlags: Record<string, string> = { en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', ru: '🇷🇺', ar: '🇸🇦' };
      const lf = langFlags[language] || '🌐';
      const lb = {
        title: t('YENİ REZERVASYON TALEBİ'), name: t('Ad Soyad'), ph: t('Telefon'),
        from: t('Nereden'), to: t('Nereye'), date: t('Tarih'), time: t('Saat'),
        pax: t('Kişi'), veh: t('Araç'), flt: t('Uçuş No'), nt: t('Not'),
      };
      const trLines2 = [
        '👤  ' + lb.name + ': ' + fullName, '📱  ' + lb.ph + ': ' + fullPhone,
        '📍  ' + lb.from + ': ' + formData.pickup, '🏁  ' + lb.to + ': ' + formData.destination,
        '📅  ' + lb.date + ': ' + dateFormatted, '⏰  ' + lb.time + ': ' + formData.time,
        '👥  ' + lb.pax + ': ' + formData.passengers, '🚐  ' + lb.veh + ': ' + (selectedVehicle?.name || '-'),
      ];
      if (formData.flightNumber) trLines2.push('✈️  ' + lb.flt + ': ' + formData.flightNumber);
      if (formData.notes) trLines2.push('📝  ' + lb.nt + ': ' + formData.notes);
      msg = [`✨ *${businessName}* ✨`, '____________________________', '', lf + ' *' + lb.title + '*', '', ...trLines2, '', '✅ _' + t('Müsaitlik durumu hakkında bilgi bekliyorum.') + '_', '', '~~~~~~~~~~~~~~~~~~~~~~~~~~~~', '', '🇹🇷 *YENİ REZERVASYON TALEBİ*', '', ...trLines, '', '✅ _Müsaitlik durumu hakkında bilgi bekliyorum._'].join('\n');
    }

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const waNumber = whatsappNumber || BUSINESS_INFO.whatsapp;
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
        <div className="flex items-center gap-0">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <button
                type="button"
                onClick={() => i < step && goToStep(i)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${i <= step ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 border
                  ${i < step ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[#0a0a0e]' :
                    i === step ? 'bg-transparent border-[var(--color-primary)] text-[var(--color-primary)]' :
                    'bg-transparent border-white/10 text-white/20'}`}
                >
                  {i < step
                    ? <i className="fa-solid fa-check text-[9px]" />
                    : <span>{i + 1}</span>}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-300
                  ${i === step ? 'text-[var(--color-primary)]' : i < step ? 'text-white/40' : 'text-white/15'}`}>
                  {t(label)}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-1 mb-4 transition-colors duration-500"
                  style={{ background: i < step ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)' }} />
              )}
            </React.Fragment>
          ))}
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
                  <label className={lbl}>{t('Nereden')}</label>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-circle-dot text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                    <select name="pickup" value={formData.pickup} onChange={handleChange}
                      className="w-full bg-transparent outline-none text-[12px] text-white font-medium appearance-none cursor-pointer truncate">
                      {DESTINATIONS.map(d => <option key={d} value={d} className="bg-[#0a0a0e] text-white">{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="border-t border-white/[0.06] mx-3" />
                <div className="px-3 py-2.5">
                  <label className={lbl}>{t('Nereye')}</label>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-location-dot text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                    <select name="destination" value={formData.destination} onChange={handleChange}
                      className="w-full bg-transparent outline-none text-[12px] text-white font-medium appearance-none cursor-pointer truncate">
                      {DESTINATIONS.map(d => <option key={d} value={d} className="bg-[#0a0a0e] text-white">{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <button type="button" onClick={handleSwapLocations}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0a0a0e] border border-white/[0.1] hover:border-[var(--color-primary)]/40 flex items-center justify-center text-white/40 hover:text-[var(--color-primary)] transition-all active:scale-90 z-10">
                <i className="fa-solid fa-arrow-right-arrow-left text-[9px] rotate-90" />
              </button>
            </div>
            {errors.route && <p className={errTxt}><i className="fa-solid fa-triangle-exclamation text-[9px]" />{errors.route}</p>}

            <div className="grid grid-cols-2 gap-2">
              <div className={card}>
                <label className={lbl}>{t('Tarih')}</label>
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                  <input required type="date" name="date" value={formData.date} onChange={handleChange}
                    min={today} className={inp + ' cursor-pointer [color-scheme:dark]'} />
                </div>
                {errors.date && <p className="text-rose-400 text-[9px] mt-1">{errors.date}</p>}
              </div>
              <div className={card}>
                <label className={lbl}>{t('Saat')}</label>
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-clock text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                  <input required type="time" name="time" value={formData.time} onChange={handleChange}
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
                <label className={lbl}>{t('Ad')}</label>
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-user text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                  <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                    className={inp} placeholder={t('Adınız')} />
                </div>
                {errors.firstName && <p className="text-rose-400 text-[9px] mt-1">{errors.firstName}</p>}
              </div>
              <div className={card}>
                <label className={lbl}>{t('Soyad')}</label>
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-user text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                    className={inp} placeholder={t('Soyadınız')} />
                </div>
              </div>
            </div>

            <div className={card}>
              <label className={lbl}>{t('Telefon')}</label>
              <div className="flex items-center gap-1.5">
                <i className="fa-solid fa-phone text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                <select name="countryCode" value={formData.countryCode} onChange={handleChange}
                  className="w-[72px] bg-transparent outline-none text-[12px] text-white font-medium appearance-none cursor-pointer shrink-0">
                  {COUNTRY_CODES.map(cc => (
                    <option key={cc.code} value={cc.code} className="bg-[#0a0a0e] text-white">{cc.flag} {cc.code}</option>
                  ))}
                </select>
                <div className="w-px h-4 bg-white/10 flex-shrink-0" />
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className={inp + ' flex-1'} placeholder="555 123 4567" />
              </div>
              {errors.phone && <p className="text-rose-400 text-[9px] mt-1">{errors.phone}</p>}
            </div>

            <div className={card}>
              <label className={lbl}>{t('E-posta')}</label>
              <div className="flex items-center gap-2">
                <i className="fa-regular fa-envelope text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className={inp} placeholder="ornek@email.com" />
              </div>
            </div>
          </>
        )}

        {/* STEP 2 — Detaylar */}
        {step === 2 && (
          <>
            {/* Araç seçimi — card-based */}
            <div>
              <label className={lbl + ' mb-2'}>{t('Araç')}</label>
              <div className="flex flex-col gap-2">
                {vehicles.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, vehicleId: v.id }))}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 text-left ${
                      formData.vehicleId === v.id
                        ? 'border-[var(--color-primary)]/50 bg-[var(--color-primary)]/[0.07]'
                        : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                      formData.vehicleId === v.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-white/20'
                    }`}>
                      {formData.vehicleId === v.id
                        ? <i className="fa-solid fa-check text-[#0a0a0e] text-[9px]" />
                        : <i className="fa-solid fa-car-side text-white/30 text-[9px]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-[12px] font-semibold truncate">{v.name}</div>
                      {v.capacity && <div className="text-white/30 text-[10px]">{t('Kapasite')}: {v.capacity} {t('kişi')}</div>}
                    </div>
                    {formData.vehicleId === v.id && (
                      <i className="fa-solid fa-circle-check text-[var(--color-primary)] text-sm flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className={card}>
                <label className={lbl}>{t('Yolcu')}</label>
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-user-group text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                  <select name="passengers" value={formData.passengers} onChange={handleChange}
                    className="w-full bg-transparent outline-none text-[12px] text-white font-medium appearance-none cursor-pointer">
                    {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(n => (
                      <option key={n} value={n} className="bg-[#0a0a0e] text-white">{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={card}>
                <label className={lbl}>{t('Uçuş No')}</label>
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-plane text-[var(--color-primary)] text-[9px] flex-shrink-0" />
                  <input type="text" name="flightNumber" value={formData.flightNumber} onChange={handleChange}
                    className={inp} placeholder="TK2414" />
                </div>
              </div>
            </div>

            <div className={card}>
              <label className={lbl}>{t('Not / Ek Bilgi')}</label>
              <div className="flex items-start gap-2">
                <i className="fa-regular fa-comment text-[var(--color-primary)] text-[9px] flex-shrink-0 mt-0.5" />
                <input type="text" name="notes" value={formData.notes} onChange={handleChange}
                  className={inp} placeholder={t('Bebek koltuğu, extra bagaj vb. (opsiyonel)')} />
              </div>
            </div>
          </>
        )}

        {/* STEP 3 — Özet */}
        {step === 3 && (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
            {/* Rota */}
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <div className="text-[9px] font-bold text-[var(--color-primary)]/60 uppercase tracking-[0.15em] mb-2">{t('Rota')}</div>
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
              <div className="text-[9px] font-bold text-[var(--color-primary)]/60 uppercase tracking-[0.15em] mb-2">{t('Yolcu')}</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white text-[12px] font-medium">{(formData.firstName + ' ' + formData.lastName).trim() || '-'}</div>
                  <div className="text-white/40 text-[10px] mt-0.5">{formData.countryCode} {formData.phone}</div>
                  {formData.email && <div className="text-white/40 text-[10px]">{formData.email}</div>}
                </div>
                <div className="text-right">
                  <div className="text-white/40 text-[10px]">{formData.passengers} {t('kişi')}</div>
                </div>
              </div>
            </div>
            {/* Araç */}
            <div className="px-4 py-3">
              <div className="text-[9px] font-bold text-[var(--color-primary)]/60 uppercase tracking-[0.15em] mb-2">{t('Araç')}</div>
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
          <span className="text-emerald-400 text-[12px] font-medium">{t("Talebiniz alındı! WhatsApp'a yönlendiriliyorsunuz...")}</span>
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="px-3 sm:px-4 pt-3 pb-2 flex gap-2">
        {step > 0 && (
          <button
            type="button"
            onClick={() => goToStep(step - 1)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-sm font-semibold transition-all duration-200 active:scale-[0.97] min-h-[48px]"
          >
            <i className="fa-solid fa-arrow-left text-xs" />
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => goToStep(step + 1)}
            className="group flex-1 flex items-center justify-center gap-2.5 bg-[var(--color-primary)] hover:bg-[#d4af6a] text-[#0a0a0e] rounded-xl px-5 py-3.5 font-bold text-sm tracking-wide transition-all duration-300 active:scale-[0.98] min-h-[48px]"
          >
            <span>{t('Devam')}</span>
            <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="group flex-1 flex items-center justify-center gap-2.5 bg-[var(--color-primary)] hover:bg-[#d4af6a] text-[#0a0a0e] rounded-xl px-5 py-3.5 font-bold text-sm tracking-wide transition-all duration-300 active:scale-[0.98] min-h-[48px]"
          >
            <i className="fa-brands fa-whatsapp text-lg" />
            <span>{t("WhatsApp'a Gönder")}</span>
            <i className="fa-solid fa-arrow-right text-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
