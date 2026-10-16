import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { NavigationItem } from '../types';
import {
  Menu,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';

export const NavigationManager: React.FC = () => {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [menuLocation, setMenuLocation] = useState<'HEADER' | 'FOOTER'>('HEADER');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    id: 0,
    label: '',
    path: '/',
    menuLocation: 'HEADER',
    displayOrder: 1,
    active: true,
    external: false,
  });

  useEffect(() => {
    loadItems();
  }, [menuLocation]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getNavigation(menuLocation);
      setItems(res);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load navigation' });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setForm({
      id: 0,
      label: '',
      path: '/',
      menuLocation: menuLocation,
      displayOrder: items.length + 1,
      active: true,
      external: false,
    });
    setShowModal(true);
  };

  const openEditModal = (item: NavigationItem) => {
    setIsEditing(true);
    setForm({
      id: item.id,
      label: item.label || item.title || '',
      path: item.path || item.url || '/',
      menuLocation: item.menuLocation,
      displayOrder: item.displayOrder,
      active: item.active !== undefined ? item.active : (item.isActive !== undefined ? item.isActive : true),
      external: item.external || false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        label: form.label,
        path: form.path,
        menuLocation: form.menuLocation,
        displayOrder: Number(form.displayOrder),
        active: form.active,
        external: form.external,
      };

      if (isEditing) {
        await api.admin.updateNavigationItem(form.id, payload);
        setFeedback({ type: 'success', message: 'Navigation item updated!' });
      } else {
        await api.admin.createNavigationItem(payload);
        setFeedback({ type: 'success', message: 'Navigation item added!' });
      }
      setShowModal(false);
      await loadItems();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving navigation item' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this navigation link?')) return;
    try {
      await api.admin.deleteNavigationItem(id);
      setFeedback({ type: 'success', message: 'Navigation item deleted' });
      await loadItems();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error deleting item' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
            <Menu className="w-7 h-7 text-champagne-400" />
            Navigation Menu Builder
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure header navigation bars, mobile menus, and luxury footer links dynamically.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-champagne-400 text-obsidian-950 font-bold text-xs hover:bg-champagne-300 transition flex items-center gap-2 shadow-glow-gold"
        >
          <Plus className="w-4 h-4" />
          Add Navigation Link
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

      {/* Tabs */}
      <div className="flex gap-3 border-b border-white/5 pb-2">
        <button
          onClick={() => setMenuLocation('HEADER')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            menuLocation === 'HEADER'
              ? 'bg-champagne-400 text-obsidian-950 shadow-glow-gold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Header Navigation (Navbar)
        </button>
        <button
          onClick={() => setMenuLocation('FOOTER')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            menuLocation === 'FOOTER'
              ? 'bg-champagne-400 text-obsidian-950 shadow-glow-gold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Footer Links & Columns
        </button>
      </div>

      {/* Table */}
      <div className="bg-obsidian-900 border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading navigation items...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No links configured for this location yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-400 bg-obsidian-950/50">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Menu Title</th>
                  <th className="py-3 px-4">Target URL</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {items
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((item, idx) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-4 font-mono text-champagne-400 font-bold">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-white">{item.label || item.title}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{item.path || item.url}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-400">
                          {item.external ? 'External Link' : 'Internal Route'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.active !== false && item.isActive !== false
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {item.active !== false && item.isActive !== false ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg bg-obsidian-950 border border-white/10 text-champagne-400 hover:bg-champagne-400 hover:text-obsidian-950 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg bg-obsidian-950 border border-white/10 text-rose-400 hover:bg-rose-500 hover:text-white transition"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-white">
                {isEditing ? 'Edit Navigation Link' : 'Add Navigation Link'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Menu Label *</label>
                <input
                  type="text"
                  required
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  placeholder="e.g. Penthouses"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Destination Path *</label>
                <input
                  type="text"
                  required
                  value={form.path}
                  onChange={(e) => setForm({ ...form, path: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  placeholder="/properties, /projects, or full URL"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Link Target</label>
                  <select
                    value={form.external ? 'true' : 'false'}
                    onChange={(e) => setForm({ ...form, external: e.target.value === 'true' })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="false">Internal App Route</option>
                    <option value="true">External URL</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="nav_active"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="rounded text-champagne-400"
                />
                <label htmlFor="nav_active" className="text-xs text-slate-300">
                  Visible in Menu
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
                  {saving ? 'Saving...' : 'Save Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
