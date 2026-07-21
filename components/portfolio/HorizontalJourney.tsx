'use client';

// components/portfolio/HorizontalJourney.tsx
//
// Portfolio hero. Scrolling down moves the page sideways: the track is
// translated by scroll progress, panels skew with scroll velocity, and the
// image inside each panel drifts at a different rate than its frame, so the
// row has depth rather than just moving.

import { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CASE_STUDIES } from '@/lib/case-studies';
import './portfolio-sections.css';

export default function HorizontalJourney() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const distance = useRef(0);
  const lastP = useRef(0);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;
    distance.current = Math.max(0, track.scrollWidth - window.innerWidth);
    // The track has to travel its own width, so the scroll height follows it.
    wrap.style.height = `${Math.max(window.innerHeight * 1.6, distance.current + window.innerHeight)}px`;
  }, []);

  useEffect(() => {
    measure();

    const onScroll = () => {
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track) return;

      const total = wrap.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(
        1,
        Math.max(0, -wrap.getBoundingClientRect().top / total)
      );

      track.style.transform = `translate3d(${-p * distance.current}px,0,0)`;

      const v = Math.max(-1, Math.min(1, (p - lastP.current) * 26));
      lastP.current = p;

      const panels = track.querySelectorAll<HTMLElement>('.pj__panel');
      panels.forEach((el) => {
        el.style.transform = `skewX(${(v * -4).toFixed(2)}deg)`;
        const inner = el.querySelector<HTMLElement>('.pj__inner');
        if (!inner) return;
        const r = el.getBoundingClientRect();
        const off =
          (r.left + r.width / 2 - window.innerWidth / 2) / window.innerWidth;
        inner.style.transform = `translateX(${(off * -26).toFixed(1)}px) scale(1.12)`;
      });

      if (fillRef.current)
        fillRef.current.style.width = `${(p * 100).toFixed(1)}%`;
      if (countRef.current) {
        const n = Math.min(
          CASE_STUDIES.length,
          Math.floor(p * CASE_STUDIES.length) + 1
        );
        countRef.current.textContent = `${String(n).padStart(2, '0')} / ${String(CASE_STUDIES.length).padStart(2, '0')}`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  return (
    <>
      <section className="pj__intro">
        <div className="pj__stars" aria-hidden="true" />
        <div className="pf-shell pf-intro">
          <span className="pf-pill">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M12 3l1.9 5.8L20 10.7l-5.1 3.4L16 20l-4-3.2L8 20l1.1-5.9L4 10.7l6.1-1.9z" />
            </svg>
            <span>✨ Selected work</span>
            <i />
          </span>
          <h1 className="pf-h">
            Seven systems,
            <br />
            <em>side by side</em>
          </h1>
          <p className="pf-lead">
            Every one is live. Scroll to travel across them.
          </p>
        </div>
      </section>

      <div className="pj" ref={wrapRef}>
        <div className="pj__pin">
          <div className="pj__stars" aria-hidden="true" />
          <div className="pj__track" ref={trackRef}>
            {CASE_STUDIES.map((c, i) => (
              <Link
                className="pj__panel"
                key={c.slug}
                href={`/portfolio/${c.slug}`}
                aria-label={`${c.title} case study`}
              >
                <span className="pj__inner">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={`${c.title} interface`}
                      width={1400}
                      height={700}
                      sizes="(max-width: 700px) 82vw, 34rem"
                      priority={i < 2}
                    />
                  ) : (
                    <span className="pj__placeholder" />
                  )}
                </span>
                <span className="pj__grad" />
                <span className="pj__cap">
                  <span className="pj__k">{c.kind}</span>
                  <span className="pj__t">{c.title}</span>
                  <span className="pj__s">{c.summary}</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="pj__hud">
            <span className="pj__count" ref={countRef}>
              01 / {String(CASE_STUDIES.length).padStart(2, '0')}
            </span>
            <span className="pj__rail">
              <span className="pj__fill" ref={fillRef} />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
