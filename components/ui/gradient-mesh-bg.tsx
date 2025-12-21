'use client';

import { motion, useReducedMotion } from 'framer-motion';

export function GradientMeshBackground() {
  const shouldReduceMotion = useReducedMotion();

  // Define animation variants based on reduced motion preference
  const getAnimationProps = (
    xRange: number[],
    yRange: number[],
    scale: number[],
    duration: number
  ) => {
    if (shouldReduceMotion) {
      // Static positioning when reduced motion is preferred
      return {
        animate: {},
        transition: {},
      };
    }

    return {
      animate: {
        x: xRange,
        y: yRange,
        scale: scale,
      },
      transition: {
        duration: duration,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    };
  };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* First gradient orb - Blue */}
      <motion.div
        className="absolute h-[300px] w-[300px] rounded-full opacity-30 blur-3xl sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px]"
        style={{
          background:
            'radial-gradient(circle, rgba(55,175,225,0.8) 0%, transparent 70%)',
          top: '10%',
          left: '10%',
        }}
        {...getAnimationProps([0, 100, 0], [0, -100, 0], [1, 1.2, 1], 20)}
      />

      {/* Second gradient orb - Orange */}
      <motion.div
        className="absolute h-[350px] w-[350px] rounded-full opacity-25 blur-3xl sm:h-[500px] sm:w-[500px] md:h-[600px] md:w-[600px]"
        style={{
          background:
            'radial-gradient(circle, rgba(245,129,34,0.7) 0%, transparent 70%)',
          top: '40%',
          right: '10%',
        }}
        {...getAnimationProps([0, -80, 0], [0, 80, 0], [1, 1.1, 1], 25)}
      />

      {/* Third gradient orb - Light Blue */}
      <motion.div
        className="absolute h-[250px] w-[250px] rounded-full opacity-20 blur-3xl sm:h-[350px] sm:w-[350px] md:h-[450px] md:w-[450px]"
        style={{
          background:
            'radial-gradient(circle, rgba(49,164,219,0.6) 0%, transparent 70%)',
          bottom: '15%',
          left: '30%',
        }}
        {...getAnimationProps([0, 60, 0], [0, -60, 0], [1, 1.15, 1], 22)}
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
