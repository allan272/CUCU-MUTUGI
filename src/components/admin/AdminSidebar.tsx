'use client';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import { useState } from 'react';
import {
  LayoutDashboard,
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
  Sparkles,
  Video
} from 'lucide-react';

const TABS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'stories', icon: Sparkles, label: 'Poultry Stories' },
  { id: 'videos', icon: Video, label: 'Videos & Shorts' },
  { id: 'database', icon: Database, label: 'Database Viewer' },
  { id: 'products', icon: Egg, label: 'Products' },
  { id: 'orders', icon: Package, label: 'Orders' },
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
      style={{ background: 'linear-gradient(180deg, #0D47A1 0%, #1565C0 60%, #0097A7 100%)', minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && <span className="text-white font-bold text-sm tracking-wide">ADMIN PANEL</span>}
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white font-bold shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{tab.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center justify-center gap-1.5 text-center text-xs text-white/60 hover:text-white py-2 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Website
          </Link>
        </div>
      )}
    </aside>
  );
}
