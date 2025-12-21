'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export interface ComponentDefinition {
  id: string;
  type: string;
  name: string;
  icon: string;
  category: 'layout' | 'content' | 'media' | 'interactive';
  defaultProps: Record<string, any>;
}

const AVAILABLE_COMPONENTS: ComponentDefinition[] = [
  {
    id: 'hero',
    type: 'hero',
    name: 'Hero Section',
    icon: '🎯',
    category: 'layout',
    defaultProps: {
      title: 'Hero Title',
      subtitle: 'Hero Subtitle',
      particleCount: 5000,
    },
  },
  {
    id: 'value-prop',
    type: 'value-proposition',
    name: 'Value Proposition',
    icon: '💎',
    category: 'content',
    defaultProps: {
      headline: 'Our Value',
      services: [],
    },
  },
  {
    id: 'service-cards',
    type: 'service-cards',
    name: 'Service Cards',
    icon: '🎴',
    category: 'content',
    defaultProps: {
      cards: [],
    },
  },
  {
    id: 'case-study',
    type: 'case-study',
    name: 'Case Study',
    icon: '📊',
    category: 'content',
    defaultProps: {
      title: 'Case Study',
      metrics: [],
    },
  },
  {
    id: 'testimonials',
    type: 'testimonials',
    name: 'Testimonials',
    icon: '💬',
    category: 'content',
    defaultProps: {
      testimonials: [],
    },
  },
  {
    id: 'cta',
    type: 'cta',
    name: 'Call to Action',
    icon: '🎯',
    category: 'interactive',
    defaultProps: {
      title: 'Get Started',
      buttonText: 'Contact Us',
    },
  },
  {
    id: 'text-block',
    type: 'text',
    name: 'Text Block',
    icon: '📝',
    category: 'content',
    defaultProps: {
      content: 'Enter your text here',
    },
  },
  {
    id: 'image',
    type: 'image',
    name: 'Image',
    icon: '🖼️',
    category: 'media',
    defaultProps: {
      src: '',
      alt: '',
    },
  },
];

interface ComponentPaletteProps {
  onDragStart: (component: ComponentDefinition) => void;
}

export default function ComponentPalette({
  onDragStart,
}: ComponentPaletteProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'layout', 'content', 'media', 'interactive'];

  const filteredComponents =
    selectedCategory === 'all'
      ? AVAILABLE_COMPONENTS
      : AVAILABLE_COMPONENTS.filter((c) => c.category === selectedCategory);

  const handleDragStart = (
    e: React.DragEvent,
    component: ComponentDefinition
  ) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    onDragStart(component);
  };

  return (
    <div className="w-64 overflow-y-auto border-r border-slate-700 bg-[#1E293B] p-4">
      <h2 className="mb-4 text-lg font-semibold text-white">Components</h2>

      {/* Category Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded px-3 py-1 text-sm capitalize transition-colors ${
              selectedCategory === category
                ? 'bg-[#2563EB] text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Component List */}
      <div className="space-y-2">
        {filteredComponents.map((component) => (
          <motion.div
            key={component.id}
            draggable
            onDragStart={(e) => handleDragStart(e as any, component)}
            className="cursor-move rounded bg-slate-700 p-3 transition-colors hover:bg-slate-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{component.icon}</span>
              <div>
                <div className="text-sm font-medium text-white">
                  {component.name}
                </div>
                <div className="text-xs capitalize text-slate-400">
                  {component.category}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
