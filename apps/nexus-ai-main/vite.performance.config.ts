import { defineConfig } from 'vite';
import { resolve } from 'path';

// Performance optimization configuration
export const performanceConfig = {
    // CSS optimization
    css: {
        devSourcemap: false,
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/styles/variables.scss";`
            }
        }
    },

    // JSON optimization
    json: {
        namedExports: false,
        stringify: true
    },

    // Worker optimization
    worker: {
        format: 'es' as const,
        plugins: []
    },

    // SSR optimization (if needed)
    ssr: {
        format: 'esm' as const,
        noExternal: ['react', 'react-dom']
    },

    // Define global constants
    define: {
        __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
        __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
        __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
    },

    // Environment variables
    envPrefix: ['VITE_', 'NEXUS_'],

    // Assets handling
    assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.otf'],

    // Public directory
    publicDir: 'public',

    // Build options
    build: {
        // Target modern browsers
        target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],

        // Module format
        modulePreload: {
            polyfill: true
        },

        // CSS code splitting
        cssCodeSplit: true,

        // Generate manifest
        manifest: true,

        // Minification
        minify: 'terser',

        // Sourcemaps
        sourcemap: false,

        // Polyfills
        polyfillModulePreload: true,

        // Reporting
        reportCompressedSize: false,

        // Asset file names
        assetsDir: 'assets',

        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            },

            // External dependencies (if needed)
            external: [],

            output: {
                // Manual chunks for better caching
                manualChunks: {
                    'vendor-react': ['react', 'react-dom'],
                    'vendor-motion': ['motion'],
                    'vendor-ui': ['@radix-ui/react-slot', '@radix-ui/react-separator'],
                    'vendor-utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
                    'vendor-icons': ['lucide-react'],
                },

                // Chunk file names
                chunkFileNames: (chunkInfo) => {
                    const facadeModuleId = chunkInfo.facadeModuleId
                        ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
                        : 'chunk';
                    return `assets/${facadeModuleId}-[hash].js`;
                },

                // Entry file names
                entryFileNames: 'assets/[name]-[hash].js',

                // Asset file names
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name?.split('.') || [];
                    const ext = info[info.length - 1];

                    if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
                        return `assets/images/[name]-[hash].${ext}`;
                    }

                    if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
                        return `assets/fonts/[name]-[hash].${ext}`;
                    }

                    return `assets/[name]-[hash].${ext}`;
                },
            }
        },

        // Terser options
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                passes: 2,
                pure_getters: true,
                unsafe_arrows: true,
                unsafe_methods: true,
                unsafe_proto: true,
                unsafe_regexp: true,
                unsafe_undefined: true,
            },
            mangle: {
                safari10: true,
                properties: {
                    regex: /^_/
                }
            },
            format: {
                safari10: true,
                comments: false,
            },
            ecma: 2020,
            module: true,
            toplevel: true,
        }
    }
};

export default performanceConfig;