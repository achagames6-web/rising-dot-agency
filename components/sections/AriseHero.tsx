'use client';

import { useRef, useCallback } from 'react';
import { StarButton } from '@/components/ui/star-button';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { useAnalytics } from '@/components/analytics/AnalyticsTracker';
import dynamic from 'next/dynamic';

// Dynamic import of Framer component (client-side only)
const Hero3DClient = dynamic(() => import('../framer/Hero3DClient'), {
  ssr: false,
});

export default function AriseHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTrackedInteraction = useRef(false);
  const { trackEvent } = useAnalytics();

  // Fetch CMS content
  const { content: heroContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
  }>('home', 'hero');

  // Default values
  const eyebrow = heroContent?.eyebrow || 'Digital Excellence Delivered';
  const title = heroContent?.title || 'Rising Dot Agency';
  const subtitle =
    heroContent?.subtitle ||
    'We craft stunning websites, powerful automations, and intelligent chatbots.';
  const ctaText = heroContent?.ctaText || 'Get Started';
  const ctaLink = heroContent?.ctaLink || '/contact';
  const secondaryCtaText = heroContent?.secondaryCtaText || 'View Our Work';
  const secondaryCtaLink = heroContent?.secondaryCtaLink || '/portfolio';

  // Track interaction
  const trackHeroInteraction = useCallback(() => {
    if (!hasTrackedInteraction.current) {
      hasTrackedInteraction.current = true;
      trackEvent('hero_interaction', { type: 'engagement', section: 'hero' });
    }
  }, [trackEvent]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      onMouseMove={trackHeroInteraction}
      onTouchStart={trackHeroInteraction}
      style={{ background: 'rgb(0, 2, 15)' }}
    >
      {/* Framer 3D Background - Absolute positioned behind content */}
      <div className="absolute inset-0 z-0">
        <Hero3DClient />
      </div>

      {/* Content Overlay - Above the 3D background */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          {/* Eyebrow Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-[#37AFE1]/30 bg-[#37AFE1]/10 px-6 py-3 text-sm font-medium uppercase tracking-wider text-[#37AFE1] backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#37AFE1] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#37AFE1]"></span>
            </span>
            {eyebrow}
          </span>

          {/* Main Heading */}
          <h1 className="font-montserrat text-5xl font-bold leading-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #37AFE1 0%, #F58122 100%)',
              }}
            >
              {title}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/80 md:text-2xl">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            {/* Primary CTA - StarButton */}
            <a href={ctaLink}>
              <StarButton
                className="h-14 px-8 text-base font-semibold"
                duration={2.5}
                style={{
                  background:
                    'linear-gradient(135deg, #37AFE1 0%, #31A4DB 100%)',
                }}
              >
                {ctaText}
              </StarButton>
            </a>

            {/* Secondary CTA */}
            <a
              href={secondaryCtaLink}
              className="flex h-14 items-center gap-2 rounded-full border-2 border-white/30 bg-transparent px-8 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-[#F58122] hover:bg-[#F58122]/20"
            >
              {secondaryCtaText}
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
