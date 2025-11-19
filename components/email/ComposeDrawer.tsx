'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Alert,
  LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RichTextEditor from './RichTextEditor';
import type { Email, EmailFormData } from '@/types/email';

interface ComposeDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EmailFormData) => Promise<void>;
  editingEmail?: Email | null;
}

const MAX_CONTENT_LENGTH = 10000;
const AUTOSAVE_INTERVAL = 2000; // 2 seconds

export default function ComposeDrawer({ 
  open, 
  onClose, 
  onSubmit,
  editingEmail 
}: ComposeDrawerProps) {
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  // Load draft from sessionStorage or editing email
  useEffect(() => {
    if (editingEmail) {
      setSubject(editingEmail.subject);
      setContent(editingEmail.content);
      setSignature(editingEmail.signature);
    } else if (open) {
      const draft = sessionStorage.getItem('emailDraft');
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          setSubject(parsed.subject || '');
          setContent(parsed.content || '');
          setSignature(parsed.signature || '');
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      }
    }
  }, [open, editingEmail]);

  // Autosave to sessionStorage
  useEffect(() => {
    if (!open || editingEmail) return;

    const timer = setTimeout(() => {
      if (subject || content || signature) {
        sessionStorage.setItem('emailDraft', JSON.stringify({
          subject,
          content,
          signature,
        }));
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearTimeout(timer);
  }, [subject, content, signature, open, editingEmail]);

  // Update char count
  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  const handleClose = useCallback(() => {
    if (!loading) {
      onClose();
      // Clear form after a delay
      setTimeout(() => {
        setSubject('');
        setContent('');
        setSignature('');
        setError('');
      }, 300);
    }
  }, [loading, onClose]);

  const handleSubjectChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  }, []);

  const handleSignatureChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSignature(e.target.value);
  }, []);

  const handleErrorClose = useCallback(() => {
    setError('');
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!subject.trim()) {
      setError('El título es requerido');
      return;
    }

    if (!content.trim()) {
      setError('El contenido es requerido');
      return;
    }

    if (signature.trim().length < 2) {
      setError('La firma debe tener al menos 2 caracteres');
      return;
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      setError(`El contenido no debe exceder ${MAX_CONTENT_LENGTH} caracteres`);
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        subject: subject.trim(),
        content,
        signature: signature.trim(),
      });

      // Clear draft from sessionStorage
      sessionStorage.removeItem('emailDraft');
      
      handleClose();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar la carta');
    } finally {
      setLoading(false);
    }
  }, [subject, content, signature, onSubmit, handleClose]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: isFullScreen ? '100%' : { xs: 600, md: 600, lg: '63%' },
            maxWidth: '100%',
            boxShadow: '-2px 0 8px rgba(0,0,0,0.08)',
          },
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontFamily: 'var(--font-merriweather)' }}
          >
            {editingEmail ? 'Editar Carta' : 'Nueva Carta'}
          </Typography>
          <IconButton onClick={handleClose} disabled={loading} aria-label="Cerrar">
            <CloseIcon />
          </IconButton>
        </Box>

        {loading && <LinearProgress />}

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {error && (
            <Alert severity="error" onClose={handleErrorClose}>
              {error}
            </Alert>
          )}

          <TextField
            label="Título"
            value={subject}
            onChange={handleSubjectChange}
            fullWidth
            disabled={loading}
            required
          />

          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Contenido *
            </Typography>
            <RichTextEditor
              content={content}
              onChange={setContent}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography
                variant="caption"
                color={charCount > MAX_CONTENT_LENGTH ? 'error' : 'text.secondary'}
              >
                {charCount} / {MAX_CONTENT_LENGTH} caracteres
              </Typography>
              {!editingEmail && (
                <Typography variant="caption" color="text.secondary">
                  Guardado automático activo
                </Typography>
              )}
            </Box>
          </Box>

          <TextField
            label="Firma"
            value={signature}
            onChange={handleSignatureChange}
            fullWidth
            disabled={loading}
            required
            helperText="Mínimo 2 caracteres"
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={loading}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
            >
              {loading ? 'Guardando...' : editingEmail ? 'Actualizar' : 'Publicar'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
