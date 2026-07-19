'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Hero3DOrb = dynamic(
  () =>
    import('@/components/ui/hero-3d-orb').then((m) => ({
      default: m.Hero3DOrb,
    })),
  { ssr: false }
);

/* ── Services for marquee ──────────────────────────────────── */
const SERVICES = [
  { label: 'Web Design', icon: '🎨' },
  { label: 'Shopify Stores', icon: '🛒' },
  { label: 'WordPress', icon: '⚡' },
  { label: 'SEO Optimization', icon: '📈' },
  { label: 'n8n Automation', icon: '🤖' },
  { label: 'AI Chatbots', icon: '💬' },
  { label: 'SaaS Products', icon: '🚀' },
];

/* ── Animated cycling words ─────────────────────────────────── */
const WORDS = [
  'Websites',
  'Shopify Stores',
  'Automations',
  'AI Chatbots',
  'SaaS Products',
];

function AnimatedWord() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 400);
    }, 2600);
    return () => clearInterval(cycle);
  }, []);

  return (
    <span
      className="duration-400 inline-block transition-all"
      style={{
        background: 'linear-gradient(90deg, #37AFE1, #F58122)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0) scale(1)'
          : 'translateY(-16px) scale(0.96)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        filter: visible ? 'blur(0px)' : 'blur(4px)',
      }}
    >
      {WORDS[idx]}
    </span>
  );
}

