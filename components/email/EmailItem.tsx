'use client';

import { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Email } from '@/types/email';

interface EmailItemProps {
  email: Email;
  canEdit: boolean;
  onEdit: (email: Email) => void;
  onDelete: (emailId: string) => void;
}

export default function EmailItem({ 
  email, 
  canEdit, 
  onEdit, 
  onDelete 
}: EmailItemProps) {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleEdit = useCallback(() => {
    onEdit(email);
  }, [email, onEdit]);

  const handleDelete = useCallback(() => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta carta?')) {
      onDelete(email._id);
    }
  }, [email._id, onDelete]);

  // Strip HTML tags for preview
  const getTextContent = (html: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const textContent = getTextContent(email.content);
  const lines = textContent.split('\n').filter(line => line.trim());
  const previewLines = lines.slice(0, 3);
  const hasMore = lines.length > 3 || textContent.length > 300;

  return (
    <Card
      sx={{
        mb: 2,
        position: 'relative',
        '&:hover': {
          boxShadow: 4,
        },
        transition: 'box-shadow 0.2s',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontFamily: 'var(--font-merriweather)',
              fontWeight: 700,
              flex: 1,
            }}
          >
            {email.subject}
          </Typography>
          
          {canEdit && (
            <Box sx={{ display: 'flex', gap: 0.5, ml: 2 }}>
              <Tooltip title="Editar">
                <IconButton
                  size="small"
                  onClick={handleEdit}
                  aria-label="Editar carta"
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton
                  size="small"
                  onClick={handleDelete}
                  aria-label="Eliminar carta"
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            mb: 2,
            '& p': { margin: 0, marginBottom: 1 },
            '& p:last-child': { marginBottom: 0 },
          }}
        >
          {expanded ? (
            <div dangerouslySetInnerHTML={{ __html: email.content }} />
          ) : (
            <Typography
              variant="body1"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {previewLines.join(' ')}
            </Typography>
          )}
        </Box>

        {hasMore && (
          <Button
            size="small"
            onClick={handleToggleExpand}
            sx={{ mb: 2 }}
          >
            {expanded ? 'Ver menos' : 'Seguir leyendo'}
          </Button>
        )}

        <Box
          sx={{
            borderTop: 1,
            borderColor: 'divider',
            pt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontStyle: 'italic',
              color: 'secondary.main',
            }}
          >
            — {email.signature}
          </Typography>
          
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
            }}
          >
            {new Date(email.createdAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
