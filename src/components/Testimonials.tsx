import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  { name: "Lukas", text: "Perfekter VIP-Transfer, sehr pünktlich!", rating: 5 },
  { name: "Anna", text: "Alles super organisiert, danke!", rating: 5 },
  { name: "Jonas", text: "Sehr freundlicher Fahrer und sauberes Auto.", rating: 5 },
  { name: "Sophie", text: "Top Service, absolut empfehlenswert!", rating: 5 },
  { name: "Leon", text: "Schnelle Buchung und zuverlässiger Ablauf.", rating: 5 }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-brand-darker py-24 px-4 border-t border-brand-gold/10 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-white mb-16 font-playfair uppercase tracking-widest">
          ZUFRIEDENE KUNDEN
        </h2>
        
        <div className="relative">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {reviews.map((r, i) => (
              <div key={i} className="min-w-full px-4">
                <div className="bg-brand-dark border border-brand-gold/10 p-10 rounded-2xl max-w-2xl mx-auto relative group hover:border-brand-gold/50 transition-all duration-300">
                  <Quote className="absolute top-6 left-6 w-12 h-12 text-brand-gold/10 group-hover:text-brand-gold/20 transition-colors" />
                  
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center text-brand-darker font-bold text-2xl mb-6 shadow-lg shadow-brand-gold/20">
                      {r.name[0]}
                    </div>
                    
                    <div className="flex space-x-1 mb-6 text-brand-gold">
                      {[...Array(r.rating)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-xl text-slate-300 italic leading-relaxed mb-8 font-light">
                      "{r.text}"
                    </p>
                    
                    <span className="text-brand-gold font-bold tracking-widest uppercase text-sm">
                      {r.name}
                    </span>
                    <span className="text-slate-500 text-xs mt-1 uppercase tracking-tighter">
                      Verifizierter Kunde via Trustindex
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-12 space-x-3">
            {reviews.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'bg-brand-gold w-8' : 'bg-brand-gold/20 hover:bg-brand-gold/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
