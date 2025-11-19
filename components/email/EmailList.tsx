'use client';

import { useMemo, useCallback } from 'react';
import { Box, Pagination, Typography, Container } from '@mui/material';
import EmailItem from './EmailItem';
import type { Email } from '@/types/email';

interface EmailListProps {
  emails: Email[];
  searchQuery: string;
  page: number;
  onPageChange: (page: number) => void;
  onEdit: (email: Email) => void;
  onDelete: (emailId: string) => void;
  getCanEdit: (email: Email) => boolean;
}

const ITEMS_PER_PAGE = 15;

export default function EmailList({
  emails,
  searchQuery,
  page,
  onPageChange,
  onEdit,
  onDelete,
  getCanEdit,
}: EmailListProps) {
  const filteredEmails = useMemo(() => {
    if (!searchQuery.trim()) {
      return emails;
    }

    const lowerQuery = searchQuery.toLowerCase();
    return emails.filter((email) => {
      const subject = email.subject.toLowerCase();
      const content = email.content.toLowerCase();
      return subject.includes(lowerQuery) || content.includes(lowerQuery);
    });
  }, [emails, searchQuery]);

  const totalPages = Math.ceil(filteredEmails.length / ITEMS_PER_PAGE);

  const handlePageChange = useCallback((_: unknown, newPage: number) => {
    onPageChange(newPage);
  }, [onPageChange]);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedEmails = filteredEmails.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (filteredEmails.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          {searchQuery.trim() ? (
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontStyle: 'italic',
                fontFamily: 'var(--font-lora)',
              }}
            >
              No se encontraron cartas con esos términos.
            </Typography>
          ) : (
            <Box
              sx={{
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  fontFamily: 'var(--font-lora)',
                  mb: 2,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  lineHeight: 1.6,
                }}
              >
                &ldquo;Yo conocía a uno que, cuando escribía alguna carta, ponía lo más importante en la posdata, como si fuera algo accidental.&rdquo;
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontFamily: 'var(--font-lora)',
                  textAlign: 'right',
                  fontStyle: 'italic',
                }}
              >
                — Francis Bacon
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box>
        {paginatedEmails.map((email) => (
          <EmailItem
            key={email._id}
            email={email}
            canEdit={getCanEdit(email)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
}
