'use client';

// components/hero/Hud.tsx
// Instrumentation over the film. Every number here is real: they are read
// from scroll position and frame timing, not faked. That matters - a HUD
// showing invented telemetry on an automation studio's site is a costume.

import { useEffect, useRef, useState } from 'react';
import { SECTIONS, clamp } from '@/lib/hero/journey';
import { onProgress, scrollState } from '@/lib/hero/scroll';

const SECTION_NAMES = ['IDLE', 'INTRO', 'WORK', 'CORE', 'CLOSE'] as const;

const SECTION_RANGES = [
  SECTIONS.idle,
  SECTIONS.intro,
  SECTIONS.work,
  SECTIONS.core,
  SECTIONS.close,
] as const;

/** Wireframe marker. Rotates in 2D only - SVG, so it can never mirror. */
export function Marker({ seed = 0 }: { seed?: number }) {
  return (
    <svg
      className="rd-marker"
      viewBox="0 0 64 64"
      aria-hidden="true"
      style={{ animationDelay: `${seed * -1.7}s` }}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.85">
        <path d="M32 6 L54 19 L54 45 L32 58 L10 45 L10 19 Z" />
        <path d="M32 6 L32 58 M10 19 L54 45 M54 19 L10 45" opacity="0.4" />
        <circle cx="32" cy="32" r="4.5" />
      </g>
    </svg>
  );
}

export function Hud() {
  const sectionRef = useRef<HTMLSpanElement>(null);
  const posRef = useRef<HTMLSpanElement>(null);
  const fpsRef = useRef<HTMLSpanElement>(null);
  const velRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  // Scroll-derived readouts.
  useEffect(() => {
    let last = scrollState.progress;
    let velocity = 0;

    const unsub = onProgress((p) => {
      velocity = velocity * 0.85 + Math.abs(p - last) * 0.15 * 1000;
      last = p;

      const index = SECTION_RANGES.findIndex(([a, b]) => p >= a && p < b);
      const safe = index < 0 ? SECTION_RANGES.length - 1 : index;

      if (sectionRef.current) {
        sectionRef.current.textContent = `${String(safe + 1).padStart(2, '0')} / 05 · ${SECTION_NAMES[safe]}`;
      }
      if (posRef.current) {
        posRef.current.textContent = `${(p * 100).toFixed(1)}%`;
      }
      if (velRef.current) {
        velRef.current.textContent = velocity.toFixed(1).padStart(5, '0');
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${clamp(p)})`;
      }
    });

    return unsub;
  }, []);

  // Frame rate, sampled once a second. Useful to you, honest to the visitor.
  useEffect(() => {
    let frames = 0;
    let raf = 0;
    const tick = () => {
      frames += 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const id = window.setInterval(() => {
      if (fpsRef.current)
        fpsRef.current.textContent = String(frames).padStart(3, '0');
      frames = 0;
    }, 1000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(id);
    };
  }, []);

  return (
    <div className="rd-hud" aria-hidden="true">
      <div className="rd-hud__tl">
        <span className="rd-hud__key">SEQ</span>
        <span ref={sectionRef} className="rd-hud__val">
          01 / 05 · IDLE
        </span>
      </div>

      <div className="rd-hud__tr">
        <span className="rd-hud__key">FPS</span>
        <span ref={fpsRef} className="rd-hud__val">
          060
        </span>
      </div>

      <div className="rd-hud__bl">
        <span className="rd-hud__key">SCROLL</span>
        <span ref={posRef} className="rd-hud__val">
          0.0%
        </span>
        <span className="rd-hud__key">VEL</span>
        <span ref={velRef} className="rd-hud__val">
          000.0
        </span>
      </div>

      <div className="rd-hud__bar">
        <span ref={barRef} />
      </div>

      {/* Lower frame corners only - the upper pair sat under the header. */}
      <svg
        className="rd-hud__frame"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d="M99.5 94 L99.5 99.5 L94 99.5" />
        <path d="M6 99.5 L0.5 99.5 L0.5 94" />
      </svg>
    </div>
  );
}

/**
 * Ambient audio. The track is fetched only when someone asks for it, so the
 * hero never pays 1.9MB for a control most visitors will not touch.
 */
export function SoundToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef(0);
  const [on, setOn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
    };
  }, []);

  /** Ramp volume rather than cutting - a hard start is jarring. */
  const fadeTo = (target: number, done?: () => void) => {
    cancelAnimationFrame(rafRef.current);
    const el = audioRef.current;
    if (!el) return;
    const from = el.volume;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      el.volume = from + (target - from) * t;
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else done?.();
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const toggle = async () => {
    if (on) {
      setOn(false);
      fadeTo(0, () => audioRef.current?.pause());
      return;
    }

    if (!audioRef.current) {
      setLoading(true);
      const el = new Audio('/audio/ambient.mp3');
      el.loop = true;
      el.preload = 'auto';
      el.volume = 0;
      audioRef.current = el;
    }

    try {
      await audioRef.current.play();
      setOn(true);
      fadeTo(0.32);
    } catch {
      // Autoplay policy or a failed fetch - leave the control off.
      setOn(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="rd-sound"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn sound off' : 'Turn sound on'}
    >
      <span
        className={`rd-sound__wave ${on ? 'is-on' : ''}`}
        aria-hidden="true"
      >
        <i />
        <i />
        <i />
      </span>
      {loading ? 'Sound: ...' : on ? 'Sound: On' : 'Sound: Off'}
    </button>
  );
}
