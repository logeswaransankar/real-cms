import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User as UserType } from '../types';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  Shield,
  Key,
} from 'lucide-react';

export const UserManager: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Search
  const [search, setSearch] = useState('');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    id: 0,
    fullName: '',
    email: '',
    password: '',
    roles: ['ROLE_AGENT'],
    isActive: true,
  });

  const availableRoles = [
    { role: 'ROLE_SUPER_ADMIN', label: 'Super Admin (Complete System Access)' },
    { role: 'ROLE_ADMIN', label: 'Admin (CMS, Properties, & Operations)' },
    { role: 'ROLE_CONTENT_MANAGER', label: 'Content Manager (CMS Pages & Blog)' },
    { role: 'ROLE_AGENT', label: 'Real Estate Agent (Leads & Properties)' },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getUsers();
      setUsers(res);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load staff users' });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setForm({
      id: 0,
      fullName: '',
      email: '',
      password: '',
      roles: ['ROLE_AGENT'],
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (u: UserType) => {
    setIsEditing(true);
    setForm({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      password: '',
      roles: u.roles && u.roles.length > 0 ? u.roles : ['ROLE_AGENT'],
      isActive: u.isActive !== undefined ? u.isActive : true,
    });
    setShowModal(true);
  };

  const toggleRole = (r: string) => {
    setForm((prev) => {
      const exists = prev.roles.includes(r);
      const newRoles = exists ? prev.roles.filter((x) => x !== r) : [...prev.roles, r];
      return { ...prev, roles: newRoles.length > 0 ? newRoles : ['ROLE_AGENT'] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (isEditing) {
        await api.admin.updateUser(form.id, {
          fullName: form.fullName,
          email: form.email,
          roles: form.roles,
          isActive: form.isActive,
        });
        setFeedback({ type: 'success', message: 'Staff user updated successfully!' });
      } else {
        await api.admin.createUser({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          roles: form.roles,
          isActive: form.isActive,
        });
        setFeedback({ type: 'success', message: 'Staff user created successfully!' });
      }
      setShowModal(false);
      await loadUsers();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving user' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to deactivate/delete this staff member?')) return;
    try {
      await api.admin.deleteUser(id);
      setFeedback({ type: 'success', message: 'User deleted' });
      await loadUsers();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error deleting user' });
    }
  };

  const filtered = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
            <Users className="w-7 h-7 text-champagne-400" />
            Staff & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage administrative personnel, assign granular security roles, and enforce platform governance.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-champagne-400 text-obsidian-950 font-bold text-xs hover:bg-champagne-300 transition flex items-center gap-2 shadow-glow-gold"
        >
          <Plus className="w-4 h-4" />
          Add Staff Member
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

      {/* Search */}
      <div className="bg-obsidian-900 border border-white/5 rounded-2xl p-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-obsidian-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-champagne-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-obsidian-900 border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading staff accounts...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-400 bg-obsidian-950/50">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Assigned Roles</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-champagne-400/20 text-champagne-300 flex items-center justify-center font-bold text-xs uppercase border border-champagne-400/30">
                          {u.fullName.charAt(0)}
                        </div>
                        <span>{u.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{u.email}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {u.roles?.map((r) => (
                          <span
                            key={r}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-champagne-300"
                          >
                            {r.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-1.5 rounded-lg bg-obsidian-950 border border-white/10 text-champagne-400 hover:bg-champagne-400 hover:text-obsidian-950 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-1.5 rounded-lg bg-obsidian-950 border border-white/10 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-champagne-400" />
                {isEditing ? `Edit Staff Member` : 'Add New Staff Member'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {!isEditing && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Password *</label>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="Min 8 characters"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Role Permissions</label>
                <div className="space-y-2">
                  {availableRoles.map((r) => {
                    const checked = form.roles.includes(r.role);
                    return (
                      <label
                        key={r.role}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                          checked
                            ? 'bg-champagne-400/10 border-champagne-400/40 text-white'
                            : 'bg-obsidian-950 border-white/5 text-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRole(r.role)}
                          className="mt-0.5 rounded text-champagne-400"
                        />
                        <div>
                          <p className="text-xs font-semibold">{r.label}</p>
                          <span className="text-[10px] font-mono text-champagne-300">{r.role}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-obsidian-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-champagne-400 text-obsidian-950 text-xs font-bold shadow-glow-gold"
                >
                  {saving ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
