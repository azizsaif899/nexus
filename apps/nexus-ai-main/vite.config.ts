import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@styles': path.resolve(__dirname, './styles'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: false,
    open: false,
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,

    // Code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/app-check'],
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Ensure proper format for ES modules
        format: 'es',
      },
    },

    // Optimize chunk size warning limit
    chunkSizeWarningLimit: 500,

    // Terser options for better minification
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        pure_getters: true,
        unsafe_arrows: true,
        unsafe_methods: true,
      },
      mangle: {
        safari10: true,
      },
      format: {
        safari10: true,
      },
    },
  },

  // Optimize dependencies for speed
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
    ],
    exclude: [
      '@google/generative-ai',
      'motion/react',
      'lucide-react'
    ],
    esbuildOptions: {
      target: 'es2020',
    },
  },

  // CSS optimization
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      scss: {
        charset: false,
      },
    },
  },

  // Preview server configuration
  preview: {
    port: 4173,
    open: true,
    host: true,
    headers: {
      'Content-Type': 'application/javascript',
    },
  },

  // Define server headers for development and preview
  define: {
    __VITE_IS_MODERN_BUILD__: true,
  },
});
