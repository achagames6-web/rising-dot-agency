'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Quote, Star, ArrowLeft, ArrowRight, Sparkles, PenLine } from 'lucide-react';
import { useTestimonials, useSiteContent } from '@/lib/hooks/useSiteContent';
import SubmitTestimonialModal from '@/components/testimonials/SubmitTestimonialModal';
import { StarButton } from '@/components/ui/star-button';
import { ParticleWrapper } from '@/components/ui/particle-button';

const defaultTestimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO, TechFlow Solutions',
    company: 'TechFlow',
    avatar: '/media/home/testimonials/sarah-chen.jpg',
    rating: 5,
    text: "Rising Starter transformed our entire digital presence. We've seen a 300% increase in organic traffic and our conversion rates have never been better. The team's expertise is unmatched.",
    results: ['300% traffic increase', '45% conversion boost', '24/7 support'],
  },
  {
    name: 'Marcus Johnson',
    role: 'CTO, DataDrive Inc',
    company: 'DataDrive',
    avatar: '/media/home/testimonials/marcus-johnson.jpg',
    rating: 5,
    text: 'The AI chatbot solution is revolutionary. Our customer satisfaction increased by 40% while reducing response time from hours to seconds. Incredible ROI on our investment.',
    results: ['40% satisfaction boost', 'Instant responses', 'Seamless integration'],
  },
  {
    name: 'Elena Rodriguez',
    role: 'VP Operations, ScaleUp Co',
    company: 'ScaleUp',
    avatar: '/media/home/testimonials/elena-rodriguez.jpg',
    rating: 5,
    text: 'From N8N workflow automation to Shopify store optimization, Rising Starter handles everything. Our team can finally focus on strategy instead of repetitive tasks.',
    results: ['200+ hours saved', 'Full automation', 'Team productivity'],
  },
  {
    name: 'David Kim',
    role: 'Founder, GrowthLab',
    company: 'GrowthLab',
    avatar: '/media/home/testimonials/david-kim.jpg',
    rating: 5,
    text: 'The custom WordPress solution delivered results beyond our expectations. Revenue increased 150% while our site loads in under 2 seconds. Best investment we made.',
    results: ['150% revenue growth', '2s load time', 'Scalable systems'],
  },
  {
    name: 'Lisa Thompson',
    role: 'Director, InnovateCorp',
    company: 'InnovateCorp',
    avatar: '/media/home/testimonials/lisa-thompson.jpg',
    rating: 5,
    text: 'Exceptional SEO and web design that actually delivers results. The implementation was smooth, and we saw improvements within weeks. Highly recommend Rising Starter.',
    results: ['Page 1 rankings', 'Smooth integration', 'High ROI'],
  },
];

