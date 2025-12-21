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

export interface CaseStudy {
  img: string;
  title: string;
  desc: string;
  sliderName: string;
}

interface ServiceCaseStudiesProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  caseStudies: CaseStudy[];
  duration?: number;
}

export default function ServiceCaseStudies({
  eyebrow = 'Case Studies',
  title = 'Results That',
  titleHighlight = 'Speak',
  subtitle,
  caseStudies,
  duration = 5000,
}: ServiceCaseStudiesProps) {
  if (!caseStudies || caseStudies.length === 0) return null;

  return (
    <section className="py-20 md:py-32 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
          subtitle={subtitle}
        />

        {/* Carousel */}
        <ProgressSlider vertical={false} activeSlider={caseStudies[0].sliderName} duration={duration}>
          <SliderContent>
            {caseStudies.map((item, index) => (
              <SliderWrapper key={index} value={item.sliderName}>
                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    className="rounded-2xl h-[400px] md:h-[500px] w-full object-cover"
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

          <SliderBtnGroup className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-white/10 overflow-hidden grid grid-cols-2 md:grid-cols-4 rounded-b-2xl">
            {caseStudies.map((item, index) => (
              <SliderBtn
                key={index}
                value={item.sliderName}
                className="text-left cursor-pointer p-4 md:p-5 border-r border-white/10 last:border-r-0 transition-all hover:bg-white/5"
                progressBarClass="bg-gradient-to-r from-[#F58122] to-[#37AFE1] h-full"
              >
                <h3 className="relative inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#F58122] text-white mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {item.title}
                </h3>
                <p className="text-sm text-white/80 font-medium line-clamp-2">
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
