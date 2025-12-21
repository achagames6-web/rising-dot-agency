'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  centered = true,
}: SectionHeadingProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 0.86, 0.39, 0.96] },
    },
  };

  return (
    <motion.div
      className={`mb-12 ${centered ? 'text-center' : ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {eyebrow && (
        <motion.div
          className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.15] backdrop-blur-sm mb-6 ${centered ? '' : ''}`}
          variants={fadeInUp}
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
      )}

      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight"
        variants={fadeInUp}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
          {title}
        </span>
        {titleHighlight && (
          <>
            {' '}
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
          </>
        )}
      </motion.h2>

      {subtitle && (
        <motion.p
          className={`text-lg sm:text-xl text-white/60 leading-relaxed ${centered ? 'max-w-3xl mx-auto' : 'max-w-3xl'}`}
          variants={fadeInUp}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
