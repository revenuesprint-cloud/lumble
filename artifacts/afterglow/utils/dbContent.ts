// DB-backed content fetcher with AsyncStorage cache.
// Falls back gracefully to local data when offline.
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

const CACHE_KEY_DAILY   = "@lumble_content_daily";
const CACHE_KEY_JOURNEY = "@lumble_journey";
const CACHE_KEY_BUNDLE  = "@lumble_content_bundle";
const CACHE_TTL_MS      = 6 * 60 * 60 * 1000; // 6 hours

// ─── Content Bundle ────────────────────────────────────────────────────────────
// Single fetch that powers all screens. Fetched once per session (6h TTL).
// Module-level singleton so every utility (oracle.ts, personalization.ts, etc.)
// can call getContentBundle() without prop-drilling.

export interface ContentBundle {
  oracleByIntent:      Record<string, DBContentItem[]>; // keyed by meta.intent
  heroCards:           DBContentItem[];
  rightNow:            DBContentItem[];
  dailyFocus:          DBContentItem[];
  energyMessages:      DBContentItem[];
  compatibilityTexts:  DBContentItem[];
  featureInsights:     DBContentItem[];
  // Structural content for Stars + Compatibility screens
  moonProfiles:        DBContentItem[];  // indexed by meta.moonRashiIdx (0-11)
  nakshatraProfiles:   DBContentItem[];  // indexed by meta.nakshatraIdx (0-26)
  dashaChapters:       DBContentItem[];  // keyed by meta.dashaLord
  kootaNarratives:     DBContentItem[];  // keyed by meta.kootaName
  dailyMessages:       DBContentItem[];
  fetchedAt:           number;
}

let _bundle: ContentBundle | null = null;

export function getContentBundle(): ContentBundle | null { return _bundle; }
export function setContentBundle(b: ContentBundle | null): void { _bundle = b; }

export async function fetchContentBundle(tags: string[], authToken?: string | null): Promise<ContentBundle | null> {
  // Return in-memory bundle if fresh
  if (_bundle && Date.now() - _bundle.fetchedAt < CACHE_TTL_MS) return _bundle;

  // Try AsyncStorage cache
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY_BUNDLE);
    if (cached) {
      const parsed: ContentBundle = JSON.parse(cached);
      if (Date.now() - parsed.fetchedAt < CACHE_TTL_MS) {
        _bundle = parsed;
        return parsed;
      }
    }
  } catch {}

  if (!API_URL) return null;

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 12000);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

    const res = await fetch(`${API_URL}/api/content/bundle`, {
      method: "POST",
      headers,
      // If auth token present, server resolves tags from stored profile; still send as fallback
      body: JSON.stringify({ tags }),
      signal: controller.signal,
    });
    if (!res.ok) return null;

    const data = await res.json();
    const raw = data.bundle ?? {};

    // Group oracle responses by intent (meta.intent field)
    const oracleByIntent: Record<string, DBContentItem[]> = {};
    for (const item of (raw.oracle_response ?? []) as DBContentItem[]) {
      const intent = (item.meta?.intent as string) ?? "general";
      if (!oracleByIntent[intent]) oracleByIntent[intent] = [];
      oracleByIntent[intent].push(item);
    }

    const bundle: ContentBundle = {
      oracleByIntent,
      heroCards:           raw.hero_card           ?? [],
      rightNow:            raw.right_now            ?? [],
      dailyFocus:          raw.daily_focus          ?? [],
      energyMessages:      raw.energy_message       ?? [],
      compatibilityTexts:  raw.compatibility_text   ?? [],
      featureInsights:     raw.feature_insight      ?? [],
      moonProfiles:        raw.moon_profile         ?? [],
      nakshatraProfiles:   raw.nakshatra_profile    ?? [],
      dashaChapters:       raw.dasha_chapter        ?? [],
      kootaNarratives:     raw.koota_narrative      ?? [],
      dailyMessages:       raw.daily_message        ?? [],
      fetchedAt:           Date.now(),
    };

    _bundle = bundle;
    await AsyncStorage.setItem(CACHE_KEY_BUNDLE, JSON.stringify(bundle));
    return bundle;
  } catch {
    return null;
  }
}

/** Simple template variable substitution for DB content strings. */
export function applyVars(template: string, vars: Record<string, string>): string {
  let out = template;
  for (const [k, v] of Object.entries(vars)) {
    out = out.split(`{{${k}}}`).join(v);
  }
  return out;
}

export interface DBContentItem {
  id: string;
  type: string;
  title?: string;
  body: string;
  meta: Record<string, unknown>;
  tags: string[];
  sort_order: number;
  match_score?: number;
}

export interface DailyContent {
  quote:       DBContentItem | null;
  affirmation: DBContentItem | null;
  message:     DBContentItem | null;
  fetchedAt:   number;
}

export interface JourneyEntry {
  state: "resonates" | "working_on" | "resolved";
  notes?: string;
  updatedAt: string;
  problem: {
    id: string;
    title: string;
    description: string;
    category: string;
    severity: string;
    solutions: unknown[];
  };
}

