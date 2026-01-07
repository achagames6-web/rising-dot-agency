'use client';

import { motion } from 'framer-motion';
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
    <section className="relative overflow-hidden bg-black py-16">
      {/* Blue ambient glow - subtle at 0.3 opacity */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(55, 175, 225, 0.3) 0%, transparent 70%)',
          opacity: 0.3,
        }}
      />

      {/* Additional blue tint overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#37AFE1]/5 to-transparent" />

      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto w-full max-w-3xl">
          {/* Badge with blue glow */}
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-3 rounded-full border px-5 py-2 backdrop-blur-sm"
              style={{
                borderColor: 'rgba(55, 175, 225, 0.3)',
                background: 'rgba(55, 175, 225, 0.08)',
                boxShadow: '0 0 20px rgba(55, 175, 225, 0.3)',
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(55, 175, 225, 0.5)',
              }}
            >
              <span className="text-sm font-medium text-[#37AFE1]">
                {eyebrow}
              </span>
            </motion.div>
          </motion.div>

          <SectionHeading title={title} titleHighlight={titleHighlight} />

          {/* Sliding logos */}
          <div className="mt-14 overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
            <InfiniteSlider gap={48} reverse duration={30} durationOnHover={60}>
              {logos.map((logo) => (
                <img
                  key={logo.name}
                  src={logo.src}
                  alt={logo.name}
                  className="pointer-events-none h-8 select-none opacity-70 brightness-0 invert transition-opacity hover:opacity-100 md:h-10"
                  loading="lazy"
                />
              ))}
            </InfiniteSlider>
          </div>
        </div>

        <div className="relative -mt-32 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]">
          <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#37AFE1,transparent_70%)] before:opacity-40" />
          <div className="absolute -left-1/2 top-1/2 z-10 aspect-[1/0.7] w-[200%] rounded-[100%] border-t border-[#37AFE1]/20 bg-transparent" />

          <Sparkles
            density={1200}
            className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
            color="#37AFE1"
          />
        </div>
      </div>
    </section>
  );
}
