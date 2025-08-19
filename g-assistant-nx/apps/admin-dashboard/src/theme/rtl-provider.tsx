import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { adminTheme, adminDarkTheme } from './mui-theme';
import CssBaseline from '@mui/material/CssBaseline';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

interface RTLProviderProps {
  children: React.ReactNode;
  darkMode?: boolean;
}

export const RTLProvider: React.FC<RTLProviderProps> = ({ 
  children, 
  darkMode = false 
}) => {
  const theme = darkMode ? adminDarkTheme : adminTheme;

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div dir="rtl" style={{ fontFamily: theme.typography.fontFamily }}>
          {children}
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default RTLProvider;