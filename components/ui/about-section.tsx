'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { StarButton } from '@/components/ui/star-button';
import { ParticleWrapper } from '@/components/ui/particle-button';

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-black py-20">
      {/* Background glow effect */}
      <div className="absolute -top-80 left-1/2 -z-10 size-[520px] -translate-x-1/2 rounded-full bg-[#FBFFE1] blur-[300px]"></div>

      <div className="container mx-auto max-w-7xl px-6">
        {/* Animated Badge */}
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 rounded-full border border-white/[0.15] bg-white/[0.08] px-5 py-2 backdrop-blur-sm"
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
              ✨ Who We Are
            </span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          </motion.div>
        </motion.div>

        {/* Gradient Animated Heading */}
        <h2 className="mb-4 text-center text-4xl font-bold md:text-5xl">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
              backgroundSize: '300% 100%',
              animation: 'gradient-shift 4s ease-in-out infinite',
            }}
          >
            About Our
          </span>{' '}
          <span className="text-white">Agency</span>
        </h2>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-slate-400">
          A visual collection of our most recent works - each piece crafted with
          intention, emotion and style.
        </p>

        {/* Features Grid */}
        <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-12 px-8 pt-16 md:grid-cols-2 md:px-0 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex size-12 items-center justify-center rounded-xl border border-[#37AFE1]/30 bg-gradient-to-br from-[#37AFE1]/20 to-[#37AFE1]/5 p-2.5">
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/flashEmoji.png"
                alt="Lightning fast"
                className="h-6 w-6"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="mt-5 space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Lightning-Fast Performance
              </h3>
              <p className="text-sm text-slate-400">
                Built with speed — minimal load times and optimized for
                performance.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex size-12 items-center justify-center rounded-xl border border-[#F58122]/30 bg-gradient-to-br from-[#F58122]/20 to-[#F58122]/5 p-2.5">
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/colorsEmoji.png"
                alt="Beautiful design"
                className="h-6 w-6"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="mt-5 space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Beautifully Designed Solutions
              </h3>
              <p className="text-sm text-slate-400">
                Modern, pixel-perfect UI components ready for any project.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex size-12 items-center justify-center rounded-xl border border-[#37AFE1]/30 bg-gradient-to-br from-[#37AFE1]/20 to-[#37AFE1]/5 p-2.5">
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/puzzleEmoji.png"
                alt="Integration"
                className="h-6 w-6"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="mt-5 space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Plug-and-Play Integration
              </h3>
              <p className="text-sm text-slate-400">
                Simple setup with support for React, Next.js and modern tech
                stacks.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex size-12 items-center justify-center rounded-xl border border-[#F58122]/30 bg-gradient-to-br from-[#F58122]/20 to-[#F58122]/5 p-2.5">
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/bookEmoji.png"
                alt="Documentation"
                className="h-6 w-6"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="mt-5 space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Clear & Comprehensive
              </h3>
              <p className="text-sm text-slate-400">
                Get started fast with usage examples, live previews and code.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex size-12 items-center justify-center rounded-xl border border-[#37AFE1]/30 bg-gradient-to-br from-[#37AFE1]/20 to-[#37AFE1]/5 p-2.5">
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/boxEmoji.png"
                alt="Customizable"
                className="h-6 w-6"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="mt-5 space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Fully Customizable
              </h3>
              <p className="text-sm text-slate-400">
                Easily adapt styles, colors and layout to match your brand.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex size-12 items-center justify-center rounded-xl border border-[#F58122]/30 bg-gradient-to-br from-[#F58122]/20 to-[#F58122]/5 p-2.5">
              <img
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/brainEmoji.png"
                alt="Accessibility"
                className="h-6 w-6"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="mt-5 space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Accessibility First
              </h3>
              <p className="text-sm text-slate-400">
                Built with WCAG standards to ensure inclusive experiences.
              </p>
            </div>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          <ParticleWrapper>
            <Link href="/about">
              <StarButton
                className="h-12 px-8 text-base font-semibold"
                duration={2.5}
              >
                Learn More About Us
              </StarButton>
            </Link>
          </ParticleWrapper>
        </motion.div>
      </div>

      {/* Add gradient-shift animation */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </section>
  );
}
