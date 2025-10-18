import { nexusColors, nexusGradients } from './colors';

// Nexus Theme Configuration
export const nexusTheme = {
  colors: nexusColors,
  gradients: nexusGradients,
  
  // Typography
  fonts: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    arabic: '"Segoe UI", Tahoma, Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace',
  },

  // Spacing Scale
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // Border Radius
  radius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Animation Durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },

  // Z-Index Scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};

// Dark Theme Overrides
export const nexusDarkTheme = {
  ...nexusTheme,
  colors: {
    ...nexusTheme.colors,
    background: {
      light: nexusColors.neutral[900],
      dark: '#030213',
      muted: nexusColors.neutral[800],
    },
    text: {
      primary: nexusColors.neutral[100],
      secondary: nexusColors.neutral[300],
      muted: nexusColors.neutral[400],
      inverse: nexusColors.neutral[900],
    },
  },
};

// Component Variants
export const nexusComponents = {
  button: {
    primary: {
      bg: nexusGradients.hero,
      text: nexusColors.text.inverse,
      hover: 'brightness(110%)',
    },
    secondary: {
      bg: nexusColors.neutral[100],
      text: nexusColors.text.primary,
      border: nexusColors.neutral[300],
    },
    ghost: {
      bg: 'transparent',
      text: nexusColors.text.primary,
      hover: nexusColors.neutral[100],
    },
  },
  
  card: {
    default: {
      bg: nexusColors.background.light,
      border: nexusColors.neutral[200],
      shadow: nexusTheme.shadows.md,
    },
    elevated: {
      bg: nexusColors.background.light,
      border: 'none',
      shadow: nexusTheme.shadows.xl,
    },
  },
};