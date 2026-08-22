import { NextResponse } from 'next/server';
import { broadcastAdminMessage } from '@/lib/outboundMessaging';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'new_order') {
      // Customer has placed an order inquiry
      const { customerName, phone, product, quantity, county, notes, totalKES } = data || {};
      const msg =
        `🛒 NEW CHICK ORDER ALERT!\n` +
        `Customer: ${customerName || 'Unknown'}\n` +
        `Product: ${product || 'N/A'}\n` +
        `Qty: ${quantity || '?'}\n` +
        `County: ${county || 'N/A'}\n` +
        `Contact: ${phone || 'N/A'}\n` +
        `${totalKES ? `Total: KES ${Number(totalKES).toLocaleString()}\n` : ''}` +
        `${notes ? `Notes: ${notes}\n` : ''}` +
        `Reply or call to confirm. — Cucu Mutugi App`;

      const result = await broadcastAdminMessage(msg);

      return NextResponse.json({
        success: result.sms.some((item) => item.success) || result.whatsapp.some((item) => item.success),
        message: 'Order alert broadcast queued.',
        results: result,
      });
    }

    if (type === 'whatsapp_inquiry') {
      // Generic WhatsApp / contact inquiry
      const { customerName, phone, message: inquiryMsg } = data || {};
      const msg =
        `📞 NEW INQUIRY!\n` +
        `From: ${customerName || 'Customer'} (${phone || 'N/A'})\n` +
        `"${inquiryMsg?.slice(0, 120) || 'No message'}"\n` +
        `— Cucu Mutugi App`;

      const result = await broadcastAdminMessage(msg);

      return NextResponse.json({
        success: result.sms.some((item) => item.success) || result.whatsapp.some((item) => item.success),
        results: result,
      });
    }

    if (type === 'test') {
      const result = await broadcastAdminMessage(`✅ Cucu Mutugi broadcast test OK — ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}`);

      return NextResponse.json({
        success: result.sms.some((item) => item.success) || result.whatsapp.some((item) => item.success),
        results: result,
      });
    }

    return NextResponse.json({ error: 'Unknown notification type.' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'SMS API error';
    console.error('[SMS API] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
