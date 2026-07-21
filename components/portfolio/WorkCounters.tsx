'use client';

// components/portfolio/WorkCounters.tsx
//
// Numbers count up while a ring draws around them, staggered as the row
// enters view. Deliberately a divider rather than a feature: it sits between
// two heavier sections without competing with either.

import { useEffect, useRef } from 'react';
import { SectionIntro } from '@/components/sections/SectionIntro';
import './portfolio-sections.css';

// value, the scale the ring fills against, label, note
const DATA: [number, number, string, string][] = [
  [7, 7, 'Shipped', 'Projects live, every one on this page.'],
  [11, 12, 'In production', 'n8n workflows running right now.'],
  [2, 7, 'Run in-house', 'Storefronts on our own automation.'],
  [5, 7, 'Published daily', 'Articles drafted by one pipeline.'],
];

const CIRC = 283; // 2πr for r=45

export default function WorkCounters() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const cards = Array.from(host.querySelectorAll<HTMLElement>('.cb__c'));
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const card = e.target as HTMLElement;
          const i = cards.indexOf(card);
          const fg = card.querySelector<SVGCircleElement>('.cb__fg');
          const v = card.querySelector<HTMLElement>('.cb__v');
          if (!fg || !v) return;

          if (!e.isIntersecting) {
            // Reset so it replays if you scroll back up to it.
            fg.style.strokeDashoffset = String(CIRC);
            v.textContent = '00';
            delete v.dataset.done;
            return;
          }
          if (v.dataset.done) return;
          v.dataset.done = '1';

          const to = DATA[i][0];
          const frac = to / DATA[i][1];
          const delay = 90 * i;

          if (reduce) {
            fg.style.strokeDashoffset = String(CIRC * (1 - frac));
            v.textContent = String(to).padStart(2, '0');
            return;
          }

          window.setTimeout(() => {
            fg.style.strokeDashoffset = String(CIRC * (1 - frac));
          }, delay);

          const t0 = performance.now() + delay;
          const step = (t: number) => {
            const k = Math.max(0, Math.min(1, (t - t0) / 1200));
            v.textContent = String(
              Math.round(to * (1 - Math.pow(1 - k, 3)))
            ).padStart(2, '0');
            if (k < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.45 }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section className="pf-sec" aria-labelledby="cb-head">
      <div className="pf-stars" aria-hidden="true" />
      <div className="pf-shell">
        <SectionIntro
          id="cb-head"
          eyebrow="Measured"
          title={
            <>
              Only what we
              <br />
            </>
          }
          highlight="can point at"
          lead="No round numbers. Every figure here is something on this page."
        />

        <div className="cb" ref={hostRef}>
          {DATA.map(([, , label, note]) => (
            <article className="cb__c" key={label}>
              <div className="cb__ring">
                <svg
                  width="102"
                  height="102"
                  viewBox="0 0 102 102"
                  aria-hidden="true"
                >
                  <circle className="cb__bg" cx="51" cy="51" r="45" />
                  <circle className="cb__fg" cx="51" cy="51" r="45" />
                </svg>
                <span className="cb__v">00</span>
              </div>
              <p className="cb__k">{label}</p>
              <p className="cb__d">{note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
