import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { TeamMember } from '../types';
import { useSettings } from '../context/SettingsContext';
import { Shield, Award, Compass, Key, CheckCircle2, Mail, Phone } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { siteName } = useSettings();
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    api.public.getTeam().then(setTeam).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Editorial Story */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold block">
            Our Heritage
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-white leading-tight">
            Curating Generational Architectural Trophies
          </h1>
          <p className="text-base text-slate-300 font-light leading-relaxed">
            Founded with the conviction that architectural excellence should never be compromised, {siteName} bridges visionary master architects with discerning royal families, international collectors, and private family offices worldwide.
          </p>
        </div>

        {/* Brand Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4">
            <Shield className="w-8 h-8 text-champagne-400" />
            <h3 className="font-serif text-xl font-medium text-white">Confidential Discretion</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              We handle off-market acquisitions and bespoke portfolios with stringent non-disclosure compliance, safeguarding our clients' privacy across every interaction.
            </p>
          </div>
          <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4">
            <Compass className="w-8 h-8 text-champagne-400" />
            <h3 className="font-serif text-xl font-medium text-white">Spatial & 3D Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Utilizing interactive Three.js real-time simulations, our clients explore multi-million dollar spaces, sun angles, and finishings before breaking ground.
            </p>
          </div>
          <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-4">
            <Award className="w-8 h-8 text-champagne-400" />
            <h3 className="font-serif text-xl font-medium text-white">Bespoke Concierge</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              From private jet transfers to turnkey interior architectural design, our private office delivers holistic execution of the highest international caliber.
            </p>
          </div>
        </div>

        {/* Leadership Advisory Team */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-semibold block">
              Private Office Leadership
            </span>
            <h2 className="font-serif text-3xl font-medium text-white">
              Senior Advisory Partners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                className="glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-champagne-400/40 transition flex flex-col shadow-luxury"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-medium text-white">{member.name}</h3>
                    <p className="text-xs text-champagne-400 uppercase tracking-wider font-semibold">
                      {member.roleTitle}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                      {member.bio}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-white/5 flex items-center space-x-4 text-xs text-slate-400">
                    {member.email && (
                      <span className="flex items-center space-x-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-champagne-400 flex-shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
