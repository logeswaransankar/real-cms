import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Property } from '../types';
import { useSettings } from '../context/SettingsContext';
import { Property3DViewer } from '../components/3d/Property3DViewer';
import { PropertyCard } from '../components/property/PropertyCard';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Calendar,
  Share2,
  Heart,
  CheckCircle2,
  Phone,
  Mail,
  Video,
  FileText,
  Sparkles,
  Box,
  Building,
  Check,
  Clock,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';

export const PropertyDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { formatPrice, contactPhone, contactEmail } = useSettings();

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'gallery' | '3d'>('gallery');

  // Lightbox modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Enquiry & Viewing Modals
  const [viewingModalOpen, setViewingModalOpen] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  // Enquiry Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
    preferredDate: '',
    preferredTime: '10:00 AM - 12:00 PM',
    viewingType: 'IN_PERSON',
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      if (!slug) return;
      setLoading(true);
      try {
        const prop = await api.public.getPropertyBySlug(slug);
        setProperty(prop);
        if (prop.id) {
          const similar = await api.public.getSimilarProperties(prop.id);
          setSimilarProperties(similar);
        }
        if (prop.model3dEnabled) {
          setActiveTab('3d');
        }
      } catch (err) {
        console.error('Error loading property', err);
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    setEnquiryLoading(true);
    try {
      await api.public.submitEnquiry({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message || `Client inquired about ${property.title} (${property.referenceNumber})`,
        propertyId: property.id,
        enquiryType: 'PROPERTY_INQUIRY',
      });
      setEnquirySuccess(true);
    } catch (err) {
      alert('Unable to submit inquiry. Please try again.');
    } finally {
      setEnquiryLoading(false);
    }
  };

  const handleViewingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    setEnquiryLoading(true);
    try {
      await api.public.scheduleViewing({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        message: `VIP Private Viewing request for ${property.title}`,
        propertyId: property.id,
        preferredDate: formData.preferredDate || new Date().toISOString().split('T')[0],
        preferredTime: formData.preferredTime,
        viewingType: formData.viewingType,
      });
      setEnquirySuccess(true);
      setViewingModalOpen(false);
    } catch (err) {
      alert('Unable to schedule viewing. Please try again.');
    } finally {
      setEnquiryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center space-y-4 pt-20">
        <Loader2 className="w-10 h-10 text-champagne-400 animate-spin" />
        <p className="text-xs uppercase tracking-widest text-slate-400">Loading Residence Profile...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center pt-20 px-4 text-center">
        <h2 className="font-serif text-2xl text-white mb-2">Residence Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">The listing you requested could not be found or has been withdrawn.</p>
        <Link to="/properties" className="px-6 py-2.5 rounded-full bg-champagne-400 text-obsidian-900 text-xs font-semibold uppercase">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : [
    { id: 1, imageUrl: property.fallbackImageUrl || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', displayOrder: 1, cover: true }
  ];

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Link to="/" className="hover:text-champagne-300">Home</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-champagne-300">Properties</Link>
            <span>/</span>
            <span className="text-slate-200 truncate max-w-xs">{property.title}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full glass-panel hover:border-champagne-400 text-slate-300 hover:text-white transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 rounded-full glass-panel hover:border-champagne-400 text-slate-300 hover:text-white transition"
              aria-label="Save to Favourites"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Pricing Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider bg-obsidian-900 text-champagne-300 border border-champagne-400/30">
                {property.transactionType === 'BUY' ? 'For Sale' : 'For Rent'}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider bg-white/5 text-slate-300 border border-white/10">
                {property.propertyType}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider bg-white/5 text-slate-300 border border-white/10">
                {property.status.replace('_', ' ')}
              </span>
              {property.model3dEnabled && (
                <span className="px-3 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-400/30 flex items-center space-x-1">
                  <Box className="w-3 h-3" />
                  <span>Interactive 3D Experience</span>
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-medium text-white leading-tight">
              {property.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center space-x-1.5 text-champagne-300 font-medium">
                <MapPin className="w-4 h-4 text-champagne-400" />
                <span>{property.address || property.location?.name || 'Dubai'}</span>
              </span>
              <span className="font-mono text-slate-500">REF: {property.referenceNumber}</span>
              {property.viewsCount && (
                <span className="text-slate-500">{property.viewsCount} views</span>
              )}
            </div>
          </div>

          <div className="lg:text-right space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Valuation</span>
            <span className="font-serif text-3xl sm:text-4xl font-bold gold-gradient-text">
              {formatPrice(property.price, property.currency)}
            </span>
          </div>
        </div>

        {/* View Mode Tabs (High-Res Photos vs Interactive 3D Model) */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex p-1 rounded-xl bg-obsidian-900 border border-white/10">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'gallery'
                  ? 'bg-champagne-400 text-obsidian-900 shadow-glow-gold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Photo Gallery ({images.length})
            </button>
            {property.model3dEnabled && (
              <button
                onClick={() => setActiveTab('3d')}
                className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center space-x-1.5 ${
                  activeTab === '3d'
                    ? 'bg-champagne-400 text-obsidian-900 shadow-glow-gold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>Interactive 3D Model</span>
              </button>
            )}
          </div>

          {activeTab === 'gallery' && (
            <button
              onClick={() => {
                setActivePhotoIndex(0);
                setLightboxOpen(true);
              }}
              className="text-xs text-champagne-300 hover:text-white transition flex items-center space-x-1"
            >
              <span>View Fullscreen</span>
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Media Container: Either 3D Viewer or Architectural Image Grid */}
        <div className="mb-12">
          {activeTab === '3d' && property.model3dEnabled ? (
            <Property3DViewer
              modelUrl={property.model3dUrl}
              enabled={property.model3dEnabled}
              title={property.model3dTitle || property.title}
              fallbackImage={property.fallbackImageUrl || images[0]?.imageUrl}
              cameraPreset={property.model3dCameraPreset}
              lightingPreset={property.model3dLightingPreset}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[480px]">
              {/* Primary Large Cover Photo */}
              <div
                onClick={() => {
                  setActivePhotoIndex(0);
                  setLightboxOpen(true);
                }}
                className="md:col-span-2 h-full rounded-2xl overflow-hidden cursor-pointer group relative shadow-luxury"
              >
                <img
                  src={images[0]?.imageUrl}
                  alt={images[0]?.altText || property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition" />
              </div>

              {/* Secondary Grid Photos */}
              <div className="md:col-span-2 grid grid-cols-2 gap-4 h-full">
                {images.slice(1, 5).map((img: any, idx: number) => (
                  <div
                    key={img.id || idx}
                    onClick={() => {
                      setActivePhotoIndex(idx + 1);
                      setLightboxOpen(true);
                    }}
                    className="h-[232px] rounded-2xl overflow-hidden cursor-pointer group relative shadow-luxury"
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.altText || `${property.title} view ${idx + 2}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Core Specs Metric Badges Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center">
            <Bed className="w-5 h-5 text-champagne-400 mx-auto mb-2" />
            <p className="font-serif text-xl font-semibold text-white">{property.bedrooms}</p>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">Bedrooms</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center">
            <Bath className="w-5 h-5 text-champagne-400 mx-auto mb-2" />
            <p className="font-serif text-xl font-semibold text-white">{property.bathrooms}</p>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">Bathrooms</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center">
            <Maximize2 className="w-5 h-5 text-champagne-400 mx-auto mb-2" />
            <p className="font-serif text-xl font-semibold text-white">
              {Number(property.areaSqft).toLocaleString()}
            </p>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">Built-Up Sq.Ft</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/5 text-center">
            <Calendar className="w-5 h-5 text-champagne-400 mx-auto mb-2" />
            <p className="font-serif text-xl font-semibold text-white">
              {property.completionDate || 'Immediate'}
            </p>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-0.5">Handover Date</p>
          </div>
        </div>

        {/* Content Layout: 2 Columns (Details & Inquiry Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Description Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-medium text-white">Architectural Overview</h2>
              <div className="text-sm text-slate-300 leading-relaxed space-y-3 font-light">
                <p className="whitespace-pre-line">{property.description}</p>
              </div>
            </div>

            {/* Amenities Grid */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-white/5">
                <h2 className="font-serif text-2xl font-medium text-white">Features & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity: any) => (
                    <div
                      key={amenity.id}
                      className="glass-panel p-3.5 rounded-xl border border-white/5 flex items-center space-x-3 text-xs text-slate-200"
                    >
                      <Sparkles className="w-4 h-4 text-champagne-400 flex-shrink-0" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Tour Section if present */}
            {property.videoUrl && (
              <div className="space-y-4 pt-6 border-t border-white/5">
                <h2 className="font-serif text-2xl font-medium text-white flex items-center space-x-2">
                  <Video className="w-5 h-5 text-champagne-400" />
                  <span>Cinematic Video Tour</span>
                </h2>
                <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-obsidian-900">
                  <iframe
                    src={property.videoUrl.replace('watch?v=', 'embed/')}
                    title="Video Tour"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Developer Card if present */}
            {property.developer && (
              <div className="glass-panel p-6 rounded-2xl border border-champagne-400/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-champagne-400 font-semibold block mb-1">
                    Master Creator
                  </span>
                  <h3 className="font-serif text-xl font-medium text-white">{property.developer.name}</h3>
                  <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
                    {property.developer.description}
                  </p>
                </div>
                {property.developer.logoUrl && (
                  <img
                    src={property.developer.logoUrl}
                    alt={property.developer.name}
                    className="w-16 h-16 rounded-xl object-contain bg-white/5 p-2 border border-white/10"
                  />
                )}
              </div>
            )}
          </div>

          {/* Sticky Private Concierge Enquiry Box */}
          <div className="space-y-6">
            <div className="glass-panel p-8 rounded-2xl border border-champagne-400/30 shadow-luxury sticky top-28 space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-champagne-400 font-semibold block mb-1">
                  Private Client Concierge
                </span>
                <h3 className="font-serif text-xl font-medium text-white">Inquire About Residence</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Connect discreetly with our senior architectural broker.
                </p>
              </div>

              {enquirySuccess ? (
                <div className="p-4 rounded-xl bg-champagne-400/10 border border-champagne-400/30 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-champagne-400 mx-auto" />
                  <h4 className="font-serif text-sm font-semibold text-white">Inquiry Received</h4>
                  <p className="text-xs text-slate-300">
                    Our dedicated private advisor will contact you within two hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Sir / Lady / Name"
                      className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-champagne-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                      Private Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@domain.com"
                      className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-champagne-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+971 50 123 4567"
                      className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-champagne-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">
                      Message / Inquiry Details
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify questions regarding floor plans, financing, or private transfer..."
                      className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-champagne-400 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={enquiryLoading}
                    className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne-400 text-obsidian-900 hover:bg-champagne-300 transition shadow-glow-gold flex items-center justify-center space-x-2"
                  >
                    {enquiryLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Submit Private Inquiry</span>
                  </button>
                </form>
              )}

              <div className="pt-4 border-t border-white/5 space-y-3">
                <button
                  type="button"
                  onClick={() => setViewingModalOpen(true)}
                  className="w-full py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider glass-panel text-white hover:border-champagne-400 transition flex items-center justify-center space-x-2"
                >
                  <Clock className="w-3.5 h-3.5 text-champagne-400" />
                  <span>Schedule Private Tour</span>
                </button>

                <div className="text-center pt-2">
                  <p className="text-[11px] text-slate-400">Direct Chauffeur Concierge:</p>
                  <a href={`tel:${contactPhone}`} className="text-xs font-semibold text-champagne-300 hover:text-white transition">
                    {contactPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Residences in the same area */}
        {similarProperties.length > 0 && (
          <div className="mt-24 pt-16 border-t border-white/5">
            <div className="mb-10">
              <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold block mb-1">
                Neighborhood Portfolio
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white">
                Similar Residences in {property.location?.name || 'the Area'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProperties.slice(0, 3).map((sim) => (
                <PropertyCard key={sim.id} property={sim} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full glass-panel text-white hover:text-champagne-400 transition"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
            className="absolute left-6 p-3 rounded-full glass-panel text-white hover:text-champagne-400 transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActivePhotoIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
            className="absolute right-6 p-3 rounded-full glass-panel text-white hover:text-champagne-400 transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="max-w-5xl max-h-[85vh]">
            <img
              src={images[activePhotoIndex]?.imageUrl}
              alt="Fullscreen View"
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
            <p className="text-center text-xs text-slate-400 mt-4">
              {activePhotoIndex + 1} of {images.length} • {images[activePhotoIndex]?.altText || property.title}
            </p>
          </div>
        </div>
      )}

      {/* Schedule Viewing Modal */}
      {viewingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-dropdown max-w-md w-full p-8 rounded-2xl border border-champagne-400/40 shadow-luxury space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-champagne-400 font-semibold block">VIP Booking</span>
                <h3 className="font-serif text-xl font-medium text-white">Schedule Private Viewing</h3>
              </div>
              <button onClick={() => setViewingModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleViewingSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">Viewing Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, viewingType: 'IN_PERSON' })}
                    className={`py-2 rounded-lg text-xs font-semibold uppercase border transition ${
                      formData.viewingType === 'IN_PERSON'
                        ? 'bg-champagne-400 text-obsidian-900 border-champagne-400'
                        : 'border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    In-Person Private Tour
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, viewingType: 'VIDEO_CALL' })}
                    className={`py-2 rounded-lg text-xs font-semibold uppercase border transition ${
                      formData.viewingType === 'VIDEO_CALL'
                        ? 'bg-champagne-400 text-obsidian-900 border-champagne-400'
                        : 'border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    Live Video Consultation
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">Preferred Date *</label>
                <input
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-champagne-400"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">Preferred Time Window</label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-champagne-400"
                >
                  <option value="10:00 AM - 12:00 PM">Morning (10:00 AM - 12:00 PM)</option>
                  <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                  <option value="05:00 PM - 07:00 PM">Sunset Golden Hour (05:00 PM - 07:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-champagne-400"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1 font-medium">Private Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-champagne-400"
                />
              </div>

              <button
                type="submit"
                disabled={enquiryLoading}
                className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne-400 text-obsidian-900 hover:bg-champagne-300 transition shadow-glow-gold"
              >
                Confirm Tour Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
