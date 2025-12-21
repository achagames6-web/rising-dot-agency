'use client';

import { useState, useEffect } from 'react';
import {
  ScrollXCarousel,
  ScrollXCarouselContainer,
  ScrollXCarouselProgress,
  ScrollXCarouselWrap,
} from '@/components/ui/scroll-x-carousel';
import {
  CardHoverReveal,
  CardHoverRevealContent,
  CardHoverRevealMain,
} from '@/components/ui/reveal-on-hover';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { Project } from '@/lib/db/models';

// Interface for featured slide data
interface FeaturedSlide {
  id: string;
  title: string;
  description: string;
  services: string[];
  type: string;
  imageUrl: string;
}

// Interface for featured work section content
interface FeaturedWorkContent {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  slides?: FeaturedSlide[];
}

// Default slides as fallback when CMS data is unavailable
const DEFAULT_SLIDES: FeaturedSlide[] = [
  {
    id: 'slide-1',
    title: 'E-Commerce Platform',
    description:
      'We built a complete e-commerce solution with focus on conversion optimization and seamless checkout experience.',
    services: ['shopify', 'web design', 'seo'],
    type: 'E-Commerce',
    imageUrl: '/media/portfolio/featured-projects/ecommerce-platform.jpg',
  },
  {
    id: 'slide-2',
    title: 'AI Chatbot Integration',
    description:
      'Custom AI-powered chatbot with natural language processing for 24/7 customer support automation.',
    services: ['chatbot', 'n8n automation', 'ai'],
    type: 'Automation',
    imageUrl: '/media/portfolio/featured-projects/ai-chatbot.jpg',
  },
  {
    id: 'slide-3',
    title: 'SaaS Dashboard',
    description:
      'Modern SaaS platform with real-time analytics, user management, and seamless integrations.',
    services: ['web design', 'development', 'saas'],
    type: 'SaaS',
    imageUrl: '/media/portfolio/featured-projects/saas-dashboard.jpg',
  },
  {
    id: 'slide-4',
    title: 'WordPress Blog Platform',
    description:
      'High-performance WordPress site with custom theme, advanced SEO, and blazing fast load times.',
    services: ['wordpress', 'seo', 'web design'],
    type: 'CMS',
    imageUrl: '/media/portfolio/featured-projects/wordpress-blog.jpg',
  },
  {
    id: 'slide-5',
    title: 'N8N Workflow Automation',
    description:
      'Complex automation workflows connecting CRM, email, and inventory systems for seamless operations.',
    services: ['n8n automation', 'integration'],
    type: 'Automation',
    imageUrl: '/media/portfolio/featured-projects/n8n-workflow.jpg',
  },
  {
    id: 'slide-6',
    title: 'SEO Campaign Success',
    description:
      'Comprehensive SEO strategy that increased organic traffic by 250% and achieved top rankings.',
    services: ['seo', 'content', 'analytics'],
    type: 'Marketing',
    imageUrl: '/media/portfolio/featured-projects/seo-campaign.jpg',
  },
];

// Default section headings
const DEFAULT_HEADINGS = {
  eyebrow: 'Featured Work',
  title: 'Projects That',
  titleHighlight: 'Deliver Results',
  subtitle:
    'Scroll to explore our latest projects and see how we help businesses grow.',
};

/**
 * Hook to fetch projects from the API
 */
