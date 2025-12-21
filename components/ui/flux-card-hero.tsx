'use client';

import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';

// Export CardConfig interface for CMS integration
export interface CardConfig {
  bgColor: string;
  content: {
    type?: 'analytics' | 'projects' | 'chat-history';
    greeting?: string;
    subtitle?: string;
    title?: string;
  };
}

interface FluxCardHeroProps {
  title?: React.ReactNode;
  subtitle?: string;
  ctaButton?: {
    label: string;
    href: string;
  };
  cards?: CardConfig[];
}

// Default card configurations - used as fallback when CMS content is not available
const defaultCardConfigs: CardConfig[] = [
  {
    bgColor: 'bg-[#37AFE1]',
    content: {
      greeting: 'Automate your workflows with N8N',
      subtitle: 'Connect apps and services seamlessly',
    },
  },
  {
    bgColor: 'bg-[#31A4DB]',
    content: {
      type: 'analytics',
      greeting: 'Performance Analytics',
      subtitle: 'Automation Usage This Month',
    },
  },
  {
    bgColor: 'bg-[#F58122]',
    content: {
      type: 'projects',
      title: 'Active Workflows',
      subtitle: 'Your Automation Pipelines',
    },
  },
  {
    bgColor: 'bg-[#37AFE1]',
    content: {
      type: 'chat-history',
    },
  },
];

