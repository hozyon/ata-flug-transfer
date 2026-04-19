import React, { useState } from 'react';
import { Booking, Vehicle } from '../types';
import { useAppStore } from '../store/useAppStore';

const COUNTRY_CODES = [
  { code: '+90', flag: '🇹🇷', name: 'TR' },
  { code: '+49', flag: '🇩🇪', name: 'DE' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+33', flag: '🇫🇷', name: 'FR' },
  { code: '+7', flag: '🇷🇺', name: 'RU' },
  { code: '+1', flag: '🇺🇸', name: 'US' },
  { code: '+31', flag: '🇳🇱', name: 'NL' },
  { code: '+32', flag: '🇧🇪', name: 'BE' },
  { code: '+43', flag: '🇦🇹', name: 'AT' },
  { code: '+41', flag: '🇨🇭', name: 'CH' },
  { code: '+46', flag: '🇸🇪', name: 'SE' },
  { code: '+47', flag: '🇳🇴', name: 'NO' },
  { code: '+45', flag: '🇩🇰', name: 'DK' },
];

interface BookingFormProps {
  onBookingSubmit: (booking: Partial<Booking>) => void;
  vehicles: Vehicle[];
}

const STEPS = ['ROTA', 'YOLCU', 'ARAÇ', 'ÖZET'] as const;

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
      if (!formData.date) e.date = 'Tarih gerekli.';
      if (!formData.time) e.time = 'Saat gerekli.';
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
    }, 300);
  };

  const handleSubmit = () => {
    const fullName = (formData.firstName + ' ' + formData.lastName).trim();
    const fullPhone = formData.countryCode + ' ' + formData.phone;
    const dateFormatted = formatDate(formData.date);
    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

    onBookingSubmit({ ...formData, customerName: fullName, phone: fullPhone, email: formData.email || undefined });

    const trLines = [
      'AD SOYAD: ' + fullName,
      'TELEFON: ' + fullPhone,
      'NEREDEN: ' + formData.pickup,
      'NEREYE: ' + formData.destination,
      'TARİH: ' + dateFormatted,
      'SAAT: ' + formData.time,
      'KİŞİ: ' + formData.passengers,
      'ARAÇ: ' + (selectedVehicle?.name || '-'),
    ];
    if (formData.flightNumber) trLines.push('UÇUŞ NO: ' + formData.flightNumber);
    if (formData.notes) trLines.push('NOT: ' + formData.notes);

    const msg = [`[${businessName} - REZERVASYON]`, '', ...trLines].join('\n');

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

  const card = "border border-gray-200 bg-white px-5 py-4 min-h-[64px] focus-within:border-gray-900 shadow-sm transition-all duration-300";
  const lbl = "block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2";
  const inp = "w-full bg-transparent border-none outline-none text-base text-gray-900 font-medium placeholder-gray-300 font-outfit";
  const errTxt = "text-red-500 text-[10px] mt-2 font-medium tracking-wide uppercase";

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

  const slideClass = animating
    ? (direction === 'forward' ? 'opacity-0 translate-y-4' : 'opacity-0 -translate-y-4')
    : 'opacity-100 translate-y-0';

  return (
    <div className="w-full h-full flex flex-col font-outfit text-gray-900 pb-10">

      {/* ── Step Indicator (Minimal Dots / Lines) ── */}
      <div className="flex items-center gap-4 mb-12">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <button
              type="button"
              onClick={() => i < step && goToStep(i)}
              className={`w-full text-left outline-none transition-all duration-500 ${i <= step ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className={`text-[9px] font-bold uppercase tracking-[0.2em] mb-2 block transition-colors ${i === step ? 'text-gray-900' : (i < step ? 'text-gray-400 hover:text-gray-900' : 'text-gray-300')}`}>
                0{i + 1} // {label}
              </span>
              <div className={`h-[1px] w-full transition-colors duration-500 ${i <= step ? 'bg-gray-900' : 'bg-gray-200'}`} />
            </button>
          </div>
        ))}
      </div>

      {/* ── Step Content ── */}
      <div className={`flex flex-col gap-4 flex-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${slideClass}`}>

        {/* STEP 0 — Rota */}
        {step === 0 && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative border border-gray-200 bg-white shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100">
                <label htmlFor="bf-pickup" className={lbl}>Nereden</label>
                <select id="bf-pickup" name="pickup" value={formData.pickup} onChange={handleChange}
                  className="w-full bg-transparent outline-none text-2xl text-gray-900 font-playfair font-medium appearance-none cursor-pointer">
                  <option value="" disabled hidden>Seçiniz</option>
                  {siteContent.regions.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div className="px-6 py-5">
                <label htmlFor="bf-destination" className={lbl}>Nereye</label>
                <select id="bf-destination" name="destination" value={formData.destination} onChange={handleChange}
                  className="w-full bg-transparent outline-none text-2xl text-gray-900 font-playfair font-medium appearance-none cursor-pointer">
                  <option value="" disabled hidden>Seçiniz</option>
                  {siteContent.regions.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              
              <button type="button" onClick={handleSwapLocations}
                className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all hover:bg-gray-50 active:scale-95 z-10 shadow-sm">
                <i className="fa-solid fa-arrow-down-up-across-line" />
              </button>
            </div>
            {errors.route && <p className={errTxt}>{errors.route}</p>}

            <div className="grid grid-cols-2 gap-4">
              <div className={card}>
                <label htmlFor="bf-date" className={lbl}>Tarih</label>
                <input id="bf-date" required type="date" name="date" value={formData.date} onChange={handleChange} min={today} className={inp + ' cursor-pointer'} />
                {errors.date && <p className={errTxt}>{errors.date}</p>}
              </div>
              <div className={card}>
                <label htmlFor="bf-time" className={lbl}>Saat</label>
                <input id="bf-time" required type="time" name="time" value={formData.time} onChange={handleChange} className={inp + ' cursor-pointer'} />
                {errors.time && <p className={errTxt}>{errors.time}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 1 — Kişi */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={card}>
                <label htmlFor="bf-firstName" className={lbl}>İlk İsminiz</label>
                <input id="bf-firstName" required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inp} placeholder="JOHN" />
                {errors.firstName && <p className={errTxt}>{errors.firstName}</p>}
              </div>
              <div className={card}>
                <label htmlFor="bf-lastName" className={lbl}>Soy İsim</label>
                <input id="bf-lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inp} placeholder="DOE" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={card}>
                <label htmlFor="bf-phone" className={lbl}>İletişim Numarası</label>
                <div className="flex bg-gray-50 p-1 border border-gray-100">
                  <select aria-label="Ülke kodu" name="countryCode" value={formData.countryCode} onChange={handleChange}
                    className="w-[85px] bg-transparent outline-none text-sm text-gray-600 font-medium appearance-none cursor-pointer px-2">
                    {COUNTRY_CODES.map(cc => <option key={cc.code} value={cc.code}>{cc.flag} {cc.code}</option>)}
                  </select>
                  <input id="bf-phone" required type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inp + ' flex-1 bg-white px-3'} placeholder="555 123 4567" />
                </div>
                {errors.phone && <p className={errTxt}>{errors.phone}</p>}
              </div>
              <div className={card}>
                <label htmlFor="bf-email" className={lbl}>E-Posta Adresi (Opsiyonel)</label>
                <input id="bf-email" type="email" name="email" value={formData.email} onChange={handleChange} className={inp} placeholder="mail@example.com" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Araç Detay */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <div className="space-y-3">
              <label className={lbl}>Araç Segmenti Seçimi</label>
              {vehicles.map(v => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, vehicleId: v.id }))}
                  className={`w-full flex items-center justify-between px-6 py-5 border transition-all duration-300 text-left ${
                    formData.vehicleId === v.id
                      ? 'border-gray-900 bg-[#fefefe] shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-400'
                  }`}
                >
                  <div>
                    <div className={`text-xl font-playfair font-bold mb-1 transition-colors ${formData.vehicleId === v.id ? 'text-gray-900' : 'text-gray-600'}`}>
                      {v.name}
                    </div>
                    {v.capacity && <div className="text-gray-400 text-[10px] tracking-widest uppercase font-bold">Maks. {v.capacity} Yolcu Kapasitesi</div>}
                  </div>
                  <div className={`w-6 h-6 border rounded-full flex items-center justify-center transition-all ${
                    formData.vehicleId === v.id ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                  }`}>
                    {formData.vehicleId === v.id && <div className="w-2 h-2 bg-white rounded-full bg-white" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={card}>
                <label htmlFor="bf-passengers" className={lbl}>Toplam Ziyaretçi</label>
                <select id="bf-passengers" name="passengers" value={formData.passengers} onChange={handleChange} className="w-full bg-transparent outline-none text-xl text-gray-900 font-playfair appearance-none cursor-pointer">
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n} Kişi</option>)}
                </select>
              </div>
              <div className={card}>
                <label htmlFor="bf-flightNumber" className={lbl}>Uçuş Kodu (Gelişler İçin)</label>
                <input id="bf-flightNumber" type="text" name="flightNumber" value={formData.flightNumber} onChange={handleChange} className={inp} placeholder="TK2414 vb." />
              </div>
            </div>

            <div className={card}>
              <label htmlFor="bf-notes" className={lbl}>Vurgulanacak Detaylar & Talepler</label>
              <textarea id="bf-notes" rows={2} name="notes" value={formData.notes} onChange={handleChange} className={inp + ' resize-none'} placeholder="Çocuk koltuğu gerekliliği, bagaj hacmi vb." />
            </div>
          </div>
        )}

        {/* STEP 3 — Özet */}
        {step === 3 && (
          <div className="border border-gray-200 bg-white shadow-sm animate-in fade-in zoom-in-95 duration-500">
            <div className="p-8 border-b border-gray-200">
              <div className="flex justify-between items-start mb-8">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">Menşei • İstikamet</span>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 text-right">{formatDate(formData.date)}<br/>{formData.time}</span>
              </div>
              <div className="text-4xl font-playfair font-medium text-gray-900 tracking-tight leading-tight">
                {formData.pickup} <br/>
                <span className="text-gray-300 mx-2">→</span> <br/>
                {formData.destination}
              </div>
            </div>

            <div className="p-8 grid grid-cols-2 sm:grid-cols-3 gap-8 border-b border-gray-200 bg-gray-50/50">
              <div>
                <span className="block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-2">Başvuran</span>
                <p className="text-base font-bold text-gray-900">{(formData.firstName + ' ' + formData.lastName).trim() || '-'}</p>
              </div>
              <div>
                <span className="block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-2">İletişim Hattı</span>
                <p className="text-base font-bold text-gray-900">{formData.countryCode} {formData.phone}</p>
              </div>
              <div>
                <span className="block text-[9px] font-black uppercase tracking-[0.25em] text-gray-400 mb-2">Misafir & Araç Tipi</span>
                <p className="text-base font-bold text-gray-900">{formData.passengers} Kişi — {selectedVehicle?.name || '-'}</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {showToast && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white font-bold text-xs tracking-widest uppercase animate-in fade-in shadow-2xl z-50">
          <i className="fa-solid fa-check" /> <span>Onaya Yönlendiriliyor</span>
        </div>
      )}

      {/* ── CTA BUTTONS ── */}
      <div className="mt-12 flex gap-4 shrink-0 transition-all duration-500">
        {step > 0 && (
          <button type="button" onClick={() => goToStep(step - 1)} className="w-[60px] h-[60px] flex items-center justify-center border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-900 transition-colors bg-white shrink-0">
            <i className="fa-solid fa-arrow-left" />
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={() => goToStep(step + 1)} className="flex-1 h-[60px] bg-gray-900 text-white font-bold text-xs tracking-[0.2em] uppercase transition-all hover:bg-gray-800 flex items-center justify-center gap-4">
            <span>Kaydet & Devam Et</span> <i className="fa-solid fa-arrow-right text-[10px]" />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} className="flex-1 h-[60px] bg-gray-900 text-white border border-gray-900 font-bold text-xs tracking-[0.2em] uppercase transition-all hover:bg-white hover:text-gray-900 flex items-center justify-center gap-4 shadow-xl">
            <span>Talebi Ulaştır</span>
          </button>
        )}
      </div>

    </div>
  );
};

export default BookingForm;
