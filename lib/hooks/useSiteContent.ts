'use client';

import { useState, useEffect } from 'react';

interface ContentCache {
  [key: string]: {
    data: any;
    timestamp: number;
  };
}

const contentCache: ContentCache = {};
const CACHE_DURATION = 10 * 1000; // 10 seconds - fast CMS updates

export function useSiteContent<T = any>(page: string, section?: string) {
  const [content, setContent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const cacheKey = section ? `${page}_${section}` : page;

      // Check cache first
      const cached = contentCache[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setContent(cached.data);
        setIsVisible(cached.data?._visible !== false);
        setLoading(false);
        return;
      }

      try {
        // Fetch from static JSON file instead of API
        const res = await fetch(`/content/${page}.json`);
        if (!res.ok) throw new Error('Failed to fetch content');

        const data = await res.json();

        // If section specified, return just that section's content
        const result = section ? data[section] : data;

        // Check visibility status
        const visible = result?._visible !== false;
        setIsVisible(visible);

        // Update cache
        contentCache[cacheKey] = {
          data: result,
          timestamp: Date.now(),
        };

        setContent(result);
      } catch (err) {
        console.error('Error fetching site content:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [page, section]);

  return { content, loading, error, isVisible };
}

// Hook for fetching team members
export function useTeamMembers() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('/api/team');
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return { members, loading };
}

// Hook for fetching testimonials
export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return { testimonials, loading };
}

/**
 * Project interface for portfolio projects
 */
export interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  images: string[];
  hotspots: { x: number; y: number; title: string; description: string }[];
}

/**
 * Dedicated hook for fetching portfolio projects from CMS
 * Includes loading and error states with caching similar to useSiteContent
 * Requirements: 6.1
 */
export function usePortfolioProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const cacheKey = 'portfolio_projects';

      // Check cache first
      const cached = contentCache[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setProjects(cached.data);
        setLoading(false);
        return;
      }

      try {
        // Fetch from static JSON file instead of API
        const res = await fetch('/content/portfolio.json');
        if (!res.ok) throw new Error('Failed to fetch portfolio projects');

        const data = await res.json();
        const projectsData = data.projects?.projects || [];

        // Update cache
        contentCache[cacheKey] = {
          data: projectsData,
          timestamp: Date.now(),
        };

        setProjects(projectsData);
      } catch (err) {
        console.error('Error fetching portfolio projects:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
}

/**
 * Hook to check if a specific section is visible
 * Returns true if section is visible or not configured (default visible)
 */
export function useSectionVisibility(page: string, section: string) {
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVisibility = async () => {
      try {
        // Fetch from static JSON file instead of API
        const res = await fetch(`/content/${page}.json`);
        if (!res.ok) {
          setIsVisible(true); // Default to visible if fetch fails
          return;
        }

        const data = await res.json();
        const sectionData = data[section];

        // Section is visible if _visible is not explicitly false
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

  return { isVisible, loading };
}
