'use client';

// components/portfolio/CaseSpotlight.tsx
//
// The visual pins while the writing scrolls past it. Whichever block is in the
// middle of the screen owns the frame, so three projects get proper attention
// without costing three screens of scroll each.

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CASE_STUDIES } from '@/lib/case-studies';
import { SectionIntro } from '@/components/sections/SectionIntro';
import { StarButton } from '@/components/ui/star-button';
import './portfolio-sections.css';

const PICKS = CASE_STUDIES.slice(0, 3);

export default function CaseSpotlight() {
  const [active, setActive] = useState(0);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = stepsRef.current;
    if (!host) return;
    const items = Array.from(host.querySelectorAll<HTMLElement>('.sp__s'));
    if (!items.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting)
            setActive(Number(e.target.getAttribute('data-i')));
        });
      },
      // A narrow band through the middle of the screen decides who is active.
      { rootMargin: '-45% 0px -45% 0px' }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="pf-sec" aria-labelledby="sp-head">
      <div className="pf-stars" aria-hidden="true" />
      <div className="pf-shell">
        <SectionIntro
          id="sp-head"
          eyebrow="In detail"
          title={
            <>
              A closer look at
              <br />
            </>
          }
          highlight="three of them"
          lead="The frame holds while you read. Each one opens in full."
        />

        <div className="sp">
          <div className="sp__media">
            {PICKS.map((c, i) =>
              c.image ? (
                <figure key={c.slug} className={i === active ? 'is-on' : ''}>
                  <Image
                    src={c.image}
                    alt={`${c.title} interface`}
                    width={1400}
                    height={700}
                    sizes="(max-width: 900px) 92vw, 40rem"
                  />
                </figure>
              ) : null
            )}
            <div className="sp__ticks" aria-hidden="true">
              {PICKS.map((c, i) => (
                <i key={c.slug} className={i === active ? 'is-on' : ''} />
              ))}
            </div>
          </div>

          <div className="sp__steps" ref={stepsRef}>
            {PICKS.map((c, i) => (
              <article
                key={c.slug}
                data-i={i}
                className={`sp__s${i === active ? ' is-on' : ''}`}
              >
                <span className="sp__n">
                  {String(i + 1).padStart(2, '0')} /{' '}
                  {String(PICKS.length).padStart(2, '0')} · {c.kind}
                </span>
                <h3 className="sp__t">{c.title}</h3>
                <p className="sp__d">{c.summary}</p>
                <div className="pf-chips">
                  {c.stack.map((s) => (
                    <span className="pf-chip" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
                <div className="sp__cta">
                  <StarButton href={`/portfolio/${c.slug}`}>
                    Read the case study
                  </StarButton>
                </div>
              </article>
            ))}

            <p className="sp__all">
              <Link href="#all-work">See all seven &rarr;</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
