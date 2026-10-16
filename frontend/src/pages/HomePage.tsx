import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Page, Property, Project, Location, Testimonial, BlogPost } from '../types';
import { PropertyCard } from '../components/property/PropertyCard';
import { Hero3DScene } from '../components/3d/Hero3DScene';
import { useSettings } from '../context/SettingsContext';
import {
  Search,
  MapPin,
  Building2,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Phone,
  Mail,
  Shield,
  Compass,
  Bed,
  Bath,
  Maximize2,
  Box,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { siteName, formatPrice, contactPhone, contactEmail } = useSettings();
  const navigate = useNavigate();

  const [pageData, setPageData] = useState<Page | null>(null);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [latestArticles, setLatestArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Bar State
  const [searchTransaction, setSearchTransaction] = useState<'BUY' | 'RENT'>('BUY');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchPropertyType, setSearchPropertyType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Concierge Advisory Form State
  const [enquiryForm, setEnquiryForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceInterest: 'Acquisition & Advisory',
    message: '',
  });
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [page, props, projs, locs, tests, arts] = await Promise.all([
          api.public.getPage('home').catch(() => null),
          api.public.getFeaturedProperties().catch(() => []),
          api.public.getProjects(true).catch(() => []),
          api.public.getLocations(true).catch(() => []),
          api.public.getTestimonials().catch(() => []),
          api.public.getLatestArticles().catch(() => []),
        ]);
        if (page) setPageData(page);
        setFeaturedProperties(props);
        setFeaturedProjects(projs);
        setLocations(locs);
        setTestimonials(tests);
        setLatestArticles(arts);
      } catch (err) {
        console.error('Error loading homepage content', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTransaction) params.append('transactionType', searchTransaction);
    if (searchLocation) params.append('locationId', searchLocation);
    if (searchPropertyType) params.append('propertyType', searchPropertyType);
    if (searchQuery.trim()) params.append('query', searchQuery.trim());
    navigate(`/properties?${params.toString()}`);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.fullName || !enquiryForm.email) return;
    setEnquiryLoading(true);
    try {
      await api.public.submitEnquiry({
        fullName: enquiryForm.fullName,
        email: enquiryForm.email,
        phone: enquiryForm.phone,
        message: `[Private Concierge Inquiry] Interest: ${enquiryForm.serviceInterest}. Note: ${enquiryForm.message}`,
        enquiryType: 'GENERAL',
      });
      setEnquirySubmitted(true);
      setEnquiryForm({
        fullName: '',
        email: '',
        phone: '',
        serviceInterest: 'Acquisition & Advisory',
        message: '',
      });
    } catch {
      alert('Unable to send enquiry. Please contact us directly.');
    } finally {
      setEnquiryLoading(false);
    }
  };

  // Find CMS hero section configuration
  const heroSection = pageData?.sections?.find((s: any) => s.sectionType === 'HERO_SECTION' && s.visible);
  const heroHeading =
    heroSection?.title ||
    'Curated Architectural Residences in Premier Destinations';
  const heroSubtitle =
    heroSection?.subtitle ||
    'Representing private waterfront estates, branded residences, and bespoke sky penthouses with discretion and authority.';
  const heroBg =
    heroSection?.backgroundImage ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80';

  // Primary Spotlight Property
  const spotlightProperty = featuredProperties[0] || null;
  const secondaryProperties = featuredProperties.slice(1, 4);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1c1b1a]">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#151413]">
        {/* Architectural Photography Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Luxury Architecture"
            className="w-full h-full object-cover object-center filter brightness-[0.62] contrast-[1.05]"
          />
          {/* Subtle vignette and gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#151413] via-black/40 to-black/60" />
        </div>

        {/* Ambient 3D Interactive Scene */}
        <Hero3DScene />

        {/* Hero Content & Integrated Search Bar */}
        <div className="relative z-10 max-w-5xl mx-auto w-full text-center space-y-8">
          <div className="inline-block">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#e4dcce] font-medium border-b border-[#997e55] pb-1">
              Private Real Estate Advisory
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white max-w-4xl mx-auto leading-[1.18] tracking-tight">
            {heroHeading}
          </h1>

          <p className="text-sm sm:text-base text-[#d8d5cd] max-w-2xl mx-auto font-light leading-relaxed">
            {heroSubtitle}
          </p>

          {/* Integrated Real Estate Search Bar */}
          <div className="max-w-4xl mx-auto pt-4 text-left">
            <div className="bg-white/95 backdrop-blur-md border border-white/20 p-2 sm:p-3 shadow-xl">
              {/* Transaction Type Tabs */}
              <div className="flex border-b border-[#e7e4dc] pb-2 mb-2 space-x-1">
                <button
                  type="button"
                  onClick={() => setSearchTransaction('BUY')}
                  className={`px-5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    searchTransaction === 'BUY'
                      ? 'bg-[#1c1b1a] text-white'
                      : 'text-[#5c5851] hover:text-[#1c1b1a]'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTransaction('RENT')}
                  className={`px-5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    searchTransaction === 'RENT'
                      ? 'bg-[#1c1b1a] text-white'
                      : 'text-[#5c5851] hover:text-[#1c1b1a]'
                  }`}
                >
                  Rent
                </button>
              </div>

              {/* Search Inputs Row */}
              <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-2">
                {/* Location Select */}
                <div className="md:col-span-4 relative border border-[#e7e4dc] bg-[#faf9f6]">
                  <MapPin className="w-4 h-4 text-[#997e55] absolute left-3 top-3.5 pointer-events-none" />
                  <select
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full bg-transparent pl-9 pr-6 py-3 text-xs text-[#1c1b1a] appearance-none focus:outline-none cursor-pointer"
                  >
                    <option value="">All Prime Locations</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Property Type Select */}
                <div className="md:col-span-3 relative border border-[#e7e4dc] bg-[#faf9f6]">
                  <Building2 className="w-4 h-4 text-[#997e55] absolute left-3 top-3.5 pointer-events-none" />
                  <select
                    value={searchPropertyType}
                    onChange={(e) => setSearchPropertyType(e.target.value)}
                    className="w-full bg-transparent pl-9 pr-6 py-3 text-xs text-[#1c1b1a] appearance-none focus:outline-none cursor-pointer"
                  >
                    <option value="">All Property Types</option>
                    <option value="PENTHOUSE">Penthouse</option>
                    <option value="VILLA">Luxury Villa</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="DUPLEX">Duplex</option>
                    <option value="TOWNHOUSE">Townhouse</option>
                  </select>
                </div>

                {/* Keyword / Address Input */}
                <div className="md:col-span-3 relative border border-[#e7e4dc] bg-[#faf9f6]">
                  <Search className="w-4 h-4 text-[#997e55] absolute left-3 top-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Reference, community..."
                    className="w-full bg-transparent pl-9 pr-3 py-3 text-xs text-[#1c1b1a] placeholder-[#8c8675] focus:outline-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full h-full bg-[#1c1b1a] text-white hover:bg-[#2e2b27] px-4 py-3 text-xs uppercase tracking-widest font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#997e55]" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL FEATURED PROPERTIES SHOWCASE */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[#e7e4dc]">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#997e55] font-semibold block mb-1">
              Curated Portfolio
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1c1b1a]">
              Featured Residences
            </h2>
          </div>
          <Link
            to="/properties"
            className="mt-4 md:mt-0 text-xs uppercase tracking-widest font-semibold text-[#1c1b1a] hover:text-[#997e55] flex items-center space-x-1 transition-colors"
          >
            <span>View All Residences ({featuredProperties.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Editorial Layout: 1 Large Spotlight Residence + Curated Grid */}
        {spotlightProperty && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-center">
            {/* Spotlight Showcase Card */}
            <div className="lg:col-span-7 relative group overflow-hidden border border-[#e7e4dc] bg-white">
              <Link to={`/properties/${spotlightProperty.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-[#f5f4f0]">
                <img
                  src={
                    spotlightProperty.images?.[0]?.imageUrl ||
                    spotlightProperty.fallbackImageUrl ||
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={spotlightProperty.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-[#1c1b1a] text-white text-[10px] uppercase tracking-widest font-semibold px-3 py-1">
                    Spotlight
                  </span>
                  {spotlightProperty.model3dEnabled && (
                    <span className="bg-[#997e55] text-white text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 flex items-center space-x-1">
                      <Box className="w-3 h-3" />
                      <span>3D Virtual Tour</span>
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Spotlight Details */}
            <div className="lg:col-span-5 space-y-5 lg:pl-4">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#997e55] font-medium flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{spotlightProperty.location?.name || spotlightProperty.address || 'Dubai'}</span>
                </span>
                <Link to={`/properties/${spotlightProperty.slug}`}>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1c1b1a] hover:text-[#997e55] transition-colors leading-snug">
                    {spotlightProperty.title}
                  </h3>
                </Link>
                <p className="text-xs text-[#6e6962] leading-relaxed line-clamp-3">
                  {spotlightProperty.description}
                </p>
              </div>

              {/* Specs Bar */}
              <div className="flex items-center space-x-6 text-xs text-[#5c5851] py-4 border-y border-[#e7e4dc]">
                <div className="flex items-center space-x-1.5">
                  <Bed className="w-4 h-4 text-[#997e55]" />
                  <span>{spotlightProperty.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Bath className="w-4 h-4 text-[#997e55]" />
                  <span>{spotlightProperty.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Maximize2 className="w-4 h-4 text-[#997e55]" />
                  <span>{Number(spotlightProperty.areaSqft).toLocaleString()} sq.ft</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8c8675] block">Valuation</span>
                  <span className="font-serif text-2xl font-semibold text-[#1c1b1a]">
                    {formatPrice(spotlightProperty.price, spotlightProperty.currency)}
                  </span>
                </div>

                <Link
                  to={`/properties/${spotlightProperty.slug}`}
                  className="px-6 py-3 bg-[#1c1b1a] text-white hover:bg-[#2e2b27] text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  Explore Residence
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Properties Grid */}
        {secondaryProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            {secondaryProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* 3. FEATURED DEVELOPMENTS & MASTER PROJECTS */}
      {featuredProjects.length > 0 && (
        <section className="py-20 bg-[#f5f4f0] border-y border-[#e7e4dc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#997e55] font-semibold block mb-1">
                  Off-Plan & Branded Residences
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1c1b1a]">
                  Master Developments
                </h2>
              </div>
              <Link
                to="/projects"
                className="mt-4 md:mt-0 text-xs uppercase tracking-widest font-semibold text-[#1c1b1a] hover:text-[#997e55] flex items-center space-x-1 transition-colors"
              >
                <span>All Developments ({featuredProjects.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="editorial-card group overflow-hidden border border-[#e7e4dc] bg-white flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#ebe8df]">
                    <img
                      src={
                        project.heroImage ||
                        project.featuredImageUrl ||
                        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#1c1b1a]/90 text-white text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1">
                      {project.status ? project.status.replace('_', ' ') : 'OFF PLAN'}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#8c8675] mb-2">
                        <span>{project.location?.name || 'Dubai, UAE'}</span>
                        {project.developer && (
                          <span className="text-[#997e55] font-medium">{project.developer.name}</span>
                        )}
                      </div>

                      <Link to={`/projects/${project.slug}`}>
                        <h3 className="font-serif text-lg font-medium text-[#1c1b1a] group-hover:text-[#997e55] transition-colors mb-2">
                          {project.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-[#6e6962] line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#f0ede6] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#8c8675] block">Starting From</span>
                        <span className="font-serif text-base font-semibold text-[#1c1b1a]">
                          {project.startingPrice ? formatPrice(project.startingPrice) : 'Price on Application'}
                        </span>
                      </div>

                      <Link
                        to={`/projects/${project.slug}`}
                        className="text-xs font-semibold uppercase tracking-wider text-[#1c1b1a] hover:text-[#997e55] underline underline-offset-4"
                      >
                        Project Details &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. PRIME LOCATIONS & NEIGHBORHOODS */}
      {locations.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#997e55] font-semibold block mb-2">
              Coveted Enclaves
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1c1b1a]">
              Prime Destinations
            </h2>
            <p className="text-xs sm:text-sm text-[#6e6962] mt-3 font-light">
              Explore residences in the world’s most sought-after waterfronts, city centers, and private golf communities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.slice(0, 4).map((loc) => (
              <Link
                key={loc.id}
                to={`/properties?locationId=${loc.id}`}
                className="group relative aspect-[3/4] overflow-hidden border border-[#e7e4dc] block"
              >
                <img
                  src={
                    loc.heroImage ||
                    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={loc.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="font-serif text-xl font-normal group-hover:text-[#e4dcce] transition-colors">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-white/80 mt-1 line-clamp-1">
                    {loc.city ? `${loc.city}, ${loc.country || 'UAE'}` : 'United Arab Emirates'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. BRAND PHILOSOPHY & ADVISORY STANDARD */}
      <section className="py-24 bg-[#151413] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#997e55] font-semibold block">
                The Advisory Standard
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-white leading-tight">
                Architectural Integrity, Discretion, and Private Client Representation
              </h2>
              <p className="text-xs sm:text-sm text-[#a19c91] leading-relaxed font-light">
                {siteName || 'Elysian Estates'} was established to provide an uncompromising advisory practice for prime real estate acquisitions. We curate residences characterized by architectural significance, craftsmanship, and enduring value.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#262422]">
                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-medium text-white">Off-Market Access</h4>
                  <p className="text-xs text-[#8c8675] leading-relaxed">
                    Direct access to confidential penthouses and private estates withheld from public listing portals.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-medium text-white">Bespoke Due Diligence</h4>
                  <p className="text-xs text-[#8c8675] leading-relaxed">
                    Rigorous analysis covering developer track records, escrow verification, and asset appreciation models.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative border border-[#262422] p-2 bg-[#1c1b1a]">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
                  alt="Architectural Interior"
                  className="w-full aspect-[4/3] object-cover filter brightness-90"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRIVATE CONCIERGE & ENQUIRY SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-[#e7e4dc] bg-white p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#997e55] font-semibold block">
                Private Consultation
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-[#1c1b1a]">
                Begin Your Acquisition Enquiry
              </h2>
              <p className="text-xs sm:text-sm text-[#6e6962] leading-relaxed">
                Connect with our senior private advisors for a confidential briefing on available residences, off-market opportunities, or portfolio structuring.
              </p>

              <div className="pt-6 space-y-3 text-xs text-[#5c5851]">
                {contactPhone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-[#997e55]" />
                    <span className="font-medium text-[#1c1b1a]">{contactPhone}</span>
                  </div>
                )}
                {contactEmail && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-[#997e55]" />
                    <span>{contactEmail}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-7">
              {enquirySubmitted ? (
                <div className="p-8 border border-[#997e55]/30 bg-[#faf9f6] text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-[#997e55] mx-auto" />
                  <h3 className="font-serif text-lg font-medium text-[#1c1b1a]">
                    Enquiry Received
                  </h3>
                  <p className="text-xs text-[#6e6962] max-w-md mx-auto">
                    Thank you. A senior advisor will contact you within 24 hours to coordinate your confidential briefing.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#8c8675] mb-1 font-medium">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={enquiryForm.fullName}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, fullName: e.target.value })}
                        placeholder="Lord / Lady / Mr / Ms..."
                        className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3.5 py-2.5 text-xs text-[#1c1b1a] focus:outline-none focus:border-[#1c1b1a]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#8c8675] mb-1 font-medium">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={enquiryForm.email}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                        placeholder="private@domain.com"
                        className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3.5 py-2.5 text-xs text-[#1c1b1a] focus:outline-none focus:border-[#1c1b1a]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#8c8675] mb-1 font-medium">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={enquiryForm.phone}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                        placeholder="+971 50 000 0000"
                        className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3.5 py-2.5 text-xs text-[#1c1b1a] focus:outline-none focus:border-[#1c1b1a]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#8c8675] mb-1 font-medium">
                        Service Interest
                      </label>
                      <select
                        value={enquiryForm.serviceInterest}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, serviceInterest: e.target.value })}
                        className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3.5 py-2.5 text-xs text-[#1c1b1a] focus:outline-none focus:border-[#1c1b1a]"
                      >
                        <option value="Acquisition & Advisory">Residence Acquisition</option>
                        <option value="Off-Market Portfolio">Off-Market Opportunities</option>
                        <option value="New Developments">New Development Investment</option>
                        <option value="Listing Representation">Property Listing Representation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8c8675] mb-1 font-medium">
                      Briefing Notes / Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      placeholder="Specific locations, desired bedrooms, timeline, or investment parameters..."
                      className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3.5 py-2.5 text-xs text-[#1c1b1a] focus:outline-none focus:border-[#1c1b1a]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={enquiryLoading}
                    className="w-full py-3.5 bg-[#1c1b1a] text-white hover:bg-[#2e2b27] text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50"
                  >
                    {enquiryLoading ? 'Submitting...' : 'Request Private Consultation'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
