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

      // An A-minor pad: root, fifth, octave, minor third, plus a high fifth
      // that drifts in and out. Everything runs through one slowly sweeping
      // lowpass so the texture breathes instead of sitting still.
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 300;
      filter.Q.value = 0.7;
      filter.connect(gain);

      // 18-second sweep on the cutoff.
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 1 / 18;
      const lfoAmount = ctx.createGain();
      lfoAmount.gain.value = 150;
      lfo.connect(lfoAmount);
      lfoAmount.connect(filter.frequency);
      lfo.start();

      const voices: [number, OscillatorType, number][] = [
        [55.0, 'sine', 0.34], // A1  root
        [82.41, 'sine', 0.22], // E2  fifth
        [110.0, 'triangle', 0.14], // A2  octave
        [130.81, 'sine', 0.1], // C3  minor third
        [164.81, 'sine', 0.06], // E3  upper fifth
      ];

      voices.forEach(([freq, type, level], i) => {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        osc.detune.value = (i - 2) * 4;

        const voice = ctx.createGain();
        voice.gain.value = level;

        // Each voice swells on its own cycle, so the chord never sits flat.
        const swell = ctx.createOscillator();
        swell.frequency.value = 1 / (23 + i * 7);
        const swellAmount = ctx.createGain();
        swellAmount.gain.value = level * 0.45;
        swell.connect(swellAmount);
        swellAmount.connect(voice.gain);
        swell.start();

        osc.connect(voice);
        voice.connect(filter);
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
