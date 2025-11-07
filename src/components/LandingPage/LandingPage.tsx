import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Tooltip,
} from "@mui/material";
import { AdminPanelSettings as AdminIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Images - using your b-logo for all 4 images
const onboardingImages = [
  {
    src: "/images/onboarding/landing-1.png",
  },
  {
    src: "/images/onboarding/landing-2.png",
  },
  {
    src: "/images/onboarding/landing-3.png",
  },
  {
    src: "/images/onboarding/landing-4.png",
  },
];

export const LandingPage = () => {
  const navigate = useNavigate();

  // Check if user is authenticated
  const isAuthenticated = (() => {
    const authData = localStorage.getItem("bettim-admin-auth");
    if (!authData) return false;

    try {
      const { authenticated, timestamp } = JSON.parse(authData);
      // Check if token is older than 24 hours
      const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;
      if (isExpired) {
        localStorage.removeItem("bettim-admin-auth");
        return false;
      }
      return authenticated;
    } catch {
      localStorage.removeItem("bettim-admin-auth");
      return false;
    }
  })();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        color: "white",
        background: `
                    radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 40% 60%, rgba(120, 219, 255, 0.05) 0%, transparent 50%),
                    #0a0a0a
                `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "linear-gradient(45deg, rgba(120, 119, 198, 0.05), rgba(255, 119, 198, 0.05))",
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
            "50%": { transform: "translateY(-20px) rotate(180deg)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "60%",
          right: "15%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background:
            "linear-gradient(45deg, rgba(120, 219, 255, 0.05), rgba(255, 119, 198, 0.05))",
          animation: "float 8s ease-in-out infinite reverse",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
            "50%": { transform: "translateY(-20px) rotate(180deg)" },
          },
        }}
      />

      <Container maxWidth="lg" sx={{ py: 8, position: "relative", zIndex: 1 }}>
        {/* Admin Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
          {isAuthenticated ? (
            <Button
              variant="contained"
              onClick={() => navigate("/admin/dashboard")}
              startIcon={<AdminIcon />}
              sx={{
                backgroundColor: "#333",
                color: "white",
                "&:hover": {
                  backgroundColor: "#555",
                },
              }}
            >
              Admin Dashboard
            </Button>
          ) : (
            <Tooltip title="Admin Login">
              <IconButton
                onClick={() => navigate("/admin/login")}
                sx={{
                  color: "#666",
                  "&:hover": {
                    color: "white",
                  },
                }}
              >
                <AdminIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Title and Description */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              color: "white",
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontFamily: '"Orbitron", "Roboto", sans-serif',
              textShadow: "0 0 30px rgba(255, 255, 255, 0.3)",
              letterSpacing: "0.05em",
              mb: 3,
            }}
          >
            Bettim
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "#ccc",
              fontSize: { xs: "1.5rem", md: "2.5rem" },
              fontFamily: '"Exo 2", "Roboto", sans-serif',
              mb: 4,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            The Future of Sports Betting
          </Typography>

          <Typography
            variant="h4"
            sx={{
              color: "#ff6b6b",
              fontWeight: 600,
              fontSize: { xs: "1.2rem", md: "1.8rem" },
              fontFamily: '"Orbitron", "Roboto", sans-serif',
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              animation: "pulse 2s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { opacity: 0.8 },
                "50%": { opacity: 1 },
              },
            }}
          >
            Coming Soon
          </Typography>
        </Box>

        {/* 4 Images */}
        <Grid container spacing={4} justifyContent="center" sx={{ mb: 8 }}>
          {onboardingImages.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: 3,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    border: "1px solid #ff6b6b",
                    boxShadow: "0 20px 40px rgba(255, 107, 107, 0.3)",
                    "&::before": {
                      opacity: 1,
                    },
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(45deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1))",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    zIndex: 1,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="500"
                  width={"700"}
                  image={item.src}
                  alt={`Image ${index + 1}`}
                  sx={{
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Footer Links */}
        <Box
          sx={{
            mt: 8,
            pt: 4,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "center",
            gap: { xs: 2, sm: 4 },
            flexWrap: "wrap",
          }}
        >
          <Button
            onClick={() => navigate("/privacy")}
            sx={{
              color: "#999",
              textTransform: "none",
              fontSize: "0.9rem",
              "&:hover": {
                color: "#ff6b6b",
              },
            }}
          >
            Privacy Policy
          </Button>
          <Button
            onClick={() => navigate("/terms")}
            sx={{
              color: "#999",
              textTransform: "none",
              fontSize: "0.9rem",
              "&:hover": {
                color: "#ff6b6b",
              },
            }}
          >
            Terms & Conditions
          </Button>
          <Typography
            variant="caption"
            sx={{
              color: "#666",
              alignSelf: "center",
            }}
          >
            © 2025 Bettim. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
