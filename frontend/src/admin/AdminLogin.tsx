import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@elysian-estates.com');
  const [password, setPassword] = useState('AdminSecurePass2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to /admin
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('AdminSecurePass2026!');
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background architectural glow */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
          alt="Architecture Background"
          className="w-full h-full object-cover filter brightness-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/90 to-obsidian-950/80" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-full border border-champagne-400/50 flex items-center justify-center bg-obsidian-900 mx-auto shadow-glow-gold">
          <Shield className="w-6 h-6 text-champagne-400" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-white">
          Elysian CMS Portal
        </h2>
        <p className="text-xs uppercase tracking-widest text-champagne-400/90">
          Secure Executive Administration
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-2xl border border-champagne-400/30 shadow-luxury space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-300 mb-1 font-medium">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-champagne-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-champagne-400 transition"
                  placeholder="admin@elysian-estates.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-300 mb-1 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-champagne-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-champagne-400 transition"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-xs font-semibold uppercase tracking-widest bg-champagne-400 text-obsidian-900 hover:bg-champagne-300 transition shadow-glow-gold flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Credentials Helper */}
          <div className="pt-4 border-t border-white/5 space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block text-center">
              Quick One-Click Demo Logins:
            </span>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => handleDemoFill('admin@elysian-estates.com')}
                className="p-2 rounded-lg bg-obsidian-900 hover:bg-obsidian-800 border border-white/10 text-slate-300 hover:text-white transition text-left"
              >
                <strong className="block text-champagne-400">Super Admin</strong>
                admin@...
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('agent@elysian-estates.com')}
                className="p-2 rounded-lg bg-obsidian-900 hover:bg-obsidian-800 border border-white/10 text-slate-300 hover:text-white transition text-left"
              >
                <strong className="block text-champagne-400">Property Mgr</strong>
                agent@...
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('editor@elysian-estates.com')}
                className="p-2 rounded-lg bg-obsidian-900 hover:bg-obsidian-800 border border-white/10 text-slate-300 hover:text-white transition text-left"
              >
                <strong className="block text-champagne-400">Editor</strong>
                editor@...
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-slate-400 hover:text-champagne-300 transition">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
