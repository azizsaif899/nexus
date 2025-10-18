import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Use SWC for faster builds
      jsxImportSource: 'react',
    }),
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/styles': path.resolve(__dirname, './styles'),
      '@/types': path.resolve(__dirname, './types'),
      '@/services': path.resolve(__dirname, './services'),
      '@/config': path.resolve(__dirname, './config'),
    },
  },
  
  server: {
    port: 4100,
    host: true,
    open: true,
    strictPort: true,
  },
  
  preview: {
    port: 4200,
    host: true,
    strictPort: true,
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production for smaller size
    minify: 'esbuild',
    target: 'es2020',
    cssCodeSplit: true, // Split CSS for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'react-query': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          'motion-vendor': ['motion'],
          'dnd-vendor': ['react-dnd', 'react-dnd-html5-backend'],
          'charts': ['recharts'],
          'utils': ['dayjs', 'clsx', 'tailwind-merge'],
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
        },
        // Better asset naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable compression hints
    reportCompressedSize: true,
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'motion',
      'react-dnd',
      'react-dnd-html5-backend',
      'lucide-react',
      'sonner',
    ],
  },
  
  css: {
    postcss: './postcss.config.js',
    devSourcemap: true,
  },
  
  // Performance optimizations
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  
  // Environment variables
  envPrefix: 'VITE_',
});
