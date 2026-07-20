'use client';

// components/hero/HeroSection.tsx
// Five sections over one sticky viewport. The 3D layer is atmosphere only;
// every word on screen is real DOM text sitting on top of it. That is the
// fix for the mirrored, blurry copy in the previous build - nothing is
// rendered through a 3D transform that can turn away from the camera.

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import {
  FILTERS,
  SCROLL_TRACK_VH,
  SECTIONS,
  WORK,
  band,
  clamp,
  lerp,
  range,
} from '@/lib/hero/journey';
import { onProgress, scrollState, useHeroScroll } from '@/lib/hero/scroll';
import { Field } from './Field';
import { Hud, Marker, SoundToggle } from './Hud';
import './journey.css';

const CHARS = '▚▘▝▞ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/** Decode-on-reveal. Runs on a timer, not on scroll, so it never stutters. */
function useScramble(active: boolean, text: string) {
  const [out, setOut] = useState(text);
  const done = useRef(false);

  useEffect(() => {
    if (!active || done.current) return;
    done.current = true;
    let frame = 0;
    const total = 22;
    const id = window.setInterval(() => {
      frame += 1;
      const revealed = Math.floor((frame / total) * text.length);
      setOut(
        text
          .split('')
          .map((c, i) => {
            if (i < revealed || c === ' ') return c;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );
      if (frame >= total) {
        setOut(text);
        window.clearInterval(id);
      }
    }, 34);
    return () => window.clearInterval(id);
  }, [active, text]);

  return out;
}

function WorkCard({
  item,
  index,
  total,
  label,
}: {
  item: (typeof WORK)[number];
  index: number;
  total: number;
  label: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [seen, setSeen] = useState(false);
  const title = useScramble(seen, item.title);
  const isCase = item.type === 'case';

  useEffect(() => {
    return onProgress(() => {
      const el = ref.current;
      if (!el) return;

      const w = range(scrollState.smooth, SECTIONS.work);
      // Each card owns a slice of the work scroll and flies toward the camera.
      const t = w * (total + 1.15) - index;
      const visible = t > -0.15 && t < 1.3;

      if (!visible) {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        return;
      }

      el.style.visibility = 'visible';
      if (t > 0.25 && !seen) setSeen(true);

      const z = lerp(-2300, 680, clamp(t / 1.3));
      const fade = band(t, 0.0, 1.15, 0.22);
      el.style.opacity = String(fade);
      el.style.transform = `translate3d(-50%, -50%, ${z}px)`;
    });
  }, [index, total, seen]);

  // Fixed offsets give the wall parallax without any card leaving the frame.
  const offset = useMemo(() => {
    const xs = [-25, 21, -13, 27, -22, 15, -28, 19];
    const ys = [-11, 15, 21, -17, 7, -9, 13, -20];
    return { x: xs[index % xs.length], y: ys[index % ys.length] };
  }, [index]);

  return (
    <a
      ref={ref}
      className={`rd-card ${isCase ? 'rd-card--case' : 'rd-card--capability'}`}
      href={item.href}
      style={{
        left: `calc(50% + ${offset.x}%)`,
        top: `calc(50% + ${offset.y}%)`,
        opacity: 0,
        visibility: 'hidden',
      }}
    >
      <span className="rd-card__leader" aria-hidden="true" />
      <span className="rd-card__id" aria-hidden="true">
        {label}
      </span>

      {isCase && item.image && (
        <span className="rd-card__shot">
          <Image
            src={item.image}
            alt={`${item.title} interface`}
            width={1400}
            height={671}
            sizes="(max-width: 1024px) 80vw, 34rem"
            priority={false}
          />
        </span>
      )}

      <div className="rd-card__head">
        <Marker seed={index} />
        <span className="rd-card__kind">{item.kind}</span>
      </div>

      <h3 className="rd-card__title">{title}</h3>
      <p className="rd-card__blurb">{item.blurb}</p>

      {isCase && item.stack && (
        <p className="rd-card__stack">
          {item.stack}
          {item.year ? ` · ${item.year}` : ''}
        </p>
      )}

      <span className="rd-card__cta">
        {isCase ? 'Click to explore' : 'See the service'}
      </span>
    </a>
  );
}

export default function HeroSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'loading' | 'full' | 'static'>('loading');
  const [quality, setQuality] = useState(1);

  const idleRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLDivElement>(null);
  const diveRef = useRef<HTMLDivElement>(null);

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
    setQuality(window.devicePixelRatio > 2 ? 0.85 : 1);
    setMode(reduced || small || !gl ? 'static' : 'full');
  }, []);

  useHeroScroll(trackRef, mode === 'full');

  useEffect(() => {
    if (mode !== 'full') return;

    const set = (el: HTMLElement | null, v: number, shift = 0) => {
      if (!el) return;
      el.style.opacity = String(v);
      el.style.transform = `translateY(${(1 - v) * shift}px)`;
      el.style.pointerEvents = v > 0.55 ? 'auto' : 'none';
    };

    return onProgress((p) => {
      set(idleRef.current, 1 - range(p, [0.0, 0.075] as const), 0);
      set(
        introRef.current,
        band(p, SECTIONS.intro[0], SECTIONS.intro[1], 0.05),
        26
      );
      set(
        railRef.current,
        band(p, SECTIONS.work[0], SECTIONS.work[1], 0.03),
        0
      );
      set(
        coreRef.current,
        band(p, SECTIONS.core[0] + 0.05, SECTIONS.core[1], 0.05),
        12
      );
      set(closeRef.current, range(p, [0.9, 0.97] as const), 26);

      // Chromatic dive at every section boundary: a short RGB split plus a
      // scale kick, so moving between sections feels like passing through
      // something rather than cross-fading.
      if (diveRef.current) {
        const edges = [
          SECTIONS.intro[0],
          SECTIONS.work[0],
          SECTIONS.core[0],
          SECTIONS.close[0],
        ];
        let dive = 0;
        for (const e of edges) {
          const d = (p - e) / 0.02;
          dive = Math.max(dive, Math.exp(-d * d));
        }
        diveRef.current.style.opacity = String(dive);
        diveRef.current.style.setProperty('--rd-split', `${dive * 14}px`);
      }
    });
  }, [mode]);

  if (mode === 'static') return <StaticHero />;

  return (
    <section
      ref={trackRef}
      className="rd-track"
      style={{ height: `${SCROLL_TRACK_VH}vh` }}
      aria-label="Rising Dot"
    >
      <div className="rd-stage">
        {mode === 'full' && (
          <Canvas
            className="rd-canvas"
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: 'high-performance' }}
            camera={{ fov: 48, near: 0.1, far: 120, position: [0, 0, 9] }}
          >
            <Field quality={quality} />
          </Canvas>
        )}

        <div className="rd-vignette" aria-hidden="true" />
        <div
          ref={diveRef}
          className="rd-dive"
          aria-hidden="true"
          style={{ opacity: 0 }}
        >
          <span className="rd-dive__r" />
          <span className="rd-dive__b" />
        </div>

        {/* --- 1. idle --- */}
        <div ref={idleRef} className="rd-layer rd-idle">
          <p className="rd-eyebrow">Rising Dot</p>
          <p className="rd-idle__hint">
            <span className="rd-idle__rule" aria-hidden="true" />
            Scroll
          </p>
        </div>

        {/* --- 2. intro --- */}
        <div
          ref={introRef}
          className="rd-layer rd-intro"
          style={{ opacity: 0 }}
        >
          <h1 className="rd-headline">
            Rising together
            <br />
            in the world of
            <br />
            <em>digital dots</em>
          </h1>
          <div className="rd-intro__side">
            <p>
              A small studio building automation, AI assistants and the sites
              they run on. We take work that repeats and make it stop repeating.
            </p>
            <p className="rd-intro__meta">Automation · AI · Web · Commerce</p>
          </div>
        </div>

        {/* --- 3. work wall --- */}
        <div className="rd-wall" aria-hidden="false">
          {WORK.map((item, i) => {
            const seen = WORK.slice(0, i + 1).filter(
              (x) => x.type === item.type
            ).length;
            const prefix = item.type === 'case' ? 'CASE' : 'CAP';
            return (
              <WorkCard
                key={item.title}
                item={item}
                index={i}
                total={WORK.length}
                label={`${prefix}_${String(seen).padStart(2, '0')}`}
              />
            );
          })}
        </div>

        <div ref={railRef} className="rd-layer rd-rail" style={{ opacity: 0 }}>
          <p className="rd-rail__lead">What are you looking for?</p>
          <ul className="rd-rail__filters">
            {FILTERS.map((f) => (
              <li key={f}>
                <a href="/portfolio">{f}</a>
              </li>
            ))}
          </ul>
          <a className="rd-rail__ask" href="/contact">
            Ask us anything →
          </a>
        </div>

        {/* --- 4. set piece: one line, no UI --- */}
        <div ref={coreRef} className="rd-layer rd-core" style={{ opacity: 0 }}>
          <p className="rd-core__label">Every workflow is a set of dots.</p>
        </div>

        {/* --- 5. close --- */}
        <div
          ref={closeRef}
          className="rd-layer rd-close"
          style={{ opacity: 0 }}
        >
          <h2 className="rd-close__head">
            Tell us what should stop repeating.
          </h2>
          <div className="rd-actions">
            <a className="rd-btn rd-btn--solid" href="/contact">
              Start a project
            </a>
            <a className="rd-btn" href="/portfolio">
              See the work
            </a>
          </div>
        </div>

        <nav className="rd-pill" aria-label="Shortcuts">
          <a href="/portfolio">Work</a>
          <span aria-hidden="true">·</span>
          <a href="/contact">Contact</a>
        </nav>

        <Hud />
        <SoundToggle />

        <p className="rd-sr">
          Rising Dot builds n8n automations, AI chatbots, websites, WordPress
          and Shopify stores, SaaS products and SEO.{' '}
          <a href="/portfolio">Skip to the work</a>.
        </p>
      </div>
    </section>
  );
}

/** Small screens, reduced motion, or no WebGL. Same content, no scene. */
function StaticHero() {
  return (
    <section className="rd-static">
      <p className="rd-eyebrow">Rising Dot</p>
      <h1 className="rd-headline">
        Rising together in the world of <em>digital dots</em>
      </h1>
      <p className="rd-static__blurb">
        A small studio building automation, AI assistants and the sites they run
        on. We take work that repeats and make it stop repeating.
      </p>
      <div className="rd-actions">
        <a className="rd-btn rd-btn--solid" href="/contact">
          Start a project
        </a>
        <a className="rd-btn" href="/portfolio">
          See the work
        </a>
      </div>
    </section>
  );
}
