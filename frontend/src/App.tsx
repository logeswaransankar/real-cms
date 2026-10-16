import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { PropertyListingPage } from './pages/PropertyListingPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { LocationsPage } from './pages/LocationsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { LegalPage } from './pages/LegalPage';

// Admin CMS Pages
import { AdminLogin } from './admin/AdminLogin';
import { DashboardOverview } from './admin/DashboardOverview';
import { PageBuilder } from './admin/PageBuilder';
import { PropertyManager } from './admin/PropertyManager';
import { ProjectManager } from './admin/ProjectManager';
import { LocationManager } from './admin/LocationManager';
import { MediaManager } from './admin/MediaManager';
import { NavigationManager } from './admin/NavigationManager';
import { SettingsManager } from './admin/SettingsManager';
import { EnquiryManager } from './admin/EnquiryManager';
import { BlogManager } from './admin/BlogManager';
import { UserManager } from './admin/UserManager';

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Public Layout wrapper with Navbar and Footer
function PublicLayout() {
  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col selection:bg-champagne-400 selection:text-obsidian-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// 404 Not Found
function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian-950 flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-5">
        <div className="w-16 h-16 rounded-full border border-champagne-400/30 flex items-center justify-center mx-auto bg-obsidian-900">
          <span className="font-serif text-2xl gold-gradient-text">404</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-white tracking-wide">
          Sanctuary Not Found
        </h1>
        <p className="text-sm text-slate-400">
          The architectural residence or page you are seeking does not exist or has been moved to a private portfolio.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-xl bg-champagne-400 text-obsidian-950 font-bold text-xs uppercase tracking-widest hover:bg-champagne-300 transition shadow-glow-gold"
        >
          Return to Portfolio
        </Link>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <ScrollToTop />
          <Routes>
            {/* Public Website Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<PropertyListingPage />} />
              <Route path="/properties/:slug" element={<PropertyDetailsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/legal/:slug" element={<LegalPage />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Dynamic CMS Portal */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="pages" element={<PageBuilder />} />
              <Route path="properties" element={<PropertyManager />} />
              <Route path="projects" element={<ProjectManager />} />
              <Route path="locations" element={<LocationManager />} />
              <Route path="media" element={<MediaManager />} />
              <Route path="navigation" element={<NavigationManager />} />
              <Route path="settings" element={<SettingsManager />} />
              <Route path="enquiries" element={<EnquiryManager />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="users" element={<UserManager />} />
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
