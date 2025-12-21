'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { useNavigation } from '@/lib/hooks/useNavigation';
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
  GitHubIcon 
} from '@/components/ui/social-icons';

export default function Footer() {
  const { settings, loading } = useNavigation();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

      if (res.ok) {
        setMessage({ type: 'success', text: data.message || 'Subscribed successfully!' });
        setEmail('');
      } else {
        throw new Error(data.error || 'Failed to subscribe');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Something went wrong' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  // Build social links array from settings - only show enabled links with URLs
  const socialItems = [
    { key: 'facebook', data: settings.social.facebook, label: 'Facebook', Icon: FacebookIcon },
    { key: 'instagram', data: settings.social.instagram, label: 'Instagram', Icon: InstagramIcon },
    { key: 'tiktok', data: settings.social.tiktok, label: 'TikTok', Icon: TikTokIcon },
    { key: 'youtube', data: settings.social.youtube, label: 'YouTube', Icon: YouTubeIcon },
    { key: 'twitter', data: settings.social.twitter, label: 'Twitter', Icon: TwitterIcon },
    { key: 'linkedin', data: settings.social.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
    { key: 'telegram', data: settings.social.telegram, label: 'Telegram', Icon: TelegramIcon },
    { key: 'discord', data: settings.social.discord, label: 'Discord', Icon: DiscordIcon },
    { key: 'pinterest', data: settings.social.pinterest, label: 'Pinterest', Icon: PinterestIcon },
    { key: 'github', data: settings.social.github, label: 'GitHub', Icon: GitHubIcon },
  ].filter(item => item.data?.url && item.data?.enabled);

  // Get copyright text with year replacement
  const copyrightText = (settings.footer.copyrightText || '© {year} Rising Dot Agency. All rights reserved.')
    .replace('{year}', new Date().getFullYear().toString());

  return (
    <footer className="bg-black border-t border-[#37AFE1]/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block">
              <img 
                src={settings.footer.logo || '/logo.png'}
                alt="Rising Dot" 
                className="h-16 w-auto"
              />
            </Link>
            <p className="mt-4 text-[#64748B] font-inter text-sm leading-relaxed">
              {settings.footer.description || 'Premium digital solutions that transform your business through innovative technology and stunning design.'}
            </p>
          </div>

          {/* Dynamic Footer Columns */}
          {settings.footer.columns.map((column, index) => (
            <div key={index}>
              <h3 className="text-white font-semibold font-montserrat mb-4">{column.title}</h3>
              <ul className="space-y-3">
                {column.links
                  .filter(link => link.enabled)
                  .map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[#64748B] hover:text-[#37AFE1] transition-colors font-inter text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          {/* Newsletter - only show if enabled */}
          {settings.footer.showNewsletter && (
            <div>
              <h3 className="text-white font-semibold font-montserrat mb-4">Stay Updated</h3>
              <p className="text-[#64748B] font-inter text-sm mb-4">
                Subscribe to our newsletter for the latest updates.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-2 bg-[#1E293B] border border-[#37AFE1]/30 rounded-lg text-white font-inter text-sm focus:outline-none focus:border-[#37AFE1]"
                />
                <ParticleWrapper>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-[#F58122] text-white rounded-lg font-semibold text-sm hover:bg-[#e0741d] transition-colors disabled:opacity-50"
                  >
                    {submitting ? '...' : '→'}
                  </button>
                </ParticleWrapper>
              </form>
              {message && (
                <p className={`mt-2 text-xs font-inter ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {message.text}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#37AFE1]/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#64748B] font-inter text-sm">
            {copyrightText}
          </p>
          
          {/* Social Links */}
          {socialItems.length > 0 && (
            <div className="flex items-center gap-3">
              {socialItems.map(({ key, data, label, Icon }) => (
                <a
                  key={key}
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1E293B] border border-[#F58122]/50 text-[#F58122] hover:text-[#37AFE1] hover:border-[#37AFE1] transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-7 h-7" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
