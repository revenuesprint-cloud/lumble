// ─── Lumble Daily Engagement Engine ──────────────────────────────────────────
// Everything here is deterministic: same couple + same calendar day → same result.
// Drives the daily-return loop: streak, couple timeline, daily prediction,
// today's ritual, and the question of the day. Fully offline.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AstrologyReading, RASHIS } from "./astrology";
import { RelationshipType } from "@/context/AppContext";

// ─── Deterministic helpers ────────────────────────────────────────────────────

function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: string): T {
  return arr[hash(seed) % arr.length];
}

/** Local calendar day key — same all day, rolls over at midnight. */
export function todayStamp(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseStamp(stamp: string): Date {
  return new Date(stamp.slice(0, 10) + "T00:00:00");
}

function daysBetween(a: Date, b: Date): number {
  const MS = 86400000;
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((db - da) / MS);
}

// A stable per-couple signature so two different couples get different content.
function coupleSeed(reading: AstrologyReading): string {
  return `${reading.user.nakshatra}-${reading.partner.nakshatra}-${reading.user.moonRashi}-${reading.partner.moonRashi}`;
}

// ─── 1. Streak (consecutive days opened) ──────────────────────────────────────

const STREAK_KEY = "@lumble_streak";

export interface StreakState {
  current: number;   // consecutive days including today
  longest: number;   // best run ever
  lastOpen: string;  // last day stamp recorded
  isNewDay: boolean; // true the first time it's recorded on a fresh day
}

/**
 * Call once when the daily hub mounts. Advances the streak if it's a new day,
 * resets it if a day was missed, and persists. Returns the updated state.
 */
export async function recordDailyOpen(): Promise<StreakState> {
  const today = todayStamp();
  let prev: Omit<StreakState, "isNewDay"> | null = null;
  try {
    const raw = await AsyncStorage.getItem(STREAK_KEY);
    if (raw) prev = JSON.parse(raw);
  } catch {}

  if (!prev) {
    const fresh = { current: 1, longest: 1, lastOpen: today };
    await persistStreak(fresh);
    return { ...fresh, isNewDay: true };
  }

  if (prev.lastOpen === today) {
    return { ...prev, isNewDay: false };
  }

  const gap = daysBetween(parseStamp(prev.lastOpen), parseStamp(today));
  const current = gap === 1 ? prev.current + 1 : 1; // missed a day → reset to 1
  const longest = Math.max(prev.longest, current);
  const next = { current, longest, lastOpen: today };
  await persistStreak(next);
  return { ...next, isNewDay: true };
}

async function persistStreak(s: Omit<StreakState, "isNewDay">) {
  try { await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(s)); } catch {}
}

export function streakLine(current: number): string {
  if (current <= 1) return "Day one. Come back tomorrow to keep the flame lit.";
  if (current < 7)  return `${current} days in a row. The habit is forming.`;
  if (current < 30) return `${current} days straight. You're genuinely consistent now.`;
  return `${current} days unbroken. This is devotion, not a streak.`;
}

// ─── 2. Couple timeline ("Together for X days") ───────────────────────────────

const SINCE_KEY = "@lumble_together_since";

export async function getStartDate(): Promise<string | null> {
  try { return await AsyncStorage.getItem(SINCE_KEY); } catch { return null; }
}

export async function setStartDate(stamp: string): Promise<void> {
  try { await AsyncStorage.setItem(SINCE_KEY, stamp); } catch {}
}

export interface Milestone { target: number; label: string; }

// Fixed early milestones, then every 100 up to 1000, then yearly after.
function milestoneList(_daysTogether: number): Milestone[] {
  const list: Milestone[] = [
    { target: 50,   label: "50 days" },
    { target: 100,  label: "100 days" },
    { target: 200,  label: "200 days" },
    { target: 300,  label: "300 days" },
    { target: 365,  label: "1 year" },
    { target: 500,  label: "500 days" },
    { target: 730,  label: "2 years" },
    { target: 1000, label: "1000 days" },
  ];
  // Extend with future anniversaries so it never runs out.
  for (let y = 3; y <= 50; y++) list.push({ target: 365 * y, label: `${y} years` });
  // De-dupe + sort
  return list.filter((m, i, a) => a.findIndex((x) => x.target === m.target) === i)
             .sort((a, b) => a.target - b.target);
}

