import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Project } from '../types';
import { useSettings } from '../context/SettingsContext';
import { Building, MapPin, Calendar, CheckCircle2, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export const ProjectDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { formatPrice } = useSettings();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.public
      .getProjectBySlug(slug)
      .then(setProject)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 text-champagne-400 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center pt-20 px-4 text-center">
        <h2 className="font-serif text-2xl text-white mb-2">Development Project Not Found</h2>
        <Link to="/projects" className="px-6 py-2.5 rounded-full bg-champagne-400 text-obsidian-900 text-xs font-semibold uppercase">
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
    <div className="min-h-screen bg-obsidian-950 text-slate-100 pt-24 pb-20">
      {/* Hero Banner */}
      <div className="relative h-[480px] w-full overflow-hidden">
        <img
          src={project.heroImage || 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1920&q=80'}
          alt={project.name}
          className="w-full h-full object-cover filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/40 to-transparent" />
        <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-widest text-champagne-400 font-semibold block mb-2">
            {project.developer?.name || 'Master Development'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white mb-3">
            {project.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center space-x-1 text-champagne-300">
              <MapPin className="w-4 h-4 text-champagne-400" />
              <span>{project.location?.name || 'Prime Location'}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-champagne-400/20 text-champagne-300 border border-champagne-400/30">
              {project.status ? project.status.replace('_', ' ') : 'OFF PLAN'}
            </span>
            {project.completionDate && (
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-champagne-400" />
                <span>Completion: {project.completionDate}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Overview */}
          <div>
            <h2 className="font-serif text-2xl font-medium text-white mb-4">Development Vision</h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Unit Configurations */}
          {unitTypes.length > 0 && (
            <div className="pt-8 border-t border-white/5 space-y-4">
              <h2 className="font-serif text-2xl font-medium text-white">Available Unit Types</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {unitTypes.map((u, i) => (
                  <div key={i} className="glass-panel p-4 rounded-xl border border-white/5 flex items-center space-x-3 text-xs text-slate-200">
                    <Building className="w-4 h-4 text-champagne-400 flex-shrink-0" />
                    <span>{u}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="pt-8 border-t border-white/5 space-y-4">
              <h2 className="font-serif text-2xl font-medium text-white">Master Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map((a, i) => (
                  <div key={i} className="glass-panel p-3.5 rounded-xl border border-white/5 flex items-center space-x-2.5 text-xs text-slate-200">
                    <Sparkles className="w-4 h-4 text-champagne-400 flex-shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Plan */}
          {Object.keys(paymentPlan).length > 0 && (
            <div className="pt-8 border-t border-white/5 space-y-4">
              <h2 className="font-serif text-2xl font-medium text-white">Payment Architecture</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(paymentPlan).map(([k, v]) => (
                  <div key={k} className="glass-panel p-5 rounded-xl border border-white/5 text-center">
                    <p className="font-serif text-2xl font-bold gold-gradient-text">{String(v)}</p>
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 mt-1 capitalize">
                      {k.replace(/([A-Z])/g, ' $1')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-2xl border border-champagne-400/30 shadow-luxury space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 block mb-1">Starting Price</span>
              <p className="font-serif text-3xl font-bold gold-gradient-text">
                {project.startingPrice ? formatPrice(project.startingPrice, project.currency) : 'Price On Request'}
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-3">
              <Link
                to={`/properties?transactionType=BUY`}
                className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne-400 text-obsidian-900 hover:bg-champagne-300 transition shadow-glow-gold flex items-center justify-center space-x-2"
              >
                <span>Browse Available Residences</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="w-full py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider glass-panel text-white hover:border-champagne-400 transition flex items-center justify-center"
              >
                Inquire With Project Broker
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
