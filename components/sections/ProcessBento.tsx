'use client';

// components/sections/ProcessBento.tsx
//
// Section five: what actually happens if you hire us, as a bento.
//
// Every card is alive. A spotlight follows the pointer across it, the card
// tilts a few degrees toward the cursor, and each stage carries its own small
// animation that plays on hover - the same idea as the old bento's skeletons,
// but drawn to mean something: rows being scanned, a pulse crossing a
// prototype, stages filling with one rerunning alone, keys changing hands.

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { StarButton } from '@/components/ui/star-button';
import { SectionIntro } from './SectionIntro';
import './process-bento.css';

/** Pointer tracking: writes position and tilt to CSS variables. No re-render. */
function usePointerCard() {
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    el.style.setProperty('--ry', `${((x / r.width - 0.5) * 7).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${((0.5 - y / r.height) * 5).toFixed(2)}deg`);
  }, []);

  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }, []);

  return { onPointerMove, onPointerLeave };
}

/* ------------------------------------------------------------ skeletons -- */

/** Map: rows of work, scanned, with the repeating ones picked out. */
function MapSkeleton() {
  const rows = [82, 64, 92, 48, 74, 58];
  return (
    <div className="pk pk--map">
      {rows.map((w, i) => (
        <motion.span
          key={i}
          className={`pk__row${i === 1 || i === 4 ? ' is-hit' : ''}`}
          style={{ width: `${w}%` }}
          variants={{
            rest: { opacity: 0.4 },
            hover: {
              opacity: i === 1 || i === 4 ? 1 : 0.25,
              transition: { delay: i * 0.05 },
            },
          }}
        />
      ))}
      <motion.span
        className="pk__scan"
        variants={{
          rest: { y: -8, opacity: 0 },
          hover: {
            y: 66,
            opacity: [0, 1, 1, 0],
            transition: { duration: 1.1, ease: 'easeInOut' },
          },
        }}
      />
    </div>
  );
}

/** Prototype: one narrow run, proving itself end to end. */
function ProtoSkeleton() {
  return (
    <div className="pk pk--proto">
      <span className="pk__wire" />
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="pk__node"
          style={{ left: `${12 + i * 38}%` }}
          variants={{
            rest: { scale: 1, borderColor: '#16203a' },
            hover: {
              scale: [1, 1.28, 1],
              borderColor: ['#16203a', '#f58220', '#2b8fd4'],
              transition: { duration: 0.5, delay: i * 0.22 },
            },
          }}
        />
      ))}
      <motion.span
        className="pk__pulse"
        variants={{
          rest: { left: '12%', opacity: 0 },
          hover: {
            left: ['12%', '88%'],
            opacity: [0, 1, 1, 0],
            transition: { duration: 1.1, ease: 'easeInOut' },
          },
        }}
      />
    </div>
  );
}

/** Build: stages fill in order, and stage three reruns on its own. */
function BuildSkeleton() {
  return (
    <div className="pk pk--build">
      {[0, 1, 2, 3].map((i) => (
        <span className="pk__bar" key={i}>
          <motion.span
            className={`pk__fill${i === 2 ? ' is-rerun' : ''}`}
            variants={{
              rest: { width: '0%' },
              hover:
                i === 2
                  ? {
                      width: ['0%', '62%', '62%', '0%', '100%'],
                      transition: {
                        duration: 1.7,
                        times: [0, 0.28, 0.44, 0.5, 1],
                      },
                    }
                  : {
                      width: '100%',
                      transition: { duration: 0.5, delay: i * 0.12 },
                    },
            }}
          />
        </span>
      ))}
    </div>
  );
}

/** Hand over: the keys move across, and stay moved. */
function HandoverSkeleton() {
  return (
    <div className="pk pk--hand">
      <span className="pk__box">us</span>
      <motion.span
        className="pk__key"
        variants={{
          // Percentages, not pixels: a fixed 88px landed short of the
          // receiving box at every card width.
          rest: { left: '17%', rotate: 0 },
          hover: {
            left: '68%',
            rotate: 375,
            transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
          },
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="8" cy="12" r="4" />
          <path d="M12 12h9M18 12v4" />
        </svg>
      </motion.span>
      <span className="pk__box pk__box--you">you</span>
    </div>
  );
}

/* ----------------------------------------------------------------- data -- */

const STEPS = [
  {
    n: '01',
    t: 'Map',
    d: 'We walk your current process and write down every step that repeats. Most of the value is found here, before anything is built.',
    meta: 'One call, one shared document',
    Skeleton: MapSkeleton,
  },
  {
    n: '02',
    t: 'Prototype',
    d: 'One workflow, narrow on purpose, running on your real data. You watch it work before committing to the rest.',
    meta: 'Smallest useful piece first',
    Skeleton: ProtoSkeleton,
  },
  {
    n: '03',
    t: 'Build',
    d: 'The remaining stages, each one independent, so a failure costs you that step and not the whole run.',
    meta: 'Stage by stage, testable',
    Skeleton: BuildSkeleton,
  },
  {
    n: '04',
    t: 'Hand over',
    d: 'Credentials, repository, documentation and a walkthrough. You could replace us the next day and nothing would stop.',
    meta: 'Yours to keep, not to rent',
    Skeleton: HandoverSkeleton,
  },
];

const rise = {
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

/* ------------------------------------------------------------- section -- */

export default function ProcessBento() {
  const pointer = usePointerCard();

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
              className="prc__card prc__step"
              key={s.n}
              custom={i}
              variants={rise}
              {...pointer}
            >
              <motion.div
                className="prc__live"
                initial="rest"
                animate="rest"
                whileHover="hover"
              >
                <s.Skeleton />
                <span className="prc__n">{s.n}</span>
                <h3 className="prc__t">{s.t}</h3>
                <p className="prc__d">{s.d}</p>
                <span className="prc__meta">{s.meta}</span>
              </motion.div>
            </motion.article>
          ))}

          <motion.article
            className="prc__card prc__wide"
            custom={4}
            variants={rise}
            {...pointer}
          >
            <h3 className="prc__wide-t">
              Nothing goes live without <b>someone saying yes</b>
            </h3>
            <p className="prc__wide-d">
              Every pipeline we build drafts first. A person approves before a
              customer, a search engine or a storefront ever sees the output. It
              is slower on day one, and it is the reason none of our systems
              have published something we had to go back and delete.
            </p>
          </motion.article>

          <motion.article
            className="prc__card prc__keys"
            custom={5}
            variants={rise}
            {...pointer}
          >
            <p className="prc__keys-k">You keep the keys</p>
            <ul className="prc__keys-list">
              <li>Accounts opened in your name</li>
              <li>Repository under your organisation</li>
              <li>Written handover, not a verbal one</li>
            </ul>
          </motion.article>

          <motion.article
            className="prc__card prc__cta"
            custom={6}
            variants={rise}
            {...pointer}
          >
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
