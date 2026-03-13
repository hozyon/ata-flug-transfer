import React, { useState } from 'react';
import { DESTINATIONS, BUSINESS_INFO } from '../constants';
import { Booking, Vehicle } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

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

const BookingForm: React.FC<BookingFormProps> = ({ onBookingSubmit, vehicles }) => {
  const { t, language } = useLanguage();

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
    notes: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pickup === formData.destination) {
      alert(t('Nereden ve Nereye aynı olamaz. Lütfen farklı bir rota seçin.'));
      return;
    }
    const fullName = (formData.firstName + ' ' + formData.lastName).trim();
    const fullPhone = formData.countryCode + ' ' + formData.phone;
    const dateFormatted = formatDate(formData.date);
    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

    onBookingSubmit({ ...formData, customerName: fullName, phone: fullPhone, email: formData.email || undefined });

    // Turkish block
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
      msg = [
        '✨ *ATA FLUG TRANSFER* ✨',
        '____________________________',
        '',
        '⭐ *YENİ REZERVASYON TALEBİ*',
        '',
        ...trLines,
        '',
        '✅ _Müsaitlik durumu hakkında bilgi bekliyorum._',
      ].join('\n');
    } else {
      const langFlags: Record<string, string> = {
        en: '🇬🇧', de: '🇩🇪', fr: '🇫🇷', ru: '🇷🇺', ar: '🇸🇦',
      };
      const lf = langFlags[language] || '🌐';

      const lb = {
        title: t('YENİ REZERVASYON TALEBİ'),
        name: t('Ad Soyad'),
        ph: t('Telefon'),
        from: t('Nereden'),
        to: t('Nereye'),
        date: t('Tarih'),
        time: t('Saat'),
        pax: t('Kişi'),
        veh: t('Araç'),
        flt: t('Uçuş No'),
        nt: t('Not'),
      };

      const trLines2 = [
        '👤  ' + lb.name + ': ' + fullName,
        '📱  ' + lb.ph + ': ' + fullPhone,
        '📍  ' + lb.from + ': ' + formData.pickup,
        '🏁  ' + lb.to + ': ' + formData.destination,
        '📅  ' + lb.date + ': ' + dateFormatted,
        '⏰  ' + lb.time + ': ' + formData.time,
        '👥  ' + lb.pax + ': ' + formData.passengers,
        '🚐  ' + lb.veh + ': ' + (selectedVehicle?.name || '-'),
      ];
      if (formData.flightNumber) trLines2.push('✈️  ' + lb.flt + ': ' + formData.flightNumber);
      if (formData.notes) trLines2.push('📝  ' + lb.nt + ': ' + formData.notes);

      msg = [
        '✨ *ATA FLUG TRANSFER* ✨',
        '____________________________',
        '',
        lf + ' *' + lb.title + '*',
        '',
        ...trLines2,
        '',
        '✅ _' + t('Müsaitlik durumu hakkında bilgi bekliyorum.') + '_',
        '',
        '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
        '',
        '🇹🇷 *YENİ REZERVASYON TALEBİ*',
        '',
        ...trLines,
        '',
        '✅ _Müsaitlik durumu hakkında bilgi bekliyorum._',
      ].join('\n');
    }

    // Detect mobile vs desktop
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const waUrl = isMobile
      ? 'https://api.whatsapp.com/send?phone=' + BUSINESS_INFO.whatsapp + '&text=' + encodeURIComponent(msg)
      : 'https://web.whatsapp.com/send?phone=' + BUSINESS_INFO.whatsapp + '&text=' + encodeURIComponent(msg);
    setTimeout(() => { window.open(waUrl, '_blank'); }, 100);
    setFormData(initialState);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const card = "rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 focus-within:border-[#c5a059]/30 transition-colors";
  const lbl = "block text-[9px] font-bold text-[#c5a059]/60 uppercase tracking-[0.15em] mb-0.5";
  const inp = "w-full bg-transparent outline-none text-[12px] text-white font-medium placeholder-white/20";

  return (
    <div className="w-full overflow-hidden">
      <form onSubmit={handleSubmit} className="px-4 pb-2 flex flex-col gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>

        {/* Nereden / Nereye */}
        <div className="relative">
          <div className="flex flex-col gap-0 rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
            <div className="px-3 py-2.5 focus-within:bg-white/[0.05]">
              <label className={lbl}>{t('Nereden')}</label>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-circle-dot text-[#c5a059] text-[9px] flex-shrink-0"></i>
                <select name="pickup" value={formData.pickup} onChange={handleChange}
                  className="w-full bg-transparent outline-none text-[12px] text-white font-medium appearance-none cursor-pointer truncate">
                  {DESTINATIONS.map(d => <option key={d} value={d} className="bg-[#0a0a0e] text-white">{d}</option>)}
                </select>
              </div>
            </div>
            <div className="border-t border-white/[0.06] mx-3"></div>
            <div className="px-3 py-2.5 focus-within:bg-white/[0.05]">
              <label className={lbl}>{t('Nereye')}</label>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-location-dot text-[#c5a059] text-[9px] flex-shrink-0"></i>
                <select name="destination" value={formData.destination} onChange={handleChange}
                  className="w-full bg-transparent outline-none text-[12px] text-white font-medium appearance-none cursor-pointer truncate">
                  {DESTINATIONS.map(d => <option key={d} value={d} className="bg-[#0a0a0e] text-white">{d}</option>)}
                </select>
              </div>
            </div>
          </div>
          <button type="button" onClick={handleSwapLocations}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#0a0a0e] border border-white/[0.1] shadow-lg hover:border-[#c5a059]/40 flex items-center justify-center text-white/40 hover:text-[#c5a059] transition-all active:scale-90 z-10">
            <i className="fa-solid fa-arrow-right-arrow-left text-[9px] rotate-90"></i>
          </button>
        </div>

        {/* Ad + Soyad */}
        <div className="grid grid-cols-2 gap-2">
          <div className={card}>
            <label className={lbl}>{t('Ad')}</label>
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-user text-[#c5a059] text-[9px] flex-shrink-0"></i>
              <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                className={inp} placeholder={t('Adınız')} />
            </div>
          </div>
          <div className={card}>
            <label className={lbl}>{t('Soyad')}</label>
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-user text-[#c5a059] text-[9px] flex-shrink-0"></i>
              <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                className={inp} placeholder={t('Soyadınız')} />
            </div>
          </div>
        </div>

        {/* E-posta */}
        <div className={card}>
          <label className={lbl}>{t('E-posta')}</label>
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-envelope text-[#c5a059] text-[9px] flex-shrink-0"></i>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className={inp} placeholder="ornek@email.com" />
          </div>
        </div>

        {/* Telefon */}
        <div className={card}>
          <label className={lbl}>{t('Telefon')}</label>
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-phone text-[#c5a059] text-[9px] flex-shrink-0"></i>
            <select name="countryCode" value={formData.countryCode} onChange={handleChange}
              className="bg-transparent outline-none text-[12px] text-white font-medium appearance-none cursor-pointer shrink-0" style={{ width: '78px' }}>
              {COUNTRY_CODES.map(cc => (
                <option key={cc.code} value={cc.code} className="bg-[#0a0a0e] text-white">{cc.flag} {cc.code}</option>
              ))}
            </select>
            <div className="w-px h-4 bg-white/10 flex-shrink-0"></div>
            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange}
              className={inp + ' flex-1'} placeholder="555 123 4567" />
          </div>
        </div>

        {/* Tarih + Saat */}
        <div className="grid grid-cols-2 gap-2">
          <div className={card}>
            <label className={lbl}>{t('Tarih')}</label>
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-calendar text-[#c5a059] text-[9px] flex-shrink-0"></i>
              <input required type="date" name="date" value={formData.date} onChange={handleChange}
                min={today}
                className={inp + ' cursor-pointer [color-scheme:dark]'} />
            </div>
          </div>
          <div className={card}>
            <label className={lbl}>{t('Saat')}</label>
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-clock text-[#c5a059] text-[9px] flex-shrink-0"></i>
              <input required type="time" name="time" value={formData.time} onChange={handleChange}
                className={inp + ' cursor-pointer [color-scheme:dark]'} />
            </div>
          </div>
        </div>

        {/* Yolcu + Araç + Uçuş */}
        <div className="grid grid-cols-3 gap-2">
          <div className={card}>
            <label className={lbl}>{t('Yolcu')}</label>
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-user-group text-[#c5a059] text-[9px] flex-shrink-0"></i>
              <select name="passengers" value={formData.passengers} onChange={handleChange}
                className="w-full bg-transparent outline-none text-[12px] text-white font-medium appearance-none cursor-pointer">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(n => (
                  <option key={n} value={n} className="bg-[#0a0a0e] text-white">{n}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={card}>
            <label className={lbl}>{t('Araç')}</label>
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-car-side text-[#c5a059] text-[9px] flex-shrink-0"></i>
              <select name="vehicleId" value={formData.vehicleId} onChange={handleChange}
                className="w-full bg-transparent outline-none text-[12px] text-white font-medium appearance-none cursor-pointer truncate">
                {vehicles.map(v => <option key={v.id} value={v.id} className="bg-[#0a0a0e] text-white">{v.name}</option>)}
              </select>
            </div>
          </div>
          <div className={card}>
            <label className={lbl}>{t('Uçuş No')}</label>
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-plane text-[#c5a059] text-[9px] flex-shrink-0"></i>
              <input type="text" name="flightNumber" value={formData.flightNumber} onChange={handleChange}
                className={inp} placeholder="TK2414" />
            </div>
          </div>
        </div>

        {/* Notlar */}
        <div className={card}>
          <label className={lbl}>{t('Not / Ek Bilgi')}</label>
          <div className="flex items-start gap-2">
            <i className="fa-regular fa-comment text-[#c5a059] text-[9px] flex-shrink-0 mt-0.5"></i>
            <input type="text" name="notes" value={formData.notes} onChange={handleChange}
              className={inp} placeholder={t('Bebek koltuğu, extra bagaj vb. (opsiyonel)')} />
          </div>
        </div>

        {/* Toast */}
        {showToast && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-check text-white text-[10px]"></i>
            </div>
            <span className="text-emerald-400 text-[12px] font-medium">{t('Talebiniz alındı! WhatsApp\'a yönlendiriliyorsunuz...')}</span>
          </div>
        )}

        {/* Submit */}
        <button type="submit"
          className="group w-full bg-[#c5a059] hover:bg-[#d4af6a] text-[#0a0a0e] rounded-xl px-5 py-3 font-bold text-sm tracking-wide transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2.5 mt-1">
          <i className="fa-brands fa-whatsapp text-lg"></i>
          <span>{t("Teklif Al & WhatsApp'a Gönder")}</span>
          <i className="fa-solid fa-arrow-right text-xs opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></i>
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