function useProjects(featured: boolean = true) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Try to fetch featured projects first
        const featuredUrl = '/api/projects?featured=true';
        let response = await fetch(featuredUrl);

        if (response.ok) {
          const data = await response.json();
          if (data.projects && data.projects.length > 0) {
            setProjects(data.projects);
            setLoading(false);
            return;
          }
        }

        // If no featured projects, fetch all published projects
        const allUrl = '/api/projects';
        response = await fetch(allUrl);

        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects || []);
        } else {
          throw new Error('Failed to fetch projects');
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setProjects([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [featured]);

  return { projects, loading, error };
}

/**
 * Map Project from database model to FeaturedSlide format
 */
function mapProjectToSlide(project: Project): FeaturedSlide {
  return {
    id: project.slug || project._id?.toString() || '',
    title: project.title,
    description: project.description,
    services: project.tags || [],
    type: project.tags && project.tags.length > 0 ? project.tags[0] : 'Project',
    imageUrl: project.thumbnail || '/media/portfolio/placeholder.jpg',
  };
}

export default function FeaturedProjectsCarousel() {
  // Fetch featuredWork section data from CMS for headings
  const { content } = useSiteContent<FeaturedWorkContent>(
    'portfolio',
    'featuredWork'
  );

  // Fetch projects dynamically from API
  const { projects, loading: projectsLoading } = useProjects(true);

  // Map projects to slides format
  const slides =
    projects.length > 0 ? projects.map(mapProjectToSlide) : DEFAULT_SLIDES;

  // Use CMS data with fallback to defaults for headings
  const eyebrow = content?.eyebrow || DEFAULT_HEADINGS.eyebrow;
  const title = content?.title || DEFAULT_HEADINGS.title;
  const titleHighlight =
    content?.titleHighlight || DEFAULT_HEADINGS.titleHighlight;
  const subtitle = content?.subtitle || DEFAULT_HEADINGS.subtitle;
  return (
    <section className="bg-black">
      {/* Section Header */}
      <div className="px-6 py-16">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
          subtitle={subtitle}
        />
      </div>

      {/* Loading state */}
      {projectsLoading && (
        <div className="flex h-96 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#37AFE1]"></div>
        </div>
      )}

      {/* Carousel with slides */}
      {!projectsLoading && (
        <ScrollXCarousel className="h-[150vh]">
          <ScrollXCarouselContainer className="flex h-dvh flex-col place-content-center gap-8 py-12">
            {/* Left fade gradient */}
            <div className="pointer-events-none absolute inset-[0_auto_0_0] z-10 h-[103%] w-[12vw] bg-[linear-gradient(90deg,_#000_35%,_transparent)]" />
            {/* Right fade gradient */}
            <div className="pointer-events-none absolute inset-[0_0_0_auto] z-10 h-[103%] w-[15vw] bg-[linear-gradient(270deg,_#000_35%,_transparent)]" />

            <ScrollXCarouselWrap className="flex-4/5 flex space-x-8 [&>*:first-child]:ml-8">
              {slides.map((slide) => (
                <CardHoverReveal
                  key={slide.id}
                  className="min-w-[45vw] rounded-xl border border-white/10 shadow-xl md:min-w-[25vw] xl:min-w-[20vw]"
                >
                  <CardHoverRevealMain>
                    <img
                      alt={slide.title}
                      src={slide.imageUrl}
                      className="h-[500px] w-full object-cover md:h-[550px]"
                    />
                  </CardHoverRevealMain>
                  <CardHoverRevealContent className="space-y-4 rounded-2xl bg-[rgba(0,0,0,.7)] p-4 backdrop-blur-xl">
                    <div className="space-y-2">
                      <h3 className="text-sm text-white/80">Type</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="rounded-full border-none bg-[#F58122] capitalize text-white">
                          {slide.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm text-white/80">Services</h3>
                      <div className="flex flex-wrap gap-2">
                        {slide.services.map((service) => (
                          <Badge
                            key={service}
                            className="rounded-full border border-[#37AFE1]/30 bg-[#37AFE1]/20 capitalize text-[#37AFE1]"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2 space-y-2">
                      <h3 className="text-lg font-medium capitalize text-white">
                        {slide.title}
                      </h3>
                      <p className="text-sm text-white/80">
                        {slide.description}
                      </p>
                    </div>
                  </CardHoverRevealContent>
                </CardHoverReveal>
              ))}
            </ScrollXCarouselWrap>

            {/* Progress bar */}
            <ScrollXCarouselProgress
              className="mx-8 h-1 overflow-hidden rounded-full bg-white/10"
              progressStyle="size-full bg-gradient-to-r from-[#F58122] to-[#37AFE1] rounded-full"
            />
          </ScrollXCarouselContainer>
        </ScrollXCarousel>
      )}
    </section>
  );
}
