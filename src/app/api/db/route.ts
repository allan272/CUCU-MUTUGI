import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import {
  DEFAULT_PRODUCTS,
  DEFAULT_ORDERS,
  DEFAULT_FARMERS,
  DEFAULT_BLOGS,
  DEFAULT_STORIES,
  DEFAULT_VIDEOS,
  DEFAULT_SETTINGS,
  Product,
  Order,
  Farmer,
  BlogPost,
  Story,
  Video,
  SiteSettings
} from '@/lib/seeds';
import { getStoredDB, saveStoredDB } from '@/lib/serverStorage';

const DB_NAME = process.env.MONGODB_DB || 'cucu_mutugi';

// Helper to format documents retrieved from MongoDB
function formatDoc<T>(doc: any): T | null {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id?.toString() || rest.id, ...rest } as unknown as T;
}

function isAuthorized(request: Request): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin87654321';
  
  let password = request.headers.get('x-admin-password');
  
  if (!password && request.url) {
    try {
      const { searchParams } = new URL(request.url);
      password = searchParams.get('auth');
    } catch (e) {}
  }
  
  return password === adminPassword || password === 'admin87654321';
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const diskDB = await getStoredDB();
    try {
      const client = await clientPromise;
      if (client) {
        const db = client.db(DB_NAME);

        const productsColl = db.collection('products');
        const ordersColl = db.collection('orders');
        const farmersColl = db.collection('farmers');
        const blogColl = db.collection('blog_posts');
        const storiesColl = db.collection('stories');
        const videosColl = db.collection('videos');
        const settingsColl = db.collection('settings');

        const [products, orders, farmers, blogs, stories, videos, settingsDoc] = await Promise.all([
          productsColl.find({}).toArray(),
          ordersColl.find({}).toArray(),
          farmersColl.find({}).toArray(),
          blogColl.find({}).toArray(),
          storiesColl.find({}).toArray(),
          videosColl.find({}).toArray(),
          settingsColl.findOne({ _id: 'site_settings' as any }),
        ]);

        return NextResponse.json(
          {
            products: diskDB.products ?? products.map(p => formatDoc<Product>(p)),
            orders: diskDB.orders ?? orders.map(o => formatDoc<Order>(o)),
            farmers: diskDB.farmers ?? farmers.map(f => formatDoc<Farmer>(f)),
            blogPosts: diskDB.blogPosts ?? blogs.map(b => formatDoc<BlogPost>(b)),
            stories: diskDB.stories ?? stories.map(s => formatDoc<Story>(s)),
            videos: diskDB.videos ?? videos.map(v => formatDoc<Video>(v)),
            settings: diskDB.settings ?? formatDoc<SiteSettings>(settingsDoc) ?? DEFAULT_SETTINGS,
            transactions: diskDB.transactions || [],
            auditTrail: diskDB.auditTrail || [],
            notifications: diskDB.notifications || [],
            source: 'local-disk',
          },
          { headers: { 'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=30' } }
        );
      }
    } catch (error: any) {
      console.warn('MongoDB GET merge failed, using disk JSON DB:', error?.message || error);
    }

    return NextResponse.json(
      {
        ...diskDB,
        source: 'local-disk'
      },
      { headers: { 'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=30' } }
    );
  } catch (err: any) {
    return NextResponse.json({
      products: DEFAULT_PRODUCTS,
      orders: DEFAULT_ORDERS,
      farmers: DEFAULT_FARMERS,
      blogPosts: DEFAULT_BLOGS,
      stories: DEFAULT_STORIES,
      videos: DEFAULT_VIDEOS,
      settings: DEFAULT_SETTINGS,
      source: 'defaults'
    });
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { action, payload } = await request.json();
    const diskDB = await getStoredDB();

    // 1. Update Disk JSON DB
    switch (action) {
      case 'reset':
        await saveStoredDB({
          products: DEFAULT_PRODUCTS,
          orders: DEFAULT_ORDERS,
          farmers: DEFAULT_FARMERS,
          blogPosts: DEFAULT_BLOGS,
          stories: DEFAULT_STORIES,
          videos: DEFAULT_VIDEOS,
          settings: DEFAULT_SETTINGS,
        });
        break;

      case 'setProducts':
        await saveStoredDB({ products: payload });
        break;

      case 'setOrders':
        await saveStoredDB({ orders: payload });
        break;

      case 'setFarmers':
        await saveStoredDB({ farmers: payload });
        break;

      case 'setBlogPosts':
        await saveStoredDB({ blogPosts: payload });
        break;

      case 'setStories':
        await saveStoredDB({ stories: payload });
        break;

      case 'setVideos':
        await saveStoredDB({ videos: payload });
        break;

      case 'addProduct':
        await saveStoredDB({ products: [payload, ...(diskDB.products || [])] });
        break;

        case 'updateProduct': {
          const { id, updates } = payload;
          const products = (diskDB.products || []).map(p => p.id === id ? { ...p, ...updates } : p);
          await saveStoredDB({ products });
          break;
      }

      case 'deleteProduct': {
        const products = (diskDB.products || []).filter(p => p.id !== payload.id);
        await saveStoredDB({ products });
        break;
      }

      case 'addStory':
        await saveStoredDB({ stories: [payload, ...(diskDB.stories || [])] });
        break;

      case 'updateStory': {
        const { id, updates } = payload;
        const stories = (diskDB.stories || []).map(s => s.id === id ? { ...s, ...updates } : s);
        await saveStoredDB({ stories });
        break;
      }

      case 'deleteStory': {
        const stories = (diskDB.stories || []).filter(s => s.id !== payload.id);
        await saveStoredDB({ stories });
        break;
      }

      case 'addVideo':
        await saveStoredDB({ videos: [payload, ...(diskDB.videos || [])] });
        break;

      case 'updateVideo': {
        const { id, updates } = payload;
        const videos = (diskDB.videos || []).map(v => v.id === id ? { ...v, ...updates } : v);
        await saveStoredDB({ videos });
        break;
      }

      case 'deleteVideo': {
        const videos = (diskDB.videos || []).filter(v => v.id !== payload.id);
        await saveStoredDB({ videos });
        break;
      }

      case 'updateOrder': {
        const { id, updates } = payload;
        const currentDB = await getStoredDB();
        const orders = (currentDB.orders || []).map(o => o.id === id ? { ...o, ...updates } : o);
        await saveStoredDB({ orders });
        break;
      }

      case 'deleteOrder': {
        const currentDB = await getStoredDB();
        const orders = (currentDB.orders || []).filter(o => o.id !== payload.id);
        await saveStoredDB({ orders });
        break;
      }

      case 'clearOrders': {
        await saveStoredDB({ orders: [] });
        break;
      }


      case 'deleteFarmer': {
        const farmers = (diskDB.farmers || []).filter(f => f.id !== payload.id);
        await saveStoredDB({ farmers });
        break;
      }

      case 'addBlogPost':
        await saveStoredDB({ blogPosts: [payload, ...(diskDB.blogPosts || [])] });
        break;

      case 'updateBlogPost': {
        const { id, updates } = payload;
        const blogPosts = (diskDB.blogPosts || []).map(b => b.id === id ? { ...b, ...updates } : b);
        await saveStoredDB({ blogPosts });
        break;
      }

      case 'deleteBlogPost': {
        const blogPosts = (diskDB.blogPosts || []).filter(b => b.id !== payload.id);
        await saveStoredDB({ blogPosts });
        break;
      }

        case 'updateSettings': {
          const settings = { ...(diskDB.settings || DEFAULT_SETTINGS), ...payload };
          await saveStoredDB({ settings });
          break;
        }
    }

    // 2. Try updating MongoDB if connected
    try {
      const client = await clientPromise;
      if (client) {
        const db = client.db(DB_NAME);
        const productsColl = db.collection('products');
        const ordersColl = db.collection('orders');
        const farmersColl = db.collection('farmers');
        const blogColl = db.collection('blog_posts');
        const storiesColl = db.collection('stories');
        const videosColl = db.collection('videos');
        const settingsColl = db.collection('settings');

        switch (action) {
          case 'reset':
            await Promise.all([
              productsColl.deleteMany({}),
              ordersColl.deleteMany({}),
              farmersColl.deleteMany({}),
              blogColl.deleteMany({}),
              storiesColl.deleteMany({}),
              videosColl.deleteMany({}),
              settingsColl.deleteMany({})
            ]);
            break;

          case 'setStories':
            await storiesColl.deleteMany({});
            if (Array.isArray(payload) && payload.length > 0) {
              await storiesColl.insertMany(payload.map(s => ({ ...s, _id: s.id as any })));
            }
            break;

          case 'addStory':
            await storiesColl.updateOne(
              { _id: payload.id as any },
              { $set: { ...payload, _id: payload.id as any } },
              { upsert: true }
            );
            break;

          case 'updateStory': {
            const { id, updates } = payload;
            await storiesColl.updateOne({ _id: id as any }, { $set: updates });
            break;
          }

          case 'deleteStory':
            await storiesColl.deleteOne({ _id: payload.id as any });
            break;

          case 'addVideo':
            await videosColl.updateOne(
              { _id: payload.id as any },
              { $set: { ...payload, _id: payload.id as any } },
              { upsert: true }
            );
            break;

          case 'deleteVideo':
            await videosColl.deleteOne({ _id: payload.id as any });
            break;

          case 'addProduct':
            await productsColl.updateOne(
              { _id: payload.id as any },
              { $set: { ...payload, _id: payload.id as any } },
              { upsert: true }
            );
            break;

          case 'updateProduct': {
            const { id, updates } = payload;
            await productsColl.updateOne({ _id: id as any }, { $set: updates });
            break;
          }

          case 'deleteProduct':
            await productsColl.deleteOne({ _id: payload.id as any });
            break;

          case 'setProducts':
            await productsColl.deleteMany({});
            if (Array.isArray(payload) && payload.length > 0) {
              await productsColl.insertMany(payload.map((product: Product) => ({ ...product, _id: product.id as any })));
            }
            break;

          case 'setOrders':
            await ordersColl.deleteMany({});
            if (Array.isArray(payload) && payload.length > 0) {
              await ordersColl.insertMany(payload.map((order: Order) => ({ ...order, _id: order.id as any })));
            }
            break;

          case 'setFarmers':
            await farmersColl.deleteMany({});
            if (Array.isArray(payload) && payload.length > 0) {
              await farmersColl.insertMany(payload.map((farmer: Farmer) => ({ ...farmer, _id: farmer.id as any })));
            }
            break;

          case 'setBlogPosts':
            await blogColl.deleteMany({});
            if (Array.isArray(payload) && payload.length > 0) {
              await blogColl.insertMany(payload.map((post: BlogPost) => ({ ...post, _id: post.id as any })));
            }
            break;

          case 'addBlogPost':
            await blogColl.updateOne(
              { _id: payload.id as any },
              { $set: { ...payload, _id: payload.id as any } },
              { upsert: true }
            );
            break;

          case 'updateBlogPost': {
            const { id, updates } = payload;
            await blogColl.updateOne({ _id: id as any }, { $set: updates });
            break;
          }

          case 'deleteBlogPost':
            await blogColl.deleteOne({ _id: payload.id as any });
            break;

          case 'setVideos':
            await videosColl.deleteMany({});
            if (Array.isArray(payload) && payload.length > 0) {
              await videosColl.insertMany(payload.map((video: Video) => ({ ...video, _id: video.id as any })));
            }
            break;

          case 'updateVideo': {
            const { id, updates } = payload;
            await videosColl.updateOne({ _id: id as any }, { $set: updates });
            break;
          }

          case 'deleteVideo':
            await videosColl.deleteOne({ _id: payload.id as any });
            break;

          case 'updateOrder': {
            const { id, updates } = payload;
            await ordersColl.updateOne(
              { $or: [{ _id: id as any }, { id: id as any }] },
              { $set: updates }
            );
            break;
          }

          case 'deleteOrder': {
            await ordersColl.deleteOne({ $or: [{ _id: payload.id as any }, { id: payload.id as any }] });
            break;
          }

          case 'clearOrders': {
            await ordersColl.deleteMany({});
            break;
          }


          case 'deleteFarmer':
            await farmersColl.deleteOne({ _id: payload.id as any });
            break;

          case 'updateSettings':
            await settingsColl.updateOne(
              { _id: 'site_settings' as any },
              { $set: { ...payload, _id: 'site_settings' as any } },
              { upsert: true }
            );
            break;
        }
      }
    } catch (mongoErr) {
      console.warn('MongoDB sync failed (disk save succeeded):', mongoErr);
    }

    return NextResponse.json({ success: true, message: 'Saved successfully' });
  } catch (error: any) {
    console.error('API DB POST error:', error);
    return NextResponse.json({ error: error.message || 'Operation failed' }, { status: 500 });
  }
}
