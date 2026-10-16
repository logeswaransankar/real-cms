import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BlogPost } from '../types';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  Calendar,
  Eye,
} from 'lucide-react';

export const BlogManager: React.FC = () => {
  const [articles, setArticles] = useState<BlogPost[]>([]);
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
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImageUrl: '',
    authorName: 'Elysian Editorial Team',
    readTimeMinutes: 5,
    isPublished: true,
    isFeatured: false,
    categoryId: undefined as number | undefined,
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getArticles();
      setArticles(res);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load journal articles' });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setForm({
      id: 0,
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImageUrl: '',
      authorName: 'Elysian Editorial Team',
      readTimeMinutes: 5,
      isPublished: true,
      isFeatured: false,
      categoryId: undefined,
    });
    setShowModal(true);
  };

  const openEditModal = (post: BlogPost) => {
    setIsEditing(true);
    setForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      featuredImageUrl: post.featuredImageUrl || '',
      authorName: post.authorName || 'Elysian Editorial Team',
      readTimeMinutes: post.readTimeMinutes || 5,
      isPublished: post.isPublished,
      isFeatured: post.isFeatured,
      categoryId: post.category?.id,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        post: {
          title: form.title,
          slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          excerpt: form.excerpt,
          content: form.content,
          featuredImageUrl: form.featuredImageUrl,
          authorName: form.authorName,
          readTimeMinutes: Number(form.readTimeMinutes),
          isPublished: form.isPublished,
          isFeatured: form.isFeatured,
        },
        categoryId: form.categoryId,
      };

      if (isEditing) {
        await api.admin.updateArticle(form.id, payload);
        setFeedback({ type: 'success', message: 'Article updated!' });
      } else {
        await api.admin.createArticle(payload);
        setFeedback({ type: 'success', message: 'Article published!' });
      }
      setShowModal(false);
      await loadArticles();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving article' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.admin.deleteArticle(id);
      setFeedback({ type: 'success', message: 'Article deleted' });
      await loadArticles();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error deleting article' });
    }
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.excerpt && a.excerpt.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-champagne-400" />
            Editorial Journal & Market Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish thought-leadership articles, architectural spotlights, and luxury real estate market forecasts.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-champagne-400 text-obsidian-950 font-bold text-xs hover:bg-champagne-300 transition flex items-center gap-2 shadow-glow-gold"
        >
          <Plus className="w-4 h-4" />
          Write Article
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
            placeholder="Search journal articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-obsidian-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-champagne-400"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">Loading journal articles...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs">No articles found.</div>
        ) : (
          filtered.map((post) => (
            <div
              key={post.id}
              className="bg-obsidian-900 border border-white/5 hover:border-champagne-400/30 rounded-2xl overflow-hidden transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={post.featuredImageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-obsidian-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-champagne-400 uppercase tracking-wider border border-white/10">
                    {post.category?.name || 'Editorial'}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-serif font-bold text-white group-hover:text-champagne-400 transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-white/5">
                    <span>{post.authorName}</span>
                    <span>&bull;</span>
                    <span>{post.readTimeMinutes} min read</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-obsidian-950/50 border-t border-white/5 flex items-center justify-between">
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Read Live
                </a>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(post)}
                    className="p-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-champagne-400 hover:bg-champagne-400 hover:text-obsidian-950 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
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
          <div className="bg-obsidian-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-white">
                {isEditing ? `Edit Article: ${form.title}` : 'Write New Journal Article'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={form.authorName}
                    onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Read Time (min)</label>
                  <input
                    type="number"
                    value={form.readTimeMinutes}
                    onChange={(e) => setForm({ ...form, readTimeMinutes: Number(e.target.value) })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Publish State</label>
                  <select
                    value={form.isPublished ? 'true' : 'false'}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.value === 'true' })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="true">Published (Live)</option>
                    <option value="false">Draft / Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={form.featuredImageUrl}
                  onChange={(e) => setForm({ ...form, featuredImageUrl: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Article Excerpt</label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  placeholder="Compelling 2-sentence teaser for cards and meta preview"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Article Body</label>
                <textarea
                  rows={8}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 text-xs text-white font-sans"
                  placeholder="Write the full editorial analysis here..."
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
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-champagne-400 text-obsidian-950 text-xs font-bold shadow-glow-gold"
                >
                  {saving ? 'Saving...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
