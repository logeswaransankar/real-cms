import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { Bed, Bath, Maximize2, MapPin, Box, Heart } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, viewMode = 'grid' }) => {
  const { formatPrice } = useSettings();
  const [isLiked, setIsLiked] = useState(false);

  const coverImage =
    property.images && property.images.length > 0
      ? property.images.find((img) => img.cover)?.imageUrl || property.images[0].imageUrl
      : property.fallbackImageUrl ||
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80';

  if (viewMode === 'list') {
    return (
      <div className="editorial-card group flex flex-col md:flex-row overflow-hidden border border-[#e7e4dc] bg-white transition-all duration-300 hover:border-[#cfc9bb] hover:shadow-sm">
        {/* Image column */}
        <div className="relative md:w-5/12 h-64 md:h-auto overflow-hidden bg-[#f5f4f0]">
          <Link to={`/properties/${property.slug}`} className="block w-full h-full">
            <img
              src={coverImage}
              alt={property.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Restrained Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-widest bg-white/95 text-[#1c1b1a] border border-[#e7e4dc]">
              {property.transactionType === 'BUY' ? 'For Sale' : 'For Rent'}
            </span>
            {property.featured && (
              <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-widest bg-[#1c1b1a] text-white">
                Signature
              </span>
            )}
            {property.model3dEnabled && (
              <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-widest bg-[#997e55] text-white flex items-center space-x-1">
                <Box className="w-3 h-3" />
                <span>3D Tour</span>
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white border border-[#e7e4dc] text-[#5c5851] transition"
            aria-label="Save to Favourites"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Content column */}
        <div className="p-6 md:w-7/12 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8c8675] mb-2">
              <span className="flex items-center space-x-1 font-medium text-[#5c5851]">
                <MapPin className="w-3.5 h-3.5 text-[#997e55]" />
                <span>{property.location?.name || property.address || 'Dubai'}</span>
              </span>
              <span className="text-[11px] font-mono text-[#a19c91]">REF: {property.referenceNumber}</span>
            </div>

            <Link to={`/properties/${property.slug}`}>
              <h3 className="font-serif text-lg font-medium text-[#1c1b1a] group-hover:text-[#997e55] transition-colors line-clamp-1 mb-2">
                {property.title}
              </h3>
            </Link>

            <p className="text-xs text-[#6e6962] line-clamp-2 leading-relaxed mb-4">
              {property.description}
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-6 text-xs text-[#5c5851] py-3 border-y border-[#f0ede6] mb-4">
              <div className="flex items-center space-x-1.5">
                <Bed className="w-4 h-4 text-[#997e55]" />
                <span>{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Bath className="w-4 h-4 text-[#997e55]" />
                <span>{property.bathrooms} Baths</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Maximize2 className="w-4 h-4 text-[#997e55]" />
                <span>{Number(property.areaSqft).toLocaleString()} sq.ft</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8c8675] block">Price</span>
                <span className="font-serif text-xl font-semibold text-[#1c1b1a]">
                  {formatPrice(property.price, property.currency)}
                </span>
              </div>

              <Link
                to={`/properties/${property.slug}`}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1c1b1a] text-white hover:bg-[#2e2b27] transition-colors"
              >
                View Residence
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (Default)
  return (
    <div className="editorial-card group flex flex-col overflow-hidden border border-[#e7e4dc] bg-white transition-all duration-300 hover:border-[#cfc9bb] hover:shadow-sm">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f5f4f0]">
        <Link to={`/properties/${property.slug}`} className="block w-full h-full">
          <img
            src={coverImage}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Restrained Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-widest bg-white/95 text-[#1c1b1a] border border-[#e7e4dc]">
            {property.transactionType === 'BUY' ? 'For Sale' : 'For Rent'}
          </span>
          {property.featured && (
            <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-widest bg-[#1c1b1a] text-white">
              Signature
            </span>
          )}
          {property.model3dEnabled && (
            <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-widest bg-[#997e55] text-white flex items-center space-x-1">
              <Box className="w-3 h-3" />
              <span>3D Tour</span>
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white border border-[#e7e4dc] text-[#5c5851] transition"
          aria-label="Save to Favourites"
        >
          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-[#8c8675] mb-2">
            <span className="flex items-center space-x-1 text-[#5c5851] truncate max-w-[200px]">
              <MapPin className="w-3.5 h-3.5 text-[#997e55] flex-shrink-0" />
              <span className="truncate">{property.location?.name || property.address || 'Dubai'}</span>
            </span>
            <span className="text-[11px] font-mono text-[#a19c91]">REF: {property.referenceNumber}</span>
          </div>

          <Link to={`/properties/${property.slug}`}>
            <h3 className="font-serif text-base font-medium text-[#1c1b1a] group-hover:text-[#997e55] transition-colors line-clamp-1 mb-2">
              {property.title}
            </h3>
          </Link>

          <p className="text-xs text-[#6e6962] line-clamp-2 leading-relaxed mb-4">
            {property.description}
          </p>
        </div>

        <div>
          {/* Key specs */}
          <div className="flex items-center justify-between text-xs text-[#5c5851] py-3 border-t border-[#f0ede6] mb-3">
            <div className="flex items-center space-x-1">
              <Bed className="w-3.5 h-3.5 text-[#997e55]" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="w-3.5 h-3.5 text-[#997e55]" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center space-x-1">
              <Maximize2 className="w-3.5 h-3.5 text-[#997e55]" />
              <span>{Number(property.areaSqft).toLocaleString()} sq.ft</span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#8c8675] block">Price</span>
              <span className="font-serif text-lg font-semibold text-[#1c1b1a]">
                {formatPrice(property.price, property.currency)}
              </span>
            </div>

            <Link
              to={`/properties/${property.slug}`}
              className="text-xs font-semibold uppercase tracking-wider text-[#1c1b1a] hover:text-[#997e55] underline underline-offset-4 transition-colors"
            >
              Details &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
