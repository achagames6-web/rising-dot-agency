'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleWrapper } from '@/components/ui/particle-button';

/**
 * ResponsivePreview Component
 * 
 * Animated device morphing between mobile, tablet, and desktop views.
 * 
 * Validates: Requirements 11.8
 */

type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface Device {
  type: DeviceType;
  name: string;
  width: number;
  height: number;
  icon: string;
}

const devices: Device[] = [
  { type: 'mobile', name: 'Mobile', width: 375, height: 667, icon: '📱' },
  { type: 'tablet', name: 'Tablet', width: 768, height: 1024, icon: '📱' },
  { type: 'desktop', name: 'Desktop', width: 1440, height: 810, icon: '🖥️' }
];

export const ResponsivePreview: React.FC = () => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');

  const currentDevice = devices.find(d => d.type === activeDevice) || devices[2];
  const scale = activeDevice === 'mobile' ? 0.8 : activeDevice === 'tablet' ? 0.8 : 0.9;

  return (
    <div className="w-full">
      {/* Device Selector */}
      <div className="flex justify-center gap-4 mb-8">
        {devices.map((device) => (
          <ParticleWrapper key={device.type}>
            <button
              onClick={() => setActiveDevice(device.type)}
              className="px-6 py-3 rounded-lg font-bold transition-all duration-300"
              style={{
                backgroundColor: activeDevice === device.type ? '#2563EB' : '#0F172A',
                color: activeDevice === device.type ? 'white' : '#64748B',
                border: `2px solid ${activeDevice === device.type ? '#2563EB' : '#1E293B'}`
              }}
            >
              <span className="mr-2">{device.icon}</span>
              {device.name}
            </button>
          </ParticleWrapper>
        ))}
      </div>

      {/* Device Preview */}
      <div className="flex justify-center items-center min-h-[600px] bg-[#0F172A] rounded-lg p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDevice}
            className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{
              opacity: 1,
              scale: scale,
              rotateY: 0,
              width: currentDevice.width,
              height: currentDevice.height
            }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            transition={{
              duration: 0.6,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
            style={{
              transformStyle: 'preserve-3d',
              perspective: 1000
            }}
          >
            {/* Device Frame */}
            {activeDevice === 'mobile' && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full" />
            )}

            {/* Content */}
            <div className="w-full h-full bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-4 overflow-auto">
              {/* Header */}
              <motion.div
                className="bg-gradient-to-r from-[#2563EB] to-[#37AFE1] rounded-lg mb-4"
                initial={{ height: 0 }}
                animate={{
                  height: activeDevice === 'mobile' ? 60 : activeDevice === 'tablet' ? 80 : 100
                }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="h-full flex items-center justify-between px-4">
                  <div className="text-white font-bold">Logo</div>
                  {activeDevice !== 'mobile' && (
                    <motion.div
                      className="flex gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {['Home', 'About', 'Services', 'Contact'].map((item) => (
                        <div key={item} className="text-white text-sm">{item}</div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Hero Section */}
              <motion.div
                className="bg-gradient-to-br from-[#2563EB]/20 to-[#37AFE1]/20 rounded-lg mb-4 flex items-center justify-center"
                initial={{ height: 0 }}
                animate={{
                  height: activeDevice === 'mobile' ? 200 : activeDevice === 'tablet' ? 300 : 400
                }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-white font-bold mb-2"
                    style={{
                      fontSize: activeDevice === 'mobile' ? '1.5rem' : activeDevice === 'tablet' ? '2rem' : '3rem'
                    }}
                  >
                    Responsive Design
                  </h2>
                  <p className="text-[#64748B]"
                    style={{
                      fontSize: activeDevice === 'mobile' ? '0.875rem' : '1rem'
                    }}
                  >
                    Adapts to every screen
                  </p>
                </motion.div>
              </motion.div>

              {/* Content Grid */}
              <motion.div
                className="grid gap-4"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  gridTemplateColumns: activeDevice === 'mobile' ? '1fr' : activeDevice === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'
                }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="bg-[#2563EB]/10 rounded-lg border border-[#2563EB]/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      height: activeDevice === 'mobile' ? 80 : 100
                    }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  />
                ))}
              </motion.div>
            </div>

            {/* Device Info */}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {currentDevice.width} × {currentDevice.height}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Device Specs */}
      <div className="text-center mt-6 text-[#64748B]">
        <p>Current viewport: {currentDevice.width}px × {currentDevice.height}px</p>
      </div>
    </div>
  );
};
