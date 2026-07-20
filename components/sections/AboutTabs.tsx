'use client';

// components/sections/AboutTabs.tsx
//
// Section four. Both approved concepts live here as two tabs:
//   Who we are  - we run our own shop on the same wiring
//   How we work - the six rules
//
// Background continues the section above it: same page black, same star
// field, so three and four read as one field of space rather than two
// panels. Eyebrow, heading and motion come from SectionIntro. Buttons are
// the site's StarButton.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarButton } from '@/components/ui/star-button';
import { SectionIntro } from './SectionIntro';
import './about-tabs.css';

const TABS = [
  { id: 'who', label: 'Who we are' },
  { id: 'how', label: 'How we work' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const IN_HOUSE = [
  {
    name: 'SEO Command Center',
    desc: 'Scores and drafts product SEO across two live stores.',
  },
  {
    name: 'Content Pipeline',
    desc: 'Nine sub-workflows, around five articles a day, draft first.',
  },
  {
    name: 'Image Pipeline',
    desc: 'Prompt, render, poll, store. Async end to end.',
  },
  {
    name: 'Two retail storefronts',
    desc: 'Our own catalogues, running on our own automation.',
  },
];

const RULES = [
  {
    rule: 'Draft first, always',
    why: 'Nothing we build publishes on its own. A human approves before the world sees it, every time.',
  },
  {
    rule: 'Every stage reruns alone',
    why: 'When step six fails, you rerun step six. Restarting a whole pipeline to fix one call is a design failure.',
  },
  {
    rule: 'We use it before you do',
    why: 'The platforms we sell run our own stores first. If we would not live with it, we do not ship it.',
  },
  {
    rule: 'No page-builder weight',
    why: 'Hand-built front ends. Faster to load, cheaper to change, and still yours if we disappear.',
  },
  {
    rule: 'You own the keys',
    why: 'Your accounts, your credentials, your repo. Handover includes documentation, not a dependency on us.',
  },
  {
    rule: 'One operator, not a queue',
    why: 'You talk to the person building it. No account manager relaying the problem to someone else.',
  },
];

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function AboutTabs() {
  const [tab, setTab] = useState<TabId>('who');

  return (
    <section className="abt" aria-labelledby="abt-head">
      <div className="abt__stars" aria-hidden="true" />

      <div className="abt__inner">
        <div className="abt__head">
          <SectionIntro
            id="abt-head"
            eyebrow={tab === 'who' ? 'Who we are' : 'How we work'}
            title={
              tab === 'who' ? (
                <>
                  We run our own shop
                  <br />
                  on the
                </>
              ) : (
                <>
                  Six rules we
                  <br />
                  do not
                </>
              )
            }
            highlight={tab === 'who' ? 'same wiring' : 'bend'}
            lead={
              tab === 'who'
                ? 'Before a workflow goes near your business, it has already had to survive ours.'
                : 'Not values. Rules - the kind that decide what actually gets built.'
            }
          />
        </div>

        <div className="abt__tabs" role="tablist" aria-label="About Rising Dot">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              className={`abt__tab${tab === t.id ? ' is-on' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'who' ? (
            <motion.div
              key="who"
              className="abt__who"
              variants={fade}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.23, 0.86, 0.39, 0.96] }}
            >
              <div className="abt__copy">
                <p className="abt__claim">
                  Most agencies sell automation they have never had to{' '}
                  <b>live with</b>.
                </p>
                <p className="abt__p">
                  Rising Dot builds and runs its own products. The SEO platform
                  we sell is the one scoring our own product catalogues. The
                  content pipeline we install is the one publishing our own
                  articles.
                </p>
                <p className="abt__p">
                  That changes what gets shipped. A workflow that breaks at 2am
                  is our 2am. So nothing publishes without review, every stage
                  can be rerun on its own, and no step is trusted just because
                  it worked once.
                </p>
                <div className="abt__cta">
                  <StarButton href="/contact">Start a project</StarButton>
                  <StarButton href="/portfolio" variant="ghost">
                    See the work
                  </StarButton>
                </div>
              </div>

              <aside className="abt__stack">
                <p className="abt__stack-top">
                  <span aria-hidden="true" /> Running in-house
                </p>
                {IN_HOUSE.map((s) => (
                  <div className="abt__row" key={s.name}>
                    <div>
                      <p className="abt__row-n">{s.name}</p>
                      <p className="abt__row-d">{s.desc}</p>
                    </div>
                    <span className="abt__row-s">Live</span>
                  </div>
                ))}
              </aside>
            </motion.div>
          ) : (
            <motion.ol
              key="how"
              className="abt__rules"
              variants={fade}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.23, 0.86, 0.39, 0.96] }}
            >
              {RULES.map((r, i) => (
                <li className="abt__rule" key={r.rule}>
                  <span className="abt__rule-n">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="abt__rule-t">{r.rule}</h3>
                  <p className="abt__rule-w">{r.why}</p>
                </li>
              ))}
            </motion.ol>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
