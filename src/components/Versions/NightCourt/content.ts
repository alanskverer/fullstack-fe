import type { ShowcaseItem } from "../shared/content";

/* Copy mirrors the live landing page (`LandingPage.tsx`) word for word. */

export const HERO_SYSTEM_ITEMS = ["System / BUL", "Mode / Live predictions", "Access / Free membership"];

export const STATS = [
  { value: "4.8 ★", label: "App Store Rating" },
  { value: "100%", label: "Free — No purchases" },
];

export const STEPS = [
  {
    num: "01",
    title: "Predict",
    desc: "Pick any live NBA or NCAA game and call the final score. Takes under 10 seconds.",
  },
  {
    num: "02",
    title: "Compete",
    desc: "Watch your ranking shift in real-time as the game unfolds. Every basket counts.",
  },
  {
    num: "03",
    title: "Dominate",
    desc: "Earn virtual coins, unlock exclusive avatars, and cement your place at the top.",
  },
];

export type Act = ShowcaseItem & { accent: "rose" | "violet"; featured?: boolean };

export const SHOWCASE: Act[] = [
  {
    label: "Game selection",
    title: "Choose your game",
    desc: "Browse tonight's NBA and NCAA matchups. Every detail at a glance — tip-off times, team records. Tap any game to jump in instantly.",
    media: { type: "image", src: "/images/showcase/pick-your-game.jpeg" },
    accent: "rose",
  },
  {
    label: "Place Prediction",
    title: "Make Your Call",
    desc: "Predict the final score — home and away. Lock it in with virtual coins before tip-off and feel the rush when the game goes live.",
    media: { type: "video", src: "/videos/showcase/place_bet_video_2.mp4" },
    accent: "rose",
  },
  {
    label: "Live Leaderboard",
    title: "Live Leaderboard",
    desc: "Watch your rank change with every basket. You're not just watching the game anymore. You're competing in it.",
    media: { type: "video", src: "/videos/showcase/live_leaderboard.mp4" },
    accent: "violet",
    featured: true,
  },
  {
    label: "Live Tracking",
    title: "Live the Moment",
    desc: "Every prediction tracked in one place. See upcoming games, live scores, and completed results. Real-time, always.",
    media: { type: "video", src: "/videos/showcase/cutted_video-compressed.mp4" },
    accent: "violet",
  },
  {
    label: "All-Time Leaderboard",
    title: "Hall of Fame",
    desc: "See who's dominating across all players. Climb the all-time rankings and prove you're the sharpest sports mind out there.",
    media: { type: "video", src: "/videos/showcase/all_time_leader.mp4" },
    accent: "rose",
  },
  {
    label: "Avatar Studio",
    title: "Own Your Look",
    desc: "Unlock exclusive avatars as you level up. Every rank earned shows in your style — stand out in every leaderboard.",
    media: { type: "video", src: "/videos/showcase/avatar_world.mp4" },
    accent: "violet",
  },
];

export const REVIEWS = [
  {
    name: "Alex M.",
    initials: "AM",
    accent: "violet",
    date: "Mar 2026",
    title: "Best sports app I've used",
    text: "The real-time predictions are insane. I was skeptical at first but now I check it before every NBA game. The leaderboard keeps me hooked every single night.",
  },
  {
    name: "Jordan K.",
    initials: "JK",
    accent: "rose",
    date: "Feb 2026",
    title: "Super addicting, zero risk",
    text: "Love that it's 100% free with virtual coins. No pay-to-win nonsense. The live updates are smooth and the overall UI feels genuinely premium.",
  },
  {
    name: "Sam R.",
    initials: "SR",
    accent: "teal",
    date: "Mar 2026",
    title: "NCAA season just got better",
    text: "Finally an app that makes NCAA games exciting to follow. The avatar customization is a great touch and my whole friend group is on it now.",
  },
];

export const FAQS = [
  {
    q: "What is BUL?",
    a: "BUL is a live sports gaming platform where users engage with NBA and NCAA events in real-time. The app provides an entertaining way to follow games and compete with other users through virtual coins and leaderboards.",
  },
  {
    q: "Can users buy anything with real money?",
    a: "No. BUL does not offer any in-app purchases. Users cannot buy coins, items, or any other content with real money. All features are completely free and accessible to everyone.",
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
    a: "Reach our support team at support@bulinteractive.com. We typically respond within 24–48 hours during business days.",
  },
];

export const FOOTER_LINKS = [
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms & Conditions", path: "/terms" },
  { label: "Q&A", path: "/qa" },
];
