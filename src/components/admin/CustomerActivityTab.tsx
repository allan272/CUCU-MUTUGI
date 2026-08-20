'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Search,
  MousePointerClick,
  Mail,
  RefreshCw,
  Trash2,
  Calendar,
  Eye,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  TrendingUp,
  Globe,
  Filter
} from 'lucide-react';
import { CustomerActivity, DEFAULT_ACTIVITIES } from '@/lib/seeds';

export default function CustomerActivityTab() {
  const [activities, setActivities] = useState<CustomerActivity[]>(DEFAULT_ACTIVITIES);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'search' | 'button_click' | 'email_captured'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        if (data.activities && Array.isArray(data.activities)) {
          setActivities(data.activities);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleClearActivities = async () => {
    if (!confirm('Are you sure you want to clear the customer activity logs?')) return;
    try {
      const res = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
      });
      if (res.ok) {
        setActivities([]);
      }
    } catch (e) {
      console.error('Clear activities failed:', e);
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Filtered List
  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      if (typeFilter !== 'all' && act.type !== typeFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesQuery = (act.query || '').toLowerCase().includes(q);
        const matchesBtn = (act.buttonName || '').toLowerCase().includes(q);
        const matchesEmail = (act.email || '').toLowerCase().includes(q);
        const matchesPage = (act.page || '').toLowerCase().includes(q);
        if (!matchesQuery && !matchesBtn && !matchesEmail && !matchesPage) return false;
      }
      return true;
    });
  }, [activities, typeFilter, searchTerm]);

  // Aggregate Insights
  const insights = useMemo(() => {
    const searches = activities.filter(a => a.type === 'search');
    const clicks = activities.filter(a => a.type === 'button_click');
    const emails = activities.filter(a => a.type === 'email_captured');

    // Top searches count
    const searchCounts: Record<string, number> = {};
    searches.forEach(s => {
      if (s.query) searchCounts[s.query] = (searchCounts[s.query] || 0) + 1;
    });
    const topSearches = Object.entries(searchCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Top button clicks count
    const btnCounts: Record<string, number> = {};
    clicks.forEach(c => {
      if (c.buttonName) btnCounts[c.buttonName] = (btnCounts[c.buttonName] || 0) + 1;
    });
    const topButtons = Object.entries(btnCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Unique emails captured
    const uniqueEmails = Array.from(new Set(emails.map(e => e.email).filter(Boolean)));

    return {
      totalSearches: searches.length,
      totalClicks: clicks.length,
      totalEmails: uniqueEmails.length,
      topSearches,
      topButtons,
      uniqueEmails: emails,
    };
  }, [activities]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> Live Telemetry & Lead Tracker
          </div>
          <h2 className="text-2xl font-black tracking-tight">Customer Activity & Search Logs</h2>
          <p className="text-slate-300 text-xs mt-1">
            View real-time customer search queries, interactive buttons clicked, and leads/emails captured across the website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchActivities}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            title="Refresh Activities"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleClearActivities}
            className="bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 font-bold text-xs py-2.5 px-4 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Clear Logs
          </button>
        </div>
      </div>

      {/* Summary KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Search Queries</div>
            <div className="text-2xl font-black text-indigo-900">{insights.totalSearches}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Buttons Pressed</div>
            <div className="text-2xl font-black text-emerald-900">{insights.totalClicks}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Emails Captured</div>
            <div className="text-2xl font-black text-amber-800">{insights.totalEmails}</div>
          </div>
        </div>
      </div>

      {/* Insights Row: Top Searches & Top Clicked Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Top Searches Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-black text-slate-800 text-sm">
            <Search className="w-4 h-4 text-indigo-600" /> Top Customer Search Terms
          </div>
          <div className="space-y-2">
            {insights.topSearches.length === 0 ? (
              <div className="text-xs text-gray-400 py-3 text-center">No customer searches recorded yet.</div>
            ) : (
              insights.topSearches.map(([term, count], i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black flex items-center justify-center">
                      {i + 1}
                    </span>
                    &ldquo;{term}&rdquo;
                  </span>
                  <span className="bg-indigo-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full">
                    {count} search{count > 1 ? 'es' : ''}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Most Clicked Buttons Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-black text-slate-800 text-sm">
            <MousePointerClick className="w-4 h-4 text-emerald-600" /> Most Clicked Buttons & CTAs
          </div>
          <div className="space-y-2">
            {insights.topButtons.length === 0 ? (
              <div className="text-xs text-gray-400 py-3 text-center">No button clicks logged yet.</div>
            ) : (
              insights.topButtons.map(([btn, count], i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-2 truncate max-w-[240px]">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    {btn}
                  </span>
                  <span className="bg-emerald-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full flex-shrink-0">
                    {count} click{count > 1 ? 's' : ''}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Captured Emails & Leads Section */}
      {insights.uniqueEmails.length > 0 && (
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent p-6 rounded-3xl border-2 border-amber-300 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 font-black text-amber-950 text-base">
              <Mail className="w-5 h-5 text-amber-600" /> Captured Customer Emails Directory ({insights.totalEmails})
            </div>
            <span className="text-xs text-amber-800 font-semibold">
              Click any email to copy for marketing & order follow-ups
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {insights.uniqueEmails.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between gap-2 hover:border-amber-400 transition-all group"
              >
                <div className="truncate">
                  <div className="font-black text-xs text-slate-900 truncate">{item.email}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    Source: {item.metadata?.source || item.page || 'Website'} • {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => item.email && handleCopyEmail(item.email)}
                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer flex-shrink-0"
                  title="Copy Email"
                >
                  {copiedEmail === item.email ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Log Feed Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-indigo-600" /> Event Type:
            </span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1">
              {(['all', 'search', 'button_click', 'email_captured'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTypeFilter(tf)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                    typeFilter === tf ? 'bg-indigo-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tf === 'all' ? 'All Events' : tf === 'search' ? '🔍 Searches' : tf === 'button_click' ? '🖱️ Button Clicks' : '✉️ Emails'}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="Search within telemetry log..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Timestamp</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Details / Query / Button Pressed</th>
                <th className="py-3 px-2">Page Location</th>
                <th className="py-3 px-2">Extra Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold">
                    No activity logs recorded for this view.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {new Date(act.timestamp).toLocaleString('en-KE', { dateStyle: 'short', timeStyle: 'medium' })}
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      {act.type === 'search' && (
                        <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 font-black text-[10px] px-2.5 py-1 rounded-full uppercase">
                          <Search className="w-3 h-3" /> Search Query
                        </span>
                      )}
                      {act.type === 'button_click' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-black text-[10px] px-2.5 py-1 rounded-full uppercase">
                          <MousePointerClick className="w-3 h-3" /> Button Click
                        </span>
                      )}
                      {act.type === 'email_captured' && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-black text-[10px] px-2.5 py-1 rounded-full uppercase">
                          <Mail className="w-3 h-3" /> Email Lead
                        </span>
                      )}
                      {act.type === 'page_view' && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 font-black text-[10px] px-2.5 py-1 rounded-full uppercase">
                          <Globe className="w-3 h-3" /> Page Visit
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 font-bold text-slate-900">
                      {act.type === 'search' && <span className="text-indigo-900">&ldquo;{act.query}&rdquo;</span>}
                      {act.type === 'button_click' && <span className="text-slate-800">{act.buttonName}</span>}
                      {act.type === 'email_captured' && <span className="text-emerald-800 font-black font-mono">{act.email}</span>}
                    </td>
                    <td className="py-3 px-2 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {act.page || '/'}
                    </td>
                    <td className="py-3 px-2 text-slate-400 text-[11px]">
                      {act.metadata ? JSON.stringify(act.metadata) : '—'}
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
