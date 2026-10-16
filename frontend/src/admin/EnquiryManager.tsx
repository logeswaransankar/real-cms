import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Enquiry } from '../types';
import {
  Mail,
  Search,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit2,
  Calendar,
  Phone,
  MessageSquare,
  X,
  User,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const EnquiryManager: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modal for editing status & notes
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [statusForm, setStatusForm] = useState({
    status: 'NEW',
    adminNotes: '',
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getEnquiries();
      setEnquiries(res);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load inquiries' });
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setStatusForm({
      status: enq.status || 'NEW',
      adminNotes: enq.adminNotes || '',
    });
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    try {
      setUpdating(true);
      await api.admin.updateEnquiryStatus(
        selectedEnquiry.id,
        statusForm.status,
        statusForm.adminNotes
      );
      setFeedback({ type: 'success', message: 'Inquiry status updated successfully!' });
      setSelectedEnquiry(null);
      await loadEnquiries();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error updating status' });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this client inquiry?')) return;
    try {
      await api.admin.deleteEnquiry(id);
      setFeedback({ type: 'success', message: 'Inquiry record removed' });
      await loadEnquiries();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error deleting inquiry' });
    }
  };

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.phone && e.phone.toLowerCase().includes(search.toLowerCase())) ||
      (e.message && e.message.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = filterStatus === 'ALL' || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
            <Mail className="w-7 h-7 text-champagne-400" />
            VIP Inquiries & Private Viewings Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage confidential acquisition inquiries, scheduled VIP private tours, and high-net-worth client outreach.
          </p>
        </div>
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

      {/* Filter Bar */}
      <div className="bg-obsidian-900 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, email, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-obsidian-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-champagne-400"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-champagne-400"
        >
          <option value="ALL">All Inquiry Statuses</option>
          <option value="NEW">New (Unread)</option>
          <option value="CONTACTED">Contacted by Agent</option>
          <option value="QUALIFIED">Qualified HNW Buyer</option>
          <option value="VIEWING_SCHEDULED">Viewing Scheduled</option>
          <option value="CLOSED">Closed / Acquired</option>
        </select>
      </div>

      {/* Inquiries Table */}
      <div className="bg-obsidian-900 border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading inquiries...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No client inquiries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-400 bg-obsidian-950/50">
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Interest / Property</th>
                  <th className="py-3 px-4">Inquiry Note</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Received</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {filtered.map((enq) => (
                  <tr key={enq.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-champagne-400/20 text-champagne-300 flex items-center justify-center font-bold text-xs uppercase">
                          {enq.fullName.charAt(0)}
                        </div>
                        <span>{enq.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div>{enq.email}</div>
                      <div className="text-[11px] text-slate-400">{enq.phone || 'No phone'}</div>
                    </td>
                    <td className="py-3 px-4">
                      {enq.property ? (
                        <span className="font-semibold text-champagne-300 line-clamp-1">
                          {enq.property.title}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">General VIP Concierge</span>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-400 text-[11px]" title={enq.message}>
                      {enq.message}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          enq.status === 'NEW'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : enq.status === 'CONTACTED'
                            ? 'bg-amber-500/20 text-amber-400'
                            : enq.status === 'QUALIFIED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {enq.status || 'NEW'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openStatusModal(enq)}
                          className="p-1.5 rounded-lg bg-obsidian-950 border border-white/10 text-champagne-400 hover:bg-champagne-400 hover:text-obsidian-950 transition"
                          title="Update Status"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(enq.id)}
                          className="p-1.5 rounded-lg bg-obsidian-950 border border-white/10 text-rose-400 hover:bg-rose-500 hover:text-white transition"
                          title="Delete"
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

      {/* Status Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-serif font-bold text-white">
                Inquiry Details: {selectedEnquiry.fullName}
              </h3>
              <button onClick={() => setSelectedEnquiry(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-obsidian-950 p-4 rounded-xl border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-200 font-semibold">{selectedEnquiry.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="text-slate-200 font-semibold">{selectedEnquiry.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Client Message:</span>
                <p className="text-slate-300 bg-obsidian-900 p-2.5 rounded-lg font-mono text-[11px]">
                  {selectedEnquiry.message}
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pipeline Status</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="NEW">NEW (Unread / Needs Review)</option>
                  <option value="CONTACTED">CONTACTED (Followed Up)</option>
                  <option value="QUALIFIED">QUALIFIED (High-Net-Worth Verified)</option>
                  <option value="VIEWING_SCHEDULED">VIEWING_SCHEDULED (Tour Arranged)</option>
                  <option value="CLOSED">CLOSED (Deal Finalized / Completed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Internal Agent Notes</label>
                <textarea
                  rows={3}
                  value={statusForm.adminNotes}
                  onChange={(e) => setStatusForm({ ...statusForm, adminNotes: e.target.value })}
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl p-3 text-xs text-white"
                  placeholder="Record private buyer notes, budget verification, NDA status..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 rounded-xl bg-obsidian-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-champagne-400 text-obsidian-950 text-xs font-bold shadow-glow-gold"
                >
                  {updating ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
