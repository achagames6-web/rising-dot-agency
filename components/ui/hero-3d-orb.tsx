'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Hero3DOrb() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth;
    const h = el.clientHeight;

    // ── Scene ──────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Wireframe Icosahedron (outer) ──────────────────────
    const outerGeo = new THREE.IcosahedronGeometry(1.1, 3);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x37afe1,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // ── Inner glowing sphere ────────────────────────────────
    const innerGeo = new THREE.SphereGeometry(0.75, 64, 64);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x0d4f6e,
      emissive: 0x37afe1,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.25,
      shininess: 100,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // ── Core bright orb ─────────────────────────────────────
    const coreGeo = new THREE.SphereGeometry(0.38, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xf58122,
      transparent: true,
      opacity: 0.55,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // ── Orbit ring of particles ─────────────────────────────
    const buildRing = (
      count: number,
      radius: number,
      spread: number,
      color: number,
      size: number,
      tilt: number
    ) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const r = radius + (Math.random() - 0.5) * spread;
        pos[i * 3] = Math.cos(a) * r;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.5;
        pos[i * 3 + 2] = Math.sin(a) * r;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color,
        size,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
      });
      const ring = new THREE.Points(geo, mat);
      ring.rotation.x = tilt;
      return ring;
    };

    const ring1 = buildRing(280, 1.55, 0.08, 0x37afe1, 0.018, Math.PI / 5);
    const ring2 = buildRing(180, 1.8, 0.06, 0xf58122, 0.013, -Math.PI / 7);
    const ring3 = buildRing(120, 2.1, 0.05, 0xffffff, 0.009, Math.PI / 3);
    scene.add(ring1, ring2, ring3);

    // ── Ambient floating particles ──────────────────────────
    const ambientCount = 600;
    const ambientPos = new Float32Array(ambientCount * 3);
    for (let i = 0; i < ambientCount; i++) {
      const r = 1.4 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      ambientPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      ambientPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      ambientPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const ambGeo = new THREE.BufferGeometry();
    ambGeo.setAttribute('position', new THREE.BufferAttribute(ambientPos, 3));
    const ambMat = new THREE.PointsMaterial({
      color: 0xaad8f0,
      size: 0.008,
      transparent: true,
      opacity: 0.45,
    });
    const ambParticles = new THREE.Points(ambGeo, ambMat);
    scene.add(ambParticles);

    // ── Lights ─────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x37afe1, 0.6));
    const pl1 = new THREE.PointLight(0x37afe1, 3, 12);
    pl1.position.set(2.5, 2, 2);
    scene.add(pl1);
    const pl2 = new THREE.PointLight(0xf58122, 2, 12);
    pl2.position.set(-2, -1.5, -1.5);
    scene.add(pl2);
    const pl3 = new THREE.PointLight(0xffffff, 1, 8);
    pl3.position.set(0, 3, 1);
    scene.add(pl3);

    // ── Mouse parallax ──────────────────────────────────────
    let mx = 0;
    let my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    // ── Animation loop ──────────────────────────────────────
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;

      outerMesh.rotation.y = t * 0.18;
      outerMesh.rotation.x = t * 0.09;

      innerMesh.rotation.y = -t * 0.12;
      innerMesh.rotation.z = t * 0.06;

      coreMesh.rotation.y = t * 0.4;

      ring1.rotation.y = t * 0.35;
      ring2.rotation.y = -t * 0.28;
      ring3.rotation.y = t * 0.2;

      ambParticles.rotation.y = t * 0.04;
      ambParticles.rotation.x = t * 0.02;

      // Pulsing core
      const pulse = 0.9 + Math.sin(t * 1.5) * 0.1;
      coreMesh.scale.setScalar(pulse);
      coreMat.opacity = 0.45 + Math.sin(t * 1.8) * 0.1;

      // Mouse parallax
      scene.rotation.y += (mx * 0.25 - scene.rotation.y) * 0.04;
      scene.rotation.x += (my * 0.15 - scene.rotation.x) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ──────────────────────────────────────────────
    const onResize = () => {
      if (!el) return;
      const nw = el.clientWidth;
      const nh = el.clientHeight;
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
      outerGeo.dispose();
      innerGeo.dispose();
      coreGeo.dispose();
      ambGeo.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" />;
}
