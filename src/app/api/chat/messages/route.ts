import { NextResponse } from 'next/server';
import {
  getChatMessages,
  getChatChannels,
  sendChatMessage,
  reactToChatMessage,
  deleteChatMessage,
} from '@/lib/serverStorage';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId') || undefined;

    const [messages, channels] = await Promise.all([
      getChatMessages(channelId),
      getChatChannels(),
    ]);

    return NextResponse.json({ messages, channels });
  } catch (error: any) {
    console.error('Chat messages GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, message, messageId, emoji, userId } = body;

    // ─── 1. Send Message ─────────────────────────────────────────────────────
    if (action === 'send' || (!action && message)) {
      const msgPayload = message || body;
      if (!msgPayload.content && (!msgPayload.attachments || msgPayload.attachments.length === 0)) {
        return NextResponse.json({ error: 'Message content or attachment required' }, { status: 400 });
      }

      const newMsg = await sendChatMessage({
        channelId: msgPayload.channelId || 'general-lounge',
        senderId: msgPayload.senderId || 'anon',
        senderName: msgPayload.senderName || 'Farmer',
        senderRole: msgPayload.senderRole || 'farmer',
        senderAvatar: msgPayload.senderAvatar || '',
        senderCounty: msgPayload.senderCounty || undefined,
        content: msgPayload.content || '',
        attachments: msgPayload.attachments || [],
        replyTo: msgPayload.replyTo || undefined,
        pinned: Boolean(msgPayload.pinned),
      });

      return NextResponse.json({ success: true, message: newMsg });
    }

    // ─── 2. Add Reaction ─────────────────────────────────────────────────────
    if (action === 'react') {
      if (!messageId || !emoji || !userId) {
        return NextResponse.json({ error: 'messageId, emoji, and userId required' }, { status: 400 });
      }
      const updatedMsg = await reactToChatMessage(messageId, emoji, userId);
      return NextResponse.json({ success: true, message: updatedMsg });
    }

    // ─── 3. Delete Message ───────────────────────────────────────────────────
    if (action === 'delete') {
      if (!messageId) {
        return NextResponse.json({ error: 'messageId required' }, { status: 400 });
      }
      await deleteChatMessage(messageId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Chat messages POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process message' }, { status: 500 });
  }
}
