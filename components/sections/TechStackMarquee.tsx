'use client';

import { Sparkles } from '@/components/ui/sparkles';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

const logos = [
  { name: 'React', src: '/media/home/tech-stack-marquee/react.svg' },
  { name: 'Next.js', src: '/media/home/tech-stack-marquee/nextjs.svg' },
  { name: 'TypeScript', src: '/media/home/tech-stack-marquee/typescript.svg' },
  { name: 'Tailwind', src: '/media/home/tech-stack-marquee/tailwindcss.svg' },
  { name: 'Node.js', src: '/media/home/tech-stack-marquee/nodejs.svg' },
  { name: 'Shopify', src: '/media/home/tech-stack-marquee/shopify.svg' },
  { name: 'WordPress', src: '/media/home/tech-stack-marquee/wordpress.svg' },
  { name: 'Figma', src: '/media/home/tech-stack-marquee/figma.svg' },
  { name: 'Vercel', src: '/media/home/tech-stack-marquee/vercel.svg' },
  { name: 'OpenAI', src: '/media/home/tech-stack-marquee/openai.svg' },
];

export default function TechStackMarquee() {
  // Fetch CMS content
  const { content } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
  }>('home', 'techStack');

  // Default values
  const eyebrow = content?.eyebrow || 'Technologies';
  const title = content?.title || 'Trusted by Experts.';
  const titleHighlight = content?.titleHighlight || 'Used by Leaders.';

  return (
    <div className="min-h-[500px] w-full overflow-hidden bg-transparent">
      <div className="mx-auto mt-16 w-full max-w-3xl px-4">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
        />
        
        {/* Sliding logos */}
        <div className="mt-14 overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
          <InfiniteSlider gap={48} reverse duration={30} durationOnHover={60}>
            {logos.map((logo) => (
              <img
                key={logo.name}
                src={logo.src}
                alt={logo.name}
                className="pointer-events-none h-8 md:h-10 select-none brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            ))}
          </InfiniteSlider>
        </div>
      </div>
      
      <div className="relative -mt-32 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]">
        <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#37AFE1,transparent_70%)] before:opacity-40" />
        <div className="absolute -left-1/2 top-1/2 aspect-[1/0.7] z-10 w-[200%] rounded-[100%] border-t border-[#37AFE1]/20 bg-transparent" />
        <Sparkles
          density={1200}
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
          color="#37AFE1"
        />
      </div>
    </div>
  );
}
