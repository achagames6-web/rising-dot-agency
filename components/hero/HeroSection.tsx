'use client';

// components/hero/HeroSection.tsx
// The scroll track and the 2D layer that sits over the canvas.
// Overlay elements are updated by writing straight to the DOM on each
// progress tick — React never re-renders while you scroll.

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACTS, SCROLL_TRACK_VH, clamp, range } from '@/lib/hero/config';
import { onProgress, useHeroScroll } from '@/lib/hero/scroll';
import { Scene } from './Scene';
import './hero.css';

const ACT_LABELS = [
  'The dot',
  'The trail',
  'The ring',
  'Inside',
  'What we do',
  'Rise',
];

export default function HeroSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<'loading' | 'full' | 'static'>('loading');

  // Decide once: full WebGL film, or the honest static version.
  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const small = window.innerWidth < 768;
    const gl = (() => {
      try {
        const c = document.createElement('canvas');
        return !!(c.getContext('webgl2') || c.getContext('webgl'));
      } catch {
        return false;
      }
    })();
    setMode(reduced || small || !gl ? 'static' : 'full');
  }, []);

  useHeroScroll(trackRef, mode === 'full');

  useEffect(() => {
    if (mode !== 'full') return;

    return onProgress((p) => {
      // Tagline: in with the trail, out before the portal.
      const tagIn = clamp((p - 0.13) / 0.09);
      const tagOut = 1 - clamp((p - ACTS.ring[1] + 0.03) / 0.05);
      const tag = taglineRef.current;
      if (tag) {
        const v = tagIn * tagOut;
        tag.style.opacity = String(v);
        tag.style.transform = `translateY(${(1 - v) * 18}px)`;
      }

      // Scroll hint: only while nothing has happened yet.
      const hint = hintRef.current;
      if (hint) hint.style.opacity = String(1 - clamp(p / 0.05));

      // Portal flash at the moment the camera crosses the ring.
      const flash = flashRef.current;
      if (flash) {
        const f = range(p, ACTS.entry);
        flash.style.opacity = String(Math.sin(f * Math.PI) * 0.42);
      }

      // Outro: appears as the camera rises back out.
      const outro = outroRef.current;
      if (outro) {
        const v = range(p, [0.92, 0.99] as const);
        outro.style.opacity = String(v);
        outro.style.transform = `translateY(${(1 - v) * 24}px)`;
        outro.style.pointerEvents = v > 0.6 ? 'auto' : 'none';
      }

      // Act rail on the right edge.
      const rail = railRef.current;
      if (rail) {
        const acts = Object.values(ACTS) as ReadonlyArray<
          readonly [number, number]
        >;
        const current = acts.findIndex(([a, b]) => p >= a && p < b);
        rail
          .querySelectorAll<HTMLElement>('.rd-rail__item')
          .forEach((el, i) => {
            el.dataset.state =
              i === current ? 'current' : i < current ? 'done' : 'next';
          });
      }
    });
  }, [mode]);

  const trackStyle = useMemo(() => ({ height: `${SCROLL_TRACK_VH}vh` }), []);

  if (mode === 'static') return <StaticHero />;

  return (
    <section
      ref={trackRef}
      className="rd-track"
      style={trackStyle}
      aria-label="Rising Dot introduction"
    >
      <div className="rd-sticky">
        {mode === 'full' && (
          <Canvas
            className="rd-canvas"
            dpr={[1, 1.5]}
            gl={{
              antialias: false,
              powerPreference: 'high-performance',
              alpha: false,
            }}
            camera={{ fov: 46, near: 0.1, far: 90, position: [0, 0, 7.2] }}
          >
            <Scene />
          </Canvas>
        )}

        <div ref={flashRef} className="rd-flash" aria-hidden="true" />
        <div className="rd-vignette" aria-hidden="true" />

        <div className="rd-overlay">
          <div ref={taglineRef} className="rd-tagline">
            <p className="rd-tagline__eyebrow">Rising Dot</p>
            <h1 className="rd-tagline__head">
              Rising together in the
              <br />
              world of digital dots
            </h1>
            <p className="rd-tagline__sub">
              Automation, AI and web builds for teams that want to stop doing
              the same task twice.
            </p>
          </div>

          <div ref={hintRef} className="rd-hint">
            <span className="rd-hint__line" aria-hidden="true" />
            Scroll to begin
          </div>

          <div ref={railRef} className="rd-rail" aria-hidden="true">
            {ACT_LABELS.map((label) => (
              <div key={label} className="rd-rail__item" data-state="next">
                <span className="rd-rail__tick" />
                <span className="rd-rail__label">{label}</span>
              </div>
            ))}
          </div>

          <div ref={outroRef} className="rd-outro">
            <h2 className="rd-outro__head">Tell us what you want automated.</h2>
            <div className="rd-outro__actions">
              <a className="rd-btn rd-btn--solid" href="/contact">
                Start a project
              </a>
              <a className="rd-btn" href="/portfolio">
                See our work
              </a>
            </div>
          </div>
        </div>

        {/* Screen-reader route out of the 3D sequence. */}
        <p className="rd-sr">
          Rising Dot builds n8n automations, AI chatbots, websites, WordPress
          and Shopify stores, SaaS products and SEO.{' '}
          <a href="/services/n8n-automations">Skip to services</a>.
        </p>
      </div>
    </section>
  );
}

/** Shown on small screens, reduced-motion, and any device without WebGL. */
function StaticHero() {
  return (
    <section className="rd-static">
      <span className="rd-static__dot" aria-hidden="true" />
      <p className="rd-tagline__eyebrow">Rising Dot</p>
      <h1 className="rd-tagline__head">
        Rising together in the world of digital dots
      </h1>
      <p className="rd-tagline__sub">
        Automation, AI and web builds for teams that want to stop doing the same
        task twice.
      </p>
      <div className="rd-outro__actions">
        <a className="rd-btn rd-btn--solid" href="/contact">
          Start a project
        </a>
        <a className="rd-btn" href="/portfolio">
          See our work
        </a>
      </div>
    </section>
  );
}
