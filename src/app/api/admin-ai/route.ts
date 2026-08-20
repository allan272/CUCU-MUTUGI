import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_TEXT_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_TTS_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions';

// Admin-focused system context
const ADMIN_SYSTEM_PROMPT = `You are an expert AI assistant embedded inside the Cucu Mutugi Poultry Farm Admin Control Panel. Your name is "Cucu Admin Assistant". You know everything about the Cucu Mutugi Poultry Admin Panel features.

The Admin Panel has these sections:
1. **Dashboard** - Overview KPIs, product counts, order stats, recent activity.
2. **Commerce & Ledger** - Daily income/expense recorder, KPI cards (Total Income, Expenses, Net Profit, Margin %), financial calculator with arithmetic keypad and 1-click shortcuts for Today's Income, Expenses, and Net Profit.
3. **Community Approvals** - Review and approve/reject new farmer member registrations for the WhatsApp-style Community Chat. Can broadcast pinned admin announcements.
4. **Customer Activity** - Tracks customer search queries, button clicks, and captured email leads from across the website.
5. **24h Status Updates** - Create and manage 24-hour story posts (text, photos, videos, polls) visible on the public website.
6. **Videos & Shorts** - Manage farm video content.
7. **Database Viewer** - Full raw JSON viewer and editor for all site data.
8. **Products** - Manage chick product listings (Kuroiler, ISA Brown, Sasso, Kenbro, Broilers, Rainbow Rooster).
9. **Orders** - View and manage customer chick orders.
10. **Farmers** - Directory of registered farmers.
11. **Media & Images** - Upload and manage gallery images.
12. **Site Content** - Edit homepage content, banners, and announcements.
13. **Blog Posts** - Write and publish blog articles.
14. **Settings** - Site settings, WhatsApp number, contact details, delivery schedule.

Answer all questions concisely, helpfully, and confidently. If asked how to do something in the panel, give clear step-by-step instructions. Speak naturally as a helpful poultry farm assistant. If you don't know the exact answer, guide the user to the relevant section. Respond in the same language the user speaks (English or Swahili).`;

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
          parts: [{ text: 'Understood! I am your Cucu Mutugi Admin Assistant. How can I help you manage the panel today?' }]
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

      const ttsPrompt = `[helpfully and clearly] ${text}`;

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
