'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';

/**
 * DesignTimeline Component
 * 
 * Interactive design process timeline showing phases: Discovery, Wireframe, Design, Development, Launch.
 * Allows dragging with magnetic snap at milestones and morphs designs between stages.
 * 
 * Validates: Requirements 11.3, 11.4, 11.5
 */

export interface PhaseCard {
  title: string;
  description: string;
}

interface Phase {
  id: string;
  name: string;
  description: string;
  color: string;
  position: number;
  cards?: PhaseCard[];
}

export interface DesignTimelineProps {
  phases?: Phase[];
}

const defaultPhases: Phase[] = [
  { 
    id: 'discovery', 
    name: 'Discovery', 
    description: 'Research & Strategy', 
    color: '#64748B', 
    position: 0,
    cards: [
      { title: 'User Research', description: 'Understanding your target audience' },
      { title: 'Competitor Analysis', description: 'Market positioning insights' },
      { title: 'Goal Definition', description: 'Clear objectives & KPIs' }
    ]
  },
  { 
    id: 'wireframe', 
    name: 'Wireframe', 
    description: 'Structure & Layout', 
    color: '#2563EB', 
    position: 25,
    cards: [
      { title: 'Information Architecture', description: 'Content organization' },
      { title: 'User Flows', description: 'Navigation pathways' },
      { title: 'Low-Fi Mockups', description: 'Basic layout structure' }
    ]
  },
  { 
    id: 'design', 
    name: 'Design', 
    description: 'Visual Identity', 
    color: '#37AFE1', 
    position: 50,
    cards: [
      { title: 'Visual Design', description: 'Colors, typography & imagery' },
      { title: 'UI Components', description: 'Buttons, forms & elements' },
      { title: 'Responsive Layouts', description: 'Multi-device optimization' }
    ]
  },
  { 
    id: 'development', 
    name: 'Development', 
    description: 'Build & Test', 
    color: '#F97316', 
    position: 75,
    cards: [
      { title: 'Frontend Code', description: 'HTML, CSS & JavaScript' },
      { title: 'CMS Integration', description: 'Content management setup' },
      { title: 'Quality Assurance', description: 'Testing & bug fixes' }
    ]
  },
  { 
    id: 'launch', 
    name: 'Launch', 
    description: 'Deploy & Monitor', 
    color: '#31A4DB', 
    position: 100,
    cards: [
      { title: 'Deployment', description: 'Go live on production' },
      { title: 'Performance', description: 'Speed optimization' },
      { title: 'Analytics', description: 'Tracking & insights' }
    ]
  }
];

export const DesignTimeline: React.FC<DesignTimelineProps> = ({ phases: propPhases }) => {
  const phases = propPhases && propPhases.length > 0 ? propPhases : defaultPhases;
  const [activePhase, setActivePhase] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.offsetWidth;
    const dragPosition = (info.point.x / containerWidth) * 100;
    
    // Find nearest phase (magnetic snap)
    let nearestPhase = 0;
    let minDistance = Infinity;
    
    phases.forEach((phase, index) => {
      const distance = Math.abs(phase.position - dragPosition);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPhase = index;
      }
    });
    
    // Snap to nearest phase
    setActivePhase(nearestPhase);
    controls.start({
      x: `${phases[nearestPhase].position}%`,
      transition: { type: 'spring', stiffness: 170, damping: 26 }
    });
  };

  useEffect(() => {
    controls.start({
      x: `${phases[activePhase].position}%`,
      transition: { duration: 2, ease: 'easeInOut' }
    });
  }, [activePhase, controls]);

  return (
    <div className="w-full py-12" ref={containerRef}>
      {/* Timeline Track */}
      <div className="relative h-2 bg-[#1E293B] rounded-full mb-12">
        {/* Progress Bar */}
        <motion.div
          className="absolute h-full bg-gradient-to-r from-[#2563EB] to-[#37AFE1] rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${phases[activePhase].position}%` }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        
        {/* Phase Markers */}
        {phases.map((phase, index) => (
          <button
            key={phase.id}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 transition-all duration-300"
            style={{
              left: `${phase.position}%`,
              backgroundColor: index <= activePhase ? phase.color : '#334155',
              borderColor: index <= activePhase ? phase.color : '#94A3B8',
              transform: `translate(-50%, -50%) scale(${index === activePhase ? 1.5 : 1})`,
              boxShadow: index === activePhase ? `0 0 12px ${phase.color}` : 'none'
            }}
            onClick={() => setActivePhase(index)}
          />
        ))}
        
        {/* Draggable Handle */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          animate={controls}
          initial={{ x: '0%' }}
          style={{
            left: 0,
            boxShadow: `0 0 20px ${phases[activePhase].color}`
          }}
        />
      </div>

      {/* Phase Labels */}
      <div className="relative flex justify-between mb-12">
        {phases.map((phase, index) => (
          <div
            key={phase.id}
            className="text-center"
            style={{ width: '20%' }}
          >
            <div
              className="font-bold mb-2 transition-all duration-300"
              style={{
                color: index === activePhase ? phase.color : '#94A3B8',
                fontSize: index === activePhase ? '1.125rem' : '0.875rem'
              }}
            >
              {phase.name}
            </div>
            <div className="text-[#94A3B8] text-xs">{phase.description}</div>
          </div>
        ))}
      </div>

      {/* Phase Content with Morphing */}
      <motion.div
        className="bg-[#0F172A] rounded-lg p-8 min-h-[300px]"
        key={activePhase}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      >
        <h3 className="text-3xl font-bold text-white mb-4">{phases[activePhase].name}</h3>
        <p className="text-[#64748B] text-lg mb-6">{phases[activePhase].description}</p>
        
        {/* Phase-specific visualization */}
        <div className="grid grid-cols-3 gap-4">
          {(phases[activePhase].cards || []).map((card, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              style={{
                background: `linear-gradient(135deg, ${phases[activePhase].color}40, ${phases[activePhase].color}20)`,
                border: `1px solid ${phases[activePhase].color}60`
              }}
            >
              <h4 className="text-white font-bold mb-2">{card.title}</h4>
              <p className="text-[#94A3B8] text-sm">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
