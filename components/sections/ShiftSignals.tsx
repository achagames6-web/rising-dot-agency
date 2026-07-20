'use client';

// components/sections/ShiftSignals.tsx
//
// Section eight. Two tabs:
//   What changed     - each project as before and after, toggled in place
//   Running right now - counters that count up on view, over an activity feed
//
// Everything here comes from work already shipped, so the section can go live
// without waiting on anyone else.

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionIntro } from './SectionIntro';
import { SectionTabs } from './SectionTabs';
import './shift-signals.css';

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

const TABS = [
  { id: 'shift', label: 'What changed' },
  { id: 'now', label: 'Running right now' },
] as const;
type TabId = (typeof TABS)[number]['id'];

type Shift = {
  name: string;
  where: string;
  before: string[];
  beforeCost: string;
  after: string[];
  afterCost: string;
};

const SHIFTS: Shift[] = [
  {
    name: 'Content Pipeline',
    where: 'mytechguide.io',
    before: [
      'Keyword research by hand, one topic at a time',
      'Competitor pages opened and read manually',
      'Draft written, then reformatted for SEO',
      'Images sourced, resized and uploaded one by one',
    ],
    beforeCost: 'Hours per article',
    after: [
      'Keywords and SERP structure pulled automatically',
      'Draft, schema and internal links generated',
      'Images produced and uploaded as WebP',
      'Everything lands as a draft, waiting for review',
    ],
    afterCost: 'Around five articles a day',
  },
  {
    name: 'SEO Command Center',
    where: 'Two live storefronts',
    before: [
      'Product pages edited one at a time',
      'No consistent scoring between products',
      'Nobody knows what still needs work',
    ],
    beforeCost: 'Never finished',
    after: [
      'Whole catalogue scored automatically',
      'Generated copy waits in a review queue',
      'Dashboard shows pending, done and published',
    ],
    afterCost: 'Reviewed, then published',
  },
  {
    name: 'Image Pipeline',
    where: 'Internal',
    before: [
      'Prompt written by hand for each asset',
      'Render watched, then downloaded',
      'Uploaded to storage manually',
    ],
    beforeCost: 'One asset at a time',
    after: [
      'Prompt composed by a model from your input',
      'Rendered, then polled until it succeeds',
      'Stored back automatically, errors handled',
    ],
    afterCost: 'Fire and forget',
  },
  {
    name: 'Curbside Laundry',
    where: 'Toronto',
    before: [
      'Orders taken over phone and messages',
      'Driver routes worked out by hand',
      'Payments chased individually',
    ],
    beforeCost: 'Owner in the loop for everything',
    after: [
      'Customers book themselves in minutes',
      'Drivers, routes and areas in one dashboard',
      'Payments, promos and inventory in the same place',
    ],
    afterCost: 'Owner sees, does not chase',
  },
];

const SIGNALS: [string, number, string, string][] = [
  ['Shipped', 7, '', 'Projects live, every one on this page.'],
  ['In production', 11, '', 'n8n workflows running right now.'],
  ['Run in-house', 2, '', 'Storefronts on our own automation.'],
  ['Published daily', 5, '~', 'Articles drafted by one pipeline.'],
  ['Catalogue', 200, '+', 'Products managed on one storefront.'],
  [
    'Between you and the build',
    0,
    '',
    'Account managers. You talk to the operator.',
  ],
];

const FEED: [string, string, string][] = [
  ['Content Pipeline', 'Drafted five articles, all held for review', '18h ago'],
  ['SEO Command Center', 'Scored eleven product pages', '1d ago'],
  ['Image Pipeline', 'Generated and stored twelve assets', '2d ago'],
  ['Vape Brothers', 'Flash sale module updated', '4d ago'],
];

/** Counts up once, when the number is actually on screen. */
function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [n, setN] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setN(to);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || done.current) return;
        done.current = true;
        const t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - t0) / 900);
          setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <p className="sfs__v" ref={ref}>
      {to > 9 ? n : String(n).padStart(2, '0')}
      {suffix && <span>{suffix}</span>}
    </p>
  );
}

function ShiftCard({ item }: { item: Shift }) {
  const [side, setSide] = useState<'before' | 'after'>('before');
  const pointer = usePointerCard();
  const isAfter = side === 'after';
  const list = isAfter ? item.after : item.before;

  return (
    <article className="sfs__card sfs__shift" {...pointer}>
      <div className="sfs__top">
        <h3 className="sfs__name">
          {item.name}
          <span>· {item.where}</span>
        </h3>

        <div className="sfs__switch">
          {(['before', 'after'] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={side === s}
              onClick={() => setSide(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={side}
          className={`sfs__list${isAfter ? ' is-after' : ''}`}
          initial={{ opacity: 0, x: isAfter ? 14 : -14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isAfter ? -14 : 14 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {list.map((li) => (
            <li key={li}>
              <span className="sfs__dot" />
              {li}
            </li>
          ))}
          <li className="sfs__cost">
            {isAfter ? item.afterCost : item.beforeCost}
          </li>
        </motion.ul>
      </AnimatePresence>
    </article>
  );
}

export default function ShiftSignals() {
  const [tab, setTab] = useState<TabId>('shift');
  const pointer = usePointerCard();

  return (
    <section className="sfs" aria-labelledby="sfs-head">
      <div className="sfs__stars" aria-hidden="true" />

      <div className="sfs__inner">
        <div className="sfs__head">
          <SectionIntro
            id="sfs-head"
            eyebrow={tab === 'shift' ? 'What changed' : 'Running right now'}
            title={
              tab === 'shift' ? (
                <>
                  The same job,
                  <br />
                </>
              ) : (
                <>
                  Small agency.
                  <br />
                </>
              )
            }
            highlight={tab === 'shift' ? 'minus the people' : 'Measured output'}
            lead={
              tab === 'shift'
                ? 'Flip any project to see what the work looked like before, and what it looks like now.'
                : 'No round numbers. Only what we can point at on this page.'
            }
          />
        </div>

        <SectionTabs
          idBase="shift"
          label="Proof"
          tabs={TABS}
          active={tab}
          onChange={(id) => setTab(id as TabId)}
        />

        <AnimatePresence mode="wait">
          {tab === 'shift' ? (
            <motion.div
              key="shift"
              className="sfs__grid"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32, ease: [0.23, 0.86, 0.39, 0.96] }}
            >
              {SHIFTS.map((s) => (
                <ShiftCard key={s.name} item={s} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="now"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32, ease: [0.23, 0.86, 0.39, 0.96] }}
            >
              <div className="sfs__signals">
                {SIGNALS.map(([k, v, suf, d]) => (
                  <article className="sfs__card sfs__sig" key={k} {...pointer}>
                    <p className="sfs__k">{k}</p>
                    <Counter to={v} suffix={suf} />
                    <p className="sfs__d">{d}</p>
                  </article>
                ))}
              </div>

              <div className="sfs__feed">
                <p className="sfs__feed-t">
                  <span aria-hidden="true" /> Recent activity
                </p>
                {FEED.map(([w, t, a]) => (
                  <div className="sfs__feed-i" key={t}>
                    <span className="sfs__feed-w">{w}</span>
                    <span>{t}</span>
                    <span className="sfs__feed-a">{a}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
