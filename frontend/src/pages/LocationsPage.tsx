import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Location } from '../types';
import { MapPin, ArrowRight, Loader2 } from 'lucide-react';

export const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.public
      .getLocations()
      .then(setLocations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold block mb-2">
            Prime Territories
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white">
            World-Renowned Addresses
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl font-light">
            From iconic Palm Jumeirah archipelago villas to Downtown Dubai skyline penthouses.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-champagne-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="group glass-panel rounded-2xl overflow-hidden hover:border-champagne-400/50 transition duration-300 flex flex-col shadow-luxury"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={loc.heroImage || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider bg-obsidian-900/90 text-champagne-300 border border-champagne-400/30">
                      {loc.city}, {loc.country}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-white group-hover:text-champagne-300 transition">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {loc.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      <strong className="text-white">{loc.propertyCount}</strong> Listings Available
                    </span>
                    <Link
                      to={`/properties?locationId=${loc.id}`}
                      className="text-xs font-semibold uppercase tracking-wider text-champagne-300 hover:text-white flex items-center space-x-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
