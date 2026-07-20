'use client';

// components/hero/Field.tsx
// The entire 3D layer. One particle system that morphs between three states:
//
//   RING    a slow torus of dots            (idle, and again at the close)
//   FIELD   a deep slab flying past         (the work section)
//   CORE    a dense sphere with cables      (the set piece)
//
// No text lives in here. Nothing is additively blended. Those two rules are
// what the previous versions got wrong.

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  COLORS,
  PARTICLE_COUNT,
  SECTIONS,
  clamp,
  damp,
  lerp,
  range,
} from '@/lib/hero/journey';
import { scrollState } from '@/lib/hero/scroll';

const SPAN = 70; // depth of the flying field, used for the wrap

const VERT = /* glsl */ `
  attribute vec3 aRing;
  attribute vec3 aField;
  attribute vec3 aCore;
  attribute float aSeed;
  attribute float aTint;

  uniform float uRing;
  uniform float uField;
  uniform float uCore;
  uniform float uTime;
  uniform float uFlight;
  uniform float uSize;
  uniform vec3 uCursor;

  varying float vTint;
  varying float vFade;

  void main() {
    vec3 p = aRing * uRing + aField * uField + aCore * uCore;

    // Ambient drift so nothing ever sits perfectly still.
    float s = aSeed * 6.2831;
    p.x += sin(uTime * 0.32 + s) * 0.07;
    p.y += cos(uTime * 0.27 + s) * 0.07;

    // Endless forward flight, but only while the field state is active.
    float flown = p.z + uFlight;
    float wrapped = mod(flown + SPAN_HALF, SPAN_TOTAL) - SPAN_HALF;
    p.z = mix(p.z, wrapped, uField);

    // Cursor pushes a soft ripple through the dots.
    vec3 away = p - uCursor;
    float d = length(away);
    p += normalize(away + vec3(0.0001)) * exp(-d * d * 0.35) * 0.16;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = -mv.z;
    // 26, not 330. At the idle camera distance the old constant produced
    // 84-pixel points, so 6500 of them fused into one solid disc.
    gl_PointSize = uSize * (26.0 / max(0.001, dist));

    vTint = aTint;
    // Fade in from the far plane and out as dots pass the camera.
    vFade = smoothstep(SPAN_TOTAL, 10.0, dist) * smoothstep(0.4, 3.0, dist);
  }
`
  .replace(/SPAN_HALF/g, (SPAN / 2).toFixed(1))
  .replace(/SPAN_TOTAL/g, SPAN.toFixed(1));

const FRAG = /* glsl */ `
  precision mediump float;

  uniform vec3 uBlue;
  uniform vec3 uAccent;
  uniform float uOpacity;

  varying float vTint;
  varying float vFade;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float a = smoothstep(0.5, 0.08, d) * vFade * uOpacity;
    gl_FragColor = vec4(mix(uBlue, uAccent, vTint), a * 0.42);
  }
`;

