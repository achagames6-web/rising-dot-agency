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
  subtitle: 'Scroll to explore our latest projects and see how we help businesses grow.',
};

export default function FeaturedProjectsCarousel() {
  const { content } = useSiteContent<FeaturedWorkContent>('portfolio', 'featuredWork');
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
              imageUrl: p.thumbnail || '/media/portfolio/featured-projects/ecommerce-platform.jpg',
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
  const titleHighlight = content?.titleHighlight || DEFAULT_HEADINGS.titleHighlight;
  const subtitle = content?.subtitle || DEFAULT_HEADINGS.subtitle;

  if (loadingProjects) {
    return (
      <div className="py-32 flex justify-center items-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </div>
    );
  }

  // Hide section if no projects are found
  if (slides.length === 0) return null;

  return (
    <section className="bg-black">
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
          <div className="pointer-events-none w-[12vw] h-[103%] absolute inset-[0_auto_0_0] z-10 bg-[linear-gradient(90deg,_#000_35%,_transparent)]" />
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

          <ScrollXCarouselProgress
            className="bg-white/10 mx-8 h-1 rounded-full overflow-hidden"
            progressStyle="size-full bg-gradient-to-r from-[#F58122] to-[#37AFE1] rounded-full"
          />
        </ScrollXCarouselContainer>
      </ScrollXCarousel>
    </section>
  );
}
