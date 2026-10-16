import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Page, Property, Project, Location, Testimonial, BlogPost } from '../types';
import { PropertyCard } from '../components/property/PropertyCard';
import { Hero3DScene } from '../components/3d/Hero3DScene';
import { useSettings } from '../context/SettingsContext';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Award,
  Key,
  Compass,
  CheckCircle2,
  Quote,
  Building,
  TrendingUp,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { siteName, formatPrice } = useSettings();
  const [pageData, setPageData] = useState<Page | null>(null);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [latestArticles, setLatestArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Find CMS hero section configuration if available
  const heroSection = pageData?.sections?.find((s: any) => s.sectionType === 'HERO_SECTION' && s.visible);
  let heroContent: any = {};
  if (heroSection?.contentJson) {
    try {
      heroContent = JSON.parse(heroSection.contentJson);
    } catch {}
  }

  const heroHeading =
    heroSection?.title ||
    'Architectural Masterpieces in the World’s Most Coveted Addresses';
  const heroSubtitle =
    heroSection?.subtitle ||
    'Bespoke residences, beachfront mansions, and private sky palaces curated with absolute distinction.';
  const heroBg =
    heroSection?.backgroundImage ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80';

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background Image with luxury dark gradient overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Hero Luxury Architecture"
            className="w-full h-full object-cover scale-105 filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/70 to-obsidian-950/80" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-obsidian-950/90" />
        </div>

        {/* Ambient 3D Canvas in Hero */}
        <Hero3DScene />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border-champagne-400/30 text-champagne-300 text-xs uppercase tracking-widest font-semibold shadow-glow-gold animate-in fade-in duration-700">
            <Sparkles className="w-3.5 h-3.5 text-champagne-400" />
            <span>Private Collection 2026</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.15] max-w-4xl mx-auto">
            {heroHeading}
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/properties"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-champagne-400 text-obsidian-900 hover:bg-champagne-300 transition duration-300 shadow-glow-gold flex items-center justify-center space-x-2"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/projects"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest glass-panel text-white hover:border-champagne-400/50 hover:bg-white/5 transition duration-300 flex items-center justify-center space-x-2"
            >
              <span>Master Developments</span>
            </Link>
          </div>

          {/* Luxury Credential Stats */}
          <div className="pt-10 grid grid-cols-3 gap-6 max-w-xl mx-auto border-t border-white/10">
            <div>
              <p className="font-serif text-2xl font-bold gold-gradient-text">$4.8B+</p>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">Portfolio Value</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold gold-gradient-text">150+</p>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">Private Residences</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold gold-gradient-text">12</p>
              <p className="text-[11px] uppercase tracking-wider text-slate-400">Global Offices</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PROPERTIES SHOWCASE */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold block mb-2">
              Curated Selection
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-medium text-white">
              Signature Residences For Sale
            </h2>
          </div>
          <Link
            to="/properties"
            className="mt-4 md:mt-0 text-xs uppercase tracking-wider text-champagne-300 hover:text-white flex items-center space-x-2 transition font-semibold"
          >
            <span>View All Properties ({featuredProperties.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* 3. ICONIC MASTER DEVELOPMENTS */}
      <section className="py-24 bg-obsidian-900/60 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold block">
              Flagship Developments
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-medium text-white">
              Pioneering Off-Plan Landmarks
            </h2>
            <p className="text-sm text-slate-400">
              Direct partnerships with Dubai's premier master creators including Meraas, Omniyat, and Emaar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="group glass-panel rounded-2xl overflow-hidden hover:border-champagne-400/50 transition-all duration-300 flex flex-col shadow-luxury"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.heroImage || 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider bg-obsidian-900/90 text-champagne-300 border border-champagne-400/30 backdrop-blur-md">
                      {project.status ? project.status.replace('_', ' ') : 'OFF PLAN'}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-300">Starting From</p>
                      <p className="font-serif text-lg font-bold gold-gradient-text">
                        {project.startingPrice ? formatPrice(project.startingPrice, project.currency) : 'Price On Request'}
                      </p>
                    </div>
                    {project.completionDate && (
                      <span className="text-[11px] text-slate-300 bg-black/60 px-2.5 py-1 rounded border border-white/10 font-mono">
                        {project.completionDate}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] text-champagne-400 uppercase tracking-widest font-semibold block mb-1">
                      {project.developer?.name || 'Master Developer'}
                    </span>
                    <h3 className="font-serif text-xl font-medium text-white group-hover:text-champagne-300 transition">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <Link
                    to={`/projects/${project.slug}`}
                    className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-champagne-300 group-hover:text-white transition"
                  >
                    <span>Explore Project Dossier</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PREMIER DESTINATIONS / LOCATIONS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold block mb-2">
              Coveted Addresses
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-medium text-white">
              Prime Destinations & Islands
            </h2>
          </div>
          <Link
            to="/locations"
            className="mt-4 md:mt-0 text-xs uppercase tracking-wider text-champagne-300 hover:text-white flex items-center space-x-2 transition font-semibold"
          >
            <span>Explore All Locations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.slice(0, 4).map((loc) => (
            <Link
              key={loc.id}
              to={`/properties?locationId=${loc.id}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] border border-white/10 hover:border-champagne-400/50 transition duration-300 shadow-luxury"
            >
              <img
                src={loc.heroImage || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80'}
                alt={loc.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] uppercase tracking-widest text-champagne-400 font-semibold block mb-1">
                  {loc.city}, {loc.country}
                </span>
                <h3 className="font-serif text-xl font-medium text-white group-hover:text-champagne-300 transition">
                  {loc.name}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {loc.propertyCount} Exclusive Properties
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. ABOUT US / ADVISORY EXCELLENCE */}
      <section className="py-24 bg-obsidian-900/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-champagne-400/30 shadow-luxury">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
                alt="Architectural Advisory"
                className="w-full h-[480px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 glass-panel p-6 rounded-2xl border border-champagne-400/40 shadow-luxury hidden sm:block max-w-xs">
              <p className="font-serif text-2xl font-bold gold-gradient-text">18 Years</p>
              <p className="text-xs text-slate-300 mt-1">
                Of discreet ultra-prime advisory across Europe and the GCC.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold block">
              The Elysian Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-white leading-tight">
              Redefining the Luxury Real Estate Experience
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              At Elysian Estates, we advise international family offices, royal dignitaries, and institutional investors on generational trophies. From custom SAOTA-designed beachfront villas to iconic Dorchester-serviced sky penthouses, each acquisition is conducted with paramount discretion.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-champagne-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-white">Discreet Off-Market</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Access confidential unlisted portfolios.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-champagne-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-white">Realtime 3D Models</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Interactive spatial exploration before visiting.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-champagne-300 hover:text-white transition"
              >
                <span>Read Full Corporate Heritage</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CLIENT ENDORSEMENTS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold block">
            Client Voices
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-medium text-white">
            Trusted by Discerning Investors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-champagne-400/30 transition flex flex-col justify-between space-y-6 shadow-luxury"
            >
              <div>
                <Quote className="w-8 h-8 text-champagne-400/40 mb-4" />
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  "{test.quote}"
                </p>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t border-white/5">
                {test.avatarUrl && (
                  <img
                    src={test.avatarUrl}
                    alt={test.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-champagne-400/30"
                  />
                )}
                <div>
                  <h4 className="text-xs font-semibold text-white">{test.authorName}</h4>
                  <p className="text-[11px] text-slate-400">{test.authorTitle}, {test.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. LATEST JOURNAL ARTICLES */}
      <section className="py-24 bg-obsidian-900/60 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold block mb-2">
                Editorial & Intelligence
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-medium text-white">
                Market Insights & Spotlights
              </h2>
            </div>
            <Link
              to="/blog"
              className="mt-4 md:mt-0 text-xs uppercase tracking-wider text-champagne-300 hover:text-white flex items-center space-x-2 transition font-semibold"
            >
              <span>View Full Journal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestArticles.map((article) => (
              <Link
                key={article.id}
                to={`/blog/${article.slug}`}
                className="group glass-panel rounded-2xl overflow-hidden hover:border-champagne-400/40 transition flex flex-col md:flex-row shadow-luxury"
              >
                <div className="md:w-2/5 h-56 md:h-auto overflow-hidden">
                  <img
                    src={article.featuredImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                </div>
                <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-champagne-400 font-semibold block mb-2">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Editorial'}
                    </span>
                    <h3 className="font-serif text-lg font-medium text-white group-hover:text-champagne-300 transition line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-champagne-300">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
