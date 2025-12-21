'use client';

import Image from 'next/image';
import {
  SliderBtnGroup,
  ProgressSlider,
  SliderBtn,
  SliderContent,
  SliderWrapper,
} from '@/components/ui/progressive-carousel';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

// Case study interface
interface CaseStudy {
  img: string;
  title: string;
  desc: string;
  sliderName: string;
}

// Default case studies for home page
const defaultHomeCaseStudies: CaseStudy[] = [
  {
    img: '/media/home/case-studies/ecommerce.jpg',
    title: 'E-Commerce Success',
    desc: 'Increased conversion rates by 45% through strategic UX redesign and performance optimization.',
    sliderName: 'ecommerce',
  },
  {
    img: '/media/home/case-studies/saas-dashboard.jpg',
    title: 'SaaS Dashboard',
    desc: 'Built a real-time analytics platform serving 10,000+ daily active users with 99.9% uptime.',
    sliderName: 'saas',
  },
  {
    img: '/media/home/case-studies/workflow-automation.jpg',
    title: 'Workflow Automation',
    desc: 'Automated 200+ hours of manual work monthly using N8N workflows and custom integrations.',
    sliderName: 'automation',
  },
  {
    img: '/media/home/case-studies/ai-chatbot.jpg',
    title: 'AI Chatbot',
    desc: 'Deployed intelligent chatbot handling 5,000+ customer queries daily with 95% satisfaction rate.',
    sliderName: 'chatbot',
  },
];

// Default case studies for portfolio page
const defaultPortfolioCaseStudies: CaseStudy[] = [
  {
    img: '/media/portfolio/case-studies/enterprise-platform.jpg',
    title: 'Enterprise Platform',
    desc: 'Built a scalable enterprise platform handling 1M+ daily transactions with 99.99% uptime.',
    sliderName: 'enterprise',
  },
  {
    img: '/media/portfolio/case-studies/mobile-app.jpg',
    title: 'Mobile App Launch',
    desc: 'Launched a mobile app achieving 100K+ downloads in the first month with 4.8 star rating.',
    sliderName: 'mobile',
  },
  {
    img: '/media/portfolio/case-studies/ai-integration.jpg',
    title: 'AI Integration',
    desc: 'Integrated AI-powered features reducing manual processing time by 85% across operations.',
    sliderName: 'ai',
  },
  {
    img: '/media/portfolio/case-studies/digital-transformation.jpg',
    title: 'Digital Transformation',
    desc: 'Led complete digital transformation resulting in 200% increase in online engagement.',
    sliderName: 'digital',
  },
];

interface CaseStudiesCarouselProps {
  page?: 'home' | 'portfolio';
}

export default function CaseStudiesCarousel({
  page = 'home',
}: CaseStudiesCarouselProps) {
  // Fetch CMS content based on page prop (Requirements 6.3)
  const { content: sectionContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    studies?: CaseStudy[];
  }>(page, 'caseStudies');

  // Select default case studies based on page
  const defaultCaseStudies =
    page === 'portfolio' ? defaultPortfolioCaseStudies : defaultHomeCaseStudies;

  // Use CMS data or fallback to defaults
  const eyebrow = sectionContent?.eyebrow || 'Case Studies';
  const title = sectionContent?.title || 'Results That';
  const titleHighlight = sectionContent?.titleHighlight || 'Speak';
  const subtitle =
    sectionContent?.subtitle ||
    "Real projects, real impact. See how we've helped businesses transform their digital presence.";
  const caseStudies = sectionContent?.studies || defaultCaseStudies;

  return (
    <section className="bg-transparent py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
          subtitle={subtitle}
        />

        {/* Carousel */}
        <ProgressSlider
          vertical={false}
          activeSlider={caseStudies[0]?.sliderName || 'ecommerce'}
          duration={5000}
        >
          <SliderContent>
            {caseStudies.map((item, index) => (
              <SliderWrapper key={index} value={item.sliderName}>
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    className="h-[400px] w-full rounded-2xl object-cover md:h-[500px]"
                    src={item.img}
                    width={1200}
                    height={600}
                    alt={item.title}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
              </SliderWrapper>
            ))}
          </SliderContent>

          <SliderBtnGroup className="absolute bottom-0 left-0 right-0 grid grid-cols-2 overflow-hidden rounded-b-2xl border-t border-white/10 bg-black/60 backdrop-blur-xl md:grid-cols-4">
            {caseStudies.map((item, index) => (
              <SliderBtn
                key={index}
                value={item.sliderName}
                className="cursor-pointer border-r border-white/10 p-4 text-left transition-all last:border-r-0 hover:bg-white/5 md:p-5"
                progressBarClass="bg-gradient-to-r from-[#F58122] to-[#37AFE1] h-full"
              >
                <h3 className="relative mb-2 inline-flex items-center gap-2 rounded-full bg-[#F58122] px-3 py-1 text-xs font-semibold text-white">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  {item.title}
                </h3>
                <p className="line-clamp-2 text-sm font-medium text-white/80">
                  {item.desc}
                </p>
              </SliderBtn>
            ))}
          </SliderBtnGroup>
        </ProgressSlider>
      </div>
    </section>
  );
}
