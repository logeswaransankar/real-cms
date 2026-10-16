import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { NavigationItem } from '../../types';
import { Menu, X, Shield, Phone, Sparkles, Building2, MapPin, BookOpen, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { siteName, contactPhone } = useSettings();
  const { isAuthenticated, user } = useAuth();
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    api.public
      .getNavigation('HEADER')
      .then((items) => {
        if (items && items.length > 0) {
          setNavItems(items);
        } else {
          // fallback
          setNavItems([
            { id: 1, menuLocation: 'HEADER', label: 'Properties', path: '/properties', displayOrder: 1, active: true, external: false },
            { id: 2, menuLocation: 'HEADER', label: 'Developments', path: '/projects', displayOrder: 2, active: true, external: false },
            { id: 3, menuLocation: 'HEADER', label: 'Locations', path: '/locations', displayOrder: 3, active: true, external: false },
            { id: 4, menuLocation: 'HEADER', label: 'About Us', path: '/about', displayOrder: 4, active: true, external: false },
            { id: 5, menuLocation: 'HEADER', label: 'Journal', path: '/blog', displayOrder: 5, active: true, external: false },
            { id: 6, menuLocation: 'HEADER', label: 'Contact', path: '/contact', displayOrder: 6, active: true, external: false },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-obsidian-900/90 backdrop-blur-md border-b border-champagne-400/20 py-3 shadow-luxury'
          : 'bg-gradient-to-b from-obsidian-950/80 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-full border border-champagne-400/50 flex items-center justify-center bg-obsidian-800/80 group-hover:border-champagne-400 transition">
              <span className="font-serif text-lg font-bold gold-gradient-text">E</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-semibold tracking-[0.2em] text-white uppercase group-hover:text-champagne-300 transition">
                {siteName}
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-champagne-400/90">
                Architectural Estates
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path || item.url || '/'}
                  className={`text-xs uppercase tracking-widest font-medium transition duration-200 relative py-1 ${
                    active ? 'text-champagne-300 font-semibold' : 'text-slate-300 hover:text-champagne-200'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-champagne-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href={`tel:${contactPhone.replace(/\s+/g, '')}`}
              className="flex items-center space-x-2 text-xs text-slate-300 hover:text-champagne-300 transition px-3 py-1.5 rounded-full border border-white/10 hover:border-champagne-400/40"
            >
              <Phone className="w-3.5 h-3.5 text-champagne-400" />
              <span>{contactPhone}</span>
            </a>

            {isAuthenticated ? (
              <Link
                to="/admin"
                className="flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-champagne-400 text-obsidian-900 hover:bg-champagne-300 transition shadow-glow-gold"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>CMS Admin</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center space-x-1.5 text-xs text-champagne-300/80 hover:text-champagne-200 transition px-3 py-1.5"
                title="Staff CMS Login"
              >
                <User className="w-3.5 h-3.5" />
                <span>Staff Portal</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-200 hover:text-champagne-400 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-dropdown border-b border-champagne-400/20 px-6 py-6 mt-3 space-y-4 animate-in fade-in">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path || item.url || '/'}
              className="block text-sm uppercase tracking-wider font-medium text-slate-200 hover:text-champagne-400 py-1"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
            <a
              href={`tel:${contactPhone.replace(/\s+/g, '')}`}
              className="flex items-center space-x-2 text-xs text-champagne-300"
            >
              <Phone className="w-4 h-4" />
              <span>{contactPhone}</span>
            </a>
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="flex items-center justify-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-full bg-champagne-400 text-obsidian-900"
              >
                <Shield className="w-4 h-4" />
                <span>CMS Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center justify-center space-x-2 text-xs text-slate-300 py-2 border border-white/10 rounded-full"
              >
                <User className="w-4 h-4" />
                <span>Staff Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
