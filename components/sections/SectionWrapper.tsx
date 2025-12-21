'use client';

import { useEffect, useState } from 'react';

interface SectionWrapperProps {
  page: string;
  section: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wrapper component that checks section visibility from CMS
 * If section is hidden (visible: false), it won't render the children
 * Optimized to fetch content with visibility in single API call
 */
export default function SectionWrapper({
  page,
  section,
  children,
  fallback = null,
}: SectionWrapperProps) {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVisibility = async () => {
      try {
        // Fetch content with visibility included (single API call instead of two)
        const res = await fetch(`/api/content?page=${page}&section=${section}&includeVisibility=true`);

        if (!res.ok) {
          // If fetch fails, default to visible
          setIsVisible(true);
          return;
        }

        const data = await res.json();
        const sectionData = data[section];
        
        // Check _visible flag from content response
        setIsVisible(sectionData?._visible !== false);
      } catch (err) {
        console.error('Error checking section visibility:', err);
        setIsVisible(true); // Default to visible on error
      } finally {
        setLoading(false);
      }
    };

    checkVisibility();
  }, [page, section]);

  // While loading, render nothing to prevent flash of hidden content
  if (loading) {
    return null;
  }

  // If hidden, don't render
  if (isVisible === false) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
