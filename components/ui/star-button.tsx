'use client';

import React, { useRef, useEffect, ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface StarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Render as a link instead of a button. */
  href?: string;
  lightWidth?: number;
  duration?: number;
  lightColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderWidth?: number;
  className?: string;
  /**
   * primary   solid brand orange
   * secondary solid brand blue
   * ghost     transparent until hover, then fills orange - same light trail
   */
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function StarButton({
  children,
  href,
  lightWidth = 100,
  duration = 3,
  lightColor = '#FFFFFF',
  backgroundColor = '#F58122',
  textColor = '#FFFFFF',
  borderWidth = 3,
  className,
  variant = 'primary',
  ...props
}: StarButtonProps) {
  const pathRef = useRef<HTMLElement>(null);

  // Set colors based on variant
  const isGhost = variant === 'ghost';
  const bgColor = variant === 'secondary' ? '#37AFE1' : '#F58122';
  const finalBgColor =
    backgroundColor !== '#F58122' && backgroundColor !== 'currentColor'
      ? backgroundColor
      : bgColor;

  useEffect(() => {
    if (pathRef.current) {
      const div = pathRef.current;
      div.style.setProperty(
        '--path',
        `path('M 0 0 H ${div.offsetWidth} V ${div.offsetHeight} H 0 V 0')`
      );
    }
  }, []);

  const Tag = (href ? 'a' : 'button') as 'a';

  return (
    <Tag
      href={href}
      style={
        {
          '--duration': duration,
          '--light-width': `${lightWidth}px`,
          '--light-color': lightColor,
          '--border-width': `${borderWidth}px`,
          '--bg-color': finalBgColor,
          '--text-color': textColor,
          isolation: 'isolate',
        } as CSSProperties
      }
      ref={pathRef as React.Ref<HTMLAnchorElement>}
      className={cn(
        'group/star-button relative z-[3] inline-flex h-10 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-3xl px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    >
      {/* Black border base layer */}
      <div
        className="absolute inset-0 z-[1] rounded-[inherit]"
        style={{
          backgroundColor: '#000000',
        }}
        aria-hidden="true"
      />

      {/* Animated light trail - runs on top of black border */}
      <div
        className="absolute z-[2] aspect-square animate-star-btn"
        style={
          {
            offsetPath: 'var(--path)',
            offsetDistance: '0%',
            width: 'var(--light-width)',
            height: 'var(--light-width)',
            background: `radial-gradient(ellipse at center, var(--light-color) 0%, var(--light-color) 20%, transparent 70%)`,
            filter: 'blur(2px)',
          } as CSSProperties
        }
      />

      {/* Inner background with branding color - inset to show border.
          Ghost keeps it transparent so the page shows through, then fills on
          hover. The border and its light trail are identical either way. */}
      <div
        className={cn(
          'absolute z-[3] overflow-hidden rounded-[inherit] transition-colors duration-300',
          isGhost && 'group-hover/star-button:!bg-[#F58122]'
        )}
        style={{
          inset: 'var(--border-width)',
          backgroundColor: isGhost ? 'transparent' : 'var(--bg-color)',
        }}
        aria-hidden="true"
      />

      {/* Text layer */}
      <span
        className={cn(
          'relative z-10 inline-flex items-center gap-2 font-semibold transition-colors duration-300',
          isGhost && 'group-hover/star-button:!text-white'
        )}
        style={{ color: isGhost ? '#F58122' : 'var(--text-color)' }}
      >
        {children}
      </span>
    </Tag>
  );
}
