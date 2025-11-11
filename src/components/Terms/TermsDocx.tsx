import React, { useEffect, useRef } from 'react';
import { Container, Box, Button, CircularProgress, Alert, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GavelIcon from '@mui/icons-material/Gavel';
import { useNavigate } from 'react-router-dom';
import { renderAsync } from 'docx-preview';

const TermsDocx: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the DOCX file
        const response = await fetch('/docs/tnc.docx');
        if (!response.ok) {
          throw new Error('Failed to load document');
        }

        const arrayBuffer = await response.arrayBuffer();

        // Render the document
        if (containerRef.current) {
          await renderAsync(arrayBuffer, containerRef.current);
        }
      } catch (err) {
        console.error('Error loading document:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load Terms and Conditions document'
        );
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      {/* Professional Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <GavelIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Terms of Service
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Last Updated: November 11, 2025
                </Typography>
              </Box>
            </Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              sx={{
                textTransform: 'none',
                color: 'primary.main',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              Back
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: { xs: 2, sm: 4 } }}>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, flex: 1 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Alert severity="error">
            {error}
          </Alert>
        </Container>
      )}

      {/* Scrollable Document Container */}
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3 },
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          ref={containerRef}
          sx={{
            bgcolor: 'white',
            p: 3,
            borderRadius: 1,
            boxShadow: 1,
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 200px)',
            '& p': {
              mb: 1,
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              mt: 2,
              mb: 1,
            },
            // Custom scrollbar styling
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#555',
              },
            },
          }}
        />
      </Container>
      </Box>
    </Box>
  );
};

export default TermsDocx;
