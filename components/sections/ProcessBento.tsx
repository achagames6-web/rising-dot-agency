'use client';

// components/sections/ProcessBento.tsx
//
// Section five. The page has already said what we do, what we have built and
// who we are. The question left is what actually happens if you hire us, so
// this is the engagement, in order, with the two commitments that matter most
// pulled out beside it.
//
// Background, eyebrow, heading, motion and buttons are all the shared pieces:
// same page black and star field as three and four, SectionIntro, StarButton.

import { motion } from 'framer-motion';
import { StarButton } from '@/components/ui/star-button';
import { SectionIntro } from './SectionIntro';
import './process-bento.css';

const STEPS = [
  {
    n: '01',
    t: 'Map',
    d: 'We walk your current process and write down every step that repeats. Most of the value is found here, before anything is built.',
    meta: 'One call, one shared document',
  },
  {
    n: '02',
    t: 'Prototype',
    d: 'One workflow, narrow on purpose, running on your real data. You watch it work before committing to the rest.',
    meta: 'Smallest useful piece first',
  },
  {
    n: '03',
    t: 'Build',
    d: 'The remaining stages, each one independent so a failure costs you that step and not the whole run.',
    meta: 'Stage by stage, testable',
  },
  {
    n: '04',
    t: 'Hand over',
    d: 'Credentials, repository, documentation and a walkthrough. You could replace us the next day and nothing would stop.',
    meta: 'Yours to keep, not to rent',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.07,
      ease: [0.23, 0.86, 0.39, 0.96] as const,
    },
  }),
};

export default function ProcessBento() {
  return (
    <section className="prc" aria-labelledby="prc-head">
      <div className="prc__stars" aria-hidden="true" />

      <div className="prc__inner">
        <SectionIntro
          id="prc-head"
          eyebrow="How it runs"
          title={
            <>
              From first call
              <br />
              to a
            </>
          }
          highlight="running system"
          lead="Four stages. You see it working before you are asked to commit to the whole thing."
        />

        <motion.div
          className="prc__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {STEPS.map((s, i) => (
            <motion.article
              className="prc__step"
              key={s.n}
              custom={i}
              variants={fadeUp}
            >
              <span className="prc__n">{s.n}</span>
              <h3 className="prc__t">{s.t}</h3>
              <p className="prc__d">{s.d}</p>
              <span className="prc__meta">{s.meta}</span>
            </motion.article>
          ))}

          <motion.article className="prc__wide" custom={4} variants={fadeUp}>
            <h3 className="prc__wide-t">
              Nothing goes live without <b>someone saying yes</b>
            </h3>
            <p className="prc__wide-d">
              Every pipeline we build drafts first. A person approves before a
              customer, a search engine or a storefront ever sees the output. It
              is slower on day one and it is the reason none of our systems have
              published something we had to go back and delete.
            </p>
          </motion.article>

          <motion.article className="prc__keys" custom={5} variants={fadeUp}>
            <p className="prc__keys-k">You keep the keys</p>
            <ul className="prc__keys-list">
              <li>Accounts opened in your name</li>
              <li>Repository under your organisation</li>
              <li>Written handover, not a verbal one</li>
            </ul>
          </motion.article>

          <motion.article className="prc__cta" custom={6} variants={fadeUp}>
            <h3 className="prc__cta-t">
              Tell us what should
              <br />
              stop repeating
            </h3>
            <p className="prc__cta-d">
              The first call is a conversation about your process, not a pitch.
            </p>
            <div className="prc__cta-row">
              <StarButton href="/contact">Start a project</StarButton>
              <StarButton href="/portfolio" variant="ghost">
                See the work
              </StarButton>
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
