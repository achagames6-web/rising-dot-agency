import dynamic from 'next/dynamic';
import ValueProposition from '@/components/sections/ValueProposition';
import ServiceCards from '@/components/sections/ServiceCards';
import SimpleCTA from '@/components/sections/SimpleCTA';
import { BatchSectionProvider } from '@/components/sections/BatchSectionProvider';
import OptimizedSectionWrapper from '@/components/sections/OptimizedSectionWrapper';

// AriseHero - dynamic import with Rising Dot 3D background (SSR disabled)
const AriseHero = dynamic(() => import('@/components/sections/AriseHero'), {
  ssr: false,
  loading: () => (
    <section
      className="flex min-h-screen items-center justify-center"
      style={{ background: 'rgb(0, 2, 15)' }}
    >
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
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

// Cinematic Showreel - dynamic import for GSAP ScrollTrigger
const CinematicShowreel = dynamic(
  () => import('@/components/sections/CinematicShowreel'),
  {
    ssr: false,
    loading: () => (
      <section className="flex h-[70vh] items-center justify-center bg-[#0A0F1E] md:h-[85vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500" />
      </section>
    ),
  }
);

// Featured Services - Sticky scroll cards for each service
const FeaturedServices = dynamic(
  () => import('@/components/sections/FeaturedServices'),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-20 md:py-32">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
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

// StackFeatureSection - Tech stack orbit animation
const StackFeatureSection = dynamic(
  () => import('@/components/ui/stack-feature-section'),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-16 md:py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </section>
    ),
  }
);

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

// ISR with 30-second revalidation - CMS changes appear within 30 seconds
export const revalidate = 30;

// All sections on homepage
const HOME_SECTIONS = [
  'hero',
  'showreel',
  'featuredServices',
  'valueProposition',
  'serviceCards',
  'stackFeature',
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
          <AriseHero />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="showreel">
          <CinematicShowreel />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="featuredServices">
          <FeaturedServices />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="valueProposition">
          <ValueProposition />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="serviceCards">
          <ServiceCards />
        </OptimizedSectionWrapper>
        <OptimizedSectionWrapper section="stackFeature">
          <StackFeatureSection />
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
