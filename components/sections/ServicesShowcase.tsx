'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { StarButton } from '@/components/ui/star-button';
import { ParticleWrapper } from '@/components/ui/particle-button';

interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  link: string;
  color: string;
}

const services: Service[] = [
  {
    id: 1,
    icon: '⚡',
    title: 'N8N Automations',
    description:
      'Streamline workflows with powerful automation solutions. Connect apps, automate tasks, and save countless hours.',
    image: '/media/home/featured-services/n8n-automations.jpg',
    features: ['Custom workflows', 'API integrations', 'Real-time monitoring'],
    link: '/services/n8n-automations',
    color: 'from-[#37AFE1] to-[#31A4DB]',
  },
  {
    id: 2,
    icon: '🤖',
    title: 'Chatbot Development',
    description:
      'AI-powered conversational interfaces that engage users and provide instant support 24/7.',
    image: '/media/home/featured-services/chatbot-development.jpg',
    features: [
      'Natural language processing',
      'Multi-platform support',
      'Custom training',
    ],
    link: '/services/chatbot-development',
    color: 'from-[#F58122] to-[#FF9E5C]',
  },
  {
    id: 3,
    icon: '🎨',
    title: 'Web Design',
    description:
      'Beautiful, responsive websites that captivate visitors and drive conversions.',
    image: '/media/home/featured-services/web-design.jpg',
    features: ['Responsive design', 'UI/UX optimization', 'Brand identity'],
    link: '/services/web-design',
    color: 'from-[#37AFE1] to-[#F58122]',
  },
  {
    id: 4,
    icon: '🔍',
    title: 'SEO Services',
    description:
      'Boost your visibility and rank higher in search results with data-driven SEO strategies.',
    image: '/media/home/featured-services/seo.jpg',
    features: ['Keyword research', 'On-page optimization', 'Link building'],
    link: '/services/seo',
    color: 'from-[#31A4DB] to-[#37AFE1]',
  },
  {
    id: 5,
    icon: '🛍️',
    title: 'Shopify Development',
    description:
      'Powerful e-commerce solutions that turn visitors into customers and boost sales.',
    image: '/media/home/featured-services/shopify.jpg',
    features: ['Custom themes', 'App integration', 'Conversion optimization'],
    link: '/services/shopify',
    color: 'from-[#F58122] to-[#37AFE1]',
  },
  {
    id: 6,
    icon: '📝',
    title: 'WordPress Development',
    description:
      'Enterprise-grade WordPress solutions with custom themes, plugins, and optimization.',
    image: '/media/home/featured-services/wordpress.jpg',
    features: [
      'Custom plugins',
      'Performance optimization',
      'Security hardening',
    ],
    link: '/services/wordpress',
    color: 'from-[#37AFE1] to-[#F58122]',
  },
];

export default function ServicesShowcase() {
  return (
    <section className="bg-black py-20">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Animated Badge - Matches testimonials/case studies pattern */}
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
              What We Offer
            </span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          </motion.div>
        </motion.div>

        {/* Section Heading with Gradient Animation */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            <span className="text-white">Premium </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
                backgroundSize: '300% 100%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }}
            >
              Digital Services
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-400">
            Comprehensive solutions tailored to elevate your digital presence
            and drive measurable results
          </p>
        </motion.div>

        {/* Bento Grid Layout - 2 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {/* Gradient Glow Effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${service.color} rounded-2xl opacity-20 blur transition duration-500 group-hover:opacity-60`}
              />

              {/* Card Content */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-sm">
                {/* Image Container with Overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Icon Badge on Image */}
                  <div className="absolute left-4 top-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-black/50 text-2xl backdrop-blur-md">
                      {service.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title with Gradient Animation */}
                  <h3
                    className="mb-3 bg-clip-text text-2xl font-bold text-transparent"
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
                      backgroundSize: '200% 100%',
                      animation: 'gradient-shift 3s ease-in-out infinite',
                    }}
                  >
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 line-clamp-2 text-gray-400">
                    {service.description}
                  </p>

                  {/* Features Pills */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {service.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA with StarButton */}
                  <Link href={service.link}>
                    <ParticleWrapper>
                      <StarButton
                        className="group h-11 w-full text-sm font-semibold"
                        duration={2.5}
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </StarButton>
                    </ParticleWrapper>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
