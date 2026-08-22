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
  'Help me post a new farm update',
  'How do I approve a community member?',
  'Show me how to record income and expenses',
  'How do I add a new product listing?',
  'Where do I check customer activity?',
  'How do I upload a farm video?',
  'How do I update the WhatsApp number?',
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
      text: `Habari! I am your Cucu Mutugi Admin Assistant.\n\nI can help you with:\n• navigating the admin panel\n• recording income, expenses, and ledger entries\n• approving community members\n• posting 24-hour updates\n• checking reports and analytics\n\nYou can type your question or use the microphone, and I will answer in a simple, human way. How can I help?`,
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
          .replace(/â€¢/g, '')
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

  // Speech-to-Text (Browser Web Speech API)
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
    <div
      className="flex flex-col border-r border-emerald-900/50 min-h-screen transition-all duration-300 overflow-hidden flex-shrink-0"
      style={{
        width: isOpen ? '320px' : '52px',
        minWidth: isOpen ? '320px' : '52px',
        background: 'linear-gradient(170deg, #0f1f13 0%, #1a2e20 100%)',
      }}
    >
      {/* â”€â”€â”€ COLLAPSED STATE: Icon strip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className={`flex flex-col items-center justify-start gap-2 w-full h-full py-5 px-1 cursor-pointer transition-all duration-200 group ${
            isGlowing ? 'bg-amber-500/10' : 'hover:bg-emerald-900/30'
          }`}
          title="Open Admin AI Assistant"
        >
          <div className={`relative p-2.5 rounded-2xl transition-all ${
            isGlowing
              ? 'bg-gradient-to-br from-amber-500 to-amber-700 ring-2 ring-amber-400/60 animate-pulse'
              : 'bg-gradient-to-br from-emerald-800 to-emerald-600 group-hover:from-emerald-700 group-hover:to-emerald-500'
          }`}>
            <Bot className="w-5 h-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-emerald-800">
                {unreadCount}
              </span>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border border-emerald-800 animate-pulse" />
          </div>
          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider writing-mode-vertical">AI</span>
          <div className="mt-2 w-0.5 h-16 bg-emerald-800/50 rounded-full" />
          <span className="text-[8px] text-emerald-600 font-bold uppercase tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            Gemini
          </span>
        </button>
      )}

      {/* â”€â”€â”€ EXPANDED STATE: Full Chat Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {isOpen && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className="px-3 py-3 flex items-center justify-between gap-2 flex-shrink-0 border-b border-amber-400/20"
            style={{ background: 'linear-gradient(90deg, #14532D, #166534)' }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full relative overflow-hidden ring-2 ring-amber-400/50 shadow-inner bg-amber-950 flex items-center justify-center flex-shrink-0">
                <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-amber-300 text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Cucu Admin AI
                </div>
                <div className="text-[10px] text-emerald-300 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Gemini Â· Voice Ready
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button
                onClick={() => { stopSpeaking(); setVoiceEnabled(!voiceEnabled); }}
                title={voiceEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  voiceEnabled
                    ? 'bg-emerald-700 text-emerald-100 hover:bg-emerald-600'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                {voiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              </button>

              <button
                onClick={handleReset}
                title="Reset Conversation"
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-300 hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-300 hover:text-white"
              >
                {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
              </button>
              <button
                onClick={() => { stopSpeaking(); setIsOpen(false); }}
                title="Close"
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-300 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages + Input */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 text-white">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs ${
                        isUser
                          ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-white'
                          : 'bg-gradient-to-br from-emerald-700 to-emerald-500 text-white'
                      }`}>
                        {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      </div>

                      {/* Bubble */}
                      <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-md ${
                        isUser
                          ? 'bg-amber-600/80 text-amber-50 rounded-tr-none border border-amber-500/40'
                          : 'bg-emerald-900/80 text-emerald-50 rounded-tl-none border border-emerald-600/30'
                      }`}>
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
                        <div className="text-[9px] opacity-50 text-right mt-1">{msg.timestamp}</div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-500 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-emerald-900/80 rounded-2xl rounded-tl-none px-3 py-2 border border-emerald-600/30 flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3 text-emerald-400 animate-spin" />
                      <span className="text-xs text-emerald-300 font-medium">Thinking...</span>
                    </div>
                  </div>
                )}

                {/* Speaking Indicator */}
                {isSpeaking && (
                  <div className="flex items-center gap-2 px-1">
                    <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="text-xs text-amber-400 font-bold">Speaking...</span>
                    <button onClick={stopSpeaking} className="text-xs text-slate-400 hover:text-white underline cursor-pointer">Stop</button>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="flex items-start gap-2 p-2.5 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-400" />
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-white cursor-pointer">âœ•</button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Panel */}
              {showQuickPrompts && (
                <div className="px-2 py-2 border-t border-white/10 flex flex-wrap gap-1 max-h-24 overflow-y-auto bg-black/20">
                  {QUICK_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => { setShowQuickPrompts(false); sendMessage(p); }}
                      className="text-[10px] bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 px-2 py-1 rounded-full font-bold cursor-pointer transition-colors text-left"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="px-2.5 py-2.5 border-t border-white/10 bg-black/20 flex-shrink-0">
                <div className="flex items-end gap-1.5">
                  {/* Quick Prompts Toggle */}
                  <button
                    onClick={() => setShowQuickPrompts(p => !p)}
                    title="Quick prompts"
                    className={`p-2 rounded-xl flex-shrink-0 cursor-pointer transition-all ${
                      showQuickPrompts
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-900/60 text-emerald-400 hover:bg-emerald-800 hover:text-emerald-200 border border-emerald-700/40'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
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
                    placeholder={isRecording ? 'Listening...' : 'Ask about admin panel...'}
                    rows={1}
                    disabled={isRecording}
                    className="flex-1 bg-emerald-950/60 text-white placeholder:text-slate-500 text-xs px-3 py-2 rounded-xl border border-emerald-700/40 focus:outline-none focus:border-amber-500/60 resize-none"
                  />

                  {/* Mic Button */}
                  <button
                    onClick={isRecording ? stopVoiceInput : startVoiceInput}
                    title={isRecording ? 'Stop recording' : 'Speak your question'}
                    className={`p-2 rounded-xl flex-shrink-0 cursor-pointer transition-all ${
                      isRecording
                        ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-800/50'
                        : 'bg-emerald-900/60 text-emerald-400 hover:bg-emerald-700 hover:text-white border border-emerald-700/40'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={() => sendMessage(inputText)}
                    disabled={!inputText.trim() || isLoading}
                    title="Send Message"
                    className="p-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white flex-shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-1 text-center text-[9px] text-slate-600 font-medium">
                  Enter to send â€¢ click mic to speak
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
