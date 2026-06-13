'use client';
import { AdminProvider } from '@/context/AdminContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTabContent from '@/components/admin/AdminTabContent';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminUI />
    </AdminProvider>
  );
}

function AdminUI() {
  return (
    <div className="flex min-h-screen" style={{ background: '#F0F8FF' }}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="glass-white border-b border-blue-100 px-6 py-3 flex items-center gap-4 shadow-sm">
          <div className="w-8 h-8 relative overflow-hidden rounded-full ring-2 ring-blue-200">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <div>
            <span className="font-extrabold text-primary text-sm">CUCU MUTUGI POULTRY</span>
            <span className="text-gray-400 text-xs ml-2">— Admin Control Panel</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
            <span className="text-xs text-gray-500">Database: Local Storage</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">{new Date().toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })}</span>
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
