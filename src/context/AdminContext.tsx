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
async function loadDB(): Promise<DBTable> {
  if (typeof window === 'undefined') {
    return {
      products: DEFAULT_PRODUCTS,
      orders: DEFAULT_ORDERS,
      farmers: DEFAULT_FARMERS,
      blogPosts: DEFAULT_BLOGS,
      settings: DEFAULT_SETTINGS
    };
  }

  // Attempt to load from MongoDB Atlas backend API
  try {
    const res = await fetch('/api/db');
    if (res.ok) {
      const data = await res.json();
      if (data && !data.error) {
        return data as DBTable;
      } else {
        console.warn('MongoDB API returned error or empty data. Using local storage fallback.');
      }
    } else {
      console.warn(`MongoDB API returned status ${res.status}. Using local storage fallback.`);
    }
  } catch (error) {
    console.error('Failed to connect to MongoDB API. Using local storage fallback:', error);
  }

  // Fallback to Local Storage
  try {
    const raw = localStorage.getItem('cucu_mutugi_db');
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.error('Local storage load failed:', error);
  }

  return {
    products: DEFAULT_PRODUCTS,
    orders: DEFAULT_ORDERS,
    farmers: DEFAULT_FARMERS,
    blogPosts: DEFAULT_BLOGS,
    settings: DEFAULT_SETTINGS
  };
}

// ─── Context ─────────────────────────────────────────────────────────────────
interface AdminContextValue {
  db: DBTable;
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function initialize() {
      const initialDB = await loadDB();
      setDB(initialDB);
      setLoaded(true);
    }
    initialize();
  }, []);

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
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

  if (!loaded) return null;

  return (
    <AdminContext.Provider
      value={{
        db,
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
