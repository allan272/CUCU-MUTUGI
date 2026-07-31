import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { DEFAULT_STORIES, Story } from '@/lib/seeds';

const DB_NAME = process.env.MONGODB_DB || 'cucu_mutugi';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const storiesColl = db.collection('stories');

    let stories = await storiesColl.find({}).toArray();
    if (stories.length === 0) {
      const seedDocs = DEFAULT_STORIES.map(s => ({ ...s, _id: s.id as any }));
      await storiesColl.insertMany(seedDocs);
      stories = await storiesColl.find({}).toArray();
    }

    const formattedStories = stories.map(s => {
      const { _id, ...rest } = s;
      return { id: _id?.toString() || rest.id, ...rest };
    });

    return NextResponse.json({ stories: formattedStories });
  } catch (e: any) {
    console.error('Public stories fetch error:', e);
    return NextResponse.json({ stories: DEFAULT_STORIES });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, storyId, optionIndex } = body;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const storiesColl = db.collection('stories');

    if (action === 'view') {
      await storiesColl.updateOne({ _id: storyId as any }, { $inc: { views: 1 } });
      return NextResponse.json({ success: true });
    }

    if (action === 'like') {
      await storiesColl.updateOne({ _id: storyId as any }, { $inc: { likes: 1 } });
      return NextResponse.json({ success: true });
    }

    if (action === 'vote' && typeof optionIndex === 'number') {
      const story = await storiesColl.findOne({ _id: storyId as any });
      if (story && story.poll && story.poll.options && story.poll.options[optionIndex]) {
        story.poll.options[optionIndex].votes = (story.poll.options[optionIndex].votes || 0) + 1;
        await storiesColl.updateOne({ _id: storyId as any }, { $set: { poll: story.poll } });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Public stories action error:', error);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}
