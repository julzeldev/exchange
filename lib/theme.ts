import { createTheme, ThemeOptions } from '@mui/material/styles';

// Sunflower vintage color palette
const lightPalette = {
  primary: {
    main: '#E8B923', // Sunflower yellow
    light: '#F5D76E',
    dark: '#C99D1A',
    contrastText: '#2B2520',
  },
  secondary: {
    main: '#9CAF88', // Sage green
    light: '#B8C9A8',
    dark: '#7A9468',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FAF7F0', // Cream
    paper: '#FFFFFF',
  },
  text: {
    primary: '#2B2520', // Deep brown
    secondary: '#8B7355', // Warm brown
  },
  divider: '#E8DCC4', // Aged cream
};

const darkPalette = {
  primary: {
    main: '#C9A961', // Muted gold
    light: '#D9BA7A',
    dark: '#B8954A',
    contrastText: '#2B2520',
  },
  secondary: {
    main: '#4A5240', // Dark olive
    light: '#6B7359',
    dark: '#353A2E',
    contrastText: '#E8DCC4',
  },
  background: {
    default: '#2B2520', // Deep brown
    paper: '#3A3430',
  },
  text: {
    primary: '#E8DCC4', // Aged cream
    secondary: '#C9A961', // Muted gold
  },
  divider: '#4A5240',
};

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light' ? lightPalette : darkPalette),
  },
  typography: {
    fontFamily: 'var(--font-lora), Georgia, serif',
    h1: {
      fontFamily: 'var(--font-merriweather), Georgia, serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'var(--font-merriweather), Georgia, serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'var(--font-merriweather), Georgia, serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'var(--font-merriweather), Georgia, serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: 'var(--font-merriweather), Georgia, serif',
      fontWeight: 700,
    },
    h6: {
      fontFamily: 'var(--font-merriweather), Georgia, serif',
      fontWeight: 700,
    },
    button: {
      fontFamily: 'var(--font-lora), Georgia, serif',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(139, 115, 85, 0.08)',
    '0px 4px 8px rgba(139, 115, 85, 0.12)',
    '0px 6px 12px rgba(139, 115, 85, 0.16)',
    '0px 8px 16px rgba(139, 115, 85, 0.20)',
    '0px 10px 20px rgba(139, 115, 85, 0.24)',
    '0px 12px 24px rgba(139, 115, 85, 0.28)',
    '0px 14px 28px rgba(139, 115, 85, 0.32)',
    '0px 16px 32px rgba(139, 115, 85, 0.36)',
    '0px 18px 36px rgba(139, 115, 85, 0.40)',
    '0px 20px 40px rgba(139, 115, 85, 0.44)',
    '0px 22px 44px rgba(139, 115, 85, 0.48)',
    '0px 24px 48px rgba(139, 115, 85, 0.52)',
    '0px 26px 52px rgba(139, 115, 85, 0.56)',
    '0px 28px 56px rgba(139, 115, 85, 0.60)',
    '0px 30px 60px rgba(139, 115, 85, 0.64)',
    '0px 32px 64px rgba(139, 115, 85, 0.68)',
    '0px 34px 68px rgba(139, 115, 85, 0.72)',
    '0px 36px 72px rgba(139, 115, 85, 0.76)',
    '0px 38px 76px rgba(139, 115, 85, 0.80)',
    '0px 40px 80px rgba(139, 115, 85, 0.84)',
    '0px 42px 84px rgba(139, 115, 85, 0.88)',
    '0px 44px 88px rgba(139, 115, 85, 0.92)',
    '0px 46px 92px rgba(139, 115, 85, 0.96)',
    '0px 48px 96px rgba(139, 115, 85, 1.00)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'light' 
            ? '0px 4px 8px rgba(139, 115, 85, 0.12)'
            : '0px 4px 12px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'light' | 'dark') => 
  createTheme(getThemeOptions(mode));
