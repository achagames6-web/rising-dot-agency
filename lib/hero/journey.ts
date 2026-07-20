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
  /**
   * 'case' is real, shipped work and carries an image.
   * 'capability' is something we do, shown without a fake case study
   * attached. Keeping the two visually distinct is the point - a wall of
   * invented projects is the fastest way to lose a lead who checks.
   */
  type: 'case' | 'capability';
  title: string;
  kind: string;
  blurb: string;
  href: string;
  image?: string;
  year?: string;
  stack?: string;
};

export const WORK: WorkItem[] = [
  {
    type: 'case',
    title: 'Curbside Laundry',
    kind: 'SaaS · Toronto',
    blurb:
      'Pickup and delivery laundry platform. Customers book a wash in minutes; the owner runs the whole operation - orders, drivers, routes, payments, promo codes, inventory - from one dashboard.',
    href: '/portfolio',
    image: '/Projects/curbside-laundry.jpg',
    year: '2025',
    stack: 'Web app · CRM dashboard · Payments',
  },
  {
    type: 'case',
    title: 'Content Pipeline',
    kind: 'n8n · mytechguide.io',
    blurb:
      'Nine independent sub-workflows that research, write, optimise and draft around five SEO articles a day. Any stage can be rerun on its own when it fails - no restarting the pipeline.',
    href: '/portfolio',
    image: '/Projects/mytechguide-n8n.jpg',
    year: '2025',
    stack: 'n8n · OpenAI · DataForSEO · WordPress REST',
  },
  {
    type: 'case',
    title: 'Vape Brothers',
    kind: 'Shopify · Pakistan',
    blurb:
      'Custom storefront for a 200+ product catalogue. Fit quiz, live flash sales with stock counters, quick-view cards, and local rails - TCS delivery and JazzCash - wired in.',
    href: '/portfolio',
    image: '/Projects/vape-brothers.jpg',
    year: '2025',
    stack: 'Shopify · Liquid · JavaScript',
  },
  {
    type: 'capability',
    title: 'AI assistants',
    kind: 'Chatbots',
    blurb:
      'Trained on your own docs. Answers what it knows, escalates what it does not.',
    href: '/services/chatbot-development',
  },
  {
    type: 'capability',
    title: 'WordPress',
    kind: 'Custom themes',
    blurb: 'Built to survive updates, not to fight them.',
    href: '/services/wordpress',
  },
  {
    type: 'capability',
    title: 'Search',
    kind: 'SEO',
    blurb:
      'Technical fixes plus a publishing system that keeps running after launch.',
    href: '/services/seo',
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
