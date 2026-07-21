'use client';

// components/portfolio/CursorIndex.tsx
//
// The full list. The preview chases the cursor with lag and skews toward the
// direction it is travelling, every other row dims, and the hovered row slides
// right. Replaces the old project grid, which was fed by invented projects.

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CASE_STUDIES } from '@/lib/case-studies';
import { SectionIntro } from '@/components/sections/SectionIntro';
import './portfolio-sections.css';

export default function CursorIndex() {
  const [active, setActive] = useState(-1);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const lastX = useRef(0);

  useEffect(() => {
    target.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    pos.current = { ...target.current };
    lastX.current = target.current.x;

    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('pointermove', onMove);

    let raf = 0;
    const loop = () => {
      const dx = target.current.x - pos.current.x;
      const dy = target.current.y - pos.current.y;
      pos.current.x += dx * 0.13;
      pos.current.y += dy * 0.13;

      const vx = target.current.x - lastX.current;
      lastX.current = target.current.x;
      const skew = Math.max(-14, Math.min(14, vx * 0.5));

      if (previewRef.current) {
        previewRef.current.style.transform =
          `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)` +
          ` rotate(${(skew * 0.35).toFixed(2)}deg) skewX(${(skew * 0.25).toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const clear = useCallback(() => setActive(-1), []);

  return (
    <section className="pf-sec" id="all-work" aria-labelledby="ix-head">
      <div className="pf-stars" aria-hidden="true" />
      <div className="pf-shell">
        <SectionIntro
          id="ix-head"
          eyebrow="All work"
          title={
            <>
              Seven,
              <br />
            </>
          }
          highlight="in full"
          lead="Point at a line. Every one opens the whole build."
        />

        <div
          className={`ix${active > -1 ? ' is-hot' : ''}`}
          onPointerLeave={clear}
        >
          {CASE_STUDIES.map((c, i) => (
            <Link
              key={c.slug}
              href={`/portfolio/${c.slug}`}
              className={`ix__r${i === active ? ' is-on' : ''}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="ix__n">
                <span className="ix__i">{String(i + 1).padStart(2, '0')}</span>
                {c.title}
              </span>
              <span className="ix__k">{c.kind}</span>
            </Link>
          ))}
        </div>
      </div>

      <div
        className={`ix__prev${active > -1 ? ' is-show' : ''}`}
        ref={previewRef}
        aria-hidden="true"
      >
        {CASE_STUDIES.map((c, i) =>
          c.image ? (
            <Image
              key={c.slug}
              src={c.image}
              alt=""
              width={1400}
              height={700}
              sizes="26rem"
              className={i === active ? 'is-on' : ''}
            />
          ) : null
        )}
      </div>
    </section>
  );
}
