'use client';

import dynamic from 'next/dynamic';
import CompanyTimeline from '@/components/about/CompanyTimeline';
import SkillVisualization from '@/components/about/SkillVisualization';
import OfficeTour from '@/components/about/OfficeTour';
import MiniCTA from '@/components/sections/MiniCTA';
import { Hero1 } from '@/components/ui/hero-1';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { BatchSectionProvider } from '@/components/sections/BatchSectionProvider';
import OptimizedSectionWrapper from '@/components/sections/OptimizedSectionWrapper';

const AgencyShowreel = dynamic(() => import('@/components/sections/AgencyShowreel'), {
  ssr: false,
  loading: () => (
    <section className="h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-[#F58122]/30 border-t-[#F58122] rounded-full animate-spin" />
    </section>
  ),
});

const HolographicTeam = dynamic(() => import('@/components/sections/HolographicTeam'), {
  ssr: false,
  loading: () => (
    <section className="min-h-screen py-12 bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-[#37AFE1]/30 border-t-[#37AFE1] rounded-full animate-spin" />
    </section>
  ),
});

const PremiumTestimonials = dynamic(
  () =>
    import('@/components/ui/premium-testimonials').then((mod) => ({
      default: mod.PremiumTestimonials,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="py-32 bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#F58122]/30 border-t-[#F58122] rounded-full animate-spin" />
      </section>
    ),
  }
);

export default function AboutPage() {
  // Fetch CMS content for each section
  const { content: heroContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
  }>('about', 'hero');

  // Team content available for CMS integration
  useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    socialText?: string;
  }>('about', 'team');

  const { content: skillsContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
  }>('about', 'skills');

  const { content: timelineContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
  }>('about', 'timeline');

  const { content: officeTourContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
  }>('about', 'officeTour');

  const { content: ctaContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  }>('about', 'cta');

  // All sections for batch fetching
  const ABOUT_SECTIONS = ['hero', 'showreel', 'team', 'skills', 'timeline', 'officeTour', 'testimonials', 'cta'];

  return (
    <BatchSectionProvider page="about" sections={ABOUT_SECTIONS}>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <OptimizedSectionWrapper section="hero">
          <Hero1
            eyebrow={heroContent?.eyebrow || 'Who We Are'}
            title={heroContent?.title || 'About Rising Dot'}
            subtitle={heroContent?.subtitle || "We're a team of passionate developers, designers, and strategists dedicated to creating exceptional digital experiences that drive results."}
            ctaLabel={heroContent?.ctaLabel || 'Meet Our Team'}
            ctaHref={heroContent?.ctaHref || '#team'}
          />
        </OptimizedSectionWrapper>

        {/* Scroll Animated Video Showreel */}
        <OptimizedSectionWrapper section="showreel">
          <AgencyShowreel />
        </OptimizedSectionWrapper>

        {/* Team Section - Holographic Carousel */}
        <OptimizedSectionWrapper section="team">
          <div id="team">
            <HolographicTeam />
          </div>
        </OptimizedSectionWrapper>

        {/* Skills Visualization */}
        <OptimizedSectionWrapper section="skills">
          <section className="py-24 px-6 bg-black">
            <div className="max-w-7xl mx-auto">
              <SectionHeading
                eyebrow={skillsContent?.eyebrow || 'What We Do Best'}
                title={skillsContent?.title || 'Our'}
                titleHighlight={skillsContent?.titleHighlight || 'Expertise'}
              />
              <SkillVisualization />
            </div>
          </section>
        </OptimizedSectionWrapper>

        {/* Company Timeline */}
        <OptimizedSectionWrapper section="timeline">
          <section className="py-24 px-6 bg-black">
            <div className="max-w-7xl mx-auto">
              <SectionHeading
                eyebrow={timelineContent?.eyebrow || 'Our Story'}
                title={timelineContent?.title || 'Our'}
                titleHighlight={timelineContent?.titleHighlight || 'Journey'}
              />
              <CompanyTimeline />
            </div>
          </section>
        </OptimizedSectionWrapper>

        {/* Office Tour */}
        <OptimizedSectionWrapper section="officeTour">
          <section className="py-24 px-6 bg-black">
            <div className="max-w-7xl mx-auto">
              <SectionHeading
                eyebrow={officeTourContent?.eyebrow || 'Virtual Experience'}
                title={officeTourContent?.title || '360°'}
                titleHighlight={officeTourContent?.titleHighlight || 'Office Tour'}
              />
              <OfficeTour />
            </div>
          </section>
        </OptimizedSectionWrapper>

        {/* Testimonials */}
        <OptimizedSectionWrapper section="testimonials">
          <PremiumTestimonials />
        </OptimizedSectionWrapper>

        {/* CTA Section */}
        <OptimizedSectionWrapper section="cta">
          <MiniCTA
            eyebrow={ctaContent?.eyebrow || 'Start a Project'}
            title={ctaContent?.title || "Let's Build Something"}
            titleHighlight={ctaContent?.titleHighlight || 'Amazing'}
            subtitle={ctaContent?.subtitle || 'Ready to transform your digital presence? Let\'s discuss your project.'}
            ctaText={ctaContent?.ctaText || 'Get in Touch'}
            ctaLink={ctaContent?.ctaLink || '/contact'}
          />
        </OptimizedSectionWrapper>
      </div>
    </BatchSectionProvider>
  );
}
