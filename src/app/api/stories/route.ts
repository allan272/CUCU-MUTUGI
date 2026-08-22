import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import {
  getStories,
  addOrUpdateStory,
  deleteStory as removeStoryFromDisk,
  likeStory,
  viewStory,
  voteStory,
  addNotification,
  addAuditEntry,
} from '@/lib/serverStorage';
import { Story } from '@/lib/seeds';

const DB_NAME = process.env.MONGODB_DB || 'cucu_mutugi';

export async function GET() {
  try {
    const client = await clientPromise;
    if (client) {
      const db = client.db(DB_NAME);
      const storiesColl = db.collection('stories');
      const stories = await storiesColl.find({}).toArray();
      if (stories && stories.length > 0) {
        const formatted = stories.map(s => {
          const { _id, ...rest } = s;
          return { id: _id?.toString() || rest.id, ...rest };
        });
        return NextResponse.json({ stories: formatted, mode: 'mongodb' });
      }
    }
  } catch (e: any) {
    console.warn('MongoDB GET stories failed, using disk fallback:', e?.message || e);
  }

  // Persistent disk storage fallback
  try {
    const stories = await getStories();
    return NextResponse.json({ stories, mode: 'local-disk' });
  } catch (err: any) {
    return NextResponse.json({ stories: [], error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, story, storyId, optionIndex } = body;

    // 1. Add / Create story
    if (action === 'add' || action === 'create') {
      const storyToSave: Story = story || body;
      if (!storyToSave.id) {
        storyToSave.id = `s${Date.now()}`;
      }
      if (!storyToSave.createdAt) {
        storyToSave.createdAt = new Date().toISOString();
      }
      if (!storyToSave.expiresAt) {
        storyToSave.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      }
      storyToSave.likes = storyToSave.likes || 0;
      storyToSave.views = storyToSave.views || 0;

      // Save to disk
      await addOrUpdateStory(storyToSave);
      await addNotification({
        title: storyToSave.title,
        body: storyToSave.description || 'A new farm update is now live.',
        type: 'story',
        url: '/poultry-updates',
      });
      await addAuditEntry({
        entity: 'story',
        action: 'publish',
        summary: `Published story "${storyToSave.title}"`,
        actor: 'Admin',
        metadata: { storyId: storyToSave.id, featured: storyToSave.featured, category: storyToSave.category },
      });

      // Save to MongoDB if available
      try {
        const client = await clientPromise;
        if (client) {
          const db = client.db(DB_NAME);
          await db.collection('stories').updateOne(
            { _id: storyToSave.id as any },
            { $set: { ...storyToSave, _id: storyToSave.id as any } },
            { upsert: true }
          );
        }
      } catch (mongoErr) {
        console.warn('MongoDB story save failed (saved to disk successfully):', mongoErr);
      }

      return NextResponse.json({ success: true, story: storyToSave });
    }

    // 2. Delete story
    if (action === 'delete') {
      const id = storyId || body.id;
      if (id) {
        await removeStoryFromDisk(id);
        await addAuditEntry({
          entity: 'story',
          action: 'delete',
          summary: `Deleted story ${id}`,
          actor: 'Admin',
          metadata: { storyId: id },
        });
        try {
          const client = await clientPromise;
          if (client) {
            const db = client.db(DB_NAME);
            await db.collection('stories').deleteOne({ _id: id as any });
          }
        } catch (mongoErr) {
          console.warn('MongoDB story delete failed:', mongoErr);
        }
      }
      return NextResponse.json({ success: true });
    }

    // 3. View story
    if (action === 'view') {
      const id = storyId || body.id;
      if (id) {
        await viewStory(id);
        try {
          const client = await clientPromise;
          if (client) {
            const db = client.db(DB_NAME);
            await db.collection('stories').updateOne({ _id: id as any }, { $inc: { views: 1 } });
          }
        } catch (e) {}
      }
      return NextResponse.json({ success: true });
    }

    // 4. Like story
    if (action === 'like') {
      const id = storyId || body.id;
      if (id) {
        await likeStory(id);
        try {
          const client = await clientPromise;
          if (client) {
            const db = client.db(DB_NAME);
            await db.collection('stories').updateOne({ _id: id as any }, { $inc: { likes: 1 } });
          }
        } catch (e) {}
      }
      return NextResponse.json({ success: true });
    }

    // 5. Vote poll
    if (action === 'vote' && typeof optionIndex === 'number') {
      const id = storyId || body.id;
      if (id) {
        await voteStory(id, optionIndex);
        try {
          const client = await clientPromise;
          if (client) {
            const db = client.db(DB_NAME);
            const s = await db.collection('stories').findOne({ _id: id as any });
            if (s && s.poll && s.poll.options && s.poll.options[optionIndex]) {
              s.poll.options[optionIndex].votes = (s.poll.options[optionIndex].votes || 0) + 1;
              await db.collection('stories').updateOne({ _id: id as any }, { $set: { poll: s.poll } });
            }
          }
        } catch (e) {}
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('API stories POST error:', error);
    return NextResponse.json({ error: error.message || 'Operation failed' }, { status: 500 });
  }
}
