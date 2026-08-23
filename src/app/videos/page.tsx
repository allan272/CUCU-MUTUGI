'use client';

import MediaShowcase from '@/components/MediaShowcase';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF0] text-slate-900 flex flex-col pb-20">
      {/* ===== HERO HEADER ===== */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400 bg-gradient-to-b from-amber-400 to-amber-300 overflow-hidden shadow-md">
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 text-amber-300 text-xs font-black uppercase tracking-widest shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400" /> Cucu Mutugi Media & Video Hub
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950">
            Poultry <span className="text-amber-800">Videos & Photo Gallery</span>
          </h1>

          <p className="text-slate-950 text-lg md:text-xl font-bold max-w-2xl mx-auto leading-relaxed">
            Watch real farm walkthroughs, chick vaccination guides, feeding practices, and delivery dispatches directly on the page.
          </p>
        </div>
      </section>

      {/* ===== MEDIA SHOWCASE COMPONENT ===== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-12">
        <MediaShowcase
          title="Explore Our Complete Media Collection"
          subtitle="Scroll horizontally through our interactive carousel or switch to grid view to search and play any video directly on the page."
          defaultViewMode="carousel"
          showFilters={true}
        />

        {/* Back Link */}
        <div className="flex justify-center pt-8 border-t border-amber-200">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-slate-900 font-extrabold hover:text-amber-600 transition-colors bg-white px-6 py-3 rounded-full border-2 border-amber-300 shadow-md"
          >
            <ArrowLeft className="w-5 h-5 text-amber-600" /> Back to Farmer Resources
          </Link>
        </div>
      </main>
    </div>
  );
}
