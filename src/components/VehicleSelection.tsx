import React from 'react';
import Image from 'next/image';
import { Wind, Banknote, Clock, Wifi, Baby } from 'lucide-react';

const vehicles = [
  {
    name: "PEUGEOT EXPERT TRAVELLER",
    image: "/images/peugeot-expert.png", // Verify this exists or replace with generic
    features: ["Klimaanlage", "Fahrerzahlung", "24/7 Support", "WLAN", "Kindersitz"],
    icons: [<Wind key="1"/>, <Banknote key="2"/>, <Clock key="3"/>, <Wifi key="4"/>, <Baby key="5"/>]
  },
  {
    name: "MERCEDES VITO",
    image: "/images/mercedes-vito.png",
    features: ["Klimaanlage", "Fahrerzahlung", "24/7 Support", "WLAN", "Kindersitz"],
    icons: [<Wind key="1"/>, <Banknote key="2"/>, <Clock key="3"/>, <Wifi key="4"/>, <Baby key="5"/>]
  },
  {
    name: "MERCEDES SPRINTER",
    image: "/images/mercedes-sprinter.png",
    features: ["Klimaanlage", "Fahrerzahlung", "24/7 Support", "WLAN", "Kindersitz"],
    icons: [<Wind key="1"/>, <Banknote key="2"/>, <Clock key="3"/>, <Wifi key="4"/>, <Baby key="5"/>]
  }
];

const VehicleSelection = () => {
  return (
    <section className="bg-brand-dark py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12 font-playfair tracking-wide uppercase">
          BITTE WÄHLEN SIE EIN FAHRZEUG!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vehicles.map((v, i) => (
            <div 
              key={i} 
              className="bg-brand-darker/50 border border-brand-gold/20 rounded-2xl overflow-hidden group hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 cursor-pointer"
            >
              <div className="h-48 relative bg-black/20 overflow-hidden flex items-center justify-center p-4">
                {/* Fallback to placeholder if image not found */}
                <Image 
                  src={v.image} 
                  alt={v.name} 
                  width={300} 
                  height={150} 
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">
                  {v.name}
                </h3>
                <div className="space-y-3 mb-8">
                  {v.features.map((f, j) => (
                    <div key={j} className="flex items-center text-slate-400 text-sm">
                      <span className="text-brand-gold mr-3">
                        {React.cloneElement(v.icons[j] as React.ReactElement, { className: "w-4 h-4" })}
                      </span>
                      {f}
                    </div>
                  ))}
                </div>
                <button className="w-full bg-brand-gold text-brand-darker font-bold py-3 rounded-lg hover:brightness-110 transition-all uppercase tracking-wider">
                  Jetzt wählen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehicleSelection;
