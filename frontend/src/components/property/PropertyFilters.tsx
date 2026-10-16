import React, { useEffect, useState } from 'react';
import { Location } from '../../types';
import { api } from '../../services/api';
import { Search, SlidersHorizontal, RotateCcw, Building2, MapPin, DollarSign } from 'lucide-react';

interface PropertyFiltersProps {
  filters: {
    transactionType: string;
    locationId: string;
    propertyType: string;
    status: string;
    minPrice: string;
    maxPrice: string;
    minBedrooms: string;
    query: string;
  };
  onFilterChange: (name: string, value: string) => void;
  onClear: () => void;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFilterChange,
  onClear,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    api.public.getLocations().then(setLocations).catch(() => {});
  }, []);

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-8 border border-champagne-400/20 shadow-luxury">
      {/* Primary search bar & Transaction toggle */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* Buy / Rent Pill Tabs */}
        <div className="flex p-1 rounded-xl bg-obsidian-900 border border-white/10 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => onFilterChange('transactionType', 'BUY')}
            className={`flex-1 lg:flex-initial px-6 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
              filters.transactionType === 'BUY'
                ? 'bg-champagne-400 text-obsidian-900 shadow-glow-gold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('transactionType', 'RENT')}
            className={`flex-1 lg:flex-initial px-6 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
              filters.transactionType === 'RENT'
                ? 'bg-champagne-400 text-obsidian-900 shadow-glow-gold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Rent
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('transactionType', '')}
            className={`flex-1 lg:flex-initial px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
              filters.transactionType === ''
                ? 'bg-champagne-400 text-obsidian-900 shadow-glow-gold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All
          </button>
        </div>

        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-champagne-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onFilterChange('query', e.target.value)}
            placeholder="Search penthouses, beachfront villas, or keywords..."
            className="w-full bg-obsidian-900 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-champagne-400 transition"
          />
        </div>

        {/* Location Dropdown */}
        <div className="relative w-full lg:w-56">
          <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-champagne-400 pointer-events-none" />
          <select
            value={filters.locationId}
            onChange={(e) => onFilterChange('locationId', e.target.value)}
            className="w-full bg-obsidian-900 border border-white/10 rounded-xl pl-10 pr-8 py-3 text-sm text-slate-200 focus:outline-none focus:border-champagne-400 transition appearance-none cursor-pointer"
          >
            <option value="">All Destinations</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Filters button */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center justify-center space-x-2 px-5 py-3 rounded-xl border text-xs font-medium uppercase tracking-wider transition w-full lg:w-auto ${
            expanded
              ? 'bg-champagne-400/20 text-champagne-300 border-champagne-400/50'
              : 'border-white/10 text-slate-300 hover:border-champagne-400/40'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-champagne-400" />
          <span>Filters</span>
        </button>
      </div>

      {/* Expanded multi-parameter filter row */}
      {expanded && (
        <div className="pt-6 mt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-in fade-in">
          {/* Property Type */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
              Property Type
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => onFilterChange('propertyType', e.target.value)}
              className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-champagne-400"
            >
              <option value="">All Types</option>
              <option value="PENTHOUSE">Penthouse</option>
              <option value="VILLA">Luxury Villa</option>
              <option value="APARTMENT">Apartment</option>
              <option value="DUPLEX">Duplex</option>
              <option value="TOWNHOUSE">Townhouse</option>
            </select>
          </div>

          {/* Min Bedrooms */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
              Min Bedrooms
            </label>
            <select
              value={filters.minBedrooms}
              onChange={(e) => onFilterChange('minBedrooms', e.target.value)}
              className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-champagne-400"
            >
              <option value="">Any Beds</option>
              <option value="1">1+ Bedrooms</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
              <option value="5">5+ Royal Bedrooms</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
              Handover Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-champagne-400"
            >
              <option value="">Any Status</option>
              <option value="READY">Ready to Move</option>
              <option value="OFF_PLAN">Off-Plan / Under Construction</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
              Min Price (AED)
            </label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              placeholder="e.g. 2000000"
              className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-champagne-400"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 font-medium">
              Max Price (AED)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                placeholder="e.g. 50000000"
                className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-champagne-400"
              />
              <button
                type="button"
                onClick={onClear}
                className="p-2 rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-slate-400 hover:text-white border border-white/10 transition"
                title="Clear all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
