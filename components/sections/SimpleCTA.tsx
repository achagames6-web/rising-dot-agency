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
  const subtitle = ctaContent?.subtitle || "Transform your vision into reality with our expert team. We're ready to bring your ideas to life.";
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(55, 175, 225, 0.5) 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(245, 129, 34, 0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
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

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-[#64748B] text-sm md:text-base">
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
            <p className="text-[#64748B] text-sm mb-4">Follow us on social media</p>
            <SocialLinks socials={defaultSocials} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
