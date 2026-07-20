// lib/hero/config.ts
// Single source of truth for the hero experience.
// Every colour, timing and label used by the 3D scene comes from here.

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
 * Scroll progress (0 -> 1) is sliced into six acts.
 * Change these numbers to re-time the whole film; nothing else needs editing.
 */
export const ACTS = {
  /** One dot on the axis. Nothing else. */
  dot: [0.0, 0.07],
  /** Guides appear: axis, both circles, the 24 degree ray. */
  construct: [0.07, 0.17],
  /** The mark draws itself, stroke by stroke, in construction order. */
  draw: [0.17, 0.52],
  /** Camera pushes through the bowl centre - through the dot itself. */
  entry: [0.52, 0.62],
  /** Services, arranged around the tunnel axis. */
  corridor: [0.62, 0.93],
  rise: [0.93, 1.0],
} as const;

/** Sparse dust only. The mark itself is drawn with solid tubes, not points -
 *  additive particle stacking is what blew the old hero out to white. */
export const PARTICLES = {
  dust: 1400,
} as const;

/** Height of the scroll track. More vh = slower. 1100 gives the construction
 *  room to breathe; the old 620 rushed the whole film. */
export const SCROLL_TRACK_VH = 1100;

export type Service = {
  title: string;
  blurb: string;
  href: string;
};

export const SERVICES: Service[] = [
  {
    title: 'n8n Automation',
    blurb: 'Workflows that run your ops while you sleep.',
    href: '/services/n8n-automations',
  },
  {
    title: 'AI Chatbots',
    blurb: 'Assistants trained on your own product and docs.',
    href: '/services/chatbot-development',
  },
  {
    title: 'Web Development',
    blurb: 'Fast, custom builds. No page-builder bloat.',
    href: '/services/web-design',
  },
  {
    title: 'WordPress',
    blurb: 'Custom themes built to survive updates.',
    href: '/services/wordpress',
  },
  {
    title: 'Shopify',
    blurb: 'Stores tuned for speed and conversion.',
    href: '/services/shopify',
  },
  {
    title: 'SaaS Products',
    blurb: 'From first wireframe to paying users.',
    href: '/services/saas',
  },
  {
    title: 'SEO',
    blurb: 'Technical fixes and content that ranks.',
    href: '/services/seo',
  },
];

// ---- small maths helpers used across the scene ----

export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));

/** Remap a global progress value into 0..1 inside a given act. */
export const range = (v: number, [a, b]: readonly [number, number]) =>
  clamp((v - a) / (b - a));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Frame-rate independent damping. */
export const damp = (
  current: number,
  target: number,
  lambda: number,
  dt: number
) => lerp(current, target, 1 - Math.exp(-lambda * dt));
