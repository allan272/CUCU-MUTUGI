'use client';
import { useEffect, useState } from 'react';
import { initGlobalTracker } from '@/lib/tracker';

export default function ServiceWorkerRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    initGlobalTracker();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✓ Service Worker registered:', registration.scope);

          // Listen for an updated SW waiting to activate
          registration.onupdatefound = () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.onstatechange = () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              };
            }
          };
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });

      // Listen for the "APP_UPDATED" message broadcast from sw.js activate event
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'APP_UPDATED') {
          setUpdateAvailable(true);
        }
      });
    }
  }, []);

  if (!updateAvailable) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] bg-slate-950 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl border border-amber-400 flex items-center gap-3 max-w-sm w-[92vw] animate-in slide-in-from-bottom-4"
      role="alert"
    >
      <span className="text-xl flex-shrink-0">🐣</span>
      <span className="flex-1 leading-tight text-xs font-semibold text-amber-200">
        Cucu Mutugi app updated with new features!
      </span>
      <button
        onClick={() => window.location.reload()}
        className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl flex-shrink-0 transition-all"
      >
        Reload
      </button>
      <button
        onClick={() => setUpdateAvailable(false)}
        className="text-slate-400 hover:text-white text-xs flex-shrink-0 ml-1"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
