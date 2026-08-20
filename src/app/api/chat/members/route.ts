import { NextResponse } from 'next/server';
import { getChatUsers, updateChatUserStatus, saveStoredDB, getStoredDB } from '@/lib/serverStorage';

export async function GET() {
  try {
    const users = await getChatUsers();
    const safeUsers = users.map(({ password: _, ...rest }) => rest);
    return NextResponse.json({ members: safeUsers });
  } catch (error: any) {
    console.error('Chat members GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId, status } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (action === 'approve') {
      const updated = await updateChatUserStatus(userId, 'approved');
      const safeUsers = updated.map(({ password: _, ...rest }) => rest);
      return NextResponse.json({ success: true, members: safeUsers, message: 'Member approved successfully!' });
    }

    if (action === 'ban' || action === 'reject') {
      const updated = await updateChatUserStatus(userId, 'banned');
      const safeUsers = updated.map(({ password: _, ...rest }) => rest);
      return NextResponse.json({ success: true, members: safeUsers, message: 'Member updated.' });
    }

    if (action === 'delete') {
      const db = await getStoredDB();
      const currentUsers = db.chatUsers || [];
      const updated = currentUsers.filter(u => u.id !== userId);
      await saveStoredDB({ chatUsers: updated });
      const safeUsers = updated.map(({ password: _, ...rest }) => rest);
      return NextResponse.json({ success: true, members: safeUsers, message: 'Member deleted.' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Chat members POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update member' }, { status: 500 });
  }
}
