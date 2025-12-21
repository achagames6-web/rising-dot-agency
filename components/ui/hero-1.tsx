'use client';

import { ChevronRight } from 'lucide-react';
import { StarButton } from '@/components/ui/star-button';
import { ParticleWrapper } from '@/components/ui/particle-button';

interface HeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function Hero1({
  eyebrow,
  title,
  subtitle,
  ctaLabel = 'Explore Now',
  ctaHref = '#',
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative mx-auto w-full pt-28 px-6 text-center md:px-8 min-h-[70vh] rounded-b-xl bg-[linear-gradient(to_bottom,#000,#000_30%,#1a3a4a_78%,#37AFE1_100%)]"
    >
      {/* Grid BG */}
      <div className="absolute -z-10 inset-0 opacity-80 h-[420px] w-full bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:6rem_5rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Radial Accent Container */}
      <div className="absolute inset-x-0 bottom-0 h-[350px] lg:h-[525px] overflow-hidden">
        <div
          className="absolute left-1/2 bottom-[-280px] lg:bottom-[-420px] h-[350px] w-[490px] md:h-[350px] md:w-[770px] lg:h-[525px] lg:w-[980px] -translate-x-1/2 rounded-[100%] border border-[#37AFE1]/30 bg-[radial-gradient(closest-side_at_50%_50%,#000_82%,#37AFE1)]"
        />
      </div>

      {/* Content Container with Padding */}
      <div className="relative z-10 pt-12 pb-12">
        {/* Eyebrow */}
        {eyebrow && (
          <a href="#" className="group inline-block">
            <span className="text-sm text-gray-400 mx-auto px-5 py-2 bg-gradient-to-tr from-[#37AFE1]/10 via-gray-400/5 to-transparent border-[2px] border-[#37AFE1]/20 rounded-3xl w-fit tracking-tight uppercase flex items-center justify-center">
              {eyebrow}
              <ChevronRight className="inline w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </a>
        )}

        {/* Title with Animated Gradient */}
        <h1 
          className="animate-fade-in -translate-y-4 text-balance bg-clip-text py-6 text-4xl font-semibold leading-none tracking-tighter text-transparent opacity-0 sm:text-5xl md:text-6xl lg:text-6xl"
          style={{
            backgroundImage: 'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
            backgroundSize: '300% 100%',
            animation: 'gradient-shift 4s ease-in-out infinite, fade-in 0.6s ease-out forwards',
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in mb-12 -translate-y-4 text-balance text-lg tracking-tight text-gray-400 opacity-0 md:text-xl max-w-3xl mx-auto px-4">
          {subtitle}
        </p>

        {/* CTA */}
        {ctaLabel && (
          <div className="flex justify-center">
            <ParticleWrapper>
              <a href={ctaHref}>
                <StarButton
                  className="mt-[-20px] w-fit md:w-52 z-20 tracking-tighter text-center text-lg shadow-[0_0_30px_rgba(245,129,34,0.4)]"
                >
                  {ctaLabel}
                </StarButton>
              </a>
            </ParticleWrapper>
          </div>
        )}
      </div>

      {/* Bottom Fade */}
      <div className="animate-fade-up relative mt-20 opacity-0 [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_10%,transparent)]" />
    </section>
  );
}

export default Hero1;