/* ── Rising dots canvas ─────────────────────────────────────── */
function RisingDots() {
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
    const dots = Array.from({ length: 130 }, () => ({
      x: Math.random() * c.width,
      y: c.height + Math.random() * c.height,
      r: Math.random() * 2 + 0.4,
      spd: Math.random() * 0.55 + 0.18,
      a: Math.random() * 0.45 + 0.08,
    }));
    let raf: number;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, c.width, c.height);
      dots.forEach((d) => {
        d.y -= d.spd;
        if (d.y < -6) {
          d.y = c.height + 6;
          d.x = Math.random() * c.width;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(55,175,225,${d.a})`;
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
      style={{ zIndex: 1 }}
    />
  );
}

/* ── Service marquee ────────────────────────────────────────── */
function ServiceMarquee() {
  const items = [...SERVICES, ...SERVICES];
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(90deg,transparent,black 8%,black 92%,transparent)',
      }}
    >
      <div
        className="flex w-max items-center gap-3"
        style={{ animation: 'marquee 28s linear infinite' }}
      >
        {items.map((s, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/55 backdrop-blur-sm"
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

/* ══════════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════════ */
export default function CleanHero() {
  const [mounted, setMounted] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const secRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = secRef.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({
      x: ((e.clientX - r.left) / r.width - 0.5) * 28,
      y: ((e.clientY - r.top) / r.height - 0.5) * 14,
    });
  }, []);

  return (
    <section
      ref={secRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden"
      onMouseMove={onMove}
      style={{ isolation: 'isolate' }}
    >
      {/* ── Background layers ──────────────────────────────── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 80% at 50% 40%, #000e22 0%, #00060f 50%, #000000 100%)',
        }}
      />

      {/* top blue aurora */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[55vh] opacity-35"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% -5%, #37AFE1 0%, transparent 65%)',
        }}
      />

      {/* bottom-right orange */}
      <div
        className="opacity-18 pointer-events-none absolute bottom-[-10%] right-[-5%] z-0 h-[50vh] w-[55vw]"
        style={{
          background:
            'radial-gradient(ellipse 90% 90% at 100% 100%, #F58122 0%, transparent 65%)',
        }}
      />

      {/* dot grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.022]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(55,175,225,0.9) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />

      {/* rising dots */}
      {mounted && <RisingDots />}

      {/* ════════════════════════════════════════════════════
          TOP SECTION  –  badge + sphere
      ════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex w-full flex-col items-center pt-28 sm:pt-32">
        {/* Badge */}
        <div
          className="mb-6 opacity-0"
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

        {/* ── 3-D ORB ─ main visual ───────────────────────── */}
        <div
          className="relative opacity-0"
          style={{
            animation: 'hfi 1.3s ease forwards .05s',
            transform: `translate(${mouse.x * 0.12}px,${mouse.y * 0.08}px)`,
            transition: 'transform .12s ease-out',
          }}
        >
          {/* glow disc */}
          <div
            className="pointer-events-none absolute inset-0 m-auto rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(55,175,225,.22) 0%, rgba(245,129,34,.1) 55%, transparent 72%)',
              filter: 'blur(70px)',
            }}
          />

          {/* thin CSS orbit rings */}
          {[420, 490, 560].map((s, i) => (
            <div
              key={i}
              className="pointer-events-none absolute rounded-full"
              style={{
                width: s,
                height: s,
                top: '50%',
                left: '50%',
                border: `1px solid rgba(55,175,225,${0.09 - i * 0.025})`,
                animation: `spinOrb ${20 + i * 9}s linear ${i % 2 ? 'reverse' : ''} infinite`,
              }}
            />
          ))}

          {/* THREE.js canvas */}
          <div className="relative z-10 h-[280px] w-[280px] sm:h-[360px] sm:w-[360px] md:h-[460px] md:w-[460px] lg:h-[520px] lg:w-[520px]">
            {mounted && <Hero3DOrb />}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          MIDDLE  –  headline + CTA + stats
      ════════════════════════════════════════════════════ */}
      <div className="relative z-10 -mt-6 flex w-full max-w-5xl flex-col items-center px-5 sm:px-8">
        {/* Headline */}
        <div
          className="mb-5 text-center opacity-0"
          style={{ animation: 'hfu .75s ease forwards .55s' }}
        >
          <h1 className="font-montserrat font-extrabold leading-[1.08] tracking-tight">
            {/* line 1 */}
            <span className="block text-[2.2rem] text-white/85 sm:text-[3rem] md:text-[3.8rem] lg:text-[4.4rem]">
              We Build
            </span>
            {/* line 2 – animated word */}
            <span className="block text-[2.4rem] sm:text-[3.3rem] md:text-[4.2rem] lg:text-[5rem]">
              <AnimatedWord />
            </span>
            {/* line 3 */}
            <span className="block text-[2.2rem] text-white/70 sm:text-[3rem] md:text-[3.8rem] lg:text-[4.4rem]">
              That Convert.
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div
          className="mb-8 opacity-0"
          style={{ animation: 'hfu .7s ease forwards .72s' }}
        >
          <p className="max-w-lg text-center text-sm leading-relaxed text-white/40 sm:text-base md:text-lg">
            From stunning websites to powerful automations — we craft digital
            experiences that drive real business growth.
          </p>
        </div>

        {/* CTA buttons */}
        <div
          className="mb-10 flex flex-wrap items-center justify-center gap-4 opacity-0"
          style={{ animation: 'hfu .7s ease forwards .86s' }}
        >
          <Link href="/contact">
            <button
              className="group relative overflow-hidden rounded-full px-7 py-3.5 text-sm font-bold text-white sm:text-base"
              style={{
                background: 'linear-gradient(135deg,#37AFE1,#1e7fa8)',
                boxShadow:
                  '0 0 28px rgba(55,175,225,.38), 0 4px 18px rgba(0,0,0,.5)',
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
              className="border-white/12 group flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold text-white/65 backdrop-blur-sm transition-all duration-300 hover:border-[#37AFE1]/40 hover:text-white sm:text-base"
              style={{ background: 'rgba(255,255,255,.04)' }}
            >
              View Our Work
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div
          className="mb-8 flex flex-wrap items-center justify-center gap-6 opacity-0 sm:gap-10"
          style={{ animation: 'hfu .7s ease forwards 1.0s' }}
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
              <span className="text-[10px] text-white/35 sm:text-xs">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          BOTTOM  –  divider + marquee + scroll
      ════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 w-full opacity-0"
        style={{ animation: 'hfi .6s ease forwards 1.1s' }}
      >
        <div className="via-white/08 mb-5 h-px w-full bg-gradient-to-r from-transparent to-transparent" />
        <ServiceMarquee />
        <div className="mt-6 flex justify-center pb-6">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] uppercase tracking-[.22em] text-white/20">
              Scroll
            </span>
            <ChevronDown
              className="h-4 w-4 text-[#37AFE1]/30"
              style={{ animation: 'bob 2.4s ease-in-out infinite' }}
            />
          </div>
        </div>
      </div>

      {/* ── Keyframes ─────────────────────────────────────── */}
      <style>{`
        @keyframes hfu   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hfi   { from{opacity:0} to{opacity:1} }
        @keyframes spinOrb { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes bob   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>
    </section>
  );
}
