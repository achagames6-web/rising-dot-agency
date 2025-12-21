'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TimelineContentProps {
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'a' | 'article' | 'section';
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement>;
  customVariants?: Variants;
  className?: string;
  children?: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
}

const defaultVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(10px)',
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export function TimelineContent({
  as = 'div',
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  children,
  href,
  target,
  rel,
}: TimelineContentProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(timelineRef || localRef, { once: true, amount: 0.1 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const animationProps = {
    custom: animationNum,
    initial: 'hidden',
    animate: mounted && isInView ? 'visible' : 'hidden',
    variants: customVariants || defaultVariants,
  };

  // For anchor tags
  if (as === 'a' && href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        className={cn(className)}
        {...animationProps}
      >
        {children}
      </motion.a>
    );
  }

  // For headings
  if (as === 'h1') {
    return (
      <motion.h1
        ref={localRef as React.RefObject<HTMLHeadingElement>}
        className={cn(className)}
        {...animationProps}
      >
        {children}
      </motion.h1>
    );
  }

  if (as === 'h2') {
    return (
      <motion.h2
        ref={localRef as React.RefObject<HTMLHeadingElement>}
        className={cn(className)}
        {...animationProps}
      >
        {children}
      </motion.h2>
    );
  }

  if (as === 'h3') {
    return (
      <motion.h3
        ref={localRef as React.RefObject<HTMLHeadingElement>}
        className={cn(className)}
        {...animationProps}
      >
        {children}
      </motion.h3>
    );
  }

  // For paragraphs
  if (as === 'p') {
    return (
      <motion.p
        ref={localRef as React.RefObject<HTMLParagraphElement>}
        className={cn(className)}
        {...animationProps}
      >
        {children}
      </motion.p>
    );
  }

  // For spans
  if (as === 'span') {
    return (
      <motion.span
        ref={localRef as React.RefObject<HTMLSpanElement>}
        className={cn(className)}
        {...animationProps}
      >
        {children}
      </motion.span>
    );
  }

  // Default div
  return (
    <motion.div
      ref={localRef}
      className={cn(className)}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
}
