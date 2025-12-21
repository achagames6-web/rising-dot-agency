'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

import { StarButton } from '@/components/ui/star-button';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { useAnalytics } from '@/components/analytics/AnalyticsTracker';

import Spline from '@splinetool/react-spline';

// Spline 3D Scene using React component with self-hosted file
function SplineScene() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Loading state */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-12 h-12 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
        </div>
      )}
      
      {/* Fallback gradient animation if Spline fails */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#37AFE1]/20 via-transparent to-[#F58122]/20">
          <div className="w-64 h-64 rounded-full bg-gradient-to-r from-[#37AFE1] to-[#F58122] opacity-20 animate-pulse blur-3xl" />
        </div>
      )}
      
      {/* Container that clips the bottom to hide watermark */}
      {!hasError && (
        <div 
          className="absolute inset-0" 
          style={{ 
            clipPath: 'inset(0 0 60px 0)',
            height: 'calc(100% + 60px)'
          }}
        >
          <Spline
            scene="/scene.splinecode"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
        </div>
      )}
    </div>
  );
}

interface HeroProps {
  typewriterSpeed?: number;
}

// Typewriter effect component
function Typewriter({ 
  text, 
  speed = 100, 
  onComplete 
}: { 
  text: string; 
  speed?: number; 
  onComplete?: () => void;
}) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <span>
      {displayText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  );
}

// Shape types
type ShapeType = 'wordpress' | 'shopify' | 'n8n' | 'chatbot' | 'seo' | 'webdesign';

interface FloatingShape {
  x: number;
  y: number;
  size: number;
  type: ShapeType;
  rotation: number;
  rotationSpeed: number;
  vx: number;
  vy: number;
  opacity: number;
  color: string;
}

const SHAPE_COLORS = [
  '#37AFE1',
  '#31A4DB',
  '#F58122',
  'rgba(55, 175, 225, 0.6)',
  'rgba(49, 164, 219, 0.5)',
];

