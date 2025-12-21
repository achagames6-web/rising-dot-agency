'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EnterpriseSpringSystem } from '@/lib/physics/SpringSystem';
import { GlowCard } from '@/components/ui/glow-card';
import { ParticleWrapper } from '@/components/ui/particle-button';
import SubmitTestimonialModal from '@/components/testimonials/SubmitTestimonialModal';

interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  audioUrl?: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'TechCorp',
    role: 'CEO',
    content:
      'Rising Dot transformed our digital presence with their innovative automation solutions. The results exceeded our expectations.',
    avatar: '👩‍💼',
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'InnovateLabs',
    role: 'CTO',
    content:
      'The chatbot they developed has revolutionized our customer service. Response times are down 80% and satisfaction is up.',
    avatar: '👨‍💻',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    company: 'DesignHub',
    role: 'Creative Director',
    content:
      'Their web design expertise is unmatched. They created a stunning, performant site that perfectly captures our brand.',
    avatar: '👩‍🎨',
  },
  {
    id: '4',
    name: 'David Park',
    company: 'ShopSmart',
    role: 'Founder',
    content:
      'Our Shopify store conversion rate doubled after their optimization. The attention to detail is incredible.',
    avatar: '👨‍💼',
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    company: 'ContentKing',
    role: 'Marketing Director',
    content:
      'SEO results speak for themselves - we went from page 3 to top 3 positions for our key terms in just 4 months.',
    avatar: '👩',
  },
];

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });
  const velocityRef = useRef(0);
  const lastPositionRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const springRef = useRef<EnterpriseSpringSystem | null>(null);
  const animationFrameRef = useRef<number>();

  // Modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Audio waveform state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>(
    new Array(32).fill(0)
  );
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Particle state for navigation arrows
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize spring system for elastic bounds
  useEffect(() => {
    springRef.current = new EnterpriseSpringSystem({
      mass: 1.0,
      tension: 170,
      friction: 26,
      velocityDamping: 0.95,
    });
    springRef.current.setPosition(0);
    springRef.current.setTarget(0);
  }, []);

  // Calculate bounds
  const getScrollBounds = () => {
    if (!scrollContainerRef.current) return { min: 0, max: 0 };

    const container = scrollContainerRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    return { min: 0, max: maxScroll };
  };

  // Handle mouse/touch down
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStart({
      x: clientX,
      scrollLeft: scrollPosition,
    });
    velocityRef.current = 0;
    lastPositionRef.current = clientX;
    lastTimeRef.current = Date.now();
  };

  // Handle mouse/touch move
  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStart.x;
    const newScrollPosition = dragStart.scrollLeft - deltaX;

    // Track velocity
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTimeRef.current;
    if (deltaTime > 0) {
      const deltaPosition = clientX - lastPositionRef.current;
      velocityRef.current = (deltaPosition / deltaTime) * 1000; // px/s
    }

    lastPositionRef.current = clientX;
    lastTimeRef.current = currentTime;

    setScrollPosition(newScrollPosition);
  };

  // Handle mouse/touch up
  const handlePointerUp = () => {
    setIsDragging(false);

    // Start momentum scrolling with inertia
    if (Math.abs(velocityRef.current) > 10) {
      startMomentumScroll();
    } else {
      // Check bounds and apply elastic bounce if needed
      checkBounds();
    }
  };

  // Momentum scrolling with 0.95 damping
  const startMomentumScroll = () => {
    const animate = () => {
      // Apply damping (0.95 per frame)
      velocityRef.current *= 0.95;

      // Update position
      const newPosition = scrollPosition - velocityRef.current / 60; // Assuming 60fps
      setScrollPosition(newPosition);

      // Check bounds
      const bounds = getScrollBounds();
      if (newPosition < bounds.min || newPosition > bounds.max) {
        // Hit boundary, start elastic bounce
        checkBounds();
        return;
      }

      // Continue if velocity is significant
      if (Math.abs(velocityRef.current) > 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Check bounds and apply elastic bounce
  const checkBounds = () => {
    const bounds = getScrollBounds();
    const spring = springRef.current;
    if (!spring) return;

    let targetPosition = scrollPosition;
    let needsBounce = false;

    // Check if out of bounds
    if (scrollPosition < bounds.min) {
      targetPosition = bounds.min;
      needsBounce = true;
    } else if (scrollPosition > bounds.max) {
      targetPosition = bounds.max;
      needsBounce = true;
    }

    if (needsBounce) {
      // Allow 20% overshoot
      const overshoot =
        scrollPosition < bounds.min
          ? bounds.min - scrollPosition
          : scrollPosition - bounds.max;
      const maxOvershoot = 100; // pixels
      const clampedOvershoot = Math.min(overshoot, maxOvershoot);

      spring.setPosition(scrollPosition);
      spring.setTarget(targetPosition);

      // Animate bounce back over 600ms
      const startTime = Date.now();
      const duration = 600;

      const bounceAnimate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        spring.update(1 / 60);
        setScrollPosition(spring.getCurrentPosition());

        if (progress < 1 && !spring.isSettled()) {
          animationFrameRef.current = requestAnimationFrame(bounceAnimate);
        } else {
          setScrollPosition(targetPosition);
        }
      };

      animationFrameRef.current = requestAnimationFrame(bounceAnimate);
    }
  };

  // Apply scroll position to container
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollPosition;
    }
  }, [scrollPosition]);

  // Cleanup animation frame
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Audio waveform visualization
  useEffect(() => {
    if (!isPlaying) return;

    let animationId: number;

    const updateWaveform = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(32); // 32 frequency bands
        analyserRef.current.getByteFrequencyData(dataArray);

        // Normalize to 0-1 range and apply exponential moving average smoothing
        const normalized = Array.from(dataArray).map((value, index) => {
          const newValue = value / 255;
          const oldValue = waveformData[index] || 0;
          return oldValue * 0.7 + newValue * 0.3; // EMA smoothing
        });

        setWaveformData(normalized);
      }

      animationId = requestAnimationFrame(updateWaveform);
    };

    animationId = requestAnimationFrame(updateWaveform);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isPlaying]);

  // Initialize audio context (mock for now since we don't have actual audio files)
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64; // 32 frequency bands
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  };

  // Toggle audio playback (mock)
  const toggleAudio = () => {
    initAudioContext();
    setIsPlaying(!isPlaying);

    // Mock waveform animation when playing
    if (!isPlaying) {
      // Simulate audio waveform
      const interval = setInterval(() => {
        setWaveformData((prev) => prev.map(() => Math.random() * 0.8 + 0.2));
      }, 16); // ~60fps

      return () => clearInterval(interval);
    }
  };

  // Navigate to previous testimonial
  const navigatePrev = () => {
    emitParticles('prev');
    const newIndex = Math.max(0, currentTestimonial - 1);
    setCurrentTestimonial(newIndex);

    // Scroll to testimonial
    const cardWidth = 400; // Approximate card width
    const gap = 32; // Gap between cards
    const targetScroll = newIndex * (cardWidth + gap);

    // Animate scroll
    const spring = springRef.current;
    if (spring) {
      spring.setPosition(scrollPosition);
      spring.setTarget(targetScroll);

      const animate = () => {
        spring.update(1 / 60);
        setScrollPosition(spring.getCurrentPosition());

        if (!spring.isSettled()) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  // Navigate to next testimonial
  const navigateNext = () => {
    emitParticles('next');
    const newIndex = Math.min(testimonials.length - 1, currentTestimonial + 1);
    setCurrentTestimonial(newIndex);

    // Scroll to testimonial
    const cardWidth = 400;
    const gap = 32;
    const targetScroll = newIndex * (cardWidth + gap);

    // Animate scroll
    const spring = springRef.current;
    if (spring) {
      spring.setPosition(scrollPosition);
      spring.setTarget(targetScroll);

      const animate = () => {
        spring.update(1 / 60);
        setScrollPosition(spring.getCurrentPosition());

        if (!spring.isSettled()) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  // Emit particles from navigation arrows
  const emitParticles = (direction: 'prev' | 'next') => {
    const button =
      direction === 'prev'
        ? document.querySelector('[data-nav="prev"]')
        : document.querySelector('[data-nav="next"]');

    if (!button) return;

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const newParticles: Particle[] = [];
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5;
      const speed = 100 + Math.random() * 50;

      newParticles.push({
        id: particleIdRef.current++,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 1.0,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  };

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    let animationId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setParticles((prevParticles) =>
        prevParticles
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx * deltaTime,
            y: particle.y + particle.vy * deltaTime,
            life: particle.life - deltaTime,
          }))
          .filter((particle) => particle.life > 0)
      );

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [particles.length > 0]);

  // Draw particles on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      const opacity = particle.life / particle.maxLife;
      ctx.fillStyle = `rgba(55, 175, 225, ${opacity})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [particles]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden px-6 py-20"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Animated gradient orbs background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '400px',
            height: '400px',
            background:
              'radial-gradient(circle, rgba(55, 175, 225, 0.35) 0%, rgba(49, 164, 219, 0.15) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{
            x: ['8%', '18%', '8%'],
            y: ['25%', '40%', '25%'],
          }}
          transition={{
            duration: 21,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '350px',
            height: '350px',
            background:
              'radial-gradient(circle, rgba(49, 164, 219, 0.3) 0%, rgba(55, 175, 225, 0.12) 50%, transparent 70%)',
            filter: 'blur(35px)',
          }}
          animate={{
            x: ['68%', '78%', '68%'],
            y: ['15%', '30%', '15%'],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: '420px',
            height: '420px',
            background:
              'radial-gradient(circle, rgba(245, 129, 34, 0.3) 0%, rgba(245, 129, 34, 0.12) 50%, transparent 70%)',
            filter: 'blur(42px)',
          }}
          animate={{
            x: ['48%', '58%', '48%'],
            y: ['55%', '70%', '55%'],
          }}
          transition={{
            duration: 23,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-10"
        style={{ mixBlendMode: 'screen' }}
      />

      <div className="relative z-20 mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-montserrat text-4xl font-bold text-white md:text-5xl">
            Client Success Stories
          </h2>
          <p className="mb-6 font-inter text-xl text-[#64748B]">
            Hear what our clients have to say
          </p>
          <ParticleWrapper>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="rounded-lg bg-[#F58122] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#e0741d]"
            >
              ✍️ Leave a Review
            </button>
          </ParticleWrapper>
        </div>

        {/* Carousel container */}
        <div className="relative">
          {/* Navigation arrows */}
          <ParticleWrapper className="absolute left-0 top-1/2 z-30 -translate-y-1/2">
            <motion.button
              data-nav="prev"
              onClick={navigatePrev}
              disabled={currentTestimonial === 0}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
              className="flex h-12 w-12
                       items-center justify-center rounded-full bg-[#37AFE1]
                       text-2xl text-white shadow-lg transition-colors duration-200
                       hover:bg-[#F58122] hover:shadow-[0_0_20px_rgba(55,175,225,0.5)]
                       disabled:cursor-not-allowed disabled:opacity-30"
              style={{ backdropFilter: 'blur(10px)' }}
            >
              ←
            </motion.button>
          </ParticleWrapper>

          <ParticleWrapper className="absolute right-0 top-1/2 z-30 -translate-y-1/2">
            <motion.button
              data-nav="next"
              onClick={navigateNext}
              disabled={currentTestimonial === testimonials.length - 1}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
              className="flex h-12 w-12
                       items-center justify-center rounded-full bg-[#37AFE1]
                       text-2xl text-white shadow-lg transition-colors duration-200
                       hover:bg-[#F58122] hover:shadow-[0_0_20px_rgba(55,175,225,0.5)]
                       disabled:cursor-not-allowed disabled:opacity-30"
              style={{ backdropFilter: 'blur(10px)' }}
            >
              →
            </motion.button>
          </ParticleWrapper>

          {/* Scrollable testimonials */}
          <div
            ref={scrollContainerRef}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            className="flex cursor-grab gap-8 overflow-x-hidden px-16 active:cursor-grabbing"
            style={{ scrollBehavior: 'auto' }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="w-[400px] flex-shrink-0"
              >
                <GlowCard
                  backgroundColor="#1E293B"
                  accentColor="#37AFE1"
                  borderRadius="1rem"
                  borderWidth="2px"
                  className="h-full p-8 shadow-lg transition-shadow hover:shadow-[0_0_30px_rgba(55,175,225,0.3)]"
                >
                  {/* Avatar and info */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className="text-5xl">{testimonial.avatar}</div>
                    <div>
                      <h3 className="font-montserrat text-xl font-semibold text-white">
                        {testimonial.name}
                      </h3>
                      <p className="font-inter text-sm text-[#64748B]">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>

                  {/* Testimonial content */}
                  <p className="mb-6 font-inter leading-relaxed text-[#F8FAFC]">
                    "{testimonial.content}"
                  </p>

                  {/* Audio waveform visualization */}
                  {index === currentTestimonial && (
                    <div className="mt-6">
                      <ParticleWrapper>
                        <button
                          onClick={toggleAudio}
                          className="mb-4 rounded-lg bg-[#37AFE1] px-4 py-2 font-inter text-sm
                                   text-white transition-colors duration-200 hover:bg-[#F58122]"
                        >
                          {isPlaying ? '⏸ Pause' : '▶ Play Audio'}
                        </button>
                      </ParticleWrapper>

                      {/* Waveform bars */}
                      <div className="flex h-24 items-end gap-1">
                        {waveformData.map((value, i) => (
                          <motion.div
                            key={i}
                            className="flex-1 rounded-t bg-[#F58122]"
                            style={{
                              height: `${Math.max(value * 100, 5)}%`,
                              opacity: 0.8,
                            }}
                            animate={{
                              height: `${Math.max(value * 100, 5)}%`,
                            }}
                            transition={{
                              duration: 0.016, // ~60fps
                              ease: 'linear',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Progress indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <ParticleWrapper key={index}>
              <button
                onClick={() => {
                  setCurrentTestimonial(index);
                  const cardWidth = 400;
                  const gap = 32;
                  const targetScroll = index * (cardWidth + gap);
                  setScrollPosition(targetScroll);
                }}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'w-8 bg-[#F58122]'
                    : 'bg-[#64748B] hover:bg-[#37AFE1]'
                }`}
              />
            </ParticleWrapper>
          ))}
        </div>
      </div>

      {/* Submit Testimonial Modal */}
      <SubmitTestimonialModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
      />
    </section>
  );
}
