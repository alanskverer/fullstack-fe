import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Stack,
  SvgIcon,
} from "@mui/material";
import AppleIcon from "@mui/icons-material/Apple";
import BoltIcon from "@mui/icons-material/Bolt";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import { useNavigate } from "react-router-dom";

const GooglePlayIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z" fill="currentColor" />
  </SvgIcon>
);

const onboardingImages = [
  { src: "/images/onboarding/landing-1.png" },
  { src: "/images/onboarding/landing-2.png" },
  { src: "/images/onboarding/landing-3.png" },
  { src: "/images/onboarding/landing-4.png" },
];

const features = [
  {
    icon: <BoltIcon sx={{ fontSize: 40 }} />,
    title: "Real-Time Competition",
    description: "Watch your rank shift live as the game unfolds — every quarter matters.",
  },
  {
    icon: <LeaderboardIcon sx={{ fontSize: 40 }} />,
    title: "Live Leaderboards",
    description: "Compete against thousands and climb the all-time rankings.",
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
    title: "Win Rewards",
    description: "Earn coins, XP, and unlock exclusive avatars as you level up.",
  },
  {
    icon: <SportsBasketballIcon sx={{ fontSize: 40 }} />,
    title: "NBA & NCAA Games",
    description: "Predict final scores for tonight's games — two numbers, that's it.",
  },
];

