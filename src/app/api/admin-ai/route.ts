import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_TEXT_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_TTS_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';

// Admin-focused system context
const ADMIN_SYSTEM_PROMPT = `You are Cucu Admin Assistant, the warm and practical helper inside the Cucu Mutugi Poultry admin panel.

Speak like a trusted farm team member: clear, friendly, and natural. Keep answers short unless the user asks for detail. Avoid robotic or overly technical language.

You help with:
1. Dashboard insights, quick numbers, and recent activity.
2. Commerce and ledger tracking for income, expenses, profit, loss, and calculator shortcuts.
3. Community approvals for verifying farmers before they enter the lounge.
4. Customer activity, leads, and support follow-ups.
5. 24-hour story updates, photos, videos, and polls.
6. Videos and shorts management.
7. Database records, audit logs, and transaction history.
8. Products, orders, farmers, media, blog posts, and site settings.

When explaining actions, give simple step-by-step guidance. If a user asks about money, records, or approvals, be careful and precise. Reply in the same language the user uses, mainly English or Swahili.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, text, voice, history } = body;

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    // ─── 1. TEXT CHAT → Generate AI text response ────────────────────────────
    if (action === 'chat') {
      const messages = [
        // System context as first user turn (Gemini Flash format)
        {
          role: 'user',
          parts: [{ text: ADMIN_SYSTEM_PROMPT }]
        },
        {
          role: 'model',
          parts: [{ text: 'Of course. I am here to help with the farm dashboard, records, orders, and community approvals. What would you like to do today?' }]
        },
        // Previous conversation turns
        ...((history || []).map((h: { role: string; text: string }) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        }))),
        // Latest user message
        {
          role: 'user',
          parts: [{ text }]
        }
      ];

      const res = await fetch(`${GEMINI_TEXT_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
          }
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Gemini chat error:', errorText);
        return NextResponse.json({ error: `Gemini API error: ${res.status}` }, { status: 500 });
      }

      const data = await res.json();
      const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I am not sure how to answer that. Try asking about a specific admin panel section.';

      return NextResponse.json({ success: true, reply: replyText });
    }

    // ─── 2. TTS → Convert text to audio using Gemini TTS ────────────────────
    if (action === 'tts') {
      if (!text) {
        return NextResponse.json({ error: 'Text is required for TTS' }, { status: 400 });
      }

      const selectedVoice = voice || 'Aoede'; // Default: Breezy, natural-sounding

      const ttsPrompt = `[Warm, natural, and human] ${text}`;

      const res = await fetch(`${GEMINI_TTS_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-2.5-flash-preview-tts',
          input: ttsPrompt,
          response_format: { type: 'audio' },
          generation_config: {
            speech_config: [
              { voice: selectedVoice }
            ]
          }
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Gemini TTS error:', errorText);
        // Gracefully fail — return text only, no audio
        return NextResponse.json({
          success: false,
          error: `TTS unavailable: ${res.status}`,
          textOnly: true
        }, { status: 200 });
      }

      const data = await res.json();
      const audioBase64 = data?.output_audio?.data;

      if (!audioBase64) {
        return NextResponse.json({ success: false, textOnly: true });
      }

      return NextResponse.json({
        success: true,
        audioData: audioBase64,
        audioFormat: 'wav',
      });
    }

    return NextResponse.json({ error: 'Invalid action. Use "chat" or "tts".' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin AI error:', error);
    return NextResponse.json({ error: error.message || 'Admin AI error' }, { status: 500 });
  }
}
