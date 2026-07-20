'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { Mail, Calendar, Sparkles } from 'lucide-react';
import { StarButton } from '@/components/ui/star-button';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  TikTokIcon,
  YouTubeIcon,
  LinkedInIcon,
  TelegramIcon,
  DiscordIcon,
  PinterestIcon,
  GitHubIcon,
} from '@/components/ui/social-icons';
import '@/components/sections/space.css';

export default function SimpleCTA() {
  // Fetch CMS content
  const { content: ctaContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    stats?: { number: string; label: string }[];
  }>('home', 'cta');

  // Use CMS data or fallback to defaults
  const eyebrow = ctaContent?.eyebrow || 'Ready to Start?';
  const title = ctaContent?.title || "Let's Build Something";
  const titleHighlight = ctaContent?.titleHighlight || 'Extraordinary';
  const subtitle =
    ctaContent?.subtitle ||
    "Transform your vision into reality with our expert team. We're ready to bring your ideas to life.";
  const ctaText = ctaContent?.ctaText || 'Get Started Today';
  const ctaLink = ctaContent?.ctaLink || '/contact';
  const secondaryCtaText = ctaContent?.secondaryCtaText || 'View Our Work';
  const secondaryCtaLink = ctaContent?.secondaryCtaLink || '/portfolio';

  // Merged in from the Connect section: the direct ways to reach a person.
  const { content: connectContent } = useSiteContent<{
    ctaText?: string;
    ctaLink?: string;
    email?: string;
    whatsapp?: string;
  }>('home', 'connect');

  const callText = connectContent?.ctaText || 'Book a call';
  const callLink = connectContent?.ctaLink || '/contact';
  const email = connectContent?.email || 'contact@risingdot.agency';
  const whatsapp = connectContent?.whatsapp || '+1234567890';

  // Social media configuration
  const socialLinks = [
    {
      name: 'Instagram',
      icon: InstagramIcon,
      href: '#',
      hoverClass: 'instagram',
    },
    { name: 'Facebook', icon: FacebookIcon, href: '#', hoverClass: 'facebook' },
    { name: 'Twitter', icon: TwitterIcon, href: '#', hoverClass: 'twitter' },
    { name: 'TikTok', icon: TikTokIcon, href: '#', hoverClass: 'tiktok' },
    { name: 'YouTube', icon: YouTubeIcon, href: '#', hoverClass: 'youtube' },
    { name: 'LinkedIn', icon: LinkedInIcon, href: '#', hoverClass: 'linkedin' },
    { name: 'Telegram', icon: TelegramIcon, href: '#', hoverClass: 'telegram' },
    { name: 'Discord', icon: DiscordIcon, href: '#', hoverClass: 'discord' },
    {
      name: 'Pinterest',
      icon: PinterestIcon,
      href: '#',
      hoverClass: 'pinterest',
    },
    { name: 'GitHub', icon: GitHubIcon, href: '#', hoverClass: 'github' },
  ];

  return (
    <section className="rd-space px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="rd-space__stars" aria-hidden="true" />
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#37AFE1]/5 to-transparent" />
      <div className="absolute inset-0">
        <div
          className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full opacity-20 blur-[100px]"
          style={{
            background:
              'radial-gradient(circle, rgba(55, 175, 225, 0.5) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full opacity-20 blur-[100px]"
          style={{
            background:
              'radial-gradient(circle, rgba(245, 129, 34, 0.4) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge - responsive */}
          <motion.div
            className="mb-4 flex justify-center sm:mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* The same eyebrow pill every other section uses. */}
            <motion.div
              className="inline-flex items-center gap-3 rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 backdrop-blur-sm"
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="h-4 w-4 text-[#F58122]" />
              </motion.div>
              <span className="text-sm font-medium text-white/80">
                ✨ {eyebrow}
              </span>
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            </motion.div>
          </motion.div>

          {/* Title - responsive */}
          <motion.h2 className="mb-3 text-3xl font-bold sm:mb-4 sm:text-4xl md:mb-6 md:text-5xl">
            <span className="text-white">{title} </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
                backgroundSize: '300% 100%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }}
            >
              {titleHighlight}
            </span>
          </motion.h2>

          {/* Subtitle - responsive */}
          <motion.p className="mb-6 text-base text-gray-400 sm:mb-8 sm:text-lg md:text-xl">
            {subtitle}
          </motion.p>

          <div className="mb-12" />

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ParticleWrapper>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={ctaLink}>
                  <StarButton
                    className="h-10 px-6 text-sm font-semibold sm:h-12 sm:px-8 sm:text-base"
                    duration={2.5}
                  >
                    {ctaText}
                  </StarButton>
                </Link>
              </motion.div>
            </ParticleWrapper>

            <ParticleWrapper>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={secondaryCtaLink}>
                  <StarButton
                    variant="secondary"
                    className="h-10 px-6 text-sm font-semibold sm:h-12 sm:px-8 sm:text-base"
                    duration={3}
                  >
                    {secondaryCtaText}
                  </StarButton>
                </Link>
              </motion.div>
            </ParticleWrapper>
          </div>

          {/* Direct contact - merged from Connect. Sits between the two
              calls to action and the social row, so the page ends with
              buttons, then people, then platforms. */}
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link
              href={callLink}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white/85 backdrop-blur-sm transition-colors hover:border-[#F58122]/60 hover:text-white"
            >
              <Calendar className="h-4 w-4 text-[#F58122]" />
              {callText}
            </Link>

            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white/85 backdrop-blur-sm transition-colors hover:border-[#37AFE1]/60 hover:text-white"
            >
              <Mail className="h-4 w-4 text-[#37AFE1]" />
              {email}
            </a>

            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white/85 backdrop-blur-sm transition-colors hover:border-green-400/60 hover:text-white"
            >
              <svg
                className="h-4 w-4 text-green-400"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1s-.5-.1-.7.1-.7.9-.9 1.1-.3.2-.6.1a8 8 0 0 1-3.9-3.4c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.4 1.9.8 2.6.9 3.5.8.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.2-.3-.3-.6-.4z" />
                <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
              </svg>
              WhatsApp
            </a>
          </motion.div>

          {/* Social Icons - Direct on Page Background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex justify-center sm:mt-10 md:mt-12"
          >
            <div>
              <p className="mb-6 text-center text-sm text-[#64748B]">
                Follow us on social media
              </p>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`social-icon ${social.hoverClass}`}
                    >
                      <div className="icon-container-small">
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <span className="icon-label-small">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Social Media Styles */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .social-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .icon-container-small {
          display: inline-flex;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: all 0.3s ease;
          position: relative;
          justify-content: center;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-icon:hover .icon-container-small {
          transform: translateY(-5px) scale(1.1);
        }

        .social-icon:hover .icon-label-small {
          opacity: 1;
          transform: translateY(2px);
        }

        .icon-label-small {
          margin-top: 6px;
          color: white;
          font-weight: 500;
          font-size: 0.75rem;
          opacity: 0.7;
          transition: all 0.3s ease;
        }

        /* Platform-specific hover colors */
        .social-icon.instagram:hover .icon-container-small {
          background: radial-gradient(
            circle at 30% 107%,
            #fdf497 0%,
            #fdf497 5%,
            #fd5949 45%,
            #d6249f 60%,
            #285aeb 90%
          );
          box-shadow: 0 0 15px rgba(225, 48, 108, 0.6);
        }

        .social-icon.facebook:hover .icon-container-small {
          background: #1877f2;
          box-shadow: 0 0 15px rgba(24, 119, 242, 0.6);
        }

        .social-icon.twitter:hover .icon-container-small {
          background: #1da1f2;
          box-shadow: 0 0 15px rgba(29, 161, 242, 0.6);
        }

        .social-icon.tiktok:hover .icon-container-small {
          background: #000000;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
        }

        .social-icon.youtube:hover .icon-container-small {
          background: #ff0000;
          box-shadow: 0 0 15px rgba(255, 0, 0, 0.6);
        }

        .social-icon.linkedin:hover .icon-container-small {
          background: #0077b5;
          box-shadow: 0 0 15px rgba(0, 119, 181, 0.6);
        }

        .social-icon.telegram:hover .icon-container-small {
          background: #0088cc;
          box-shadow: 0 0 15px rgba(0, 136, 204, 0.6);
        }

        .social-icon.discord:hover .icon-container-small {
          background: #7289da;
          box-shadow: 0 0 15px rgba(114, 137, 218, 0.6);
        }

        .social-icon.pinterest:hover .icon-container-small {
          background: #e60023;
          box-shadow: 0 0 15px rgba(230, 0, 35, 0.6);
        }

        .social-icon.github:hover .icon-container-small {
          background: #333333;
          box-shadow: 0 0 15px rgba(51, 51, 51, 0.6);
        }

        .social-icon:hover svg {
          animation: shake 0.5s;
        }

        @media (prefers-reduced-motion: reduce) {
          .social-icon:hover svg {
            animation: none;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0) rotate(0);
          }
          20% {
            transform: translateX(-2.5px) rotate(-2.5deg);
          }
          40% {
            transform: translateX(2.5px) rotate(2.5deg);
          }
          60% {
            transform: translateX(-2.5px) rotate(-2.5deg);
          }
          80% {
            transform: translateX(2.5px) rotate(2.5deg);
          }
        }

        .icon-container-small::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.4) 0%,
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .social-icon:hover .icon-container-small::before {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
