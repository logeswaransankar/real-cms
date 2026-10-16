import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { siteName, contactEmail, contactPhone, officeAddress } = useSettings();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await api.public.submitEnquiry({
        fullName: 'Newsletter Subscriber',
        email: newsletterEmail,
        message: 'Client subscribed to weekly private collection portfolio briefing',
        enquiryType: 'GENERAL',
      });
      setSubscribed(true);
      setNewsletterEmail('');
    } catch {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-obsidian-950 border-t border-champagne-400/20 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full border border-champagne-400 flex items-center justify-center bg-obsidian-900">
                <span className="font-serif text-base font-bold gold-gradient-text">E</span>
              </div>
              <span className="font-serif text-xl font-semibold tracking-[0.2em] text-white uppercase">
                {siteName}
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Curating exceptional architectural residences, private waterfront estates, and branded penthouses for the world’s most discerning collectors and family offices.
            </p>
            <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-champagne-400 flex-shrink-0" />
                <span>{officeAddress}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-champagne-400 flex-shrink-0" />
                <span>{contactPhone}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-champagne-400 flex-shrink-0" />
                <span>{contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Portfolio Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-xs uppercase tracking-widest text-slate-200 font-semibold">
              Portfolio
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/properties" className="hover:text-champagne-300 transition">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?transactionType=BUY" className="hover:text-champagne-300 transition">
                  Residences For Sale
                </Link>
              </li>
              <li>
                <Link to="/properties?transactionType=RENT" className="hover:text-champagne-300 transition">
                  Ultra-Prime Rentals
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-champagne-300 transition">
                  Master Developments
                </Link>
              </li>
              <li>
                <Link to="/locations" className="hover:text-champagne-300 transition">
                  Prime Locations
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-xs uppercase tracking-widest text-slate-200 font-semibold">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-champagne-300 transition">
                  About Elysian
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-champagne-300 transition">
                  Journal & Intelligence
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-champagne-300 transition">
                  Private Concierge
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-champagne-300 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-champagne-300 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-champagne-400/80 hover:text-champagne-300 transition flex items-center space-x-1">
                  <span>CMS Portal</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Private Dossier Briefing */}
          <div className="space-y-3">
            <h4 className="font-serif text-xs uppercase tracking-widest text-slate-200 font-semibold">
              Private Dossier
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive confidential off-market notifications and quarterly luxury analytics directly.
            </p>
            {subscribed ? (
              <div className="flex items-center space-x-2 text-xs text-champagne-400 bg-champagne-400/10 p-3 rounded-lg border border-champagne-400/20">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>You have been added to the confidential briefing.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Private email..."
                    required
                    className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-champagne-400 transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-champagne-400 hover:bg-champagne-300 text-obsidian-900 rounded-md transition flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved. Ultra-Luxury Real Estate Advisory.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-slate-400 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition">Terms of Service</Link>
            <Link to="/admin" className="hover:text-champagne-400 transition">CMS Administration</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
