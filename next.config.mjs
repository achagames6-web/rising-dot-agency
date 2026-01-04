/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'gsap',
      'framer-motion',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'lenis',
    ],
  },

  // Transpile packages for unframer compatibility
  transpilePackages: ['unframer', '@motionone/dom'],

  // Webpack configuration for code splitting
  webpack: (config, { isServer }) => {
    // Suppress cache serialization warnings
    config.infrastructureLogging = {
      level: 'error',
    };

    // Code splitting for animation libraries
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // GSAP bundle
            gsap: {
              test: /[\\/]node_modules[\\/](gsap)[\\/]/,
              name: 'gsap',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Three.js bundle
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: 'three',
              priority: 25,
              reuseExistingChunk: true,
            },
            // Framer Motion bundle
            framerMotion: {
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              name: 'framer-motion',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Other vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },

  // Headers for performance and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Resource hints
          {
            key: 'Link',
            value:
              '<https://fonts.googleapis.com>; rel=preconnect; crossorigin',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "media-src 'self' https:",
              "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com",
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
          // Strict Transport Security (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // X-Frame-Options
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // X-Content-Type-Options
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // X-DNS-Prefetch-Control
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          // API-specific headers
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          // Cache control for static assets
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
