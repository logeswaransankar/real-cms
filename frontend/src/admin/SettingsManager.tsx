import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import {
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  Globe,
  Phone,
  Mail,
  Palette,
  Share2,
  DollarSign,
  Shield,
  Box,
} from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({
    site_name: 'Elysian Estates',
    site_tagline: 'Curators of Architectural Masterpieces & Haute Living',
    contact_email: 'concierge@elysian-estates.com',
    contact_phone: '+971 4 800 ELYSIAN',
    whatsapp_number: '+971501234567',
    office_address: 'Level 48, The Opus by Omniyat, Business Bay, Dubai, UAE',
    currency_default: 'AED',
    currency_symbol: 'AED',
    brand_primary_color: '#E0AA3E',
    enable_3d_viewer: 'true',
    hero_headline: 'Bespoke Sanctuaries Above The Horizon',
    hero_subheadline: 'Discover Dubai’s most coveted off-market penthouses, sky villas, and waterfront mansions.',
    seo_meta_title: 'Elysian Estates | Ultra-Luxury Real Estate & Penthouses',
    seo_meta_description: 'Curating Dubai’s most prestigious architectural sanctuaries, ultra-luxury penthouses, and signature waterfront residences with immersive 3D spatial experiences.',
    social_instagram: 'https://instagram.com/elysianestates',
    social_linkedin: 'https://linkedin.com/company/elysianestates',
    social_youtube: 'https://youtube.com/@elysianestates',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getSettings();
      const mapped: Record<string, string> = {};
      res.forEach((s) => {
        mapped[s.key] = s.value;
      });
      setSettingsMap((prev) => ({ ...prev, ...mapped }));
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettingsMap((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.admin.updateSettings(settingsMap);
      await refreshSettings();
      setFeedback({ type: 'success', message: 'Global website settings saved successfully!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
            <Settings className="w-7 h-7 text-champagne-400" />
            Global Website & Brand Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Control brand identity, currencies, contact details, SEO meta tags, and interactive 3D spatial settings across the public website.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-champagne-400 text-obsidian-950 font-bold text-xs hover:bg-champagne-300 transition flex items-center gap-2 shadow-glow-gold disabled:opacity-50 self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving Changes...' : 'Save All Settings'}
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

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading settings...</div>
      ) : (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Brand & Identity */}
          <div className="bg-obsidian-900 border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Palette className="w-4 h-4 text-champagne-400" />
              Brand & Visual Identity
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Name</label>
              <input
                type="text"
                value={settingsMap.site_name || ''}
                onChange={(e) => handleChange('site_name', e.target.value)}
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settingsMap.site_tagline || ''}
                onChange={(e) => handleChange('site_tagline', e.target.value)}
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Accent Gold Hex</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settingsMap.brand_primary_color || '#E0AA3E'}
                    onChange={(e) => handleChange('brand_primary_color', e.target.value)}
                    className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settingsMap.brand_primary_color || ''}
                    onChange={(e) => handleChange('brand_primary_color', e.target.value)}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-champagne-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">3D Viewer State</label>
                <select
                  value={settingsMap.enable_3d_viewer || 'true'}
                  onChange={(e) => handleChange('enable_3d_viewer', e.target.value)}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="true">Enabled (Full WebGL / Three.js)</option>
                  <option value="false">Disabled (Photography Fallback)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Contact & VIP Concierge */}
          <div className="bg-obsidian-900 border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Phone className="w-4 h-4 text-champagne-400" />
              VIP Concierge & Contact Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Concierge Email</label>
                <input
                  type="email"
                  value={settingsMap.contact_email || ''}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={settingsMap.contact_phone || ''}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Direct Number</label>
              <input
                type="text"
                value={settingsMap.whatsapp_number || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                placeholder="+971501234567"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Headquarters Address</label>
              <input
                type="text"
                value={settingsMap.office_address || ''}
                onChange={(e) => handleChange('office_address', e.target.value)}
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Card 3: Currency & Financials */}
          <div className="bg-obsidian-900 border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <DollarSign className="w-4 h-4 text-champagne-400" />
              Currency & Regional Formats
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Base Currency</label>
                <select
                  value={settingsMap.currency_default || 'AED'}
                  onChange={(e) => handleChange('currency_default', e.target.value)}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="AED">AED (UAE Dirham)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Display Symbol</label>
                <input
                  type="text"
                  value={settingsMap.currency_symbol || 'AED'}
                  onChange={(e) => handleChange('currency_symbol', e.target.value)}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Card 4: SEO & Meta defaults */}
          <div className="bg-obsidian-900 border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-serif font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <Globe className="w-4 h-4 text-champagne-400" />
              Global SEO & Metadata
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Global Meta Title</label>
              <input
                type="text"
                value={settingsMap.seo_meta_title || ''}
                onChange={(e) => handleChange('seo_meta_title', e.target.value)}
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Global Meta Description</label>
              <textarea
                rows={3}
                value={settingsMap.seo_meta_description || ''}
                onChange={(e) => handleChange('seo_meta_description', e.target.value)}
                className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
