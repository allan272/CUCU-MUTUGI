'use client';
import React, { useState } from 'react';
import { Order, useAdmin } from '@/context/AdminContext';
import CommerceTab from './CommerceTab';
import CustomerActivityTab from './CustomerActivityTab';
import CommunityAdminTab from './CommunityAdminTab';
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
  AlertTriangle,
  Sparkles,
  Video as VideoIcon,
  Heart,
  Eye,
  Play
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

  const totalStoryViews = (db.stories || []).reduce((s, x) => s + (x.views || 0), 0);
  const totalStoryLikes = (db.stories || []).reduce((s, x) => s + (x.likes || 0), 0);
  const totalVideoViews = (db.videos || []).reduce((s, x) => s + (x.views || 0), 0);

  const stats = [
    { label: 'Total Products', value: db.products.length, icon: Egg, color: 'from-blue-500 to-cyan-400' },
    { label: 'Total Orders', value: db.orders.length, icon: Package, color: 'from-cyan-500 to-teal-400' },
    { label: 'Registered Farmers', value: db.farmers.length, icon: Users, color: 'from-teal-500 to-blue-500' },
    { label: 'Revenue (KES)', value: `${(totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'from-blue-600 to-indigo-500' },
    { label: 'Delivered Orders', value: delivered, icon: CheckCircle2, color: 'from-green-500 to-teal-500' },
    { label: 'Pending Orders', value: pending, icon: Clock, color: 'from-yellow-500 to-orange-400' },
    { label: 'Active Stories', value: (db.stories || []).length, icon: Sparkles, color: 'from-pink-500 to-purple-500' },
    { label: 'Story Views / Likes', value: `${totalStoryViews} / ${totalStoryLikes}`, icon: Eye, color: 'from-purple-500 to-indigo-500' },
    { label: 'Total Videos', value: (db.videos || []).length, icon: VideoIcon, color: 'from-cyan-600 to-blue-600' },
    { label: 'Video Views', value: totalVideoViews, icon: Play, color: 'from-blue-500 to-cyan-500' },
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
// TAB: Poultry Stories
// ─────────────────────────────────────────────────────────────────────────────
function StoriesTab() {
  const { db, addStory, updateStory, deleteStory } = useAdmin();
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('New Chicks');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [description, setDescription] = useState('');
  const [actionText, setActionText] = useState('Order Now');
  const [actionUrl, setActionUrl] = useState('/products');
  const [featured, setFeatured] = useState(true);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptionsStr, setPollOptionsStr] = useState('');
  const [uploading, setUploading] = useState(false);

  const stories = db.stories || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const adminPwd = sessionStorage.getItem('cucu_mutugi_admin_pwd') || '';
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-password': adminPwd },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setMediaUrl(data.url);
          if (file.type.includes('video')) setMediaType('video');
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalMediaUrl = mediaUrl.trim() || '/media/gallery/WhatsApp%20Image%202026-01-20%20at%208.38.20%20PM.jpeg';

    let pollObj = undefined;
    if (pollQuestion.trim() && pollOptionsStr.trim()) {
      const options = pollOptionsStr.split(',').map(s => ({ text: s.trim(), votes: 0 })).filter(o => o.text);
      if (options.length >= 2) {
        pollObj = { question: pollQuestion.trim(), options };
      }
    }

    addStory({
      title,
      category,
      mediaType,
      mediaUrl: finalMediaUrl,
      description: description.trim() || undefined,
      actionText: actionText.trim() || undefined,
      actionUrl: actionUrl.trim() || undefined,
      poll: pollObj,
      featured,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

    setTitle('');
    setMediaUrl('');
    setDescription('');
    setPollQuestion('');
    setPollOptionsStr('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4 bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-emerald-950 flex items-center gap-2">
            <Clock className="h-6 w-6 text-amber-500" /> 24-Hour Status Updates Management
          </h2>
          <p className="text-sm font-semibold text-emerald-800">
            Post WhatsApp / Instagram style 24-hour status updates visible on the public site's 24h Updates tab.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-700 hover:bg-emerald-800 text-amber-300 font-extrabold text-sm py-2.5 px-5 rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer border border-emerald-800"
        >
          <Plus className="h-4 w-4" /> {showAddForm ? 'Cancel' : 'Post 24h Status Update'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateStory} className="glass-white rounded-3xl p-6 border-2 border-amber-300 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-amber-200 pb-3">
            <h3 className="font-black text-lg text-emerald-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Create 24-Hour Status Update
            </h3>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Auto-Expires in 24 Hours
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Status Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. 🐣 5,000 ISA Brown Layer Chicks Ready!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              >
                {['New Chicks', 'Vaccination', 'Egg Collection', 'Farm Tour', 'New Feed', 'Delivery', 'Incubation'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Media Type</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as any)}
                className="w-full p-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              >
                <option value="image">Image Photo</option>
                <option value="video">Video Clip</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Upload Media File or Enter URL (Optional)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://... or upload image/video (optional)"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="flex-1 p-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <label className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs px-3.5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1">
                  <Upload className="w-4 h-4 text-emerald-700" />
                  <span>{uploading ? 'Uploading...' : 'Browse'}</span>
                  <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Description / Update Announcement</label>
            <textarea
              rows={2}
              placeholder="e.g. Fresh batch of vaccinated day-old chicks leaving Embu HQ for Nakuru & Eldoret tomorrow morning!"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Call to Action Button Text</label>
              <input
                type="text"
                placeholder="e.g. Order Chicks Now"
                value={actionText}
                onChange={(e) => setActionText(e.target.value)}
                className="w-full p-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Action Button Link</label>
              <input
                type="text"
                placeholder="e.g. /products or /contact"
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                className="w-full p-2.5 text-sm border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 space-y-3">
            <label className="block text-xs font-black text-emerald-900 uppercase tracking-wider">Optional Interactive Farmer Poll</label>
            <input
              type="text"
              placeholder="Poll Question e.g. What breed are you stocking this month?"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              className="w-full p-2.5 text-xs border rounded-xl bg-white font-medium"
            />
            <input
              type="text"
              placeholder="Options separated by commas e.g. ISA Brown Layers 🥚, Cobb 500 Broilers 🍗, Kuroiler 🐔"
              value={pollOptionsStr}
              onChange={(e) => setPollOptionsStr(e.target.value)}
              className="w-full p-2.5 text-xs border rounded-xl bg-white font-medium"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featuredStory"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
            />
            <label htmlFor="featuredStory" className="text-xs font-bold text-gray-700 cursor-pointer">
              Mark as Permanent Highlight (Keep visible beyond 24 hours)
            </label>
          </div>

          <button type="submit" className="btn-primary w-full text-sm font-black !py-3 flex items-center justify-center gap-2 cursor-pointer shadow-lg">
            <Save className="h-4 w-4 text-amber-300" /> Post 24-Hour Status Update
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stories.map(s => {
          const expiresDate = s.expiresAt ? new Date(s.expiresAt) : new Date(Date.now() + 24*60*60*1000);
          const isExpired = Date.now() > expiresDate.getTime() && !s.featured;
          const hoursLeft = Math.max(0, Math.round((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60)));

          return (
            <div key={s.id} className={`bg-white rounded-2xl overflow-hidden border-2 transition-all shadow-sm flex flex-col justify-between ${
              isExpired ? 'border-gray-200 opacity-60' : 'border-amber-300 hover:border-emerald-500'
            }`}>
              <div className="relative aspect-video bg-slate-950">
                {s.mediaType === 'video' ? (
                  <video src={s.mediaUrl} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={s.mediaUrl} alt={s.title} className="w-full h-full object-cover" />
                )}
                <span className="absolute top-2 left-2 bg-slate-950/80 text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  {s.category}
                </span>

                <span className={`absolute top-2 right-2 text-white text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md ${
                  s.featured ? 'bg-amber-500' : isExpired ? 'bg-rose-600' : 'bg-emerald-600'
                }`}>
                  <Clock className="w-3 h-3" />
                  {s.featured ? 'Permanent Highlight' : isExpired ? 'Expired' : `${hoursLeft}h Left`}
                </span>
              </div>

              <div className="p-4 flex-1 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-base leading-snug">{s.title}</h4>
                {s.description && <p className="text-xs text-slate-600 font-medium line-clamp-2">{s.description}</p>}
                
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-amber-100 font-bold">
                  <span className="flex items-center gap-1 text-emerald-700"><Eye className="w-3.5 h-3.5" /> {s.views} views</span>
                  <span className="flex items-center gap-1 text-rose-600"><Heart className="w-3.5 h-3.5" /> {s.likes} likes</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 border-t border-amber-200 flex justify-between items-center">
                <button
                  onClick={() => updateStory(s.id, { featured: !s.featured })}
                  className={`text-xs px-3 py-1.5 rounded-xl font-extrabold cursor-pointer transition-colors ${
                    s.featured ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {s.featured ? 'Highlight Active' : 'Make Permanent'}
                </button>
                <button
                  onClick={() => deleteStory(s.id)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 font-extrabold cursor-pointer transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB: Videos & Shorts
// ─────────────────────────────────────────────────────────────────────────────
function VideosTab() {
  const { db, addVideo, updateVideo, deleteVideo } = useAdmin();
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Farm Tours');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('03:30');
  const [featured, setFeatured] = useState(true);
  const [uploading, setUploading] = useState(false);

  const videos = db.videos || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'video' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const adminPwd = sessionStorage.getItem('cucu_mutugi_admin_pwd') || '';
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-password': adminPwd },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          if (field === 'video') setVideoUrl(data.url);
          else setThumbnailUrl(data.url);
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !videoUrl) return;

    addVideo({
      title,
      category,
      videoUrl,
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
      description,
      duration,
      featured,
    });

    setTitle('');
    setVideoUrl('');
    setThumbnailUrl('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-primary flex items-center gap-2">
            <VideoIcon className="h-6 w-6 text-cyan-600" /> Videos & Tutorials
          </h2>
          <p className="text-sm text-gray-500">Manage video guides, farm walkthroughs, and YouTube Shorts style media</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary text-sm !py-2.5 !px-4 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> {showAddForm ? 'Cancel' : 'Upload New Video'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateVideo} className="glass-white rounded-2xl p-6 border border-cyan-200 space-y-4 shadow-md">
          <h3 className="font-bold text-lg text-primary border-b border-blue-100 pb-2">Upload New Farm Video</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Video Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Modern Brooder Setup Guide for 500 Chicks"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-cyan focus:outline-none"
              >
                {['Farm Tours', 'Vaccination', 'Chicken Feeding', 'Incubation', 'Customer Visits', 'Construction', 'Success Stories', 'Equipment', 'Daily Activities'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Video File or URL *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="https://... or upload video file"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="flex-1 p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-cyan focus:outline-none"
                />
                <label className="bg-cyan-100 hover:bg-cyan-200 text-cyan-800 font-bold text-xs px-3 py-2.5 rounded-lg cursor-pointer flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Uploading...' : 'Browse'}</span>
                  <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Thumbnail Image File or URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://... or upload image"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="flex-1 p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-cyan focus:outline-none"
                />
                <label className="bg-cyan-100 hover:bg-cyan-200 text-cyan-800 font-bold text-xs px-3 py-2.5 rounded-lg cursor-pointer flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  <span>Browse</span>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'thumbnail')} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Video Duration</label>
              <input
                type="text"
                placeholder="e.g. 04:30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-cyan focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="featuredVideo"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-cyan-600 rounded cursor-pointer"
              />
              <label htmlFor="featuredVideo" className="text-xs font-bold text-gray-700 cursor-pointer">
                Mark as Featured Video
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Full description of the video content..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-cyan focus:outline-none"
            />
          </div>

          <button type="submit" className="btn-primary w-full text-sm font-bold !py-3 flex items-center justify-center gap-2 cursor-pointer">
            <Save className="h-4 w-4" /> Publish Video
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map(v => (
          <div key={v.id} className="glass-white rounded-xl overflow-hidden border border-blue-100 shadow-sm flex flex-col justify-between">
            <div className="relative aspect-video bg-slate-900">
              <img src={v.thumbnailUrl || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'} alt={v.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Play className="w-10 h-10 text-white/90 drop-shadow" />
              </div>
              <span className="absolute top-2 left-2 bg-black/70 text-cyan-300 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                {v.category}
              </span>
              {v.duration && (
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {v.duration}
                </span>
              )}
            </div>

            <div className="p-4 flex-1 space-y-2">
              <h4 className="font-bold text-gray-900 text-sm leading-snug">{v.title}</h4>
              <p className="text-xs text-gray-500 line-clamp-2">{v.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-blue-500" /> {v.views} views</span>
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" /> {v.likes} likes</span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <button
                onClick={() => updateVideo(v.id, { featured: !v.featured })}
                className={`text-xs px-2.5 py-1 rounded font-bold cursor-pointer ${
                  v.featured ? 'bg-cyan-100 text-cyan-800' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {v.featured ? 'Featured' : 'Make Featured'}
              </button>
              <button
                onClick={() => deleteVideo(v.id)}
                className="text-xs px-2.5 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 font-bold cursor-pointer"
              >
                Delete
              </button>
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
        <button onClick={() => { if (confirm('Are you sure you want to reset all data to defaults?')) resetDB(); }} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer">
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
    commerce: <CommerceTab />,
    community: <CommunityAdminTab />,
    activity: <CustomerActivityTab />,
    stories: <StoriesTab />,
    videos: <VideosTab />,
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
