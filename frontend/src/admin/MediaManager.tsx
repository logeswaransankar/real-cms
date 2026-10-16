import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MediaAsset } from '../types';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Box,
  FileText,
  Video,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export const MediaManager: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Register External Asset Modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    fileName: '',
    fileUrl: '',
    fileType: 'IMAGE',
    altText: '',
    caption: '',
    folder: 'properties',
  });

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getMedia();
      setAssets(res);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load media assets' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fileUrl) return;

    try {
      await api.admin.registerExternalMedia({
        fileName: form.fileName || form.fileUrl.split('/').pop()?.split('?')[0] || 'media-asset',
        fileUrl: form.fileUrl,
        fileType: form.fileType,
        altText: form.altText,
        caption: form.caption,
        folder: form.folder,
      });
      setFeedback({ type: 'success', message: 'Media asset registered successfully!' });
      setShowModal(false);
      setForm({
        fileName: '',
        fileUrl: '',
        fileType: 'IMAGE',
        altText: '',
        caption: '',
        folder: 'properties',
      });
      await loadAssets();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error registering media' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this media asset?')) return;
    try {
      await api.admin.deleteMedia(id);
      setFeedback({ type: 'success', message: 'Asset removed' });
      await loadAssets();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error deleting media' });
    }
  };

  const copyUrl = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = assets.filter((a) => {
    const matchesSearch =
      a.fileName.toLowerCase().includes(search.toLowerCase()) ||
      (a.altText && a.altText.toLowerCase().includes(search.toLowerCase())) ||
      a.fileUrl.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || a.fileType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
            <ImageIcon className="w-7 h-7 text-champagne-400" />
            Media & 3D Asset Library
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Central repository for architectural photography, 3D GLTF models, video flythroughs, and floorplans.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-champagne-400 text-obsidian-950 font-bold text-xs hover:bg-champagne-300 transition flex items-center gap-2 shadow-glow-gold"
        >
          <Plus className="w-4 h-4" />
          Add Media Asset
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

      {/* Filter Bar */}
      <div className="bg-obsidian-900 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets by name or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-obsidian-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-champagne-400"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-champagne-400"
        >
          <option value="ALL">All Media Types</option>
          <option value="IMAGE">Photography (Images)</option>
          <option value="MODEL_3D">3D Models (.glb / .gltf)</option>
          <option value="VIDEO">Videos</option>
          <option value="DOCUMENT">Documents / Floorplans</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">Loading media assets...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs">No media assets found.</div>
        ) : (
          filtered.map((asset) => (
            <div
              key={asset.id}
              className="bg-obsidian-900 border border-white/5 hover:border-champagne-400/30 rounded-xl overflow-hidden transition flex flex-col justify-between group"
            >
              <div className="relative aspect-square bg-obsidian-950 flex items-center justify-center overflow-hidden">
                {asset.fileType === 'IMAGE' ? (
                  <img
                    src={asset.fileUrl}
                    alt={asset.altText || asset.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : asset.fileType === 'MODEL_3D' ? (
                  <div className="text-center p-4">
                    <Box className="w-10 h-10 text-champagne-400 mx-auto mb-1" />
                    <span className="text-[10px] font-mono text-champagne-300 uppercase block">3D GLTF Model</span>
                  </div>
                ) : asset.fileType === 'VIDEO' ? (
                  <div className="text-center p-4">
                    <Video className="w-10 h-10 text-champagne-400 mx-auto mb-1" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Video Stream</span>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <FileText className="w-10 h-10 text-slate-400 mx-auto mb-1" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Document</span>
                  </div>
                )}

                <div className="absolute top-2 right-2 bg-obsidian-950/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-300 border border-white/10 uppercase">
                  {asset.fileType}
                </div>
              </div>

              <div className="p-3 space-y-2">
                <p className="text-xs font-semibold text-white truncate" title={asset.fileName}>
                  {asset.fileName}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                  <span className="truncate">{asset.folder || 'general'}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyUrl(asset.fileUrl, asset.id)}
                      className="p-1 text-slate-400 hover:text-champagne-400 transition"
                      title="Copy URL"
                    >
                      {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={asset.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-slate-400 hover:text-white transition"
                      title="Open Asset"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Register External Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-champagne-400" />
                Register Media Asset
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Asset URL *</label>
                <input
                  type="text"
                  required
                  value={form.fileUrl}
                  onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  placeholder="https://images.unsplash.com/... or https://.../model.glb"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Asset Type</label>
                  <select
                    value={form.fileType}
                    onChange={(e) => setForm({ ...form, fileType: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="IMAGE">IMAGE (Photography)</option>
                    <option value="MODEL_3D">MODEL_3D (Interactive GLB/GLTF)</option>
                    <option value="VIDEO">VIDEO (Walkthrough)</option>
                    <option value="DOCUMENT">DOCUMENT (Floorplan / PDF)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Folder / Category</label>
                  <input
                    type="text"
                    value={form.folder}
                    onChange={(e) => setForm({ ...form, folder: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="properties, projects, hero"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">File Name</label>
                <input
                  type="text"
                  value={form.fileName}
                  onChange={(e) => setForm({ ...form, fileName: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  placeholder="e.g. penthouse-sunset-terrace.jpg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Alt Text / Description</label>
                <input
                  type="text"
                  value={form.altText}
                  onChange={(e) => setForm({ ...form, altText: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  placeholder="Panoramic view of Dubai Marina skyline"
                />
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
                  className="px-5 py-2 rounded-xl bg-champagne-400 text-obsidian-950 text-xs font-bold shadow-glow-gold"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
