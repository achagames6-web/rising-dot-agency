'use client';

// components/sections/SectionIntro.tsx
//
// The eyebrow and heading for the new sections.
//
// The eyebrow is the pill from components/ui/section-heading.tsx, markup and
// all: bordered, blurred, a rotating sparkle, the label, a pulsing dot.
// The heading keeps the hero's type from section-type.css.
// The motion - fade-up variant, easing, viewport trigger, and the gradient
// sweeping across the highlighted phrase - is also section-heading's.
//
// So a new section inherits the site's eyebrow, the hero's heading, and the
// motion nine other sections already use. Nothing here is invented.

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
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
      className="sec-intro"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      <motion.div
        className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 backdrop-blur-sm"
        variants={fadeInUp}
        whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.3)' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="h-4 w-4 text-[#F58122]" />
        </motion.div>
        <span className="text-sm font-medium text-white/80">✨ {eyebrow}</span>
        <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
      </motion.div>

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
