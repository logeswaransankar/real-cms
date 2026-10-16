import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  Building,
  FolderGit2,
  MapPin,
  Image,
  Menu,
  Settings,
  Mail,
  BookOpen,
  Users,
  LogOut,
  ExternalLink,
  Shield,
  Eye,
  ChevronRight,
  X,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout, hasRole, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [draftPreviewMode, setDraftPreviewMode] = useState(false);

  // If not logged in, redirect to login
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const navLinks = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Page Builder (CMS)', path: '/admin/pages', icon: Layers },
    { label: 'Properties', path: '/admin/properties', icon: Building },
    { label: 'Developments', path: '/admin/projects', icon: FolderGit2 },
    { label: 'Prime Locations', path: '/admin/locations', icon: MapPin },
    { label: 'Media Library', path: '/admin/media', icon: Image },
    { label: 'Navigation Menu', path: '/admin/navigation', icon: Menu },
    { label: 'Global Settings', path: '/admin/settings', icon: Settings },
    { label: 'Enquiries & Leads', path: '/admin/enquiries', icon: Mail },
    { label: 'Journal Articles', path: '/admin/blog', icon: BookOpen },
    { label: 'Staff & Roles (RBAC)', path: '/admin/users', icon: Users, superAdminOnly: true },
  ];

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col">
      {/* Draft Preview Bar */}
      {draftPreviewMode && (
        <div className="bg-amber-600 text-obsidian-950 px-4 py-2 text-xs font-semibold flex items-center justify-between z-50 shadow-md">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>CMS DRAFT PREVIEW ACTIVE — Viewing Unpublished Revisions</span>
          </div>
          <button
            onClick={() => setDraftPreviewMode(false)}
            className="px-3 py-0.5 rounded bg-obsidian-950 text-white text-[11px] hover:bg-black transition"
          >
            Exit Preview Mode
          </button>
        </div>
      )}

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-obsidian-900 border-r border-white/5 py-6">
          {/* Brand Logo in Admin */}
          <div className="px-6 mb-8 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border border-champagne-400 flex items-center justify-center bg-obsidian-950">
              <span className="font-serif text-base font-bold gold-gradient-text">E</span>
            </div>
            <div>
              <span className="font-serif text-sm font-semibold tracking-widest text-white uppercase block">
                ELYSIAN CMS
              </span>
              <span className="text-[9px] uppercase tracking-wider text-champagne-400">
                Administration Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 space-y-1">
            {navLinks.map((item) => {
              if (item.superAdminOnly && !hasRole('SUPER_ADMIN')) {
                return null;
              }
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                    isActive
                      ? 'bg-champagne-400 text-obsidian-900 font-semibold shadow-glow-gold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-obsidian-900' : 'text-champagne-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom user profile & actions */}
          <div className="px-4 pt-6 border-t border-white/5 space-y-3">
            <div className="flex items-center space-x-3 px-2">
              <div className="w-9 h-9 rounded-full bg-champagne-400/20 border border-champagne-400/40 flex items-center justify-center text-champagne-300 font-bold text-xs uppercase">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
                <p className="text-[10px] text-champagne-400 font-mono truncate">
                  {user?.roles?.[0]?.replace('ROLE_', '') || 'STAFF'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                to="/"
                target="_blank"
                className="text-[11px] text-slate-400 hover:text-champagne-300 flex items-center space-x-1"
                title="View Live Public Website"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={logout}
                className="text-[11px] text-red-400 hover:text-red-300 flex items-center space-x-1"
                title="Sign out"
              >
                <span>Sign Out</span>
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Admin Bar */}
          <header className="h-16 bg-obsidian-900/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-300 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="font-serif text-lg font-medium text-white capitalize">
                {location.pathname === '/admin'
                  ? 'Executive Dashboard'
                  : location.pathname.replace('/admin/', '').replace('-', ' ')}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDraftPreviewMode(!draftPreviewMode)}
                className={`text-xs px-3 py-1.5 rounded-full border transition flex items-center space-x-1.5 ${
                  draftPreviewMode
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'border-white/10 text-slate-300 hover:border-champagne-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{draftPreviewMode ? 'Previewing Draft' : 'Preview Mode'}</span>
              </button>

              <Link
                to="/"
                target="_blank"
                className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-300 hover:text-champagne-300 px-3 py-1.5 rounded-full border border-white/10 hover:border-champagne-400 transition"
              >
                <span>Live Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </header>

          {/* Page Outlet */}
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 bg-obsidian-900 border-r border-white/10 flex flex-col py-6 px-4 z-10">
            <div className="flex items-center justify-between mb-6 px-2">
              <span className="font-serif text-sm font-semibold text-white uppercase">
                ELYSIAN CMS
              </span>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/5"
                >
                  <item.icon className="w-4 h-4 text-champagne-400" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center space-x-2 py-2 text-xs text-red-400 border border-red-500/20 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
