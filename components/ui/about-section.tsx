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

        {/* Two Column Layout: Image + Features - REDUCED HEIGHT */}
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-center gap-8 px-4 md:flex-row md:px-0">
          {/* Left: Image - REDUCED HEIGHT */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              className="w-full max-w-full rounded-2xl border border-white/10 object-cover shadow-2xl"
              style={{ maxHeight: '400px' }}
              src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830&h=400&auto=format&fit=crop"
              alt="Rising Dot Agency workspace"
            />
          </motion.div>

          {/* Right: Features - REDUCED HEIGHT */}
          <div className="w-full md:w-1/2">
            <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
              Our Core Values
            </h2>
            <p className="mb-6 text-sm text-slate-400">
              We deliver cutting-edge digital solutions that transform
              businesses through innovation, quality, and excellence.
            </p>

            <div className="flex flex-col gap-6">
              {/* Feature 1 - N8N Automations */}
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#EA4B71]/30 bg-gradient-to-br from-[#EA4B71]/20 to-[#EA4B71]/5 p-2.5">
                  <span className="text-2xl">⚙️</span>
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-white">
                    Workflow Automation
                  </h3>
                  <p className="text-sm text-slate-400">
                    N8N-powered automations that streamline your business
                    processes and save hours of manual work.
                  </p>
                </div>
              </motion.div>

              {/* Feature 2 - AI Chatbots */}
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#37AFE1]/30 bg-gradient-to-br from-[#37AFE1]/20 to-[#37AFE1]/5 p-2.5">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-white">
                    Intelligent Chatbots
                  </h3>
                  <p className="text-sm text-slate-400">
                    AI-powered chatbots that handle customer queries 24/7 with
                    95%+ accuracy and satisfaction.
                  </p>
                </div>
              </motion.div>

              {/* Feature 3 - Web Design */}
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#F58122]/30 bg-gradient-to-br from-[#F58122]/20 to-[#F58122]/5 p-2.5">
                  <span className="text-2xl">🎨</span>
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-white">
                    Modern Web Design
                  </h3>
                  <p className="text-sm text-slate-400">
                    Stunning, responsive websites built with Next.js, React, and
                    Tailwind CSS for maximum performance.
                  </p>
                </div>
              </motion.div>

              {/* Feature 4 - E-commerce */}
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#37AFE1]/30 bg-gradient-to-br from-[#37AFE1]/20 to-[#37AFE1]/5 p-2.5">
                  <span className="text-2xl">🛒</span>
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-white">
                    E-Commerce Solutions
                  </h3>
                  <p className="text-sm text-slate-400">
                    Custom Shopify and WordPress WooCommerce stores that drive
                    sales and delight customers.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* CTA Button - REDUCED MARGIN */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
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
        </div>
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
