import React from 'react';
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';

const hotels = [
  { name: "Rubi Platinum", image: "/images/regions/side.png", price: "45€" },
  { name: "Azura Deluxe", image: "/images/regions/alanya.png", price: "50€" },
  { name: "Granada Luxury", image: "/images/regions/belek.png", price: "40€" },
  { name: "Titanic Mardan", image: "/images/regions/kundu.png", price: "35€" }
];

const HotelTransfers = () => {
  return (
    <section className="bg-brand-dark py-24 px-4 border-t border-brand-gold/10">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-center text-white mb-16 font-playfair uppercase tracking-widest">
          TOP HOTELTRANSFER
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {hotels.map((h, i) => (
            <div 
              key={i} 
              className="relative h-[320px] rounded-2xl overflow-hidden group cursor-pointer shadow-2xl shadow-black/50 hover:-translate-y-2 transition-all duration-300"
            >
              <Image 
                src={h.image} 
                alt={h.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
              
              <div className="absolute top-4 right-4 bg-brand-gold text-brand-darker px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-brand-gold/20 flex items-center">
                <Star className="w-4 h-4 mr-2 fill-current" /> Ab {h.price}
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 flex flex-col items-start translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center text-brand-gold/80 text-xs mb-2 uppercase tracking-widest">
                  <MapPin className="w-3 h-3 mr-2" /> Antalya Region
                </div>
                <h3 className="text-white text-xl font-bold font-playfair tracking-wide group-hover:text-brand-gold transition-colors duration-300">
                  {h.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelTransfers;
