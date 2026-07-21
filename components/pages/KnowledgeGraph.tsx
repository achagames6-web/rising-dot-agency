'use client';

// components/pages/KnowledgeGraph.tsx  (Blog)
//
// Posts and topics as a living node field. Everything drifts, the cursor pulls
// the field toward it, and pointing at a topic dims every post that does not
// belong to it.
//
// SIZING: the canvas is measured with a ResizeObserver and the nodes are
// re-seeded whenever it actually has a box. A canvas inside a hidden or
// not-yet-laid-out parent reports 0x0, which previously scattered every node
// into the corner and never recovered - the field looked completely empty.

import { useEffect, useRef } from 'react';
import { SectionIntro } from '@/components/sections/SectionIntro';
import './page-sections.css';

const TOPICS = ['Automation', 'SEO', 'Commerce', 'AI'];
const POSTS = [
  'Nine workflows',
  'Draft-first',
  'Payment rails',
  'Catalogue SEO',
  'On-chain data',
  'Async pipelines',
];
/** topic index -> post indices */
const LINKS: Record<number, number[]> = {
  0: [0, 1, 5],
  1: [1, 3],
  2: [2],
  3: [4],
};

type Node = {
  label: string;
  topic: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

export default function KnowledgeGraph() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nodes: Node[] = [
      ...TOPICS.map((label) => ({ label, topic: true })),
      ...POSTS.map((label) => ({ label, topic: false })),
    ].map((n) => ({
      ...n,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: n.topic ? 6 : 4,
    })) as Node[];

    let seeded = false;

    /** Lay the nodes out for a box of this size. Only ever called with a real one. */
    const seed = (w: number, h: number) => {
      nodes.forEach((n, i) => {
        // Topics toward the middle, posts around them, so the shape reads.
        const ring = n.topic ? 0.26 : 0.42;
        const a = (i / nodes.length) * Math.PI * 2 + (n.topic ? 0 : 0.6);
        n.x = w / 2 + Math.cos(a) * w * ring * (0.7 + Math.random() * 0.5);
        n.y = h / 2 + Math.sin(a) * h * ring * (0.7 + Math.random() * 0.5);
        n.vx = (Math.random() - 0.5) * 0.24;
        n.vy = (Math.random() - 0.5) * 0.24;
      });
      seeded = true;
    };

    const fit = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return; // no box yet - do not seed into nothing
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!seeded) seed(w, h);
    };

    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    fit();

    let mx = -999;
    let my = -999;
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => {
      mx = -999;
      my = -999;
    };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!seeded || w === 0 || h === 0) return;

      ctx.clearRect(0, 0, w, h);

      let hot: string | null = null;
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 26 || n.x > w - 26) n.vx *= -1;
        if (n.y < 26 || n.y > h - 26) n.vy *= -1;
        n.x = Math.max(20, Math.min(w - 20, n.x));
        n.y = Math.max(20, Math.min(h - 20, n.y));

        const dx = mx - n.x;
        const dy = my - n.y;
        const d = Math.hypot(dx, dy);
        if (d < 170) {
          n.x += dx * 0.004;
          n.y += dy * 0.004;
        }
        if (n.topic && d < 34) hot = n.label;
      });

      Object.entries(LINKS).forEach(([ti, posts]) => {
        const a = nodes[Number(ti)];
        posts.forEach((pi) => {
          const b = nodes[TOPICS.length + pi];
          if (!a || !b) return;
          const lit = !hot || hot === a.label;
          ctx.strokeStyle = lit
            ? 'rgba(43,143,212,.5)'
            : 'rgba(43,143,212,.07)';
          ctx.lineWidth = lit ? 1 : 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        });
      });

      nodes.forEach((n) => {
        const linked =
          !hot ||
          n.label === hot ||
          Object.entries(LINKS).some(
            ([ti, posts]) =>
              nodes[Number(ti)].label === hot &&
              posts.some((pi) => nodes[TOPICS.length + pi] === n)
          );
        ctx.globalAlpha = linked ? 1 : 0.16;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.topic ? '#f58122' : '#2b8fd4';
        ctx.fill();
        ctx.font = '500 10px "Fira Code", ui-monospace, monospace';
        ctx.fillStyle = n.topic
          ? 'rgba(245,129,34,.95)'
          : 'rgba(207,224,242,.8)';
        ctx.fillText(n.label, n.x + n.r + 6, n.y + 3);
        ctx.globalAlpha = 1;
      });
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section className="ps-sec" aria-labelledby="gr-head">
      <div className="ps-stars" aria-hidden="true" />
      <div className="ps-shell">
        <SectionIntro
          id="gr-head"
          eyebrow="How it connects"
          title={
            <>
              Everything,
              <br />
            </>
          }
          highlight="and what it touches"
          lead="Point at a topic to see only what belongs to it."
        />

        <div className="gr" ref={wrapRef}>
          <canvas ref={canvasRef} aria-hidden="true" />
          <span className="gr__lg">
            Orange · topics&nbsp;&nbsp;&nbsp;Blue · posts
          </span>
        </div>
      </div>
    </section>
  );
}
