'use client';

import React, { useState, useEffect } from 'react';
import {
  Gallery,
  ImageModal,
} from '@/components/ui/react-tailwind-image-gallery';

const galleryData = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1470&auto=format&fit=crop',
    alt: 'E-commerce Platform',
    title: 'E-commerce Platform',
    span: 'col-span-1',
  },
  {
    id: 2,
    src: 'https://ix-marketing.imgix.net/focalpoint.png?q=80&w=1470&auto=format&fit=crop',
    alt: 'SaaS Dashboard',
    title: 'SaaS Dashboard',
    span: 'sm:col-span-2',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1470&auto=format&fit=crop',
    alt: 'Mobile Application',
    title: 'Mobile Application',
    span: 'col-span-1',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop',
    alt: 'Brand Identity',
    title: 'Brand Identity',
    span: 'col-span-1',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1470&auto=format&fit=crop',
    alt: 'Marketing Campaign',
    title: 'Marketing Campaign',
    span: 'sm:col-span-2',
  },
  {
    id: 6,
    src: 'https://ix-marketing.imgix.net/bg-remove_after.png?q=80&w=1470&auto=format&fit=crop',
    alt: 'Corporate Website',
    title: 'Corporate Website',
    span: 'col-span-1',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1488866022504-f2584929ca5f?q=80&w=1470&auto=format&fit=crop',
    alt: 'Digital Strategy',
    title: 'Digital Strategy',
    span: 'col-span-1',
  },
  {
    id: 8,
    src: 'https://ix-marketing.imgix.net/autocompress.png?q=80&w=1287&auto=format&fit=crop',
    alt: 'Content Management',
    title: 'Content Management',
    span: 'col-span-1',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1470&auto=format&fit=crop',
    alt: 'Analytics Platform',
    title: 'Analytics Platform',
    span: 'sm:col-span-2',
  },
];

export default function PortfolioGallery() {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [modalAlt, setModalAlt] = useState<string>('');

  const openModal = (src: string, alt: string) => {
    setModalImage(src);
    setModalAlt(alt);
  };
  const closeModal = () => {
    setModalImage(null);
    setModalAlt('');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="bg-black py-20">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#37AFE1]/30 bg-[#37AFE1]/10 px-5 py-2 backdrop-blur-sm">
            <span className="text-xl">✨</span>
            <span className="text-sm font-medium text-white/90">
              Our Portfolio
            </span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
          </div>
        </div>

        {/* Gradient Animated Heading */}
        <h2 className="mb-4 text-center text-4xl font-bold md:text-5xl">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
              backgroundSize: '300% 100%',
              animation: 'gradient-shift 4s ease-in-out infinite',
            }}
          >
            Transforming Visions Into
          </span>{' '}
          <span className="text-white">Digital Excellence</span>
        </h2>

        {/* Description */}
        <p className="mx-auto mb-12 max-w-3xl text-center text-xl text-gray-400">
          Explore our curated collection of innovative projects that showcase
          cutting-edge design and powerful functionality
        </p>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {galleryData.map((img) => (
            <div
              key={img.id}
              className={`group relative cursor-pointer overflow-hidden rounded-lg ${img.span || 'col-span-1'}`}
              onClick={() => openModal(img.src, img.alt)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/90 via-[#37AFE1]/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="translate-y-4 transform text-lg font-medium text-white transition-transform duration-300 group-hover:translate-y-0">
                  {img.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImageModal src={modalImage} alt={modalAlt} onClose={closeModal} />
    </section>
  );
}
