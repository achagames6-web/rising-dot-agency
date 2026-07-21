'use client';

// components/portfolio/ShippingTimeline.tsx
//
// The year in order. A line fills as you scroll and each marker lights when it
// reaches you, so seven projects read as pace rather than as a list.

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { CASE_STUDIES } from '@/lib/case-studies';
import { SectionIntro } from '@/components/sections/SectionIntro';
import './portfolio-sections.css';

// Order shipped, which is not the order they appear elsewhere.
const ORDER = [
  'curbside-laundry',
  'vape-brothers',
  'south-bay-living',
  'content-pipeline',
  'image-pipeline',
  'seo-command-center',
  'dredd-ai',
];

const WHEN: Record<string, string> = {
  'curbside-laundry': 'Early 2025',
  'vape-brothers': 'Mid 2025',
  'south-bay-living': 'Mid 2025',
  'content-pipeline': 'Late 2025',
  'image-pipeline': 'Late 2025',
  'seo-command-center': 'Late 2025',
  'dredd-ai': 'Late 2025',
};

const ITEMS = ORDER.map(
  (slug) => CASE_STUDIES.find((c) => c.slug === slug)!
).filter(Boolean);

export default function ShippingTimeline() {
  const hostRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const items = Array.from(host.querySelectorAll<HTMLElement>('.tl__i'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.target.classList.toggle('is-in', e.isIntersecting)
        );
      },
      { threshold: 0.35 }
    );
    items.forEach((el) => io.observe(el));

    const onScroll = () => {
      const r = host.getBoundingClientRect();
      // The line fills as the list passes the lower third of the screen.
      const p = Math.min(
        1,
        Math.max(0, (window.innerHeight * 0.72 - r.top) / r.height)
      );
      if (fillRef.current)
        fillRef.current.style.height = `${(p * 100).toFixed(1)}%`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className="pf-sec" aria-labelledby="tl-head">
      <div className="pf-stars" aria-hidden="true" />
      <div className="pf-shell">
        <SectionIntro
          id="tl-head"
          eyebrow="Shipped"
          title={
            <>
              Seven builds,
              <br />
            </>
          }
          highlight="in order"
          lead="The year as it actually happened."
        />

        <div className="tl" ref={hostRef}>
          <span className="tl__line" aria-hidden="true">
            <i ref={fillRef} />
          </span>

          {ITEMS.map((c) => (
            <article className="tl__i" key={c.slug}>
              <span className="tl__d">{WHEN[c.slug]}</span>
              <h3 className="tl__t">
                <Link href={`/portfolio/${c.slug}`}>{c.title}</Link>
              </h3>
              <p className="tl__s">{c.summary}</p>
              <div className="pf-chips">
                {c.stack.slice(0, 3).map((s) => (
                  <span className="pf-chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
