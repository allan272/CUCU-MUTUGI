'use client';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import { useState } from 'react';

const TABS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'database', icon: '🗄️', label: 'Database Viewer' },
  { id: 'products', icon: '🐣', label: 'Products' },
  { id: 'orders', icon: '📦', label: 'Orders' },
  { id: 'farmers', icon: '👨‍🌾', label: 'Farmers' },
  { id: 'media', icon: '🖼️', label: 'Media & Images' },
  { id: 'content', icon: '✏️', label: 'Site Content' },
  { id: 'blog', icon: '📝', label: 'Blog Posts' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
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
        <button onClick={() => setCollapsed(!collapsed)} className="text-white/70 hover:text-white text-lg ml-auto">
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
              activeTab === tab.id
                ? 'bg-white/20 text-white font-bold shadow-sm'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-lg flex-shrink-0">{tab.icon}</span>
            {!collapsed && <span className="text-sm">{tab.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="block text-center text-xs text-white/60 hover:text-white py-2 transition-colors">
            ← Back to Website
          </Link>
        </div>
      )}
    </aside>
  );
}