export function FluxCardHero({
  title = (
    <>
      Automation Reimagined,
      <br />
      Efficiency Amplified
    </>
  ),
  subtitle = 'Transform manual workflows into intelligent automation systems that save time and reduce errors.',
  ctaButton = {
    label: 'Get Started',
    href: '/contact',
  },
  cards,
}: FluxCardHeroProps) {
  const [currentCard, setCurrentCard] = useState(0);

  // Use CMS cards with fallback to default cardConfigs
  // Requirements: 1.1, 1.3 - Accept cards from CMS with fallback to defaults
  const activeCards = cards && cards.length > 0 ? cards : defaultCardConfigs;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % activeCards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeCards.length]);

  const currentConfig = activeCards[currentCard];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Gradient Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(55, 175, 225, 0.1) 0%, transparent 60%)',
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-32 pb-16 max-w-7xl mx-auto min-h-screen">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-6 bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #ffffff, #37AFE1, #F58122, #37AFE1, #ffffff)',
              backgroundSize: '300% 100%',
              animation: 'gradient-shift 4s ease-in-out infinite',
            }}
          >
            {title}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* CTA Button */}
        <ParticleWrapper className="mb-16">
          <Link href={ctaButton.href}>
            <StarButton
              className="h-12 px-6 text-sm font-semibold hover:scale-105 transition-transform group"
              duration={2.5}
            >
              {ctaButton.label}
              <Zap className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </StarButton>
          </Link>
        </ParticleWrapper>

        {/* Animated Layered Cards Interface */}
        <div className="relative w-full max-w-3xl mx-auto">
          {/* Background Cards */}
          <div className="absolute inset-0 transform rotate-3 scale-95 transition-all duration-1000 ease-in-out">
            <div
              className={`w-full h-72 bg-[#F58122]/60 rounded-3xl shadow-2xl opacity-50 transition-all duration-1000 ${
                currentCard === 1 ? 'scale-105 opacity-70' : ''
              }`}
            />
          </div>
          <div className="absolute inset-0 transform -rotate-2 scale-96 transition-all duration-1000 ease-in-out delay-300">
            <div
              className={`w-full h-76 bg-[#37AFE1]/60 rounded-3xl shadow-2xl opacity-60 transition-all duration-1000 ${
                currentCard === 2 ? 'scale-105 opacity-80' : ''
              }`}
            />
          </div>
          <div className="absolute inset-0 transform rotate-1 scale-97 transition-all duration-1000 ease-in-out delay-500">
            <div
              className={`w-full h-72 bg-[#31A4DB]/50 rounded-3xl shadow-2xl opacity-50 transition-all duration-1000 ${
                currentCard === 3 ? 'scale-105 opacity-70' : ''
              }`}
            />
          </div>
          <div className="absolute inset-0 transform -rotate-1 scale-98 transition-all duration-1000 ease-in-out delay-700">
            <div
              className={`w-full h-72 bg-[#F58122]/40 rounded-3xl shadow-2xl opacity-40 transition-all duration-1000 ${
                currentCard === 0 ? 'scale-105 opacity-60' : ''
              }`}
            />
          </div>

          {/* Main Animated Card */}
          <div
            className={`relative z-10 w-full h-80 ${currentConfig.bgColor} rounded-3xl shadow-2xl p-6 flex flex-col transition-all duration-1000 ease-in-out transform hover:scale-[1.02]`}
          >
            {/* Card Interface */}
            <div className="bg-white/25 backdrop-blur-sm rounded-2xl p-5 flex-1 transition-all duration-500">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <span className="text-xs text-black/70 font-medium bg-white/30 px-2 py-1 rounded-full">
                  N8N Workflow
                </span>
              </div>

              {/* Card Content */}
              <div className="space-y-4">
                {currentConfig.content.type === 'chat-history' ? (
                  <WorkflowHistory />
                ) : currentConfig.content.type === 'projects' ? (
                  <WorkflowDiagram />
                ) : currentConfig.content.type === 'analytics' ? (
                  <UsageAnalytics />
                ) : (
                  <DefaultContent config={currentConfig} />
                )}
              </div>
            </div>
          </div>

          {/* Card Indicators - Requirements: 1.4 - Indicator dots match card count */}
          <div className="flex justify-center space-x-2 mt-8">
            {activeCards.map((_, index) => (
              <ParticleWrapper key={index}>
                <button
                  onClick={() => setCurrentCard(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentCard === index
                      ? 'bg-[#37AFE1] scale-125'
                      : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                />
              </ParticleWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


// Sub-components for card content
function WorkflowHistory() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black/90">Recent Workflows</h3>
        <div className="w-12 h-1 bg-white/60 rounded-full" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-white/30 rounded-xl hover:bg-white/40 transition-all duration-200 cursor-pointer">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-black/90">Email Automation</div>
            <div className="text-xs text-black/60">12 min ago</div>
          </div>
          <div className="text-xs text-black/60 bg-white/40 px-2 py-1 rounded-full">Active</div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-white/30 rounded-xl hover:bg-white/40 transition-all duration-200 cursor-pointer">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-black/90">Data Sync</div>
            <div className="text-xs text-black/60">1 hour ago</div>
          </div>
          <div className="text-xs text-black/60 bg-white/40 px-2 py-1 rounded-full">Completed</div>
        </div>
      </div>
    </>
  );
}

function WorkflowDiagram() {
  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold text-black/90">N8N Workflow</h3>
        <div className="w-12 h-1 bg-white/60 rounded-full" />
      </div>
      <div className="bg-white/20 rounded-xl p-3 mb-2">
        <div className="flex justify-between items-center">
          <div className="text-xs text-black/60 bg-white/40 px-2 py-1 rounded-full">Demo Workflow</div>
          <div className="text-xs text-green-600 font-medium">Running</div>
        </div>
        <div className="mt-4 relative">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-[#37AFE1] flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs text-black/80">Webhook</div>
            </div>
            <div className="flex-1 h-0.5 bg-white/30 mx-2 relative">
              <div className="absolute -top-1 right-0 w-3 h-3 rounded-full bg-[#37AFE1] animate-ping" />
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-[#F58122] flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs text-black/80">Process</div>
            </div>
            <div className="flex-1 h-0.5 bg-white/30 mx-2 relative">
              <div className="absolute -top-1 right-0 w-3 h-3 rounded-full bg-[#F58122] animate-ping" />
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs text-black/80">Output</div>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex justify-between text-xs">
            <div className="text-black/60">Last run:</div>
            <div className="font-medium text-black/90">2 min ago</div>
          </div>
        </div>
      </div>
    </>
  );
}

function UsageAnalytics() {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-black/90">Usage Analytics</h3>
        <div className="w-12 h-1 bg-white/60 rounded-full" />
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-black/90">Workflows executed today</span>
            <span className="text-sm text-black/70">142 / 500</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-[#37AFE1] to-[#F58122] h-2.5 rounded-full"
              style={{ width: '28%' }}
            />
          </div>
          <div className="mt-1 text-xs text-black/60">28% of daily quota</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 rounded-xl p-3">
            <div className="text-xs text-black/60 mb-1">Time Saved</div>
            <div className="text-xl font-bold text-black/90">48hrs</div>
            <div className="text-xs text-green-600 mt-1">This month</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <div className="text-xs text-black/60 mb-1">Success Rate</div>
            <div className="text-xl font-bold text-black/90">99.2%</div>
            <div className="text-xs text-[#37AFE1] mt-1">Excellent</div>
          </div>
        </div>
      </div>
    </>
  );
}

function DefaultContent({ config }: { config: CardConfig }) {
  return (
    <>
      <div className="text-black/80 transition-all duration-500 transform">
        <span className="text-lg font-medium">{config.content.greeting}</span>
      </div>
      <div className="text-sm text-black/60 font-light transition-all duration-500">
        {config.content.subtitle}
      </div>
    </>
  );
}

export default FluxCardHero;
