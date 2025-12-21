'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';
import { SectionHeading } from '@/components/ui/section-heading';
import { SocialLinks, defaultSocials } from '@/components/ui/social-links';

interface ServiceCTAProps {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  showSocials?: boolean;
}

export default function ServiceCTA({
  eyebrow = 'Ready to Start?',
  title = "Let's Work",
  titleHighlight = 'Together',
  subtitle = 'Have a project in mind? We would love to hear from you.',
  ctaText = 'Get in Touch',
  ctaLink = '/contact',
  showSocials = true,
}: ServiceCTAProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-transparent">

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center py-24">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10"
          >
            <ParticleWrapper>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={ctaLink}>
                  <StarButton
                    className="h-12 px-8 text-base font-semibold"
                    duration={2.5}
                  >
                    {ctaText}
                  </StarButton>
                </Link>
              </motion.div>
            </ParticleWrapper>
          </motion.div>

          {/* Social Links */}
          {showSocials && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16"
            >
              <p className="text-[#64748B] text-sm mb-4">Follow us on social media</p>
              <SocialLinks socials={defaultSocials} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
