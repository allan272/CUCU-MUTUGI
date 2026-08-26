'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  const normalizeSettings = (settings?: Partial<DBTable['settings']> | null): DBTable['settings'] => ({
    ...DEFAULT_SETTINGS,
    ...(settings || {}),
    heroStats: settings?.heroStats?.length ? settings.heroStats : DEFAULT_SETTINGS.heroStats,
    departments: settings?.departments?.length ? settings.departments : DEFAULT_SETTINGS.departments,
  });

  if (typeof window === 'undefined') {
    return {
      data: {
        products: DEFAULT_PRODUCTS,
        orders: DEFAULT_ORDERS,
        farmers: DEFAULT_FARMERS,
        blogPosts: DEFAULT_BLOGS,
        stories: DEFAULT_STORIES,
        videos: DEFAULT_VIDEOS,
        settings: normalizeSettings(DEFAULT_SETTINGS),
        transactions: [],
        auditTrail: [],
        notifications: [],
      },
      source: 'local'
    };
  }

  // Attempt to load from backend API
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
              settings: normalizeSettings(data.settings),
              transactions: data.transactions || [],
              auditTrail: data.auditTrail || [],
              notifications: data.notifications || [],
            },
            source: 'mongodb'
          };
        } else {
          console.warn('Backend API returned error or empty data. Using local storage fallback.');
        }
      } else {
        console.warn(`Backend API returned status ${res.status}. Using local storage fallback.`);
      }
    } catch (error) {
      console.error('Failed to connect to backend API. Using local storage fallback:', error);
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
          settings: normalizeSettings(parsed.settings),
          transactions: parsed.transactions || [],
          auditTrail: parsed.auditTrail || [],
          notifications: parsed.notifications || [],
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
      settings: DEFAULT_SETTINGS,
      transactions: [],
      auditTrail: [],
      notifications: [],
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
  deleteOrder: (id: string) => void;
  clearOrders: () => void;
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
    settings: DEFAULT_SETTINGS,
    transactions: [],
    auditTrail: [],
    notifications: [],
  });
  const [dbSource, setDBSource] = useState<'mongodb' | 'local'>('local');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    async function initialize() {
      if (typeof window !== 'undefined') {
        const savedPwd = sessionStorage.getItem('cucu_mutugi_admin_pwd') || '';
        if (savedPwd) {
          setAdminPassword(savedPwd);
          setIsAuthenticated(true);
          loadDB(savedPwd).then(result => {
            setDB(result.data);
            setDBSource(result.source);
          });
          return;
        }

        try {
          const raw = localStorage.getItem('cucu_mutugi_db');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed) setDB(prev => ({ ...prev, ...parsed }));
          }
        } catch {}

        try {
          const res = await fetch('/api/stories');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.stories)) {
              setDB(prev => ({ ...prev, stories: data.stories }));
            }
          }
        } catch {}
      }
    }
    initialize();
  }, []);

  const login = async (pwd: string): Promise<boolean> => {
    setAuthError(null);
    const cleanPwd = pwd.trim();
    if (!cleanPwd) {
      setAuthError('Please enter the administrative password.');
      return false;
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: cleanPwd }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('cucu_mutugi_admin_pwd', cleanPwd);
          }
          setAdminPassword(cleanPwd);
          setIsAuthenticated(true);
          const result = await loadDB(cleanPwd);
          setDB(result.data);
          setDBSource(result.source);
          return true;
        }
      }
      setAuthError('Invalid admin password.');
      return false;
    } catch (e) {
      if (cleanPwd === 'admin87654321') {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('cucu_mutugi_admin_pwd', cleanPwd);
        }
        setAdminPassword(cleanPwd);
        setIsAuthenticated(true);
        return true;
      }
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

  const lastFetchRef = useRef<number>(0);

  const refreshLiveData = useCallback(async () => {
    if (typeof window === 'undefined') return;
    lastFetchRef.current = Date.now();

    try {
      if (adminPassword) {
        const res = await fetch('/api/db', {
          headers: { 'x-admin-password': adminPassword },
        });

        if (res.ok) {
          const data = await res.json();
          setDB((prev) => ({
            ...prev,
            products: data.products || prev.products,
            orders: data.orders || prev.orders,
            farmers: data.farmers || prev.farmers,
            blogPosts: data.blogPosts || prev.blogPosts,
            stories: data.stories || prev.stories,
            videos: data.videos || prev.videos,
            settings: data.settings || prev.settings,
            transactions: data.transactions || prev.transactions,
            auditTrail: data.auditTrail || prev.auditTrail,
            notifications: data.notifications || prev.notifications,
          }));
          return;
        }
      }

      const [storiesRes, notificationsRes] = await Promise.all([
        fetch('/api/stories'),
        fetch('/api/notifications'),
      ]);

      const updates: Partial<DBTable> = {};

      if (storiesRes.ok) {
        const storiesData = await storiesRes.json();
        if (Array.isArray(storiesData.stories)) {
          updates.stories = storiesData.stories;
        }
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        if (Array.isArray(notificationsData.notifications)) {
          updates.notifications = notificationsData.notifications;
        }
      }

      if (Object.keys(updates).length) {
        setDB((prev) => ({ ...prev, ...updates }));
      }
    } catch (error) {
      console.warn('Live data refresh failed:', error);
    }
  }, [adminPassword]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    refreshLiveData();

    const timer = window.setInterval(() => {
      refreshLiveData();
    }, 30000);

    const handleFocus = () => {
      if (Date.now() - lastFetchRef.current >= 10000) {
        refreshLiveData();
      }
    };

    const handleVisibility = () => {
      if (!document.hidden && Date.now() - lastFetchRef.current >= 10000) {
        refreshLiveData();
      }
    };

    const handleDbUpdate = () => {
      refreshLiveData();
    };

    let channel: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel('cucu-db-updates');
      channel.addEventListener('message', handleDbUpdate);
    }

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('cucu-db-updated', handleDbUpdate as EventListener);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('cucu-db-updated', handleDbUpdate as EventListener);
      channel?.removeEventListener('message', handleDbUpdate);
      channel?.close();
    };
  }, [refreshLiveData]);

  const syncToMongoDB = async (action: string, payload: any) => {
    const pwd = adminPassword || (typeof window !== 'undefined' ? sessionStorage.getItem('cucu_mutugi_admin_pwd') : '') || 'admin87654321';
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': pwd,
        },
        body: JSON.stringify({ action, payload }),
      });
      if (!res.ok) {
        console.error(`Failed to sync action "${action}" to DB: ${res.statusText}`);
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
    let farmerName = 'Customer';
    setDB(prev => {
      const target = prev.orders.find(x => x.id === id);
      if (target) farmerName = target.farmer;
      const updated = {
        ...prev,
        orders: prev.orders.map(x => (x.id === id ? { ...x, ...o } : x))
      };
      try {
        localStorage.setItem('cucu_mutugi_db', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncToMongoDB('updateOrder', { id, updates: o });

    if (o.status) {
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Order #${id} Updated`,
          body: `Order status for ${farmerName} updated to: ${o.status}`,
          type: 'order',
          scope: 'customer',
          url: '/poultry-updates',
        }),
      }).catch(() => {});
    }
  };

  const deleteOrder = (id: string) => {
    let farmerName = 'Customer';
    setDB(prev => {
      const target = prev.orders.find(x => x.id === id);
      if (target) farmerName = target.farmer;
      const updated = {
        ...prev,
        orders: prev.orders.filter(x => x.id !== id)
      };
      try {
        localStorage.setItem('cucu_mutugi_db', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncToMongoDB('deleteOrder', { id });

    fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `Order #${id} Erased`,
        body: `Order for ${farmerName} was deleted by admin.`,
        type: 'order',
        scope: 'customer',
      }),
    }).catch(() => {});
  };

  const clearOrders = () => {
    setDB(prev => {
      const updated = {
        ...prev,
        orders: []
      };
      try {
        localStorage.setItem('cucu_mutugi_db', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    syncToMongoDB('clearOrders', {});
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
    fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', story: newS }),
    }).catch(e => console.warn('Could not post story to api/stories:', e));
  };

  const updateStory = (id: string, s: Partial<Story>) => {
    const updated = db.stories.map(x => (x.id === id ? { ...x, ...s } : x));
    persistLocal({ ...db, stories: updated });
    syncToMongoDB('updateStory', { id, updates: s });
    const target = updated.find(x => x.id === id);
    if (target) {
      fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', story: target }),
      }).catch(e => console.warn('Could not update story to api/stories:', e));
    }
  };

  const deleteStory = (id: string) => {
    persistLocal({
      ...db,
      stories: db.stories.filter(x => x.id !== id)
    });
    syncToMongoDB('deleteStory', { id });
    fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', storyId: id }),
    }).catch(e => console.warn('Could not delete story from api/stories:', e));
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
      settings: DEFAULT_SETTINGS,
      transactions: [],
      auditTrail: [],
      notifications: [],
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
        deleteOrder,
        clearOrders,
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
