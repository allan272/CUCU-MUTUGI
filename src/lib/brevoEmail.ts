export interface SendBrevoEmailParams {
  to?: string | { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  senderName?: string;
  senderEmail?: string;
}

export async function sendBrevoEmail(params: SendBrevoEmailParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
  statusCode?: number;
}> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('[EMAIL ERROR] BREVO_API_KEY is not configured on server.');
    return {
      success: false,
      statusCode: 500,
      error: 'BREVO_API_KEY is not configured.',
    };
  }

  const senderEmail =
    params.senderEmail || process.env.BREVO_SENDER_EMAIL || process.env.ADMIN_EMAIL || 'allanbrandon520@gmail.com';
  const senderName = params.senderName || process.env.BREVO_SENDER_NAME || 'Cucu Mutugi Poultry';

  let recipients: { email: string; name?: string }[] = [];
  if (Array.isArray(params.to)) {
    recipients = params.to;
  } else if (typeof params.to === 'string' && params.to.trim()) {
    recipients = [{ email: params.to.trim() }];
  } else {
    const adminEmail = process.env.ADMIN_EMAIL || 'allanbrandon520@gmail.com';
    recipients = [{ email: adminEmail, name: 'Cucu Mutugi Admin' }];
  }

  try {
    const payload = {
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: recipients,
      subject: params.subject,
      htmlContent: params.htmlContent,
      textContent: params.textContent,
    };

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const raw = await res.text();
    let data: Record<string, unknown> | null = null;
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }

    if (!res.ok) {
      const errorMsg =
        (data?.message as string) || (data?.error as string) || raw || `Brevo Email failed with status ${res.status}`;
      console.error('[EMAIL ERROR] Brevo response error:', errorMsg);
      return {
        success: false,
        statusCode: res.status,
        error: errorMsg,
      };
    }

    const messageId = (data?.messageId as string) || undefined;
    console.log(`[EMAIL SUCCESS] Sent to ${recipients.map((r) => r.email).join(', ')} (Message ID: ${messageId})`);

    return {
      success: true,
      statusCode: res.status,
      messageId,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to send Brevo email.';
    console.error('[EMAIL NETWORK ERROR]:', message);
    return {
      success: false,
      statusCode: 0,
      error: message,
    };
  }
}
