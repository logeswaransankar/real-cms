import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Project } from '../types';
import { useSettings } from '../context/SettingsContext';
import { ArrowRight, Building, Calendar, MapPin, Sparkles, Loader2 } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { formatPrice } = useSettings();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.public
      .getProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold block mb-2">
            Architectural Landmarks
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white">
            Master Developments & Off-Plan
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl font-light">
            Iconic future destinations developed in collaboration with world-renowned master creators.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-champagne-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
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
                    <span>View Project Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
