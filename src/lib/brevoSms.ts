const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SMS_SENDER = process.env.BREVO_SMS_SENDER || 'CUCUMUTUGI';
const DEFAULT_PREFIX = process.env.BREVO_SMS_PREFIX || 'CUCU MUTUGI';

export function normalizePhoneNumber(phone: string | undefined | null): string {
  if (!phone) return '';

  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('254')) return digits;
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;

  return digits;
}

export function formatKenyanPhone(phone: string | undefined | null): string {
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return '';
  return normalized;
}

export async function sendBrevoSms(params: {
  recipient: string;
  content: string;
  sender?: string;
  type?: 'transactional' | 'marketing';
  unicodeEnabled?: boolean;
  organisationPrefix?: string;
}): Promise<{ success: boolean; messageId?: number | string; error?: string }> {
  const apiKey = BREVO_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error: 'BREVO_API_KEY is not configured.',
    };
  }

  const recipient = formatKenyanPhone(params.recipient);
  if (!recipient) {
    return {
      success: false,
      error: 'Recipient phone number is missing or invalid.',
    };
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/transactionalSMS/send', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: params.sender || BREVO_SMS_SENDER,
        recipient,
        content: params.content,
        type: params.type || 'transactional',
        unicodeEnabled: params.unicodeEnabled ?? true,
        organisationPrefix: params.organisationPrefix || DEFAULT_PREFIX,
      }),
    });

    const raw = await res.text();
    const data = raw ? safeJsonParse(raw) : null;

    if (!res.ok) {
      return {
        success: false,
        error: readTextField(data, 'message') || readTextField(data, 'error') || raw || `Brevo SMS request failed with status ${res.status}.`,
      };
    }

    return {
      success: true,
      messageId: readScalarField(data, 'messageId'),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to send Brevo SMS.';
    return {
      success: false,
      error: message,
    };
  }
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
