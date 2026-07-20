'use client';

// components/hero/Hud.tsx
// Instrumentation over the film. Every number here is real: they are read
// from scroll position and frame timing, not faked. That matters - a HUD
// showing invented telemetry on an automation studio's site is a costume.

import { useEffect, useRef } from 'react';
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

      {/* Frame corners. Static, thin, quiet. */}
      <svg
        className="rd-hud__frame"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d="M0.5 6 L0.5 0.5 L6 0.5" />
        <path d="M94 0.5 L99.5 0.5 L99.5 6" />
        <path d="M99.5 94 L99.5 99.5 L94 99.5" />
        <path d="M6 99.5 L0.5 99.5 L0.5 94" />
      </svg>
    </div>
  );
}

/**
 * Ambient audio. Generated with WebAudio - no asset files, nothing to load.
 * Off by default and stays off until the visitor asks for it.
 */
export function SoundToggle() {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const onRef = useRef(false);
  const labelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    return () => {
      ctxRef.current?.close();
    };
  }, []);

  const toggle = () => {
    if (!ctxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);

      // Two detuned sines and a filtered triangle: a slow, low pad.
      [55, 82.5, 110].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 2 ? 'triangle' : 'sine';
        osc.frequency.value = freq;
        osc.detune.value = (i - 1) * 6;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 320;
        const voice = ctx.createGain();
        voice.gain.value = i === 2 ? 0.12 : 0.3;
        osc.connect(filter);
        filter.connect(voice);
        voice.connect(gain);
        osc.start();
      });

      ctxRef.current = ctx;
      gainRef.current = gain;
    }

    const ctx = ctxRef.current;
    const gain = gainRef.current;
    if (!ctx || !gain) return;

    void ctx.resume();
    onRef.current = !onRef.current;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.linearRampToValueAtTime(
      onRef.current ? 0.05 : 0,
      ctx.currentTime + 0.7
    );

    if (labelRef.current) {
      labelRef.current.textContent = onRef.current ? 'Sound: On' : 'Sound: Off';
      labelRef.current.setAttribute(
        'aria-pressed',
        onRef.current ? 'true' : 'false'
      );
    }
  };

  return (
    <button
      ref={labelRef}
      type="button"
      className="rd-sound"
      onClick={toggle}
      aria-pressed="false"
    >
      Sound: Off
    </button>
  );
}
