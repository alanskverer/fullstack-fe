import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import AppleIcon from "@mui/icons-material/Apple";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { useNavigate } from "react-router-dom";

// ─── Design Tokens ────────────────────────────────────────────────────────────

const C = {
  bg: "#070B12",
  bgSection: "#0A0E1A",
  card: "rgba(255, 255, 255, 0.04)",
  border: "rgba(255, 255, 255, 0.08)",
  borderHover: "rgba(124, 92, 252, 0.5)",
  purple: "#7C5CFC",
  purpleGlow: "rgba(124, 92, 252, 0.25)",
  rose: "#FF3055",
  roseGlow: "rgba(255, 48, 85, 0.25)",
  teal: "#06D6A0",
  textPrimary: "#EEF2FF",
  textSecondary: "#8892A4",
  textMuted: "#404B64",
  gold: "#FFB800",
  display: '"Russo One", "Roboto", sans-serif',
  body: '"Chakra Petch", "Roboto", sans-serif',
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // rAF ensures the browser paints the initial opacity:0 state first,
    // so the CSS transition is always visible when the observer fires.
    let rafId: number;
    let obs: IntersectionObserver;

    rafId = requestAnimationFrame(() => {
      obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(el);
          }
        },
        { threshold }
      );
      obs.observe(el);
    });

    return () => {
      cancelAnimationFrame(rafId);
      obs?.disconnect();
    };
  }, [threshold]);

  return { ref, visible };
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const GooglePlayIcon = (props: object) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.3 2.3-8.636-8.632z"
      fill="currentColor"
    />
  </SvgIcon>
);

const STORE_BUTTONS = [
  {
    icon: <AppleIcon sx={{ fontSize: 28 }} />,
    subtitle: "Download on the",
    label: "App Store",
    href: "https://apps.apple.com/us/app/bettim/id6755429397",
  },
  {
    icon: <GooglePlayIcon sx={{ fontSize: 28 }} />,
    subtitle: "GET IT ON",
    label: "Google Play",
    href: "https://play.google.com/store/apps/details?id=the.amazing.bettim&hl=en",
  },
];

const STEPS = [
  {
    num: "01",
    Icon: TrackChangesIcon,
    title: "Predict",
    desc: "Pick any live NBA or NCAA game and call the final score. Takes under 10 seconds.",
    color: C.purple,
  },
  {
    num: "02",
    Icon: LeaderboardIcon,
    title: "Compete",
    desc: "Watch your ranking shift in real-time as the game unfolds. Every basket counts.",
    color: C.rose,
  },
  {
    num: "03",
    Icon: EmojiEventsIcon,
    title: "Dominate",
    desc: "Earn virtual coins, unlock exclusive avatars, and cement your place at the top.",
    color: C.purple,
  },
];

const SHOWCASE = [
  {
    label: "Home Screen",
    title: "Pick Your Game",
    desc: "Browse tonight's NBA and NCAA matchups. Every detail at a glance — tip-off times, team records. Tap any game to jump in instantly.",
    media: { type: "image" as const, src: "/images/showcase/pick-your-game.jpeg" },
    accent: C.purple,
  },
  {
    label: "Place Prediction",
    title: "Make Your Call",
    desc: "Predict the final score — home and away. Lock it in with virtual coins before tip-off and feel the rush when the game goes live.",
    media: { type: "video" as const, src: "/videos/showcase/place_bet_video_2.mp4" },
    accent: C.rose,
  },
  {
    label: "Live Tracking",
    title: "Live the Moment",
    desc: "Every prediction tracked in one place. See upcoming games, live scores, and completed results. Real-time, always.",
    media: { type: "video" as const, src: "/videos/showcase/cutted_video-compressed.mp4" },
    accent: C.purple,
  },
  {
    label: "All-Time Leaderboard",
    title: "Hall of Fame",
    desc: "See who's dominating across all players. Climb the all-time rankings and prove you're the sharpest sports mind out there.",
    media: { type: "video" as const, src: "/videos/showcase/all_time_leader.mp4" },
    accent: C.rose,
  },
  {
    label: "Avatar Studio",
    title: "Own Your Look",
    desc: "Unlock exclusive avatars as you level up. Every rank earned shows in your style — stand out in every leaderboard.",
    media: { type: "video" as const, src: "/videos/showcase/avatar_world.mp4" },
    accent: C.purple,
  },
];

