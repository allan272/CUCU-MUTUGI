import { NextResponse } from 'next/server';
import { addNotification, getNotifications, markNotificationRead } from '@/lib/serverStorage';
import type { AppNotification } from '@/lib/seeds';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') as 'admin' | 'customer' | null;
    const notifications = await getNotifications(scope || undefined);
    return NextResponse.json({ notifications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, id, notification } = body;

    if (action === 'read' && id) {
      const notifications = await markNotificationRead(id);
      return NextResponse.json({ success: true, notifications });
    }

    const payload: Omit<AppNotification, 'id' | 'createdAt'> | null =
      notification || (body.title && body.body ? {
        title: String(body.title),
        body: String(body.body),
        type: (body.type || 'system') as AppNotification['type'],
        scope: (body.scope || 'customer') as AppNotification['scope'],
        url: body.url ? String(body.url) : undefined,
        read: false,
      } : null);

    if (!payload) {
      return NextResponse.json({ error: 'Invalid notification payload' }, { status: 400 });
    }

    const notifications = await addNotification(payload);
    return NextResponse.json({ success: true, notifications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save notification' }, { status: 500 });
  }
}
