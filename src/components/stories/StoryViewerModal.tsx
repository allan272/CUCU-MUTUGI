'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Sparkles,
  ExternalLink,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
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
  const [progress, setProgress] = useState(0);
  const [votedIndex, setVotedIndex] = useState<number | null>(null);
  const [pollOptions, setPollOptions] = useState<{ text: string; votes: number }[]>([]);
  const [showDetails, setShowDetails] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!currentStory) return;
    setProgress(0);
    setVotedIndex(null);
    setPollOptions(currentStory.poll?.options ?? []);
    setShowDetails(true);

    fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'view', storyId: currentStory.id }),
    }).catch(() => {});
  }, [currentIndex, currentStory?.id]);

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

  useEffect(() => {
    if (isPaused || !currentStory) return;
    const duration = currentStory.mediaType === 'video' ? 10000 : 5000;
    const interval = 50;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + (interval / duration) * 100;
        return next > 100 ? 100 : next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, currentStory]);

  useEffect(() => {
    if (progress >= 100) {
      handleNext();
    }
  }, [progress, handleNext]);

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

  if (!currentStory) return null;

  const totalVotes = pollOptions.reduce((acc, curr) => acc + curr.votes, 0) || 1;
  const hasPoll = !!currentStory.poll && pollOptions.length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-4">
      <div
        className="relative w-full h-full md:h-[92vh] md:max-h-[920px] md:max-w-5xl bg-slate-950 md:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col border border-white/10"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.15),transparent_36%),linear-gradient(180deg,rgba(15,23,42,0.18),rgba(2,6,23,0.88))]" />
        </div>

        <div className="absolute top-0 left-0 right-0 z-30 p-4 md:p-5 bg-gradient-to-b from-slate-950/95 via-slate-950/50 to-transparent space-y-3">
          <div className="flex items-center gap-1.5">
            {stories.map((s, idx) => (
              <div key={s.id} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-75 ease-linear"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full ring-2 ring-amber-400 overflow-hidden relative bg-white/20 shadow-lg shadow-amber-400/20">
                <Image src="/logo.png" alt="Cucu Mutugi" fill sizes="44px" className="object-contain p-0.5" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <span>Cucu Mutugi Poultry</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider">
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
                  onClick={e => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition border border-white/10"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-0 z-20 px-4 md:px-6 pt-[92px] pointer-events-none">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-white/55">
            <span>{currentStory.category}</span>
            <button
              onClick={e => {
                e.stopPropagation();
                setShowDetails(prev => !prev);
              }}
              className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/80 hover:text-white hover:bg-black/50 transition"
            >
              {showDetails ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
              {showDetails ? 'Hide details' : 'Show details'}
            </button>
          </div>
        </div>

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
              src={currentStory.mediaUrl || '/media/gallery/WhatsApp%20Image%202026-01-20%20at%208.38.20%20PM.jpeg'}
              alt={currentStory.title}
              fill
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
              priority
            />
          )}

          <button
            onClick={e => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-0 top-20 bottom-24 w-1/3 z-20 focus:outline-none"
            aria-label="Previous story"
          />
          <button
            onClick={e => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-0 top-20 bottom-24 w-1/3 z-20 focus:outline-none"
            aria-label="Next story"
          />
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 z-30 p-4 md:p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent transition-all duration-300 ${
            showDetails ? 'translate-y-0' : 'translate-y-[72%]'
          }`}
        >
          <div className="mx-auto max-w-2xl space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md">
                  {currentStory.title}
                </h2>
                {currentStory.description && (
                  <p className="max-w-xl text-sm md:text-[15px] text-slate-200 leading-relaxed">
                    {currentStory.description}
                  </p>
                )}
              </div>

              {currentStory.actionUrl && (
                <Link
                  href={currentStory.actionUrl}
                  onClick={onClose}
                  className="hidden sm:inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-black text-slate-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300"
                >
                  <span>{currentStory.actionText || 'Open'}</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
            </div>

            {hasPoll && (
              <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-md">
                <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-amber-300">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  {currentStory.poll?.question}
                </p>
                <div className="space-y-2">
                  {pollOptions.map((opt, idx) => {
                    const percentage = Math.round((opt.votes / totalVotes) * 100);
                    const hasVoted = votedIndex !== null;
                    return (
                      <button
                        key={idx}
                        onClick={e => {
                          e.stopPropagation();
                          handlePollVote(idx);
                        }}
                        disabled={hasVoted}
                        className={`relative w-full overflow-hidden rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                          votedIndex === idx
                            ? 'border-amber-400 bg-amber-400/15 text-white'
                            : 'border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 disabled:cursor-default'
                        }`}
                      >
                        {hasVoted && (
                          <div
                            className="absolute inset-y-0 left-0 bg-amber-400/25 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        )}
                        <div className="relative z-10 flex items-center justify-between gap-3">
                          <span>{opt.text}</span>
                          {hasVoted && <span className="text-xs font-black text-amber-300">{percentage}%</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStory.actionUrl && (
              <Link
                href={currentStory.actionUrl}
                onClick={onClose}
                className="inline-flex sm:hidden w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300"
              >
                <span>{currentStory.actionText || 'Open'}</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

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
