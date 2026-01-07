'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import {
  ContainerAnimated,
  ContainerInset,
  ContainerScroll,
  ContainerStagger,
} from '@/components/ui/hero-video';
import { StarButton } from '@/components/ui/star-button';
import Link from 'next/link';

interface ServiceVideoSectionProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  videoSrc: string;
  posterSrc?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function ServiceVideoSection({
  eyebrow = 'See It In Action',
  title = 'Watch How We',
  titleHighlight = 'Deliver',
  subtitle = 'Experience our process and see the results we achieve for our clients.',
  videoSrc,
  posterSrc,
  ctaText = 'Start Your Project',
  ctaHref = '/contact',
}: ServiceVideoSectionProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const handleVideoLoad = useCallback(() => {
    setVideoLoaded(true);
    setVideoError(false);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoError(true);
    setVideoLoaded(true);
  }, []);

  return (
    <ContainerScroll className="bg-black text-center text-white">
      <ContainerStagger viewport={{ once: false }}>
        <ContainerAnimated animation="top">
          <motion.div
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 backdrop-blur-sm"
            whileHover={{
              scale: 1.05,
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-4 w-4 text-[#F58122]" />
            </motion.div>
            <span className="text-sm font-medium text-white/80">
              ✨ {eyebrow}
            </span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          </motion.div>
        </ContainerAnimated>
        <ContainerAnimated animation="bottom">
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {title}
            </span>{' '}
            <motion.span
              className="bg-gradient-to-r from-[#F58122] via-[#37AFE1] to-[#F58122] bg-clip-text text-transparent"
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
        </ContainerAnimated>
        <ContainerAnimated animation="blur" className="my-4">
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/60 sm:text-xl">
            {subtitle}
          </p>
        </ContainerAnimated>
        <ContainerAnimated
          animation="blur"
          className="mt-6 flex justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href={ctaHref}>
              <StarButton
                className="h-12 px-6 text-base font-semibold"
                duration={2.5}
              >
                {ctaText}
              </StarButton>
            </Link>
          </motion.div>
        </ContainerAnimated>
      </ContainerStagger>
      <ContainerInset insetXRange={[30, 0]} className="mx-8">
        <div className="relative">
          {/* Loading skeleton */}
          <AnimatePresence>
            {!videoLoaded && !videoError && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e]"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#37AFE1]/30 border-t-[#37AFE1]" />
                  <p className="text-sm text-white/60">Loading video...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error fallback */}
          {videoError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex aspect-video items-center justify-center rounded-2xl border border-[#37AFE1]/20 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e]"
            >
              <div className="text-center">
                <p className="mb-2 text-lg font-semibold text-white">
                  Video temporarily unavailable
                </p>
                <p className="text-sm text-white/60">
                  Please check back later or contact us for a demo
                </p>
              </div>
            </motion.div>
          )}

          {/* Video element */}
          {!videoError && (
            <motion.video
              initial={{ opacity: 0 }}
              animate={{ opacity: videoLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              width="100%"
              height="100%"
              loop
              playsInline
              autoPlay
              muted
              preload="metadata"
              poster={posterSrc}
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              className="relative z-10 block h-auto max-h-full max-w-full rounded-2xl object-contain align-middle"
            >
              <source src={videoSrc} type="video/mp4" />
              <source
                src={videoSrc.replace('.mp4', '.webm')}
                type="video/webm"
              />
              Your browser doesn&apos;t support video playback.
            </motion.video>
          )}
        </div>
      </ContainerInset>
    </ContainerScroll>
  );
}
