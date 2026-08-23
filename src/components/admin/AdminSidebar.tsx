'use client';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Database,
  Egg,
  Package,
  Users,
  Image as ImageIcon,
  FileEdit,
  FileText,
  Settings,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Clock,
  Video,
  Wallet,
  Activity,
  MessageSquare
} from 'lucide-react';

const TABS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'departments', icon: Building2, label: 'Departments', isHighlight: true },
  { id: 'commerce', icon: Wallet, label: 'Commerce & Ledger', isHighlight: true },
  { id: 'community', icon: MessageSquare, label: 'Community Approvals', isHighlight: true },
  { id: 'activity', icon: Activity, label: 'Customer Activity', isHighlight: true },
  { id: 'stories', icon: Clock, label: '24h Status Updates', isHighlight: true },
  { id: 'videos', icon: Video, label: 'Videos & Shorts' },
  { id: 'database', icon: Database, label: 'Database Viewer' },
  { id: 'products', icon: Egg, label: 'Products' },
  { id: 'orders', icon: Package, label: 'Website Orders' },
  { id: 'farmers', icon: Users, label: 'Farmers' },
  { id: 'media', icon: ImageIcon, label: 'Media & Images' },
  { id: 'content', icon: FileEdit, label: 'Site Content' },
  { id: 'blog', icon: FileText, label: 'Blog Posts' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export default function AdminSidebar() {
  const { activeTab, setActiveTab } = useAdmin();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 flex flex-col`}
      style={{ background: 'linear-gradient(180deg, #14532D 0%, #15803D 60%, #166534 100%)', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/15">
        {!collapsed && <span className="text-amber-300 font-extrabold text-sm tracking-wide">CUCU MUTUGI ADMIN</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="text-white/70 hover:text-white ml-auto flex items-center justify-center cursor-pointer">
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : tab.isHighlight
                  ? 'text-amber-300 hover:bg-white/10 hover:text-white font-bold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 ${tab.isHighlight && activeTab !== tab.id ? 'text-amber-300' : ''}`} />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="text-sm">{tab.label}</span>
                  {tab.isHighlight && activeTab !== tab.id && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      {!collapsed && (
        <div className="p-4 border-t border-white/15">
          <Link href="/" className="flex items-center justify-center gap-1.5 text-center text-xs text-amber-200 hover:text-white py-2 transition-colors font-bold">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Website
          </Link>
        </div>
      )}
    </aside>
  );
}
