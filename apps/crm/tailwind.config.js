/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './App.tsx',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light Mode - Professional Design
        background: 'var(--background)',
        'background-secondary': 'var(--background-secondary)',
        'background-elevated': 'var(--background-elevated)',
        'background-muted': 'var(--background-muted)',
        
        foreground: 'var(--foreground)',
        'foreground-secondary': 'var(--foreground-secondary)',
        'foreground-muted': 'var(--foreground-muted)',
        'foreground-subtle': 'var(--foreground-subtle)',
        
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          active: 'var(--primary-active)',
          foreground: 'var(--primary-foreground)',
          muted: 'var(--primary-muted)',
        },
        
        success: {
          DEFAULT: 'var(--success)',
          hover: 'var(--success-hover)',
          foreground: 'var(--success-foreground)',
          muted: 'var(--success-muted)',
        },
        
        warning: {
          DEFAULT: 'var(--warning)',
          hover: 'var(--warning-hover)',
          foreground: 'var(--warning-foreground)',
          muted: 'var(--warning-muted)',
        },
        
        destructive: {
          DEFAULT: 'var(--destructive)',
          hover: 'var(--destructive-hover)',
          foreground: 'var(--destructive-foreground)',
          muted: 'var(--destructive-muted)',
        },
        
        border: 'var(--border)',
        'border-strong': 'var(--border-strong)',
        input: 'var(--input)',
        'input-background': 'var(--input-background)',
        'input-border': 'var(--input-border)',
        ring: 'var(--ring)',
        
        'hover-bg': 'var(--hover-bg)',
        'active-bg': 'var(--active-bg)',
        
        // Legacy support for shadcn/ui
        card: 'var(--background-elevated)',
        'card-foreground': 'var(--foreground)',
        popover: 'var(--background-elevated)',
        'popover-foreground': 'var(--foreground)',
        secondary: 'var(--background-secondary)',
        'secondary-foreground': 'var(--foreground)',
        muted: 'var(--background-muted)',
        'muted-foreground': 'var(--foreground-muted)',
        accent: 'var(--primary-muted)',
        'accent-foreground': 'var(--foreground)',
      },
      
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      
      fontSize: {
        // Headers - Fixed sizes (لا تستخدم هذه إلا عند الضرورة)
        // استخدم عناصر HTML مباشرة (h1, h2, etc) للحصول على التنسيق التلقائي
        'h1': ['24px', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.025em' }],
        'h2': ['20px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.025em' }],
        'h3': ['18px', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        
        // Body text
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-small': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
        
        // UI elements
        'button': ['16px', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.025em' }],
        'label': ['14px', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.025em' }],
        'caption': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      
      borderRadius: {
        sm: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        DEFAULT: '12px',
      },
      
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.05)',
      },
      
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
    },
  },
  plugins: [],
}
