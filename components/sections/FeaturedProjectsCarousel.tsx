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

interface Project {
  id: string;
  _id?: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  featured?: boolean;
}

interface FeaturedSlide {
  id: string;
  title: string;
  description: string;
  services: string[];
  type: string;
  imageUrl: string;
}

interface FeaturedWorkContent {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
}

const DEFAULT_HEADINGS = {
  eyebrow: 'Featured Work',
  title: 'Projects That',
  titleHighlight: 'Deliver Results',
  subtitle:
    'Scroll to explore our latest projects and see how we help businesses grow.',
};

export default function FeaturedProjectsCarousel() {
  const { content } = useSiteContent<FeaturedWorkContent>(
    'portfolio',
    'featuredWork'
  );
  const [slides, setSlides] = useState<FeaturedSlide[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch featured projects from your API
        const res = await fetch('/api/projects?featured=true');
        if (res.ok) {
          const data = await res.json();
          const projects: Project[] = data.projects || [];

          if (projects.length > 0) {
            const mappedSlides = projects.map((p) => ({
              id: p._id || p.id,
              title: p.title,
              description: p.description,
              services: p.tags,
              type: p.tags[0] || 'Project',
              imageUrl:
                p.thumbnail ||
                '/media/portfolio/featured-projects/ecommerce-platform.jpg',
            }));
            setSlides(mappedSlides);
          }
        }
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const eyebrow = content?.eyebrow || DEFAULT_HEADINGS.eyebrow;
  const title = content?.title || DEFAULT_HEADINGS.title;
  const titleHighlight =
    content?.titleHighlight || DEFAULT_HEADINGS.titleHighlight;
  const subtitle = content?.subtitle || DEFAULT_HEADINGS.subtitle;

  if (loadingProjects) {
    return (
      <div className="flex items-center justify-center bg-black py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </div>
    );
  }

  // Hide section if no projects are found
  if (slides.length === 0) return null;

  return (
    <section className="bg-black">
      <div className="px-6 py-16">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
          subtitle={subtitle}
        />
      </div>

      <ScrollXCarousel className="h-[150vh]">
        <ScrollXCarouselContainer className="flex h-dvh flex-col place-content-center gap-8 py-12">
          <div className="pointer-events-none absolute inset-[0_auto_0_0] z-10 h-[103%] w-[12vw] bg-[linear-gradient(90deg,_#000_35%,_transparent)]" />
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
                    <p className="text-sm text-white/80">{slide.description}</p>
                  </div>
                </CardHoverRevealContent>
              </CardHoverReveal>
            ))}
          </ScrollXCarouselWrap>

          <ScrollXCarouselProgress
            className="mx-8 h-1 overflow-hidden rounded-full bg-white/10"
            progressStyle="size-full bg-gradient-to-r from-[#F58122] to-[#37AFE1] rounded-full"
          />
        </ScrollXCarouselContainer>
      </ScrollXCarousel>
    </section>
  );
}
