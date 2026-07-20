// lib/hero/scroll.ts
// Scroll progress lives outside React on purpose.
// useFrame reads it every frame; React never re-renders because of it.

import { useEffect } from 'react';
import { clamp } from './journey';

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
 * Drives scrollState from the hero's scroll track.
 *
 * Deliberately does NOT create a Lenis instance. The app already runs one
 * globally via SmoothScrollProvider, and a second instance fights it: both
 * intercept the wheel and both write scroll position every frame, so once
 * one settles the other snaps the page to its own target. That was the jump
 * after scrolling stopped. This only reads position.
 */
export function useHeroScroll(
  trackRef: React.RefObject<HTMLElement | null>,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    let frame = 0;

    const measure = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      if (distance <= 0) return;
      setProgress(-rect.top / distance);
    };

    const loop = () => {
      measure();
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
    };
  }, [trackRef, enabled]);
}
