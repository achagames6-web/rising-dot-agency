'use client';

/**
 * Wrapper for Framer Hero 3D Responsive variant
 * This wrapper is necessary to avoid Next.js server/client boundary issues
 * when dynamically importing with property access
 */
import Hero3DFramerComponent from './hero-3-d';

export default function Hero3DResponsive() {
  return <Hero3DFramerComponent.Responsive />;
}
