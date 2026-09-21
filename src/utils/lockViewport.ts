/**
 * Viewport Lock & Anti-Zoom Guard
 * Mematikan auto-zoom (pinch-to-zoom, double-tap zoom, keyboard zoom, wheel zoom)
 * dan menonaktifkan elastic overscroll / swipe gaya bebas atas-bawah.
 */
export function initViewportLock() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 1. Matikan iOS gesturestart/gesturechange/gestureend (Pinch to zoom)
  const preventGesture = (e: Event) => {
    e.preventDefault();
  };
  document.addEventListener('gesturestart', preventGesture, { passive: false });
  document.addEventListener('gesturechange', preventGesture, { passive: false });
  document.addEventListener('gestureend', preventGesture, { passive: false });

  // 2. Matikan multi-touch pinch pada touchstart (2 jari atau lebih)
  document.addEventListener(
    'touchstart',
    (e: TouchEvent) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  // 3. Matikan Double-tap to zoom (dua ketukan cepat < 300ms)
  let lastTouchEndTime = 0;
  document.addEventListener(
    'touchend',
    (e: TouchEvent) => {
      const now = Date.now();
      // Hanya batalkan jika bukan elemen tombol submit atau input form
      const target = e.target as HTMLElement | null;
      const isInteractiveInput =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT');

      if (!isInteractiveInput && now - lastTouchEndTime <= 300) {
        e.preventDefault();
      }
      lastTouchEndTime = now;
    },
    { passive: false }
  );

  // 4. Matikan Ctrl / Cmd + Mouse Wheel Zoom pada desktop
  document.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  // 5. Matikan Keyboard shortcut zoom (Ctrl/Cmd + '+', '-', '0')
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0' || e.code === 'NumpadAdd' || e.code === 'NumpadSubtract')
    ) {
      e.preventDefault();
    }
  });

  // 6. Cegah overscroll bounce elastis di level window
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY < 0) {
        window.scrollTo(0, 0);
      }
    },
    { passive: true }
  );
}
