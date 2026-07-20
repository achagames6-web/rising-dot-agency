'use client';

// components/case/CaseBody.tsx
// The animated half of a case study. Everything that needs the browser lives
// here so the page itself can stay a server component and keep its metadata.

import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { StarButton } from '@/components/ui/star-button';
import { SectionIntro } from '@/components/sections/SectionIntro';
import { SectionTabs } from '@/components/sections/SectionTabs';
import type { CaseStudy } from '@/lib/case-studies';
import './case.css';

function usePointerCard() {
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    el.style.setProperty('--ry', `${((x / r.width - 0.5) * 5).toFixed(2)}deg`);
    el.style.setProperty(
      '--rx',
      `${((0.5 - y / r.height) * 3.5).toFixed(2)}deg`
    );
  }, []);
  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  }, []);
  return { onPointerMove, onPointerLeave };
}

const SHIFT_TABS = [
  { id: 'before', label: 'Before' },
  { id: 'after', label: 'After' },
] as const;

const rise = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.06,
      ease: [0.23, 0.86, 0.39, 0.96] as const,
    },
  }),
};

export function CaseBody({
  study,
  next,
}: {
  study: CaseStudy;
  next: { slug: string; title: string; kind: string };
}) {
  const [side, setSide] = useState<'before' | 'after'>('before');
  const pointer = usePointerCard();
  const list = side === 'after' ? study.after : study.before;

  return (
    <>
      {/* ---------- opening ---------- */}
      <section className="cs cs--hero">
        <div className="cs__stars" aria-hidden="true" />
        <div className="cs__inner">
          <SectionIntro
            eyebrow={study.kind}
            title={<>{study.title}</>}
            lead={study.summary}
          />

          <motion.div
            className="cs__meta"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {study.stack.map((s, i) => (
              <motion.span
                key={s}
                custom={i}
                variants={rise}
                className="cs__chip"
              >
                {s}
              </motion.span>
            ))}
          </motion.div>

          {study.image && (
            <motion.div
              className="cs__shot"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.23, 0.86, 0.39, 0.96] }}
            >
              <Image
                src={study.image}
                alt={`${study.title} interface`}
                width={1400}
                height={700}
                priority
                sizes="(max-width: 1100px) 92vw, 76rem"
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* ---------- what changed ---------- */}
      <section className="cs">
        <div className="cs__stars" aria-hidden="true" />
        <div className="cs__inner">
          <SectionIntro
            eyebrow="What changed"
            title={
              <>
                The same job,
                <br />
              </>
            }
            highlight="minus the manual part"
            lead="Switch between how the work ran before, and how it runs now."
          />

          <SectionTabs
            idBase={`shift-${study.slug}`}
            label="Before and after"
            tabs={SHIFT_TABS}
            active={side}
            onChange={(id) => setSide(id as 'before' | 'after')}
          />

          <AnimatePresence mode="wait">
            <motion.ul
              key={side}
              className={`cs__shift${side === 'after' ? ' is-after' : ''}`}
              initial={{ opacity: 0, x: side === 'after' ? 16 : -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: side === 'after' ? -16 : 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {list.map((li) => (
                <li key={li} {...pointer}>
                  <span className="cs__bullet" />
                  {li}
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </section>

      {/* ---------- the build ---------- */}
      <section className="cs">
        <div className="cs__stars" aria-hidden="true" />
        <div className="cs__inner">
          <SectionIntro
            eyebrow="The build"
            title={
              <>
                How it was
                <br />
              </>
            }
            highlight="put together"
            lead="In the order it was built, and why each part exists."
          />

          <motion.ol
            className="cs__steps"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {study.steps.map((s, i) => (
              <motion.li
                key={s.title}
                className="cs__step"
                custom={i}
                variants={rise}
                {...pointer}
              >
                <span className="cs__n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="cs__step-t">{s.title}</h3>
                <p className="cs__step-d">{s.body}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* ---------- prose + outcomes ---------- */}
      <section className="cs">
        <div className="cs__stars" aria-hidden="true" />
        <div className="cs__inner">
          <div className="cs__prose">
            {study.sections.map((sec, i) => (
              <motion.article
                key={sec.heading}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.05,
                  ease: [0.23, 0.86, 0.39, 0.96],
                }}
              >
                <h2 className="cs__h">{sec.heading}</h2>
                {sec.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </motion.article>
            ))}
          </div>

          <motion.div
            className="cs__outcomes"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {study.outcomes.map((o, i) => (
              <motion.div
                key={o.label}
                className="cs__outcome"
                custom={i}
                variants={rise}
                {...pointer}
              >
                <p className="cs__outcome-v">{o.value}</p>
                <p className="cs__outcome-l">{o.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- close ---------- */}
      <section className="cs cs--close">
        <div className="cs__stars" aria-hidden="true" />
        <div className="cs__inner">
          <SectionIntro
            eyebrow="Next"
            title={
              <>
                Want something
                <br />
              </>
            }
            highlight="like this"
            lead="The first call is a conversation about your process, not a pitch."
          />

          <div className="cs__actions">
            <StarButton href="/contact">Start a project</StarButton>
            <StarButton href={study.service.href} variant="ghost">
              {study.service.label}
            </StarButton>
          </div>

          <Link className="cs__next" href={`/portfolio/${next.slug}`}>
            <span className="cs__next-k">Next case study</span>
            <span className="cs__next-t">{next.title}</span>
            <span className="cs__next-m">{next.kind} &rarr;</span>
          </Link>
        </div>
      </section>
    </>
  );
}
