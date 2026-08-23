'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Play,
  Image as ImageIcon,
  Film,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Grid,
  SlidersHorizontal,
  Calendar,
  Tag,
  Download
} from 'lucide-react';
import { GALLERY_ITEMS, MediaItem } from '@/lib/mediaData';

interface MediaShowcaseProps {
  title?: string;
  subtitle?: string;
  initialType?: 'all' | 'video' | 'image';
  defaultViewMode?: 'carousel' | 'grid';
  showFilters?: boolean;
}

export default function MediaShowcase({
  title = "Media & Video Resource Hub",
  subtitle = "Browse, scroll, or search our collection of farm walkthroughs, chick brooding guides, delivery dispatches, and photos. Videos play directly on the page.",
  initialType = 'all',
  defaultViewMode = 'carousel',
  showFilters = true
}: MediaShowcaseProps) {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'video' | 'image'>(initialType);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>(defaultViewMode);

  // Lightbox / Modal state
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Chick Care', 'Deliveries', 'Farm Tours', 'Vaccination', 'Breeds', 'Branding & Events'];

  // Filter items based on media type, category, and search query
  const filteredItems = GALLERY_ITEMS.filter((item) => {
    const matchesType = mediaTypeFilter === 'all' || item.type === mediaTypeFilter;
    const matchesCategory = activeTab === 'All' || item.category === activeTab;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesCategory && matchesSearch;
  });

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleNextItem = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(i => i.id === selectedItem.id);
    if (currentIndex !== -1 && currentIndex < filteredItems.length - 1) {
      setSelectedItem(filteredItems[currentIndex + 1]);
    }
  };

  const handlePrevItem = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(i => i.id === selectedItem.id);
    if (currentIndex > 0) {
      setSelectedItem(filteredItems[currentIndex - 1]);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-3 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
          <Film className="w-4 h-4 text-amber-600" /> Interactive Gallery ({filteredItems.length} Assets)
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{title}</h2>
        <p className="text-slate-700 text-base md:text-lg font-medium leading-relaxed">{subtitle}</p>
      </div>

      {/* Controls Bar: Search, Type Toggle, View Toggle */}
      {showFilters && (
        <div className="bg-white p-4 md:p-6 rounded-3xl border-2 border-amber-200 shadow-lg space-y-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search videos or photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-amber-50/60 border border-amber-300 focus:border-amber-500 rounded-2xl py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Media Type Switcher: All | Videos | Photos */}
            <div className="flex items-center gap-1.5 bg-amber-100/70 p-1.5 rounded-2xl border border-amber-200 w-full md:w-auto justify-center">
              <button
                onClick={() => setMediaTypeFilter('all')}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  mediaTypeFilter === 'all'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-amber-200/50'
                }`}
              >
                <Filter className="w-3.5 h-3.5" /> All Media
              </button>
              <button
                onClick={() => setMediaTypeFilter('video')}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  mediaTypeFilter === 'video'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-amber-200/50'
                }`}
              >
                <Film className="w-3.5 h-3.5 text-rose-600" /> Videos ({GALLERY_ITEMS.filter(i => i.type === 'video').length})
              </button>
              <button
                onClick={() => setMediaTypeFilter('image')}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  mediaTypeFilter === 'image'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-amber-200/50'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Photos ({GALLERY_ITEMS.filter(i => i.type === 'image').length})
              </button>
            </div>

            {/* View Mode Toggle: Carousel vs Grid */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-600 hidden lg:inline">Layout:</span>
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode('carousel')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'carousel' ? 'bg-white text-slate-950 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Horizontal Carousel View"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-white text-slate-950 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 no-scrollbar border-t border-amber-200/60">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex-shrink-0 cursor-pointer ${
                  activeTab === cat
                    ? 'bg-slate-950 text-amber-400 shadow-md ring-2 ring-amber-400'
                    : 'bg-amber-50 text-slate-700 hover:bg-amber-100 hover:text-slate-950 border border-amber-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Display: Empty state check */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-amber-300 max-w-4xl mx-auto p-8 space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-600">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900">No media items found</h3>
          <p className="text-slate-600 text-sm font-medium">Try clearing your search query or selecting a different category filter.</p>
          <button
            onClick={() => { setActiveTab('All'); setMediaTypeFilter('all'); setSearchQuery(''); }}
            className="mt-2 btn-primary text-xs !py-2 !px-4"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'carousel' ? (
        /* ===== CAROUSEL VIEW WITH SCROLL BUTTONS ===== */
        <div className="relative max-w-7xl mx-auto group">
          {/* Scroll Left Button */}
          <button
            onClick={() => scrollCarousel('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950/80 text-amber-400 hover:bg-slate-950 hover:scale-110 transition-all flex items-center justify-center shadow-xl backdrop-blur-md border border-amber-400/40"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Scroll Right Button */}
          <button
            onClick={() => scrollCarousel('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-950/80 text-amber-400 hover:bg-slate-950 hover:scale-110 transition-all flex items-center justify-center shadow-xl backdrop-blur-md border border-amber-400/40"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 px-4 scroll-smooth no-scrollbar"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => item.type === 'image' && setSelectedItem(item)}
                className={`flex-shrink-0 w-80 md:w-96 bg-white rounded-3xl overflow-hidden border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group/card flex flex-col transform hover:-translate-y-1.5 ${
                  item.type === 'video'
                    ? 'border-emerald-300 cursor-default'
                    : 'border-amber-200 hover:border-amber-400 cursor-pointer'
                }`}
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <video
                      src={item.url}
                      controls
                      playsInline
                      preload="metadata"
                      poster={item.thumbnail}
                      className="w-full h-full object-cover bg-black"
                    />
                  )}

                  {/* Top Left Badge */}
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-md backdrop-blur-md flex items-center gap-1 ${
                    item.type === 'video' ? 'bg-rose-600 text-white' : 'bg-slate-900/90 text-amber-300 border border-amber-400/30'
                  }`}>
                    {item.type === 'video' ? <Film className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                    {item.type.toUpperCase()}
                  </span>

                  {/* Category Badge */}
                  <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[10px] shadow-sm uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>

                {/* Card Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg group-hover/card:text-amber-600 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs font-medium mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-amber-100 flex items-center justify-between gap-2 text-xs">
                    {item.type === 'video' ? (
                      <span className="flex items-center gap-1 font-bold text-emerald-700">
                        <Play className="w-3.5 h-3.5" /> Play in place
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-bold text-amber-700">
                        <Maximize2 className="w-3.5 h-3.5" /> Click to view
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ===== GRID VIEW ===== */
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => item.type === 'image' && setSelectedItem(item)}
              className={`bg-white rounded-3xl overflow-hidden border-2 shadow-md hover:shadow-xl transition-all duration-300 group/card flex flex-col transform hover:-translate-y-1 ${
                item.type === 'video'
                  ? 'border-emerald-300 cursor-default hover:border-emerald-400'
                  : 'border-amber-200 hover:border-amber-400 cursor-pointer'
              }`}
            >
              <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                {item.type === 'image' ? (
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <video
                    src={item.url}
                    controls
                    playsInline
                    preload="metadata"
                    poster={item.thumbnail}
                    className="w-full h-full object-cover bg-black"
                  />
                )}

                <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-md ${
                  item.type === 'video' ? 'bg-rose-600 text-white' : 'bg-slate-900/90 text-amber-300'
                }`}>
                  {item.type}
                </span>
                <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px]">
                  {item.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover/card:text-amber-600 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between text-xs text-amber-700 font-bold">
                  {item.type === 'video' ? (
                    <span className="flex items-center gap-1 font-bold text-emerald-700">
                      <Play className="w-3.5 h-3.5" /> Play in place
                    </span>
                  ) : (
                    <>
                      <span>View Details</span>
                      <Maximize2 className="w-3.5 h-3.5" />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== FULLSCREEN LIGHTBOX / PLAYER MODAL ===== */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
          {/* Main Modal Container */}
          <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-amber-400/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 text-white">
              <div className="flex items-center gap-3 truncate">
                <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                  selectedItem.type === 'video' ? 'bg-rose-600 text-white' : 'bg-amber-400 text-slate-950'
                }`}>
                  {selectedItem.type}
                </span>
                <h3 className="font-bold text-base md:text-lg truncate text-amber-300 max-w-lg">{selectedItem.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-full bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white transition-all"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Media Content Viewport */}
            <div className="relative flex-1 bg-black min-h-[300px] md:min-h-[460px] flex items-center justify-center overflow-hidden">
              {/* Prev item button */}
              <button
                onClick={handlePrevItem}
                className="absolute left-3 z-10 p-3 rounded-full bg-slate-900/80 hover:bg-amber-400 hover:text-slate-950 text-white transition-all border border-amber-400/30"
                title="Previous Media"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Media element */}
              {selectedItem.type === 'video' ? (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  className="max-h-[65vh] w-full object-contain"
                />
              ) : (
                <div className="relative w-full h-full max-h-[65vh] flex items-center justify-center p-2">
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    className="max-h-[65vh] max-w-full object-contain rounded-xl"
                  />
                </div>
              )}

              {/* Next item button */}
              <button
                onClick={handleNextItem}
                className="absolute right-3 z-10 p-3 rounded-full bg-slate-900/80 hover:bg-amber-400 hover:text-slate-950 text-white transition-all border border-amber-400/30"
                title="Next Media"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Footer / Description & Social Links */}
            <div className="p-5 md:p-6 bg-slate-950 border-t border-slate-800 space-y-4 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-extrabold uppercase">
                    <Tag className="w-3.5 h-3.5" /> {selectedItem.category}
                  </div>
                  <h4 className="text-xl font-black text-white">{selectedItem.title}</h4>
                </div>

                <a
                  href={selectedItem.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all shadow-md flex items-center gap-1 w-fit"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed font-medium">
                {selectedItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
