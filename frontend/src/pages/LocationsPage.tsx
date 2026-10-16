import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Location } from '../types';
import { ArrowRight, Loader2, MapPin } from 'lucide-react';

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
    <div className="min-h-screen bg-[#faf9f6] text-[#1c1b1a] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 pb-4 border-b border-[#e7e4dc]">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#997e55] font-semibold block mb-1">
            Prime Territories
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1c1b1a]">
            World-Renowned Addresses
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6962] mt-2 max-w-xl font-light">
            From iconic Palm Jumeirah beachfront villas to Downtown skyline penthouses and golf retreats.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="w-8 h-8 text-[#997e55] animate-spin" />
            <p className="text-xs uppercase tracking-widest text-[#8c8675]">Loading Destinations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="editorial-card group overflow-hidden border border-[#e7e4dc] bg-white flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#f5f4f0]">
                  <Link to={`/properties?locationId=${loc.id}`} className="block w-full h-full">
                    <img
                      src={
                        loc.heroImage ||
                        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={loc.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </Link>
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#1c1b1a] text-white text-[10px] uppercase font-semibold tracking-widest px-2.5 py-1">
                      {loc.city}, {loc.country}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <Link to={`/properties?locationId=${loc.id}`}>
                      <h3 className="font-serif text-lg font-medium text-[#1c1b1a] group-hover:text-[#997e55] transition-colors mb-2">
                        {loc.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#6e6962] line-clamp-2 leading-relaxed">
                      {loc.description ||
                        `An exclusive enclave celebrated for world-class architecture, connectivity, and lifestyle.`}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#f0ede6] flex items-center justify-between">
                    <span className="text-xs text-[#8c8675]">
                      <strong className="text-[#1c1b1a] font-semibold">{loc.propertyCount || 0}</strong>{' '}
                      Verified Listings
                    </span>
                    <Link
                      to={`/properties?locationId=${loc.id}`}
                      className="text-xs font-semibold uppercase tracking-wider text-[#1c1b1a] hover:text-[#997e55] underline underline-offset-4"
                    >
                      View Residences &rarr;
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
