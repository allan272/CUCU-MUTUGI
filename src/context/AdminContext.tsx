'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  Order,
  Farmer,
  BlogPost,
  Story,
  Video,
  SiteSettings,
  DBTable,
  DEFAULT_PRODUCTS,
  DEFAULT_ORDERS,
  DEFAULT_FARMERS,
  DEFAULT_BLOGS,
  DEFAULT_STORIES,
  DEFAULT_VIDEOS,
  DEFAULT_SETTINGS
} from '@/lib/seeds';

// Re-export the types so components importing from AdminContext don't break
export type { Product, Order, Farmer, BlogPost, Story, Video, SiteSettings, DBTable };

// ─── Loader ───────────────────────────────────────────────────────────────────
async function loadDB(password: string): Promise<{ data: DBTable; source: 'mongodb' | 'local' }> {
  if (typeof window === 'undefined') {
    return {
      data: {
        products: DEFAULT_PRODUCTS,
        orders: DEFAULT_ORDERS,
        farmers: DEFAULT_FARMERS,
        blogPosts: DEFAULT_BLOGS,
        stories: DEFAULT_STORIES,
        videos: DEFAULT_VIDEOS,
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
        },
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          return {
            data: {
              products: data.products || DEFAULT_PRODUCTS,
              orders: data.orders || DEFAULT_ORDERS,
              farmers: data.farmers || DEFAULT_FARMERS,
              blogPosts: data.blogPosts || DEFAULT_BLOGS,
              stories: data.stories || DEFAULT_STORIES,
              videos: data.videos || DEFAULT_VIDEOS,
              settings: data.settings || DEFAULT_SETTINGS
            },
            source: 'mongodb'
          };
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
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        data: {
          products: parsed.products || DEFAULT_PRODUCTS,
          orders: parsed.orders || DEFAULT_ORDERS,
          farmers: parsed.farmers || DEFAULT_FARMERS,
          blogPosts: parsed.blogPosts || DEFAULT_BLOGS,
          stories: parsed.stories || DEFAULT_STORIES,
          videos: parsed.videos || DEFAULT_VIDEOS,
          settings: parsed.settings || DEFAULT_SETTINGS
        },
        source: 'local'
      };
    }
  } catch (error) {
    console.error('Local storage load failed:', error);
  }

  return {
    data: {
      products: DEFAULT_PRODUCTS,
      orders: DEFAULT_ORDERS,
      farmers: DEFAULT_FARMERS,
      blogPosts: DEFAULT_BLOGS,
      stories: DEFAULT_STORIES,
      videos: DEFAULT_VIDEOS,
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
  adminLoaded: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  authError: string | null;
  setProducts: (p: Product[]) => void;
  setOrders: (o: Order[]) => void;
  setFarmers: (f: Farmer[]) => void;
  setBlogPosts: (b: BlogPost[]) => void;
  setStories: (s: Story[]) => void;
  setVideos: (v: Video[]) => void;
  updateSettings: (s: Partial<SiteSettings>) => void;
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrder: (id: string, o: Partial<Order>) => void;
  deleteFarmer: (id: string) => void;
  addBlogPost: (b: Omit<BlogPost, 'id' | 'createdAt'>) => void;
  updateBlogPost: (id: string, b: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  addStory: (s: Omit<Story, 'id' | 'createdAt' | 'likes' | 'views'>) => void;
  updateStory: (id: string, s: Partial<Story>) => void;
  deleteStory: (id: string) => void;
  likeStory: (id: string) => void;
  voteStoryPoll: (id: string, optionIndex: number) => void;
  addVideo: (v: Omit<Video, 'id' | 'createdAt' | 'likes' | 'views'>) => void;
  updateVideo: (id: string, v: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  likeVideo: (id: string) => void;
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
    stories: DEFAULT_STORIES,
    videos: DEFAULT_VIDEOS,
    settings: DEFAULT_SETTINGS
  });
  const [dbSource, setDBSource] = useState<'mongodb' | 'local'>('local');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loaded, setLoaded] = useState(true); // Start as true — login form shows instantly

  useEffect(() => {
    async function initialize() {
      if (typeof window !== 'undefined') {
        const savedPwd = sessionStorage.getItem('cucu_mutugi_admin_pwd') || '';
        if (savedPwd) {
          try {
            const res = await fetch('/api/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: savedPwd }),
              signal: AbortSignal.timeout(3000),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.success) {
                setAdminPassword(savedPwd);
                setIsAuthenticated(true);
                loadDB(savedPwd).then(result => {
                  setDB(result.data);
                  setDBSource(result.source);
                });
                return;
              }
            }
            // If auth failed, clear stale password
            sessionStorage.removeItem('cucu_mutugi_admin_pwd');
          } catch {
            sessionStorage.removeItem('cucu_mutugi_admin_pwd');
          }
        }
      }
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

  const persistLocal = useCallback((newDB: DBTable) => {
    setDB(newDB);
    try {
      localStorage.setItem('cucu_mutugi_db', JSON.stringify(newDB));
    } catch (error) {
      console.error('Local storage save failed:', error);
    }
  }, []);

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

  const setStories = (stories: Story[]) => {
    persistLocal({ ...db, stories });
    syncToMongoDB('setStories', stories);
  };

  const setVideos = (videos: Video[]) => {
    persistLocal({ ...db, videos });
    syncToMongoDB('setVideos', videos);
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

  const addStory = (s: Omit<Story, 'id' | 'createdAt' | 'likes' | 'views'>) => {
    const now = new Date();
    const newS: Story = {
      ...s,
      id: `s${Date.now()}`,
      likes: 0,
      views: 0,
      createdAt: now.toISOString(),
      expiresAt: s.expiresAt || new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    };
    persistLocal({ ...db, stories: [newS, ...db.stories] });
    syncToMongoDB('addStory', newS);
  };

  const updateStory = (id: string, s: Partial<Story>) => {
    persistLocal({
      ...db,
      stories: db.stories.map(x => (x.id === id ? { ...x, ...s } : x))
    });
    syncToMongoDB('updateStory', { id, updates: s });
  };

  const deleteStory = (id: string) => {
    persistLocal({
      ...db,
      stories: db.stories.filter(x => x.id !== id)
    });
    syncToMongoDB('deleteStory', { id });
  };

  const likeStory = (id: string) => {
    persistLocal({
      ...db,
      stories: db.stories.map(x => (x.id === id ? { ...x, likes: x.likes + 1 } : x))
    });
    fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like', storyId: id })
    }).catch(() => {});
  };

  const voteStoryPoll = (id: string, optionIndex: number) => {
    persistLocal({
      ...db,
      stories: db.stories.map(x => {
        if (x.id === id && x.poll && x.poll.options[optionIndex]) {
          const updatedOptions = [...x.poll.options];
          updatedOptions[optionIndex] = {
            ...updatedOptions[optionIndex],
            votes: updatedOptions[optionIndex].votes + 1
          };
          return {
            ...x,
            poll: {
              ...x.poll,
              options: updatedOptions,
              userVotedIndex: optionIndex
            }
          };
        }
        return x;
      })
    });
    fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'vote', storyId: id, optionIndex })
    }).catch(() => {});
  };

  const addVideo = (v: Omit<Video, 'id' | 'createdAt' | 'likes' | 'views'>) => {
    const newV: Video = {
      ...v,
      id: `v${Date.now()}`,
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    persistLocal({ ...db, videos: [newV, ...db.videos] });
    syncToMongoDB('addVideo', newV);
  };

  const updateVideo = (id: string, v: Partial<Video>) => {
    persistLocal({
      ...db,
      videos: db.videos.map(x => (x.id === id ? { ...x, ...v } : x))
    });
    syncToMongoDB('updateVideo', { id, updates: v });
  };

  const deleteVideo = (id: string) => {
    persistLocal({
      ...db,
      videos: db.videos.filter(x => x.id !== id)
    });
    syncToMongoDB('deleteVideo', { id });
  };

  const likeVideo = (id: string) => {
    persistLocal({
      ...db,
      videos: db.videos.map(x => (x.id === id ? { ...x, likes: x.likes + 1 } : x))
    });
    fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like', videoId: id })
    }).catch(() => {});
  };

  const resetDB = async () => {
    persistLocal({
      products: DEFAULT_PRODUCTS,
      orders: DEFAULT_ORDERS,
      farmers: DEFAULT_FARMERS,
      blogPosts: DEFAULT_BLOGS,
      stories: DEFAULT_STORIES,
      videos: DEFAULT_VIDEOS,
      settings: DEFAULT_SETTINGS
    });
    await syncToMongoDB('reset', null);
  };

  return (
    <AdminContext.Provider
      value={{
        db,
        dbSource,
        isAuthenticated,
        adminLoaded: loaded,
        login,
        logout,
        authError,
        setProducts,
        setOrders,
        setFarmers,
        setBlogPosts,
        setStories,
        setVideos,
        updateSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrder,
        deleteFarmer,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addStory,
        updateStory,
        deleteStory,
        likeStory,
        voteStoryPoll,
        addVideo,
        updateVideo,
        deleteVideo,
        likeVideo,
        resetDB,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

