'use client';
import { useEffect, useMemo, useState } from 'react';
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
  Save,
  RotateCcw,
} from 'lucide-react';
import { DEFAULT_DEPARTMENTS, type DepartmentSection } from '@/lib/seeds';

const DEPARTMENT_ICONS: Record<string, LucideIcon> = {
  hatchery: Egg,
  brooding: HeartPulse,
  'feed-nutrition': Package,
  'health-vaccination': ShieldCheck,
  'sales-orders': ShoppingCart,
  'delivery-logistics': Truck,
  'customer-care': Smartphone,
  'finance-records': Calculator,
  'community-training': Users,
  'content-media': FileText,
  'office-admin': Workflow,
  'digital-store': Megaphone,
};

function cloneDepartment(department: DepartmentSection): DepartmentSection {
  return {
    ...department,
    metrics: [...department.metrics],
  };
}

export default function DepartmentsTab() {
  const { db, updateSettings } = useAdmin();
  const departmentsFromSettings = db.settings.departments?.length ? db.settings.departments : DEFAULT_DEPARTMENTS;
  const [departments, setDepartments] = useState<DepartmentSection[]>(departmentsFromSettings.map(cloneDepartment));

  useEffect(() => {
    setDepartments(departmentsFromSettings.map(cloneDepartment));
  }, [db.settings.departments]);

  const stats = useMemo(() => {
    return [
      { label: 'Orders', value: db.orders.length },
      { label: 'Active Products', value: db.products.filter((product) => product.active !== false).length },
      { label: 'Farmers', value: db.farmers.length },
    ];
  }, [db.orders.length, db.products, db.farmers.length]);

  const persistDepartments = (nextDepartments: DepartmentSection[]) => {
    setDepartments(nextDepartments);
    updateSettings({ departments: nextDepartments });
  };

  const updateDepartment = (id: string, patch: Partial<DepartmentSection>) => {
    const nextDepartments = departments.map((department) => (
      department.id === id ? { ...department, ...patch } : department
    ));
    setDepartments(nextDepartments);
  };

  const saveDepartment = (id: string) => {
    const nextDepartments = departments.map((department) => (
      department.id === id ? cloneDepartment(department) : department
    ));
    persistDepartments(nextDepartments);
  };

  const resetDepartments = () => {
    persistDepartments(DEFAULT_DEPARTMENTS.map(cloneDepartment));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-black text-primary">Farm Departments</h2>
          <p className="text-gray-500 text-sm max-w-2xl">
            Each department can edit its own section, save its details, and keep the farm workflow organized from one dashboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {stats.map((item) => (
            <div key={item.label} className="bg-white rounded-2xl border border-blue-100 px-4 py-3 shadow-sm text-center min-w-24">
              <div className="text-xl font-black text-primary">{item.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{item.label}</div>
            </div>
          ))}
          <button
            type="button"
            onClick={resetDepartments}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Defaults
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {departments.map((department) => {
          const Icon = DEPARTMENT_ICONS[department.id] || Users;
          const metricsText = department.metrics.join('\n');

          return (
            <div key={department.id} className="rounded-3xl border border-blue-100 bg-white shadow-sm overflow-hidden">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Department Name</label>
                    <input
                      value={department.name}
                      onChange={(e) => updateDepartment(department.id, { name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Owner</label>
                    <input
                      value={department.owner}
                      onChange={(e) => updateDepartment(department.id, { owner: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Purpose</label>
                  <textarea
                    rows={3}
                    value={department.purpose}
                    onChange={(e) => updateDepartment(department.id, { purpose: e.target.value })}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Status</label>
                    <select
                      value={department.status}
                      onChange={(e) => updateDepartment(department.id, { status: e.target.value as DepartmentSection['status'] })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Needs Attention">Needs Attention</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Accent Class</label>
                    <input
                      value={department.accent}
                      onChange={(e) => updateDepartment(department.id, { accent: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                      placeholder="from-emerald-500 to-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">Metrics</label>
                  <textarea
                    rows={4}
                    value={metricsText}
                    onChange={(e) => updateDepartment(department.id, { metrics: e.target.value.split('\n').map((item) => item.trim()).filter(Boolean) })}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                    placeholder="One metric per line"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {department.metrics.map((metric) => (
                    <span key={metric} className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">
                      {metric}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => saveDepartment(department.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  <Save className="h-4 w-4" />
                  Save Section
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
