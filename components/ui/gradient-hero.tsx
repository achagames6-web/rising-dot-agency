'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';

interface GradientHeroProps {
  badge?: string;
  title: string;
  titleHighlight?: string;
  description: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  image?: string;
  imageAlt?: string;
  video?: string;
  videoPoster?: string;
}

export function GradientHero({
  badge,
  title,
  titleHighlight,
  description,
  primaryCta,
  secondaryCta,
  image,
  imageAlt = 'Hero image',
  video,
  videoPoster,
}: GradientHeroProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Gradient background with blur effect */}
      <div className="flex flex-col items-end absolute -right-60 -top-10 blur-xl z-0">
        <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-[#37AFE1] to-[#31A4DB]"></div>
        <div className="h-[10rem] rounded-full w-[90rem] z-1 bg-gradient-to-b blur-[6rem] from-[#F58122] to-[#37AFE1]"></div>
        <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-[#31A4DB] to-[#F58122]"></div>
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 z-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]"></div>

      {/* Content container */}
      <div className="relative z-10 pt-32">
        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-fit items-center justify-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm border border-white/10"
          >
            <span className="text-sm font-medium text-white">{badge}</span>
            <ArrowRight className="h-4 w-4 text-[#37AFE1]" />
          </motion.div>
        )}

        {/* Hero section */}
        <div className="container mx-auto mt-8 px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-4xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl font-montserrat"
          >
            {titleHighlight ? (
              <>
                <span 
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
                    backgroundSize: '300% 100%',
                    animation: 'gradient-shift 4s ease-in-out infinite',
                  }}
                >
                  {titleHighlight}
                </span>{' '}
                {title}
              </>
            ) : (
              title
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 font-inter"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
          >
            {primaryCta && (
              <ParticleWrapper>
                <Link href={primaryCta.href}>
                  <StarButton
                    className="h-12 px-8 text-base font-medium hover:scale-105 transition-transform"
                    duration={2.5}
                  >
                    {primaryCta.text}
                  </StarButton>
                </Link>
              </ParticleWrapper>
            )}
            {secondaryCta && (
              <ParticleWrapper>
                <Link href={secondaryCta.href}>
                  <StarButton
                    variant="secondary"
                    className="h-12 px-8 text-base font-medium hover:scale-105 transition-transform"
                    duration={3}
                  >
                    {secondaryCta.text}
                  </StarButton>
                </Link>
              </ParticleWrapper>
            )}
          </motion.div>

          {/* Hero Image or Video */}
          {(image || video) && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative mx-auto my-16 w-full max-w-5xl"
            >
              <div className="absolute inset-0 rounded-2xl bg-[#37AFE1] blur-[8rem] opacity-20" />
              {video ? (
                <video
                  src={video}
                  poster={videoPoster || image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="relative w-full max-h-[550px] object-cover shadow-2xl rounded-2xl border border-white/10"
                />
              ) : (
                <img
                  src={image}
                  alt={imageAlt}
                  className="relative w-full max-h-[550px] object-cover shadow-2xl rounded-2xl border border-white/10"
                />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
