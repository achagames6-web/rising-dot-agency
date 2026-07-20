'use client';

// components/hero/Corridor.tsx
// The inside of the logo. Panels sit at staggered depth so the camera
// tracks past them, and thin lines connect them node-to-node — the shape
// of an n8n canvas, which is what the agency actually sells.

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS, SERVICES, ACTS, range, clamp } from '@/lib/hero/config';
import { scrollState } from '@/lib/hero/scroll';

const GAP = 4.6;
const START_Z = -5.5;

export function Corridor() {
  const groupRef = useRef<THREE.Group>(null);

  const nodes = useMemo(
    () =>
      SERVICES.map((s, i) => ({
        ...s,
        index: i,
        position: new THREE.Vector3(
          i % 2 === 0 ? -2.55 : 2.55,
          i % 3 === 0 ? 0.55 : i % 3 === 1 ? -0.6 : 0.1,
          START_Z - i * GAP
        ),
      })),
    []
  );

  const linePoints = useMemo(
    () => nodes.map((n) => n.position.clone()),
    [nodes]
  );

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    // Corridor only exists once the camera is through the portal.
    const live = scrollState.smooth > ACTS.entry[0] - 0.02;
    g.visible = live;
  });

  return (
    <group ref={groupRef} visible={false}>
      <Line
        points={linePoints}
        color={COLORS.line}
        lineWidth={1}
        transparent
        opacity={0.9}
      />
      {nodes.map((node) => (
        <Panel key={node.title} node={node} />
      ))}
      {/* Ambient depth markers so the tunnel reads as a space, not a void. */}
      {Array.from({ length: 26 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 14,
            (Math.random() - 0.5) * 9,
            START_Z - Math.random() * (GAP * SERVICES.length + 4),
          ]}
        >
          <sphereGeometry args={[0.018, 6, 6]} />
          <meshBasicMaterial
            color={COLORS.blue}
            transparent
            opacity={0.5}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

type Node = (typeof SERVICES)[number] & {
  index: number;
  position: THREE.Vector3;
};

function Panel({ node }: { node: Node }) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;

    const t = state.clock.elapsedTime;
    // Gentle drift keeps the panels feeling suspended rather than pinned.
    g.position.y =
      node.position.y + Math.sin(t * 0.55 + node.index * 1.3) * 0.075;
    g.rotation.y = THREE.MathUtils.lerp(
      g.rotation.y,
      (node.index % 2 === 0 ? 0.24 : -0.24) + (hovered ? 0 : 0),
      0.08
    );

    // Fade each panel in as the camera approaches it.
    const p = range(scrollState.smooth, ACTS.corridor);
    const own = node.index / (SERVICES.length - 1);
    const near = 1 - clamp(Math.abs(p - own) / 0.34);
    g.scale.setScalar(0.9 + near * 0.1 + (hovered ? 0.03 : 0));
  });

  return (
    <group ref={ref} position={node.position}>
      <Html
        transform
        distanceFactor={5.2}
        occlude={false}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: 'auto' }}
      >
        <a
          className={`rd-panel${hovered ? ' is-hover' : ''}`}
          href={node.href}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <span className="rd-panel__dot" aria-hidden="true" />
          <h3 className="rd-panel__title">{node.title}</h3>
          <p className="rd-panel__blurb">{node.blurb}</p>
          <span className="rd-panel__cta">View service</span>
        </a>
      </Html>
    </group>
  );
}
