'use client';

// components/hero/Scene.tsx
// One camera, one continuous move, six acts. Every act reads from the same
// normalised scroll value, so the whole film is re-timeable from config.ts.

import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import {
  ACTS,
  COLORS,
  PARTICLES,
  clamp,
  damp,
  easeInOut,
  easeOut,
  lerp,
  range,
} from '@/lib/hero/config';
import { scrollState } from '@/lib/hero/scroll';
import { R_PATH_D, sampleRing, samplePath } from '@/lib/hero/paths';
import { LeadDot, TrailPoints } from './Particles';
import { Corridor } from './Corridor';

const CORRIDOR_END = -37;

function CameraRig() {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const look = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const desired = useMemo(() => new THREE.Vector3(0, 0, 6.4), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const step = Math.min(dt, 0.05);
    scrollState.smooth = damp(
      scrollState.smooth,
      scrollState.progress,
      6,
      step
    );
    const p = scrollState.smooth;

    if (p < ACTS.entry[0]) {
      // Acts 1–3: slow orbit while the mark draws itself.
      const t = clamp(p / ACTS.entry[0]);
      const angle = lerp(-0.3, 0.24, easeInOut(t));
      const dist = lerp(7.2, 6.0, easeInOut(t));
      desired.set(Math.sin(angle) * dist, 0.15, Math.cos(angle) * dist);
      desiredLook.set(0, 0, 0);
    } else if (p < ACTS.corridor[0]) {
      // Act 4: push through the centre of the R.
      const t = easeInOut(range(p, ACTS.entry));
      desired.set(
        lerp(Math.sin(0.24) * 6.0, 0, t),
        lerp(0.15, 0, t),
        lerp(6.0, -1.4, t)
      );
      desiredLook.set(0, 0, lerp(0, -8, t));
    } else if (p < ACTS.rise[0]) {
      // Act 5: tracking shot down the corridor.
      const t = range(p, ACTS.corridor);
      const z = lerp(-1.4, CORRIDOR_END, t);
      desired.set(
        Math.sin(t * Math.PI * 2.1) * 0.55,
        Math.sin(t * Math.PI * 3.1) * 0.3,
        z
      );
      desiredLook.set(0, 0, z - 8);
    } else {
      // Act 6: pull out and rise.
      const t = easeOut(range(p, ACTS.rise));
      desired.set(lerp(0, 0, t), lerp(0, 1.5, t), lerp(CORRIDOR_END, 9, t));
      desiredLook.set(0, 0, lerp(CORRIDOR_END - 8, 0, t));
    }

    target.lerp(desired, 1 - Math.exp(-9 * step));
    look.lerp(desiredLook, 1 - Math.exp(-9 * step));
    camera.position.copy(target);
    camera.lookAt(look);
  });

  return null;
}

export function Scene() {
  // Glow is done with additive blending + a CSS bloom layer instead of a
  // post-processing pass, so the hero adds no new dependencies and stays
  // cheap on mid-range phones. `rich` scales particle size down if the
  // frame rate drops.
  const [rich, setRich] = useState(true);

  // Sampled once, on the client, before first paint of the canvas.
  const rData = useMemo(() => samplePath(R_PATH_D, PARTICLES.trail), []);
  const ringData = useMemo(() => sampleRing(PARTICLES.ring), []);

  const trailReveal = () => easeOut(range(scrollState.smooth, ACTS.trail));
  const ringReveal = () => easeOut(range(scrollState.smooth, ACTS.ring));
  const collapse = () => easeInOut(range(scrollState.smooth, ACTS.rise));

  const leadPosition = (): [number, number, number] => {
    const p = scrollState.smooth;
    if (p < ACTS.trail[0]) return rData.pointAt(0);
    if (p < ACTS.ring[0]) return rData.pointAt(trailReveal());
    return ringData.pointAt(ringReveal());
  };

  const leadVisible = () => {
    const p = scrollState.smooth;
    if (p < ACTS.ring[1]) return 1;
    // Fades out as the camera enters the portal.
    return 1 - clamp((p - ACTS.ring[1]) / 0.05);
  };

  const markOpacityGroup = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = markOpacityGroup.current;
    if (!g) return;
    // Hide the mark once we are well inside the corridor — nothing to see
    // behind us, and it saves the fill rate for the panels.
    g.visible = scrollState.smooth < ACTS.corridor[1] + 0.02;
  });

  return (
    <>
      <PerformanceMonitor
        onDecline={() => setRich(false)}
        onIncline={() => setRich(true)}
      />

      <color attach="background" args={[COLORS.base]} />
      <fog attach="fog" args={[COLORS.base, 12, 46]} />

      <CameraRig />

      <group ref={markOpacityGroup}>
        <TrailPoints
          data={rData}
          color={COLORS.blue}
          hot={COLORS.glow}
          reveal={trailReveal}
          scatter={collapse}
          size={rich ? 2.5 : 1.9}
        />
        <TrailPoints
          data={ringData}
          color={COLORS.glow}
          hot={COLORS.accent}
          reveal={ringReveal}
          scatter={collapse}
          size={rich ? 2.0 : 1.6}
          hotWidth={0.035}
        />
        <LeadDot
          positionAt={leadPosition}
          visible={leadVisible}
          color={COLORS.accent}
        />
      </group>

      <Corridor />
    </>
  );
}
