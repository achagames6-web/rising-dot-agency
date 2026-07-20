'use client';

// components/hero/Construction.tsx
// The guides you would actually draw first: the axis, the two circles, the
// tangents, the 24 degree ray. They fade back once the mark takes over, the
// way pencil construction lines sit under an inked drawing.

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { ACTS, COLORS, PARTICLES, clamp, range } from '@/lib/hero/config';
import { MARK } from '@/lib/hero/mark';
import { scrollState } from '@/lib/hero/scroll';

function circle(center: THREE.Vector3, radius: number, segments = 128) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
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

/** Opacity of the whole guide layer for the current frame. */
function guideOpacity() {
  const p = scrollState.smooth;
  const inAmt = range(p, ACTS.construct);
  // Hold at full through the guides act, then settle to a faint underlay.
  const settle = 1 - range(p, ACTS.draw) * 0.78;
  const out = 1 - clamp((p - ACTS.draw[1]) / 0.04);
  return inAmt * settle * out;
}

export function Construction() {
  const group = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const ringCircle = useMemo(
    () => circle(MARK.ring.center, MARK.ring.radius),
    []
  );
  const bowlCircle = useMemo(
    () => circle(MARK.bowl.center, MARK.bowl.radius),
    []
  );

  const axis = useMemo(
    () => [
      new THREE.Vector3(0, MARK.ring.radius * 1.5, 0),
      new THREE.Vector3(0, MARK.baseline - 0.5, 0),
    ],
    []
  );

  // Radius spokes: one per circle, drawn to the tangent point they define.
  const spokeBowl = useMemo(
    () => [
      MARK.bowl.center.clone(),
      new THREE.Vector3(MARK.stemX, MARK.bowl.center.y, 0),
    ],
    []
  );
  const spokeRing = useMemo(
    () => [
      MARK.ring.center.clone(),
      new THREE.Vector3(MARK.barX, MARK.ring.center.y, 0),
    ],
    []
  );

  // The 24 degree ray, extended past the leg so the angle is readable.
  const ray = useMemo(() => {
    const from = MARK.bowl.center.clone();
    const a = THREE.MathUtils.degToRad(-90 + MARK.legAngleDeg);
    return [
      from,
      new THREE.Vector3(
        from.x + Math.cos(a) * MARK.ring.radius * 1.35,
        from.y + Math.sin(a) * MARK.ring.radius * 1.35,
        0
      ),
    ];
  }, []);

  // Tick marks along the axis - a ruler, not decoration: they mark the two
  // circle centres and the baseline.
  const ticks = useMemo(() => {
    const ys = [MARK.ring.center.y, MARK.bowl.center.y, MARK.baseline];
    return ys.map((y) => [
      new THREE.Vector3(-0.16, y, 0),
      new THREE.Vector3(0.16, y, 0),
    ]);
  }, []);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const o = guideOpacity();
    g.visible = o > 0.01;
    g.traverse((child) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.Material | undefined;
      if (mat && 'opacity' in mat) {
        (mat as THREE.Material & { opacity: number }).opacity = o;
      }
    });
    if (labelRef.current) labelRef.current.style.opacity = String(o * 1.1);
  });

  const common = {
    color: COLORS.line,
    lineWidth: 1,
    dashed: true,
    dashSize: 0.09,
    gapSize: 0.07,
    transparent: true,
    opacity: 0,
  } as const;

  return (
    <group ref={group} visible={false}>
      <Line points={axis} {...common} color={COLORS.muted} />
      <Line points={ringCircle} {...common} />
      <Line points={bowlCircle} {...common} />
      <Line points={spokeBowl} {...common} color={COLORS.blue} />
      <Line points={spokeRing} {...common} color={COLORS.blue} />
      <Line points={ray} {...common} color={COLORS.accent} />
      {ticks.map((t, i) => (
        <Line
          key={i}
          points={t}
          {...common}
          color={COLORS.muted}
          dashed={false}
        />
      ))}

      <Html
        position={[MARK.bowl.center.x + 0.28, MARK.bowl.center.y - 0.34, 0]}
        transform
        distanceFactor={7}
        occlude={false}
      >
        <div ref={labelRef} className="rd-guide" style={{ opacity: 0 }}>
          <span>axis of symmetry</span>
          <span>r₁ = ring</span>
          <span>r₂ = bowl · centre = the dot</span>
          <span>leg = 24°</span>
        </div>
      </Html>
    </group>
  );
}

/**
 * Sparse dust. Normal blending, low alpha, small count - atmosphere only.
 * This is deliberately not the mark; drawing the logo out of additive points
 * is what turned the previous hero into a white smear.
 */
export function Dust() {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const n = PARTICLES.dust;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 3 + Math.random() * 9;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r * 0.7;
      pos[i * 3 + 2] = -Math.random() * 26;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={0.022}
        color={COLORS.blue}
        transparent
        opacity={0.42}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
