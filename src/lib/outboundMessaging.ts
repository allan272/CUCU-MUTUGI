import { normalizePhoneNumber, sendBrevoSms } from './brevoSms';

export type OutboundChannelResult = {
  success: boolean;
  channel: 'sms' | 'whatsapp';
  recipient: string;
  error?: string;
  messageId?: string | number;
};

export type BroadcastResult = {
  sms: OutboundChannelResult[];
  whatsapp: OutboundChannelResult[];
};

const DEFAULT_ADMIN_RECIPIENTS = [
  '+254706972161',
  '+254740662799',
  '+254719303786',
  '+254755803918',
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
  const raw = process.env.ADMIN_REPORT_RECIPIENTS || process.env.ADMIN_PHONE_NUMBERS || '';
  const configured = raw
    .split(',')
    .map((phone) => phone.trim())
    .filter(Boolean);

  return uniquePhones(configured.length ? configured : DEFAULT_ADMIN_RECIPIENTS);
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
    error: 'WhatsApp is not configured. Set WHATSAPP_WEBHOOK_URL or WhatsApp Cloud API env vars.',
  };
}

export async function broadcastAdminMessage(content: string): Promise<BroadcastResult> {
  const recipients = getAdminRecipients();

  const sms = await Promise.all(
    recipients.map(async (recipient) => {
      const result = await sendBrevoSms({
        recipient,
        content,
      });
      return {
        success: result.success,
        channel: 'sms' as const,
        recipient,
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
