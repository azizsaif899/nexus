import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      // Optimize React for production
      babel: {
        plugins: [
          // Remove prop-types in production
          ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }],
        ],
      },
    }),
  ],
  
  define: {
    // Replace development React with production
    'process.env.NODE_ENV': JSON.stringify('production'),
    __DEV__: false,
  },
  
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
    // Enable HTTP/2 for better performance
    https: false,
    // Optimize HMR
    hmr: {
      overlay: false,
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 2048, // Reduced for better caching
    
    rollupOptions: {
      output: {
        // Aggressive code splitting for better caching
        manualChunks: {
          // Core React (smallest chunks)
          'react-vendor': ['react', 'react-dom'],
          
          // Large libraries (separate chunks)
          'motion-vendor': ['motion/react'],
          'icons-vendor': ['lucide-react'],
          
          // UI Components (split by size)
          'ui-core': ['@radix-ui/react-slot'],
          'ui-dropdown': ['@radix-ui/react-dropdown-menu'],
          'ui-accordion': ['@radix-ui/react-accordion'],
          
          // Utilities (tiny chunk)
          'utils-vendor': ['clsx', 'tailwind-merge', 'class-variance-authority'],
        },
        
        // Optimize file naming for caching
        entryFileNames: (chunkInfo) => {
          return 'assets/[name]-[hash:8].js';
        },
        chunkFileNames: (chunkInfo) => {
          return 'assets/[name]-[hash:8].js';
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash:8].[ext]';
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash:8].[ext]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash:8].[ext]';
          }
          return 'assets/[name]-[hash:8].[ext]';
        },
      },
    },

    // Reduce chunk size warning
    chunkSizeWarningLimit: 200,
    


    // Aggressive terser options
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
        pure_getters: true,
        unsafe_arrows: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        // Remove unused code
        dead_code: true,
        // Inline functions
        inline: 2,
        // Reduce function calls
        reduce_funcs: true,
        reduce_vars: true,
        // Collapse variables
        collapse_vars: true,
        // Join consecutive var statements
        join_vars: true,
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/,
        },
      },
      format: {
        safari10: true,
        comments: false,
      },
    },
  },

  // Aggressive dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
    ],
    exclude: [
      // Large libraries that should be loaded separately
      '@google/generative-ai',
      'lucide-react', // Exclude for better tree shaking
      'motion/react', // Exclude for better tree shaking
    ],
    esbuildOptions: {
      target: 'es2020',
      supported: {
        'top-level-await': true,
      },
      // Aggressive tree shaking
      treeShaking: true,
      minify: true,
      sideEffects: false,
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
    // PostCSS optimizations will be handled by postcss.config.js
  },

  // Preview server
  preview: {
    port: 4173,
    open: false,
    host: true,
  },

  // Enable esbuild for faster builds
  esbuild: {
    target: 'es2020',
    drop: ['console', 'debugger'],
    legalComments: 'none',
  },
});