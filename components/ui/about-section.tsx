"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { StarButton } from "@/components/ui/star-button";
import { ParticleWrapper } from "@/components/ui/particle-button";

export default function AboutSection() {
  return (
    <section className="relative bg-black py-20 overflow-hidden">
      {/* Background glow effect */}
      <div className="size-[520px] rounded-full absolute blur-[300px] -z-10 bg-[#FBFFE1]"></div>

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
              borderColor: "rgba(255, 255, 255, 0.3)",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-[#F58122]" />
            </motion.div>
            <span className="text-sm font-medium text-white/80">
              ✨ Who We Are
            </span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          </motion.div>
        </motion.div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mx-auto mb-4">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)",
              backgroundSize: "300% 100%",
              animation: "gradient-shift 4s ease-in-out infinite",
            }}
          >
            About
          </span>{" "}
          <span className="text-white">Us</span>
        </h1>

        {/* Description */}
        <p className="text-center text-slate-400 mt-2 max-w-3xl mx-auto text-lg mb-12">
          Ship Beautiful Frontends Without the Overhead — Customizable,
          Scalable and Developer-Friendly Solutions.
        </p>

        {/* Two Column Layout: Image + Features */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 px-4 md:px-0">
          {/* Left: Image */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              className="max-w-full w-full rounded-2xl h-auto shadow-2xl border border-white/10"
              src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830&h=844&auto=format&fit=crop"
              alt="Our workspace"
            />
          </motion.div>

          {/* Right: Features */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-slate-400 mb-8 text-base">
              We deliver cutting-edge digital solutions that transform
              businesses through innovation, quality, and excellence.
            </p>

            <div className="flex flex-col gap-8">
              {/* Feature 1 */}
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="size-12 p-2.5 bg-gradient-to-br from-[#37AFE1]/20 to-[#37AFE1]/5 border border-[#37AFE1]/30 rounded-xl flex items-center justify-center shrink-0">
                  <img
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/flashEmoji.png"
                    alt="Lightning fast"
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Lightning-Fast Performance
                  </h3>
                  <p className="text-sm text-slate-400">
                    Built with speed — minimal load times and optimized for
                    maximum performance.
                  </p>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="size-12 p-2.5 bg-gradient-to-br from-[#F58122]/20 to-[#F58122]/5 border border-[#F58122]/30 rounded-xl flex items-center justify-center shrink-0">
                  <img
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/colorsEmoji.png"
                    alt="Beautiful design"
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Beautifully Designed Solutions
                  </h3>
                  <p className="text-sm text-slate-400">
                    Modern, pixel-perfect UI components crafted for exceptional
                    user experiences.
                  </p>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="size-12 p-2.5 bg-gradient-to-br from-[#37AFE1]/20 to-[#37AFE1]/5 border border-[#37AFE1]/30 rounded-xl flex items-center justify-center shrink-0">
                  <img
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/puzzelEmoji.png"
                    alt="Integration"
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Seamless Integration
                  </h3>
                  <p className="text-sm text-slate-400">
                    Simple setup with support for React, Next.js and modern
                    tech stacks.
                  </p>
                </div>
              </motion.div>

              {/* Feature 4 */}
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="size-12 p-2.5 bg-gradient-to-br from-[#F58122]/20 to-[#F58122]/5 border border-[#F58122]/30 rounded-xl flex items-center justify-center shrink-0">
                  <img
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/brainEmoji.png"
                    alt="Accessibility"
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Innovation Driven
                  </h3>
                  <p className="text-sm text-slate-400">
                    Cutting-edge solutions powered by AI and modern
                    technologies.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.div
              className="mt-10"
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
