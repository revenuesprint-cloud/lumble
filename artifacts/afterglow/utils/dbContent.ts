// DB-backed content fetcher with AsyncStorage cache.
// Falls back gracefully to local data when offline.
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

const CACHE_KEY_DAILY   = "@lumble_content_daily";
const CACHE_KEY_JOURNEY = "@lumble_journey";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

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