const REVIEWS = [
  {
    name: "Alex M.",
    initials: "AM",
    color: C.purple,
    date: "Mar 2026",
    title: "Best sports app I've used",
    text: "The real-time predictions are insane. I was skeptical at first but now I check it before every NBA game. The leaderboard keeps me hooked every single night.",
  },
  {
    name: "Jordan K.",
    initials: "JK",
    color: C.rose,
    date: "Feb 2026",
    title: "Super addicting, zero risk",
    text: "Love that it's 100% free with virtual coins. No pay-to-win nonsense. The live updates are smooth and the overall UI feels genuinely premium.",
  },
  {
    name: "Sam R.",
    initials: "SR",
    color: C.teal,
    date: "Mar 2026",
    title: "NCAA season just got better",
    text: "Finally an app that makes NCAA games exciting to follow. The avatar customization is a great touch and my whole friend group is on it now.",
  },
];

const FAQS = [
  {
    q: "What is Bettim?",
    a: "Bettim is a live sports gaming platform where users engage with NBA and NCAA events in real-time. The app provides an entertaining way to follow games and compete with other users through virtual coins and leaderboards.",
  },
  {
    q: "Can users buy anything with real money?",
    a: "No. Bettim does not offer any in-app purchases. Users cannot buy coins, items, or any other content with real money. All features are completely free and accessible to everyone.",
  },
  {
    q: "How do users get coins?",
    a: "Users receive free virtual coins on signup and earn more by participating in games and achieving milestones. Coins cannot be purchased — they are earned through gameplay and daily bonuses only.",
  },
  {
    q: "How often do rewards refresh?",
    a: "Daily bonuses and free coins refresh every 24 hours. Game-specific rewards are updated in real-time based on live events.",
  },
  {
    q: "How can I contact support?",
    a: "Reach our support team at support@bettim.co. We typically respond within 24–48 hours during business days.",
  },
];

// ─── Utility Components ────────────────────────────────────────────────────────

const EyebrowLabel = ({
  children,
  color = C.purple,
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <Typography
    sx={{
      fontFamily: C.body,
      fontSize: "0.7rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.2em",
      color,
      mb: 1.5,
    }}
  >
    {children}
  </Typography>
);

const StoreButton = ({
  icon,
  subtitle,
  label,
  href,
  variant = "white",
}: {
  icon: React.ReactNode;
  subtitle: string;
  label: string;
  href: string;
  variant?: "white" | "rose";
}) => {
  const isWhite = variant === "white";
  return (
    <Button
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        backgroundColor: isWhite ? "#FFFFFF" : C.rose,
        color: isWhite ? "#0A0A0A" : "#fff",
        border: "none",
        borderRadius: "14px",
        px: 3,
        py: 1.4,
        textTransform: "none",
        minWidth: 185,
        cursor: "pointer",
        transition: "all 0.22s ease",
        boxShadow: isWhite
          ? "0 4px 20px rgba(255,255,255,0.12)"
          : `0 4px 20px ${C.roseGlow}`,
        "&:hover": {
          backgroundColor: isWhite ? "#F0EEFF" : "#e0234a",
          transform: "translateY(-3px)",
          boxShadow: isWhite
            ? `0 12px 36px ${C.purpleGlow}`
            : `0 16px 40px ${C.roseGlow}`,
        },
      }}
    >
      <Box sx={{ color: isWhite ? "#0A0A0A" : "#fff", display: "flex", fontSize: 26 }}>
        {icon}
      </Box>
      <Box sx={{ textAlign: "left", lineHeight: 1.25 }}>
        <Typography
          sx={{
            fontSize: "0.58rem",
            fontWeight: 400,
            fontFamily: C.body,
            opacity: 0.6,
            lineHeight: 1,
            color: isWhite ? "#0A0A0A" : "#fff",
          }}
        >
          {subtitle}
        </Typography>
        <Typography
          sx={{
            fontSize: "1.05rem",
            fontWeight: 700,
            fontFamily: C.body,
            lineHeight: 1.3,
            color: isWhite ? "#0A0A0A" : "#fff",
          }}
        >
          {label}
        </Typography>
      </Box>
    </Button>
  );
};

