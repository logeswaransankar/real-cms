import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { TeamMember } from '../types';
import { useSettings } from '../context/SettingsContext';
import { Shield, Award, Compass, Mail } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { siteName } = useSettings();
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    api.public.getTeam().then(setTeam).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1c1b1a] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Editorial Story */}
        <div className="max-w-3xl mx-auto text-center space-y-4 pb-8 border-b border-[#e7e4dc]">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#997e55] font-semibold block">
            Our Heritage
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1c1b1a] leading-tight">
            Curating Generational Architectural Trophies
          </h1>
          <p className="text-xs sm:text-sm text-[#5c5851] font-light leading-relaxed">
            Founded with the conviction that architectural excellence should never be compromised, {siteName || 'Elysian Estates'} bridges visionary master architects with discerning royal families, international collectors, and private family offices worldwide.
          </p>
        </div>

        {/* Brand Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-[#e7e4dc] bg-white p-8 space-y-4">
            <Shield className="w-6 h-6 text-[#997e55]" />
            <h3 className="font-serif text-lg font-medium text-[#1c1b1a]">Confidential Discretion</h3>
            <p className="text-xs text-[#6e6962] leading-relaxed font-light">
              We handle off-market acquisitions and bespoke portfolios with stringent non-disclosure compliance, safeguarding our clients' privacy across every interaction.
            </p>
          </div>
          <div className="border border-[#e7e4dc] bg-white p-8 space-y-4">
            <Compass className="w-6 h-6 text-[#997e55]" />
            <h3 className="font-serif text-lg font-medium text-[#1c1b1a]">Spatial & 3D Intelligence</h3>
            <p className="text-xs text-[#6e6962] leading-relaxed font-light">
              Utilizing interactive Three.js real-time simulations, our clients explore multi-million dollar spaces, sun angles, and finishings before breaking ground.
            </p>
          </div>
          <div className="border border-[#e7e4dc] bg-white p-8 space-y-4">
            <Award className="w-6 h-6 text-[#997e55]" />
            <h3 className="font-serif text-lg font-medium text-[#1c1b1a]">Bespoke Concierge</h3>
            <p className="text-xs text-[#6e6962] leading-relaxed font-light">
              From private viewing transfers to turnkey interior architectural design, our private office delivers holistic advisory of the highest international caliber.
            </p>
          </div>
        </div>

        {/* Leadership Advisory Team */}
        {team.length > 0 && (
          <div>
            <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#997e55] font-semibold block">
                Private Office Leadership
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1c1b1a]">
                Senior Advisory Partners
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="editorial-card group overflow-hidden border border-[#e7e4dc] bg-white flex flex-col"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#f5f4f0]">
                    <img
                      src={
                        member.photoUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-base font-medium text-[#1c1b1a]">{member.name}</h3>
                      <p className="text-xs text-[#997e55] uppercase tracking-wider font-semibold">
                        {member.roleTitle}
                      </p>
                      <p className="text-xs text-[#6e6962] mt-2 leading-relaxed font-light">
                        {member.bio}
                      </p>
                    </div>
                    {member.email && (
                      <div className="pt-3 border-t border-[#f0ede6] flex items-center space-x-1.5 text-xs text-[#8c8675]">
                        <Mail className="w-3.5 h-3.5 text-[#997e55] flex-shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
