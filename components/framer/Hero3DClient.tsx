'use client';

import { Suspense } from 'react';
import Hero3DFramerComponent from './hero-3-d';

/**
 * Client-side wrapper for Framer Hero 3D component
 * This wrapper handles the .Responsive property access in a client context
 * to avoid Next.js server/client boundary issues
 */
export default function Hero3DClient() {
  // Access the Responsive property in client component context
  // Type assertion needed because:
  // 1. hero-3-d.jsx is auto-generated JavaScript with @ts-nocheck
  // 2. The .Responsive property is added dynamically at runtime by Framer
  // 3. Creating type definitions for generated Framer code would break on regeneration
  const ResponsiveHero = (Hero3DFramerComponent as any).Responsive;

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
      <ResponsiveHero />
    </Suspense>
  );
}
