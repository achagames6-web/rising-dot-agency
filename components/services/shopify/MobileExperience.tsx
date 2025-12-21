'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MobileProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface MobileFeature {
  icon: string;
  title: string;
  desc: string;
}

export interface MobileExperienceProps {
  products?: MobileProduct[];
  features?: MobileFeature[];
  shopTitle?: string;
  shopSubtitle?: string;
  checkoutText?: string;
  continueShoppingText?: string;
  addedToCartText?: string;
  featuresTitle?: string;
}

const defaultProducts: MobileProduct[] = [
  { id: 1, name: 'Premium Headphones', price: 299, image: '🎧' },
  { id: 2, name: 'Smart Watch', price: 399, image: '⌚' },
  { id: 3, name: 'Wireless Earbuds', price: 199, image: '🎵' }
];

const defaultFeatures: MobileFeature[] = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized for mobile performance' },
  { icon: '👆', title: 'Touch Optimized', desc: 'Intuitive gestures and interactions' },
  { icon: '🎨', title: 'Beautiful Design', desc: 'Stunning visuals on any screen' },
  { icon: '🔒', title: 'Secure Checkout', desc: 'Safe and encrypted transactions' }
];

/**
 * MobileExperience Component
 * 
 * Mobile experience preview showing responsive e-commerce interface.
 * Demonstrates touch-optimized shopping experience with smooth animations.
 * 
 * Validates: Requirements 13.1-13.8 (mobile optimization aspect)
 */
export function MobileExperience({
  products: propProducts,
  features: propFeatures,
  shopTitle = 'Shop',
  shopSubtitle = 'Discover amazing products',
  checkoutText = 'Checkout',
  continueShoppingText = 'Continue Shopping',
  addedToCartText = 'Added to Cart!',
  featuresTitle = 'Mobile-First Experience'
}: MobileExperienceProps) {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'product' | 'cart'>('home');
  const [cartItems, setCartItems] = useState(0);

  const products = propProducts && propProducts.length > 0 ? propProducts : defaultProducts;
  const features = propFeatures && propFeatures.length > 0 ? propFeatures : defaultFeatures;

  const handleAddToCart = () => {
    setCartItems(prev => prev + 1);
    setCurrentScreen('cart');
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
      {/* Mobile Device Frame */}
      <div className="relative">
        {/* Phone frame */}
        <div className="relative w-[375px] h-[667px] bg-[#1E293B] rounded-[3rem] p-4 shadow-2xl border-8 border-[#0F172A]">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-[#0F172A] rounded-b-3xl z-20" />

          {/* Screen */}
          <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
            {/* Status bar */}
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/10 to-transparent z-10 flex items-center justify-between px-6 pt-2">
              <span className="text-xs font-semibold">9:41</span>
              <div className="flex gap-1">
                <div className="w-4 h-3 border border-black/30 rounded-sm" />
                <div className="w-4 h-3 border border-black/30 rounded-sm" />
                <div className="w-4 h-3 border border-black/30 rounded-sm" />
              </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {currentScreen === 'home' && (
                <motion.div
                  key="home"
                  className="h-full overflow-y-auto pt-12"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header */}
                  <div className="p-6 bg-gradient-to-r from-[#2563EB] to-[#F97316] text-white">
                    <h2 className="text-2xl font-bold mb-2">{shopTitle}</h2>
                    <p className="text-sm opacity-90">{shopSubtitle}</p>
                  </div>

                  {/* Products Grid */}
                  <div className="p-4 space-y-4">
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentScreen('product')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-5xl">{product.image}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-[#2563EB] font-bold">${product.price}</p>
                          </div>
                          <button className="px-4 py-2 bg-[#F97316] text-white rounded-lg text-sm font-semibold">
                            View
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentScreen === 'product' && (
                <motion.div
                  key="product"
                  className="h-full overflow-y-auto pt-12"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Back button */}
                  <button
                    className="absolute top-14 left-4 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
                    onClick={() => setCurrentScreen('home')}
                  >
                    ←
                  </button>

                  {/* Product Image */}
                  <div className="h-64 bg-gradient-to-br from-[#2563EB] to-[#F97316] flex items-center justify-center">
                    <motion.div
                      className="text-9xl"
                      animate={{
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      🎧
                    </motion.div>
                  </div>

                  {/* Product Details */}
                  <div className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Premium Headphones</h2>
                    <p className="text-3xl font-bold text-[#2563EB]">$299</p>
                    <p className="text-gray-600">
                      Experience crystal-clear audio with our premium wireless headphones.
                      Active noise cancellation and 30-hour battery life.
                    </p>

                    {/* Color options */}
                    <div className="flex gap-3">
                      {['#1E293B', '#2563EB', '#F97316'].map((color, i) => (
                        <motion.button
                          key={color}
                          className="w-10 h-10 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: color }}
                          whileTap={{ scale: 0.9 }}
                        />
                      ))}
                    </div>

                    {/* Add to cart button */}
                    <motion.button
                      className="w-full py-4 bg-gradient-to-r from-[#F97316] to-[#2563EB] text-white font-bold rounded-xl"
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {currentScreen === 'cart' && (
                <motion.div
                  key="cart"
                  className="h-full overflow-y-auto pt-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Back button */}
                  <button
                    className="absolute top-14 left-4 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
                    onClick={() => setCurrentScreen('home')}
                  >
                    ←
                  </button>

                  {/* Success animation */}
                  <div className="h-full flex flex-col items-center justify-center p-6">
                    <motion.div
                      className="w-24 h-24 bg-[#F97316] rounded-full flex items-center justify-center mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                      <motion.div
                        className="text-5xl"
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        ✓
                      </motion.div>
                    </motion.div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{addedToCartText}</h2>
                    <p className="text-gray-600 text-center mb-6">
                      {cartItems} {cartItems === 1 ? 'item' : 'items'} in your cart
                    </p>

                    <motion.button
                      className="w-full py-4 bg-gradient-to-r from-[#2563EB] to-[#F97316] text-white font-bold rounded-xl mb-3"
                      whileTap={{ scale: 0.98 }}
                    >
                      {checkoutText}
                    </motion.button>

                    <button
                      className="w-full py-4 bg-gray-100 text-gray-900 font-bold rounded-xl"
                      onClick={() => setCurrentScreen('home')}
                    >
                      {continueShoppingText}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cart badge */}
            {cartItems > 0 && (
              <motion.div
                className="absolute top-14 right-4 w-10 h-10 bg-[#EF4444] rounded-full flex items-center justify-center text-white font-bold shadow-lg z-20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {cartItems}
              </motion.div>
            )}
          </div>
        </div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-[3rem] -z-10"
          style={{
            background: 'radial-gradient(circle, rgba(37,99,235,0.3), transparent)',
            filter: 'blur(40px)'
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* Features List */}
      <div className="space-y-6 max-w-md">
        <h3 className="text-3xl font-bold text-white mb-8">{featuresTitle}</h3>

        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="flex items-start gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-4xl">{feature.icon}</div>
            <div>
              <h4 className="text-xl font-bold text-white mb-1">{feature.title}</h4>
              <p className="text-white/60">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
