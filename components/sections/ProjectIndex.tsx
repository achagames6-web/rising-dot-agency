'use client';

// components/sections/ProjectIndex.tsx
// The seven shipped projects as an index: a numbered list on the left, a
// preview of whichever one you are pointing at on the right.
//
// Reads from lib/hero/journey WORK - the same array the hero's wall uses -
// so the projects can never disagree between the two sections.

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WORK } from '@/lib/hero/journey';
import { CASE_STUDIES } from '@/lib/case-studies';
import { SectionIntro } from './SectionIntro';
import './project-index.css';

/** Rows now open the case study when one exists, not the service page. */
const caseHref = (title: string) => {
  const c = CASE_STUDIES.find((x) => x.title === title);
  return c ? `/portfolio/${c.slug}` : undefined;
};

export default function ProjectIndex() {
  const [active, setActive] = useState(0);
  const item = WORK[active];

  return (
    <section className="pidx" aria-labelledby="pidx-head">
      <div className="pidx__stars" aria-hidden="true" />

      <div className="pidx__inner">
        <div className="pidx__head">
          <SectionIntro
            id="pidx-head"
            eyebrow="Selected work"
            title={
              <>
                Seven things
                <br />
                we
              </>
            }
            highlight="actually shipped"
            lead="Every one is live. Point at a line to see it."
          />
        </div>

        <div className="pidx__body">
          <ol className="pidx__list">
            {WORK.map((w, i) => (
              <li key={w.title}>
                <Link
                  href={caseHref(w.title) ?? w.href}
                  className={`pidx__row${i === active ? ' is-on' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <span className="pidx__n">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="pidx__t">{w.title}</span>
                  <span className="pidx__k">{w.kind}</span>
                </Link>
              </li>
            ))}
          </ol>

          <aside className="pidx__panel" aria-live="polite">
            <div className="pidx__shot">
              {WORK.map((w, i) =>
                w.image ? (
                  <Image
                    key={w.title}
                    src={w.image}
                    alt={`${w.title} interface`}
                    width={1400}
                    height={700}
                    sizes="(max-width: 1100px) 90vw, 40rem"
                    className={i === active ? 'is-on' : ''}
                  />
                ) : null
              )}
            </div>

            <div className="pidx__meta">
              <p className="pidx__kicker">{item.kind}</p>
              <h3 className="pidx__name">{item.title}</h3>
              <p className="pidx__desc">{item.blurb}</p>
              <div className="pidx__foot">
                <span>{item.stack}</span>
                <span>{item.year}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
