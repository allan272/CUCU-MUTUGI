import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import {
  DEFAULT_PRODUCTS,
  DEFAULT_ORDERS,
  DEFAULT_FARMERS,
  DEFAULT_BLOGS,
  DEFAULT_SETTINGS,
  Product,
  Order,
  Farmer,
  BlogPost,
  SiteSettings
} from '@/lib/seeds';

const DB_NAME = process.env.MONGODB_DB || 'cucu_mutugi';

// Helper to format documents retrieved from MongoDB
function formatDoc<T>(doc: any): T | null {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id?.toString() || rest.id, ...rest } as unknown as T;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const productsColl = db.collection('products');
    const ordersColl = db.collection('orders');
    const farmersColl = db.collection('farmers');
    const blogColl = db.collection('blog_posts');
    const settingsColl = db.collection('settings');

    // 1. Load products (and seed if empty)
    let products = await productsColl.find({}).toArray();
    if (products.length === 0) {
      const seedDocs = DEFAULT_PRODUCTS.map(p => ({ ...p, _id: p.id as any }));
      await productsColl.insertMany(seedDocs);
      products = await productsColl.find({}).toArray();
    }

    // 2. Load orders (and seed if empty)
    let orders = await ordersColl.find({}).toArray();
    if (orders.length === 0) {
      const seedDocs = DEFAULT_ORDERS.map(o => ({ ...o, _id: o.id as any }));
      await ordersColl.insertMany(seedDocs);
      orders = await ordersColl.find({}).toArray();
    }

    // 3. Load farmers (and seed if empty)
    let farmers = await farmersColl.find({}).toArray();
    if (farmers.length === 0) {
      const seedDocs = DEFAULT_FARMERS.map(f => ({ ...f, _id: f.id as any }));
      await farmersColl.insertMany(seedDocs);
      farmers = await farmersColl.find({}).toArray();
    }

    // 4. Load blog posts (and seed if empty)
    let blogs = await blogColl.find({}).toArray();
    if (blogs.length === 0) {
      const seedDocs = DEFAULT_BLOGS.map(b => ({ ...b, _id: b.id as any }));
      await blogColl.insertMany(seedDocs);
      blogs = await blogColl.find({}).toArray();
    }

    // 5. Load settings (and seed if empty)
    let settingsDoc = await settingsColl.findOne({ _id: 'site_settings' as any });
    if (!settingsDoc) {
      await settingsColl.insertOne({ ...DEFAULT_SETTINGS, _id: 'site_settings' as any });
      settingsDoc = await settingsColl.findOne({ _id: 'site_settings' as any });
    }

    return NextResponse.json({
      products: products.map(p => formatDoc<Product>(p)),
      orders: orders.map(o => formatDoc<Order>(o)),
      farmers: farmers.map(f => formatDoc<Farmer>(f)),
      blogPosts: blogs.map(b => formatDoc<BlogPost>(b)),
      settings: formatDoc<SiteSettings>(settingsDoc),
    });
  } catch (error: any) {
    console.error('MongoDB GET Error:', error);
    return NextResponse.json({
      error: 'Failed to retrieve database contents',
      message: error.message || String(error)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const { action, payload } = await request.json();

    const productsColl = db.collection('products');
    const ordersColl = db.collection('orders');
    const farmersColl = db.collection('farmers');
    const blogColl = db.collection('blog_posts');
    const settingsColl = db.collection('settings');

    switch (action) {
      case 'reset':
        // Delete all entries in all collections
        await Promise.all([
          productsColl.deleteMany({}),
          ordersColl.deleteMany({}),
          farmersColl.deleteMany({}),
          blogColl.deleteMany({}),
          settingsColl.deleteMany({})
        ]);
        
        // Seed database
        await Promise.all([
          productsColl.insertMany(DEFAULT_PRODUCTS.map(p => ({ ...p, _id: p.id as any }))),
          ordersColl.insertMany(DEFAULT_ORDERS.map(o => ({ ...o, _id: o.id as any }))),
          farmersColl.insertMany(DEFAULT_FARMERS.map(f => ({ ...f, _id: f.id as any }))),
          blogColl.insertMany(DEFAULT_BLOGS.map(b => ({ ...b, _id: b.id as any }))),
          settingsColl.insertOne({ ...DEFAULT_SETTINGS, _id: 'site_settings' as any })
        ]);
        break;

      case 'setProducts':
        await productsColl.deleteMany({});
        if (payload && payload.length > 0) {
          await productsColl.insertMany(payload.map((p: Product) => ({ ...p, _id: p.id as any })));
        }
        break;

      case 'setOrders':
        await ordersColl.deleteMany({});
        if (payload && payload.length > 0) {
          await ordersColl.insertMany(payload.map((o: Order) => ({ ...o, _id: o.id as any })));
        }
        break;

      case 'setFarmers':
        await farmersColl.deleteMany({});
        if (payload && payload.length > 0) {
          await farmersColl.insertMany(payload.map((f: Farmer) => ({ ...f, _id: f.id as any })));
        }
        break;

      case 'setBlogPosts':
        await blogColl.deleteMany({});
        if (payload && payload.length > 0) {
          await blogColl.insertMany(payload.map((b: BlogPost) => ({ ...b, _id: b.id as any })));
        }
        break;

      case 'addProduct':
        await productsColl.insertOne({ ...payload, _id: payload.id as any });
        break;

      case 'updateProduct': {
        const { id, updates } = payload;
        // Strip _id or id from updates if present to prevent MongoDB modification errors
        const { id: _ignoredId, _id: _ignoredMongoId, ...fieldsToUpdate } = updates;
        await productsColl.updateOne(
          { _id: id as any },
          { $set: fieldsToUpdate }
        );
        break;
      }

      case 'deleteProduct':
        await productsColl.deleteOne({ _id: payload.id as any });
        break;

      case 'updateOrder': {
        const { id, updates } = payload;
        const { id: _ignoredId, _id: _ignoredMongoId, ...fieldsToUpdate } = updates;
        await ordersColl.updateOne(
          { _id: id as any },
          { $set: fieldsToUpdate }
        );
        break;
      }

      case 'deleteFarmer':
        await farmersColl.deleteOne({ _id: payload.id as any });
        break;

      case 'addBlogPost':
        await blogColl.insertOne({ ...payload, _id: payload.id as any });
        break;

      case 'updateBlogPost': {
        const { id, updates } = payload;
        const { id: _ignoredId, _id: _ignoredMongoId, ...fieldsToUpdate } = updates;
        await blogColl.updateOne(
          { _id: id as any },
          { $set: fieldsToUpdate }
        );
        break;
      }

      case 'deleteBlogPost':
        await blogColl.deleteOne({ _id: payload.id as any });
        break;

      case 'updateSettings': {
        // Strip _id/id if passed
        const { id: _ignoredId, _id: _ignoredMongoId, ...settingsUpdates } = payload;
        
        // Use $set to allow merging partial settings
        const flattenedUpdates: Record<string, any> = {};
        for (const [key, value] of Object.entries(settingsUpdates)) {
          flattenedUpdates[key] = value;
        }
        
        await settingsColl.updateOne(
          { _id: 'site_settings' as any },
          { $set: flattenedUpdates },
          { upsert: true }
        );
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('MongoDB POST Error:', error);
    return NextResponse.json({
      error: 'Failed to perform database operation',
      message: error.message || String(error)
    }, { status: 500 });
  }
}
