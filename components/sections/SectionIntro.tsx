'use client';

// components/sections/SectionIntro.tsx
//
// The eyebrow and heading for the new sections.
//
// Type comes from section-type.css, which is copied from the hero.
// Motion comes from components/ui/section-heading.tsx, which nine existing
// sections already use - the same fade-up variant, the same easing, the same
// viewport trigger, and the same gradient sweeping across the highlighted
// phrase. Nothing new is invented here; the two established pieces are put
// together so a new section matches both the hero and the rest of the page.

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import './section-type.css';

/** Lifted verbatim from components/ui/section-heading.tsx. */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.23, 0.86, 0.39, 0.96] as const },
  },
};

/** Also from section-heading: the highlight gradient drifts across itself. */
const SWEEP = {
  backgroundImage: 'linear-gradient(90deg, #F58220, #37AFE1, #F58220)',
  backgroundSize: '200% 200%',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
} as const;

export function SectionIntro({
  eyebrow,
  title,
  highlight,
  lead,
  id,
}: {
  eyebrow: string;
  /** The plain part of the heading. Line breaks welcome. */
  title: ReactNode;
  /** The phrase that carries the sweeping gradient. */
  highlight?: string;
  lead?: string;
  id?: string;
}) {
  return (
    <motion.header
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      <motion.p className="sec-eyebrow" variants={fadeInUp}>
        {eyebrow}
      </motion.p>

      <motion.h2 id={id} className="sec-title" variants={fadeInUp}>
        {title}
        {highlight && (
          <>
            {' '}
            <motion.span
              style={SWEEP}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {highlight}
            </motion.span>
          </>
        )}
      </motion.h2>

      {lead && (
        <motion.p className="sec-lead" variants={fadeInUp}>
          {lead}
        </motion.p>
      )}
    </motion.header>
  );
}