// ─── Daily content (quote + affirmation + message) ────────────────────────────

export async function fetchDailyContent(tags: string[]): Promise<DailyContent | null> {
  // Try cache first
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY_DAILY);
    if (cached) {
      const parsed: DailyContent = JSON.parse(cached);
      if (Date.now() - parsed.fetchedAt < CACHE_TTL_MS) return parsed;
    }
  } catch {}

  if (!API_URL) return null;

  try {
    const today = new Date().toISOString().slice(0, 10);
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${API_URL}/api/content/daily`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags, date: today }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    const daily: DailyContent = { ...data, fetchedAt: Date.now() };
    await AsyncStorage.setItem(CACHE_KEY_DAILY, JSON.stringify(daily));
    return daily;
  } catch {
    return null;
  }
}

// ─── Browsable questions ──────────────────────────────────────────────────────

export interface QuestionItem {
  id: string;
  title: string;
  body: string;
  meta: { question: string; shortAnswer: string; category: string; icon: string };
  tags: string[];
  match_score: number;
}

export interface QuestionsResult {
  about_them:  QuestionItem[];
  about_you:   QuestionItem[];
  what_to_do:  QuestionItem[];
  patterns:    QuestionItem[];
  big_picture: QuestionItem[];
}

const CACHE_KEY_QUESTIONS = "@lumble_questions";
const CACHE_TTL_QUESTIONS = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchQuestions(tags: string[]): Promise<QuestionsResult | null> {
  // Try cache first
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY_QUESTIONS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.fetchedAt < CACHE_TTL_QUESTIONS) {
        return parsed.data as QuestionsResult;
      }
    }
  } catch {}

  if (!API_URL) return null;

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API_URL}/api/content/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = await res.json();
    const result: QuestionsResult = {
      about_them:  data.questions?.about_them  ?? [],
      about_you:   data.questions?.about_you   ?? [],
      what_to_do:  data.questions?.what_to_do  ?? [],
      patterns:    data.questions?.patterns    ?? [],
      big_picture: data.questions?.big_picture ?? [],
    };
    await AsyncStorage.setItem(CACHE_KEY_QUESTIONS, JSON.stringify({ data: result, fetchedAt: Date.now() }));
    return result;
  } catch {
    return null;
  }
}

// ─── Batch content by type ────────────────────────────────────────────────────

export async function fetchContentBatch(
  types: string[],
  tags: string[],
  limit = 20,
): Promise<Record<string, DBContentItem[]>> {
  if (!API_URL) return {};
  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${API_URL}/api/content/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ types, tags, limit }),
      signal: controller.signal,
    });
    if (!res.ok) return {};
    const data = await res.json();
    return data.content ?? {};
  } catch {
    return {};
  }
}

// ─── Challenge state (acknowledge / working / resolved) ───────────────────────

export async function saveChallengeState(
  problemId: string,
  state: "resonates" | "working_on" | "resolved",
  token: string,
  notes?: string,
): Promise<boolean> {
  if (!API_URL || !token) {
    // Persist locally when offline
    await saveLocalState(problemId, state);
    return true;
  }
  try {
    const res = await fetch(`${API_URL}/api/content/challenges/${problemId}/state`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ state, notes }),
    });
    await saveLocalState(problemId, state);
    return res.ok;
  } catch {
    await saveLocalState(problemId, state);
    return false;
  }
}

export async function removeChallengeState(problemId: string, token: string): Promise<void> {
  await removeLocalState(problemId);
  if (!API_URL || !token) return;
  try {
    await fetch(`${API_URL}/api/content/challenges/${problemId}/state`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {}
}

// ─── Journey fetch ────────────────────────────────────────────────────────────

export async function fetchJourney(token: string): Promise<JourneyEntry[]> {
  if (!API_URL || !token) return [];
  try {
    const res = await fetch(`${API_URL}/api/content/challenges/journey`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const journey = data.journey ?? [];
    await AsyncStorage.setItem(CACHE_KEY_JOURNEY, JSON.stringify(journey));
    return journey;
  } catch {
    // Return cached journey on failure
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY_JOURNEY);
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  }
}

// ─── Local state helpers ──────────────────────────────────────────────────────

const LOCAL_STATES_KEY = "@lumble_challenge_states";

export async function getLocalStates(): Promise<Record<string, "resonates" | "working_on" | "resolved">> {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_STATES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

async function saveLocalState(problemId: string, state: string) {
  try {
    const states = await getLocalStates();
    states[problemId] = state as any;
    await AsyncStorage.setItem(LOCAL_STATES_KEY, JSON.stringify(states));
  } catch {}
}

async function removeLocalState(problemId: string) {
  try {
    const states = await getLocalStates();
    delete states[problemId];
    await AsyncStorage.setItem(LOCAL_STATES_KEY, JSON.stringify(states));
  } catch {}
}
