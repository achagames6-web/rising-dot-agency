'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/* ── Services ─────────────────────────────────────────────── */
const SERVICES = [
  { label: 'Web Design', icon: '🎨' },
  { label: 'Shopify Stores', icon: '🛒' },
  { label: 'WordPress', icon: '⚡' },
  { label: 'SEO Optimization', icon: '📈' },
  { label: 'n8n Automation', icon: '🤖' },
  { label: 'AI Chatbots', icon: '💬' },
  { label: 'SaaS Products', icon: '🚀' },
];

/* ── Animated word swap ──────────────────────────────────── */
const WORDS = [
  'Websites',
  'Shopify Stores',
  'Automations',
  'AI Chatbots',
  'SaaS Products',
];

function AnimatedWord() {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % WORDS.length);
        setVis(true);
      }, 380);
    }, 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      style={{
        display: 'inline-block',
        background: 'linear-gradient(90deg,#37AFE1,#F58122)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        opacity: vis ? 1 : 0,
        transform: vis
          ? 'translateY(0) scale(1)'
          : 'translateY(-10px) scale(0.97)',
        filter: vis ? 'blur(0px)' : 'blur(3px)',
        transition: 'opacity .35s ease, transform .35s ease, filter .35s ease',
      }}
    >
      {WORDS[idx]}
    </span>
  );
}

