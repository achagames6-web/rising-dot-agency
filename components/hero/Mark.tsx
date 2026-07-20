'use client';

// components/hero/Mark.tsx
// The logo draws itself. Each stroke is a real tube with real thickness, and
// the reveal is a fragment discard on uv.x — so the line stays crisp and
// exactly one colour. The previous version stacked additive points, which
// saturated to white as soon as two particles overlapped.

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ACTS, COLORS, clamp, range, easeInOut } from '@/lib/hero/config';
import {
  DOTS_WINDOW,
  MARK,
  STROKES,
  pointAlong,
  tubeFor,
  type Stroke,
} from '@/lib/hero/mark';
import { scrollState } from '@/lib/hero/scroll';

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform float uReveal;
  uniform vec3 uColor;
  uniform vec3 uHead;
  uniform float uFade;
  varying vec2 vUv;

  void main() {
    if (vUv.x > uReveal) discard;
    // A short warm band right behind the pen, then straight back to brand colour.
    float head = smoothstep(uReveal - 0.05, uReveal, vUv.x);
    vec3 c = mix(uColor, uHead, head * 0.8);
    gl_FragColor = vec4(c, uFade);
  }
`;

/** Progress of one stroke inside the drawing act. */
function strokeReveal(stroke: Stroke) {
  const p = range(scrollState.smooth, ACTS.draw);
  return clamp((p - stroke.window[0]) / (stroke.window[1] - stroke.window[0]));
}

function StrokeMesh({ stroke }: { stroke: Stroke }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const glowRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(
    () => tubeFor(stroke.points, MARK.strokeRadius),
    [stroke]
  );
  const glowGeometry = useMemo(
    () => tubeFor(stroke.points, MARK.strokeRadius * 2.1),
    [stroke]
  );

  const base = stroke.color === 'glow' ? COLORS.glow : COLORS.blue;

  const uniforms = useMemo(
    () => ({
      uReveal: { value: 0 },
      uFade: { value: 1 },
      uColor: { value: new THREE.Color(base) },
      uHead: { value: new THREE.Color(COLORS.accent) },
    }),
    [base]
  );

  const glowUniforms = useMemo(
    () => ({
      uReveal: { value: 0 },
      uFade: { value: 0.12 },
      uColor: { value: new THREE.Color(base) },
      uHead: { value: new THREE.Color(COLORS.accent) },
    }),
    [base]
  );

  useFrame(() => {
    const r = strokeReveal(stroke);
    if (matRef.current) matRef.current.uniforms.uReveal.value = r;
    if (glowRef.current) glowRef.current.uniforms.uReveal.value = r;
  });

  return (
    <group>
      <mesh geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={matRef}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          transparent
        />
      </mesh>
      {/* Halo: one soft pass, normal blending, low alpha. Enough to read as
          light without ever summing to white. */}
      <mesh geometry={glowGeometry} frustumCulled={false} renderOrder={-1}>
        <shaderMaterial
          ref={glowRef}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={glowUniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** The two orange dots. The top one is the centre of the bowl circle. */
function Dots() {
  const topRef = useRef<THREE.Mesh>(null);
  const lowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const p = range(scrollState.smooth, ACTS.draw);
    const t = easeInOut(
      clamp((p - DOTS_WINDOW[0]) / (DOTS_WINDOW[1] - DOTS_WINDOW[0]))
    );
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.05;

    // The top dot exists from the very first frame - it is act one.
    const early = scrollState.smooth < ACTS.draw[0] ? 1 : 0;
    if (topRef.current)
      topRef.current.scale.setScalar(Math.max(early, t) * breathe);
    if (lowRef.current) lowRef.current.scale.setScalar(t * breathe);
  });

  return (
    <group>
      <mesh ref={topRef} position={MARK.dotTop.center}>
        <circleGeometry args={[MARK.dotTop.radius, 48]} />
        <meshBasicMaterial color={COLORS.accent} toneMapped={false} />
      </mesh>
      <mesh ref={lowRef} position={MARK.dotLow.center}>
        <circleGeometry args={[MARK.dotLow.radius, 48]} />
        <meshBasicMaterial color={COLORS.accent} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** The pen. Rides whichever stroke is currently being drawn. */
function Pen() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;

    const p = scrollState.smooth;
    if (p < ACTS.draw[0] || p > ACTS.draw[1]) {
      mesh.visible = false;
      return;
    }

    const local = range(p, ACTS.draw);
    const active = STROKES.find(
      (s) => local >= s.window[0] && local <= s.window[1]
    );
    if (!active) {
      mesh.visible = false;
      return;
    }

    mesh.visible = true;
    mesh.position.copy(pointAlong(active.points, strokeReveal(active)));
  });

  return (
    <mesh ref={ref} visible={false}>
      <circleGeometry args={[MARK.strokeRadius * 1.35, 24]} />
      <meshBasicMaterial color={COLORS.accent} toneMapped={false} />
    </mesh>
  );
}

export function Mark() {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    // Keep the mark alive until the camera is well past it.
    g.visible = scrollState.smooth < ACTS.corridor[0] + 0.06;
  });

  return (
    <group ref={group}>
      {STROKES.map((s) => (
        <StrokeMesh key={s.id} stroke={s} />
      ))}
      <Dots />
      <Pen />
    </group>
  );
}
