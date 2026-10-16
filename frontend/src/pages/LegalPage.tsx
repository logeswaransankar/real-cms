import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import type { Page } from '../types';
import { useSettings } from '../context/SettingsContext';
import { ShieldCheck } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const slug = location.pathname.replace('/', '') || 'privacy';
  const { siteName } = useSettings();
  const [page, setPage] = useState<Page | null>(null);

  useEffect(() => {
    api.public
      .getPage(slug)
      .then(setPage)
      .catch(() => {
        setPage(null);
      });
  }, [slug]);

  const defaultTitles: Record<string, string> = {
    privacy: 'Privacy Policy & Confidentiality',
    terms: 'Terms of Service & Advisory Protocols',
    'cookie-policy': 'Cookie Policy & Consent Settings',
  };

  const title = page?.title || defaultTitles[slug] || 'Legal Information';

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold block mb-2">
            Governance & Discretion
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white">
            {title}
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="glass-panel p-8 sm:p-12 rounded-2xl border border-white/5 space-y-6 text-sm text-slate-300 leading-relaxed font-light">
          <p>
            At {siteName}, we uphold the highest international benchmarks in client discretion, asset confidentiality, and financial data governance. We represent sovereign clients, institutional family offices, and private collectors.
          </p>

          <h3 className="font-serif text-lg font-medium text-white pt-4">
            1. Strict Confidentiality & Non-Disclosure
          </h3>
          <p>
            All off-market dossiers, architectural blueprints, client transaction structures, and inquiries submitted through this portal are treated as privileged correspondence. We never share client contact credentials with unauthorized third parties or marketing syndicates.
          </p>

          <h3 className="font-serif text-lg font-medium text-white pt-4">
            2. Real-Time Spatial & 3D Simulations
          </h3>
          <p>
            3D interactive models rendered via WebGL/Three.js are conceptual architectural simulations intended for spatial orientation and design preview. Final finishes and specifications are confirmed via developer handover agreements.
          </p>

          <h3 className="font-serif text-lg font-medium text-white pt-4">
            3. Regulatory Compliance & Verification
          </h3>
          <p>
            All property transfers, tenancy contracts, and off-plan escrow accounts comply strictly with the Real Estate Regulatory Authority (RERA) and applicable territorial laws.
          </p>
        </div>
      </div>
    </div>
  );
};
