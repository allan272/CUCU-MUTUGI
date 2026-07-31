'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Video as VideoIcon } from 'lucide-react';
import { Story } from '@/lib/seeds';
import StoryViewerModal from './StoryViewerModal';

export default function PoultryUpdatesBar() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [seenStories, setSeenStories] = useState<Record<string, boolean>>({});

  // Fetch stories from public API — no AdminProvider dependency
  useEffect(() => {
    fetch('/api/stories')
      .then(res => res.json())
      .then(data => {
        if (data?.stories) setStories(data.stories);
      })
      .catch(() => {
        // Silently fail — bar will simply not appear
      });
  }, []);

  // Restore "seen" state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cucu_seen_stories');
      if (raw) setSeenStories(JSON.parse(raw));
    } catch {}
  }, []);

  // Filter out expired stories
  const now = Date.now();
  const activeStories = stories.filter(story => {
    if (story.featured) return true;
    if (!story.expiresAt) return true;
    return new Date(story.expiresAt).getTime() > now;
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

  // Hide bar when there are no active stories
  if (activeStories.length === 0) return null;

  return (
    <section className="w-full bg-slate-950/90 backdrop-blur-md border-b-2 border-amber-400/80 py-4 px-4 sm:px-6 shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">

        {/* Brand icon */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-amber-400">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
          </div>
          <span className="text-[11px] font-extrabold text-amber-400 mt-1.5 tracking-wide">
            Poultry Updates
          </span>
        </div>

        <div className="h-10 w-px bg-amber-400/30 flex-shrink-0 hidden sm:block" />

        {/* Story Circles */}
        <div className="flex items-center gap-4">
          {activeStories.map((story, index) => {
            const isSeen = !!seenStories[story.id];
            return (
              <button
                key={story.id}
                onClick={() => handleOpenStory(index, story.id)}
                className="flex-shrink-0 flex flex-col items-center text-center group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-16 h-16 rounded-full p-0.5 transition-all duration-300 transform group-hover:scale-105 ${
                    isSeen
                      ? 'bg-slate-700 opacity-70'
                      : 'bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 shadow-md shadow-amber-400/20'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-slate-950 bg-slate-800">
                    <Image
                      src={story.mediaUrl || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80'}
                      alt={story.title}
                      fill
                      sizes="64px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {story.mediaType === 'video' && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <VideoIcon className="w-4 h-4 text-white drop-shadow" />
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-200 mt-1.5 max-w-[72px] truncate group-hover:text-amber-400 transition-colors">
                  {story.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-screen story viewer */}
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
