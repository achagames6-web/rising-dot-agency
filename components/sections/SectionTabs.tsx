'use client';

// components/sections/SectionTabs.tsx
//
// One tab control for every section that needs one.
//
// A glass capsule - translucent, blurred, with the same light border the
// buttons carry - and an indicator that slides between tabs rather than
// cutting. The indicator is a shared layout element, so framer-motion moves
// it for us and it stays correct whatever the labels are.

import { motion } from 'framer-motion';
import './section-tabs.css';

export type TabItem = { id: string; label: string };

export function SectionTabs({
  tabs,
  active,
  onChange,
  label,
  idBase,
}: {
  tabs: readonly TabItem[];
  active: string;
  onChange: (id: string) => void;
  label: string;
  /** Keeps the sliding indicator unique when two tab sets share a page. */
  idBase: string;
}) {
  return (
    <div className="stabs" role="tablist" aria-label={label}>
      <div className="stabs__glass">
        {tabs.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={on}
              className={`stabs__tab${on ? ' is-on' : ''}`}
              onClick={() => onChange(t.id)}
            >
              {on && (
                <motion.span
                  layoutId={`${idBase}-pill`}
                  className="stabs__pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="stabs__label">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
