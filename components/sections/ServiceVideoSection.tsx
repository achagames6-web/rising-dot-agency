'use client';

import { motion } from 'framer-motion';
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
  ctaText?: string;
  ctaHref?: string;
}

export default function ServiceVideoSection({
  eyebrow = 'See It In Action',
  title = 'Watch How We',
  titleHighlight = 'Deliver',
  subtitle = 'Experience our process and see the results we achieve for our clients.',
  videoSrc,
  ctaText = 'Start Your Project',
  ctaHref = '/contact',
}: ServiceVideoSectionProps) {
  return (
    <ContainerScroll className="bg-black text-center text-white">
      <ContainerStagger viewport={{ once: false }}>
        <ContainerAnimated animation="top">
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
            <span className="text-sm font-medium text-white/80">✨ {eyebrow}</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </motion.div>
        </ContainerAnimated>
        <ContainerAnimated animation="bottom">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
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
        </ContainerAnimated>
        <ContainerAnimated animation="blur" className="my-4">
          <p className="text-lg sm:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">{subtitle}</p>
        </ContainerAnimated>
        <ContainerAnimated animation="blur" className="flex justify-center gap-4 mt-6">
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
        </ContainerAnimated>
      </ContainerStagger>
      <ContainerInset insetXRange={[30, 0]} className="mx-8">
        <video
          width="100%"
          height="100%"
          loop
          playsInline
          autoPlay
          muted
          className="relative z-10 block h-auto max-h-full max-w-full object-contain align-middle rounded-2xl"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </ContainerInset>
    </ContainerScroll>
  );
}
