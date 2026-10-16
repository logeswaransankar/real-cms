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
    <div className="min-h-screen bg-[#faf9f6] text-[#1c1b1a] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title Header */}
        <div className="mb-8 pb-4 border-b border-[#e7e4dc]">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#997e55] font-semibold block mb-1">
            Private Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1c1b1a]">
            Curated Luxury Residences
          </h1>
          <p className="text-xs sm:text-sm text-[#6e6962] mt-2 max-w-xl font-light">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-[#e7e4dc]">
          <div className="text-xs text-[#6e6962]">
            Showing{' '}
            <span className="font-semibold text-[#1c1b1a]">
              {propertyData?.totalElements || 0}
            </span>{' '}
            verified residences
          </div>

          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#8c8675]">Sort by:</span>
              <select
                value={`${sortBy}_${sortDir}`}
                onChange={(e) => {
                  const [field, dir] = e.target.value.split('_');
                  setSortBy(field);
                  setSortDir(dir);
                  setPage(0);
                }}
                className="bg-white border border-[#e7e4dc] px-3 py-1.5 text-xs text-[#1c1b1a] focus:outline-none focus:border-[#1c1b1a]"
              >
                <option value="createdAt_DESC">Newest Additions</option>
                <option value="price_ASC">Price: Low to High</option>
                <option value="price_DESC">Price: High to Low</option>
                <option value="areaSqft_DESC">Largest Area</option>
              </select>
            </div>

            {/* Grid vs List toggle */}
            <div className="flex items-center border border-[#e7e4dc] bg-white">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#1c1b1a] text-white'
                    : 'text-[#8c8675] hover:text-[#1c1b1a]'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#1c1b1a] text-white'
                    : 'text-[#8c8675] hover:text-[#1c1b1a]'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Section: Loading, Empty, or Property Cards */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#997e55] animate-spin" />
            <p className="text-xs uppercase tracking-widest text-[#8c8675]">
              Loading Verified Residences...
            </p>
          </div>
        ) : !propertyData?.content || propertyData.content.length === 0 ? (
          <div className="border border-[#e7e4dc] bg-white p-12 text-center my-8 max-w-lg mx-auto space-y-4">
            <AlertCircle className="w-8 h-8 text-[#997e55] mx-auto" />
            <h3 className="font-serif text-xl font-normal text-[#1c1b1a]">
              No Residences Match Your Parameters
            </h3>
            <p className="text-xs text-[#6e6962] leading-relaxed">
              We could not find properties matching your current filter selections. Try broadening your criteria or reset the search filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 bg-[#1c1b1a] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#2e2b27] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'space-y-6'
              }
            >
              {propertyData.content.map((prop) => (
                <PropertyCard key={prop.id} property={prop} viewMode={viewMode} />
              ))}
            </div>

            {/* Pagination Controls */}
            {propertyData.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-16 pt-8 border-t border-[#e7e4dc]">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="p-2 border border-[#e7e4dc] bg-white disabled:opacity-30 hover:border-[#1c1b1a] transition-colors"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4 text-[#1c1b1a]" />
                </button>

                <div className="flex items-center space-x-1 text-xs">
                  {Array.from({ length: propertyData.totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPage(idx)}
                      className={`w-8 h-8 font-semibold transition-colors ${
                        page === idx
                          ? 'bg-[#1c1b1a] text-white'
                          : 'border border-[#e7e4dc] bg-white text-[#5c5851] hover:border-[#1c1b1a]'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={page >= propertyData.totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 border border-[#e7e4dc] bg-white disabled:opacity-30 hover:border-[#1c1b1a] transition-colors"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4 text-[#1c1b1a]" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
