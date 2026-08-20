'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Image as ImageIcon,
  FileText,
  Check,
  CheckCheck,
  MoreVertical,
  Search,
  Users,
  ShieldCheck,
  MapPin,
  Sparkles,
  Phone,
  AlertCircle,
  X,
  Plus,
  Lock,
  LogOut,
  User,
  Heart,
  ThumbsUp,
  Flame,
  MessageSquare,
  ArrowLeft,
  Download,
  Eye,
  RefreshCw,
  Camera
} from 'lucide-react';
import { ChatUser, ChatChannel, ChatMessage, DEFAULT_CHAT_CHANNELS, DEFAULT_CHAT_MESSAGES, DEFAULT_CHAT_USERS } from '@/lib/seeds';

const EMOJI_LIST = ['🐔', '🐣', '👍', '❤️', '🔥', '👏', '💰', '🌾', '😂', '🙏', '💯', '👌'];

export default function CommunityChatView() {
  const [channels, setChannels] = useState<ChatChannel[]>(DEFAULT_CHAT_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState('general-lounge');
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_CHAT_MESSAGES);
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile View Toggle
  const [mobileShowChat, setMobileShowChat] = useState(false);

  // Message Input State
  const [inputContent, setInputContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [attachments, setAttachments] = useState<{ type: 'image' | 'document' | 'audio'; url: string; filename?: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [recordingAudio, setRecordingAudio] = useState(false);

  // Lightbox Modal for Photos
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Sign Up Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCounty, setRegCounty] = useState('Embu');
  const [regFarmFocus, setRegFarmFocus] = useState('Kuroiler & ISA Brown Layers');
  const [regAvatar, setRegAvatar] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Profile Edit Modal
  const [showProfileModal, setShowProfileModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cucu_chat_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) setCurrentUser(parsed);
      }
    } catch {}
  }, []);

  // Fetch Messages & Channels
  const fetchChatData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chat/messages?channelId=${activeChannelId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.channels) setChannels(data.channels);
        if (data.messages) setMessages(data.messages);
      }
    } catch (e) {
      console.warn('Failed to fetch chat data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatData();
    // Poll for new messages every 6 seconds
    const interval = setInterval(fetchChatData, 6000);
    return () => clearInterval(interval);
  }, [activeChannelId]);

  // Scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannelId]);

  const activeChannel = useMemo(() => {
    return channels.find(c => c.id === activeChannelId) || channels[0];
  }, [channels, activeChannelId]);

  const channelMessages = useMemo(() => {
    return messages.filter(m => m.channelId === activeChannelId);
  }, [messages, activeChannelId]);

  // Filtered Channels for Sidebar
  const filteredChannels = useMemo(() => {
    if (!searchQuery.trim()) return channels;
    return channels.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [channels, searchQuery]);

  // ─── File & Photo Upload ───────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'document') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setAttachments(prev => [
            ...prev,
            { type: fileType, url: data.url, filename: file.name, sizeBytes: file.size }
          ]);
        }
      }
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setUploading(false);
      setShowAttachMenu(false);
    }
  };

  // ─── Send Message ──────────────────────────────────────────────────────────
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    if (!inputContent.trim() && attachments.length === 0) return;

    const newMsgPayload = {
      channelId: activeChannelId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      senderCounty: currentUser.county,
      content: inputContent.trim(),
      attachments: attachments.length > 0 ? attachments : undefined,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        senderName: replyingTo.senderName,
        content: replyingTo.content.slice(0, 80),
      } : undefined,
    };

    // Optimistic UI update
    const optimisticId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      ...newMsgPayload,
      id: optimisticId,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setInputContent('');
    setAttachments([]);
    setReplyingTo(null);
    setShowEmojiBar(false);

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', message: newMsgPayload }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setMessages(prev => prev.map(m => (m.id === optimisticId ? data.message : m)));
        }
      }
    } catch (err) {
      console.error('Send message failed:', err);
    }
  };

  // ─── Reaction ──────────────────────────────────────────────────────────────
  const handleReact = async (messageId: string, emoji: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'react',
          messageId,
          emoji,
          userId: currentUser.id,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setMessages(prev => prev.map(m => (m.id === messageId ? data.message : m)));
        }
      }
    } catch (e) {
      console.error('React error:', e);
    }
  };

  // ─── Auth Handlers ─────────────────────────────────────────────────────────
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthSubmitting(true);

    try {
      if (authMode === 'register') {
        const res = await fetch('/api/chat/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'register',
            name: regName,
            email: regEmail,
            password: regPassword,
            phone: regPhone,
            county: regCounty,
            farmFocus: regFarmFocus,
            avatar: regAvatar,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setAuthSuccess(
            '🎉 Account created successfully! Your profile has been submitted to the Cucu Mutugi admin for verification. Once approved, you can log in to chat.'
          );
        } else {
          setAuthError(data.error || 'Registration failed');
        }
      } else {
        const res = await fetch('/api/chat/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'login',
            email: regEmail,
            password: regPassword,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setCurrentUser(data.user);
          localStorage.setItem('cucu_chat_user', JSON.stringify(data.user));
          setShowAuthModal(false);
        } else {
          setAuthError(data.error || 'Login failed');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Network error occurred');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cucu_chat_user');
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* WhatsApp Styled Container */}
      <div
        className="w-full rounded-3xl overflow-hidden shadow-2xl border border-emerald-800/30 flex flex-col md:flex-row"
        style={{ height: 'calc(100vh - 120px)', minHeight: '600px' }}
      >
        {/* ─── LEFT SIDEBAR: CHANNELS & MEMBERS ─────────────────────────────── */}
        <div
          className={`${
            mobileShowChat ? 'hidden md:flex' : 'flex'
          } w-full md:w-80 lg:w-96 flex-col bg-slate-900 border-r border-slate-800 text-white flex-shrink-0`}
        >
          {/* Sidebar Top Header */}
          <div className="bg-[#128C7E] p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 ring-2 ring-emerald-300 relative overflow-hidden flex items-center justify-center font-bold text-white shadow-inner">
                {currentUser?.avatar ? (
                  <Image src={currentUser.avatar} alt={currentUser.name} fill className="object-cover" />
                ) : (
                  <span>{currentUser?.name?.charAt(0) || '🐔'}</span>
                )}
              </div>
              <div className="truncate">
                <div className="font-extrabold text-sm text-white flex items-center gap-1.5 truncate">
                  <span>{currentUser ? currentUser.name : 'Farmer Community'}</span>
                  {currentUser?.role === 'admin' && (
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                      Admin
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 inline-block animate-pulse" />
                  <span>{currentUser ? (currentUser.county || 'Verified Member') : 'Sign in to chat'}</span>
                </div>
              </div>
            </div>

            {/* Auth Buttons */}
            <div>
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  title="Log Out"
                  className="p-2 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer text-emerald-100"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                  className="bg-emerald-900 hover:bg-emerald-950 text-emerald-200 font-bold text-xs px-3 py-1.5 rounded-xl transition-all shadow cursor-pointer border border-emerald-700/50"
                >
                  Log In
                </button>
              )}
            </div>
          </div>

          {/* Search Box */}
          <div className="p-3 bg-slate-950/60 border-b border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search farmer lounges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 text-white pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredChannels.map(channel => {
              const isSelected = channel.id === activeChannelId;
              return (
                <button
                  key={channel.id}
                  onClick={() => {
                    setActiveChannelId(channel.id);
                    setMobileShowChat(true);
                  }}
                  className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-emerald-950/60 border-l-4 border-emerald-400' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 border border-emerald-700/40 text-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    {channel.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-extrabold text-sm text-slate-100 truncate">{channel.name}</span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{channel.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Join Lounge / Create Account Prompt */}
          {!currentUser && (
            <div className="p-4 bg-emerald-950/90 border-t border-emerald-800 text-center space-y-2">
              <div className="text-xs font-bold text-emerald-200">
                Want to post photos, ask questions, or connect with Kenyan poultry farmers?
              </div>
              <button
                onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Join Farmer Lounge (Free Sign Up)
              </button>
            </div>
          )}
        </div>

        {/* ─── RIGHT MAIN CHAT AREA ────────────────────────────────────────── */}
        <div
          className={`${
            mobileShowChat ? 'flex' : 'hidden md:flex'
          } flex-1 flex-col bg-[#ECE5DD] relative`}
          style={{
            backgroundImage: `radial-gradient(#128C7E15 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        >
          {/* Active Channel Header */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileShowChat(false)}
                className="md:hidden p-1.5 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-2xl bg-emerald-900 border border-emerald-400/40 text-xl flex items-center justify-center shadow-inner">
                {activeChannel.icon}
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide flex items-center gap-2">
                  {activeChannel.name}
                </h3>
                <p className="text-[11px] text-emerald-200 font-medium truncate max-w-xs sm:max-w-md">
                  {activeChannel.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchChatData}
                className="p-2 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer text-emerald-100"
                title="Refresh Messages"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <a
                href="https://wa.me/254706972161"
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow transition-all flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> WhatsApp HQ
              </a>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {channelMessages.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-2xl shadow-inner">
                  {activeChannel.icon}
                </div>
                <h4 className="font-black text-slate-800 text-base">No messages yet in this lounge</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Be the first farmer to post an update, ask a question, or share your poultry experience!
                </p>
              </div>
            ) : (
              channelMessages.map(msg => {
                const isMe = currentUser?.id === msg.senderId;
                const isAdmin = msg.senderRole === 'admin';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
                  >
                    {/* Bubble Container */}
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 shadow-md relative transition-all ${
                        isMe
                          ? 'bg-[#DCF8C6] text-slate-900 rounded-tr-none border border-emerald-300/60'
                          : isAdmin
                          ? 'bg-gradient-to-br from-amber-50 to-emerald-50 text-slate-900 rounded-tl-none border-2 border-amber-300 shadow-amber-200/50'
                          : 'bg-white text-slate-900 rounded-tl-none border border-slate-200'
                      }`}
                    >
                      {/* Sender Info Banner */}
                      {!isMe && (
                        <div className="flex items-center gap-2 mb-1 border-b border-black/5 pb-1">
                          <span className={`font-black text-xs flex items-center gap-1 ${
                            isAdmin ? 'text-amber-800' : 'text-emerald-800'
                          }`}>
                            {msg.senderName}
                            {isAdmin && (
                              <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                                Verified Admin
                              </span>
                            )}
                          </span>
                          {msg.senderCounty && (
                            <span className="text-[10px] text-gray-500 font-medium">
                              • {msg.senderCounty}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Quoted Reply Preview */}
                      {msg.replyTo && (
                        <div className="mb-2 p-2 rounded-xl bg-black/5 border-l-4 border-emerald-600 text-xs text-slate-700">
                          <span className="font-bold text-[11px] text-emerald-800 block">
                            Replying to {msg.replyTo.senderName}:
                          </span>
                          <span className="truncate block italic">{msg.replyTo.content}</span>
                        </div>
                      )}

                      {/* Message Content */}
                      {msg.content && (
                        <div className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium whitespace-pre-wrap">
                          {msg.content}
                        </div>
                      )}

                      {/* Attachments (Photos / Docs) */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.attachments.map((att, attIdx) => {
                            if (att.type === 'image') {
                              return (
                                <div
                                  key={attIdx}
                                  onClick={() => setLightboxImage(att.url)}
                                  className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group/img border border-black/10 bg-slate-900"
                                >
                                  <img
                                    src={att.url}
                                    alt="Attached"
                                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                    <Eye className="w-6 h-6 text-white drop-shadow" />
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <a
                                key={attIdx}
                                href={att.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-100/60 border border-emerald-300/80 hover:bg-emerald-200/80 transition-colors text-xs font-bold text-emerald-950"
                              >
                                <FileText className="w-6 h-6 text-emerald-700 flex-shrink-0" />
                                <div className="min-w-0 flex-1 truncate">
                                  <div className="truncate font-black">{att.filename || 'Document Attachment'}</div>
                                  <div className="text-[10px] text-emerald-700">Click to view/download</div>
                                </div>
                                <Download className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                              </a>
                            );
                          })}
                        </div>
                      )}

                      {/* Bottom Meta & Reactions */}
                      <div className="flex items-center justify-between gap-3 mt-1.5 pt-1 border-t border-black/5 text-[10px] text-gray-500">
                        {/* Emoji Reactions List */}
                        <div className="flex flex-wrap gap-1">
                          {msg.reactions && Object.entries(msg.reactions).map(([emoji, userIds]) => {
                            if (!userIds || userIds.length === 0) return null;
                            const hasReacted = currentUser && userIds.includes(currentUser.id);
                            return (
                              <button
                                key={emoji}
                                onClick={() => handleReact(msg.id, emoji)}
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                                  hasReacted
                                    ? 'bg-emerald-200 border-emerald-400 text-emerald-950'
                                    : 'bg-white/80 border-slate-300 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span>{emoji}</span>
                                <span>{userIds.length}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Timestamp & Double Ticks */}
                        <div className="flex items-center gap-1 ml-auto whitespace-nowrap">
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-600 inline" />}
                        </div>
                      </div>
                    </div>

                    {/* Quick Reaction Bar on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1 px-1">
                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="text-[11px] font-bold text-slate-600 hover:text-emerald-800 hover:underline cursor-pointer"
                      >
                        Reply
                      </button>
                      <span className="text-gray-300">•</span>
                      {['👍', '❤️', '🐣', '🔥'].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => handleReact(msg.id, emoji)}
                          className="hover:scale-125 transition-transform text-xs cursor-pointer p-0.5"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ─── BOTTOM MESSAGE INPUT BAR ────────────────────────────────────── */}
          <div className="bg-[#F0F2F5] p-3 border-t border-slate-300 space-y-2 relative">
            {/* Replying Banner */}
            {replyingTo && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-100 border border-emerald-300 text-xs">
                <span className="font-bold text-emerald-900 truncate">
                  Replying to <span className="underline">{replyingTo.senderName}</span>: &ldquo;{replyingTo.content.slice(0, 50)}...&rdquo;
                </span>
                <button onClick={() => setReplyingTo(null)} className="text-emerald-900 font-bold p-1 cursor-pointer">
                  ✕
                </button>
              </div>
            )}

            {/* Pending Attachments preview */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 bg-white rounded-xl border border-slate-200">
                {attachments.map((att, i) => (
                  <div key={i} className="flex items-center gap-2 bg-emerald-50 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                    {att.type === 'image' ? <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> : <FileText className="w-3.5 h-3.5 text-emerald-600" />}
                    <span className="max-w-[150px] truncate">{att.filename || 'File'}</span>
                    <button
                      onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-red-500 font-black cursor-pointer hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Emoji Quick Picker */}
            {showEmojiBar && (
              <div className="flex flex-wrap gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-md">
                {EMOJI_LIST.map(e => (
                  <button
                    key={e}
                    onClick={() => {
                      setInputContent(prev => prev + e);
                      setShowEmojiBar(false);
                    }}
                    className="text-lg hover:scale-125 transition-transform cursor-pointer p-1"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}

            {/* Main Input Row */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              {/* Emoji Button */}
              <button
                type="button"
                onClick={() => setShowEmojiBar(!showEmojiBar)}
                className="p-2 text-slate-600 hover:text-emerald-700 rounded-full transition-colors cursor-pointer"
                title="Add Emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* Attachment Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="p-2 text-slate-600 hover:text-emerald-700 rounded-full transition-colors cursor-pointer"
                  title="Attach Photo or Document"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {showAttachMenu && (
                  <div className="absolute bottom-12 left-0 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 w-44 z-20 animate-in fade-in zoom-in duration-150">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full text-left flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>Photos & Videos</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => docInputRef.current?.click()}
                      className="w-full text-left flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>PDF Document</span>
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => handleFileUpload(e, 'image')}
                  className="hidden"
                />
                <input
                  ref={docInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                  onChange={(e) => handleFileUpload(e, 'document')}
                  className="hidden"
                />
              </div>

              {/* Text Input */}
              <input
                type="text"
                placeholder={
                  currentUser
                    ? 'Type a message, question, or poultry update...'
                    : 'Log in or sign up to participate in community chat...'
                }
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                disabled={!currentUser && !uploading}
                className="flex-1 bg-white text-slate-900 text-xs sm:text-sm py-2.5 px-4 rounded-2xl border border-slate-300 focus:outline-none focus:border-emerald-500 shadow-inner"
              />

              {/* Send or Voice Note Button */}
              {inputContent.trim() || attachments.length > 0 ? (
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-10 h-10 rounded-full bg-[#128C7E] hover:bg-[#075E54] text-white flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                  title="Send Message"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!currentUser) return setShowAuthModal(true);
                    setRecordingAudio(!recordingAudio);
                    if (!recordingAudio) {
                      alert('🎙️ Voice note simulation: Hold microphone or type your message.');
                    }
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
                    recordingAudio ? 'bg-red-500 text-white animate-pulse' : 'bg-[#128C7E] hover:bg-[#075E54] text-white'
                  }`}
                  title="Voice Message"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ─── LIGHTBOX MODAL FOR IMAGES ──────────────────────────────────────── */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img src={lightboxImage} alt="Enlarged" className="max-w-full max-h-full object-contain rounded-2xl" />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full font-black text-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ─── AUTH MODAL (REGISTRATION & ADMIN VERIFICATION) ──────────────────── */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-500/20 space-y-4 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                  🐔
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    {authMode === 'register' ? 'Join Farmer Community' : 'Log In to Community'}
                  </h3>
                  <p className="text-[11px] text-gray-500">Cucu Mutugi Verified Farmer Lounge</p>
                </div>
              </div>
              <button onClick={() => setShowAuthModal(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1 cursor-pointer">
                ✕
              </button>
            </div>

            {/* Toggle Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(null); setAuthSuccess(null); }}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === 'register' ? 'bg-emerald-700 text-white shadow' : 'text-slate-600'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(null); setAuthSuccess(null); }}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === 'login' ? 'bg-emerald-700 text-white shadow' : 'text-slate-600'
                }`}
              >
                Log In
              </button>
            </div>

            {/* Alert Messages */}
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs space-y-1">
                <p className="font-bold">{authSuccess}</p>
                <p className="text-[11px] text-emerald-700">
                  Tip: You can ask the admin to approve your account from the Admin Control Panel.
                </p>
              </div>
            )}

            {/* Form */}
            {!authSuccess && (
              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / Farm Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Farmer Joseph Maina"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full text-xs p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. joseph.maina@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full text-xs p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full text-xs p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {authMode === 'register' && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                        <input
                          type="tel"
                          placeholder="e.g. 0712 345 678"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">County / Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Embu / Nakuru"
                          value={regCounty}
                          onChange={(e) => setRegCounty(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Poultry Breed or Farm Activity</label>
                      <input
                        type="text"
                        placeholder="e.g. 300 Kuroiler layers, Broilers, Incubator"
                        value={regFarmFocus}
                        onChange={(e) => setRegFarmFocus(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-medium flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>To prevent spam, new accounts are verified by the Cucu Mutugi admin before access is granted.</span>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {authSubmitting
                    ? 'Processing...'
                    : authMode === 'register'
                    ? 'Create Account & Request Verification'
                    : 'Log In'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
