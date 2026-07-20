'use client';

// components/sections/ToolkitWays.tsx
//
// Section six, replacing the logo marquee. Two tabs:
//   What we build with - tools, each with the project that proves it
//   Ways to work       - three routes in, smallest first
//
// Same shell as every other section: boxed content over a full-bleed star
// field, SectionIntro for eyebrow and heading, StarButton for actions, and
// every card tracks the pointer.

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarButton } from '@/components/ui/star-button';
import { SectionIntro } from './SectionIntro';
import { SectionTabs } from './SectionTabs';
import './toolkit-ways.css';

function usePointerCard() {
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
    el.style.setProperty('--ry', `${((x / r.width - 0.5) * 6).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${((0.5 - y / r.height) * 4).toFixed(2)}deg`);
  }, []);
  const onPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  }, []);
  return { onPointerMove, onPointerLeave };
}

const TABS = [
  { id: 'tools', label: 'What we build with' },
  { id: 'ways', label: 'Ways to work' },
] as const;
type TabId = (typeof TABS)[number]['id'];

const TOOLS = [
  [
    'Automation',
    'n8n',
    'Every pipeline we ship runs on it - orchestration, retries, per-stage reruns.',
    'Content Pipeline · SEO Command Center',
  ],
  [
    'Models',
    'OpenAI',
    'Drafting and structuring long-form content against a real brief.',
    'Content Pipeline',
  ],
  [
    'Models',
    'Google Gemini',
    'Product-level SEO copy generated at catalogue scale.',
    'SEO Command Center',
  ],
  [
    'Data',
    'DataForSEO',
    'Live SERP and competitor structure, not guesswork.',
    'Content Pipeline',
  ],
  [
    'Database',
    'Supabase',
    'Where generated work is stored and reviewed before it ships.',
    'SEO Command Center',
  ],
  [
    'Storage',
    'Cloudflare R2',
    'Asset storage for generated media, kept out of the app.',
    'Image Pipeline',
  ],
  [
    'Media',
    'Replicate',
    'Image generation, polled asynchronously until it succeeds.',
    'Image Pipeline',
  ],
  [
    'Commerce',
    'Shopify + Liquid',
    'Custom storefronts, large catalogues, local payment rails.',
    'Vape Brothers',
  ],
  [
    'CMS',
    'WordPress REST',
    'Draft-first publishing straight into an existing site.',
    'South Bay Living',
  ],
  [
    'Front end',
    'Next.js',
    'Hand-built interfaces, including the one you are reading.',
    'Curbside Laundry · DREDD AI',
  ],
];

const WAYS = [
  {
    k: 'Start here',
    t: 'Prototype',
    d: 'One workflow, fixed scope, running on your real data.',
    l: [
      'Chosen with you on the first call',
      'Fixed price agreed up front',
      'Yours to keep either way',
    ],
    f: 'Days, not months',
    lead: true,
  },
  {
    k: 'Most projects',
    t: 'Build',
    d: 'The full system, quoted and delivered stage by stage.',
    l: [
      'Each stage priced separately',
      'Stop after any stage',
      'Written handover at the end',
    ],
    f: 'Staged, reviewable',
  },
  {
    k: 'After launch',
    t: 'Care',
    d: 'We keep watch, you keep building.',
    l: [
      'Monitoring and failure alerts',
      'Changes as your process changes',
      'No lock-in, cancel any month',
    ],
    f: 'Monthly, rolling',
  },
];

const rise = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.05,
      ease: [0.23, 0.86, 0.39, 0.96] as const,
    },
  }),
};

const swap = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function ToolkitWays() {
  const [tab, setTab] = useState<TabId>('tools');
  const pointer = usePointerCard();

  return (
    <section className="tkw" aria-labelledby="tkw-head">
      <div className="tkw__stars" aria-hidden="true" />

      <div className="tkw__inner">
        <div className="tkw__head">
          <SectionIntro
            id="tkw-head"
            eyebrow={tab === 'tools' ? 'What we build with' : 'Ways to work'}
            title={
              tab === 'tools' ? (
                <>
                  Tools we have
                  <br />
                  actually
                </>
              ) : (
                <>
                  Start small.
                  <br />
                  Scale
                </>
              )
            }
            highlight={tab === 'tools' ? 'shipped on' : 'only if it works'}
            lead={
              tab === 'tools'
                ? 'Not a logo wall. Each one is here because something on this site runs on it.'
                : 'You should never have to buy the whole system to find out whether it helps.'
            }
          />
        </div>

        <SectionTabs
          idBase="toolkit"
          label="Toolkit and engagement"
          tabs={TABS}
          active={tab}
          onChange={(id) => setTab(id as TabId)}
        />

        <AnimatePresence mode="wait">
          {tab === 'tools' ? (
            <motion.div
              key="tools"
              className="tkw__kit"
              variants={swap}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.23, 0.86, 0.39, 0.96] }}
            >
              {TOOLS.map(([k, t, d, p], i) => (
                <motion.article
                  className="tkw__card"
                  key={t}
                  custom={i}
                  variants={rise}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  {...pointer}
                >
                  <span className="tkw__k">{k}</span>
                  <h3 className="tkw__t">{t}</h3>
                  <p className="tkw__d">{d}</p>
                  <span className="tkw__p">{p}</span>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="ways"
              className="tkw__ways"
              variants={swap}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.23, 0.86, 0.39, 0.96] }}
            >
              {WAYS.map((w, i) => (
                <motion.article
                  className={`tkw__card tkw__way${w.lead ? ' is-lead' : ''}`}
                  key={w.t}
                  custom={i}
                  variants={rise}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  {...pointer}
                >
                  <span className="tkw__k">{w.k}</span>
                  <h3 className="tkw__way-t">{w.t}</h3>
                  <p className="tkw__d">{w.d}</p>
                  <ul className="tkw__l">
                    {w.l.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  <span className="tkw__p">{w.f}</span>
                </motion.article>
              ))}

              <div className="tkw__cta">
                <StarButton href="/contact">Start with a prototype</StarButton>
                <StarButton href="/portfolio" variant="ghost">
                  See the work
                </StarButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
