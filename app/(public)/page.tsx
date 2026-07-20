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

// Portfolio Gallery - dynamic import for image gallery
const PortfolioGallery = dynamic(
  () => import('@/components/sections/PortfolioGallery'),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
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

// TechStackMarquee - Infinite scrolling tech logos
const TechStackMarquee = dynamic(
  () => import('@/components/sections/TechStackMarquee'),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-16 md:py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </section>
    ),
  }
);

// About Section - Who we are
const AboutSection = dynamic(() => import('@/components/ui/about-section'), {
  ssr: false,
  loading: () => (
    <section className="flex items-center justify-center bg-black py-20">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
    </section>
  ),
});

// CaseStudiesCarousel - Progressive auto-advancing carousel
const CaseStudiesCarousel = dynamic(
  () => import('@/components/sections/CaseStudiesCarousel'),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-20 md:py-32">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#F58122]/30 border-t-[#F58122]" />
      </section>
    ),
  }
);

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

// Bento Grid - Services showcase
const BentoGridSection = dynamic(
  () => import('@/components/sections/BentoGridSection'),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
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
          <PortfolioGallery />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="about">
          <AboutSection />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="bentoGrid">
          <BentoGridSection />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="techStack">
          <TechStackMarquee />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="caseStudies">
          <CaseStudiesCarousel />
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
