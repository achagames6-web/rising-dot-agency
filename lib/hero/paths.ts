// lib/hero/paths.ts
// Turns the Rising Dot mark into ordered point clouds.
// "Ordered" is the important part: particle N sits further along the stroke
// than particle N-1, which is what lets the logo draw itself.

/**
 * The R stroke, in a 240 x 300 viewBox, drawn in one continuous line:
 * stem up -> arch right -> bowl closes back to stem -> leg down.
 *
 * SWAP THIS for the real path from your logo.svg and everything downstream
 * (trail, lead dot, timing) adapts automatically.
 */
export const R_PATH_D =
  'M 64 268 L 64 104 A 52 52 0 0 1 168 104 L 168 132 A 52 52 0 0 1 64 132 M 132 158 L 186 268';

export const VIEWBOX = { w: 240, h: 300 };

export type Sampled = {
  /** xyz triplets, ordered along the stroke */
  positions: Float32Array;
  /** 0..1 position along the total stroke length, per particle */
  ts: Float32Array;
  /** random xyz used for the scatter/collapse states */
  scatter: Float32Array;
  /** per-particle random seed */
  seeds: Float32Array;
  /** lookup so the lead dot can sit exactly on the stroke */
  pointAt: (t: number) => [number, number, number];
};

function toWorld(
  x: number,
  y: number,
  scale: number
): [number, number, number] {
  return [(x - VIEWBOX.w / 2) * scale, -(y - VIEWBOX.h / 2) * scale, 0];
}

/** Samples an SVG path string. Browser only — uses getPointAtLength. */
export function samplePath(d: string, count: number, scale = 0.016): Sampled {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  ) as SVGPathElement;
  path.setAttribute('d', d);
  svg.appendChild(path);
  // Must be in the document for getTotalLength in some browsers.
  svg.setAttribute('style', 'position:absolute;width:0;height:0;opacity:0');
  document.body.appendChild(svg);

  const total = path.getTotalLength();
  const positions = new Float32Array(count * 3);
  const ts = new Float32Array(count);
  const scatter = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const p = path.getPointAtLength(t * total);
    // A little thickness so the stroke reads as a light trail, not a hairline.
    const jitterAngle = Math.random() * Math.PI * 2;
    const jitterR = Math.pow(Math.random(), 0.6) * 5.5;
    const [x, y, z] = toWorld(
      p.x + Math.cos(jitterAngle) * jitterR,
      p.y + Math.sin(jitterAngle) * jitterR,
      scale
    );

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.06;

    ts[i] = t;
    seeds[i] = Math.random();

    const r = 6 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    scatter[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    scatter[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    scatter[i * 3 + 2] = r * Math.cos(phi) * 0.5;
  }

  const pointAt = (t: number): [number, number, number] => {
    const p = path.getPointAtLength(Math.max(0, Math.min(1, t)) * total);
    return toWorld(p.x, p.y, scale);
  };

  document.body.removeChild(svg);

  return { positions, ts, scatter, seeds, pointAt };
}

/** The outer ring, sampled parametrically. Starts at the bottom, sweeps clockwise. */
export function sampleRing(count: number, radius = 2.35): Sampled {
  const positions = new Float32Array(count * 3);
  const ts = new Float32Array(count);
  const scatter = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const a = -Math.PI / 2 + t * Math.PI * 2;
    const rr = radius + (Math.random() - 0.5) * 0.055;

    positions[i * 3] = Math.cos(a) * rr;
    positions[i * 3 + 1] = Math.sin(a) * rr;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.05;

    ts[i] = t;
    seeds[i] = Math.random();

    const r = 7 + Math.random() * 9;
    const theta = Math.random() * Math.PI * 2;
    scatter[i * 3] = Math.cos(theta) * r;
    scatter[i * 3 + 1] = Math.sin(theta) * r;
    scatter[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }

  const pointAt = (t: number): [number, number, number] => {
    const a = -Math.PI / 2 + t * Math.PI * 2;
    return [Math.cos(a) * radius, Math.sin(a) * radius, 0];
  };

  return { positions, ts, scatter, seeds, pointAt };
}
