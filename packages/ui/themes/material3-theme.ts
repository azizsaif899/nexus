import { createTheme, ThemeOptions } from '@mui/material/styles';

// Material 3 Color Tokens
const material3Colors = {
  primary: {
    main: '#6750A4',
    light: '#D0BCFF',
    dark: '#4F378B',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#625B71',
    light: '#E8DEF8',
    dark: '#4A4458',
    contrastText: '#FFFFFF',
  },
  tertiary: {
    main: '#7D5260',
    light: '#FFD8E4',
    dark: '#633B48',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#BA1A1A',
    light: '#FFDAD6',
    dark: '#93000A',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FFFBFE',
    paper: '#FFFBFE',
  },
  surface: {
    main: '#FFFBFE',
    variant: '#E7E0EC',
  },
};

// Material 3 Theme Configuration
export const material3Theme = createTheme({
  palette: {
    mode: 'light',
    ...material3Colors,
  },
  typography: {
    // Material 3 Typography Scale
    displayLarge: {
      fontSize: '3.5rem',
      fontWeight: 400,
      lineHeight: 1.12,
    },
    displayMedium: {
      fontSize: '2.8125rem',
      fontWeight: 400,
      lineHeight: 1.16,
    },
    displaySmall: {
      fontSize: '2.25rem',
      fontWeight: 400,
      lineHeight: 1.22,
    },
    headlineLarge: {
      fontSize: '2rem',
      fontWeight: 400,
      lineHeight: 1.25,
    },
    headlineMedium: {
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: 1.29,
    },
    headlineSmall: {
      fontSize: '1.5rem',
      fontWeight: 400,
      lineHeight: 1.33,
    },
  },
  shape: {
    borderRadius: 12, // Material 3 rounded corners
  },
  components: {
    // Material 3 Component Overrides
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        },
      },
    },
  },
});

// Dark Theme
export const material3DarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D0BCFF',
      light: '#EADDFF',
      dark: '#4F378B',
      contrastText: '#21005D',
    },
    secondary: {
      main: '#CCC2DC',
      light: '#E8DEF8',
      dark: '#4A4458',
      contrastText: '#332D41',
    },
    background: {
      default: '#1C1B1F',
      paper: '#1C1B1F',
    },
  },
  typography: material3Theme.typography,
  shape: material3Theme.shape,
  components: material3Theme.components,
});
