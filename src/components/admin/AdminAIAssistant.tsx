'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Bot,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  X,
  Minus,
  Maximize2,
  RotateCcw,
  Sparkles,
  Loader2,
  User,
  AlertCircle,
  ChevronDown,
  MessageCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// Suggested admin panel prompts
const QUICK_PROMPTS = [
  'How do I post a 24h status update?',
  'How do I approve a community member?',
  'How do I record a daily income transaction?',
  'How do I add a new product listing?',
  'How do I check customer activity?',
  'How do I upload a farm video?',
  'How do I change the WhatsApp number in settings?',
  'Show me how the financial calculator works',
  'How do I write a blog post?',
];

// PCM to WAV converter for Gemini TTS output
function pcmBase64ToWavUrl(base64: string, sampleRate = 24000): string {
  const pcmBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBytes.length;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (off: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);
  new Uint8Array(buffer, 44).set(pcmBytes);

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

export default function AdminAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'assistant',
      text: `🐔 Habari! I am your **Cucu Mutugi Admin Assistant** powered by Gemini AI.\n\nI can help you with:\n• Navigating the admin panel sections\n• Recording transactions & ledger entries\n• Managing community member approvals\n• Posting 24h status updates\n• Understanding analytics & reports\n\nYou can **type** your question or click the **microphone** to speak — and I will reply with voice! How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [isGlowing, setIsGlowing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const currentAudioUrlRef = useRef<string | null>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Attention pulse on load
  useEffect(() => {
    const timer = setTimeout(() => setIsGlowing(true), 3000);
    const timer2 = setTimeout(() => setIsGlowing(false), 8000);
    return () => { clearTimeout(timer); clearTimeout(timer2); };
  }, []);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (currentAudioUrlRef.current) URL.revokeObjectURL(currentAudioUrlRef.current);
    };
  }, []);

  const playAudioBase64 = useCallback(async (base64: string) => {
    try {
      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
      }
      const url = pcmBase64ToWavUrl(base64);
      currentAudioUrlRef.current = url;

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
        currentAudioUrlRef.current = null;
      };
      audio.onerror = () => {
        setIsSpeaking(false);
      };
      setIsSpeaking(true);
      await audio.play();
    } catch (e) {
      console.error('Audio playback error:', e);
      setIsSpeaking(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  // Build conversation history (last 6 turns max for context window)
  const buildHistory = useCallback(() => {
    return messages.slice(-6).map(m => ({ role: m.role, text: m.text }));
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    stopSpeaking();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Step 1: Get AI text response
      const chatRes = await fetch('/api/admin-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          text: trimmed,
          history: buildHistory(),
        }),
      });

      const chatData = await chatRes.json();

      if (!chatRes.ok || !chatData.reply) {
        throw new Error(chatData.error || 'Failed to get AI response');
      }

      const replyText: string = chatData.reply;

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);

      // Step 2: Convert reply to speech if voice enabled
      if (voiceEnabled) {
        const plainText = replyText
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/#{1,3}\s/g, '')
          .replace(/•/g, '')
          .slice(0, 600); // limit to ~600 chars for TTS

        const ttsRes = await fetch('/api/admin-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'tts',
            text: plainText,
            voice: 'Aoede',
          }),
        });

        const ttsData = await ttsRes.json();

        if (ttsData.success && ttsData.audioData) {
          await playAudioBase64(ttsData.audioData);
        }
      }
    } catch (err: any) {
      console.error('Admin AI error:', err);
      setError(err.message || 'Connection error. Please try again.');
      setIsLoading(false);
    }
  }, [isLoading, voiceEnabled, buildHistory, stopSpeaking, playAudioBase64]);

  // ─── Speech-to-Text (Browser Web Speech API) ──────────────────────────────
  const startVoiceInput = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-KE'; // Kenyan English, fallback to en-US
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setTimeout(() => sendMessage(transcript), 200);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access was denied. Please allow microphone permissions in your browser.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else {
        setError(`Voice error: ${event.error}`);
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [sendMessage]);

  const stopVoiceInput = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setIsMinimized(false);
  };

  const handleReset = () => {
    stopSpeaking();
    setMessages([{
      id: 'intro',
      role: 'assistant',
      text: `Hi again! I've reset our conversation. What would you like help with in the Cucu Mutugi Admin Panel?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setError(null);
    setInputText('');
  };

  return (
    <>
      {/* ─── FLOATING TOGGLE BUTTON ─────────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center ring-4 ${
            isGlowing
              ? 'ring-amber-400/60 scale-110 bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-400 animate-bounce'
              : 'ring-amber-400/20 bg-gradient-to-tr from-emerald-800 via-emerald-700 to-amber-700'
          }`}
          title="Open Cucu Admin AI Assistant"
        >
          <Bot className="w-7 h-7" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
              {unreadCount}
            </span>
          )}
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-emerald-800 animate-pulse" />
        </button>
      )}

      {/* ─── CHAT DRAWER ────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[480px] rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/30 flex flex-col transition-all duration-300 animate-in fade-in zoom-in-95 ${
            isMinimized ? 'h-16' : 'h-[600px] max-h-[88vh]'
          }`}
          style={{ background: 'linear-gradient(170deg, #0f1f13 0%, #1a2e20 100%)' }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between gap-3 flex-shrink-0 border-b border-amber-400/20"
            style={{ background: 'linear-gradient(90deg, #14532D, #166534)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full relative overflow-hidden ring-2 ring-amber-400/50 shadow-inner bg-amber-950 flex items-center justify-center flex-shrink-0">
                <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-amber-300 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Cucu Admin AI
                </div>
                <div className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini Powered · Voice Ready
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Voice Toggle */}
              <button
                onClick={() => { stopSpeaking(); setVoiceEnabled(!voiceEnabled); }}
                title={voiceEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
                className={`p-2 rounded-xl transition-all cursor-pointer text-xs font-bold flex items-center gap-1 ${
                  voiceEnabled
                    ? 'bg-emerald-700 text-emerald-100 hover:bg-emerald-600'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
              </button>

              <button
                onClick={handleReset}
                title="Reset Conversation"
                className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-slate-300 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-slate-300 hover:text-white"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>
              <button
                onClick={() => { stopSpeaking(); setIsOpen(false); }}
                title="Close"
                className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages + Input */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-white">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ${
                        isUser
                          ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-white'
                          : 'bg-gradient-to-br from-emerald-700 to-emerald-500 text-white'
                      }`}>
                        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      {/* Bubble */}
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                        isUser
                          ? 'bg-amber-600/80 text-amber-50 rounded-tr-none border border-amber-500/40'
                          : 'bg-emerald-900/80 text-emerald-50 rounded-tl-none border border-emerald-600/30'
                      }`}>
                        {/* Render text with basic markdown */}
                        <div className="whitespace-pre-wrap font-medium">
                          {msg.text.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={i} className="font-black text-amber-200">{part.slice(2, -2)}</strong>;
                            }
                            if (part.startsWith('*') && part.endsWith('*')) {
                              return <em key={i}>{part.slice(1, -1)}</em>;
                            }
                            return part;
                          })}
                        </div>
                        <div className="text-[10px] opacity-50 text-right mt-1">{msg.timestamp}</div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-emerald-900/80 rounded-2xl rounded-tl-none px-4 py-3 border border-emerald-600/30 flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                      <span className="text-xs text-emerald-300 font-medium">Thinking...</span>
                    </div>
                  </div>
                )}

                {/* Speaking Indicator */}
                {isSpeaking && (
                  <div className="flex items-center gap-2 px-2">
                    <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="text-xs text-amber-400 font-bold">Speaking...</span>
                    <button
                      onClick={stopSpeaking}
                      className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Stop
                    </button>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-950/60 border border-red-800 rounded-2xl text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-white cursor-pointer">✕</button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Panel */}
              {showQuickPrompts && (
                <div className="px-3 py-2 border-t border-white/10 flex flex-wrap gap-1.5 max-h-28 overflow-y-auto bg-black/20">
                  {QUICK_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => { setShowQuickPrompts(false); sendMessage(p); }}
                      className="text-[11px] bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 px-2.5 py-1 rounded-full font-bold cursor-pointer transition-colors text-left"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="px-3 py-3 border-t border-white/10 bg-black/20 flex-shrink-0">
                <div className="flex items-end gap-2">
                  {/* Quick Prompts Toggle */}
                  <button
                    onClick={() => setShowQuickPrompts(p => !p)}
                    title="Quick prompts"
                    className={`p-2.5 rounded-xl flex-shrink-0 cursor-pointer transition-all ${
                      showQuickPrompts
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-900/60 text-emerald-400 hover:bg-emerald-800 hover:text-emerald-200 border border-emerald-700/40'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>

                  {/* Text Input */}
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(inputText);
                      }
                    }}
                    placeholder={isRecording ? '🎙️ Listening... speak now' : 'Ask anything about the admin panel...'}
                    rows={1}
                    disabled={isRecording}
                    className="flex-1 bg-emerald-950/60 text-white placeholder:text-slate-500 text-sm px-3.5 py-2.5 rounded-2xl border border-emerald-700/40 focus:outline-none focus:border-amber-500/60 resize-none"
                  />

                  {/* Mic Button */}
                  <button
                    onClick={isRecording ? stopVoiceInput : startVoiceInput}
                    title={isRecording ? 'Stop recording' : 'Speak your question'}
                    className={`p-2.5 rounded-xl flex-shrink-0 cursor-pointer transition-all ${
                      isRecording
                        ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-800/50'
                        : 'bg-emerald-900/60 text-emerald-400 hover:bg-emerald-700 hover:text-white border border-emerald-700/40'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={() => sendMessage(inputText)}
                    disabled={!inputText.trim() || isLoading}
                    title="Send Message"
                    className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white flex-shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-1.5 text-center text-[10px] text-slate-600 font-medium">
                  Press Enter to send • Shift+Enter for new line • 🎙️ click mic to speak
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
