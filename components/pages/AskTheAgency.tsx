'use client';

// components/pages/AskTheAgency.tsx  (About)
//
// The About section is the product. Pick a question and it answers in a chat
// window, typing as it goes. We sell chatbots, so demonstrating one beats
// describing one.

import { useCallback, useEffect, useRef, useState } from 'react';
import { SectionIntro } from '@/components/sections/SectionIntro';
import './page-sections.css';

const QA: [string, string][] = [
  [
    'Who will I actually deal with?',
    'One operator. The person on the first call is the person who writes the workflows and hands them over at the end. There is nobody in between to explain your problem to.',
  ],
  [
    'What do you actually build?',
    'Automation in n8n, AI assistants trained on your own material, Shopify and WordPress storefronts, and the web apps that hold them together.',
  ],
  [
    'How do projects start?',
    'With one workflow. Fixed scope, fixed price, running on your real data, so you can see it work before committing to anything larger.',
  ],
  [
    'What happens if you disappear?',
    'Your accounts, repository and credentials are in your name from day one, and the handover is written. Another developer could pick it up the next morning.',
  ],
  [
    'Do you use your own tools?',
    'Yes. The SEO platform we sell scores our own product catalogues, and the content pipeline we install publishes our own articles.',
  ],
];

export default function AskTheAgency() {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState('');
  const timer = useRef<number | null>(null);

  const type = useCallback((text: string) => {
    if (timer.current) window.clearInterval(timer.current);

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setShown(text);
      return;
    }

    let i = 0;
    timer.current = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length && timer.current) {
        window.clearInterval(timer.current);
        timer.current = null;
      }
    }, 14);
  }, []);

  useEffect(() => {
    type(QA[0][1]);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [type]);

  const pick = (i: number) => {
    setActive(i);
    type(QA[i][1]);
  };

  const typing = shown.length < QA[active][1].length;

  return (
    <section className="ps-sec" aria-labelledby="ask-head">
      <div className="ps-stars" aria-hidden="true" />
      <div className="ps-shell">
        <SectionIntro
          id="ask-head"
          eyebrow="Ask us anything"
          title={
            <>
              The about page,
              <br />
            </>
          }
          highlight="as a conversation"
          lead="Pick a question. The answer is written the same way our assistants write yours."
        />

        <div className="ask">
          <div className="ask__qs" role="tablist" aria-label="Questions">
            {QA.map(([q], i) => (
              <button
                key={q}
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`ask__q${i === active ? ' is-on' : ''}`}
                onClick={() => pick(i)}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="ask__win">
            <p className="ask__hd">
              <span aria-hidden="true" /> Rising Dot · assistant
            </p>
            <p className="ask__msg" aria-live="polite">
              {shown}
              {typing && <span className="ask__cur" aria-hidden="true" />}
            </p>
            <p className="ask__ft">
              Built with the same stack we sell — AI chatbot development
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
