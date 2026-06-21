'use client';
import React, { useState } from 'react';
import { Order, useAdmin } from '@/context/AdminContext';
import {
  Egg,
  Package,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  RotateCcw,
  Database,
  FileCode,
  Plus,
  Save,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Upload,
  Check,
  Camera,
  Layout,
  Phone,
  Palette,
  Wrench,
  AlertTriangle
} from 'lucide-react';

// Image compression helper to support large uploads and restrict size stored in DB
const compressImage = (base64Str: string, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:image/')) {
      resolve(base64Str);
      return;
    }
    if (base64Str.startsWith('data:image/svg+xml')) {
      resolve(base64Str);
      return;
    }
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// TAB: Dashboard
// ─────────────────────────────────────────────────────────────────────────────
function DashboardTab() {
  const { db } = useAdmin();
  const totalRevenue = db.orders.reduce((s, o) => s + o.totalKES, 0);
  const delivered = db.orders.filter(o => o.status === 'Delivered').length;
  const pending = db.orders.filter(o => o.status === 'Pending').length;

  const stats = [
    { label: 'Total Products', value: db.products.length, icon: Egg, color: 'from-blue-500 to-cyan-400' },
    { label: 'Total Orders', value: db.orders.length, icon: Package, color: 'from-cyan-500 to-teal-400' },
    { label: 'Registered Farmers', value: db.farmers.length, icon: Users, color: 'from-teal-500 to-blue-500' },
    { label: 'Revenue (KES)', value: `${(totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'from-blue-600 to-indigo-500' },
    { label: 'Delivered Orders', value: delivered, icon: CheckCircle2, color: 'from-green-500 to-teal-500' },
    { label: 'Pending Orders', value: pending, icon: Clock, color: 'from-yellow-500 to-orange-400' },
    { label: 'Blog Posts', value: db.blogPosts.length, icon: FileText, color: 'from-purple-500 to-blue-500' },
    { label: 'Published Posts', value: db.blogPosts.filter(b => b.published).length, icon: Globe, color: 'from-indigo-500 to-cyan-500' },
  ];

  const recentOrders = [...db.orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const statusColor: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-700',
    'In Transit': 'bg-blue-100 text-blue-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-cyan-100 text-cyan-700',
    Cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-primary mb-1">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm">Live snapshot of your business</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {stats.map(s => (
          <div key={s.label} className="glass-white rounded-2xl p-5 card-hover border border-blue-100">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3`}>{React.createElement(s.icon, { className: "h-5 w-5" })}</div>
            <div className="text-2xl font-extrabold text-primary">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-white rounded-2xl p-6 border border-blue-100">
        <h3 className="text-lg font-bold text-primary mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-blue-100">
              {['ID', 'Farmer', 'County', 'Breed', 'Qty', 'KES', 'Status', 'Date'].map(h => (
                <th key={h} className="text-left py-2 px-3 text-gray-400 text-xs uppercase font-semibold">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} className="border-b border-blue-50 hover:bg-blue-50 transition-colors">
                  <td className="py-2 px-3 font-bold text-primary text-xs">{o.id}</td>
                  <td className="py-2 px-3 font-medium">{o.farmer}</td>
                  <td className="py-2 px-3 text-gray-500">{o.county}</td>
                  <td className="py-2 px-3">{o.breed}</td>
                  <td className="py-2 px-3 font-semibold">{o.qty}</td>
                  <td className="py-2 px-3 font-semibold text-green-700">{o.totalKES.toLocaleString()}</td>
                  <td className="py-2 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[o.status]}`}>{o.status}</span></td>
                  <td className="py-2 px-3 text-gray-400 text-xs">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: Database Viewer
// ─────────────────────────────────────────────────────────────────────────────
function DatabaseTab() {
  const { db } = useAdmin();
  const [selectedTable, setSelectedTable] = useState('products');

  const tables: Record<string, { columns: string[]; rows: Record<string, unknown>[] }> = {
    products: {
      columns: ['id', 'name', 'category', 'breed', 'price', 'stock', 'vaccinated', 'active', 'createdAt'],
      rows: db.products as unknown as Record<string, unknown>[],
    },
    orders: {
      columns: ['id', 'farmer', 'phone', 'county', 'breed', 'qty', 'totalKES', 'status', 'date'],
      rows: db.orders as unknown as Record<string, unknown>[],
    },
    farmers: {
      columns: ['id', 'name', 'phone', 'email', 'county', 'flocks', 'totalOrders', 'joinedAt'],
      rows: db.farmers as unknown as Record<string, unknown>[],
    },
    blog_posts: {
      columns: ['id', 'title', 'author', 'category', 'published', 'createdAt'],
      rows: db.blogPosts as unknown as Record<string, unknown>[],
    },
  };

  const tableNames = Object.keys(tables);
  const current = tables[selectedTable];
  const { resetDB } = useAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-primary">Database Viewer</h2>
          <p className="text-gray-500 text-sm">Inspect all data stored in your application</p>
        </div>
        <button onClick={resetDB} className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-3 py-2 rounded-lg font-semibold transition-colors">
          <RotateCcw className="h-3.5 w-3.5 inline mr-1" /> Reset to Defaults
        </button>
      </div>

      {/* Table Picker */}
      <div className="flex gap-3 flex-wrap">
        {tableNames.map(t => (
          <button key={t} onClick={() => setSelectedTable(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${selectedTable === t ? 'bg-primary text-white shadow-md' : 'bg-blue-50 text-primary hover:bg-blue-100'}`}><Database className="h-4 w-4" />
            {t}
          </button>
        ))}
      </div>

      {/* Table Info */}
      <div className="glass-white rounded-2xl border border-blue-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-blue-100 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, #1565C020, #00BCD410)' }}>
          <span className="text-primary font-bold font-mono text-sm">TABLE: {selectedTable}</span>
          <span className="ml-auto text-xs text-gray-400">{current.rows.length} rows · {current.columns.length} columns</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-blue-50">
                <th className="py-2 px-3 text-left text-gray-400 font-mono">#</th>
                {current.columns.map(col => (
                  <th key={col} className="py-2 px-3 text-left text-primary font-mono font-semibold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {current.rows.map((row, i) => (
                <tr key={i} className="border-t border-blue-50 hover:bg-blue-50/50 transition-colors">
                  <td className="py-2 px-3 text-gray-300 font-mono">{i + 1}</td>
                  {current.columns.map(col => {
                    const val = row[col];
                    const isBoolean = typeof val === 'boolean';
                    return (
                      <td key={col} className="py-2 px-3 font-mono max-w-[180px] truncate">
                        {isBoolean
                          ? <span className={`px-1.5 py-0.5 rounded text-xs ${val ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{val ? 'true' : 'false'}</span>
                          : <span className="text-gray-700">{String(val ?? '—')}</span>
                        }
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw JSON */}
      <details className="glass-white rounded-2xl border border-blue-100 overflow-hidden">
        <summary className="px-5 py-3 cursor-pointer text-sm font-semibold text-primary hover:bg-blue-50">
          <FileCode className="h-4 w-4 inline mr-1" /> View Raw JSON — {selectedTable}
        </summary>
        <pre className="p-5 text-xs text-gray-600 overflow-x-auto bg-gray-50 max-h-64 overflow-y-auto font-mono leading-relaxed">
          {JSON.stringify(current.rows, null, 2)}
        </pre>
      </details>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: Products
// ─────────────────────────────────────────────────────────────────────────────
function ProductsTab() {
  const { db, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Kienyeji', breed: '', price: '', stock: '', description: '', ageRange: '1 day old', vaccinated: true, active: true, image: '' });

  const handleSubmit = () => {
    if (!form.name || !form.price) return;
    if (editing) {
      updateProduct(editing, { ...form, price: Number(form.price), stock: Number(form.stock) });
      setEditing(null);
    } else {
      addProduct({ ...form, price: Number(form.price), stock: Number(form.stock) });
    }
    setForm({ name: '', category: 'Kienyeji', breed: '', price: '', stock: '', description: '', ageRange: '1 day old', vaccinated: true, active: true, image: '' });
    setShowForm(false);
  };

  const startEdit = (p: typeof db.products[0]) => {
    setForm({ name: p.name, category: p.category, breed: p.breed || '', price: String(p.price), stock: String(p.stock), description: p.description, ageRange: p.ageRange || '', vaccinated: p.vaccinated, active: p.active, image: p.image });
    setEditing(p.id);
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const rawBase64 = ev.target?.result as string;
      const compressed = await compressImage(rawBase64);
      setForm(f => ({ ...f, image: compressed }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-primary">Products Management</h2>
          <p className="text-gray-500 text-sm">{db.products.length} products in store</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn-primary !py-2 !px-5 !text-sm">
          <Plus className="h-4 w-4 inline mr-1" /> Add Product
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-white rounded-2xl p-6 border-2 border-aqua shadow-lg">
          <h3 className="text-lg font-bold text-primary mb-5">{editing ? 'Edit Product' : 'Add New Product'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Product Name *</label>
              <input className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Kuroiler Chicks" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Category</label>
              <select className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['Kienyeji', 'Broilers', 'Layers', 'Feed', 'Vaccines', 'Equipment'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Breed</label>
              <input className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" value={form.breed} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))} placeholder="e.g. Kuroiler" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Price (KES) *</label>
              <input type="number" className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="120" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Stock (units)</label>
              <input type="number" className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Age Range</label>
              <input className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" value={form.ageRange} onChange={e => setForm(f => ({ ...f, ageRange: e.target.value }))} placeholder="1 day – 1 month" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-gray-500 block mb-1">Description</label>
              <textarea className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Product Image</label>
              <input type="file" accept="image/*,image/heic,image/heif,image/jfif,image/webp,image/png,image/jpeg,image/svg+xml,.heic,.heif,.jfif,.svg,.png,.jpg,.jpeg,.webp,.gif" className="w-full text-sm" onChange={handleImageUpload} />
              {form.image && <img src={form.image} alt="preview" className="mt-2 h-16 w-16 object-cover rounded-lg border border-blue-100" />}
            </div>
            <div className="flex gap-4 items-center mt-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.vaccinated} onChange={e => setForm(f => ({ ...f, vaccinated: e.target.checked }))} className="accent-aqua" />
                Pre-Vaccinated
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="accent-aqua" />
                Active / Visible
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={handleSubmit} className="btn-primary !py-2 !px-6 !text-sm flex items-center gap-1.5">{editing ? <><Save className="h-4 w-4" /> Save Changes</> : <><Plus className="h-4 w-4" /> Add Product</>}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-5 py-2 rounded-full border border-blue-200 text-sm text-gray-600 hover:bg-blue-50">Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-white rounded-2xl border border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-blue-50 border-b border-blue-100">
              {['Name', 'Category', 'Breed', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs uppercase font-semibold text-gray-400">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {db.products.map(p => (
                <tr key={p.id} className="border-b border-blue-50 hover:bg-blue-50/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-800">{p.name}</td>
                  <td className="py-3 px-4 text-gray-500">{p.category}</td>
                  <td className="py-3 px-4 text-gray-500">{p.breed || '—'}</td>
                  <td className="py-3 px-4 font-bold text-primary">KES {p.price}</td>
                  <td className="py-3 px-4"><span className={`font-semibold ${p.stock < 100 ? 'text-red-500' : 'text-green-600'}`}>{p.stock}</span></td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button onClick={() => startEdit(p)} className="text-blue-500 hover:text-blue-700 text-xs font-semibold px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors flex items-center gap-1 inline-flex">Edit</button>
                    <button onClick={() => deleteProduct(p.id)} className="text-red-400 hover:text-red-600 text-xs font-semibold px-2 py-1.5 rounded bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center inline-flex" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: Orders
// ─────────────────────────────────────────────────────────────────────────────
function OrdersTab() {
  const { db, updateOrder } = useAdmin();
  const [filter, setFilter] = useState('All');
  const statuses = ['All', 'Pending', 'Confirmed', 'In Transit', 'Delivered', 'Cancelled'];
  const statusColor: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-700', 'In Transit': 'bg-blue-100 text-blue-700',
    Pending: 'bg-yellow-100 text-yellow-700', Confirmed: 'bg-cyan-100 text-cyan-700', Cancelled: 'bg-red-100 text-red-700',
  };
  const filtered = filter === 'All' ? db.orders : db.orders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-primary">Orders Management</h2>
        <p className="text-gray-500 text-sm">Manage and update all customer orders</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === s ? 'bg-primary text-white' : 'bg-blue-50 text-primary hover:bg-blue-100'}`}>
            {s} {s !== 'All' && <span className="ml-1">({db.orders.filter(o => o.status === s).length})</span>}
          </button>
        ))}
      </div>
      <div className="glass-white rounded-2xl border border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-blue-50 border-b border-blue-100">
              {['Order ID', 'Farmer', 'Phone', 'County', 'Breed', 'Qty', 'KES', 'Status', 'Date', 'Change Status'].map(h => (
                <th key={h} className="text-left py-3 px-3 text-xs uppercase font-semibold text-gray-400">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-blue-50 hover:bg-blue-50/50 transition-colors">
                  <td className="py-2 px-3 font-bold text-primary text-xs">{o.id}</td>
                  <td className="py-2 px-3 font-medium">{o.farmer}</td>
                  <td className="py-2 px-3 text-gray-500 text-xs">{o.phone}</td>
                  <td className="py-2 px-3">{o.county}</td>
                  <td className="py-2 px-3">{o.breed}</td>
                  <td className="py-2 px-3 font-semibold">{o.qty}</td>
                  <td className="py-2 px-3 font-semibold text-green-700 text-xs">{o.totalKES.toLocaleString()}</td>
                  <td className="py-2 px-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[o.status]}`}>{o.status}</span></td>
                  <td className="py-2 px-3 text-gray-400 text-xs">{o.date}</td>
                  <td className="py-2 px-3">
                    <select className="text-xs border border-blue-200 rounded px-2 py-1 focus:outline-none" value={o.status} onChange={e => updateOrder(o.id, { status: e.target.value as Order['status'] })}>
                      {['Pending', 'Confirmed', 'In Transit', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: Farmers
// ─────────────────────────────────────────────────────────────────────────────
function FarmersTab() {
  const { db, deleteFarmer } = useAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-primary">Farmers Database</h2>
        <p className="text-gray-500 text-sm">{db.farmers.length} registered farmers</p>
      </div>
      <div className="glass-white rounded-2xl border border-blue-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-blue-50 border-b border-blue-100">
              {['Name', 'Phone', 'County', 'Flocks', 'Orders', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs uppercase font-semibold text-gray-400">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {db.farmers.map(f => (
                <tr key={f.id} className="border-b border-blue-50 hover:bg-blue-50/50 transition-colors">
                  <td className="py-3 px-4 font-semibold">{f.name}</td>
                  <td className="py-3 px-4 text-gray-500">{f.phone}</td>
                  <td className="py-3 px-4">{f.county}</td>
                  <td className="py-3 px-4 font-bold text-primary">{f.flocks}</td>
                  <td className="py-3 px-4 font-bold text-cyan-600">{f.totalOrders}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{f.joinedAt}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => deleteFarmer(f.id)} className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1 inline-flex"><Trash2 className="h-3.5 w-3.5" /> Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: Media
// ─────────────────────────────────────────────────────────────────────────────
function MediaTab() {
  const { db, updateSettings } = useAdmin();
  const [uploads, setUploads] = useState<{ name: string; url: string; size: string }[]>([]);
  const [coverPreview, setCoverPreview] = useState(db.settings.heroCoverImage);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = async ev => {
        const rawBase64 = ev.target?.result as string;
        const compressed = await compressImage(rawBase64);
        setUploads(prev => [...prev, { name: file.name, url: compressed, size: `${(file.size / 1024).toFixed(1)} KB` }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const setCoverImage = (url: string) => {
    setCoverPreview(url);
    updateSettings({ heroCoverImage: url, logoUrl: url });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-primary">Media Library & Image Manager</h2>
        <p className="text-gray-500 text-sm">Upload images and set the site cover/logo</p>
      </div>

      {/* Cover Photo Manager */}
      <div className="glass-white rounded-2xl p-6 border-2 border-aqua">
        <h3 className="text-lg font-bold text-primary mb-4"><ImageIcon className="h-5 w-5 inline mr-1.5" /> Hero Cover / Logo Image</h3>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-aqua bg-blue-50 flex items-center justify-center overflow-hidden">
            <img src={coverPreview} alt="cover" className="w-full h-full object-contain p-2" />
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-sm text-gray-600">This image is shown as the hero/opener on the home page and in the Navbar logo.</p>
            <label className="btn-primary !py-2 !px-5 !text-sm cursor-pointer inline-block">
              <Upload className="h-4 w-4 inline mr-1.5" /> Upload New Cover Image
              <input type="file" accept="image/*,image/heic,image/heif,image/jfif,image/webp,image/png,image/jpeg,image/svg+xml,.heic,.heif,.jfif,.svg,.png,.jpg,.jpeg,.webp,.gif" className="hidden" onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async ev => {
                  const rawBase64 = ev.target?.result as string;
                  const compressed = await compressImage(rawBase64);
                  setCoverImage(compressed);
                };
                reader.readAsDataURL(file);
              }} />
            </label>
            <input className="block w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua"
              value={coverPreview} onChange={e => setCoverPreview(e.target.value)} placeholder="Or paste image URL" />
            <button onClick={() => updateSettings({ heroCoverImage: coverPreview, logoUrl: coverPreview })} className="text-sm bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-200 transition-colors">
              <Check className="h-4 w-4 inline mr-1.5" /> Apply to Website
            </button>
          </div>
        </div>
      </div>

      {/* Multi Upload */}
      <div className="glass-white rounded-2xl p-6 border border-blue-100">
        <h3 className="text-lg font-bold text-primary mb-4"><Upload className="h-5 w-5 inline mr-1.5" /> Upload Images</h3>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-2xl p-10 cursor-pointer hover:bg-blue-50 transition-colors">
          <Camera className="h-10 w-10 text-blue-400 mb-3" />
          <span className="text-sm text-gray-500">Click to upload or drag & drop images</span>
          <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB each</span>
          <input type="file" multiple accept="image/*,image/heic,image/heif,image/jfif,image/webp,image/png,image/jpeg,image/svg+xml,.heic,.heif,.jfif,.svg,.png,.jpg,.jpeg,.webp,.gif" className="hidden" onChange={handleUpload} />
        </label>
        {uploads.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploads.map((img, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border border-blue-100 shadow-sm">
                <img src={img.url} alt={img.name} className="w-full h-28 object-cover" />
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-700 truncate">{img.name}</p>
                  <p className="text-xs text-gray-400">{img.size}</p>
                </div>
                <button onClick={() => setCoverImage(img.url)} className="absolute top-1 right-1 bg-aqua text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Set Cover
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: Site Content
// ─────────────────────────────────────────────────────────────────────────────
function ContentTab() {
  const { db, updateSettings } = useAdmin();
  const [s, setS] = useState(db.settings);
  const save = () => updateSettings(s);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-primary">Site Content Manager</h2>
        <p className="text-gray-500 text-sm">Control all text, colors, and display options on the website</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hero Content */}
        <div className="glass-white rounded-2xl p-6 border border-blue-100">
          <h3 className="font-bold text-primary mb-4"><Layout className="h-5 w-5 inline mr-1.5" /> Hero Section</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Hero Title</label>
              <input className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" value={s.heroTitle} onChange={e => setS(p => ({ ...p, heroTitle: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Hero Subtitle</label>
              <input className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" value={s.heroSubtitle} onChange={e => setS(p => ({ ...p, heroSubtitle: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Footer Tagline</label>
              <input className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" value={s.footerTagline} onChange={e => setS(p => ({ ...p, footerTagline: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="glass-white rounded-2xl p-6 border border-blue-100">
          <h3 className="font-bold text-primary mb-4"><Phone className="h-5 w-5 inline mr-1.5" /> Contact Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">WhatsApp Number</label>
              <input className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" value={s.whatsappNumber} onChange={e => setS(p => ({ ...p, whatsappNumber: e.target.value }))} placeholder="254706972161" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Email</label>
              <input className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" value={s.email} onChange={e => setS(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Phone 1</label>
              <input className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" value={s.phone1} onChange={e => setS(p => ({ ...p, phone1: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Phone 2</label>
              <input className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" value={s.phone2} onChange={e => setS(p => ({ ...p, phone2: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Marketing Days</label>
              <input className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" value={s.marketingDays} onChange={e => setS(p => ({ ...p, marketingDays: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Theme Colors */}
        <div className="glass-white rounded-2xl p-6 border border-blue-100">
          <h3 className="font-bold text-primary mb-4"><Palette className="h-5 w-5 inline mr-1.5" /> Brand Colors</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={s.primaryColor} onChange={e => setS(p => ({ ...p, primaryColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-blue-200 cursor-pointer" />
                  <input className="border border-blue-200 rounded-lg px-2 py-1 text-sm w-28" value={s.primaryColor} onChange={e => setS(p => ({ ...p, primaryColor: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={s.accentColor} onChange={e => setS(p => ({ ...p, accentColor: e.target.value }))} className="w-10 h-10 rounded-lg border border-blue-200 cursor-pointer" />
                  <input className="border border-blue-200 rounded-lg px-2 py-1 text-sm w-28" value={s.accentColor} onChange={e => setS(p => ({ ...p, accentColor: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-blue-100" style={{ background: `linear-gradient(135deg, ${s.primaryColor}, ${s.accentColor})` }}>
              <p className="text-white text-sm font-semibold">Preview: CUCU MUTUGI POULTRY</p>
              <p className="text-white/70 text-xs">Your chosen color gradient</p>
            </div>
          </div>
        </div>

        {/* Display Toggles */}
        <div className="glass-white rounded-2xl p-6 border border-blue-100">
          <h3 className="font-bold text-primary mb-4"><Wrench className="h-5 w-5 inline mr-1.5" /> Display Settings</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">Show WhatsApp Floating Button</span>
              <button onClick={() => setS(p => ({ ...p, showWhatsappButton: !p.showWhatsappButton }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${s.showWhatsappButton ? 'bg-green-400' : 'bg-gray-300'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${s.showWhatsappButton ? 'left-7' : 'left-1'}`} />
              </button>
            </label>
          </div>
        </div>
      </div>

      <button onClick={save} className="btn-primary !py-3 !px-8 text-base">
        <Save className="h-5 w-5 inline mr-1.5" /> Save All Changes to Website
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: Blog
// ─────────────────────────────────────────────────────────────────────────────
function BlogTab() {
  const { db, addBlogPost, updateBlogPost, deleteBlogPost } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', content: '', author: 'Cucu Mutugi', published: false, category: 'Farming Guide' });

  const handleSubmit = () => {
    if (!form.title) return;
    addBlogPost(form);
    setForm({ title: '', slug: '', content: '', author: 'Cucu Mutugi', published: false, category: 'Farming Guide' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-primary">Blog Posts</h2>
          <p className="text-gray-500 text-sm">{db.blogPosts.length} posts · {db.blogPosts.filter(b => b.published).length} published</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary !py-2 !px-5 !text-sm"><Plus className="h-4 w-4 inline mr-1" /> New Post</button>
      </div>

      {showForm && (
        <div className="glass-white rounded-2xl p-6 border-2 border-aqua">
          <h3 className="font-bold text-primary mb-4">Write a New Blog Post</h3>
          <div className="space-y-3">
            <input className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua" placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} />
            <input className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none focus:ring-2 focus:ring-aqua" placeholder="slug-auto-generated" value={form.slug} readOnly />
            <select className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {['Farming Guide', 'Breeds', 'Health & Disease', 'Business', 'Tips'].map(c => <option key={c}>{c}</option>)}
            </select>
            <textarea className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-aqua" placeholder="Write your blog post content here..." value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="accent-aqua" />
              Publish immediately
            </label>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="btn-primary !py-2 !px-5 !text-sm"><Upload className="h-4 w-4 inline mr-1" /> Publish Post</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-full border border-blue-200 text-sm text-gray-600 hover:bg-blue-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {db.blogPosts.map(b => (
          <div key={b.id} className="glass-white rounded-xl p-5 border border-blue-100 flex items-center gap-4 card-hover">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-blue-100 text-primary px-2 py-0.5 rounded-full font-semibold">{b.category}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${b.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {b.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <h4 className="font-bold text-gray-800">{b.title}</h4>
              <p className="text-xs text-gray-400 mt-1">by {b.author} · {b.createdAt}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => updateBlogPost(b.id, { published: !b.published })} className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-primary hover:bg-blue-100 font-semibold transition-colors">
                {b.published ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => deleteBlogPost(b.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-semibold transition-colors flex items-center justify-center inline-flex" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: Settings
// ─────────────────────────────────────────────────────────────────────────────
function SettingsTab() {
  const { resetDB } = useAdmin();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-primary">Settings</h2>
      <div className="glass-white rounded-2xl p-6 border border-red-100">
        <h3 className="font-bold text-red-500 mb-2"><AlertTriangle className="h-5 w-5 inline mr-1.5" /> Danger Zone</h3>
        <p className="text-sm text-gray-600 mb-4">This will reset all database entries to the default sample data. This action cannot be undone.</p>
        <button onClick={() => { if (confirm('Are you sure you want to reset all data to defaults?')) resetDB(); }} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors">
          <RotateCcw className="h-4 w-4 inline mr-1.5" /> Reset All Data to Defaults
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Tab Router
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminTabContent() {
  const { activeTab } = useAdmin();
  const tabMap: Record<string, React.ReactNode> = {
    dashboard: <DashboardTab />,
    database: <DatabaseTab />,
    products: <ProductsTab />,
    orders: <OrdersTab />,
    farmers: <FarmersTab />,
    media: <MediaTab />,
    content: <ContentTab />,
    blog: <BlogTab />,
    settings: <SettingsTab />,
  };
  return <>{tabMap[activeTab] || <DashboardTab />}</>;
}