export interface TimelineInfo {
  days: number;
  startLabel: string;       // "March 12, 2024"
  next: Milestone | null;   // upcoming milestone
  prevTarget: number;       // milestone just passed (or 0)
  daysToNext: number;
  pctToNext: number;        // 0..1 progress within current milestone band
  monthsLine: string;       // "1 year, 2 months"
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export function getTimelineInfo(startStamp: string): TimelineInfo {
  const start = parseStamp(startStamp);
  const today = new Date();
  const days  = Math.max(0, daysBetween(start, today));

  const list = milestoneList(days);
  const next = list.find((m) => m.target > days) ?? null;
  const passed = [...list].reverse().find((m) => m.target <= days);
  const prevTarget = passed?.target ?? 0;

  const daysToNext = next ? next.target - days : 0;
  const span = next ? next.target - prevTarget : 1;
  const pctToNext = next ? Math.max(0, Math.min(1, (days - prevTarget) / span)) : 1;

  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const monthsLine = years > 0
    ? `${years} ${years === 1 ? "year" : "years"}${months > 0 ? `, ${months} ${months === 1 ? "month" : "months"}` : ""}`
    : months > 0
    ? `${months} ${months === 1 ? "month" : "months"}`
    : `${days} ${days === 1 ? "day" : "days"}`;

  const startLabel = `${MONTH_NAMES[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()}`;

  return { days, startLabel, next, prevTarget, daysToNext, pctToNext, monthsLine };
}

// ─── 3. Daily prediction (couple love forecast) ───────────────────────────────

export interface DailyPrediction {
  score: number;        // 0..100 love-weather score for today
  band: "glowing" | "warm" | "steady" | "tender";
  headline: string;
  forecast: string;
  leanInto: string;     // do this today
  watchFor: string;     // gently avoid
  bestWindow: string;   // "Evening"
  windowWhy: string;
  date: string;         // "Wednesday, June 11"
}

const WINDOWS: { name: string; why: string }[] = [
  { name: "Early morning", why: "Before the noise of the day, words land softer and truer." },
  { name: "Midday",        why: "Energy peaks now — a quick check-in carries more warmth than you'd expect." },
  { name: "Late afternoon",why: "The day exhales here. A small gesture lands without effort." },
  { name: "Evening",       why: "Defenses are down by evening. This is when the real conversation wants to happen." },
  { name: "Late night",    why: "The quiet hours pull honesty up. Say the thing you've been holding." },
];

function bandFor(score: number): DailyPrediction["band"] {
  if (score >= 85) return "glowing";
  if (score >= 72) return "warm";
  if (score >= 60) return "steady";
  return "tender";
}

const HEADLINES: Record<DailyPrediction["band"], string[]> = {
  glowing: [
    "The energy between you is wide open today",
    "Today rewards closeness — lean all the way in",
    "A rare green-light day for the two of you",
  ],
  warm: [
    "Warmth is flowing your way today",
    "An easy, affectionate kind of day",
    "The connection feels light and willing today",
  ],
  steady: [
    "A grounded, dependable day between you",
    "Nothing dramatic — just quiet steadiness",
    "The day favours small, consistent effort",
  ],
  tender: [
    "Handle today with a softer touch",
    "A day that asks for patience, not pressure",
    "Go gently — the wiring is sensitive today",
  ],
};

const FORECASTS: Record<RelationshipType, Record<DailyPrediction["band"], string[]>> = {
  relationship: {
    glowing: [
      "Your charts are unusually in sync today. The thing you've been meaning to say will land better than it would on any ordinary day. Don't waste the opening.",
      "There's a natural pull toward each other right now. Plans made today tend to stick. So do confessions of the good kind.",
    ],
    warm: [
      "Today leans affectionate. A small, unprompted gesture from you will be remembered far longer than it takes to give.",
      "The day is on your side for reconnecting. If things have felt routine lately, this is a soft window to break the pattern.",
    ],
    steady: [
      "No fireworks today, and that's fine. This is a day for the unglamorous glue — showing up, following through, being reliable.",
      "The energy is calm and even. Use it to handle one practical thing together instead of chasing a big moment.",
    ],
    tender: [
      "Patience is the whole assignment today. One of you is running more sensitive than usual, so choose the gentle version of whatever you need to say.",
      "Friction is more likely today, but it's surface-level. Don't read too much into a short fuse — give it space and it passes.",
    ],
  },
  situationship: {
    glowing: [
      "Today the ambiguity feels less scary than usual — for both of you. If there was ever a day to name what this is, the stars cleared the runway.",
      "There's real momentum in the air. The honest question you keep swallowing will land far more gracefully today than you fear.",
    ],
    warm: [
      "The connection feels willing today. You don't have to define everything at once — but one honest sentence moves things forward.",
      "A light, low-pressure day. Reach out without an agenda and let the warmth do the work.",
    ],
    steady: [
      "Don't push for answers today. Steady presence reads as confidence, and confidence is exactly what this dynamic responds to.",
      "A neutral day. Match their energy instead of leading it, and notice what they do when you stop chasing.",
    ],
    tender: [
      "Today is not the day for the big talk. The wiring is sensitive on both ends, and pressure now will read as anxiety, not interest.",
      "Pull back gently today. Space, used well, tells you more about where you stand than any conversation would.",
    ],
  },
  crush: {
    glowing: [
      "Your nerve is higher than usual today, and so is their receptiveness. The message you've been drafting in your head — send it.",
      "The day favours the bold. A small move now travels much further than it would on a quieter day.",
    ],
    warm: [
      "An approachable, friendly kind of day. You don't need a grand gesture — just one warm, real interaction.",
      "The energy is light. Show up where they are and let your presence, not a plan, do the talking.",
    ],
    steady: [
      "Play the long game today. Consistency is more magnetic than intensity, and that's where the day's energy sits.",
      "A patient day. Let them notice you rather than performing for attention — it reads better right now.",
    ],
    tender: [
      "Don't overthink a quiet response today. The energy is muted for everyone, and silence isn't rejection.",
      "Go easy on yourself today. Pushing for a reaction now will cost you more than waiting one more day.",
    ],
  },
  ex: {
    glowing: [
      "Old threads feel especially alive today. That doesn't automatically mean reach out — but it does mean the feeling is real, not random.",
      "Clarity is unusually available today. Whether you're closing the door or reopening it, you'll see the situation more honestly than usual.",
    ],
    warm: [
      "Today carries a softer kind of nostalgia. Let yourself feel it without acting on it, and notice what it's actually pointing at.",
      "A gentle day for processing. The warmth you feel is information — it doesn't have to become a text.",
    ],
    steady: [
      "A grounded day for perspective. Channel the energy into your own world rather than into the gap they left.",
      "Steady and clear today. A good day to take one more step toward reclaiming the routine that's fully yours.",
    ],
    tender: [
      "Be careful with the impulse to reach out today — the longing is loud but the reasoning is thin. Wait until evening before deciding anything.",
      "Today the missing-them feeling is sharp. Feel it fully, then let it pass without sending it anywhere.",
    ],
  },
};

const LEAN_INTO = [
  "Send one message with zero agenda behind it.",
  "Ask a question you don't already know the answer to.",
  "Say the specific thing you appreciate, out loud.",
  "Give your full attention for ten uninterrupted minutes.",
  "Make the first move instead of waiting for theirs.",
  "Bring up a good memory and let it breathe.",
  "Offer help before you're asked.",
  "Be the one who softens first.",
];

const WATCH_FOR = [
  "Assuming you know what they meant. Ask instead.",
  "Keeping score. Today rewards giving without counting.",
  "Filling a silence with worry. Let it be quiet.",
  "Pushing for an answer they're not ready to give.",
  "Reading distance as rejection — it's rarely that.",
  "Saying the careful thing when the honest thing is kinder.",
  "Checking how fast they replied. It means less than you think.",
];

export function getDailyPrediction(reading: AstrologyReading, relType: RelationshipType): DailyPrediction {
  const today = new Date();
  const dayN = today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate();
  const seed = `${coupleSeed(reading)}-${dayN}`;
  const h = hash(seed);

  // Base score nudged by overall guna health, then varied per day.
  // Floor raised so even low-guna couples see positive, engaging numbers.
  const gunaBase = Math.round((reading.guna.total / 36) * 22) + 68; // 68..90
  const variance = (h % 21) - 6;  // -6..+14 (net positive bias)
  const score = Math.max(60, Math.min(98, gunaBase + variance));
  const band = bandFor(score);

  const moonU = RASHIS[reading.user.moonRashi].en;
  const moonP = RASHIS[reading.partner.moonRashi].en;

  const window = WINDOWS[h % WINDOWS.length];
  const headline = pick(HEADLINES[band], seed + "-h");
  const forecastPool = FORECASTS[relType][band];
  let forecast = pick(forecastPool, seed + "-f");
  // Light personal touch on glowing/tender days.
  if (band === "glowing") forecast += ` Your ${moonU} moon and their ${moonP} moon are reading each other clearly right now.`;
  if (band === "tender")  forecast += ` ${moonU} and ${moonP} are slightly out of phase today — temporary, not a sign.`;

  return {
    score,
    band,
    headline,
    forecast,
    leanInto: pick(LEAN_INTO, seed + "-l"),
    watchFor: pick(WATCH_FOR, seed + "-w"),
    bestWindow: window.name,
    windowWhy: window.why,
    date: today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
  };
}

// ─── 4. Today's ritual (a small shared action) ────────────────────────────────

export interface DailyRitual { title: string; body: string; minutes: number; }

const RITUALS: DailyRitual[] = [
  { title: "The 6-second hug", body: "A hug held past six seconds releases oxytocin for both people. Most hugs end at two. Hold one longer today and feel the difference.", minutes: 1 },
  { title: "One honest compliment", body: "Tell them one specific thing you admired about how they handled something recently. Specific beats sweet, every time.", minutes: 2 },
  { title: "Phones down dinner", body: "One meal today with both phones in another room. No scrolling, no half-attention. Just the two of you and whatever comes up.", minutes: 20 },
  { title: "The good-memory text", body: "Send them one sentence about a moment with them you still think about. No reason, no ask. Just the memory.", minutes: 1 },
  { title: "Ask, then actually listen", body: "Ask how their day really went, then resist solving anything for two full minutes. Just listen. It's harder and better than it sounds.", minutes: 5 },
  { title: "The 5-song playlist", body: "Make a tiny playlist of songs that remind you of them and send it over. It says 'you live in my head' without the pressure of saying it.", minutes: 10 },
  { title: "Plan one small thing", body: "Put one small future plan on the calendar together today — even a walk this weekend. Shared anticipation is its own kind of glue.", minutes: 5 },
  { title: "The gratitude swap", body: "Each of you names one thing you were grateful for this week. Couples who do this regularly report feeling closer within days.", minutes: 5 },
  { title: "Say the quiet part", body: "Name one thing you've been feeling but haven't said — the gentle version. Unspoken things get heavier the longer they sit.", minutes: 3 },
  { title: "Recreate a first", body: "Bring back one detail from early on today — the song, the drink, the place, the joke. Nostalgia, used on purpose, reignites things.", minutes: 10 },
];

export function getDailyRitual(reading: AstrologyReading): DailyRitual {
  const seed = `${coupleSeed(reading)}-ritual-${todayStamp()}`;
  return pick(RITUALS, seed);
}

// ─── 5. Question of the day ────────────────────────────────────────────────────

const QUESTIONS: string[] = [
  "What's something I do that makes you feel most loved?",
  "When did you first know you actually liked me?",
  "What's a small thing I could do more often?",
  "What's a memory of us you'd relive exactly as it was?",
  "What do you need more of from me lately?",
  "What's something you've never told me but always wanted to?",
  "Where do you picture us a year from now?",
  "What's the bravest thing I've done since you've known me?",
  "What song instantly reminds you of me, and why?",
  "What's one thing we're better at together than apart?",
  "When do you feel closest to me?",
  "What's a fear you've never said out loud to me?",
  "What would a perfect ordinary day with me look like?",
  "What's something you're proud of me for that I don't know about?",
  "If we could redo one day together, which one and why?",
];

export function getDailyQuestion(reading: AstrologyReading): string {
  const seed = `${coupleSeed(reading)}-q-${todayStamp()}`;
  return pick(QUESTIONS, seed);
}
