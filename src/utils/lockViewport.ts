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

  // 3. Matikan pull-to-refresh dan overscroll bounce (swipe atas/bawah melar)
  let startTouchY = 0;
  document.addEventListener(
    'touchstart',
    (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startTouchY = e.touches[0].clientY;
      }
    },
    { passive: true }
  );

  document.addEventListener(
    'touchmove',
    (e: TouchEvent) => {
      // Jika mencoba menarik ke bawah saat scroll sudah di paling atas (rubber banding)
      const touchY = e.touches[0].clientY;
      const isPullingDownAtTop = window.scrollY <= 0 && touchY > startTouchY;
      
      if (isPullingDownAtTop) {
        // Cegah browser memantul elastis ke bawah
        e.preventDefault();
      }
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

  // 6. Cegah overscroll bounce pada boundary scroll
  window.addEventListener(
    'scroll',
    () => {
      // Pastikan tidak ada scroll horizontal liar
      if (window.scrollX !== 0) {
        window.scrollTo(0, window.scrollY);
      }
    },
    { passive: true }
  );
}
