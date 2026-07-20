'use client';

// components/hero/Scene.tsx
// One camera, one continuous move. The camera enters the mark through the
// centre of the bowl circle - which is the orange dot itself.

import { useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import {
  ACTS,
  COLORS,
  damp,
  easeInOut,
  easeOut,
  lerp,
  range,
} from '@/lib/hero/config';
import { scrollState } from '@/lib/hero/scroll';
import { MARK } from '@/lib/hero/mark';
import { Mark } from './Mark';
import { Construction, Dust } from './Construction';
import { Corridor, CORRIDOR_END } from './Corridor';

const FOCUS = MARK.bowl.center;

function CameraRig() {
  const { camera } = useThree();
  const pos = new THREE.Vector3(0, FOCUS.y, 3.2);
  const look = new THREE.Vector3(0, FOCUS.y, 0);
  const wantPos = new THREE.Vector3();
  const wantLook = new THREE.Vector3();

  useFrame((_, dt) => {
    const step = Math.min(dt, 0.05);
    // Slower damping than before: the film should feel weighted, not springy.
    scrollState.smooth = damp(
      scrollState.smooth,
      scrollState.progress,
      4.5,
      step
    );
    const p = scrollState.smooth;

    if (p < ACTS.entry[0]) {
      // Acts 1-3. Start tight on the dot, pull back as the construction
      // appears, drift a few degrees while the mark draws itself.
      const t = easeInOut(p / ACTS.entry[0]);
      const dist = lerp(3.4, 8.6, easeOut(Math.min(1, p / ACTS.draw[0])));
      const angle = lerp(-0.16, 0.2, t);
      wantPos.set(
        Math.sin(angle) * dist,
        FOCUS.y + t * 0.25,
        Math.cos(angle) * dist
      );
      wantLook.set(0, FOCUS.y, 0);
    } else if (p < ACTS.corridor[0]) {
      // Act 4: straight through the bowl centre.
      const t = easeInOut(range(p, ACTS.entry));
      wantPos.set(
        lerp(Math.sin(0.2) * 8.6, FOCUS.x, t),
        lerp(FOCUS.y + 0.25, FOCUS.y, t),
        lerp(Math.cos(0.2) * 8.6, -1.6, t)
      );
      wantLook.set(0, lerp(FOCUS.y, 0, t), lerp(FOCUS.y, -9, t));
    } else if (p < ACTS.rise[0]) {
      // Act 5: down the tunnel.
      const t = range(p, ACTS.corridor);
      const z = lerp(-1.6, CORRIDOR_END, t);
      wantPos.set(
        Math.sin(t * Math.PI * 1.7) * 0.42,
        lerp(FOCUS.y, 0, Math.min(1, t * 3)) +
          Math.sin(t * Math.PI * 2.4) * 0.22,
        z
      );
      wantLook.set(0, 0, z - 9);
    } else {
      // Act 6: out and up.
      const t = easeOut(range(p, ACTS.rise));
      wantPos.set(0, lerp(0, 1.4, t), lerp(CORRIDOR_END, 9.5, t));
      wantLook.set(0, lerp(0, FOCUS.y, t), lerp(CORRIDOR_END - 9, 0, t));
    }

    const k = 1 - Math.exp(-7 * step);
    pos.lerp(wantPos, k);
    look.lerp(wantLook, k);
    camera.position.copy(pos);
    camera.lookAt(look);
  });

  return null;
}

export function Scene() {
  const [rich, setRich] = useState(true);

  return (
    <>
      <PerformanceMonitor
        onDecline={() => setRich(false)}
        onIncline={() => setRich(true)}
      />

      <color attach="background" args={[COLORS.base]} />
      <fog attach="fog" args={[COLORS.base, 14, 52]} />

      <CameraRig />

      <Construction />
      <Mark />
      <Corridor />
      {rich && <Dust />}
    </>
  );
}
