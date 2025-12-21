'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';

// --- Data Interface ---
interface AccordionItem {
  id: number;
  title: string;
  imageUrl: string;
}

interface ImageAccordionHeroProps {
  title: string;
  titleHighlight?: string;
  subtitle: string;
  ctaButton?: {
    label: string;
    href: string;
  };
  items?: AccordionItem[];
}

// --- Default Portfolio Items ---
const defaultItems: AccordionItem[] = [
  {
    id: 1,
    title: 'E-Commerce',
    imageUrl: '/media/portfolio/hero/ecommerce.jpg',
  },
  {
    id: 2,
    title: 'Web Design',
    imageUrl: '/media/portfolio/hero/web-design.jpg',
  },
  {
    id: 3,
    title: 'AI Chatbots',
    imageUrl: '/media/portfolio/hero/ai-chatbots.jpg',
  },
  {
    id: 4,
    title: 'Automation',
    imageUrl: '/media/portfolio/hero/automation.jpg',
  },
  {
    id: 5,
    title: 'SEO & Marketing',
    imageUrl: '/media/portfolio/hero/seo.jpg',
  },
];

// --- Accordion Item Component ---
const AccordionItemCard = ({
  item,
  isActive,
  onMouseEnter,
}: {
  item: AccordionItem;
  isActive: boolean;
  onMouseEnter: () => void;
}) => {
  return (
    <motion.div
      className="relative h-[400px] md:h-[450px] rounded-2xl overflow-hidden cursor-pointer"
      animate={{
        width: isActive ? 320 : 60,
      }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
      onMouseEnter={onMouseEnter}
    >
      {/* Background Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src =
            'https://placehold.co/400x450/1a1a1a/37AFE1?text=Project';
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Cyan glow on active */}
      {isActive && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 60px rgba(55, 175, 225, 0.3)',
          }}
        />
      )}

      {/* Caption Text */}
      <span
        className={`absolute text-white text-base md:text-lg font-semibold whitespace-nowrap transition-all duration-500 ease-out ${
          isActive
            ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0'
            : 'bottom-24 left-1/2 -translate-x-1/2 -rotate-90 origin-center'
        }`}
      >
        {item.title}
      </span>

      {/* Active indicator line */}
      {isActive && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#37AFE1] to-[#F58122]"
        />
      )}
    </motion.div>
  );
};


// --- Main Hero Component ---
export function ImageAccordionHero({
  title,
  titleHighlight,
  subtitle,
  ctaButton,
  items = defaultItems,
}: ImageAccordionHeroProps) {
  const [activeIndex, setActiveIndex] = useState(2);

  return (
    <section className="relative w-full min-h-screen flex items-center bg-black overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left Side: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-6">
              <span className="text-white">{title}</span>
              {titleHighlight && (
                <span 
                  className="block bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
                    backgroundSize: '300% 100%',
                    animation: 'gradient-shift 4s ease-in-out infinite',
                  }}
                >
                  {titleHighlight}
                </span>
              )}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-8">
              {subtitle}
            </p>
            {ctaButton && (
              <ParticleWrapper>
                <Link href={ctaButton.href}>
                  <StarButton
                    className="px-8 py-4 text-base font-semibold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(245,129,34,0.4)]"
                    duration={2.5}
                  >
                    {ctaButton.label}
                  </StarButton>
                </Link>
              </ParticleWrapper>
            )}
          </motion.div>

          {/* Right Side: Image Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="flex flex-row items-center justify-center gap-2 md:gap-3 overflow-x-auto p-4">
              {items.map((item, index) => (
                <AccordionItemCard
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
