import { Metadata } from 'next';
import CommunityChatView from '@/components/chat/CommunityChatView';
import { MessageSquare, Users, Sparkles, ShieldCheck, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Farmers Community Lounge | CUCU MUTUGI POULTRY',
  description: 'Join the Cucu Mutugi Poultry Farmers Community. Chat, share brooding advice, post poultry photos and documents, and connect with farmers across Kenya.',
};

export default function CommunityPage() {
  return (
    <div className="bg-[#F0F2F5] min-h-screen text-slate-900 pb-16">
      {/* Top Emerald Header */}
      <section className="bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#0A4D44] text-white py-10 px-4 border-b-4 border-amber-400 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950/60 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Official Farmer Social Platform
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Cucu Mutugi Farmers Lounge
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base mt-1 max-w-2xl font-medium">
              A verified poultry network where Kenyan farmers chat, share flock photos & documents, exchange brooding advice, and connect in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center">
              <div className="text-2xl font-black text-amber-300">6</div>
              <div className="text-[11px] font-bold text-emerald-100 uppercase">Live Lounges</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center">
              <div className="text-2xl font-black text-emerald-300">100%</div>
              <div className="text-[11px] font-bold text-emerald-100 uppercase">Verified Farmers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main WhatsApp Chat Component */}
      <CommunityChatView />
    </div>
  );
}
