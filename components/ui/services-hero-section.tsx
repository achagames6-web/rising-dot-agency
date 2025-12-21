'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { TimelineContent } from '@/components/ui/timeline-animation';
import { useRef } from 'react';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';

export interface ServiceItem {
  id: string;
  name: string;
  url: string;
  description: string;
  imgSrc: string;
}

interface ServicesHeroSectionProps {
  eyebrow?: string;
  eyebrowLink?: string;
  title: string;
  highlightedWord?: string;
  highlightedWord2?: string;
  subtitle: string;
  services: ServiceItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

export function ServicesHeroSection({
  eyebrow,
  eyebrowLink = '#',
  title,
  highlightedWord,
  highlightedWord2,
  subtitle,
  services,
  ctaLabel = 'Get Started',
  ctaHref = '/contact',
}: ServicesHeroSectionProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        delay: i * 0.15,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: 'blur(10px)',
      y: -20,
      opacity: 0,
    },
  };

  // Split title to insert highlighted words with animated gradient
  const renderTitle = () => {
    if (!highlightedWord) return title;

    const animatedGradientStyle = {
      backgroundImage: 'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
      backgroundSize: '300% 100%',
      animation: 'gradient-shift 4s ease-in-out infinite',
    };

    const parts = title.split(highlightedWord);
    return (
      <>
        {parts[0]}
        <span 
          className="font-semibold bg-clip-text text-transparent"
          style={animatedGradientStyle}
        >
          {highlightedWord}
        </span>
        {highlightedWord2 ? (
          <>
            {parts[1]?.split(highlightedWord2)[0]}
            <span 
              className="font-semibold bg-clip-text text-transparent"
              style={animatedGradientStyle}
            >
              {highlightedWord2}
            </span>
            {parts[1]?.split(highlightedWord2)[1]}
          </>
        ) : (
          parts[1]
        )}
      </>
    );
  };

  return (
    <main ref={timelineRef} className="bg-black">
      <div className="pt-28 pb-5 max-w-screen-2xl mx-auto min-h-screen px-4">
        <article className="w-fit mx-auto 2xl:max-w-5xl xl:max-w-4xl max-w-2xl text-center space-y-6">
          {/* Eyebrow */}
          {eyebrow && (
            <TimelineContent
              as="a"
              href={eyebrowLink}
              animationNum={1}
              timelineRef={timelineRef}
              customVariants={revealVariants}
              className="flex w-fit mx-auto items-center gap-1 rounded-full bg-[#37AFE1]/20 border-2 border-[#37AFE1]/30 py-0.5 pl-0.5 pr-3 text-xs"
            >
              <div className="rounded-full bg-[#37AFE1] px-2 py-1 text-xs text-white font-medium">
                New
              </div>
              <p className="text-white sm:text-base text-xs inline-block">
                ✨ {eyebrow}
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3 w-3 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </TimelineContent>
          )}

          {/* Title */}
          <TimelineContent
            as="h1"
            animationNum={2}
            timelineRef={timelineRef}
            customVariants={revealVariants}
            className="2xl:text-6xl text-white xl:text-5xl sm:text-4xl text-3xl leading-[100%]"
          >
            {renderTitle()}
          </TimelineContent>

          {/* Subtitle */}
          <TimelineContent
            as="p"
            animationNum={3}
            timelineRef={timelineRef}
            customVariants={revealVariants}
            className="lg:text-xl text-gray-400 sm:text-lg text-sm max-w-2xl mx-auto"
          >
            {subtitle}
          </TimelineContent>

          {/* CTA Button */}
          <TimelineContent
            animationNum={4}
            timelineRef={timelineRef}
            customVariants={revealVariants}
            className="pt-4"
          >
            <ParticleWrapper>
              <Link href={ctaHref}>
                <StarButton
                  className="h-12 px-6 text-sm font-semibold hover:scale-105 transition-transform"
                  duration={2.5}
                >
                  {ctaLabel}
                </StarButton>
              </Link>
            </ParticleWrapper>
          </TimelineContent>
        </article>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 grid-cols-2 gap-6 pt-20">
          {services.map((service, index) => (
            <TimelineContent
              as="div"
              animationNum={index + 5}
              timelineRef={timelineRef}
              key={service.id}
              customVariants={revealVariants}
              className="group transition-all aspect-video rounded-xl backdrop-blur-sm overflow-hidden relative border border-white/10 hover:border-[#37AFE1]/50 cursor-default"
            >
              <figure className="relative h-full w-full">
                <Image
                  src={service.imgSrc}
                  alt={service.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
              </figure>
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 rounded-xl" />
              <ProgressiveBlur
                className="pointer-events-none absolute bottom-0 left-0 h-[50%] w-full"
                blurIntensity={0.5}
              />
              <div className="sm:py-2 py-1 sm:px-4 px-2 absolute bottom-2 left-2">
                <h3 className="2xl:text-xl xl:text-xl md:text-lg text-sm font-medium leading-[140%] capitalize text-white">
                  {service.name}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {service.description}
                </p>
              </div>
            </TimelineContent>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ServicesHeroSection;
