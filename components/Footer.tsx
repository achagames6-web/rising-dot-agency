'use client';

// components/Footer.tsx
//
// The marquee footer: two oversized rows of what we do, running in opposite
// directions, each word an internal link to the service page it names.
//
// Every link here points at a route that actually exists - services and case
// studies are generated from the same data the pages are, so the footer can
// never develop a dead link as the site grows. That matters more for search
// than any keyword: a 404 in a sitewide footer is a sitewide problem.

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useNavigation } from '@/lib/hooks/useNavigation';
import { CASE_STUDIES } from '@/lib/case-studies';
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
import './footer.css';

const SERVICES = [
  { label: 'n8n Automation', href: '/services/n8n-automations' },
  { label: 'AI Chatbots', href: '/services/chatbot-development' },
  { label: 'Web Development', href: '/services/web-design' },
  { label: 'WordPress', href: '/services/wordpress' },
  { label: 'Shopify', href: '/services/shopify' },
  { label: 'SaaS Products', href: '/services/saas' },
  { label: 'SEO', href: '/services/seo' },
];

const COMPANY = [
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  const { settings } = useNavigation();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to subscribe');
      setMessage({
        type: 'success',
        text: data.message || 'Subscribed. Talk soon.',
      });
      setEmail('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Something went wrong',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const socials = [
    { Icon: LinkedInIcon, data: settings.social.linkedin, name: 'LinkedIn' },
    { Icon: GitHubIcon, data: settings.social.github, name: 'GitHub' },
    { Icon: InstagramIcon, data: settings.social.instagram, name: 'Instagram' },
    { Icon: FacebookIcon, data: settings.social.facebook, name: 'Facebook' },
    { Icon: TwitterIcon, data: settings.social.twitter, name: 'X' },
    { Icon: YouTubeIcon, data: settings.social.youtube, name: 'YouTube' },
    { Icon: TikTokIcon, data: settings.social.tiktok, name: 'TikTok' },
    { Icon: TelegramIcon, data: settings.social.telegram, name: 'Telegram' },
    { Icon: DiscordIcon, data: settings.social.discord, name: 'Discord' },
    { Icon: PinterestIcon, data: settings.social.pinterest, name: 'Pinterest' },
  ].filter((s) => s.data?.enabled && s.data.url && s.data.url !== '#');

  const logo = settings.footer.logo;
  const logoSrc = logo && logo.startsWith('/') ? logo : '/logo.png';
  const description =
    settings.footer.description ||
    'Automation, AI assistants and the sites they run on. We take work that repeats and make it stop repeating.';

  // Two rows, opposite directions. Doubled so the loop has no seam.
  const rowA = [...SERVICES, ...SERVICES];
  const rowB = [...CASE_STUDIES, ...CASE_STUDIES];

  return (
    <footer className="rdf">
      <div className="rdf__stars" aria-hidden="true" />

      {/* ---------- marquee ---------- */}
      <div className="rdf__mq" aria-hidden="true">
        <div className="rdf__track">
          {rowA.map((s, i) => (
            <span key={`a${i}`} className="rdf__wordwrap">
              <Link
                href={s.href}
                className={`rdf__word${i % 3 === 1 ? ' is-on' : ''}`}
              >
                {s.label}
              </Link>
              <span className="rdf__sep">/</span>
            </span>
          ))}
        </div>
      </div>

      <div className="rdf__mq rdf__mq--b" aria-hidden="true">
        <div className="rdf__track rdf__track--rev">
          {rowB.map((c, i) => (
            <span key={`b${i}`} className="rdf__wordwrap">
              <Link
                href={`/portfolio/${c.slug}`}
                className="rdf__word rdf__word--sm"
              >
                {c.title}
              </Link>
              <span className="rdf__sep">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ---------- body ---------- */}
      <div className="rdf__in">
        <div className="rdf__grid">
          <div className="rdf__brand">
            <Link href="/" className="rdf__logo" aria-label="Rising Dot, home">
              <Image
                src={logoSrc}
                alt="Rising Dot"
                width={160}
                height={44}
                sizes="160px"
              />
            </Link>

            <p className="rdf__desc">{description}</p>

            <span className="rdf__status">
              <i aria-hidden="true" /> Available for new work
            </span>

            {settings.footer.showNewsletter && (
              <form className="rdf__sub" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  aria-label="Email address"
                />
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Sending' : 'Subscribe'}
                </button>
              </form>
            )}

            {message && (
              <p
                role="status"
                className={`rdf__msg${message.type === 'error' ? ' is-err' : ''}`}
              >
                {message.text}
              </p>
            )}
          </div>

          <nav className="rdf__col" aria-label="Services">
            <h2>Services</h2>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.href}>
                  <Link href={s.href}>{s.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="rdf__col" aria-label="Case studies">
            <h2>Case studies</h2>
            <ul>
              {CASE_STUDIES.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link href={`/portfolio/${c.slug}`}>{c.title}</Link>
                </li>
              ))}
              <li>
                <Link href="/portfolio">All work</Link>
              </li>
            </ul>
          </nav>

          <nav className="rdf__col" aria-label="Company">
            <h2>Company</h2>
            <ul>
              {COMPANY.map((c) => (
                <li key={c.href}>
                  <Link href={c.href}>{c.label}</Link>
                </li>
              ))}
            </ul>

            {socials.length > 0 && (
              <div className="rdf__soc">
                {socials.map(({ Icon, data, name }) => (
                  <a
                    key={name}
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </nav>
        </div>
      </div>

      <div className="rdf__bottom">
        <span>
          {settings.footer.copyrightText ||
            `© ${new Date().getFullYear()} Rising Dot. All rights reserved.`}
        </span>
        <span className="rdf__tag">
          Rising together in the world of digital dots
        </span>
      </div>
    </footer>
  );
}