function buildAttributes() {
  const n = PARTICLE_COUNT;
  const ring = new Float32Array(n * 3);
  const field = new Float32Array(n * 3);
  const core = new Float32Array(n * 3);
  const seed = new Float32Array(n);
  const tint = new Float32Array(n);

  for (let i = 0; i < n; i++) {
    // RING: a torus lying in the view plane.
    const a = Math.random() * Math.PI * 2;
    const tube = Math.pow(Math.random(), 0.7) * 0.2;
    const tubeAngle = Math.random() * Math.PI * 2;
    const R = 2.2;
    ring[i * 3] = Math.cos(a) * (R + Math.cos(tubeAngle) * tube);
    ring[i * 3 + 1] = Math.sin(a) * (R + Math.cos(tubeAngle) * tube);
    ring[i * 3 + 2] = Math.sin(tubeAngle) * tube;

    // FIELD: a wide slab, denser low down so it reads as ground.
    field[i * 3] = (Math.random() - 0.5) * 34;
    field[i * 3 + 1] = -2.6 + Math.pow(Math.random(), 1.7) * 8.5;
    field[i * 3 + 2] = -Math.random() * SPAN;

    // CORE: a shell-weighted sphere.
    const u = Math.random();
    const r = 1.15 + Math.pow(u, 0.35) * 0.95;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    core[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    core[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    core[i * 3 + 2] = r * Math.cos(phi);

    seed[i] = Math.random();
    // One dot in nine carries the accent. Sparse on purpose.
    tint[i] = Math.random() < 0.05 ? 1 : 0;
  }

  return { ring, field, core, seed, tint };
}

/** Weights for the three states, from the current scroll position. */
function stateWeights(p: number) {
  const toField = range(p, SECTIONS.intro);
  const toCore = range(p, SECTIONS.core);
  const back = range(p, SECTIONS.close);

  let wRing = 1 - toField;
  let wField = toField * (1 - toCore);
  let wCore = toCore * (1 - back);
  wRing += back;

  const total = wRing + wField + wCore || 1;
  return [wRing / total, wField / total, wCore / total] as const;
}

export function Field({ quality = 1 }: { quality?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const cablesRef = useRef<THREE.LineSegments>(null);
  const { camera, pointer } = useThree();

  const attrs = useMemo(buildAttributes, []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(attrs.ring, 3));
    g.setAttribute('aRing', new THREE.BufferAttribute(attrs.ring, 3));
    g.setAttribute('aField', new THREE.BufferAttribute(attrs.field, 3));
    g.setAttribute('aCore', new THREE.BufferAttribute(attrs.core, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(attrs.seed, 1));
    g.setAttribute('aTint', new THREE.BufferAttribute(attrs.tint, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), SPAN);
    return g;
  }, [attrs]);

  // Cables for the set piece: slack vertical lines around the core.
  const cableGeometry = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      const r = 2.6 + Math.random() * 3.4;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      pts.push(x, 7, z, x + (Math.random() - 0.5) * 0.4, -6, z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uRing: { value: 1 },
      uField: { value: 0 },
      uCore: { value: 0 },
      uTime: { value: 0 },
      uFlight: { value: 0 },
      uSize: { value: 1.7 * quality },
      uOpacity: { value: 1 },
      uCursor: { value: new THREE.Vector3(999, 999, 999) },
      // Brand blue at full strength is too bright for a background element:
      // where dots overlap it peaks around luma 126, against a reference
      // whose brightest 5% rarely passes 90. These are the brand hues held
      // back a stop; UI keeps the full-strength versions.
      uBlue: { value: new THREE.Color('#1E6FA8') },
      uAccent: { value: new THREE.Color('#C4661A') },
    }),
    [quality]
  );

  const cursor = useRef(new THREE.Vector3(999, 999, 999));
  const camZ = useRef(9);
  const spin = useRef(0);

  useFrame((state, dt) => {
    const step = Math.min(dt, 0.05);
    scrollState.smooth = damp(
      scrollState.smooth,
      scrollState.progress,
      4.5,
      step
    );
    const p = scrollState.smooth;
    const [wRing, wField, wCore] = stateWeights(p);

    const u = matRef.current?.uniforms;
    if (u) {
      u.uTime.value = state.clock.elapsedTime;
      u.uRing.value = wRing;
      u.uField.value = wField;
      u.uCore.value = wCore;
      // Flight speed is tied to scroll, not to time, so it stops when you do.
      u.uFlight.value = range(p, SECTIONS.work) * SPAN * 1.6;
      u.uOpacity.value = 1;

      // Cursor only bites during the idle and close states, where the ring
      // is close enough for the interaction to read.
      const reach = Math.max(wRing, wCore * 0.5);
      cursor.current.set(pointer.x * 4.2, pointer.y * 2.6, 0);
      u.uCursor.value.copy(
        reach > 0.25 ? cursor.current : new THREE.Vector3(999, 999, 999)
      );
    }

    // The ring turns slowly; the core turns a little faster.
    spin.current += step * (wRing * 0.08 + wCore * 0.22);
    if (pointsRef.current) {
      pointsRef.current.rotation.y = spin.current;
      pointsRef.current.rotation.x = lerp(0.18, 0, wField) * wRing;
    }

    // Camera: pulls in for the core, sits back everywhere else.
    const wantZ = lerp(9, 5.4, wCore);
    const wantY = lerp(0, 0.6, range(p, SECTIONS.work)) * wField;
    camZ.current = damp(camZ.current, wantZ, 3, step);
    camera.position.set(
      pointer.x * 0.35,
      wantY + pointer.y * 0.2,
      camZ.current
    );
    camera.lookAt(0, 0, 0);

    if (cablesRef.current) {
      const mat = cablesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = clamp(wCore * 0.5);
      cablesRef.current.visible = mat.opacity > 0.01;
      cablesRef.current.rotation.y = spin.current * 0.4;
    }
  });

  return (
    <>
      <color attach="background" args={[COLORS.base]} />
      <fog attach="fog" args={[COLORS.base, 16, SPAN]} />

      <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={matRef}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </points>

      <lineSegments ref={cablesRef} geometry={cableGeometry} visible={false}>
        <lineBasicMaterial
          color={COLORS.line}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}
