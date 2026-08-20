'use client';

export function trackButtonClick(buttonName: string, metadata?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  try {
    const page = window.location.pathname;
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'button_click',
        buttonName,
        page,
        metadata,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export function trackSearch(query: string, page?: string) {
  if (typeof window === 'undefined' || !query.trim()) return;
  try {
    const currentPage = page || window.location.pathname;
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'search',
        query: query.trim(),
        page: currentPage,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export function trackEmailCaptured(email: string, source: string = 'Website Form') {
  if (typeof window === 'undefined' || !email.trim()) return;
  try {
    const page = window.location.pathname;
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'email_captured',
        email: email.trim(),
        page,
        metadata: { source },
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export function initGlobalTracker() {
  if (typeof window === 'undefined') return;

  // Global click listener to track interactive buttons & CTAs
  const handleGlobalClick = (e: MouseEvent) => {
    try {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const btn = target.closest('button, a, [role="button"]');
      if (!btn) return;

      // Don't track admin internal navigation buttons to avoid cluttering customer logs
      if (window.location.pathname.startsWith('/admin')) return;

      const text = (btn.textContent || '').trim().replace(/\s+/g, ' ');
      const aria = btn.getAttribute('aria-label') || '';
      const title = btn.getAttribute('title') || '';
      const href = btn.getAttribute('href') || '';
      const buttonName = text.slice(0, 60) || aria || title || (href ? `Link: ${href}` : 'Interactive Element');

      if (buttonName && buttonName.length > 1) {
        trackButtonClick(buttonName, { href: href || undefined });
      }
    } catch {}
  };

  document.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
}
