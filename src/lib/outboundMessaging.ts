import { normalizePhoneNumber, sendBrevoSms } from './brevoSms';

export type OutboundChannelResult = {
  success: boolean;
  channel: 'sms' | 'whatsapp';
  recipient: string;
  error?: string;
  errorType?: string;
  statusCode?: number;
  messageId?: string | number;
};

export type BroadcastResult = {
  sms: OutboundChannelResult[];
  whatsapp: OutboundChannelResult[];
};

const DEFAULT_ADMIN_RECIPIENTS = [
  '+254706972161',
  '+254719303786',
];

function uniquePhones(phones: string[]): string[] {
  const seen = new Set<string>();
  return phones
    .map((phone) => normalizePhoneNumber(phone))
    .filter((phone) => {
      if (!phone || seen.has(phone)) return false;
      seen.add(phone);
      return true;
    });
}

export function getAdminRecipients(): string[] {
  const envNumbers = [
    process.env.ADMIN_SMS_NUMBER,
    process.env.SECONDARY_ADMIN_SMS_NUMBER,
    process.env.ADMIN_PHONE_NUMBER,
    process.env.ADMIN_PHONE_NUMBERS,
    process.env.ADMIN_REPORT_RECIPIENTS,
  ];

  const configured = envNumbers
    .filter(Boolean)
    .flatMap((val) => (val ? val.split(',') : []))
    .map((phone) => phone.trim())
    .filter(Boolean);

  return uniquePhones(configured.length > 0 ? configured : DEFAULT_ADMIN_RECIPIENTS);
}


export async function sendWhatsAppMessage(params: {
  recipient: string;
  content: string;
}): Promise<OutboundChannelResult> {
  const recipient = normalizePhoneNumber(params.recipient);
  if (!recipient) {
    return { success: false, channel: 'whatsapp', recipient: params.recipient, error: 'Invalid recipient number.' };
  }

  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_TOKEN;

  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'whatsapp',
          recipient,
          content: params.content,
        }),
      });
      const raw = await res.text();
      return res.ok
        ? { success: true, channel: 'whatsapp', recipient }
        : { success: false, channel: 'whatsapp', recipient, error: raw || `WhatsApp webhook failed (${res.status}).` };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'WhatsApp webhook request failed.';
      return { success: false, channel: 'whatsapp', recipient, error: message };
    }
  }

  // Check CallMeBot Free WhatsApp API Keys (Per-phone or global)
  const callMeBotKey =
    recipient === normalizePhoneNumber(process.env.ADMIN_SMS_NUMBER || '+254706972161')
      ? process.env.CALLMEBOT_API_KEY_ADMIN1 || process.env.CALLMEBOT_API_KEY
      : recipient === normalizePhoneNumber(process.env.SECONDARY_ADMIN_SMS_NUMBER || '+254719303786')
      ? process.env.CALLMEBOT_API_KEY_ADMIN2 || process.env.CALLMEBOT_API_KEY
      : process.env.CALLMEBOT_API_KEY;

  if (callMeBotKey) {
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
        recipient
      )}&text=${encodeURIComponent(params.content)}&apikey=${encodeURIComponent(callMeBotKey)}`;
      const res = await fetch(url);
      const raw = await res.text();
      if (res.ok && (raw.includes('Message queued') || raw.includes('OK') || raw.includes('success'))) {
        return { success: true, channel: 'whatsapp', recipient, messageId: 'callmebot-queued' };
      }
      return {
        success: false,
        channel: 'whatsapp',
        recipient,
        error: raw || `CallMeBot WhatsApp send failed (${res.status}).`,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'CallMeBot WhatsApp send failed.';
      return { success: false, channel: 'whatsapp', recipient, error: message };
    }
  }

  if (phoneNumberId && accessToken) {
    try {
      const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: recipient,
          type: 'text',
          text: { body: params.content },
        }),
      });
      const raw = await res.text();
      const parsed = safeJsonParse(raw);

      if (!res.ok) {
        return {
          success: false,
          channel: 'whatsapp',
          recipient,
          error: readTextField(parsed, 'error') || raw || `WhatsApp send failed (${res.status}).`,
        };
      }

      return {
        success: true,
        channel: 'whatsapp',
        recipient,
        messageId: readScalarField(parsed, 'message_id') || readScalarField(parsed, 'id'),
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'WhatsApp send failed.';
      return { success: false, channel: 'whatsapp', recipient, error: message };
    }
  }

  return {
    success: false,
    channel: 'whatsapp',
    recipient,
    error: 'WhatsApp is not configured. Set CALLMEBOT_API_KEY, WHATSAPP_WEBHOOK_URL, or Meta WhatsApp Cloud API env vars.',
  };

}

export async function broadcastAdminMessage(
  content: string,
  meta?: { orderId?: string; customerName?: string }
): Promise<BroadcastResult> {
  const recipients = getAdminRecipients();

  const sms = await Promise.all(
    recipients.map(async (recipient) => {
      const result = await sendBrevoSms({
        recipient,
        content,
        orderId: meta?.orderId,
        customerName: meta?.customerName,
      });
      return {
        success: result.success,
        channel: 'sms' as const,
        recipient,
        statusCode: result.statusCode,
        errorType: result.errorType,
        error: result.error,
        messageId: result.messageId,
      };
    })
  );

  const whatsapp = await Promise.all(
    recipients.map(async (recipient) => sendWhatsAppMessage({ recipient, content }))
  );

  return { sms, whatsapp };
}


function safeJsonParse(value: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function readTextField(data: Record<string, unknown> | null, key: string): string | undefined {
  if (!data) return undefined;
  const value = data[key];
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return undefined;
}

function readScalarField(data: Record<string, unknown> | null, key: string): string | number | undefined {
  if (!data) return undefined;
  const value = data[key];
  if (typeof value === 'string' || typeof value === 'number') return value;
  return undefined;
}
