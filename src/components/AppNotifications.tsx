'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, BellRing, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { AppNotification } from '@/lib/seeds';

export default function AppNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const loadedOnceRef = useRef(false);
  const seenIdsRef = useRef<Set<string>>(new Set());

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  useEffect(() => {
    let mounted = true;

    const syncNotifications = async () => {
      try {
        const res = await fetch('/api/notifications?scope=customer');
        if (!res.ok) return;
        const data = await res.json();
        const rawIncoming: AppNotification[] = Array.isArray(data.notifications) ? data.notifications : [];
        const incoming = rawIncoming.filter(item => item.type !== 'finance' && item.scope !== 'admin');

        if (!mounted) return;

        const incomingIds = new Set(incoming.map((item) => item.id));
        if (loadedOnceRef.current && typeof window !== 'undefined' && 'Notification' in window) {
          const newItems = incoming.filter((item) => !seenIdsRef.current.has(item.id));
          if (permission === 'granted') {
            newItems.slice(0, 3).forEach((item) => {
              // Browser alert for installed users who opted in
              new Notification(item.title, {
                body: item.body,
                icon: '/cucumutugi-logo.png',
                tag: item.id,
              });
            });
          }
        }

        seenIdsRef.current = incomingIds;
        loadedOnceRef.current = true;
        setNotifications(incoming);
      } catch {
        // Silent fallback
      }
    };

    syncNotifications();
    const timer = window.setInterval(syncNotifications, 60000);
    const onFocus = () => {
      syncNotifications().catch(() => {});
    };
    const onVisibilityChange = () => {
      if (!document.hidden) {
        syncNotifications().catch(() => {});
      }
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      mounted = false;
      window.clearInterval(timer);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [permission]);

  const enableNotifications = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const markRead = async (id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
    fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'read', id }),
    }).catch(() => {});
  };

  return (
    <div className="fixed bottom-4 left-4 right-auto z-40 w-[calc(100vw-2rem)] max-w-sm sm:left-6 sm:w-[22rem]">
      <div className="rounded-3xl border border-white/10 bg-slate-950/95 text-white shadow-2xl backdrop-blur-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/20">
              {permission === 'granted' ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Updates</p>
              <p className="text-sm font-semibold text-white/90">
                {unreadCount ? `${unreadCount} unread alert${unreadCount === 1 ? '' : 's'}` : 'No unread alerts'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {permission !== 'granted' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  enableNotifications();
                }}
                className="rounded-full bg-amber-400 px-3 py-1.5 text-xs font-black text-slate-950 transition hover:bg-amber-300"
              >
                Enable
              </button>
            )}
            {open ? <ChevronDown className="h-4 w-4 text-white/60" /> : <ChevronUp className="h-4 w-4 text-white/60" />}
          </div>
        </button>

        {open && (
          <div className="border-t border-white/10 bg-white/5">
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-5 text-sm text-white/60">No notifications yet. New stories and updates will appear here.</div>
              ) : (
                notifications.slice(0, 6).map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => markRead(notification.id)}
                    className={`w-full border-b border-white/5 px-4 py-3 text-left transition last:border-b-0 hover:bg-white/5 ${
                      notification.read ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">{notification.title}</p>
                        <p className="mt-1 text-sm text-slate-300 line-clamp-2">{notification.body}</p>
                      </div>
                      <X className="h-3.5 w-3.5 shrink-0 text-white/30" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
