'use client';
import { useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import type { LucideIcon } from 'lucide-react';
import {
  Egg,
  Workflow,
  HeartPulse,
  Truck,
  ShoppingCart,
  Megaphone,
  Calculator,
  ShieldCheck,
  FileText,
  Smartphone,
  Users,
  Package,
} from 'lucide-react';

type Department = {
  name: string;
  icon: LucideIcon;
  owner: string;
  purpose: string;
  status: 'Active' | 'Needs Attention';
  metrics: string[];
  accent: string;
};

const DEPARTMENTS: Department[] = [
  { name: 'Hatchery', icon: Egg, owner: 'Breeding Supervisor', purpose: 'Manages incubation, chick quality, and dispatch readiness.', status: 'Active', metrics: ['Incubation schedule', 'Hatch rate', 'Day-old readiness'], accent: 'from-amber-500 to-orange-500' },
  { name: 'Brooding', icon: HeartPulse, owner: 'Farm Care Lead', purpose: 'Handles temperatures, feed starts, and early chick survival.', status: 'Active', metrics: ['Temp control', 'Brooder hygiene', 'Week-1 care'], accent: 'from-emerald-500 to-teal-500' },
  { name: 'Feed & Nutrition', icon: Package, owner: 'Nutrition Officer', purpose: 'Tracks feed stock, formulation, and growth support.', status: 'Active', metrics: ['Feed stock', 'Rations', 'Consumption trends'], accent: 'from-blue-500 to-cyan-500' },
  { name: 'Health & Vaccination', icon: ShieldCheck, owner: 'Vet Desk', purpose: 'Manages vaccine schedules, disease control, and treatment notes.', status: 'Active', metrics: ['Vaccination calendar', 'Biosecurity', 'Vet alerts'], accent: 'from-rose-500 to-pink-500' },
  { name: 'Sales & Orders', icon: ShoppingCart, owner: 'Sales Manager', purpose: 'Receives customer orders and confirms pricing, quantity, and delivery.', status: 'Active', metrics: ['Orders today', 'Pending confirmations', 'Revenue'], accent: 'from-amber-500 to-yellow-500' },
  { name: 'Delivery & Logistics', icon: Truck, owner: 'Dispatch Officer', purpose: 'Coordinates routes, delivery timing, and customer handover.', status: 'Active', metrics: ['Route planning', 'Dispatch list', 'Delivery confirmations'], accent: 'from-slate-600 to-slate-800' },
  { name: 'Customer Care', icon: Smartphone, owner: 'Support Desk', purpose: 'Handles calls, WhatsApp, SMS follow-ups, and response speed.', status: 'Needs Attention', metrics: ['Inbox response', 'Pending callbacks', 'Issue resolution'], accent: 'from-violet-500 to-indigo-500' },
  { name: 'Finance & Records', icon: Calculator, owner: 'Accounts', purpose: 'Tracks ledger entries, margins, expenses, and receipts.', status: 'Active', metrics: ['Income', 'Expenses', 'Profit tracking'], accent: 'from-emerald-600 to-lime-500' },
  { name: 'Community & Training', icon: Users, owner: 'Community Manager', purpose: 'Verifies members, posts training updates, and moderates the lounge.', status: 'Active', metrics: ['Verified farmers', 'Announcements', 'Support threads'], accent: 'from-teal-500 to-cyan-500' },
  { name: 'Content & Media', icon: FileText, owner: 'Content Lead', purpose: 'Publishes stories, videos, and website updates.', status: 'Active', metrics: ['Stories', 'Videos', 'Page updates'], accent: 'from-amber-500 to-rose-500' },
  { name: 'Office & Admin', icon: Workflow, owner: 'Administrator', purpose: 'Coordinates approvals, site settings, and workflow handoffs.', status: 'Active', metrics: ['Approvals', 'Site settings', 'Internal notes'], accent: 'from-slate-700 to-slate-900' },
  { name: 'Digital Store', icon: Megaphone, owner: 'Web Team', purpose: 'Keeps the public product pages, install prompt, and online experience polished.', status: 'Active', metrics: ['Live products', 'Install prompt', 'Customer journey'], accent: 'from-orange-500 to-amber-500' },
];

export default function DepartmentsTab() {
  const { db } = useAdmin();

  const stats = useMemo(() => {
    const totalOrders = db.orders.length;
    const activeProducts = db.products.filter((product) => product.active !== false).length;
    const verifiedFarmers = db.farmers.length;

    return [
      { label: 'Orders', value: totalOrders },
      { label: 'Active Products', value: activeProducts },
      { label: 'Farmers', value: verifiedFarmers },
    ];
  }, [db.orders.length, db.products, db.farmers.length]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-primary">Farm Departments</h2>
          <p className="text-gray-500 text-sm max-w-2xl">
            Organize the operation like a real poultry business, with every department having a clear job and handoff.
          </p>
        </div>
        <div className="flex gap-3">
          {stats.map((item) => (
            <div key={item.label} className="bg-white rounded-2xl border border-blue-100 px-4 py-3 shadow-sm text-center min-w-24">
              <div className="text-xl font-black text-primary">{item.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {DEPARTMENTS.map((department) => {
          const Icon = department.icon;
          return (
            <div key={department.name} className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden">
              <div className={`p-5 bg-gradient-to-r ${department.accent} text-white`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black">{department.name}</h3>
                      <p className="text-white/80 text-xs font-medium">{department.owner}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
                    department.status === 'Active' ? 'bg-emerald-300 text-slate-950' : 'bg-amber-300 text-slate-950'
                  }`}>
                    {department.status}
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm text-slate-600">{department.purpose}</p>
                <div className="flex flex-wrap gap-2">
                  {department.metrics.map((metric) => (
                    <span key={metric} className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
