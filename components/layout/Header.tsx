'use client';

import { useState, useCallback, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  Box,
  Tooltip,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import EditIcon from '@mui/icons-material/Edit';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { ColorModeContext } from '@/app/providers';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onComposeClick: () => void;
}

export default function Header({ searchQuery, onSearchChange, onComposeClick }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const colorMode = useContext(ColorModeContext);
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  }, [onSearchChange]);

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }, [router]);

  const handleSearchFocus = useCallback(() => {
    setSearchFocused(true);
  }, []);

  const handleSearchBlur = useCallback(() => {
    setSearchFocused(false);
  }, []);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <LocalFloristIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          {!isMobile && (
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontFamily: 'var(--font-merriweather)',
                fontWeight: 700,
              }}
            >
              Cartas
            </Typography>
          )}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {!isMobile && (
          <TextField
            size="small"
            placeholder="Buscar en las cartas..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            sx={{
              maxWidth: 500,
              width: '100%',
              '& .MuiOutlinedInput-root': {
                backgroundColor: searchFocused 
                  ? 'background.default' 
                  : 'transparent',
                transition: 'background-color 0.2s',
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Escribir nuevo">
          <IconButton
            onClick={onComposeClick}
            aria-label="Escribir nuevo"
            sx={{ color: 'text.primary' }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={colorMode.mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
          <IconButton
            onClick={colorMode.toggleColorMode}
            aria-label="Cambiar tema"
            sx={{ color: 'text.primary' }}
          >
            {colorMode.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Cerrar sesión">
          <IconButton
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            sx={{ color: 'text.primary' }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>

      {isMobile && (
        <Box sx={{ px: 2, pb: 2 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Buscar en las cartas..."
            value={searchQuery}
            onChange={handleSearchChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      )}
    </AppBar>
  );
}
