'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TagCloud from '@/components/portfolio/TagCloud';
import ProjectCard from '@/components/portfolio/ProjectCard';
import ProjectDetail from '@/components/portfolio/ProjectDetail';
import PortfolioFeatures from '@/components/sections/PortfolioFeatures';
import FeaturedProjectsCarousel from '@/components/sections/FeaturedProjectsCarousel';
import CaseStudiesCarousel from '@/components/sections/CaseStudiesCarousel';
import MiniCTA from '@/components/sections/MiniCTA';
import { ImageAccordionHero } from '@/components/ui/interactive-image-accordion';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

// Project interface for type safety
interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  images: string[];
  hotspots: { x: number; y: number; title: string; description: string }[];
}

// Default projects fallback (from original lib/data/portfolio-projects.ts)
const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform Redesign',
    client: 'TechStore Inc.',
    description:
      'Complete redesign of e-commerce platform with focus on conversion optimization and mobile experience.',
    thumbnailUrl: '/media/portfolio/all-projects/project-1/thumbnail.jpg',
    tags: ['Web Design', 'Shopify', 'SEO'],
    metrics: [
      { label: 'Conversion Rate', value: '+45%' },
      { label: 'Page Speed', value: '95/100' },
      { label: 'Mobile Traffic', value: '+60%' },
    ],
    images: [
      '/media/portfolio/all-projects/project-1/thumbnail.jpg',
      '/media/portfolio/all-projects/project-1/detail-1.jpg',
      '/media/portfolio/all-projects/project-1/detail-2.jpg',
    ],
    hotspots: [
      {
        x: 30,
        y: 40,
        title: 'Navigation',
        description: 'Simplified mega menu with visual categories',
      },
      {
        x: 70,
        y: 60,
        title: 'Product Grid',
        description: 'Optimized product cards with quick view',
      },
    ],
  },
  {
    id: '2',
    title: 'AI Chatbot Integration',
    client: 'Support Solutions',
    description:
      'Custom AI chatbot with natural language processing for customer support automation.',
    thumbnailUrl: '/media/portfolio/all-projects/project-2/thumbnail.jpg',
    tags: ['Chatbot Development', 'N8N Automations'],
    metrics: [
      { label: 'Response Time', value: '-80%' },
      { label: 'Customer Satisfaction', value: '4.8/5' },
      { label: 'Cost Savings', value: '$50K/year' },
    ],
    images: [
      '/media/portfolio/all-projects/project-2/thumbnail.jpg',
      '/media/portfolio/all-projects/project-2/detail-1.jpg',
      '/media/portfolio/all-projects/project-2/detail-2.jpg',
    ],
    hotspots: [
      {
        x: 50,
        y: 30,
        title: 'Chat Interface',
        description: 'Clean, intuitive chat UI',
      },
      {
        x: 50,
        y: 70,
        title: 'AI Engine',
        description: 'GPT-4 powered responses',
      },
    ],
  },
];

// Default tags fallback
const defaultTags = [
  'Web Design',
  'Shopify',
  'WordPress',
  'SEO',
  'Chatbot Development',
  'N8N Automations',
  'React',
  'Next.js',
  'Tailwind',
  'TypeScript',
  'Figma',
  'Stripe',
  'OpenAI',
  'Analytics',
  'SaaS',
  'AI/ML',
];

export default function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Fetch projects from the projects API
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Fetch CMS content for each section
  const { content: heroContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
    heroItems?: { id: number; title: string; imageUrl: string }[];
  }>('portfolio', 'hero');

  const { content: filtersContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    tags?: string[];
  }>('portfolio', 'filters');

  const { content: gridContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
  }>('portfolio', 'grid');

  const { content: ctaContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  }>('portfolio', 'cta');

  // Fetch all published projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          if (data.projects && data.projects.length > 0) {
            setProjects(data.projects);
          } else {
            // Use default projects if no published projects found
            setProjects(defaultProjects);
          }
        } else {
          // Use default projects on error
          setProjects(defaultProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Use default projects on error
        setProjects(defaultProjects);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);
  const allTags = filtersContent?.tags || defaultTags;

  // Default hero items
  const defaultHeroItems = [
    {
      id: 1,
      title: 'E-Commerce',
      imageUrl: '/media/portfolio/hero/ecommerce.jpg',
    },
    {
      id: 2,
      title: 'Web Design',
      imageUrl: '/media/portfolio/hero/web-design.jpg',
    },
    {
      id: 3,
      title: 'AI Chatbots',
      imageUrl: '/media/portfolio/hero/ai-chatbots.jpg',
    },
    {
      id: 4,
      title: 'Automation',
      imageUrl: '/media/portfolio/hero/automation.jpg',
    },
    { id: 5, title: 'SEO', imageUrl: '/media/portfolio/hero/seo.jpg' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Interactive Image Accordion Hero */}
      <ImageAccordionHero
        title={heroContent?.title || 'Our Creative'}
        titleHighlight={heroContent?.titleHighlight || 'Portfolio'}
        subtitle={
          heroContent?.subtitle ||
          'Explore our work across web design, e-commerce, automation, chatbots, and SEO. Each project showcases our commitment to excellence and innovation.'
        }
        ctaButton={{
          label: heroContent?.ctaLabel || 'Start Your Project',
          href: heroContent?.ctaHref || '/contact',
        }}
        items={heroContent?.heroItems || defaultHeroItems}
      />

      {/* Featured Projects Horizontal Scroll Carousel */}
      <FeaturedProjectsCarousel />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={filtersContent?.eyebrow || 'Our Expertise'}
            title={filtersContent?.title || 'Skills &'}
            titleHighlight={filtersContent?.titleHighlight || 'Technologies'}
            subtitle={
              filtersContent?.subtitle ||
              'Drag and explore the technologies we master to bring your vision to life'
            }
          />
          <TagCloud tags={filtersContent?.tags || allTags} />
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={gridContent?.eyebrow || 'Our Work'}
            title={gridContent?.title || 'All'}
            titleHighlight={gridContent?.titleHighlight || 'Projects'}
            subtitle={
              gridContent?.subtitle ||
              'Explore our complete collection of successful client projects'
            }
          />
          <motion.div
            layout
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Case Studies Carousel - fetch from portfolio/caseStudies */}
      <CaseStudiesCarousel page="portfolio" />

      {/* Features Section */}
      <PortfolioFeatures />

      {/* CTA Section */}
      <MiniCTA
        eyebrow={ctaContent?.eyebrow || 'Like What You See?'}
        title={ctaContent?.title || 'Start Your'}
        titleHighlight={ctaContent?.titleHighlight || 'Project'}
        subtitle={
          ctaContent?.subtitle ||
          "Let's create something extraordinary together. Get in touch today."
        }
        ctaText={ctaContent?.ctaText || 'Contact Us'}
        ctaLink={ctaContent?.ctaLink || '/contact'}
      />

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
