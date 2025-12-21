'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

interface Project {
  id: string;
  title: string;
  tags: string[];
  videoSrc: string;
}

const projects: Project[] = [
  { id: '1', title: 'Mobile App Showcase', tags: ['UI/UX', 'Mobile'], videoSrc: '/videos/project-1.mp4' },
  { id: '2', title: 'E-Commerce Platform', tags: ['Shopify', 'Web Design'], videoSrc: '/videos/project-2.mp4' },
  { id: '3', title: 'Corporate Dashboard', tags: ['WordPress', 'SEO', 'N8N'], videoSrc: '/videos/project-3.mp4' },
  { id: '4', title: 'Data Insights', tags: ['Analytics', 'Dashboard'], videoSrc: '/videos/project-4.mp4' },
  { id: '5', title: 'Analytics Platform', tags: ['N8N', 'Automation'], videoSrc: '/videos/project-5.mp4' },
  { id: '6', title: 'Social Media App', tags: ['Mobile', 'UI/UX'], videoSrc: '/videos/project-6.mp4' },
];

function ProjectCard({ project, gridArea }: { project: Project; gridArea: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const bubbleX = useRef<gsap.QuickToFunc | null>(null);
  const bubbleY = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch(() => {});
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!bubbleRef.current) return;
    bubbleX.current = gsap.quickTo(bubbleRef.current, 'x', { duration: 0.1, ease: 'power2.out' });
    bubbleY.current = gsap.quickTo(bubbleRef.current, 'y', { duration: 0.1, ease: 'power2.out' });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || !bubbleX.current || !bubbleY.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const bubbleSize = 80;
    const padding = 10;
    let x = e.clientX - rect.left - bubbleSize / 2;
    let y = e.clientY - rect.top - bubbleSize / 2;
    x = Math.max(padding, Math.min(rect.width - bubbleSize - padding, x));
    y = Math.max(padding, Math.min(rect.height - bubbleSize - padding, y));
    bubbleX.current(x);
    bubbleY.current(y);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden rounded-3xl cursor-none h-full"
      style={{
        gridArea,
        background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
        border: '2px solid #37AFE1',
        boxShadow: '0 0 30px rgba(55, 175, 225, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        minHeight: '100px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={project.videoSrc}
        autoPlay
        loop
        muted
        playsInline
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-400"
        style={{ opacity: isHovered ? 1 : 0 }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 p-5 transition-all duration-400"
        style={{
          transform: isHovered ? 'translateY(0)' : 'translateY(16px)',
          opacity: isHovered ? 1 : 0,
        }}
      >
        <h3 className="text-lg md:text-xl font-bold text-white font-montserrat mb-2">{project.title}</h3>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 text-xs text-white/80 bg-white/10 rounded-full backdrop-blur-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div
        ref={bubbleRef}
        className="absolute pointer-events-none transition-transform duration-200"
        style={{ width: 80, height: 80, transform: isHovered ? 'scale(1)' : 'scale(0)' }}
      >
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)' }}>
          <span className="text-black font-semibold text-sm tracking-wide">EXPLORE</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedWork() {
  return (
    <section className="relative py-16 md:py-24 px-4 md:px-6 overflow-hidden" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white font-montserrat mb-4">Featured Work</h2>
          <p className="text-xl text-[#64748B] font-inter max-w-2xl mx-auto">
            Explore our latest projects and see how we bring ideas to life
          </p>
        </motion.div>

        {/* 
          EXACT LAYOUT FROM SKETCH with proper aspect ratios:
          - Mobile 9:16 = narrow and tall
          - Desktop 16:9 = wide and shorter
          
          ┌───┬───────────┐
          │ A │     B     │  
          │   ├─────┬─────┤
          │   │     │  E  │  
          ├───┤  D  ├─────┤
          │ C │     │     │  
          ├───┤     │  G  │
          │ F │     │     │  
          ├───┴─────┴─────┤
          │       H       │  
          └───────────────┘
        */}
        <div 
          className="hidden md:grid gap-4"
          style={{
            gridTemplateColumns: '280px 1fr 280px',
            gridTemplateRows: '550px 270px 270px',
            gridTemplateAreas: `
              "a b b"
              "c d e"
              "c f e"
            `,
          }}
        >
          {/* A: Mobile 9:16 Portrait - Top Left (Mobile App Showcase - same height as E-Commerce) */}
          <ProjectCard project={projects[0]} gridArea="a" />
          
          {/* B: Desktop 16:9 Landscape - Top Right, spans 2 cols (E-Commerce Platform) */}
          <ProjectCard project={projects[1]} gridArea="b" />
          
          {/* C: Mobile 9:16 Portrait - Left, spans 2 rows (Corporate Dashboard) */}
          <ProjectCard project={projects[2]} gridArea="c" />
          
          {/* D: Desktop 16:9 Landscape - Center Top (Data Insights) */}
          <ProjectCard project={projects[3]} gridArea="d" />
          
          {/* F: Desktop 16:9 Landscape - Center Bottom (Analytics Platform) */}
          <ProjectCard project={projects[4]} gridArea="f" />
          
          {/* E: Mobile 9:16 Portrait - Right, spans 2 rows (Social Media App) */}
          <ProjectCard project={projects[5]} gridArea="e" />
        </div>

        {/* Mobile Layout - Single Column */}
        <div className="md:hidden flex flex-col gap-4">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              style={{ height: index % 2 === 0 ? '350px' : '200px' }}
            >
              <ProjectCard project={project} gridArea="auto" />
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mt-12"
        >
          <a
            href="/portfolio"
            className="px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #F58122 0%, #e0741d 100%)',
              boxShadow: '0 0 30px rgba(245, 129, 34, 0.3)',
            }}
          >
            View All Projects
          </a>
        </motion.div>
      </div>
    </section>
  );
}
