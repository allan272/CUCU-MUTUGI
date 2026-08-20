import { NextResponse } from 'next/server';
import { getActivities, logActivity, clearActivities } from '@/lib/serverStorage';

export async function GET() {
  try {
    const activities = await getActivities();
    return NextResponse.json({ activities });
  } catch (error: any) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch customer activities' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, type, query, buttonName, email, page, metadata } = body;

    if (action === 'clear') {
      await clearActivities();
      return NextResponse.json({ success: true, activities: [] });
    }

    if (!type && !query && !buttonName && !email) {
      return NextResponse.json({ error: 'Missing activity payload' }, { status: 400 });
    }

    const activityType = type || (query ? 'search' : email ? 'email_captured' : 'button_click');

    const newActivity = await logActivity({
      type: activityType,
      query: query || undefined,
      buttonName: buttonName || undefined,
      email: email || undefined,
      page: page || '/',
      metadata: metadata || undefined,
    });

    return NextResponse.json({ success: true, activity: newActivity });
  } catch (error: any) {
    console.error('Analytics POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to log customer activity' }, { status: 500 });
  }
}
