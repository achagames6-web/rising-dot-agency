'use client';

// components/hero/Field.tsx
// Three behaviours, driven by one scroll value:
//
//   RAIN   brand-coloured particles fall from the top and settle out at the
//          horizon, above the earth plate           (first screen)
//   FIELD  the same particles fly past the camera   (the work section)
//   EXIT   everything rises off the top and clears  (the close)
//
// No shape is formed at either end - no ring, no sphere. No text in here.
// No additive blending.

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  COLORS,
  PARTICLE_COUNT,
  SECTIONS,
  damp,
  easeInOut,
  lerp,
  range,
} from '@/lib/hero/journey';
import { scrollState } from '@/lib/hero/scroll';

const SPAN = 70;
/** Where the rain stops: the horizon line of the earth plate. */
const HORIZON = -3.1;
const TOP = 5.4;

const VERT = /* glsl */ `
  attribute vec3 aRain;
  attribute vec3 aField;
  attribute vec3 aColor;
  attribute float aSeed;

  uniform float uField;
  uniform float uFall;
  uniform float uSweep;
  uniform float uLift;
  uniform float uTime;
  uniform float uFlight;
  uniform float uSize;

  varying vec3 vColor;
  varying float vFade;

  void main() {
    // --- rain ---
    float span = TOP_Y - HORIZON_Y;
    // Each particle keeps its own offset, so they do not fall in lockstep.
    float y = TOP_Y - mod(aRain.y + uFall * (0.6 + aSeed * 0.8), span);
    float drift = sin(uTime * 0.4 + aSeed * 6.2831) * 0.12;

    vec3 rain = vec3(aRain.x + drift + uSweep, y + uLift, aRain.z);

    // Particles thin out as they reach the horizon rather than passing through it.
    float land = smoothstep(HORIZON_Y, HORIZON_Y + 1.5, y);

    // --- flying field ---
    vec3 fld = aField;
    float flown = fld.z + uFlight;
    fld.z = mod(flown + SPAN_HALF, SPAN_TOTAL) - SPAN_HALF;

    vec3 p = mix(rain, fld, uField);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = -mv.z;
    gl_PointSize = uSize * (26.0 / max(0.001, dist));

    vColor = aColor;
    float depth = smoothstep(SPAN_TOTAL, 10.0, dist) * smoothstep(0.4, 3.0, dist);
    vFade = depth * mix(land, 1.0, uField);
  }
`
  .replace(/SPAN_HALF/g, (SPAN / 2).toFixed(1))
  .replace(/SPAN_TOTAL/g, SPAN.toFixed(1))
  .replace(/HORIZON_Y/g, HORIZON.toFixed(2))
  .replace(/TOP_Y/g, TOP.toFixed(2));

const FRAG = /* glsl */ `
  precision mediump float;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vFade;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.08, d) * vFade * uOpacity;
    gl_FragColor = vec4(vColor, a * 0.5);
  }
`;

/** Brand hues, held back a stop so they sit in the frame. */
const BLUE = new THREE.Color('#2B8FD4').multiplyScalar(0.66);
const GLOW = new THREE.Color('#38BDF8').multiplyScalar(0.62);
const ACCENT = new THREE.Color('#F58220').multiplyScalar(0.66);

function build(count: number) {
  const rain = new Float32Array(count * 3);
  const field = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const seed = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    rain[i * 3] = (Math.random() - 0.5) * 26;
    rain[i * 3 + 1] = Math.random() * (TOP - HORIZON);
    rain[i * 3 + 2] = -1 + Math.random() * 7;

    field[i * 3] = (Math.random() - 0.5) * 34;
    field[i * 3 + 1] = -2.6 + Math.pow(Math.random(), 1.7) * 8.5;
    field[i * 3 + 2] = -Math.random() * SPAN;

    // Mostly blue, a little glow, a sparse accent.
    const r = Math.random();
    const c = r < 0.1 ? ACCENT : r < 0.32 ? GLOW : BLUE;
    const v = 0.8 + Math.random() * 0.4;
    color[i * 3] = c.r * v;
    color[i * 3 + 1] = c.g * v;
    color[i * 3 + 2] = c.b * v;

    seed[i] = Math.random();
  }
  return { rain, field, color, seed };
}

export function Field({
  quality = 1,
  narrow = false,
}: {
  quality?: number;
  narrow?: boolean;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { camera } = useThree();

  const count = narrow ? Math.round(PARTICLE_COUNT * 0.5) : PARTICLE_COUNT;
  const data = useMemo(() => build(count), [count]);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(data.rain, 3));
    g.setAttribute('aRain', new THREE.BufferAttribute(data.rain, 3));
    g.setAttribute('aField', new THREE.BufferAttribute(data.field, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(data.color, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(data.seed, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), SPAN);
    return g;
  }, [data]);

  const uniforms = useMemo(
    () => ({
      uField: { value: 0 },
      uFall: { value: 0 },
      uSweep: { value: 0 },
      uLift: { value: 0 },
      uTime: { value: 0 },
      uFlight: { value: 0 },
      uSize: { value: 1.8 * quality },
      uOpacity: { value: 1 },
    }),
    [quality]
  );

  const fall = useRef(0);
  const camZ = useRef(9);

  useFrame((state, dt) => {
    const step = Math.min(dt, 0.05);
    scrollState.smooth = damp(
      scrollState.smooth,
      scrollState.progress,
      4.5,
      step
    );
    const p = scrollState.smooth;

    const toField = easeInOut(range(p, SECTIONS.intro));
    const exit = easeInOut(range(p, SECTIONS.close));

    // Falling accelerates hard as you start scrolling, which is what makes
    // the transition feel like speed rather than a cross-fade.
    const speed = 1 + range(p, SECTIONS.intro) * 14;
    fall.current += step * speed * 1.4;

    const u = matRef.current?.uniforms;
    if (u) {
      u.uTime.value = state.clock.elapsedTime;
      u.uFall.value = fall.current;
      u.uField.value = toField * (1 - exit);
      // Everything sweeps to one side as the screen clears for the work wall.
      u.uSweep.value = range(p, SECTIONS.intro) * (narrow ? 14 : 20);
      // At the close the whole field rises off the top of the frame.
      u.uLift.value = exit * 16;
      u.uOpacity.value = 1 - exit * 0.92;
      u.uFlight.value = range(p, SECTIONS.work) * SPAN * 1.6;
    }

    const wantZ = narrow ? 10.5 : 9;
    camZ.current = damp(camZ.current, wantZ, 3, step);
    camera.position.set(0, lerp(0, 0.5, range(p, SECTIONS.work)), camZ.current);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={[COLORS.base]} />
      <fog attach="fog" args={[COLORS.base, 16, SPAN]} />
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={matRef}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </points>
    </>
  );
}
