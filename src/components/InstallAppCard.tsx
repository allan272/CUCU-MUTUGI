'use client';
import { useEffect, useState } from 'react';
import { Download, Smartphone, Sparkles } from 'lucide-react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export default function InstallAppCard() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setCanInstall(false);
      setInstalling(false);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
      setCanInstall(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-emerald-800 text-white rounded-3xl p-6 border border-amber-400/30 shadow-2xl overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.2),_transparent_40%)]" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-[0.24em] mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Mobile App
            </div>
            <h3 className="text-2xl font-black">Install cucumutugi</h3>
            <p className="text-sm text-emerald-100 mt-2 max-w-md">
              Add cucumutugi to your phone for faster access, offline-friendly opening, and one-tap return visits.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
            <Smartphone className="h-7 w-7 text-amber-300" />
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleInstall}
            disabled={!canInstall || installing}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 font-black text-slate-950 transition-colors hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            {installing ? 'Opening installer...' : canInstall ? 'Install cucumutugi' : 'Install not available yet'}
          </button>
          <a
            href="/manifest.json"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10 transition-colors"
          >
            View App Manifest
          </a>
        </div>
      </div>
    </div>
  );
}