const PhoneFrame = ({
  section,
  visible,
}: {
  section: (typeof SHOWCASE)[number];
  visible: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (visible && section.media.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [visible, section.media.type]);

  return (
    <Box sx={{ position: "relative", mx: "auto" }}>
      <Box
        sx={{
          position: "absolute",
          inset: "-30%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${section.accent}30 0%, transparent 70%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "relative",
          width: { xs: "65vw", sm: 230, md: 270 },
          maxWidth: 270,
          borderRadius: "38px",
          border: "2px solid rgba(255,255,255,0.10)",
          overflow: "hidden",
          background: "#000",
          boxShadow: `
            0 60px 120px rgba(0,0,0,0.65),
            0 0 0 1px rgba(255,255,255,0.04),
            inset 0 1px 0 rgba(255,255,255,0.06)
          `,
        }}
      >
        {section.media.type === "image" ? (
          <Box
            component="img"
            src={section.media.src}
            alt={section.title}
            sx={{ width: "100%", display: "block" }}
          />
        ) : (
          <Box
            ref={videoRef}
            component="video"
            loop
            muted
            playsInline
            preload="none"
            src={section.media.src}
            sx={{ width: "100%", display: "block" }}
          />
        )}
      </Box>
    </Box>
  );
};

// ─── Sticky Bar ───────────────────────────────────────────────────────────────

const StickyBar = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(7, 11, 18, 0.88)",
        backdropFilter: "blur(16px)",
        borderTop: `1px solid ${C.border}`,
        py: 1.2,
        px: 2,
        transform: show ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
        <Box
          component="img"
          src="/images/logo/logo.png"
          alt="Bettim"
          sx={{ width: 32, height: 32, borderRadius: "8px", display: { xs: "none", sm: "block" } }}
        />
        <Typography
          sx={{
            color: C.textPrimary,
            fontWeight: 600,
            fontFamily: C.body,
            fontSize: { xs: "0.78rem", sm: "0.9rem" },
            display: { xs: "none", sm: "block" },
          }}
        >
          Download Bettim
        </Typography>
        {STORE_BUTTONS.map(({ icon, label, href }) => (
          <Button
            key={label}
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{
              background: C.rose,
              color: "#fff",
              borderRadius: "10px",
              px: { xs: 1.5, sm: 2.5 },
              py: 0.7,
              textTransform: "none",
              fontFamily: C.body,
              fontSize: { xs: "0.75rem", sm: "0.82rem" },
              fontWeight: 700,
              gap: 0.7,
              cursor: "pointer",
              "&:hover": { background: "#e0234a" },
            }}
          >
            <Box sx={{ display: "flex", fontSize: 16 }}>{icon}</Box>
            {label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: C.bg,
        color: C.textPrimary,
        overflowX: "hidden",
        pb: 10,
      }}
    >
      <StickyBar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
          px: 3,
          pt: 6,
          pb: 8,
          background: `
            radial-gradient(ellipse 130% 70% at 50% -10%, rgba(124, 92, 252, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 90% 90%, rgba(255, 48, 85, 0.10) 0%, transparent 55%),
            ${C.bg}
          `,
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            pointerEvents: "none",
          },
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            position: "relative",
            display: "inline-block",
            mb: 4,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: "-40%",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${C.purpleGlow} 0%, transparent 70%)`,
              filter: "blur(30px)",
              pointerEvents: "none",
            }}
          />
          <Box
            component="img"
            src="/images/logo/logo.png"
            alt="Bettim"
            sx={{
              position: "relative",
              width: { xs: 100, md: 130 },
              height: { xs: 100, md: 130 },
              borderRadius: "26px",
              boxShadow: `0 0 0 1px rgba(255,255,255,0.10), 0 20px 60px rgba(0,0,0,0.5)`,
              display: "block",
            }}
          />
        </Box>

        {/* Eyebrow */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1.5,
            border: `1px solid ${C.border}`,
            borderRadius: "99px",
            px: 2.5,
            py: 0.7,
            mb: 4,
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: C.teal,
              boxShadow: `0 0 8px ${C.teal}`,
            }}
          />
          <Typography
            sx={{
              fontFamily: C.body,
              fontSize: "0.72rem",
              fontWeight: 500,
              color: C.textSecondary,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Live Sports Gaming · NBA · NCAA
          </Typography>
        </Box>

        {/* Headline */}
        <Typography
          component="h1"
          sx={{
            fontFamily: C.display,
            fontWeight: 400,
            fontSize: { xs: "2.6rem", sm: "3.6rem", md: "5rem" },
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            mb: 3,
            background: "linear-gradient(135deg, #EEF2FF 20%, #C4B5FD 55%, #FB7185 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            maxWidth: 800,
          }}
        >
          PREDICT.
          <br />
          COMPETE.
          <br />
          DOMINATE.
        </Typography>

        {/* Subheadline */}
        <Typography
          sx={{
            fontFamily: C.body,
            color: C.textSecondary,
            fontSize: { xs: "1rem", md: "1.15rem" },
            lineHeight: 1.8,
            maxWidth: 540,
            mb: 5,
          }}
        >
          Call live NBA &amp; NCAA scores, compete against thousands in
          real-time, and climb the global leaderboards — all with virtual coins,
          zero risk.
        </Typography>

        {/* Store Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <StoreButton variant="white" {...STORE_BUTTONS[0]} />
          <StoreButton variant="rose" {...STORE_BUTTONS[1]} />
        </Stack>

        {/* Social Proof */}
        <Stack
          direction="row"
          spacing={{ xs: 2, sm: 4 }}
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          sx={{ gap: 1 }}
        >
          <Stack direction="row" spacing={0.5} alignItems="center">
            {[...Array(5)].map((_, i) => (
              <Box key={i} sx={{ color: C.gold, fontSize: 16, lineHeight: 1 }}>
                ★
              </Box>
            ))}
            <Typography
              sx={{
                fontFamily: C.body,
                fontSize: "0.85rem",
                fontWeight: 600,
                color: C.textPrimary,
                ml: 0.5,
              }}
            >
              4.8
            </Typography>
            <Typography
              sx={{
                fontFamily: C.body,
                fontSize: "0.8rem",
                color: C.textMuted,
                ml: 0.3,
              }}
            >
              App Store
            </Typography>
          </Stack>
          <Box sx={{ width: 1, height: 18, background: C.border }} />
          <Typography sx={{ fontFamily: C.body, fontSize: "0.85rem", color: C.textSecondary }}>
            <Box component="span" sx={{ color: C.textPrimary, fontWeight: 700 }}>
              10,000+
            </Box>{" "}
            Players
          </Typography>
          <Box sx={{ width: 1, height: 18, background: C.border }} />
          <Typography sx={{ fontFamily: C.body, fontSize: "0.85rem", color: C.textSecondary }}>
            <Box component="span" sx={{ color: C.textPrimary, fontWeight: 700 }}>
              100%
            </Box>{" "}
            Free Forever
          </Typography>
        </Stack>

        {/* Scroll indicator */}
        <Box
          sx={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            opacity: 0.4,
          }}
        >
          <Box
            sx={{
              width: 1,
              height: 48,
              background: `linear-gradient(to bottom, transparent, ${C.purple})`,
              borderRadius: 1,
            }}
          />
        </Box>
      </Box>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <Box
        sx={{
          background: C.bgSection,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          py: { xs: 3.5, md: 4 },
        }}
      >
        <Container maxWidth="md">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            divider={
              <Box
                sx={{
                  width: { xs: "60px", sm: "1px" },
                  height: { xs: "1px", sm: "36px" },
                  background: C.border,
                  mx: "auto",
                }}
              />
            }
            spacing={{ xs: 3, sm: 0 }}
            justifyContent="space-around"
            alignItems="center"
            sx={{ textAlign: "center" }}
          >
            {[
              { value: "10,000+", label: "Active Players" },
              { value: "4.8 ★", label: "App Store Rating" },
              { value: "100%", label: "Free — No purchases" },
            ].map(({ value, label }) => (
              <Box key={label}>
                <Typography
                  sx={{
                    fontFamily: C.display,
                    fontSize: { xs: "1.8rem", md: "2.2rem" },
                    background: `linear-gradient(135deg, ${C.purple}, ${C.rose})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1.2,
                  }}
                >
                  {value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: C.body,
                    fontSize: "0.82rem",
                    color: C.textSecondary,
                    mt: 0.5,
                    letterSpacing: "0.04em",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <Box component="section" sx={{ py: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 7, md: 9 } }}>
            <EyebrowLabel>How It Works</EyebrowLabel>
            <Typography
              sx={{
                fontFamily: C.display,
                fontSize: { xs: "2rem", md: "2.8rem" },
                color: C.textPrimary,
                lineHeight: 1.15,
              }}
            >
              THREE STEPS TO WIN
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
              gap: 3,
            }}
          >
            {STEPS.map((step) => (
              <StepCard key={step.num} step={step} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── SHOWCASE ──────────────────────────────────────────────────────── */}
      <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 8, md: 12 } }}>
            <EyebrowLabel>See It In Action</EyebrowLabel>
            <Typography
              sx={{
                fontFamily: C.display,
                fontSize: { xs: "2rem", md: "2.8rem" },
                color: C.textPrimary,
                lineHeight: 1.15,
              }}
            >
              THE FUTURE OF LIVE SPORTS GAMING
            </Typography>
          </Box>

          {SHOWCASE.map((section, i) => (
            <ShowcaseItem key={section.title} section={section} index={i} />
          ))}
        </Container>
      </Box>

      {/* ── REVIEWS ───────────────────────────────────────────────────────── */}
      <Box component="section" sx={{ py: { xs: 10, md: 14 }, background: C.bgSection }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 7, md: 9 } }}>
            <EyebrowLabel>Player Reviews</EyebrowLabel>
            <Typography
              sx={{
                fontFamily: C.display,
                fontSize: { xs: "2rem", md: "2.8rem" },
                color: C.textPrimary,
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              LOVED BY THOUSANDS
            </Typography>
            <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
              {[...Array(5)].map((_, i) => (
                <Box key={i} sx={{ color: C.gold, fontSize: 20 }}>★</Box>
              ))}
              <Typography sx={{ fontFamily: C.body, color: C.textSecondary, ml: 1, fontSize: "0.9rem" }}>
                4.8 out of 5
              </Typography>
            </Stack>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
              gap: 3,
            }}
          >
            {REVIEWS.map((r) => (
              <ReviewCard key={r.name} review={r} />
            ))}
          </Box>
        </Container>
      </Box>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <Box component="section" sx={{ py: { xs: 10, md: 14 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
            <EyebrowLabel>FAQ</EyebrowLabel>
            <Typography
              sx={{
                fontFamily: C.display,
                fontSize: { xs: "2rem", md: "2.8rem" },
                color: C.textPrimary,
                lineHeight: 1.15,
              }}
            >
              COMMON QUESTIONS
            </Typography>
          </Box>

          <Stack spacing={1.5}>
            {FAQS.map((faq) => (
              <Accordion
                key={faq.q}
                disableGutters
                sx={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: "14px !important",
                  boxShadow: "none",
                  "&::before": { display: "none" },
                  "&.Mui-expanded": {
                    borderColor: "rgba(124, 92, 252, 0.3)",
                    background: "rgba(124, 92, 252, 0.05)",
                  },
                  transition: "border-color 0.2s, background 0.2s",
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon sx={{ color: C.textMuted, fontSize: 20 }} />
                  }
                  sx={{ px: 3, py: 0.5, "& .MuiAccordionSummary-content": { my: 1.5 } }}
                >
                  <Typography
                    sx={{
                      fontFamily: C.body,
                      fontWeight: 600,
                      color: C.textPrimary,
                      fontSize: { xs: "0.95rem", md: "1rem" },
                    }}
                  >
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 2.5, pt: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: C.body,
                      color: C.textSecondary,
                      lineHeight: 1.8,
                      fontSize: { xs: "0.9rem", md: "0.95rem" },
                    }}
                  >
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <Box component="section" sx={{ py: { xs: 6, md: 8 }, px: 3 }}>
        <Container maxWidth="md">
          <Box
            sx={{
              borderRadius: "28px",
              border: `1px solid rgba(124, 92, 252, 0.25)`,
              background: `
                radial-gradient(ellipse 100% 80% at 50% -10%, rgba(124, 92, 252, 0.18) 0%, transparent 65%),
                rgba(124, 92, 252, 0.06)
              `,
              textAlign: "center",
              px: { xs: 3, sm: 5, md: 8 },
              py: { xs: 7, md: 9 },
            }}
          >
            <Typography
              sx={{
                fontFamily: C.display,
                fontSize: { xs: "2rem", md: "3rem" },
                color: C.textPrimary,
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              READY TO COMPETE?
            </Typography>
            <Typography
              sx={{
                fontFamily: C.body,
                color: C.textSecondary,
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.8,
                mb: 5,
                maxWidth: 420,
                mx: "auto",
              }}
            >
              Download Bettim and make your first prediction in under 60 seconds.
              Join 10,000+ players today.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              {STORE_BUTTONS.map((btn, i) => (
                <StoreButton key={btn.label} variant={i === 0 ? "white" : "rose"} {...btn} />
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <Box
        component="footer"
        sx={{
          borderTop: `1px solid ${C.border}`,
          pt: 5,
          pb: 4,
          px: 3,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "center", sm: "flex-start" }}
            spacing={4}
            sx={{ mb: 5 }}
          >
            {/* Brand */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                component="img"
                src="/images/logo/logo.png"
                alt="Bettim"
                sx={{ width: 44, height: 44, borderRadius: "12px" }}
              />
              <Box>
                <Typography
                  sx={{
                    fontFamily: C.display,
                    fontSize: "1.1rem",
                    color: C.textPrimary,
                    lineHeight: 1.2,
                  }}
                >
                  BETTIM
                </Typography>
                <Typography
                  sx={{
                    fontFamily: C.body,
                    fontSize: "0.72rem",
                    color: C.textMuted,
                    letterSpacing: "0.08em",
                  }}
                >
                  Live Sports Gaming
                </Typography>
              </Box>
            </Stack>

            {/* Nav + social */}
            <Stack spacing={2} alignItems={{ xs: "center", sm: "flex-end" }}>
              <Stack direction="row" spacing={3} flexWrap="wrap" justifyContent="center">
                {[
                  { label: "Privacy Policy", path: "/privacy" },
                  { label: "Terms & Conditions", path: "/terms" },
                  { label: "Q&A", path: "/qa" },
                ].map(({ label, path }) => (
                  <Typography
                    key={label}
                    onClick={() => navigate(path)}
                    sx={{
                      fontFamily: C.body,
                      fontSize: "0.82rem",
                      color: C.textSecondary,
                      cursor: "pointer",
                      transition: "color 0.2s",
                      "&:hover": { color: C.textPrimary },
                    }}
                  >
                    {label}
                  </Typography>
                ))}
              </Stack>

              {/* Social links */}
              <Stack direction="row" spacing={1.5}>
                {[
                  {
                    label: "Instagram",
                    href: "https://www.instagram.com/bettim.co?igsh=d3lsNmJxMjJrZHE2",
                    icon: (
                      <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 18 }}>
                        <path
                          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                          fill="currentColor"
                        />
                      </SvgIcon>
                    ),
                  },
                ].map(({ label, href, icon }) => (
                  <Box
                    key={label}
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      border: `1px solid ${C.border}`,
                      color: C.textMuted,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        color: C.textPrimary,
                        borderColor: C.border,
                        background: C.card,
                      },
                    }}
                  >
                    {icon}
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Stack>

          <Box sx={{ borderTop: `1px solid ${C.border}`, pt: 3, textAlign: "center" }}>
            <Typography
              sx={{
                fontFamily: C.body,
                fontSize: "0.76rem",
                color: C.textMuted,
                letterSpacing: "0.04em",
              }}
            >
              © 2026 Bettim. All rights reserved. · support@bettim.co
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

// ─── Section Sub-components ────────────────────────────────────────────────────

function StepCard({ step }: { step: (typeof STEPS)[number] }) {
  const { ref, visible } = useInView(0.1);
  const { Icon } = step;

  return (
    <Box
      ref={ref}
      sx={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "20px",
        p: { xs: 3, md: 4 },
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: "opacity 0.6s ease 0.2s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${step.color}, transparent)`,
        },
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 52,
          height: 52,
          borderRadius: "14px",
          background: `${step.color}18`,
          border: `1px solid ${step.color}30`,
          mb: 3,
        }}
      >
        <Icon sx={{ color: step.color, fontSize: 26 }} />
      </Box>

      <Typography
        sx={{
          fontFamily: C.display,
          fontSize: "0.65rem",
          color: step.color,
          letterSpacing: "0.15em",
          mb: 0.5,
          opacity: 0.7,
        }}
      >
        {step.num}
      </Typography>

      <Typography
        sx={{
          fontFamily: C.display,
          fontSize: "1.4rem",
          color: C.textPrimary,
          mb: 1.5,
          lineHeight: 1.2,
        }}
      >
        {step.title}
      </Typography>

      <Typography
        sx={{
          fontFamily: C.body,
          color: C.textSecondary,
          fontSize: "0.9rem",
          lineHeight: 1.75,
        }}
      >
        {step.desc}
      </Typography>
    </Box>
  );
}

function ShowcaseItem({
  section,
  index,
}: {
  section: (typeof SHOWCASE)[number];
  index: number;
}) {
  const { ref, visible } = useInView(0.08);
  const imageLeft = index % 2 === 0;

  return (
    <Box
      ref={ref}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: {
          xs: "column",
          md: imageLeft ? "row" : "row-reverse",
        },
        alignItems: "center",
        gap: { xs: 5, md: 9 },
        mb: { xs: 12, md: 16 },
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(48px)",
        transition: "opacity 0.75s ease 0.2s, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      {/* Aurora blob — large, behind the phone */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 280, md: 520 },
          height: { xs: 280, md: 520 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${section.accent}30 0%, transparent 68%)`,
          filter: "blur(72px)",
          top: "50%",
          [imageLeft ? "left" : "right"]: { xs: "-8%", md: "-4%" },
          transform: "translateY(-50%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.6s ease 0.5s",
          pointerEvents: "none",
          zIndex: 0,
          "@media (prefers-reduced-motion: no-preference)": {
            animation: "auroraDrift1 13s ease-in-out infinite",
          },
          "@keyframes auroraDrift1": {
            "0%, 100%": { transform: "translateY(-50%) scale(1)" },
            "35%": { transform: "translateY(-54%) translateX(22px) scale(1.08)" },
            "70%": { transform: "translateY(-46%) translateX(-14px) scale(0.94)" },
          },
        }}
      />

      {/* Aurora blob — smaller, opposite corner */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 160, md: 280 },
          height: { xs: 160, md: 280 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${section.accent}20 0%, transparent 70%)`,
          filter: "blur(54px)",
          bottom: { xs: "-10%", md: "-18%" },
          [imageLeft ? "right" : "left"]: { xs: "5%", md: "18%" },
          opacity: visible ? 0.8 : 0,
          transition: "opacity 2s ease 0.9s",
          pointerEvents: "none",
          zIndex: 0,
          "@media (prefers-reduced-motion: no-preference)": {
            animation: "auroraDrift2 17s ease-in-out infinite reverse",
          },
          "@keyframes auroraDrift2": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "50%": { transform: "translate(-28px, -22px) scale(1.13)" },
          },
        }}
      />

      {/* Aurora blob — small accent top corner */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: 100, md: 180 },
          height: { xs: 100, md: 180 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${section.accent}15 0%, transparent 70%)`,
          filter: "blur(40px)",
          top: { xs: "-5%", md: "-12%" },
          [imageLeft ? "right" : "left"]: { xs: "10%", md: "35%" },
          opacity: visible ? 0.6 : 0,
          transition: "opacity 2.2s ease 1.2s",
          pointerEvents: "none",
          zIndex: 0,
          "@media (prefers-reduced-motion: no-preference)": {
            animation: "auroraDrift3 9s ease-in-out infinite",
          },
          "@keyframes auroraDrift3": {
            "0%, 100%": { transform: "translate(0, 0)" },
            "50%": { transform: "translate(16px, 26px)" },
          },
        }}
      />

      {/* Mesh dot grid */}
      <Box
        sx={{
          position: "absolute",
          inset: "-10%",
          backgroundImage: `radial-gradient(circle, ${section.accent}55 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          opacity: visible ? 0.09 : 0,
          transition: "opacity 2.4s ease 1s",
          pointerEvents: "none",
          zIndex: 0,
          maskImage:
            "radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 75% at 50% 50%, black 30%, transparent 100%)",
          "@media (prefers-reduced-motion: no-preference)": {
            animation: "meshDrift 24s linear infinite",
          },
          "@keyframes meshDrift": {
            "0%": { backgroundPosition: "0 0" },
            "100%": { backgroundPosition: "30px 30px" },
          },
        }}
      />

      {/* Phone */}
      <Box
        sx={{
          flex: "0 0 auto",
          display: "flex",
          justifyContent: "center",
          width: { xs: "70%", sm: 240, md: 280 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <PhoneFrame section={section} visible={visible} />
      </Box>

      {/* Text */}
      <Box
        sx={{
          flex: 1,
          textAlign: { xs: "center", md: imageLeft ? "left" : "right" },
          position: "relative",
          zIndex: 1,
        }}
      >
        <EyebrowLabel color={section.accent}>{section.label}</EyebrowLabel>
        <Typography
          sx={{
            fontFamily: C.display,
            fontSize: { xs: "2rem", md: "2.6rem" },
            color: C.textPrimary,
            lineHeight: 1.15,
            mb: 2.5,
          }}
        >
          {section.title}
        </Typography>
        <Typography
          sx={{
            fontFamily: C.body,
            color: C.textSecondary,
            fontSize: { xs: "1rem", md: "1.05rem" },
            lineHeight: 1.85,
            maxWidth: 400,
            mx: { xs: "auto", md: 0 },
            ml: { xs: "auto", md: imageLeft ? 0 : "auto" },
          }}
        >
          {section.desc}
        </Typography>
      </Box>
    </Box>
  );
}

function ReviewCard({ review }: { review: (typeof REVIEWS)[number] }) {
  const { ref, visible } = useInView(0.1);

  return (
    <Box
      ref={ref}
      sx={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "20px",
        p: 3.5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.6s ease 0.2s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        "&:hover": {
          borderColor: "rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.05)",
          transition: "border-color 0.2s, background 0.2s",
        },
      }}
    >
      {/* Stars */}
      <Stack direction="row" spacing={0.3}>
        {[...Array(5)].map((_, i) => (
          <Box key={i} sx={{ color: C.gold, fontSize: 14 }}>★</Box>
        ))}
      </Stack>

      {/* Title */}
      <Typography
        sx={{
          fontFamily: C.body,
          fontWeight: 700,
          fontSize: "0.95rem",
          color: C.textPrimary,
        }}
      >
        "{review.title}"
      </Typography>

      {/* Body */}
      <Typography
        sx={{
          fontFamily: C.body,
          fontSize: "0.875rem",
          color: C.textSecondary,
          lineHeight: 1.8,
          flex: 1,
        }}
      >
        {review.text}
      </Typography>

      {/* Author */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: `${review.color}22`,
            border: `1.5px solid ${review.color}50`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: C.body,
              fontSize: "0.65rem",
              fontWeight: 700,
              color: review.color,
            }}
          >
            {review.initials}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: C.body,
              fontWeight: 600,
              fontSize: "0.82rem",
              color: C.textPrimary,
            }}
          >
            {review.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: C.body,
              fontSize: "0.72rem",
              color: C.textMuted,
            }}
          >
            {review.date} · App Store
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
