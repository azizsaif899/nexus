// PostCSS v8.5.6 Configuration
// Tailwind CSS V4.1.14 + Autoprefixer 10.4.21 - October 2025
module.exports = {
  plugins: {
    // Tailwind CSS V4 PostCSS Plugin (v4.1.14)
    '@tailwindcss/postcss': {},
    // Autoprefixer for browser compatibility (v10.4.21)
    autoprefixer: {
      flexbox: 'no-2009',
      grid: 'autoplace'
    }
  }
};
