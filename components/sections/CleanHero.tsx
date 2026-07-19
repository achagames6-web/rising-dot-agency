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

/* ── Services list ─────────────────────────────────────────── */
const SERVICES = [
  { label: 'Web Design', icon: '🎨' },
  { label: 'Shopify Stores', icon: '🛒' },
  { label: 'WordPress', icon: '⚡' },
  { label: 'SEO Optimization', icon: '📈' },
  { label: 'n8n Automation', icon: '🤖' },
  { label: 'AI Chatbots', icon: '💬' },
  { label: 'SaaS Products', icon: '🚀' },
];

/* ── Rising dot particle ───────────────────────────────────── */
type Dot = {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
};

function RisingDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const dots: Dot[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.6 + 0.2,
      opacity: Math.random() * 0.5 + 0.1,
      delay: Math.random() * 200,
    }));

    let raf: number;
    let frame = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      dots.forEach((d) => {
        if (frame < d.delay) return;
        d.y -= d.speed;
        if (d.y < -10) {
          d.y = canvas.height + 10;
          d.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(55,175,225,${d.opacity})`;
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
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 1 }}
    />
  );
}

/* ── Scrolling service marquee ─────────────────────────────── */
function ServiceMarquee() {
  const items = [...SERVICES, ...SERVICES]; // duplicate for seamless loop
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(90deg,transparent,black 10%,black 90%,transparent)',
      }}
    >
      <div className="flex w-max animate-[marquee_28s_linear_infinite] items-center gap-3">
        {items.map((s, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/60 backdrop-blur-sm transition-colors duration-200 hover:border-[#37AFE1]/40 hover:text-white/90"
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

/* ── Main Hero ─────────────────────────────────────────────── */
export default function CleanHero() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 15,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
      onMouseMove={onMouseMove}
      style={{ isolation: 'isolate' }}
    >
      {/* ── Deep space background ─────────────────────────── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 50%, #000e22 0%, #000812 45%, #000000 100%)',
        }}
      />

      {/* ── Blue aurora top ───────────────────────────────── */}
      <div
        className="pointer-events-none absolute top-0 z-0 h-[50vh] w-full opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, #37AFE1 0%, transparent 70%)',
        }}
      />

      {/* ── Orange aurora bottom ──────────────────────────── */}
      <div
        className="pointer-events-none absolute bottom-0 right-[-10%] z-0 h-[40vh] w-[60%] opacity-15"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 100% 100%, #F58122 0%, transparent 70%)',
        }}
      />

      {/* ── Dot-grid overlay ─────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(55,175,225,0.8) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* ── Rising dots canvas ────────────────────────────── */}
      {mounted && <RisingDots />}

      {/* ══════════════════════════════════════════════════
          CONTENT
      ══════════════════════════════════════════════════ */}
      <div className="relative z-10 flex w-full max-w-7xl flex-col items-center px-5 sm:px-8">
        {/* ── Top badge ──────────────────────────────────── */}
        <div
          className="mb-6 opacity-0"
          style={{ animation: 'hfu .6s ease forwards .1s' }}
        >
          <div
            className="inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white/70"
            style={{
              background: 'rgba(55,175,225,0.08)',
              border: '1px solid rgba(55,175,225,0.2)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#37AFE1] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#37AFE1]" />
            </span>
            Digital Agency · Web · Automation · AI
          </div>
        </div>

        {/* ── Brand name ─────────────────────────────────── */}
        <div
          className="mb-4 opacity-0"
          style={{ animation: 'hfu .7s ease forwards .25s' }}
        >
          <h1 className="text-center font-montserrat text-[4.5rem] font-black leading-[0.95] tracking-tight sm:text-[6rem] md:text-[8rem] lg:text-[10rem]">
            <span
              style={{
                background:
                  'linear-gradient(135deg, #ffffff 0%, #37AFE1 40%, #F58122 70%, #ffffff 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gshift 5s ease-in-out infinite',
              }}
            >
              Rising Dot
            </span>
          </h1>
        </div>

        {/* ── Tagline ────────────────────────────────────── */}
        <div
          className="mb-10 opacity-0"
          style={{ animation: 'hfu .7s ease forwards .42s' }}
        >
          <p className="max-w-xl text-center text-base font-light tracking-wide text-white/45 sm:text-lg md:text-xl">
            Rising together in the world of digital dots.
          </p>
        </div>

        {/* ── 3D Orb ─────────────────────────────────────── */}
        <div
          className="relative mb-10 opacity-0"
          style={{
            animation: 'hfi 1.2s ease forwards .1s',
            transform: `translate(${mousePos.x * 0.15}px, ${mousePos.y * 0.1}px)`,
            transition: 'transform 0.12s ease-out',
          }}
        >
          {/* Glow disc */}
          <div
            className="pointer-events-none absolute inset-0 m-auto rounded-full blur-[90px]"
            style={{
              background:
                'radial-gradient(circle, rgba(55,175,225,0.22) 0%, rgba(245,129,34,0.1) 55%, transparent 75%)',
            }}
          />

          {/* CSS spinning rings */}
          {[460, 520, 580].map((s, i) => (
            <div
              key={i}
              className="border-[#37AFE1]/08 pointer-events-none absolute rounded-full border"
              style={{
                width: s + 'px',
                height: s + 'px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                animation: `spinSlow ${18 + i * 8}s linear ${i % 2 === 0 ? '' : 'reverse'} infinite`,
              }}
            />
          ))}

          {/* THREE.js canvas */}
          <div className="relative z-10 h-[300px] w-[300px] sm:h-[380px] sm:w-[380px] md:h-[460px] md:w-[460px] lg:h-[520px] lg:w-[520px]">
            {mounted && <Hero3DOrb />}
          </div>
        </div>

        {/* ── CTA buttons ────────────────────────────────── */}
        <div
          className="mb-12 flex flex-wrap items-center justify-center gap-4 opacity-0"
          style={{ animation: 'hfu .7s ease forwards .9s' }}
        >
          <Link href="/contact">
            <button
              className="group relative overflow-hidden rounded-full px-8 py-4 text-sm font-bold text-white sm:text-base"
              style={{
                background: 'linear-gradient(135deg, #37AFE1 0%, #1e7fa8 100%)',
                boxShadow:
                  '0 0 32px rgba(55,175,225,.4), 0 4px 20px rgba(0,0,0,.5)',
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
              className="group flex items-center gap-2 rounded-full border border-white/15 px-8 py-4 text-sm font-semibold text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-[#37AFE1]/40 hover:text-white sm:text-base"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              View Our Work
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </Link>
        </div>

        {/* ── Stats row ──────────────────────────────────── */}
        <div
          className="mb-12 flex flex-wrap items-center justify-center gap-8 opacity-0 sm:gap-12"
          style={{ animation: 'hfu .7s ease forwards 1.05s' }}
        >
          {[
            { v: '150+', l: 'Projects' },
            { v: '4.9★', l: 'Rating' },
            { v: '7', l: 'Services' },
            { v: '100%', l: 'Satisfaction' },
          ].map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center gap-0.5">
              <span
                className="font-montserrat text-2xl font-extrabold sm:text-3xl"
                style={{
                  background: 'linear-gradient(90deg,#37AFE1,#F58122)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {v}
              </span>
              <span className="text-xs text-white/40">{l}</span>
            </div>
          ))}
        </div>

        {/* ── Divider ────────────────────────────────────── */}
        <div
          className="mb-5 h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0"
          style={{ animation: 'hfi .6s ease forwards 1.15s' }}
        />

        {/* ── Service marquee ────────────────────────────── */}
        <div
          className="w-full opacity-0"
          style={{ animation: 'hfu .6s ease forwards 1.2s' }}
        >
          <ServiceMarquee />
        </div>
      </div>

      {/* ── Scroll hint ──────────────────────────────────── */}
      <div
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 opacity-0"
        style={{ animation: 'hfi 1s ease forwards 1.6s' }}
      >
        <span className="text-[9px] uppercase tracking-[.25em] text-white/20">
          Scroll
        </span>
        <ChevronDown
          className="h-4 w-4 text-[#37AFE1]/35"
          style={{ animation: 'bob 2.4s ease-in-out infinite' }}
        />
      </div>

      {/* ── Global keyframes ─────────────────────────────── */}
      <style>{`
        @keyframes hfu  { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hfi  { from{opacity:0} to{opacity:1} }
        @keyframes gshift {
          0%  { background-position:0%   50% }
          50% { background-position:100% 50% }
          100%{ background-position:0%   50% }
        }
        @keyframes spinSlow { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      `}</style>
    </section>
  );
}
