'use client';

import { useRef, useState, useEffect } from 'react';

// Work/Project data - using videos
const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'Shopify Development',
    video: '/videos/project-1.mp4',
    poster: '/Projects/1.jpeg',
    color: '#31A4DB',
  },
  {
    id: 2,
    title: 'Brand Identity',
    category: 'Web Design',
    video: '/videos/project-2.mp4',
    poster: '/Projects/2.jpeg',
    color: '#37AFE1',
  },
  {
    id: 3,
    title: 'Automation Suite',
    category: 'N8N Workflows',
    video: '/videos/project-3.mp4',
    poster: '/Projects/3.jpeg',
    color: '#2563EB',
  },
  {
    id: 4,
    title: 'AI Assistant',
    category: 'Chatbot Development',
    video: '/videos/project-4.mp4',
    poster: '/Projects/4.jpeg',
    color: '#31A4DB',
  },
  {
    id: 5,
    title: 'Corporate Website',
    category: 'WordPress',
    video: '/videos/project-5.mp4',
    poster: '/Projects/5.jpeg',
    color: '#F97316',
  },
  {
    id: 6,
    title: 'SEO Campaign',
    category: 'Digital Marketing',
    video: '/videos/project-6.mp4',
    poster: '/Projects/6.jpeg',
    color: '#F59E0B',
  },
];

