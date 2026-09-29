export const APP_STORE_URL = "https://apps.apple.com/us/app/bettim/id6755429397";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=the.amazing.bettim&hl=en";
export const SUPPORT_EMAIL = "support@bulinteractive.com";
export const INSTAGRAM_URL = "https://www.instagram.com/bettim.co?igsh=d3lsNmJxMjJrZHE2";

export const STEPS = [
  {
    num: "01",
    title: "Predict",
    desc: "Pick any live NBA or NCAA game and call the final score. Takes under 10 seconds.",
  },
  {
    num: "02",
    title: "Compete",
    desc: "Watch your ranking shift in real time as the game unfolds. Every basket counts.",
  },
  {
    num: "03",
    title: "Dominate",
    desc: "Earn virtual coins, unlock exclusive avatars, and cement your place at the top.",
  },
] as const;

export type ShowcaseItem = {
  label: string;
  title: string;
  desc: string;
  media: { type: "image" | "video"; src: string };
};

export const SHOWCASE: ShowcaseItem[] = [
  {
    label: "Game selection",
    title: "Choose your game",
    desc: "Tonight's NBA and NCAA matchups, tip-off times and team records at a glance. Tap any game to jump in.",
    media: { type: "image", src: "/images/showcase/pick-your-game.jpeg" },
  },
  {
    label: "Place prediction",
    title: "Make your call",
    desc: "Predict the final score, home and away. Lock it in with virtual coins before tip-off.",
    media: { type: "video", src: "/videos/showcase/place_bet_video_2.mp4" },
  },
  {
    label: "Live leaderboard",
    title: "Every basket moves you",
    desc: "Your rank changes with every possession. You're not watching the game anymore — you're in it.",
    media: { type: "video", src: "/videos/showcase/live_leaderboard.mp4" },
  },
  {
    label: "Live tracking",
    title: "Live the moment",
    desc: "Upcoming games, live scores and completed results. Every prediction tracked in one place.",
    media: { type: "video", src: "/videos/showcase/cutted_video-compressed.mp4" },
  },
  {
    label: "All-time leaderboard",
    title: "Hall of fame",
    desc: "Climb the all-time rankings and prove you're the sharpest sports mind out there.",
    media: { type: "video", src: "/videos/showcase/all_time_leader.mp4" },
  },
  {
    label: "Avatar studio",
    title: "Own your look",
    desc: "Unlock exclusive avatars as you level up. Every rank earned shows in your style.",
    media: { type: "video", src: "/videos/showcase/avatar_world.mp4" },
  },
];

export const REVIEWS = [
  {
    name: "Alex M.",
    date: "Mar 2026",
    title: "Best sports app I've used",
    text: "The real-time predictions are insane. I check it before every NBA game. The leaderboard keeps me hooked every night.",
  },
  {
    name: "Jordan K.",
    date: "Feb 2026",
    title: "Super addicting, zero risk",
    text: "100% free with virtual coins. No pay-to-win nonsense. Live updates are smooth and the UI feels genuinely premium.",
  },
  {
    name: "Sam R.",
    date: "Mar 2026",
    title: "NCAA season just got better",
    text: "Finally an app that makes NCAA games exciting to follow. My whole friend group is on it now.",
  },
] as const;

export const FAQS = [
  {
    q: "What is BUL?",
    a: "BUL is a live sports gaming platform where you call NBA and NCAA scores in real time and compete with other fans through virtual coins and leaderboards.",
  },
  {
    q: "Can I buy anything with real money?",
    a: "No. BUL has no in-app purchases. Coins, items and content can't be bought with real money — everything is free.",
  },
  {
    q: "How do I get coins?",
    a: "You receive free coins on signup and earn more by playing and hitting milestones. Daily bonuses refresh every 24 hours.",
  },
  {
    q: "How can I contact support?",
    a: `Email ${SUPPORT_EMAIL}. We typically respond within 24–48 hours on business days.`,
  },
] as const;

export const LEGAL_LINKS = [
  { label: "Privacy", path: "/privacy" },
  { label: "Terms", path: "/terms" },
  { label: "Q&A", path: "/qa" },
] as const;
