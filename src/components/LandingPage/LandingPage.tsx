import { useRef, useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  SvgIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import AppleIcon from "@mui/icons-material/Apple";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

const GooglePlayIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z" fill="currentColor" />
  </SvgIcon>
);

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

const showcaseSections = [
  {
    title: "Pick Your Game",
    subtitle: "Home Screen",
    description: "Browse tonight's NBA and NCAA matchups. Tap any game to jump in — it only takes seconds.",
    media: { type: "image" as const, src: "/images/showcase/pick-your-game.jpeg" },
  },
  {
    title: "Make Your Call",
    subtitle: "Place Bet",
    description: "Predict the final score — just two numbers, home and away. Lock it in with virtual coins and wait for tip-off.",
    media: { type: "video" as const, src: "/videos/showcase/place_bet_video_2.mp4" },
  },
  {
    title: "Live The Moment",
    subtitle: "My Bets",
    description: "Track every prediction in one place — upcoming, live, and completed. Watch your bets unfold in real-time.",
    media: { type: "video" as const, src: "/videos/showcase/cutted_video-compressed.mp4" },
  },
  {
    title: "Hall of Fame",
    subtitle: "All Time Leaderboard",
    description: "See who's dominating. Climb the rankings, earn your spot, and prove you're the best predictor out there.",
    media: { type: "video" as const, src: "/videos/showcase/all_time_leader.mp4" },
  },
  {
    title: "Own Your Look",
    subtitle: "Avatar Page",
    description: "Unlock and customize exclusive avatars as you level up. Stand out in the crowd with your unique style.",
    media: { type: "video" as const, src: "/videos/showcase/avatar_world.mp4" },
  },
];

const faqs = [
  {
    question: "What is Bettim?",
    answer: "Bettim is a live sports gaming platform where users can engage with NBA and NCAA events in real-time. The app provides an entertaining way to follow games and compete with other users through virtual coins and leaderboards.",
  },
  {
    question: "Can users buy anything with real money?",
    answer: "No. Bettim does not offer any in-app purchases. Users cannot buy coins, items, or any other content with real money. All features are completely free and accessible to everyone.",
  },
  {
    question: "How do users get coins?",
    answer: "Users receive free virtual coins when they join the app and can earn additional coins by participating in games and achieving milestones. Coins cannot be purchased with real money — they are earned through gameplay and daily bonuses only.",
  },
  {
    question: "How often do rewards refresh?",
    answer: "Daily bonuses and free coins refresh every 24 hours. Game-specific rewards are updated in real-time based on live events. Users can check the app anytime to see their current balance and available rewards.",
  },
  {
    question: "How can I contact support?",
    answer: "You can reach our support team by emailing support@bettim.co. We typically respond within 24-48 hours during business days.",
  },
];

const GradientDivider = () => (
  <Box
    sx={{
      height: "1px",
      my: { xs: 2, md: 4 },
      mx: "auto",
      maxWidth: 400,
      background: "linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.3), transparent)",
    }}
  />
);

const storeButtons = [
  { icon: <AppleIcon sx={{ fontSize: "32px !important" }} />, subtitle: "Download on the", label: "App Store", href: "https://apps.apple.com/us/app/bettim/id6755429397" },
  { icon: <GooglePlayIcon sx={{ fontSize: "32px !important" }} />, subtitle: "GET IT ON", label: "Google Play", href: "https://play.google.com/store/apps/details?id=the.amazing.bettim&hl=en" },
];

const steps = [
  { number: "1", title: "Predict", description: "Pick a game and call the final score" },
  { number: "2", title: "Compete", description: "Watch your rank shift live during the game" },
  { number: "3", title: "Dominate", description: "Win coins, level up, climb the leaderboard" },
];

