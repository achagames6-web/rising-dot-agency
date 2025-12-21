'use client';

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
  subtitle: 'Scroll to explore our latest projects and see how we help businesses grow.',
};

export default function FeaturedProjectsCarousel() {
  // Fetch featuredWork section data from CMS
  const { content, loading } = useSiteContent<FeaturedWorkContent>('portfolio', 'featuredWork');

  // Use CMS data with fallback to defaults
  const slides = content?.slides && content.slides.length > 0 ? content.slides : DEFAULT_SLIDES;
  const eyebrow = content?.eyebrow || DEFAULT_HEADINGS.eyebrow;
  const title = content?.title || DEFAULT_HEADINGS.title;
  const titleHighlight = content?.titleHighlight || DEFAULT_HEADINGS.titleHighlight;
  const subtitle = content?.subtitle || DEFAULT_HEADINGS.subtitle;
  return (
    <section className="bg-black">
      {/* Section Header */}
      <div className="py-16 px-6">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
          subtitle={subtitle}
        />
      </div>

      <ScrollXCarousel className="h-[150vh]">
        <ScrollXCarouselContainer className="h-dvh place-content-center flex flex-col gap-8 py-12">
          {/* Left fade gradient */}
          <div className="pointer-events-none w-[12vw] h-[103%] absolute inset-[0_auto_0_0] z-10 bg-[linear-gradient(90deg,_#000_35%,_transparent)]" />
          {/* Right fade gradient */}
          <div className="pointer-events-none bg-[linear-gradient(270deg,_#000_35%,_transparent)] w-[15vw] h-[103%] absolute inset-[0_0_0_auto] z-10" />

          <ScrollXCarouselWrap className="flex-4/5 flex space-x-8 [&>*:first-child]:ml-8">
            {slides.map((slide) => (
              <CardHoverReveal
                key={slide.id}
                className="min-w-[45vw] md:min-w-[25vw] xl:min-w-[20vw] shadow-xl border border-white/10 rounded-xl"
              >
                <CardHoverRevealMain>
                  <img
                    alt={slide.title}
                    src={slide.imageUrl}
                    className="w-full h-[500px] md:h-[550px] object-cover"
                  />
                </CardHoverRevealMain>
                <CardHoverRevealContent className="space-y-4 rounded-2xl bg-[rgba(0,0,0,.7)] backdrop-blur-xl p-4">
                  <div className="space-y-2">
                    <h3 className="text-sm text-white/80">Type</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="capitalize rounded-full bg-[#F58122] text-white border-none">
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
                          className="capitalize rounded-full bg-[#37AFE1]/20 text-[#37AFE1] border border-[#37AFE1]/30"
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 mt-2">
                    <h3 className="text-white capitalize font-medium text-lg">
                      {slide.title}
                    </h3>
                    <p className="text-white/80 text-sm">{slide.description}</p>
                  </div>
                </CardHoverRevealContent>
              </CardHoverReveal>
            ))}
          </ScrollXCarouselWrap>

          {/* Progress bar */}
          <ScrollXCarouselProgress
            className="bg-white/10 mx-8 h-1 rounded-full overflow-hidden"
            progressStyle="size-full bg-gradient-to-r from-[#F58122] to-[#37AFE1] rounded-full"
          />
        </ScrollXCarouselContainer>
      </ScrollXCarousel>
    </section>
  );
}
