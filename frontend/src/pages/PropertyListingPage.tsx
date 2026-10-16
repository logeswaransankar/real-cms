import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Property, PagedResponse } from '../types';
import { PropertyCard } from '../components/property/PropertyCard';
import { PropertyFilters } from '../components/property/PropertyFilters';
import { LayoutGrid, List, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

export const PropertyListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    transactionType: searchParams.get('transactionType') || '',
    locationId: searchParams.get('locationId') || '',
    propertyType: searchParams.get('propertyType') || '',
    status: searchParams.get('status') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minBedrooms: searchParams.get('minBedrooms') || '',
    query: searchParams.get('query') || '',
  });

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('DESC');
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [propertyData, setPropertyData] = useState<PagedResponse<Property> | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync state changes with URL query parameters
  useEffect(() => {
    const params: Record<string, string> = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const res = await api.public.getProperties({
          ...filters,
          sortBy,
          sortDir,
          page,
          size: 9,
        });
        setPropertyData(res);
      } catch (err) {
        console.error('Error fetching properties', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, [filters, sortBy, sortDir, page]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      transactionType: '',
      locationId: '',
      propertyType: '',
      status: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      query: '',
    });
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title Header */}
        <div className="mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold block mb-2">
            The Private Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white">
            Curated Luxury Residences
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl font-light">
            Explore world-renowned waterfront mansions, architectural penthouses, and prime off-plan residences.
          </p>
        </div>

        {/* Dynamic Filters Component */}
        <PropertyFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {/* View Controls & Sorting Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5">
          <div className="text-xs text-slate-400">
            Showing{' '}
            <span className="font-semibold text-white">
              {propertyData?.totalElements || 0}
            </span>{' '}
            verified residences
          </div>

          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Sort by:</span>
              <select
                value={`${sortBy}_${sortDir}`}
                onChange={(e) => {
                  const [field, dir] = e.target.value.split('_');
                  setSortBy(field);
                  setSortDir(dir);
                  setPage(0);
                }}
                className="bg-obsidian-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-champagne-400"
              >
                <option value="createdAt_DESC">Newest Additions</option>
                <option value="price_ASC">Price: Low to High</option>
                <option value="price_DESC">Price: High to Low</option>
                <option value="areaSqft_DESC">Largest Area</option>
              </select>
            </div>

            {/* Grid vs List toggle */}
            <div className="flex items-center p-1 rounded-lg bg-obsidian-900 border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition ${
                  viewMode === 'grid'
                    ? 'bg-champagne-400 text-obsidian-900'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition ${
                  viewMode === 'list'
                    ? 'bg-champagne-400 text-obsidian-900'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Listings Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 text-champagne-400 animate-spin" />
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Filtering Portfolio...
            </p>
          </div>
        ) : propertyData?.content && propertyData.content.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'space-y-6'
            }
          >
            {propertyData.content.map((prop: Property) => (
              <PropertyCard key={prop.id} property={prop} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-16 text-center max-w-lg mx-auto space-y-4">
            <AlertCircle className="w-10 h-10 text-champagne-400 mx-auto" />
            <h3 className="font-serif text-xl font-medium text-white">
              No matching residences found
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We couldn't find any properties matching your current criteria. Try expanding your price range or clearing specific filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-champagne-400 text-obsidian-900 hover:bg-champagne-300 transition"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {propertyData && propertyData.totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center space-x-3">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="p-2.5 rounded-full glass-panel hover:border-champagne-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-1.5 text-xs font-medium">
              {Array.from({ length: propertyData.totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx)}
                  className={`w-8 h-8 rounded-full transition flex items-center justify-center ${
                    page === idx
                      ? 'bg-champagne-400 text-obsidian-900 font-bold'
                      : 'glass-panel text-slate-300 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              disabled={propertyData.last}
              onClick={() => setPage(page + 1)}
              className="p-2.5 rounded-full glass-panel hover:border-champagne-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
