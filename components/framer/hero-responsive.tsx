'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Loading fallback component
const HeroLoadingFallback = () => (
  <div
    className="flex min-h-screen w-full items-center justify-center"
    style={{ background: 'rgb(0, 2, 15)' }}
  >
    <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
  </div>
);

// Error fallback component
const HeroErrorFallback = ({ message }: { message: string }) => (
  <div
    className="flex min-h-screen w-full items-center justify-center"
    style={{ background: 'rgb(0, 2, 15)' }}
  >
    <p className="text-white/70">{message}</p>
  </div>
);

// Direct import with error handling
const Hero3DFramerComponent = dynamic(() => import('./hero-3-d'), {
  ssr: false,
  loading: () => <HeroLoadingFallback />,
});

export default function Hero3DResponsive() {
  try {
    // Access Responsive variant - using type assertion for better type safety
    const ResponsiveComponent = (Hero3DFramerComponent as any)?.Responsive;

    if (!ResponsiveComponent) {
      console.error('Responsive component not found');
      return <HeroErrorFallback message="Hero component loading..." />;
    }

    return (
      <Suspense fallback={<HeroLoadingFallback />}>
        <ResponsiveComponent />
      </Suspense>
    );
  } catch (error) {
    console.error('Error rendering Hero3D component:', error);
    return <HeroErrorFallback message="Unable to load hero section" />;
  }
}
