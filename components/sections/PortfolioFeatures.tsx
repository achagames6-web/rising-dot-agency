'use client';

import { Cpu, Lock, Sparkles, Zap, Users, TrendingUp, Headphones, LucideIcon } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
  Zap,
  Cpu,
  Lock,
  Sparkles,
  Users,
  TrendingUp,
  Headphones,
};

// Interfaces for CMS data
interface Stat {
  value: string;
  label: string;
}

interface Feature {
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface AdvantagesContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  stats: Stat[];
  features: Feature[];
}

// Default fallback content
const defaultContent: AdvantagesContent = {
  eyebrow: 'Our Advantage',
  title: 'Why Clients',
  titleHighlight: 'Choose Us',
  subtitle: 'We deliver exceptional results through innovative solutions, cutting-edge technology, and a commitment to excellence in every project.',
  stats: [
    { value: '50+', label: 'Projects Delivered' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '24/7', label: 'Support Available' },
  ],
  features: [
    {
      title: 'Lightning Fast',
      description: 'Optimized performance with sub-second load times and smooth interactions.',
      icon: 'Zap',
      color: '#37AFE1',
    },
    {
      title: 'Powerful Tech',
      description: 'Built with cutting-edge technologies for scalability and reliability.',
      icon: 'Cpu',
      color: '#F58122',
    },
    {
      title: 'Secure & Safe',
      description: 'Enterprise-grade security with best practices and regular audits.',
      icon: 'Lock',
      color: '#37AFE1',
    },
    {
      title: 'AI Powered',
      description: 'Intelligent automation and AI integration for smarter solutions.',
      icon: 'Sparkles',
      color: '#F58122',
    },
  ],
};

export default function PortfolioFeatures() {
  const { content, loading } = useSiteContent<AdvantagesContent>('portfolio', 'advantages');
  
  // Use CMS content or fallback to default
  const advantagesData = content || defaultContent;
  const { eyebrow, title, titleHighlight, subtitle, stats, features } = advantagesData;

  return (
    <section className="py-16 md:py-32 bg-black">
      <div className="mx-auto max-w-5xl space-y-12 px-6">
        {/* Header */}
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
          subtitle={subtitle}
        />

        {/* Featured Image */}
        <div className="relative rounded-3xl p-3 md:-mx-8 lg:col-span-3 overflow-hidden">
          <div className="aspect-[88/36] relative">
            {/* Gradient overlay */}
            <div className="bg-gradient-to-t z-10 from-black absolute inset-0 to-transparent pointer-events-none"></div>

            {/* Main showcase image */}
            <img
              src="/media/portfolio/portfolio-features/showcase.jpg"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-80"
              alt="Portfolio showcase"
            />

            {/* Floating UI elements overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 p-8 max-w-3xl">
                {/* Stats cards - dynamically rendered from CMS */}
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className={`bg-black/60 backdrop-blur-lg rounded-xl p-4 border ${
                      index % 2 === 0 ? 'border-[#37AFE1]/20' : 'border-[#F58122]/20'
                    }`}
                  >
                    <p className={`text-3xl font-bold ${
                      index % 2 === 0 ? 'text-[#37AFE1]' : 'text-[#F58122]'
                    }`}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Zap;
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <IconComponent 
                      className="size-4" 
                      style={{ color: feature.color }}
                    />
                  </div>
                  <h3 className="text-sm font-medium text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
