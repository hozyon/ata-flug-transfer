import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';

const regions = [
  "Alanya", "Belek", "Side", "Kemer", "Manavgat", "Kundu", "Lara", "Antalya Merkez", 
  "Avsallar", "Beldibi", "Bogazkent", "Camyuva", "Cirali", "Colakli", "Demre", 
  "Denizyaka", "Evrenseki", "Finike", "Goynuk", "Gundogdu", "Incekum", "Kalkan", 
  "Kargicak", "Kas", "Kestel", "Kiris", "Kizilagac", "Kizilot", "Konakli", 
  "Konyaalti", "Kumkoy", "Kumluca", "Mahmutlar", "Okurcalar", "Olimpos", 
  "Sorgun", "Tekirova", "Titreyengol", "Turkler"
];

const RegionsDirectory = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleRegions = isExpanded ? regions : regions.slice(0, 12);

  return (
    <section className="bg-brand-dark py-16 px-4 border-t border-brand-gold/10">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-white mb-12 font-playfair uppercase tracking-wider">
          UNSERE TRANSFER-REGIONEN
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all duration-500 overflow-hidden">
          {visibleRegions.map((region, i) => (
            <div 
              key={i} 
              className="flex items-center p-3 rounded-lg border border-brand-gold/10 bg-brand-darker/50 text-slate-400 hover:text-white hover:border-brand-gold/50 hover:bg-brand-gold/10 transition-all cursor-pointer group"
            >
              <MapPin className="w-4 h-4 mr-3 text-brand-gold/50 group-hover:text-brand-gold transition-colors" />
              <span className="text-sm font-medium">{region}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-12 mx-auto flex items-center px-8 py-3 rounded-lg border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-darker transition-all font-semibold uppercase tracking-widest text-sm"
        >
          {isExpanded ? (
            <>Weniger anzeigen <ChevronUp className="ml-2 w-4 h-4" /></>
          ) : (
            <>Mehr anzeigen <ChevronDown className="ml-2 w-4 h-4" /></>
          )}
        </button>
      </div>
    </section>
  );
};

export default RegionsDirectory;
