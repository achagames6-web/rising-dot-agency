'use client';

// components/portfolio/ComparisonTable.tsx
//
// "Why us" answered as contrast rather than adjectives. Rows arrive from
// opposite sides as they enter view: ours from the left, the usual arrangement
// from the right, so the two are read against each other.
//
// Every line is a real difference we can stand behind, not a straw man.

import { useEffect, useRef } from 'react';
import { StarButton } from '@/components/ui/star-button';
import { SectionIntro } from '@/components/sections/SectionIntro';
import './portfolio-sections.css';

const ROWS: [string, string, string][] = [
  [
    'Accounts opened in your name',
    'Ownership',
    'Agency-owned accounts you rent',
  ],
  ['Fixed-scope prototype first', 'Starting', 'A full build quoted up front'],
  ['Every stage reruns on its own', 'When it breaks', 'Restart the whole run'],
  ['Nothing publishes unreviewed', 'Output', 'Auto-published, fixed later'],
  [
    'Written handover and documentation',
    'Leaving',
    'A phone call and good luck',
  ],
  [
    'You talk to the person building it',
    'Contact',
    'An account manager relays it',
  ],
];

export default function ComparisonTable() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const rows = Array.from(host.querySelectorAll<HTMLElement>('.cp__line'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.target.classList.toggle('is-in', e.isIntersecting)
        );
      },
      { threshold: 0.4 }
    );
    rows.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="pf-sec" aria-labelledby="cp-head">
      <div className="pf-stars" aria-hidden="true" />
      <div className="pf-shell">
        <SectionIntro
          id="cp-head"
          eyebrow="The difference"
          title={
            <>
              What you get, and
              <br />
            </>
          }
          highlight="what you usually get"
          lead="Six differences, each one checkable against the work above."
        />

        <div className="cp" ref={hostRef}>
          <div className="cp__hd cp__us">Rising Dot</div>
          <div className="cp__hd cp__mid" aria-hidden="true" />
          <div className="cp__hd cp__them">The usual arrangement</div>

          {ROWS.map(([us, label, them]) => (
            <div className="cp__line" key={label}>
              <div className="cp__r cp__us">
                <span className="cp__tick" aria-hidden="true" />
                {us}
              </div>
              <div className="cp__r cp__mid">{label}</div>
              <div className="cp__r cp__them">{them}</div>
            </div>
          ))}
        </div>

        <div className="cp__cta">
          <StarButton href="/contact">Start a project</StarButton>
        </div>
      </div>
    </section>
  );
}
