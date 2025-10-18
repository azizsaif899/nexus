export default {
  plugins: {
    '@tailwindcss/postcss': {},
    // Convert modern color functions (oklch, oklab) to RGB with fallbacks
    '@csstools/postcss-oklab-function': {
      preserve: true, // Keep original oklch for modern browsers
    },
    // Add vendor prefixes and polyfills for better browser compatibility
    'postcss-preset-env': {
      stage: 2, // Use stable features
      features: {
        'oklab-function': true,
        'color-function': true,
        'custom-properties': false, // Let Tailwind handle CSS variables
      },
      autoprefixer: {
        flexbox: 'no-2009',
        grid: 'autoplace',
      },
      browsers: [
        'last 2 versions',
        'iOS >= 12',
        'Safari >= 12',
        'Chrome >= 90',
        'Firefox >= 88',
      ],
    },
    // Always use autoprefixer for vendor prefixes
    'autoprefixer': {},
    // Production optimizations
    ...(process.env.NODE_ENV === 'production' ? {
      'cssnano': {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          colormin: true,
          convertValues: true,
          discardDuplicates: true,
          discardEmpty: true,
          mergeRules: true,
          minifyFontValues: true,
          minifyParams: true,
          minifySelectors: true,
        }]
      }
    } : {})
  },
};