// Project Card with Video on Hover
function ProjectCard({ project, isLarge = false }: { project: typeof projects[0]; isLarge?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Play/pause video on hover
  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-3xl cursor-pointer group ${isLarge ? 'h-[550px] md:h-[650px]' : 'h-[350px] md:h-[400px]'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(145deg, rgba(20, 30, 50, 1) 0%, rgba(10, 15, 30, 1) 100%)',
        border: `2px solid ${isHovered ? project.color : 'rgba(139, 92, 246, 0.3)'}`,
        boxShadow: isHovered 
          ? `0 0 80px ${project.color}40, 0 30px 60px -15px rgba(0, 0, 0, 0.7), inset 0 0 100px ${project.color}10`
          : '0 15px 50px -15px rgba(0, 0, 0, 0.5), inset 0 0 60px rgba(139, 92, 246, 0.05)',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
      }}
    >
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, ${project.color}25 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, ${project.color}15 0%, transparent 50%),
            linear-gradient(180deg, ${project.color}10 0%, transparent 30%, transparent 70%, ${project.color}08 100%)
          `,
          opacity: isHovered ? 1 : 0.6,
        }}
      />

      {/* Holographic scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(139, 92, 246, 0.06) 3px,
            rgba(139, 92, 246, 0.06) 6px
          )`,
          opacity: isHovered ? 0.4 : 0.25,
        }}
      />

      {/* RGB chromatic aberration effect */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `
            linear-gradient(90deg, rgba(255,0,100,0.08) 0%, transparent 5%, transparent 95%, rgba(0,255,200,0.08) 100%),
            linear-gradient(0deg, rgba(255,100,0,0.08) 0%, transparent 5%, transparent 95%, rgba(100,0,255,0.08) 100%)
          `,
          opacity: isHovered ? 0.8 : 0.3,
        }}
      />

      {/* Glowing orbs */}
      <div 
        className="absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[80px] transition-all duration-700"
        style={{ 
          background: `radial-gradient(circle, ${project.color} 0%, transparent 70%)`, 
          opacity: isHovered ? 0.5 : 0.2,
        }}
      />
      <div 
        className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-[60px] transition-all duration-700"
        style={{ 
          background: `radial-gradient(circle, ${project.color} 0%, transparent 70%)`, 
          opacity: isHovered ? 0.4 : 0.15,
        }}
      />

      {/* Video Background - plays on hover */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src={project.video}
          poster={project.poster}
          muted
          loop
          playsInline
          className="w-full h-full object-cover transition-all duration-700 ease-out"
          style={{ 
            opacity: isHovered ? 0.85 : 0.35,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            filter: isHovered ? 'saturate(1.2) contrast(1.1)' : 'saturate(0.8) contrast(1)',
          }}
        />
        {/* Video overlay gradient */}
        <div 
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `linear-gradient(180deg, 
              rgba(10, 15, 30, ${isHovered ? '0.3' : '0.6'}) 0%, 
              rgba(10, 15, 30, ${isHovered ? '0.1' : '0.4'}) 40%,
              rgba(10, 15, 30, ${isHovered ? '0.5' : '0.7'}) 100%
            )`,
          }}
        />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-10">
        {/* Category badge - more prominent */}
        <span 
          className="inline-block px-5 py-2 rounded-full text-sm font-bold mb-5 uppercase tracking-wider transition-all duration-500"
          style={{
            background: `linear-gradient(135deg, ${project.color}50 0%, ${project.color}30 100%)`,
            color: '#ffffff',
            border: `1px solid ${project.color}60`,
            boxShadow: isHovered 
              ? `0 0 30px ${project.color}50, 0 4px 15px ${project.color}30` 
              : `0 0 15px ${project.color}20`,
            transform: isHovered ? 'translateY(-12px) scale(1.05)' : 'translateY(0) scale(1)',
            textShadow: `0 0 10px ${project.color}`,
          }}
        >
          {project.category}
        </span>
        
        {/* Title - larger and bolder */}
        <h3 
          className="text-3xl md:text-4xl lg:text-5xl font-black transition-all duration-500 leading-tight"
          style={{ 
            background: `linear-gradient(135deg, #ffffff 0%, #ffffff 50%, ${project.color} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: isHovered ? 'translateY(-12px)' : 'translateY(0)',
            textShadow: isHovered ? `0 0 40px ${project.color}40` : 'none',
            filter: `drop-shadow(0 0 ${isHovered ? '20px' : '10px'} ${project.color}30)`,
          }}
        >
          {project.title}
        </h3>

        {/* View Project indicator on hover */}
        <div 
          className="flex items-center gap-2 mt-4 transition-all duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <span className="text-white/80 text-sm font-medium">View Project</span>
          <svg 
            className="w-5 h-5 transition-transform duration-300"
            style={{ 
              color: project.color,
              transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
            }}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      {/* Animated border glow */}
      <div 
        className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-500"
        style={{
          boxShadow: isHovered 
            ? `inset 0 0 0 2px ${project.color}70, inset 0 0 30px ${project.color}20` 
            : 'inset 0 0 0 1px rgba(139, 92, 246, 0.2)',
        }}
      />

      {/* Corner accents */}
      <div 
        className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 rounded-tl-lg transition-all duration-500"
        style={{ 
          borderColor: isHovered ? project.color : 'rgba(139, 92, 246, 0.3)',
          opacity: isHovered ? 1 : 0.5,
        }}
      />
      <div 
        className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 rounded-br-lg transition-all duration-500"
        style={{ 
          borderColor: isHovered ? project.color : 'rgba(139, 92, 246, 0.3)',
          opacity: isHovered ? 1 : 0.5,
        }}
      />
    </div>
  );
}


// Main WorkGrid - Fixed 2-column asymmetrical layout
export default function WorkGrid() {
  return (
    <section className="py-24 md:py-32 bg-[#0A0F1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <span className="text-[#37AFE1] text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
            Our Work
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-black text-white max-w-2xl leading-none">
              Selected Projects
            </h2>
            <p className="text-[#94A3B8] text-lg max-w-md leading-relaxed">
              Explore our latest work and see how we help businesses transform their digital presence.
            </p>
          </div>
        </div>

        {/* Asymmetrical 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            <ProjectCard project={projects[0]} isLarge />
            <ProjectCard project={projects[2]} />
          </div>
          
          {/* Right Column */}
          <div className="flex flex-col gap-8">
            <ProjectCard project={projects[1]} />
            <ProjectCard project={projects[3]} isLarge />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="flex flex-col gap-8">
            <ProjectCard project={projects[4]} />
          </div>
          <div className="flex flex-col gap-8">
            <ProjectCard project={projects[5]} />
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-20 text-center">
          <a
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#37AFE1] to-[#2563EB] text-white font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#37AFE1]/30"
            style={{
              boxShadow: '0 0 40px rgba(139, 92, 246, 0.3), 0 10px 30px -10px rgba(0, 0, 0, 0.5)',
            }}
          >
            View All Projects
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
