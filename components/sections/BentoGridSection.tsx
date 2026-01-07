'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  MessageSquare,
  Workflow,
  Palette,
  TrendingUp,
  Code,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Skeleton Components
const ChatbotSkeleton = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex h-full min-h-[6rem] w-full flex-1 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-[#37AFE1]/10 to-[#F58122]/10 p-4"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-5xl"
      >
        🤖
      </motion.div>
      <div className="mt-4 w-full space-y-2">
        <div className="mx-auto h-2 w-3/4 rounded-full bg-gradient-to-r from-[#37AFE1] to-[#F58122]"></div>
        <div className="mx-auto h-2 w-1/2 rounded-full bg-slate-700"></div>
      </div>
    </motion.div>
  );
};

const AutomationSkeleton = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex h-full min-h-[6rem] w-full flex-1 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-[#F58122]/10 to-[#37AFE1]/10 p-4"
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="text-5xl"
      >
        ⚙️
      </motion.div>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-2 w-8 rounded-full bg-[#F58122]"></div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-2 w-2 rounded-full bg-[#37AFE1]"
        ></motion.div>
        <div className="h-2 w-8 rounded-full bg-[#F58122]"></div>
      </div>
    </motion.div>
  );
};

const WebDesignSkeleton = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex h-full min-h-[6rem] w-full flex-1 flex-col items-center justify-center space-y-4 rounded-lg bg-gradient-to-br from-[#37AFE1]/10 to-[#F58122]/10 p-4"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-5xl"
      >
        🎨
      </motion.div>
      <div className="flex gap-2">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-8 w-8 rounded bg-[#37AFE1]"
        ></motion.div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          className="h-8 w-8 rounded bg-[#F58122]"
        ></motion.div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          className="h-8 w-8 rounded bg-[#37AFE1]"
        ></motion.div>
      </div>
    </motion.div>
  );
};

const WordPressSEOSkeleton = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex h-full min-h-[6rem] w-full flex-1 flex-col items-center justify-center space-y-4 rounded-lg bg-gradient-to-br from-[#37AFE1]/10 to-[#F58122]/10 p-4"
    >
      {/* WordPress + SEO Icons Grid */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-4xl">🌐</span>
        </motion.div>
        <motion.div
          animate={{ y: [5, -5, 5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        >
          <span className="text-4xl">📈</span>
        </motion.div>
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        >
          <span className="text-4xl">🔍</span>
        </motion.div>
      </div>

      {/* Bottom icons */}
      <div className="flex items-center justify-center gap-4">
        <motion.span
          className="text-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💼
        </motion.span>
        <motion.span
          className="text-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          ⚡
        </motion.span>
      </div>

      <div className="space-y-2 text-center">
        <div className="mx-auto h-2 w-32 rounded-full bg-gradient-to-r from-[#37AFE1] to-[#F58122]"></div>
        <div className="mx-auto h-2 w-24 rounded-full bg-slate-700"></div>
      </div>
    </motion.div>
  );
};

const ShopifySkeleton = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex h-full min-h-[6rem] w-full flex-1 flex-col items-center justify-center space-y-4 rounded-lg bg-gradient-to-br from-[#37AFE1]/10 to-[#F58122]/10 p-4"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-5xl"
      >
        🛒
      </motion.div>
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            className="h-2 w-2 rounded-full bg-[#37AFE1]"
          ></motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Bento Grid Item Component
const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <motion.div
      className={cn(
        'group/bento row-span-1 flex flex-col justify-between space-y-4 overflow-hidden rounded-xl border border-white/[0.1] bg-white/[0.02] shadow-input transition duration-200 hover:shadow-xl',
        className
      )}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {header}
      <div className="p-4 transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="mb-2 mt-2 font-sans font-bold text-neutral-200">
          {title}
        </div>
        <div className="font-sans text-xs font-normal text-neutral-400">
          {description}
        </div>
      </div>
    </motion.div>
  );
};

export default function BentoGridSection() {
  const items = [
    {
      title: 'Conversational AI',
      description:
        'Deploy intelligent chatbots that understand context, learn from interactions, and provide human-like responses',
      header: <ChatbotSkeleton />,
      className: 'md:col-span-1',
      icon: <MessageSquare className="h-4 w-4 text-[#37AFE1]" />,
    },
    {
      title: 'Business Automation',
      description:
        'Transform repetitive tasks into automated workflows that save time and reduce errors',
      header: <AutomationSkeleton />,
      className: 'md:col-span-1',
      icon: <Workflow className="h-4 w-4 text-[#F58122]" />,
    },
    {
      title: 'Creative Design',
      description:
        'Pixel-perfect interfaces that captivate users and convert visitors into loyal customers',
      header: <WebDesignSkeleton />,
      className: 'md:col-span-1',
      icon: <Palette className="h-4 w-4 text-[#37AFE1]" />,
    },
    {
      title: 'WordPress & SEO',
      description:
        'Powerful CMS solutions combined with search engine optimization to boost your online visibility',
      header: <WordPressSEOSkeleton />,
      className: 'md:col-span-2',
      icon: <TrendingUp className="h-4 w-4 text-[#F58122]" />,
    },
    {
      title: 'Online Stores',
      description:
        'Beautiful e-commerce experiences that drive sales and provide seamless shopping journeys',
      header: <ShopifySkeleton />,
      className: 'md:col-span-1',
      icon: <Code className="h-4 w-4 text-[#37AFE1]" />,
    },
  ];

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
              ✨ Featured Work
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
            Innovation
          </span>{' '}
          <span className="text-white">Showcase</span>
        </h2>

        <p className="mx-auto mb-12 mt-2 max-w-3xl text-center text-lg text-slate-400">
          Explore our cutting-edge solutions that combine powerful technology
          with exceptional user experiences
        </p>

        {/* Bento Grid */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={item.className}
            />
          ))}
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
