'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';
import { useNavigation } from '@/lib/hooks/useNavigation';

// Magnetic Nav Link with dock-style hover effect
function MagneticNavLink({ 
  href, 
  label, 
  isActive,
  hasDropdown,
  isDropdownOpen,
  onMouseEnter,
  onMouseLeave,
}: { 
  href: string; 
  label: string; 
  isActive: boolean;
  hasDropdown?: boolean;
  isDropdownOpen?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const linkRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;
    setMagneticOffset({ x: deltaX, y: deltaY });
  }, []);

  const handleMouseLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
    setIsHovered(false);
    onMouseLeave?.();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const content = (
    <>
      <motion.span 
        className="relative z-10"
        animate={{
          x: magneticOffset.x,
          y: magneticOffset.y,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {label}
        {hasDropdown && (
          <svg
            className={`inline-block w-3 h-3 ml-1 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </motion.span>
      
      {/* Glowing ring effect on hover */}
      {isHovered && (
        <motion.span
          className="absolute inset-0 rounded-full border border-[#37AFE1]/40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            boxShadow: '0 0 15px rgba(55, 175, 225, 0.3)',
          }}
        />
      )}
      
      {/* Active state with tubelight lamp effect */}
      {isActive && (
        <motion.div
          layoutId="lamp"
          className="absolute inset-0 w-full bg-[#F58122]/5 rounded-full -z-10"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#F58122] rounded-t-full">
            <div className="absolute w-12 h-6 bg-[#F58122]/20 rounded-full blur-md -top-2 -left-2" />
            <div className="absolute w-8 h-6 bg-[#F58122]/20 rounded-full blur-md -top-1" />
            <div className="absolute w-4 h-4 bg-[#F58122]/20 rounded-full blur-sm top-0 left-2" />
          </div>
        </motion.div>
      )}
    </>
  );

  if (hasDropdown) {
    return (
      <motion.button
        ref={linkRef as React.RefObject<HTMLButtonElement>}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          scale: isHovered ? 1.1 : 1,
          rotate: isHovered ? -3 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors duration-200"
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.div
      animate={{
        scale: isHovered ? 1.1 : 1,
        rotate: isHovered ? -3 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        ref={linkRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative block px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors duration-200"
      >
        {content}
      </Link>
    </motion.div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { settings } = useNavigation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout>();

  // Get enabled nav links from settings
  const navLinks = settings.header.navLinks
    .filter(link => link.enabled)
    .sort((a, b) => a.order - b.order);

  // Get enabled service links from settings
  const serviceLinks = settings.header.serviceLinks
    .filter(link => link.enabled)
    .sort((a, b) => a.order - b.order);

  // Scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsServicesOpen(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsServicesOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 150);
  };

  return (
    <>
      <header
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out"
        style={{
          transform: `translateX(-50%) translateY(${isVisible ? '0%' : '-150%'})`,
        }}
      >
        <nav 
          className="relative flex items-center justify-center gap-1 px-2 py-3 rounded-full backdrop-blur-2xl"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: `
              0 4px 30px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300 hover:bg-white/5"
          >
            <img 
              src={settings.header.logo || '/logo.png'}
              alt="Rising Dot" 
              className="h-10 w-auto"
            />
          </Link>

          <div className="w-px h-6 bg-white/10 mx-1 hidden md:block" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {navLinks.map((link) => (
              <div 
                key={link.href} 
                className="relative"
                onMouseEnter={link.hasDropdown ? handleDropdownEnter : undefined}
                onMouseLeave={link.hasDropdown ? handleDropdownLeave : undefined}
              >
                <MagneticNavLink
                  href={link.href}
                  label={link.label}
                  isActive={link.hasDropdown 
                    ? pathname?.startsWith('/services') || false
                    : pathname === link.href
                  }
                  hasDropdown={link.hasDropdown}
                  isDropdownOpen={isServicesOpen}
                  onMouseEnter={link.hasDropdown ? handleDropdownEnter : undefined}
                  onMouseLeave={link.hasDropdown ? handleDropdownLeave : undefined}
                />

                {/* Services Dropdown */}
                {link.hasDropdown && serviceLinks.length > 0 && (
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${
                      isServicesOpen 
                        ? 'opacity-100 visible translate-y-0' 
                        : 'opacity-0 invisible -translate-y-4 pointer-events-none'
                    }`}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <div className="absolute -top-2 left-0 right-0 h-6 bg-transparent" />
                    
                    <div
                      className="w-56 rounded-2xl backdrop-blur-xl overflow-hidden"
                      style={{
                        background: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(55, 175, 225, 0.2)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(55, 175, 225, 0.1)',
                      }}
                    >
                      <div className="p-2">
                        {serviceLinks.map((service) => (
                          <Link
                            key={service.href}
                            href={service.href}
                            className="block px-4 py-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            {service.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="w-px h-6 bg-white/10 mx-1 hidden md:block" />

          {/* CTA Button - only show if enabled */}
          {settings.header.ctaButton.enabled && (
            <ParticleWrapper className="hidden md:block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={settings.header.ctaButton.href}>
                  <StarButton className="px-5 py-2 text-sm">
                    {settings.header.ctaButton.label}
                  </StarButton>
                </Link>
              </motion.div>
            </ParticleWrapper>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-white hover:bg-white/10 transition-colors ml-2"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[calc(100vw-3rem)] max-w-sm rounded-2xl backdrop-blur-xl overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen 
              ? 'opacity-100 visible translate-y-0' 
              : 'opacity-0 invisible -translate-y-4 pointer-events-none'
          }`}
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div className="p-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <div key={link.href}>
                {link.hasDropdown ? (
                  <>
                    <button
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/5 transition-all duration-200"
                    >
                      {link.label}
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isServicesOpen ? 'max-h-96' : 'max-h-0'}`}>
                      <div className="pl-4 py-2 flex flex-col gap-1">
                        {serviceLinks.map((service) => (
                          <Link
                            key={service.href}
                            href={service.href}
                            className="px-4 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {service.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`relative block px-4 py-3 rounded-xl transition-all duration-200 ${
                      pathname === link.href 
                        ? 'text-white bg-white/10' 
                        : 'text-white/90 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {pathname === link.href && (
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#F58122] rounded-t-full">
                        <div className="absolute w-12 h-6 bg-[#F58122]/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-[#F58122]/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-[#F58122]/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    )}
                    <span className="flex items-center gap-2">
                      {link.label}
                    </span>
                  </Link>
                )}
              </div>
            ))}
            
            {/* Mobile CTA - only show if enabled */}
            {settings.header.ctaButton.enabled && (
              <ParticleWrapper>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={settings.header.ctaButton.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <StarButton className="mt-2 w-full px-5 py-3 text-sm">
                      {settings.header.ctaButton.label}
                    </StarButton>
                  </Link>
                </motion.div>
              </ParticleWrapper>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
