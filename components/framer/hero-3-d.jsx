'use client';

import { useEffect, useRef } from 'react';
import { animate, inView } from '@motionone/dom';

/**
 * Hero3D Framer Component
 * 3D animated background with Rising Dot branding colors
 * Uses @motionone/dom for GPU-accelerated animations
 */
function Hero3D() {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Rising Dot brand colors
    const colors = {
      cyan: '#37AFE1',
      orange: '#F58122',
      darkBg: 'rgb(0, 2, 15)',
    };

    // Particle system
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1500;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.vz = Math.random() * 2 + 1;
        this.size = Math.random() * 3 + 1;
        this.color = Math.random() > 0.5 ? colors.cyan : colors.orange;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z -= this.vz;

        if (this.z <= 0) {
          this.reset();
          this.z = 1500;
        }

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        const scale = 1000 / (1000 + this.z);
        const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
        const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
        const size2d = this.size * scale;

        ctx.beginPath();
        ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
        ctx.fillStyle =
          this.color +
          Math.floor(this.opacity * 255)
            .toString(16)
            .padStart(2, '0');
        ctx.fill();
      }
    }

    // Create particles
    const particles = Array.from({ length: 100 }, () => new Particle());

    // Animation loop
    const animate = () => {
      // Clear with dark background
      ctx.fillStyle = colors.darkBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw connecting lines
      ctx.strokeStyle = colors.cyan + '20';
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const scale1 = 1000 / (1000 + particles[i].z);
            const scale2 = 1000 / (1000 + particles[j].z);
            const x1 =
              (particles[i].x - canvas.width / 2) * scale1 + canvas.width / 2;
            const y1 =
              (particles[i].y - canvas.height / 2) * scale1 + canvas.height / 2;
            const x2 =
              (particles[j].x - canvas.width / 2) * scale2 + canvas.width / 2;
            const y2 =
              (particles[j].y - canvas.height / 2) * scale2 + canvas.height / 2;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      style={{
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}

// Responsive wrapper component
Hero3D.Responsive = function Hero3DResponsive() {
  return (
    <div className="h-full w-full">
      <Hero3D />
    </div>
  );
};

export default Hero3D;
