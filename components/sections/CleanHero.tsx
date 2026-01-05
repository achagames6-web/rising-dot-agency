'use client';

import { useRef, useCallback } from 'react';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { useAnalytics } from '@/components/analytics/AnalyticsTracker';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';
import { StarButton } from '@/components/ui/star-button';
import Link from 'next/link';

// Dynamic import of AnimatedBackground (client-side only, avoid SSR issues)
const AnimatedBackground = dynamic(
  () => import('@/components/backgrounds/AnimatedBackground'),
  {
    ssr: false,
  }
);

export default function CleanHero() {
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
  }>('home', 'hero');

  // Default values matching the design requirements
  const eyebrow =
    heroContent?.eyebrow ||
    "We Design websites that matter, user's can't resist";
  const title = heroContent?.title || 'Design That Powers Real Business Growth';
  const subtitle =
    heroContent?.subtitle ||
    'Elevating brands through innovative and engaging web solutions.';
  const ctaText = heroContent?.ctaText || 'Get Started';
  const ctaLink = heroContent?.ctaLink || '/contact';

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
      className="relative min-h-screen overflow-hidden"
      onMouseMove={trackHeroInteraction}
      onTouchStart={trackHeroInteraction}
    >
      {/* New AnimatedBackground - replaces ParticleBackground, PlanetGlow, and gradient overlays */}
      <AnimatedBackground />

      {/* Content with z-10 */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-20">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex flex-col items-center gap-8 text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm">
              <span className="text-base font-medium text-white/90 md:text-lg">
                {eyebrow}
              </span>
              <ArrowRight className="h-5 w-5 text-[#F58122]" />
            </div>

            {/* Main Heading */}
            <h1
              className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 3.625rem)' }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            <p
              className="mx-auto max-w-2xl text-lg font-medium leading-relaxed md:text-xl"
              style={{ color: '#A7ADBE' }}
            >
              {subtitle}
            </p>

            {/* CTA Section */}
            <div className="mt-4 flex flex-col items-center gap-6">
              {/* Primary CTA Button */}
              <Link href={ctaLink}>
                <StarButton className="px-8 py-4 text-base">
                  {ctaText}
                </StarButton>
              </Link>

              {/* Pulse Indicator */}
              <div className="flex items-center gap-2">
                <div className="relative flex h-3 w-3">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ background: '#0DDE33' }}
                  />
                  <span
                    className="relative inline-flex h-3 w-3 rounded-full"
                    style={{ background: '#0DDE33' }}
                  />
                </div>
                <span className="text-sm font-medium text-white/80">
                  2 Spots Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
