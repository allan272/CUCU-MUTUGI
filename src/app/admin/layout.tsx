'use client';
import { useAdmin } from '@/context/AdminContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTabContent from '@/components/admin/AdminTabContent';
import AdminAIAssistant from '@/components/admin/AdminAIAssistant';
import Image from 'next/image';
import { useState } from 'react';
import { Lock, Loader2, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminUI />;
}

function AdminUI() {
  const { isAuthenticated, login, logout, authError, dbSource } = useAdmin();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const pwdToTry = password;
    if (!pwdToTry.trim()) return;
    setSubmitting(true);
    await login(pwdToTry);
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
          <form
            action="javascript:void(0)"
            onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); handleSubmit(e); }}
            className="space-y-5"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-white/80 text-xs font-bold uppercase tracking-wider" htmlFor="admin-password">
                  Administrative Password
                </label>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-white/40 pointer-events-none">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full text-white bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all placeholder:text-white/40 font-medium"
                />
              </div>
            </div>

            {authError && (
              <div className="text-red-300 bg-red-950/60 border border-red-500/40 px-4 py-2.5 rounded-xl text-xs text-center font-bold shadow-md">
                {authError}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-xl active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
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
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated — show full admin panel
  return (
    <div className="flex min-h-screen" style={{ background: '#F0F8FF' }}>
      <AdminSidebar />

      {/* AI Assistant — inline left panel between sidebar and content */}
      <AdminAIAssistant />

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
