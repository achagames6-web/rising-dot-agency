'use client';

// components/hero/Field.tsx
// The idle state is the Rising Dot mark, sampled directly out of
// /public/hero/mark.png. Positions and colours are read from that file's
// pixels at runtime - nothing about the shape is drawn in code, so swapping
// the file swaps the hero.
//
// Three states, morphed by scroll:
//   MARK   the logo, made of dots        (idle, and again at the close)
//   FIELD  a deep slab flying past       (the work section)
//   CORE   a dense sphere with cables    (the set piece)
//
// No text in here. No additive blending. Both rules learned the hard way.

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  COLORS,
  PARTICLE_COUNT,
  SECTIONS,
  clamp,
  damp,
  easeInOut,
  lerp,
  range,
} from '@/lib/hero/journey';
import { scrollState } from '@/lib/hero/scroll';

const SPAN = 70;
/** World height of the mark. */
const MARK_SIZE = 4.6;

const VERT = /* glsl */ `
  attribute vec3 aMark;
  attribute vec3 aField;
  attribute vec3 aCore;
  attribute vec3 aColor;
  attribute float aSeed;

  uniform float uMark;
  uniform float uField;
  uniform float uCore;
  uniform float uTime;
  uniform float uFlight;
  uniform float uSize;
  uniform vec3 uCursor;

  varying vec3 vColor;
  varying float vFade;

  void main() {
    vec3 p = aMark * uMark + aField * uField + aCore * uCore;

    float s = aSeed * 6.2831;
    p.x += sin(uTime * 0.32 + s) * 0.05;
    p.y += cos(uTime * 0.27 + s) * 0.05;

    float flown = p.z + uFlight;
    float wrapped = mod(flown + SPAN_HALF, SPAN_TOTAL) - SPAN_HALF;
    p.z = mix(p.z, wrapped, uField);

    vec3 away = p - uCursor;
    float d = length(away);
    p += normalize(away + vec3(0.0001)) * exp(-d * d * 0.35) * 0.16;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = -mv.z;
    gl_PointSize = uSize * (26.0 / max(0.001, dist));

    vColor = aColor;
    vFade = smoothstep(SPAN_TOTAL, 10.0, dist) * smoothstep(0.4, 3.0, dist);
  }
`
  .replace(/SPAN_HALF/g, (SPAN / 2).toFixed(1))
  .replace(/SPAN_TOTAL/g, SPAN.toFixed(1));

const FRAG = /* glsl */ `
  precision mediump float;

  uniform float uOpacity;
  uniform float uDim;

  varying vec3 vColor;
  varying float vFade;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float a = smoothstep(0.5, 0.08, d) * vFade * uOpacity;
    gl_FragColor = vec4(vColor * uDim, a * 0.42);
  }
`;

type Sample = {
  mark: Float32Array;
  field: Float32Array;
  core: Float32Array;
  color: Float32Array;
  seed: Float32Array;
};

/**
 * Reads the logo out of the PNG. Every opaque pixel is a candidate position;
 * its own colour rides along, so the dots are the logo's blues and oranges
 * rather than anything picked here.
 */
