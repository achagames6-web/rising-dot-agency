'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

/**
 * WireframeMorph Component
 * 
 * Displays wireframe construction with animated line drawing in Slate Gray,
 * then morphs into final design with gradient fill transition over 2 seconds.
 * 
 * Validates: Requirements 11.1, 11.2
 */

export interface WireframeMorphProps {
  logoText?: string;
  navItems?: string[];
  heroTitle?: string;
  heroSubtitle?: string;
}

export const WireframeMorph: React.FC<WireframeMorphProps> = ({
  logoText = 'Logo',
  navItems = ['Home', 'About', 'Services', 'Contact'],
  heroTitle = 'Beautiful Design',
  heroSubtitle = 'Crafted with precision'
}) => {
  const [phase, setPhase] = useState<'wireframe' | 'morphing' | 'final'>('wireframe');
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      // Phase 1: Draw wireframe (2s)
      await controls.start({
        pathLength: 1,
        transition: { duration: 2, ease: 'easeInOut' }
      });

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 2: Morph to final design (2s)
      setPhase('morphing');
      await controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 2, ease: 'easeInOut' }
      });

      setPhase('final');
    };

    sequence();
  }, [controls]);

  return (
    <div className="relative w-full h-[600px] bg-[#0F172A] rounded-lg overflow-hidden">
      {/* Wireframe Layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 600"
        style={{ opacity: phase === 'final' ? 0 : 1 }}
      >
        {/* Header wireframe */}
        <motion.rect
          x="50"
          y="50"
          width="700"
          height="80"
          fill="none"
          stroke="#64748B"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={controls}
        />
        
        {/* Navigation items */}
        {[0, 1, 2, 3].map((i) => (
          <motion.rect
            key={`nav-${i}`}
            x={100 + i * 150}
            y="70"
            width="100"
            height="40"
            fill="none"
            stroke="#64748B"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={controls}
          />
        ))}

        {/* Hero section wireframe */}
        <motion.rect
          x="50"
          y="150"
          width="700"
          height="300"
          fill="none"
          stroke="#64748B"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={controls}
        />

        {/* Content boxes */}
        {[0, 1, 2].map((i) => (
          <motion.rect
            key={`box-${i}`}
            x={70 + i * 240}
            y="480"
            width="200"
            height="80"
            fill="none"
            stroke="#64748B"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={controls}
          />
        ))}
      </svg>

      {/* Final Design Layer */}
      <motion.div
        className="absolute inset-0 w-full h-full p-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: phase === 'morphing' || phase === 'final' ? 1 : 0,
          scale: phase === 'morphing' || phase === 'final' ? 1 : 0.95
        }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      >
        {/* Header with gradient */}
        <div className="w-full h-20 bg-gradient-to-r from-[#2563EB] to-[#37AFE1] rounded-lg mb-6 flex items-center justify-between px-8">
          <div className="text-white font-bold text-xl">{logoText}</div>
          <div className="flex gap-6">
            {navItems.map((item) => (
              <div key={item} className="text-white font-medium">{item}</div>
            ))}
          </div>
        </div>

        {/* Hero section with gradient */}
        <div className="w-full h-[300px] bg-gradient-to-br from-[#2563EB] via-[#37AFE1] to-[#31A4DB] rounded-lg mb-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">{heroTitle}</h2>
            <p className="text-xl text-white/80">{heroSubtitle}</p>
          </div>
        </div>

        {/* Content cards with gradients */}
        <div className="grid grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={`card-${i}`}
              className="h-20 bg-gradient-to-br from-[#2563EB]/20 to-[#37AFE1]/20 rounded-lg border border-[#2563EB]/30"
            />
          ))}
        </div>
      </motion.div>

      {/* Phase indicator - hidden in final phase */}
      {phase !== 'final' && (
        <div className="absolute bottom-4 left-4 text-[#94A3B8] text-sm bg-[#0F172A]/80 px-3 py-1 rounded">
          {phase === 'wireframe' ? 'Drawing Wireframe...' : 'Morphing to Design...'}
        </div>
      )}
    </div>
  );
};
