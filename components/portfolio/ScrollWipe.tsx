'use client';

// components/portfolio/ScrollWipe.tsx
//
// The section pins and scroll drives a wipe across the card: the old way of
// working is physically replaced by the new one, with a lit seam at the
// boundary. One project, told through movement rather than described.

import { useEffect, useRef } from 'react';
import { CASE_STUDIES } from '@/lib/case-studies';
import { SectionIntro } from '@/components/sections/SectionIntro';
import './portfolio-sections.css';

// The pipeline is the clearest before-and-after we have.
const CASE =
  CASE_STUDIES.find((c) => c.slug === 'content-pipeline') ?? CASE_STUDIES[0];

export default function ScrollWipe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;

      // The whole section pins - heading included - and the page holds still
      // while the wipe runs. Travel is exactly the wrapper height minus one
      // viewport, so the pin releases the moment the wipe finishes and there
      // is no spare height left showing as a gap.
      const travel = wrap.offsetHeight - window.innerHeight;
      if (travel <= 0) return;

      const p = Math.min(
        1,
        Math.max(0, -wrap.getBoundingClientRect().top / travel)
      );
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

      if (afterRef.current) {
        afterRef.current.style.clipPath = `inset(0 ${((1 - e) * 100).toFixed(2)}% 0 0)`;
      }
      if (seamRef.current) {
        seamRef.current.style.left = `${(e * 100).toFixed(2)}%`;
        seamRef.current.style.opacity = e > 0.01 && e < 0.99 ? '1' : '0';
      }
      if (labelRef.current) {
        labelRef.current.textContent =
          e < 0.35 ? 'Before' : e > 0.75 ? 'After' : 'Replacing…';
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const row = (t: string, after: boolean) => (
    <div className="wp__li" key={t}>
      <span className={`wp__dot${after ? ' is-after' : ''}`} />
      {t}
    </div>
  );

  return (
    <section className="pf-sec pf-sec--pin" aria-labelledby="wp-head">
      <div className="wp" ref={wrapRef}>
        <div className="wp__pin">
          <div className="pf-stars" aria-hidden="true" />
          <div className="pf-shell">
            <SectionIntro
              id="wp-head"
              eyebrow="What changed"
              title={
                <>
                  Scroll to
                  <br />
                </>
              }
              highlight="replace the old way"
              lead={`${CASE.title} — ${CASE.kind}`}
            />

            <div className="wp__card">
              <div className="wp__layer wp__before">
                <span className="wp__k">Before</span>
                {CASE.before.map((t) => row(t, false))}
                <span className="wp__cost">{CASE.outcomes[0]?.label}</span>
              </div>

              <div className="wp__layer wp__after" ref={afterRef}>
                <span className="wp__k is-after">After</span>
                {CASE.after.map((t) => row(t, true))}
                <span className="wp__cost is-after">
                  {CASE.outcomes[0]?.value} {CASE.outcomes[0]?.label}
                </span>
              </div>

              <span className="wp__seam" ref={seamRef} aria-hidden="true" />
              <div className="wp__hud">
                <span ref={labelRef}>Before</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