/* ── Colored rising particles from orb rim ──────────────── */
function OrbParticles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const resize = () => {
      c.width = c.offsetWidth;
      c.height = c.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Blue 65%, Orange 22%, White 13%
    const COLS = ['55,175,225', '245,129,34', '255,255,255'];
    const pick = () => {
      const r = Math.random();
      return r < 0.65 ? COLS[0] : r < 0.87 ? COLS[1] : COLS[2];
    };

    const make = () => {
      const cx = c.width / 2;
      const spread = c.width * 0.42;
      const rx = (Math.random() - 0.5) * 2;
      const x = cx + rx * spread * (0.5 + Math.abs(rx) * 0.5);
      const orbH = Math.min(c.height * 0.32, 340);
      const rimY = c.height - orbH * Math.sqrt(Math.max(0, 1 - rx * rx));
      return {
        x,
        y: rimY + Math.random() * orbH * 0.5,
        vy: -(Math.random() * 0.8 + 0.28),
        vx: (Math.random() - 0.5) * 0.14,
        r: Math.random() * 2 + 0.4,
        alpha: Math.random() * 0.6 + 0.2,
        col: pick(),
      };
    };

    const dots = Array.from({ length: 210 }, () => {
      const d = make();
      d.y -= Math.random() * c.height * 0.9;
      return d;
    });

    let raf: number;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, c.width, c.height);
      const topFade = c.height * 0.18;
      const orbH = Math.min(c.height * 0.32, 340);
      const orbRimY = c.height - orbH;
      dots.forEach((d) => {
        d.y += d.vy;
        d.x += d.vx;
        if (d.y < c.height * 0.03 || d.x < -8 || d.x > c.width + 8)
          Object.assign(d, make());
        const risenFrac = (orbRimY - d.y) / (orbRimY - topFade);
        const topAlpha = d.y < topFade ? Math.max(0, d.y / topFade) : 1;
        const fade = Math.max(0, Math.min(1, risenFrac * 2)) * topAlpha;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.col},${d.alpha * fade})`;
        ctx.fill();
      });
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 2 }}
    />
  );
}

/* ── Seamless marquee (never gaps); fades in from the orb ends ── */
function ServiceMarquee() {
  const half = [...SERVICES, ...SERVICES, ...SERVICES];
  const items = [...half, ...half];
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        // hidden past the orb ends → pills emerge from the ends, not the screen sides
        maskImage:
          'linear-gradient(90deg,transparent 0%,transparent 15%,black 26%,black 74%,transparent 85%,transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(90deg,transparent 0%,transparent 15%,black 26%,black 74%,transparent 85%,transparent 100%)',
      }}
    >
      <div
        className="flex w-max items-center gap-3"
        style={{ animation: 'marquee 40s linear infinite' }}
      >
        {items.map((s, i) => (
          <div
            key={i}
            className="border-white/12 flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium text-white/70"
            style={{ background: 'rgba(55,175,225,0.07)' }}
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════ */
export default function CleanHero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      className="relative flex min-h-screen w-full flex-col items-center overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      {/* ── Backgrounds ────────────────────────────────── */}
      <div className="absolute inset-0 z-0" style={{ background: '#000913' }} />

      {/* top blue aurora */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[34vh]"
        style={{
          opacity: 0.18,
          background:
            'radial-gradient(ellipse 80% 65% at 50% -8%,#37AFE1 0%,transparent 68%)',
        }}
      />

      {/* dot grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.018]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(55,175,225,0.9) 1px,transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />

      {/* bottom black blend (hero mixes into next section) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[30vh]"
        style={{
          background:
            'linear-gradient(0deg,#000000 0%,#000000 26%,transparent 100%)',
        }}
      />

      {/* rising colored particles */}
      {mounted && <OrbParticles />}

      {/* top spacer — biased so content sits lower, clears navbar */}
      <div className="z-10 min-h-[140px] flex-[1.5]" />

      {/* ── TOP CONTENT ────────────────────────────────── */}
      <div className="relative z-10 flex w-full flex-col items-center px-5 text-center">
        {/* Badge */}
        <div
          className="mb-5 opacity-0"
          style={{ animation: 'hfu .6s ease forwards .1s' }}
        >
          <div
            className="inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[.18em] text-white/60"
            style={{
              background: 'rgba(55,175,225,0.07)',
              border: '1px solid rgba(55,175,225,0.18)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#37AFE1] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#37AFE1]" />
            </span>
            Award-Winning Digital Agency
          </div>
        </div>

        {/* Headline */}
        <div
          className="mb-4 opacity-0"
          style={{ animation: 'hfu .75s ease forwards .28s' }}
        >
          <h1 className="font-montserrat font-extrabold leading-[1.12] tracking-tight">
            <span className="block text-[1.55rem] text-white/85 sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem]">
              We Build
            </span>
            <span className="block text-[1.75rem] sm:text-[2.25rem] md:text-[2.85rem] lg:text-[3.4rem]">
              <AnimatedWord />
            </span>
            <span className="block text-[1.55rem] text-white/65 sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem]">
              That Convert.
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div
          className="mb-8 opacity-0"
          style={{ animation: 'hfu .7s ease forwards .46s' }}
        >
          <p className="max-w-md text-sm leading-relaxed text-white/40 sm:text-base">
            From stunning websites to powerful automations — we craft digital
            experiences that drive real business growth.
          </p>
        </div>

        {/* CTA buttons */}
        <div
          className="mb-9 flex flex-wrap items-center justify-center gap-4 opacity-0"
          style={{ animation: 'hfu .7s ease forwards .60s' }}
        >
          <Link href="/contact">
            <button
              className="group relative overflow-hidden rounded-full px-7 py-3.5 text-sm font-bold text-white sm:text-base"
              style={{
                background: 'linear-gradient(135deg,#37AFE1,#1e7fa8)',
                boxShadow:
                  '0 0 28px rgba(55,175,225,.4),0 4px 18px rgba(0,0,0,.5)',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Your Project
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(135deg,#F58122,#c8621a)',
                }}
              />
            </button>
          </Link>
          <Link href="/portfolio">
            <button
              className="border-white/12 group flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold text-white/60 backdrop-blur-sm transition-all duration-300 hover:border-[#37AFE1]/40 hover:text-white sm:text-base"
              style={{ background: 'rgba(255,255,255,.04)' }}
            >
              View Our Work
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </Link>
        </div>

        {/* Stats — brighter, prominent labels */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 opacity-0 sm:gap-10"
          style={{ animation: 'hfu .7s ease forwards .76s' }}
        >
          {[
            { v: '150+', l: 'Projects' },
            { v: '4.9★', l: 'Rating' },
            { v: '7', l: 'Services' },
            { v: '100%', l: 'Satisfaction' },
          ].map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center gap-1">
              <span
                className="font-montserrat text-xl font-extrabold sm:text-2xl"
                style={{
                  background: 'linear-gradient(90deg,#37AFE1,#F58122)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {v}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wide text-white/65 sm:text-xs">
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* bottom spacer */}
      <div className="z-10 flex-1" />

      {/* ══ GLOWING PLANET HORIZON ══════════════════════ */}
      <div
        className="relative z-[3] w-full"
        style={{ height: 'clamp(230px,29vw,380px)' }}
      >
        {/* Soft upward sky-glow above the crest (curved, blurred dome) */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: '58%',
            transform: 'translateY(-56%)',
            background:
              'radial-gradient(ellipse 30% 100% at 50% 100%,rgba(85,188,238,.34) 0%,rgba(55,175,225,.12) 45%,transparent 72%)',
            filter: 'blur(30px)',
          }}
        />

        {/* Horizon — crisp bright rim, glow above & below, fades at sides + bottom */}
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage:
              'linear-gradient(90deg,transparent 0%,#000 15%,#000 85%,transparent 100%),linear-gradient(180deg,#000 0%,#000 55%,transparent 100%)',
            WebkitMaskComposite: 'source-in',
            maskImage:
              'linear-gradient(90deg,transparent 0%,#000 15%,#000 85%,transparent 100%),linear-gradient(180deg,#000 0%,#000 55%,transparent 100%)',
            maskComposite: 'intersect',
          }}
        >
          {/* Giant sphere: dark body + glowing rim (outer + inner glow) */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              transform: 'translateX(-50%)',
              width: 'min(2200px,220vw)',
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              border: '3px solid rgba(222,244,255,.95)',
              background:
                'radial-gradient(circle at 50% 50%,#0b2138 0%,#071a31 45%,#041025 70%,#020a16 100%)',
              boxShadow: [
                '0 0 30px rgba(130,210,252,.75)',
                '0 0 70px rgba(55,175,225,.45)',
                '0 0 150px rgba(55,175,225,.25)',
                'inset 0 0 70px rgba(85,185,240,.4)',
                'inset 0 0 150px rgba(55,175,225,.18)',
              ].join(', '),
            }}
          />
        </div>

        {/* Marquee — streams out from the orb ends, fading at both ends */}
        <div
          className="pointer-events-auto absolute inset-x-0 z-20"
          style={{ bottom: 'clamp(30px,5vw,58px)' }}
        >
          <ServiceMarquee />
        </div>
      </div>

      {/* ── Keyframes ──────────────────────────────────── */}
      <style>{`
        @keyframes hfu  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>
    </section>
  );
}
