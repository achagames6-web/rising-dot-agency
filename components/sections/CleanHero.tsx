'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import dynamic from 'next/dynamic';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const Hero3DOrb = dynamic(
  () =>
    import('@/components/ui/hero-3d-orb').then((m) => ({
      default: m.Hero3DOrb,
    })),
  { ssr: false }
);

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 first:pl-0 last:pr-0 sm:items-start">
      <span
        className="font-montserrat text-2xl font-bold md:text-3xl"
        style={{
          background: 'linear-gradient(90deg, #37AFE1, #F58122)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {value}
      </span>
      <span className="text-xs text-white/50 sm:text-sm">{label}</span>
    </div>
  );
}

export default function CleanHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const hasTracked = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { content: heroContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  }>('home', 'hero');

  const badge = heroContent?.eyebrow || 'Award-Winning Digital Agency';
  const titleL1 = 'We Build Websites';
  const titleL2 = heroContent?.title || 'That Convert & Grow';
  const titleL3 = 'Your Brand.';
  const subtitle =
    heroContent?.subtitle ||
    'We craft stunning websites, powerful automations, and intelligent chatbots that transform your digital presence and drive real business results.';
  const ctaText = heroContent?.ctaText || 'Start Your Project';
  const ctaLink = heroContent?.ctaLink || '/contact';

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasTracked.current) hasTracked.current = true;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 10,
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ isolation: 'isolate' }}
    >
      {/* Deep space background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 60% 40%, #000d1f 0%, #000510 40%, #000000 100%)',
        }}
      />

      {/* Aurora glow – blue top-left */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 z-0 h-[600px] w-[600px] rounded-full opacity-25 blur-[130px]"
        style={{
          background: 'radial-gradient(circle, #37AFE1 0%, transparent 70%)',
        }}
      />
      {/* Aurora glow – orange bottom-right */}
      <div
        className="pointer-events-none absolute -bottom-24 right-0 z-0 h-[500px] w-[500px] rounded-full opacity-15 blur-[110px]"
        style={{
          background: 'radial-gradient(circle, #F58122 0%, transparent 70%)',
        }}
      />

      {/* Subtle dot-grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(55,175,225,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Star field */}
      {mounted && (
        <div className="pointer-events-none absolute inset-0 z-0">
          {Array.from({ length: 90 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 1.8 + 0.4 + 'px',
                height: Math.random() * 1.8 + 0.4 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.55 + 0.1,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Grid: text (left) + orb (right) ── */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center px-5 sm:px-6 lg:flex-row lg:items-center lg:gap-0 lg:px-10">
        {/* LEFT – text */}
        <div className="flex w-full flex-col items-center gap-7 pt-36 text-center lg:w-[56%] lg:items-start lg:pt-0 lg:text-left">
          {/* Badge */}
          <div
            className="opacity-0"
            style={{ animation: 'hfu .7s ease forwards .1s' }}
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium sm:text-sm"
              style={{
                background:
                  'linear-gradient(135deg,rgba(55,175,225,.12),rgba(245,129,34,.08))',
                border: '1px solid rgba(55,175,225,.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#37AFE1] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#37AFE1]" />
              </span>
              <Sparkles className="h-3.5 w-3.5 text-[#37AFE1]" />
              <span className="text-white/90">{badge}</span>
            </div>
          </div>

          {/* Headline */}
          <div
            className="opacity-0"
            style={{ animation: 'hfu .75s ease forwards .28s' }}
          >
            <h1 className="font-montserrat text-[2.5rem] font-extrabold leading-[1.08] tracking-tight sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.2rem]">
              <span className="block text-white">{titleL1}</span>
              <span
                className="block"
                style={{
                  background:
                    'linear-gradient(90deg,#37AFE1 0%,#F58122 55%,#37AFE1 100%)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gshift 4s ease-in-out infinite',
                }}
              >
                {titleL2}
              </span>
              <span className="block text-white/80">{titleL3}</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div
            className="opacity-0"
            style={{ animation: 'hfu .75s ease forwards .46s' }}
          >
            <p className="max-w-[520px] text-base leading-relaxed text-white/55 sm:text-lg">
              {subtitle}
            </p>
          </div>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center justify-center gap-4 opacity-0 lg:justify-start"
            style={{ animation: 'hfu .75s ease forwards .6s' }}
          >
            <Link href={ctaLink}>
              <button
                className="group relative overflow-hidden rounded-full px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 sm:text-base"
                style={{
                  background: 'linear-gradient(135deg,#37AFE1,#1a7da0)',
                  boxShadow:
                    '0 0 28px rgba(55,175,225,.35), 0 4px 15px rgba(0,0,0,.4)',
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {ctaText}
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
                className="group flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white/75 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/30 hover:text-white sm:text-base"
                style={{ background: 'rgba(255,255,255,.04)' }}
              >
                View Our Work
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </Link>
          </div>

          {/* Divider + Stats */}
          <div
            className="w-full max-w-[520px] opacity-0"
            style={{ animation: 'hfu .75s ease forwards .78s' }}
          >
            <div className="via-white/12 mb-6 h-px w-full bg-gradient-to-r from-transparent to-transparent" />
            <div className="flex flex-wrap items-center justify-center gap-0 lg:justify-start">
              <StatItem value="150+" label="Projects Delivered" />
              <div className="mx-3 h-10 w-px bg-white/10 sm:mx-5" />
              <StatItem value="4.9★" label="Average Rating" />
              <div className="mx-3 h-10 w-px bg-white/10 sm:mx-5" />
              <StatItem value="100%" label="Client Satisfaction" />
            </div>
          </div>
        </div>

        {/* RIGHT – 3D Orb */}
        <div
          className="relative flex w-full items-center justify-center pb-16 pt-6 lg:w-[44%] lg:py-0"
          style={{
            transform: `translate(${mousePos.x * 0.28}px,${mousePos.y * 0.28}px)`,
            transition: 'transform 0.12s ease-out',
          }}
        >
          {/* Glow disc behind orb */}
          <div
            className="pointer-events-none absolute inset-0 z-0 m-auto h-[380px] w-[380px] rounded-full blur-[90px] md:h-[460px] md:w-[460px]"
            style={{
              background:
                'radial-gradient(circle,rgba(55,175,225,.18) 0%,rgba(245,129,34,.1) 50%,transparent 70%)',
            }}
          />

          {/* CSS spinning rings */}
          <div
            className="border-[#37AFE1]/12 pointer-events-none absolute h-[400px] w-[400px] rounded-full border md:h-[500px] md:w-[500px]"
            style={{ animation: 'spinSlow 22s linear infinite' }}
          />
          <div
            className="border-[#F58122]/08 pointer-events-none absolute h-[460px] w-[460px] rounded-full border md:h-[560px] md:w-[560px]"
            style={{ animation: 'spinSlow 35s linear infinite reverse' }}
          />
          <div
            className="border-white/05 pointer-events-none absolute h-[340px] w-[340px] rounded-full border md:h-[430px] md:w-[430px]"
            style={{ animation: 'spinSlow 16s linear infinite' }}
          />

          {/* THREE.js orb canvas */}
          <div
            className="relative z-10 h-[320px] w-[320px] opacity-0 sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px]"
            style={{ animation: 'hfi 1.4s ease forwards .15s' }}
          >
            <Hero3DOrb />
          </div>

          {/* Floating label cards */}
          <div
            className="absolute right-4 top-1/4 z-20 hidden opacity-0 lg:block"
            style={{ animation: 'hfu .7s ease forwards 1.0s' }}
          >
            <div
              className="rounded-xl px-4 py-3 text-center backdrop-blur-md"
              style={{
                background: 'rgba(55,175,225,.1)',
                border: '1px solid rgba(55,175,225,.2)',
              }}
            >
              <div className="text-lg font-bold text-[#37AFE1]">3D</div>
              <div className="text-[10px] text-white/50">Design</div>
            </div>
          </div>

          <div
            className="absolute bottom-1/4 left-4 z-20 hidden opacity-0 lg:block"
            style={{ animation: 'hfu .7s ease forwards 1.1s' }}
          >
            <div
              className="rounded-xl px-4 py-3 text-center backdrop-blur-md"
              style={{
                background: 'rgba(245,129,34,.1)',
                border: '1px solid rgba(245,129,34,.2)',
              }}
            >
              <div className="text-lg font-bold text-[#F58122]">n8n</div>
              <div className="text-[10px] text-white/50">Automation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 opacity-0"
        style={{ animation: 'hfi 1s ease forwards 1.5s' }}
      >
        <span className="text-[10px] uppercase tracking-[.2em] text-white/25">
          Scroll
        </span>
        <ChevronDown
          className="h-4 w-4 text-[#37AFE1]/40"
          style={{ animation: 'bounce 2.2s ease-in-out infinite' }}
        />
      </div>

      <style>{`
        @keyframes hfu  { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hfi  { from{opacity:0} to{opacity:1} }
        @keyframes gshift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes twinkle  { from{opacity:.08;transform:scale(.8)} to{opacity:.65;transform:scale(1.2)} }
        @keyframes bounce   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
      `}</style>
    </section>
  );
}
