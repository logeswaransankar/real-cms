import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Project, Location, Developer } from '../types';
import {
  FolderGit2,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  Building2,
  MapPin,
  Calendar,
} from 'lucide-react';

export const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
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
    shortDescription: '',
    description: '',
    featuredImageUrl: '',
    completionYear: 2026,
    startingPrice: 3500000,
    status: 'UNDER_CONSTRUCTION',
    isFeatured: true,
    locationId: undefined as number | undefined,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projsRes, locsRes] = await Promise.all([
        api.admin.getProjects(),
        api.public.getLocations(),
      ]);
      setProjects(projsRes);
      setLocations(locsRes);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load projects' });
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
      shortDescription: '',
      description: '',
      featuredImageUrl: '',
      completionYear: 2026,
      startingPrice: 5000000,
      status: 'OFF_PLAN',
      isFeatured: true,
      locationId: locations[0]?.id,
    });
    setShowModal(true);
  };

  const openEditModal = (proj: Project) => {
    setIsEditing(true);
    setForm({
      id: proj.id,
      name: proj.name,
      slug: proj.slug,
      shortDescription: proj.shortDescription || '',
      description: proj.description || '',
      featuredImageUrl: proj.featuredImageUrl || '',
      completionYear: proj.completionYear || 2026,
      startingPrice: proj.startingPrice || 0,
      status: proj.status || 'UNDER_CONSTRUCTION',
      isFeatured: proj.isFeatured,
      locationId: proj.location?.id,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        project: {
          name: form.name,
          slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          shortDescription: form.shortDescription,
          description: form.description,
          featuredImageUrl: form.featuredImageUrl,
          completionYear: Number(form.completionYear),
          startingPrice: Number(form.startingPrice),
          status: form.status,
          isFeatured: form.isFeatured,
        },
        locationId: form.locationId,
      };

      if (isEditing) {
        await api.admin.updateProject(form.id, payload);
        setFeedback({ type: 'success', message: 'Development updated successfully!' });
      } else {
        await api.admin.createProject(payload);
        setFeedback({ type: 'success', message: 'New development created successfully!' });
      }
      setShowModal(false);
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving project' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this development?')) return;
    try {
      await api.admin.deleteProject(id);
      setFeedback({ type: 'success', message: 'Development deleted' });
      await loadData();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error deleting development' });
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.location?.name && p.location.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
            <FolderGit2 className="w-7 h-7 text-champagne-400" />
            Masterplan Developments & Projects
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage off-plan developments, branded residences, handover years, and master community associations.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-champagne-400 text-obsidian-950 font-bold text-xs hover:bg-champagne-300 transition flex items-center gap-2 shadow-glow-gold"
        >
          <Plus className="w-4 h-4" />
          Add Development
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
            placeholder="Search developments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-obsidian-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-champagne-400"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">Loading developments...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs">No developments found.</div>
        ) : (
          filtered.map((proj) => (
            <div
              key={proj.id}
              className="bg-obsidian-900 border border-white/5 hover:border-champagne-400/30 rounded-2xl overflow-hidden transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={proj.featuredImageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-obsidian-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-champagne-400 uppercase tracking-wider border border-white/10">
                    {proj.status}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-serif font-bold text-white group-hover:text-champagne-400 transition">
                    {proj.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-champagne-400" />
                    <span>{proj.location?.name || 'Dubai, UAE'}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {proj.shortDescription || 'Exclusive master-planned architectural community.'}
                  </p>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Starting From</span>
                      <span className="font-bold text-white">AED {Number(proj.startingPrice || 0).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Completion</span>
                      <span className="font-mono text-champagne-300">{proj.completionYear || 'TBA'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-obsidian-950/50 border-t border-white/5 flex items-center justify-between">
                <a
                  href={`/projects/${proj.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Preview Live
                </a>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(proj)}
                    className="p-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-champagne-400 hover:bg-champagne-400 hover:text-obsidian-950 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
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
          <div className="bg-obsidian-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-white">
                {isEditing ? `Edit: ${form.name}` : 'New Masterplan Development'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Community</label>
                  <select
                    value={form.locationId || ''}
                    onChange={(e) => setForm({ ...form, locationId: Number(e.target.value) || undefined })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="">Select Location</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Starting Price (AED)</label>
                  <input
                    type="number"
                    value={form.startingPrice}
                    onChange={(e) => setForm({ ...form, startingPrice: Number(e.target.value) })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Handover Year</label>
                  <input
                    type="number"
                    value={form.completionYear}
                    onChange={(e) => setForm({ ...form, completionYear: Number(e.target.value) })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Featured Banner Image URL</label>
                <input
                  type="text"
                  value={form.featuredImageUrl}
                  onChange={(e) => setForm({ ...form, featuredImageUrl: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description</label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Architectural Narrative</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
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
                  {saving ? 'Saving...' : 'Save Development'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
