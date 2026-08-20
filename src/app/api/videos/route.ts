import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { DEFAULT_VIDEOS } from '@/lib/seeds';

const DB_NAME = process.env.MONGODB_DB || 'cucu_mutugi';

export async function GET() {
  try {
    const client = await clientPromise;
    if (!client) {
      return NextResponse.json({ videos: DEFAULT_VIDEOS });
    }
    const db = client.db(DB_NAME);
    const videosColl = db.collection('videos');

    let videos = await videosColl.find({}).toArray();
    if (videos.length === 0) {
      const seedDocs = DEFAULT_VIDEOS.map(v => ({ ...v, _id: v.id as any }));
      await videosColl.insertMany(seedDocs);
      videos = await videosColl.find({}).toArray();
    }

    const formattedVideos = videos.map(v => {
      const { _id, ...rest } = v;
      return { id: _id?.toString() || rest.id, ...rest };
    });

    return NextResponse.json({ videos: formattedVideos });
  } catch (e: any) {
    return NextResponse.json({ videos: DEFAULT_VIDEOS });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, videoId } = body;

    const client = await clientPromise;
    if (!client) {
      return NextResponse.json({ success: true, mode: 'local' });
    }
    const db = client.db(DB_NAME);
    const videosColl = db.collection('videos');

    if (action === 'view') {
      await videosColl.updateOne({ _id: videoId as any }, { $inc: { views: 1 } });
      return NextResponse.json({ success: true });
    }

    if (action === 'like') {
      await videosColl.updateOne({ _id: videoId as any }, { $inc: { likes: 1 } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: true, mode: 'fallback' });
  }
}
