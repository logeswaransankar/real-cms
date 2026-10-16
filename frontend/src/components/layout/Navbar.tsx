import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { NavigationItem } from '../../types';
import { Menu, X, Phone, Shield, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { siteName, contactPhone } = useSettings();
  const { isAuthenticated } = useAuth();
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    api.public
      .getNavigation('HEADER')
      .then((items) => {
        if (items && items.length > 0) {
          setNavItems(items);
        } else {
          setNavItems([
            { id: 1, menuLocation: 'HEADER', label: 'Buy', path: '/properties?transactionType=BUY', displayOrder: 1, active: true, external: false },
            { id: 2, menuLocation: 'HEADER', label: 'Rent', path: '/properties?transactionType=RENT', displayOrder: 2, active: true, external: false },
            { id: 3, menuLocation: 'HEADER', label: 'New Projects', path: '/projects', displayOrder: 3, active: true, external: false },
            { id: 4, menuLocation: 'HEADER', label: 'Locations', path: '/locations', displayOrder: 4, active: true, external: false },
            { id: 5, menuLocation: 'HEADER', label: 'About', path: '/about', displayOrder: 5, active: true, external: false },
            { id: 6, menuLocation: 'HEADER', label: 'Contact', path: '/contact', displayOrder: 6, active: true, external: false },
          ]);
        }
      })
      .catch(() => {
        setNavItems([
          { id: 1, menuLocation: 'HEADER', label: 'Buy', path: '/properties?transactionType=BUY', displayOrder: 1, active: true, external: false },
          { id: 2, menuLocation: 'HEADER', label: 'Rent', path: '/properties?transactionType=RENT', displayOrder: 2, active: true, external: false },
          { id: 3, menuLocation: 'HEADER', label: 'New Projects', path: '/projects', displayOrder: 3, active: true, external: false },
          { id: 4, menuLocation: 'HEADER', label: 'Locations', path: '/locations', displayOrder: 4, active: true, external: false },
          { id: 5, menuLocation: 'HEADER', label: 'About', path: '/about', displayOrder: 5, active: true, external: false },
          { id: 6, menuLocation: 'HEADER', label: 'Contact', path: '/contact', displayOrder: 6, active: true, external: false },
        ]);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // Determine navbar styling depending on scroll position and page type
  const isOverHero = isHome && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#e7e4dc] py-3.5 shadow-sm text-[#1c1b1a]'
          : isHome
          ? 'bg-gradient-to-b from-black/60 via-black/25 to-transparent py-5 text-white'
          : 'bg-white border-b border-[#e7e4dc] py-4 text-[#1c1b1a]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div
              className={`w-9 h-9 border flex items-center justify-center transition-colors ${
                isOverHero
                  ? 'border-white/40 group-hover:border-white bg-black/20'
                  : 'border-[#1c1b1a]/20 group-hover:border-[#997e55] bg-[#faf9f6]'
              }`}
            >
              <span
                className={`font-serif text-base font-bold tracking-wider ${
                  isOverHero ? 'text-white' : 'text-[#1c1b1a]'
                }`}
              >
                {siteName ? siteName.charAt(0) : 'E'}
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className={`font-serif text-base font-medium tracking-[0.18em] uppercase transition-colors ${
                  isOverHero ? 'text-white group-hover:text-[#e4dcce]' : 'text-[#1c1b1a] group-hover:text-[#997e55]'
                }`}
              >
                {siteName || 'Elysian Estates'}
              </span>
              <span
                className={`text-[9px] uppercase tracking-[0.25em] ${
                  isOverHero ? 'text-white/70' : 'text-[#8c8675]'
                }`}
              >
                Luxury Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7">
            {navItems.map((item) => {
              const currentPath = `${location.pathname}${location.search}`;
              const active = currentPath === item.path || (item.path !== '/' && location.pathname === item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path || item.url || '/'}
                  className={`text-[12px] uppercase tracking-[0.15em] font-medium transition-colors py-1 relative ${
                    isOverHero
                      ? active
                        ? 'text-white font-semibold'
                        : 'text-white/80 hover:text-white'
                      : active
                      ? 'text-[#997e55] font-semibold'
                      : 'text-[#5c5851] hover:text-[#1c1b1a]'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span
                      className={`absolute bottom-0 left-0 w-full h-[1.5px] ${
                        isOverHero ? 'bg-white' : 'bg-[#997e55]'
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            {contactPhone && (
              <a
                href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                className={`flex items-center space-x-2 text-xs px-3.5 py-1.5 border transition-colors ${
                  isOverHero
                    ? 'border-white/20 text-white/90 hover:border-white hover:text-white'
                    : 'border-[#e6e3da] text-[#5c5851] hover:border-[#1c1b1a] hover:text-[#1c1b1a]'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-[#997e55]" />
                <span className="font-medium tracking-wide">{contactPhone}</span>
              </a>
            )}

            <Link
              to="/contact"
              className={`flex items-center space-x-1.5 text-xs uppercase tracking-wider font-semibold px-4 py-2 transition-all ${
                isOverHero
                  ? 'bg-white text-[#1c1b1a] hover:bg-[#faf9f6]'
                  : 'bg-[#1c1b1a] text-white hover:bg-[#2e2b27]'
              }`}
            >
              <span>Enquire</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {isAuthenticated ? (
              <Link
                to="/admin"
                className="flex items-center space-x-1 text-xs text-[#997e55] hover:underline px-2 py-1"
                title="CMS Admin Dashboard"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className={`text-[11px] uppercase tracking-wider transition ${
                  isOverHero ? 'text-white/60 hover:text-white' : 'text-[#8c8675] hover:text-[#1c1b1a]'
                }`}
                title="Staff Portal"
              >
                Portal
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 transition-colors ${
                isOverHero ? 'text-white' : 'text-[#1c1b1a]'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e7e4dc] px-6 py-6 text-[#1c1b1a] shadow-lg animate-in fade-in duration-200">
          <div className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path || item.url || '/'}
                className="block text-sm uppercase tracking-wider font-medium text-[#1c1b1a] hover:text-[#997e55] py-1 border-b border-[#f5f4f0]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[#e7e4dc] space-y-3">
            {contactPhone && (
              <a
                href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                className="flex items-center space-x-2 text-xs text-[#5c5851]"
              >
                <Phone className="w-4 h-4 text-[#997e55]" />
                <span>{contactPhone}</span>
              </a>
            )}
            <Link
              to="/contact"
              className="block w-full text-center py-2.5 text-xs uppercase tracking-widest font-semibold bg-[#1c1b1a] text-white"
            >
              Enquire Now
            </Link>
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="block text-center text-xs text-[#997e55] pt-1"
              >
                CMS Admin Panel
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="block text-center text-xs text-[#8c8675] pt-1"
              >
                Staff Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
