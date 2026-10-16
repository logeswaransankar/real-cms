import React, { useState } from 'react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { siteName, contactEmail, contactPhone, officeAddress } = useSettings();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.public.submitEnquiry({
        ...formData,
        enquiryType: 'GENERAL',
      });
      setSubmitted(true);
      setFormData({ fullName: '', email: '', phone: '', message: '' });
    } catch {
      alert('Unable to submit your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold block mb-2">
            Private Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white">
            Connect With Our Advisory
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl font-light">
            We invite confidential conversations regarding acquisitions, off-market listings, or portfolio advisory.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details Card */}
          <div className="space-y-8">
            <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
              <h3 className="font-serif text-xl font-medium text-white">Headquarters & Private Office</h3>
              
              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-champagne-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Boulevard Plaza Office</h4>
                    <p className="text-slate-400 mt-0.5">{officeAddress}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-champagne-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Telephone Concierge</h4>
                    <a href={`tel:${contactPhone}`} className="text-champagne-300 hover:text-white mt-0.5 block">
                      {contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-champagne-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Confidential Correspondence</h4>
                    <a href={`mailto:${contactEmail}`} className="text-champagne-300 hover:text-white mt-0.5 block">
                      {contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-champagne-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Advisory Hours</h4>
                    <p className="text-slate-400 mt-0.5">Monday – Saturday: 09:00 – 20:00 (GST) • 24/7 VIP On-Call</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map visual card */}
            <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 relative">
              <img
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80"
                alt="Downtown Dubai"
                className="w-full h-full object-cover filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent flex items-end p-6">
                <span className="text-xs text-champagne-300 font-medium">
                  Centrally located in Boulevard Plaza, Downtown Dubai
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass-panel p-8 rounded-2xl border border-champagne-400/30 shadow-luxury space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-medium text-white">Submit a Private Inquiry</h3>
              <p className="text-xs text-slate-400 mt-1">
                Please complete the form below. An executive advisory partner will reach out promptly.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-xl bg-champagne-400/10 border border-champagne-400/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-champagne-400 mx-auto" />
                <h4 className="font-serif text-lg font-medium text-white">Transmission Successful</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Thank you for contacting {siteName}. Your inquiry has been forwarded to our managing partners.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 rounded-full bg-champagne-400 text-obsidian-900 text-xs font-semibold uppercase tracking-wider"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Lord Alexander Sterling"
                    className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-champagne-400 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-champagne-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+971 50 123 4567"
                      className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-champagne-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                    Inquiry Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the property, acquisition requirements, or desired locations..."
                    className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-champagne-400 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne-400 text-obsidian-900 hover:bg-champagne-300 transition shadow-glow-gold flex items-center justify-center space-x-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Submit Inquiry to Concierge</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
