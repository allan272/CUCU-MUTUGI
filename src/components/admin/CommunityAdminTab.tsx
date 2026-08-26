'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
  Sparkles,
  Send,
  Mail,
  Phone,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { ChatUser, DEFAULT_CHAT_USERS } from '@/lib/seeds';

export default function CommunityAdminTab() {
  const [members, setMembers] = useState<ChatUser[]>(DEFAULT_CHAT_USERS);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_approval' | 'approved' | 'banned'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Announcement state
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementChannel, setAnnouncementChannel] = useState('general-lounge');
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat/members');
      if (res.ok) {
        const data = await res.json();
        if (data.members) setMembers(data.members);
      }
    } catch (e) {
      console.warn('Failed to fetch chat members:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const handleMemberAction = async (userId: string, action: 'approve' | 'ban' | 'delete') => {
    setActionUserId(userId);
    try {
      const res = await fetch('/api/chat/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.members) setMembers(data.members);
      } else {
        alert('Action failed. Please try again.');
      }
    } catch (e) {
      console.error('Member action failed:', e);
      alert('Error updating user status.');
    } finally {
      setActionUserId(null);
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementContent.trim()) return;

    setPostingAnnouncement(true);
    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          message: {
            channelId: announcementChannel,
            senderId: 'admin-cucu',
            senderName: 'Cucu Mutugi Admin',
            senderRole: 'admin',
            senderAvatar: '/logo.png',
            senderCounty: 'Embu HQ',
            content: `📢 OFFICIAL ADMIN ANNOUNCEMENT:\n${announcementContent.trim()}`,
            pinned: true,
          }
        }),
      });
      if (res.ok) {
        alert('Announcement broadcasted to farmer lounge!');
        setAnnouncementContent('');
      }
    } catch (err) {
      console.error('Announcement failed:', err);
    } finally {
      setPostingAnnouncement(false);
    }
  };

  // Metrics
  const pendingCount = useMemo(() => members.filter(m => m.status === 'pending_approval').length, [members]);
  const approvedCount = useMemo(() => members.filter(m => m.status === 'approved').length, [members]);

  // Filtered List
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesEmail = m.email.toLowerCase().includes(q);
        const matchesCounty = (m.county || '').toLowerCase().includes(q);
        const matchesFocus = (m.farmFocus || '').toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesCounty && !matchesFocus) return false;
      }
      return true;
    });
  }, [members, statusFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Community Moderation & Verification
          </div>
          <h2 className="text-2xl font-black tracking-tight">Farmer Chat Members & Approvals</h2>
          <p className="text-emerald-200 text-xs mt-1">
            Review new farmer registrations, grant chat permissions, broadcast official announcements, and manage community security.
          </p>
        </div>
        <button
          onClick={fetchMembers}
          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pending Approvals</div>
            <div className="text-2xl font-black text-amber-700">{pendingCount}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Verified Farmers</div>
            <div className="text-2xl font-black text-emerald-800">{approvedCount}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center font-black">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Registered</div>
            <div className="text-2xl font-black text-slate-900">{members.length}</div>
          </div>
        </div>
      </div>

      {/* Broadcast Announcement Bar */}
      <form onSubmit={handlePostAnnouncement} className="bg-white p-5 rounded-3xl border-2 border-amber-300 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Broadcast Verified Admin Announcement
          </h3>
          <select
            value={announcementChannel}
            onChange={(e) => setAnnouncementChannel(e.target.value)}
            className="text-xs font-bold border rounded-xl px-2.5 py-1 bg-slate-50 focus:outline-none"
          >
            <option value="general-lounge">🐔 General Farmers Lounge</option>
            <option value="chicks-brooding">🐣 Chicks & Brooding Care</option>
            <option value="vaccination-health">💉 Vaccination & Health</option>
            <option value="marketplace">🛒 Farmer Marketplace</option>
          </select>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Type official message e.g. 🚨 New shipment of ISA Brown Layers arriving this Wednesday..."
            value={announcementContent}
            onChange={(e) => setAnnouncementContent(e.target.value)}
            className="flex-1 text-xs border rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={postingAnnouncement}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" /> Broadcast
          </button>
        </div>
      </form>

      {/* Members Directory Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-600" /> Status:
            </span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1">
              {(['all', 'pending_approval', 'approved', 'banned'] as const).map(sf => (
                <button
                  key={sf}
                  onClick={() => setStatusFilter(sf)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                    statusFilter === sf ? 'bg-emerald-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sf === 'all'
                    ? 'All Members'
                    : sf === 'pending_approval'
                    ? `⏳ Pending (${pendingCount})`
                    : sf === 'approved'
                    ? '✓ Verified'
                    : '🚫 Banned'}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="Search member by name, email, county..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 w-60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Farmer / Name</th>
                <th className="py-3 px-2">Contact</th>
                <th className="py-3 px-2">Location & Focus</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Registered At</th>
                <th className="py-3 px-2 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                    No community members found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900">{member.name}</div>
                          <div className="text-[10px] text-gray-500 uppercase font-semibold">{member.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-700 whitespace-nowrap">
                      <div className="font-mono text-[11px]">{member.email}</div>
                      <div className="text-[10px] text-gray-500">{member.phone || '—'}</div>
                    </td>
                    <td className="py-3 px-2 text-slate-700">
                      <div className="font-semibold text-slate-900">{member.county || 'Kenya'}</div>
                      <div className="text-[11px] text-gray-500 truncate max-w-[160px]">{member.farmFocus || '—'}</div>
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      {member.status === 'pending_approval' && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide animate-pulse">
                          <Clock className="w-3 h-3" /> Awaiting Verification
                        </span>
                      )}
                      {member.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide">
                          <CheckCircle2 className="w-3 h-3" /> Verified Member
                        </span>
                      )}
                      {member.status === 'banned' && (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide">
                          <XCircle className="w-3 h-3" /> Banned / Blocked
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {member.status !== 'approved' && (
                          <button
                            onClick={() => handleMemberAction(member.id, 'approve')}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}
                        {member.status === 'approved' && member.role !== 'admin' && (
                          <button
                            onClick={() => handleMemberAction(member.id, 'ban')}
                            className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                          >
                            Suspend
                          </button>
                        )}
                        {member.role !== 'admin' && (
                          <button
                            onClick={() => handleMemberAction(member.id, 'delete')}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
