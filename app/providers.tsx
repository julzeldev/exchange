'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useMemo, createContext, useCallback } from 'react';
import { createAppTheme } from '@/lib/theme';
import NextAppDirEmotionCacheProvider from '@/lib/emotion-cache';

export const ColorModeContext = createContext({ 
  toggleColorMode: () => {},
  mode: 'light' as 'light' | 'dark',
});

function getInitialMode(): 'light' | 'dark' {
  if (typeof window !== 'undefined') {
    const savedMode = localStorage.getItem('colorMode');
    if (savedMode === 'light' || savedMode === 'dark') {
      return savedMode;
    }
  }
  return 'light';
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>(getInitialMode);

  const toggleColorMode = useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('colorMode', newMode);
      return newMode;
    });
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode,
      mode,
    }),
    [toggleColorMode, mode]
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </NextAppDirEmotionCacheProvider>
  );
}
