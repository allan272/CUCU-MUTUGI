import PoultryUpdatesBar from '@/components/stories/PoultryUpdatesBar';
import { Clock, Sparkles, Sprout, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: '24-Hour Status Updates | Cucu Mutugi Poultry',
  description: 'Real-time 24-hour farm updates, chick availability, dispatches, and daily announcements from Cucu Mutugi Poultry.',
};

export default function PoultryUpdatesPage() {
  return (
    <div className="min-h-[85vh] flex flex-col bg-[#FFFDF0] pb-20">
      {/* ===== HERO HEADER (Green & Yellow Blend) ===== */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400 bg-gradient-to-br from-emerald-800 via-emerald-700 to-amber-600 text-white overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FEF08A_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-md">
            <Clock className="w-4 h-4 text-emerald-900" /> Live 24-Hour Farm Status Hub
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-amber-300 drop-shadow-md">
            24-Hour <span className="text-white">Status Updates</span>
          </h1>

          <p className="text-emerald-100 text-lg md:text-xl font-bold max-w-2xl mx-auto leading-relaxed">
            Real-time daily updates from Cucu Mutugi Poultry — fresh chick batch dispatches, brooding alerts, and farm announcements.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-black text-amber-200">
            <span className="bg-emerald-900/60 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Updates expire after 24 hours
            </span>
            <span className="bg-emerald-900/60 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Verified by Cucu Mutugi Team
            </span>
          </div>
        </div>
      </section>

      {/* ===== STORIES & STATUS UPDATES BAR ===== */}
      <section className="flex-1 w-full bg-slate-950 py-12 border-b-2 border-emerald-700/30">
        <div className="max-w-7xl mx-auto px-4">
          <PoultryUpdatesBar />
          
          <div className="max-w-xl mx-auto mt-12 p-6 bg-slate-900 rounded-3xl border border-emerald-500/30 text-center space-y-2 text-slate-300 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-black text-base text-amber-300">Tap Any Circle Above to View Update</h3>
            <p className="text-xs font-medium text-slate-400 leading-relaxed">
              Status updates stay active for exactly 24 hours from release. Tap to watch videos, inspect photos, or vote on interactive farmer polls.
            </p>
          </div>
        </div>
      </section>

      {/* ===== ACTION & NAVIGATION ===== */}
      <section className="max-w-4xl mx-auto px-4 pt-12 text-center space-y-6">
        <div className="p-8 rounded-3xl bg-amber-100/60 border-2 border-amber-300 shadow-md space-y-4">
          <h3 className="text-2xl font-black text-emerald-950 flex items-center justify-center gap-2">
            Want to Order Chicks from Today's Update? <Sprout className="w-6 h-6 text-emerald-700" />
          </h3>
          <p className="text-slate-800 font-bold text-base max-w-xl mx-auto">
            Our delivery vans leave every Wednesday & Thursday across 14+ counties in Kenya. Book your pre-vaccinated chicks now!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/products" className="btn-primary text-base flex items-center justify-center gap-2 shadow-xl">
              Order Chicks Now
            </Link>
            <Link href="/resources" className="btn-outline text-base flex items-center justify-center gap-2 shadow-md">
              Farmer Resources
            </Link>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-900 font-extrabold hover:text-emerald-700 transition-colors bg-white px-6 py-3 rounded-full border-2 border-emerald-300 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-emerald-700" /> Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