async function sampleMark(url: string, count: number): Promise<Sample> {
  const img = new window.Image();
  img.crossOrigin = 'anonymous';
  img.src = url;
  await img.decode();

  const S = 256;
  const canvas = document.createElement('canvas');
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2d context unavailable');
  ctx.drawImage(img, 0, 0, S, S);
  const { data } = ctx.getImageData(0, 0, S, S);

  const candidates: number[] = [];
  for (let i = 0; i < S * S; i++) {
    if (data[i * 4 + 3] > 60) candidates.push(i);
  }

  const mark = new Float32Array(count * 3);
  const field = new Float32Array(count * 3);
  const core = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const seed = new Float32Array(count);

  const cell = MARK_SIZE / S;

  for (let i = 0; i < count; i++) {
    const pick = candidates[(Math.random() * candidates.length) | 0];
    const px = pick % S;
    const py = (pick / S) | 0;

    // Jitter inside the pixel, or the cloud reads as a visible grid.
    mark[i * 3] = (px / S - 0.5) * MARK_SIZE + (Math.random() - 0.5) * cell;
    mark[i * 3 + 1] = (0.5 - py / S) * MARK_SIZE + (Math.random() - 0.5) * cell;
    mark[i * 3 + 2] = (Math.random() - 0.5) * 0.09;

    color[i * 3] = data[pick * 4] / 255;
    color[i * 3 + 1] = data[pick * 4 + 1] / 255;
    color[i * 3 + 2] = data[pick * 4 + 2] / 255;

    field[i * 3] = (Math.random() - 0.5) * 34;
    field[i * 3 + 1] = -2.6 + Math.pow(Math.random(), 1.7) * 8.5;
    field[i * 3 + 2] = -Math.random() * SPAN;

    const r = 1.15 + Math.pow(Math.random(), 0.35) * 0.95;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    core[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    core[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    core[i * 3 + 2] = r * Math.cos(phi);

    seed[i] = Math.random();
  }

  return { mark, field, core, color, seed };
}

function stateWeights(p: number) {
  const toField = range(p, SECTIONS.intro);
  const toCore = range(p, SECTIONS.core);

  const wMark = 1 - toField;
  const wField = toField * (1 - toCore);
  const wCore = toCore;

  const total = wMark + wField + wCore || 1;
  return [wMark / total, wField / total, wCore / total] as const;
}

export function Field({ quality = 1 }: { quality?: number }) {
  const [sample, setSample] = useState<Sample | null>(null);

  useEffect(() => {
    let alive = true;
    sampleMark('/hero/mark.png', PARTICLE_COUNT)
      .then((s) => alive && setSample(s))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <color attach="background" args={[COLORS.base]} />
      <fog attach="fog" args={[COLORS.base, 16, SPAN]} />
      {sample && <Cloud sample={sample} quality={quality} />}
    </>
  );
}

function Cloud({ sample, quality }: { sample: Sample; quality: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const cablesRef = useRef<THREE.LineSegments>(null);
  const { camera, pointer, viewport } = useThree();

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(sample.mark, 3));
    g.setAttribute('aMark', new THREE.BufferAttribute(sample.mark, 3));
    g.setAttribute('aField', new THREE.BufferAttribute(sample.field, 3));
    g.setAttribute('aCore', new THREE.BufferAttribute(sample.core, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(sample.color, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(sample.seed, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), SPAN);
    return g;
  }, [sample]);

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
      uMark: { value: 1 },
      uField: { value: 0 },
      uCore: { value: 0 },
      uTime: { value: 0 },
      uFlight: { value: 0 },
      uSize: { value: 1.7 * quality },
      uOpacity: { value: 1 },
      // The logo's own colours are UI-bright. Held back a stop they sit in
      // the frame instead of glaring out of it.
      uDim: { value: 0.62 },
      uCursor: { value: new THREE.Vector3(999, 999, 999) },
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
    const [wMark, wField, wCore] = stateWeights(p);
    const t = state.clock.elapsedTime;

    const u = matRef.current?.uniforms;
    if (u) {
      u.uTime.value = t;
      u.uMark.value = wMark;
      u.uField.value = wField;
      u.uCore.value = wCore;
      u.uFlight.value = range(p, SECTIONS.work) * SPAN * 1.6;
      // The close dissolves everything to black - the logo does not come
      // back at the end, so the last frame is the call to action alone.
      u.uOpacity.value = 1 - easeInOut(range(p, SECTIONS.close)) * 0.98;

      const reach = Math.max(wMark, wCore * 0.5);
      cursor.current.set(pointer.x * 3.2, pointer.y * 2.0, 0);
      u.uCursor.value.copy(
        reach > 0.25 ? cursor.current : new THREE.Vector3(999, 999, 999)
      );
    }

    // The mark is a flat plane: spinning it on Y would turn it edge-on and
    // lose the logo. It sways instead. Only the core actually rotates.
    spin.current += step * wCore * 0.22;
    if (pointsRef.current) {
      pointsRef.current.rotation.y =
        spin.current + Math.sin(t * 0.24) * 0.09 * wMark;
      pointsRef.current.rotation.x = Math.sin(t * 0.19) * 0.045 * wMark;

      // The mark sits to the right so the copy owns the left. Tied to the
      // viewport rather than a fixed number, or it drifts off narrow screens.
      const offset = Math.min(3.2, viewport.width * 0.24);
      pointsRef.current.position.x = damp(
        pointsRef.current.position.x,
        offset * wMark,
        6,
        step
      );
    }

    const wantZ = lerp(9, 5.4, wCore);
    const wantY = lerp(0, 0.6, range(p, SECTIONS.work)) * wField;
    camZ.current = damp(camZ.current, wantZ, 3, step);
    camera.position.set(
      pointer.x * 0.3,
      wantY + pointer.y * 0.18,
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
