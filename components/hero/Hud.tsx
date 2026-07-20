'use client';

// components/hero/Hud.tsx
// Instrumentation over the film. Every number here is real: they are read
// from scroll position and frame timing, not faked. That matters - a HUD
// showing invented telemetry on an automation studio's site is a costume.

import { useEffect, useRef, useState } from 'react';
import { SECTIONS, clamp } from '@/lib/hero/journey';
import { onProgress, scrollState } from '@/lib/hero/scroll';

const SECTION_NAMES = ['IDLE', 'INTRO', 'WORK', 'CLOSE'] as const;

const SECTION_RANGES = [
  SECTIONS.idle,
  SECTIONS.intro,
  SECTIONS.work,
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
        sectionRef.current.textContent = `${String(safe + 1).padStart(2, '0')} / 04 · ${SECTION_NAMES[safe]}`;
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
          01 / 04 · IDLE
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
 * Ambient audio.
 *
 * Uses a real <audio> element rather than new Audio(): the previous version
 * could fail with nothing to show for it. This one surfaces the failure -
 * if the file will not load or play, the control says so instead of sitting
 * on "Off" while nothing happens.
 */
export function SoundToggle() {
  const elRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef(0);
  const [state, setState] = useState<'off' | 'loading' | 'on' | 'error'>('off');

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const ramp = (to: number, then?: () => void) => {
    cancelAnimationFrame(rafRef.current);
    const el = elRef.current;
    if (!el) return;
    const from = el.volume;
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 800);
      el.volume = from + (to - from) * k;
      if (k < 1) rafRef.current = requestAnimationFrame(tick);
      else then?.();
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const toggle = () => {
    const el = elRef.current;
    if (!el) return;

    if (state === 'on') {
      setState('off');
      ramp(0, () => el.pause());
      return;
    }

    setState('loading');
    el.volume = 0;

    // play() must be called in the click handler itself, not after an await,
    // or Safari treats it as programmatic and blocks it.
    const attempt = el.play();

    if (attempt && typeof attempt.then === 'function') {
      attempt
        .then(() => {
          setState('on');
          ramp(0.3);
        })
        .catch(() => setState('error'));
    } else {
      setState('on');
      ramp(0.3);
    }
  };

  const label =
    state === 'on'
      ? 'Sound: On'
      : state === 'loading'
        ? 'Sound: loading'
        : state === 'error'
          ? 'Sound: unavailable'
          : 'Sound: Off';

  return (
    <>
      <audio
        ref={elRef}
        src="/audio/ambient.mp3"
        loop
        preload="none"
        onError={() => setState('error')}
      />
      <button
        type="button"
        className="rd-sound"
        onClick={toggle}
        disabled={state === 'error'}
        aria-pressed={state === 'on'}
        aria-label={state === 'on' ? 'Turn sound off' : 'Turn sound on'}
      >
        <span
          className={`rd-sound__wave ${state === 'on' ? 'is-on' : ''}`}
          aria-hidden="true"
        >
          <i />
          <i />
          <i />
        </span>
        {label}
      </button>
    </>
  );
}
