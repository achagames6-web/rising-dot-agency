"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { motion } from "framer-motion";
import { Sparkles, Zap, Palette, Code, MessageSquare, Workflow, TrendingUp } from "lucide-react";

export default function BentoGridSection() {
  return (
    <section className="relative bg-black py-16 overflow-hidden">
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
              ✨ Our Services
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
                "linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)",
              backgroundSize: "300% 100%",
              animation: "gradient-shift 4s ease-in-out infinite",
            }}
          >
            What We
          </span>{" "}
          <span className="text-white">Offer</span>
        </h2>

        <p className="text-center text-slate-400 mt-2 max-w-3xl mx-auto text-lg mb-12">
          Experience the power of cutting-edge technology combined with creative excellence
        </p>

        <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[20rem]">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={cn("[&>p:text-lg]", item.className)}
              icon={item.icon}
            />
          ))}
        </BentoGrid>
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

// Service-specific animated skeletons
const ChatbotSkeleton = () => {
  const variants = {
    initial: { x: 0 },
    animate: { x: 10, rotate: 5, transition: { duration: 0.2 } },
  };
  const variantsSecond = {
    initial: { x: 0 },
    animate: { x: -10, rotate: -5, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] flex-col space-y-2 bg-gradient-to-br from-[#37AFE1]/10 to-transparent rounded-lg p-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-[#37AFE1]/20 p-2 items-center space-x-2 bg-[#1E293B]"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#37AFE1] to-[#F58122] shrink-0" />
        <div className="w-full bg-slate-700 h-4 rounded-full" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-[#F58122]/20 p-2 items-center space-x-2 w-3/4 ml-auto bg-[#1E293B]"
      >
        <div className="w-full bg-slate-700 h-4 rounded-full" />
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#F58122] to-[#37AFE1] shrink-0" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-[#37AFE1]/20 p-2 items-center space-x-2 bg-[#1E293B]"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#37AFE1] to-[#F58122] shrink-0" />
        <div className="w-full bg-slate-700 h-4 rounded-full" />
      </motion.div>
    </motion.div>
  );
};

const AutomationSkeleton = () => {
  const variants = {
    initial: { width: 0 },
    animate: { width: "100%", transition: { duration: 0.2 } },
    hover: { width: ["0%", "100%"], transition: { duration: 2 } },
  };
  const arr = new Array(6).fill(0);
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] flex-col space-y-2 bg-gradient-to-br from-[#F58122]/10 to-transparent rounded-lg p-2"
    >
      {arr.map((_, i) => (
        <motion.div
          key={"automation" + i}
          variants={variants}
          style={{ maxWidth: Math.random() * (100 - 40) + 40 + "%" }}
          className="flex flex-row rounded-full border border-[#F58122]/20 p-2 items-center space-x-2 bg-[#1E293B] w-full h-4"
        ></motion.div>
      ))}
    </motion.div>
  );
};

const WebDesignSkeleton = () => {
  return (
    <motion.div
      initial={{ backgroundPosition: "0 50%" }}
      animate={{ backgroundPosition: ["0, 50%", "100% 50%", "0 50%"] }}
      transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      className="flex flex-1 w-full h-full min-h-[6rem] rounded-lg flex-col space-y-2"
      style={{
        background: "linear-gradient(-45deg, #37AFE1, #F58122, #37AFE1, #F58122)",
        backgroundSize: "400% 400%",
      }}
    >
      <motion.div className="h-full w-full rounded-lg"></motion.div>
    </motion.div>
  );
};

const SEOSkeleton = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-[#37AFE1]/10 to-transparent rounded-lg p-4 flex-col justify-center items-center space-y-3"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl"
      >
        📈
      </motion.div>
      <div className="text-center space-y-2">
        <div className="h-3 w-32 bg-slate-700 rounded-full mx-auto"></div>
        <div className="h-3 w-24 bg-slate-700 rounded-full mx-auto"></div>
      </div>
    </motion.div>
  );
};

const ShopifySkeleton = () => {
  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-[#F58122]/10 to-transparent rounded-lg p-4 items-center justify-center">
      <motion.div
        animate={{ rotateY: [0, 180, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-24 h-32 bg-gradient-to-br from-[#37AFE1] to-[#F58122] rounded-xl shadow-2xl flex items-center justify-center"
      >
        <span className="text-4xl">🛍️</span>
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "AI Chatbot Development",
    description: "Intelligent conversational AI that handles customer queries 24/7 with 95%+ accuracy",
    header: <ChatbotSkeleton />,
    className: "md:col-span-1",
    icon: <MessageSquare className="h-4 w-4 text-[#37AFE1]" />,
  },
  {
    title: "N8N Workflow Automation",
    description: "Streamline your business processes with powerful automation workflows",
    header: <AutomationSkeleton />,
    className: "md:col-span-1",
    icon: <Workflow className="h-4 w-4 text-[#F58122]" />,
  },
  {
    title: "Modern Web Design",
    description: "Stunning, responsive websites that convert visitors into customers",
    header: <WebDesignSkeleton />,
    className: "md:col-span-1",
    icon: <Palette className="h-4 w-4 text-[#37AFE1]" />,
  },
  {
    title: "SEO Optimization",
    description: "Rank higher on search engines and drive organic traffic to your site",
    header: <SEOSkeleton />,
    className: "md:col-span-2",
    icon: <TrendingUp className="h-4 w-4 text-[#F58122]" />,
  },
  {
    title: "Shopify Development",
    description: "Custom e-commerce solutions that boost sales and customer satisfaction",
    header: <ShopifySkeleton />,
    className: "md:col-span-1",
    icon: <Code className="h-4 w-4 text-[#37AFE1]" />,
  },
];
