'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Play, Eye, Heart, Search, Sparkles, Filter, X, Volume2, VolumeX, Calendar } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Video } from '@/lib/seeds';

const CATEGORIES = [
  'All',
  'Farm Tours',
  'Vaccination',
  'Chicken Feeding',
  'Incubation',
  'Customer Visits',
  'Construction',
  'Success Stories',
  'Equipment',
  'Daily Activities'
];

export default function VideosPage() {
  const { db, likeVideo } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [likedVideos, setLikedVideos] = useState<Record<string, boolean>>({});

  const videos = db.videos || [];

  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === 'All' || video.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePlayVideo = (video: Video) => {
    setActiveVideo(video);
    // Increment view count via public API
    fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'view', videoId: video.id })
    }).catch(() => {});
  };

  const handleLike = (video: Video) => {
    if (!likedVideos[video.id]) {
      setLikedVideos(prev => ({ ...prev, [video.id]: true }));
      likeVideo(video.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* ===== HERO HEADER ===== */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-gradient-to-b from-blue-950/60 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#00BCD4_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent-light text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-accent" /> Cucu Mutugi Media Hub
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Poultry <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">Videos & Tutorials</span>
          </h1>

          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Watch expert farm walkthroughs, chick vaccination guides, incubation methods, and success stories from Kenyan poultry farmers.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search videos by title or topic…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-accent rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES FILTER BAR ===== */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-900 bg-slate-900/40 sticky top-16 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider pr-2 flex-shrink-0">
            <Filter className="w-3.5 h-3.5 text-accent" /> Category:
          </div>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-accent to-accent-dark text-slate-900 shadow-md shadow-accent/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ===== VIDEO GRID ===== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Play className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-300">No videos found</h3>
            <p className="text-slate-400 text-sm">Try clearing your search query or selecting a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map(video => (
              <div
                key={video.id}
                onClick={() => handlePlayVideo(video)}
                className="group bg-slate-900 border border-slate-800 hover:border-accent/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  <Image
                    src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-accent text-slate-900 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-accent-light transition-all">
                      <Play className="w-6 h-6 fill-slate-900 ml-0.5" />
                    </div>
                  </div>

                  {/* Category Tag */}
                  <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-accent border border-white/10">
                    {video.category}
                  </span>

                  {/* Duration Badge */}
                  {video.duration && (
                    <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-xs font-bold text-white">
                      {video.duration}
                    </span>
                  )}
                </div>

                {/* Content info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-accent-light transition-colors line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Eye className="w-3.5 h-3.5 text-accent-light" /> {video.views || 0}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleLike(video); }}
                        className={`flex items-center gap-1 hover:text-rose-400 transition ${
                          likedVideos[video.id] ? 'text-rose-500 font-bold' : ''
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedVideos[video.id] ? 'fill-rose-500' : ''}`} />
                        <span>{(video.likes || 0) + (likedVideos[video.id] ? 1 : 0)}</span>
                      </button>
                    </div>

                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-slate-500" /> {video.createdAt}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ===== FULL-SCREEN VIDEO PLAYER OVERLAY ===== */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-xl">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2.5">
                <span className="bg-accent/20 text-accent px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                  {activeVideo.category}
                </span>
                <h2 className="font-bold text-sm sm:text-base truncate max-w-md">{activeVideo.title}</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Viewport */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                muted={isMuted}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Bottom Info Bar */}
            <div className="p-6 bg-slate-950 border-t border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{activeVideo.title}</h2>
                  <p className="text-slate-300 text-sm mt-1 leading-relaxed">{activeVideo.description}</p>
                </div>
                <button
                  onClick={() => handleLike(activeVideo)}
                  className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 font-bold text-sm transition-all ${
                    likedVideos[activeVideo.id]
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedVideos[activeVideo.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{(activeVideo.likes || 0) + (likedVideos[activeVideo.id] ? 1 : 0)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
