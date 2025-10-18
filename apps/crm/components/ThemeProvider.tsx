import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Apply theme immediately on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const initialTheme = savedTheme || defaultTheme;
    
    let resolved: ResolvedTheme = 'light';
    if (initialTheme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = initialTheme as ResolvedTheme;
    }
    
    // Apply immediately
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(resolved);
    
    if (resolved === 'dark') {
      root.style.backgroundColor = '#202020';
      root.style.color = '#EAEAEA';
      document.body.style.backgroundColor = '#202020';
      document.body.style.color = '#EAEAEA';
    } else {
      root.style.backgroundColor = '#ffffff';
      root.style.color = '#252525';
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#252525';
    }
    
    setTheme(initialTheme);
    setResolvedTheme(resolved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Function to update resolved theme
    const updateResolvedTheme = (currentTheme: Theme) => {
      let resolved: ResolvedTheme = 'light';
      
      if (currentTheme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        resolved = currentTheme as ResolvedTheme;
      }
      
      setResolvedTheme(resolved);
      
      // Apply theme to document
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
      
      // Apply to body as well for better coverage
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(resolved);
      
      // Update data attribute for better CSS targeting
      root.setAttribute('data-theme', resolved);
      document.body.setAttribute('data-theme', resolved);
      
      // Apply styles directly for immediate effect
      if (resolved === 'dark') {
        root.style.backgroundColor = '#202020';
        root.style.color = '#EAEAEA';
        document.body.style.backgroundColor = '#202020';
        document.body.style.color = '#EAEAEA';
        
        // Force update all elements
        const allElements = document.querySelectorAll('*');
        allElements.forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';
          }
        });
      } else {
        root.style.backgroundColor = '#ffffff';
        root.style.color = '#252525';
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#252525';
        
        // Force update all elements
        const allElements = document.querySelectorAll('*');
        allElements.forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.transition = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease';
          }
        });
      }
      
      // Add smooth transition for theme changes
      root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      
      return resolved;
    };
    
    // Update resolved theme immediately
    updateResolvedTheme(theme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      if (theme === 'system') {
        updateResolvedTheme(theme);
      }
    };
    
    mediaQuery.addEventListener('change', handleMediaChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      root.style.transition = '';
    };
  }, [theme]);
  
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    handleSetTheme(newTheme);
  };
  
  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme: handleSetTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}