'use client';
import { AdminProvider } from '@/context/AdminContext';

export default function ClientAdminProvider({ children }: { children: React.ReactNode }) {
  return <AdminProvider>{children}</AdminProvider>;
}
