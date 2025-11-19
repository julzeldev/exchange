'use client';

import { useState, useCallback, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
} from '@mui/material';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/');
        router.refresh();
      } else {
        setError(data.error || 'Contraseña incorrecta');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }, [password, router]);

  if (!mounted) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 400,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <LocalFloristIcon
                sx={{
                  fontSize: 64,
                  color: 'primary.main',
                  mb: 2,
                }}
              />
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontFamily: 'var(--font-merriweather)' }}
              >
                Cartas
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
              >
                Un espacio para intercambiar cartas
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                type="password"
                label="Contraseña"
                value={password}
                onChange={handlePasswordChange}
                disabled={loading}
                autoFocus
                sx={{ mb: 2 }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || !password}
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
