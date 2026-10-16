import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import { Mail, Phone, MapPin, ArrowRight, Check } from 'lucide-react';

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
        message: 'Client subscribed to the private portfolio advisory briefing',
        enquiryType: 'GENERAL',
      });
      setSubscribed(true);
      setNewsletterEmail('');
    } catch {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#151413] text-[#a19c91] pt-16 pb-12 border-t border-[#262422]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-14 border-b border-[#262422]">
          {/* Brand & Introduction */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="w-8 h-8 border border-white/20 flex items-center justify-center bg-white/5">
                <span className="font-serif text-base font-semibold text-white">
                  {siteName ? siteName.charAt(0) : 'E'}
                </span>
              </div>
              <span className="font-serif text-lg font-medium tracking-[0.18em] text-white uppercase">
                {siteName || 'Elysian Estates'}
              </span>
            </Link>

            <p className="text-xs text-[#8c8675] leading-relaxed max-w-sm">
              Advising international private clients, family offices, and investors on prime architectural residences, beachfront estates, and prestigious developments.
            </p>

            <div className="pt-2 space-y-2 text-xs text-[#a19c91]">
              {officeAddress && (
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#997e55] flex-shrink-0 mt-0.5" />
                  <span>{officeAddress}</span>
                </div>
              )}
              {contactPhone && (
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-3.5 h-3.5 text-[#997e55] flex-shrink-0" />
                  <span>{contactPhone}</span>
                </div>
              )}
              {contactEmail && (
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-3.5 h-3.5 text-[#997e55] flex-shrink-0" />
                  <span>{contactEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Portfolio Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold">
              Residences
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?transactionType=BUY" className="hover:text-white transition-colors">
                  Properties For Sale
                </Link>
              </li>
              <li>
                <Link to="/properties?transactionType=RENT" className="hover:text-white transition-colors">
                  Luxury Rentals
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">
                  Master Developments
                </Link>
              </li>
              <li>
                <Link to="/locations" className="hover:text-white transition-colors">
                  Prime Locations
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Market Insights
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Private Enquiry
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-[#997e55] hover:text-[#b8a280] transition-colors">
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Private Dossier / Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold">
              Market Intelligence
            </h4>
            <p className="text-xs text-[#8c8675] leading-relaxed">
              Subscribe to receive curated off-market opportunities, market analytics, and new project launches directly.
            </p>

            {subscribed ? (
              <div className="flex items-center space-x-2 text-xs text-[#997e55] bg-[#997e55]/10 p-3 border border-[#997e55]/30">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>Thank you. You are enrolled in our private advisory updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                    className="bg-[#22201e] border border-[#33302c] px-3.5 py-2.5 text-xs text-white placeholder-[#6e6962] focus:outline-none focus:border-[#997e55] flex-1"
                  />
                  <button
                    type="submit"
                    className="bg-[#997e55] text-white px-4 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-[#84683d] transition-colors flex items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-[#6e6962]">
                  Strictly confidential. No marketing spam.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6e6962]">
          <p>© {new Date().getFullYear()} {siteName || 'Elysian Estates'}. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Concierge</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
