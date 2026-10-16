import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Project } from '../types';
import { useSettings } from '../context/SettingsContext';
import { Building2, MapPin, Calendar, Check, ArrowRight, Loader2, Phone, Mail, CheckCircle2 } from 'lucide-react';

export const ProjectDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { formatPrice, contactPhone, contactEmail } = useSettings();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Inquiry form
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.public
      .getProjectBySlug(slug)
      .then(setProject)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !inquiryName || !inquiryEmail) return;
    setInquiryLoading(true);
    try {
      await api.public.submitEnquiry({
        fullName: inquiryName,
        email: inquiryEmail,
        phone: inquiryPhone,
        message: `Project Brochure & Unit Pricing request for ${project.name}`,
        enquiryType: 'PROJECT_INQUIRY',
      });
      setInquirySubmitted(true);
    } catch {
      alert('Unable to submit inquiry. Please contact us directly.');
    } finally {
      setInquiryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center space-y-3 pt-24">
        <Loader2 className="w-8 h-8 text-[#997e55] animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[#8c8675]">Loading Development Profile...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center pt-24 px-4 text-center">
        <h2 className="font-serif text-2xl text-[#1c1b1a] mb-2">Development Project Not Found</h2>
        <Link to="/projects" className="px-6 py-2.5 bg-[#1c1b1a] text-white text-xs font-semibold uppercase">
          Back to Projects
        </Link>
      </div>
    );
  }

  let amenities: string[] = [];
  try {
    if (project.amenitiesJson) amenities = JSON.parse(project.amenitiesJson);
  } catch {}

  let unitTypes: string[] = [];
  try {
    if (project.unitTypesJson) unitTypes = JSON.parse(project.unitTypesJson);
  } catch {}

  let paymentPlan: any = {};
  try {
    if (project.paymentPlanJson) paymentPlan = JSON.parse(project.paymentPlanJson);
  } catch {}

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1c1b1a] pt-28 pb-24">
      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="relative h-[480px] w-full overflow-hidden border border-[#e7e4dc] bg-[#151413]">
          <img
            src={
              project.heroImage ||
              project.featuredImageUrl ||
              'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1920&q=80'
            }
            alt={project.name}
            className="w-full h-full object-cover filter brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#e4dcce] font-semibold block mb-2">
              {project.developer?.name || 'Master Development'}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-3">
              {project.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/90">
              <span className="flex items-center space-x-1.5 text-[#e4dcce]">
                <MapPin className="w-4 h-4 text-[#997e55]" />
                <span>{project.location?.name || 'Dubai, UAE'}</span>
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 text-[10px] uppercase font-semibold tracking-wider">
                {project.status ? project.status.replace('_', ' ') : 'OFF PLAN'}
              </span>
              {project.completionDate && (
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-[#997e55]" />
                  <span>Completion: {project.completionDate}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          {/* Vision */}
          <div className="border border-[#e7e4dc] bg-white p-8 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#997e55] font-semibold block">
              Architectural Vision
            </span>
            <h2 className="font-serif text-2xl font-normal text-[#1c1b1a]">Master Plan Concept</h2>
            <p className="text-xs sm:text-sm text-[#4a4742] leading-relaxed font-light whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Unit Configurations */}
          {unitTypes.length > 0 && (
            <div className="border border-[#e7e4dc] bg-white p-8 space-y-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#997e55] font-semibold block">
                Portfolio Inventory
              </span>
              <h2 className="font-serif text-2xl font-normal text-[#1c1b1a]">Unit Configurations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {unitTypes.map((u, i) => (
                  <div key={i} className="p-4 border border-[#e7e4dc] bg-[#faf9f6] flex items-center space-x-3 text-xs text-[#1c1b1a]">
                    <Building2 className="w-4 h-4 text-[#997e55] flex-shrink-0" />
                    <span className="font-medium">{u}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Master Amenities */}
          {amenities.length > 0 && (
            <div className="border border-[#e7e4dc] bg-white p-8 space-y-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#997e55] font-semibold block">
                Lifestyle Infrastructure
              </span>
              <h2 className="font-serif text-2xl font-normal text-[#1c1b1a]">Amenities & Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {amenities.map((a, i) => (
                  <div key={i} className="p-3 border border-[#e7e4dc] bg-[#faf9f6] flex items-center space-x-2 text-xs text-[#1c1b1a]">
                    <Check className="w-3.5 h-3.5 text-[#997e55] flex-shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Plan */}
          {Object.keys(paymentPlan).length > 0 && (
            <div className="border border-[#e7e4dc] bg-white p-8 space-y-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#997e55] font-semibold block">
                Investment Structure
              </span>
              <h2 className="font-serif text-2xl font-normal text-[#1c1b1a]">Payment Milestone Schedule</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {Object.entries(paymentPlan).map(([k, v]) => (
                  <div key={k} className="p-5 border border-[#e7e4dc] bg-[#faf9f6] text-center space-y-1">
                    <p className="font-serif text-2xl font-semibold text-[#1c1b1a]">{String(v)}</p>
                    <p className="text-[10px] uppercase tracking-wider text-[#8c8675] capitalize">
                      {k.replace(/([A-Z])/g, ' $1')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-[#e7e4dc] bg-white p-6 sm:p-8 space-y-6 sticky top-24 shadow-sm">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8c8675] block mb-1">Starting Valuation</span>
              <p className="font-serif text-3xl font-semibold text-[#1c1b1a]">
                {project.startingPrice ? formatPrice(project.startingPrice, project.currency) : 'Price On Application'}
              </p>
            </div>

            <div className="pt-4 border-t border-[#f0ede6] space-y-3">
              <h4 className="text-[11px] uppercase tracking-wider text-[#1c1b1a] font-semibold">
                Request Master Dossier
              </h4>
              <p className="text-xs text-[#6e6962] leading-relaxed">
                Receive the official floor plans, brochure, payment schedule, and current unit availability.
              </p>

              {inquirySubmitted ? (
                <div className="p-4 bg-[#faf9f6] border border-[#997e55]/30 text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 text-[#997e55] mx-auto" />
                  <p className="text-xs font-semibold text-[#1c1b1a]">Dossier Requested</p>
                  <p className="text-[11px] text-[#6e6962]">
                    Our project manager will transmit the documentation directly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3 pt-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address *"
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={inquiryLoading}
                    className="w-full py-3 bg-[#1c1b1a] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#2e2b27] transition-colors disabled:opacity-50"
                  >
                    {inquiryLoading ? 'Transmitting...' : 'Download Dossier & Price List'}
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
