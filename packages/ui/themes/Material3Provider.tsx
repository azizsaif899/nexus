import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { material3Theme, material3DarkTheme } from './material3-theme';

interface Material3ProviderProps {
  children: React.ReactNode;
  darkMode?: boolean;
}

export const Material3Provider: React.FC<Material3ProviderProps> = ({
  children,
  darkMode = false,
}) => {
  const theme = darkMode ? material3DarkTheme : material3Theme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default Material3Provider;
