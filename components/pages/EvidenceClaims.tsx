'use client';

// components/pages/EvidenceClaims.tsx  (About)
//
// One paragraph where every claim is underlined, and pointing at one shows the
// project that proves it. Turns the usual About waffle into something
// checkable, which is the positioning of the whole site.

import { useCallback, useRef, useState } from 'react';
import { SectionIntro } from '@/components/sections/SectionIntro';
import './page-sections.css';

type Claim = { text: string; project: string; proof: string };

const CLAIMS: Claim[] = [
  {
    text: 'automation that runs without us',
    project: 'Content Pipeline',
    proof:
      'Nine independent sub-workflows drafting around five SEO articles a day, draft first.',
  },
  {
    text: 'AI that answers from real data',
    project: 'DREDD AI',
    proof:
      'Live on-chain data through risk heuristics, then a fine-tuned model, in conversation.',
  },
  {
    text: 'storefronts built for how you actually sell',
    project: 'Vape Brothers',
    proof:
      '200+ products, with TCS delivery and JazzCash payments wired into Shopify.',
  },
  {
    text: 'systems we run on our own shop first',
    project: 'SEO Command Center',
    proof:
      'Catalogue scoring with a review queue — nothing reaches a storefront unseen.',
  },
];

export default function EvidenceClaims() {
  const [tip, setTip] = useState<Claim | null>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  const move = useCallback((e: React.PointerEvent) => {
    const el = tipRef.current;
    if (!el) return;
    const w = el.offsetWidth || 320;
    el.style.left = `${Math.min(window.innerWidth - w - 16, e.clientX + 16)}px`;
    el.style.top = `${e.clientY + 18}px`;
  }, []);

  return (
    <section className="ps-sec" aria-labelledby="ev-head">
      <div className="ps-stars" aria-hidden="true" />
      <div className="ps-shell">
        <SectionIntro
          id="ev-head"
          eyebrow="Check us"
          title={
            <>
              Every claim here
              <br />
            </>
          }
          highlight="has a receipt"
          lead="Point at any underlined phrase to see the project behind it."
        />

        <p className="ev">
          We build{' '}
          {CLAIMS.map((c, i) => (
            <span key={c.project}>
              <button
                type="button"
                className="ev__c"
                onPointerEnter={() => setTip(c)}
                onPointerMove={move}
                onPointerLeave={() => setTip(null)}
                onFocus={() => setTip(c)}
                onBlur={() => setTip(null)}
                aria-describedby={tip === c ? 'ev-tip' : undefined}
              >
                {c.text}
              </button>
              {i < CLAIMS.length - 2
                ? ', '
                : i === CLAIMS.length - 2
                  ? ', and '
                  : '.'}
            </span>
          ))}
        </p>
      </div>

      <div
        id="ev-tip"
        role="tooltip"
        ref={tipRef}
        className={`ev__tip${tip ? ' is-on' : ''}`}
      >
        {tip && (
          <>
            <b>{tip.project}</b>
            {tip.proof}
          </>
        )}
      </div>
    </section>
  );
}
