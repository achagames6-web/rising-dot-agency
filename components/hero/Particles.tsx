'use client';

// components/hero/Particles.tsx
// All motion happens in the vertex shader. JS only pushes a handful of
// uniforms per frame, so 13k particles cost roughly one draw call.

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Sampled } from '@/lib/hero/paths';

const VERT = /* glsl */ `
  attribute float aT;
  attribute float aSeed;
  attribute vec3 aScatter;

  uniform float uReveal;    // how far along the stroke we've drawn
  uniform float uTime;
  uniform float uScatter;   // 0 = on path, 1 = exploded
  uniform float uSize;
  uniform float uHotWidth;

  varying float vEdge;
  varying float vAlpha;

  void main() {
    float revealed = step(aT, uReveal);
    // Bright hot band just behind the leading dot.
    float edge = 1.0 - smoothstep(0.0, uHotWidth, uReveal - aT);
    vEdge = edge * revealed;

    vec3 pos = position;
    float w = sin(uTime * 1.4 + aSeed * 6.2831) * 0.014;
    pos += vec3(w, w * 0.7, w * 0.5);
    pos = mix(pos, aScatter, uScatter);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float perspective = 320.0 / max(0.001, -mv.z);
    gl_PointSize = uSize * (1.0 + vEdge * 2.6) * perspective;

    vAlpha = revealed * (1.0 - uScatter * 0.7);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;

  uniform vec3 uColor;
  uniform vec3 uHot;

  varying float vEdge;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float a = smoothstep(0.5, 0.02, d);
    vec3 c = mix(uColor, uHot, vEdge);
    gl_FragColor = vec4(c, a * vAlpha * 0.9);
  }
`;

type Props = {
  data: Sampled;
  color: string;
  hot: string;
  /** Returns 0..1 draw progress for this frame. */
  reveal: () => number;
  /** Returns 0..1 explode amount for this frame. */
  scatter?: () => number;
  size?: number;
  hotWidth?: number;
};

export function TrailPoints({
  data,
  color,
  hot,
  reveal,
  scatter,
  size = 2.4,
  hotWidth = 0.05,
}: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uReveal: { value: 0 },
      uTime: { value: 0 },
      uScatter: { value: 0 },
      uSize: { value: size },
      uHotWidth: { value: hotWidth },
      uColor: { value: new THREE.Color(color) },
      uHot: { value: new THREE.Color(hot) },
    }),
    [color, hot, size, hotWidth]
  );

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    g.setAttribute('aT', new THREE.BufferAttribute(data.ts, 1));
    g.setAttribute('aSeed', new THREE.BufferAttribute(data.seeds, 1));
    g.setAttribute('aScatter', new THREE.BufferAttribute(data.scatter, 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);
    return g;
  }, [data]);

  useFrame((state) => {
    const u = matRef.current?.uniforms;
    if (!u) return;
    u.uTime.value = state.clock.elapsedTime;
    u.uReveal.value = reveal();
    u.uScatter.value = scatter ? scatter() : 0;
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
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * The single orange dot. It is the whole first act, then becomes the pen
 * that draws the R, then the pen that draws the ring.
 */
export function LeadDot({
  positionAt,
  visible,
  color,
  scale = 1,
}: {
  positionAt: () => [number, number, number];
  visible: () => number;
  color: string;
  scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = ref.current;
    const glow = glowRef.current;
    if (!mesh || !glow) return;

    const [x, y, z] = positionAt();
    mesh.position.set(x, y, z);
    glow.position.set(x, y, z);

    const v = visible();
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.1) * 0.09;
    const s = v * scale * pulse;
    mesh.scale.setScalar(s);
    glow.scale.setScalar(s * 3.4);
    mesh.visible = v > 0.01;
    glow.visible = v > 0.01;
    (glow.material as THREE.MeshBasicMaterial).opacity = v * 0.16;
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[0.085, 20, 20]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.16}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
