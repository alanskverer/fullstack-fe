import { useEffect, useRef } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const C = {
  bg: "#070B12",
  bgSection: "#0A0E1A",
  border: "rgba(255, 255, 255, 0.08)",
  purple: "#7C5CFC",
  rose: "#FF3055",
  roseGlow: "rgba(255, 48, 85, 0.25)",
  textPrimary: "#EEF2FF",
  textSecondary: "#8892A4",
  display: '"Russo One", "Roboto", sans-serif',
  body: '"Chakra Petch", "Roboto", sans-serif',
};

const alphaHex = (opacity: number) =>
  Math.round(Math.min(1, Math.max(0, opacity)) * 255)
    .toString(16)
    .padStart(2, "0");

const SECTION = {
  label: "Place Prediction",
  title: "Make Your Call",
  desc: "Predict the final score — home and away. Lock it in with virtual coins before tip-off and feel the rush when the game goes live.",
  media: { type: "video" as const, src: "/videos/showcase/place_bet_video_2.mp4" },
  accent: C.rose,
};

type VariantId = "subtle" | "gradient-band" | "featured-badge" | "border-spotlight" | "maximum-drama";

const VARIANTS: {
  id: VariantId;
  name: string;
  tagline: string;
}[] = [
  {
    id: "subtle",
    name: "1 · Subtle Boost",
    tagline: "Larger phone + stronger glow only. Minimal change.",
  },
  {
    id: "gradient-band",
    name: "2 · Gradient Band",
    tagline: "Full-width soft background band behind the row.",
  },
  {
    id: "featured-badge",
    name: "3 · Featured Badge",
    tagline: "Featured pill + bigger title. Clean and intentional.",
  },
  {
    id: "border-spotlight",
    name: "4 · Border Spotlight",
    tagline: "Gradient-bordered panel wrapping the whole row.",
  },
  {
    id: "maximum-drama",
    name: "5 · Maximum Drama",
    tagline: "Everything combined — band, badge, border, scale, animation.",
  },
];

const EyebrowLabel = ({ children, color = C.purple }: { children: React.ReactNode; color?: string }) => (
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

const PhoneFrame = ({
  scale = 1,
  glowStrength = 0.3,
}: {
  scale?: number;
  glowStrength?: number;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const baseWidth = { xs: "65vw", sm: 230, md: 270 };

  return (
    <Box sx={{ position: "relative", mx: "auto", transform: `scale(${scale})`, transformOrigin: "center center" }}>
      <Box
        sx={{
          position: "absolute",
          inset: "-30%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${SECTION.accent}${alphaHex(glowStrength)} 0%, transparent 70%)`,
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "relative",
          width: baseWidth,
          maxWidth: 270 * scale,
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
        <Box
          ref={videoRef}
          component="video"
          loop
          muted
          playsInline
          autoPlay
          src={SECTION.media.src}
          sx={{ width: "100%", display: "block" }}
        />
      </Box>
    </Box>
  );
};

const FeaturedPill = () => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 1,
      border: `1px solid ${SECTION.accent}55`,
      borderRadius: "99px",
      px: 2,
      py: 0.5,
      mb: 2,
      background: `${SECTION.accent}14`,
    }}
  >
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: SECTION.accent,
        boxShadow: `0 0 10px ${SECTION.accent}`,
      }}
    />
    <Typography
      sx={{
        fontFamily: C.body,
        fontSize: "0.65rem",
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: SECTION.accent,
      }}
    >
      Featured
    </Typography>
  </Box>
);

