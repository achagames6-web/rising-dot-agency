'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Direct import with error handling
const Hero3DFramerComponent = dynamic(
  () => import('./hero-3-d'),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex min-h-screen w-full items-center justify-center"
        style={{ background: 'rgb(0, 2, 15)' }}
      >
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </div>
    ),
  }
);

export default function Hero3DResponsive() {
  try {
    // @ts-ignore - Responsive property exists on Framer component
    const ResponsiveComponent = Hero3DFramerComponent?.Responsive;
    
    if (!ResponsiveComponent) {
      console.error('Responsive component not found');
      return (
        <div
          className="flex min-h-screen w-full items-center justify-center"
          style={{ background: 'rgb(0, 2, 15)' }}
        >
          <p className="text-white">Hero component loading...</p>
        </div>
      );
    }

    return (
      <Suspense
        fallback={
          <div
            className="flex min-h-screen w-full items-center justify-center"
            style={{ background: 'rgb(0, 2, 15)' }}
          >
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
          </div>
        }
      >
        <ResponsiveComponent />
      </Suspense>
    );
  } catch (error) {
    console.error('Error rendering Hero3D component:', error);
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center"
        style={{ background: 'rgb(0, 2, 15)' }}
      >
        <p className="text-white/70">Unable to load hero section</p>
      </div>
    );
  }
}