export function PremiumTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch CMS content
  const { content: sectionContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    stats?: { number: string; label: string }[];
  }>('home', 'testimonials');
  const { testimonials: cmsTestimonials } = useTestimonials();

  // Use CMS data or fallback to defaults
  const eyebrow = sectionContent?.eyebrow || '✨ Client Success Stories';
  const title = sectionContent?.title || 'Trusted by';
  const titleHighlight = sectionContent?.titleHighlight || 'Industry Leaders';
  const subtitle = sectionContent?.subtitle || 'Join businesses already transforming their digital presence with Rising Starter.';
  const stats = sectionContent?.stats || [
    { number: '500+', label: 'Happy Clients' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '$10M+', label: 'Revenue Generated' },
    { number: '99.9%', label: 'Uptime SLA' },
  ];
  const testimonials = cmsTestimonials.length > 0 ? cmsTestimonials : defaultTestimonials;

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
    }),
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.23, 0.86, 0.39, 0.96] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section
      id="testimonials"
      className="relative py-32 bg-transparent text-white overflow-hidden"
    >
      <motion.div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Header */}
        <motion.div className="text-center mb-20" variants={fadeInUp}>
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
            <span className="text-sm font-medium text-white/80">{eyebrow}</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 tracking-tight"
            variants={fadeInUp}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              {title}
            </span>
            <br />
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
          </motion.h2>

          <motion.p
            className="text-xl sm:text-2xl text-white/60 max-w-4xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-6xl mx-auto mb-16">
          <div className="relative h-[500px] md:h-[400px]" style={{ perspective: '1000px' }}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  rotateY: { duration: 0.6 },
                }}
                className="absolute inset-0"
              >
                <div className="relative h-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/[0.15] p-8 md:p-12 overflow-hidden group">
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-[#F58122]/[0.08] via-[#37AFE1]/[0.05] to-[#F58122]/[0.08] rounded-3xl"
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    style={{
                      backgroundSize: '300% 300%',
                    }}
                  />

                  {/* Quote icon */}
                  <motion.div
                    className="absolute top-8 right-8 opacity-20"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Quote className="w-16 h-16 text-[#F58122]" />
                  </motion.div>

                  <div className="relative z-10 h-full flex flex-col md:flex-row items-center gap-8">
                    {/* User Info */}
                    <div className="flex-shrink-0 text-center md:text-left">
                      <motion.div
                        className="relative mb-6"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-24 h-24 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-[#F58122]/30 relative">
                          <img
                            src={testimonials[currentIndex].avatar}
                            alt={testimonials[currentIndex].name}
                            className="w-full h-full object-cover"
                          />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-[#F58122]/20 to-[#37AFE1]/20"
                            animate={{ opacity: [0, 0.3, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                        </div>
                        {/* Floating ring animation */}
                        <motion.div
                          className="absolute inset-0 border-2 border-[#F58122]/30 rounded-full"
                          animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-white mb-2">
                        {testimonials[currentIndex].name}
                      </h3>
                      <p className="text-[#F58122] mb-1 font-medium">
                        {testimonials[currentIndex].role}
                      </p>
                      <p className="text-white/60 mb-4">{testimonials[currentIndex].company}</p>

                      {/* Star Rating */}
                      <div className="flex justify-center md:justify-start gap-1 mb-6">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1, duration: 0.3 }}
                          >
                            <Star className="w-5 h-5 fill-[#F58122] text-[#F58122]" />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <motion.blockquote
                        className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 font-light italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                      >
                        &ldquo;{testimonials[currentIndex].text}&rdquo;
                      </motion.blockquote>

                      {/* Results */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {(testimonials[currentIndex].results || []).map((result: string, i: number) => (
                          <motion.div
                            key={i}
                            className="bg-white/[0.05] rounded-lg p-3 border border-white/[0.1] backdrop-blur-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                            whileHover={{ backgroundColor: 'rgba(245, 129, 34, 0.1)' }}
                          >
                            <span className="text-sm text-white/70 font-medium">{result}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <motion.button
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-white/[0.08] border border-white/[0.15] backdrop-blur-sm text-white hover:bg-[#F58122]/20 transition-all"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(245, 129, 34, 0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>

            {/* Dots Indicator */}
            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-[#F58122] scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-white/[0.08] border border-white/[0.15] backdrop-blur-sm text-white hover:bg-[#F58122]/20 transition-all"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(245, 129, 34, 0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8" variants={staggerContainer}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F58122] to-[#37AFE1] bg-clip-text text-transparent mb-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-white/60 text-sm font-medium group-hover:text-white/80 transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Leave a Review Button */}
        <motion.div className="text-center mt-12" variants={fadeInUp}>
          <ParticleWrapper>
            <StarButton
              onClick={() => setShowSubmitModal(true)}
              className="h-12 px-8 text-base font-semibold hover:scale-105 transition-transform"
              duration={2.5}
            >
              <PenLine className="w-5 h-5" />
              Leave a Review
            </StarButton>
          </ParticleWrapper>
          <p className="text-white/50 text-sm mt-3">Share your experience working with us</p>
        </motion.div>
      </motion.div>

      {/* Submit Testimonial Modal */}
      <SubmitTestimonialModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
      />
    </section>
  );
}
