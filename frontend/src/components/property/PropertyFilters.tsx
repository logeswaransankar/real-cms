import React, { useEffect, useState } from 'react';
import { Location } from '../../types';
import { api } from '../../services/api';
import { Search, SlidersHorizontal, RotateCcw, MapPin, Building2 } from 'lucide-react';

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
    <div className="border border-[#e7e4dc] bg-white p-4 sm:p-6 mb-8">
      {/* Primary search bar & Transaction toggle */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* Buy / Rent Pill Tabs */}
        <div className="flex border border-[#e7e4dc] bg-[#faf9f6] p-1 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => onFilterChange('transactionType', 'BUY')}
            className={`flex-1 lg:flex-initial px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
              filters.transactionType === 'BUY'
                ? 'bg-[#1c1b1a] text-white'
                : 'text-[#5c5851] hover:text-[#1c1b1a]'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('transactionType', 'RENT')}
            className={`flex-1 lg:flex-initial px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
              filters.transactionType === 'RENT'
                ? 'bg-[#1c1b1a] text-white'
                : 'text-[#5c5851] hover:text-[#1c1b1a]'
            }`}
          >
            Rent
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('transactionType', '')}
            className={`flex-1 lg:flex-initial px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
              filters.transactionType === ''
                ? 'bg-[#1c1b1a] text-white'
                : 'text-[#5c5851] hover:text-[#1c1b1a]'
            }`}
          >
            All
          </button>
        </div>

        {/* Search input */}
        <div className="relative flex-1 w-full border border-[#e7e4dc] bg-[#faf9f6]">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#997e55] pointer-events-none" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onFilterChange('query', e.target.value)}
            placeholder="Search by development, architectural style, or reference ID..."
            className="w-full bg-transparent pl-10 pr-4 py-2.5 text-xs text-[#1c1b1a] placeholder-[#8c8675] focus:outline-none"
          />
        </div>

        {/* Location Dropdown */}
        <div className="relative w-full lg:w-56 border border-[#e7e4dc] bg-[#faf9f6]">
          <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-[#997e55] pointer-events-none" />
          <select
            value={filters.locationId}
            onChange={(e) => onFilterChange('locationId', e.target.value)}
            className="w-full bg-transparent pl-10 pr-8 py-2.5 text-xs text-[#1c1b1a] appearance-none focus:outline-none cursor-pointer"
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
          className={`flex items-center justify-center space-x-2 px-5 py-2.5 border text-xs font-medium uppercase tracking-wider transition-colors w-full lg:w-auto ${
            expanded
              ? 'bg-[#1c1b1a] text-white border-[#1c1b1a]'
              : 'border-[#e7e4dc] text-[#1c1b1a] hover:border-[#1c1b1a] bg-[#faf9f6]'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Expanded multi-parameter filter row */}
      {expanded && (
        <div className="pt-6 mt-6 border-t border-[#f0ede6] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Property Type */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#8c8675] mb-1 font-semibold">
              Property Type
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => onFilterChange('propertyType', e.target.value)}
              className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none"
            >
              <option value="">All Property Types</option>
              <option value="PENTHOUSE">Penthouse</option>
              <option value="VILLA">Luxury Villa</option>
              <option value="APARTMENT">Apartment</option>
              <option value="DUPLEX">Duplex</option>
              <option value="TOWNHOUSE">Townhouse</option>
            </select>
          </div>

          {/* Min Bedrooms */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#8c8675] mb-1 font-semibold">
              Min Bedrooms
            </label>
            <select
              value={filters.minBedrooms}
              onChange={(e) => onFilterChange('minBedrooms', e.target.value)}
              className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none"
            >
              <option value="">Any Bedrooms</option>
              <option value="1">1+ Bedrooms</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
              <option value="5">5+ Suites</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#8c8675] mb-1 font-semibold">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="AVAILABLE">Ready for Occupancy</option>
              <option value="OFF_PLAN">Off-Plan / Pre-Launch</option>
              <option value="UNDER_OFFER">Under Offer</option>
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#8c8675] mb-1 font-semibold">
              Min Price
            </label>
            <input
              type="number"
              placeholder="e.g. 2,000,000"
              value={filters.minPrice}
              onChange={(e) => onFilterChange('minPrice', e.target.value)}
              className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#8c8675] mb-1 font-semibold">
              Max Price
            </label>
            <input
              type="number"
              placeholder="e.g. 50,000,000"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-full border border-[#e7e4dc] bg-[#faf9f6] px-3 py-2 text-xs text-[#1c1b1a] focus:outline-none"
            />
          </div>

          {/* Reset Filters */}
          <div className="sm:col-span-2 lg:col-span-5 flex justify-end pt-2">
            <button
              type="button"
              onClick={onClear}
              className="flex items-center space-x-1 text-xs text-[#8c8675] hover:text-[#1c1b1a] font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
