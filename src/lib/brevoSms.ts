export function normalizePhoneNumber(phone: string | undefined | null): string {
  if (!phone) return '';

  const str = String(phone).trim();
  const digits = str.replace(/\D/g, '');
  if (!digits) return '';

  let normalized = digits;
  // If user passed +2540... or 2540... (13 digits), strip the extraneous 0
  if (digits.startsWith('2540') && digits.length === 13) {
    normalized = `254${digits.slice(4)}`;
  } else if (digits.startsWith('254') && digits.length === 12) {
    normalized = digits;
  } else if (digits.startsWith('0') && digits.length === 10) {
    normalized = `254${digits.slice(1)}`;
  } else if (digits.length === 9) {
    normalized = `254${digits}`;
  }

  return `+${normalized}`;
}

export function formatKenyanPhone(phone: string | undefined | null): string {
  return normalizePhoneNumber(phone);
}

export interface BrevoSmsResult {
  success: boolean;
  messageId?: number | string;
  statusCode?: number;
  error?: string;
  errorType?: string;
  recipient?: string;
}

export async function sendBrevoSms(params: {
  recipient: string;
  content: string;
  sender?: string;
  type?: 'transactional' | 'marketing';
  unicodeEnabled?: boolean;
  organisationPrefix?: string;
  orderId?: string;
  customerName?: string;
}): Promise<BrevoSmsResult> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error('[SMS ERROR] BREVO_API_KEY is not configured on server.');
    return {
      success: false,
      statusCode: 500,
      errorType: 'MISSING_API_KEY',
      error: 'BREVO_API_KEY is not configured.',
    };
  }

  const recipient = normalizePhoneNumber(params.recipient);
  if (!recipient || recipient.length < 10) {
    console.error('[SMS ERROR] Invalid recipient phone number:', params.recipient);
    return {
      success: false,
      statusCode: 400,
      errorType: 'INVALID_RECIPIENT',
      error: 'Recipient phone number is missing or invalid.',
    };
  }

  try {
    const sender = params.sender || process.env.BREVO_SMS_SENDER || 'CUCUMUTUGI';
    const payload = {
      sender,
      recipient,
      content: params.content,
      type: params.type || 'transactional',
      unicodeEnabled: params.unicodeEnabled ?? true,
    };

    const res = await fetch('https://api.brevo.com/v3/transactionalSMS/send', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const raw = await res.text();
    const data = raw ? safeJsonParse(raw) : null;
    const messageId = readScalarField(data, 'messageId') || readScalarField(data, 'id');

    // Safe diagnostic logging (No API keys or unnecessary customer details)
    console.log(`[SMS DIAGNOSTICS]
Order ID: ${params.orderId || 'N/A'}
Recipient: ${recipient}
Brevo request started: YES
Brevo response status: ${res.status}
Brevo message ID: ${messageId || 'N/A'}
Delivery request accepted: ${res.ok ? 'YES' : 'NO'}
Error type: ${!res.ok ? (readTextField(data, 'code') || `HTTP_${res.status}`) : 'None'}`);

    if (!res.ok) {
      const errorMessage =
        readTextField(data, 'message') ||
        readTextField(data, 'error') ||
        raw ||
        `Brevo SMS request failed with status ${res.status}.`;
      return {
        success: false,
        statusCode: res.status,
        recipient,
        errorType: readTextField(data, 'code') || `HTTP_${res.status}`,
        error: errorMessage,
      };
    }

    return {
      success: true,
      statusCode: res.status,
      recipient,
      messageId,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to send Brevo SMS.';
    console.error(`[SMS DIAGNOSTICS] Network exception sending to ${recipient}:`, message);
    return {
      success: false,
      statusCode: 0,
      recipient,
      errorType: 'NETWORK_EXCEPTION',
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

