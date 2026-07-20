import * as THREE from 'three';

/**
 * The Rising Dot mark, rebuilt as the construction it actually is.
 *
 * Every number below was measured off the source logo
 * (Rising-dot-SOURCE-FILE-LOGO, 1563px square) and then snapped to the
 * relationship it was clearly aiming for:
 *
 *   AXIS          x = 794          both orange dots sit on it
 *   RING          centre (794, 703)  r = 396   open 40 deg at the bottom
 *   BOWL          centre (794, 668)  r = 198   <- the top orange dot IS this centre
 *   STEM          x = 596          = 794 - 198, the vertical tangent to BOWL
 *   BAR (the i)   x = 398          = 794 - 396, the vertical tangent to RING
 *   LEG           ray off the bowl at 24 deg from vertical
 *   LOWER DOT     (794, 1145)      on the axis
 *
 * The hero draws the logo in that order, because that is the order you would
 * draw it with a compass and a straightedge.
 */

const PX = { axis: 794, ringCy: 703 };
/** logo pixels -> world units (ring radius becomes 2.6) */
const S = 2.6 / 396;

const w = (x: number, y: number) =>
  new THREE.Vector3((x - PX.axis) * S, -(y - PX.ringCy) * S, 0);

export const MARK = {
  ring: { center: w(794, 703), radius: 396 * S, gapDeg: 40 },
  bowl: { center: w(794, 668), radius: 198 * S },
  stemX: (596 - PX.axis) * S,
  barX: (398 - PX.axis) * S,
  baseline: -(1260 - PX.ringCy) * S,
  barTop: -(965 - PX.ringCy) * S,
  legAngleDeg: 23.5,
  /** where the leg leaves the bowl circle */
  legStartDeg: -50,
  dotTop: { center: w(794, 668), radius: 59 * S },
  dotLow: { center: w(794, 1145), radius: 60 * S },
  strokeRadius: (74 * S) / 2,
};

/** Sample an arc of a circle into ordered points. */
function arcPoints(
  center: THREE.Vector3,
  radius: number,
  startDeg: number,
  endDeg: number,
  segments = 220
) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = THREE.MathUtils.degToRad(
      startDeg + ((endDeg - startDeg) * i) / segments
    );
    pts.push(
      new THREE.Vector3(
        center.x + Math.cos(a) * radius,
        center.y + Math.sin(a) * radius,
        0
      )
    );
  }
  return pts;
}

function linePoints(a: THREE.Vector3, b: THREE.Vector3, segments = 40) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) pts.push(a.clone().lerp(b, i / segments));
  return pts;
}

export type StrokeId = 'ring' | 'bowl' | 'stem' | 'leg' | 'bar';

export type Stroke = {
  id: StrokeId;
  /** Ordered centreline of the stroke. */
  points: THREE.Vector3[];
  /** Where this stroke draws inside the drawing act, 0..1. */
  window: readonly [number, number];
  color: 'blue' | 'glow';
};

// Ring: starts at the lower-left terminus, sweeps clockwise over the top,
// ends at the lower-right terminus. The 40 deg gap sits on the axis.
const ringStart = 270 + MARK.ring.gapDeg / 2;
const ringEnd = ringStart - (360 - MARK.ring.gapDeg);

// Bowl: begins at the left tangent point (where the stem will meet it) and
// runs clockwise over the top, so the pen ends back where the stem starts.
const bowlStart = 180;
const bowlEnd = bowlStart - 360;

const legFrom = new THREE.Vector3(
  MARK.bowl.center.x +
    Math.cos(THREE.MathUtils.degToRad(-62)) * MARK.bowl.radius,
  MARK.bowl.center.y +
    Math.sin(THREE.MathUtils.degToRad(-62)) * MARK.bowl.radius,
  0
);
const legTo = new THREE.Vector3(
  legFrom.x +
    Math.tan(THREE.MathUtils.degToRad(MARK.legAngleDeg)) *
      (legFrom.y - MARK.baseline),
  MARK.baseline,
  0
);

export const STROKES: Stroke[] = [
  {
    id: 'ring',
    points: arcPoints(MARK.ring.center, MARK.ring.radius, ringStart, ringEnd),
    window: [0.0, 0.3],
    color: 'glow',
  },
  {
    id: 'bowl',
    points: arcPoints(MARK.bowl.center, MARK.bowl.radius, bowlStart, bowlEnd),
    window: [0.3, 0.56],
    color: 'blue',
  },
  {
    id: 'stem',
    points: linePoints(
      new THREE.Vector3(MARK.stemX, MARK.bowl.center.y, 0),
      new THREE.Vector3(MARK.stemX, MARK.baseline, 0)
    ),
    window: [0.56, 0.71],
    color: 'blue',
  },
  {
    id: 'leg',
    points: linePoints(legFrom, legTo),
    window: [0.71, 0.84],
    color: 'blue',
  },
  {
    id: 'bar',
    points: linePoints(
      new THREE.Vector3(MARK.barX, MARK.barTop, 0),
      new THREE.Vector3(MARK.barX, MARK.baseline, 0)
    ),
    window: [0.84, 0.93],
    color: 'glow',
  },
];

/** Dots land last — they are the point the whole construction was built around. */
export const DOTS_WINDOW = [0.93, 1.0] as const;

/** Build a tube along a stroke. uv.x runs 0..1 from the start of the stroke. */
export function tubeFor(points: THREE.Vector3[], radius: number) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0);
  return new THREE.TubeGeometry(curve, points.length * 2, radius, 10, false);
}

/** Position of the drawing pen at a given progress through a stroke. */
export function pointAlong(points: THREE.Vector3[], t: number) {
  const clamped = Math.max(0, Math.min(1, t));
  const i = clamped * (points.length - 1);
  const lo = Math.floor(i);
  const hi = Math.min(points.length - 1, lo + 1);
  return points[lo].clone().lerp(points[hi], i - lo);
}
