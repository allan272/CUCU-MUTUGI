'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Video as VideoIcon, Clock, ArrowRight } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import StoryViewerModal from './StoryViewerModal';

export default function PoultryUpdatesBar() {
  const { db } = useAdmin();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [seenStories, setSeenStories] = useState<Record<string, boolean>>({});

  const stories = db.stories || [];

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cucu_seen_stories');
      if (raw) setSeenStories(JSON.parse(raw));
    } catch {}
  }, []);

  const now = Date.now();
  const activeStories = stories.filter(story => {
    if (story.expiresAt) {
      return new Date(story.expiresAt).getTime() > now;
    }
    if (story.createdAt) {
      const created = new Date(story.createdAt).getTime();
      return now - created < 24 * 60 * 60 * 1000;
    }
    return false;
  });

  const handleOpenStory = (index: number, storyId: string) => {
    setSelectedStoryIndex(index);
    setSeenStories(prev => {
      const updated = { ...prev, [storyId]: true };
      try {
        localStorage.setItem('cucu_seen_stories', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  if (activeStories.length === 0) {
    return (
      <section className="w-full border-b border-amber-400/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 py-6 text-white shadow-inner">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-5 backdrop-blur-md md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/20">
              <Clock className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300">
                Poultry updates
              </p>
              <h3 className="text-lg font-black text-white">No active 24-hour updates right now</h3>
              <p className="max-w-2xl text-sm text-slate-300">
                Updates expire automatically after 24 hours. Only the admin can post new updates, and they appear here until they expire.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full border-b border-amber-400/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 py-4 text-white shadow-inner">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-amber-300">
                Latest farm stories
              </p>
              <h2 className="text-lg font-black text-white">Tap to open the full-screen update</h2>
            </div>
          </div>
          <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300 md:inline-flex">
            {activeStories.length} active
          </span>
        </div>

        <div className="grid gap-3 overflow-x-auto pb-1 md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
          {activeStories.map((story, index) => {
            const isSeen = !!seenStories[story.id];

            return (
              <button
                key={story.id}
                onClick={() => handleOpenStory(index, story.id)}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-white/8 focus:outline-none"
              >
                <div className="relative h-36 w-full">
                  <Image
                    src={story.mediaUrl || '/media/gallery/WhatsApp%20Image%202026-01-20%20at%208.38.20%20PM.jpeg'}
                    alt={story.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] ${
                        isSeen ? 'bg-white/10 text-white/70' : 'bg-amber-400 text-slate-950'
                      }`}
                    >
                      {isSeen ? 'Seen' : 'New'}
                    </span>
                    {story.mediaType === 'video' && (
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                        <VideoIcon className="h-4 w-4" />
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-black leading-tight text-white drop-shadow-md">
                      {story.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-200/90">
                      {story.description || 'Open the post to see the full update.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="text-xs text-slate-300">
                    <span className="font-bold text-amber-300">{story.category}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                    Open
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedStoryIndex !== null && (
        <StoryViewerModal
          stories={activeStories}
          initialIndex={selectedStoryIndex}
          onClose={() => setSelectedStoryIndex(null)}
        />
      )}
    </section>
  );
}
