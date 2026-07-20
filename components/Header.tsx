'use client';

// components/Header.tsx
// Full-width bar rather than a floating pill: it sits over the hero without
// competing with it, and the hero's own shortcut nav is gone so there is only
// one navigation on screen.
//
// The signature is the dot. Active and hovered links get a small orange dot -
// the brand mark used as punctuation instead of drawn as an illustration.
//
// The CMS contract from useNavigation is unchanged: logo, navLinks,
// serviceLinks and ctaButton all still drive this.

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/lib/hooks/useNavigation';
import './header.css';

export default function Header() {
  const pathname = usePathname();
  const { settings } = useNavigation();

  const [hidden, setHidden] = useState(false);
  const [lifted, setLifted] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const lastY = useRef(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navLinks = settings.header.navLinks
    .filter((l) => l.enabled)
    .sort((a, b) => a.order - b.order);

  const serviceLinks = settings.header.serviceLinks
    .filter((l) => l.enabled)
    .sort((a, b) => a.order - b.order);

  const cta = settings.header.ctaButton;

  // next/image rejects remote hosts that are not in next.config remotePatterns.
  // The CMS can set any logo URL, so anything not served from this origin
  // falls back rather than throwing at render time.
  const logo = settings.header.logo;
  const logoSrc = logo && logo.startsWith('/') ? logo : '/logo.png';

  // Hide going down, show coming back up. Gain a surface once off the top.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setLifted(y > 24);
      if (y < 96) setHidden(false);
      else if (y > lastY.current + 4) {
        setHidden(true);
        setServicesOpen(false);
      } else if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Route change closes everything.
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Escape closes the panel; lock the page while the mobile menu is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setServicesOpen(false);
      setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const openServices = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  }, []);

  const closeServices = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 160);
  }, []);

  const isActive = (href: string, dropdown?: boolean) =>
    dropdown ? !!pathname?.startsWith('/services') : pathname === href;

  return (
    <header
      className={[
        'rdh',
        hidden ? 'is-hidden' : '',
        lifted ? 'is-lifted' : '',
        menuOpen ? 'is-open' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="rdh__bar">
        <Link href="/" className="rdh__logo" aria-label="Rising Dot, home">
          <Image
            src={logoSrc}
            alt="Rising Dot"
            width={140}
            height={40}
            priority
          />
        </Link>

        <nav className="rdh__nav" aria-label="Main">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div
                key={link.href}
                className="rdh__group"
                onMouseEnter={openServices}
                onMouseLeave={closeServices}
              >
                <button
                  type="button"
                  className={`rdh__link ${isActive(link.href, true) ? 'is-active' : ''}`}
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                  onClick={() => setServicesOpen((v) => !v)}
                >
                  <span className="rdh__dot" aria-hidden="true" />
                  {link.label}
                  <span
                    className={`rdh__chev ${servicesOpen ? 'is-up' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`rdh__link ${isActive(link.href) ? 'is-active' : ''}`}
              >
                <span className="rdh__dot" aria-hidden="true" />
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="rdh__right">
          {cta.enabled && (
            <Link href={cta.href} className="rdh__cta">
              {cta.label}
            </Link>
          )}

          <button
            type="button"
            className="rdh__burger"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Services panel: full width, aligned to the bar, so it reads as part
          of the page rather than a bubble floating over it. */}
      {serviceLinks.length > 0 && (
        <div
          className={`rdh__panel ${servicesOpen ? 'is-open' : ''}`}
          onMouseEnter={openServices}
          onMouseLeave={closeServices}
        >
          <div className="rdh__panel-inner">
            <p className="rdh__panel-lead">What we build</p>
            <ul className="rdh__panel-list">
              {serviceLinks.map((s, i) => (
                <li key={s.href}>
                  <Link href={s.href}>
                    <span className="rdh__panel-num">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      <div className="rdh__sheet" hidden={!menuOpen}>
        <nav aria-label="Mobile">
          {navLinks
            .filter((l) => !l.hasDropdown)
            .map((l) => (
              <Link key={l.href} href={l.href} className="rdh__sheet-link">
                {l.label}
              </Link>
            ))}
        </nav>

        <p className="rdh__sheet-lead">Services</p>
        <nav aria-label="Services">
          {serviceLinks.map((s) => (
            <Link key={s.href} href={s.href} className="rdh__sheet-sub">
              {s.label}
            </Link>
          ))}
        </nav>

        {cta.enabled && (
          <Link href={cta.href} className="rdh__cta rdh__cta--block">
            {cta.label}
          </Link>
        )}
      </div>
    </header>
  );
}
