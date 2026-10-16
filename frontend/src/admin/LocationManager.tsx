import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Location } from '../types';
import {
  MapPin,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  Globe,
} from 'lucide-react';

export const LocationManager: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search
  const [search, setSearch] = useState('');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    id: 0,
    name: '',
    slug: '',
    city: 'Dubai',
    country: 'United Arab Emirates',
    description: '',
    heroImage: '',
    popular: true,
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getLocations();
      setLocations(res);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load locations' });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setForm({
      id: 0,
      name: '',
      slug: '',
      city: 'Dubai',
      country: 'United Arab Emirates',
      description: '',
      heroImage: '',
      popular: true,
    });
    setShowModal(true);
  };

  const openEditModal = (loc: Location) => {
    setIsEditing(true);
    setForm({
      id: loc.id,
      name: loc.name,
      slug: loc.slug,
      city: loc.city || 'Dubai',
      country: loc.country || 'United Arab Emirates',
      description: loc.description || '',
      heroImage: loc.heroImage || '',
      popular: loc.popular !== undefined ? loc.popular : true,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        city: form.city,
        country: form.country,
        description: form.description,
        heroImage: form.heroImage,
        popular: form.popular,
      };

      if (isEditing) {
        await api.admin.updateLocation(form.id, payload);
        setFeedback({ type: 'success', message: 'Location updated successfully!' });
      } else {
        await api.admin.createLocation(payload);
        setFeedback({ type: 'success', message: 'Location created successfully!' });
      }
      setShowModal(false);
      await loadLocations();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving location' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
      await api.admin.deleteLocation(id);
      setFeedback({ type: 'success', message: 'Location deleted' });
      await loadLocations();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error deleting location' });
    }
  };

  const filtered = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.city.toLowerCase().includes(search.toLowerCase()) ||
      loc.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
            <MapPin className="w-7 h-7 text-champagne-400" />
            Prime Locations & Destinations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage luxury districts, waterfront communities, and metropolitan neighborhoods featured across listings.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-champagne-400 text-obsidian-950 font-bold text-xs hover:bg-champagne-300 transition flex items-center gap-2 shadow-glow-gold"
        >
          <Plus className="w-4 h-4" />
          Add Prime Location
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Search */}
      <div className="bg-obsidian-900 border border-white/5 rounded-2xl p-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search locations by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-obsidian-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-champagne-400"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">Loading locations...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs">No locations found.</div>
        ) : (
          filtered.map((loc) => (
            <div
              key={loc.id}
              className="bg-obsidian-900 border border-white/5 hover:border-champagne-400/30 rounded-2xl overflow-hidden transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={loc.heroImage || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80'}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {loc.popular && (
                    <div className="absolute top-3 left-3 bg-champagne-400 text-obsidian-950 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider shadow-glow-gold">
                      Prime Featured
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-obsidian-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-white/10">
                    {loc.propertyCount || 0} Residences
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-serif font-bold text-white group-hover:text-champagne-400 transition">
                    {loc.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Globe className="w-3.5 h-3.5 text-champagne-400" />
                    <span>{loc.city}, {loc.country}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-2">
                    {loc.description || 'Prestige residential community featuring signature waterfront villas and sky penthouses.'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-obsidian-950/50 border-t border-white/5 flex items-center justify-between">
                <a
                  href={`/locations`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Public Page
                </a>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(loc)}
                    className="p-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-champagne-400 hover:bg-champagne-400 hover:text-obsidian-950 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(loc.id)}
                    className="p-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-white">
                {isEditing ? `Edit: ${form.name}` : 'New Prime Destination'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">District / Location Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="e.g. Palm Jumeirah"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="e.g. palm-jumeirah"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Cover Image URL</label>
                <input
                  type="text"
                  value={form.heroImage}
                  onChange={(e) => setForm({ ...form, heroImage: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Community Overview</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 text-xs text-white"
                  placeholder="Atmosphere, amenities, waterfront promenades..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="loc_popular"
                  checked={form.popular}
                  onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                  className="rounded text-champagne-400"
                />
                <label htmlFor="loc_popular" className="text-xs text-slate-300 cursor-pointer">
                  Featured Prime Destination (Showcased on Homepage)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-obsidian-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-champagne-400 text-obsidian-950 text-xs font-bold shadow-glow-gold"
                >
                  {saving ? 'Saving...' : 'Save Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
