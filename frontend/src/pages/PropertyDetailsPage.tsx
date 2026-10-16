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
  Box,
  Building2,
  Check,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const PropertyDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { formatPrice, contactPhone, contactEmail } = useSettings();

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | '3d'>('photos');

  // Lightbox modal state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // VIP Viewing Modal
  const [viewingModalOpen, setViewingModalOpen] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  // Sidebar Form State
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
          // If 3D model is active, user can switch or default to photos
          setActiveMediaTab('photos');
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
    } catch {
      alert('Unable to submit inquiry. Please contact us directly.');
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
    } catch {
      alert('Unable to schedule viewing. Please try again.');
    } finally {
      setEnquiryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center space-y-3 pt-24">
        <Loader2 className="w-8 h-8 text-[#997e55] animate-spin" />
        <p className="text-xs uppercase tracking-widest text-[#8c8675]">
          Loading Residence Profile...
        </p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center pt-24 px-4 text-center">
        <h2 className="font-serif text-2xl text-[#1c1b1a] mb-2">Residence Not Found</h2>
        <p className="text-xs text-[#6e6962] mb-6">
          The listing you requested could not be located or has been transferred off-market.
        </p>
        <Link
          to="/properties"
          className="px-6 py-2.5 bg-[#1c1b1a] text-white text-xs font-semibold uppercase tracking-wider"
        >
          Back to Portfolio
        </Link>
      </div>
    );
  }

  const images =
    property.images && property.images.length > 0
      ? property.images
      : [
          {
            id: 1,
            imageUrl:
              property.fallbackImageUrl ||
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
            displayOrder: 1,
            cover: true,
          },
        ];

  // Calculate Price per sqft when data is available
  const pricePerSqft =
    property.price && property.areaSqft && Number(property.areaSqft) > 0
      ? Math.round(Number(property.price) / Number(property.areaSqft))
      : null;

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1c1b1a] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. BREADCRUMBS & TOP ACTIONS */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 text-xs text-[#6e6962]">
          <div className="flex items-center space-x-2">
            <Link to="/" className="hover:text-[#1c1b1a] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-[#1c1b1a] transition-colors">Properties</Link>
            <span>/</span>
            {property.location && (
              <>
                <Link
                  to={`/properties?locationId=${property.location.id}`}
                  className="hover:text-[#1c1b1a] transition-colors"
                >
                  {property.location.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-[#1c1b1a] font-medium truncate max-w-xs">{property.title}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 border border-[#e7e4dc] bg-white text-[#1c1b1a] hover:border-[#1c1b1a] transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#997e55]" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-1.5 border border-[#e7e4dc] bg-white text-[#1c1b1a] hover:border-[#1c1b1a] transition-colors"
              aria-label="Save to Favourites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-[#5c5851]'}`} />
            </button>
          </div>
        </div>

        {/* 2. MEDIA CONTROLS & GALLERY (Inspired by Bayut Castleton presentation) */}
        <div className="mb-8">
          {/* Media Tab Selector */}
          <div className="flex items-center justify-between mb-3 border-b border-[#e7e4dc] pb-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveMediaTab('photos')}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeMediaTab === 'photos'
                    ? 'bg-[#1c1b1a] text-white'
                    : 'bg-white border border-[#e7e4dc] text-[#5c5851] hover:text-[#1c1b1a]'
                }`}
              >
                Photos ({images.length})
              </button>

              {property.model3dEnabled && (
                <button
                  onClick={() => setActiveMediaTab('3d')}
                  className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                    activeMediaTab === '3d'
                      ? 'bg-[#997e55] text-white'
                      : 'bg-white border border-[#e7e4dc] text-[#5c5851] hover:text-[#1c1b1a]'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Interactive 3D Experience</span>
                </button>
              )}
            </div>

            {activeMediaTab === 'photos' && (
              <button
                onClick={() => {
                  setActivePhotoIndex(0);
                  setLightboxOpen(true);
                }}
                className="text-xs text-[#5c5851] hover:text-[#1c1b1a] font-medium flex items-center space-x-1"
              >
                <span>View Fullscreen Mosaic</span>
              </button>
            )}
          </div>

          {/* Media Display */}
          {activeMediaTab === '3d' && property.model3dEnabled ? (
            <div className="border border-[#e7e4dc] bg-[#151413] shadow-sm">
              <Property3DViewer
                modelUrl={property.model3dUrl}
                enabled={property.model3dEnabled}
                title={property.model3dTitle || property.title}
                fallbackImage={property.fallbackImageUrl || images[0]?.imageUrl}
                cameraPreset={property.model3dCameraPreset}
                lightingPreset={property.model3dLightingPreset}
                tour360Url={property.tour360Url}
              />
            </div>
          ) : (
            /* 5-Photo Editorial Mosaic */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 h-[460px] overflow-hidden">
              {/* Primary Large Image */}
              <div
                onClick={() => {
                  setActivePhotoIndex(0);
                  setLightboxOpen(true);
                }}
                className="md:col-span-8 h-full relative cursor-pointer group overflow-hidden bg-[#f5f4f0]"
              >
                <img
                  src={images[0]?.imageUrl}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-4 left-4 bg-[#1c1b1a]/90 text-white text-[11px] uppercase tracking-wider font-medium px-3 py-1">
                  Main Residence
                </div>
              </div>

              {/* 4 Supporting Photos Grid */}
              <div className="hidden md:grid md:col-span-4 grid-cols-2 gap-2 h-full">
                {images.slice(1, 5).map((img, idx) => (
                  <div
                    key={img.id || idx}
                    onClick={() => {
                      setActivePhotoIndex(idx + 1);
                      setLightboxOpen(true);
                    }}
                    className="relative cursor-pointer group overflow-hidden bg-[#f5f4f0] h-[225px]"
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.altText || `${property.title} photo ${idx + 2}`}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    {idx === 3 && images.length > 5 && (
                      <div className="absolute inset-0 bg-[#1c1b1a]/70 flex items-center justify-center text-white text-xs font-semibold uppercase tracking-wider">
                        +{images.length - 5} More Photos
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. MAIN TWO-COLUMN LAYOUT: Content (Left) & Sticky Advisory Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN: LISTING DETAILS */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header, Badges & Price */}
            <div className="border border-[#e7e4dc] bg-white p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-widest bg-[#1c1b1a] text-white">
                  {property.transactionType === 'BUY' ? 'For Sale' : 'For Rent'}
                </span>
                <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-widest bg-[#faf9f6] text-[#1c1b1a] border border-[#e7e4dc]">
                  {property.propertyType}
                </span>
                <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-widest bg-[#faf9f6] text-[#5c5851] border border-[#e7e4dc]">
                  {property.status.replace('_', ' ')}
                </span>
                <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-widest bg-[#997e55]/10 text-[#997e55] border border-[#997e55]/30 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Listing</span>
                </span>
              </div>

              <div>
                <h1 className="font-serif text-2xl sm:text-4xl font-normal text-[#1c1b1a] leading-tight">
                  {property.title}
                </h1>
                <div className="flex items-center space-x-2 text-xs text-[#5c5851] mt-2">
                  <MapPin className="w-3.5 h-3.5 text-[#997e55] flex-shrink-0" />
                  <span>{property.address || property.location?.name || 'Dubai, United Arab Emirates'}</span>
                </div>
              </div>

              {/* Price & Reference Line */}
              <div className="pt-4 border-t border-[#f0ede6] flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8c8675] block">
                    Asking Price
                  </span>
                  <div className="flex items-baseline space-x-3">
                    <span className="font-serif text-3xl sm:text-4xl font-semibold text-[#1c1b1a]">
                      {formatPrice(property.price, property.currency)}
                    </span>
                    {pricePerSqft && (
                      <span className="text-xs text-[#8c8675] font-light">
                        ({property.currency || 'AED'} {pricePerSqft.toLocaleString()} / sq.ft)
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right text-xs text-[#8c8675]">
                  <span className="font-mono text-[#a19c91] block">REF: {property.referenceNumber}</span>
                  {property.viewsCount && <span>{property.viewsCount} views</span>}
                </div>
              </div>
            </div>

            {/* Key Specifications Matrix (Bayut Style) */}
            <div className="border border-[#e7e4dc] bg-white p-6 sm:p-8">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#997e55] font-semibold mb-6">
                Property Specifications
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
                <div className="space-y-1 border-l-2 border-[#997e55] pl-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#8c8675] block">Bedrooms</span>
                  <span className="font-serif text-base font-semibold text-[#1c1b1a]">
                    {property.bedrooms} Beds
                  </span>
                </div>

                <div className="space-y-1 border-l-2 border-[#997e55] pl-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#8c8675] block">Bathrooms</span>
                  <span className="font-serif text-base font-semibold text-[#1c1b1a]">
                    {property.bathrooms} Baths
                  </span>
                </div>

                <div className="space-y-1 border-l-2 border-[#997e55] pl-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#8c8675] block">Total Area</span>
                  <span className="font-serif text-base font-semibold text-[#1c1b1a]">
                    {Number(property.areaSqft).toLocaleString()} sq.ft
                  </span>
                </div>

                <div className="space-y-1 border-l-2 border-[#997e55] pl-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#8c8675] block">Type</span>
                  <span className="font-serif text-base font-semibold text-[#1c1b1a]">
                    {property.propertyType}
                  </span>
                </div>

                <div className="space-y-1 border-l-2 border-[#e7e4dc] pl-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#8c8675] block">Furnishing</span>
                  <span className="font-medium text-[#1c1b1a]">
                    {property.furnishedStatus?.replace('_', ' ') || 'Unfurnished'}
                  </span>
                </div>

                <div className="space-y-1 border-l-2 border-[#e7e4dc] pl-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#8c8675] block">Project / Community</span>
                  <span className="font-medium text-[#1c1b1a]">
                    {property.project?.name || property.location?.name || 'City Walk Central Park'}
                  </span>
                </div>

                <div className="space-y-1 border-l-2 border-[#e7e4dc] pl-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#8c8675] block">Developer</span>
                  <span className="font-medium text-[#1c1b1a]">
                    {property.developer?.name || property.project?.developer?.name || 'Meraas'}
                  </span>
                </div>

                <div className="space-y-1 border-l-2 border-[#e7e4dc] pl-3">
                  <span className="text-[10px] uppercase tracking-wider text-[#8c8675] block">Status</span>
                  <span className="font-medium text-[#1c1b1a]">
                    {property.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Editorial Architectural Description */}
            <div className="border border-[#e7e4dc] bg-white p-6 sm:p-8 space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#997e55] font-semibold">
                Overview & Architecture
              </h3>

              <div className="text-xs sm:text-sm text-[#4a4742] leading-relaxed space-y-4 font-light whitespace-pre-line">
                {property.description}
              </div>

              {property.project && (
                <div className="mt-6 pt-6 border-t border-[#f0ede6] flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-[#8c8675] block">Part of Master Development</span>
                    <span className="font-serif text-sm font-medium text-[#1c1b1a]">
                      {property.project.name}
                    </span>
                  </div>
                  <Link
                    to={`/projects/${property.project.slug}`}
                    className="text-xs font-semibold uppercase tracking-wider text-[#997e55] hover:underline"
                  >
                    View Project &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* Amenities & Premium Features Matrix */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="border border-[#e7e4dc] bg-white p-6 sm:p-8 space-y-6">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#997e55] font-semibold">
                  Amenities & Curated Features
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {property.amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center space-x-2.5 p-3 border border-[#f0ede6] bg-[#faf9f6]"
                    >
                      <Check className="w-4 h-4 text-[#997e55] flex-shrink-0" />
                      <span className="text-xs text-[#1c1b1a] font-medium">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Floor Plan / Layout Details */}
            {property.floorplanUrl && (
              <div className="border border-[#e7e4dc] bg-white p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-[#997e55] font-semibold">
                    Architectural Floor Plan
                  </h3>
                  <a
                    href={property.floorplanUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#997e55] hover:underline font-medium"
                  >
                    Download PDF
                  </a>
                </div>
                <div className="border border-[#f0ede6] p-2 bg-[#faf9f6] flex items-center justify-center">
                  <img
                    src={property.floorplanUrl}
                    alt={`${property.title} Floor Plan`}
                    className="max-h-80 object-contain"
                  />
                </div>
              </div>
            )}

            {/* Neighborhood & Location Highlights */}
            {property.location && (
              <div className="border border-[#e7e4dc] bg-white p-6 sm:p-8 space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#997e55] font-semibold">
                  Community & Neighborhood
                </h3>
                <p className="text-xs sm:text-sm text-[#4a4742] leading-relaxed font-light">
                  {property.location.description ||
                    `${property.location.name} represents one of Dubai’s most acclaimed lifestyle destinations, offering manicured parks, luxury retail avenues, and direct arterial connectivity to Downtown Dubai, Jumeirah, and the international airport.`}
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#f0ede6] text-center text-xs">
                  <div>
                    <span className="font-serif text-base font-semibold text-[#1c1b1a] block">05 Mins</span>
                    <span className="text-[#8c8675] text-[10px] uppercase">Downtown Dubai</span>
                  </div>
                  <div>
                    <span className="font-serif text-base font-semibold text-[#1c1b1a] block">07 Mins</span>
                    <span className="text-[#8c8675] text-[10px] uppercase">Jumeirah Beach</span>
                  </div>
                  <div>
                    <span className="font-serif text-base font-semibold text-[#1c1b1a] block">15 Mins</span>
                    <span className="text-[#8c8675] text-[10px] uppercase">Dubai Int. Airport</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: STICKY PRIVATE ADVISORY & ENQUIRY PANEL */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Private Client Advisor Card */}
              <div className="border border-[#e7e4dc] bg-white p-6 space-y-5 shadow-sm">
                <div className="flex items-center space-x-3 pb-4 border-b border-[#f0ede6]">
                  <div className="w-12 h-12 bg-[#1c1b1a] text-white flex items-center justify-center font-serif text-lg font-bold">
                    E
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-medium text-[#1c1b1a]">
                      Private Client Advisory
                    </h4>
                    <p className="text-[11px] text-[#8c8675]">
                      Senior Advisor • Elysian Estates
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {contactPhone && (
                    <a
                      href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                      className="w-full py-2.5 border border-[#e7e4dc] hover:border-[#1c1b1a] text-[#1c1b1a] text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#997e55]" />
                      <span>{contactPhone}</span>
                    </a>
                  )}

                  <button
                    onClick={() => setViewingModalOpen(true)}
                    className="w-full py-2.5 bg-[#997e55] hover:bg-[#84683d] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Private Viewing</span>
                  </button>
                </div>

                {/* Instant Quick Enquiry Form */}
                <div className="pt-4 border-t border-[#f0ede6]">
                  <h5 className="text-[11px] uppercase tracking-wider text-[#1c1b1a] font-semibold mb-3">
                    Enquire About This Residence
                  </h5>

                  {enquirySuccess ? (
                    <div className="p-4 bg-[#faf9f6] border border-[#997e55]/30 text-center space-y-2">
                      <CheckCircle2 className="w-6 h-6 text-[#997e55] mx-auto" />
                      <p className="text-xs font-medium text-[#1c1b1a]">Enquiry Registered</p>
                      <p className="text-[11px] text-[#6e6962]">
                        Our private advisor will contact you promptly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleEnquirySubmit} className="space-y-3">
                      <div>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Your Name *"
                          className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none focus:border-[#1c1b1a]"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Email Address *"
                          className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none focus:border-[#1c1b1a]"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Phone / WhatsApp"
                          className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none focus:border-[#1c1b1a]"
                        />
                      </div>
                      <div>
                        <textarea
                          rows={2}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder={`Inquiry regarding REF: ${property.referenceNumber}...`}
                          className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none focus:border-[#1c1b1a]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={enquiryLoading}
                        className="w-full py-2.5 bg-[#1c1b1a] hover:bg-[#2e2b27] text-white text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                      >
                        {enquiryLoading ? 'Sending...' : 'Send Private Inquiry'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. SIMILAR CURATED RESIDENCES */}
        {similarProperties.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#e7e4dc]">
            <div className="mb-8">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#997e55] font-semibold block mb-1">
                Comparative Selection
              </span>
              <h2 className="font-serif text-2xl font-normal text-[#1c1b1a]">
                Similar Curated Residences
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.slice(0, 3).map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LIGHTBOX FULLSCREEN MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white pb-4">
            <span className="text-xs uppercase tracking-widest text-[#a19c91]">
              Photo {activePhotoIndex + 1} of {images.length}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 text-white hover:text-[#997e55] transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center">
            <button
              onClick={() =>
                setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
              }
              className="absolute left-2 sm:left-6 p-3 bg-black/50 text-white hover:bg-black/80 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={images[activePhotoIndex]?.imageUrl}
              alt={images[activePhotoIndex]?.altText || property.title}
              className="max-h-[80vh] max-w-full object-contain"
            />

            <button
              onClick={() =>
                setActivePhotoIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
              }
              className="absolute right-2 sm:right-6 p-3 bg-black/50 text-white hover:bg-black/80 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center text-xs text-[#a19c91] pt-4">
            {images[activePhotoIndex]?.caption || property.title}
          </div>
        </div>
      )}

      {/* SCHEDULE PRIVATE VIEWING MODAL */}
      {viewingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="border border-[#e7e4dc] bg-white p-6 sm:p-8 max-w-lg w-full space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#f0ede6] pb-3">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#1c1b1a]">
                  Schedule VIP Private Viewing
                </h3>
                <p className="text-[11px] text-[#8c8675]">{property.title}</p>
              </div>
              <button
                onClick={() => setViewingModalOpen(false)}
                className="p-1 text-[#8c8675] hover:text-[#1c1b1a]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleViewingSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8c8675] mb-1 font-semibold">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8c8675] mb-1 font-semibold">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8c8675] mb-1 font-semibold">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8c8675] mb-1 font-semibold">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8c8675] mb-1 font-semibold">
                    Preferred Time Window
                  </label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none"
                  >
                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={enquiryLoading}
                  className="w-full py-3 bg-[#1c1b1a] hover:bg-[#2e2b27] text-white text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50"
                >
                  {enquiryLoading ? 'Confirming...' : 'Request Private Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
