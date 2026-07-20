'use client';

// components/hero/Field.tsx
// Three states, morphed by scroll:
//
//   RAIN   brand-coloured dots falling from the top of the frame, fading out
//          as they reach the horizon of the earth image below
//   FIELD  the same dots as a deep slab flying past  (the work section)
//   RISE   everything travels upward out of frame    (the close)
//
// No sphere anywhere. No text in here. No additive blending.

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  PARTICLE_COUNT,
  SECTIONS,
  damp,
  easeInOut,
  lerp,
  range,
} from '@/lib/hero/journey';
import { scrollState } from '@/lib/hero/scroll';

const SPAN = 70;

const VERT = /* glsl */ `
  attribute vec3 aRain;
  attribute vec3 aField;
  attribute vec3 aColor;
  attribute float aSeed;

  uniform float uField;
  uniform float uRise;
  uniform float uFall;
  uniform float uSweep;
  uniform float uHorizon;
  uniform float uSpan;
  uniform float uHalfW;
  uniform float uFlight;
  uniform float uSize;
  uniform float uTime;

  varying vec3 vColor;
  varying float vFade;

  void main() {
    // --- rain -------------------------------------------------------------
    // aRain.y is a normalised position in the fall cycle, so the column is
    // resolution independent: it always spans horizon -> top of frame.
    float ry = fract(aRain.y - uFall);
    vec3 rain = vec3(
      aRain.x * uHalfW + uSweep * (0.6 + aSeed),
      uHorizon + ry * uSpan,
      aRain.z
    );
    rain.x += sin(uTime * 0.4 + aSeed * 6.2831) * 0.06;

    // Fade in as they enter at the top, out as they meet the horizon.
    float rainFade = smoothstep(0.0, 0.16, ry) * (1.0 - smoothstep(0.84, 1.0, ry));

    // --- field ------------------------------------------------------------
    vec3 field = aField;
    float flown = field.z + uFlight;
    field.z = mod(flown + SPAN_HALF, SPAN_TOTAL) - SPAN_HALF;

    vec3 p = mix(rain, field, uField);

    // --- rise -------------------------------------------------------------
    p.y += uRise * (7.0 + aSeed * 6.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float dist = -mv.z;
    gl_PointSize = uSize * (26.0 / max(0.001, dist));

    vColor = aColor;

    float depthFade = smoothstep(SPAN_TOTAL, 10.0, dist) * smoothstep(0.4, 3.0, dist);
    vFade = mix(rainFade, depthFade, uField) * (1.0 - uRise);
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
    gl_FragColor = vec4(vColor * uDim, a * 0.55);
  }
`;

type Sample = {
  rain: Float32Array;
  field: Float32Array;
  color: Float32Array;
  seed: Float32Array;
};

/** Brand blue with a little variation, and one dot in eight in the accent. */
function brandColour(i: number): [number, number, number] {
  const accent = Math.random() < 0.12;
  if (accent) return [0.96, 0.51, 0.13];
  const t = Math.random();
  // #2B8FD4 -> #7CC4F0, so the fall has depth rather than one flat blue.
  return [lerp(0.17, 0.49, t), lerp(0.56, 0.77, t), lerp(0.83, 0.94, t)];
}

function build(count: number): Sample {
  const rain = new Float32Array(count * 3);
  const field = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const seed = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    rain[i * 3] = Math.random() * 2 - 1; // -1..1, scaled by uHalfW
    rain[i * 3 + 1] = Math.random(); // position in the fall cycle
    rain[i * 3 + 2] = -5 + Math.random() * 8;

    field[i * 3] = (Math.random() - 0.5) * 34;
    field[i * 3 + 1] = -2.6 + Math.pow(Math.random(), 1.7) * 8.5;
    field[i * 3 + 2] = -Math.random() * SPAN;

    const [r, g, b] = brandColour(i);
    color[i * 3] = r;
    color[i * 3 + 1] = g;
    color[i * 3 + 2] = b;

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
  const [sample, setSample] = useState<Sample | null>(null);

  useEffect(() => {
    setSample(build(narrow ? 3600 : PARTICLE_COUNT));
  }, [narrow]);

  return (
    <>
      {/* No background or fog here on purpose. The canvas has to stay
          transparent: it sits above the earth plate so the dots fall in
          front of it, and an opaque clear colour would hide the plate and
          every DOM layer behind it. The page background comes from CSS. */}
      {sample && <Cloud sample={sample} quality={quality} narrow={narrow} />}
    </>
  );
}

function Cloud({
  sample,
  quality,
  narrow,
}: {
  sample: Sample;
  quality: number;
  narrow: boolean;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { camera, pointer, viewport } = useThree();

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(sample.field, 3));
    g.setAttribute('aRain', new THREE.BufferAttribute(sample.rain, 3));
    g.setAttribute('aField', new THREE.BufferAttribute(sample.field, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(sample.color, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(sample.seed, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), SPAN);
    return g;
  }, [sample]);

  const uniforms = useMemo(
    () => ({
      uField: { value: 0 },
      uRise: { value: 0 },
      uFall: { value: 0 },
      uSweep: { value: 0 },
      uHorizon: { value: -1 },
      uSpan: { value: 9 },
      uHalfW: { value: 8 },
      uFlight: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 1.7 * quality },
      uOpacity: { value: 1 },
      uDim: { value: 0.78 },
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

    // The close unwinds the intro: field weight falls back to zero, so the
    // rain and the earth return underneath the call to action.
    const back = easeInOut(range(p, SECTIONS.close));
    const toField = range(p, SECTIONS.intro) * (1 - back);
    const t = state.clock.elapsedTime;

    // The fall accelerates hard as you start scrolling, then the whole
    // column slides aside to hand the frame over to the work section.
    const speed = 0.05 + toField * 0.55;
    fall.current += step * speed;

    const u = matRef.current?.uniforms;
    if (u) {
      u.uTime.value = t;
      u.uField.value = toField;
      u.uRise.value = 0;
      u.uFall.value = fall.current;
      u.uSweep.value = easeInOut(toField) * (narrow ? 5 : 9);
      u.uFlight.value = range(p, SECTIONS.work) * SPAN * 1.6;

      // The rain column is measured from the earth's horizon, which sits at
      // ~38% of frame height, up past the top edge.
      const halfH = viewport.height / 2;
      // Matches .rd-earth height, so the fall lands exactly on the plate.
      u.uHorizon.value = -halfH + viewport.height * (narrow ? 0.34 : 0.46);
      u.uSpan.value = halfH - u.uHorizon.value + 2;
      u.uHalfW.value = viewport.width * 0.56;
      u.uOpacity.value = 1;
    }

    const wantZ = narrow ? 10.6 : 9;
    camZ.current = damp(camZ.current, wantZ, 3, step);
    camera.position.set(pointer.x * 0.22, pointer.y * 0.14, camZ.current);
    camera.lookAt(0, 0, 0);
  });

  return (
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
  );
}
