import React, { useEffect, useRef } from "react";
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useNavigate } from "react-router-dom";
import mammoth from "mammoth";

const QA: React.FC = () => {
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
        const response = await fetch("/docs/qa.docx");
        if (!response.ok) {
          throw new Error("Failed to load document");
        }

        const arrayBuffer = await response.arrayBuffer();

        // Convert DOCX to HTML using Mammoth
        const result = await mammoth.convertToHtml({ arrayBuffer });

        // Render the HTML into the container
        if (containerRef.current) {
          containerRef.current.innerHTML = result.value;
        }

        // Log any warnings from conversion
        if (result.messages.length > 0) {
          console.warn("Mammoth conversion warnings:", result.messages);
        }
      } catch (err) {
        console.error("Error loading document:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load Q&A document"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Professional Header */}
      <Box
        sx={{
          bgcolor: "white",
          borderBottom: 1,
          borderColor: "divider",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <HelpOutlineIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Q&A
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Last Updated: December 13, 2025
                </Typography>
              </Box>
            </Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/")}
              sx={{
                textTransform: "none",
                color: "primary.main",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Back
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          py: { xs: 2, sm: 4 },
        }}
      >
        {/* Loading State */}
        {loading && (
          <Box
            sx={{ display: "flex", justifyContent: "center", py: 4, flex: 1 }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
            <Alert severity="error">{error}</Alert>
          </Container>
        )}

        {/* Scrollable Document Container */}
        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 1, sm: 2, md: 3 },
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            ref={containerRef}
            sx={{
              bgcolor: "white",
              p: { xs: 1.5, sm: 2, md: 3 },
              borderRadius: 1,
              boxShadow: 1,
              overflowY: "auto",
              maxHeight: "calc(100vh - 200px)",
              // Responsive typography
              fontSize: { xs: "14px", sm: "15px", md: "16px" },
              lineHeight: 1.6,
              // Responsive styling for Mammoth HTML output
              "& p": {
                mb: 1.5,
                fontSize: "inherit",
                wordBreak: "break-word",
              },
              "& h1": {
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                mt: 2,
                mb: 1,
                fontWeight: 700,
              },
              "& h2": {
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                mt: 2,
                mb: 1,
                fontWeight: 700,
              },
              "& h3, & h4, & h5, & h6": {
                fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                mt: 1.5,
                mb: 0.75,
                fontWeight: 600,
              },
              "& ul, & ol": {
                pl: 2,
                mb: 1.5,
                "& li": {
                  mb: 0.75,
                  fontSize: "inherit",
                },
              },
              "& table": {
                width: "100%",
                borderCollapse: "collapse",
                mb: 1.5,
                fontSize: { xs: "13px", sm: "14px", md: "15px" },
                "& th, & td": {
                  border: "1px solid #ddd",
                  p: 1,
                  textAlign: "left",
                },
                "& th": {
                  bgcolor: "#f5f5f5",
                  fontWeight: 600,
                },
              },
              "& strong, & b": {
                fontWeight: 600,
              },
              "& em, & i": {
                fontStyle: "italic",
              },
              "& a": {
                color: "primary.main",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              },
              // Custom scrollbar styling
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "#555",
                },
              },
            }}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default QA;
