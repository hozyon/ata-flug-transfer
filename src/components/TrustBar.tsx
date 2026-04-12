import React from 'react';
import { Clock, ShieldCheck, Users, Car } from 'lucide-react';

const TrustBar = () => {
  const features = [
    {
      icon: <Clock className="w-8 h-8 text-brand-gold" />,
      title: "24/7 Service",
      subtitle: "PROFESSIONELLER SUPPORT"
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-brand-gold" />,
      title: "100% Sicher",
      subtitle: "SICHERER TRANSFER"
    },
    {
      icon: <Users className="w-8 h-8 text-brand-gold" />,
      title: "10K+ Kunden",
      subtitle: "ZUFRIEDENE KUNDEN"
    },
    {
      icon: <Car className="w-8 h-8 text-brand-gold" />,
      title: "VIP Fahrzeuge",
      subtitle: "LUXURIÖSE FLOTTE"
    }
  ];

  return (
    <section className="bg-brand-darker border-y border-brand-gold/10 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col md:flex-row items-center justify-center text-center md:text-left group hover:scale-105 transition-transform duration-200"
            >
              <div className="mb-3 md:mb-0 md:mr-4">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg leading-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-[10px] md:text-xs uppercase tracking-wider mt-1">
                  {feature.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
