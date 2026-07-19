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

/* ── Colored rising particles from orb ──────────────────── */
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
      const spread = c.width * 0.44;
      const rx = (Math.random() - 0.5) * 2;
      const x = cx + rx * spread * (0.5 + Math.abs(rx) * 0.5);
      const orbH = Math.min(c.height * 0.3, 300);
      const rimY = c.height - orbH * Math.sqrt(Math.max(0, 1 - rx * rx));
      return {
        x,
        y: rimY + Math.random() * orbH * 0.7,
        vy: -(Math.random() * 0.75 + 0.25),
        vx: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 2 + 0.4,
        alpha: Math.random() * 0.55 + 0.2,
        col: pick(),
      };
    };

    const dots = Array.from({ length: 200 }, () => {
      const d = make();
      d.y -= Math.random() * c.height * 0.85;
      return d;
    });

    let raf: number;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, c.width, c.height);
      const topFade = c.height * 0.2;
      const orbH = Math.min(c.height * 0.3, 300);
      const orbRimY = c.height - orbH;
      dots.forEach((d) => {
        d.y += d.vy;
        d.x += d.vx;
        if (d.y < c.height * 0.04 || d.x < -8 || d.x > c.width + 8)
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

/* ── Marquee with both-sides fade ────────────────────────── */
function ServiceMarquee() {
  const items = [...SERVICES, ...SERVICES];
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(90deg,transparent,black 10%,black 90%,transparent)',
        WebkitMaskImage:
          'linear-gradient(90deg,transparent,black 10%,black 90%,transparent)',
      }}
    >
      <div
        className="flex w-max items-center gap-3"
        style={{ animation: 'marquee 28s linear infinite' }}
      >
        {items.map((s, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/50 backdrop-blur-sm"
            style={{ background: 'rgba(55,175,225,0.05)' }}
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
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[38vh] opacity-20"
        style={{
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

      {/* rising colored particles */}
      {mounted && <OrbParticles />}

      {/* ── TOP CONTENT ────────────────────────────────── */}
      <div className="relative z-10 flex w-full flex-col items-center px-5 pt-28 text-center sm:pt-32">
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

        {/* Headline — smaller */}
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
          className="mb-7 opacity-0"
          style={{ animation: 'hfu .7s ease forwards .46s' }}
        >
          <p className="text-white/38 max-w-md text-sm leading-relaxed sm:text-base">
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

        {/* Stats */}
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
            <div key={l} className="flex flex-col items-center gap-0.5">
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
              <span className="text-white/32 text-[10px] sm:text-xs">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* flex spacer — pushes orb + marquee to bottom */}
      <div className="flex-1" />

      {/* ── HALF-CIRCLE ORB ────────────────────────────── */}
      <div
        className="relative z-[3] w-full opacity-0"
        style={{
          animation: 'hfi 1.2s ease forwards .4s',
          height: 'clamp(180px,26vw,320px)',
        }}
      >
        {/* Upward bloom above rim */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: 'clamp(120px,18vw,220px)',
            transform: 'translateY(-50%)',
            background:
              'radial-gradient(ellipse 60% 100% at 50% 100%,rgba(55,175,225,.13) 0%,rgba(245,129,34,.06) 55%,transparent 100%)',
          }}
        />

        {/* Semi-ellipse body */}
        <div
          className="absolute bottom-0 left-1/2"
          style={{
            transform: 'translateX(-50%)',
            width: 'clamp(700px,96vw,1200px)',
            height: 'clamp(180px,26vw,320px)',
            borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
            background:
              'radial-gradient(ellipse 90% 100% at 50% 100%,rgba(10,25,55,0.92) 0%,rgba(6,14,34,0.88) 40%,rgba(2,6,15,0.7) 70%,transparent 100%)',
          }}
        >
          {/* Rim glow line */}
          <div
            style={{
              position: 'absolute',
              top: -1,
              left: '3%',
              right: '3%',
              height: '2px',
              background:
                'linear-gradient(90deg,transparent 0%,rgba(55,175,225,.75) 25%,rgba(245,129,34,.55) 75%,transparent 100%)',
              filter: 'blur(0.8px)',
            }}
          />

          {/* Rim outer glow */}
          <div
            style={{
              position: 'absolute',
              top: -5,
              left: '3%',
              right: '3%',
              height: '12px',
              background:
                'linear-gradient(90deg,transparent 0%,rgba(55,175,225,.3) 25%,rgba(245,129,34,.2) 75%,transparent 100%)',
              filter: 'blur(8px)',
            }}
          />

          {/* Inner ambient */}
          <div
            style={{
              position: 'absolute',
              top: '15%',
              left: '18%',
              right: '18%',
              bottom: 0,
              background:
                'radial-gradient(ellipse 70% 55% at 50% 25%,rgba(55,175,225,.07) 0%,transparent 70%)',
            }}
          />
        </div>
      </div>

      {/* ── MARQUEE ────────────────────────────────────── */}
      <div
        className="relative z-10 w-full py-4"
        style={{
          background:
            'linear-gradient(0deg,rgba(0,5,14,.96) 0%,rgba(0,9,19,.78) 100%)',
        }}
      >
        <ServiceMarquee />
      </div>

      {/* ── Keyframes ──────────────────────────────────── */}
      <style>{`
        @keyframes hfu  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hfi  { from{opacity:0} to{opacity:1} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>
    </section>
  );
}
