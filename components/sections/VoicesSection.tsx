'use client';

// components/sections/VoicesSection.tsx
//
// Client words: one large quote, the others selectable beside it.
//
// IMPORTANT - the quotes below are SAMPLE COPY written to show the layout.
// They are not real client statements. Replace every entry with a genuine,
// attributable quote before launch, and delete `sample` from each one. While
// any entry is still marked sample, the section says so on the page: an
// invented testimonial two sections under "what happens if you disappear"
// would cost more trust than it buys.

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarButton } from '@/components/ui/star-button';
import { SectionIntro } from './SectionIntro';
import './voices-section.css';

type Voice = {
  quote: string;
  who: string;
  company: string;
  where: string;
  project: string;
  sample?: boolean;
};

const VOICES: Voice[] = [
  {
    quote:
      'The part I did not expect was being handed the accounts. Everything is in our name, so it is genuinely ours.',
    who: 'Owner',
    company: 'Curbside Laundry',
    where: 'Toronto',
    project: 'SaaS · CRM dashboard',
    sample: true,
  },
  {
    quote:
      'We went from publishing when someone had a spare afternoon to publishing every day, without hiring anyone.',
    who: 'Founder',
    company: 'mytechguide.io',
    where: 'eSIM',
    project: 'n8n · Content pipeline',
    sample: true,
  },
  {
    quote:
      'He built the store the way we actually sell, including the payment and delivery parts nobody else understood.',
    who: 'Director',
    company: 'Vape Brothers',
    where: 'Pakistan',
    project: 'Shopify · Custom theme',
    sample: true,
  },
];

export default function VoicesSection() {
  const [i, setI] = useState(0);
  const v = VOICES[i];
  const anySample = VOICES.some((x) => x.sample);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, []);

  return (
    <section className="vcs" aria-labelledby="vcs-head">
      <div className="vcs__stars" aria-hidden="true" />

      <div className="vcs__inner">
        <SectionIntro
          id="vcs-head"
          eyebrow="In their words"
          title={
            <>
              What the people
              <br />
              who hired us
            </>
          }
          highlight="say"
          lead="Named, attributed, and tied to a project you can open."
        />

        <div className="vcs__body">
          <article className="vcs__main" onPointerMove={onPointerMove}>
            <span className="vcs__mark" aria-hidden="true">
              &ldquo;
            </span>

            <AnimatePresence mode="wait">
              <motion.blockquote
                key={i}
                className="vcs__quote"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                {v.quote}
              </motion.blockquote>
            </AnimatePresence>

            <footer className="vcs__who">
              <span className="vcs__name">
                {v.who} · {v.company}
              </span>
              <span className="vcs__proj">{v.project}</span>
            </footer>
          </article>

          <div className="vcs__side" role="tablist" aria-label="Clients">
            {VOICES.map((x, j) => (
              <button
                key={x.company}
                role="tab"
                type="button"
                aria-selected={j === i}
                className={`vcs__pick${j === i ? ' is-on' : ''}`}
                onClick={() => setI(j)}
              >
                <b>{x.company}</b>
                <span>
                  {x.who} · {x.where}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="vcs__foot">
          {anySample && (
            <p className="vcs__sample">
              Sample copy — replace with real, attributable quotes before launch
            </p>
          )}
          <StarButton href="/contact">Start a project</StarButton>
        </div>
      </div>
    </section>
  );
}
