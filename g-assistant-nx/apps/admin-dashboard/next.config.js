/**
 * ⚡ Next.js Configuration - TASK-011
 * تحسين الأداء مع Vercel Edge Functions
 */

const { withNx } = require('@nx/next/plugins/with-nx');

/** @type {import('next').NextConfig} */
const nextConfig = {
  nx: {
    svgr: false,
  },
  
  // تحسينات الأداء
  experimental: {
    // تفعيل App Router
    appDir: true,
    
    // تحسين الصور
    optimizePackageImports: ['framer-motion', '@mui/material'],
    
    // Edge Runtime للصفحات السريعة
    runtime: 'nodejs',
  },

  // ضغط الاستجابات
  compress: true,

  // تحسين الصور
  images: {
    domains: ['localhost', 'azizsys.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Headers للأمان والأداء
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Performance headers
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' ? 'https://azizsys.com' : '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },

  // إعادة كتابة URLs
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_URL ? `${process.env.API_URL}/:path*` : '/api/:path*',
      },
    ];
  },

  // تحسين Bundle
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // تحسين حجم Bundle
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    };

    // تحسين Tree Shaking
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
      '@components': require('path').resolve(__dirname, 'src/components'),
      '@animations': require('path').resolve(__dirname, 'src/animations'),
    };

    return config;
  },

  // متغيرات البيئة العامة
  env: {
    NEXT_PUBLIC_APP_NAME: 'AzizSys AI Assistant v2.0',
    NEXT_PUBLIC_APP_VERSION: '2.0.0',
  },

  // إعدادات TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // إعدادات ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },

  // تحسين الخطوط
  optimizeFonts: true,

  // تحسين CSS
  optimizeCss: true,

  // تفعيل SWC Minifier
  swcMinify: true,

  // إعدادات الإنتاج
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
    generateEtags: false,
    poweredByHeader: false,
  }),
};

module.exports = withNx(nextConfig);