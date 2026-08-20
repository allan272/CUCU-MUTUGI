'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Phone,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  Maximize2,
  Minimize2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { findAssistantReply } from '@/lib/poultryDictionary';
import { trackButtonClick } from '@/lib/tracker';

interface BotMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  category?: string;
  actionLabel?: string;
  actionUrl?: string;
  followUps?: string[];
  timestamp: string;
}

const INITIAL_BOT_MESSAGES: BotMessage[] = [
  {
    id: 'intro-1',
    sender: 'bot',
    text: `🐔 **Habari! Welcome to Cucu Mutugi Poultry Assistant.**\n\nI can help you diagnose chick health issues, explain vaccination timetables, check chick prices, and guide your poultry farming. What can I assist you with today?`,
    followUps: [
      '🐣 Chick Prices & Breeds',
      '🌡️ Brooding Temperature Guide',
      '💉 Vaccination Schedule',
      '🩸 Sick Chicks / Blood in Droppings',
      '🚚 Delivery Days & Routes'
    ],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
];

export default function PoultryAssistantBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<BotMessage[]>(INITIAL_BOT_MESSAGES);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [showGreetingTooltip, setShowGreetingTooltip] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Hide greeting popup after 10s or when opened
  useEffect(() => {
    const timer = setTimeout(() => setShowGreetingTooltip(false), 12000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setShowGreetingTooltip(false);
    trackButtonClick('Open Poultry Assistant Bot');
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    // User Message
    const userMsg: BotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Track search/query in analytics
    trackButtonClick(`Assistant Bot Query: ${text}`);

    // Simulate typing delay
    setTimeout(() => {
      const result = findAssistantReply(text);
      const botMsg: BotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: result.reply,
        category: result.category,
        actionLabel: result.actionLabel,
        actionUrl: result.actionUrl,
        followUps: result.followUps,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleReset = () => {
    setMessages(INITIAL_BOT_MESSAGES);
    setIsTyping(false);
  };

  return (
    <>
      {/* ─── FLOATING TOGGLE BUTTON ────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2">
        {/* Proactive Greeting Tooltip */}
        {!isOpen && showGreetingTooltip && (
          <div
            onClick={handleOpen}
            className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border-2 border-emerald-400 max-w-xs cursor-pointer animate-in fade-in slide-in-from-bottom-3 duration-300 relative group"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setShowGreetingTooltip(false); }}
              className="absolute -top-2 -right-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full p-1 text-xs border border-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-extrabold text-xs text-amber-300">Cucu Poultry Assistant</span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              Need help with chick sickness, brooding temperatures, vaccines, or orders? Click to chat!
            </p>
          </div>
        )}

        {/* Floating Bubble Button */}
        {!isOpen && (
          <button
            onClick={handleOpen}
            className="relative p-4 rounded-full bg-gradient-to-tr from-[#075E54] via-[#128C7E] to-emerald-500 hover:from-[#054D44] hover:to-emerald-600 text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group cursor-pointer ring-4 ring-emerald-400/30"
            title="Chat with Cucu Poultry Assistant"
            aria-label="Open Poultry Assistant"
          >
            <div className="relative">
              <Bot className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-[#075E54] animate-pulse" />
            </div>

            {unreadCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* ─── EXPANDABLE CHATBOT DRAWER ─────────────────────────────────────── */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] bg-[#ECE5DD] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#075E54]/40 flex flex-col transition-all duration-300 animate-in fade-in zoom-in-95 ${
            isMinimized ? 'h-16' : 'h-[580px] max-h-[85vh]'
          }`}
          style={{
            backgroundImage: `radial-gradient(#128C7E15 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] text-white p-3.5 px-4 flex items-center justify-between shadow-md flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 ring-2 ring-amber-300 relative overflow-hidden flex items-center justify-center font-bold text-white shadow-inner">
                <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span>Cucu Poultry Assistant</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <div className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 inline-block animate-pulse" />
                  <span>Expert Dictionary Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Restart Chat"
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-emerald-100"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-emerald-100"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
                {messages.map((msg) => {
                  const isBot = msg.sender === 'bot';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                    >
                      {/* Message Bubble */}
                      <div
                        className={`max-w-[90%] rounded-2xl p-3 shadow-md text-xs sm:text-sm leading-relaxed ${
                          isBot
                            ? 'bg-white text-slate-900 rounded-tl-none border border-slate-200'
                            : 'bg-[#DCF8C6] text-slate-900 rounded-tr-none border border-emerald-300'
                        }`}
                      >
                        {/* Bot Category Badge */}
                        {isBot && msg.category && (
                          <div className="text-[10px] font-black text-emerald-800 uppercase tracking-wider mb-1 border-b border-black/5 pb-0.5">
                            📚 {msg.category}
                          </div>
                        )}

                        {/* Content */}
                        <div className="whitespace-pre-wrap font-medium">
                          {msg.text}
                        </div>

                        {/* Action Link / Button if any */}
                        {msg.actionUrl && msg.actionLabel && (
                          <div className="mt-2.5 pt-2 border-t border-black/5">
                            {msg.actionUrl.startsWith('http') ? (
                              <a
                                href={msg.actionUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-sm transition-all"
                              >
                                <span>{msg.actionLabel}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <Link
                                href={msg.actionUrl}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-sm transition-all"
                              >
                                <span>{msg.actionLabel}</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        )}

                        {/* Timestamp */}
                        <div className="text-[10px] text-gray-400 text-right mt-1">
                          {msg.timestamp}
                        </div>
                      </div>

                      {/* Follow-up / Quick Reply Chips */}
                      {isBot && msg.followUps && msg.followUps.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                          {msg.followUps.map((chip, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(chip)}
                              className="text-[11px] font-bold bg-white/90 hover:bg-emerald-100 text-emerald-900 border border-emerald-300/80 px-2.5 py-1 rounded-full shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95 text-left"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-1 bg-white p-2.5 px-3 rounded-2xl rounded-tl-none shadow-sm w-16 border border-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce delay-200" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Input Area */}
              <div className="bg-[#F0F2F5] p-2.5 border-t border-slate-300">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Ask poultry question or symptom..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="flex-1 bg-white text-slate-900 text-xs sm:text-sm py-2 px-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!inputVal.trim()}
                    className="w-9 h-9 rounded-full bg-[#128C7E] hover:bg-[#075E54] text-white flex items-center justify-center shadow transition-all cursor-pointer disabled:opacity-40"
                    title="Send"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
