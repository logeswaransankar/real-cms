import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Page, PageSection, ContentRevision } from '../types';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  History,
  CheckCircle,
  AlertCircle,
  Save,
  X,
  Code,
  Globe,
  Settings,
} from 'lucide-react';

export const PageBuilder: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Section editing state
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [isNewSection, setIsNewSection] = useState(false);
  const [sectionForm, setSectionForm] = useState({
    sectionKey: '',
    sectionType: 'CUSTOM_HTML',
    title: '',
    subtitle: '',
    contentJson: '{}',
    isActive: true,
  });

  // Revisions state
  const [showRevisions, setShowRevisions] = useState(false);
  const [revisions, setRevisions] = useState<ContentRevision[]>([]);
  const [loadingRevisions, setLoadingRevisions] = useState(false);

  // Page settings modal
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [pageSettingsForm, setPageSettingsForm] = useState({
    title: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    isPublished: true,
  });

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getPages();
      setPages(res);
      if (res.length > 0 && !selectedPage) {
        setSelectedPage(res[0]);
      } else if (selectedPage) {
        const updated = res.find((p) => p.id === selectedPage.id);
        if (updated) setSelectedPage(updated);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load CMS pages' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPage = (page: Page) => {
    setSelectedPage(page);
    setEditingSection(null);
    setFeedback(null);
  };

  const openNewSectionModal = () => {
    setIsNewSection(true);
    setSectionForm({
      sectionKey: `section_${Date.now()}`,
      sectionType: 'FEATURED_GRID',
      title: 'New Section',
      subtitle: 'Exclusive Section Overview',
      contentJson: JSON.stringify({ heading: 'Exclusive Highlights', items: [] }, null, 2),
      isActive: true,
    });
    setEditingSection({} as PageSection);
  };

  const openEditSectionModal = (sec: PageSection) => {
    setIsNewSection(false);
    setEditingSection(sec);
    setSectionForm({
      sectionKey: sec.sectionKey,
      sectionType: sec.sectionType,
      title: sec.title || '',
      subtitle: sec.subtitle || '',
      contentJson: sec.contentJson
        ? (typeof sec.contentJson === 'string'
            ? (() => {
                try { return JSON.stringify(JSON.parse(sec.contentJson), null, 2); } catch { return sec.contentJson; }
              })()
            : JSON.stringify(sec.contentJson, null, 2))
        : '{}',
      isActive: sec.isActive,
    });
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;

    // Validate JSON
    try {
      JSON.parse(sectionForm.contentJson);
    } catch {
      setFeedback({ type: 'error', message: 'Invalid JSON format in section payload.' });
      return;
    }

    try {
      setSaving(true);
      if (isNewSection) {
        await api.admin.addSection(selectedPage.id, {
          sectionKey: sectionForm.sectionKey,
          sectionType: sectionForm.sectionType,
          title: sectionForm.title,
          subtitle: sectionForm.subtitle,
          contentJson: sectionForm.contentJson,
          isActive: sectionForm.isActive,
          sortOrder: (selectedPage.sections?.length || 0) + 1,
        });
        setFeedback({ type: 'success', message: 'Section added successfully' });
      } else if (editingSection) {
        await api.admin.updateSection(editingSection.id, {
          sectionKey: sectionForm.sectionKey,
          sectionType: sectionForm.sectionType,
          title: sectionForm.title,
          subtitle: sectionForm.subtitle,
          contentJson: sectionForm.contentJson,
          isActive: sectionForm.isActive,
          sortOrder: editingSection.sortOrder,
        });
        setFeedback({ type: 'success', message: 'Section updated successfully' });
      }
      setEditingSection(null);
      await loadPages();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving section' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSection = async (secId: number) => {
    if (!confirm('Are you sure you want to delete this section? This action cannot be undone.')) return;
    try {
      await api.admin.deleteSection(secId);
      setFeedback({ type: 'success', message: 'Section removed' });
      await loadPages();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error deleting section' });
    }
  };

  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    if (!selectedPage || !selectedPage.sections) return;
    const sections = [...selectedPage.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    // Swap
    const temp = sections[index];
    sections[index] = sections[targetIndex];
    sections[targetIndex] = temp;

    const ids = sections.map((s) => s.id);
    try {
      await api.admin.reorderSections(selectedPage.id, ids);
      setFeedback({ type: 'success', message: 'Sections reordered successfully' });
      await loadPages();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error reordering sections' });
    }
  };

  const openPageSettings = () => {
    if (!selectedPage) return;
    setPageSettingsForm({
      title: selectedPage.title,
      slug: selectedPage.slug,
      metaTitle: selectedPage.metaTitle || '',
      metaDescription: selectedPage.metaDescription || '',
      isPublished: selectedPage.isPublished,
    });
    setShowPageSettings(true);
  };

  const handleSavePageSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;
    try {
      setSaving(true);
      await api.admin.updatePage(selectedPage.id, pageSettingsForm);
      setFeedback({ type: 'success', message: 'Page settings updated' });
      setShowPageSettings(false);
      await loadPages();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving page settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleLoadRevisions = async () => {
    if (!selectedPage) return;
    setShowRevisions(true);
    setLoadingRevisions(true);
    try {
      const revs = await api.admin.getRevisions('PAGE', selectedPage.id);
      setRevisions(revs);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error loading revision history' });
    } finally {
      setLoadingRevisions(false);
    }
  };

  const handleSaveSnapshot = async () => {
    if (!selectedPage) return;
    const title = prompt('Enter a label for this CMS revision snapshot:', `Snapshot ${new Date().toLocaleTimeString()}`);
    if (!title) return;
    try {
      await api.admin.saveRevision('PAGE', selectedPage.id, {
        title,
        snapshotJson: JSON.stringify(selectedPage),
        isPublished: selectedPage.isPublished,
      });
      setFeedback({ type: 'success', message: 'Snapshot revision saved!' });
      if (showRevisions) handleLoadRevisions();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error creating revision snapshot' });
    }
  };

  const handleRollback = async (rev: ContentRevision) => {
    if (!confirm(`Are you sure you want to restore "${rev.title}"? Current unpublished changes will be replaced.`)) return;
    try {
      await api.admin.rollbackRevision(rev.id);
      setFeedback({ type: 'success', message: `Restored to revision: ${rev.title}` });
      setShowRevisions(false);
      await loadPages();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Rollback failed' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
            <Layers className="w-7 h-7 text-champagne-400" />
            Dynamic CMS Page Builder
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build, reorder, and configure dynamic modular sections across public website pages with instant preview.
          </p>
        </div>

        {selectedPage && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveSnapshot}
              className="px-3.5 py-2 rounded-xl bg-obsidian-800 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:border-champagne-400/50 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-champagne-400" />
              Save Snapshot
            </button>
            <button
              onClick={handleLoadRevisions}
              className="px-3.5 py-2 rounded-xl bg-obsidian-800 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:border-champagne-400/50 transition flex items-center gap-2"
            >
              <History className="w-4 h-4 text-champagne-400" />
              History
            </button>
            <a
              href={`/${selectedPage.slug === 'home' ? '' : selectedPage.slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-champagne-400/10 border border-champagne-400/30 text-xs font-semibold text-champagne-300 hover:bg-champagne-400/20 transition flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Preview Page
            </a>
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 transition ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs animate-pulse">Loading CMS Structure...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Page Selector */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-obsidian-900 border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Pages</span>
                <span className="text-[11px] text-champagne-400">{pages.length} Pages</span>
              </div>
              <div className="space-y-1.5">
                {pages.map((p) => {
                  const isSelected = selectedPage?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPage(p)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-champagne-400 text-obsidian-950 font-bold shadow-glow-gold'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="truncate">
                        <span className="block truncate">{p.title}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-obsidian-800' : 'text-slate-500'}`}>/{p.slug}</span>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        p.isPublished ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {p.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedPage && (
              <div className="bg-obsidian-900 border border-white/5 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Page Meta</span>
                  <button
                    onClick={openPageSettings}
                    className="p-1 text-slate-400 hover:text-champagne-400 transition"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Title</span>
                    <span className="text-slate-200 font-semibold">{selectedPage.title}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">URL Path</span>
                    <span className="text-slate-300 font-mono text-[11px]">/{selectedPage.slug}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">SEO Description</span>
                    <span className="text-slate-400 text-[11px] line-clamp-2">
                      {selectedPage.metaDescription || 'No meta description set'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Section List & Reordering */}
          <div className="lg:col-span-3 space-y-4">
            {selectedPage ? (
              <div className="bg-obsidian-900 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-white">
                      Sections on "{selectedPage.title}"
                    </h2>
                    <p className="text-xs text-slate-400">
                      Rearrange section hierarchy and edit individual blocks in real time.
                    </p>
                  </div>
                  <button
                    onClick={openNewSectionModal}
                    className="px-4 py-2 rounded-xl bg-champagne-400 text-obsidian-950 font-bold text-xs hover:bg-champagne-300 transition flex items-center gap-2 shadow-glow-gold"
                  >
                    <Plus className="w-4 h-4" />
                    Add Section
                  </button>
                </div>

                {(!selectedPage.sections || selectedPage.sections.length === 0) ? (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                    <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">No sections added yet</p>
                    <p className="text-xs text-slate-500 mt-1">Click "Add Section" to create your first content block.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedPage.sections
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((sec, idx) => (
                        <div
                          key={sec.id}
                          className="bg-obsidian-950 border border-white/5 hover:border-champagne-400/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition group"
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-7 h-7 rounded-lg bg-obsidian-900 border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-champagne-400">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-white">{sec.title || sec.sectionKey}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-400 border border-white/10">
                                  {sec.sectionType}
                                </span>
                                {!sec.isActive && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                    Hidden
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">{sec.subtitle || `Key: ${sec.sectionKey}`}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 self-end md:self-center">
                            <button
                              onClick={() => handleMoveSection(idx, 'up')}
                              disabled={idx === 0}
                              className="p-2 rounded-lg bg-obsidian-900 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveSection(idx, 'down')}
                              disabled={idx === selectedPage.sections!.length - 1}
                              className="p-2 rounded-lg bg-obsidian-900 border border-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditSectionModal(sec)}
                              className="p-2 rounded-lg bg-obsidian-900 border border-white/10 text-champagne-400 hover:bg-champagne-400 hover:text-obsidian-950 transition"
                              title="Edit Section"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSection(sec.id)}
                              className="p-2 rounded-lg bg-obsidian-900 border border-white/10 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                              title="Delete Section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-obsidian-900 border border-white/5 rounded-2xl p-12 text-center text-slate-500 text-xs">
                Select a page from the left sidebar to manage its dynamic CMS sections.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit/Add Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-champagne-400" />
                {isNewSection ? 'Add New Section' : `Edit Section: ${editingSection.sectionKey}`}
              </h3>
              <button
                onClick={() => setEditingSection(null)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Section Key (Unique)</label>
                  <input
                    type="text"
                    required
                    value={sectionForm.sectionKey}
                    onChange={(e) => setSectionForm({ ...sectionForm, sectionKey: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-champagne-400"
                    placeholder="e.g. hero_banner, amenities_grid"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Section Type</label>
                  <select
                    value={sectionForm.sectionType}
                    onChange={(e) => setSectionForm({ ...sectionForm, sectionType: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-champagne-400"
                  >
                    <option value="HERO">HERO (Hero Banner / 3D Intro)</option>
                    <option value="FEATURED_GRID">FEATURED_GRID (Cards & Showcases)</option>
                    <option value="TEXT_IMAGE">TEXT_IMAGE (Split Storytelling)</option>
                    <option value="STATS">STATS (Luxury Metrics)</option>
                    <option value="TESTIMONIALS">TESTIMONIALS (Client Quotes)</option>
                    <option value="GALLERY">GALLERY (Media Gallery)</option>
                    <option value="CONTACT_CTA">CONTACT_CTA (Call to Action)</option>
                    <option value="CUSTOM_HTML">CUSTOM_HTML (Modular Content)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Heading / Title</label>
                  <input
                    type="text"
                    value={sectionForm.title}
                    onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-champagne-400"
                    placeholder="Section Title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle / Tagline</label>
                  <input
                    type="text"
                    value={sectionForm.subtitle}
                    onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-champagne-400"
                    placeholder="Section Subtitle"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">Section Content (JSON Payload)</label>
                  <span className="text-[10px] text-slate-500 font-mono">Valid JSON Required</span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={sectionForm.contentJson}
                  onChange={(e) => setSectionForm({ ...sectionForm, contentJson: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 font-mono text-xs text-champagne-300 focus:outline-none focus:border-champagne-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sec_active"
                  checked={sectionForm.isActive}
                  onChange={(e) => setSectionForm({ ...sectionForm, isActive: e.target.checked })}
                  className="rounded border-white/20 text-champagne-400 focus:ring-0"
                />
                <label htmlFor="sec_active" className="text-xs text-slate-300">
                  Section is visible on live website
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-4 py-2 rounded-xl bg-obsidian-800 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-champagne-400 text-obsidian-950 text-xs font-bold hover:bg-champagne-300 transition shadow-glow-gold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Settings Modal */}
      {showPageSettings && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-white">Page Settings & SEO</h3>
              <button onClick={() => setShowPageSettings(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSavePageSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  value={pageSettingsForm.title}
                  onChange={(e) => setPageSettingsForm({ ...pageSettingsForm, title: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={pageSettingsForm.slug}
                  onChange={(e) => setPageSettingsForm({ ...pageSettingsForm, slug: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Title</label>
                <input
                  type="text"
                  value={pageSettingsForm.metaTitle}
                  onChange={(e) => setPageSettingsForm({ ...pageSettingsForm, metaTitle: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={pageSettingsForm.metaDescription}
                  onChange={(e) => setPageSettingsForm({ ...pageSettingsForm, metaDescription: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="page_published"
                  checked={pageSettingsForm.isPublished}
                  onChange={(e) => setPageSettingsForm({ ...pageSettingsForm, isPublished: e.target.checked })}
                  className="rounded text-champagne-400"
                />
                <label htmlFor="page_published" className="text-xs text-slate-300">
                  Published (Live to public)
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowPageSettings(false)}
                  className="px-4 py-2 rounded-xl bg-obsidian-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-champagne-400 text-obsidian-950 text-xs font-bold shadow-glow-gold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revision History Modal */}
      {showRevisions && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/10 rounded-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-champagne-400" />
                Revision Snapshots
              </h3>
              <button onClick={() => setShowRevisions(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingRevisions ? (
              <p className="text-xs text-slate-400 text-center py-6">Loading revision logs...</p>
            ) : revisions.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No previous revision snapshots found for this page.</p>
            ) : (
              <div className="space-y-3">
                {revisions.map((rev) => (
                  <div key={rev.id} className="bg-obsidian-950 border border-white/5 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">{rev.title}</span>
                      <span className="text-[10px] text-slate-500">
                        v{rev.versionNumber} &bull; {new Date(rev.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">Created by: {rev.createdByName || 'Admin'}</p>
                    <div className="bg-obsidian-900 p-2 rounded text-[10px] font-mono text-slate-400 max-h-24 overflow-y-auto">
                      {rev.snapshotJson.substring(0, 300)}...
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleRollback(rev)}
                        className="px-2.5 py-1 rounded-lg bg-champagne-400/20 text-champagne-300 hover:bg-champagne-400 hover:text-obsidian-950 text-[10px] font-bold transition shadow-sm"
                      >
                        Rollback to this version
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
