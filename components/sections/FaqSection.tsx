'use client';

// components/sections/FaqSection.tsx
//
// The six questions a serious buyer already has, answered before the call.
// Placed where the case-studies carousel used to sit: by that point the page
// has shown the work three times, and what a reader needs next is not a
// fourth gallery but the awkward questions dealt with.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarButton } from '@/components/ui/star-button';
import { SectionIntro } from './SectionIntro';
import './faq-section.css';

const QA: [string, string][] = [
  [
    'What happens if you disappear?',
    'Your accounts, your repository, your credentials - opened in your name from day one, not ours. The handover is written, not a phone call. Another developer could pick it up the next morning.',
  ],
  [
    'Do I own what you build?',
    'Yes, entirely, including the workflows. There is no licence, no per-seat fee, and nothing that stops working if you stop paying us.',
  ],
  [
    'What does it cost?',
    'The first piece is fixed scope and fixed price, so you know the number before we start. What follows is quoted stage by stage, and you can stop after any of them.',
  ],
  [
    'How long before something actually works?',
    'The first working prototype runs on your real data in days, not months. That is deliberate - you should see it work before committing to the rest.',
  ],
  [
    'What if it breaks at two in the morning?',
    'Every stage reruns on its own, so a failure costs you that step and not the night. And nothing we build publishes without a human approving it first.',
  ],
  [
    'Can my team run it without me?',
    'That is the point of the walkthrough and the written handover. If your team cannot operate it without us, we have not finished.',
  ],
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="faq" aria-labelledby="faq-head">
      <div className="faq__stars" aria-hidden="true" />

      <div className="faq__inner">
        <SectionIntro
          id="faq-head"
          eyebrow="Before you ask"
          title={
            <>
              The questions
              <br />
              we get
            </>
          }
          highlight="asked twice"
          lead="Answered here so the first call can be about your process instead."
        />

        <div className="faq__list">
          {QA.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div className={`faq__item${isOpen ? ' is-open' : ''}`} key={q}>
                <h3 className="faq__h">
                  <button
                    type="button"
                    className="faq__q"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className="faq__n">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="faq__t">{q}</span>
                    <span className="faq__x" aria-hidden="true" />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq__a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.38,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <p>{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="faq__foot">
          <p className="faq__foot-t">Something not answered here?</p>
          <StarButton href="/contact">Ask us directly</StarButton>
        </div>
      </div>
    </section>
  );
}
