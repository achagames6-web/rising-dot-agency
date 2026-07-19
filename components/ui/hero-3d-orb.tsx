'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Hero3DOrb() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    /* ─── Renderer ─────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    /* ─── Scene / Camera ───────────────────────────────── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.z = 4.2;

    /* ─── Fibonacci dot sphere ─────────────────────────── */
    const DOT_COUNT = 1800;
    const SPHERE_R = 1.6;
    const positions = new Float32Array(DOT_COUNT * 3);
    const dotColors = new Float32Array(DOT_COUNT * 3);
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle

    const blue = new THREE.Color('#37AFE1');
    const orange = new THREE.Color('#F58122');
    const white = new THREE.Color('#ffffff');

    for (let i = 0; i < DOT_COUNT; i++) {
      const y = 1 - (i / (DOT_COUNT - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const phi2 = phi * i;
      positions[i * 3] = Math.cos(phi2) * r * SPHERE_R;
      positions[i * 3 + 1] = y * SPHERE_R;
      positions[i * 3 + 2] = Math.sin(phi2) * r * SPHERE_R;

      const t = Math.random();
      const c = t < 0.12 ? orange : t < 0.18 ? white : blue;
      dotColors[i * 3] = c.r;
      dotColors[i * 3 + 1] = c.g;
      dotColors[i * 3 + 2] = c.b;
    }

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    dotGeo.setAttribute('color', new THREE.BufferAttribute(dotColors, 3));

    const dotMat = new THREE.PointsMaterial({
      size: 0.028,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });
    const dotSphere = new THREE.Points(dotGeo, dotMat);
    scene.add(dotSphere);

    /* ─── Connection lines between nearby dots ─────────── */
    const lineVerts: number[] = [];
    const CONNECT_DIST = 0.38;
    for (let i = 0; i < DOT_COUNT; i++) {
      for (let j = i + 1; j < DOT_COUNT; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < CONNECT_DIST * CONNECT_DIST) {
          lineVerts.push(
            positions[i * 3],
            positions[i * 3 + 1],
            positions[i * 3 + 2],
            positions[j * 3],
            positions[j * 3 + 1],
            positions[j * 3 + 2]
          );
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(lineVerts), 3)
    );
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x37afe1,
      transparent: true,
      opacity: 0.1,
    });
    scene.add(new THREE.LineSegments(lineGeo, lineMat));

    /* ─── Glowing core orb ─────────────────────────────── */
    const coreGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x0d3a52,
      transparent: true,
      opacity: 0.6,
    });
    scene.add(new THREE.Mesh(coreGeo, coreMat));

    /* ─── Equatorial glow ring ─────────────────────────── */
    const buildRing = (
      r: number,
      count: number,
      col: number,
      sz: number,
      tilt: number
    ) => {
      const p = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        p[i * 3] = Math.cos(a) * r;
        p[i * 3 + 1] = (Math.random() - 0.5) * 0.04;
        p[i * 3 + 2] = Math.sin(a) * r;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(p, 3));
      const m = new THREE.PointsMaterial({
        color: col,
        size: sz,
        transparent: true,
        opacity: 0.7,
      });
      const pts = new THREE.Points(g, m);
      pts.rotation.x = tilt;
      return pts;
    };
    const ring1 = buildRing(1.9, 300, 0x37afe1, 0.014, 0.3);
    const ring2 = buildRing(2.2, 200, 0xf58122, 0.01, -0.5);
    const ring3 = buildRing(2.5, 140, 0xffffff, 0.007, 0.8);
    scene.add(ring1, ring2, ring3);

    /* ─── Lights ───────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0x37afe1, 0.4));
    const pl1 = new THREE.PointLight(0x37afe1, 4, 10);
    pl1.position.set(3, 2, 3);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0xf58122, 2.5, 10);
    pl2.position.set(-2, -2, -2);
    scene.add(pl2);

    /* ─── Mouse parallax ───────────────────────────────── */
    let mx = 0,
      my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    /* ─── Animate ──────────────────────────────────────── */
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;

      dotSphere.rotation.y = t * 0.14;
      dotSphere.rotation.x = Math.sin(t * 0.07) * 0.15;

      ring1.rotation.y = t * 0.4;
      ring2.rotation.y = -t * 0.32;
      ring3.rotation.y = t * 0.22;

      // subtle pulse on dot size
      (dotSphere.material as THREE.PointsMaterial).size =
        0.028 + Math.sin(t * 1.2) * 0.003;

      // mouse parallax
      scene.rotation.y += (mx * 0.28 - scene.rotation.y) * 0.04;
      scene.rotation.x += (-my * 0.18 - scene.rotation.x) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    /* ─── Resize ───────────────────────────────────────── */
    const onResize = () => {
      if (!el) return;
      const nw = el.clientWidth,
        nh = el.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" />;
}
