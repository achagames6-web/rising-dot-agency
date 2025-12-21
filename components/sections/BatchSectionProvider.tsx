'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

interface SectionVisibility {
  [section: string]: boolean;
}

interface BatchSectionContextType {
  visibility: SectionVisibility;
  loading: boolean;
}

const BatchSectionContext = createContext<BatchSectionContextType>({
  visibility: {},
  loading: true,
});

export function useBatchSection(section: string) {
  const context = useContext(BatchSectionContext);
  return {
    isVisible: context.visibility[section] !== false,
    loading: context.loading,
  };
}

interface BatchSectionProviderProps {
  page: string;
  sections: string[];
  children: ReactNode;
}

/**
 * Batch fetch all section visibility in one API call
 * Reduces 15 API calls per page to just 1 call
 */
export function BatchSectionProvider({
  page,
  sections,
  children,
}: BatchSectionProviderProps) {
  const [visibility, setVisibility] = useState<SectionVisibility>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        // Fetch all sections in one API call
        const sectionList = sections.join(',');
        const res = await fetch(
          `/api/content?page=${page}&sections=${sectionList}&includeVisibility=true`
        );

        if (!res.ok) {
          // Default all to visible on error
          const defaultVisibility: SectionVisibility = {};
          sections.forEach((s) => (defaultVisibility[s] = true));
          setVisibility(defaultVisibility);
          return;
        }

        const data = await res.json();

        // Extract visibility for each section
        const visibilityMap: SectionVisibility = {};
        sections.forEach((section) => {
          visibilityMap[section] = data[section]?._visible !== false;
        });

        setVisibility(visibilityMap);
      } catch (err) {
        console.error('Error fetching batch sections:', err);
        // Default all to visible on error
        const defaultVisibility: SectionVisibility = {};
        sections.forEach((s) => (defaultVisibility[s] = true));
        setVisibility(defaultVisibility);
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [page, sections]);

  return (
    <BatchSectionContext.Provider value={{ visibility, loading }}>
      {children}
    </BatchSectionContext.Provider>
  );
}
