'use client';

// components/pages/ReadingPaths.tsx  (Blog)
//
// Not a list - routes. Three curated orders through the writing depending on
// why you arrived, which is the real blog problem: a first-time reader has no
// idea where to start.

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionIntro } from '@/components/sections/SectionIntro';
import './page-sections.css';

const PATHS = [
  {
    n: '01',
    title: 'New to automation',
    blurb: 'Start here if you have never automated anything.',
    steps: [
      'What actually repeats in your business',
      'Why draft-first matters more than speed',
      'Your first workflow, and what it should do',
    ],
  },
  {
    n: '02',
    title: 'Running a store',
    blurb: 'For Shopify and WordPress owners.',
    steps: [
      'Local payment rails are the whole job',
      'Product SEO at catalogue scale',
      'Themes that survive updates',
    ],
  },
  {
    n: '03',
    title: 'Technical reader',
    blurb: 'If you write software yourself.',
    steps: [
      'Why nine workflows beat one',
      'Async pipelines: polling instead of hoping',
      'On-chain data without the hype',
    ],
  },
];

const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.23, 0.86, 0.39, 0.96] as const,
    },
  }),
};

export default function ReadingPaths() {
  return (
    <section className="ps-sec" aria-labelledby="rp-head">
      <div className="ps-stars" aria-hidden="true" />
      <div className="ps-shell">
        <SectionIntro
          id="rp-head"
          eyebrow="Where to start"
          title={
            <>
              Three ways
              <br />
            </>
          }
          highlight="through the writing"
          lead="Pick the one that sounds like you."
        />

        <motion.div
          className="rp"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {PATHS.map((p, i) => (
            <motion.article
              className="rp__c"
              key={p.n}
              custom={i}
              variants={rise}
            >
              <span className="rp__n">{p.n}</span>
              <h3 className="rp__t">{p.title}</h3>
              <p className="rp__x">{p.blurb}</p>

              <ol className="rp__steps">
                {p.steps.map((s) => (
                  <li className="rp__s" key={s}>
                    {s}
                  </li>
                ))}
              </ol>

              <Link className="rp__go" href="/blog">
                Start this path &rarr;
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
