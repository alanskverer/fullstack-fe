import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Box,
  Button,
  CircularProgress,
  Alert,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EmailIcon from "@mui/icons-material/Email";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate } from "react-router-dom";
import mammoth from "mammoth";
import { z } from "zod";

// Zod validation schema
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .trim()
    .toLowerCase(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
    .trim(),
});

const QA: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  // Handle contact form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setValidationErrors({});

    // Validate form data with Zod
    try {
      const validatedData = contactFormSchema.parse(formData);

      setFormSubmitting(true);

      // Send email using Formsubmit.co (simple, no signup required!)
      const response = await fetch("https://formsubmit.co/ajax/support@bettim.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: validatedData.name,
          email: validatedData.email,
          message: validatedData.message,
          _subject: `Bettim Support - ${validatedData.name}`,
          _template: "box", // Nice email template
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Show success message
      setFormSubmitted(true);
      setFormData({ name: "", email: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errors: { name?: string; email?: string; message?: string } = {};
        error.issues.forEach((err: z.ZodIssue) => {
          const field = err.path[0] as "name" | "email" | "message";
          errors[field] = err.message;
        });
        setValidationErrors(errors);
      } else {
        // Handle fetch or other errors
        console.error("Error submitting form:", error);
        setFormError(
          "Failed to send message. Please email us directly at support@bettim.co or try again later."
        );
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined,
      });
    }
  };

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
                  Bettim – Help & Support
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Get answers to common questions or contact our support team
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
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
        {/* CRITICAL: Contact Support Section - Above the Fold */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            mb: 4,
            bgcolor: "white",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <EmailIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Contact Support
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            If you need help or have any questions, you can contact our support
            team using the options below.
          </Typography>

          {/* Direct Email Contact */}
          <Box
            sx={{
              p: 2,
              mb: 3,
              bgcolor: "#f5f5f5",
              borderRadius: 1,
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Support Email
            </Typography>
            <Typography
              variant="h6"
              component="a"
              href="mailto:support@bettim.co"
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: 600,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              support@bettim.co
            </Typography>
          </Box>

          {/* Contact Form */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Send us a message
          </Typography>

          {formSubmitted && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Thank you for contacting us! Your message has been sent successfully.
              We'll respond to your inquiry as soon as possible (typically within 24-48 hours).
            </Alert>
          )}

          {formError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {formError}
            </Alert>
          )}

          <form onSubmit={handleFormSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
              sx={{ mb: 2 }}
              disabled={formSubmitting}
              error={!!validationErrors.name}
              helperText={validationErrors.name}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleFormChange}
              required
              sx={{ mb: 2 }}
              disabled={formSubmitting}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
            <TextField
              fullWidth
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleFormChange}
              required
              multiline
              rows={4}
              sx={{ mb: 2 }}
              disabled={formSubmitting}
              error={!!validationErrors.message}
              helperText={validationErrors.message}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={formSubmitting}
              sx={{
                fontWeight: 600,
                px: 4,
              }}
            >
              {formSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Paper>

        {/* FAQ Section - Apple Required Questions */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            mb: 4,
            bgcolor: "white",
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Frequently Asked Questions
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>What is Bettim?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Bettim is a live sports gaming platform where users can engage
                with NCAA events in real-time. The app provides an entertaining
                way to follow games and compete with other users through virtual
                coins and leaderboards.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>
                How do users get coins?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Users receive free virtual coins when they join the app and can
                earn additional coins by participating in games and achieving
                milestones. <strong>Coins cannot be purchased with real money</strong> – they are earned through gameplay and daily bonuses only.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>
                Can users buy anything with real money?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <strong>No.</strong> Bettim does not offer any in-app purchases.
                Users cannot buy coins, items, or any other content with real
                money. All features are completely free and accessible to
                everyone.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>
                How often do rewards refresh?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Daily bonuses and free coins refresh every 24 hours. Game-specific
                rewards are updated in real-time based on live events. Users can
                check the app anytime to see their current balance and available
                rewards.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>
                How do I report a bug or issue?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                If you encounter a bug or technical issue, please email us at{" "}
                <strong>support@bettim.co</strong> with a description of the
                problem, including your device type and what you were doing when
                the issue occurred. We'll investigate and respond as quickly as
                possible.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>
                What should I do if the app crashes or freezes?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                First, try closing and reopening the app. If the problem
                persists, restart your device. If you're still experiencing
                issues, contact our support team at{" "}
                <strong>support@bettim.co</strong> and include details about when
                the crash occurs so we can help resolve it.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600 }}>
                How can I contact support?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                You can reach our support team by emailing{" "}
                <strong>support@bettim.co</strong> or by using the contact form
                at the top of this page. We typically respond within 24-48 hours
                during business days.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>

        {/* Safety & Fair Use Section */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            mb: 4,
            bgcolor: "white",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <SecurityIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Safety & Fair Use
            </Typography>
          </Box>

          <Typography variant="body1" paragraph>
            Bettim is committed to providing a safe and fair entertainment
            experience for all users:
          </Typography>

          <Box component="ul" sx={{ pl: 2, "& li": { mb: 1.5 } }}>
            <li>
              <Typography variant="body1">
                <strong>No real-money gambling:</strong> Bettim is purely for
                entertainment purposes and does not involve real-money wagering
                or gambling of any kind.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>No purchases required:</strong> Virtual coins cannot be
                purchased with real money. All features are free and accessible
                to everyone.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Entertainment only:</strong> The app is designed for fun
                and friendly competition around live sports events.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Report concerns:</strong> If you have concerns about
                misuse or need assistance, please contact our support team at
                support@bettim.co immediately.
              </Typography>
            </li>
          </Box>
        </Paper>

        {/* Divider Before Additional Content */}
        <Divider sx={{ my: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Additional Information
          </Typography>
        </Divider>

        {/* Original Q&A Document Content */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            mb: 4,
            bgcolor: "white",
            borderRadius: 2,
          }}
        >
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            ref={containerRef}
            sx={{
              fontSize: { xs: "14px", sm: "15px", md: "16px" },
              lineHeight: 1.6,
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
            }}
          />
        </Paper>

        {/* Footer */}
        <Box
          sx={{
            textAlign: "center",
            py: 3,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Bettim
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Support: <a href="mailto:support@bettim.co" style={{ color: "inherit" }}>support@bettim.co</a>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            © 2025 Bettim. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default QA;