const ShowcaseSection = ({
  section,
  index,
}: {
  section: (typeof showcaseSections)[number];
  index: number;
}) => {
  const { ref, isVisible } = useInView(0.15);
  const alignLeft = index % 2 === 0;

  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        justifyContent: { xs: "center", md: alignLeft ? "flex-start" : "flex-end" },
        mb: 7,
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateX(0)"
          : alignLeft ? "translateX(-60px)" : "translateX(60px)",
        transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: { md: "55%" },
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            sx={{
              color: "#ff6b6b",
              fontWeight: 600,
              fontSize: "0.85rem",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              mb: 1.5,
              fontFamily: '"Orbitron", "Roboto", sans-serif',
            }}
          >
            {section.subtitle}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              fontFamily: '"Exo 2", "Roboto", sans-serif',
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            {section.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#999",
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.7,
              maxWidth: 420,
              mx: "auto",
            }}
          >
            {section.description}
          </Typography>
        </Box>

        <Box
          sx={{
            width: { xs: "60%", sm: 240, md: 280 },
            borderRadius: "28px",
            overflow: "hidden",
            border: "3px solid #222",
            backgroundColor: "#111",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          }}
        >
          {section.media.type === "image" ? (
            <Box
              component="img"
              src={section.media.src}
              alt={section.title}
              sx={{ width: "100%", height: "auto", display: "block" }}
            />
          ) : (
            <Box
              component="video"
              autoPlay
              loop
              muted
              playsInline
              src={section.media.src}
              sx={{ width: "100%", height: "auto", display: "block" }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

const StickyDownloadBar = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "rgba(10, 10, 10, 0.92)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        py: 1.5,
        px: 2,
        transform: show ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s ease",
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        justifyContent="center"
        alignItems="center"
      >
        <Typography
          sx={{
            color: "#fff",
            fontWeight: 600,
            fontSize: { xs: "0.8rem", sm: "0.95rem" },
            display: { xs: "none", sm: "block" },
            mr: 1,
          }}
        >
          Download Bettim
        </Typography>
        {storeButtons.map(({ icon, label, href }) => (
          <Button
            key={label}
            variant="contained"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={icon}
            size="small"
            sx={{
              backgroundColor: "#ff6b6b",
              color: "#fff",
              borderRadius: "10px",
              px: { xs: 1.5, sm: 2.5 },
              py: 0.8,
              textTransform: "none",
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
              fontWeight: 700,
              minWidth: { xs: "auto", sm: 150 },
              "&:hover": {
                backgroundColor: "#ff5252",
              },
            }}
          >
            {label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

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
        pb: 8,
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
      <StickyDownloadBar />

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
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          {/* Logo */}
          <Box
            component="img"
            src="/images/logo/logo.png"
            alt="Bettim"
            sx={{
              width: { xs: 160, md: 210 },
              height: { xs: 160, md: 210 },
              borderRadius: "28px",
              mx: "auto",
              mb: 4,
              display: "block",
            }}
          />

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
            {storeButtons.map(({ icon, subtitle, label, href }) => (
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

          {/* Scroll indicator */}
          <Box
            sx={{
              mt: 6,
              animation: "bounce 2s ease-in-out infinite",
              "@keyframes bounce": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(8px)" },
              },
            }}
          >
            <Typography sx={{ color: "#555", fontSize: "0.8rem", mb: 0.5 }}>
              Scroll to explore
            </Typography>
            <KeyboardArrowDownIcon sx={{ color: "#555", fontSize: 28 }} />
          </Box>
        </Box>

        {/* How It Works */}
        <Box sx={{ mb: { xs: 10, md: 14 } }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              mb: 5,
              fontFamily: '"Exo 2", "Roboto", sans-serif',
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            How It Works
          </Typography>

          {/* Mobile: horizontal row of circles + titles */}
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}
            sx={{ display: { xs: "flex", sm: "none" } }}
          >
            {steps.map((step, index) => (
              <Box key={step.number} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ textAlign: "center", width: 100 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      border: "2px solid #ff6b6b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: 800,
                        color: "#ff6b6b",
                        fontFamily: '"Orbitron", "Roboto", sans-serif',
                      }}
                    >
                      {step.number}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontFamily: '"Orbitron", "Roboto", sans-serif',
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontSize: "0.75rem",
                      mb: 0.5,
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography sx={{ color: "#999", fontSize: "0.7rem", lineHeight: 1.4 }}>
                    {step.description}
                  </Typography>
                </Box>
                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      width: 20,
                      height: "2px",
                      background: "linear-gradient(90deg, #ff6b6b, transparent)",
                      flexShrink: 0,
                      mt: -4,
                    }}
                  />
                )}
              </Box>
            ))}
          </Stack>

          {/* Desktop: wider row */}
          <Stack
            direction="row"
            spacing={4}
            alignItems="flex-start"
            justifyContent="center"
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            {steps.map((step, index) => (
              <Box key={step.number} sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                <Box sx={{ textAlign: "center", flex: 1 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
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
                        fontSize: "1.3rem",
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
                      fontSize: "1.15rem",
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#999", maxWidth: 240, mx: "auto" }}>
                    {step.description}
                  </Typography>
                </Box>

                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      width: 40,
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

        <GradientDivider />

        {/* Showcase Sections */}
        {showcaseSections.map((section, index) => (
          <ShowcaseSection key={section.title} section={section} index={index} />
        ))}

        <GradientDivider />

        {/* FAQ Section */}
        <Box sx={{ mb: { xs: 8, md: 10 }, maxWidth: 700, mx: "auto" }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              mb: 4,
              fontFamily: '"Exo 2", "Roboto", sans-serif',
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Frequently Asked Questions
          </Typography>

          {faqs.map((faq) => (
            <Accordion
              key={faq.question}
              disableGutters
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "12px !important",
                mb: 1.5,
                "&::before": { display: "none" },
                "&:first-of-type": { borderRadius: "12px !important" },
                "&:last-of-type": { borderRadius: "12px !important" },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#999" }} />}
                sx={{
                  px: 3,
                  py: 0.5,
                  "& .MuiAccordionSummary-content": { my: 1.5 },
                }}
              >
                <Typography sx={{ fontWeight: 600, color: "#fff", fontSize: { xs: "0.95rem", md: "1.05rem" } }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 2.5 }}>
                <Typography sx={{ color: "#999", lineHeight: 1.7, fontSize: { xs: "0.9rem", md: "1rem" } }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <GradientDivider />

        {/* CTA Section */}
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: { xs: 3, sm: 4, md: 6 },
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
            {storeButtons.map(({ icon, subtitle, label, href }) => (
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
          <Box
            component="img"
            src="/images/logo/logo.png"
            alt="Bettim"
            sx={{
              width: 70,
              height: 70,
              borderRadius: "16px",
              mx: "auto",
              mb: 2,
              display: "block",
              opacity: 0.6,
            }}
          />
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
