// Nexus Design System - Color Palette
export const nexusColors = {
  // Primary Brand Colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe', 
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main brand
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Secondary Colors
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff', 
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Accent Colors
  accent: {
    cyan: '#06b6d4',
    blue: '#3b82f6', 
    purple: '#8b5cf6',
    pink: '#ec4899',
    rose: '#f43f5e',
  },

  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Semantic Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Background Colors
  background: {
    light: '#ffffff',
    dark: '#030213',
    muted: '#f8fafc',
  },

  // Text Colors
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    muted: '#9ca3af',
    inverse: '#ffffff',
  },
};

// CSS Variables Export
export const nexusCSSVars = {
  '--nexus-primary': nexusColors.primary[500],
  '--nexus-secondary': nexusColors.secondary[500],
  '--nexus-accent-cyan': nexusColors.accent.cyan,
  '--nexus-accent-blue': nexusColors.accent.blue,
  '--nexus-accent-purple': nexusColors.accent.purple,
  '--nexus-success': nexusColors.success,
  '--nexus-warning': nexusColors.warning,
  '--nexus-error': nexusColors.error,
  '--nexus-bg-light': nexusColors.background.light,
  '--nexus-bg-dark': nexusColors.background.dark,
};

// Gradient Presets
export const nexusGradients = {
  primary: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
  hero: 'linear-gradient(to right, #06b6d4, #3b82f6)',
  accent: 'linear-gradient(to right, #8b5cf6, #ec4899)',
  dark: 'linear-gradient(135deg, #030213 0%, #1e293b 100%)',
};