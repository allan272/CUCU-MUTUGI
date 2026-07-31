'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles, ExternalLink } from 'lucide-react';
import { Story } from '@/lib/seeds';

interface StoryViewerModalProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export default function StoryViewerModal({ stories, initialIndex, onClose }: StoryViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [votedIndex, setVotedIndex] = useState<number | null>(null);
  const [pollOptions, setPollOptions] = useState<{ text: string; votes: number }[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartTime = useRef<number>(0);

  const currentStory = stories[currentIndex];

  // Reset state when story changes
  useEffect(() => {
    if (!currentStory) return;
    setLiked(false);
    setLocalLikeCount(currentStory.likes || 0);
    setProgress(0);
    setVotedIndex(null);
    setPollOptions(currentStory.poll?.options ?? []);

    // Track view via public API (fire-and-forget)
    fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'view', storyId: currentStory.id }),
    }).catch(() => {});
  }, [currentIndex, currentStory?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setProgress(0);
    }
  }, [currentIndex]);

  // Auto-progression timer
  useEffect(() => {
    if (isPaused || !currentStory) return;
    const DURATION = currentStory.mediaType === 'video' ? 10000 : 5000;
    const interval = 50;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + (interval / DURATION) * 100;
        return next > 100 ? 100 : next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, currentStory]);

  // Handle progression when progress hits 100
  useEffect(() => {
    if (progress >= 100) {
      handleNext();
    }
  }, [progress, handleNext]);

  // Like via public API
  const handleLikeToggle = () => {
    if (!liked && currentStory) {
      setLiked(true);
      setLocalLikeCount(prev => prev + 1);
      fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', storyId: currentStory.id }),
      }).catch(() => {});
    }
  };

  // Poll vote via public API
  const handlePollVote = (optionIndex: number) => {
    if (!currentStory?.poll || votedIndex !== null) return;
    setVotedIndex(optionIndex);
    setPollOptions(prev =>
      prev.map((opt, i) => (i === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt))
    );
    fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'vote', storyId: currentStory.id, optionIndex }),
    }).catch(() => {});
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') setIsPaused(p => !p);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleNext, handlePrev, onClose]);

  if (!currentStory) return null;

  const totalVotes = pollOptions.reduce((sum, o) => sum + o.votes, 0) || 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center backdrop-blur-md">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Story Card */}
      <div
        className="relative w-full max-w-md h-[90vh] max-h-[820px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between z-10 border border-slate-800"
        onMouseDown={() => { touchStartTime.current = Date.now(); setIsPaused(true); }}
        onMouseUp={() => { setIsPaused(false); }}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* ── Progress bars ── */}
        <div className="absolute top-0 left-0 right-0 z-30 p-3 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex gap-1.5 mb-3">
            {stories.map((s, idx) => (
              <div key={s.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{
                    width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Author header */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full ring-2 ring-cyan-400 overflow-hidden relative bg-white/20">
                <Image src="/logo.png" alt="Cucu Mutugi" fill sizes="40px" className="object-contain p-0.5" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <span>Cucu Mutugi Poultry</span>
                  {currentStory.featured && <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="bg-cyan-500/80 px-2 py-0.5 rounded-full text-[10px] uppercase font-extrabold tracking-wider text-white">
                    {currentStory.category}
                  </span>
                  <span>•</span>
                  <span>{new Date(currentStory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentStory.mediaType === 'video' && (
                <button
                  onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                  className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}
              <button onClick={onClose} className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Media ── */}
        <div className="relative flex-1 w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden">
          {currentStory.mediaType === 'video' ? (
            <video
              ref={videoRef}
              src={currentStory.mediaUrl}
              autoPlay
              playsInline
              muted={isMuted}
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={currentStory.mediaUrl || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'}
              alt={currentStory.title}
              fill
              sizes="(max-width: 768px) 100vw, 448px"
              className="object-cover"
              priority
            />
          )}

          {/* Tap zones for prev/next */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-0 top-16 bottom-32 w-1/3 z-20 focus:outline-none"
            aria-label="Previous story"
          />
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-0 top-16 bottom-32 w-1/3 z-20 focus:outline-none"
            aria-label="Next story"
          />
        </div>

        {/* ── Bottom overlay: title, description, poll, CTA ── */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-5 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent space-y-4">
          <h2 className="text-xl font-extrabold text-white leading-snug drop-shadow-md">
            {currentStory.title}
          </h2>

          {currentStory.description && (
            <p className="text-sm text-slate-200 font-medium leading-relaxed bg-black/40 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              {currentStory.description}
            </p>
          )}

          {/* Poll */}
          {currentStory.poll && pollOptions.length > 0 && (
            <div className="bg-slate-900/90 border border-cyan-500/30 p-4 rounded-xl space-y-2.5 backdrop-blur-md">
              <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                {currentStory.poll.question}
              </p>
              {pollOptions.map((opt, idx) => {
                const percentage = Math.round((opt.votes / totalVotes) * 100);
                const hasVoted = votedIndex !== null;
                return (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); handlePollVote(idx); }}
                    disabled={hasVoted}
                    className={`relative w-full overflow-hidden p-2.5 rounded-lg border text-left text-xs font-semibold transition-all ${
                      votedIndex === idx
                        ? 'border-cyan-400 bg-cyan-950/60 text-white'
                        : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 disabled:cursor-default'
                    }`}
                  >
                    {hasVoted && (
                      <div
                        className="absolute inset-0 bg-cyan-600/30 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    )}
                    <div className="relative z-10 flex items-center justify-between">
                      <span>{opt.text}</span>
                      {hasVoted && <span className="font-bold text-cyan-300">{percentage}%</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer: CTA + Like */}
          <div className="flex items-center justify-between gap-3 pt-1">
            {currentStory.actionUrl ? (
              <Link
                href={currentStory.actionUrl}
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm py-3 px-5 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span>{currentStory.actionText || 'Explore Now'}</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            <button
              onClick={(e) => { e.stopPropagation(); handleLikeToggle(); }}
              className={`p-3 rounded-xl border transition-all flex items-center gap-1.5 ${
                liked
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 scale-105'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
              <span className="text-xs font-bold">{localLikeCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Prev/Next arrows */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white transition z-40 cursor-pointer"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>
      <button
        onClick={handleNext}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition z-40 cursor-pointer"
      >
        <ChevronRight className="w-7 h-7" />
      </button>
    </div>
  );
}
