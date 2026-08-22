import Link from 'next/link';
import { Wheat, AlertTriangle, DollarSign, Egg, Package, Smartphone } from 'lucide-react';
import InstallAppCard from '@/components/InstallAppCard';

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white p-8 md:p-10 shadow-2xl border border-emerald-700/40 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.2),_transparent_35%)]" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] bg-amber-400 text-slate-950 px-3 py-1 rounded-full mb-4">
              <Package className="h-3.5 w-3.5" /> Farm Control Center
            </p>
            <h1 className="text-3xl md:text-5xl font-black mb-3">Welcome Back, Farmer!</h1>
            <p className="text-emerald-100 max-w-2xl text-sm md:text-base">
              Keep an eye on flocks, orders, feed, and the app install option from one clean dashboard.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10">
            <Smartphone className="h-5 w-5 text-amber-300" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-emerald-200 font-black">Mobile Ready</div>
              <div className="text-sm font-bold">Install for faster access</div>
            </div>
          </div>
        </div>
      </div>

      <InstallAppCard />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-primary">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Active Flocks</h3>
          <p className="text-3xl font-bold text-charcoal">3</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-accent">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Birds</h3>
          <p className="text-3xl font-bold text-charcoal">1,250</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-blue-500">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Feed Used (This Week)</h3>
          <p className="text-3xl font-bold text-charcoal">450 kg</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-red-500">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Mortality Rate</h3>
          <p className="text-3xl font-bold text-charcoal">1.2%</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-primary mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/feed" className="flex flex-col items-center p-4 bg-light-green rounded-2xl hover:bg-green-100 transition-colors">
            <Wheat className="h-7 w-7 text-green-600 mb-2" />
            <span className="font-medium text-charcoal">Log Feed</span>
          </Link>
          <Link href="/dashboard/mortality" className="flex flex-col items-center p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors">
            <AlertTriangle className="h-7 w-7 text-red-500 mb-2" />
            <span className="font-medium text-charcoal">Log Mortality</span>
          </Link>
          <Link href="/dashboard/profit" className="flex flex-col items-center p-4 bg-light-gold rounded-2xl hover:bg-yellow-100 transition-colors">
            <DollarSign className="h-7 w-7 text-yellow-600 mb-2" />
            <span className="font-medium text-charcoal">Estimate Profit</span>
          </Link>
          <Link href="/dashboard/flocks" className="flex flex-col items-center p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors">
            <Egg className="h-7 w-7 text-blue-600 mb-2" />
            <span className="font-medium text-charcoal">Manage Flocks</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