function VariantRow({
  variant,
  titleScale = 1,
  phoneScale = 1,
  glowStrength = 0.3,
  showFeaturedBadge = false,
  showBorderPanel = false,
  showGradientBand = false,
  showAnimatedBorder = false,
}: {
  variant: VariantId;
  titleScale?: number;
  phoneScale?: number;
  glowStrength?: number;
  showFeaturedBadge?: boolean;
  showBorderPanel?: boolean;
  showGradientBand?: boolean;
  showAnimatedBorder?: boolean;
}) {
  const phoneOnLeft = false;

  const row = (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: { xs: "column", md: phoneOnLeft ? "row" : "row-reverse" },
        alignItems: "center",
        gap: { xs: 5, md: 9 },
        px: showBorderPanel ? { xs: 2.5, md: 5 } : 0,
        py: showBorderPanel ? { xs: 4, md: 6 } : 0,
        borderRadius: showBorderPanel ? "28px" : 0,
        border: showBorderPanel
          ? showAnimatedBorder
            ? `1px solid ${SECTION.accent}55`
            : `1px solid ${SECTION.accent}35`
          : "none",
        background: showBorderPanel
          ? `radial-gradient(ellipse 90% 70% at 50% 0%, ${SECTION.accent}18 0%, transparent 65%), rgba(255,255,255,0.02)`
          : "transparent",
        ...(showAnimatedBorder && {
          "@media (prefers-reduced-motion: no-preference)": {
            animation: "featuredPulse 3s ease-in-out infinite",
          },
          "@keyframes featuredPulse": {
            "0%, 100%": {
              boxShadow: `0 0 0 0 ${SECTION.accent}00, 0 24px 80px ${SECTION.accent}18`,
            },
            "50%": {
              boxShadow: `0 0 0 1px ${SECTION.accent}44, 0 32px 100px ${SECTION.accent}30`,
            },
          },
        }),
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: { xs: 280, md: 520 },
          height: { xs: 280, md: 520 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${SECTION.accent}${alphaHex(glowStrength * 0.8)} 0%, transparent 68%)`,
          filter: "blur(72px)",
          top: "50%",
          [phoneOnLeft ? "left" : "right"]: { xs: "-8%", md: "-4%" },
          transform: "translateY(-50%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

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
        <PhoneFrame scale={phoneScale} glowStrength={glowStrength} />
      </Box>

      <Box
        sx={{
          flex: 1,
          textAlign: { xs: "center", md: phoneOnLeft ? "left" : "right" },
          position: "relative",
          zIndex: 1,
        }}
      >
        {showFeaturedBadge && <FeaturedPill />}
        <EyebrowLabel color={SECTION.accent}>{SECTION.label}</EyebrowLabel>
        <Typography
          sx={{
            fontFamily: C.display,
            fontSize: {
              xs: `${2 * titleScale}rem`,
              md: `${2.6 * titleScale}rem`,
            },
            color: C.textPrimary,
            lineHeight: 1.15,
            mb: 2.5,
          }}
        >
          {SECTION.title}
        </Typography>
        <Typography
          sx={{
            fontFamily: C.body,
            color: C.textSecondary,
            fontSize: { xs: "1rem", md: "1.05rem" },
            lineHeight: 1.85,
            maxWidth: 400,
            mx: { xs: "auto", md: 0 },
            ml: { xs: "auto", md: phoneOnLeft ? 0 : "auto" },
          }}
        >
          {SECTION.desc}
        </Typography>
      </Box>
    </Box>
  );

  if (showGradientBand) {
    return (
      <Box
        data-variant={variant}
        sx={{
          position: "relative",
          mx: { xs: -2, md: -4 },
          px: { xs: 2, md: 4 },
          py: { xs: 6, md: 8 },
          background: `
            radial-gradient(ellipse 120% 80% at 50% 50%, ${SECTION.accent}14 0%, transparent 70%),
            linear-gradient(180deg, ${C.bgSection} 0%, rgba(255,48,85,0.04) 50%, ${C.bgSection} 100%)
          `,
          borderTop: `1px solid ${SECTION.accent}22`,
          borderBottom: `1px solid ${SECTION.accent}22`,
        }}
      >
        {row}
      </Box>
    );
  }

  return (
    <Box data-variant={variant} sx={{ py: { xs: 4, md: 6 } }}>
      {row}
    </Box>
  );
}

function getVariantProps(id: VariantId) {
  switch (id) {
    case "subtle":
      return {
        phoneScale: 1.15,
        glowStrength: 0.5,
        titleScale: 1,
      };
    case "gradient-band":
      return {
        phoneScale: 1.1,
        glowStrength: 0.45,
        titleScale: 1.05,
        showGradientBand: true,
      };
    case "featured-badge":
      return {
        phoneScale: 1.12,
        glowStrength: 0.45,
        titleScale: 1.12,
        showFeaturedBadge: true,
      };
    case "border-spotlight":
      return {
        phoneScale: 1.18,
        glowStrength: 0.55,
        titleScale: 1.08,
        showBorderPanel: true,
      };
    case "maximum-drama":
      return {
        phoneScale: 1.22,
        glowStrength: 0.65,
        titleScale: 1.15,
        showFeaturedBadge: true,
        showBorderPanel: true,
        showGradientBand: true,
        showAnimatedBorder: true,
      };
  }
}

export const FeaturedSectionVariants = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: C.bg,
        color: C.textPrimary,
        pb: 8,
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(7, 11, 18, 0.92)",
          backdropFilter: "blur(14px)",
          borderBottom: `1px solid ${C.border}`,
          py: 2,
          px: 3,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: C.display,
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                  mb: 0.5,
                }}
              >
                FEATURED SECTION — PICK A STYLE
              </Typography>
              <Typography sx={{ fontFamily: C.body, color: C.textSecondary, fontSize: "0.85rem" }}>
                5 variants · same content · phone right, text left
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/"
              sx={{
                color: C.textPrimary,
                border: `1px solid ${C.border}`,
                borderRadius: "10px",
                px: 2.5,
                py: 0.8,
                textTransform: "none",
                fontFamily: C.body,
                fontSize: "0.85rem",
                "&:hover": { borderColor: C.purple, background: "rgba(124,92,252,0.08)" },
              }}
            >
              ← Back to Landing
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 6 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <EyebrowLabel>Preview Page</EyebrowLabel>
          <Typography
            sx={{
              fontFamily: C.display,
              fontSize: { xs: "1.6rem", md: "2.2rem" },
              mb: 2,
            }}
          >
            CHOOSE YOUR EMPHASIS
          </Typography>
          <Typography
            sx={{
              fontFamily: C.body,
              color: C.textSecondary,
              maxWidth: 560,
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            Each block uses duplicated &quot;Make Your Call&quot; content and keeps the
            left/right layout. Scroll through and tell me which number you prefer.
          </Typography>
        </Box>

        <Stack spacing={{ xs: 10, md: 14 }}>
          {VARIANTS.map((variant) => (
            <Box key={variant.id} id={variant.id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 4,
                  pb: 2,
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    background: `${SECTION.accent}22`,
                    border: `1px solid ${SECTION.accent}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: C.display,
                    fontSize: "1rem",
                    color: SECTION.accent,
                    flexShrink: 0,
                  }}
                >
                  {variant.name.charAt(0)}
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: C.display, fontSize: "1.1rem", mb: 0.3 }}>
                    {variant.name}
                  </Typography>
                  <Typography sx={{ fontFamily: C.body, color: C.textSecondary, fontSize: "0.88rem" }}>
                    {variant.tagline}
                  </Typography>
                </Box>
              </Box>

              <VariantRow variant={variant.id} {...getVariantProps(variant.id)} />
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};
