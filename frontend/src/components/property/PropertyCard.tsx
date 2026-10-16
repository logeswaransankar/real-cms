import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { Bed, Bath, Maximize2, MapPin, Box, Heart, Sparkles } from 'lucide-react';

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
      <div className="group glass-panel rounded-2xl overflow-hidden hover:border-champagne-400/50 transition duration-300 flex flex-col md:flex-row shadow-luxury">
        {/* Image thumbnail */}
        <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden">
          <img
            src={coverImage}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent md:hidden" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider bg-obsidian-900/90 text-champagne-300 border border-champagne-400/30 backdrop-blur-md">
              {property.transactionType === 'BUY' ? 'For Sale' : 'For Rent'}
            </span>
            {property.featured && (
              <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider bg-champagne-400 text-obsidian-900 shadow-glow-gold flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Featured</span>
              </span>
            )}
            {property.model3dEnabled && (
              <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-400/30 backdrop-blur-md flex items-center space-x-1">
                <Box className="w-3 h-3" />
                <span>3D View</span>
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-4 right-4 p-2 rounded-full glass-panel hover:bg-champagne-400/20 text-slate-300 transition"
            aria-label="Save to Favourites"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 md:w-3/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center space-x-1 text-champagne-300">
                <MapPin className="w-3.5 h-3.5" />
                <span>{property.location?.name || property.address || 'Dubai'}</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">REF: {property.referenceNumber}</span>
            </div>

            <Link to={`/properties/${property.slug}`}>
              <h3 className="font-serif text-xl font-medium text-white group-hover:text-champagne-300 transition line-clamp-1 mb-2">
                {property.title}
              </h3>
            </Link>

            <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
              {property.description}
            </p>
          </div>

          <div>
            <div className="flex items-center space-x-6 text-xs text-slate-300 py-3 border-y border-white/5 mb-4">
              <div className="flex items-center space-x-1.5">
                <Bed className="w-4 h-4 text-champagne-400" />
                <span>{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Bath className="w-4 h-4 text-champagne-400" />
                <span>{property.bathrooms} Baths</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Maximize2 className="w-4 h-4 text-champagne-400" />
                <span>{Number(property.areaSqft).toLocaleString()} sq.ft</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Pricing</span>
                <span className="font-serif text-xl font-bold gold-gradient-text">
                  {formatPrice(property.price, property.currency)}
                </span>
              </div>

              <Link
                to={`/properties/${property.slug}`}
                className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/5 hover:bg-champagne-400 hover:text-obsidian-900 border border-white/10 hover:border-champagne-400 transition"
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
    <div className="group glass-panel rounded-2xl overflow-hidden hover:border-champagne-400/50 transition-all duration-300 flex flex-col shadow-luxury">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-obsidian-900">
        <img
          src={coverImage}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider bg-obsidian-900/90 text-champagne-300 border border-champagne-400/30 backdrop-blur-md">
            {property.transactionType === 'BUY' ? 'For Sale' : 'For Rent'}
          </span>
          {property.featured && (
            <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider bg-champagne-400 text-obsidian-900 shadow-glow-gold flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </span>
          )}
          {property.model3dEnabled && (
            <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-400/30 backdrop-blur-md flex items-center space-x-1">
              <Box className="w-3 h-3" />
              <span>3D Model</span>
            </span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 p-2 rounded-full glass-panel hover:bg-champagne-400/20 text-slate-300 transition"
          aria-label="Save to Favourites"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Price & Ref Tag in bottom image overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-medium">Price</span>
            <span className="font-serif text-lg sm:text-xl font-bold gold-gradient-text drop-shadow">
              {formatPrice(property.price, property.currency)}
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/60 text-slate-400 border border-white/10">
            {property.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Body details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center space-x-1 text-xs text-champagne-300 mb-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{property.location?.name || property.address || 'Dubai'}</span>
          </div>

          <Link to={`/properties/${property.slug}`}>
            <h3 className="font-serif text-lg font-medium text-white group-hover:text-champagne-300 transition line-clamp-1">
              {property.title}
            </h3>
          </Link>
        </div>

        {/* Specs bar */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-1">
            <Bed className="w-3.5 h-3.5 text-champagne-400" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bath className="w-3.5 h-3.5 text-champagne-400" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center space-x-1">
            <Maximize2 className="w-3.5 h-3.5 text-champagne-400" />
            <span>{Number(property.areaSqft).toLocaleString()} sq.ft</span>
          </div>
        </div>
      </div>
    </div>
  );
};