const steps = [
  { number: "1", title: "Predict", description: "Pick a game and predict the final score" },
  { number: "2", title: "Compete", description: "Watch your position update live during the game" },
  { number: "3", title: "Dominate", description: "Win coins, climb the leaderboard, repeat" },
];

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        color: "white",
        background: `
          radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255, 107, 107, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 0% 50%, rgba(120, 119, 198, 0.07) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 100% 50%, rgba(78, 205, 196, 0.06) 0%, transparent 50%),
          radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255, 119, 198, 0.06) 0%, transparent 50%),
          #0a0a0a
        `,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          pointerEvents: "none",
          zIndex: 0,
        },
      }}
    >
      {/* Ambient glow orbs */}
      <Box
        sx={{
          position: "absolute",
          top: "-5%",
          left: "20%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 107, 107, 0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "drift 12s ease-in-out infinite",
          "@keyframes drift": {
            "0%, 100%": { transform: "translate(0, 0)" },
            "50%": { transform: "translate(30px, 20px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          right: "-5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(78, 205, 196, 0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "drift 15s ease-in-out infinite reverse",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "5%",
          left: "-5%",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(120, 119, 198, 0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "drift 18s ease-in-out infinite",
        }}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              color: "white",
              fontSize: { xs: "3rem", md: "5rem" },
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
              fontSize: { xs: "1.3rem", md: "2.2rem" },
              fontFamily: '"Exo 2", "Roboto", sans-serif',
              mb: 3,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            The Future of Live Sports Gaming
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#999",
              fontSize: { xs: "1rem", md: "1.2rem" },
              maxWidth: 600,
              mx: "auto",
              mb: 5,
              lineHeight: 1.7,
            }}
          >
            Predict live NBA & NCAA scores, compete against thousands in real-time,
            and climb the leaderboards — all with virtual currency, zero risk.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2.5}
            justifyContent="center"
            alignItems="center"
          >
            {[
              { icon: <AppleIcon sx={{ fontSize: "32px !important" }} />, subtitle: "Download on the", label: "App Store", href: "https://apps.apple.com/us/app/bettim/id6755429397" },
              { icon: <GooglePlayIcon sx={{ fontSize: "32px !important" }} />, subtitle: "GET IT ON", label: "Google Play", href: "https://play.google.com/store/apps/details?id=the.amazing.bettim&hl=en" },
            ].map(({ icon, subtitle, label, href }) => (
              <Button
                key={label}
                variant="contained"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={icon}
                sx={{
                  backgroundColor: "#fff",
                  color: "#000",
                  borderRadius: "14px",
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  minWidth: 220,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <Box sx={{ textAlign: "left", lineHeight: 1.2 }}>
                  <Typography sx={{ fontSize: "0.65rem", fontWeight: 400, lineHeight: 1 }}>
                    {subtitle}
                  </Typography>
                  <Typography sx={{ fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.3 }}>
                    {label}
                  </Typography>
                </Box>
              </Button>
            ))}
          </Stack>
        </Box>

        {/* How It Works */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              mb: 6,
              fontFamily: '"Exo 2", "Roboto", sans-serif',
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            How It Works
          </Typography>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            {steps.map((step, index) => (
              <Box key={step.number} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ textAlign: "center", flex: 1, maxWidth: 280 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      border: "2px solid #ff6b6b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: "#ff6b6b",
                        fontFamily: '"Orbitron", "Roboto", sans-serif',
                      }}
                    >
                      {step.number}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      fontFamily: '"Orbitron", "Roboto", sans-serif',
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#999" }}>
                    {step.description}
                  </Typography>
                </Box>

                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: "none", md: "block" },
                      width: 60,
                      height: "2px",
                      background: "linear-gradient(90deg, #ff6b6b, transparent)",
                      flexShrink: 0,
                    }}
                  />
                )}
              </Box>
            ))}
          </Stack>
        </Box>

        {/* App Screenshots in phone frames */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              mb: 2,
              fontFamily: '"Exo 2", "Roboto", sans-serif',
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            See It In Action
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "#999", mb: 6, maxWidth: 500, mx: "auto" }}
          >
            Real-time competition, live leaderboards, and instant results — right in your pocket.
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {onboardingImages.map((item, index) => (
              <Grid size={{ xs: 6, sm: 6, md: 3 }} key={index}>
                <Box
                  sx={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    border: "3px solid #222",
                    backgroundColor: "#111",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      border: "3px solid #ff6b6b",
                      boxShadow: "0 20px 40px rgba(255, 107, 107, 0.2)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.src}
                    alt={`Bettim app screenshot ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              mb: 6,
              fontFamily: '"Exo 2", "Roboto", sans-serif',
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Why Players Love Bettim
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {features.map((feature) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={feature.title}>
                <Card
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 3,
                    p: 3,
                    height: "100%",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 107, 107, 0.3)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box sx={{ color: "#ff6b6b", mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "white",
                      mb: 1,
                      fontSize: "1rem",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#999", lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            mb: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, rgba(255, 107, 107, 0.08), rgba(78, 205, 196, 0.08))",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontFamily: '"Exo 2", "Roboto", sans-serif',
              fontSize: { xs: "1.3rem", md: "1.8rem" },
            }}
          >
            Ready to Compete?
          </Typography>
          <Typography variant="body1" sx={{ color: "#999", mb: 4, maxWidth: 450, mx: "auto" }}>
            Download Bettim and make your first prediction in under 60 seconds.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            {[
              { icon: <AppleIcon sx={{ fontSize: "28px !important" }} />, subtitle: "Download on the", label: "App Store", href: "https://apps.apple.com/us/app/bettim/id6755429397" },
              { icon: <GooglePlayIcon sx={{ fontSize: "28px !important" }} />, subtitle: "GET IT ON", label: "Google Play", href: "https://play.google.com/store/apps/details?id=the.amazing.bettim&hl=en" },
            ].map(({ icon, subtitle, label, href }) => (
              <Button
                key={label}
                variant="contained"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={icon}
                sx={{
                  backgroundColor: "#ff6b6b",
                  color: "#fff",
                  borderRadius: "14px",
                  px: 3.5,
                  py: 1.3,
                  textTransform: "none",
                  minWidth: 200,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#ff5252",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(255, 107, 107, 0.4)",
                  },
                }}
              >
                <Box sx={{ textAlign: "left", lineHeight: 1.2 }}>
                  <Typography sx={{ fontSize: "0.6rem", fontWeight: 400, lineHeight: 1, color: "rgba(255,255,255,0.8)" }}>
                    {subtitle}
                  </Typography>
                  <Typography sx={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.3 }}>
                    {label}
                  </Typography>
                </Box>
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Orbitron", "Roboto", sans-serif',
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "#fff",
              mb: 3,
              opacity: 0.6,
            }}
          >
            Bettim
          </Typography>
          <Stack
            direction="row"
            spacing={{ xs: 2, sm: 4 }}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ mb: 3 }}
          >
            {[
              { label: "Privacy Policy", path: "/privacy" },
              { label: "Terms & Conditions", path: "/terms" },
              { label: "Q&A", path: "/qa" },
            ].map(({ label, path }) => (
              <Button
                key={label}
                onClick={() => navigate(path)}
                sx={{
                  color: "#666",
                  textTransform: "none",
                  fontSize: "0.85rem",
                  "&:hover": { color: "#ff6b6b" },
                }}
              >
                {label}
              </Button>
            ))}
          </Stack>
          <Typography variant="caption" sx={{ color: "#444" }}>
            © 2026 Bettim. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
