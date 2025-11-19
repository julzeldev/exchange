'use client';

import { useState, useCallback, useEffect } from 'react';
import { Box, CircularProgress, Alert, Snackbar } from '@mui/material';
import Header from '@/components/layout/Header';
import EmailList from '@/components/email/EmailList';
import ComposeDrawer from '@/components/email/ComposeDrawer';
import type { Email, EmailFormData, RecentEmailData } from '@/types/email';
import type { UserId } from '@/types/auth';

const EDIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export default function Home() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<Email | null>(null);
  const [currentUserId, setCurrentUserId] = useState<UserId | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch emails
  const fetchEmails = useCallback(async () => {
    try {
      const response = await fetch('/api/emails');
      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }
      const data = await response.json();
      setEmails(data);
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError('Error al cargar las cartas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get current user ID from session
  useEffect(() => {
    setMounted(true);
    const getUserId = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setCurrentUserId(data.userId);
        }
      } catch (err) {
        console.error('Error getting user ID:', err);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const handleComposeClick = useCallback(() => {
    setEditingEmail(null);
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setEditingEmail(null);
  }, []);

  const handleSubmit = useCallback(async (data: EmailFormData) => {
    if (editingEmail) {
      // Update existing email
      const response = await fetch(`/api/emails/${editingEmail._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update email');
      }

      setSnackbarMessage('Carta actualizada correctamente');
      await fetchEmails();
    } else {
      // Create new email
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create email');
      }

      const result = await response.json();

      // Save to sessionStorage for edit/delete tracking
      const recentEmailData: RecentEmailData = {
        emailId: result.emailId,
        authorId: result.email.authorId,
        postedAt: Date.now(),
      };
      sessionStorage.setItem('recentEmail', JSON.stringify(recentEmailData));

      setSnackbarMessage('Carta publicada correctamente');
      await fetchEmails();
      setPage(1); // Go to first page to see new email
    }
  }, [editingEmail, fetchEmails]);

  const handleEdit = useCallback((email: Email) => {
    setEditingEmail(email);
    setDrawerOpen(true);
  }, []);

  const handleDelete = useCallback(async (emailId: string) => {
    try {
      const response = await fetch(`/api/emails/${emailId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete email');
      }

      // Remove from sessionStorage
      sessionStorage.removeItem('recentEmail');

      setSnackbarMessage('Carta eliminada correctamente');
      await fetchEmails();
    } catch (err) {
      console.error('Error deleting email:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar la carta');
    }
  }, [fetchEmails]);

  const getCanEdit = useCallback((email: Email): boolean => {
    if (!currentUserId) return false;

    // Check sessionStorage for recent email
    const recentEmailStr = sessionStorage.getItem('recentEmail');
    if (!recentEmailStr) return false;

    try {
      const recentEmail: RecentEmailData = JSON.parse(recentEmailStr);
      
      // Check if it's the same email
      if (recentEmail.emailId !== email._id) return false;

      // Check if user is the author
      if (recentEmail.authorId !== currentUserId) return false;

      // Check if within edit window
      const elapsed = Date.now() - recentEmail.postedAt;
      return elapsed < EDIT_WINDOW_MS;
    } catch (err) {
      console.error('Error parsing recent email:', err);
      return false;
    }
  }, [currentUserId]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarMessage('');
  }, []);

  const handleErrorClose = useCallback(() => {
    setError('');
  }, []);

  if (!mounted || loading) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onComposeClick={handleComposeClick}
      />

      <EmailList
        emails={emails}
        searchQuery={searchQuery}
        page={page}
        onPageChange={setPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getCanEdit={getCanEdit}
      />

      <ComposeDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        onSubmit={handleSubmit}
        editingEmail={editingEmail}
      />

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleErrorClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
