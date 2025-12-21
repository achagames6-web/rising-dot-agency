'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { getCloudinaryUrl, isExternalUrl } from '@/components/ui/cloudinary-image';

interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
  metrics: {
    label: string;
    value: string;
  }[];
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);

    // Emit particle burst during flip
    emitParticleBurst();
  };

  const emitParticleBurst = () => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const particleCount = 15;

    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;

      newParticles.push({
        id: particleIdRef.current++,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  };

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const animate = () => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 0.02
          }))
          .filter(p => p.life > 0)
      );
    };

    const intervalId = setInterval(animate, 16);
    return () => clearInterval(intervalId);
  }, [particles.length]);

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
      className="relative group cursor-pointer"
      style={{ perspective: '1000px' }}
    >
      {/* Particle overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-10">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-[#37AFE1]"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.life,
              boxShadow: `0 0 ${particle.life * 10}px rgba(55, 175, 225, ${particle.life})`
            }}
          />
        ))}
      </div>

      {/* Card container with 3D flip */}
      <motion.div
        className="relative w-full h-[400px]"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s'
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0
        }}
      >
        {/* Front side */}
        <div
          className="absolute inset-0 backface-hidden rounded-lg overflow-hidden bg-[#0F172A] border border-[#64748B]/20"
          style={{ backfaceVisibility: 'hidden' }}
          onClick={onClick}
        >
          {/* Thumbnail */}
          <div className="relative h-48 bg-gradient-to-br from-[#37AFE1]/20 to-[#F58122]/20">
            <Image
              src={isExternalUrl(project.thumbnailUrl) ? project.thumbnailUrl : getCloudinaryUrl(project.thumbnailUrl, { width: 400, height: 300 })}
              alt={project.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col h-[calc(100%-192px)]">
            <h3 className="text-lg font-bold mb-1 text-white group-hover:text-[#37AFE1] transition-colors line-clamp-1">
              {project.title}
            </h3>
            <p className="text-[#64748B] text-sm mb-2">{project.client}</p>
            <p className="text-sm text-[#64748B] mb-3 line-clamp-2 flex-shrink-0">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-[#37AFE1]/20 text-[#37AFE1] border border-[#37AFE1]/30"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-[#64748B]/20 text-[#64748B]">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>

            {/* Flip button */}
            <div className="mt-auto">
              <ParticleWrapper>
                <button
                  onClick={handleFlip}
                  className="text-sm text-[#37AFE1] hover:text-[#F58122] transition-colors"
                >
                  View Metrics →
                </button>
              </ParticleWrapper>
            </div>
          </div>

          {/* Hover effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#37AFE1]/0 to-[#F58122]/0 pointer-events-none"
            whileHover={{
              background: [
                'linear-gradient(to bottom right, rgba(55, 175, 225, 0) 0%, rgba(245, 129, 34, 0) 100%)',
                'linear-gradient(to bottom right, rgba(55, 175, 225, 0.1) 0%, rgba(245, 129, 34, 0.1) 100%)'
              ]
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Back side */}
        <div
          className="absolute inset-0 backface-hidden rounded-lg overflow-hidden bg-[#0F172A] border border-[#64748B]/20"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="p-6 h-full flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-6 text-white">
              Project Metrics
            </h3>

            {/* Metrics */}
            <div className="space-y-4 mb-6">
              {project.metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center p-3 rounded-lg bg-[#1E293B]"
                >
                  <span className="text-[#64748B]">{metric.label}</span>
                  <span className="text-2xl font-bold text-[#F58122]">
                    {metric.value}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Flip back button */}
            <ParticleWrapper>
              <button
                onClick={handleFlip}
                className="text-sm text-[#37AFE1] hover:text-[#F58122] transition-colors"
              >
                ← Back to Details
              </button>
            </ParticleWrapper>
          </div>
        </div>
      </motion.div>

      {/* 3D hover effect */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        whileHover={{
          boxShadow: '0 20px 40px rgba(55, 175, 225, 0.3)'
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
