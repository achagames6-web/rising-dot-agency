import dynamic from 'next/dynamic';
import SimpleCTA from '@/components/sections/SimpleCTA';
import { BatchSectionProvider } from '@/components/sections/BatchSectionProvider';
import OptimizedSectionWrapper from '@/components/sections/OptimizedSectionWrapper';

// Hero - six-act scroll film: the dot draws the logo, the camera flies
// through it into the services corridor. Client-side only: the scene samples
// SVG paths in the browser. Previous hero kept at components/sections/CleanHero.
const RisingDotHero = dynamic(() => import('@/components/hero/HeroSection'), {
  ssr: false,
  loading: () => (
    <section
      className="flex min-h-screen items-center justify-center"
      style={{ background: '#04050A' }}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#F58220]/30 border-t-[#F58220]" />
    </section>
  ),
});

// Connect section - dynamic import for framer-motion animations
const Connect = dynamic(() => import('@/components/sections/Connect'), {
  ssr: false,
  loading: () => (
    <section className="flex items-center justify-center bg-black py-20">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
    </section>
  ),
});

// HolographicContact - dynamic import for WebGL globe (SSR disabled)
const HolographicContact = dynamic(
  () => import('@/components/sections/HolographicContact'),
  {
    ssr: false,
    loading: () => (
      <section className="flex min-h-screen items-center justify-center bg-[#0A0F1E] py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500" />
      </section>
    ),
  }
);

// ProjectIndex - the seven shipped projects as an index with a live preview.
// Replaces PortfolioGallery, which is left in place at
// components/sections/PortfolioGallery for an easy revert.
const ProjectIndex = dynamic(
  () => import('@/components/sections/ProjectIndex'),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-[#04050A] py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#F58220]/30 border-t-[#F58220]" />
      </section>
    ),
  }
);

// WorkflowCanvas - the services drawn as a workflow, directly under the hero.
// Replaces ServicesShowcase, which is left in place at
// components/sections/ServicesShowcase for an easy revert.
const WorkflowCanvas = dynamic(
  () => import('@/components/sections/WorkflowCanvas'),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-[#04050A] py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#F58220]/30 border-t-[#F58220]" />
      </section>
    ),
  }
);

// HolographicTeam - Team carousel section
const HolographicTeam = dynamic(
  () => import('@/components/sections/HolographicTeam'),
  {
    ssr: false,
    loading: () => (
      <section className="flex min-h-screen items-center justify-center bg-[#0A0F1E] py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500" />
      </section>
    ),
  }
);

// ToolkitWays - section six. Two tabs: what we build with, and ways to work.
// Replaces TechStackMarquee, which stays in the repo for an easy revert.
const ToolkitWays = dynamic(() => import('@/components/sections/ToolkitWays'), {
  ssr: false,
  loading: () => (
    <section className="flex items-center justify-center bg-[#04050A] py-20">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#F58220]/30 border-t-[#F58220]" />
    </section>
  ),
});

// AboutTabs - section four. Two tabs: who we are, and how we work.
// Replaces components/ui/about-section, which stays for an easy revert.
const AboutTabs = dynamic(() => import('@/components/sections/AboutTabs'), {
  ssr: false,
  loading: () => (
    <section className="flex items-center justify-center bg-[#04050A] py-20">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#F58220]/30 border-t-[#F58220]" />
    </section>
  ),
});

// FaqSection - section seven. By this point the work has been shown three
// times; what a reader needs next is the awkward questions answered, not a
// fourth gallery. Replaces CaseStudiesCarousel, kept in the repo for revert.
const FaqSection = dynamic(() => import('@/components/sections/FaqSection'), {
  ssr: false,
  loading: () => (
    <section className="flex items-center justify-center bg-[#04050A] py-20">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#F58220]/30 border-t-[#F58220]" />
    </section>
  ),
});

// PremiumTestimonials - Premium testimonials with animations
const PremiumTestimonials = dynamic(
  () =>
    import('@/components/ui/premium-testimonials').then((mod) => ({
      default: mod.PremiumTestimonials,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-gradient-to-br from-black via-[#0F172A] to-black py-32">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#F58122]/30 border-t-[#F58122]" />
      </section>
    ),
  }
);

// BlogSection - Latest blog posts
const BlogSection = dynamic(() => import('@/components/sections/BlogSection'), {
  ssr: false,
  loading: () => (
    <section className="flex items-center justify-center bg-black py-24">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
    </section>
  ),
});

// ProcessBento - section five. What actually happens if you hire us.
// Replaces BentoGridSection, which stays in the repo for an easy revert.
const ProcessBento = dynamic(
  () => import('@/components/sections/ProcessBento'),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-[#04050A] py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#F58220]/30 border-t-[#F58220]" />
      </section>
    ),
  }
);

// ISR with 30-second revalidation - CMS changes appear within 30 seconds
export const revalidate = 30;

// All sections on homepage
const HOME_SECTIONS = [
  'hero',
  'servicesShowcase',
  'portfolioGallery',
  'about',
  'bentoGrid',
  'techStack',
  'caseStudies',
  'testimonials',
  'blog',
  'connect',
  'team',
  'contact',
  'cta',
];

export default function Home() {
  return (
    <BatchSectionProvider page="home" sections={HOME_SECTIONS}>
      <main className="min-h-screen bg-black">
        <OptimizedSectionWrapper section="hero">
          <RisingDotHero />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="servicesShowcase">
          <WorkflowCanvas />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="portfolioGallery">
          <ProjectIndex />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="about">
          <AboutTabs />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="bentoGrid">
          <ProcessBento />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="techStack">
          <ToolkitWays />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="caseStudies">
          <FaqSection />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="testimonials">
          <PremiumTestimonials />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="blog">
          <BlogSection />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="connect">
          <Connect />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="team">
          <HolographicTeam />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="contact">
          <HolographicContact />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="cta">
          <SimpleCTA />
        </OptimizedSectionWrapper>
      </main>
    </BatchSectionProvider>
  );
}