export default function Hero({
  typewriterSpeed = 80,
}: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const shapesRef = useRef<FloatingShape[]>([]);
  const animationFrameRef = useRef<number>(0);
  const hasTrackedInteraction = useRef(false);
  const { trackEvent } = useAnalytics();

  // Fetch CMS content
  const { content: heroContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    scrollText?: string;
  }>('home', 'hero');

  // Default values
  const eyebrow = heroContent?.eyebrow || 'Digital Excellence Delivered';
  const title = heroContent?.title || 'Rising Dot Agency';
  const subtitle = heroContent?.subtitle || 'We craft stunning websites, powerful automations, and intelligent chatbots that transform your digital presence.';
  const ctaText = heroContent?.ctaText || 'Get Started';
  const scrollText = heroContent?.scrollText || 'Scroll to explore';

  const animationStateRef = useRef({
    textScrambled: false,
    ctaVisible: false,
  });

  // Track hero interaction on first user engagement
  const trackHeroInteraction = useCallback(() => {
    if (!hasTrackedInteraction.current) {
      hasTrackedInteraction.current = true;
      trackEvent('hero_interaction', { type: 'engagement', section: 'hero' });
    }
  }, [trackEvent]);


  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const shapeCount = 24;
    const shapes: FloatingShape[] = [];
    const serviceTypes: ShapeType[] = ['wordpress', 'shopify', 'n8n', 'chatbot', 'seo', 'webdesign'];

    for (let i = 0; i < shapeCount; i++) {
      const sizeCategory = Math.random();
      let size: number;
      if (sizeCategory < 0.3) {
        size = Math.random() * 25 + 35;
      } else if (sizeCategory < 0.7) {
        size = Math.random() * 35 + 55;
      } else {
        size = Math.random() * 50 + 80;
      }

      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        type: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.004,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.4 + 0.2,
        color: SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)],
      });
    }
    shapesRef.current = shapes;

    const drawShape = (shape: FloatingShape) => {
      ctx.save();
      ctx.translate(shape.x, shape.y);
      ctx.rotate(shape.rotation);
      ctx.globalAlpha = shape.opacity;
      ctx.fillStyle = shape.color;
      ctx.strokeStyle = shape.color;
      const s = shape.size;

      switch (shape.type) {
        case 'wordpress': {
          const wpScale = s / 24;
          ctx.save();
          ctx.scale(wpScale, wpScale);
          ctx.translate(-12, -12);
          ctx.beginPath();
          ctx.arc(12, 12, 10, 0, Math.PI * 2);
          ctx.lineWidth = 1.4;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(7, 8.5);
          ctx.lineTo(8.1, 8.5);
          ctx.lineTo(9.7, 14.6);
          ctx.lineTo(11.4, 8.5);
          ctx.lineTo(12.6, 8.5);
          ctx.lineTo(14.3, 14.6);
          ctx.lineTo(15.9, 8.5);
          ctx.lineTo(17, 8.5);
          ctx.lineWidth = 1.4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
          ctx.restore();
          break;
        }
        case 'shopify': {
          const shopifyScale = s / 32;
          ctx.save();
          ctx.scale(shopifyScale, shopifyScale);
          ctx.translate(-16, -16);
          ctx.beginPath();
          ctx.moveTo(7, 11);
          ctx.lineTo(5, 28);
          ctx.lineTo(27, 28);
          ctx.lineTo(25, 11);
          ctx.closePath();
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(11, 11);
          ctx.quadraticCurveTo(11, 4, 16, 4);
          ctx.quadraticCurveTo(21, 4, 21, 11);
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
          break;
        }
        case 'n8n': {
          const n8nScale = s / 24;
          ctx.save();
          ctx.scale(n8nScale, n8nScale);
          ctx.translate(-12, -12);
          ctx.beginPath();
          ctx.moveTo(24, 8.4);
          ctx.bezierCurveTo(24, 9.725, 22.898, 10.8, 21.538, 10.8);
          ctx.bezierCurveTo(20.392, 10.8, 19.428, 10.035, 19.154, 9);
          ctx.lineTo(15.718, 9);
          ctx.bezierCurveTo(15.116, 9, 14.603, 9.424, 14.504, 10.003);
          ctx.lineTo(14.403, 10.595);
          ctx.bezierCurveTo(14.203, 11.0, 13.891, 11.349, 13.503, 11.6);
          ctx.bezierCurveTo(13.915, 11.954, 14.207, 12.444, 14.303, 13.005);
          ctx.lineTo(14.403, 13.597);
          ctx.bezierCurveTo(14.504, 14.176, 15.017, 14.6, 15.619, 14.6);
          ctx.lineTo(16.694, 14.6);
          ctx.bezierCurveTo(16.967, 13.565, 17.931, 12.8, 19.078, 12.8);
          ctx.bezierCurveTo(20.438, 12.8, 21.539, 13.875, 21.539, 15.2);
          ctx.bezierCurveTo(21.539, 16.525, 20.437, 17.6, 19.078, 17.6);
          ctx.bezierCurveTo(17.931, 17.6, 16.968, 16.835, 16.694, 15.8);
          ctx.lineTo(15.719, 15.8);
          ctx.bezierCurveTo(14.515, 15.8, 13.489, 14.952, 13.291, 13.795);
          ctx.lineTo(13.19, 13.203);
          ctx.bezierCurveTo(13.091, 12.624, 12.578, 12.2, 11.976, 12.2);
          ctx.lineTo(10.97, 12.2);
          ctx.bezierCurveTo(10.662, 13.184, 9.724, 13.9, 8.614, 13.9);
          ctx.bezierCurveTo(7.504, 13.9, 6.566, 13.184, 6.259, 12.2);
          ctx.lineTo(4.817, 12.2);
          ctx.bezierCurveTo(4.509, 13.184, 3.571, 13.9, 2.462, 13.9);
          ctx.bezierCurveTo(1.102, 13.9, 0, 12.825, 0, 11.5);
          ctx.bezierCurveTo(0, 10.175, 1.102, 9.1, 2.462, 9.1);
          ctx.bezierCurveTo(3.645, 9.1, 4.634, 9.915, 4.87, 11);
          ctx.lineTo(6.207, 11);
          ctx.bezierCurveTo(6.443, 9.915, 7.432, 9.1, 8.615, 9.1);
          ctx.bezierCurveTo(9.799, 9.1, 10.787, 9.915, 11.023, 11);
          ctx.lineTo(11.975, 11);
          ctx.bezierCurveTo(12.576, 11, 13.09, 10.576, 13.188, 9.997);
          ctx.lineTo(13.29, 9.405);
          ctx.bezierCurveTo(13.488, 8.248, 14.515, 7.4, 15.718, 7.4);
          ctx.lineTo(19.154, 7.4);
          ctx.bezierCurveTo(19.428, 6.365, 20.392, 5.6, 21.538, 5.6);
          ctx.bezierCurveTo(22.898, 5.6, 24, 6.675, 24, 8);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
          break;
        }
        case 'chatbot': {
          const chatbotScale = s / 24;
          ctx.save();
          ctx.scale(chatbotScale, chatbotScale);
          ctx.translate(-12, -12);
          ctx.beginPath();
          ctx.arc(12, 12, 10, 0, Math.PI * 2);
          ctx.lineWidth = 1.4;
          ctx.stroke();
          ctx.beginPath();
          ctx.roundRect(7, 7, 10, 7, 2);
          ctx.lineWidth = 1.3;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(12, 5);
          ctx.lineTo(12, 7);
          ctx.lineWidth = 1.3;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(12, 4.2, 0.8, 0, Math.PI * 2);
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(9.5, 10, 0.8, 0, Math.PI * 2);
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(14.5, 10, 0.8, 0, Math.PI * 2);
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(9, 12);
          ctx.lineTo(15, 12);
          ctx.lineWidth = 1.2;
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(8, 16);
          ctx.lineTo(6.5, 17.5);
          ctx.lineTo(8, 19);
          ctx.lineWidth = 1.2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(16, 16);
          ctx.lineTo(17.5, 17.5);
          ctx.lineTo(16, 19);
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(10.5, 16.5);
          ctx.lineTo(13.5, 18.5);
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.restore();
          break;
        }
        case 'seo': {
          const seoScale = s / 60;
          ctx.save();
          ctx.scale(seoScale, seoScale);
          ctx.translate(-30, -15);
          ctx.font = 'bold 28px Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('SEO', 30, 15);
          ctx.restore();
          break;
        }
        case 'webdesign': {
          const webdesignScale = s / 24;
          ctx.save();
          ctx.scale(webdesignScale, webdesignScale);
          ctx.translate(-12, -12);
          ctx.beginPath();
          ctx.arc(12, 12, 10, 0, Math.PI * 2);
          ctx.lineWidth = 1.4;
          ctx.stroke();
          ctx.beginPath();
          ctx.roundRect(6, 7, 12, 10, 1.2);
          ctx.lineWidth = 1.3;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(6, 10);
          ctx.lineTo(18, 10);
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(8, 8.5, 0.6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(10, 8.5, 0.6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(12, 8.5, 0.6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(11, 11);
          ctx.lineTo(11, 16);
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(7, 12);
          ctx.lineTo(10, 12);
          ctx.moveTo(7, 14);
          ctx.lineTo(10, 14);
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.beginPath();
          ctx.roundRect(12, 11, 5, 4, 0.5);
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
          break;
        }
      }
      ctx.restore();
    };

    const animate = () => {
      // Clear canvas to transparent (shows page background)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shapesRef.current.forEach((shape) => {
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotation += shape.rotationSpeed;

        const pad = shape.size;
        if (shape.x < -pad) shape.x = canvas.width + pad;
        if (shape.x > canvas.width + pad) shape.x = -pad;
        if (shape.y < -pad) shape.y = canvas.height + pad;
        if (shape.y > canvas.height + pad) shape.y = -pad;

        drawShape(shape);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const ctaTimer = setTimeout(() => {
      animationStateRef.current.ctaVisible = true;
      setIsAnimationComplete(true);
    }, 1000);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animationFrameRef.current);
      clearTimeout(ctaTimer);
    };
  }, []);


  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[85vh] pb-0 -mb-8 bg-transparent flex flex-col items-center justify-center overflow-hidden"
      onMouseMove={trackHeroInteraction}
      onTouchStart={trackHeroInteraction}
    >
      {/* Canvas with floating icons - z-index 0 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ pointerEvents: 'none' }}
      />





      {/* Two Column Layout - z-index 10 */}
      <div className="relative z-[10] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[70vh]">
          
          {/* Left Column - Content */}
          <div className="flex flex-col items-center lg:items-start justify-center gap-6 text-center lg:text-left order-2 lg:order-1 w-full lg:w-auto">
            <p className="text-[#F97316] text-lg md:text-xl font-inter tracking-wide uppercase">
              {eyebrow}
            </p>

            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent font-montserrat min-h-[120px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px] flex items-center justify-center lg:justify-start"
              style={{
                backgroundImage: 'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
                backgroundSize: '300% 100%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }}
            >
              {title}
            </h1>

            <p className="text-white/80 text-lg md:text-xl max-w-xl font-inter mt-2">
              {subtitle}
            </p>

            <div
              className={`mt-6 ${isAnimationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{
                transition: 'opacity 600ms ease-out, transform 600ms ease-out',
              }}
            >
              <StarButton
                className="h-12 px-8 text-base font-semibold hover:scale-105 transition-transform"
                duration={2.5}
              >
                {ctaText}
              </StarButton>
            </div>
          </div>

          {/* Right Column - Spline 3D */}
          <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[600px] order-1 lg:order-2">
            <SplineScene />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500 z-[10] ${isAnimationComplete ? 'opacity-100' : 'opacity-0'}`}
      >
        <span className="text-[#37AFE1] text-sm font-inter">{scrollText}</span>
        <div className="w-6 h-10 border-2 border-[#37AFE1] rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-[#F97316] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
