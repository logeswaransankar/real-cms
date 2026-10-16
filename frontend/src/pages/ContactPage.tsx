import React, { useState } from 'react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { MapPin, Phone, Mail, Clock, CheckCircle2, Loader2 } from 'lucide-react';

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
      alert('Unable to submit your message. Please contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1c1b1a] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pb-4 border-b border-[#e7e4dc]">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#997e55] font-semibold block mb-1">
            Private Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1c1b1a]">
            Connect With Our Advisory
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6962] mt-2 max-w-xl font-light">
            We invite confidential conversations regarding acquisitions, off-market opportunities, or portfolio structuring.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="border border-[#e7e4dc] bg-white p-8 space-y-6">
              <h3 className="font-serif text-xl font-normal text-[#1c1b1a]">
                Headquarters & Private Office
              </h3>

              <div className="space-y-5 text-xs text-[#5c5851]">
                {officeAddress && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-[#997e55] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#1c1b1a]">Private Advisory Suite</h4>
                      <p className="text-[#6e6962] mt-0.5 leading-relaxed">{officeAddress}</p>
                    </div>
                  </div>
                )}

                {contactPhone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="w-4 h-4 text-[#997e55] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#1c1b1a]">Telephone Concierge</h4>
                      <a href={`tel:${contactPhone}`} className="text-[#997e55] hover:underline mt-0.5 block">
                        {contactPhone}
                      </a>
                    </div>
                  </div>
                )}

                {contactEmail && (
                  <div className="flex items-start space-x-3">
                    <Mail className="w-4 h-4 text-[#997e55] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-[#1c1b1a]">Confidential Correspondence</h4>
                      <a href={`mailto:${contactEmail}`} className="text-[#997e55] hover:underline mt-0.5 block">
                        {contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-[#997e55] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#1c1b1a]">Advisory Hours</h4>
                    <p className="text-[#6e6962] mt-0.5 leading-relaxed">
                      Monday – Saturday: 09:00 – 19:00 (GST) • 24/7 VIP On-Call
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Photography Card */}
            <div className="border border-[#e7e4dc] overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80"
                alt="Downtown Dubai"
                className="w-full aspect-[16/9] object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
                <span className="text-xs text-white/90 font-medium">
                  Centrally located in Boulevard Plaza, Downtown Dubai
                </span>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="border border-[#e7e4dc] bg-white p-8 sm:p-10 space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-normal text-[#1c1b1a]">
                  Submit a Confidential Inquiry
                </h3>
                <p className="text-xs text-[#6e6962] mt-1">
                  Please complete the form below. An executive advisory partner will reach out within 24 hours.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 bg-[#faf9f6] border border-[#997e55]/30 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-[#997e55] mx-auto" />
                  <h4 className="font-serif text-lg font-medium text-[#1c1b1a]">
                    Transmission Successful
                  </h4>
                  <p className="text-xs text-[#6e6962] leading-relaxed max-w-sm mx-auto">
                    Thank you for contacting {siteName || 'Elysian Estates'}. Your inquiry has been forwarded to our senior advisory partners.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 bg-[#1c1b1a] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#2e2b27] transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8c8675] mb-1 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Lord Alexander Sterling"
                      className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3.5 py-2.5 text-xs text-[#1c1b1a] focus:outline-none focus:border-[#1c1b1a]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#8c8675] mb-1 font-medium">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alexander@domain.com"
                        className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3.5 py-2.5 text-xs text-[#1c1b1a] focus:outline-none focus:border-[#1c1b1a]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#8c8675] mb-1 font-medium">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+971 50 000 0000"
                        className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3.5 py-2.5 text-xs text-[#1c1b1a] focus:outline-none focus:border-[#1c1b1a]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8c8675] mb-1 font-medium">
                      Message / Acquisition Requirements
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your acquisition or advisory interest in detail..."
                      className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3.5 py-2.5 text-xs text-[#1c1b1a] focus:outline-none focus:border-[#1c1b1a]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#1c1b1a] hover:bg-[#2e2b27] text-white text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Transmitting...' : 'Submit Confidential Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
