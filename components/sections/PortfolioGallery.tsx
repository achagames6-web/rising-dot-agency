'use client';

import React, { useState, useEffect } from 'react';
import { Gallery, ImageModal } from '@/components/ui/react-tailwind-image-gallery';

const galleryData = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1470&auto=format&fit=crop",
    alt: "E-commerce Platform",
    title: "E-commerce Platform",
    span: "col-span-1"
  },
  {
    id: 2,
    src: "https://ix-marketing.imgix.net/focalpoint.png?q=80&w=1470&auto=format&fit=crop",
    alt: "SaaS Dashboard",
    title: "SaaS Dashboard",
    span: "sm:col-span-2"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1470&auto=format&fit=crop",
    alt: "Mobile Application",
    title: "Mobile Application",
    span: "col-span-1"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop",
    alt: "Brand Identity",
    title: "Brand Identity",
    span: "col-span-1"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1470&auto=format&fit=crop",
    alt: "Marketing Campaign",
    title: "Marketing Campaign",
    span: "sm:col-span-2"
  },
  {
    id: 6,
    src: "https://ix-marketing.imgix.net/bg-remove_after.png?q=80&w=1470&auto=format&fit=crop",
    alt: "Corporate Website",
    title: "Corporate Website",
    span: "col-span-1"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1488866022504-f2584929ca5f?q=80&w=1470&auto=format&fit=crop",
    alt: "Digital Strategy",
    title: "Digital Strategy",
    span: "col-span-1"
  },
  {
    id: 8,
    src: "https://ix-marketing.imgix.net/autocompress.png?q=80&w=1287&auto=format&fit=crop",
    alt: "Content Management",
    title: "Content Management",
    span: "col-span-1"
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1470&auto=format&fit=crop",
    alt: "Analytics Platform",
    title: "Analytics Platform",
    span: "sm:col-span-2"
  },
];

export default function PortfolioGallery() {
  const [modalImage, setModalImage] = useState<string | null>(null);

  const openModal = (src: string) => setModalImage(src);
  const closeModal = () => setModalImage(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#37AFE1]/30 bg-[#37AFE1]/10 px-5 py-2 backdrop-blur-sm">
            <span className="text-xl">✨</span>
            <span className="text-sm font-medium text-white/90">Our Portfolio</span>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>

        {/* Gradient Animated Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
                  backgroundSize: '300% 100%',
                  animation: 'gradient-shift 4s ease-in-out infinite'
                }}>
            Transforming Visions Into
          </span>{' '}
          <span className="text-white">Digital Excellence</span>
        </h2>

        {/* Description */}
        <p className="text-xl text-gray-400 text-center max-w-3xl mx-auto mb-12">
          Explore our curated collection of innovative projects that showcase cutting-edge design and powerful functionality
        </p>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryData.map((img) => (
            <div
              key={img.id}
              className={`group cursor-pointer relative overflow-hidden rounded-lg ${img.span || 'col-span-1'}`}
              onClick={() => openModal(img.src)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-[#37AFE1]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white text-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {img.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImageModal src={modalImage} onClose={closeModal} />
    </section>
  );
}
