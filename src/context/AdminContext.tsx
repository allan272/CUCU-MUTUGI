'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  Order,
  Farmer,
  BlogPost,
  SiteSettings,
  DBTable,
  DEFAULT_PRODUCTS,
  DEFAULT_ORDERS,
  DEFAULT_FARMERS,
  DEFAULT_BLOGS,
  DEFAULT_SETTINGS
} from '@/lib/seeds';

// Re-export the types so components importing from AdminContext don't break
export type { Product, Order, Farmer, BlogPost, SiteSettings, DBTable };

// ─── Loader ───────────────────────────────────────────────────────────────────
async function loadDB(password: string): Promise<{ data: DBTable; source: 'mongodb' | 'local' }> {
  if (typeof window === 'undefined') {
    return {
      data: {
        products: DEFAULT_PRODUCTS,
        orders: DEFAULT_ORDERS,
        farmers: DEFAULT_FARMERS,
        blogPosts: DEFAULT_BLOGS,
        settings: DEFAULT_SETTINGS
      },
      source: 'local'
    };
  }

  // Attempt to load from MongoDB Atlas backend API
  if (password) {
    try {
      const res = await fetch('/api/db', {
        headers: {
          'x-admin-password': password
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          return { data: data as DBTable, source: 'mongodb' };
        } else {
          console.warn('MongoDB API returned error or empty data. Using local storage fallback.');
        }
      } else {
        console.warn(`MongoDB API returned status ${res.status}. Using local storage fallback.`);
      }
    } catch (error) {
      console.error('Failed to connect to MongoDB API. Using local storage fallback:', error);
    }
  }

  // Fallback to Local Storage
  try {
    const raw = localStorage.getItem('cucu_mutugi_db');
    if (raw) return { data: JSON.parse(raw), source: 'local' };
  } catch (error) {
    console.error('Local storage load failed:', error);
  }

  return {
    data: {
      products: DEFAULT_PRODUCTS,
      orders: DEFAULT_ORDERS,
      farmers: DEFAULT_FARMERS,
      blogPosts: DEFAULT_BLOGS,
      settings: DEFAULT_SETTINGS
    },
    source: 'local'
  };
}

// ─── Context ─────────────────────────────────────────────────────────────────
interface AdminContextValue {
  db: DBTable;
  dbSource: 'mongodb' | 'local';
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  authError: string | null;
  setProducts: (p: Product[]) => void;
  setOrders: (o: Order[]) => void;
  setFarmers: (f: Farmer[]) => void;
  setBlogPosts: (b: BlogPost[]) => void;
  updateSettings: (s: Partial<SiteSettings>) => void;
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrder: (id: string, o: Partial<Order>) => void;
  deleteFarmer: (id: string) => void;
  addBlogPost: (b: Omit<BlogPost, 'id' | 'createdAt'>) => void;
  updateBlogPost: (id: string, b: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  resetDB: () => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [db, setDB] = useState<DBTable>({
    products: DEFAULT_PRODUCTS,
    orders: DEFAULT_ORDERS,
    farmers: DEFAULT_FARMERS,
    blogPosts: DEFAULT_BLOGS,
    settings: DEFAULT_SETTINGS
  });
  const [dbSource, setDBSource] = useState<'mongodb' | 'local'>('local');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (typeof window !== 'undefined') {
        const savedPwd = sessionStorage.getItem('cucu_mutugi_admin_pwd') || '';
        if (savedPwd) {
          try {
            // Fast auth check — this returns in ~37ms, no MongoDB wait
            const res = await fetch('/api/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: savedPwd }),
              signal: AbortSignal.timeout(4000),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.success) {
                setAdminPassword(savedPwd);
                setIsAuthenticated(true);
                setLoaded(true); // ← show dashboard immediately
                // Load MongoDB data in the background — don't block UI
                loadDB(savedPwd).then(result => {
                  setDB(result.data);
                  setDBSource(result.source);
                });
                return;
              }
            }
          } catch {
            // Timeout or network error — clear stale session
            sessionStorage.removeItem('cucu_mutugi_admin_pwd');
          }
        }
      }
      // No valid saved session — show login form immediately (no MongoDB needed)
      setIsAuthenticated(false);
      setLoaded(true);
    }
    initialize();
  }, []);


  const login = async (password: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          sessionStorage.setItem('cucu_mutugi_admin_pwd', password);
          setAdminPassword(password);
          setIsAuthenticated(true);
          const result = await loadDB(password);
          setDB(result.data);
          setDBSource(result.source);
          return true;
        }
      }
      setAuthError('Invalid admin password.');
      return false;
    } catch (e) {
      setAuthError('Authentication error occurred.');
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('cucu_mutugi_admin_pwd');
    setAdminPassword('');
    setIsAuthenticated(false);
    setDBSource('local');
  };

  // Update client state and localStorage copy
  const persistLocal = useCallback((newDB: DBTable) => {
    setDB(newDB);
    try {
      localStorage.setItem('cucu_mutugi_db', JSON.stringify(newDB));
    } catch (error) {
      console.error('Local storage save failed:', error);
    }
  }, []);

  // Send update to MongoDB API route
  const syncToMongoDB = async (action: string, payload: any) => {
    if (!adminPassword) return;
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminPassword
        },
        body: JSON.stringify({ action, payload }),
      });
      if (!res.ok) {
        console.error(`Failed to sync action "${action}" to MongoDB: ${res.statusText}`);
      }
    } catch (error) {
      console.error(`Sync error for action "${action}":`, error);
    }
  };

  const setProducts = (products: Product[]) => {
    persistLocal({ ...db, products });
    syncToMongoDB('setProducts', products);
  };

  const setOrders = (orders: Order[]) => {
    persistLocal({ ...db, orders });
    syncToMongoDB('setOrders', orders);
  };

  const setFarmers = (farmers: Farmer[]) => {
    persistLocal({ ...db, farmers });
    syncToMongoDB('setFarmers', farmers);
  };

  const setBlogPosts = (blogPosts: BlogPost[]) => {
    persistLocal({ ...db, blogPosts });
    syncToMongoDB('setBlogPosts', blogPosts);
  };

  const updateSettings = (s: Partial<SiteSettings>) => {
    const updatedSettings = { ...db.settings, ...s };
    persistLocal({ ...db, settings: updatedSettings });
    syncToMongoDB('updateSettings', s);
  };

  const addProduct = (p: Omit<Product, 'id' | 'createdAt'>) => {
    const newP: Product = {
      ...p,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    persistLocal({ ...db, products: [...db.products, newP] });
    syncToMongoDB('addProduct', newP);
  };

  const updateProduct = (id: string, p: Partial<Product>) => {
    persistLocal({
      ...db,
      products: db.products.map(x => (x.id === id ? { ...x, ...p } : x))
    });
    syncToMongoDB('updateProduct', { id, updates: p });
  };

  const deleteProduct = (id: string) => {
    persistLocal({
      ...db,
      products: db.products.filter(x => x.id !== id)
    });
    syncToMongoDB('deleteProduct', { id });
  };

  const updateOrder = (id: string, o: Partial<Order>) => {
    persistLocal({
      ...db,
      orders: db.orders.map(x => (x.id === id ? { ...x, ...o } : x))
    });
    syncToMongoDB('updateOrder', { id, updates: o });
  };

  const deleteFarmer = (id: string) => {
    persistLocal({
      ...db,
      farmers: db.farmers.filter(x => x.id !== id)
    });
    syncToMongoDB('deleteFarmer', { id });
  };

  const addBlogPost = (b: Omit<BlogPost, 'id' | 'createdAt'>) => {
    const newB: BlogPost = {
      ...b,
      id: `b${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    persistLocal({ ...db, blogPosts: [...db.blogPosts, newB] });
    syncToMongoDB('addBlogPost', newB);
  };

  const updateBlogPost = (id: string, b: Partial<BlogPost>) => {
    persistLocal({
      ...db,
      blogPosts: db.blogPosts.map(x => (x.id === id ? { ...x, ...b } : x))
    });
    syncToMongoDB('updateBlogPost', { id, updates: b });
  };

  const deleteBlogPost = (id: string) => {
    persistLocal({
      ...db,
      blogPosts: db.blogPosts.filter(x => x.id !== id)
    });
    syncToMongoDB('deleteBlogPost', { id });
  };

  const resetDB = async () => {
    // Optimistic update of local UI first
    persistLocal({
      products: DEFAULT_PRODUCTS,
      orders: DEFAULT_ORDERS,
      farmers: DEFAULT_FARMERS,
      blogPosts: DEFAULT_BLOGS,
      settings: DEFAULT_SETTINGS
    });
    
    // Sync reset to MongoDB
    await syncToMongoDB('reset', null);
  };

  if (!loaded) return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: 'linear-gradient(135deg, #0A192F 0%, #172A45 50%, #1A365D 100%)' }}
    >
      <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      <p className="text-cyan-300 text-sm font-semibold tracking-widest uppercase">Loading Admin Panel…</p>
    </div>
  );


  return (
    <AdminContext.Provider
      value={{
        db,
        dbSource,
        isAuthenticated,
        login,
        logout,
        authError,
        setProducts,
        setOrders,
        setFarmers,
        setBlogPosts,
        updateSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrder,
        deleteFarmer,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        resetDB,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
