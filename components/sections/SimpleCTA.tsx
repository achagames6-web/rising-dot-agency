'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';
import { SocialLinks, defaultSocials } from '@/components/ui/social-links';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

export default function SimpleCTA() {
  // Fetch CMS content
  const { content: ctaContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    stats?: { number: string; label: string }[];
  }>('home', 'cta');

  // Use CMS data or fallback to defaults
  const eyebrow = ctaContent?.eyebrow || 'Ready to Start?';
  const title = ctaContent?.title || "Let's Build Something";
  const titleHighlight = ctaContent?.titleHighlight || 'Extraordinary';
  const subtitle =
    ctaContent?.subtitle ||
    "Transform your vision into reality with our expert team. We're ready to bring your ideas to life.";
  const ctaText = ctaContent?.ctaText || 'Get Started Today';
  const ctaLink = ctaContent?.ctaLink || '/contact';
  const secondaryCtaText = ctaContent?.secondaryCtaText || 'View Our Work';
  const secondaryCtaLink = ctaContent?.secondaryCtaLink || '/portfolio';
  const stats = ctaContent?.stats || [
    { number: '500+', label: 'Projects Completed' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '50+', label: 'Team Members' },
    { number: '24/7', label: 'Support Available' },
  ];

  return (
    <section className="relative bg-black py-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div
          className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full opacity-20 blur-[100px]"
          style={{
            background:
              'radial-gradient(circle, rgba(55, 175, 225, 0.5) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full opacity-20 blur-[100px]"
          style={{
            background:
              'radial-gradient(circle, rgba(245, 129, 34, 0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            titleHighlight={titleHighlight}
            subtitle={subtitle}
          />

          <div className="mb-12" />

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ParticleWrapper>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={ctaLink}>
                  <StarButton
                    className="h-12 px-6 text-sm font-semibold"
                    duration={2.5}
                  >
                    {ctaText}
                  </StarButton>
                </Link>
              </motion.div>
            </ParticleWrapper>

            <ParticleWrapper>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={secondaryCtaLink}>
                  <StarButton
                    variant="secondary"
                    className="h-12 px-6 text-sm font-semibold"
                    duration={3}
                  >
                    {secondaryCtaText}
                  </StarButton>
                </Link>
              </motion.div>
            </ParticleWrapper>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-2 text-3xl font-bold text-white md:text-4xl">
                  {stat.number}
                </div>
                <div className="text-sm text-[#64748B] md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16"
          >
            <p className="mb-4 text-sm text-[#64748B]">
              Follow us on social media
            </p>
            <SocialLinks socials={defaultSocials} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
