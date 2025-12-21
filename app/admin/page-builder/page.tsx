'use client';

import { useState, useEffect } from 'react';
import { PageBuilder } from '@/components/admin/PageBuilder';
import type { PlacedComponent } from '@/components/admin/PageBuilder';

export default function PageBuilderPage() {
  const [initialComponents, setInitialComponents] = useState<PlacedComponent[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load existing page data (if any)
  useEffect(() => {
    // In a real implementation, this would fetch from the database
    // For now, we'll just use an empty array
    setInitialComponents([]);
    setIsLoading(false);
  }, []);

  const handleSave = async (components: PlacedComponent[]) => {
    // In a real implementation, this would save to the database via API
    console.log('Saving components:', components);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store in localStorage for demo purposes
    localStorage.setItem('pageBuilderComponents', JSON.stringify(components));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="text-lg text-white">Loading page builder...</div>
      </div>
    );
  }

  return (
    <PageBuilder
      pageId="homepage"
      initialComponents={initialComponents}
      onSave={handleSave}
    />
  );
}
