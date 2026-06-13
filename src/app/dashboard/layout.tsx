'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-charcoal text-white hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-bold text-accent mb-6">Farmer Dashboard</h2>
          <nav className="space-y-4">
            <Link href="/dashboard" className="block text-gray-300 hover:text-white transition-colors">Overview</Link>
            <Link href="/dashboard/flocks" className="block text-gray-300 hover:text-white transition-colors">My Flocks</Link>
            <Link href="/dashboard/feed" className="block text-gray-300 hover:text-white transition-colors">Feed Log</Link>
            <Link href="/dashboard/profit" className="block text-gray-300 hover:text-white transition-colors">Profit Tracker</Link>
            <Link href="/dashboard/mortality" className="block text-gray-300 hover:text-white transition-colors">Mortality Log</Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-8">
        <div className="md:hidden mb-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-primary">Dashboard</h2>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle dashboard navigation"
              aria-expanded={mobileOpen}
              className="p-3 rounded-full border border-gray-200 bg-white text-primary shadow-sm hover:bg-gray-50"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>

          {mobileOpen && (
            <div className="mt-3 rounded-3xl border border-gray-100 bg-white shadow-sm">
              <nav className="space-y-1 p-4">
                <Link href="/dashboard" className="block rounded-xl px-3 py-2 text-primary hover:bg-slate-50">Overview</Link>
                <Link href="/dashboard/flocks" className="block rounded-xl px-3 py-2 text-primary hover:bg-slate-50">My Flocks</Link>
                <Link href="/dashboard/feed" className="block rounded-xl px-3 py-2 text-primary hover:bg-slate-50">Feed Log</Link>
                <Link href="/dashboard/profit" className="block rounded-xl px-3 py-2 text-primary hover:bg-slate-50">Profit Tracker</Link>
                <Link href="/dashboard/mortality" className="block rounded-xl px-3 py-2 text-primary hover:bg-slate-50">Mortality Log</Link>
              </nav>
            </div>
          )}
        </div>

        {children}
      </main>
    </div>
  );
}
