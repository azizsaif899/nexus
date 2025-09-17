export const azizSysTheme = {
  colors: {
    // AzizSys Brand Colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      500: '#0ea5e9',  // الأزرق الأساسي
      600: '#0284c7',
      900: '#0c4a6e'
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      500: '#64748b',
      800: '#1e293b',  // الرمادي الداكن
      900: '#0f172a'   // الخلفية الداكنة
    },
    accent: {
      50: '#ecfdf5',
      100: '#d1fae5',
      500: '#10b981',  // الأخضر النعناعي
      600: '#059669'
    },
    purple: {
      500: '#8b5cf6'   // للـ CRM
    }
  },
  
  // نظام الخطوط
  fonts: {
    arabic: ['Cairo', 'Tajawal', 'sans-serif'],
    english: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace']
  },
  
  // المساحات والأحجام
  spacing: {
    xs: '0.5rem',
    sm: '1rem', 
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  },
  
  // الزوايا المدورة
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  }
}

export type AzizSysTheme = typeof azizSysTheme