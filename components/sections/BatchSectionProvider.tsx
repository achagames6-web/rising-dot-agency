'use client';

import { createContext, useContext, ReactNode } from 'react';

interface SectionVisibility {
  [section: string]: boolean;
}

interface BatchSectionContextType {
  visibility: SectionVisibility;
  loading: boolean;
}

const BatchSectionContext = createContext<BatchSectionContextType>({
  visibility: {},
  loading: false,
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
 * Simplified: All sections are visible by default.
 * No API call needed since admin panel has been removed.
 */
export function BatchSectionProvider({
  sections,
  children,
}: BatchSectionProviderProps) {
  // All sections visible by default
  const visibility: SectionVisibility = {};
  sections.forEach((s) => (visibility[s] = true));

  return (
    <BatchSectionContext.Provider value={{ visibility, loading: false }}>
      {children}
    </BatchSectionContext.Provider>
  );
}
