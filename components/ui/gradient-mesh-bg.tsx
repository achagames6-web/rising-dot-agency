'use client';

import { motion } from 'framer-motion';

export function GradientMeshBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* First gradient orb - Blue */}
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(55,175,225,0.8) 0%, transparent 70%)',
          top: '10%',
          left: '10%',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Second gradient orb - Orange */}
      <motion.div
        className="absolute h-[600px] w-[600px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(245,129,34,0.7) 0%, transparent 70%)',
          top: '40%',
          right: '10%',
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Third gradient orb - Light Blue */}
      <motion.div
        className="absolute h-[450px] w-[450px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(49,164,219,0.6) 0%, transparent 70%)',
          bottom: '15%',
          left: '30%',
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Optional: Gradient lines for additional depth */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute left-0 top-1/4 h-px w-full"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(55,175,225,0.5), transparent)',
          }}
        />
        <div
          className="absolute left-0 top-3/4 h-px w-full"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(245,129,34,0.5), transparent)',
          }}
        />
      </div>
    </div>
  );
}
