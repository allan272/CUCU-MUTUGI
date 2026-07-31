'use client';
import { useAdmin } from '@/context/AdminContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTabContent from '@/components/admin/AdminTabContent';
import Image from 'next/image';
import { useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminUI />;
}

function AdminUI() {
  const { isAuthenticated, login, logout, authError, dbSource } = useAdmin();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setSubmitting(true);
    await login(password);
    setSubmitting(false);
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative px-4 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0A192F 0%, #172A45 50%, #1A365D 100%)' }}
      >
        {/* Decorative blur elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-amber-500/10 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-400/10 blur-[100px]" />

        {/* glass container */}
        <div
          className="w-full max-w-md p-8 rounded-3xl border border-white/10 relative z-10 shadow-2xl"
          style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)' }}
        >
          {/* Brand header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 relative overflow-hidden rounded-full ring-4 ring-amber-400/30 bg-white/10 mb-4 flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" fill className="object-contain p-1.5" />
            </div>
            <h1 className="text-xl font-extrabold text-white text-center tracking-wider">
              CUCU MUTUGI POULTRY
            </h1>
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mt-1">
              Admin Portal
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="admin-password">
                Administrative Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-white bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400/50 transition-all placeholder:text-white/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="text-red-400 bg-red-950/20 border border-red-500/20 px-4 py-2.5 rounded-xl text-xs text-center font-medium">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-900 font-bold text-sm uppercase tracking-wider shadow-lg active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                'Access Control Panel'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated — show full admin panel
  return (
    <div className="flex min-h-screen" style={{ background: '#F0F8FF' }}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="glass-white border-b border-blue-100 px-6 py-3 flex items-center gap-4 shadow-sm">
          <div className="w-8 h-8 relative overflow-hidden rounded-full ring-2 ring-amber-300">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-sm">CUCU MUTUGI POULTRY</span>
            <span className="text-gray-400 text-xs ml-2">— Admin Control Panel</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
              <span className={`w-2 h-2 rounded-full ${dbSource === 'mongodb' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'} inline-block`} />
              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
                DB: {dbSource === 'mongodb' ? 'MongoDB Atlas' : 'Local Storage'}
              </span>
            </div>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs text-gray-500 hidden sm:inline">
              {new Date().toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 border border-transparent hover:border-red-100 transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <AdminTabContent />
        </div>
      </div>
    </div>
  );
}
