import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-darker border-t border-brand-gold/10 pt-16 pb-8 px-4 text-slate-400">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div>
            <h3 className="text-brand-gold text-xl font-bold mb-8 uppercase tracking-widest font-playfair">
              EXCA VIP TRANSFER
            </h3>
            <p className="text-sm leading-relaxed mb-8 max-w-xs">
              Unser Unternehmen bietet Vip Transferdienste am Flughafen Antalya an und legt besonderen Wert auf komfortable ve güvenli taşımacılık.
            </p>
            <div className="flex space-x-6">
              <a href="https://instagram.com/excaviptransfer" className="hover:text-brand-gold transition-all hover:scale-110">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-brand-gold transition-all hover:scale-110">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://wa.me/905452249507" className="hover:text-brand-gold transition-all hover:scale-110">
                <Phone className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-brand-gold font-bold mb-8 uppercase tracking-wider text-sm">
              SCHNELLE LINKS
            </h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Startseite</Link></li>
              <li><Link href="/hakkimizda" className="hover:text-white transition-colors">Über uns</Link></li>
              <li><Link href="/feedback" className="hover:text-white transition-colors">Feedback</Link></li>
              <li><Link href="/iletisim" className="hover:text-white transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          {/* Corporate */}
          <div>
            <h4 className="text-brand-gold font-bold mb-8 uppercase tracking-wider text-sm">
              CARPORATE
            </h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/gizlilik" className="hover:text-white transition-colors">Datenschutzerklärung</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Nutzungsbedingungen</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie-Richtlinie</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-brand-gold font-bold mb-8 uppercase tracking-wider text-sm">
              KONTAKT
            </h4>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start">
                <Phone className="w-5 h-5 mr-4 text-brand-gold flex-shrink-0" />
                <a href="tel:+905452249507" className="hover:text-white transition-colors">+90 545 224 9507</a>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 mr-4 text-brand-gold flex-shrink-0" />
                <a href="mailto:info@excaviptransfer.com" className="hover:text-white transition-colors">info@excaviptransfer.com</a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-4 text-brand-gold flex-shrink-0" />
                <span>Antalya Flughafen, Türkei</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-gold/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} EXCA VIP TRANSFER | Vip Transfer Antalya</p>
          <div className="mt-4 md:mt-0 flex space-x-8">
            <span className="flex items-center">
              <ExternalLink className="w-3 h-3 mr-2" /> 
              DESIGN BY EXCA
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
