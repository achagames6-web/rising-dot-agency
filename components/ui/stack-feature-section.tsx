'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { StarButton } from '@/components/ui/star-button';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import {
  FaReact,
  FaAws,
  FaDocker,
  FaNodeJs,
  FaWordpress,
  FaShopify,
  FaGoogle,
  FaSlack,
} from 'react-icons/fa';
import {
  SiNextdotjs,
  SiVercel,
  SiTypescript,
  SiTailwindcss,
  SiOpenai,
  SiN8N,
  SiStripe,
  SiSupabase,
} from 'react-icons/si';

// Icon mapping for dynamic rendering from CMS
const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  FaReact,
  FaAws,
  FaDocker,
  FaNodeJs,
  FaWordpress,
  FaShopify,
  FaGoogle,
  FaSlack,
  SiNextdotjs,
  SiVercel,
  SiTypescript,
  SiTailwindcss,
  SiOpenai,
  SiN8N,
  SiStripe,
  SiSupabase,
};

const defaultIconConfigs = [
  { icon: 'FaReact', color: '#61DAFB' },
  { icon: 'FaAws', color: '#FF9900' },
  { icon: 'FaDocker', color: '#2496ED' },
  { icon: 'FaNodeJs', color: '#339933' },
  { icon: 'SiNextdotjs', color: '#FFFFFF' },
  { icon: 'SiVercel', color: '#FFFFFF' },
  { icon: 'SiTypescript', color: '#3178C6' },
  { icon: 'SiTailwindcss', color: '#06B6D4' },
  { icon: 'FaWordpress', color: '#21759B' },
  { icon: 'FaShopify', color: '#7AB55C' },
  { icon: 'SiOpenai', color: '#10A37F' },
  { icon: 'SiN8N', color: '#EA4B71' },
  { icon: 'FaGoogle', color: '#DB4437' },
  { icon: 'FaSlack', color: '#4A154B' },
  { icon: 'SiStripe', color: '#635BFF' },
  { icon: 'SiSupabase', color: '#3ECF8E' },
];

interface StackFeatureSectionProps {
  page?: string;
}

export default function StackFeatureSection({ page = 'home' }: StackFeatureSectionProps) {
  // Fetch CMS content
  const { content } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    ctaText?: string;
    ctaHref?: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
    centerText?: string;
    icons?: { icon: string; color: string }[];
    colors?: {
      borderColor?: string;
      orbitBorderColor?: string;
      iconBgColor?: string;
      iconBorderColor?: string;
      gradientStart?: string;
      gradientEnd?: string;
    };
  }>(page, 'stackFeature');

  // Use CMS data or fallback to defaults
  const eyebrow = content?.eyebrow || '✨ Our Tech Stack';
  const title = content?.title || 'Build Your';
  const titleHighlight = content?.titleHighlight || 'Digital Empire';
  const subtitle = content?.subtitle || 'We leverage cutting-edge technologies to deliver scalable, high-performance solutions that drive your business forward.';
  const ctaText = content?.ctaText || 'Start Your Project';
  const ctaHref = content?.ctaHref || '/contact';
  const secondaryCtaText = content?.secondaryCtaText || 'View Our Work';
  const secondaryCtaHref = content?.secondaryCtaHref || '/portfolio';
  const centerText = content?.centerText || 'RISING';
  const iconConfigs = content?.icons || defaultIconConfigs;
  
  // Color configuration
  const colors = {
    borderColor: content?.colors?.borderColor || '#37AFE1',
    orbitBorderColor: content?.colors?.orbitBorderColor || '#37AFE1',
    iconBgColor: content?.colors?.iconBgColor || '#0F172A',
    iconBorderColor: content?.colors?.iconBorderColor || '#37AFE1',
    gradientStart: content?.colors?.gradientStart || '#F58122',
    gradientEnd: content?.colors?.gradientEnd || '#37AFE1',
  };
  const orbitCount = 3;
  const orbitGap = 8;
  const iconsPerOrbit = Math.ceil(iconConfigs.length / orbitCount);

  return (
    <section 
      className="relative max-w-6xl mx-auto my-16 md:my-24 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between min-h-[26rem] bg-transparent overflow-hidden rounded-3xl"
      style={{ border: `1px solid ${colors.borderColor}30` }}
    >
      {/* Left side: Heading and Text */}
      <div className="w-full md:w-1/2 z-10 py-8 md:py-0">
        <motion.div
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.15] backdrop-blur-sm mb-6"
          whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.3)' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="h-4 w-4 text-[#F58122]" />
          </motion.div>
          <span className="text-sm font-medium text-white/80">{eyebrow}</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </motion.div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            {title}
          </span>{' '}
          <motion.span
            className="bg-clip-text text-transparent bg-gradient-to-r from-[#F58122] via-[#37AFE1] to-[#F58122]"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            {titleHighlight}
          </motion.span>
        </h2>
        <p className="text-lg text-white/60 mb-8 max-w-lg leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={ctaHref}>
              <StarButton className="h-12 px-6 text-base font-semibold" duration={2.5}>
                {ctaText}
              </StarButton>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={secondaryCtaHref}>
              <StarButton
                variant="secondary"
                className="h-12 px-6 text-base font-semibold"
                duration={3}
              >
                {secondaryCtaText}
              </StarButton>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Right side: Orbit animation */}
      <div className="relative w-full md:w-1/2 h-[20rem] md:h-full flex items-center justify-center md:justify-start overflow-hidden">
        <div className="relative w-[40rem] h-[40rem] md:w-[50rem] md:h-[50rem] md:translate-x-[30%] flex items-center justify-center">
          {/* Center Circle */}
          <div 
            className="w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg flex items-center justify-center"
            style={{ background: `linear-gradient(to bottom right, ${colors.gradientStart}, ${colors.gradientEnd})` }}
          >
            <span className="text-white font-bold text-xs md:text-sm">{centerText}</span>
          </div>

          {/* Generate Orbits */}
          {[...Array(orbitCount)].map((_, orbitIdx) => {
            const size = `${10 + orbitGap * (orbitIdx + 1)}rem`;
            const angleStep = (2 * Math.PI) / iconsPerOrbit;

            return (
              <div
                key={orbitIdx}
                className="absolute rounded-full border border-dashed"
                style={{
                  width: size,
                  height: size,
                  borderColor: `${colors.orbitBorderColor}30`,
                  animation: `spin ${20 + orbitIdx * 8}s linear infinite ${orbitIdx % 2 === 0 ? '' : 'reverse'}`,
                }}
              >
                {iconConfigs
                  .slice(orbitIdx * iconsPerOrbit, orbitIdx * iconsPerOrbit + iconsPerOrbit)
                  .map((cfg, iconIdx) => {
                    const angle = iconIdx * angleStep;
                    const x = 50 + 50 * Math.cos(angle);
                    const y = 50 + 50 * Math.sin(angle);
                    const IconComponent = iconMap[cfg.icon];

                    if (!IconComponent) return null;

                    return (
                      <div
                        key={iconIdx}
                        className="absolute rounded-full p-2 shadow-md"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: colors.iconBgColor,
                          border: `1px solid ${colors.iconBorderColor}20`,
                          animation: `spin ${20 + orbitIdx * 8}s linear infinite ${orbitIdx % 2 === 0 ? 'reverse' : ''}`,
                        }}
                      >
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8" style={{ color: cfg.color }} />
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
