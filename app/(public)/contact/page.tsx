'use client';

import { motion } from 'framer-motion';
import ContactForm from '@/components/contact/ContactForm';
import ContactMap from '@/components/contact/ContactMap';
import MiniCTA from '@/components/sections/MiniCTA';
import { Hero1 } from '@/components/ui/hero-1';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

export default function ContactPage() {
  // Fetch CMS content for each section
  const { content: heroContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
  }>('contact', 'hero');

  const { content: formContent } = useSiteContent<{
    title?: string;
    titleHighlight?: string;
  }>('contact', 'form');

  const { content: infoContent } = useSiteContent<{
    title?: string;
    titleHighlight?: string;
    email?: string;
    phone?: string;
    address?: string;
    hours?: string;
  }>('contact', 'info');

  const { content: mapContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
  }>('contact', 'map');

  const { content: ctaContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  }>('contact', 'cta');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <Hero1
        eyebrow={heroContent?.eyebrow || "Let's Connect"}
        title={heroContent?.title || 'Get In Touch'}
        subtitle={heroContent?.subtitle || "Ready to start your next project? Let's create something amazing together. We're here to help bring your vision to life."}
        ctaLabel={heroContent?.ctaLabel || 'Send Message'}
        ctaHref={heroContent?.ctaHref || '#contact-form'}
      />

      <section id="contact-form" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-8"
            >
              {formContent?.title || 'Send Us a'}{' '}
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
                  backgroundSize: '300% 100%',
                  animation: 'gradient-shift 4s ease-in-out infinite',
                }}
              >
                {formContent?.titleHighlight || 'Message'}
              </span>
            </motion.h2>
            <ContactForm />
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-8"
            >
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #F58122, #37AFE1, #F58122, #37AFE1)',
                  backgroundSize: '300% 100%',
                  animation: 'gradient-shift 4s ease-in-out infinite',
                }}
              >
                {infoContent?.title || 'Contact'}
              </span>{' '}
              {infoContent?.titleHighlight || 'Information'}
            </motion.h2>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-start gap-4 p-6 rounded-lg bg-black border border-[#37AFE1]/20"
              >
                <div className="text-3xl">📧</div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Email</h3>
                  <p className="text-[#64748B]">{infoContent?.email || 'hello@risingdot.agency'}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-4 p-6 rounded-lg bg-black border border-[#37AFE1]/20"
              >
                <div className="text-3xl">📞</div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Phone</h3>
                  <p className="text-[#64748B]">{infoContent?.phone || '+1 (555) 123-4567'}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4 p-6 rounded-lg bg-black border border-[#37AFE1]/20"
              >
                <div className="text-3xl">📍</div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Office</h3>
                  <p className="text-[#64748B] whitespace-pre-line">
                    {infoContent?.address || '123 Innovation Street\nTech District, CA 94102'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-4 p-6 rounded-lg bg-black border border-[#37AFE1]/20"
              >
                <div className="text-3xl">🕐</div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Hours</h3>
                  <p className="text-[#64748B] whitespace-pre-line">
                    {infoContent?.hours || 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday - Sunday: Closed'}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow={mapContent?.eyebrow || 'Location'}
            title={mapContent?.title || 'Find'}
            titleHighlight={mapContent?.titleHighlight || 'Us'}
          />
          <ContactMap />
        </div>
      </section>

      {/* CTA Section with Social Links */}
      <MiniCTA
        eyebrow={ctaContent?.eyebrow || 'Explore Our Work'}
        title={ctaContent?.title || 'View Our'}
        titleHighlight={ctaContent?.titleHighlight || 'Portfolio'}
        subtitle={ctaContent?.subtitle || 'See how we\'ve helped businesses like yours achieve their goals.'}
        ctaText={ctaContent?.ctaText || 'View Portfolio'}
        ctaLink={ctaContent?.ctaLink || '/portfolio'}
      />
    </div>
  );
}
