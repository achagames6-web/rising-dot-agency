// lib/hero/journey.ts
// The whole experience is one scroll value sliced into five sections.
// It is built to loop: section five returns to the exact state of section one.

export const COLORS = {
  base: '#04050A',
  panel: '#0B0F1A',
  line: '#16203A',
  blue: '#2B8FD4',
  glow: '#38BDF8',
  accent: '#F58220',
  text: '#E8ECF4',
  muted: '#7C8698',
} as const;

/**
 * Scroll windows. The work section deliberately owns the largest share -
 * that is the part a visitor is actually there for.
 */
export const SECTIONS = {
  /** Idle. A slow ring of dots. Nothing asks anything of you. */
  idle: [0.0, 0.1],
  /** The ring opens out and the headline arrives. */
  intro: [0.1, 0.26],
  /** Work flies past the camera in depth. */
  work: [0.26, 0.62],
  /** Set piece. No UI, no copy - just the node core. */
  core: [0.62, 0.85],
  /** Everything returns to the ring. Contact sits here. */
  close: [0.85, 1.0],
} as const;

export const SCROLL_TRACK_VH = 1500;

export const PARTICLE_COUNT = 6500;

export type WorkItem = {
  title: string;
  kind: string;
  blurb: string;
  href: string;
};

/**
 * Placeholder set built from real services. Swap these for actual client
 * projects as they ship - the layout expects 4 to 8 entries.
 */
export const WORK: WorkItem[] = [
  {
    title: 'Order Ops Pipeline',
    kind: 'n8n Automation',
    blurb: 'Order sync, invoicing and stock alerts running without a human.',
    href: '/services/n8n-automations',
  },
  {
    title: 'Support Agent',
    kind: 'AI Chatbot',
    blurb: 'Answers from your own docs, escalates when it should.',
    href: '/services/chatbot-development',
  },
  {
    title: 'Storefront Rebuild',
    kind: 'Shopify',
    blurb: 'Custom theme, faster cart, fewer drop-offs.',
    href: '/services/shopify',
  },
  {
    title: 'Marketing Site',
    kind: 'Web Design',
    blurb: 'Hand-built front end. No page-builder weight.',
    href: '/services/web-design',
  },
  {
    title: 'Content Engine',
    kind: 'SEO',
    blurb: 'Technical fixes plus a publishing system that keeps running.',
    href: '/services/seo',
  },
  {
    title: 'Product MVP',
    kind: 'SaaS',
    blurb: 'Wireframe to signed-up users.',
    href: '/services/saas',
  },
];

export const FILTERS = [
  'Automation',
  'Chatbots',
  'Web',
  'Shopify',
  'SEO',
  'SaaS',
] as const;

// ---- maths helpers ----

export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));

export const range = (v: number, [a, b]: readonly [number, number]) =>
  clamp((v - a) / (b - a));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const damp = (
  current: number,
  target: number,
  lambda: number,
  dt: number
) => lerp(current, target, 1 - Math.exp(-lambda * dt));

/** Smooth 0-1-0 band, used to fade a layer in and out across a window. */
export const band = (v: number, a: number, b: number, feather = 0.04) =>
  clamp((v - a) / feather) * clamp((b - v) / feather);
