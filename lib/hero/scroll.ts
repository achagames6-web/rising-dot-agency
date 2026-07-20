// lib/hero/scroll.ts
// Scroll progress lives outside React on purpose.
// useFrame reads it every frame; React never re-renders because of it.

import { useEffect } from 'react';
import { clamp } from './config';

export const scrollState = {
  /** 0 at the top of the hero track, 1 at the bottom. */
  progress: 0,
  /** Smoothed value the scene actually renders. Set by the CameraRig. */
  smooth: 0,
  /** True once the user has scrolled at all — used to hide the scroll hint. */
  moved: false,
};

type Listener = (p: number) => void;
const listeners = new Set<Listener>();

export function onProgress(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function setProgress(p: number) {
  const next = clamp(p);
  if (next > 0.001) scrollState.moved = true;
  scrollState.progress = next;
  listeners.forEach((fn) => fn(next));
}

/**
 * Drives scrollState from a scroll-track element and runs Lenis for inertia.
 * Pass a ref to the tall wrapper that contains the sticky canvas.
 */
export function useHeroScroll(
  trackRef: React.RefObject<HTMLElement | null>,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let frame = 0;
    let cancelled = false;

    const measure = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      if (distance <= 0) return;
      setProgress(-rect.top / distance);
    };

    const loop = (time: number) => {
      lenis?.raf(time);
      measure();
      frame = requestAnimationFrame(loop);
    };

    // Lenis is imported lazily so the hero never blocks first paint.
    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        syncTouch: false,
      }) as unknown as { raf: (t: number) => void; destroy: () => void };
      frame = requestAnimationFrame(loop);
    });

    // Fallback loop in case Lenis fails to load — the hero still works.
    frame = requestAnimationFrame(loop);
    window.addEventListener('resize', measure);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
      lenis?.destroy();
    };
  }, [trackRef, enabled]);
}
