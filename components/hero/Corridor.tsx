'use client';

// components/hero/Corridor.tsx
// Inside the mark. The services sit around the tunnel axis rather than
// alternating left and right, so the camera passes through the middle of them
// and each one arrives from a different side.

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { ACTS, COLORS, SERVICES, clamp, range } from '@/lib/hero/config';
import { scrollState } from '@/lib/hero/scroll';

const START_Z = -6;
const GAP = 5.0;
const RADIUS = 3.05;
/** Golden-angle spacing: consecutive panels land far apart around the axis. */
const TURN = Math.PI * (3 - Math.sqrt(5));

export const CORRIDOR_END = START_Z - GAP * (SERVICES.length - 1) - 6;

type Node = (typeof SERVICES)[number] & {
  index: number;
  position: THREE.Vector3;
  angle: number;
};

export function Corridor() {
  const groupRef = useRef<THREE.Group>(null);

  const nodes: Node[] = useMemo(
    () =>
      SERVICES.map((s, i) => {
        const angle = i * TURN - Math.PI / 2;
        return {
          ...s,
          index: i,
          angle,
          position: new THREE.Vector3(
            Math.cos(angle) * RADIUS,
            Math.sin(angle) * RADIUS * 0.62,
            START_Z - i * GAP
          ),
        };
      }),
    []
  );

  // Wire between consecutive services: the corridor is a workflow graph.
  const wire = useMemo(() => nodes.map((n) => n.position.clone()), [nodes]);

  // Structural rings down the tunnel. They give the space a scale and make
  // the camera's forward motion legible.
  const rings = useMemo(() => {
    const out: { z: number; pts: THREE.Vector3[] }[] = [];
    for (let z = START_Z + 2; z > CORRIDOR_END; z -= 2.5) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * 4.6, Math.sin(a) * 3.2, z));
      }
      out.push({ z, pts });
    }
    return out;
  }, []);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    g.visible = scrollState.smooth > ACTS.entry[0] - 0.03;
  });

  return (
    <group ref={groupRef} visible={false}>
      {rings.map((r) => (
        <Line
          key={r.z}
          points={r.pts}
          color={COLORS.line}
          lineWidth={1}
          transparent
          opacity={0.5}
        />
      ))}
      <Line
        points={wire}
        color={COLORS.blue}
        lineWidth={1}
        transparent
        opacity={0.55}
      />
      {nodes.map((node) => (
        <Panel key={node.title} node={node} />
      ))}
    </group>
  );
}

function Panel({ node }: { node: Node }) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;

    const t = state.clock.elapsedTime;
    g.position.y =
      node.position.y + Math.sin(t * 0.5 + node.index * 1.3) * 0.07;

    // Each panel turns to face the axis it is orbiting.
    g.rotation.y = -node.angle * 0.35;
    g.rotation.z = Math.sin(t * 0.3 + node.index) * 0.012;

    const p = range(scrollState.smooth, ACTS.corridor);
    const own = node.index / (SERVICES.length - 1);
    const near = 1 - clamp(Math.abs(p - own) / 0.3);
    g.scale.setScalar(0.88 + near * 0.12 + (hovered ? 0.03 : 0));
  });

  return (
    <group ref={ref} position={node.position}>
      {/* Spoke back to the axis: the panel is attached to the workflow, not floating. */}
      <Line
        points={[
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(
            -node.position.x * 0.85,
            -node.position.y * 0.85,
            0
          ),
        ]}
        color={COLORS.line}
        lineWidth={1}
        transparent
        opacity={0.6}
      />
      <Html
        transform
        distanceFactor={5.4}
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
          <span className="rd-panel__index">
            {String(node.index + 1).padStart(2, '0')}
          </span>
          <h3 className="rd-panel__title">{node.title}</h3>
          <p className="rd-panel__blurb">{node.blurb}</p>
          <span className="rd-panel__cta">View service</span>
        </a>
      </Html>
    </group>
  );
}
