import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Property, Location, Project, Amenity } from '../types';
import { Property3DViewer } from '../components/3d/Property3DViewer';
import {
  Building,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  X,
  Image as ImageIcon,
  Box,
  Layers,
  DollarSign,
  Tag,
  Star,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const PropertyManager: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [preview3D, setPreview3D] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'basics' | 'specs' | 'media' | 'amenities' | 'seo'>('basics');

  const initialForm = {
    id: 0,
    title: '',
    slug: '',
    referenceNumber: '',
    propertyType: 'PENTHOUSE',
    listingType: 'SALE',
    status: 'PUBLISHED',
    price: 15000000,
    currency: 'AED',
    bedrooms: 4,
    bathrooms: 5,
    builtUpAreaSqFt: 6500,
    plotAreaSqFt: 0,
    furnishingStatus: 'FURNISHED',
    shortDescription: '',
    description: '',
    featuredImageUrl: '',
    model3dEnabled: false,
    model3dUrl: '',
    model3dType: 'GLTF_GLB',
    model3dTitle: '',
    model3dCameraPreset: 'FRONT_ELEVATION',
    model3dLightingPreset: 'GOLDEN_HOUR',
    fallbackImageUrl: '',
    tour360Url: '',
    virtualTourUrl: '',
    videoUrl: '',
    floorplanUrl: '',
    locationId: undefined as number | undefined,
    projectId: undefined as number | undefined,
    address: '',
    latitude: 25.2048,
    longitude: 55.2708,
    isFeatured: true,
    isVerified: true,
    amenityIds: [] as number[],
    images: [] as { imageUrl: string; caption?: string; isPrimary: boolean; displayOrder: number }[],
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [propsRes, locsRes, projsRes, amensRes] = await Promise.all([
        api.admin.getProperties(),
        api.public.getLocations(),
        api.public.getProjects(),
        api.public.getAllAmenities(),
      ]);
      setProperties(propsRes);
      setLocations(locsRes);
      setProjects(projsRes);
      setAmenities(amensRes);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load property database' });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setForm({
      ...initialForm,
      referenceNumber: `ELY-${Math.floor(1000 + Math.random() * 9000)}`,
      locationId: locations[0]?.id,
    });
    setActiveTab('basics');
    setShowModal(true);
    setFeedback(null);
  };

  const openEditModal = (prop: Property) => {
    setIsEditing(true);
    setForm({
      id: prop.id,
      title: prop.title,
      slug: prop.slug,
      referenceNumber: prop.referenceNumber,
      propertyType: prop.propertyType,
      listingType: prop.listingType,
      status: prop.status,
      price: prop.price,
      currency: prop.currency || 'AED',
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      builtUpAreaSqFt: prop.builtUpAreaSqFt,
      plotAreaSqFt: prop.plotAreaSqFt || 0,
      furnishingStatus: prop.furnishingStatus || 'FURNISHED',
      shortDescription: prop.shortDescription || '',
      description: prop.description || '',
      featuredImageUrl: prop.featuredImageUrl || '',
      model3dEnabled: prop.model3dEnabled ?? false,
      model3dUrl: prop.model3dUrl || '',
      model3dType: prop.model3dType || 'GLTF_GLB',
      model3dTitle: prop.model3dTitle || '',
      model3dCameraPreset: prop.model3dCameraPreset || 'FRONT_ELEVATION',
      model3dLightingPreset: prop.model3dLightingPreset || 'GOLDEN_HOUR',
      fallbackImageUrl: prop.fallbackImageUrl || '',
      tour360Url: prop.tour360Url || '',
      virtualTourUrl: prop.virtualTourUrl || '',
      videoUrl: prop.videoUrl || '',
      floorplanUrl: prop.floorplanUrl || '',
      locationId: prop.location?.id,
      projectId: prop.project?.id,
      address: prop.address || '',
      latitude: prop.latitude || 25.2048,
      longitude: prop.longitude || 55.2708,
      isFeatured: prop.isFeatured,
      isVerified: prop.isVerified,
      amenityIds: prop.amenities ? prop.amenities.map((a) => a.id) : [],
      images: prop.images
        ? prop.images.map((img) => ({
            imageUrl: img.imageUrl,
            caption: img.caption,
            isPrimary: img.isPrimary,
            displayOrder: img.displayOrder,
          }))
        : [],
    });
    setActiveTab('basics');
    setShowModal(true);
    setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      setFeedback({ type: 'error', message: 'Title is required' });
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: form.title,
        slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        referenceNumber: form.referenceNumber,
        propertyType: form.propertyType,
        listingType: form.listingType,
        status: form.status,
        price: Number(form.price),
        currency: form.currency,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        builtUpAreaSqFt: Number(form.builtUpAreaSqFt),
        plotAreaSqFt: Number(form.plotAreaSqFt),
        furnishingStatus: form.furnishingStatus,
        shortDescription: form.shortDescription,
        description: form.description,
        featuredImageUrl: form.featuredImageUrl,
        model3dEnabled: form.model3dEnabled,
        model3dUrl: form.model3dUrl,
        model3dType: form.model3dType,
        model3dTitle: form.model3dTitle,
        model3dCameraPreset: form.model3dCameraPreset,
        model3dLightingPreset: form.model3dLightingPreset,
        fallbackImageUrl: form.fallbackImageUrl,
        tour360Url: form.tour360Url,
        virtualTourUrl: form.virtualTourUrl,
        videoUrl: form.videoUrl,
        floorplanUrl: form.floorplanUrl,
        locationId: form.locationId,
        projectId: form.projectId,
        address: form.address,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        isFeatured: form.isFeatured,
        isVerified: form.isVerified,
        amenityIds: form.amenityIds,
        images: form.images,
      };

      if (isEditing) {
        await api.admin.updateProperty(form.id, payload);
        setFeedback({ type: 'success', message: 'Property updated successfully!' });
      } else {
        await api.admin.createProperty(payload);
        setFeedback({ type: 'success', message: 'New property published successfully!' });
      }

      setShowModal(false);
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving property' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this property?')) return;
    try {
      await api.admin.deleteProperty(id);
      setFeedback({ type: 'success', message: 'Property deleted' });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error deleting property' });
    }
  };

  const toggleAmenity = (amenityId: number) => {
    setForm((prev) => {
      const exists = prev.amenityIds.includes(amenityId);
      return {
        ...prev,
        amenityIds: exists
          ? prev.amenityIds.filter((id) => id !== amenityId)
          : [...prev.amenityIds, amenityId],
      };
    });
  };

  const addImageUrl = () => {
    const url = prompt('Enter Image URL:');
    if (!url) return;
    setForm((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          imageUrl: url,
          isPrimary: prev.images.length === 0,
          displayOrder: prev.images.length + 1,
        },
      ],
    }));
  };

  const removeImageUrl = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  // Filtered list
  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (p.location?.name && p.location.name.toLowerCase().includes(search.toLowerCase()));

    const matchesType = filterType === 'ALL' || p.propertyType === filterType;
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
            <Building className="w-7 h-7 text-champagne-400" />
            Luxury Properties Portfolio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage ultra-luxury estate listings, 3D interactive spatial models, floorplans, and architectural assets.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-champagne-400 text-obsidian-950 font-bold text-xs hover:bg-champagne-300 transition flex items-center gap-2 shadow-glow-gold self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Luxury Property
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 transition ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-obsidian-900 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, reference, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-obsidian-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-champagne-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-champagne-400"
          >
            <option value="ALL">All Property Types</option>
            <option value="PENTHOUSE">Penthouse</option>
            <option value="VILLA">Villa / Mansion</option>
            <option value="APARTMENT">Apartment</option>
            <option value="TOWNHOUSE">Townhouse</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-champagne-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published (Live)</option>
            <option value="DRAFT">Draft</option>
            <option value="SOLD">Sold</option>
            <option value="RESERVED">Reserved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-obsidian-900 border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse">Loading properties...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No properties match your current filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-400 bg-obsidian-950/50">
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Features</th>
                  <th className="py-3 px-4">3D Tour</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {filtered.map((prop) => (
                  <tr key={prop.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.featuredImageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80'}
                          alt={prop.title}
                          className="w-12 h-12 rounded-lg object-cover border border-white/10"
                        />
                        <div>
                          <p className="font-semibold text-white line-clamp-1">{prop.title}</p>
                          <p className="text-[11px] text-slate-400">{prop.location?.name || 'Dubai, UAE'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-champagne-300">{prop.referenceNumber}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300">
                        {prop.propertyType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {prop.currency || 'AED'} {Number(prop.price).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400">
                      {prop.bedrooms} Beds &bull; {prop.bathrooms} Baths &bull; {prop.builtUpAreaSqFt} sq ft
                    </td>
                    <td className="py-3 px-4">
                      {prop.model3dUrl ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-champagne-400 font-semibold">
                          <Box className="w-3.5 h-3.5" /> 3D Ready
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          prop.status === 'PUBLISHED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : prop.status === 'SOLD'
                            ? 'bg-slate-700 text-slate-300'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {prop.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/properties/${prop.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-obsidian-950 border border-white/10 text-slate-400 hover:text-white transition"
                          title="View Live Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => openEditModal(prop)}
                          className="p-1.5 rounded-lg bg-obsidian-950 border border-white/10 text-champagne-400 hover:bg-champagne-400 hover:text-obsidian-950 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id)}
                          className="p-1.5 rounded-lg bg-obsidian-950 border border-white/10 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-champagne-400" />
                {isEditing ? `Edit Estate: ${form.title}` : 'Add Ultra-Luxury Property'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-2">
              {[
                { id: 'basics', label: '1. Basics & Details' },
                { id: 'specs', label: '2. Pricing & Specs' },
                { id: 'media', label: '3. Media & 3D Spatial' },
                { id: 'amenities', label: '4. Luxury Amenities' },
                { id: 'seo', label: '5. Descriptions & SEO' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === t.id
                      ? 'bg-champagne-400 text-obsidian-950 shadow-glow-gold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TAB 1: BASICS */}
              {activeTab === 'basics' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Property Title *</label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        placeholder="e.g. The Celestial Sky Villa"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Slug (URL)</label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        placeholder="e.g. the-celestial-sky-villa"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Reference Number</label>
                      <input
                        type="text"
                        value={form.referenceNumber}
                        onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-champagne-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Property Type</label>
                      <select
                        value={form.propertyType}
                        onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="PENTHOUSE">PENTHOUSE</option>
                        <option value="VILLA">VILLA</option>
                        <option value="MANSION">MANSION</option>
                        <option value="APARTMENT">APARTMENT</option>
                        <option value="TOWNHOUSE">TOWNHOUSE</option>
                        <option value="DUPLEX">DUPLEX</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Listing Status</label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="PUBLISHED">PUBLISHED (Live)</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="RESERVED">RESERVED</option>
                        <option value="SOLD">SOLD</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Community</label>
                      <select
                        value={form.locationId || ''}
                        onChange={(e) => setForm({ ...form, locationId: Number(e.target.value) || undefined })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="">None / Select Location</option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name} ({loc.city})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Development / Project</label>
                      <select
                        value={form.projectId || ''}
                        onChange={(e) => setForm({ ...form, projectId: Number(e.target.value) || undefined })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="">Independent / Select Project</option>
                        {projects.map((proj) => (
                          <option key={proj.id} value={proj.id}>
                            {proj.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Physical Address</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      placeholder="e.g. Palm Jumeirah Crescent, West Wing"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: SPECS */}
              {activeTab === 'specs' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Price *</label>
                      <input
                        type="number"
                        required
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Currency</label>
                      <input
                        type="text"
                        value={form.currency}
                        onChange={(e) => setForm({ ...form, currency: e.target.value })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Furnishing Status</label>
                      <select
                        value={form.furnishingStatus}
                        onChange={(e) => setForm({ ...form, furnishingStatus: e.target.value })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="FURNISHED">Fully Furnished (Bespoke)</option>
                        <option value="SEMI_FURNISHED">Semi Furnished</option>
                        <option value="UNFURNISHED">Unfurnished / Shell</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Bedrooms</label>
                      <input
                        type="number"
                        value={form.bedrooms}
                        onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Bathrooms</label>
                      <input
                        type="number"
                        value={form.bathrooms}
                        onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Built-Up Area (sq ft)</label>
                      <input
                        type="number"
                        value={form.builtUpAreaSqFt}
                        onChange={(e) => setForm({ ...form, builtUpAreaSqFt: Number(e.target.value) })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Plot Area (sq ft)</label>
                      <input
                        type="number"
                        value={form.plotAreaSqFt}
                        onChange={(e) => setForm({ ...form, plotAreaSqFt: Number(e.target.value) })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MEDIA & 3D */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Featured Image URL</label>
                    <input
                      type="text"
                      value={form.featuredImageUrl}
                      onChange={(e) => setForm({ ...form, featuredImageUrl: e.target.value })}
                      className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="bg-obsidian-950 p-4 rounded-xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-champagne-400 font-semibold text-xs">
                        <Box className="w-4 h-4" />
                        <span>Interactive 3D Spatial Experience (Three.js / WebGL)</span>
                      </div>
                      <label className="flex items-center space-x-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={form.model3dEnabled}
                          onChange={(e) => setForm({ ...form, model3dEnabled: e.target.checked })}
                          className="rounded border-white/20 text-champagne-400 focus:ring-champagne-400"
                        />
                        <span className="text-slate-300 font-medium">Enable 3D Viewer on Listing</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] text-slate-300 font-medium">3D Model URL (.glb / .gltf)</label>
                          <div className="flex items-center space-x-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setForm({
                                  ...form,
                                  model3dUrl:
                                    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
                                  model3dEnabled: true,
                                })
                              }
                              className="text-[10px] text-champagne-400 hover:text-champagne-300 underline"
                              title="Use Khronos official binary sample"
                            >
                              Khronos GLB
                            </button>
                            <span className="text-slate-600 text-[10px]">•</span>
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, model3dUrl: '', model3dEnabled: true })}
                              className="text-[10px] text-slate-400 hover:text-white underline"
                              title="Use built-in procedural pavilion model"
                            >
                              Procedural Pavilion
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={form.model3dUrl}
                          onChange={(e) => setForm({ ...form, model3dUrl: e.target.value })}
                          className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                          placeholder="https://.../model.glb (or leave empty for procedural pavilion)"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-300 font-medium mb-1">3D Experience Title</label>
                        <input
                          type="text"
                          value={form.model3dTitle}
                          onChange={(e) => setForm({ ...form, model3dTitle: e.target.value })}
                          className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                          placeholder="e.g. Interactive Sky Villa 3D Walkthrough"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] text-slate-300 font-medium mb-1">Camera Initial Preset</label>
                        <select
                          value={form.model3dCameraPreset}
                          onChange={(e) => setForm({ ...form, model3dCameraPreset: e.target.value })}
                          className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="FRONT_ELEVATION">Front Elevation (Eye Level)</option>
                          <option value="AERIAL_VIEW">Aerial Drone View (High Angle)</option>
                          <option value="CORNER_PERSPECTIVE">Corner Perspective (3/4 View)</option>
                          <option value="TERRACE_VIEW">Terrace Horizon View</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-300 font-medium mb-1">Lighting Atmosphere Preset</label>
                        <select
                          value={form.model3dLightingPreset}
                          onChange={(e) => setForm({ ...form, model3dLightingPreset: e.target.value })}
                          className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="GOLDEN_HOUR">Golden Hour (Sunset Luxury)</option>
                          <option value="STUDIO">Studio Daylight (Clean Architectural)</option>
                          <option value="OBSIDIAN_NIGHT">Obsidian Night (Glowing Twilight)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-300 font-medium mb-1">Fallback Image URL</label>
                        <input
                          type="text"
                          value={form.fallbackImageUrl}
                          onChange={(e) => setForm({ ...form, fallbackImageUrl: e.target.value })}
                          className="w-full bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                          placeholder="https://... (High-res photo if 3D fails)"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <label className="block text-[11px] text-slate-400 font-medium">360° Virtual Tour / Matterport URL:</label>
                        <input
                          type="text"
                          value={form.tour360Url}
                          onChange={(e) => setForm({ ...form, tour360Url: e.target.value })}
                          className="bg-obsidian-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white w-72"
                          placeholder="https://my.matterport.com/..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreview3D(!preview3D)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                          preview3D
                            ? 'bg-champagne-400 text-obsidian-950 shadow-glow-gold'
                            : 'bg-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{preview3D ? 'Hide 3D Preview' : 'Test Live 3D Preview'}</span>
                      </button>
                    </div>

                    {/* Live 3D Test Viewer inside Admin Form */}
                    {preview3D && (
                      <div className="mt-3 border border-champagne-400/30 rounded-xl overflow-hidden">
                        <div className="bg-obsidian-900 px-3 py-1.5 text-[11px] text-champagne-300 font-semibold border-b border-white/5 flex items-center justify-between">
                          <span>Live CMS Interactive 3D Preview</span>
                          <span className="text-[10px] text-slate-400 font-mono">Real-time Three.js Canvas</span>
                        </div>
                        <Property3DViewer
                          modelUrl={form.model3dUrl}
                          enabled={true}
                          title={form.model3dTitle || form.title || '3D Preview'}
                          fallbackImage={form.fallbackImageUrl || form.featuredImageUrl}
                          cameraPreset={form.model3dCameraPreset}
                          lightingPreset={form.model3dLightingPreset}
                          tour360Url={form.tour360Url}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Virtual Tour URL</label>
                      <input
                        type="text"
                        value={form.virtualTourUrl}
                        onChange={(e) => setForm({ ...form, virtualTourUrl: e.target.value })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        placeholder="Matterport or iframe link"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Video Walkthrough URL</label>
                      <input
                        type="text"
                        value={form.videoUrl}
                        onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                        placeholder="YouTube / Vimeo URL"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Floorplan Image URL</label>
                      <input
                        type="text"
                        value={form.floorplanUrl}
                        onChange={(e) => setForm({ ...form, floorplanUrl: e.target.value })}
                        className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Gallery items */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-300">Property Image Gallery</label>
                      <button
                        type="button"
                        onClick={addImageUrl}
                        className="text-xs text-champagne-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Image URL
                      </button>
                    </div>
                    <div className="space-y-2">
                      {form.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-obsidian-950 p-2.5 rounded-xl border border-white/10"
                        >
                          <img src={img.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                          <span className="text-xs text-slate-300 flex-1 truncate font-mono text-[11px]">
                            {img.imageUrl}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeImageUrl(idx)}
                            className="text-rose-400 hover:text-rose-300 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: AMENITIES */}
              {activeTab === 'amenities' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">Select luxury amenities and architectural highlights included:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {amenities.map((amen) => {
                      const selected = form.amenityIds.includes(amen.id);
                      return (
                        <button
                          key={amen.id}
                          type="button"
                          onClick={() => toggleAmenity(amen.id)}
                          className={`p-3 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                            selected
                              ? 'bg-champagne-400/20 border-champagne-400 text-champagne-300 shadow-glow-gold'
                              : 'bg-obsidian-950 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{amen.name}</span>
                          {selected && <CheckCircle className="w-3.5 h-3.5 text-champagne-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: DESCRIPTIONS & SEO */}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Executive Summary / Short Description</label>
                    <textarea
                      rows={2}
                      value={form.shortDescription}
                      onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                      className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      placeholder="Concise luxury highlight for cards and previews"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Architectural Narrative</label>
                    <textarea
                      rows={6}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 text-xs text-white"
                      placeholder="Comprehensive architectural writeup, materials, view orientation, layout..."
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                        className="rounded text-champagne-400"
                      />
                      <span>Featured on Homepage</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.isVerified}
                        onChange={(e) => setForm({ ...form, isVerified: e.target.checked })}
                        className="rounded text-champagne-400"
                      />
                      <span>Verified Title Deed & Accreditation</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-obsidian-800 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-champagne-400 text-obsidian-950 text-xs font-bold hover:bg-champagne-300 transition shadow-glow-gold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : isEditing ? 'Update Property' : 'Publish Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
