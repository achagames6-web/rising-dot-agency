'use client';

// components/sections/WorkflowCanvas.tsx
// The services drawn as a workflow: input on the left, what we do in the
// middle, the outcome on the right. It reads left to right as a sentence
// even to someone who has never seen an automation canvas.
//
// Type follows the hero exactly - same mono eyebrow, same uppercase display
// heading - so the two sections read as one piece of design.

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import './section-type.css';
import './workflow-canvas.css';

type Node = {
  id: string;
  /** Position in percent of the canvas box. */
  x: number;
  y: number;
  kind: string;
  title: string;
  desc: string;
  href?: string;
  variant?: 'in' | 'out';
};

const NODES: Node[] = [
  {
    id: 'in',
    x: 11,
    y: 50,
    kind: 'Input',
    title: 'Your operation',
    desc: 'Orders, leads, content, stock - whatever repeats.',
    variant: 'in',
  },
  {
    id: 'n8n',
    x: 32,
    y: 12,
    kind: 'Trigger',
    title: 'n8n Automation',
    desc: 'The work runs itself, on a schedule or an event.',
    href: '/services/n8n-automations',
  },
  {
    id: 'bot',
    x: 32,
    y: 38,
    kind: 'Agent',
    title: 'AI Chatbots',
    desc: 'Answers from your own docs. Escalates the rest.',
    href: '/services/chatbot-development',
  },
  {
    id: 'web',
    x: 32,
    y: 64,
    kind: 'Build',
    title: 'Web Development',
    desc: 'Hand-built front ends. No page-builder weight.',
    href: '/services/web-design',
  },
  {
    id: 'wp',
    x: 32,
    y: 90,
    kind: 'Build',
    title: 'WordPress',
    desc: 'Custom themes built to survive updates.',
    href: '/services/wordpress',
  },
  {
    id: 'shop',
    x: 60,
    y: 25,
    kind: 'Commerce',
    title: 'Shopify',
    desc: 'Storefronts tuned for speed and checkout.',
    href: '/services/shopify',
  },
  {
    id: 'saas',
    x: 60,
    y: 51,
    kind: 'Product',
    title: 'SaaS Products',
    desc: 'From first wireframe to paying users.',
    href: '/services/saas',
  },
  {
    id: 'seo',
    x: 60,
    y: 77,
    kind: 'Output',
    title: 'SEO',
    desc: 'Technical fixes plus a system that keeps publishing.',
    href: '/services/seo',
  },
  {
    id: 'out',
    x: 86,
    y: 50,
    kind: 'Result',
    title: 'Time back',
    desc: 'The same job, without you in it.',
    variant: 'out',
  },
];

/** from -> to, and whether the connector carries a live pulse. */
const EDGES: [string, string, boolean][] = [
  ['in', 'n8n', true],
  ['in', 'bot', true],
  ['in', 'web', true],
  ['in', 'wp', true],
  ['n8n', 'shop', false],
  ['bot', 'saas', false],
  ['web', 'saas', false],
  ['wp', 'seo', false],
  ['shop', 'out', true],
  ['saas', 'out', true],
  ['seo', 'out', true],
];

export default function WorkflowCanvas() {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);

  // Draw the connectors in once, when the section is actually looked at.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setLive(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLive(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const paths = useMemo(() => {
    const at = (id: string) => NODES.find((n) => n.id === id)!;
    return EDGES.map(([a, b, pulse], i) => {
      const from = at(a);
      const to = at(b);
      const mid = (from.x + to.x) / 2;
      return {
        key: `${a}-${b}`,
        d: `M${from.x},${from.y} C${mid},${from.y} ${mid},${to.y} ${to.x},${to.y}`,
        pulse,
        delay: i * 0.06,
      };
    });
  }, []);

  return (
    <section
      ref={ref}
      className={`wfc${live ? ' is-live' : ''}`}
      aria-labelledby="wfc-head"
    >
      <div className="wfc__grid" aria-hidden="true" />

      <div className="wfc__inner">
        <header className="wfc__head">
          <p className="sec-eyebrow">What we do</p>
          <h2 id="wfc-head" className="sec-title">
            Your operation,
            <br />
            as a <em>workflow</em>
          </h2>
          <p className="sec-lead">
            Everything that repeats becomes a step. Everything that runs itself
            stops needing you.
          </p>
        </header>

        <div className="wfc__flow">
          <svg
            className="wfc__edges"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {paths.map((p) => (
              <path
                key={p.key}
                d={p.d}
                className={`wfc__edge${p.pulse ? ' is-pulse' : ''}`}
                style={{ animationDelay: `${p.delay}s` }}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          <ul className="wfc__nodes">
            {NODES.map((n, i) => {
              const inner = (
                <>
                  <span className="wfc__node-top">
                    <span className="wfc__node-dot" aria-hidden="true" />
                    <span className="wfc__node-kind">{n.kind}</span>
                  </span>
                  <span className="wfc__node-title">{n.title}</span>
                  <span className="wfc__node-desc">{n.desc}</span>
                </>
              );

              return (
                <li
                  key={n.id}
                  className={`wfc__node${n.variant ? ` wfc__node--${n.variant}` : ''}`}
                  style={{
                    left: `${n.x}%`,
                    top: `${n.y}%`,
                    transitionDelay: `${0.05 + i * 0.05}s`,
                  }}
                >
                  {n.href ? (
                    <Link href={n.href} className="wfc__node-body">
                      {inner}
                    </Link>
                  ) : (
                    <span className="wfc__node-body">{inner}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
