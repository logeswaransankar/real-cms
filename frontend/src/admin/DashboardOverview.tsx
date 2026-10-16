import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { Property, Enquiry } from '../types';
import {
  Building,
  Layers,
  Mail,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FolderGit2,
  PlusCircle,
  Eye,
  Loader2,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { formatPrice } = useSettings();
  const [stats, setStats] = useState<{
    totalProperties: number;
    publishedProperties: number;
    draftProperties: number;
    totalProjects: number;
    totalEnquiries: number;
    newEnquiries: number;
    recentProperties: Property[];
    recentEnquiries: Enquiry[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin
      .getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-champagne-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-medium">Total Properties</span>
            <Building className="w-5 h-5 text-champagne-400" />
          </div>
          <p className="font-serif text-3xl font-bold text-white">{stats?.totalProperties || 0}</p>
          <div className="flex items-center space-x-3 text-xs text-slate-400 pt-1">
            <span className="text-emerald-400 font-medium">{stats?.publishedProperties || 0} published</span>
            <span>•</span>
            <span className="text-amber-400">{stats?.draftProperties || 0} drafts</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-medium">Master Developments</span>
            <FolderGit2 className="w-5 h-5 text-champagne-400" />
          </div>
          <p className="font-serif text-3xl font-bold text-white">{stats?.totalProjects || 0}</p>
          <p className="text-xs text-slate-400 pt-1">Off-plan architectural landmarks</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-medium">Client Inquiries</span>
            <Mail className="w-5 h-5 text-champagne-400" />
          </div>
          <p className="font-serif text-3xl font-bold text-white">{stats?.totalEnquiries || 0}</p>
          <p className="text-xs text-emerald-400 pt-1 font-medium">
            {stats?.newEnquiries || 0} pending new inquiries
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-champagne-400/30 bg-gradient-to-br from-obsidian-900 via-obsidian-900 to-champagne-400/10 space-y-3">
          <span className="text-xs uppercase tracking-wider text-champagne-400 font-semibold block">
            Quick Actions
          </span>
          <div className="flex flex-col space-y-2">
            <Link
              to="/admin/properties"
              className="px-3 py-1.5 rounded-lg bg-champagne-400 hover:bg-champagne-300 text-obsidian-900 text-xs font-semibold flex items-center justify-between transition"
            >
              <span>+ Add New Property</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/admin/pages"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium flex items-center justify-between transition"
            >
              <span>Visual Page Builder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Two columns: Recent Enquiries Pipeline & Recent Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-medium text-white">Client Inquiry Leads</h3>
            <Link to="/admin/enquiries" className="text-xs text-champagne-400 hover:underline">
              View All ({stats?.totalEnquiries || 0})
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentEnquiries && stats.recentEnquiries.length > 0 ? (
              stats.recentEnquiries.slice(0, 5).map((enq) => (
                <div
                  key={enq.id}
                  className="p-3.5 rounded-xl bg-obsidian-900/80 border border-white/5 flex items-start justify-between gap-4"
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-white">{enq.fullName}</span>
                      <span
                        className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-mono ${
                          enq.status === 'NEW'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{enq.email}</p>
                    <p className="text-xs text-slate-300 line-clamp-1 mt-1 font-light italic">
                      "{enq.message}"
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 flex-shrink-0">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No inquiries logged yet.</p>
            )}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-medium text-white">Recent Portfolio Updates</h3>
            <Link to="/admin/properties" className="text-xs text-champagne-400 hover:underline">
              Manage All
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.recentProperties && stats.recentProperties.length > 0 ? (
              stats.recentProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="p-3.5 rounded-xl bg-obsidian-900/80 border border-white/5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <img
                      src={prop.images?.[0]?.imageUrl || prop.fallbackImageUrl || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=150&q=80'}
                      alt={prop.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-white truncate">{prop.title}</p>
                      <p className="text-[11px] text-champagne-300 font-mono">
                        {formatPrice(prop.price, prop.currency)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span
                      className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-mono ${
                        prop.published
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {prop.published ? 'Published' : 'Draft'}
                    </span>
                    <Link
                      to={`/properties/${prop.slug}`}
                      target="_blank"
                      className="p-1 text-slate-400 hover:text-white"
                      title="View public page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No properties found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
